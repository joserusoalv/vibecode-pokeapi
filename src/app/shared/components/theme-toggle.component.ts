import { Component, inject } from '@angular/core';
import { ThemeService, ThemeMode } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <div class="group relative inline-block text-left">
      <button
        type="button"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:bg-slate-50 hover:text-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-emerald-400"
        id="theme-menu-button"
        aria-expanded="true"
        aria-haspopup="true"
        (click)="toggleMenu()"
      >
        @if (themeService.theme() === 'system') {
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        } @else if (themeService.theme() === 'dark') {
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        } @else {
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        }
      </button>

      <!-- Dropdown menu -->
      @if (menuOpen) {
        <div
          class="ring-opacity-5 absolute right-0 z-50 mt-2 w-36 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black focus:outline-none dark:border-slate-700/50 dark:bg-slate-800"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="theme-menu-button"
          tabindex="-1"
        >
          <div class="py-1" role="none">
            <button
              (click)="selectTheme('light')"
              class="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-emerald-500 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-emerald-400"
              role="menuitem"
            >
              <svg class="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Light
            </button>
            <button
              (click)="selectTheme('dark')"
              class="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-emerald-500 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-emerald-400"
              role="menuitem"
            >
              <svg class="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              Dark
            </button>
            <button
              (click)="selectTheme('system')"
              class="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-emerald-500 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-emerald-400"
              role="menuitem"
            >
              <svg class="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              System
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  selectTheme(mode: ThemeMode) {
    this.themeService.setTheme(mode);
    this.menuOpen = false;
  }
}
