from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGO_URI, DATABASE_NAME

# Create a single MongoDB client for the whole application
client = AsyncIOMotorClient(MONGO_URI)

# Select the database
database = client[DATABASE_NAME]

# Collections
users_collection = database["users"]
complaints_collection = database["complaints"]
