app.controller('iqs_occurrence_list_controller', ['$location', 'DataService','$scope', function ($location, DataService,$scope) {
    $scope.items = DataService.getOccurrences();

    var vm = this;
    //$scope.items = angular.copy(DataService.occurrences);
    console.log($scope.items);
    // Filters (control-center style)
    $scope.statuses = ['Submitted', 'Under Review', 'Returned', 'Closed'];
    $scope.statusFilter = 'Submitted';
    $scope.typeFilter = 'All';

    $scope.types = ['All'];
    angular.forEach($scope.items, function (o) {
        if ($scope.types.indexOf(o.type) === -1) $scope.types.push(o.type);
    });

    $scope.setStatus = function (s) { $scope.statusFilter = s; };

    $scope.filterFn = function (o) {
        // Drafts are private; don't show them in the central list
        if (o.status === 'Draft') return false;
        if ($scope.typeFilter && $scope.typeFilter !== 'All' && o.type !== $scope.typeFilter) return false;
        if ($scope.statusFilter && o.status !== $scope.statusFilter) return false;
        return true;
    };

    $scope.countBy = function (type, status) {
        var c = 0;
        angular.forEach($scope.items, function (o) {
            if (o.status === 'Draft') return;
            if (type && type !== 'All' && o.type !== type) return;
            if (status && o.status !== status) return;
            c++;
        });
        return c;
    };

  

    $scope.open = function (occ) {
        $location.path('/iqs/occurrence/detail/' + occ.id);
    };
}]);



