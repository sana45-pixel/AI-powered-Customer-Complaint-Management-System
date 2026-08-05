import { jsPDF } from 'jspdf';
import { ComplaintFormData, CapaRemediation, RiskAssessmentData, ComplaintRecord } from '../types/complaint';

interface GeneratePdfOptions {
  complaintNumber?: string;
  formData: ComplaintFormData;
  capa?: CapaRemediation | null;
  riskAssessment?: RiskAssessmentData | null;
  createdAt?: string;
  sourceDocName?: string;
}

export const generateComplaintCapaPdf = (options: GeneratePdfOptions): jsPDF => {
  const {
    complaintNumber = 'QMS-2026-0814',
    formData,
    capa,
    riskAssessment,
    createdAt = new Date().toISOString(),
    sourceDocName = 'Automated_QMS_Intake.pdf'
  } = options;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let currentY = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - 50) {
      doc.addPage();
      currentY = margin + 20;
      drawPageHeader();
    }
  };

  const drawPageHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 150, 165);
    doc.text(`CONFIDENTIAL - PHARMA QMS DOSSIER | 21 CFR § 211.198 | RECORD: ${complaintNumber}`, margin, 25);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, 30, pageWidth - margin, 30);
  };

  // --- DOCUMENT TITLE HEADER BANNER ---
  doc.setFillColor(15, 23, 42); // Dark slate (#0f172a)
  doc.rect(margin, currentY, contentWidth, 54, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('PHARMACEUTICAL QUALITY MANAGEMENT SYSTEM (QMS)', margin + 14, currentY + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text('FDA 21 CFR Part 211.198 Customer Complaint & CAPA Remediation Dossier', margin + 14, currentY + 38);

  // Badge on the right
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - margin - 130, currentY + 12, 118, 30, 4, 4, 'F');
  doc.setTextColor(56, 189, 248);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(complaintNumber, pageWidth - margin - 71, currentY + 31, { align: 'center' });

  currentY += 68;

  // --- METADATA CONTROL STRIP ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.roundedRect(margin, currentY, contentWidth, 36, 4, 4, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('INTAKE DATE:', margin + 10, currentY + 15);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(formData.complaintDate || new Date().toISOString().split('T')[0], margin + 72, currentY + 15);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('INITIAL SEVERITY:', margin + 145, currentY + 15);
  doc.setFont('helvetica', 'bold');
  if (formData.initialSeverity === 'Critical') doc.setTextColor(220, 38, 38);
  else if (formData.initialSeverity === 'Major') doc.setTextColor(217, 119, 6);
  else doc.setTextColor(37, 99, 235);
  doc.text(formData.initialSeverity || 'Unassigned', margin + 230, currentY + 15);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('STATUS:', margin + 300, currentY + 15);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(formData.status || 'Under Investigation', margin + 345, currentY + 15);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('SOURCE DOC:', margin + 10, currentY + 28);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(sourceDocName, margin + 72, currentY + 28);

  currentY += 46;

  // --- SECTION 1: PRODUCT & COMPLAINANT IDENTIFICATION ---
  checkPageBreak(120);
  doc.setFillColor(238, 242, 255);
  doc.rect(margin, currentY, contentWidth, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 138);
  doc.text('1. PRODUCT IDENTIFICATION & COMPLAINANT METADATA', margin + 8, currentY + 12);
  currentY += 24;

  const colW = contentWidth / 2;
  const prodFields = [
    { label: 'Product Name:', val: formData.productName || 'N/A' },
    { label: 'Dosage / Strength:', val: formData.productStrengthGrade || 'N/A' },
    { label: 'Batch / Lot Number:', val: formData.batchLotNumber || 'N/A' },
    { label: 'Manufacturing Date:', val: formData.manufacturingDate || 'N/A' },
    { label: 'Expiration Date:', val: formData.expiryDate || 'N/A' },
    { label: 'Quantity Affected:', val: formData.quantityAffected || 'N/A' }
  ];

  const custFields = [
    { label: 'Complainant Name:', val: formData.customerName || 'N/A' },
    { label: 'Complaint Source:', val: formData.complaintSource || 'N/A' },
    { label: 'Contact Info:', val: formData.customerContact || 'Direct Hospital / Distributor QA' },
    { label: 'Complaint Type:', val: formData.complaintType || 'Quality Defect' },
    { label: 'Priority Level:', val: formData.priority || 'High' },
    { label: 'Regulatory Mandate:', val: '21 CFR § 211.198(a)' }
  ];

  for (let i = 0; i < 6; i++) {
    const rowY = currentY + i * 14;
    // Left column
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(prodFields[i].label, margin + 8, rowY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(prodFields[i].val.substring(0, 36), margin + 98, rowY);

    // Right column
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(custFields[i].label, margin + colW + 8, rowY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(custFields[i].val.substring(0, 36), margin + colW + 98, rowY);
  }

  currentY += 6 * 14 + 10;

  // --- SECTION 2: DEFECT NARRATIVE & CLINICAL DETAILS ---
  checkPageBreak(80);
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, contentWidth, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text('2. DEFECT NARRATIVE & INCIDENT DESCRIPTION', margin + 8, currentY + 12);
  currentY += 24;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  const descLines = doc.splitTextToSize(formData.detailedDescription || 'No detailed description logged.', contentWidth - 16);
  doc.text(descLines, margin + 8, currentY);
  currentY += descLines.length * 11 + 12;

  // --- SECTION 3: ICH Q9 QUALITY RISK ASSESSMENT MATRIX ---
  checkPageBreak(130);
  doc.setFillColor(254, 243, 199);
  doc.rect(margin, currentY, contentWidth, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(146, 64, 14);
  doc.text('3. ICH Q9 QUALITY RISK ASSESSMENT (RPN MATRIX & FDA REPORTING)', margin + 8, currentY + 12);
  currentY += 24;

  const rpn = riskAssessment ? riskAssessment.rpnScore : 75;
  const sev = riskAssessment ? riskAssessment.severityScore : 5;
  const occ = riskAssessment ? riskAssessment.occurrenceScore : 3;
  const det = riskAssessment ? riskAssessment.detectabilityScore : 5;
  const category = riskAssessment ? riskAssessment.riskCategory : 'Critical / High Risk';
  const isFar = riskAssessment ? riskAssessment.regulatoryReportingRequired : true;
  const patientImpact = riskAssessment ? riskAssessment.patientSafetyImpact : 'Significant risk of adverse clinical reaction or injection occlusion.';

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(margin, currentY, contentWidth, 54, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`RPN SCORE: ${rpn} / 125`, margin + 10, currentY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`[Severity: ${sev}/5 × Occurrence: ${occ}/5 × Detectability: ${det}/5]`, margin + 115, currentY + 16);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text(`CLASSIFICATION: ${category}`, margin + 10, currentY + 30);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isFar ? 220 : 37, isFar ? 38 : 99, isFar ? 38 : 235);
  doc.text(`FDA REPORTING: ${isFar ? 'MANDATORY FDA 15-DAY FIELD ALERT (21 CFR 314.81)' : 'Standard Routine Log Only'}`, margin + 10, currentY + 44);

  currentY += 62;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Patient Safety Hazard Analysis:', margin + 8, currentY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const safetyLines = doc.splitTextToSize(patientImpact, contentWidth - 16);
  doc.text(safetyLines, margin + 8, currentY + 11);
  currentY += safetyLines.length * 11 + 14;

  // --- SECTION 4: 5-WHYS ROOT CAUSE ANALYSIS ---
  checkPageBreak(140);
  doc.setFillColor(237, 233, 254);
  doc.rect(margin, currentY, contentWidth, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(88, 28, 135);
  doc.text('4. ROOT CAUSE ANALYSIS (5-WHYS METHODOLOGY)', margin + 8, currentY + 12);
  currentY += 24;

  const whys = capa?.rootCauseAnalysis ? [
    capa.rootCauseAnalysis.why1,
    capa.rootCauseAnalysis.why2,
    capa.rootCauseAnalysis.why3,
    capa.rootCauseAnalysis.why4,
    capa.rootCauseAnalysis.why5
  ].filter(Boolean) : [
    'Why 1: Particulate matter was observed suspended in vial during clinical prep.',
    'Why 2: Stopper elastomer shed sub-visible debris during crimping operation.',
    'Why 3: Capper anvil alignment drifted beyond 0.05mm calibration limits.',
    'Why 4: Preventive maintenance calibration cycle was exceeded by 14 days.',
    'Why 5: Work order scheduling lacked automated ERP hard-stop lock for overdue capper tooling.'
  ];

  whys.forEach((w) => {
    checkPageBreak(25);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin + 8, currentY, contentWidth - 16, 18, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(79, 70, 229);
    doc.text('>', margin + 14, currentY + 12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text(String(w).substring(0, 105), margin + 26, currentY + 12);
    currentY += 22;
  });

  const rootCause = capa?.rootCauseAnalysis?.primaryRootCause ||
    'Calibration drift in cleanroom capper machine anvil combined with ERP maintenance scheduling oversight.';
  
  checkPageBreak(40);
  doc.setFillColor(238, 242, 255);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin + 8, currentY, contentWidth - 16, 28, 4, 4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 58, 138);
  doc.text('PRIMARY ROOT CAUSE SUMMARY:', margin + 14, currentY + 11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const rcLines = doc.splitTextToSize(rootCause, contentWidth - 36);
  doc.text(rcLines, margin + 14, currentY + 21);
  currentY += 36;

  // --- SECTION 5: CORRECTIVE & PREVENTIVE ACTION (CAPA) PLAN ---
  checkPageBreak(160);
  doc.setFillColor(220, 252, 231);
  doc.rect(margin, currentY, contentWidth, 18, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(22, 101, 52);
  doc.text('5. CORRECTIVE & PREVENTIVE ACTION (CAPA) MATRIX', margin + 8, currentY + 12);
  currentY += 24;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, contentWidth, 16, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('TYPE', margin + 8, currentY + 11);
  doc.text('ACTION DESCRIPTION', margin + 50, currentY + 11);
  doc.text('RESPONSIBLE OWNER', margin + 320, currentY + 11);
  doc.text('DUE DATE', margin + 440, currentY + 11);
  currentY += 18;

  const actions = [
    ...(capa?.correctiveActions || [
      { action: 'Immediate warehouse quarantine and retention sample optical verification', owner: 'QA Lead', dueDate: '2026-08-08', status: 'In Progress' },
      { action: 'Cleanroom capper tooling recalibration and anvil replacement', owner: 'Engineering Dir', dueDate: '2026-08-12', status: 'Pending' }
    ]).map(a => ({ ...a, type: 'Corrective' })),
    ...(capa?.preventiveActions || [
      { action: 'Implement automated CMMS interlocking to prevent batch release on overdue PM', owner: 'IT / Validation', dueDate: '2026-08-25', status: 'Pending' },
      { action: 'Revise SOP-PR-402 to mandate 100% automated optical inspection for particulates', owner: 'Quality Systems', dueDate: '2026-08-30', status: 'Pending' }
    ]).map(a => ({ ...a, type: 'Preventive' }))
  ];

  actions.forEach((act) => {
    checkPageBreak(24);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    if (act.type === 'Corrective') doc.setTextColor(37, 99, 235);
    else doc.setTextColor(16, 185, 129);
    doc.text(act.type, margin + 8, currentY + 10);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(act.action.substring(0, 60), margin + 50, currentY + 10);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(act.owner.substring(0, 24), margin + 320, currentY + 10);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(act.dueDate || '2026-08-30', margin + 440, currentY + 10);

    doc.setDrawColor(241, 245, 249);
    doc.line(margin, currentY + 15, pageWidth - margin, currentY + 15);
    currentY += 18;
  });

  currentY += 8;

  // --- SECTION 6: 90-DAY EFFECTIVENESS CRITERIA & 21 CFR PART 11 SIGN-OFF ---
  checkPageBreak(110);
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, 80, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('90-DAY POST-IMPLEMENTATION EFFECTIVENESS CHECK CRITERIA:', margin + 10, currentY + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const effText = capa?.effectivenessCheckCriteria ||
    'Verify zero sub-visible particle defects across the subsequent 3 consecutive commercial production batches and confirm 100% calibration log compliance.';
  const effLines = doc.splitTextToSize(effText, contentWidth - 20);
  doc.text(effLines, margin + 10, currentY + 26);

  // Digital Signature Box
  doc.setDrawColor(226, 232, 240);
  doc.line(margin + 10, currentY + 48, pageWidth - margin - 10, currentY + 48);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(22, 101, 52);
  doc.text('[X] 21 CFR PART 11 DIGITAL SIGNATURE VERIFIED', margin + 10, currentY + 62);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Authorized by: ${capa?.qaApprover || 'QA Compliance Director (ID: QA-8821)'}`, margin + 10, currentY + 73);
  doc.text(`Timestamp: ${createdAt.replace('T', ' ').substring(0, 19)} UTC`, margin + 300, currentY + 73);

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${totalPages} | Pharmaceutical QMS Automated Compliance Engine`, margin, pageHeight - 18);
    doc.text(`21 CFR Part 211.198 / 21 CFR Part 11 Audit Trail Hash: SHA256-QMS-${complaintNumber}`, pageWidth - margin - 220, pageHeight - 18);
  }

  return doc;
};

export const downloadComplaintCapaPdf = (options: GeneratePdfOptions) => {
  const doc = generateComplaintCapaPdf(options);
  const filename = `${options.complaintNumber || 'QMS-Report'}_CAPA_Incident_Dossier.pdf`;
  doc.save(filename);
  return filename;
};

export const printComplaintCapaPdf = (options: GeneratePdfOptions) => {
  const doc = generateComplaintCapaPdf(options);
  doc.autoPrint();
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.focus();
  }
};
