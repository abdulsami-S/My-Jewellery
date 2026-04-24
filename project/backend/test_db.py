import asyncio
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

async def test_db():
    try:
        mongo_url = os.environ.get('MONGO_URL')
        client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
        db = client[os.environ.get('DB_NAME', 'jewellery')]
        
        email = "dgm.jewellerss@gmail.com"
        organizer = await db.organizers.find_one({"email": email}, {"_id": 0})
        if organizer:
            print(f"Password hash: {organizer.get('password')}")
            
            from passlib.context import CryptContext
            pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            
            try:
                result = pwd_context.verify("password123", organizer.get('password'))
                print(f"Verify test: {result}")
            except Exception as pe:
                print(f"Password verify error: {type(pe).__name__} - {str(pe)}")
            
    except Exception as e:
        print(f"ERROR: {type(e).__name__} - {str(e)}")
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    asyncio.run(test_db())
