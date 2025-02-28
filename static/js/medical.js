document.addEventListener("DOMContentLoaded", async () => {
    await fetchMedicalRecords(); // Ensure records are fetched before interactions
});

// Store medical records globally
let allMedicalRecords = [];

// Fetch all medical records
async function fetchMedicalRecords() {
    try {
        let response = await fetch("/api/medical_records");
        if (!response.ok) throw new Error("Failed to fetch data");
        allMedicalRecords = await response.json();
    } catch (error) {
        console.error("Error fetching medical data:", error);
    }
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return "-";
    let options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
}

// Display records in the table
function displayMedicalRecords(medicalRecords) {
    let tableBody = document.getElementById("medical-table-body");
    let messageContainer = document.getElementById("message-container");

    tableBody.innerHTML = "";
    messageContainer.innerHTML = "";
    messageContainer.classList.add("hidden");

    if (!medicalRecords || medicalRecords.length === 0) {
        messageContainer.innerHTML = `<p>No records found.</p>`;
        messageContainer.classList.remove("hidden");
        document.getElementById("tableContainer").style.display = "none";
        return;
    }

    medicalRecords.forEach(record => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${record.Patient_ID || "-"}</td>
            <td>${formatDate(record.Date_of_Visit)}</td>
            <td>${record.Medical_Conditions || "-"}</td>
            <td>${record.Allergies || "-"}</td>
            <td>${record.BMI || "-"}</td>
            <td>${record.diagnosis_records || "-"}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById("tableContainer").style.display = "block";
    document.getElementById("searchContainer").style.display = "none";
}

// Search by Patient ID
async function searchMedicalRecords() {
    let searchValue = document.getElementById("searchInput").value.trim();
    let messageContainer = document.getElementById("message-container");

    if (!searchValue) {
        alert("Please enter a Patient ID.");
        return;
    }

    try {
        let response = await fetch(`/api/medical_records/${searchValue}`);
        if (!response.ok) throw new Error("Failed to fetch search results");

        let data = await response.json();
        displayMedicalRecords(data.medical_records || []);
    } catch (error) {
        console.error("Error fetching medical data:", error);
        displayMedicalRecords([]);
    }
}

// Reset search and show search bar again
function resetSearch() {
    document.getElementById("searchContainer").style.display = "block";
    document.getElementById("tableContainer").style.display = "none";
    document.getElementById("medical-table-body").innerHTML = "";
    document.getElementById("searchInput").value = "";
}
