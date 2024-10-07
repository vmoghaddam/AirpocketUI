'use strict';
app.controller('qaReferController', ['$scope', '$location', 'qaService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, qaService, authService, $routeParams, $rootScope, $window, $sce) {



    $scope.commentEntity = {};
    
    $scope.bind = function () {
        qaService.getReferredList($scope.commentEntity.EmployeeId, $scope.commentEntity.Type, $scope.commentEntity.Id).then(function (response) {
            $rootScope.referred_list_ds = response.Data;
            console.log("list", response);
        });

        qaService.getComments($scope.commentEntity.Id, $scope.commentEntity.Type).then(function (response) {
            $rootScope.dg_comment_ds = response.Data;
        });
    };

  


    $scope.scroll_referre_height = $scope.popup_height - 500;
    $scope.scroll_referre = {
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
            height: 'scroll_referre_height'
        }

    };



    $scope.btn_send = {
        type: 'success',
        icon: 'success',
      
        bindingOptions: {},
        onClick: function (e) {

            qaService.sendComment($scope.commentEntity).then(function (response) {
                console.log(response);
                qaService.getComments($scope.commentEntity.Id, $scope.commentEntity.Type).then(function (response) {
                    $rootScope.dg_comment_ds = response.Data;
                });
            });
        }

    };


    $scope.txt_referComment = {
        readOnly: true,
        focusStateEnabled: false,
        bindingOptions: {
            value: 'commentEntity.referComment'
        }
    }

    $scope.txt_comment = {
       
        bindingOptions: {
            value: 'commentEntity.Comment'
        }
    }



    $scope.dg_comment_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },





        { dataField: 'name', caption: 'Name', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 150 },
        { dataField: 'Comment', caption: 'Comment', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minwidth: 250 },
        { dataField: 'DateComment', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 250 },






    ];
    $scope.dg_comment_selected = null;
    $rootScope.dg_comment_instance = null;
    $rootScope.dg_comment_ds = null;
    $scope.dg_comment = {



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
        height: $scope.popup_height - 445,
        columns: $scope.dg_comment_columns,
        onContentReady: function (e) {
            if (!$rootScope.dg_comment_instance)
                $rootScope.dg_comment_instance = e.component;

        },

        onRowClick: function (e) {

        },

        onRowPrepared: function (e) {
        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];


            if (!data) {
                $scope.dg_comment_selected = null;
            }
            else
                $scope.dg_comment_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_comment_ds'
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.referred_list_columns = [
        { dataField: 'ReferredName', caption: 'Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 300 },
        { dataField: 'ReviewResultTitle', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'DateStatus', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 230 },
    ]
    $scope.referred_list = {
        keyExpr: 'Id',
        parentIdExpr: 'ParentId',
        columns: $scope.referred_list_columns,
        noDataText: '',
        columnAutoWidth: true,

        onContentReady: function (e) {
            if (!$scope.referred_list_instance)
                $rootScope.referred_list_instance = e.component;
        },

        onRowClick: function (e) {
            $scope.commentEntity.referComment = e.data.Comment;
        },

        bindingOptions: {
            dataSource: 'referred_list_ds',

        }
    }
    $scope.$on('InitTest', function (event, prms) {
     
        console.log(prms);

        $scope.tempData = prms;
        //$scope.commentEntity.Category = $scope.tempData.Category;
        $scope.commentEntity.Id = $scope.tempData.Id;
        $scope.commentEntity.Type = parseInt($scope.tempData.Type);
        console.log($scope.commentEntity.Type);
        $scope.commentEntity.EmployeeId = $scope.tempData.EmployeeId;
        $rootScope.isNotDetermined = $scope.tempData.isNotDetermined;

        $scope.bind();
    });
  


}]);


