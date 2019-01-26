function buildMetadata(newSample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
   

    // Use the list of sample names to populate the select options
    d3.json(`/metadata/${newSample}`).then((sampleNames) => {
         console.log(sampleNames);
         var dataselector = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
        dataselector.html("");
    // Use `Object.entries` to add each key and value pair to the panel; changes object to array
        var dataobjentries = Object.entries(sampleNames); 
        console.log(dataobjentries);
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata; for each is a for loop - appending the data into the box
        dataobjentries.forEach((sample) => {
          dataselector
          .append("h6")
          .text(`${sample[0]}:${sample[1]}`);
          console.log(sample);
        });
        buildGauge(sampleNames.WFREQ);
});}


function buildCharts(newSample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/samples/${newSample}`).then((sampleNames) => {
    console.log(sampleNames);

    // @TODO: Build a Bubble Chart using the sample data
      var xbubval = sampleNames.otu_ids;
      var ybubval = sampleNames.svals;
      var bubsize = sampleNames.ybubval + 5;
      var bubcolor = sampleNames.otu_ids;
      var textval = sampleNames.otu_lables;

      var bubdata = {
        x: xbubval,
        y: ybubval,
        text:  textval,
        mode:  'markers',
        marker:  {
          color: bubcolor,
          size: bubsize
        }
      };

      var data = [bubdata];
      var layout = {
        xaxis:  { title:  "OTU ID"},
      };

      Plotly.plot('bubble', data, layout);

      

    // @TODO: Build a Pie Chart
    var piedata = sampleNames.sample_values;
    var pieID = sampleNames.otu_ids;
    var pietext = sampleNames.otu_labels;

    var data = [{
      values: piedata.slice(0,10),
      labels: pieID.slice(0,10),
      hovertext: pietext.slice(0,10),  
      type: "pie"
    }];
  
    var layout = {
      height: 600,
      width: 800
    };
  
    Plotly.plot("pie", data, layout);
 

    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
});}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

/**
 * BONUS Solution
 * */
function buildGauge(wfreq) {
  // Enter the washing frequency between 0 and 180
  var level = parseFloat(wfreq) * 20;

  // Trig to calc meter point
  var degrees = 180 - level;
  var radius = 0.5;
  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = "M -.0 -0.05 L .0 0.05 L ";
  var pathX = String(x);
  var space = " ";
  var pathY = String(y);
  var pathEnd = " Z";
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var data = [
    {
      type: "scatter",
      x: [0],
      y: [0],
      marker: { size: 12, color: "850000" },
      showlegend: false,
      name: "Freq",
      text: level,
      hoverinfo: "text+name"
    },
    {
      values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      textinfo: "text",
      textposition: "inside",
      marker: {
        colors: [
          "rgba(0, 105, 11, .5)",
          "rgba(10, 120, 22, .5)",
          "rgba(14, 127, 0, .5)",
          "rgba(110, 154, 22, .5)",
          "rgba(170, 202, 42, .5)",
          "rgba(202, 209, 95, .5)",
          "rgba(210, 206, 145, .5)",
          "rgba(232, 226, 202, .5)",
          "rgba(240, 230, 215, .5)",
          "rgba(255, 255, 255, 0)"
        ]
      },
      labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: false
    }
  ];

  var layout = {
    shapes: [
      {
        type: "path",
        path: path,
        fillcolor: "850000",
        line: {
          color: "850000"
        }
      }
    ],
    title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
    height: 500,
    width: 500,
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1, 1]
    }
  };

  var GAUGE = document.getElementById("gauge");
  Plotly.newPlot("gauge", data, layout);
};
  

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
