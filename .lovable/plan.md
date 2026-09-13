# Add "Designed by Aditya Udapudi" credit

## What changes
Add a small credit line reading **"Designed by Aditya Udapudi"** in two places on the dashboard page (`src/routes/index.tsx`):

1. **Top** — a thin credit bar above the existing header lockup (above the "Röstklar Sthlm och Solna" title block), right-aligned, muted styling so it doesn't compete with the main brand.
2. **Bottom** — a credit line at the end of the existing footer, alongside the data-source and disclaimer text, matching the footer's muted small-text style.

## How it looks
- Top: a single right-aligned line of muted text (`text-xs text-muted-foreground`), e.g. `Designed by Aditya Udapudi`, sitting above the bordered title lockup.
- Bottom: one line appended to the footer's existing text block, same muted tone, e.g. `Designed by Aditya Udapudi`.

## Scope
- Edit only `src/routes/index.tsx`.
- No logic, data, styling tokens, or other files touched.
- No new dependencies.

## Verification
- Typecheck with `bunx tsgo --noEmit`.
- Playwright smoke check that the credit text appears at top and bottom of `/`.
