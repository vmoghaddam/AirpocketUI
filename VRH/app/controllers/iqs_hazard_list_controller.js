app.controller('iqs_hazard_list_controller', ['$location', '$scope', 'DataService', function ($location, $scope, DataService) {
   
    var data = DataService.getHazards();
    $scope.items = DataService.getHazards();;

    $scope.refresh = function () {
        vm.items = DataService.getHazards();;
    };

    $scope.open = function (hazard) {
        $location.path('/iqs/hazard/detail/' + hazard.id);
    };

    $scope.new = function () {
        $location.path('/iqs/hazard/detail/new');
    };
}]);
