from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, JSON, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class ComplaintDB(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    complaint_number = Column(String(50), unique=True, index=True, nullable=False)
    complaint_source = Column(String(255))
    customer_name = Column(String(255))
    customer_contact = Column(String(255))

    product_name = Column(String(255), index=True, nullable=False)
    product_strength_grade = Column(String(100))
    batch_lot_number = Column(String(100), index=True, nullable=False)
    manufacturing_date = Column(String(50))
    expiry_date = Column(String(50))
    quantity_affected = Column(String(100))

    complaint_type = Column(String(100))
    complaint_date = Column(String(50))
    detailed_description = Column(Text, nullable=False)

    initial_severity = Column(String(50), default="Unassigned")
    priority = Column(String(50), default="Unassigned")
    status = Column(String(50), default="Pending Triage")

    raw_text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    risk_assessments = relationship("RiskAssessmentDB", back_populates="complaint")
    capas = relationship("CapaRemediationDB", back_populates="complaint")

class RiskAssessmentDB(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"))
    rpn_score = Column(Integer)
    severity_score = Column(Integer)
    occurrence_score = Column(Integer)
    detectability_score = Column(Integer)
    risk_category = Column(String(100))
    patient_safety_impact = Column(Text)
    regulatory_reporting_required = Column(Boolean, default=False)
    reporting_deadline = Column(String(100))
    rationale = Column(Text)

    complaint = relationship("ComplaintDB", back_populates="risk_assessments")

class CapaRemediationDB(Base):
    __tablename__ = "capa_remediations"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"))
    capa_number = Column(String(50), unique=True, index=True)
    root_cause_method = Column(String(50), default="5-Whys")
    primary_root_cause = Column(Text)
    root_cause_details = Column(JSON)
    immediate_containment = Column(JSON)
    corrective_actions = Column(JSON)
    preventive_actions = Column(JSON)
    effectiveness_criteria = Column(Text)
    qa_signed_off = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    complaint = relationship("ComplaintDB", back_populates="capas")
