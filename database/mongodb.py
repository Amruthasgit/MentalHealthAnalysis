from pymongo import MongoClient

def get_mongo_connection():
    """Establishes connection to MongoDB and returns the database."""
    client = MongoClient("mongodb://localhost:27017/")
    return client["studentdata"]

def fetch_medical_records():
    """Fetches all medical records from MongoDB without image data."""
    db = get_mongo_connection()
    collection = db["stdmedicalhist"]

    # Fetch all medical records, excluding _id
    medical_data = list(collection.find({}, {"_id": 0}))

    return medical_data

def fetch_student_profile(student_id):
    """Fetches a specific student's medical profile from MongoDB."""
    db = get_mongo_connection()
    collection = db["stdmedicalhist"]

    return collection.find_one({"Student_ID": student_id}, {"_id": 0})
