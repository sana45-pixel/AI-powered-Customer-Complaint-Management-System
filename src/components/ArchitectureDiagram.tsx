import React, { useState } from 'react';
import { useAppSelector } from '../store/store';
import { Cpu, Database, Server, Globe, ArrowRight, CheckCircle2, Terminal, Code, Layers } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const nodeTrace = useAppSelector((state) => state.agent.nodeTrace);
  const [selectedNode, setSelectedNode] = useState<string>('Extraction_Node');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2">
          <Cpu className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Architecture & LangGraph Agent Graph</h2>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          High-Level Flow: <strong className="text-slate-700">React + Redux Frontend</strong> → <strong className="text-slate-700">FastAPI Backend Router</strong> → <strong className="text-slate-700">LangGraph Agent Pipeline</strong> → <strong className="text-slate-700">Groq API (gemma2-9b-it / llama-3.3-70b-versatile)</strong> → <strong className="text-slate-700">PostgreSQL QMS Database</strong>.
        </p>
      </div>

      {/* 1. ARCHITECTURE LAYERS FLOW (DIAGRAM) */}
      <div className="bg-slate-900 text-white rounded-xl p-6 relative overflow-hidden">
        <div className="text-[11px] font-mono text-blue-400 mb-4 font-bold tracking-wider uppercase">
          FULL-STACK COMPLAINT AGENT PIPELINE ARCHITECTURE
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center relative z-10">
          {/* Layer 1: Frontend */}
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl text-center shadow-lg hover:border-blue-500 transition-all">
            <Globe className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h4 className="font-bold text-xs text-white">1. Frontend Layer</h4>
            <span className="text-[10px] font-mono text-slate-400 block mt-1">React 19 + Redux Toolkit</span>
            <span className="text-[9px] bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded inline-block mt-2">
              Form / PDF Intake
            </span>
          </div>

          <div className="hidden md:flex justify-center">
            <ArrowRight className="w-5 h-5 text-slate-500 animate-pulse" />
          </div>

          {/* Layer 2: FastAPI */}
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl text-center shadow-lg hover:border-emerald-500 transition-all">
            <Server className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h4 className="font-bold text-xs text-white">2. FastAPI Backend</h4>
            <span className="text-[10px] font-mono text-slate-400 block mt-1">Python / Uvicorn API</span>
            <span className="text-[9px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded inline-block mt-2">
              /api/v1/complaints
            </span>
          </div>

          <div className="hidden md:flex justify-center">
            <ArrowRight className="w-5 h-5 text-slate-500 animate-pulse" />
          </div>

          {/* Layer 3: LangGraph + Groq */}
          <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl text-center shadow-lg hover:border-amber-500 transition-all">
            <Cpu className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <h4 className="font-bold text-xs text-white">3. LangGraph & Groq</h4>
            <span className="text-[10px] font-mono text-slate-400 block mt-1">llama-3.3-70b-versatile</span>
            <span className="text-[9px] bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded inline-block mt-2">
              StateGraph DAG
            </span>
          </div>
        </div>

        {/* Database Layer below */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-center">
          <div className="bg-slate-800 border border-slate-700 px-6 py-3 rounded-xl flex items-center space-x-3 text-xs">
            <Database className="w-5 h-5 text-purple-400" />
            <div>
              <span className="font-bold text-white block">4. Database & Storage Layer</span>
              <span className="text-[10px] text-slate-400 font-mono">PostgreSQL / MySQL with Vector Extensions for Duplicate Cosine Search</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LANGGRAPH DAG NODE PIPELINE INSPECTOR */}
      <div>
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>LangGraph StateGraph Execution Pipeline</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
          {nodeTrace.map((node, idx) => (
            <button
              key={node.nodeName}
              onClick={() => setSelectedNode(node.nodeName)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                selectedNode === node.nodeName
                  ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                  : 'bg-slate-50 border-slate-200 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-slate-400">0{idx + 1}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <h5 className="text-xs font-bold text-slate-800 truncate">{node.nodeName}</h5>
              <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{node.details}</p>
            </button>
          ))}
        </div>

        {/* Selected Node Code & Specification Details */}
        <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>Node Definition: <strong className="text-white">{selectedNode}</strong></span>
            </span>
            <span className="text-emerald-400">Compiled StateGraph</span>
          </div>

          <pre className="text-slate-300 leading-relaxed overflow-x-auto text-[11px]">
{selectedNode === 'Ingestion_Node' && `def document_ingestion_node(state: ComplaintState) -> ComplaintState:
    """Node 1: Parses PDF/DOCX/EML or text input into standardized string payload."""
    raw_text = state.get("raw_document_text", "")
    state["execution_logs"].append(f"[Ingestion_Node] Ingested document: {state.get('file_name')} ({len(raw_text)} chars).")
    state["current_step"] = "Extraction_Node"
    return state`}

{selectedNode === 'Extraction_Node' && `def schema_extraction_node(state: ComplaintState) -> ComplaintState:
    """Node 2: Extracts Product Name, Batch Number, Defect Description using Groq LLM."""
    llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name="llama-3.3-70b-versatile")
    # Prompting Groq LLM for 12 QMS structured schema fields
    state["extracted_form"] = parsed_json
    return state`}

{selectedNode === 'Completeness_Gate' && `def completeness_gate_node(state: ComplaintState) -> ComplaintState:
    """Node 3: Validates required FDA 21 CFR 211.198 compliance fields."""
    form = state["extracted_form"]
    state["completeness_issues"] = check_mandatory_qms_fields(form)
    return state`}

{selectedNode === 'Risk_Evaluator' && `def risk_evaluator_node(state: ComplaintState) -> ComplaintState:
    """Node 4: Evaluates Risk Priority Number (RPN = Severity x Occurrence x Detectability) under ICH Q9."""
    rpn = severity * occurrence * detectability
    state["risk_assessment"] = {"rpn_score": rpn, "risk_category": "Critical / High Risk" if rpn >= 45 else "Major Risk"}
    return state`}

{selectedNode === 'Duplicate_Matcher' && `def duplicate_matcher_node(state: ComplaintState) -> ComplaintState:
    """Node 5: Scans PostgreSQL vector store for historical batch complaints."""
    batch = state["extracted_form"].get("batch_lot_number")
    state["duplicate_matches"] = query_vector_database(batch_number=batch)
    return state`}

{selectedNode === 'CAPA_Engine' && `def capa_engine_node(state: ComplaintState) -> ComplaintState:
    """Node 6: Generates 5-Whys root cause analysis & CAPA remediation plan."""
    state["capa_recommendation"] = generate_5_whys_and_remediation(state["extracted_form"])
    return state`}
          </pre>
        </div>
      </div>
    </div>
  );
};
