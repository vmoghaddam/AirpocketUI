app.controller('iqs_audit_detail_controller', ['$routeParams', '$location', 'DataService', '$scope', 'cmsService',
    function ($routeParams, $location, DataService, $scope, cmsService) {
        var id = parseInt($routeParams.id, 10);

        $scope.bind = function () {
            cmsService.get_audit(1).then(function (response) {
                console.log('--------audit response----------', response);
            });
        };

        $scope.save = function () {
            cmsService.save_audit($scope.item).then(function (response) {
                console.log('--------save audit response----------', response);
            });
        }

        $scope.new = function () {
            $scope.save();
        };


        $scope.item = DataService.getAuditById(id) || {};
        $scope.findings = DataService.getAuditFindingsByAuditId(id);
        var hazardIds = [];
        $scope.findings.forEach(function (f) {
            if (f.hazardIds) {
                f.hazardIds.forEach(function (hid) {
                    if (hazardIds.indexOf(hid) === -1) hazardIds.push(hid);
                });
            }
        });
        $scope.hazards = DataService.getHazardsByIds(hazardIds);

        $scope.back = function () {
            $location.path('/iqs/audit/list');
        };


        //$scope.bind();
    }
]);