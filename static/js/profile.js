    document.addEventListener("DOMContentLoaded", function () {
    // ✅ Extract student_id from URL path instead of search params
    const studentId = window.location.pathname.split("/").pop();  // Gets last part of URL

    if (!studentId) {
        document.getElementById("profileData").innerHTML = "Error: No student ID provided.";
        return;
    }

    console.log("Extracted Student ID:", studentId);  // Debugging

    fetch(`/api/profile/${studentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.student) {
                throw new Error("Invalid JSON structure: 'student' key missing.");
            }

            const student = data.student;

            const profileData = `
                <p><strong>Name:</strong> ${student.first_name} ${student.last_name}</p>
                <p><strong>Email:</strong> ${student.Email}</p>
                <p><strong>Phone:</strong> ${student.Phone_Number}</p>
                <p><strong>University:</strong> ${student.university_name}</p>
                <p><strong>Address:</strong> ${student.Address}, ${student.City}, ${student.state}</p>
            `;

            document.getElementById("profileData").innerHTML = profileData;

            if (student.profile_image) {
                document.getElementById("studentImage").src = `data:image/png;base64,${student.profile_image}`;
                document.getElementById("studentImage").style.display = "block";
            }
        })
        .catch(error => {
            document.getElementById("profileData").innerHTML = "Error loading profile.";
            console.error("Fetch Error:", error);
        });
});
