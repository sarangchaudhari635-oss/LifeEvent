import re
from typing import List, Dict, Tuple
from backend.app.models.schemas import CoverageClaim

def normalize_text(text: str) -> str:
    """Normalizes whitespace and converts text to lowercase for exact substring matching."""
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text).strip().lower()

def validate_citation(page_text: str, passage_quote: str) -> bool:
    """
    Checks if a passage quote actually exists in the specific page's stored source text.
    """
    if not page_text or not passage_quote:
        return False
    norm_page = normalize_text(page_text)
    norm_quote = normalize_text(passage_quote)
    return norm_quote in norm_page

def audit_coverage_claims(
    claims: List[CoverageClaim],
    document_pages: Dict[str, Dict[int, str]]
) -> Tuple[List[CoverageClaim], int]:
    """
    Validates all coverage findings against their specific document and page.
    `document_pages` structure: { "document_name": { page_number: "page_text_content" } }
    """
    verified_count = 0
    audited = []

    for claim in claims:
        doc_pages = document_pages.get(claim.evidence_doc, {})
        page_text = doc_pages.get(claim.evidence_page, "")
        
        # Verify page existence and textual quote
        if page_text and validate_citation(page_text, claim.evidence_passage):
            claim.is_verified = True
            verified_count += 1
        else:
            claim.is_verified = False
            claim.confidence = "Needs TPA Confirmation (Unverified in Document)"
        
        audited.append(claim)

    return audited, verified_count
