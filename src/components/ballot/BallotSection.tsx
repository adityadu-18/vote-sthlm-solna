import { useMemo, useRef, useState } from "react";
import { Check, Search, Users } from "lucide-react";
import type { BallotList } from "@/lib/ballots.functions";
import { OTHER_PARTY, PARTIES, PARTY_BY_OFFICIAL_NAME, ROLE_LABEL } from "@/lib/parties";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Pick, Shortlist } from "./useShortlist";
import type { PartyMeta } from "@/lib/parties";

type Props = {
  ballot: keyof Shortlist;
  lists: BallotList[];
  pick: Pick;
  onPickParty: (value: { partyName: string; partyAbbr: string; listNumber: string }) => void;
  onPickCandidate: (name: string, order: number) => void;
};

const ORDER = new Map(PARTIES.map((p, i) => [p.officialName, i]));

function metaFor(list: BallotList) {
  const known = PARTY_BY_OFFICIAL_NAME.get(list.partyName);
  if (known) return known;
  return {
    ...OTHER_PARTY,
    officialName: list.partyName,
    swedishName: list.partyName,
    englishName: list.partyName,
    code: list.partyAbbr || "—",
  };
}

function PartyMark({ meta }: { meta: PartyMeta }) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className="flex h-14 w-24 items-center justify-center rounded-md border border-border bg-background p-2">
      {meta.logo && !logoFailed ? (
        <img
          src={meta.logo.src}
          alt={meta.logo.alt}
          className="h-full w-full object-contain"
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <span
          className="inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-bold"
          style={{ backgroundColor: meta.color, color: meta.onColor }}
          aria-label={`${meta.swedishName} abbreviation`}
        >
          {meta.code}
        </span>
      )}
    </div>
  );
}

