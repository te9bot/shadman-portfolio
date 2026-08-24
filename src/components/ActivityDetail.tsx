import { useCallback, useRef } from 'react';
import { activities, activityById, type FilterKey } from '../data/activities';
import { useReveal } from '../hooks/useReveal';

interface Props {
  filter: FilterKey;
  selectedId: string;
  onSelect: (activityId: string, source: 'list') => void;
}

/**
 * Editorial detail view. Shows category, title and description — and nothing
 * else. No grades, hours, weeks or continuation metadata exist in the model.
 */
export default function ActivityDetail({ filter, selectedId, onSelect }: Props): JSX.Element {
  const wrap = useReveal<HTMLDivElement>();
  const listRef = useRef<HTMLDivElement>(null);
  const selected = activityById.get(selectedId) ?? activities[0];

  /** Arrow-key navigation for the tablist, per the WAI-ARIA tabs pattern. */
  const onListKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const index = activities.findIndex((activity) => activity.id === selectedId);
      let next = index;

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          next = (index + 1) % activities.length;
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          next = (index - 1 + activities.length) % activities.length;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = activities.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      const target = activities[next];
      onSelect(target.id, 'list');
      listRef.current
        ?.querySelector<HTMLButtonElement>(`#tab-${target.id}`)
        ?.focus();
    },
    [onSelect, selectedId],
  );

  return (
    <section className="section" id="activity-detail" aria-labelledby="activity-detail-title">
      <div className="shell">
        <div className="section-head">
          <span className="section-index">03</span>
          <h2 className="section-title" id="activity-detail-title">
            Activity Details
          </h2>
          <span className="section-note">
            {selected.index} / {String(activities.length).padStart(2, '0')}
          </span>
        </div>

        <div className="adetail" ref={wrap}>
          <div
            className="adetail__list"
            role="tablist"
            aria-label="Activities"
            aria-orientation="vertical"
            ref={listRef}
            onKeyDown={onListKeyDown}
          >
            {activities.map((activity) => {
              const current = activity.id === selectedId;
              const muted = filter !== 'all' && activity.filter !== filter;
              return (
                <button
                  key={activity.id}
                  type="button"
                  role="tab"
                  id={`tab-${activity.id}`}
                  aria-selected={current}
                  aria-controls="activity-panel"
                  aria-current={current ? 'true' : undefined}
                  tabIndex={current ? 0 : -1}
                  className={`adetail__item${muted ? ' is-muted' : ''}`}
                  onClick={() => onSelect(activity.id, 'list')}
                >
                  <span className="adetail__num">{activity.index}</span>
                  <span className="adetail__name">{activity.title}</span>
                </button>
              );
            })}
          </div>

          <div
            className="adetail__panel"
            role="tabpanel"
            id="activity-panel"
            aria-labelledby={`tab-${selected.id}`}
            aria-live="polite"
            tabIndex={-1}
          >
            <span className="adetail__index" aria-hidden="true">
              {selected.index}
            </span>

            {/* keyed so the entrance animation replays on every change */}
            <div className="adetail__body" key={selected.id}>
              <p className="adetail__category">{selected.category}</p>
              <h3 className="adetail__title">{selected.title}</h3>
              <p className="adetail__text">{selected.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
