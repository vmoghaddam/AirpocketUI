app.controller('iqs_hazard_list_controller', ['$location', '$scope', 'DataService', 'activityService', function ($location, $scope, DataService, activityService) {
   
    //var data = DataService.getHazards();

    $scope.bind = function () {
        activityService.get_hazard_list().then(function (response) {
            $scope.items = response.Data;
        });
    }


    //$scope.items = DataService.getHazards();;

    $scope.refresh = function () {
        //vm.items = DataService.getHazards();
        $scope.bind();
    };

    $scope.open = function (hazard) {
        $location.path('/iqs/hazard/detail/' + hazard.id);
    };

    $scope.new = function () {
        $location.path('/iqs/hazard/detail/new');
    };

    $scope.bind();
}]);
