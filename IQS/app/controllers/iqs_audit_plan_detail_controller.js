app.controller('iqs_audit_plan_detail_controller', ['$routeParams', '$location', 'DataService', '$scope', 'cmsService',
    function ($routeParams, $location, DataService, $scope, cmsService) {
        /*var id = parseInt($routeParams.id, 10);*/

        var planId = parseInt($routeParams.plan_id, 10);
        console.log('--------audit plan form planId----------', planId);

        // مدل اصلی فرم (Audit Plan)
        $scope.entity = {
            id: planId || -1,
            created_by: 4011,
            updated_by: 4011
        };

        // لیست‌ها
        $scope.audits = [];
        $scope.team = [];
        $scope.findings = [];
        $scope.actions = [];
        $scope.hazards = []; // فعلاً دمو/بعداً از API hazard linkage می‌گیریم
        $scope.auditors = [];

        $scope.loadAuditors = function () {
            return cmsService.get_auditors().then(function (res) {
                if (res && res.IsSuccess) $scope.auditors = res.Data || [];
                else $scope.auditors = [];
            });
        };
        // ---------- Load Form ----------
        $scope.bind = function () {
            cmsService.get_audit_plan_form(planId).then(function (response) {
                console.log('--------audit plan form response----------', response);

                if (!response || !response.IsSuccess) {
                    console.log('Form load failed', response);
                    return;
                }

                var data = response.Data || {};
                $scope.entity = data.plan || $scope.entity;

                // date fixes
                if ($scope.entity.issue_date) $scope.entity.issue_date = new Date($scope.entity.issue_date);
                if ($scope.entity.opening_meeting_start) $scope.entity.opening_meeting_start = new Date($scope.entity.opening_meeting_start);
                if ($scope.entity.opening_meeting_end) $scope.entity.opening_meeting_end = new Date($scope.entity.opening_meeting_end);
                if ($scope.entity.closing_meeting_start) $scope.entity.closing_meeting_start = new Date($scope.entity.closing_meeting_start);
                if ($scope.entity.closing_meeting_end) $scope.entity.closing_meeting_end = new Date($scope.entity.closing_meeting_end);
                $scope.entity.updated_by = 4011;
                $scope.entity.created_by = 4011;

                $scope.audits = data.audits || [];
                $scope.team = data.team || [];
                $scope.findings = data.findings || [];
                $scope.actions = data.actions || [];

            });
        };
        // init
        $scope.loadAuditors().then($scope.bind);
        //---------------Add Audit------------
        $scope.btn_audit_add = {
            text: "+Audit Add",
            icon: "plus",
            type: "default",          // یا "success" / "normal"
            stylingMode: "contained", // ظاهر دکمه واقعی‌تر
            onClick: function () {
                // برو فرم audit (مثال)
                // اگر route شما مثلا /iqs/audit/form/:id هست:
                $location.path('/iqs/audit/detail/-1/' + planId);

                // یا اگر می‌خوای فقط یه audit جدید بسازی:
                // $scope.addAudit();
            }
        };
        $scope.openAudit = function (a) {
            if (!a || !a.id) return;
            $location.path('/iqs/audit/detail/' + a.id + '/' + planId);
        };
        // ---------- Save Plan ----------


        $scope.btn_save = {
            text: 'Save',
            type: 'success',
            validationGroup: 'auditsave',
            //width: 120,

            bindingOptions: {},
            onClick: function (e) {
                var result = e.validationGroup.validate();

                if (!result.isValid) {
                    General.ShowNotify(Config.Text_FillRequired, 'error');
                    return;
                }

                $scope.save();
            }

        };
        $scope.save = function () {

            // اگر entity از view اومده، ممکنه فیلدهای extra مثل lead_auditor_name داشته باشه
            // بهتره فقط فیلدهای قابل ذخیره را بفرستیم:
            var dto = {
                id: $scope.entity.id,
                code: $scope.entity.code,
                title: $scope.entity.title,
                description: $scope.entity.description,
                type_id: $scope.entity.type_id,
                objective: $scope.entity.objective,
                issue_date: $scope.entity.issue_date,
                lead_auditor: $scope.entity.lead_auditor,

                opening_meeting_start: $scope.entity.opening_meeting_start,
                opening_meeting_end: $scope.entity.opening_meeting_end,
                opening_meeting_venue: $scope.entity.opening_meeting_venue,

                closing_meeting_start: $scope.entity.closing_meeting_start,
                closing_meeting_end: $scope.entity.closing_meeting_end,
                closing_meeting_venue: $scope.entity.closing_meeting_venue,

                created_by: $scope.entity.created_by,
                updated_by: $scope.entity.updated_by
            };

            cmsService.save_audit_plan(dto).then(function (response) {
                console.log('--------save audit plan response----------', response);

                // بعد از save دوباره bind تا view (lead_auditor_name) هم sync بشه
                $scope.bind();
            });
        };

        $scope.back = function () {
            //$location.path('/iqs/audit/list');
            $scope.bind();
        };


        //$scope.new = function () {
        //    $scope.save();
        //};

        // ---------- DevExtreme bindings ----------
        $scope.txt_title = {
            width: '100%',
            bindingOptions: { value: 'entity.title' }
        };
        $scope.txt_code = {
            width: '100%',
            bindingOptions: { value: 'entity.code' }
        };
        $scope.txt_objective = {
            width: '100%',
            bindingOptions: { value: 'entity.objective' }
        };

        $scope.txt_Description = {
            width: '100%',
            bindingOptions: { value: 'entity.description' }
        };

        // Issue date
        $scope.dt_issue_date = {
            type: "date",
            openOnFieldClick: true,
            showDropDownButton: true,
            dropDownOptions: { container: "body" },
            bindingOptions: { value: "entity.issue_date" }
        };

        // Types / Auditors — فعلاً همون mock، بعداً از API می‌گیریم
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


        // $scope.auditors = [{ id: 1, name: 'A1' }, { id: 2, name: 'A2' }, { id: 3, name: 'A3' }];
        $scope.sb_auditors = {
            showClearButton: true,
            searchEnabled: true,
            placeholder: ' ',
            valueExpr: "id",
            displayExpr: "name",
            bindingOptions: {
                dataSource: 'auditors',
                value: 'entity.lead_auditor'
            }
        };


        $scope.dt_opening_start = {
            type: "datetime",
            openOnFieldClick: true,
            showDropDownButton: true,
            dropDownOptions: { container: "body" },
            bindingOptions: { value: "entity.opening_meeting_start" }
        };

        $scope.dt_opening_end = {
            type: "datetime",
            openOnFieldClick: true,
            showDropDownButton: true,
            dropDownOptions: { container: "body" },
            bindingOptions: { value: "entity.opening_meeting_end" }
        };

        $scope.txt_opening_venue = {
            width: "100%",
            bindingOptions: { value: "entity.opening_meeting_venue" }
        };

        $scope.dt_closing_start = {
            type: "datetime",
            openOnFieldClick: true,
            showDropDownButton: true,
            dropDownOptions: { container: "body" },
            bindingOptions: { value: "entity.closing_meeting_start" }
        };

        $scope.dt_closing_end = {
            type: "datetime",
            openOnFieldClick: true,
            showDropDownButton: true,
            dropDownOptions: { container: "body" },
            bindingOptions: { value: "entity.closing_meeting_end" }
        };

        $scope.txt_closing_venue = {
            width: "100%",
            bindingOptions: { value: "entity.closing_meeting_venue" }
        };


        // Scroll
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
                $scope.bind();
                options.component.release();
            },
            bindingOptions: { height: 'scroll_content_height' }
        };
        // init
        $scope.bind();
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