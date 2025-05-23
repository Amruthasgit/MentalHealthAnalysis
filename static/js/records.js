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
// Function to apply filter
function applyFilter() {
    const selectedCondition = document.getElementById("medical-condition-filter").value;

    if (viz && selectedCondition) {
        const workbook = viz.getWorkbook();
        const activeSheet = workbook.getActiveSheet();

        if (activeSheet.getSheetType() === "dashboard") {
            const worksheets = activeSheet.getWorksheets();
            console.log("✅ Available Worksheets:", worksheets.map(sheet => sheet.getName()));

            // Find the correct worksheet
            const targetSheet = worksheets.find(sheet => sheet.getName() === "Top 5 Medical Conditions");

            if (targetSheet) {
                console.log("✅ Found Target Worksheet:", targetSheet.getName());

                // Check available filters
                targetSheet.getFiltersAsync().then(filters => {
                    console.log("🔍 Available filters:", filters.map(f => f.fieldName));

                    // Fixing filter name based on Tableau field
                    const tableauFilterName = "Medical Conditions"; // Ensure this matches exactly in Tableau

                    if (!filters.some(f => f.fieldName === tableauFilterName)) {
                        console.error(`❌ The filter '${tableauFilterName}' is not found in Tableau.`);
                        return;
                    }

                    console.log("🛠️ Selected condition:", selectedCondition);

                    // Clear existing filters before applying new one
                    targetSheet.applyFilterAsync(tableauFilterName, [], tableau.FilterUpdateType.ALL_VALUES)
                    .then(() => {
                        return targetSheet.applyFilterAsync(tableauFilterName, [selectedCondition], tableau.FilterUpdateType.REPLACE);
                    })
                    .then(() => console.log(`✅ Filter applied: ${selectedCondition}`))
                    .catch(error => console.error("❌ Error applying filter:", error));
                });

            } else {
                console.error("❌ Target worksheet not found inside the dashboard.");
            }
        } else {
            console.error("⚠️ Active sheet is not a dashboard.");
        }
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
