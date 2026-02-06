app.controller('iqs_audit_list_controller', ['$location', 'DataService','$scope', function ($location, DataService, $scope) {
    $scope.items = DataService.getAudits();

    $scope.open = function (audit) {
        $location.path('/iqs/audit/plan/detail/' + 4);//+ audit.id);
    };

    $scope.new = function (audit) {
        $location.path('/iqs/audit/plan/detail/' + -1);
    };

}]);