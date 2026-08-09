import { NextRequest, NextResponse } from 'next/server';
import { getAllLeads, updateLeadStatus } from '@/lib/leads-store';

export async function GET() {
  try {
    const leads = getAllLeads();

    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter((l) => ['qualified', 'sent', 'won'].includes(l.status)).length;
    const wonLeads = leads.filter((l) => l.status === 'won').length;
    const totalRevenue = leads.reduce((acc, l) => acc + (l.revenue || 0), 0);
    const totalCommission = leads.reduce((acc, l) => acc + (l.commissionRevenue || 0), 0);

    return NextResponse.json({
      leads,
      metrics: {
        totalLeads,
        qualifiedLeads,
        wonLeads,
        totalRevenue,
        totalCommission,
        qualificationRate: totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) + '%' : '0%',
        winRate: qualifiedLeads > 0 ? ((wonLeads / qualifiedLeads) * 100).toFixed(1) + '%' : '0%',
        avgRevenuePerLead: totalLeads > 0 ? (totalRevenue / totalLeads).toFixed(2) : '0.00',
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Erro ao buscar lista de leads.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, partner, revenue, commissionRevenue } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID do lead é obrigatório.' }, { status: 400 });
    }

    const updated = updateLeadStatus(id, {
      ...(status ? { status } : {}),
      ...(partner !== undefined ? { partner } : {}),
      ...(revenue !== undefined ? { revenue: Number(revenue) } : {}),
      ...(commissionRevenue !== undefined ? { commissionRevenue: Number(commissionRevenue) } : {}),
    });

    if (!updated) {
      return NextResponse.json({ error: 'Lead não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error('Error updating lead status:', error);
    return NextResponse.json({ error: 'Erro ao atualizar lead.' }, { status: 500 });
  }
}
