
app.controller('iqs_audit_finding_controller', ['$routeParams', '$location', '$scope', 'cmsService',
    function ($routeParams, $location, $scope, cmsService) {

        var plan_id = parseInt($routeParams.plan_id, 10);
        var audit_id = parseInt($routeParams.audit_id, 10);
        var finding_id = parseInt($routeParams.id, 10);

        if (isNaN(audit_id)) {

            var qs = $location.search();
            if (qs && qs.audit_id) audit_id = parseInt(qs.audit_id, 10);
        }

        if (isNaN(audit_id)) audit_id = -1;
        if (isNaN(finding_id)) finding_id = -1;

        console.log('finding form params => auditId:', audit_id, 'findingId:', finding_id);


        // مدل اصلی فرم (Audit )

        $scope.entity = {
            id: finding_id,
            audit_id: audit_id,
        };

        // لیست‌ها


        $scope.actions = [];
        $scope.hazards = [];
        $scope.auditors = [];

        $scope.loadAuditors = function () {
            return cmsService.get_auditors().then(function (res) {
                if (res && res.IsSuccess) $scope.auditors = res.Data || [];
                else $scope.auditors = [];
            });
        };


     // ---------- Load Form ----------
        $scope.bind = function () {

            if (finding_id < 0) {
                // حالت New
                $scope.entity = {
                    id: -1,
                    audit_id: audit_id
                };

                $scope.actions = [];
                $scope.hazards = [];
                return;
            }
            cmsService.get_finding(finding_id).then(function (response) {
                console.log('--------finding  form response----------', response);

                if (!response || !response.IsSuccess) {
                    console.log('Form load failed', response);
                    return;
                }

                var data = response.Data || {};

                var entity = data.finding || data;

                $scope.entity = entity || $scope.entity;
                $scope.entity.audit_id = $scope.entity.audit_id || audit_id;

                // date fixes
                //if ($scope.entity.audit_date) $scope.entity.audit_date = new Date($scope.entity.audit_date);

                //$scope.entity.updated_by = 4011;
                //$scope.entity.created_by = 4011;


                $scope.actions = data.actions || [];
                $scope.hazards = data.hazards || [];
                console.log('--------actions----------', $scope.actions);

            });
        };

        //---------------Add action------------
        //$scope.btn_action_add = {
        //    text: "+Action Add",
        //    icon: "plus",
        //    type: "default",          // یا "success" / "normal"
        //    stylingMode: "contained", // ظاهر دکمه واقعی‌تر
        //    onClick: function () {

        //        $location.path('/iqs/audit/finding/detail/-1/' + audit_id + '/' + plan_id);

        //    }
        //};

        //$scope.openAction = function (a) {
        //    if (!a || !a.id) return;
        //    $location.path('/iqs/audit/finding/detail/' + a.id + '/ ' + audit_id + ' / ' + plan_id);
        //};
    // ---------- Save Finding ----------


        $scope.btn_save = {
            text: 'Save',
            type: 'success',
            validationGroup: 'findingsave',
            //width: 120,

            bindingOptions: {},
            onClick: function (e) {
                var result = e.validationGroup ? e.validationGroup.validate() : { isValid: true };
                if (!result.isValid) {
                    if (window.General && window.Config) General.ShowNotify(Config.Text_FillRequired, 'error');
                    return;
                }
                $scope.save();
            }
        };
        $scope.save = function () {

            var dto = {
                id: $scope.entity.id,
                audit_id: $scope.entity.audit_id || audit_id,
                code: $scope.entity.code,
                title: $scope.entity.title,
                level: $scope.entity.level,
                standard_id: $scope.entity.standard_id,
                standard_title: $scope.entity.standard_title,
                standard_description: $scope.entity.standard_description,
                none_compliance_description: $scope.entity.none_compliance_description,
                auditor_id: $scope.entity.auditor_id,
                closure_deadline: $scope.entity.closure_deadline,
                sent_report_date: $scope.entity.sent_report_date,
                closure_auditor_date: $scope.entity.closure_auditor_date,
                verified_qa_date: $scope.entity.verified_qa_date,
                updated_by: $scope.entity.updated_by               
            };

           
            cmsService.save_finding(dto).then(function (response) {
                console.log('--------save finding response----------', response);

                if (!response || !response.IsSuccess) return;


                if ($scope.entity.id < 0 && response.Data && response.Data.id) {
                    $scope.entity.id = response.Data.id;
                    finding_id = response.Data.id;
                }

                $scope.bind();
            });
        };

        $scope.btn_back = {
            text: 'Back',
            icon: 'chevronleft',
            onClick: function () {
                $location.path('/iqs/audit/' + audit_id);
            }
        };

        // ---------------- Editors ----------------
        $scope.txt_title = { width: '100%', bindingOptions: { value: 'entity.title' } };
        $scope.txt_code = { width: '100%', bindingOptions: { value: 'entity.code' } };
        $scope.txt_level = { width: '100%', bindingOptions: { value: 'entity.scope' } };
        $scope.txt_standard_title = { width: '100%', bindingOptions: { value: 'entity.standard_title' } };
        $scope.txt_standard_description = { width: '100%', bindingOptions: { value: 'entity.standard_description' } };
        $scope.txt_none_compliance_description = { width: '100%', bindingOptions: { value: 'entity.none_compliance_description' } };

        $scope.dt_sent_report_date = {
            type: "date",
            openOnFieldClick: true,
            showDropDownButton: true,
            dropDownOptions: { container: "body" },
            bindingOptions: { value: "entity.sent_report_date" }
        };

        $scope.dt_closure_deadline = {
            type: "date",
            openOnFieldClick: true,
            showDropDownButton: true,
            dropDownOptions: { container: "body" },
            bindingOptions: { value: "entity.closure_deadline" }
        };

        $scope.dt_closure_auditor_date = {
            type: "date",
            openOnFieldClick: true,
            showDropDownButton: true,
            dropDownOptions: { container: "body" },
            bindingOptions: { value: "entity.closure_auditor_date" }
        };


        //$scope.types = [{ id: 1, name: 'T1' }, { id: 2, name: 'T2' }, { id: 3, name: 'T3' }];
        //$scope.sb_types = {
        //    dataSource: $scope.types,
        //    showClearButton: true,
        //    searchEnabled: true,
        //    placeholder: ' ',
        //    valueExpr: "id",
        //    displayExpr: "name",
        //    bindingOptions: { value: 'entity.type_id' }
        //};

        $scope.sb_auditors = {
            showClearButton: true,
            searchEnabled: true,
            placeholder: ' ',
            valueExpr: "id",
            displayExpr: "name",
            bindingOptions: {
                dataSource: 'auditors',
                value: 'entity.auditor_id'
            }
        };       



        // Scroll
        $scope.scroll_content_height = $(window).height() - 130;
        $scope.scroll_content = {
            width: '100%',
            bounceEnabled: false,
            showScrollbar: 'onHover',
            useNative: true,
            onPullDown: function (options) {
                $scope.bind();
                options.component.release();
            },
            bindingOptions: { height: 'scroll_content_height' }
        };

        // init

        $scope.loadAuditors().then(function () {
            $scope.bind();
        });

        /////////////////////////////

        //$scope.item = DataService.getAuditById(id) || {};
        //$scope.findings = DataService.getAuditFindingsByAuditId(id);
        //var hazardIds = [];
        //$scope.findings.forEach(function (f) {
        //    if (f.hazardIds) {
        //        f.hazardIds.forEach(function (hid) {
        //            if (hazardIds.indexOf(hid) === -1) hazardIds.push(hid);
        //        });
        //    }
        //});
        //$scope.hazards = DataService.getHazardsByIds(hazardIds);


    }
]);
