'use strict';
app.controller('personnelselectionController', ['$scope', '$location', 'mntService', 'vira_general_service', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, vira_general_service, authService, $routeParams, $rootScope, $window, $sce) {

    $scope.entity = {
        userId: null,
        locationId: null,
        locationTypeId: [],
        warehouseType: null,
        fullName: null,
       locationTitle: null,
    }




    $scope.btn_search = {
        text: 'Search',
        type: 'Default',
        icon: '',
        width: 120,
        onClick: function (e) {
            vira_general_service.get_user_location($scope.entity).then(function (res) {
                $scope.dg_personnel_ds = res;
               
            });
        }

    };


    //////////////////

    $scope.bind = function () {

        //mntService.get_user_locations({ userId: $rootScope.vira_user_id }).then(function (res) {
        //    $scope.ds_locations = res;
        //});
        if ($rootScope.vira_locations) {
            $scope.ds_locations = $rootScope.vira_locations;
            $scope.dg_personnel_ds = $rootScope.vira_user_locations_all;
            console.log('dg_personnel_ds',$scope.dg_personnel_ds);
            
        }
        else {

            $rootScope.fill_vira_locations(function () {
                $scope.ds_locations = $rootScope.vira_locations;
                $scope.dg_personnel_ds = $rootScope.vira_user_locations_all;
                console.log('dg_personnel_ds',$scope.dg_personnel_ds);
            });
        }

        //vira_general_service.get_user_location($scope.entity).then(function (res) {
        //    $scope.dg_personnel_ds = res;
        //});


        mntService.get_ata_chart().then(function (res) {
            $scope.ds_ata = res;
        });
    }

    $scope.popup_personnel_visible = false;
    $scope.popup_height = 700;
    $scope.popup_width = 700;
    $scope.popup_personnel_title = "Personnel Selection";
    $scope.popup_instance = null;
    $scope.isFullScreen = false;

    $scope.popup_personnel = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Select', onClick: function (e) {

                        $rootScope.$broadcast('InitPersonnelSelected', $scope.dg_personnel_selected);
                        $scope.popup_personnel_visible = false;

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_personnel_visible = false;

                    }
                }, toolbar: 'bottom'
            },

        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $rootScope.IsRootSyncEnabled = false;
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {
            if (!$scope.dg_personnel_instance)
                $scope.dg_personnel_instance.repaint();
            if ($scope.isNew) {
                $scope.isContentVisible = true;
            }
            if ($scope.tempData != null)
                $scope.bind();

            //$rootScope.referred_list_instance.repaint();
            //$rootScope.$broadcast('InitTest', $scope.tempData);



        },
        onHiding: function () {


            $scope.popup_personnel_visible = false;
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_personnel_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_personnel_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isNotLocked',
            //'toolbarItems[1].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };

    ////////////////////

   


    ////////////////////

    $scope.sb_location = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'gI_LocationId',

        bindingOptions: {
            value: 'entity.locationId',
            dataSource: 'ds_locations',
        }
    }

    $scope.sb_ata = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        bindingOptions: {
            value: 'entity.ataChapter',
            dataSource: 'ds_ata'
        }
    }


    $scope.txt_parNo = {
        bindingOptions: {
            value: 'entity.partNumber'
        }
    }

    $scope.txt_desc = {
        bindingOptions: {
            value: 'entity.description'
        }
    }


    ///////////////////////


    $scope.dg_personnel_columns = [



        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'personalId', caption: 'Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'fullName', caption: 'Full Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 250 },
        { dataField: 'title', caption: 'Location', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,  },
       // { dataField: 'fullCode', caption: 'Stamp No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
    ];



    $scope.dg_personnel_selected = null;
    $scope.dg_personnel_instance = null;
    $scope.dg_personnel_height = 570
    $scope.dg_personnel = {



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
        width: '100%',
        columns: $scope.dg_personnel_columns,
        onContentReady: function (e) {
            if (!$scope.dg_personnel_instance)
                $scope.dg_personnel_instance = e.component;

        },

        onRowClick: function (e) {



        },

        onRowPrepared: function (e) {


        },


        onCellPrepared: function (e) {

        },

        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            console.log(data);



            if (!data) {
                $scope.dg_personnel_selected = null;
            }
            else
                $scope.dg_personnel_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_personnel_ds',
            height: 'dg_personnel_height'
        },
        columnChooser: {
            enabled: false
        },

    };


    $scope.$on('InitPersonnelPopup', function (event, prms) {

        $scope.tempData = prms;

        

        $scope.popup_personnel_visible = true;
    });



}]);


