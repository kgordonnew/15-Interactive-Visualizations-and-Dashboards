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
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
});}

function buildCharts(newSample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
    d3.json(`/samples/${newSample}`).then((sampleNames) => {
    console.log(sampleNames);
    // @TODO: Build a Bubble Chart using the sample data
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

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
