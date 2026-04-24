import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from passlib.context import CryptContext
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from server import app
app.state.limiter.enabled = False

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed_password = pwd_context.hash("23Bcs119")

@pytest.fixture(autouse=True)
def mock_db():
    with patch("server.db") as mock_db:
        # ---- Organizers Mock ----
        mock_db.organizers.find_one = AsyncMock(return_value={
            "email": "dgm.jewellerss@gmail.com",
            "password": hashed_password,
            "must_change_password": False
        })
        mock_db.organizers.insert_one = AsyncMock()
        mock_db.organizers.update_one = AsyncMock()

        # ---- Activity Logs Mock ----
        mock_db.activity_logs.insert_one = AsyncMock()

        # ---- Products Mock ----
        mock_db.products.insert_one = AsyncMock()
        mock_db.products.update_one = AsyncMock()
        mock_db.products.delete_one = AsyncMock()
        mock_db.products.delete_one.return_value.deleted_count = 1
        mock_db.products.find_one = AsyncMock(return_value=None)
        
        # Products find chain: find().sort().to_list() or find().sort().limit().to_list()
        mock_product_cursor = MagicMock()
        mock_product_cursor.to_list = AsyncMock(return_value=[])
        mock_product_cursor.limit.return_value = mock_product_cursor
        mock_product_cursor.sort.return_value = mock_product_cursor
        mock_db.products.find = MagicMock(return_value=mock_product_cursor)

        # ---- Enquiries Mock ----
        mock_db.enquiries.insert_one = AsyncMock()
        
        mock_enquiry_cursor = MagicMock()
        mock_enquiry_cursor.to_list = AsyncMock(return_value=[])
        mock_enquiry_cursor.sort.return_value = mock_enquiry_cursor
        mock_db.enquiries.find = MagicMock(return_value=mock_enquiry_cursor)

        # ---- Metal Rates Mock ----
        mock_db.metal_rates.find_one = AsyncMock(return_value=None) # will use default
        
        # Patch send email so we don't send anything
        with patch("server.send_email", new_callable=AsyncMock):
            yield mock_db