export function BallotSection({ ballot, lists, pick, onPickParty, onPickCandidate }: Props) {
  const [openList, setOpenList] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const sorted = useMemo(
    () =>
      [...lists].sort((a, b) => {
        const ai = ORDER.get(a.partyName) ?? 99;
        const bi = ORDER.get(b.partyName) ?? 99;
        if (ai !== bi) return ai - bi;
        return b.candidates.length - a.candidates.length;
      }),
    [lists],
  );

  const open = sorted.find((l) => l.listNumber === openList) ?? null;
  const filtered = useMemo(() => {
    if (!open) return [];
    const q = query.trim().toLowerCase();
    if (!q) return open.candidates;
    return open.candidates.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.occupation ?? "").toLowerCase().includes(q) ||
        (c.area ?? "").toLowerCase().includes(q),
    );
  }, [open, query]);

  if (!lists.length) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
        No candidate lists could be loaded for this ballot right now. Check the official
        register linked at the bottom of the page before you vote.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sorted.map((list) => {
          const meta = metaFor(list);
          const role = ballot === "municipal" ? meta.solnaRole : meta.regionRole;
          const focus = ballot === "municipal" ? meta.solnaFocus : meta.regionFocus;
          const selected = pick.listNumber === list.listNumber;

          return (
            <article
              key={list.listNumber}
              className={`relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all ${
                selected ? "border-primary ring-2 ring-primary/30" : "border-border hover:shadow-md"
              }`}
            >
              <span
                className="absolute inset-x-0 top-0 h-1.5"
                style={{ backgroundColor: meta.color }}
                aria-hidden
              />
              <div className="flex flex-1 flex-col gap-3 p-5 pt-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <PartyMark meta={meta} />
                      <span
                        className="inline-flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs font-bold"
                        style={{ backgroundColor: meta.color, color: meta.onColor }}
                        aria-label={`${meta.swedishName} abbreviation`}
                      >
                        {meta.code}
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl leading-tight">{meta.englishName}</h3>
                    <p className="text-xs text-muted-foreground">{meta.swedishName}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      role === "governing"
                        ? "bg-primary/10 text-primary"
                        : role === "support"
                          ? "bg-accent text-accent-foreground"
                          : role === "opposition"
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {ROLE_LABEL[role]}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">{focus}</p>

                <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5" aria-hidden />
                  {list.candidates.length} candidates
                  {list.constituencyLabel ? ` · ${list.constituencyLabel}` : ""}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      onPickParty({
                        partyName: meta.englishName,
                        partyAbbr: meta.code,
                        listNumber: list.listNumber,
                      })
                    }
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "border border-input bg-background hover:bg-secondary"
                    }`}
                  >
                    {selected ? <Check className="h-4 w-4" aria-hidden /> : null}
                    {selected ? "On your ballot" : "Choose this party"}
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      lastTriggerRef.current = event.currentTarget;
                      setQuery("");
                      setOpenList(list.listNumber);
                    }}
                    className="rounded-md px-3 py-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    View candidates
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Dialog
        open={Boolean(open)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpenList(null);
            setQuery("");
          }
        }}
      >
        {open ? (
          <DialogContent
            className="flex h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-lg p-0 sm:max-h-[min(780px,calc(100dvh-3rem))]"
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              lastTriggerRef.current?.focus();
            }}
          >
            <DialogHeader className="border-b border-border px-5 pb-4 pt-5 pr-14 text-left sm:px-6 sm:pt-6">
              <div className="flex items-center gap-3">
                <PartyMark meta={metaFor(open)} />
                <div className="min-w-0">
                  <DialogTitle className="truncate font-serif text-2xl font-normal">
                    {metaFor(open).englishName} candidates
                  </DialogTitle>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {ballot === "municipal" ? "Solna Municipality" : "Region Stockholm"} ·{" "}
                    {open.candidates.length} candidates
                  </p>
                </div>
              </div>
              <DialogDescription className="pt-2 leading-relaxed">
                Ranked as printed on the ballot paper. Choose one name for your personal vote;
                this also chooses {metaFor(open).englishName} as your party.
              </DialogDescription>
              <label className="relative mt-3 block">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, job, or area"
                  className="h-11 w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                  aria-label="Search candidates"
                />
              </label>
            </DialogHeader>

            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2 sm:px-4" role="radiogroup" aria-label="Choose one candidate">
              <ol className="divide-y divide-border">
                {filtered.map((c) => {
                  const chosen = pick.listNumber === open.listNumber && pick.candidateName === c.name;
                  return (
                    <li key={`${c.order}-${c.name}`}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={chosen}
                        onClick={() => {
                          if (pick.listNumber !== open.listNumber) {
                            onPickParty({
                              partyName: metaFor(open).englishName,
                              partyAbbr: metaFor(open).code,
                              listNumber: open.listNumber,
                            });
                          }
                          onPickCandidate(c.name, c.order);
                        }}
                        className={`flex min-h-16 w-full items-center gap-3 rounded-md px-3 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          chosen ? "bg-primary/10" : "hover:bg-secondary"
                        }`}
                      >
                        <span className="w-8 shrink-0 text-sm tabular-nums text-muted-foreground">
                          {c.order}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium">{c.name}</span>
                          <span className="block text-xs leading-relaxed text-muted-foreground">
                            {[c.age ? `${c.age} yrs` : null, c.occupation, c.area]
                              .filter(Boolean)
                              .join(" · ") || c.homeMunicipality}
                          </span>
                        </span>
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-primary ${
                            chosen ? "border-primary bg-primary/15" : "border-input"
                          }`}
                          aria-hidden
                        >
                          {chosen ? <Check className="h-4 w-4" /> : null}
                        </span>
                      </button>
                    </li>
                  );
                })}
                {!filtered.length ? (
                  <li className="py-10 text-center text-sm text-muted-foreground">
                    No candidate matches “{query}”.
                  </li>
                ) : null}
              </ol>
            </div>

            <DialogFooter className="flex-row items-center justify-between gap-3 border-t border-border bg-card px-5 py-4 sm:px-6">
              <p className="min-w-0 text-sm text-muted-foreground" aria-live="polite">
                {pick.listNumber === open.listNumber && pick.candidateName ? (
                  <>
                    Selected: <span className="font-medium text-foreground">{pick.candidateName}</span>
                  </>
                ) : (
                  "No personal vote selected"
                )}
              </p>
              <Button type="button" onClick={() => setOpenList(null)} className="shrink-0">
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}
