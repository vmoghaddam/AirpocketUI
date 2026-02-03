app.controller('iqs_moc_detail_controller', ['$routeParams', '$location', 'DataService', '$scope',
    function ($routeParams, $location, DataService, $scope) {
        var vm = this;
        var id = parseInt($routeParams.id, 10);
        $scope.item = DataService.getMocById(id) || {};
        $scope.linkedHazards = [];
        if ($scope.item.hazardIds && $scope.item.hazardIds.length) {
            $scope.linkedHazards = DataService.getHazardsByIds($scope.item.hazardIds);
        }

        $scope.back = function () {
            $location.path('/iqs/moc/list');
        };
    }
]);