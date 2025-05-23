from flask import Blueprint, jsonify  # already done
from database.mongodb import get_mongo_connection
from collections import Counter
from bson.json_util import dumps

medical_routes = Blueprint('medical_routes', __name__)

@medical_routes.route('/medical_records/<patient_id>', methods=['GET'])
def get_patient_medical_record(patient_id):
    try:
        db = get_mongo_connection()
        collection = db.stdmedicalhist

        # Convert patient_id to an integer if numeric
        query = {"Patient_ID": patient_id}
        if patient_id.isdigit():
            query = {"$or": [{"Patient_ID": patient_id}, {"Patient_ID": int(patient_id)}]}  

        records = list(collection.find(query, {"_id": 0}))  # 🟢 FIXED HERE

        if not records:
            return jsonify({"error": "No medical records found for this Patient ID"}), 404

        return jsonify({"medical_records": records})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@medical_routes.route('/diagnosis_chart_data', methods=['GET'])  # ✅ removed /api
def diagnosis_chart_data():
    try:
        db = get_mongo_connection()
        collection = db.stdmedicalhist

        records = list(collection.find({}, {"_id": 0, "diagnosis_records": 1, "disease_score": 1}))

        print("Fetched records:", records)  # 💡 see what's being returned

        labels = []
        values = []

        for record in records:
            diag = record.get("diagnosis_records")
            score = record.get("disease_score")
            if diag and isinstance(score, (int, float)):
                labels.append(diag)
                values.append(score)

        diagnosis_data = {}
        for i in range(len(labels)):
            diagnosis_data[labels[i]] = diagnosis_data.get(labels[i], 0) + values[i]

        print("Prepared chart data:", diagnosis_data)  # 💡 confirm this works

        return jsonify({
            "labels": list(diagnosis_data.keys()),
            "counts": list(diagnosis_data.values())
        })

    except Exception as e:
        print("CHART ERROR:", str(e))  # 🧨 LOG THIS
        return jsonify({"error": str(e)}), 500

