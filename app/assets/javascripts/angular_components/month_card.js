rpApp.directive('monthCard', function() {
  return {
    restrict: 'E',
    scope: {
      label: "=",
      group: "="
    },
    templateUrl: 'month_card.html'
  }
});

rpApp.controller('monthCardController', ['$scope', 'platesByMonth', function($scope, platesByMonth) {
  platesByMonth.success(function(data) {
    $scope.monthArray = Object.keys(data)
      .map(function(key) {
        return {monthKey: parseInt(key), plate_collection: data[key]};
      });

  });
}]);

rpApp.service('platesByMonth', ['$http', function($http) {
  return $http.get('/api/plates_by_month')
    .success(function(data) {
      return data;
    })
    .error(function(data) {
      return data;
    });
}]);