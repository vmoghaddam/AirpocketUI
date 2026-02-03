app.controller('iqs_audit_detail_controller', ['$routeParams', '$location', 'DataService', '$scope', 'cmsService',
    function ($routeParams, $location, DataService, $scope, cmsService) {
        var id = parseInt($routeParams.id, 10);

        $scope.bind = function () {
            cmsService.get_audit(4).then(function (response) {
                console.log('--------audit response----------', response);
                $scope.entity = response.Data;
            });
        };

        $scope.save = function () {
            cmsService.save_audit($scope.entity).then(function (response) {
                console.log('--------save audit response----------', response);
            });
        }

        $scope.back = function () {
            //$location.path('/iqs/audit/list');
            $scope.bind();
        };


        $scope.new = function () {
            $scope.save();
        };

        /////////////////////////////
        $scope.entity = {
            id: -1,
            created_by: 4011,
            updated_by: 4011
        }


        $scope.txt_title = {
            width: '100%',
            bindingOptions: {
                value: 'entity.title',
            }
        };

        $scope.txt_description = {
            bindingOptions: {
                value: 'entity.description',
            }
        };

        $scope.txt_scope = {
            bindingOptions: {
                value: 'entity.scope',
            }
        };

        $scope.txt_objective = {
            bindingOptions: {
                value: 'entity.objective',
            }
        };

        $scope.txt_standards_refrences = {
            bindingOptions: {
                value: 'entity.standards_refrences',
            }
        };


        $scope.auditees = [{ id: 4011, name: 'Sepehr' }, { id: 2, name: 'Vahid' }, { id: 3, name: 'Samira' }];
        $scope.sb_auditee = {
            dataSource: $scope.auditees,
            showClearButton: true,
            searchEnabled: true,
            placeholder: ' ',
            valueExpr: "id",
            displayExpr: "name",
            bindingOptions: {
                value: 'entity.auditee_id',
            }
        };



        $scope.types = [{ id: 1, name: 'T1' }, { id: 2, name: 'T2' }, { id: 3, name: 'T3' }];
        $scope.sb_types = {
            dataSource: $scope.types,
            showClearButton: true,
            searchEnabled: true,
            placeholder: ' ',
            valueExpr: "id",
            displayExpr: "name",
            bindingOptions: {
                value: 'entity.type_id',
            }
        };

        $scope.auditors = [{ id: 1, name: 'A1' }, { id: 2, name: 'A2' }, { id: 3, name: 'A3' }];
        $scope.sb_auditors = {
            dataSource: $scope.auditors,
            showClearButton: true,
            searchEnabled: true,
            placeholder: ' ',
            valueExpr: "id",
            displayExpr: "name",
            bindingOptions: {
                value: 'entity.lead_auditor',
            }
        };

        
        $scope.locations = [{ id: 3, name: 'VARESH' }, { id: 2, name: 'L2' }, { id: 3, name: 'L3' }];
        $scope.sb_location = {
            dataSource: $scope.locations,
            showClearButton: true,
            searchEnabled: true,
            placeholder: ' ',
            valueExpr: "id",
            displayExpr: "name",
            bindingOptions: {
                value: 'entity.location_id',
            }
        };


        //$scope.dt_audit_date = {
        //    type: "date",
        //    //displayFormat: "yyyy-MM-dd HHmm",
        //    bindingOptions: {
        //        value: 'entity.audit_date',
        //    }
        //};

        $scope.dt_audit_date = {
            type: "date",

            // make sure click can open it
            openOnFieldClick: true,
            showDropDownButton: true,

            // IMPORTANT: prevents the popup from being clipped by parents with overflow:hidden
            dropDownOptions: {
                container: "body"
            },

            onOpened: function () {
                console.log("dxDateBox opened");
            },

            bindingOptions: {
                value: "entity.audit_date"
            }
        };

        $scope.dt_audit_close_date = {
            type: "datetime",
            width: '100%',
            pickerType: "rollers",
            displayFormat: "yyyy-MM-dd HHmm",
            interval: 15,
            onValueChanged: function (arg) {

            },
            bindingOptions: {
                value: 'entity.audit_close_date',

            }
        };



        /////////////////////////////

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

      
        $scope.scroll_content_height = $(window).height() - 130;
        $scope.scroll_content = {
            width: '100%',
            bounceEnabled: false,
            showScrollbar: 'never',
            pulledDownText: '',
            pullingDownText: '',
            useNative: true,
            refreshingText: 'Updating...',
            onPullDown: function (options) {

                options.component.release();

            },
            onInitialized: function (e) {


            },
            bindingOptions: {
                height: 'scroll_content_height'
            }

        };

        
    }
]);