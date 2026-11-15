import pytest
from backend.app.core.security import mask_aadhaar, is_valid_verhoeff

def test_aadhaar_masking_with_verhoeff():
    # Valid Verhoeff 12-digit number: 2345 6789 0124
    assert is_valid_verhoeff("234567890124") is True
    raw = "Patient Aadhaar is 2345 6789 0124 for verification."
    masked = mask_aadhaar(raw)
    assert "XXXX-XXXX-0124" in masked
    assert "2345" not in masked

def test_phone_number_not_masked():
    # 10-digit Indian mobile numbers must NEVER be masked
    phone1 = "Call attendee at 9822012345 immediately."
    phone2 = "Emergency contact: +91 98220 54321."
    assert mask_aadhaar(phone1) == phone1
    assert mask_aadhaar(phone2) == phone2

def test_policy_number_not_masked():
    # Policy numbers must NEVER be masked
    pol = "Policy Number: SHI-SAMPLE-2024-8841 is currently active."
    assert mask_aadhaar(pol) == pol

def test_non_verhoeff_12_digits_not_masked():
    # 12 digits with invalid checksum (234567890125) should not be masked as Aadhaar
    assert is_valid_verhoeff("234567890125") is False
    invalid_num = "Account Ref: 234567890125."
    assert "XXXX-XXXX-" not in mask_aadhaar(invalid_num)
