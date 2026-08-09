import { NextRequest, NextResponse } from 'next/server';
import { saveLead } from '@/lib/leads-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      whatsapp,
      email,
      cityState,
      helpType,
      consent,
      source,
      medium,
      campaign,
      landingPage,
      firstLandingPage,
      referrer,
      gclid,
      gaClientId,
    } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 });
    }

    if (!whatsapp || typeof whatsapp !== 'string' || whatsapp.trim().length < 8) {
      return NextResponse.json({ error: 'WhatsApp para contato é obrigatório.' }, { status: 400 });
    }

    if (!cityState || typeof cityState !== 'string' || cityState.trim().length < 2) {
      return NextResponse.json({ error: 'Cidade / Estado é obrigatório.' }, { status: 400 });
    }

    if (!helpType || typeof helpType !== 'string') {
      return NextResponse.json({ error: 'Tipo de ajuda é obrigatório.' }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json(
        { error: 'É necessário concordar com os termos de contato (LGPD).' },
        { status: 400 }
      );
    }

    const savedLead = saveLead({
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      email: email ? String(email).trim() : '',
      cityState: cityState.trim(),
      helpType: helpType.trim(),
      consent: Boolean(consent),
      source: source || 'direct',
      medium: medium || 'none',
      campaign: campaign || '(not set)',
      landingPage: landingPage || '/',
      firstLandingPage: firstLandingPage || '/',
      referrer: referrer || '',
      gclid: gclid || '',
      gaClientId: gaClientId || '',
    });

    return NextResponse.json({
      success: true,
      leadId: savedLead.id,
      message: 'Solicitação registrada com sucesso.',
    });
  } catch (error) {
    console.error('Error processing lead submit:', error);
    return NextResponse.json({ error: 'Erro interno ao salvar solicitação.' }, { status: 500 });
  }
}
