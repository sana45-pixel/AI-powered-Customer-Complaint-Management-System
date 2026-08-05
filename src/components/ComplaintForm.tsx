import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { resetForm, saveComplaintRecord } from '../store/complaintSlice';
import {
  RotateCcw,
  Save,
  Calendar,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';

interface ToastState {
  type: 'success' | 'error';
  title: string;
  message: string;
}

export const ComplaintForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.complaint.formData);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Auto-dismiss toast after 4.5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleReset = () => {
    dispatch(resetForm());
  };

  const handleSave = () => {
    // 1. Validate required extracted fields
    const missing: string[] = [];
    if (!formData.productName || !formData.productName.trim()) {
      missing.push('Product Name');
    }
    if (!formData.batchLotNumber || !formData.batchLotNumber.trim()) {
      missing.push('Batch/Lot Number');
    }

    if (missing.length > 0) {
      setToast({
        type: 'error',
        title: 'Validation Required',
        message: `Please provide required fields (${missing.join(' and ')}) before saving.`
      });
      return;
    }

    // 2. Dispatch save action to Redux store (records complaint & adds 21 CFR Part 11 Audit Trail entry)
    dispatch(saveComplaintRecord());

    // Optional server sync in background
    fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).catch((err) => {
      console.warn('Backend sync note:', err);
    });

    // 3. Display clean toast notification / success alert
    setToast({
      type: 'success',
      title: 'Complaint Saved Successfully to QMS Audit Database',
      message: `Audit log registered under 21 CFR 211.198(a). Form reset for next intake.`
    });

    // 4. Reset/clear form state for the next complaint intake
    dispatch(resetForm());
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between h-full relative">
      {/* Toast Notification */}
      {toast && (
        <div
          id="qms-toast-notification"
          className={`fixed top-5 right-5 z-50 max-w-md w-full p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
            toast.type === 'success'
              ? 'bg-emerald-50/95 border-emerald-300 text-emerald-950 shadow-emerald-900/10'
              : 'bg-amber-50/95 border-amber-300 text-amber-950 shadow-amber-900/10'
          }`}
        >
          <div className="flex items-start gap-3">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold leading-tight">
                {toast.title}
              </h4>
              <p className="text-[11px] mt-1 text-slate-700 leading-normal">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
              Log Customer Complaint
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              API &amp; FDF Quality Assurance Module
            </p>
          </div>

          <div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
              {formData.status || 'Pending Triage'}
            </span>
          </div>
        </div>

        {/* 1. ORIGIN & CUSTOMER DETAILS */}
        <div className="mb-4">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            1. ORIGIN &amp; CUSTOMER DETAILS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="complaint-source" className="block text-xs font-semibold text-slate-700 mb-1">
                Complaint Source
              </label>
              <input
                id="complaint-source"
                type="text"
                readOnly
                placeholder="Awaiting AIVOA extraction..."
                value={formData.complaintSource}
                className="w-full px-3 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 font-sans cursor-default focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="customer-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Name
              </label>
              <input
                id="customer-name"
                type="text"
                readOnly
                placeholder="Awaiting AIVOA extraction..."
                value={formData.customerName}
                className="w-full px-3 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 font-sans cursor-default focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. PRODUCT & BATCH IDENTIFICATION */}
        <div className="mb-4">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            2. PRODUCT &amp; BATCH IDENTIFICATION
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label htmlFor="product-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Product Name
              </label>
              <input
                id="product-name"
                type="text"
                readOnly
                placeholder="Awaiting AIVOA extraction..."
                value={formData.productName}
                className="w-full px-3 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 font-sans cursor-default focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="product-strength-grade" className="block text-xs font-semibold text-slate-700 mb-1">
                Product Strength/Grade
              </label>
              <input
                id="product-strength-grade"
                type="text"
                readOnly
                placeholder="Awaiting AIVOA extraction..."
                value={formData.productStrengthGrade}
                className="w-full px-3 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 font-sans cursor-default focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label htmlFor="batch-lot-number" className="block text-xs font-semibold text-slate-700 mb-1">
                Batch/Lot Number
              </label>
              <input
                id="batch-lot-number"
                type="text"
                readOnly
                placeholder="Awaiting AIVOA extraction..."
                value={formData.batchLotNumber}
                className="w-full px-3 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 font-mono cursor-default focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="manufacturing-date" className="block text-xs font-semibold text-slate-700 mb-1">
                Manufacturing Date
              </label>
              <div className="relative">
                <input
                  id="manufacturing-date"
                  type="text"
                  readOnly
                  placeholder="Awaiting AIVOA extraction..."
                  value={formData.manufacturingDate}
                  className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 font-sans cursor-default focus:outline-none"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry-date" className="block text-xs font-semibold text-slate-700 mb-1">
                Expiry Date
              </label>
              <div className="relative">
                <input
                  id="expiry-date"
                  type="text"
                  readOnly
                  placeholder="Awaiting AIVOA extraction..."
                  value={formData.expiryDate}
                  className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 font-sans cursor-default focus:outline-none"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label htmlFor="quantity-affected" className="block text-xs font-semibold text-slate-700 mb-1">
                Quantity Affected
              </label>
              <div className="flex rounded-lg overflow-hidden border border-slate-200 focus-within:border-slate-300">
                <input
                  id="quantity-affected"
                  type="text"
                  readOnly
                  placeholder="Awaiting AIVOA extraction..."
                  value={formData.quantityAffected}
                  className="w-full px-3 py-2 text-xs bg-slate-50/60 text-slate-800 placeholder-slate-400 font-sans cursor-default focus:outline-none"
                />
                <div className="bg-slate-100 px-3 text-slate-500 text-xs font-medium flex items-center justify-center border-l border-slate-200 select-none">
                  kg
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. COMPLAINT DETAILS */}
        <div className="mb-4">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            3. COMPLAINT DETAILS
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label htmlFor="complaint-type" className="block text-xs font-semibold text-slate-700 mb-1">
                Complaint Type
              </label>
              <input
                id="complaint-type"
                type="text"
                readOnly
                placeholder="Awaiting AIVOA extraction..."
                value={formData.complaintType}
                className="w-full px-3 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 font-sans cursor-default focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="complaint-date" className="block text-xs font-semibold text-slate-700 mb-1">
                Complaint Date
              </label>
              <div className="relative">
                <input
                  id="complaint-date"
                  type="text"
                  readOnly
                  placeholder="Awaiting AIVOA extraction..."
                  value={formData.complaintDate}
                  className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 font-sans cursor-default focus:outline-none"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="detailed-complaint-description" className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Complaint Description
            </label>
            <textarea
              id="detailed-complaint-description"
              rows={2}
              readOnly
              placeholder="Awaiting AIVOA extraction..."
              value={formData.detailedDescription}
              className="w-full px-3 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 font-sans cursor-default focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* 4. INITIAL ASSESSMENT & PRIORITY */}
        <div className="mb-5">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">
            4. INITIAL ASSESSMENT &amp; PRIORITY
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="initial-severity" className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Severity
              </label>
              <div className="relative">
                <div
                  id="initial-severity"
                  className="w-full px-3 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 font-sans cursor-default flex items-center justify-between"
                >
                  <span className={formData.initialSeverity && formData.initialSeverity !== 'Unassigned' ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                    {formData.initialSeverity && formData.initialSeverity !== 'Unassigned' ? formData.initialSeverity : 'Awaiting AIVOA extraction...'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="priority" className="block text-xs font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <div className="relative">
                <div
                  id="priority"
                  className="w-full px-3 py-2 text-xs bg-slate-50/60 border border-slate-200 rounded-lg text-slate-800 font-sans cursor-default flex items-center justify-between"
                >
                  <span className={formData.priority && formData.priority !== 'Unassigned' ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                    {formData.priority && formData.priority !== 'Unassigned' ? formData.priority : 'Awaiting AIVOA extraction...'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button
          id="btn-reset-form"
          onClick={handleReset}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
          <span>Reset Form</span>
        </button>

        <button
          id="btn-save-complaint"
          onClick={handleSave}
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Save className="w-3.5 h-3.5 text-white" />
          <span>Save Complaint</span>
        </button>
      </div>
    </div>
  );
};
