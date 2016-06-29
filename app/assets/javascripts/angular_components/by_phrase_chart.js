rpApp.directive('phraseChart', function() {
  return {
    restrict: 'E',
    scope: {
      query: "=",
      phrases: "="
    },
    templateUrl: 'phrase_chart.html'
  }
});

rpApp.controller('phraseChartController', ['$scope', 'matchingPhrases', function($scope, matchingPhrases) {
  $scope.query = "bad";
  matchingPhrases.getMatchingPlates($scope.query).success(function(data) {
    $scope.phrases = data;
  });
}]);

rpApp.service('matchingPhrases', ['$http', function($http) {
  return {
    getMatchingPlates: function(query) {
      console.log(query);
      return $http.get('/api/plates/' + query)
        .success(function(data) {
          return data;
        })
        .error(function(data) {
          return data;
      });
    }
  }
}]);