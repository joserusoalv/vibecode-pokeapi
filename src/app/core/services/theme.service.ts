import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  theme = signal<ThemeMode>('system');
  isDark = signal<boolean>(false);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    const saved = localStorage.getItem('theme') as ThemeMode | null;
    if (saved) {
      this.theme.set(saved);
    }

    effect(() => {
      const mode = this.theme();
      localStorage.setItem('theme', mode);

      this.applyTheme(mode);
    });

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.theme() === 'system') {
        const isDarkMode = e.matches;
        this.isDark.set(isDarkMode);
        this.updateClassList(isDarkMode);
      }
    });
  }

  setTheme(mode: ThemeMode) {
    this.theme.set(mode);
  }

  private applyTheme(mode: ThemeMode) {
    if (!isPlatformBrowser(this.platformId)) return;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDarkMode = mode === 'dark' || (mode === 'system' && prefersDark);

    this.isDark.set(isDarkMode);
    this.updateClassList(isDarkMode);
  }

  private updateClassList(isDarkMode: boolean) {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
