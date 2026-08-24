/**
 * Deterministic layout for the signature activity grid.
 *
 * This is NOT a contribution chart and has nothing to do with commits — every
 * lit cell maps back to one of the ten entries in `activities.ts`. The layout is
 * generated once at module load from a fixed seed, so it is identical on every
 * render, every reload and every machine.
 */

import { activities, type ActivityFilter } from './activities';

export const GRID_ROWS = 7;
/** One leading spacer column, ten four-column clusters, one trailing spacer. */
export const CLUSTER_WIDTH = 4;
export const GRID_COLUMNS = activities.length * CLUSTER_WIDTH + 2;

export interface GridCell {
  /** Stable cell id, e.g. "cell-03-17". */
  id: string;
  row: number;
  column: number;
  /** 0 = dormant. 1–4 = increasing emerald intensity. */
  intensity: 0 | 1 | 2 | 3 | 4;
  activityId: string | null;
  activityTitle: string | null;
  category: string | null;
  filter: ActivityFilter | null;
}

export interface ClusterLabel {
  index: string;
  activityId: string;
  /** 1-based column the label is anchored to. */
  column: number;
}

/** Small, fast, seedable PRNG (mulberry32) — keeps the layout reproducible. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Per-activity shape of the cluster: where it sits vertically and how hot it burns. */
const clusterShape: Record<string, { rowCenter: number; density: number; heat: number }> = {
  'bondi-patshala': { rowCenter: 3, density: 0.92, heat: 1 },
  'physics-olympiad': { rowCenter: 2, density: 0.85, heat: 0.96 },
  'public-health-research': { rowCenter: 4, density: 0.8, heat: 0.9 },
  'nanoscience-internship': { rowCenter: 5, density: 0.62, heat: 0.66 },
  'robotics-club': { rowCenter: 3, density: 0.84, heat: 0.88 },
  'monpy-codely': { rowCenter: 2, density: 0.68, heat: 0.72 },
  'climate-policy': { rowCenter: 4, density: 0.74, heat: 0.82 },
  'suraad-elearning': { rowCenter: 5, density: 0.78, heat: 0.8 },
  cyber24: { rowCenter: 3, density: 0.88, heat: 0.98 },
  questica: { rowCenter: 4, density: 0.82, heat: 0.94 },
};

function buildGrid(): { cells: GridCell[]; labels: ClusterLabel[] } {
  const random = mulberry32(20260824);
  const cells: GridCell[] = [];
  const labels: ClusterLabel[] = [];

  /** column (1-based) -> activity index, or -1 for the spacer columns. */
  const columnOwner = new Array<number>(GRID_COLUMNS + 1).fill(-1);
  activities.forEach((activity, activityIndex) => {
    const start = 2 + activityIndex * CLUSTER_WIDTH;
    for (let offset = 0; offset < CLUSTER_WIDTH; offset += 1) {
      columnOwner[start + offset] = activityIndex;
    }
    labels.push({
      index: activity.index,
      activityId: activity.id,
      column: start,
    });
  });

  for (let column = 1; column <= GRID_COLUMNS; column += 1) {
    const owner = columnOwner[column];
    for (let row = 1; row <= GRID_ROWS; row += 1) {
      const id = `cell-${String(column).padStart(2, '0')}-${String(row).padStart(2, '0')}`;

      if (owner === -1) {
        // Spacer columns stay dormant — they give the panel breathing room.
        cells.push({
          id,
          row,
          column,
          intensity: 0,
          activityId: null,
          activityTitle: null,
          category: null,
          filter: null,
        });
        continue;
      }

      const activity = activities[owner];
      const shape = clusterShape[activity.id];
      const distance = Math.abs(row - shape.rowCenter);
      // Cells fade out as they move away from the cluster's vertical centre.
      const falloff = Math.max(0, 1 - distance / 4.2);
      const chance = shape.density * falloff;
      const roll = random();

      if (roll > chance) {
        cells.push({
          id,
          row,
          column,
          intensity: 0,
          activityId: null,
          activityTitle: null,
          category: null,
          filter: null,
        });
        continue;
      }

      const energy = shape.heat * falloff * (0.62 + random() * 0.55);
      const intensity = (energy > 0.72 ? 4 : energy > 0.52 ? 3 : energy > 0.32 ? 2 : 1) as 1 | 2 | 3 | 4;

      cells.push({
        id,
        row,
        column,
        intensity,
        activityId: activity.id,
        activityTitle: activity.title,
        category: activity.category,
        filter: activity.filter,
      });
    }
  }

  return { cells, labels };
}

const built = buildGrid();

/** Column-major order so the DOM order matches the visual reading order. */
export const gridCells: GridCell[] = built.cells;
export const clusterLabels: ClusterLabel[] = built.labels;
export const activeCellCount = gridCells.filter((cell) => cell.activityId !== null).length;

/** Row-major lookup used by arrow-key navigation. */
export const cellAt = (column: number, row: number): GridCell | undefined =>
  gridCells[(column - 1) * GRID_ROWS + (row - 1)];
