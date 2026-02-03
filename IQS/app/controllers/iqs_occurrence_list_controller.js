app.controller('iqs_occurrence_list_controller', ['$location', 'DataService','$scope', function ($location, DataService,$scope) {
    $scope.items = DataService.getOccurrences();

    $scope.open = function (occ) {
        $location.path('/iqs/occurrence/detail/' + occ.id);
    };
}]);



