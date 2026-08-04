import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setActiveTab } from '../store/complaintSlice';
import { CopyCheck, Database, Calendar, AlertOctagon, X, CheckCircle, FileQuestion, ArrowLeft } from 'lucide-react';

interface DuplicateDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DuplicateDetectionModal: React.FC<DuplicateDetectionModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const duplicates = useAppSelector((state) => state.complaint.duplicates);
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
            <CopyCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm tracking-tight">Duplicate Complaint Vector Search</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!hasComplaintData ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <FileQuestion className="w-6 h-6 text-slate-500" />
            </div>
            <h4 className="text-base font-bold text-slate-800">No Complaint Logged Yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              No complaint logged yet. Ingest a document or paste text in Complaint Intake to scan for duplicate lot defects or recurring quality events.
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
        ) : duplicates.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3 text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">No Duplicate Complaints Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              Vector search across historical QMS records found 0 prior matching complaints for Batch <span className="font-mono font-bold text-slate-700">{formData.batchLotNumber || 'Unassigned'}</span>.
            </p>
          </div>
        ) : (
          <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-900 flex items-start space-x-2">
              <AlertOctagon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Scanned QMS Embedding Database</span>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Target Batch: <span className="font-mono font-bold">{formData.batchLotNumber || 'Unassigned'}</span>. High similarity indicates potential multi-facility or multi-distributor repeat defect.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {duplicates.map((dup) => (
                <div key={dup.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 hover:bg-white transition-all shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{dup.complaintNumber}</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                        Batch: {dup.batchLotNumber}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {dup.similarityPercentage}% Similarity Match
                    </span>
                  </div>

                  <p className="text-slate-700 mb-2 leading-relaxed">{dup.summary}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Logged Date: {dup.incidentDate}</span>
                    </span>
                    <span className="font-medium text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Status: {dup.resolutionStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 p-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Search Results
          </button>
        </div>
      </div>
    </div>
  );
};
