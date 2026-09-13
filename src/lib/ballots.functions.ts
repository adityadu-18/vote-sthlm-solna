import { createServerFn } from "@tanstack/react-start";

/**
 * Official open data from Valmyndigheten (the Swedish Election Authority):
 * every candidacy registered for the 2026 elections. Free to use with
 * attribution. Updated by the authority several times a day.
 */
const CSV_URL = "https://data.val.se/filer/val2026/parti/kandidaturer.csv";

export const SOURCE = {
  csv: CSV_URL,
  municipalPage:
    "https://data.val.se/val2026/partier/valsedlar/valtyp/KF/omrade/1/kommun/184",
  regionalPage: "https://data.val.se/val2026/partier/valsedlar/valtyp/RF/omrade/1",
  publisher: "Valmyndigheten",
};

export type Candidate = {
  order: number;
  name: string;
  age: number | null;
  occupation: string | null;
  area: string | null;
  homeMunicipality: string | null;
};

export type BallotList = {
  listNumber: string;
  partyName: string;
  partyAbbr: string;
  constituencyLabel: string;
  candidates: Candidate[];
};

export type BallotData = {
  fetchedAt: string;
  municipal: BallotList[];
  regional: BallotList[];
  error: string | null;
};

/** Solna belongs to the "Nord" constituency in the Region Stockholm election. */
const REGIONAL_CONSTITUENCY = "Nord";
const REGION_WIDE_LABELS = new Set(["Region Stockholm", "Stockholm", "Stockholms län"]);

function isRelevantRegionalList(label: string): boolean {
  const clean = label.trim();
  if (!clean) return false;
  if (REGION_WIDE_LABELS.has(clean)) return true;
  return clean.split(" och ").some((part) => part.trim() === REGIONAL_CONSTITUENCY);
}

/** "37, Ekonom, Huvudsta" -> age / occupation / area */
function parseBallotInfo(raw: string): Pick<Candidate, "age" | "occupation" | "area"> {
  const parts = raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  let age: number | null = null;
  if (parts.length && /^\d{2,3}$/.test(parts[0]!)) {
    age = Number(parts.shift());
  }
  return {
    age,
    occupation: parts.length > 1 ? parts.slice(0, -1).join(", ") : (parts[0] ?? null),
    area: parts.length > 1 ? (parts[parts.length - 1] ?? null) : null,
  };
}

type Row = string[];

function buildLists(rows: Row[]): BallotList[] {
  const byList = new Map<string, BallotList>();
  for (const r of rows) {
    const listNumber = r[9]!.trim();
    const key = listNumber;
    let list = byList.get(key);
    if (!list) {
      list = {
        listNumber,
        partyName: r[5]!.trim(),
        partyAbbr: r[6]!.trim(),
        constituencyLabel: r[10]!.trim(),
        candidates: [],
      };
      byList.set(key, list);
    }
    const info = parseBallotInfo(r[20] ?? "");
    const ageFromColumn = Number(r[17]);
    list.candidates.push({
      order: Number(r[11]) || 0,
      name: r[16]!.trim(),
      age: info.age ?? (Number.isFinite(ageFromColumn) ? ageFromColumn : null),
      occupation: info.occupation,
      area: info.area,
      homeMunicipality: r[19]?.trim() || null,
    });
  }

  for (const list of byList.values()) {
    list.candidates.sort((a, b) => a.order - b.order);
    // The same person can appear twice if the authority republished a list.
    const seen = new Set<string>();
    list.candidates = list.candidates.filter((c) => {
      const k = `${c.order}|${c.name}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }

  return [...byList.values()]
    .filter((l) => l.candidates.length > 0)
    .sort((a, b) => b.candidates.length - a.candidates.length);
}

async function scrapeCandidates(): Promise<BallotData> {
  const res = await fetch(CSV_URL, {
    headers: { Accept: "text/csv", "User-Agent": "solna-voting-dashboard" },
  });
  if (!res.ok || !res.body) {
    throw new Error(`Valmyndigheten returned ${res.status} ${res.statusText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let carry = "";
  const municipalRows: Row[] = [];
  const regionalRows: Row[] = [];

  const handle = (line: string) => {
    if (!line) return;
    // Cheap pre-filter before splitting: skip the ~175k irrelevant rows fast.
    const isKF = line.startsWith("KF;");
    const isRF = line.startsWith("RF;");
    if (!isKF && !isRF) return;
    if (isKF && !line.includes(";Solna;")) return;
    if (isRF && !line.includes(";Nord;")) return;

    const cols = line.split(";");
    if (cols.length < 23) return;
    if (cols[8]!.trim() !== "S") return; // printed ballot paper only
    if (cols[22]!.trim() !== "J") return; // valid candidacy only

    if (isKF) {
      if (cols[2]!.trim() !== "Solna") return;
      municipalRows.push(cols);
      return;
    }
    if (cols[2]!.trim() !== "Stockholm") return;
    if (cols[4]!.trim() !== REGIONAL_CONSTITUENCY) return; // one copy per list
    if (!isRelevantRegionalList(cols[10] ?? "")) return;
    regionalRows.push(cols);
  };

  let isFirstLine = true;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    carry += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = carry.indexOf("\n")) !== -1) {
      const line = carry.slice(0, idx).replace(/\r$/, "");
      carry = carry.slice(idx + 1);
      if (isFirstLine) {
        isFirstLine = false;
        continue;
      }
      handle(line);
    }
  }
  handle(carry.replace(/\r$/, ""));

  return {
    fetchedAt: new Date().toISOString(),
    municipal: buildLists(municipalRows),
    regional: buildLists(regionalRows),
    error: null,
  };
}

let cache: { data: BallotData; at: number } | null = null;
const TTL_MS = 30 * 60 * 1000;

export const getBallotData = createServerFn({ method: "GET" })
  .inputValidator((input: { refresh?: boolean } | undefined) => input ?? {})
  .handler(async ({ data }): Promise<BallotData> => {
    if (!data.refresh && cache && Date.now() - cache.at < TTL_MS) {
      return cache.data;
    }
    try {
      const fresh = await scrapeCandidates();
      cache = { data: fresh, at: Date.now() };
      return fresh;
    } catch (err) {
      console.error("Failed to load candidate data", err);
      if (cache) return { ...cache.data, error: "Showing the last data we managed to load." };
      return {
        fetchedAt: new Date().toISOString(),
        municipal: [],
        regional: [],
        error:
          err instanceof Error
            ? `Could not reach the official candidate register: ${err.message}`
            : "Could not reach the official candidate register.",
      };
    }
  });
