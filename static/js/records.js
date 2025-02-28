document.addEventListener("DOMContentLoaded", function () {
    let viz; // Variable to store Tableau visualization
    const tableauContainer = document.getElementById("tableau-container");
    const tableauURL = "https://public.tableau.com/views/MentalHealthAnalysis_17404479635260/Dashboard1?:showVizHome=no&:embed=true";

    // Function to initialize Tableau visualization
    function initTableau() {
        if (!tableauContainer) {
            console.error("Tableau container not found!");
            return;
        }

        const options = {
            hideTabs: true,
            width: "100%",
            height: "600px",
            onFirstInteractive: function () {
                console.log("Tableau Dashboard Loaded!");
            }
        };

        try {
            viz = new tableau.Viz(tableauContainer, tableauURL, options);
        } catch (error) {
            console.error("Error initializing Tableau:", error);
        }
    }

    // Function to apply filter
    function applyFilter() {
        const selectedCondition = document.getElementById("medical-condition-filter").value;
    
        if (viz && selectedCondition) {
            const workbook = viz.getWorkbook();
            const activeSheet = workbook.getActiveSheet();
    
            if (activeSheet.getSheetType() === "dashboard") {
                const worksheets = activeSheet.getWorksheets();
                console.log("✅ Available Worksheets:", worksheets.map(sheet => sheet.getName()));
    
                // Find the correct worksheet inside the dashboard
                const targetSheet = worksheets.find(sheet => sheet.getName() === "Top 5 Medical Conditions");
    
                if (targetSheet) {
                    console.log("✅ Found Target Worksheet:", targetSheet.getName());
    
                    // Log available filters for debugging field name issues
                    targetSheet.getFiltersAsync().then(filters => {
                        console.log("🔍 Available filters:", filters.map(f => f.fieldName));
                    });
    
                    console.log("🛠️ Selected condition:", selectedCondition);
    
                    // Ensure selectedCondition is an array (required for categorical fields)
                    const filterValue = Array.isArray(selectedCondition) ? selectedCondition : [selectedCondition];
    
                    // Clear previous filters before applying a new one
                    targetSheet.applyFilterAsync("Medical Conditions", [], "ALL_VALUES")
                    .then(() => {
                        // Apply the new filter
                        return targetSheet.applyFilterAsync("Medical Conditions", filterValue, "REPLACE");
                    })
                    .then(() => console.log(`✅ Filter applied: ${selectedCondition}`))
                    .catch(error => console.error("❌ Error applying filter:", error));
    
                } else {
                    console.error("❌ Target worksheet not found inside the dashboard.");
                }
            } else {
                console.error("⚠️ Active sheet is not a dashboard.");
            }
        } else {
            console.error("❌ Tableau visualization not initialized or no condition selected.");
        }
    }
    
    
    // Function to reset filters
    function resetFilters() {
        if (!viz) {
            console.error("Tableau is not initialized yet.");
            return;
        }

        const sheet = viz.getWorkbook().getActiveSheet();
        sheet.clearFilterAsync("Medical Conditions")
            .then(() => console.log("Filters Reset"))
            .catch(error => console.error("Error resetting filter:", error));
    }

    // Initialize Tableau Dashboard
    initTableau();

    // Attach event listeners to buttons
    document.getElementById("apply-filter-btn")?.addEventListener("click", applyFilter);
    document.getElementById("reset-filter-btn")?.addEventListener("click", resetFilters);
});
