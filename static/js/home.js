document.addEventListener("DOMContentLoaded", function () {
    function navigateTo(page) {
        window.location.href = page;
    }

    document.getElementById("students-btn").addEventListener("click", function () {
        navigateTo("/students");
    });

    document.getElementById("medical-btn").addEventListener("click", function () {
        navigateTo("/medical");
    });

    document.getElementById("records-btn").addEventListener("click", function () {
        navigateTo("/charts");
    });
    // document.getElementById("records-btn").addEventListener("click", function () {
    //     navigateTo("/records");  // This now directs to the Tableau dashboard
    // });
});
