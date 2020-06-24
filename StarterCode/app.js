// Use D3 to read external JSON file
// Create an init function to use D3 to select the dropdown id from HTML and populate the dropdown list using forEach loop

function init() {
    d3.json("data/samples.json").then((importedData) => {

        var data = importedData;
        console.log(data);

        var dropdownData = importedData.names;
        var dropdownSelect = d3.select("#selDataset");

        // Append names to dropdown option tag: <option value="Value1">name</option>

        dropdownData.forEach(name => {
            dropdownSelect
                .append("option")
                .text(name)
                .attr("value", function() {
                return name;
                });
            });
        });
    };

init();
// ====================================================================================================================
// Dropdown select handler

d3.selectAll("#selDataset").on("change", buildPlots);

function buildPlots() {
    var selectedID = d3.select("#selDataset").node().value;
    metadataPanel(selectedID);
    // barChart(selectedID);
};

buildPlots();

// ====================================================================================================================
// Populate metadata info of selected ID inside div class="panel-body" by using .filter and appending <p> tags to html

function metadataPanel(selectedID) {
    console.log(selectedID)
    
    d3.json("data/samples.json").then((importedData) => {
    var data = importedData;
    
    var filteredData = data.metadata.filter(name => name.id == selectedID);
    console.log(filteredData);

/* Sample data at index 0
    age: 16
    bbtype: "I"
    ethnicity: "Caucasian"
    gender: "M"
    id: 956
    location: "Jacksonville/NC"
    wfreq: 7
 */
    var panelBodyvalues = d3.select(".panel-body");
    panelBodyvalues.html("");
    panelBodyvalues.append("p").text(`id: ${filteredData[0].id}`);
    panelBodyvalues.append("p").text(`ethnicity: ${filteredData[0].ethnicity}`);
    panelBodyvalues.append("p").text(`gender: ${filteredData[0].gender}`);
    panelBodyvalues.append("p").text(`age: ${filteredData[0].age}`);
    panelBodyvalues.append("p").text(`location: ${filteredData[0].location}`);
    panelBodyvalues.append("p").text(`bbtype: ${filteredData[0].bbtype}`);
    panelBodyvalues.append("p").text(`wfreq: ${filteredData[0].wfreq}`);
    });
};

// ====================================================================================================================
// Create a horizontal bar chart 
// Create the data array for the plot 
// Define the plot layout
// Render the plot to the div tag with id "bar"

// function barChart(selectedID)



