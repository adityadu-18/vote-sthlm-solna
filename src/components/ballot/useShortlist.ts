import { useCallback, useEffect, useState } from "react";

export type Pick = {
  partyName: string | null;
  partyAbbr: string | null;
  listNumber: string | null;
  candidateName: string | null;
  candidateOrder: number | null;
};

export type Shortlist = {
  municipal: Pick;
  regional: Pick;
};

export const EMPTY_PICK: Pick = {
  partyName: null,
  partyAbbr: null,
  listNumber: null,
  candidateName: null,
  candidateOrder: null,
};

const STORAGE_KEY = "solna-ballot-shortlist-v1";

export function useShortlist() {
  const [shortlist, setShortlist] = useState<Shortlist>({
    municipal: EMPTY_PICK,
    regional: EMPTY_PICK,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Shortlist;
        if (parsed?.municipal && parsed?.regional) setShortlist(parsed);
      }
    } catch {
      /* ignore unreadable storage */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shortlist));
    } catch {
      /* ignore full or blocked storage */
    }
  }, [shortlist, loaded]);

  const setParty = useCallback(
    (
      ballot: keyof Shortlist,
      value: { partyName: string; partyAbbr: string; listNumber: string },
    ) => {
      setShortlist((prev) => {
        const same = prev[ballot].listNumber === value.listNumber;
        return {
          ...prev,
          [ballot]: same
            ? EMPTY_PICK
            : { ...value, candidateName: null, candidateOrder: null },
        };
      });
    },
    [],
  );

  const setCandidate = useCallback(
    (ballot: keyof Shortlist, name: string, order: number) => {
      setShortlist((prev) => ({
        ...prev,
        [ballot]: {
          ...prev[ballot],
          candidateName: prev[ballot].candidateName === name ? null : name,
          candidateOrder: prev[ballot].candidateName === name ? null : order,
        },
      }));
    },
    [],
  );

  const clear = useCallback(() => {
    setShortlist({ municipal: EMPTY_PICK, regional: EMPTY_PICK });
  }, []);

  return { shortlist, setParty, setCandidate, clear, loaded };
}
