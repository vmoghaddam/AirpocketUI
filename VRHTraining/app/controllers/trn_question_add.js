'use strict';
app.controller('trn_question_addController', ['$scope', '$location', 'flightService', 'authService', '$routeParams', '$rootScope', '$window', '$http', 'atoService', function ($scope, $location, flightService, authService, $routeParams, $rootScope, $window, $http, atoService) {

    $scope.isFullScreen = true;
    //////////////////////////////

    $scope.ds_people = [];
    $scope.ds_sessions = [];
    $scope.dg_question_columns = [
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 70, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 50 },
        {
            caption: 'Actions',
            alignment: 'center',
            width: 120,
            allowSorting: false,
            allowFiltering: false,
            cellTemplate: function (container, options) {
                $("<div>")
                    .dxButton({
                        icon: "edit",
                        type: "default",
                        stylingMode: "contained",
                        onClick: function () {
                            $scope.popup_questions_visible = true
                        }
                    })
                    .appendTo(container);

                $("<span style='display:inline-block; width:6px;'></span>")
                    .appendTo(container);

                $("<div>")
                    .dxButton({
                        icon: "trash",
                        type: "danger",
                        stylingMode: "contained",
                        onClick: function () {
                           
                        }
                    })
                    .appendTo(container);
            }
        }
    ];
    $scope.dg_question_height = $(window).height() - 110;
    $scope.dg_question_selected = null;
    $scope.dg_question_instance = null;
    $scope.dg_question_ds = [
        { Id: 1, Title: 'Hydraulic system basics' },
        { Id: 2, Title: 'IFR cruising levels (eastbound/westbound)' },
        { Id: 3, Title: 'ATC phraseology: readback/hearback' },
        { Id: 4, Title: 'Maintenance MEL items (ATA 29)' },
        { Id: 5, Title: 'Runway incursion prevention' }
    ];
    $scope.dg_question = {
        wordWrapEnabled: true,
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
        selection: { mode: 'single' },
        noDataText: '',
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,

        columnAutoWidth: false,

        columns: $scope.dg_question_columns,
        onContentReady: function (e) {
            if (!$scope.dg_question_instance)
                $scope.dg_question_instance = e.component;

        },
        onSelectionChanged: function (e) {


        },

        bindingOptions: {
            dataSource: 'dg_question_ds', //'dg_employees_ds',
            height: 'dg_question_height',

        }
    };

    $scope.ds_people = [];
    $scope.ds_sessions = [];
    $scope.dg_answers_columns = [
        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 70, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 50 },
        { dataField: 'IsAnswer', caption: 'Is Answer', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },
        {
            caption: 'Actions',
            alignment: 'center',
            width: 120,
            allowSorting: false,
            allowFiltering: false,
            cellTemplate: function (container, options) {
                $("<div>")
                    .dxButton({
                        icon: "edit",
                        type: "default",
                        stylingMode: "contained",
                        onClick: function () {
                            $scope.popup_answers_visible = true;
                           
                        }
                    })
                    .appendTo(container);

                $("<span style='display:inline-block; width:6px;'></span>")
                    .appendTo(container);

                $("<div>")
                    .dxButton({
                        icon: "trash",
                        type: "danger",
                        stylingMode: "contained",
                        onClick: function () {
                            
                        }
                    })
                    .appendTo(container);
            }
        }

    ];
    $scope.dg_answers_height = $(window).height() - 110;
    $scope.dg_answers_selected = null;
    $scope.dg_answers_instance = null;
    $scope.dg_answers_ds = [
        { Id: 1, Title: 'Hydraulic reservoir check', IsAnswer: false },
        { Id: 2, Title: 'Verify accumulator pressure', IsAnswer: true },
        { Id: 3, Title: 'Switch to yellow system', IsAnswer: false },
        { Id: 4, Title: 'Shut down electric pumps', IsAnswer: false }
    ];
    $scope.dg_answers = {
        wordWrapEnabled: true,
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: false,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },
        selection: { mode: 'single' },
        noDataText: '',
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,

        columnAutoWidth: false,

        columns: $scope.dg_answers_columns,
        onContentReady: function (e) {
            if (!$scope.dg_answers_instance)
                $scope.dg_answers_instance = e.component;

        },
        onSelectionChanged: function (e) {


        },

        bindingOptions: {
            dataSource: 'dg_answers_ds', 
            height: 'dg_answers_height',

        }
    };

    //////////////////////////

    $scope.ds_category = [
        { id: 1, title: 'CAT1' },
        { id: 2, title: 'CAT2' },
        { id: 3, title: 'CAT3' },
        { id: 4, title: 'CAT4' },
        { id: 5, title: 'CAT5' },

    ];
    $scope.sb_category = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: $scope.ds_category,
        displayExpr: 'title',
        valueExpr: 'id',
        placeholder: 'Category',
        bindingOptions: {
            value: ''

        }
    };
    ////////////////////////

    $scope.btn_question = {
        text: '',
        type: 'success',
        icon: 'plus',
        width: 30,
        onClick: function (e) {
            $scope.popup_questions_visible = true;
        }

    };

    $scope.btn_answers = {
        text: '',
        type: 'success',
        icon: 'plus',
        width: 30,

        onClick: function (e) {
            $scope.popup_answers_visible = true;
        }

    };

    ////////////////////////
    $scope.popup_questions_visible = false;
    $scope.popup_questions_height = 250;
    $scope.popup_questions_width = 900;
    $scope.popup_questions_title = 'Questions';
    $scope.popup_instance = null;

    $scope.popup_questions = {


        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'save', onClick: function (e) {

                    }
                }, toolbar: 'bottom'
            },


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_questions_visible = false;
                    }
                }, toolbar: 'bottom'
            }

        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $rootScope.IsRootSyncEnabled = false;
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {
            $scope.bind();
        },
        onHiding: function () {
            $rootScope.IsRootSyncEnabled = true;
            $scope.fltInfo = false;
            $scope.entity = {
                Id: -1,
                EventTitleIds: [],
                Anonymous: false

            };
            $scope.popup_questions_visible = false;
            $rootScope.$broadcast('onQACabinHide', null);
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_questions_visible',
            fullScreen: false,
            title: 'popup_questions_title',
            height: 'popup_questions_height',
            width: 'popup_questions_width',
            'toolbarItems[0].visible': 'isEditable',
            'toolbarItems[2].visible': 'isEditable',

        }
    };

    $scope.popup_answers_visible = false;
    $scope.popup_answers_title = 'Answer';
    $scope.popup_instance = null;
    $scope.popup_answers_height = 280;
    $scope.popup_answers_width = 900;
    $scope.popup_answers = {


        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', onClick: function (e) {

                        atoService.sign_attendance_coures($scope.instructor).then(function (response) {

                        });


                    }
                }, toolbar: 'bottom'
            },


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_answers_visible = false;
                    }
                }, toolbar: 'bottom'
            }

        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $rootScope.IsRootSyncEnabled = false;
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {
            //$scope.bind();
        },
        onHiding: function () {
            $rootScope.IsRootSyncEnabled = true;
            $scope.fltInfo = false;
            $scope.entity = {
                Id: -1,
                EventTitleIds: [],
                Anonymous: false

            };
            $scope.popup_answers_visible = false;
            $rootScope.$broadcast('onQACabinHide', null);
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_answers_visible',
            fullScreen: false,
            title: 'popup_answers_title',
            height: 'popup_answers_height',
            width: 'popup_answers_width',
            'toolbarItems[0].visible': 'isEditable',
            'toolbarItems[2].visible': 'isEditable',

        }
    };



    $scope.bind = function () {
       
    }



    ////////////////////////////////
    $scope.scroll_vradd_height = $(window).height() - 130;
    $scope.scroll_vradd = {
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
            height: 'scroll_vradd_height'
        }

    };

    //////////////////////////////

    $scope.tempData = null;
    $scope.$on('InitQuestionAdd', function (event, prms) {



        $scope.tempData = prms;

        $scope.popup_questions_visible = true


    });


}]);  