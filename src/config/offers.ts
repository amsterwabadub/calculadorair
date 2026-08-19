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
  /**
   * Query parameter the partner reads the sub-id from. Networks disagree —
   * subid, sub_id, aff_sub, utm_content — so this is configuration rather than
   * a constant, and signing a partner should not require a code change.
   */
  subIdParam: string;
  /** Recorded on every click so the analytics can be read without the contract. */
  commercialModel: 'cpl' | 'cpa' | 'revshare' | 'none';
}

export const BRAZIL_OFFER: MarketOffer = {
  enabled: false,
  url: null,
  label: 'Ver opções para declarar seu IR',
  blurb: 'Precisa de ajuda com a declaração ou com um caso mais complexo?',
  pendingNote:
    'Ainda estamos avaliando parceiros contábeis verificados. Nenhuma recomendação está disponível no momento.',
  subIdParam: 'subid',
  commercialModel: 'none',
};
