rpApp.controller('submissionsByTimePeriodController', ['$scope', function($scope) {
  $scope.options = ["month", "year"];
  $scope.timePeriod = $scope.options[0].toLowerCase();
}]);

rpApp.directive('timePeriodChart', ['$filter', function($filter) {
  return {
    restrict: 'E',
    replace: false,
    scope: {
      options: '=',
      timePeriod: '='
    },
    templateUrl: 'time_period_chart.html',
    link: function($scope) {
      // Set watcher for changes to <select>
      $scope.$watch(
        function watchSelect($scope) {
          return $scope.timePeriod;
        }, 
        function(newOption, oldOption) {
          return $scope.render(newOption);
        }
      );

      // Set variables for graph
      var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 400 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

      var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

      var y = d3.scale.linear()
              .range([height, 0]);

      var formatTime = function(d) {
        if ($scope.timePeriod == "month") {
          var timeAsMonth = $filter('monthName')(d);
          return timeAsMonth.slice(0,3);
        } else {
          return d;
        }
      }

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickFormat(formatTime);

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(5);
      // Create div for tooltips
      var div = d3.select("body").append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);
              
      var chart = d3.select(".frequency-by-month-chart")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Render new chart   
      $scope.render = function(query) {
        // Clear old graph before rendering new one
        chart.selectAll("*").remove();

        //Retrieving the data and drawing the graph
        d3.json('/api/plates_by_' + $scope.timePeriod, function(data) {
          x.domain(data.map(function(d) { return d.time; }));
          y.domain([0, d3.max(data, function(d) { return d.content.length })]);
          
          // Add y-axis labels
          chart.append("g")
                .attr("class", "y axis")
                .call(yAxis)
              .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Frequency");

          // Add x-axis labels
          chart.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
          
          // Create graph bars
          var bar = chart.selectAll(".bar")
              .data(data)
            .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.time); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.content.length); })
              .attr("height", function(d) { return height - y(d.content.length); });
          
          // Tooltip settings
          bar.on("mouseover", function(d) {
                  div.transition()
                      .duration(100)
                      .style("opacity", .9);
                  div.html("<b>" + formatTime(d.time) + "</b>" + ": " + d.content.length)
                      .style("left", (d3.event.pageX) + "px")
                      .style("top", (d3.event.pageY) + "px");
                })
                .on("mouseout", function(d) {
                  div.transition()
                      .duration(500)
                      .style("opacity", 0);
                });
        }); // end json call
      } // end scope.render
    } // end link settings
  } // end return for directive
}]); // end directive config

