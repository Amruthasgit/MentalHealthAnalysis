document.addEventListener("DOMContentLoaded", function () {
    const studentList = document.getElementById("student-list");
    const paginationContainer = document.getElementById("pagination");

    // ✅ Fetch all students and display them
    function fetchStudents() {
        fetch("/students")
            .then(response => response.json())
            .then(data => {
                if (data.students) {
                    displayStudents(data.students);
                } else {
                    studentList.innerHTML = "<p>No students found.</p>";
                }
            })
            .catch(error => console.error("Error fetching students:", error));
    }

    // ✅ Display student cards dynamically
    function displayStudents(students) {
        studentList.innerHTML = ""; // Clear previous content
        students.forEach(student => {
            const card = document.createElement("div");
            card.classList.add("student-card");
            card.innerHTML = `
                <img src="data:image/png;base64,${student.profile_image}" alt="Student Image">
                <p>Student ID: ${student.Student_ID}</p>
                <button onclick="viewProfile(${student.Student_ID})">View Profile</button>
            `;
            studentList.appendChild(card);
        });
    }

    // ✅ Redirect to profile page with student ID
    function viewProfile(studentId) {
        // Redirect correctly using Flask's routing
        window.location.href = `/profile/${studentId}`;
    }

    // ✅ Fetch student by ID when user inputs a number
    document.getElementById("fetch-student-btn").addEventListener("click", function () {
        const studentId = document.getElementById("student-id-input").value;
        if (studentId) {
            viewProfile(studentId);
        } else {
            alert("Please enter a valid Student ID.");
        }
    });

    // Load students when the page loads
    fetchStudents();
});
