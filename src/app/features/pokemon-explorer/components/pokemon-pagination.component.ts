import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-pokemon-pagination',
  standalone: true,
  template: `
    <div class="mt-8 flex flex-col items-center justify-center space-y-4">
      <!-- Minimalist Pagination Wrapper -->
      <div class="inline-flex items-center gap-1 rounded-2xl bg-slate-800/80 p-1.5 shadow-lg shadow-slate-900/50 border border-slate-700/50 backdrop-blur-md">
        
        <!-- First Page -->
        <button
          (click)="pageChange.emit(1)"
          [disabled]="currentPage() === 1"
          class="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-slate-700/50 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          title="First Page"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        <!-- Previous Page -->
        <button
          (click)="pageChange.emit(currentPage() - 1)"
          [disabled]="currentPage() === 1"
          class="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-slate-700/50 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          title="Previous Page"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div class="mx-2 h-6 w-px bg-slate-700/80"></div>

        <!-- Page Numbers -->
        @for (page of visiblePages(); track page) {
          <button
            (click)="pageChange.emit(page)"
            [class.bg-emerald-500]="currentPage() === page"
            [class.text-white]="currentPage() === page"
            [class.shadow-md]="currentPage() === page"
            [class.shadow-emerald-500]="currentPage() === page"
            [class.hover:bg-slate-700]="currentPage() !== page"
            [class.text-slate-300]="currentPage() !== page"
            class="flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl px-2 text-sm font-semibold transition-all duration-200"
          >
            {{ page }}
          </button>
        }

        <div class="mx-2 h-6 w-px bg-slate-700/80"></div>

        <!-- Next Page -->
        <button
          (click)="pageChange.emit(currentPage() + 1)"
          [disabled]="currentPage() === totalPages()"
          class="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-slate-700/50 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          title="Next Page"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Last Page -->
        <button
          (click)="pageChange.emit(totalPages())"
          [disabled]="currentPage() === totalPages()"
          class="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-all hover:bg-slate-700/50 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
          title="Last Page"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div class="text-sm font-medium tracking-wide text-slate-400">
        Page <span class="text-white">{{ currentPage() }}</span> of
        <span class="text-white">{{ totalPages() }}</span>
      </div>
    </div>
  `,
})
export class PokemonPaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageChange = output<number>();

  visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const maxVisible = 5;

    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  });
}
