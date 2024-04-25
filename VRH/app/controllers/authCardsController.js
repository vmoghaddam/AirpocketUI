'use strict';
app.controller('authCardsController', ['$scope', '$location', '$routeParams', '$rootScope','qaService' ,'airportService', 'flightService', 'authService', '$route', function ($scope, $location, $routeParams, $rootScope, qaService ,airportService, flightService, authService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.IsDispatch = $route.current.isDispatch;
    $scope.IsBase = !$scope.IsDispatch;
    $scope.jgParents = [1038, 1066];
    $scope.authTypeID = 300018;
    
    ///////////////////////////////////
    $scope.entity = {
        Id:null,
        AuthCardNo:null,
        IssueDate:null,
        ExpireDate:null,
        AuthTypeId: null,
        AuthTypeTitle: null,
        EmployeeId: null,
        IsActive: true,
    };

    $scope.clearEntity = function () {
        $scope.entity.Id = null;
        $scope.entity.AuthCardNo = null;
        $scope.entity.IssueDate = null;
        $scope.entity.ExpireDate = null;
        $scope.entity.AuthTypeId = null;
        $scope.entity.AuthTypeTitle = null;
        $scope.entity.EmployeeId = null;
        $scope.entity.IsActive = true;
    };

    $scope.bind = function (data) {
        $scope.entity.Id = data.Id;
        $scope.entity.AuthCardNo = data.AuthCardNo;
        $scope.entity.IssueDate = data.IssueDate;
        $scope.entity.ExpireDate = data.ExpireDate;
        $scope.entity.AuthTypeId = data.AuthTypeId;
        $scope.entity.AuthTypeTitle = data.AuthTypeTitle;
        $scope.entity.EmployeeId = data.EmployeeId;
        $scope.entity.IsActive = data.IsActive;
    };

    $scope.sb_category = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceDelayCategory(),
        onSelectionChanged: function (arg) {
        },
        searchExpr: ["Title"],
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.DelayCategoryId',
        }
    };
    $scope.txt_code = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Code',
        }
    };
    $scope.txt_title = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Title',
        }
    };
    $scope.txt_remark = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Remark',
        }
    };
    //////////////////////////////////
    $scope.dsUrl = null;
    // $scope.filterVisible = false;
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,
        visible: false,
        
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {
                    $scope.loadingVisible = true;
                    qaService.deleteAuthCard($scope.dg_selected.Id).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.doRefresh = true;
                        $scope.bindDelays($scope.jgParents);
                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                }
            });
        }
    };
    
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {
            $scope.doRefresh = true;
            $scope.bindDelays($scope.jgParents);
        }

    };
    $scope.btn_print = {
        text: 'Print',
        type: 'default',
        icon: 'print',
        width: 120,

    };
    // $scope.btn_filter = {
    //     text: '',
    //     type: 'default',
    //     icon: 'filter',
    //     width: 40,
    //     onClick: function (e) {
    //         if ($scope.filterVisible) {
    //             $scope.filterVisible = false;
    //             $('.filter').fadeOut();
    //         }
    //         else {
    //             $scope.filterVisible = true;
    //             $('.filter').fadeIn();
    //         }
    //     }

    // };

    $scope.bindDelays = function (jgParents) {
        if (!$scope.doRefresh)
            return;
        $scope.dg_ds = null;
        $scope.authTypes = null;
        $scope.loadingVisible = true;
        qaService.getEmpsAuthCards(jgParents).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.Summary = '';
                _d.Summary = $scope.updateCardsSummary(_d.QAAuthCards);
            });
            $scope.dg_ds = response;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        
        qaService.getAuthTypes($scope.authTypeID).then(function (response) {
            $scope.authTypes = response;
            console.log($scope.authTypes);
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.updateCardsSummary = function(AuthCardsList) {
        var summary = '';
        $.each(AuthCardsList, function(index, card){
            if (card.IsActive) {
                var days = Math.floor((new Date().getTime()-new Date(card.ExpireDate).getTime())/1000/3600/24);    
                summary += card.AuthTypeTitle + ' (' + (-1*days) + ' Days), '
            }
        });
        summary = summary.length > 0 ? summary.slice(0, -2): summary;
        return summary;

    }
    //////////////////////////////////
    $scope.loadingVisible = false;
    $scope.loadPanel = {
        message: 'Please wait...',
        showIndicator: true,
        showPane: true,
        shading: true,
        closeOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        onShown: function () {

        },
        onHidden: function () {

        },
        bindingOptions: {
            visible: 'loadingVisible'
        }
    };
    
    ///////////////////////////////////
    $scope.filters = [];

    $scope.dg_columns = [

         //{ dataField: 'Id', caption: 'Id', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,  },
         { dataField: 'JobGroupParentTitle', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, },
         { dataField: 'JobGroupTitle', caption: 'Position', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false , width: 250},
         { dataField: 'FullName', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,  },
         { dataField: 'NID', caption: 'ID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120,  },
         { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120,  },
         { dataField: 'Summary', caption: 'Active Authorization Cards (Validity)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,   },
         
         
    ];

    $scope.dg_selected = null;
    $scope.dg_instance = null;
    $scope.dg_ds = null;
    $scope.authTypes = null;
    $scope.dg = {
        keyExpr: 'Id',
		
        masterDetail: {
            enabled: true,
            template: 'detail',
        },
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

        columnAutoWidth: true,
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
        onCellPrepared: function (cellInfo) {
            if (cellInfo.rowType == "data" && cellInfo.column.dataField === 'FromAirportIATA') {

                cellInfo.cellElement.css('background', 'palegreen');
            }
            if (cellInfo.rowType == "data" && cellInfo.column.dataField === 'ToAirportIATA') {

                cellInfo.cellElement.css('background', 'lightpink');
            }
            if (cellInfo.rowType == "data" && cellInfo.column.dataField === 'FlightH') {

                cellInfo.cellElement.css('background', 'papayawhip');
            }
            if (cellInfo.rowType == "data" && cellInfo.column.dataField === 'FlightM') {

                cellInfo.cellElement.css('background', 'papayawhip');
            }
            //papayawhip
        },
        bindingOptions: {
            dataSource: 'dg_ds'
        }
    };

    $scope.getDetailGridSettings = function (employee) {
        return {
            columnAutoWidth: true,
            showBorders: true,
            dataSource: employee.data.QAAuthCards,
            editing: {
                mode: 'row',
                allowAdding: true,
                allowUpdating: true,
                allowDeleting: true,
                useIcons: true,
              },
            columns:[{dataField: 'AuthCardNo', caption:'Card No', dataType:'string',validationRules: [{ type: 'required' }]},
            {dataField: 'AuthTypeId', caption:'Authorization Type', lookup:{dataSource: $scope.authTypes, displayExpr:'Title', valueExpr:'Id'}
            ,validationRules: [{ type: 'required' }]},
            {dataField: 'IssueDate', dataType: 'date',format:'dd-MMM-yyy', validationRules: [{ type: 'required' }],
			setCellValue: function(newData, value, currentRowData) {
				value.setUTCHours(0,0,0,0);
				value.addDays(1);
				newData.IssueDate = value.toISOString().slice(0, -1);
                }
			},
            {dataField: 'ExpireDate', dataType: 'date',format:'dd-MMM-yyy',validationRules: [{ type: 'required' }],
			setCellValue: function(newData, value, currentRowData) {
				value.setUTCHours(0,0,0,0);
				value.addDays(1);
				newData.ExpireDate = value.toISOString().slice(0, -1);
                }},
            {caption:'Active', dataField:'IsActive' ,dataType:'boolean'},
            {type: 'buttons', buttons:['edit', 'delete']}],
            
              
              onRowInserting(event) {
                
                $scope.authCardRequest = {AuthCardNo: event.data.AuthCardNo,
                    AuthTypeId: event.data.AuthTypeId,
                    IssueDate: event.data.IssueDate,
                    ExpireDate: event.data.ExpireDate,
                    IsActive: event.data.IsActive,
                    EmployeeId: employee.data.Id};

                $scope.loadingVisible = true;
        
                qaService.postAuthCard($scope.authCardRequest).then(function (response) {
                    General.ShowNotify(Config.Text_SavedOk, 'success');
                    
                    $scope.loadingVisible = false;
                    $scope.loadingVisible = true;
                    qaService.getAuthCardsOfEmp(employee.data.Id).then(function (response) {
                        $scope.loadingVisible = false;
                        employee.data.QAAuthCards = response;
                        $scope.dg_ds[employee.rowIndex-1].Summary = $scope.updateCardsSummary(employee.data.QAAuthCards);
                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

              },
              
              onRowUpdating(event) {
                for(const prop in event.newData) {
                    event.oldData[prop] = event.newData[prop];
                  }
                $scope.authCardRequest = {AuthCardNo: event.oldData.AuthCardNo,
                    AuthTypeId: event.oldData.AuthTypeId,
                    IssueDate: event.oldData.IssueDate,
                    ExpireDate: event.oldData.ExpireDate,
                    IsActive: event.oldData.IsActive,
                    EmployeeId: employee.data.Id};

                    $scope.loadingVisible = true;
        
                    qaService.putAuthCard(event.oldData.Id, $scope.authCardRequest).then(function (response) {
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.loadingVisible = false;
                        $scope.loadingVisible = true;
                        qaService.getAuthCardsOfEmp(employee.data.Id).then(function (response) {
                            $scope.loadingVisible = false;
                            employee.data.QAAuthCards = response;
                            $scope.dg_ds[employee.rowIndex-1].Summary = $scope.updateCardsSummary(employee.data.QAAuthCards);
                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
              },
              
              onRowRemoving(event) {
                $scope.loadingVisible = true;
                qaService.deleteAuthCard(event.data.Id).then(function (response) {
                    $scope.loadingVisible = false;
                    General.ShowNotify(Config.Text_SavedOk, 'success');
                    //$scope.doRefresh = true;
                    //$scope.bindDelays($scope.jgParents);
                    $scope.loadingVisible = true;
                    qaService.getAuthCardsOfEmp(event.data.EmployeeId).then(function (response) {
                        $scope.loadingVisible = false;
                        employee.data.QAAuthCards = response;
                        $scope.dg_ds[employee.rowIndex-1].Summary = $scope.updateCardsSummary(employee.data.QAAuthCards);
                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                }, function (err) { console.log(2); $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
              },
              
              
        
        };
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
   
    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
       
        $rootScope.page_title = '> Authorization Cards';
        $('.authcards').fadeIn();
    }
    //////////////////////////////////////////
    $scope.$on('getFilterResponse', function (event, prms) {

        $scope.filters = prms;

        $scope.doRefresh = true;
        $scope.bindRoutes();
    });
    $scope.$on('onTemplateSearch', function (event, prms) {

        $scope.$broadcast('getFilterQuery', null);
    });
    $scope.$on('onRouteSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onRouteHide', function (event, prms) {
        alert($scope.doRefresh);
        $scope.bindRoutes();

    });
    //////////////////////////////////////////
    $rootScope.$broadcast('AirportLoaded', null);
    ///end
}]);