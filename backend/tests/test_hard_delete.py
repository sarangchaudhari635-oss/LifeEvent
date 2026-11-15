import pytest
from fastapi.testclient import TestClient
from backend.app.main import app, JOURNEY_STORE

client = TestClient(app)

def test_hard_delete_journey():
    # Insert a dummy journey
    j_id = "test-delete-journey-99"
    JOURNEY_STORE[j_id] = {"id": j_id, "patient_name": "Test Delete"}

    assert j_id in JOURNEY_STORE
    
    # Execute hard delete
    res = client.delete(f"/api/journey/{j_id}")
    assert res.status_code == 200
    assert res.json()["status"] == "success"

    # Confirm it is permanently deleted from store
    assert j_id not in JOURNEY_STORE

def test_health_endpoint():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["active_journeys"] >= 1

