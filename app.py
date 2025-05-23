from flask import Flask, render_template
from routes.student_routes import student_routes
from routes.medical_routes import medical_routes

app = Flask(__name__)

# Register Blueprints (Routes)
app.register_blueprint(student_routes, url_prefix="/api")
app.register_blueprint(medical_routes, url_prefix="/api")

# Define Web Pages
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/students")
def students_page():
    return render_template("students.html")

@app.route("/medical")
def medical_page():
    return render_template("medical.html")

@app.route("/profile/<student_id>")
def profile_page(student_id):
    return render_template("profile.html", student_id=student_id)

@app.route('/records')
def records():
    return render_template('records.html')  # This is the new route

@app.route('/charts')
def charts():
    return render_template('charts.html')



if __name__ == "__main__":
    app.run(debug=True)


