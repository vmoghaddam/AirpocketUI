'use strict';
app.controller('student_attendance', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', 'vira_general_service', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce, vira_general_service) {

   
    
    $scope.participants = [
        {
            fullName: "STAFF2 TEST",
            nationalCode: "0003939848",
            department: "Flight Operation",
            sessions: [
                { date: "2024-09-29", time: "08:00-10:00", attended: false },
                { date: "2024-09-29", time: "10:00-12:00", attended: false },
                { date: "2024-09-30", time: "10:00-12:00", attended: false },
                { date: "2024-09-30", time: "15:00-18:00", attended: false },
                { date: "2024-10-01", time: "08:00-10:00", attended: false },
                { date: "2024-10-01", time: "10:00-12:00", attended: false }
            ],
            result: "P"
        },
        {
            fullName: "STAFF1 TEST",
            nationalCode: "0793565510",
            department: "Flight Operation",
            sessions: [
                { date: "2024-09-29", time: "08:00-10:00", attended: false },
                { date: "2024-09-29", time: "10:00-12:00", attended: false },
                { date: "2024-09-30", time: "10:00-12:00", attended: false },
                { date: "2024-09-30", time: "15:00-18:00", attended: false },
                { date: "2024-10-01", time: "08:00-10:00", attended: false },
                { date: "2024-10-01", time: "10:00-12:00", attended: false }
            ],
            result: "P"
        }
    ];


    $scope.dg_req_ds = [
        { nationalCode: '0003939848', fullName: 'STAFF2 TEST', session1: true, session2: false, department: 'Flight Operation', result: 'P' },
        { nationalCode: '0793565510', fullName: 'STAFF1 TEST', session1: true, session2: true, department: 'Flight Operation', result: 'P' }
    ];


    $scope.dg_req_columns = [

        { dataField: 'nationalCode', caption: 'National Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'fullName', caption: 'Full Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        {
            dataField: 'session1', caption: '2024-09-29 08:00-10:00', allowResizing: true, alignment: 'center', allowEditing: false, width: 200,
            cellTemplate: function (container, options) {
                var checkBox = $('<div>').dxCheckBox({
                    value: options.data.session1,
                    onValueChanged: function (e) {
                        options.setValue(e.value);
                    }
                });
                container.append(checkBox);
            }
        },
        {
                dataField: 'session2',
                caption: '2024-09-29 10:00-12:00',
                allowResizing: true,
                alignment: 'center',
            allowEditing: true,
            width: 200,
                cellTemplate: function (container, options) {
                    var checkBox = $('<div>').dxCheckBox({
                        value: options.data.session2,
                        onValueChanged: function (e) {
                            options.setValue(e.value);
                        }
                    });
                    container.append(checkBox);
                }
            },
            {
                dataField: 'session3',
                caption: '2024-09-30 10:00-12:00',
                allowResizing: true,
                alignment: 'center',
                allowEditing: true,
                width: 200,
                cellTemplate: function (container, options) {
                    var checkBox = $('<div>').dxCheckBox({
                        value: options.data.session3,
                        onValueChanged: function (e) {
                            options.setValue(e.value);
                        }
                    });
                    container.append(checkBox);
                }
            },
            {
                dataField: 'session4',
                caption: '2024-09-30 15:00-18:00',
                allowResizing: true,
                alignment: 'center',
                allowEditing: true,
                width: 200,
                cellTemplate: function (container, options) {
                    var checkBox = $('<div>').dxCheckBox({
                        value: options.data.session4,
                        onValueChanged: function (e) {
                            options.setValue(e.value);
                        }
                    });
                    container.append(checkBox);
                }
            },
            {
                dataField: 'session5',
                caption: '2024-10-01 08:00-10:00',
                allowResizing: true,
                alignment: 'center',
                allowEditing: true,
                width: 200,
                cellTemplate: function (container, options) {
                    var checkBox = $('<div>').dxCheckBox({
                        value: options.data.session5,
                        onValueChanged: function (e) {
                            options.setValue(e.value);
                        }
                    });
                    container.append(checkBox);
                }
            },
            {
                dataField: 'session6',
                caption: '2024-10-01 10:00-12:00',
                allowResizing: true,
                alignment: 'center',
                allowEditing: true,
                width: 200,
                cellTemplate: function (container, options) {
                    var checkBox = $('<div>').dxCheckBox({
                        value: options.data.session6,
                        onValueChanged: function (e) {
                            options.setValue(e.value);
                        }
                    });
                    container.append(checkBox);
                }
            },
        
        { dataField: 'department', caption: 'Department', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'result', caption: 'Result', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 }
    ];



    $scope.dg_req_selected = null;
    $scope.dg_req_instance = null;
    $scope.dg_req_id = null;
    $scope.dg_req = {



        wordWrapEnabled: true,
        rowAlternationEnabled: false,
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 450,
        columns: $scope.dg_req_columns,
        onContentReady: function (e) {
            if (!$scope.dg_req_instance)
                $scope.dg_req_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];
            $scope.dg_delivery_ds = null;


            $scope.dg_req_id = e.selectedRowsData[0].id;
            $scope.bind_items();

            $scope.entity_nis.cmP_PartNumberId = data.id;
            $scope.entity_nis.pn_title = data.fullNo;
            $scope.entity_nis.priorityId = data.priorityId;

            $scope.entity_info.date = data.paperDate;
            $scope.entity_info.no = data.fullNo;
            $scope.entity_info.remark = data.remark;
            $scope.entity_info.approvedBy = data.approverUser_FullName;
            $scope.entity_info.register = data.register;
            $scope.entity_info.acfT_TypeId = data.acfT_TypeId;
            $scope.entity_info.acfT_MSNId = data.acfT_MSNId;
            $scope.entity_info.priority = data.priority;



            if (!data) {
                $scope.dg_req_selected = null;
            }
            else {
                $scope.dg_req_selected = data;


                $scope.do_receiver = Enumerable.From($scope.ds_locations).Where(function (x) {


                    return x.uM_UserId == data.sender_UserId && x.gI_LocationId == data.sender_LocationId;

                }).FirstOrDefault();
            }


        },

        bindingOptions: {
            dataSource: 'dg_req_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.scroll_height = $(window).height() - 130;
    $scope.scroll = {
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
            height: 'scroll_height'
        }

    };

}]);


