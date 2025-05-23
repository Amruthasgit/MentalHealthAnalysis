document.addEventListener("DOMContentLoaded", () => {
    // No prefetching required for individual patient view
});

async function fetchMedicalRecordById(patientId) {
    const summaryContainer = document.getElementById("summaryContainer");
    const searchContainer = document.getElementById("searchContainer");
    const messageContainer = document.getElementById("message-container");
    const backSearchBtn = document.getElementById("back-search");

    summaryContainer.innerHTML = "";
    messageContainer.classList.add("hidden");

    try {
        const response = await fetch(`/api/medical_records/${patientId}`);
        if (!response.ok) throw new Error("Record not found");
        
        const data = await response.json();
        const record = data.medical_records[0]; // use the first match

        if (!record) throw new Error("No data");

        // Update visibility
        searchContainer.style.display = "none";
        summaryContainer.style.display = "block";
        backSearchBtn.style.display = "inline-block";

        const div = document.createElement("div");
        div.className = "summary-card";
        div.innerText = `${record.Patient_Name || "The patient"} visited on ${formatDate(record.Date_of_Visit)}. ` +
            `They are suffering from ${record.Medical_Conditions || "unspecified condition"} and have allergies to ${record.Allergies || "none"}. ` +
            `Surgical history: ${record.Surgical_History || "None"}. BMI: ${record.BMI || "N/A"}. ` +
            `Diagnosis: ${record.diagnosis_records || "N/A"}. Present condition: ${record.present_condition || "Unknown"}.`;

        summaryContainer.appendChild(div);
    } catch (error) {
        summaryContainer.style.display = "none";
        messageContainer.textContent = "No records found.";
        messageContainer.classList.remove("hidden");
        backSearchBtn.style.display = "none";
        console.error("Error:", error);
    }
}

function searchMedicalRecords() {
    const patientId = document.getElementById("searchInput").value.trim();
    if (!patientId) return;

    fetchMedicalRecordById(patientId);
}

function resetSearch() {
    document.getElementById("searchContainer").style.display = "flex";
    document.getElementById("summaryContainer").style.display = "none";
    document.getElementById("message-container").classList.add("hidden");
    document.getElementById("searchInput").value = "";
    document.getElementById("back-search").style.display = "none";
}

function formatDate(dateString) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}
