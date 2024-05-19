'use strict';
app.controller('receiptController', ['$scope', '$location', 'mntService', 'authService', '$routeParams', '$rootScope', '$window', '$sce', function ($scope, $location, mntService, authService, $routeParams, $rootScope, $window, $sce) {


    $scope.btn_addNew = {
        text: 'Add And New',
        type: 'success',
        icon: '',
        width: 140,
        onClick: function (e) {
            alert("Refresh")

        }

    };

    $scope.btn_add = {
        text: 'Add',
        type: 'success',
        icon: '',
        width: '100%',
        onClick: function (e) {
            alert("Refresh")

        }

    };

    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'check',
        width: 130,
        onClick: function (e) {
            alert("Refresh")

        }

    };


    //////////////////////////

    $scope.awbButton = {
        icon: 'search',
        onClick: function () {
            $rootScope.$broadcast('InitAWBPopup', null);
        }

    };

    $scope.pnButton = {
        icon: 'search',
        onClick: function () {
            $rootScope.$broadcast('InitPNPopup', null);
        }

    };

    $scope.txt_awb = {
        
        bindingOptions: {
            value: 'test',
        },
       
    };


    $scope.txt_paperNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_paperRemark = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_descNo = {
        bindingOptions: {
            value: ''
        }
    }

   
    $scope.txt_poNo = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.ch_po = {
        defaultValue: false,
        bindingOptions: {
            value: ''
        }
    }

    $scope.ch_rmvRegister = {
        defaultValue: false,
        bindingOptions: {
            value: ''
        }
    }

    $scope.ch_rmvAssy = {
        defaultValue: false,
        bindingOptions: {
            value: ''
        }
    }

    $scope.ch_charge = {
        defaultValue: false,
        bindingOptions: {
            value: ''
        }
    }

    $scope.sb_stock = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }


    $scope.sb_poCompany = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }


    $scope.sb_rmvRegister = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }


    $scope.sb_rmvAssy = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    $scope.sb_itemPnNo = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    $scope.sb_itemQuantity = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    $scope.sb_itemUnit = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    $scope.sb_itemCondition = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }


    $scope.sb_itemCurrency = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }


    $scope.sb_itemDoc = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }

    $scope.sb_itemNo = {
        showClearButton: false,
        searchEnabled: false,
        displayExpr: "title",
        valueExpr: 'id',
        dataSource: $scope.priority,
        bindingOptions: {
            value: '',
        }
    }


    $scope.dt_paperDate = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
        }
    }

    $scope.dt_poDate = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
        }
    }

    $scope.dt_invoice = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
        }
    }

    $scope.dt_itemDate = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
        }
    }

    $scope.dt_itemExp = {
        type: 'date',
        displayFormat: "yyyy-MMM-dd",
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_awb = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_itemPrice = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_itemId = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_invoice = {
        bindingOptions: {
            value: ''
        }
    }

   
    $scope.txt_itemDesc = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_itemSnbn = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.txt_itemShelf = {
        bindingOptions: {
            value: ''
        }
    }

    $scope.itemRemark = {
        bindingOptions: {
            value: ''
        }
    }

    ////////////////////////

    $scope.dg_rec_columns = [


        {
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, name: 'row', caption: '#', width: 50, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        },
        { dataField: '', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: '', caption: 'ATA', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 100 },
        { dataField: '', caption: 'Description', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Part Number', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'SN /BN', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Quantity', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Unit', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Shelf', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Condition', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Man.Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: '', caption: 'Exp. Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
    ];



    $scope.dg_rec_selected = null;
    $scope.dg_rec_instance = null;
    $scope.dg_rec = {



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
        height: $(window).height() - 350,
        columns: $scope.dg_rec_columns,
        onContentReady: function (e) {
            if (!$scope.dg_rec_instance)
                $scope.dg_rec_instance = e.component;

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

            $scope.dg_rec_id.Id = e.selectedRowsData[0].Id;

            console.log($scope.dg_rec_id.id);
            if (!data) {
                $scope.dg_rec_selected = null;
            }
            else
                $scope.dg_rec_selected = data;


        },

        bindingOptions: {
            dataSource: 'dg_rec_ds'
        },
        columnChooser: {
            enabled: false
        },

    };




}]);


