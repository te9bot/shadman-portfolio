import { memo, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  GRID_COLUMNS,
  GRID_ROWS,
  activeCellCount,
  clusterLabels,
  gridCells,
  type GridCell,
} from '../data/activityGrid';
import { activities, type FilterKey } from '../data/activities';

interface Props {
  filter: FilterKey;
  selectedId: string;
  onSelect: (activityId: string, source: 'grid') => void;
}

const cellKey = (column: number, row: number): string => `${column}:${row}`;

interface CellProps {
  cell: GridCell;
  muted: boolean;
  selected: boolean;
  tabbable: boolean;
  onActivate: (cell: GridCell) => void;
  onPeek: (cell: GridCell | null, el: HTMLElement | null) => void;
  onKeyNav: (event: React.KeyboardEvent<HTMLButtonElement>, cell: GridCell) => void;
  registerRef: (key: string, el: HTMLButtonElement | null) => void;
}

/** One square. Memoised so hovering a cell never re-renders the other 293. */
const Cell = memo(function Cell({
  cell,
  muted,
  selected,
  tabbable,
  onActivate,
  onPeek,
  onKeyNav,
  registerRef,
}: CellProps): JSX.Element {
  if (!cell.activityId) {
    return <span className="agrid__cell" data-level="0" aria-hidden="true" />;
  }

  const classes = [
    'agrid__cell',
    'is-interactive',
    muted ? 'is-muted' : '',
    selected && !muted ? 'is-selected' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      data-level={cell.intensity}
      tabIndex={tabbable ? 0 : -1}
      aria-current={selected ? 'true' : undefined}
      aria-label={`${cell.category}: ${cell.activityTitle}`}
      ref={(el) => registerRef(cellKey(cell.column, cell.row), el)}
      onClick={() => onActivate(cell)}
      onPointerEnter={(event) => onPeek(cell, event.currentTarget)}
      onPointerLeave={() => onPeek(null, null)}
      onFocus={(event) => onPeek(cell, event.currentTarget)}
      onBlur={() => onPeek(null, null)}
      onKeyDown={(event) => onKeyNav(event, cell)}
    />
  );
});

