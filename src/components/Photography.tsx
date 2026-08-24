import { useCallback, useEffect, useState } from 'react';
import Lightbox from './Lightbox';
import { photographs, type Photograph } from '../data/photographs';
import { useParallax } from '../hooks/useParallax';
import { useReveal } from '../hooks/useReveal';

const pad = (value: number): string => String(value).padStart(2, '0');

interface ItemProps {
  photo: Photograph;
  position: number;
  onOpen: (index: number) => void;
}

function GalleryItem({ photo, position, onOpen }: ItemProps): JSX.Element {
  const img = useParallax<HTMLImageElement>(photo.parallax);
  const [loaded, setLoaded] = useState(false);

  // Cached images can finish before React attaches onLoad.
  useEffect(() => {
    if (img.current?.complete) setLoaded(true);
  }, [img]);

  return (
    <figure className="gallery__item" data-span={photo.span}>
      <button
        type="button"
        className="gallery__btn"
        onClick={() => onOpen(position)}
        aria-label={`Open ${photo.title}, ${photo.location}, ${photo.date}`}
      >
        <span className="gallery__frame">
          <img
            ref={img}
            className={`gallery__img${loaded ? ' is-loaded' : ''}`}
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={`${photo.title} — ${photo.location}, ${photo.date}`}
            loading={position < 2 ? 'eager' : 'lazy'}
            decoding="async"
            sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
            onLoad={() => setLoaded(true)}
          />
        </span>

        <figcaption className="gallery__caption">
          <span className="gallery__caption-main">
            <span className="gallery__title">{photo.title}</span>
            <span className="gallery__meta">
              {photo.location} · {photo.date}
            </span>
          </span>
          <span className="gallery__idx" aria-hidden="true">
            {pad(position + 1)}
          </span>
        </figcaption>
      </button>
    </figure>
  );
}

export default function Photography(): JSX.Element {
  const head = useReveal<HTMLDivElement>();
  const grid = useReveal<HTMLDivElement>(60);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const onOpen = useCallback((index: number) => setOpenIndex(index), []);
  const onClose = useCallback(() => setOpenIndex(null), []);

  return (
    <section className="section" id="photography" aria-labelledby="photography-title">
      <div className="shell">
        <div className="section-head" ref={head}>
          <span className="section-index">05</span>
          <h2 className="section-title" id="photography-title">
            Photography
          </h2>
          <span className="section-note">{photographs.length} frames</span>
        </div>

        <div className="gallery" ref={grid}>
          {photographs.map((photo, index) => (
            <GalleryItem key={photo.id} photo={photo} position={index} onOpen={onOpen} />
          ))}
        </div>

        <p className="gallery__note">
          <span>Selected frames · {photographs.length} images</span>
          <span aria-hidden="true">Click any frame to enlarge</span>
        </p>
      </div>

      {openIndex !== null ? (
        <Lightbox
          photos={photographs}
          index={openIndex}
          onClose={onClose}
          onNavigate={setOpenIndex}
        />
      ) : null}
    </section>
  );
}
