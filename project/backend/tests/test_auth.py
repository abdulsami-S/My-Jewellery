import pytest
from httpx import AsyncClient, ASGITransport
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from server import app

pytestmark = pytest.mark.asyncio

async def test_valid_login():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/organizer/login", json={"email": "dgm.jewellerss@gmail.com", "password": "23Bcs119"})
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "access_token" in data

async def test_invalid_password():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/organizer/login", json={"email": "dgm.jewellerss@gmail.com", "password": "wrongpassword"})
        assert response.status_code == 401
        assert response.json()["detail"] == "Invalid credentials"

async def test_missing_fields():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Missing password
        response = await ac.post("/api/organizer/login", json={"email": "dgm.jewellerss@gmail.com"})
        assert response.status_code == 422

async def test_rate_limiting():
    app.state.limiter.enabled = True
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            # 5 attempts should eventually trigger rate limiting
            # Use a unique IP for this test to avoid interfering with other tests
            headers = {"X-Forwarded-For": "10.0.0.1"}
            for _ in range(5):
                await ac.post("/api/organizer/login", json={"email": "dummy@test.com", "password": "123"}, headers=headers)
            
            # 6th attempt must be blocked
            response = await ac.post("/api/organizer/login", json={"email": "dummy@test.com", "password": "123"}, headers=headers)
            assert response.status_code == 429
    finally:
        app.state.limiter.enabled = False
