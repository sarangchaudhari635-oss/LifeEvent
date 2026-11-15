from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class LifeEventIntake(BaseModel):
    patient_name: str = Field(..., description="Name of the patient admitted")
    relation: str = Field("father", description="Relation to patient (father, mother, spouse, etc.)")
    age: Optional[int] = Field(55, description="Patient age")
    gender: Optional[str] = Field("Male", description="Patient gender")
    hospital_name: str = Field(..., description="Name of the hospital")
    city: str = Field("Pune", description="City location")
    room_category: Optional[str] = Field("ICU", description="ICU, Single Private AC, Twin Sharing, General Ward")
    condition_description: str = Field(..., description="Medical emergency condition")
    urgency: str = Field("urgent", description="critical, urgent, or standard")
    language: str = Field("en", description="en, hi, or mr")
    known_insurer: Optional[str] = Field("Sample Health Insurance Co.", description="Insurer name")
    policy_number: Optional[str] = Field(None, description="Policy identifier")
    sum_insured: Optional[float] = Field(500000.0, description="Total health policy sum insured in INR")
    room_rent_cap_type: Optional[str] = Field("1% of Sum Insured (₹5,000/day)", description="Room rent clause")
    allowed_room_rent: Optional[float] = Field(5000.0, description="Allowed room rent per day")
    actual_room_rent: Optional[float] = Field(8500.0, description="Actual room rent per day")
    stay_days: Optional[int] = Field(4, description="Estimated stay duration in days")
    copay_percent: Optional[float] = Field(0.0, description="Co-pay percentage in policy")
    emergency_contact: Optional[str] = Field(None, description="Family attendant phone number")
    aadhaar_number: Optional[str] = Field(None, description="Patient or attendant Aadhaar number")
    policy_photo_name: Optional[str] = Field(None, description="Uploaded policy photo filename")
    estimate_photo_name: Optional[str] = Field(None, description="Uploaded hospital estimate photo filename")
    policy_photo_preview: Optional[str] = Field(None, description="Base64 preview of policy photo")
    estimate_photo_preview: Optional[str] = Field(None, description="Base64 preview of estimate photo")
    estimated_amount: Optional[float] = Field(None, description="Initial hospital estimate in INR")
    is_demo: bool = Field(False, description="Whether this journey runs in demo mode")

class ExtractedDocument(BaseModel):
    doc_id: str
    doc_type: str  # health_policy, hospital_estimate, id_proof, tpa_query, discharge_summary
    title: str
    summary: str
    extracted_text: str = ""
    extracted_data: Dict[str, Any] = {}
    confidence: float = 0.95

class CoverageClaim(BaseModel):
    category: str
    estimated_cost: float
    likely_covered: float
    out_of_pocket: float
    confidence: str  # High, Medium, Needs TPA Confirmation
    evidence_doc: str
    evidence_page: int
    evidence_passage: str
    clause_ref: str
    is_verified: bool = False  # Set by citation validator

class GapBreakdown(BaseModel):
    total_estimate: float
    likely_covered_base: float
    gap_low: float
    gap_high: float
    gap_expected: float
    confidence: str  # High, Medium, Needs TPA Confirmation
    assumptions: List[str] = []
    room_rent_proportional_deduction: float = 0.0
    co_pay_amount: float = 0.0
    non_payable_consumables: float = 0.0
    remaining_sum_insured: float = 0.0

class ChecklistItem(BaseModel):
    id: str
    title: str
    description: str
    category: str  # document_required, pre_auth, hospital_task, funding_step
    status: str = "pending"  # pending, ready, submitted, approved
    action_url: Optional[str] = None
    is_critical: bool = True

class FundingOffer(BaseModel):
    id: str
    provider: str
    badge: str = "Demo Partner, illustrative terms, not a real offer"
    type: str  # zero_cost_emi, emergency_credit, tpa_advance
    amount: float
    tenure_months: int
    monthly_emi: float
    interest_rate: str
    approval_time: str
    highlights: List[str] = []

class TimelineEvent(BaseModel):
    id: str
    timestamp: str
    title: str
    description: str
    actor: str  # Family, Hospital TPA, Insurer, LifeEvent AI
    status: str  # completed, in_progress, pending

class LivingJourney(BaseModel):
    id: str
    created_at: str
    intake: LifeEventIntake
    gap: GapBreakdown
    coverage_breakdown: List[CoverageClaim] = []
    checklist: List[ChecklistItem] = []
    funding_options: List[FundingOffer] = []
    current_stage: str
    next_best_action: str
    timeline_events: List[TimelineEvent] = []
    is_demo: bool = False

class ConsentRequest(BaseModel):
    journey_id: str
    user_consent: bool
    language: str = "en"
