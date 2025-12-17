'use strict';
app.controller('occAddController', ['$scope', '$location', '$routeParams', '$rootScope', 'qahService',
    function ($scope, $location, $routeParams, $rootScope, qahService) {
        $scope.isNew = true;

        //////////////////////////
        $scope.loadingVisible = false;
        $scope.loadPanel = {
            message: 'Please wait...',
            showIndicator: true,
            showPane: true,
            shading: true,
            closeOnOutsideClick: false,
            shadingColor: "rgba(0,0,0,0.4)",
            onShown: function () { },
            onHidden: function () { },
            bindingOptions: {
                visible: 'loadingVisible'
            }
        };

        // Tabs Definition
        var tabs = [
            { text: "Main", id: 'main' },
            { text: "Sources", id: 'sources' },
            { text: "Root Causes", id: 'root_causes' },
            { text: "Consequences", id: 'consequences' },
            { text: "Attachments", id: 'attachments' },
            { text: "Relevants", id: 'relevants' },
            { text: 'Risk Assessment', id: 'assessment' },
            { text: 'Actions', id: 'actions' },
            { text: 'Review', id: 'assessment_review' },
            { text: 'Monitoring', id: 'monitoring' }
        ];

        $scope.tabs = tabs;
        $scope.selectedTabIndex = 0;

        // Tab Change Handler
        $scope.$watch("selectedTabIndex", function (newValue) {
            try {
                $scope.selectedTab = tabs[newValue];
                $('.tab').hide();
                $('.' + $scope.selectedTab.id).fadeIn(100);
            } catch (e) {
                console.log(e);
            }
        });

        // Tabs Options
        $scope.tabs_options = {
            onItemClick: function (arg) { },
            bindingOptions: {
                dataSource: { dataPath: "tabs", deep: true },
                selectedIndex: 'selectedTabIndex'
            }
        };

        // Entity
        $scope.entity = {
            id: null,
            title: null,
            description: null,
            occurrence_date: null,
            status_id: null,
            category_id: null,
            type_id: null,
            remark: null
        };

        // Data Sources
        $scope.ds_occ_category = [];
        $scope.ds_occ_type = [];
        $scope.ds_occ_status = [];

        // Occurrence Date
        $scope.dt_occurrence_date = {
            type: "date",
            placeholder: 'Occurrence Date',
            width: '100%',
            displayFormat: "yyyy-MM-dd",
            bindingOptions: {
                value: 'entity.occurrence_date'
            }
        };

        // Status Select Box
        $scope.sb_status = {
            showClearButton: true,
            searchEnabled: true,
            placeholder: 'Select...',
            valueExpr: "id",
            displayExpr: "title",
            bindingOptions: {
                value: 'entity.status_id',
                dataSource: 'ds_occ_status'
            }
        };

        // Category Select Box
        $scope.sb_category = {
            showClearButton: true,
            searchEnabled: true,
            placeholder: 'Select...',
            displayExpr: "title",
            valueExpr: 'id',
            bindingOptions: {
                value: 'entity.category_id',
                dataSource: 'ds_occ_category'
            }
        };

        // Type Select Box
        $scope.sb_type = {
            showClearButton: true,
            searchEnabled: true,
            placeholder: 'Select...',
            displayExpr: "title",
            valueExpr: 'id',
            bindingOptions: {
                value: 'entity.type_id',
                dataSource: 'ds_occ_type'
            }
        };

        // Title Text Box
        $scope.txt_title = {
            placeholder: 'Title',
            bindingOptions: {
                value: 'entity.title'
            }
        };

        $scope.btn_source_add = {
            text: '',
            type: 'default',
            icon: 'plus',
            width: '20',

            bindingOptions: {},
            onClick: function (e) {

                $scope.popup_sources_visible = true;

            }

        };

        // Scroll Style
        $scope.get_scroll_style = function () {
            return {
                height: $(window).height() - 240
            };
        };

        // Popup Settings
        $scope.pop_width = $(window).width() - 100;
        $scope.pop_height = $(window).height() - 70;
        $scope.popup_add_visible = false;
        $scope.popup_add_title = 'New Occurrence';

        $scope.popup_add = {
            fullScreen: true,
            showTitle: true,
            toolbarItems: [
                {
                    widget: 'dxButton',
                    location: 'after',
                    options: {
                        type: 'default',
                        text: 'Save',
                        icon: 'check',
                        validationGroup: 'occadd',
                        onClick: function (e) {
                            // Save logic will be added later
                            console.log('Save clicked', $scope.entity);
                            General.ShowNotify('Save functionality will be implemented', 'info');
                        }
                    },
                    toolbar: 'bottom'
                },
                {
                    widget: 'dxButton',
                    location: 'after',
                    options: {
                        type: 'danger',
                        text: 'Close',
                        icon: 'remove',
                        onClick: function (e) {
                            $scope.popup_add_visible = false;
                        }
                    },
                    toolbar: 'bottom'
                }
            ],
            visible: false,
            dragEnabled: false,
            closeOnOutsideClick: false,
            onShowing: function (e) { },
            onShown: function (e) {
                if ($scope.tempData != null) {
                    // Load existing data
                    $scope.bind($scope.tempData);
                }
            },
            onHiding: function () {
                $scope.clearEntity();
                $scope.popup_add_visible = false;
                $rootScope.$broadcast('onOccAddHide', null);
            },
            bindingOptions: {
                visible: 'popup_add_visible',
                width: 'pop_width',
                height: 'pop_height',
                title: 'popup_add_title'
            }
        };

        // Clear Entity
        $scope.clearEntity = function () {
            $scope.entity = {
                id: null,
                title: null,
                description: null,
                date_occurred: null,
                remark: null
            };
            $scope.selectedTabIndex = 0;
        };

        // Bind Data
        $scope.bind = function (data) {
            $scope.entity = angular.copy(data);
        };


        $scope.popup_sources_visible = false;
        $scope.popup_sources = {
            height: $(window).height() - 100,
            width: $(window).width() - 200,
            fullScreen: false,
            showTitle: true,
            title: 'Sources',
            toolbarItems: [


                //{
                //    widget: 'dxButton', location: 'after', options: {
                //        type: 'success', text: 'Save', icon: 'check', validationGroup: 'statusChange', onClick: function (e) {
                //            var result = e.validationGroup.validate();

                //            if (!result.isValid) {
                //                General.ShowNotify(Config.Text_FillRequired, 'error');
                //                return;
                //            }
                //            $scope.loadingVisible = true;
                //            courseService.changeStatus($scope.courseStatus).then(function (response) {
                //                //$scope.selectedEmployees
                //                $.each($scope.selectedEmployees, function (_i, _d) {
                //                    _d.StatusId = $scope.courseStatus.StatusId != 72 ? $scope.courseStatus.StatusId : null;
                //                    _d.Status = $scope.courseStatus.Status != 72 ? $scope.courseStatus.Status : null;
                //                    _d.CerNumber = null;
                //                    _d.DateIssue = null;
                //                });
                //                $scope.courseEmployee.Failed = response.Failed;
                //                $scope.courseEmployee.Pending = response.Pending;
                //                $scope.courseEmployee.Total = response.Total;
                //                $scope.courseEmployee.Registered = response.Registered;
                //                $scope.courseEmployee.Canceled = response.Canceled;
                //                $scope.courseEmployee.Passed = response.Passed;
                //                $scope.courseEmployee.Attended = response.Attended;

                //                General.ShowNotify(Config.Text_SavedOk, 'success');

                //                $scope.loadingVisible = false;
                //                $scope.dg_employees_instance.clearSelection();
                //                $scope.popup_status_visible = false;
                //            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                //        }
                //    }, toolbar: 'bottom'
                //},
                {
                    widget: 'dxButton', location: 'after', options: {
                        type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                            $scope.popup_sources_visible = false;
                        }
                    }, toolbar: 'bottom'
                }
            ],

            visible: false,
            dragEnabled: false,
            closeOnOutsideClick: false,
            onShowing: function (e) {


            },
            onShown: function (e) {


            },
            onHidden: function () {
               // $scope.dg_employees_instance.refresh();
            },
            onHiding: function () {
                

                $scope.popup_sources_visible = false;
                // $rootScope.$broadcast('onPersonHide', null);
            },
            bindingOptions: {
                visible: 'popup_sources_visible',


            }
        };



        $scope.ds_source = null;
        $scope.dg_source_columns = [
            { dataField: 'TypeTitle', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,width:200, fixed: false, fixedPosition: 'right' },



            { dataField: 'DateOccurrence', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, encodeHtml: false, width: 150, format: 'YYYY-MM-DD', sortIndex: 0, sortOrder: "asc" },
            { dataField: 'CreatorName', caption: 'Reporter', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 1500, fixed: false, fixedPosition: 'right' },
            { dataField: 'Route', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: false, fixedPosition: 'right' },
            { dataField: 'Describtion', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'right' },
            {
                dataField: "Id", caption: '',
                width: 100,
                allowFiltering: false,
                allowSorting: false,
                cellTemplate: 'showReportTemplate',
                name: 'showreport',
                fixed: true,
                fixedPosition: 'right',
                //visible:false,

            }
            
        ];
        $scope.dg_source_selected = null;
        $scope.dg_source_instance = null;
        $scope.dg_source = {
            showRowLines: true,
            showColumnLines: true,
            sorting: { mode: 'multiple' },

            noDataText: '',
            showColumnHeaders: true,
            allowColumnReordering: true,
            allowColumnResizing: true,
            scrolling: { mode: 'infinite' },
            paging: { pageSize: 100 },
            showBorders: true,
            selection: { mode: 'single' },

            filterRow: { visible: false, showOperationChooser: true, },
            columnAutoWidth: false,
            columns: $scope.dg_att_columns,
            onContentReady: function (e) {
                if (!$scope.dg_source_instance)
                    $scope.dg_source_instance = e.component;

            },
            onSelectionChanged: function (e) {
                var data = e.selectedRowsData[0];

                if (!data) {
                    $scope.dg_source_selected = null;
                }
                else
                    $scope.dg_source_selected = data;


            },
            height: 450,
            bindingOptions: {

                dataSource: 'ds_source',
                // height: 'dg_height',
            },
            // dataSource:ds

        };





        // Listen for Init Event
        $scope.tempData = null;
        $scope.$on('InitAddOccurrence', function (event, prms) {
            $scope.tempData = null;

            if (!prms.Id) {
                $scope.isNew = true;
                $scope.clearEntity();
                $scope.popup_add_title = 'New Occurrence';
            } else {
                $scope.tempData = prms;
                $scope.isNew = false;
                $scope.popup_add_title = 'Edit Occurrence';
            }

            $scope.popup_add_visible = true;
        });

    }]);