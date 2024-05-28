'use strict';
app.controller('PartNumberController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce) {

    $scope.entity = {
        id: null,
        ataChapter: null,
        description: null,
        partNumber: null,
        ipcReference: null,
        typeId: null,
        categoryId: null,
        statusId: null,
        hardTime: null,
        blockList: null
    }




    $scope.btn_refresh = {
        text: 'Refresh',
        type: 'Default',
        icon: '',
        width: 120,
        onClick: function (e) {
            mntService.getPNSelection($scope.entity).then(function (res) {
                $scope.dg_pn_ds = res.data;
            });
        }

    };


    //////////////////

    $scope.popup_pn_visible = false;
    $scope.popup_height = 700;
    $scope.popup_width = 800;
    $scope.popup_pn_title = "Part Number Selection";
    $scope.popup_instance = null;
    $scope.isFullScreen = false;

    $scope.popup_pn = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Select', onClick: function (e) {

                        $rootScope.$broadcast('InitPNSelected', $scope.dg_pn_selected);
                         $scope.popup_pn_visible = false;

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {

                        $scope.popup_pn_visible = false;

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

            if ($scope.isNew) {
                $scope.isContentVisible = true;
            }
            if ($scope.tempData != null)
                $scope.bind();

            //$rootScope.referred_list_instance.repaint();
            //$rootScope.$broadcast('InitTest', $scope.tempData);



        },
        onHiding: function () {
           
            
            $scope.popup_pn_visible = false;
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_pn_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_pn_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isNotLocked',
            //'toolbarItems[1].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };

    ////////////////////

    $scope.bind = function () {
        
        mntService.getPNSelection($scope.entity).then(function (res) {
            $scope.dg_pn_ds = res.data;
        });

        mntService.get_ata_chart().then(function (res) {
            console.log(res);
            $scope.ds_ata = res;
        });
    }


    ////////////////////

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


    $scope.dg_pn_columns = [



        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: 'acfT_Type', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'ataChapter', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'description', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'partNumber', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'remark', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
    ];



    $scope.dg_pn_selected = null;
    $scope.dg_pn_instance = null;
    $scope.dg_pn = {



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
        height: $(window).height() - 600,
        width: $(window).width(),
        columns: $scope.dg_pn_columns,
        onContentReady: function (e) {
            if (!$scope.dg_pn_instance)
                $scope.dg_pn_instance = e.component;

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
                $scope.dg_pn_selected = null;
            }
            else
                $scope.dg_pn_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_pn_ds'
        },
        columnChooser: {
            enabled: false
        },

    };


  //$scope.dg_inter_columns = [



  //      {
  //          cellTemplate: function (container, options) {
  //              $("<div style='text-align:center'/>")
  //                  .html(options.rowIndex + 1)
  //                  .appendTo(container);
  //          }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
  //      },
  //    { dataField: '', caption: 'A/C Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
  //    { dataField: '', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
  //    { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
  //    { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
  //    { dataField: '', caption: 'Remark', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
  //  ];



  //  $scope.dg_inter_selected = null;
  //  $scope.dg_inter_instance = null;
  //  $scope.dg_inter = {



  //      wordWrapEnabled: true,
  //      rowAlternationEnabled: false,
  //      headerFilter: {
  //          visible: false
  //      },
  //      filterRow: {
  //          visible: true,
  //          showOperationChooser: true,
  //      },
  //      showRowLines: true,
  //      showColumnLines: true,
  //      sorting: { mode: 'none' },

  //      noDataText: '',

  //      allowColumnReordering: true,
  //      allowColumnResizing: true,
  //      scrolling: { mode: 'infinite' },
  //      paging: { pageSize: 100 },
  //      showBorders: true,
  //      selection: { mode: 'single' },

  //      columnAutoWidth: false,
  //      height: $(window).height() - 600,
  //      width: $(window).width(),
  //      columns: $scope.dg_inter_columns,
  //      onContentReady: function (e) {
  //          if (!$scope.dg_inter_instance)
  //              $scope.dg_inter_instance = e.component;

  //      },

  //      onRowClick: function (e) {



  //      },

  //      onRowPrepared: function (e) {


  //      },


  //      onCellPrepared: function (e) {

  //      },

  //      onSelectionChanged: function (e) {
  //          var data = e.selectedRowsData[0];

  //          console.log(data);

  //          $scope.dg_inter_id.Id = e.selectedRowsData[0].Id;

  //          console.log($scope.dg_inter_id.id);
  //          if (!data) {
  //              $scope.dg_inter_selected = null;
  //          }
  //          else
  //              $scope.dg_inter_selected = data;


  //      },

  //      bindingOptions: {
  //          dataSource: 'dg_inter_ds'
  //      },
  //      columnChooser: {
  //          enabled: false
  //      },

  //  };


    $scope.$on('InitPNPopup', function (event, prms) {

        $scope.tempData = prms;

        $scope.bind();

        $scope.popup_pn_visible = true;
    });



}]);


