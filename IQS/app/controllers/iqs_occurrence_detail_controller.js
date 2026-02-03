app.controller('iqs_occurrence_detail_controller', ['$routeParams', '$location', 'DataService', '$scope',
    function ($routeParams, $location, DataService, $scope) {
        var id = parseInt($routeParams.id, 10);
        $scope.item = DataService.getOccurrenceById(id) || {};
        $scope.sideTab = 'referral';

        $scope.setSideTab = function (tab) {
            $scope.sideTab = tab;
        };

        $scope.back = function () {
            $location.path('/iqs/occurrence/list');
        };
    }]);