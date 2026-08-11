/**
 * Commercial offer for Brazil.
 *
 * There is NO signed partner or affiliate today, so this is disabled and the
 * destination is null. The CTA still renders and still emits
 * commercial_cta_view / commercial_cta_click, so demand can be measured before
 * anyone is signed — but it links nowhere, names no partner and promises no
 * callback. No personal data is collected.
 *
 * To activate: set enabled: true and supply a real url. Nothing else changes.
 */
export interface MarketOffer {
  enabled: boolean;
  url: string | null;
  label: string;
  blurb: string;
  pendingNote: string;
}

export const BRAZIL_OFFER: MarketOffer = {
  enabled: false,
  url: null,
  label: 'Ver opções para declarar seu IR',
  blurb: 'Precisa de ajuda com a declaração ou com um caso mais complexo?',
  pendingNote:
    'Ainda estamos avaliando parceiros contábeis verificados. Nenhuma recomendação está disponível no momento.',
};
