import fs from 'fs';
import path from 'path';

export interface LeadRecord {
  id: string;
  createdAt: string;
  name: string;
  whatsapp: string;
  email?: string;
  cityState: string;
  helpType: string;
  consent: boolean;
  source: string;
  medium: string;
  campaign: string;
  landingPage: string;
  firstLandingPage: string;
  referrer: string;
  gclid?: string;
  gaClientId?: string;
  status: 'new' | 'contacted' | 'qualified' | 'sent' | 'won' | 'lost';
  partner?: string | null;
  revenue?: number;
  commissionRevenue?: number;
  currency: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

function ensureDataDirExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getAllLeads(): LeadRecord[] {
  try {
    ensureDataDirExists();
    if (!fs.existsSync(LEADS_FILE)) {
      return [];
    }
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(raw) as LeadRecord[];
  } catch (err) {
    console.error('Error reading leads file:', err);
    return [];
  }
}

export function saveLead(leadData: Omit<LeadRecord, 'id' | 'createdAt' | 'status' | 'currency'>): LeadRecord {
  ensureDataDirExists();
  const leads = getAllLeads();

  const newLead: LeadRecord = {
    ...leadData,
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: 'new',
    partner: null,
    revenue: 0,
    commissionRevenue: 0,
    currency: 'BRL',
  };

  leads.unshift(newLead);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  return newLead;
}

export function updateLeadStatus(
  id: string,
  updates: Partial<Pick<LeadRecord, 'status' | 'partner' | 'revenue' | 'commissionRevenue'>>
): LeadRecord | null {
  ensureDataDirExists();
  const leads = getAllLeads();
  const index = leads.findIndex((l) => l.id === id);

  if (index === -1) {
    return null;
  }

  leads[index] = {
    ...leads[index],
    ...updates,
  };

  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  return leads[index];
}
