/**
 * SGS Gundu Palav — WhatsApp Click-to-Chat Helper
 * Routes all enquiry forms to the same receiving number: +91 9341246466
 */

const WA_NUMBER = '919341246466';
const BRAND_NAME = 'SGS GUNDU PALAV';

/** Opens WhatsApp in a new tab with the pre-filled enquiry message. */
export function openWhatsApp(message: string): void {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank', 'noopener,noreferrer');
}

// ─── Type definitions ─────────────────────────────────────────────────────────

export interface FranchiseApplicationData {
  name: string;
  phone: string;
  email: string;
  city: string;
  property: string;
  notes?: string;
}

export interface CateringContactData {
  name: string;
  phone: string;
  email?: string;
  outlet: string;
  message?: string;
}

export interface FranchiseProspectusData {
  name: string;
  phone: string;
  email: string;
  city: string;
  property: string;
  notes?: string;
}

// ─── 1. Franchise Application (FranchiseModal) ───────────────────────────────
export function buildFranchiseApplicationMessage(data: FranchiseApplicationData): string {
  const propertyStatus =
    data.property === 'yes'
      ? 'Yes – commercial property identified'
      : 'No – seeking site assessment support';

  const lines = [
    BRAND_NAME,
    'Franchise Application Request',
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Preferred City / Locality: ${data.city}`,
    `Commercial Property: ${propertyStatus}`,
  ];

  if (data.notes && data.notes.trim()) {
    lines.push(`Notes: ${data.notes.trim()}`);
  }

  return lines.join('\n');
}

// ─── 2. Contact & Bulk Festive Catering (ContactPage) ────────────────────────
export function buildCateringContactMessage(data: CateringContactData): string {
  const lines = [
    BRAND_NAME,
    'Complaint & General Enquiry',
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
  ];

  if (data.email && data.email.trim()) {
    lines.push(`Email: ${data.email.trim()}`);
  }

  lines.push(`Preferred Outlet: ${data.outlet}`);

  if (data.message && data.message.trim()) {
    lines.push(`Message: ${data.message.trim()}`);
  }

  return lines.join('\n');
}

// ─── 3. Franchise Prospectus Request (FranchisePage) ─────────────────────────
export function buildProspectusRequestMessage(data: FranchiseProspectusData): string {
  const propertyStatus =
    data.property === 'yes'
      ? 'Yes – location identified'
      : 'No – seeking site recommendation';

  const lines = [
    BRAND_NAME,
    'Franchise Prospectus Request',
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Preferred City / Locality: ${data.city}`,
    `Commercial Property: ${propertyStatus}`,
  ];

  if (data.notes && data.notes.trim()) {
    lines.push(`Notes: ${data.notes.trim()}`);
  }

  return lines.join('\n');
}
