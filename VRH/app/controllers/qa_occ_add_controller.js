'use strict';
app.controller('occAddController', ['$scope', '$location', '$routeParams', '$rootScope', 'cmsService',
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

        // Description Text Area
        $scope.txt_description = {
            placeholder: 'Description',
            height: 150,
            bindingOptions: {
                value: 'entity.description'
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

        // ============================================
        // SOURCES POPUP & FILTER
        // ============================================

        $scope.popup_sources_visible = false;

        // Source Filter Object
        $scope.sourceFilter = {
            type_id: -1,
            date_from: null,
            date_to: null,
            flight_no: null,
            route: null,
            register: null
        };

        // Source Types Data
        $scope.ds_source_types = [
            { id: -1, title: 'All Types' },
            { id: 1, title: 'Incident Report' },
            { id: 2, title: 'Safety Report' },
            { id: 3, title: 'Maintenance Report' },
            { id: 4, title: 'Flight Report' },
            { id: 5, title: 'Ground Report' }
        ];

        // Filter Controls
        $scope.sb_filter_type = {
            showClearButton: false,
            searchEnabled: false,
            placeholder: 'Type',
            displayExpr: "title",
            valueExpr: 'id',
            bindingOptions: {
                value: 'sourceFilter.type_id',
                dataSource: 'ds_source_types'
            }
        };

        $scope.dt_filter_from = {
            type: "date",
            placeholder: 'From Date',
            width: '100%',
            displayFormat: "yyyy-MM-dd",
            bindingOptions: {
                value: 'sourceFilter.date_from'
            }
        };

        $scope.dt_filter_to = {
            type: "date",
            placeholder: 'To Date',
            width: '100%',
            displayFormat: "yyyy-MM-dd",
            bindingOptions: {
                value: 'sourceFilter.date_to'
            }
        };

        $scope.txt_filter_flight_no = {
            placeholder: 'Flight No',
            bindingOptions: {
                value: 'sourceFilter.flight_no'
            }
        };

        $scope.txt_filter_route = {
            placeholder: 'Route',
            bindingOptions: {
                value: 'sourceFilter.route'
            }
        };

        $scope.txt_filter_register = {
            placeholder: 'Register',
            bindingOptions: {
                value: 'sourceFilter.register'
            }
        };

        // Search Button
        $scope.btn_search_sources = {
            text: 'Search',
            type: 'default',
            icon: 'search',
            onClick: function (e) {
                $scope.searchSources();
            }
        };

        // Search Function
        $scope.searchSources = function () {
            $scope.loadingVisible = true;

            // Build filter parameters
            var params = {
                type_id: $scope.sourceFilter.type_id,
                date_from: $scope.sourceFilter.date_from,
                date_to: $scope.sourceFilter.date_to,
                flight_no: $scope.sourceFilter.flight_no,
                route: $scope.sourceFilter.route,
                register: $scope.sourceFilter.register
            };

            var _from = moment($scope.sourceFilter.date_from).format('YYYY-MM-DD');
            var _to = moment($scope.sourceFilter.date_to).format('YYYY-MM-DD');
            qahService.get_reports(_from, _to, $scope.sourceFilter.type_id, ($scope.sourceFilter.register ? $scope.sourceFilter.register : '-'), -1).then(function (response) {
                $scope.loadingVisible = false;
                console.log(response);
                $scope.ds_source = response;
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        };

        // Clear Filter Function
        $scope.clearSourceFilter = function () {
            $scope.sourceFilter = {
                type_id: -1,
                date_from: null,
                date_to: null,
                flight_no: null,
                route: null,
                register: null
            };
            $scope.ds_source = [];
        };

        $scope.selected_sources = [];

        $scope.popup_sources = {
            height: $(window).height() - 100,
            width: $(window).width() - 200,
            fullScreen: false,
            showTitle: true,
            title: 'Sources',
            toolbarItems: [
                {
                    widget: 'dxButton',
                    location: 'after',
                    options: {
                        type: 'success',
                        text: 'Select',
                        icon: 'remove',
                        onClick: function (e) {
                            if ($scope.dg_source_selected) {
                                $scope.selected_sources.push($scope.dg_source_selected);
                            }

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
                            $scope.popup_sources_visible = false;
                        }
                    },
                    toolbar: 'bottom'
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
            },
            onHiding: function () {
                $scope.popup_sources_visible = false;
            },
            bindingOptions: {
                visible: 'popup_sources_visible',
            }
        };

        // Show Report Function
        $scope.show_report = function (data) {
            console.log('Show report for:', data);
            // TODO: Implement report viewing logic
            General.ShowNotify('Report view will be implemented', 'info');
        };

        $scope.ds_source = null;
        $scope.dg_source_columns = [
            { dataField: 'TypeTitle', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, fixed: false, fixedPosition: 'right' },
            { dataField: 'DateOccurrence', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, encodeHtml: false, width: 150, format: 'yyyy-MM-dd', sortIndex: 0, sortOrder: "asc" },
            { dataField: 'CreatorName', caption: 'Reporter', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'right' },
            { dataField: 'Route', caption: 'Flight', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: false, fixedPosition: 'right' },
            { dataField: 'Describtion', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'right' },
            {
                dataField: "Id",
                caption: '',
                width: 100,
                allowFiltering: false,
                allowSorting: false,
                cellTemplate: 'showReportTemplate',
                name: 'showreport',
                fixed: true,
                fixedPosition: 'right',
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
            columns: $scope.dg_source_columns,
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
            },
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