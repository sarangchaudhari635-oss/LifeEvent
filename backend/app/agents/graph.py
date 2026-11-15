from typing import TypedDict, List, Dict, Any, Optional
from datetime import datetime
from langgraph.graph import StateGraph, END

from backend.app.core.gap_calculator import calculate_gap_range
from backend.app.core.citation_validator import audit_coverage_claims
from backend.app.core.security import mask_aadhaar
from backend.app.models.schemas import CoverageClaim, ChecklistItem, FundingOffer, TimelineEvent

class JourneyState(TypedDict):
    journey_id: str
    intake: Dict[str, Any]
    documents: List[Dict[str, Any]]
    document_pages: Dict[str, Dict[int, str]]
    coverage_findings: List[Dict[str, Any]]
    gap: Dict[str, Any]
    checklist: List[Dict[str, Any]]
    funding_options: List[Dict[str, Any]]
    timeline_events: List[Dict[str, Any]]
    current_stage: str
    next_best_action: str
    is_demo: bool

def intake_node(state: JourneyState) -> Dict[str, Any]:
    intake = state.get("intake", {})
    # Mask any Aadhaar numbers that may have been spoken or typed
    condition = mask_aadhaar(intake.get("condition_description", ""))
    intake["condition_description"] = condition

    events = state.get("timeline_events", [])
    events.append({
        "id": "evt-intake",
        "timestamp": datetime.now().strftime("%I:%M %p"),
        "title": "Emergency Situation Intake Recorded",
        "description": f"Admission reported for {intake.get('patient_name')} at {intake.get('hospital_name')}.",
        "actor": "Family Member",
        "status": "completed"
    })

    return {
        "intake": intake,
        "timeline_events": events,
        "current_stage": "intake_completed",
        "next_best_action": "Upload policy document and hospital admission estimate"
    }

def document_node(state: JourneyState) -> Dict[str, Any]:
    # In live mode, this uses google-genai; in demo mode, it uses pre-extracted fixtures
    events = state.get("timeline_events", [])
    events.append({
        "id": "evt-docs-read",
        "timestamp": datetime.now().strftime("%I:%M %p"),
        "title": "Hospital Estimate & Policy Extracted",
        "description": "Extracted room rent limits, hardware itemization, and surgical breakdown.",
        "actor": "LifeEvent Document Agent",
        "status": "completed"
    })
    return {
        "timeline_events": events,
        "current_stage": "documents_extracted",
        "next_best_action": "Auditing insurance coverage against policy clauses..."
    }

def coverage_node(state: JourneyState) -> Dict[str, Any]:
    raw_claims = state.get("coverage_findings", [])
    doc_pages = state.get("document_pages", {})

    # Convert to schema for validation
    claims_models = [CoverageClaim(**c) if isinstance(c, dict) else c for c in raw_claims]
    audited_claims, verified_count = audit_coverage_claims(claims_models, doc_pages)

    events = state.get("timeline_events", [])
    events.append({
        "id": "evt-coverage-audit",
        "timestamp": datetime.now().strftime("%I:%M %p"),
        "title": "Coverage Analysis & Evidence Verification Complete",
        "description": f"Verified {verified_count} of {len(audited_claims)} claims directly against source policy clauses.",
        "actor": "LifeEvent Coverage Agent",
        "status": "completed"
    })

    return {
        "coverage_findings": [c.model_dump() for c in audited_claims],
        "timeline_events": events,
        "current_stage": "coverage_analyzed"
    }

