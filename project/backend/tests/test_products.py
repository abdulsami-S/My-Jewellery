import pytest
from httpx import AsyncClient, ASGITransport
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from server import app

pytestmark = pytest.mark.asyncio

async def get_token(ac: AsyncClient):
    headers = {"X-Forwarded-For": "10.0.0.50"}
    response = await ac.post("/api/organizer/login", json={"email": "dgm.jewellerss@gmail.com", "password": "23Bcs119"}, headers=headers)
    if response.status_code == 200:
        return response.json().get("access_token")
    return None

async def test_get_products_list():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/products")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

async def test_post_product_no_token():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/products", json={
            "name": "Test Ring",
            "description": "Test",
            "metal_type": "Gold",
            "purity": "22K",
            "weight": 5.5,
            "making_charges": 500.0,
            "category": "Women",
            "occasion": "Daily Wear"
        })
        assert response.status_code == 401

async def test_post_product_valid():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        token = await get_token(ac)
        headers = {"Authorization": f"Bearer {token}"}
        valid_data = {
            "name": "Test Ring",
            "description": "A beautiful ring",
            "metal_type": "Gold",
            "purity": "22K",
            "weight": 5.5,
            "making_charges": 500.0,
            "category": "Women",
            "occasion": "Daily Wear"
        }
        response = await ac.post("/api/products", json=valid_data, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Test Ring"
        assert "id" in data
        
        # Cleanup created product
        product_id = data["id"]
        await ac.delete(f"/api/products/{product_id}", headers=headers)

async def test_post_product_missing_fields():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        token = await get_token(ac)
        headers = {"Authorization": f"Bearer {token}"}
        # Missing required fields like metal_type, weight, etc.
        invalid_data = {
            "name": "Test Ring",
            "description": "A beautiful ring"
        }
        response = await ac.post("/api/products", json=invalid_data, headers=headers)
        assert response.status_code == 422

async def test_delete_product_no_token():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.delete("/api/products/some-random-id")
        assert response.status_code == 401
