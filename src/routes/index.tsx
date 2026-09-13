import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AlertTriangle, ExternalLink, RefreshCw, Vote } from "lucide-react";
import { getBallotData, SOURCE, type BallotData } from "@/lib/ballots.functions";
import { BallotSection } from "@/components/ballot/BallotSection";
import { useShortlist, type Shortlist } from "@/components/ballot/useShortlist";

const ballotQuery = queryOptions({
  queryKey: ["ballots"],
  queryFn: () => getBallotData({ data: {} }),
  staleTime: 15 * 60 * 1000,
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solna & Region Stockholm Ballot Guide 2026" },
      {
        name: "description",
        content:
          "Compare parties and browse every candidate on the Solna municipal and Region Stockholm ballots, with official candidate data from Valmyndigheten.",
      },
      { property: "og:title", content: "Solna & Region Stockholm Ballot Guide 2026" },
      {
        property: "og:description",
        content:
          "Party comparison, full candidate lists and a personal shortlist for the Solna municipal and Region Stockholm elections.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(ballotQuery);
  },
  component: Dashboard,
});

const BALLOTS = {
  municipal: {
    label: "Solna Municipality",
    swedish: "Kommunfullmäktige, Solna stad",
    ballotColour: "White ballot paper",
    decides:
      "Schools and preschools, social services, elderly care, city planning, sports and culture in Solna.",
    governing: "Social Democrats · Left Party · Green Party · Centre Party",
    governingNote:
      "The Solna Coalition, led by Mayor Sara Kukka-Salam, has governed since 2022 after 24 years of Moderate rule.",
    opposition: "Moderates · Liberals · Christian Democrats · Sweden Democrats",
    source: SOURCE.municipalPage,
  },
  regional: {
    label: "Region Stockholm",
    swedish: "Regionfullmäktige, valkrets Nord",
    ballotColour: "Blue ballot paper",
    decides:
      "All hospitals and public healthcare clinics, plus public transport — SL buses, metro and commuter trains — across the county's 26 municipalities.",
    governing: "Social Democrats · Centre Party · Green Party (with Left Party support)",
    governingNote:
      "A minority coalition led by Aida Hadzialic, relying on the Left Party to reach 75 of the 149 seats.",
    opposition: "Moderates · Sweden Democrats · Christian Democrats · Liberals",
    source: SOURCE.regionalPage,
  },
} as const;

function Dashboard() {
  const { data, isLoading, isError } = useQuery(ballotQuery);
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<keyof Shortlist>("municipal");
  const [refreshing, setRefreshing] = useState(false);
  const { shortlist, setParty, setCandidate, clear } = useShortlist();

  const refresh = async () => {
    setRefreshing(true);
    try {
      const fresh = await getBallotData({ data: { refresh: true } });
      queryClient.setQueryData(ballotQuery.queryKey, fresh);
    } finally {
      setRefreshing(false);
    }
  };

  const ballot = BALLOTS[tab];
  const lists = (data as BallotData | undefined)?.[tab] ?? [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <header className="mb-10">
        <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <Vote className="h-3.5 w-3.5" aria-hidden />
          Election day · 13 September 2026 · polls open 08:00–20:00
        </p>
        <h1 className="mt-4 text-4xl leading-tight sm:text-6xl">
          Your two ballots in Solna
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          As a resident of Solna without Swedish citizenship you vote in two of the three
          elections today: the municipal council in Solna and the regional council for
          Region Stockholm. Compare the parties, read the full candidate lists, and mark
          your picks below.
        </p>
      </header>

      <section
        aria-label="Your ballot shortlist"
        className="mb-10 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl">Your ballot notes</h2>
          <button
            type="button"
            onClick={clear}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Clear both
          </button>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(["municipal", "regional"] as const).map((key) => {
            const p = shortlist[key];
            return (
              <div key={key} className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {BALLOTS[key].ballotColour}
                </p>
                <p className="mt-1 text-lg font-medium">{BALLOTS[key].label}</p>
                <dl className="mt-3 space-y-1 text-sm">
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-muted-foreground">Party</dt>
                    <dd className="font-medium">{p.partyName ?? "Not chosen yet"}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-muted-foreground">Candidate</dt>
                    <dd className="font-medium">
                      {p.candidateName
                        ? `${p.candidateName} (no. ${p.candidateOrder})`
                        : "No personal vote"}
                    </dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Saved in this browser only. Bring your ID — you take the actual ballot papers at
          the polling station.
        </p>
      </section>

      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Choose ballot">
        {(["municipal", "regional"] as const).map((key) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-input bg-card hover:bg-secondary"
            }`}
          >
            {BALLOTS[key].label}
          </button>
        ))}
      </div>

      <section className="mb-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-3xl">{ballot.label}</h2>
          <span className="text-sm text-muted-foreground">{ballot.swedish}</span>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">What it decides: </span>
          {ballot.decides}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-primary/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Currently governing
            </p>
            <p className="mt-1 text-sm font-medium">{ballot.governing}</p>
            <p className="mt-1 text-xs text-muted-foreground">{ballot.governingNote}</p>
          </div>
          <div className="rounded-lg bg-secondary p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
              Currently in opposition
            </p>
            <p className="mt-1 text-sm font-medium">{ballot.opposition}</p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-live="polite">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl border border-border bg-card" />
          ))}
        </div>
      ) : isError || data?.error ? (
        <p className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden />
          <span>
            {data?.error ??
              "The official candidate register could not be reached. Try refreshing, or check the source links below."}
          </span>
        </p>
      ) : null}

      {data ? (
        <BallotSection
          ballot={tab}
          lists={lists}
          pick={shortlist[tab]}
          onPickParty={(value) => setParty(tab, value)}
          onPickCandidate={(name, order) => setCandidate(tab, name, order)}
        />
      ) : null}

      <footer className="mt-14 border-t border-border pt-6 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span>
            Candidate data: {SOURCE.publisher} (the Swedish Election Authority), retrieved{" "}
            {data?.fetchedAt
              ? new Date(data.fetchedAt).toLocaleString("en-GB", { timeZone: "Europe/Stockholm" })
              : "—"}
            .
          </span>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-md border border-input bg-card px-3 py-1.5 text-foreground hover:bg-secondary disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} aria-hidden />
            Refresh
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-4">
          <a
            className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
            href={SOURCE.municipalPage}
            target="_blank"
            rel="noreferrer"
          >
            Official Solna list <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
          <a
            className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
            href={SOURCE.regionalPage}
            target="_blank"
            rel="noreferrer"
          >
            Official Region Stockholm list <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
          <a
            className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
            href="https://www.val.se/sa-rostar-du/rosta-pa-valdagen/sa-rostar-du-pa-valdagen"
            target="_blank"
            rel="noreferrer"
          >
            How voting works <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        </div>
        <p className="mt-3 max-w-3xl text-xs">
          Party descriptions are short editorial summaries, not statements from the parties.
          Candidate lists come straight from the official register but always check the
          printed ballot paper at the polling station before you vote.
        </p>
      </footer>
    </main>
  );
}
