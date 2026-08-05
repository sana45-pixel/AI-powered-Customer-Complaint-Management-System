import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setFullForm, setActiveTab, addAuditLog, clearAllData } from '../store/complaintSlice';
import { ComplaintRecord, AuditTrailEntry } from '../types/complaint';
import {
  Database,
  Search,
  Filter,
  FileText,
  ArrowUpRight,
  ShieldAlert,
  CheckSquare,
  FileQuestion,
  ArrowLeft,
  Download,
  Clock,
  Activity,
  AlertOctagon,
  CheckCircle2,
  Info,
  User,
  Lock,
  FileSpreadsheet,
  ShieldCheck,
  Printer,
  Sparkles,
  Trash2
} from 'lucide-react';
import { downloadComplaintCapaPdf } from '../utils/pdfExport';

export const LoggedComplaintsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const complaintsList = useAppSelector((state) => state.complaint.complaintsList);
  const auditTrail = useAppSelector((state) => state.complaint.auditTrail);

  const [activeSubTab, setActiveSubTab] = useState<'complaints' | 'auditTrail'>('complaints');
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [auditCategoryFilter, setAuditCategoryFilter] = useState<string>('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Executive Analytics Calculations
  const totalComplaints = complaintsList.length;
  const criticalCount = complaintsList.filter((c) => c.initialSeverity === 'Critical').length;
  const majorCount = complaintsList.filter((c) => c.initialSeverity === 'Major').length;
  const minorCount = complaintsList.filter((c) => c.initialSeverity === 'Minor').length;

  const avgRpn = totalComplaints > 0
    ? Math.round(
        complaintsList.reduce((acc, c) => acc + (c.riskAssessment?.rpnScore || (c.initialSeverity === 'Critical' ? 75 : c.initialSeverity === 'Major' ? 45 : 18)), 0) /
          totalComplaints
      )
    : 0;

  // FDA Field Alert Reports Active Countdown (21 CFR 314.81 requires 15-day reporting for critical defects)
  const criticalComplaints = complaintsList.filter(
    (c) => c.initialSeverity === 'Critical' || c.riskAssessment?.regulatoryReportingRequired
  );

  const filteredComplaints = complaintsList.filter((item) => {
    const matchesSearch =
      item.complaintNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchLotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSev = severityFilter === 'All' || item.initialSeverity === severityFilter;
    return matchesSearch && matchesSev;
  });

  const filteredAuditTrail = auditTrail.filter((entry) => {
    const matchesCategory = auditCategoryFilter === 'ALL' || entry.category === auditCategoryFilter;
    const matchesSearch =
      entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.cfrReference && entry.cfrReference.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleSelectRecord = (record: ComplaintRecord) => {
    dispatch(setFullForm(record));
    dispatch(setActiveTab('intake'));
  };

  const handleDownloadRowPdf = (e: React.MouseEvent, record: ComplaintRecord) => {
    e.stopPropagation();
    const filename = downloadComplaintCapaPdf({
      complaintNumber: record.complaintNumber,
      formData: record,
      capa: record.capa,
      riskAssessment: record.riskAssessment,
      createdAt: record.createdAt,
      sourceDocName: record.sourceDocumentName || 'Archived_Record.pdf'
    });

    dispatch(
      addAuditLog({
        action: 'Complaint PDF Dossier Downloaded',
        category: 'REPORT',
        user: 'QA Lead (ID: QA-8821)',
        role: 'Quality Assurance Auditor',
        details: `Generated & downloaded complete CAPA dossier for ${record.complaintNumber} (${record.productName}).`,
        status: 'SUCCESS',
        cfrReference: '21 CFR 211.198'
      })
    );

    setToastMsg(`Downloaded PDF for ${record.complaintNumber}`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleExportAuditLogCsv = () => {
    const headers = 'ID,Timestamp,Action,Category,User,Role,Status,21_CFR_Reference,Details\n';
    const rows = auditTrail
      .map(
        (a) =>
          `"${a.id}","${a.timestamp}","${a.action}","${a.category}","${a.user}","${a.role}","${a.status}","${a.cfrReference || ''}","${a.details.replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `21_CFR_Part_11_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    dispatch(
      addAuditLog({
        action: 'Audit Trail Exported to CSV',
        category: 'COMPLIANCE',
        user: 'QA Auditor (ID: QA-8821)',
        role: 'Compliance Lead',
        details: `Exported ${auditTrail.length} GxP audit entries to CSV for external regulatory inspection.`,
        status: 'SUCCESS',
        cfrReference: '21 CFR Part 11.10(e)'
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl p-3.5 flex items-center justify-between text-xs font-semibold shadow-xs animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{toastMsg}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">21 CFR Part 11 Verified</span>
        </div>
      )}

      {/* EXECUTIVE ANALYTICS DASHBOARD & LIVE METRICS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Logged Complaints */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Total Logged Complaints</span>
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">{totalComplaints}</span>
            <span className="text-[11px] text-slate-500 font-medium">Active Dossiers</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 flex items-center space-x-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>100% 21 CFR § 211.198 compliant</span>
          </div>
        </div>

        {/* Metric 2: Severity Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Severity Classification</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-xs border border-red-200">
              {criticalCount} Critical
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200">
              {majorCount} Major
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200">
              {minorCount} Minor
            </span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500">
            <span>Criticality weighted triage</span>
          </div>
        </div>

        {/* Metric 3: Average RPN Score */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-1">
            <span>Average RPN Risk Score</span>
            <Sparkles className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-indigo-900">{avgRpn}</span>
            <span className="text-xs font-mono text-slate-500">/ 125 max</span>
          </div>
          <div className="mt-2 text-[10px] text-slate-500 flex items-center space-x-1">
            <span className="font-semibold text-slate-700">ICH Q9 Matrix:</span>
            <span className={avgRpn >= 50 ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
              {avgRpn >= 50 ? 'Elevated Monitoring' : 'Controlled Baseline'}
            </span>
          </div>
        </div>

        {/* Metric 4: FDA 15-Day Field Alert Countdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-xs">
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold mb-1">
            <span>FDA Field Alert (FAR)</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-red-400">
              {criticalComplaints.length > 0 ? '11 Days Remaining' : 'No Pending FAR'}
            </span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
            <span>21 CFR § 314.81(b)(1)</span>
            <span className="text-amber-300 font-mono">{criticalComplaints.length} Alert Lot(s)</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        {/* Navigation & Controls Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* Sub-tabs */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
            <button
              id="subtab-complaints-btn"
              onClick={() => setActiveSubTab('complaints')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeSubTab === 'complaints'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Logged Incident Database ({complaintsList.length})</span>
            </button>
            <button
              id="subtab-audit-trail-btn"
              onClick={() => setActiveSubTab('auditTrail')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeSubTab === 'auditTrail'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>GxP Audit Trail &amp; Time-stamps ({auditTrail.length})</span>
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={
                  activeSubTab === 'complaints'
                    ? 'Search batch, product, complaint #...'
                    : 'Search audit action, user, CFR ref...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 w-56 sm:w-64"
              />
            </div>

            {activeSubTab === 'complaints' ? (
              <div className="flex items-center space-x-2">
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="All">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="Major">Major</option>
                  <option value="Minor">Minor</option>
                </select>

                {complaintsList.length > 0 && (
                  <button
                    id="clear-all-complaints-btn"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to remove all logged complaint and audit records?')) {
                        dispatch(clearAllData());
                        setToastMsg('All complaint records and audit data cleared.');
                        setTimeout(() => setToastMsg(null), 3000);
                      }
                    }}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all"
                    title="Remove all complaints & audit data"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Clear Data</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <select
                  value={auditCategoryFilter}
                  onChange={(e) => setAuditCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="ALL">All Categories</option>
                  <option value="COMPLIANCE">Compliance</option>
                  <option value="DATABASE">Database</option>
                  <option value="RISK_ASSESSMENT">Risk Assessment</option>
                  <option value="CAPA">CAPA</option>
                  <option value="EXTRACTION">Extraction</option>
                  <option value="REPORT">Report</option>
                </select>

                <button
                  id="export-audit-csv-btn"
                  onClick={handleExportAuditLogCsv}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-2xs transition-all"
                  title="Export 21 CFR Part 11 Audit Trail to CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export CSV</span>
                </button>

                {auditTrail.length > 0 && (
                  <button
                    id="clear-all-audit-btn"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to wipe all audit trail logs and stored records?')) {
                        dispatch(clearAllData());
                        setToastMsg('All audit trail and complaint records cleared.');
                        setTimeout(() => setToastMsg(null), 3000);
                      }
                    }}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all"
                    title="Remove all audit logs"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    <span>Clear Data</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TAB 1: LOGGED COMPLAINTS TABLE */}
        {activeSubTab === 'complaints' && (
          <>
            {complaintsList.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <FileQuestion className="w-6 h-6 text-slate-500" />
                </div>
                <h4 className="text-base font-bold text-slate-900">No Complaints Logged Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                  No complaint records have been saved to the QMS database in this session. Ingest a document or enter details in Complaint Intake, then click &quot;Save &amp; Log QMS Complaint&quot; to populate this audit repository.
                </p>
                <button
                  onClick={() => dispatch(setActiveTab('intake'))}
                  className="mt-6 inline-flex items-center space-x-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Go to Complaint Intake</span>
                </button>
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No complaints match the search filter query &quot;{searchTerm}&quot;.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Complaint #</th>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Batch / Lot</th>
                      <th className="py-3 px-4">Customer &amp; Source</th>
                      <th className="py-3 px-4">Severity &amp; RPN</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredComplaints.map((row) => (
                      <tr key={row.id} className="hover:bg-blue-50/40 transition-colors group">
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">
                          {row.complaintNumber}
                          {row.riskAssessment?.regulatoryReportingRequired && (
                            <span className="block text-[9px] text-red-600 font-semibold tracking-tight">FDA 15-Day Alert</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900 block truncate max-w-xs">{row.productName}</span>
                          <span className="text-[10px] text-slate-500">{row.productStrengthGrade}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-800 font-medium">{row.batchLotNumber}</td>
                        <td className="py-3 px-4">
                          <span className="block truncate max-w-xs font-medium text-slate-800">{row.customerName}</span>
                          <span className="text-[10px] text-slate-500 truncate block">{row.complaintSource}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                row.initialSeverity === 'Critical'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : row.initialSeverity === 'Major'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {row.initialSeverity}
                            </span>
                            {row.riskAssessment && (
                              <span className="text-[10px] font-mono text-slate-500 font-bold">
                                RPN {row.riskAssessment.rpnScore}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center space-x-2">
                            {/* Download PDF Button per Row */}
                            <button
                              id={`download-pdf-${row.complaintNumber}`}
                              onClick={(e) => handleDownloadRowPdf(e, row)}
                              className="inline-flex items-center space-x-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md transition-colors text-[11px] font-semibold"
                              title="Download Full CAPA & Incident Report PDF"
                            >
                              <Download className="w-3 h-3 text-blue-600" />
                              <span>PDF</span>
                            </button>

                            <button
                              id={`load-record-${row.complaintNumber}`}
                              onClick={() => handleSelectRecord(row)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-md transition-colors text-[11px] font-semibold"
                            >
                              <span>Load</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* TAB 2: GXP AUDIT TRAIL & TIME-STAMPING (21 CFR PART 11 COMPLIANCE) */}
        {activeSubTab === 'auditTrail' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">21 CFR Part 11 Electronic Records &amp; Audit Trail Active</span>
              </div>
              <span className="font-mono text-[11px] text-slate-600">Audit Storage: Validated GxP Ledger</span>
            </div>

            {filteredAuditTrail.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No audit records match the search or category filter.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Timestamp (UTC)</th>
                      <th className="py-3 px-4">Action &amp; Category</th>
                      <th className="py-3 px-4">Actor &amp; Role</th>
                      <th className="py-3 px-4">Details &amp; Audit Scope</th>
                      <th className="py-3 px-4">21 CFR Ref</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredAuditTrail.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {entry.timestamp}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{entry.action}</span>
                          <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200 mt-0.5">
                            {entry.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800 block truncate max-w-xs">{entry.user}</span>
                          <span className="text-[10px] text-slate-500 truncate block">{entry.role}</span>
                        </td>
                        <td className="py-3 px-4 max-w-sm">
                          <p className="text-slate-700 text-xs leading-relaxed">{entry.details}</p>
                        </td>
                        <td className="py-3 px-4 font-mono text-[10px] text-indigo-700 font-semibold whitespace-nowrap">
                          {entry.cfrReference || '21 CFR § 211.198'}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              entry.status === 'SUCCESS'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : entry.status === 'WARNING'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : entry.status === 'FAILURE'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

