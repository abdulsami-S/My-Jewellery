# create_organizer.py
import os
import sys
from pathlib import Path
from datetime import datetime
from getpass import getpass

# dependencies: pymongo, python-dotenv, passlib
try:
    from pymongo import MongoClient
except Exception as e:
    print("pymongo not installed or import error:", e)
    sys.exit(1)

try:
    from passlib.hash import bcrypt
except Exception as e:
    print("passlib not installed or import error:", e)
    sys.exit(1)

# load .env if present
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    print("Loading .env from", env_path)
    try:
        from dotenv import load_dotenv
        load_dotenv(env_path)
    except Exception as e:
        print("python-dotenv not installed or could not load .env:", e)

# Try multiple env var names for DB URI
possible_envs = ["MONGO_URI", "MONGO_URL", "DATABASE_URL", "MONGODB_URI", "MONGO_CONNECTION_STRING"]
mongo_uri = None
for name in possible_envs:
    val = os.environ.get(name)
    if val:
        mongo_uri = val
        print(f"Using {name} from environment.")
        break

if not mongo_uri:
    # if not found prompt user
    mongo_uri = input("MongoDB URI not found in .env. Paste your MongoDB URI (e.g. mongodb://localhost:27017): ").strip()
    if not mongo_uri:
        print("No MongoDB URI provided. Exiting.")
        sys.exit(1)

print("Connecting to MongoDB...")
client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
try:
    # quick ping
    client.admin.command('ping')
except Exception as e:
    print("Could not connect to MongoDB. Error:", e)
    sys.exit(1)

# default database name: try to infer from env or use 'test' / 'dgm'
db_name = os.environ.get("MONGO_DB") or os.environ.get("DATABASE_NAME") or os.environ.get("DB_NAME") or None
if not db_name:
    # try to parse DB from URI (mongodb://host:port/dbname)
    try:
        uri_path = mongo_uri.split("/", 3)
        if len(uri_path) >= 4 and uri_path[3]:
            db_name = uri_path[3].split("?")[0]
    except Exception:
        db_name = None

if not db_name:
    db_name = input("Could not infer DB name. Enter the database name to use (e.g. 'dgm', 'default', press Enter to use 'dgm'): ").strip() or "dgm"

print("Using database:", db_name)
db = client[db_name]

# Set organizer credentials here
email = "dgm.jewellerss@gmail.com"
password = "23BCS119"   # <-- YOUR NEW PASSWORD
print(f"Will create/update organizer with email: {email}")

# Hash the password using bcrypt
hashed = bcrypt.hash(password)
now = datetime.utcnow().isoformat() + "Z"

doc = {
    "email": email,
    "hashed_password": hashed,   # many apps use hashed_password or password
    "password": hashed,          # insert both the hashed field names commonly used
    "name": "Owner",
    "role": "organizer",
    "is_active": True,
    "created_at": now,
    "updated_at": now,
}

# Collections to try
collections_to_try = ["organizers", "organizer", "users", "admins", "owners"]

inserted_or_updated = False
for coll_name in collections_to_try:
    coll = db[coll_name]
    existing = coll.find_one({"email": email})

    if existing:
        # keep old created_at if present
        if "created_at" in existing:
            doc["created_at"] = existing["created_at"]

        try:
            result = coll.update_one(
                {"email": email},
                {"$set": doc}
            )
            print(
                f"Updated existing organizer in collection '{coll_name}'. "
                f"Matched: {result.matched_count}, Modified: {result.modified_count}"
            )
            inserted_or_updated = True
        except Exception as e:
            print(f"Could not update in '{coll_name}':", e)
    else:
        try:
            result = coll.insert_one(doc)
            print(f"Inserted new organizer into collection '{coll_name}' with _id: {result.inserted_id}")
            inserted_or_updated = True
        except Exception as e:
            print(f"Could not insert into '{coll_name}':", e)

if not inserted_or_updated:
    print("Could not insert or update any of the tried collections. You may need to inspect the DB schema or provide a different collection name.")
else:
    print("Organizer creation/update script finished. Try logging in at the frontend now.")
