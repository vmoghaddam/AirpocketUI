'use strict';
app.controller('roster2Controller', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {



    $scope.dg_columnsX = [
      // { dataField: 'IsCanceled', caption: 'CNL', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 50, fixed: true, fixedPosition: 'left',  sortIndex: 2, sortOrder: "asc" },
       { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 95, /*format: 'EEE MM-dd'*/ format:'EEE d', sortIndex: 0, sortOrder: "asc" },
       {dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: false, fixedPosition: 'left' },

      {
          caption: 'Flight',
          fixed: false, fixedPosition: 'left',
          columns: [
                

              //{ dataField: 'AircraftType', caption: 'AC Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: false, fixedPosition: 'left' },
               { dataField: 'Register', caption: 'Reg.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 95, fixed: false, fixedPosition: 'left', sortIndex: 1, sortOrder: "asc" },
               
              { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
              { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
              { dataField: 'STDLocal', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 85, format: 'HH:mm', sortIndex: 3, sortOrder: "asc" },
              { dataField: 'STALocal', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 85, format: 'HH:mm' },



          ],
      },
      
       {
           dataField: "Id", caption: 'Cockpit',
           width: 400,
           allowFiltering: false,
           allowSorting: false,
           cellTemplate: 'cockpitTemplate',

       },
       {
           dataField: "Id", caption: 'Cabin',
           width: 600,
           allowFiltering: false,
           allowSorting: false,
           cellTemplate: 'cabinTemplate',

       },
        //{
        //    dataField: "Id", caption: 'Instructors',
        //    width: 300,
        //    allowFiltering: false,
        //    allowSorting: false,
        //    cellTemplate: 'instructorTemplate',

        //},
        {
            dataField: "Id", caption: 'Others',
            width: 400,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: 'otherTemplate',

        },

      // ,{
      //     caption: 'Cockpit',
      //     fixed: false, fixedPosition: 'right',
      //     columns: [



      //         {
      //             dataField: 'P11',
      //             caption: 'P1(1)',
      //             width: 140,
      //             lookup: {

      //                 displayExpr: "ScheduleName",
      //                 valueExpr: "Id",
      //                 allowClearing: true,

      //             }
      //         },

      //          {
      //              dataField: 'P12',
      //              caption: 'P1(2)',
      //              width: 140,
      //              lookup: {

      //                  displayExpr: "ScheduleName",
      //                  valueExpr: "Id",
      //                  allowClearing: true,

      //              }
      //          },

      //         {
      //             dataField: 'P21',
      //             caption: 'P2(1)',
      //             width: 140,
      //             lookup: {

      //                 displayExpr: "ScheduleName",
      //                 valueExpr: "Id",
      //                 allowClearing: true,

      //             }
      //         },

      //           {
      //               dataField: 'P22',
      //               caption: 'P2(2)',
      //               width: 140,
      //               lookup: {

      //                   displayExpr: "ScheduleName",
      //                   valueExpr: "Id",
      //                   allowClearing: true,

      //               }
      //           },




      //     ]
      // },
      //{
      //    caption: 'Cabin',
      //    columns: [
      //       {
      //           dataField: 'SCCM1',
      //           caption: 'SCCM(1)',
      //           width: 140,
      //           lookup: {

      //               displayExpr: "ScheduleName",
      //               valueExpr: "Id",
      //               allowClearing: true,

      //           }
      //       },

      //         {
      //             dataField: 'SCCM2',
      //             caption: 'SCCM(2)',
      //             width: 140,
      //             lookup: {

      //                 displayExpr: "ScheduleName",
      //                 valueExpr: "Id",
      //                 allowClearing: true,

      //             }
      //         },

      //        {
      //            dataField: 'CCM1',
      //            caption: 'CCM1',
      //            width: 140,
      //            lookup: {

      //                displayExpr: "ScheduleName",
      //                valueExpr: "Id",
      //                allowClearing: true,

      //            }
      //        },

      //        {
      //            dataField: 'CCM2',
      //            caption: 'CCM2',
      //            width: 140,
      //            lookup: {

      //                displayExpr: "ScheduleName",
      //                valueExpr: "Id",
      //                allowClearing: true,

      //            }
      //        },

      //        {
      //            dataField: 'CCM3',
      //            caption: 'CCM3',
      //            width: 140,
      //            lookup: {

      //                displayExpr: "ScheduleName",
      //                valueExpr: "Id",
      //                allowClearing: true,

      //            }
      //        },

      //    ]
      //},
      //{
      //    caption: 'Instructors',
      //    columns: [
      //        {
      //            dataField: "IP1",
      //            caption: "IP1",
      //            width: 140,
      //            lookup: {

      //                displayExpr: "ScheduleName",
      //                valueExpr: "Id",
      //                allowClearing: true,

      //            }
      //        },
      //         {
      //             dataField: 'ISCCM1',
      //             caption: 'ISCCM',
      //             width: 140,
      //             lookup: {

      //                 displayExpr: "ScheduleName",
      //                 valueExpr: "Id",
      //                 allowClearing: true,

      //             }
      //         },

      //    ]
      //},
      
      //{
      //    caption: 'Others',
      //    columns: [
      //         {
      //             dataField: 'Safety1',
      //             caption: 'Safety',
      //             width: 140,
      //             lookup: {

      //                 displayExpr: "ScheduleName",
      //                 valueExpr: "Id",
      //                 allowClearing: true,

      //             }
      //         },
      //           {
      //               dataField: 'OBS1',
      //               caption: 'OBS(1)',
      //               width: 140,
      //               lookup: {

      //                   displayExpr: "ScheduleName",
      //                   valueExpr: "Id",
      //                   allowClearing: true,

      //               }
      //           },
                
      //           {
      //               dataField: 'CHECK1',
      //               caption: 'Check(1)',
      //               width: 140,
      //               lookup: {

      //                   displayExpr: "ScheduleName",
      //                   valueExpr: "Id",
      //                   allowClearing: true,

      //               }
      //           },
      //    ]
      //},
       {
           dataField: "Id", caption: 'DHs',
           width: 400,
           allowFiltering: false,
           allowSorting: false,
           cellTemplate: 'DHTemplate',

       },
       
        

    ];
    $scope.dg_selected = null;
    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.FDPStat = { IsOver: false };
     
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
        scrolling: { mode: 'virtual' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height:400,// $(window).height() - 140,

        columns: $scope.dg_columnsX,
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

          //  showSelection(e.component, selectedRange);

        },
       
       
        bindingOptions: {
            dataSource: 'dg_ds'
        }
    };



    $rootScope.$broadcast('RosterLoaded', null);

}]);