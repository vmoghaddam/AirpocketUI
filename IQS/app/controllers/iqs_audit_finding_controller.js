
app.controller('iqs_audit_finding_controller', ['$routeParams', '$location', '$scope', 'cmsService',
    function ($routeParams, $location, $scope, cmsService) {

        var plan_id = parseInt($routeParams.plan_id, 10);
        var audit_id = parseInt($routeParams.id, 10);

        if (isNaN(plan_id)) {

            var qs = $location.search();
            if (qs && qs.plan_id) plan_id = parseInt(qs.plan_id, 10);
        }

        if (isNaN(plan_id)) plan_id = -1;
        if (isNaN(audit_id)) audit_id = -1;

        console.log('audit form params => planId:', plan_id, 'auditId:', audit_id);


        // مدل اصلی فرم (Audit )

        $scope.entity = {
            id: audit_id,
            audit_plan_id: plan_id,
            created_by: 4011,
            updated_by: 4011
        };

        // لیست‌ها

        $scope.findings = [];
        $scope.actions = [];
        $scope.hazards = [];
        $scope.auditors = [];
        $scope.auditees = [];
        $scope.locations = [];

        $scope.loadAuditors = function () {
            return cmsService.get_auditors().then(function (res) {
                if (res && res.IsSuccess) $scope.auditors = res.Data || [];
                else $scope.auditors = [];
            });
        };

        $scope.loadAuditees = function () {
            return cmsService.get_auditees().then(function (res) {
                if (res && res.IsSuccess) $scope.auditees = res.Data || [];
                else $scope.auditees = [];
            });
        };

        $scope.loadLocations = function () {
            return cmsService.get_locations().then(function (res) {
                if (res && res.IsSuccess) $scope.locations = res.Data || [];
                else $scope.locations = [];
            });
        };



        // ---------- Load Form ----------
        $scope.bind = function () {

            if (audit_id < 0) {
                // حالت New
                $scope.entity = {
                    id: -1,
                    audit_plan_id: plan_id,
                    created_by: 4011,
                    updated_by: 4011
                };
                $scope.findings = [];
                $scope.actions = [];
                $scope.hazards = [];
                return;
            }
            cmsService.get_audit(audit_id).then(function (response) {
                console.log('--------audit  form response----------', response);

                if (!response || !response.IsSuccess) {
                    console.log('Form load failed', response);
                    return;
                }

                var data = response.Data || {};

                var entity = data.audit || data;

                $scope.entity = entity || $scope.entity;
                $scope.entity.audit_plan_id = $scope.entity.audit_plan_id || plan_id;

                // date fixes
                if ($scope.entity.audit_date) $scope.entity.audit_date = new Date($scope.entity.audit_date);

                $scope.entity.updated_by = 4011;
                $scope.entity.created_by = 4011;

                $scope.findings = data.findings || [];
                $scope.actions = data.actions || [];
                $scope.hazards = data.hazards || [];

            });
        };

        //---------------Add Finging------------
        $scope.btn_finding_add = {
            text: "+Finding Add",
            icon: "plus",
            type: "default",          // یا "success" / "normal"
            stylingMode: "contained", // ظاهر دکمه واقعی‌تر
            onClick: function () {

                $location.path('/iqs/audit/finding/detail/-1/' + audit_id + '/' + plan_id);

            }
        };

        $scope.openFinding = function (a) {
            if (!a || !a.id) return;
            $location.path('/iqs/audit/finding/detail/' + a.id + '/ ' + audit_id + ' / ' + plan_id);
        };
        // ---------- Save audit ----------


        $scope.btn_save = {
            text: 'Save',
            type: 'success',
            validationGroup: 'auditsave',
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
                audit_plan_id: $scope.entity.audit_plan_id || plan_id,
                code: $scope.entity.code,
                title: $scope.entity.title,
                scope: $scope.entity.scope,
                area: $scope.entity.area,
                type_id: $scope.entity.type_id,
                auditee_id: $scope.entity.auditee_id,
                location_id: $scope.entity.location_id,
                auditor_id: $scope.entity.auditor_id,
                standards_refrences: $scope.entity.standards_refrences,
                remark: $scope.entity.remark,
                audit_date: $scope.entity.audit_date,
                created_by: $scope.entity.created_by,
                updated_by: $scope.entity.updated_by
            };

            // مهم: save_audit نه save_audit_plan
            cmsService.save_audit(dto).then(function (response) {
                console.log('--------save audit response----------', response);

                if (!response || !response.IsSuccess) return;

                // اگر New بود id برگردانده‌شده را ست کن
                if ($scope.entity.id < 0 && response.Data && response.Data.id) {
                    $scope.entity.id = response.Data.id;
                    audit_id = response.Data.id;
                }


                $scope.bind();
            });
        };

        $scope.btn_back = {
            text: 'Back',
            icon: 'chevronleft',
            onClick: function () {
                $location.path('/iqs/audit/plan/' + plan_id);
            }
        };

        // ---------------- Editors ----------------
        $scope.txt_title = { width: '100%', bindingOptions: { value: 'entity.title' } };
        $scope.txt_code = { width: '100%', bindingOptions: { value: 'entity.code' } };
        $scope.txt_scope = { width: '100%', bindingOptions: { value: 'entity.scope' } };
        $scope.txt_area = { width: '100%', bindingOptions: { value: 'entity.area' } };
        $scope.txt_standards_refrences = { width: '100%', bindingOptions: { value: 'entity.standards_refrences' } };
        $scope.txt_remark = { width: '100%', bindingOptions: { value: 'entity.remark' } };

        $scope.dt_audit_date = {
            type: "date",
            openOnFieldClick: true,
            showDropDownButton: true,
            dropDownOptions: { container: "body" },
            bindingOptions: { value: "entity.audit_date" }
        };


        $scope.types = [{ id: 1, name: 'T1' }, { id: 2, name: 'T2' }, { id: 3, name: 'T3' }];
        $scope.sb_types = {
            dataSource: $scope.types,
            showClearButton: true,
            searchEnabled: true,
            placeholder: ' ',
            valueExpr: "id",
            displayExpr: "name",
            bindingOptions: { value: 'entity.type_id' }
        };

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

        $scope.sb_auditees = {
            //dataSource: [],
            showClearButton: true,
            searchEnabled: true,

            valueExpr: "id",
            displayExpr: "name",
            bindingOptions: { dataSource: 'auditees', value: 'entity.auditee_id' }
        };

        $scope.sb_locations = {
            showClearButton: true,
            searchEnabled: true,

            valueExpr: "id",
            displayExpr: "title",
            bindingOptions: { dataSource: 'locations', value: 'entity.location_id' }
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
        $scope.loadLocations();
        $scope.loadAuditees();
        console.log('locations:---', $scope.locations);
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
app.controller('iqs_audit_detail_controller', ['$routeParams', '$location', '$scope', 'cmsService',
    function ($routeParams, $location, $scope, cmsService) {

        var plan_id = parseInt($routeParams.plan_id, 10);
        var audit_id = parseInt($routeParams.id, 10);

        if (isNaN(plan_id)) {

            var qs = $location.search();
            if (qs && qs.plan_id) plan_id = parseInt(qs.plan_id, 10);
        }

        if (isNaN(plan_id)) plan_id = -1;
        if (isNaN(audit_id)) audit_id = -1;

        console.log('audit form params => planId:', plan_id, 'auditId:', audit_id);


        // مدل اصلی فرم (Audit )

        $scope.entity = {
            id: audit_id,
            audit_plan_id: plan_id,
            created_by: 4011,
            updated_by: 4011
        };

        // لیست‌ها

        $scope.findings = [];
        $scope.actions = [];
        $scope.hazards = [];
        $scope.auditors = [];
        $scope.auditees = [];
        $scope.locations = [];

        $scope.loadAuditors = function () {
            return cmsService.get_auditors().then(function (res) {
                if (res && res.IsSuccess) $scope.auditors = res.Data || [];
                else $scope.auditors = [];
            });
        };

        $scope.loadAuditees = function () {
            return cmsService.get_auditees().then(function (res) {
                if (res && res.IsSuccess) $scope.auditees = res.Data || [];
                else $scope.auditees = [];
            });
        };

        $scope.loadLocations = function () {
            return cmsService.get_locations().then(function (res) {
                if (res && res.IsSuccess) $scope.locations = res.Data || [];
                else $scope.locations = [];
            });
        };



        // ---------- Load Form ----------
        $scope.bind = function () {

            if (audit_id < 0) {
                // حالت New
                $scope.entity = {
                    id: -1,
                    audit_plan_id: plan_id,
                    created_by: 4011,
                    updated_by: 4011
                };
                $scope.findings = [];
                $scope.actions = [];
                $scope.hazards = [];
                return;
            }
            cmsService.get_audit(audit_id).then(function (response) {
                console.log('--------audit  form response----------', response);

                if (!response || !response.IsSuccess) {
                    console.log('Form load failed', response);
                    return;
                }

                var data = response.Data || {};

                var entity = data.audit || data;

                $scope.entity = entity || $scope.entity;
                $scope.entity.audit_plan_id = $scope.entity.audit_plan_id || plan_id;

                // date fixes
                if ($scope.entity.audit_date) $scope.entity.audit_date = new Date($scope.entity.audit_date);

                $scope.entity.updated_by = 4011;
                $scope.entity.created_by = 4011;

                $scope.findings = data.findings || [];
                $scope.actions = data.actions || [];
                $scope.hazards = data.hazards || [];

            });
        };

        //---------------Add Finging------------
        $scope.btn_finding_add = {
            text: "+Finding Add",
            icon: "plus",
            type: "default",          // یا "success" / "normal"
            stylingMode: "contained", // ظاهر دکمه واقعی‌تر
            onClick: function () {

                $location.path('/iqs/audit/finding/detail/-1/' + audit_id + '/' + plan_id);

            }
        };

        $scope.openFinding = function (a) {
            if (!a || !a.id) return;
            $location.path('/iqs/audit/finding/detail/' + a.id + '/ ' + audit_id + ' / ' + plan_id);
        };
        // ---------- Save audit ----------


        $scope.btn_save = {
            text: 'Save',
            type: 'success',
            validationGroup: 'auditsave',
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
                audit_plan_id: $scope.entity.audit_plan_id || plan_id,
                code: $scope.entity.code,
                title: $scope.entity.title,
                scope: $scope.entity.scope,
                area: $scope.entity.area,
                type_id: $scope.entity.type_id,
                auditee_id: $scope.entity.auditee_id,
                location_id: $scope.entity.location_id,
                auditor_id: $scope.entity.auditor_id,
                standards_refrences: $scope.entity.standards_refrences,
                remark: $scope.entity.remark,
                audit_date: $scope.entity.audit_date,
                created_by: $scope.entity.created_by,
                updated_by: $scope.entity.updated_by
            };

            // مهم: save_audit نه save_audit_plan
            cmsService.save_audit(dto).then(function (response) {
                console.log('--------save audit response----------', response);

                if (!response || !response.IsSuccess) return;

                // اگر New بود id برگردانده‌شده را ست کن
                if ($scope.entity.id < 0 && response.Data && response.Data.id) {
                    $scope.entity.id = response.Data.id;
                    audit_id = response.Data.id;
                }


                $scope.bind();
            });
        };

        $scope.btn_back = {
            text: 'Back',
            icon: 'chevronleft',
            onClick: function () {
                $location.path('/iqs/audit/plan/' + plan_id);
            }
        };

        // ---------------- Editors ----------------
        $scope.txt_title = { width: '100%', bindingOptions: { value: 'entity.title' } };
        $scope.txt_code = { width: '100%', bindingOptions: { value: 'entity.code' } };
        $scope.txt_scope = { width: '100%', bindingOptions: { value: 'entity.scope' } };
        $scope.txt_area = { width: '100%', bindingOptions: { value: 'entity.area' } };
        $scope.txt_standards_refrences = { width: '100%', bindingOptions: { value: 'entity.standards_refrences' } };
        $scope.txt_remark = { width: '100%', bindingOptions: { value: 'entity.remark' } };

        $scope.dt_audit_date = {
            type: "date",
            openOnFieldClick: true,
            showDropDownButton: true,
            dropDownOptions: { container: "body" },
            bindingOptions: { value: "entity.audit_date" }
        };


        $scope.types = [{ id: 1, name: 'T1' }, { id: 2, name: 'T2' }, { id: 3, name: 'T3' }];
        $scope.sb_types = {
            dataSource: $scope.types,
            showClearButton: true,
            searchEnabled: true,
            placeholder: ' ',
            valueExpr: "id",
            displayExpr: "name",
            bindingOptions: { value: 'entity.type_id' }
        };

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

        $scope.sb_auditees = {
            //dataSource: [],
            showClearButton: true,
            searchEnabled: true,

            valueExpr: "id",
            displayExpr: "name",
            bindingOptions: { dataSource: 'auditees', value: 'entity.auditee_id' }
        };

        $scope.sb_locations = {
            showClearButton: true,
            searchEnabled: true,

            valueExpr: "id",
            displayExpr: "title",
            bindingOptions: { dataSource: 'locations', value: 'entity.location_id' }
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
        $scope.loadLocations();
        $scope.loadAuditees();
        console.log('locations:---', $scope.locations);
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