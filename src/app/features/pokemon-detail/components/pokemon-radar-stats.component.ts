import { Component, computed, input } from '@angular/core';
import { PokemonDetail } from '../../../core/models/pokemon.model';

@Component({
  selector: 'app-pokemon-radar-stats',
  standalone: true,
  imports: [],
  host: { class: 'block h-full' },
  template: `
    <div
      class="flex h-full flex-col rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-lg backdrop-blur-md transition-colors duration-300 dark:border-slate-700/80 dark:bg-slate-800/60"
    >
      <h3
        class="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-200"
      >
        <svg class="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
          />
        </svg>
        Radar Stats
      </h3>

      <div class="relative flex flex-1 items-center justify-center p-4">
        <svg viewBox="0 0 320 320" class="h-full w-full max-h-80 max-w-sm drop-shadow-md">
          <!-- Background webs -->
          @for (level of [0.2, 0.4, 0.6, 0.8, 1]; track level) {
            <polygon
              [attr.points]="getWebPoints(level)"
              class="fill-none stroke-slate-300 dark:stroke-slate-600"
              stroke-width="1"
            />
          }

          <!-- Axes -->
          @for (axis of enrichedAxes(); track axis.label) {
            <line
              [attr.x1]="centerX"
              [attr.y1]="centerY"
              [attr.x2]="axis.x"
              [attr.y2]="axis.y"
              class="stroke-slate-300 dark:stroke-slate-600"
              stroke-width="1"
            />
            
            <!-- Labels -->
            <text
              [attr.x]="axis.labelX"
              [attr.y]="axis.labelY"
              class="fill-slate-600 text-[11px] font-bold tracking-wider uppercase dark:fill-slate-400"
              text-anchor="middle"
              alignment-baseline="middle"
            >
              {{ axis.label }}
            </text>
            <text
              [attr.x]="axis.labelX"
              [attr.y]="axis.labelY + 16"
              class="fill-slate-900 text-[13px] font-bold dark:fill-white"
              text-anchor="middle"
              alignment-baseline="middle"
            >
              {{ axis.value }}
            </text>
          }

          <!-- Stat Polygon -->
          <polygon
            [attr.points]="statPoints()"
            class="fill-emerald-500/30 stroke-emerald-500 transition-all duration-1000 ease-out dark:fill-emerald-400/30 dark:stroke-emerald-400 hover:fill-emerald-500/50 dark:hover:fill-emerald-400/50 cursor-pointer"
            stroke-width="2.5"
            stroke-linejoin="round"
          />
          
          <!-- Stat Points -->
          @for (point of statPointsList(); track point.label) {
            <circle
              [attr.cx]="point.x"
              [attr.cy]="point.y"
              r="4.5"
              class="fill-emerald-600 transition-all duration-300 hover:r-6 dark:fill-emerald-300"
            />
          }
        </svg>
      </div>
    </div>
  `,
})
export class PokemonRadarStatsComponent {
  pokemon = input.required<PokemonDetail>();

  // Center coordinates and metrics for the SVG
  readonly centerX = 160;
  readonly centerY = 160;
  readonly maxRadius = 110;
  // Maximum stat normally is 255. We can scale relative to 255 to always fit.
  readonly maxValue = 255;

  readonly labels = ['HP', 'Attack', 'Defense', 'Speed', 'Sp. Def', 'Sp. Atk'];
  
  // Angle for each stat in radians (start at top: -90 degrees, and go clockwise)
  readonly angles = [
    -Math.PI / 2,
    -Math.PI / 6,
    Math.PI / 6,
    Math.PI / 2,
    (5 * Math.PI) / 6,
    (7 * Math.PI) / 6,
  ];

  enrichedAxes = computed(() => {
    const stats = this.pokemon().stats;
    const statValues = [
      this.getStat(stats, 'hp'),
      this.getStat(stats, 'attack'),
      this.getStat(stats, 'defense'),
      this.getStat(stats, 'speed'),
      this.getStat(stats, 'special-defense'),
      this.getStat(stats, 'special-attack'),
    ];

    const labelRadius = this.maxRadius + 32;

    return this.labels.map((label, i) => {
      const angle = this.angles[i];
      return {
        label,
        value: statValues[i],
        x: this.centerX + this.maxRadius * Math.cos(angle),
        y: this.centerY + this.maxRadius * Math.sin(angle),
        labelX: this.centerX + labelRadius * Math.cos(angle),
        // Adjust Y for text to not overlap with lines too much
        labelY: this.centerY + labelRadius * Math.sin(angle) - 8,
      };
    });
  });

  statPointsList = computed(() => {
    const axes = this.enrichedAxes();
    return axes.map((axis, i) => {
      const radius = (axis.value / this.maxValue) * this.maxRadius;
      return {
        label: axis.label,
        x: this.centerX + radius * Math.cos(this.angles[i]),
        y: this.centerY + radius * Math.sin(this.angles[i]),
      };
    });
  });

  statPoints = computed(() => {
    return this.statPointsList()
      .map(p => `${p.x},${p.y}`)
      .join(' ');
  });

  getWebPoints(level: number): string {
    const radius = this.maxRadius * level;
    return this.angles
      .map(angle => {
        const x = this.centerX + radius * Math.cos(angle);
        const y = this.centerY + radius * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(' ');
  }

  private getStat(stats: any[], name: string): number {
    return stats.find(s => s.stat.name === name)?.base_stat || 0;
  }
}
