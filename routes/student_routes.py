import base64
from flask import Blueprint, jsonify
from database.mysql import get_mysql_connection

student_routes = Blueprint('student_routes', __name__)

# ✅ Fetch all students
@student_routes.route('/students', methods=['GET'])
def get_studentsList():
    """Fetches student details, including profile images, from MySQL."""
    try:
        conn = get_mysql_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT Student_ID, profile_image FROM studentdetails")  # ✅ Fetch all students
        students = cursor.fetchall()

        # Convert binary image data to Base64
        for student in students:
            student['profile_image'] = base64.b64encode(student['profile_image']).decode('utf-8') if student['profile_image'] else None

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

