# Solna & Region Stockholm Voting Dashboard

A one-page dashboard in English to help you cast both ballots today: the Solna municipal ballot and the Region Stockholm ballot. Party comparison, full candidate lists, and a personal shortlist.

Note: I can't choose which AI model runs or change credit rates — that's a setting on your side. Everything below works regardless.

## What you get

**1. Two ballot sections**
- Solna Municipality — schools, preschools, social services, city planning, elderly care.
- Region Stockholm — healthcare and public transport (SL).
- Each section shows the governing coalition and the opposition as you described, so you see who currently runs what.

**2. Party cards**
For each of the eight parties (S, V, MP, C, M, L, KD, SD): name in Swedish and English, colour, role (governing / opposition) in that specific assembly, and a short summary of their local priorities.

**3. Candidate lists**
Ranked ballot list per party for each assembly, searchable by name. Each candidate shows list position, name, and (where published) age, occupation and area. This is what you need for the personal-vote cross.

**4. Your shortlist**
Mark one party and one candidate per ballot. A summary panel shows both picks side by side so you can take it with you to the polling station. Saved in your browser.

## Where the data comes from

Live scraping via a Firecrawl connection, from official sources:
- Valmyndigheten (val.se) candidate registers for Solna municipality and Stockholm County council.
- Party websites for Solna and Region Stockholm, for priorities and list confirmation.

Scraped results are cached so the page loads fast and doesn't re-fetch on every visit. Each section shows the source link and the time it was fetched, so you can verify against the official list before voting.

Honest caveat: what is available depends on what those sites publish and how they structure it. If a party's list can't be retrieved cleanly, the card says so and links to the official source rather than showing a guess. Nothing in the dashboard should be treated as a substitute for the official ballot papers.

## Technical notes

- Firecrawl connector linked to the project; all scraping runs server-side through TanStack Start server functions, never from the browser.
- One server function per source (val.se lists, party pages), with Zod-validated parsing into a normalised `{ assembly, party, candidates[] }` shape and a per-source `fetchedAt` timestamp.
- Results cached in-memory on the server plus TanStack Query on the client; a manual refresh button re-runs the scrape.
- Any source that fails returns a typed `{ data: [], error }` so one broken site never blanks the page.
- Shortlist in localStorage, read in `useEffect` to avoid hydration mismatch. No backend or login needed.
- Built at `/` as the app's home page, with head metadata for the dashboard.

## First step

Link the Firecrawl connection, then probe val.se and the party sites to confirm what is actually retrievable before building the parsers.
