import { SamplePreset } from '../types/complaint';

export const SAMPLE_COMPLAINTS: SamplePreset[] = [
  {
    id: 'sample-1',
    title: 'Sterile Injectable Particulate Defect',
    fileName: 'Complaint_Doc_REF-8842_Sterile_Vial.pdf',
    category: 'Injectables / Parenterals',
    rawText: `URGENT QUALITY ALERT & CUSTOMER COMPLAINT REPORT
From: Metro General Hospital Pharmacy - Quality Assurance Department
Customer Name: Dr. Eleanor Vance (Chief Pharmacist)
Date of Complaint: August 02, 2026
Source: Hospital Clinical Pharmacy

Product Identification:
Product Name: Ceftriaxone Sodium for Injection USP
Strength / Grade: 1g / Vial (Sterile Grade API)
Batch / Lot Number: LOT-2026-B9042
Manufacturing Date: 2026-03-15
Expiry Date: 2028-03-14
Quantity Affected: 120 Vials (Box 14 of Shipment #SH-9921)

Incident & Defect Description:
During routine reconstitution preparation in the laminar flow cleanroom hood for IV administration, hospital pharmacists observed visible translucent sub-visible/visible particulate matter floating inside intact unopened vials of Ceftriaxone Sodium 1g (Lot B9042). 2 out of 10 vials inspected from the same carton exhibited fibers/glass-like speck particles upon illumination.

Initial Severity Assessment: Critical
Priority Level: High
Reported Complaint Type: Sub-visible / Foreign Particulate Matter Defect in Parenteral Formulation`,
    parsedData: {
      complaintSource: 'Hospital Clinical Pharmacy - Metro General',
      customerName: 'Dr. Eleanor Vance (Chief Pharmacist)',
      customerContact: 'evance@metrohospital.org | +1-555-019-4821',
      productName: 'Ceftriaxone Sodium for Injection USP',
      productStrengthGrade: '1g / Vial (Sterile Grade)',
      batchLotNumber: 'LOT-2026-B9042',
      manufacturingDate: '2026-03-15',
      expiryDate: '2028-03-14',
      quantityAffected: '120 vials (12 boxes)',
      complaintType: 'Particulate Contamination / Parenteral Defect',
      complaintDate: '2026-08-02',
      detailedDescription: 'Visible translucent fiber and particulate matter observed in unopened reconstitutable Ceftriaxone 1g vials under cleanroom illumination during pre-administration checks.',
      initialSeverity: 'Critical',
      priority: 'High',
      status: 'Pending Triage'
    }
  },
  {
    id: 'sample-2',
    title: 'Tablet Discoloration & Capping in Oral Solid Batch',
    fileName: 'Email_Complaint_Amoxicillin_500mg.eml',
    category: 'Oral Solid Dosage (FDF)',
    rawText: `CUSTOMER FEEDBACK EMAIL
To: qms-complaints@pharmaglobal.com
From: Apex Wholesale Distributors (Quality Control Unit)
Customer Name: Mark Sterling (Quality Director)
Complaint Date: August 01, 2026

Product Info:
Product Name: Amoxicillin Trihydrate Capsules / Tablets
Strength: 500mg Film-Coated Tablets
Batch Number: BATCH-AMX-7731
MFG Date: 2025-11-10
EXP Date: 2027-11-09
Quantity Affected: 4,500 Tablets (3 Bulk Drum Containers)

Defect Details:
Customer received batch AMX-7731 and reported dark yellowish spot discoloration on film coating across multiple blister strips, along with tablet capping/cleavage during automated packaging line feeding. Approximately 8% of inspected tablets failed visual aesthetic inspection.

Initial Severity: Major
Priority: High
Type: Coating Defect & Physical Tablet Integrity Failure`,
    parsedData: {
      complaintSource: 'Wholesale Distributor QC - Apex Wholesale',
      customerName: 'Mark Sterling (Quality Director)',
      customerContact: 'msterling@apexpharm.com',
      productName: 'Amoxicillin Trihydrate Film-Coated Tablets',
      productStrengthGrade: '500mg USP',
      batchLotNumber: 'BATCH-AMX-7731',
      manufacturingDate: '2025-11-10',
      expiryDate: '2027-11-09',
      quantityAffected: '4500 Tablets (3 Bulk Containers)',
      complaintType: 'Discoloration & Tablet Capping Defect',
      complaintDate: '2026-08-01',
      detailedDescription: 'Dark yellowish spotting on film coating and capping failure during high-speed blister packaging of Amoxicillin 500mg tablets.',
      initialSeverity: 'Major',
      priority: 'High',
      status: 'Pending Triage'
    }
  },
  {
    id: 'sample-3',
    title: 'Blister Package Seal Breach (Moisture Damage)',
    fileName: 'Customer_Report_Omeprazole_Packaging.docx',
    category: 'Packaging & Container Closure',
    rawText: `PHARMACEUTICAL COMPLAINT FORM
Source: Regional Retail Pharmacy Chain (BioCare Rx)
Customer Name: Sarah Jenkins (RPh)
Date: July 30, 2026

Product: Omeprazole Delayed-Release Capsules
Strength: 20mg Hard Gelatin Capsules
Batch No: OMP-2026-092
MFG: 2026-01-20
EXP: 2028-01-19
Quantity: 300 Blister Cards

Defect: Inadequate heat seal along the ALU-ALU blister pockets resulting in humidity exposure and degraded/softened capsule shells in Lot OMP-2026-092.

Initial Severity: Minor
Priority: Medium
Complaint Type: Packaging / Seal Integrity Breach`,
    parsedData: {
      complaintSource: 'Regional Retail Pharmacy - BioCare Rx',
      customerName: 'Sarah Jenkins (RPh)',
      customerContact: 'sjenkins@biocarerx.com',
      productName: 'Omeprazole Delayed-Release Capsules',
      productStrengthGrade: '20mg DR',
      batchLotNumber: 'OMP-2026-092',
      manufacturingDate: '2026-01-20',
      expiryDate: '2028-01-19',
      quantityAffected: '300 Blister Cards',
      complaintType: 'Blister Heat-Seal Breach / Moisture Ingress',
      complaintDate: '2026-07-30',
      detailedDescription: 'Inadequate heat seal on ALU-ALU foil blisters caused moisture ingress resulting in capsule degradation.',
      initialSeverity: 'Minor',
      priority: 'Medium',
      status: 'Pending Triage'
    }
  }
];
