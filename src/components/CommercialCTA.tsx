'use client';

import { useEffect, useRef, useState } from 'react';
import { BRAZIL_OFFER as offer } from '@/config/offers';
import { analytics } from '@/lib/analytics';

/**
 * First measurable commercial surface, shown directly under the result panel.
 * Renders in a WAITING_FOR_OFFER state until a real destination exists.
 */
export default function CommercialCTA({ landingPage }: { landingPage: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [viewed, setViewed] = useState(false);
  const offerState = offer.enabled && offer.url ? 'live' : 'waiting_for_offer';

  useEffect(() => {
    const el = ref.current;
    if (!el || viewed) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setViewed(true);
          analytics.trackCommercialCtaView({ offerState, landingPage });
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [viewed, offerState, landingPage]);

  const onClick = () => {
    let host: string | undefined;
    if (offer.enabled && offer.url) {
      try { host = new URL(offer.url).host; } catch { host = 'invalid_url'; }
    }
    analytics.trackCommercialCtaClick({ offerState, landingPage, destinationHost: host });
  };

  return (
    <div className="ci-commercial" ref={ref}>
      <p className="ci-commercial__blurb">{offer.blurb}</p>
      {offer.enabled && offer.url ? (
        <a className="ci-commercial__btn" href={offer.url} target="_blank"
           rel="nofollow sponsored noopener noreferrer" onClick={onClick}>
          {offer.label}
        </a>
      ) : (
        <>
          <button type="button" className="ci-commercial__btn ci-commercial__btn--pending" onClick={onClick}>
            {offer.label}
          </button>
          <p className="ci-commercial__pending" role="status">{offer.pendingNote}</p>
        </>
      )}
    </div>
  );
}