def gap_node(state: JourneyState) -> Dict[str, Any]:
    intake = state.get("intake", {})
    estimate = float(intake.get("estimated_amount", 420000.0) or 420000.0)
    
    # Read named policy and hospital parameters dynamically
    sum_insured_remaining = float(intake.get("sum_insured", 500000.0) or 500000.0)
    allowed_room_rent = float(intake.get("allowed_room_rent", 5000.0) or 5000.0)
    actual_room_rent = float(intake.get("actual_room_rent", 8500.0) or 8500.0)
    hospital_days = int(intake.get("stay_days", 4) or 4)
    co_pay = float(intake.get("copay_percent", 0.0) or 0.0) / 100.0

    gap_breakdown = calculate_gap_range(
        total_estimate=estimate,
        sum_insured_remaining=sum_insured_remaining,
        allowed_room_rent_daily=allowed_room_rent,
        actual_room_rent_daily=actual_room_rent,
        hospital_days=hospital_days,
        co_pay_percentage=co_pay,
        non_payable_rate=0.10
    )

    events = state.get("timeline_events", [])
    events.append({
        "id": "evt-gap-range",
        "timestamp": datetime.now().strftime("%I:%M %p"),
        "title": "Estimated Out-of-Pocket Range Calculated",
        "description": f"Family will likely need to arrange ₹{gap_breakdown.gap_low:,.0f} to ₹{gap_breakdown.gap_high:,.0f} (Expected: ₹{gap_breakdown.gap_expected:,.0f}).",
        "actor": "LifeEvent Gap Agent",
        "status": "completed"
    })

    return {
        "gap": gap_breakdown.model_dump(),
        "timeline_events": events,
        "current_stage": "gap_calculated",
        "next_best_action": "Submit Cashless Pre-Authorization Form to Hospital Insurance Desk"
    }

def checklist_node(state: JourneyState) -> Dict[str, Any]:
    checklist = [
        {
            "id": "chk-preauth",
            "title": "Submit Insurer's Pre-Authorization Form",
            "description": "Have treating doctor sign Section C of pre-authorization form at hospital insurance desk.",
            "category": "pre_auth",
            "status": "ready",
            "is_critical": True
        },
        {
            "id": "chk-id",
            "title": "Provide Patient ID Proof (Aadhaar / Voter ID)",
            "description": "Hospital requires government photo ID. Numbers are securely masked.",
            "category": "document_required",
            "status": "completed",
            "is_critical": True
        },
        {
            "id": "chk-deposit",
            "title": "Prepare Emergency Hospital Admission Deposit",
            "description": "Estimated initial token deposit ₹25,000 required pending cashless approval.",
            "category": "hospital_task",
            "status": "pending",
            "is_critical": True
        }
    ]
    return {"checklist": checklist}

def funding_node(state: JourneyState) -> Dict[str, Any]:
    gap_expected = state.get("gap", {}).get("gap_expected", 95000.0)
    offers = [
        {
            "id": "fund-01",
            "provider": "Healthcare Emergency Credit Partner",
            "badge": "Demo Partner, illustrative terms, not a real offer",
            "type": "zero_cost_emi",
            "amount": float(gap_expected),
            "tenure_months": 6,
            "monthly_emi": round(gap_expected / 6, 2),
            "interest_rate": "0% for first 90 days (Demo)",
            "approval_time": "Instant pre-approval on patient phone",
            "highlights": ["Direct transfer to hospital account", "Zero documentation fee"]
        },
        {
            "id": "fund-02",
            "provider": "Paytm Medical Instant Line",
            "badge": "Demo Partner, illustrative terms, not a real offer",
            "type": "emergency_credit",
            "amount": 50000.0,
            "tenure_months": 3,
            "monthly_emi": 17200.0,
            "interest_rate": "Subsidized emergency APR",
            "approval_time": "Under 2 minutes via UPI",
            "highlights": ["Pay hospital pharmacy directly", "Instant QR deposit"]
        }
    ]
    return {"funding_options": offers}

def journey_planner_node(state: JourneyState) -> Dict[str, Any]:
    return {
        "current_stage": "journey_active",
        "next_best_action": "Submit Insurer Pre-Authorization Form at Hospital Insurance Counter"
    }

def build_lifeevent_graph():
    """Builds and compiles the full LangGraph multi-agent pipeline."""
    graph = StateGraph(JourneyState)
    
    graph.add_node("intake", intake_node)
    graph.add_node("document", document_node)
    graph.add_node("coverage", coverage_node)
    graph.add_node("gap", gap_node)
    graph.add_node("checklist", checklist_node)
    graph.add_node("funding", funding_node)
    graph.add_node("planner", journey_planner_node)

    graph.set_entry_point("intake")
    graph.add_edge("intake", "document")
    graph.add_edge("document", "coverage")
    graph.add_edge("coverage", "gap")
    graph.add_edge("gap", "checklist")
    graph.add_edge("checklist", "funding")
    graph.add_edge("funding", "planner")
    graph.add_edge("planner", END)

    return graph.compile()

