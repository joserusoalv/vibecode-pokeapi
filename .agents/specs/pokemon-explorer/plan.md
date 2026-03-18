# Technical Plan: Pokemon Explorer

## Architecture
- **Framework:** Angular 21
- **State Management:** Angular Signals (Atomic approach, avoiding large state objects).
- **Styling:** Tailwind CSS (Premium aesthetics: glassmorphism, gradients, transitions).
- **Routing:** Standalone components, lazy loaded where applicable, using Angular Router.

## Services
1. **PokemonApiService:**
   - `getPokemonIndex()`: Fetches the base list to keep a local index of `{name, url}` for fast local filtering and pagination (or handles server pagination natively).
   - `getPokemonDetails(nameOrId: string)`: Fetches a single pokemon's full details.
   - `getTypeDetails(typeUrl: string)`: Fetches the type's details to extract the `generation-iii/diamond-pearl/name_icon` sprite.
   - `getMoveDetails(moveUrl: string)`: Fetches the individual move data.

2. **PokemonStateService (Signal Store):**
   - Manages atomic signals: `indexData`, `currentPage`, `searchQuery`, `loadingStates`.
   - Uses `computed()` to derive the paginated and filtered view.

## Components
1. **PokemonExplorerComponent** (Smart Route Component)
   - Layout wrapper handling the main listing.
2. **PokemonSearchComponent** (UI)
   - Input for filtering by name.
3. **PokemonTableComponent** (UI)
   - Displays ID and Name cleanly leveraging Tailwind.
4. **PokemonDetailComponent** (Smart Route Component)
   - Loads details for a specific ID. Orchestrates multiple sub-components for the Pokemon.
5. **PokemonTypeBadgeComponent** (UI)
   - Takes a type object, resolves its icon using `PokemonApiService`, and displays it.
6. **PokemonStatsComponent** (UI)
   - Displays physical and combat stats gracefully using Tailwind progress bars.
7. **PokemonMovesComponent** (UI)
   - Lists moves, with expandable rows that lazy-load `getMoveDetails()`.
8. **PokemonAudioComponent** (UI)
   - Button (speaker icon) to play the `cries` audio URL.

## Execution Steps
1. Scaffold directories and files.
2. Build data access layer (`PokemonApiService`, interfaces).
3. Build State layer (`PokemonStateService` with atomic signals).
4. Implement main list UI (Search + Table + Pagination).
5. Implement detail UI (Header + Sprites + Stats + Audio + Moves).
6. Apply rigorous Tailwind styles matching premium quality requirements.
