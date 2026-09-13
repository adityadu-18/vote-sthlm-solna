# Candidate picker dialog

Replace the candidate list that currently opens below all party cards with an immediate, focused overlay.

## Experience

- Clicking **View candidates** opens a centered dialog over the current page, so the user sees the list immediately without scrolling.
- Show the party logo/name, ballot type, candidate count, and a short note that choosing a candidate also chooses that party.
- Keep search visible at the top while the candidate list scrolls independently.
- Present every candidate as a full-width selectable row with list number, name, and available age, occupation, and area.
- Use single-choice controls: only one personal vote can be selected per ballot. The chosen row receives a clear check state.
- Add a persistent footer summarizing the current selection and a **Done** button. Users can also close with the top-right button, Escape, or the backdrop.
- On mobile, use a near-full-screen dialog with a comfortable scroll area; on desktop, use a contained modal that leaves the dimmed party cards visible behind it.

## Behavior and accessibility

- Preserve the existing browser-saved shortlist behavior.
- Selecting a candidate automatically selects the associated party, as it does now.
- Selecting the chosen candidate again clears only the personal vote while retaining the party selection.
- Opening another party resets the search field; closing restores focus to the triggering button.
- Use the existing accessible dialog foundation for focus trapping, keyboard dismissal, screen-reader title/description, and background scroll locking.
- Remove the old bottom-of-page candidate panel and its **Hide candidates** state.

## Verification

- Check the interaction on desktop and mobile with long candidate lists.
- Confirm search, selection, deselection, party synchronization, persistence, close controls, keyboard focus, and both ballot tabs.
- Confirm there are no browser errors and the rest of the dashboard remains unchanged.
