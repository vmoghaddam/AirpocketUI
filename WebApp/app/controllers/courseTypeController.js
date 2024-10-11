'use strict';
app.controller('courseTypeController', ['$scope', '$location', '$routeParams', '$rootScope', 'courseService', 'authService', 'trnService', function ($scope, $location, $routeParams, $rootScope, courseService, authService, trnService) {
    $scope.prms = $routeParams.prms;

    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.filterVisible = false;
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: $scope.dg_selected.Id, };
                    $scope.loadingVisible = true;
                    trnService.deleteCourseType(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        if (response.IsSuccess) {
                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.doRefresh = true;
                            $scope.bind();
                        }
                        else
                            General.ShowNotify(response.Errors[0], 'error');




                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }
            });
        }
    };
    $scope.btn_new = {
        text: 'New',
        type: 'default',
        icon: 'plus',
        width: 120,
        onClick: function (e) {

            var data = { Id: null };

            $rootScope.$broadcast('InitAddCourseType', data);
        }

    };
    $scope.btn_edit = {
        text: 'Edit',
        type: 'default',
        icon: 'edit',
        width: 120,

        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $rootScope.$broadcast('InitAddCourseType', data);
        }

    };
    $scope.btn_grps = {
        text: 'Types/Groups',
        type: 'default',
        // icon: 'plus',
        width: 200,
        onClick: function (e) {

            $scope.popup_grps_visible = true;
        }

    };
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {

            // $scope.$broadcast('getFilterQuery', null);
            $scope.bind();
        }

    };
    $scope.btn_print = {
        text: 'Print',
        type: 'default',
        icon: 'print',
        width: 120,

    };
    $scope.btn_filter = {
        text: '',
        type: 'default',
        icon: 'filter',
        width: 40,
        onClick: function (e) {
            if ($scope.filterVisible) {
                $scope.filterVisible = false;
                $('.filter').fadeOut();
            }
            else {
                $scope.filterVisible = true;
                $('.filter').fadeIn();
            }
        }

    };
    //////////////////////////////////
    $scope.loadingVisible = false;
    $scope.loadPanel = {
        message: 'Please wait...',

        showIndicator: true,
        showPane: true,
        shading: true,
        closeOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        // position: { of: "body" },
        onShown: function () {

        },
        onHidden: function () {

        },
        bindingOptions: {
            visible: 'loadingVisible'
        }
    };
    ///////////////////////////////////

    ///////////////////////////////////
    $scope.filters = [];

    $scope.dg_columns = [
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, caption: '#', width: 60, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'Title', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 400 },
        { dataField: 'Mandatory', caption: 'Mandatory', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 120 },
        { dataField: 'Status', caption: 'Continual', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 120 },
        { dataField: 'Duration', caption: 'Duration (hrs)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Interval2', caption: 'Interval', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'CertificateType', caption: 'Certificate Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'JobGroups', caption: 'Groups', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: 'CoursesCount', caption: 'Courses', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100 },
        { dataField: 'Remark', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 300 },


    ];

    $scope.dg_selected = null;
    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.dg = {
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
        height: $(window).height() - 135,

        columns: $scope.dg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_selected = null;
            }
            else
                $scope.dg_selected = data;


        },
        bindingOptions: {
            dataSource: 'dg_ds'
        }
    };


    $scope.doRefresh = false;

    $scope.getFilters = function () {
        var filters = $scope.filters;
        if (filters.length == 0)
            filters = [['Id', '>', 0]];
        else {
            //filters.push('and');
            //filters.push(['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]);

        }


        return filters;
    };
    $scope.bind = function () {
        $scope.dg_ds = [];
        $scope.loadingVisible = true;
        trnService.getCourseTypes().then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_ds = response.Data;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        //if (!$scope.dg_ds) {
        //    $scope.dg_ds = {
        //        store: {
        //            type: "odata",
        //            url: $rootScope.serviceUrl + 'odata/courses/types',
        //            key: "Id",
        //            version: 4,
        //            onLoaded: function (e) {
        //                // $scope.loadingVisible = false;
        //                //filter
        //                $rootScope.$broadcast('OnDataLoaded', null);
        //            },
        //            beforeSend: function (e) {

        //                $scope.dsUrl = General.getDsUrl(e);

        //                // $scope.$apply(function () {
        //                //    $scope.loadingVisible = true;
        //                // });
        //                $rootScope.$broadcast('OnDataLoading', null);
        //            },
        //        },
        //        // filter: [['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]],
        //          sort: ['Title' ],

        //    };
        //}

        //if ($scope.doRefresh) {
        //    $scope.filters = $scope.getFilters();
        //    $scope.dg_ds.filter = $scope.filters;
        //    $scope.dg_instance.refresh();
        //    $scope.doRefresh = false;
        //}

    };
    //////////////////////////
    $scope.popup_grps_visible = false;
    $scope.popup_grps_title = 'Groups/Types';
    $scope.popup_grps = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_grps"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 720,
        width: 1200,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [

             

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_grps_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {

        },
        onShown: function (e) {
            $scope.bindGroups(function () { $scope.bindGroupsTypes(); });


        },
        onHiding: function () {

            $scope.popup_grps_visible = false;

        },
        bindingOptions: {
            visible: 'popup_grps_visible',

            title: 'popup_grps_title',

        }
    };


    $scope.dg_grps_columns = [
        // { dataField: 'OrderIndex', caption: 'Order', allowResizing: true, alignment: 'left', dataType: 'number', visible: false, allowEditing: false, encodeHtml: false, sortIndex: 0, sortOrder: "asc" },
        //{ dataField: 'Type', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false, width: 200, },
        { dataField: 'TitleFormated', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false, },
        { dataField: 'FullCode', caption: 'Code', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false, width: 200, sortIndex: 0, sortOrder: "asc" },

    ];
    $scope.dg_grps_selected = null;
    $scope.dg_grps_instance = null;
    $scope.dg_grps_ds = null;
    $scope.dg_grps = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_grps_columns,
        onContentReady: function (e) {
            if (!$scope.dg_grps_instance)
                $scope.dg_grps_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData;
            $.each($scope.dg_types_ds, function (_i, _d) {
                _d._Mandatory = false;
                _d._Selected = false;
            });

            if (!data) {
                $scope.dg_grps_selected = null;
            }
            else {
                $scope.dg_grps_selected = data[0];

                $scope.bindGroupSelectedTypes(data[0].Id);
            }


        },
        bindingOptions: {

            dataSource: 'dg_grps_ds',
            height: '550',
        },
        // dataSource:ds

    };



    $scope.dg_types_columns = [
        { dataField: "_Selected", caption: "Selected", allowResizing: true, alignment: "center", dataType: 'boolean', allowEditing: false, width: 85 },
        { dataField: "_Mandatory", caption: "Mandatory", allowResizing: true, alignment: "center", dataType: 'boolean', allowEditing: false, width: 90 },
        { dataField: "Title", caption: "Title", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, },


        { dataField: "Remark", caption: "Remark", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 200 },
    ];
    $scope.dg_types_selected = null;
    $scope.dg_types_instance = null;
    $scope.dg_types_ds = null;
    $scope.dg_types = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_types_columns,
        onContentReady: function (e) {
            if (!$scope.dg_types_instance)
                $scope.dg_types_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData;

            if (!data) {
                $scope.dg_selected = null;
            }
            else
                $scope.dg_types_selected = data;


        },
        onCellClick: function (e) {
            if (e.column.dataField == '_Selected' || e.column.dataField == '_Mandatory') {


                var newvalue = !e.value;
                e.data[e.column.dataField] = newvalue;
                //$scope.dg_grps_selected
                var dto = {
                    gid: $scope.dg_grps_selected.Id,
                    tid: e.data.Id,
                    sel: e.data['_Selected'] ? 1 : 0,
                    man: e.data['_Mandatory'] ? 1 : 0,
                };
                trnService.saveGroupTypeX(dto).then(function (response) {

                    //$scope.dg_instance.refresh(true);

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });





            }
        },
        bindingOptions: {

            dataSource: 'dg_types_ds',
            height: '550',
        },
        // dataSource:ds

    };


    $scope.bindGroups = function (callback) {

        $scope.dg_grps_ds = [];
        $scope.loadingVisible = true;
        trnService.getGroups(Config.CustomerId).then(function (response) {
            $scope.loadingVisible = false;
            $scope.dg_grps_ds = response.data;

            callback();
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };

    $scope.bindGroupsTypes = function () {

        $scope.dg_types_ds = [];
        $scope.loadingVisible = true;
        trnService.getCourseTypes(Config.CustomerId).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response.Data, function (_i, _d) {
                _d._Mandatory = false;
                _d._Selected = false;
            });
            $scope.dg_types_ds = response.Data;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    };

    $scope.bindGroupSelectedTypes = function (gid) {
        //$scope.dg_types_ds = [];
        $scope.loadingVisible = true;
        trnService.getCourseTypeByGroup(gid).then(function (response) {
            $scope.loadingVisible = false;
            var ds = response.Data;

            $.each($scope.dg_types_ds, function (_i, _d) {
                _d._Mandatory = false;
                _d._Selected = false;
                var sel = Enumerable.From(ds).Where('$.CourseTypeId==' + _d.Id).FirstOrDefault();
                if (sel) {

                    _d._Selected = true;
                    _d._Mandatory = sel.Mandatory;
                    if (!_d._Mandatory)
                        _d._Mandatory = false;
                }
            });

            //$.each(ds, function (_i, _d) {
            //    var type = Enumerable.From($scope.dg_types_ds);
            //});
            //$.each(response.Data, function (_i, _d) {
            //    _d._Mandatory = false;
            //    _d._Selected = false;
            //});



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Course Types';
        $('.coursetype').fadeIn();
    }
    //////////////////////////////////////////
    $scope.$on('getFilterResponse', function (event, prms) {

        $scope.filters = prms;

        $scope.doRefresh = true;
        $scope.bind();
    });
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });
    $scope.$on('onCourseTypeSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onCourseTypeHide', function (event, prms) {

        $scope.bind();

    });
    //////////////////////////////////////////
    $rootScope.$broadcast('CourseTypeLoaded', null);
    ///end
}]);