// Use D3 to read external JSON file
// Create an init function that selects the dropdown id from HTML and populates the dropdown list using forEach loop

function init() {
    
    d3.json("data/samples.json").then((importedData) => {
    
        var data = importedData;
        // console.log(data);

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
// Initialize the page with default plots:

barChart(946);
gaugeChart(946);

// ====================================================================================================================
// Dropdown select handler

d3.selectAll("#selDataset").on("change", buildPlots);

function buildPlots() {

    var selectedID = d3.select("#selDataset").node().value;
    metadataPanel(selectedID);
    barChart(selectedID);
    bubbleChart(selectedID);
    gaugeChart(selectedID);
};

buildPlots();

// ====================================================================================================================
// Populate metadata info of selected ID inside div class="panel-body" by using .filter and appending <p> tags to HTML

function metadataPanel(selectedID) {
    // console.log(selectedID)
    d3.json("data/samples.json").then((importedData) => {
    var data = importedData;
    
    var filteredData = data.metadata.filter(name => name.id == selectedID);
    // console.log(filteredData);

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
// Prepare chart data by using map() to create two new arrays that return (1) otu_ids (y-axis) and (2) sample_values (x-axis)
// Use slice() to grab the first 10 OTUs from json object. sample_values arrays are in descending order.
// Define the plot layout and render the plot to the div tag with id "bar"

function barChart(selectedID) {
    d3.json("data/samples.json").then((importedData) => {
    var data = importedData;
    
    var chartFilteredData = data.samples.filter(name => name.id == selectedID);
    // console.log(chartFilteredData[0]);

    /* Sample data at index 0
    {id: "962", otu_ids: Array(26), sample_values: Array(26), otu_labels: Array(26)}
    */

    // Y values:
    var otuIDs = chartFilteredData.map(value => value.otu_ids);
    // console.log(otuIDs)
    var yValues = otuIDs[0].slice(0, 10);
    //console.log(yValues)
    var yValueslabels = [];
    yValues.forEach(function(item) {
        yValueslabels.push(`OTU ${item}`)
    });
    // console.log(yValueslabels)

    // X values:
    var otuIDsFreq = chartFilteredData.map(value => value.sample_values);
    // console.log(otuIDsFreq)
    var xValues = otuIDsFreq[0].slice(0, 10);
    // console.log(xValues)

    // Hovertext:
    var hoverText = chartFilteredData.map(value => value.otu_labels);
    var top10hoverText = hoverText[0].slice(0, 10);
    // console.log(top10hoverText)

        // Trace, layout and plot
        var trace = {
            x: xValues,
            y: yValueslabels,
            text: top10hoverText,
            type: "bar",
            orientation: "h"
        };

        var layout = {
            title: '<b>Top 10 Operational Taxonomic Units (OTUs)</b>',
            yaxis: {
            autorange: "reversed"
            }
        };

        var plotData = [trace];

    Plotly.newPlot("bar", plotData, layout);
    });
};

// ====================================================================================================================
// Create a bubble chart with otu_ids as x values & sample_values as the y-values and marker size
// Marker colors = otu_ids and text values = otu_labels

function bubbleChart(selectedID) {
    d3.json("data/samples.json").then((importedData) => {
    var data = importedData;

    var bubbleChartFilter = data.samples.filter(name => name.id == selectedID);
    // console.log(bubbleChartFilter[0]);

    // X values:
    var otuIDs = bubbleChartFilter.map(value => value.otu_ids);
    var xValues = otuIDs[0];
    // console.log(xValues);

    // Y values:
    var otuIDsFreq = bubbleChartFilter.map(value => value.sample_values);
    var yValues = otuIDsFreq[0];
    // console.log(yValues);

    // Text values:
    var otuIDsLabels = bubbleChartFilter.map(value => value.otu_labels);
    var bubbleText = otuIDsLabels[0];
    // console.log(bubbleText);

        var bubbleTrace = {
            x: xValues,
            y: yValues,
            mode: "markers",
            marker: {
                color: xValues,
                size: yValues
            },
            text: bubbleText
        };

        var bubbleData = [bubbleTrace];
  
        var bubbleLayout = {
            title: '<b>OTU Frequency</b>',
            showlegend: false,
        };
  
  Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    })
};

// ====================================================================================================================
// Create a gauge chart and render plot to the div tag with id "gauge"

function gaugeChart(selectedID) {
    d3.json("data/samples.json").then((importedData) => {
        var gaugeData = importedData;
        var gaugeFilter = gaugeData.metadata.filter(name => name.id == selectedID);
        // console.log(gaugeFilter[0]);
        var washFreq = gaugeFilter[0].wfreq
        // console.log(washFreq)

    var data = [
        {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: {
            text:
            "<b>Belly Button Washing Frequency</b><br><span style='font-size:0.8em;color:gray'><i>Scrubs Per Week</i></span><br>",
            font: { size: 18 }
        },

        type: "indicator",
        mode: "gauge+number",
  
        gauge: {
            axis: {
                range: [0, 10],
                tickvals: [0, 2, 4, 6, 8, 10],
                ticks: "outside"
            },
            steps: [
                { range: [0, 2], color: "rgba(183, 28, 28, .5)" },
                { range: [2, 4], color: "rgba(249, 168, 37, .5)" },
                { range: [4, 6], color: "rgba(170, 202, 42, .5)" },
                { range: [6, 8], color: "rgba(110, 154, 22, .5)" },
                { range: [8, 10], color: "rgba(14, 127, 0, .5)" },
            ],
            bar: { color: "gray" },
        }
        }
    ];

    var layout = { 
        margin: { t: 0, b: 0 }
    };

    Plotly.newPlot('gauge', data, layout);
    });
};

