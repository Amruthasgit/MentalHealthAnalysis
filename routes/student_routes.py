import base64
from flask import Blueprint, jsonify
from database.mysql import get_mysql_connection
import pandas as pd
student_routes = Blueprint('student_routes', __name__)

# ✅ Fetch all students
@student_routes.route('/students', methods=['GET'])
def get_studentsList():
    try:
        conn = get_mysql_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT Student_ID, profile_image FROM studentdetails")
        students = cursor.fetchall()

        # ✅ Convert binary image to base64 string
        for student in students:
            if student['profile_image']:
                student['profile_image'] = base64.b64encode(student['profile_image']).decode('utf-8')

        # # ✅ Save to CSV
        # df = pd.DataFrame(students)
        # df.to_csv(r'C:/Users/amrut/OneDrive/mentalhealth_students.csv', index=False)

        cursor.close()
        conn.close()

        return jsonify({"students": students})

    except Exception as e:
         return jsonify({"error": str(e)}), 500
# ✅ Fetch a single student's profile
@student_routes.route('/profile/<int:student_id>', methods=['GET'])
def get_student_profile(student_id):
    """Fetches a single student's profile details."""
    try:
        conn = get_mysql_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM studentdetails WHERE Student_ID = %s", (student_id,))
        student = cursor.fetchone()

        if not student:
            return jsonify({"error": "Student not found"}), 404

        # Convert binary image to Base64
        if student.get("profile_image"):
            student["profile_image"] = base64.b64encode(student["profile_image"]).decode("utf-8")

        cursor.close()
        conn.close()

        return jsonify({"student": student})  # ✅ Ensures correct structure

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ✅ Export medical records to CSV for Power BI
@student_routes.route('/export_medical_records', methods=['GET'])
def export_medical_records():
    try:
        conn = get_mysql_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500

        query = """
            SELECT student_id, Medical_ID, Patient_ID, rec_visit_1Y, rec_visit_5Y, 
                   Date_of_Visit, any_medical_issues, past_medical_hist, Family_Medical_History,
                   substance_use_history, Medical_Conditions, Allergies, Surgical_History,
                   diagnosis_records, BMI, weight, present_condition, disease_score, Side_effect_issues
            FROM stdmedicalhist
        """

        df = pd.read_sql(query, conn)

        # ✅ Export to CSV
        df.to_csv(r'C:/Users/amrut/OneDrive/mentalhealth_medical.csv', index=False)

        conn.close()

        return jsonify({"message": "Medical records exported successfully to CSV"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
