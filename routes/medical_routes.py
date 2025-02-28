from flask import Blueprint, jsonify
from database.mongodb import get_mongo_connection

medical_routes = Blueprint('medical_routes', __name__)

@medical_routes.route('/medical_records/<patient_id>', methods=['GET'])
def get_patient_medical_record(patient_id):
    try:
        db = get_mongo_connection()
        collection = db.stdmedicalhist

        # Convert patient_id to an integer if it's numeric
        query = {"Patient_ID": patient_id}
        if patient_id.isdigit():
            query = {"$or": [{"Patient_ID": patient_id}, {"Patient_ID": int(patient_id)}]}  

        records = list(collection.find(query, {"_id": 0}))

        if not records:
            return jsonify({"error": "No medical records found for this Patient ID"}), 404

        return jsonify({"medical_records": records})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
