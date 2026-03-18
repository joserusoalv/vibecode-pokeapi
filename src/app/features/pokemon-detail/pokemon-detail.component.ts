import { DecimalPipe, Location } from '@angular/common';
import { Component, effect, inject, input, OnInit, signal } from '@angular/core';
import { PokemonDetail } from '../../core/models/pokemon.model';
import { PokemonApiService } from '../../core/services/pokemon-api.service';
import { PokemonAudioComponent } from './components/pokemon-audio.component';
import { PokemonMovesComponent } from './components/pokemon-moves.component';
import { PokemonSpritesComponent } from './components/pokemon-sprites.component';
import { PokemonStatsComponent } from './components/pokemon-stats.component';
import { PokemonTypeBadgeComponent } from './components/pokemon-type-badge.component';
import { ThemeToggleComponent } from '../../shared/components/theme-toggle.component';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [
    PokemonTypeBadgeComponent,
    PokemonSpritesComponent,
    PokemonStatsComponent,
    PokemonAudioComponent,
    PokemonMovesComponent,
    ThemeToggleComponent,
    DecimalPipe,
  ],
  template: `
    <div
      class="min-h-screen bg-slate-50 dark:bg-slate-900 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 px-4 py-8 text-slate-800 dark:text-slate-200 sm:px-6 lg:px-8 transition-colors duration-300 relative"
    >
      <!-- Theme Toggle -->
      <div class="absolute top-6 right-6 lg:top-8 lg:right-8 z-50">
        <app-theme-toggle></app-theme-toggle>
      </div>

      <div class="mx-auto max-w-6xl">
        <!-- Back Navigation -->
        <button
          (click)="goBack()"
          class="group mb-8 flex items-center gap-2 text-slate-500 dark:text-slate-400 transition-colors hover:text-emerald-500 dark:hover:text-emerald-400 relative z-10"
        >
          <svg
            class="h-5 w-5 transform transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span
            class="border-b border-transparent font-medium tracking-wide transition-colors group-hover:border-emerald-400"
            >Back to Explorer</span
          >
        </button>

        @if (loading()) {
          <div class="flex items-center justify-center py-32">
            <div
              class="h-16 w-16 animate-spin rounded-full border-t-2 border-b-2 border-emerald-500"
            ></div>
          </div>
        } @else if (error()) {
          <div
            class="mx-auto max-w-lg rounded-2xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 p-6 text-center text-red-600 dark:text-red-400 shadow-xl backdrop-blur transition-colors duration-300"
          >
            <svg
              class="mx-auto mb-4 h-12 w-12 text-red-500 dark:text-red-500/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 class="mb-2 text-2xl font-bold">Something went wrong</h2>
            <p class="text-slate-600 dark:text-slate-300">{{ error() }}</p>
            <button
              (click)="goBack()"
              class="mt-6 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-2.5 font-medium text-slate-700 dark:text-white transition-all hover:bg-slate-50 dark:hover:border-slate-600 dark:hover:bg-slate-700 shadow-sm"
            >
              Return Home
            </button>
          </div>
        } @else if (pokemon()) {
          <!-- Header Card -->
          <div
            class="relative mb-8 overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/60 p-8 shadow-2xl backdrop-blur-md transition-colors duration-300"
          >
            <!-- Decorative background glows -->
            <div
              class="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-[80px]"
            ></div>
            <div
              class="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-[80px]"
            ></div>

            <div
              class="relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row md:items-start"
            >
              <div class="flex flex-col items-center gap-4 md:items-start">
                <div class="flex items-center gap-4">
                  <span class="font-mono text-2xl tracking-wider text-emerald-600/80 dark:text-emerald-400/80"
                    >#{{ pokemon()!.id | number: '3.0-0' }}</span
                  >
                  <h1
                    class="bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-5xl font-extrabold text-transparent capitalize drop-shadow-sm md:text-6xl transition-colors duration-300"
                  >
                    {{ pokemon()!.name }}
                  </h1>
                </div>
                <!-- Types -->
                <div class="mt-4 flex flex-wrap gap-3">
                  @for (typeInfo of pokemon()!.types; track typeInfo.slot) {
                    <app-pokemon-type-badge [type]="typeInfo.type"></app-pokemon-type-badge>
                  }
                </div>
              </div>

              <!-- Audio and Main Image -->
              <div class="mt-4 flex flex-col items-center gap-6 md:mt-0">
                <div class="group relative">
                  <div
                    class="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
                  ></div>
                  @if (
                    pokemon()!.sprites.other &&
                    pokemon()!.sprites.other['official-artwork'] &&
                    pokemon()!.sprites.other['official-artwork'].front_default
                  ) {
                    <img
                      [src]="pokemon()!.sprites.other['official-artwork'].front_default"
                      [alt]="pokemon()!.name"
                      class="relative z-10 h-56 w-56 object-contain drop-shadow-2xl filter transition-transform duration-500 group-hover:scale-105 md:h-64 md:w-64"
                    />
                  } @else if (pokemon()!.sprites.front_default) {
                    <img
                      [src]="pokemon()!.sprites.front_default"
                      [alt]="pokemon()!.name"
                      class="relative z-10 h-48 w-48 object-contain drop-shadow-xl filter transition-transform duration-500 group-hover:scale-105"
                    />
                  }
                </div>

                @if (pokemon()!.cries.latest) {
                  <app-pokemon-audio [src]="pokemon()!.cries.latest"></app-pokemon-audio>
                }
              </div>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="flex flex-col gap-8">
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div class="flex flex-col gap-8">
                <app-pokemon-stats [pokemon]="pokemon()!"></app-pokemon-stats>
              </div>
              <div class="flex flex-col gap-8">
                <app-pokemon-sprites [sprites]="pokemon()!.sprites"></app-pokemon-sprites>
              </div>
            </div>
            <div class="w-full">
              <app-pokemon-moves [moves]="pokemon()!.moves"></app-pokemon-moves>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class PokemonDetailComponent implements OnInit {
  id = input.required<string>(); // Binded automatically via withComponentInputBinding()

  private readonly apiService = inject(PokemonApiService);
  private readonly location = inject(Location);

  pokemon = signal<PokemonDetail | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const currentId = this.id();
      if (currentId) {
        this.loadPokemon(currentId);
      }
    });
  }

  ngOnInit() {}

  loadPokemon(id: string) {
    this.loading.set(true);
    this.error.set(null);
    this.pokemon.set(null);

    this.apiService.getPokemonDetails(id).subscribe({
      next: (data: any) => {
        this.pokemon.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Pokémon not found, or there was a network error.');
        this.loading.set(false);
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
