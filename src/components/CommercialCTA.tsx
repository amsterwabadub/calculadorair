'use client';

import { useEffect, useRef, useState } from 'react';
import { BRAZIL_OFFER as offer } from '@/config/offers';
import { analytics } from '@/lib/analytics';
import { buildSubId, salaryBandFor, withSubId } from '@/lib/sub-id';

/**
 * First measurable commercial surface, shown directly under the result panel.
 * Renders in a WAITING_FOR_OFFER state until a real destination exists.
 */
export default function CommercialCTA({
  landingPage,
  salary,
}: {
  landingPage: string;
  salary?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [viewed, setViewed] = useState(false);
  const offerState = offer.enabled && offer.url ? 'live' : 'waiting_for_offer';
  const salaryBand = salaryBandFor(salary);

  // Generated per click, not per render: the id identifies the click a partner
  // will settle against, and a render that nobody clicked is not a click.
  const [subId, setSubId] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || viewed) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setViewed(true);
          analytics.trackCommercialCtaView({ offerState, landingPage, salaryBand });
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [viewed, offerState, landingPage]);

  const onClick = () => {
    const id = buildSubId(landingPage, salary);
    setSubId(id);
    let host: string | undefined;
    if (offer.enabled && offer.url) {
      try { host = new URL(offer.url).host; } catch { host = 'invalid_url'; }
    }
    analytics.trackCommercialCtaClick({
      offerState,
      landingPage,
      destinationHost: host,
      subId: id,
      salaryBand,
      commercialModel: offer.commercialModel,
    });
  };

  return (
    <div className="ci-commercial" ref={ref}>
      <p className="ci-commercial__blurb">{offer.blurb}</p>
      {offer.enabled && offer.url ? (
        <a
          className="ci-commercial__btn"
          href={subId ? withSubId(offer.url, offer.subIdParam, subId) : offer.url}
          target="_blank"
          rel="nofollow sponsored noopener noreferrer"
          onClick={onClick}
        >
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
