# Rebrand to Röstklar Sthlm och Solna

Refresh the existing voter dashboard around the name **Röstklar Sthlm och Solna**, clearly positioning it as an English-language guide for eligible non-EU residents voting in Solna’s municipal and Region Stockholm elections.

## Brand and wording

- Make **Röstklar Sthlm och Solna** the prominent page name and browser/share title.
- Add a concise English descriptor such as “A ballot guide for non-EU residents in Solna” so the audience and purpose are immediately clear.
- Update the opening copy and page metadata while preserving the existing election-day facts, two-ballot explanation, shortlist, and official-source caveats.
- Remove the remaining generic project metadata so shared links consistently use the new identity.
- Keep the current editorial, civic visual direction; refine the top of the page into a recognizable brand lockup rather than redesigning the entire dashboard.

## Official party marks

- Source static logo files from each major party’s official press or brand resources where a suitable web asset is publicly available: S, V, MP, C, M, L, KD, and SD.
- Store the selected logo assets with the project rather than hotlinking party websites.
- Extend party metadata with an optional logo reference and accessible alt text.
- Replace the generic letter badge on party cards with the official logo, while retaining the party abbreviation as a compact supporting label.
- Fall back to the current colour-and-abbreviation badge for smaller parties or any major party without a reliable official asset.
- Give logos a consistent, stable display area without recolouring or distorting them.

## Validation

- Check desktop and mobile layouts for long names, differing logo proportions, card alignment, and candidate-list interactions.
- Confirm every major party either displays its official mark or the intended fallback.
- Verify the new name appears in the page, browser title, and social-sharing metadata, with no remaining “Lovable App” branding.

## Technical details

- Changes remain presentation-only: party/candidate data retrieval, election logic, and saved shortlist behavior stay unchanged.
- Logo files will be static project assets referenced from party metadata; no runtime logo service or new account is required.
- Image dimensions and `object-fit` rules will normalize varied official artwork while preserving aspect ratios.
