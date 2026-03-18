import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'pokemon', pathMatch: 'full' },
  {
    path: 'pokemon',
    loadComponent: () =>
      import('./features/pokemon-explorer/pokemon-explorer.component').then(
        (m) => m.PokemonExplorerComponent,
      ),
  },
  {
    path: 'pokemon/:id',
    loadComponent: () =>
      import('./features/pokemon-detail/pokemon-detail.component').then(
        (m) => m.PokemonDetailComponent,
      ),
  },
  { path: '**', redirectTo: 'pokemon' },
];
