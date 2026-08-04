import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { toggleCapaSignoff, generateCapaRecommendation, setActiveTab } from '../store/complaintSlice';
import {
  CheckSquare,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  UserCheck,
  Clock,
  ArrowRight,
  Send,
  Lock,
  FileQuestion,
  ArrowLeft,
  Loader2,
  RefreshCw
} from 'lucide-react';

export const CapaRemediationView: React.FC = () => {
  const dispatch = useAppDispatch();
  const capa = useAppSelector((state) => state.complaint.capaDraft);
  const formData = useAppSelector((state) => state.complaint.formData);
  const isCapaGenerating = useAppSelector((state) => state.complaint.isCapaGenerating);

  const hasComplaintData = Boolean(
    formData.productName?.trim() ||
    formData.detailedDescription?.trim() ||
    formData.batchLotNumber?.trim() ||
    formData.complaintType?.trim()
  );

  const handleGenerate = () => {
    dispatch(generateCapaRecommendation());
  };

  const handleSignoff = () => {
    dispatch(toggleCapaSignoff());
  };

  if (!hasComplaintData) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-10 text-center max-w-2xl mx-auto my-8 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <FileQuestion className="w-6 h-6 text-slate-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">No Complaint Logged Yet</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          Ingest a document or paste text in Complaint Intake to analyze. Once a complaint is parsed, the CAPA engine will formulate root causes and remediation actions.
        </p>
        <button
          id="goto-intake-btn"
          onClick={() => dispatch(setActiveTab('intake'))}
          className="mt-6 inline-flex items-center space-x-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go to Complaint Intake</span>
        </button>
      </div>
    );
  }

  if (!capa) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center max-w-2xl mx-auto my-8 shadow-xs">
        <CheckSquare className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Automated CAPA & Remediation Engine</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          Active Complaint: <strong className="text-slate-800">{formData.productName || 'Product'}</strong> [Lot: <span className="font-mono">{formData.batchLotNumber || 'Unassigned'}</span>].
          Click below to generate 5-Whys root cause analysis, immediate containment, and preventive actions.
        </p>
        <button
          id="generate-capa-plan-btn"
          onClick={handleGenerate}
          disabled={isCapaGenerating}
          className="mt-6 inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm shadow-xs transition-colors"
        >
          {isCapaGenerating ? (
            <>
              <Loader2 className="w-4 h-4 text-white animate-spin" />
              <span>Generating 5-Whys CAPA Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate CAPA Plan</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">
              {capa.id}
            </span>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">CAPA Plan & Remediation Workflow</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Complaint ID: <span className="font-semibold text-slate-700">{capa.complaintId}</span> | Batch:{' '}
            <span className="font-mono text-slate-700">{formData.batchLotNumber || 'LOT-2026-B9042'}</span> | Product:{' '}
            <span className="font-medium text-slate-700">{formData.productName || 'Pharmaceutical Formulation'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            id="regenerate-plan-btn"
            onClick={handleGenerate}
            disabled={isCapaGenerating}
            className="px-3.5 py-1.5 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50/50 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center space-x-1.5 shadow-2xs"
          >
            {isCapaGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                <span className="text-blue-700 font-medium">Regenerating Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Regenerate Plan</span>
              </>
            )}
          </button>
          <button
            id="signoff-capa-btn"
            onClick={handleSignoff}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all shadow-2xs ${
              capa.signedOff
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {capa.signedOff ? <Lock className="w-3.5 h-3.5 text-emerald-200" /> : <UserCheck className="w-3.5 h-3.5" />}
            <span>{capa.signedOff ? 'QA Signed Off (21 CFR Part 11)' : 'Sign Off CAPA Plan'}</span>
          </button>
        </div>
      </div>

      {/* Recalculating Notification Bar */}
      {isCapaGenerating && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-3.5 flex items-center space-x-2 text-xs animate-pulse">
          <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
          <span className="font-medium">
            AI CAPA Engine is recalculating 5-Whys Root Cause Analysis, Immediate Warehouse Containment Steps, and Preventive Actions for <strong className="font-semibold">{formData.productName || 'Active Product'}</strong>...
          </span>
        </div>
      )}

      {/* 21 CFR Part 11 QA Sign-off Status Banner */}
      {capa.signedOff && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-900 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Digital Signature Verified (21 CFR Part 11 Compliant)</span>
              <p className="text-[11px] text-emerald-800">{capa.qaApprover}</p>
            </div>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">{new Date().toLocaleDateString()}</span>
        </div>
      )}

      {/* SECTION 1: 5-WHYS ROOT CAUSE ANALYSIS */}
      <div className={`bg-slate-50 border border-slate-200 rounded-xl p-5 transition-opacity ${isCapaGenerating ? 'opacity-50' : 'opacity-100'}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">1</span>
            <span>Root Cause Analysis ({capa.rootCauseMethod})</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-200 px-2 py-0.5 rounded">ICH Q9 Evaluated</span>
        </div>

        <div className="space-y-2 mb-4">
          {[capa.rootCauseAnalysis.why1, capa.rootCauseAnalysis.why2, capa.rootCauseAnalysis.why3, capa.rootCauseAnalysis.why4, capa.rootCauseAnalysis.why5]
            .filter(Boolean)
            .map((why, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-2.5 rounded-lg text-xs text-slate-700 flex items-start space-x-2">
                <ArrowRight className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>{why}</span>
              </div>
            ))}
        </div>

        <div className="bg-blue-100/70 border border-blue-200 rounded-lg p-3 text-xs">
          <span className="font-bold text-blue-900 block mb-0.5">Primary Root Cause Summary:</span>
          <p className="text-blue-950 font-medium leading-relaxed">{capa.rootCauseAnalysis.primaryRootCause}</p>
        </div>
      </div>

      {/* SECTION 2: IMMEDIATE CONTAINMENT ACTIONS */}
      <div className={`transition-opacity ${isCapaGenerating ? 'opacity-50' : 'opacity-100'}`}>
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center space-x-2">
          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">2</span>
          <span>Immediate Containment & Quarantine Actions</span>
        </h3>
        <div className="space-y-2">
          {capa.immediateContainment.map((action, idx) => (
            <div key={idx} className="flex items-center space-x-2 text-xs text-slate-800 bg-amber-50/60 border border-amber-200/80 p-3 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span className="font-medium">{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: CORRECTIVE & PREVENTIVE ACTIONS (CAPA TABLE) */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 transition-opacity ${isCapaGenerating ? 'opacity-50' : 'opacity-100'}`}>
        {/* Corrective Actions */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>Corrective Actions (Immediate Remediation)</span>
          </h4>
          <div className="space-y-2">
            {capa.correctiveActions.map((ca, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-3 rounded-lg text-xs space-y-1">
                <p className="font-semibold text-slate-900">{ca.action}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Owner: <strong className="text-slate-700">{ca.owner}</strong></span>
                  <span>Due: <strong className="text-slate-700 font-mono">{ca.dueDate}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preventive Actions */}
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Preventive Actions (Systemic Recurrence Prevention)</span>
          </h4>
          <div className="space-y-2">
            {capa.preventiveActions.map((pa, idx) => (
              <div key={idx} className="bg-white border border-slate-200 p-3 rounded-lg text-xs space-y-1">
                <p className="font-semibold text-slate-900">{pa.action}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Owner: <strong className="text-slate-700">{pa.owner}</strong></span>
                  <span>Due: <strong className="text-slate-700 font-mono">{pa.dueDate}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: EFFECTIVENESS CHECK CRITERIA */}
      <div className={`bg-slate-900 text-white rounded-xl p-4 text-xs transition-opacity ${isCapaGenerating ? 'opacity-50' : 'opacity-100'}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-amber-400 uppercase tracking-wider">Effectiveness Check Criteria (90-Day Post-Implementation)</span>
          <span className="text-[10px] font-mono text-slate-400">Due Date: {capa.effectivenessDueDate || '2026-11-30'}</span>
        </div>
        <p className="text-slate-300 leading-relaxed font-medium">{capa.effectivenessCheckCriteria}</p>
      </div>
    </div>
  );
};
