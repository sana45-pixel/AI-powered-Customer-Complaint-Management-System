import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store';
import { setFullForm, setActiveTab } from '../store/complaintSlice';
import { ComplaintRecord } from '../types/complaint';
import { Database, Search, Filter, FileText, ArrowUpRight, ShieldAlert, CheckSquare, FileQuestion, ArrowLeft } from 'lucide-react';

export const LoggedComplaintsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const complaintsList = useAppSelector((state) => state.complaint.complaintsList);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');

  const filtered = complaintsList.filter((item) => {
    const matchesSearch =
      item.complaintNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchLotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSev = severityFilter === 'All' || item.initialSeverity === severityFilter;
    return matchesSearch && matchesSev;
  });

  const handleSelectRecord = (record: ComplaintRecord) => {
    dispatch(setFullForm(record));
    dispatch(setActiveTab('intake'));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Logged Complaints QMS Database</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            21 CFR Part 211.198 Compliant Complaint Files &amp; Audit History ({complaintsList.length} Total Records)
          </p>
        </div>

        {/* Controls */}
        {complaintsList.length > 0 && (
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search batch, product, complaint #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 w-60"
              />
            </div>

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
          </div>
        )}
      </div>

      {/* Table or Empty State */}
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
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500">
          No complaints match the filter query &quot;{searchTerm}&quot;.
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
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{row.complaintNumber}</td>
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
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleSelectRecord(row)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-md transition-colors"
                    >
                      <span>Load</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