function ActivityGrid({ filter, selectedId, onSelect }: Props): JSX.Element {
  const [hovered, setHovered] = useState<GridCell | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<{ left: number; top: number; width: number; height: number } | null>(
    null,
  );
  const [focusKey, setFocusKey] = useState<string>(() => {
    const first = gridCells.find((cell) => cell.activityId);
    return first ? cellKey(first.column, first.row) : '';
  });

  const cellRefs = useRef(new Map<string, HTMLButtonElement>());

  /** Active cells indexed by column, so arrow keys can hop between clusters. */
  const columnIndex = useMemo(() => {
    const map = new Map<number, GridCell[]>();
    for (const cell of gridCells) {
      if (!cell.activityId) continue;
      const list = map.get(cell.column);
      if (list) list.push(cell);
      else map.set(cell.column, [cell]);
    }
    return map;
  }, []);

  const registerRef = useCallback((key: string, el: HTMLButtonElement | null) => {
    if (el) cellRefs.current.set(key, el);
    else cellRefs.current.delete(key);
  }, []);

  const focusCell = useCallback((cell: GridCell) => {
    const key = cellKey(cell.column, cell.row);
    setFocusKey(key);
    cellRefs.current.get(key)?.focus();
  }, []);

  const onPeek = useCallback((cell: GridCell | null, el: HTMLElement | null) => {
    setHovered(cell);
    anchorRef.current =
      cell && el
        ? { left: el.offsetLeft, top: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight }
        : null;
  }, []);

  /**
   * Place the tooltip once its content is in the DOM: flip it below the cell
   * when there is no room above, and clamp it inside the plot so the panel's
   * rounded clip never cuts it off.
   */
  useLayoutEffect(() => {
    const tip = tooltipRef.current;
    const anchor = anchorRef.current;
    if (!tip || !anchor || !hovered) return;

    const plotWidth = tip.parentElement?.clientWidth ?? 0;
    const width = tip.offsetWidth;
    const height = tip.offsetHeight;
    const flipBelow = anchor.top - height - 8 < 0;
    const y = flipBelow ? anchor.top + anchor.height + 8 : anchor.top - height - 8;
    const rawX = anchor.left + anchor.width / 2 - width / 2;
    const x = Math.max(0, Math.min(rawX, Math.max(0, plotWidth - width)));

    tip.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
  }, [hovered]);

  const onActivate = useCallback(
    (cell: GridCell) => {
      if (cell.activityId) onSelect(cell.activityId, 'grid');
    },
    [onSelect],
  );

  const onKeyNav = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, cell: GridCell) => {
      const step = (direction: 1 | -1): GridCell | null => {
        // Nearest active cell in the next populated column, matching row where possible.
        for (
          let column = cell.column + direction;
          column >= 1 && column <= GRID_COLUMNS;
          column += direction
        ) {
          const candidates = columnIndex.get(column);
          if (!candidates?.length) continue;
          return candidates.reduce((best, current) =>
            Math.abs(current.row - cell.row) < Math.abs(best.row - cell.row) ? current : best,
          );
        }
        return null;
      };

      const vertical = (direction: 1 | -1): GridCell | null => {
        const candidates = columnIndex.get(cell.column) ?? [];
        const sorted = direction === 1 ? candidates : [...candidates].reverse();
        return sorted.find((c) => (direction === 1 ? c.row > cell.row : c.row < cell.row)) ?? null;
      };

      let next: GridCell | null = null;

      switch (event.key) {
        case 'ArrowRight':
          next = step(1);
          break;
        case 'ArrowLeft':
          next = step(-1);
          break;
        case 'ArrowDown':
          next = vertical(1);
          break;
        case 'ArrowUp':
          next = vertical(-1);
          break;
        case 'Home':
          next = gridCells.find((c) => c.activityId) ?? null;
          break;
        case 'End':
          next = [...gridCells].reverse().find((c) => c.activityId) ?? null;
          break;
        default:
          return;
      }

      event.preventDefault();
      if (next) focusCell(next);
    },
    [columnIndex, focusCell],
  );

  const activeFilterCount =
    filter === 'all'
      ? activities.length
      : activities.filter((activity) => activity.filter === filter).length;

  return (
    <div className="agrid">
      <div className="agrid__top">
        <p className="agrid__caption">
          <strong>{activities.length} experiences</strong> across research, technology, education
          &amp; policy
        </p>
        <p className="agrid__hint" aria-hidden="true">
          Hover · Click · Arrow keys
        </p>
      </div>

      <div className="agrid__scroller">
        <div
          className="agrid__plot"
          style={
            { '--cols': GRID_COLUMNS, '--rows': GRID_ROWS } as React.CSSProperties
          }
        >
          <div className="agrid__labels" aria-hidden="true">
            {clusterLabels.map((label) => {
              const activity = activities.find((item) => item.id === label.activityId);
              const lit =
                label.activityId === selectedId ||
                (filter !== 'all' && activity?.filter === filter);
              return (
                <span
                  key={label.activityId}
                  className={`agrid__label${lit ? ' is-lit' : ''}`}
                  style={{ gridColumn: `${label.column} / span 4` }}
                >
                  {label.index}
                </span>
              );
            })}
          </div>

          <div
            className="agrid__cells"
            role="group"
            aria-label="Activity grid — each lit square belongs to one experience"
          >
            {gridCells.map((cell) => {
              const key = cellKey(cell.column, cell.row);
              return (
                <Cell
                  key={cell.id}
                  cell={cell}
                  muted={filter !== 'all' && cell.filter !== filter}
                  selected={cell.activityId === selectedId}
                  tabbable={key === focusKey}
                  onActivate={onActivate}
                  onPeek={onPeek}
                  onKeyNav={onKeyNav}
                  registerRef={registerRef}
                />
              );
            })}
          </div>

          <div
            className={`agrid__tooltip${hovered ? ' is-visible' : ''}`}
            ref={tooltipRef}
            aria-hidden="true"
          >
            <span className="agrid__tooltip-cat">{hovered?.category ?? ''}</span>
            <span className="agrid__tooltip-title">{hovered?.activityTitle ?? ''}</span>
          </div>
        </div>
      </div>

      <div className="agrid__legend">
        <p className="agrid__summary">
          <b>{activeCellCount}</b> squares mapped to <b>{activeFilterCount}</b>{' '}
          {activeFilterCount === 1 ? 'experience' : 'experiences'}
          {filter === 'all' ? '' : ' in view'}
        </p>

        <p className="agrid__scale">
          Less
          <span className="agrid__swatch" style={{ background: 'var(--lvl-1)' }} />
          <span className="agrid__swatch" style={{ background: 'var(--lvl-2)' }} />
          <span className="agrid__swatch" style={{ background: 'var(--lvl-3)' }} />
          <span className="agrid__swatch" style={{ background: 'var(--lvl-4)' }} />
          More
        </p>
      </div>
    </div>
  );
}

export default memo(ActivityGrid);
