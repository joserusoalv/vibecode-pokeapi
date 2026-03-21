import { Component, input } from '@angular/core';

@Component({
  selector: 'app-pokemon-sprites',
  standalone: true,
  imports: [],
  template: `
    <div
      class="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-lg backdrop-blur-md transition-colors duration-300 dark:border-slate-700/80 dark:bg-slate-800/60"
    >
      <h3 class="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-200">
        <svg class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Forms & Sprites
      </h3>

      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        @if (sprites().front_default) {
          <div
            class="group flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 dark:border-slate-700/50 dark:bg-slate-900/50"
          >
            <img
              [src]="sprites().front_default"
              [alt]="'Front default'"
              class="h-32 w-32 object-contain drop-shadow-md filter transition-transform group-hover:scale-110"
            />
            <span class="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">Default</span>
          </div>
        }
        @if (sprites().back_default) {
          <div
            class="group flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 dark:border-slate-700/50 dark:bg-slate-900/50"
          >
            <img
              [src]="sprites().back_default"
              [alt]="'Back default'"
              class="h-32 w-32 object-contain drop-shadow-md filter transition-transform group-hover:scale-110"
            />
            <span class="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400">Back</span>
          </div>
        }
        @if (sprites().front_shiny) {
          <div
            class="group relative flex flex-col items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 dark:border-slate-700/50 dark:bg-slate-900/50"
          >
            <div
              class="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-amber-400/20 blur-xl"
            ></div>
            <img
              [src]="sprites().front_shiny"
              [alt]="'Front shiny'"
              class="h-32 w-32 object-contain drop-shadow-md filter transition-transform group-hover:scale-110"
            />
            <span class="mt-2 text-xs font-bold tracking-wide text-amber-600 dark:text-amber-500/80"
              >✨ Shiny</span
            >
          </div>
        }
        @if (sprites().back_shiny) {
          <div
            class="group relative flex flex-col items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10 dark:border-slate-700/50 dark:bg-slate-900/50"
          >
            <div
              class="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-amber-400/20 blur-xl"
            ></div>
            <img
              [src]="sprites().back_shiny"
              [alt]="'Back shiny'"
              class="h-32 w-32 object-contain drop-shadow-md filter transition-transform group-hover:scale-110"
            />
            <span class="mt-2 text-xs font-bold tracking-wide text-amber-600 dark:text-amber-500/80"
              >✨ Back Shiny</span
            >
          </div>
        }
      </div>
    </div>
  `,
})
export class PokemonSpritesComponent {
  sprites = input.required<any>();
}
