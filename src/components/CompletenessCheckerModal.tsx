import React from 'react';
import { useAppSelector } from '../store/store';
import { ShieldAlert, CheckCircle, AlertOctagon, X } from 'lucide-react';

interface CompletenessCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompletenessCheckerModal: React.FC<CompletenessCheckerModalProps> = ({ isOpen, onClose }) => {
  const completenessIssues = useAppSelector((state) => state.complaint.completenessIssues);

  if (!isOpen) return null;

  const mandatoryCount = completenessIssues.filter((i) => i.severity === 'Mandatory').length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm tracking-tight">QMS Complaint Completeness Audit</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {completenessIssues.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-base">All Required Fields Complete!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                This customer complaint record satisfies FDA 21 CFR 211.198 & EU GMP Annex 16 mandatory intake requirements.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 text-amber-900 text-xs font-semibold">
                  <AlertOctagon className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Found {completenessIssues.length} Missing QMS Fields ({mandatoryCount} Mandatory)</span>
                </div>
              </div>

              <div className="space-y-3">
                {completenessIssues.map((issue, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{issue.field}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          issue.severity === 'Mandatory'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-1">{issue.description}</p>
                    {issue.regulatoryCode && (
                      <span className="inline-block text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        {issue.regulatoryCode}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 p-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Acknowledge & Edit Form
          </button>
        </div>
      </div>
    </div>
  );
};
