

// set the dimensions and margins of the graph
var margin = {top: 10, right: 100, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
  d3.csv("https://raw.githubusercontent.com/aazarpan/DH520/master/DH520_Project.csv", function(data) {
 // d3.csv("https://raw.githubusercontent.com/aazarpan/DH520/master/test.csv", function(data) {
 // d3.csv("test.csv", function(data) {


    // List of groups (here I have one group per column)
    var allGroup = ["Traditional", "Value-rational", "Affectual", "Instrumentally_rational"]

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);


//
    var parseTime = d3.timeParse("%Y");

    data.forEach(function(d) {
        d.Year = parseTime(d.Year);
    });

    // Scale the range of the data




    // Add X axis --> it is a date format
    var x =  d3.scaleTime()    
            .domain(d3.extent(data, function(d) { return d.Year; }))      
            .range([ 0, width ]);
          svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));


    // text label for the x axis
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 30) + ")")
      .style("text-anchor", "middle")
      .text("Year");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0,100])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // text label for the y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Percentage");  




    // Initialize line with group a
    var line = svg
      .append('g')
      .append("path")
        .datum(data)
        .attr("d", d3.line()
          .x(function(d) { return x(+d.Year) })
          .y(function(d) { return y(+d.Traditional) })
        )
        .attr("stroke", function(d){ return myColor("Traditional") })
        .style("stroke-width", 4)
        .style("fill", "none")

    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      var dataFilter = data.map(function(d){return {Year: d.Year, value:d[selectedGroup]} })

      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(+d.Year) })
            .y(function(d) { return y(+d.value) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)
    })

    ///////////////



    // var focus = svg.append("g")
    //         .attr("class", "focus")
    //         .style("display", "none");

    //     focus.append("circle")
    //         .attr("r", 5);

    //     focus.append("rect")
    //         .attr("class", "tooltip")
    //         .attr("width", 100)
    //         .attr("height", 50)
    //         .attr("x", 10)
    //         .attr("y", -22)
    //         .attr("rx", 4)
    //         .attr("ry", 4);

    //     focus.append("text")
    //         .attr("class", "tooltip-date")
    //         .attr("x", 18)
    //         .attr("y", -2);

    //     focus.append("text")
    //         .attr("x", 18)
    //         .attr("y", 18)
    //         .text("Movie:");

    //     focus.append("text")
    //         .attr("class", "tooltip-likes")
    //         .attr("x", 60)
    //         .attr("y", 18);

    //     svg.append("rect")
    //         .attr("class", "overlay")
    //         .attr("width", width)
    //         .attr("height", height)
    //         .on("mouseover", function() { focus.style("display", null); })
    //         .on("mouseout", function() { focus.style("display", "none"); })
    //         .on("mousemove", mousemove);

    //     function mousemove() {
    //         var x0 = x.invert(d3.mouse(this)[0]),
    //             i = bisectDate(data, x0, 1),
    //             d0 = data[i - 1],
    //             d1 = data[i],
    //             d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
    //         focus.attr("transform", "translate(" + x(d.Year) + "," + y(d.Movie) + ")");
    //         focus.select(".tooltip-date").text(dateFormatter(d.Year));
    //         focus.select(".tooltip-likes").text(formatValue(d.Movie));
    //     }


    ///////////////



})
