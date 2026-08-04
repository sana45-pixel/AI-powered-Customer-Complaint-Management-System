import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setActiveTab } from '../store/complaintSlice';
import { ShieldAlert, AlertTriangle, FileText, CheckCircle2, X, FileQuestion, ArrowLeft } from 'lucide-react';

interface RiskAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RiskAssessmentCard: React.FC<RiskAssessmentModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const risk = useAppSelector((state) => state.complaint.riskAssessment);
  const formData = useAppSelector((state) => state.complaint.formData);

  if (!isOpen) return null;

  const hasComplaintData = Boolean(
    formData.productName?.trim() ||
    formData.detailedDescription?.trim() ||
    formData.batchLotNumber?.trim() ||
    formData.complaintType?.trim()
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-xl w-full shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-sm tracking-tight">ICH Q9 Quality Risk Assessment Copilot</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!risk || !hasComplaintData ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <FileQuestion className="w-6 h-6 text-slate-500" />
            </div>
            <h4 className="text-base font-bold text-slate-800">No Complaint Logged Yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              No complaint logged yet. Ingest a document or paste text in Complaint Intake to analyze and compute ICH Q9 Risk Priority Numbers.
            </p>
            <div className="mt-5 flex items-center justify-center space-x-2">
              <button
                onClick={() => {
                  onClose();
                  dispatch(setActiveTab('intake'));
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Go to Complaint Intake</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
            {/* RPN Score Header */}
            <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl p-4">
              <div>
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                  Risk Classification Matrix
                </span>
                <h4 className="text-lg font-bold text-red-900 mt-0.5">{risk.riskCategory}</h4>
                <p className="text-xs text-red-700 mt-1 font-medium">{risk.patientSafetyImpact}</p>
              </div>
              <div className="text-center bg-white px-4 py-3 rounded-lg border border-red-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 font-bold block">RPN SCORE</span>
                <span className="text-2xl font-black text-red-600">{risk.rpnScore}</span>
                <span className="text-[9px] text-slate-400 block">/ 125 Max</span>
              </div>
            </div>

            {/* RPN Calculation Breakdown */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">SEVERITY</span>
                <span className="text-lg font-bold text-slate-800">{risk.severityScore} / 5</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Harm Potential</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">OCCURRENCE</span>
                <span className="text-lg font-bold text-slate-800">{risk.occurrenceScore} / 5</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Historical Rate</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold block">DETECTABILITY</span>
                <span className="text-lg font-bold text-slate-800">{risk.detectabilityScore} / 5</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">QC Detection</span>
              </div>
            </div>

            {/* Regulatory Reporting Requirements */}
            {risk.regulatoryReportingRequired && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5">
                <div className="flex items-center space-x-2 text-amber-900 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Mandatory Regulatory Reporting Required</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  FDA 21 CFR 314.81 Field Alert Report (FAR) submission required within:{' '}
                  <span className="font-bold text-red-600">{risk.reportingDeadline}</span>.
                </p>
              </div>
            )}

            {/* AI Rationale */}
            <div>
              <h5 className="font-bold text-slate-800 mb-1">AI Risk Rationale</h5>
              <p className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-600 leading-relaxed font-mono text-[11px]">
                {risk.rationale}
              </p>
            </div>

            {/* Recommended Immediate Actions */}
            <div>
              <h5 className="font-bold text-slate-800 mb-2">Recommended QA Actions</h5>
              <div className="space-y-1.5">
                {risk.recommendedActions.map((action, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-slate-700 bg-white border border-slate-200 p-2.5 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 p-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
