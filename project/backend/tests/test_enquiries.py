import pytest
from httpx import AsyncClient, ASGITransport
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from server import app

pytestmark = pytest.mark.asyncio

async def test_post_enquiry_valid():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        valid_data = {
            "name": "John Doe",
            "email": "john.doe@example.com",
            "phone": "1234567890",
            "message": "I want a custom ring",
            "enquiry_type": "Custom Design"
        }
        # Using unique IP to avoid slowapi rate limit from tests
        response = await ac.post("/api/enquiries", json=valid_data, headers={"X-Forwarded-For": "10.0.0.2"})
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "John Doe"
        assert "id" in data

async def test_post_enquiry_invalid_email():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        invalid_data = {
            "name": "John Doe",
            "email": "not-an-email",
            "phone": "1234567890",
            "message": "I want a custom ring",
            "enquiry_type": "Custom Design"
        }
        response = await ac.post("/api/enquiries", json=invalid_data, headers={"X-Forwarded-For": "10.0.0.3"})
        assert response.status_code == 422

async def test_post_enquiry_empty_name():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        invalid_data = {
            "name": "",  # Empty name should fail min_length=1
            "email": "john.doe@example.com",
            "phone": "1234567890",
            "message": "I want a custom ring",
            "enquiry_type": "Custom Design"
        }
        response = await ac.post("/api/enquiries", json=invalid_data, headers={"X-Forwarded-For": "10.0.0.4"})
        assert response.status_code == 422
