import pytest
from backend.app.agents.graph import build_lifeevent_graph
from backend.app.sample_data.fixtures import SCENARIO_CARDIAC

def test_langgraph_execution_cardiac_scenario():
    graph = build_lifeevent_graph()
    scen = SCENARIO_CARDIAC

    state = {
        "journey_id": "test-graph-01",
        "intake": {
            "patient_name": scen["patient_name"],
            "relation": scen["relation"],
            "hospital_name": scen["hospital_name"],
            "city": scen["city"],
            "condition_description": scen["condition_description"],
            "urgency": scen["urgency"],
            "language": scen["language"],
            "estimated_amount": scen["hospital_estimate"]["total_amount"],
            "is_demo": True
        },
        "documents": [{"name": "Sample_Health_Policy_Document.pdf", "type": "health_policy"}],
        "document_pages": scen["document_pages"],
        "coverage_findings": [
            {
                "category": "Room Rent & Nursing Expenses",
                "estimated_cost": 34000.0,
                "likely_covered": 20000.0,
                "out_of_pocket": 14000.0,
                "confidence": "High",
                "evidence_doc": "Sample_Health_Policy_Document.pdf",
                "evidence_page": 3,
                "evidence_passage": "The company shall indemnify room, boarding, and nursing expenses up to a maximum of INR 5,000 per day for standard category rooms.",
                "clause_ref": "Section 2.1"
            }
        ],
        "gap": {},
        "checklist": [],
        "funding_options": [],
        "timeline_events": [],
        "current_stage": "started",
        "next_best_action": "",
        "is_demo": True
    }

    result = graph.invoke(state)

    assert result["current_stage"] == "journey_active"
    assert len(result["timeline_events"]) >= 3
    assert len(result["checklist"]) >= 2
    assert len(result["funding_options"]) >= 1
    assert result["gap"]["gap_expected"] > 0
    assert result["coverage_findings"][0]["is_verified"] is True

