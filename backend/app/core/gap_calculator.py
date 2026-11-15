from typing import List, Dict, Any
from backend.app.models.schemas import GapBreakdown

def calculate_gap_range(
    total_estimate: float,
    sum_insured_remaining: float,
    allowed_room_rent_daily: float,
    actual_room_rent_daily: float,
    hospital_days: int,
    co_pay_percentage: float = 0.0,
    non_payable_rate: float = 0.10
) -> GapBreakdown:
    """
    Computes an estimated out-of-pocket range rather than a single fake exact number.
    Applies real-world Indian health insurance rules:
    - Room rent proportional deductions across associated charges
    - Co-pay obligations
    - Non-payable hospital consumables (gloves, sanitizers, admin charges)
    - Sum insured caps
    """
    assumptions = []

    # 1. Non-payable hospital consumables (standard in Indian hospitals ~8-12%)
    non_payables = round(total_estimate * non_payable_rate, 2)
    assumptions.append(f"Estimated non-medical consumables (PPE, sanitizers, administrative fees): ~{int(non_payable_rate*100)}% (₹{non_payables:,.0f})")

    admissible_base = max(0.0, total_estimate - non_payables)

    # 2. Room rent proportional deduction calculation
    room_rent_deduction = 0.0
    if actual_room_rent_daily > allowed_room_rent_daily and allowed_room_rent_daily > 0:
        ratio = allowed_room_rent_daily / actual_room_rent_daily
        # Room rent difference itself
        direct_room_excess = (actual_room_rent_daily - allowed_room_rent_daily) * hospital_days
        # Associated medical fees scaled by proportionality
        associated_charges = max(0.0, admissible_base - (actual_room_rent_daily * hospital_days))
        associated_loss = associated_charges * (1.0 - ratio)
        room_rent_deduction = round(direct_room_excess + (associated_loss * 0.5), 2)
        assumptions.append(
            f"Room rent exceeded policy eligibility (₹{allowed_room_rent_daily:,.0f}/day allowed vs ₹{actual_room_rent_daily:,.0f}/day billed), triggering estimated proportional deduction of ₹{room_rent_deduction:,.0f}"
        )

    covered_before_copay = max(0.0, admissible_base - room_rent_deduction)

    # 3. Sum insured cap
    if covered_before_copay > sum_insured_remaining:
        excess_over_sum_insured = covered_before_copay - sum_insured_remaining
        covered_before_copay = sum_insured_remaining
        assumptions.append(f"Hospital estimate exceeds remaining sum insured limit (₹{sum_insured_remaining:,.0f})")

    # 4. Co-pay calculation
    co_pay_amount = 0.0
    if co_pay_percentage > 0:
        co_pay_amount = round(covered_before_copay * (co_pay_percentage / 100.0), 2)
        assumptions.append(f"Policy mandates {int(co_pay_percentage)}% co-payment on approved charges (₹{co_pay_amount:,.0f})")

    likely_covered_base = max(0.0, covered_before_copay - co_pay_amount)

    # 5. Calculate range (Optimistic, Expected, Conservative)
    gap_expected = round(total_estimate - likely_covered_base, 2)
    # Optimistic: assumes TPA waives 30% of consumable exclusions and room deduction leniency
    gap_low = max(0.0, round(gap_expected - (non_payables * 0.3) - (room_rent_deduction * 0.2), 2))
    # Conservative: strict audit, additional consumable denials, full co-pay
    gap_high = round(gap_expected + (total_estimate * 0.05), 2)

    confidence = "High" if (actual_room_rent_daily <= allowed_room_rent_daily and co_pay_percentage == 0) else "Medium"
    if room_rent_deduction > 0 or co_pay_percentage > 0:
        confidence = "Needs TPA Confirmation"

    return GapBreakdown(
        total_estimate=round(total_estimate, 2),
        likely_covered_base=round(likely_covered_base, 2),
        gap_low=gap_low,
        gap_high=gap_high,
        gap_expected=gap_expected,
        confidence=confidence,
        assumptions=assumptions,
        room_rent_proportional_deduction=room_rent_deduction,
        co_pay_amount=co_pay_amount,
        non_payable_consumables=non_payables,
        remaining_sum_insured=round(sum_insured_remaining, 2)
    )

