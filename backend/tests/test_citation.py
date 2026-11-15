import pytest
from backend.app.core.citation_validator import audit_coverage_claims, validate_citation
from backend.app.models.schemas import CoverageClaim

SAMPLE_DOC_PAGES = {
    "Sample_Health_Policy_Document.pdf": {
        1: "SAMPLE HEALTH INSURANCE CO. - POLICY SCHEDULE. Policyholder: Ramesh Kulkarni. Total Sum Insured: INR 5,00,000.",
        3: "SECTION 2.1: ROOM RENT LIMITATION. The company shall indemnify room, boarding, and nursing expenses up to a maximum of INR 5,00,000 per day for standard category rooms.",
        4: "SECTION 2.1.2: PROPORTIONAL DEDUCTION CLAUSE. If the insured occupies a room with room rent higher than the entitled limit, the company shall pay all associated medical expenses in proportion."
    }
}

def test_citation_matching_exact_quote():
    page_text = SAMPLE_DOC_PAGES["Sample_Health_Policy_Document.pdf"][4]
    quote = "If the insured occupies a room with room rent higher than the entitled limit"
    assert validate_citation(page_text, quote) is True

def test_citation_fails_on_wrong_page():
    claim = CoverageClaim(
        category="Proportional Deduction",
        estimated_cost=10000.0,
        likely_covered=0.0,
        out_of_pocket=10000.0,
        confidence="High",
        evidence_doc="Sample_Health_Policy_Document.pdf",
        evidence_page=1, # Clause is on page 4, NOT page 1!
        evidence_passage="If the insured occupies a room with room rent higher than the entitled limit",
        clause_ref="Section 2.1.2"
    )
    audited, verified_count = audit_coverage_claims([claim], SAMPLE_DOC_PAGES)
    assert verified_count == 0
    assert audited[0].is_verified is False
    assert "Unverified" in audited[0].confidence

def test_citation_fails_on_hallucinated_text():
    claim = CoverageClaim(
        category="Five Star Suite",
        estimated_cost=50000.0,
        likely_covered=50000.0,
        out_of_pocket=0.0,
        confidence="High",
        evidence_doc="Sample_Health_Policy_Document.pdf",
        evidence_page=3,
        evidence_passage="The company agrees to pay 100% of luxury hotel presidential suite stays with free gourmet catering.",
        clause_ref="Clause Fake"
    )
    audited, verified_count = audit_coverage_claims([claim], SAMPLE_DOC_PAGES)
    assert verified_count == 0
    assert audited[0].is_verified is False
    assert "Unverified" in audited[0].confidence

