rpApp.controller('phraseChartController', ['$scope', function($scope) {
  $scope.query = "bad";
}]);

rpApp.directive('phraseChart', function() {
  return {
    restrict: 'E',
    replace: false,
    scope: {
      query: "=",
      phrases: "="
    },
    templateUrl: 'phrase_chart.html',
    link: function($scope) {
      // Define common variables
      var margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 400 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;
      
      //Define chart
      var chart = d3.select(".frequency-of-phrase-chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Set watcher for changes to <input>
      $scope.$watch(
        function watchInput($scope) {
          return $scope.query;
        }, 
        function(newQuery, oldQuery) {
          console.log("New query detected!", newQuery);
          return $scope.render(newQuery);
        }
      );

      // D3 variables that are constants
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
          .ticks(4)
          .tickFormat(d3.time.format('%b %y'));

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(5);

      var div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);

      // All the meaty chart code
      $scope.render = function(query) {
        // Clear old graph before rendering new one
        chart.selectAll("*").remove();

        var line = d3.svg.line()
              .x(function(d) { return x(new Date(d.date)); })
              .y(function(d) { return y(d.proposed_content.length); });

        d3.json('/api/plates/' + $scope.query, function(data) {
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

          chart.append("text")
                .attr("class", "total-count")
                .attr("x", "100")
                .text(data.length + " total plates");

          // Tooltips
          chart.selectAll("dot")
                .data(data)
              .enter().append("circle")
                .attr("r", 3)
                .attr("cx", function(d) { return x(new Date(d.date)); })
                .attr("cy", function(d) { return y(d.proposed_content.length); })
                .on("mouseover", function(d) {
                  div.transition()
                      .duration(100)
                      .style("opacity", .9);
                  div.html(d.proposed_content + "<br>" + new Date(d.date).toLocaleDateString())
                      .style("left", (d3.event.pageX) + "px")
                      .style("top", (d3.event.pageY - 43) + "px");
                })
                .on("mouseout", function(d) {
                  div.transition()
                      .duration(500)
                      .style("opacity", 0);
                });
        });

        function type(d) {
          d.date = new Date(d.date);
          d.proposed_content.length = +d.proposed_content.length;
          return d;
        }
      }
    }
  }
});
