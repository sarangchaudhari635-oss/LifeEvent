"""
LifeEvent AI - Pre-recorded Emergency Scenarios & Fixtures
All entity names are fictional ("Sample Health Insurance Co.", "Sample City Hospital").
All terms are recorded fixtures allowing 100% offline hackathon demonstration.
"""

from typing import Dict, Any

SCENARIO_CARDIAC = {
    "id": "demo-journey-cardiac-01",
    "patient_name": "Ramesh Kulkarni",
    "relation": "father",
    "hospital_name": "Sample City Hospital",
    "city": "Pune",
    "condition_description": "Acute chest pain, diagnosed with acute coronary syndrome, immediate angioplasty recommended.",
    "urgency": "critical",
    "language": "en",
    "voice_transcript": "My father Ramesh Kulkarni has severe chest pain. We rushed him to Sample City Hospital. Doctors are saying he needs urgent angioplasty. We have Sample Health Insurance but I don't know what is covered or what to arrange right now.",
    "policy_details": {
        "insurer_name": "Sample Health Insurance Co.",
        "policy_number": "SHI-SAMPLE-2024-8841",
        "sum_insured": 500000.0,
        "sum_insured_remaining": 450000.0,
        "allowed_room_rent_daily": 5000.0,
        "co_pay_percentage": 0.0,
        "waiting_period_months": 24,
        "policy_start_year": 2021
    },
    "hospital_estimate": {
        "hospital_name": "Sample City Hospital",
        "estimate_number": "EST-SCH-8942",
        "total_amount": 420000.0,
        "room_type": "Single Deluxe Private Room",
        "actual_room_rent_daily": 8500.0,
        "expected_stay_days": 4,
        "line_items": [
            {"category": "Room Rent & Nursing (4 days @ ₹8,500)", "amount": 34000.0},
            {"category": "ICU & Critical Monitoring (1 day)", "amount": 25000.0},
            {"category": "Cath Lab, Angioplasty & Stent Hardware", "amount": 240000.0},
            {"category": "Surgical Team, Cardiologist & Anesthesia", "amount": 65000.0},
            {"category": "Pharmacy, Contrast Dye & Medical Consumables", "amount": 42000.0},
            {"category": "Diagnostics, ECG, Troponin-I & Echo", "amount": 14000.0}
        ]
    },
    # Page-by-page text for citation verification
    "document_pages": {
        "Sample_Health_Policy_Document.pdf": {
            1: "SAMPLE HEALTH INSURANCE CO. - POLICY SCHEDULE. Policyholder: Ramesh Kulkarni. Total Sum Insured: INR 5,00,000. Cumulative Bonus: INR 50,000.",
            3: "SECTION 2.1: ROOM RENT LIMITATION. The company shall indemnify room, boarding, and nursing expenses up to a maximum of INR 5,000 per day for standard category rooms.",
            4: "SECTION 2.1.2: PROPORTIONAL DEDUCTION CLAUSE. If the insured occupies a room with room rent higher than the entitled limit, the company shall pay all associated medical expenses in proportion to the entitled room rent limit to the actual room rent paid.",
            7: "SECTION 4.8: EXCLUDED CHARGES AND CONSUMABLES. Expenses incurred on non-medical items including surgical gloves, PPE kits, patient registration charges, and sanitization kits are non-payable by the company."
        },
        "Hospital_PreAuth_Estimate.pdf": {
            1: "SAMPLE CITY HOSPITAL - EMERGENCY ADMISSION ESTIMATE. Patient: Ramesh Kulkarni. Diagnosis: Acute Coronary Syndrome. Treatment Plan: PTCA with Drug Eluting Stent. Total Estimated Cost: INR 4,20,000.",
            2: "Room Category Selected: Single Deluxe Private Room @ INR 8,500 per day. Expected Stay: 4 Days. Treating Cardiologist: Dr. A. Joshi."
        }
    },
    # Unverified claim fixture for testing citation validator failure
    "fake_unverified_passage": "The insurer promises 100% full reimbursement of all five-star suite luxuries without any deduction."
}

# The "Living Journey" Re-Planning Fixture: A TPA query arrives 2 hours after admission
TPA_QUERY_UPDATE_FIXTURE = {
    "event_type": "tpa_query_received",
    "title": "Insurer TPA Pre-Authorization Query Received",
    "description": "Insurer TPA requests clarification: Doctor's initial emergency ECG report and formal pre-authorization claim request form.",
    "new_document": {
        "doc_id": "doc-tpa-query-01",
        "doc_type": "tpa_query",
        "file_name": "Sample_TPA_Query_Letter.pdf",
        "extracted_text": "SAMPLE HEALTH TPA SERVICES: Initial review completed. Query: Please submit initial ECG strip taken at casualty and treating physician clinical notes to process initial cashless sanction of INR 1,50,000."
    },
    "new_tasks": [
        {
            "id": "task-urgent-ecg",
            "title": "Submit Casualty ECG Strip to TPA Counter",
            "description": "Collect the initial casualty admission ECG report from Ward 3 nursing station and submit to hospital insurance desk.",
            "category": "pre_auth",
            "status": "pending",
            "is_critical": True
        }
    ]
}

SCENARIO_ORTHOPEDIC = {
    "id": "demo-journey-ortho-02",
    "patient_name": "Sunita Patil",
    "relation": "mother",
    "hospital_name": "Sample Metropolitan Hospital",
    "city": "Pune",
    "condition_description": "Compound fracture left femur following slip, emergency internal fixation surgery needed.",
    "urgency": "urgent",
    "language": "mr",
    "voice_transcript": "माझ्या आईचा अपघात झाला आहे, डाव्या पायाचे हाड मोडले आहे. सॅम्पल मेट्रोपॉलिटन हॉस्पिटलमध्ये दाखल केले आहे. तातडीची शस्त्रक्रिया करावी लागेल असे डॉक्टर सांगत आहेत.",
    "policy_details": {
        "insurer_name": "Sample Care Health",
        "policy_number": "SCH-CARE-2023-1190",
        "sum_insured": 300000.0,
        "sum_insured_remaining": 300000.0,
        "allowed_room_rent_daily": 3000.0,
        "co_pay_percentage": 10.0,
        "waiting_period_months": 12,
        "policy_start_year": 2022
    },
    "hospital_estimate": {
        "hospital_name": "Sample Metropolitan Hospital",
        "estimate_number": "EST-SMH-4410",
        "total_amount": 185000.0,
        "room_type": "Twin Sharing Room",
        "actual_room_rent_daily": 3000.0,
        "expected_stay_days": 3
    },
    "document_pages": {
        "Sample_Care_Policy_Document.pdf": {
            1: "SAMPLE CARE HEALTH INSURANCE. Policyholder: Sunita Patil. Base Sum Insured: INR 3,00,000.",
            2: "CLAUSE 3.2: CO-PAYMENT. A mandatory co-payment of 10% shall apply to each and every admissible claim under this policy for persons aged 60 and above.",
            5: "CLAUSE 5.1: SURGICAL APPLIANCES. Orthopedic implants, titanium plates, and screws are covered up to the specified implant schedule."
        }
    }
}

