rpApp.controller('submissionsByTimePeriodController', ['$scope', function($scope) {

}]);

rpApp.directive('submissionsByTimePeriodGraph', function() {
  return {
    restrict: 'E',
    replace: false,
    scope: {
      info: '='
    },
    templateUrl: 'time_period_chart.html',
    link: function($scope) {
      var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 400 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
              .range([height, 0]);

      var formatDay = function(d) {
        return d.slice(0,3);
      }

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickFormat(formatDay);

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(5);

      var div = d3.select("body").append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);
              
      var chart = d3.select(".frequency-by-month-chart")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      d3.json('/api/plates', function(data) {
        x.domain(data.map(function(d) { return d.month; }));
        y.domain([0, d3.max(data, function(d) { return d.count })]);
        
        chart.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Frequency");

        chart.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

        var bar = chart.selectAll(".bar")
            .data(data)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.month); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.count); })
            .attr("height", function(d) { return height - y(d.count); });

        bar.append("rect")
            .attr("y", function(d) { return y(d.count); })
            .attr("height", function(d) {return height - y(d.count); })
            .attr("width", x.rangeBand());

        bar.append("text")
            .attr("x", 2)
            .attr("y", function(d) { return height - 30; })
            .attr("dy", ".75em")
            .text(function(d) { return d.count; });
        // Tooltip settings
        bar.on("mouseover", function(d) {
                div.transition()
                    .duration(100)
                    .style("opacity", .9);
                div.html("<b>" + d.month + "</b>" + ": " + d.count)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
              })
              .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
              });
      });
        }
  }
});

