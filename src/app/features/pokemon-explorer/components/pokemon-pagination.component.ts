import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pokemon-pagination',
  standalone: true,
  template: `
    <div class="mt-8 flex flex-col items-center justify-center space-y-4">
      <div class="flex items-center space-x-2">
        <button
          (click)="pageChange.emit(currentPage() - 1)"
          [disabled]="currentPage() === 1"
          class="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <span
          class="rounded-lg border border-slate-700/50 bg-slate-800/50 px-4 py-2 text-sm text-slate-400"
        >
          Page <span class="font-semibold text-white">{{ currentPage() }}</span> of
          <span class="font-semibold text-white">{{ totalPages() }}</span>
        </span>

        <button
          (click)="pageChange.emit(currentPage() + 1)"
          [disabled]="currentPage() === totalPages()"
          class="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  `,
})
export class PokemonPaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();
}
