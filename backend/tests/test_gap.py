import pytest
from backend.app.core.gap_calculator import calculate_gap_range

def test_gap_range_structure():
    # Cardiac emergency scenario: ₹4,20,000 estimate, ₹5,000 allowed room rent vs ₹8,500 actual for 4 days
    res = calculate_gap_range(
        total_estimate=420000.0,
        sum_insured_remaining=450000.0,
        allowed_room_rent_daily=5000.0,
        actual_room_rent_daily=8500.0,
        hospital_days=4,
        co_pay_percentage=0.0,
        non_payable_rate=0.10
    )

    # Range ordering check
    assert res.gap_low <= res.gap_expected
    assert res.gap_expected <= res.gap_high
    assert res.gap_low > 0

    # Non-payable consumables check: 10% of 420,000 = 42,000
    assert res.non_payable_consumables == 42000.0

    # Proportional deduction check
    assert res.room_rent_proportional_deduction > 0

    # Assumptions list populated
    assert len(res.assumptions) >= 2
    assert res.confidence == "Needs TPA Confirmation"

def test_gap_with_copay():
    # Orthopedic scenario: 10% co-pay
    res = calculate_gap_range(
        total_estimate=185000.0,
        sum_insured_remaining=300000.0,
        allowed_room_rent_daily=3000.0,
        actual_room_rent_daily=3000.0,
        hospital_days=3,
        co_pay_percentage=10.0,
        non_payable_rate=0.10
    )

    # Co-pay applied on admissible charges
    assert res.co_pay_amount > 0
    assert res.room_rent_proportional_deduction == 0.0
    assert res.gap_expected > res.co_pay_amount

