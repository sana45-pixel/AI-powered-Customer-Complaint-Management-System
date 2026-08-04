import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { updateFormField, undoFormChange, redoFormChange, resetForm, checkCompleteness, saveComplaintRecord } from '../store/complaintSlice';
import { ComplaintSeverity, ComplaintPriority } from '../types/complaint';
import { RotateCcw, Save, ShieldCheck, Undo2, Redo2 } from 'lucide-react';

interface ComplaintFormProps {
  onOpenCompletenessModal: () => void;
}

export const ComplaintForm: React.FC<ComplaintFormProps> = ({ onOpenCompletenessModal }) => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.complaint.formData);
  const historyPast = useAppSelector((state) => state.complaint.historyPast);
  const historyFuture = useAppSelector((state) => state.complaint.historyFuture);
  const completenessIssues = useAppSelector((state) => state.complaint.completenessIssues);
  const isCompletenessChecked = useAppSelector((state) => state.complaint.isCompletenessChecked);

  const canUndo = historyPast.length > 0;
  const canRedo = historyFuture.length > 0;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    dispatch(updateFormField({ field, value }));
  };

  const handleUndo = () => {
    if (canUndo) dispatch(undoFormChange());
  };

  const handleRedo = () => {
    if (canRedo) dispatch(redoFormChange());
  };

  // Global Keyboard Shortcuts (Ctrl+Z / Cmd+Z for Undo, Ctrl+Y or Cmd+Shift+Z / Ctrl+Shift+Z for Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (!isCmdOrCtrl) return;

      if (e.key === 'z' || e.key === 'Z') {
        if (e.shiftKey) {
          // Redo
          e.preventDefault();
          dispatch(redoFormChange());
        } else {
          // Undo
          e.preventDefault();
          dispatch(undoFormChange());
        }
      } else if (e.key === 'y' || e.key === 'Y') {
        // Redo
        e.preventDefault();
        dispatch(redoFormChange());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  const handleSave = () => {
    dispatch(saveComplaintRecord());
    alert('Complaint logged successfully in QMS Database under 21 CFR 211.198 compliance record!');
  };

  const handleRunCompleteness = async () => {
    await dispatch(checkCompleteness());
    onOpenCompletenessModal();
  };

  // Severity Status pill color
  const getSeverityBadgeClass = (sev: ComplaintSeverity) => {
    switch (sev) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Major':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Minor':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200'; // Pending Triage default
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-7 flex flex-col justify-between h-full">
      <div>
        {/* Header Title Section */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Log Customer Complaint</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">API &amp; FDF Quality Assurance Module</p>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Header Undo / Redo Control Toolbar */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={handleUndo}
                disabled={!canUndo}
                title="Undo manual edit (Ctrl+Z)"
                className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-md text-slate-700 hover:bg-white hover:shadow-xs disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <Undo2 className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Undo</span>
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={!canRedo}
                title="Redo manual edit (Ctrl+Y)"
                className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-md text-slate-700 hover:bg-white hover:shadow-xs disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                <Redo2 className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Redo</span>
              </button>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeverityBadgeClass(formData.initialSeverity)}`}>
              {formData.status}
            </span>
          </div>
        </div>

        {/* Section 1: ORIGIN & CUSTOMER DETAILS */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3.5 pb-1 border-b border-slate-100">
            1. Origin &amp; Customer Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Complaint Source</label>
              <input
                type="text"
                placeholder="Awaiting AI extraction..."
                value={formData.complaintSource}
                onChange={(e) => handleInputChange('complaintSource', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Customer Name</label>
              <input
                type="text"
                placeholder="Awaiting AI extraction..."
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Section 2: PRODUCT & BATCH IDENTIFICATION */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3.5 pb-1 border-b border-slate-100">
            2. Product &amp; Batch Identification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Product Name</label>
              <input
                type="text"
                placeholder="Awaiting AI extraction..."
                value={formData.productName}
                onChange={(e) => handleInputChange('productName', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Product Strength/Grade</label>
              <input
                type="text"
                placeholder="Awaiting AI extraction..."
                value={formData.productStrengthGrade}
                onChange={(e) => handleInputChange('productStrengthGrade', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Batch/Lot Number</label>
              <input
                type="text"
                placeholder="Awaiting AI extraction..."
                value={formData.batchLotNumber}
                onChange={(e) => handleInputChange('batchLotNumber', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Manufacturing Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.manufacturingDate}
                  onChange={(e) => handleInputChange('manufacturingDate', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-sans"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Quantity Affected</label>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Awaiting AI extraction..."
                  value={formData.quantityAffected}
                  onChange={(e) => handleInputChange('quantityAffected', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-l-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 font-sans"
                />
                <span className="inline-flex items-center px-3 text-xs font-medium text-slate-500 bg-slate-100 border border-l-0 border-slate-200 rounded-r-lg whitespace-nowrap">
                  kg / units
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: COMPLAINT DETAILS */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3.5 pb-1 border-b border-slate-100">
            3. Complaint Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-4 sm:mb-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Complaint Type</label>
              <input
                type="text"
                placeholder="Awaiting AI extraction..."
                value={formData.complaintType}
                onChange={(e) => handleInputChange('complaintType', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Complaint Date</label>
              <input
                type="date"
                value={formData.complaintDate}
                onChange={(e) => handleInputChange('complaintDate', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-sans"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Detailed Complaint Description</label>
            <textarea
              rows={3}
              placeholder="Awaiting AI extraction..."
              value={formData.detailedDescription}
              onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder-slate-400 font-sans"
            />
          </div>
        </div>

        {/* Section 4: INITIAL ASSESSMENT & PRIORITY */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3.5 pb-1 border-b border-slate-100">
            4. Initial Assessment &amp; Priority
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Initial Severity</label>
              <select
                value={formData.initialSeverity}
                onChange={(e) => handleInputChange('initialSeverity', e.target.value as ComplaintSeverity)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-sans"
              >
                <option value="Unassigned">Awaiting AI extraction / Unassigned</option>
                <option value="Critical">Critical (Sterile/Safety Risk)</option>
                <option value="Major">Major (Potency/Dissolution)</option>
                <option value="Minor">Minor (Aesthetic/Packaging)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as ComplaintPriority)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 font-sans"
              >
                <option value="Unassigned">Awaiting AI extraction / Unassigned</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Form Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => dispatch(resetForm())}
            className="inline-flex items-center space-x-2 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="inline-flex items-center space-x-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Undo2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Undo</span>
          </button>

          <button
            onClick={handleRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="inline-flex items-center space-x-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <Redo2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Redo</span>
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunCompleteness}
            className="inline-flex items-center space-x-2 px-3.5 py-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm font-medium text-blue-700 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Completeness Gate</span>
            {isCompletenessChecked && completenessIssues.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center space-x-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Complaint</span>
          </button>
        </div>
      </div>
    </div>
  );
};
