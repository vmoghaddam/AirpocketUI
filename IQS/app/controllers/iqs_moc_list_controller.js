app.controller('iqs_moc_list_controller', ['$location', 'DataService', '$scope', function ($location, DataService, $scope) {
    var vm = this;
    var mocs = DataService.getMocs();
    mocs.forEach(function (m) {
        m.hazardSummary = '';
        if (m.hazardIds && m.hazardIds.length) {
            var hs = DataService.getHazardsByIds(m.hazardIds);
            m.hazardSummary = hs.map(function (h) { return h.code + ' ' + h.title; }).join('; ');
        }
    });
    $scope.items = mocs;

    $scope.open = function (moc) {
        $location.path('/iqs/moc/detail/' + moc.id);
    };
}]);