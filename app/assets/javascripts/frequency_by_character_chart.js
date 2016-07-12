$(function() {
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 400 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  var color = d3.scale.linear()
    .domain([0, 700])
    .range(["white", "fuchsia"]);

  // Variables
  var squareLength = 25,
      xAxisVal = 0,
      yAxisVal = 50;

  var chart = d3.select(".frequency-by-character")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + (margin.left * 2) + "," + margin.top + ")");

  var div = d3.select("body").append("div")
          .attr("class", "blue-tooltip")
          .style("opacity", 0);
  d3.json('/api/frequency_by_character', function(data) {
    chart.append("g")
          .selectAll(".square")
          .data(data)
        .enter().append("rect")
          .attr("class", "square")
          .attr("width", squareLength)
          .attr("height", squareLength)
          .attr("x", function(d,i) {
            if (i%10 == 0) {
              xAxisVal = 0;
            } else {
              xAxisVal += squareLength;
            }
            return xAxisVal; 
          })
          .attr("y", function(d, i) {
            if (i%10 == 0) {
              yAxisVal += squareLength;
            }
            return yAxisVal; 
          })
          .attr("stroke", "fuchsia")
          .attr("stroke-width", ".25px")
          .style("fill", function(d) { return color(d.count); })

          // Tooltip settings
          .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html("Char: " + d.character + "<br>" + "Count: " + d.count)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");
          })
          .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
          });

    var mostUsedChar = data.reduce(function(firstChar, secondChar, index) { if (index === 0) { return secondChar }; return firstChar.count > secondChar.count ? firstChar : secondChar }, null);
    var leastUsedChar = data.reduce(function(firstChar, secondChar, index) { if (index === 0) { return secondChar }; return firstChar.count < secondChar.count ? firstChar : secondChar }, null);

    chart.append("text")
          .attr("class", "max-character")
          .attr("x", "5")
          .text("Most: " + mostUsedChar.character + " (" + mostUsedChar.count + " times) // " + "Least: " + leastUsedChar.character + " (" + leastUsedChar.count + " times)");
  });
});