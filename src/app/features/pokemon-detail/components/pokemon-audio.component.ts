import {} from '@angular/common';
import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-pokemon-audio',
  standalone: true,
  imports: [],
  template: `
    <button
      (click)="playAudio()"
      [disabled]="isPlaying()"
      class="group rounded-full border border-emerald-500/30 bg-emerald-100 dark:bg-emerald-500/20 p-4 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/20 transition-all hover:animate-pulse hover:bg-emerald-200 dark:hover:bg-emerald-500/30 hover:text-emerald-700 dark:hover:text-emerald-300 focus:ring-2 focus:ring-emerald-500/50 focus:outline-none disabled:opacity-50"
      title="Play Cry"
    >
      @if (isPlaying()) {
        <div class="flex h-8 w-8 items-center justify-center space-x-1">
          <div class="h-4 w-1 animate-bounce bg-emerald-500 dark:bg-emerald-400" style="animation-delay: 0s"></div>
          <div class="h-6 w-1 animate-bounce bg-emerald-500 dark:bg-emerald-400" style="animation-delay: 0.1s"></div>
          <div class="h-4 w-1 animate-bounce bg-emerald-500 dark:bg-emerald-400" style="animation-delay: 0.2s"></div>
        </div>
      } @else {
        <svg
          class="h-8 w-8 transform transition-transform group-hover:scale-110"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
          />
        </svg>
      }
    </button>
  `,
})
export class PokemonAudioComponent {
  src = input.required<string>();
  isPlaying = signal(false);

  playAudio(): void {
    if (!this.src() || this.isPlaying()) return;

    this.isPlaying.set(true);
    const audio = new Audio(this.src());
    audio.volume = 0.5;

    audio.play().catch((e) => {
      console.warn('Audio playback blocked', e);
      this.isPlaying.set(false);
    });

    audio.onended = () => this.isPlaying.set(false);
    audio.onerror = () => this.isPlaying.set(false);
  }
}
