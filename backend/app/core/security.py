import re

# The Verhoeff algorithm multiplication table
_d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
]

# Permutation table
_p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
]

# Inverse table
_inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9]

def is_valid_verhoeff(num_str: str) -> bool:
    """Validates an Indian Aadhaar number using the Verhoeff checksum algorithm."""
    if not num_str.isdigit() or len(num_str) != 12:
        return False
    # Check that it doesn't start with 0 or 1 (Aadhaar rule)
    if num_str[0] in ('0', '1'):
        return False
    c = 0
    reversed_digits = [int(x) for x in reversed(num_str)]
    for i, digit in enumerate(reversed_digits):
        c = _d[c][_p[i % 8][digit]]
    return c == 0

# Matches 12-digit numbers formatted as 4-4-4, space separated, or continuous
AADHAAR_CANDIDATE_REGEX = re.compile(r'(?<![A-Za-z0-9])(\d{4}[ -]?\d{4}[ -]?\d{4})(?![A-Za-z0-9])')

def mask_aadhaar(text: str) -> str:
    """
    Finds 12-digit sequences, verifies with Verhoeff, and masks the first 8 digits.
    Leaves phone numbers (10 digits) and policy numbers (alphanumeric or non-Verhoeff) untouched.
    """
    if not text:
        return text

    def _replace(match):
        raw = match.group(1)
        digits = re.sub(r'\D', '', raw)
        if len(digits) == 12 and is_valid_verhoeff(digits):
            return f"XXXX-XXXX-{digits[-4:]}"
        return raw

    return AADHAAR_CANDIDATE_REGEX.sub(_replace, text)

def sanitize_logs(data: dict) -> dict:
    """Recursively masks Aadhaar numbers in dictionaries before logging."""
    sanitized = {}
    for k, v in data.items():
        if isinstance(v, str):
            sanitized[k] = mask_aadhaar(v)
        elif isinstance(v, dict):
            sanitized[k] = sanitize_logs(v)
        elif isinstance(v, list):
            sanitized[k] = [mask_aadhaar(item) if isinstance(item, str) else item for item in v]
        else:
            sanitized[k] = v
    return sanitized
