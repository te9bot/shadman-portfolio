import { useMemo } from 'react';
import ActivityGrid from './ActivityGrid';
import { activities, activityFilters, type FilterKey } from '../data/activities';
import { useReveal } from '../hooks/useReveal';

interface Props {
  filter: FilterKey;
  onFilterChange: (filter: FilterKey) => void;
  selectedId: string;
  onSelect: (activityId: string, source: 'grid') => void;
}

export default function Activities({
  filter,
  onFilterChange,
  selectedId,
  onSelect,
}: Props): JSX.Element {
  const head = useReveal<HTMLDivElement>();
  const controls = useReveal<HTMLDivElement>(60);
  const panel = useReveal<HTMLDivElement>(120);

  const counts = useMemo(() => {
    const map = new Map<FilterKey, number>([['all', activities.length]]);
    for (const activity of activities) {
      map.set(activity.filter, (map.get(activity.filter) ?? 0) + 1);
    }
    return map;
  }, []);

  return (
    <section className="section" id="activities" aria-labelledby="activities-title">
      <div className="shell">
        <div className="section-head" ref={head}>
          <span className="section-index">02</span>
          <h2 className="section-title" id="activities-title">
            Activities &amp; Experiences
          </h2>
          <span className="section-note">Ten commitments</span>
        </div>

        <div ref={controls}>
          <div className="filters" role="group" aria-label="Filter activities by category">
            {activityFilters.map((item) => (
              <button
                key={item.key}
                type="button"
                className="filters__chip"
                aria-pressed={filter === item.key}
                onClick={() => onFilterChange(item.key)}
              >
                {item.label}
                <span className="filters__count">{counts.get(item.key) ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        <div ref={panel}>
          <ActivityGrid filter={filter} selectedId={selectedId} onSelect={onSelect} />
        </div>
      </div>
    </section>
  );
}
