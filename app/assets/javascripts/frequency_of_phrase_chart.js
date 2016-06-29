$(function() {
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 400 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  var formatDate = function(d) {
    var dateFormatted = new Date(d.date);
    return dateFormatted;
  };

  var x = d3.time.scale()
      .range([0, width]);

  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(7)
      .tickFormat(d3.time.format('%b %y'));

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5);

  var line = d3.svg.line()
        .x(function(d) { return x(new Date(d.date)); })
        .y(function(d) { return y(d.proposed_content.length); });

  var chart = d3.select(".frequency-of-phrase-chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json('/api/plates/bad', function(data) {
    x.domain(d3.extent(data, function(d) { return new Date(d.date); }));
    y.domain([0,10]);

    chart.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Char Length");

    chart.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

    chart.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", line);
  });

  function type(d) {
    d.date = new Date(d.date);
    d.proposed_content.length = +d.proposed_content.length;
    return d;
  }
});

