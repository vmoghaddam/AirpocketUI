'use strict';
app.controller('personController', ['$scope', '$location', '$routeParams', '$rootScope', 'personService', 'authService', 'notificationService','flightService', '$route','$window','$timeout', function ($scope, $location, $routeParams, $rootScope, personService, authService, notificationService,flightService, $route,$window,$timeout) {
    $scope.prms = $routeParams.prms;
    $scope.IsEditable = $rootScope.IsProfileEditable(); //$rootScope.roles.indexOf('Admin') != -1;
    $scope.editButtonIcon = 'edit';
    $scope.editButtonText = 'Edit';
    $scope.isCrew = $route.current.isCrew;
    if (!$scope.IsEditable) {
        $scope.editButtonText = 'View';
        $scope.editButtonIcon = 'card';
    }
    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.filterVisible = false;
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,
        bindingOptions: {
            visible: 'IsEditable'
        },
        onClick: function (e) {
           
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { PersonId: $scope.dg_selected.PersonId, };
                    $scope.loadingVisible = true;
                    personService.delete(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.doRefresh = true;
                        $scope.bind();



                    }, function (err) {  $scope.loadingVisible = false; General.ShowNotify2(err.message, 'error',5000); });

                }
            });
        }
    };
    $scope.btn_view = {
        text: 'View',
        type: 'default',
        icon: 'card',
        width: 120,
        visible:false,
        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $rootScope.$broadcast('InitViewPerson', data);
        }

    };
    $scope.btn_new = {
        text: 'New',
        type: 'default',
        icon: 'plus',
        width: 120,
        onClick: function (e) {

            var data = { Id: null };

            $rootScope.$broadcast('InitAddPerson', data);
        },
        bindingOptions: {
            visible:'IsEditable'
        }

    };
   
    $scope.btn_edit = {
       // text: 'Edit',
        type: 'default',
       // icon: 'edit',
        width: 120,
        bindingOptions:{
            icon: 'editButtonIcon',
            text:'editButtonText',
        },
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $rootScope.$broadcast('InitAddPerson', data);
        }

    };
	$scope.btn_opc = {
        text: 'OPC Card',
        type: 'default',
        //icon: 'plus',
        width: 140,
        onClick: function (e) {
			  $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $window.open('https://fleet.caspianairlines.com/reportopc/frmReportView.aspx?type=opc&nid='+data.NID, '_blank');
        },
        bindingOptions: {

        }

    };
    //$scope.btn_view = {
    //    text: 'View',
    //    type: 'default',
    //    icon: 'doc',
    //    width: 120,
    //    onClick: function (e) {
    //        $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
    //        if (!$scope.dg_selected) {
    //            General.ShowNotify(Config.Text_NoRowSelected, 'error');
    //            return;
    //        }
    //        var data = $scope.dg_selected;
    //        $scope.InitAddAirport(data);
    //    }

    //};
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,

        bindingOptions: {},
        onClick: function (e) {

            $scope.$broadcast('getFilterQuery', null);
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
        //{
        //    cellTemplate: function (container, options) {
        //        $("<div style='text-align:center'/>")
        //            .html(options.rowIndex + 1)
        //            .appendTo(container);
        //    }, caption: '#', width: 60, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader'
        //},
        {
            dataField: "ImageUrl",
            width: 80,
            alignment: 'center',
            caption: '',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                $("<div>")
                    .append($("<img>", { "src": $rootScope.clientsFilesUrl + (options.value ? options.value : 'imguser.png'), "css": { height: '50px',width:'50px', borderRadius: '100%' } }))
                    .appendTo(container);
            }
        },
        {
            caption: 'Base',
            columns: [
               // { dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,width:150 },
                //{
                //    dataField: "ImageUrl",
                //    width: 100,
                //    allowFiltering: false,
                //    allowSorting: false,
                //    cellTemplate: function (container, options) {
                //        $("<div>")
                //            .append($("<img>", { "src": (options.value ? $rootScope.clientsFilesUrl + options.value:'../../content/images/imguser.png') }))
                //            .css('width','50px')
                //            .appendTo(container);
                //    }
                //},
                { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 250 },
                 { dataField: 'ScheduleName', caption: 'Schedule', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: 'NID', caption: 'National Code', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
                { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
                { dataField: 'Email', caption: 'Email', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
                { dataField: 'DateJoinAvation', caption: 'Join Aviation', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
                { dataField: 'Age', caption: 'Age', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 50 },
            ]
        },
        {
            caption: 'Organizational',
            columns: [
                { dataField: 'PID', caption: 'Personnel Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
                { dataField: 'Location', caption: 'Department', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
                { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 130 },
                { dataField: 'DateJoinCompany', caption: 'Join Company', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },

            ]
        },
        {
            caption: 'Passport',
            columns: [
               // { dataField: 'PassportNumber', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
               // { dataField: 'DatePassportIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
               // { dataField: 'DatePassportExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
                 { dataField: 'RemainPassport', caption: 'Remain', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
                //{ dataField: 'IsPassportExpired', caption: 'Expired', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 80 },
            ]
        },
        {
            caption: 'Medical Checkup',
            columns: [
               
               // { dataField: 'DateLastCheckUP', caption: 'Last', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 150 },
               // { dataField: 'DateNextCheckUP', caption: 'Next', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 150 },
                { dataField: 'RemainMedical', caption: 'Remain', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
               // { dataField: 'IsMedicalExpired', caption: 'Expired', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 80 },
            ]
        },
        {
            caption: 'CAO',
            columns: [
               // { dataField: 'CaoCardNumber', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
                 
              //  { dataField: 'DateCaoCardIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
               // { dataField: 'DateCaoCardExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
                { dataField: 'RemainCAO', caption: 'Remain', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
               // { dataField: 'IsCAOExpired', caption: 'Expired', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 80 },

            ]
        }
        ,
        {
            caption: 'NDT',
            columns: [
               // { dataField: 'NDTNumber', caption: 'No.', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },

               // { dataField: 'DateIssueNDT', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
                //{ dataField: 'DateExpireNDT', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
                { dataField: 'RemainNDT', caption: 'Remain', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
               // { dataField: 'IsNDTExpired', caption: 'Expired', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 80 },

            ]
        }
        //{ dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },
        //{ dataField: 'IATA', caption: 'IATA', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        //{ dataField: 'ICAO', caption: 'ICAO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        //{ dataField: 'City', caption: 'City', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        //{ dataField: 'SortName', caption: 'Sort Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        //{ dataField: 'Country', caption: 'Country', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
    ];

    $scope.rankDs = ['TRI', 'TRE', 'LTC', 'P1', 'P2', 'ISCCM', 'SCCM', 'CCM'];
    $scope.groupDs = ['Cockpit', 'Cabin' ];
    $scope.dg_columns2 = [
       
       //{
       //    dataField: "ImageUrl",
       //    width: 60,
       //    alignment: 'center',
       //    caption: '',
       //    allowFiltering: false,
       //    allowSorting: false,
       //    cellTemplate: function (container, options) {
       //        $("<div>")
       //            .append($("<img>", { "src": $rootScope.clientsFilesUrl + (options.value ? options.value : 'imguser.png'), "css": { height: '40px', width: '40px', borderRadius: '100%' } }))
       //            .appendTo(container);
       //    }
       //},
        { dataField: 'InActive', caption: 'InActive', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: true, width: 70, fixed: true, fixedPosition: 'left' },
        {
            dataField: 'JobGroupRoot', caption: 'Group', allowResizing: true
                     , lookup: {

                         dataSource: $scope.groupDs

                     } 
            , alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left'
        },
        {
            dataField: 'JobGroup', caption: 'Rank', allowResizing: true
                     ,    lookup: {

                             dataSource:$scope.rankDs

                         }
            , alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'left'
        },
       { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 350, fixed: true, fixedPosition: 'left' },
                { dataField: 'ScheduleName', caption: 'Schedule', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },

               { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'RemainMedical', caption: 'Medical', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
         { dataField: 'RemainPassport', caption: 'Passport', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },

          { dataField: 'RemainLicence', caption: 'Licence', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
           { dataField: 'RemainProficiency', caption: 'LPC', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
            { dataField: 'RemainProficiencyOPC', caption: 'OPC', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
             { dataField: 'RemainLPR', caption: 'LPR', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },

             { dataField: 'RemainAvSec', caption: 'AvSec', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
              { dataField: 'RemainSMS', caption: 'SMS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },

//               { dataField: 'RemainSEPT', caption: 'SEPT', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
 //7-12
        { dataField: 'RemainSEPTP', caption: 'SEPT-P', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
        { dataField: 'RemainSEPT', caption: 'SEPT-T', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },

              
			  { dataField: 'RemainDG', caption: 'DG', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
                { dataField: 'RemainCRM', caption: 'CRM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
                { dataField: 'RemainCCRM', caption: 'CCRM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
                { dataField: 'RemainFirstAid', caption: 'FirstAid', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90,visible:false },
				 { dataField: 'RemainFirstAid', caption: 'FirstAid', name: 'FirstAid', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, visible:false },
        
        { dataField: 'RemainRecurrent', caption: 'Recurrent',name:'Recurrent', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
        { dataField: 'RemainCMC', caption: 'CMC', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
        
         { dataField: 'RemainHotWeather', caption: 'HOT-WX', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
		  { dataField: 'RemainColdWeather', caption: 'COLD-WX', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
		     { dataField: 'RemainNDT', caption: 'FMT', name: 'FMT', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100 },
		   { dataField: 'RemainCAO', caption: 'GRT', name: 'GRT', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,  },
		   
		   { dataField: 'RemainLine', caption: 'Line',name:'Line', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100 },
		   
		   { dataField: 'RemainLine', caption: 'Line 737',name:'Line737', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		   { dataField: 'RemainCAO', caption: 'Line MD',name:'LineMD', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		   
		   
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
        sorting: {
            mode: "multiple"
        },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 135,

        columns: $scope.dg_columns2,
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
        "export": {
            enabled: true,
            fileName: "CrewList",
            allowExportSelectedData: true
        },
        onCellPrepared: function (e) {
            
            if (e.rowType === "data" && e.column.dataField == "RemainMedical") {
                $scope.styleCell(e, e.data.RemainMedical);
            }
            if (e.rowType === "data" && e.column.dataField == "RemainPassport") {
                $scope.styleCell(e, e.data.RemainPassport);
            }
            if (e.rowType === "data" && e.column.dataField == "RemainLicence") {
                $scope.styleCell(e, e.data.RemainLicence);
            }
            if (e.rowType === "data" && e.column.dataField == "RemainProficiency") {
                $scope.styleCell(e, e.data.RemainProficiency);
            }
            if (e.rowType === "data" && e.column.dataField == "RemainProficiencyOPC") {
                $scope.styleCell(e, e.data.RemainProficiencyOPC);
            }
            if (e.rowType === "data" && e.column.dataField == "RemainLPR") {
                $scope.styleCell(e, e.data.RemainLPR);
            }
            if (e.rowType === "data" && e.column.dataField == "RemainAvSec") {
                $scope.styleCell(e, e.data.RemainAvSec);
            }
            if (e.rowType === "data" && e.column.dataField == "RemainSMS") {
                $scope.styleCell(e, e.data.RemainSMS);
            }

            if (e.rowType === "data" && e.column.dataField == "RemainCRM") {
                $scope.styleCell(e, e.data.RemainCRM);
            }
            if (e.rowType === "data" && e.column.dataField == "RemainCCRM") {
                $scope.styleCell(e, e.data.RemainCCRM);
            }
            if (e.rowType === "data" && e.column.dataField == "RemainSEPT") {
                $scope.styleCell(e, e.data.RemainSEPT);
            }
			  if (e.rowType === "data" && e.column.dataField == "RemainSEPTP") {
                $scope.styleCell(e, e.data.RemainSEPTP);
            }
            if (e.rowType === "data" && e.column.dataField == "RemainDG") {
                $scope.styleCell(e, e.data.RemainDG);
            }
            if (e.rowType === "data" && e.column.dataField == "RemainFirstAid") {
                $scope.styleCell(e, e.data.RemainFirstAid);
            }
			  if (e.rowType === "data" && e.column.dataField == "RemainRecurrent") {
                $scope.styleCell(e, e.data.RemainRecurrent);
            }
			
			 if (e.rowType === "data" && e.column.dataField == "RemainColdWeather") {
                $scope.styleCell(e, e.data.RemainColdWeather);
            }
			 if (e.rowType === "data" && e.column.dataField == "RemainHotWeather") {
                $scope.styleCell(e, e.data.RemainHotWeather);
            }
			 if (e.rowType === "data" && e.column.dataField == "RemainCAO") {
                $scope.styleCell(e, e.data.RemainCAO);
            }
			 if (e.rowType === "data" && e.column.dataField == "RemainNDT") {
                $scope.styleCell(e, e.data.RemainNDT);
            }

            if (e.rowType === 'data'
                && ((e.column.dataField == "RemainMedical")
                 || (e.column.dataField == "RemainPassport")
                  || (e.column.dataField == "RemainLicence")
                 || (e.column.dataField == "RemainProficiency")
                 || (e.column.dataField == "RemainProficiencyOPC")
                || (e.column.dataField == "RemainLPR")
				  || (e.column.dataField == "RemainColdWeather")
				    || (e.column.dataField == "RemainHotWeather")
                || (e.column.dataField == "RemainAvSec")
                || (e.column.dataField == "RemainSMS")

                || (e.column.dataField == "RemainCRM")
                || (e.column.dataField == "RemainCCRM")
                || (e.column.dataField == "RemainSEPT")
				 || (e.column.dataField == "RemainSEPTP")
                || (e.column.dataField == "RemainDG")
                || (e.column.dataField == "RemainFirstAid")
				|| (e.column.dataField == "RemainLine")
                || (e.column.dataField == "RemainRecurrent")
				|| (e.column.dataField == "RemainCMC")
				|| (e.column.dataField == "RemainNDT")
				|| (e.column.dataField == "RemainCAO")
                )
                && ((!e.value && e.value!=0) || e.value == '-100000')) {
                 
                e.cellElement.html('?');
            }

            if (e.rowType === 'data' && e.value == '1000000')
            {
                e.cellElement.html('N/A');
            }
               
        },
        onCellClick:function(e){
            if (e.column.dataField=='InActive')
            {
                var newvalue = !e.value;
                e.data.InActive = newvalue;
                personService.active({Id:e.data.Id}).then(function (response) {
                     
                    $scope.dg_instance.refresh(true);

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
               
            }
        },
        editing: {
            allowUpdating: false,
            mode: 'cell'
        },
        bindingOptions: {
            dataSource: 'dg_ds'
        }
    };

    $scope.styleCell = function (e, value) {
        if (value && value == 1000000) {
            //#a6a6a6

            return;
        }
        if (value>45)
            return;
        
        if ((!value && value!==0) || value == -100000) {
            //#a6a6a6
            e.cellElement.css("backgroundColor", "#a6a6a6");
            e.cellElement.css("color", "#fff");
            return;
        }
        if (value>30 && value<=45){
            e.cellElement.css("backgroundColor", "#ffd633");
            e.cellElement.css("color", "#000");
        }
        else if (value > 0 && value <= 30) {
            e.cellElement.css("backgroundColor", "#ffa64d");
            e.cellElement.css("color", "#000");
        }
        else if (value <= 0) {
            e.cellElement.css("backgroundColor", "#ff471a");
            e.cellElement.css("color", "#fff");
        }
        //e.cellElement.css("backgroundColor", "#ffcccc");
    }
    $scope.doRefresh = false;
    $scope.showActive = false;
    $scope.rankGroup='Cockpit';
    $scope.sb_rankgroup = {
        width:150,
        showClearButton: false,
        searchEnabled: false,
        dataSource: ['Cockpit','Cabin','All'],
        //readOnly:true,
        onValueChanged: function (e) {
			if (e.value == 'Cockpit') {
                $scope.dg_instance.columnOption('FirstAid', 'visible', false);
				  $scope.dg_instance.columnOption('CRM', 'visible', true);
				      $scope.dg_instance.columnOption('SEPT-T', 'visible', true);
                $scope.dg_instance.columnOption('LPC', 'visible', true);
                $scope.dg_instance.columnOption('OPC', 'visible', true);
                $scope.dg_instance.columnOption('Licence', 'visible', true);
                $scope.dg_instance.columnOption('LPR', 'visible', true);
				$scope.dg_instance.columnOption('Recurrent', 'visible', false);
				$scope.dg_instance.columnOption('Line', 'visible', true);
				
				 $scope.dg_instance.columnOption('HOT-WX', 'visible', true);
				  $scope.dg_instance.columnOption('COLD-WX', 'visible', true);
				   $scope.dg_instance.columnOption('GRT', 'visible', true);
				   $scope.dg_instance.columnOption('Line737', 'visible', false);
				   $scope.dg_instance.columnOption('LineMD', 'visible', false);
            }
            //if (e.value == 'Cabin')
        else
            {
				 $scope.dg_instance.columnOption('GRT', 'visible', false);
                $scope.dg_instance.columnOption('FirstAid', 'visible', false);
				   $scope.dg_instance.columnOption('CRM', 'visible', false);
				      $scope.dg_instance.columnOption('SEPT-T', 'visible', false);
                $scope.dg_instance.columnOption('LPC', 'visible', false);
                $scope.dg_instance.columnOption('OPC', 'visible', false);
                $scope.dg_instance.columnOption('Licence', 'visible', false);
                $scope.dg_instance.columnOption('LPR', 'visible', false);
				 $scope.dg_instance.columnOption('HOT-WX', 'visible', false);
				  $scope.dg_instance.columnOption('COLD-WX', 'visible', false);
				$scope.dg_instance.columnOption('Recurrent', 'visible', true);
				$scope.dg_instance.columnOption('Line', 'visible', false);
				
				 $scope.dg_instance.columnOption('Line737', 'visible', true);
				   $scope.dg_instance.columnOption('LineMD', 'visible', true);
            }
            $scope.$broadcast('getFilterQuery', null);
        },
        bindingOptions: {
            value: 'rankGroup',
            
        }
    };
    $scope.chk_active = {
        text: 'Only Active Employees',
        onValueChanged:function(e){
            $scope.$broadcast('getFilterQuery', null);
        },
        bindingOptions: {
            value: 'showActive',
             
        }
    };
	/////////////////////////////////////////////
	$scope.btn_training = {
        text: 'Training',
        type: 'default',
        //icon: 'plus',
        width: 140,
        onClick: function (e) {
            $window.open('#!/training/', '_blank');
        },
        bindingOptions: {

        }

    };
	 $scope.btn_sms = {
        text: 'Notify',
        type: 'default',
        //icon: 'plus',
        width: 120,
        onClick: function (e) {
            //var selected = $rootScope.getSelectedRows($scope.dg_instance);
            //if (!selected) {
            //    General.ShowNotify(Config.Text_NoRowSelected, 'error');
            //    return;
            //}
           
            //$scope.popup_sms_visible = true;
            $scope.popup_notify2_visible = true;
        },
        bindingOptions: {
           
        }

    };
    $scope.txt_sms_message = {
        height: 300,
        bindingOptions: {
            value: 'sms_message',

        }
    };
    $scope.popup_sms_visible = false;
    $scope.popup_sms_title = 'Notification';
    $scope.popup_sms = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_sms"
        },
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 450,
        width: 600,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Send', validationGroup: "smsmessageperson", onClick: function (arg) {

                        var result = arg.validationGroup.validate();

                        if (!result.isValid ) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var selected = $rootScope.getSelectedRows($scope.dg_instance);

                        var names = Enumerable.From(selected).Select('$.Name').ToArray().join('_');
                        var mobiles = Enumerable.From(selected).Select('$.Mobile').ToArray().join('_');
                        var dto = { names: names, mobiles: mobiles, message: $scope.sms_message, sender: $rootScope.userName };
                        $scope.loadingVisible = true;

                        flightService.sendSMS(dto).then(function (response) {
                            $scope.loadingVisible = false;
                            General.ShowNotify(Config.Text_SavedOk, 'success');
                            $scope.popup_sms_visible = false;

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_sms_visible = false;

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
             
        },
        onHiding: function () {
           
            $scope.popup_sms_visible = false;

        },
        bindingOptions: {
            visible: 'popup_sms_visible',

            title: 'popup_sms_title',

        }
    };

	/////////////////////////////////////////////////
    $scope.getFilters = function () {
        var filters = $scope.filters;
        if (filters.length == 0)
            filters = [['Id', '>', 0]];
        else {
            //filters.push('and');
            //filters.push(['OfficeCode', 'startswith', $scope.ParentLocation.FullCode]);

        }
        if ($scope.showActive)
            filters.push(['InActive', '=', false]);
        if ($scope.rankGroup!='All')
            filters.push(['JobGroupRoot', '=', $scope.rankGroup]);

        return filters;
    };
    $scope.bind = function () {
        
        if (!$scope.dg_ds) {
            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + 'odata/employees/light/' + ($scope.isCrew?'crew/':'') + Config.CustomerId,
                    key: "Id",
                     version: 4,
                    onLoaded: function (e) {
                        // $scope.loadingVisible = false;
                        //filter
                        $rootScope.$broadcast('OnDataLoaded', null);
                    },
                    beforeSend: function (e) {

                        $scope.dsUrl = General.getDsUrl(e);

                        // $scope.$apply(function () {
                        //    $scope.loadingVisible = true;
                        // });
                        $rootScope.$broadcast('OnDataLoading', null);
                    },
                },
                // filter: [['InActive', '=', false]],
                // sort: ['DatePay', 'Amount'],

            };
        }

        if ($scope.doRefresh) {
            $scope.filters = $scope.getFilters();
            $scope.dg_ds.filter = $scope.filters;
            $scope.dg_instance.refresh();
            $scope.doRefresh = false;
        }

    };
    ///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> People';
        $('.person').fadeIn();
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
    $scope.$on('onPersonSaved', function (event, prms) {

        $scope.doRefresh = true;
    });
    $scope.$on('onPersonHide', function (event, prms) {

        $scope.bind();

    });
	 ////9-14
    ////////////////////////////
    $scope.freeSMS = true;

    $scope.selectedNotificationTypeId2 = -1;
    $scope.buildMessage = function () {
        if ($scope.Notify2.TypeId == -1)
            $scope.Notify2.Message = "";

        switch ($scope.Notify2.TypeId) {
            //cancel
            case 10014:

                $scope.Notify2.Message = "Dear #Crew,\n" + "The flight " + $scope.flight.FlightNumber + " " + $scope.flight.FromAirportIATA + "-" + $scope.flight.ToAirportIATA + " is canceled.\n" + $rootScope.userName;
                break;
            //delay
            case 10015:

                $scope.Notify2.Message = "Dear #Crew,\n" + "The flight " + $scope.flight.FlightNumber + " " + $scope.flight.FromAirportIATA + "-" + $scope.flight.ToAirportIATA + " is delayed.\n"
                    + "New Dep:" + $scope.momenttime($scope.flightOffBlock2) + "\n" + $rootScope.userName;
                break;
            case 10016:

                $scope.Notify2.Message = "Dear #Crew,\n";
                break;
            case 10020:

                $scope.Notify2.Message = "Dear #Crew,\n";
                break;

            default: break;

        }
    };
    $scope.sb_notification2 = {
        dataSource: $scope.dsNotificationType2,
        showClearButton: false,
        searchEnabled: false,

        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        onValueChanged: function (e) {
            $scope.buildMessage();
        },
        bindingOptions: {
            value: 'Notify2.TypeId',
            disabled: 'freeSMS',

        },


    };
    $scope.dsNotificationType2 = [
        { Id: 10014, Title: 'Cancelling Notification' },
        { Id: 10015, Title: 'Delay Notification' },
        { Id: 10016, Title: 'Operation Notification' },
        { Id: 10020, Title: 'Training Notification' },

    ];
    $scope.Notify2 = {
        ModuleId: 3,
        TypeId: -1,

        SMS: true,
        Email: true,
        App: true,
        Message: null,
        CustomerId: Config.CustomerId,
        SenderId: null,
        Employees: [],
        Names: [],
        Dates: [],
        FDPs: [],
        Names2: [],
        Mobiles2: [],
        Messages2: [],
    };
    $scope.txt_MessageNotify2 = {
        hoverStateEnabled: false,
        height: 120,

        bindingOptions: {
            value: 'Notify2.Message',
            disabled: 'Notify2.TypeId!=10020'

        }
    };
     
    $scope.dg_emp3_columns = [

        { dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, },
        
        // { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 250 },
        { dataField: 'LastName', caption: 'Last Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150, sortIndex: 0, sortOrder:'asc' }, 
        { dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, },


    ];
    $scope.dg_history_columns = [

        //{ dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 250 },
        //  { dataField: 'Mobile', caption: 'Monile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },


        { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 140 },
        //{ dataField: 'TypeStr', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Message', caption: 'Message', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,   },
         
        //{ dataField: 'RefId', caption: 'Ref', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        { dataField: 'DateSent', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 140, /*format: 'EEE MM-dd'*/ format: 'yy-MM-dd HH:mm', sortIndex: 0, sortOrder: "desc" },
        { dataField: 'Sender', caption: 'Sender', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },

    ];

     


    $scope.dg_emp3_selected = null;
    $scope.selectedEmps3 = null;
    $scope.dg_emp3_instance = null;
    $scope.dg_emp3_ds = null;
    $scope.dg_emp3 = {
        headerFilter: {
            visible: false
        },
        editing: {
            mode: "cell",
            allowUpdating: true
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
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: 430,

        columns: $scope.dg_emp3_columns,
        onContentReady: function (e) {
            if (!$scope.dg_emp3_instance)
                $scope.dg_emp3_instance = e.component;

        },
        onRowPrepared: function (e) {



        },
        keyExpr: 'Id',
        onSelectionChanged: function (e) {


        },


        bindingOptions: {
            dataSource: 'dg_emp3_ds',
            selectedRowKeys: 'selectedEmps3',
        }
    };

    $scope.dg_history_instance = null;
    $scope.dg_history_ds = null;
    $scope.dg_history = {
        headerFilter: {
            visible: false
        },
        editing: {
            mode: "cell",
            allowUpdating: true
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
        height: 603,

        columns: $scope.dg_history_columns,
        onContentReady: function (e) {
            if (!$scope.dg_history_instance)
                $scope.dg_history_instance = e.component;

        },
        onRowPrepared: function (e) {



        },
        keyExpr: 'Id',
        onSelectionChanged: function (e) {


        },


        bindingOptions: {
            dataSource: 'dg_history_ds',
            //selectedRowKeys: 'selectedEmps2',
        }
    };

    $scope.countDownVisible2 = false;
    $scope.counter2 = 30;
    var stopped2;
    $scope.countdown2 = function () {
        $scope.countDownVisible2 = true;
        stopped2 = $timeout(function () {

            $scope.counter2--;
            if ($scope.counter2 > 0)
                $scope.countdown2();
            else {
                $scope.stop2();
                $scope.refreshSMSStatus2();
            }
        }, 1000);
    };

    $scope.start22 = function () {
        $scope.counter2 = 30;
        $scope.countDownVisible2 = true;
        $scope.countdown2();
    }

    $scope.stop2 = function () {
        $timeout.cancel(stopped2);
        $scope.countDownVisible2 = false;
        $scope.counter2 = 30;

    };
    $scope.refreshSMSStatus2 = function () {
        $scope.stop2();
        var ids = Enumerable.From($scope.dg_history_ds).Where('$.RefId').Select('$.RefId').ToArray();
        if (!ids || ids.length == 0)
            return;
        //goh
        var dto = { Ids: ids };
        $scope.loadingVisible = true;
        flightService.updateSMSStatus(dto).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                var rec = Enumerable.From($scope.dg_history_ds).Where('$.RefId==' + _d.RefId).FirstOrDefault();
                rec.RefId = _d.RefId;
                rec.Status = _d.Status;

            });



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.msgrec = null;
    $scope.text_msgrec = {
        placeholder: 'Receiver',
        bindingOptions: {
            value: 'msgrec'
        }
    }

    $scope.msgno = null;
    $scope.text_msgno = {
        placeholder: 'Mobile',
        bindingOptions: {
            value: 'msgno'
        }
    }


    $scope.popup_notify2_visible = false;
    $scope.popup_notify2_title = 'Notify Crew';
    $scope.popup_notify2 = {

        fullScreen: false,
        showTitle: true,
        height: 730,
        width: $(window).width()-100,
        toolbarItems: [  
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Refresh Status', icon: 'refresh', onClick: function (e) {
                        $scope.refreshSMSStatus2();
                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Send', icon: 'check', validationGroup: 'notmessage2', onClick: function (e) {
                        ////////////////

 
                          

                            if ($scope.msgrec && $scope.msgno) {
                                $scope.Notify2.Names2.push($scope.msgrec);
                                $scope.Notify2.Mobiles2.push($scope.msgno);

                            }


                            var result = e.validationGroup.validate();
                            if (!result.isValid) {
                                General.ShowNotify(Config.Text_FillRequired, 'error');
                                return;
                            }

                            if ((!$scope.selectedEmps3 || $scope.selectedEmps3.length == 0) && ($scope.Notify2.Names2 == null || $scope.Notify2.Names2.length == 0)) {
                                General.ShowNotify("Please select flight crews.", 'error');
                                return;
                            }
                            var recs = $scope.selectedEmps3 ? Enumerable.From($scope.dg_emp3_ds).Where(function (x) { return $scope.selectedEmps3.indexOf(x.Id) != -1; }).OrderBy('$.Name').ToArray() : null;
                            if ((!recs || recs.length == 0) && ($scope.Notify2.Names2 == null || $scope.Notify2.Names2.length == 0)) {
                                General.ShowNotify("Please select flight crews.", 'error');
                                return;
                            }
                             
                            $scope.Notify2.ObjectId = -1;
                            $scope.Notify2.FlightId = null;

                            $scope.Notify2.Message = $scope.Notify2.Message;
                            // if ($scope.msgrec && $scope.msgno) {
                            //     $scope.Notify2.Messages2.push($scope.Notify2.Message);
                            // }
                            var temp = Enumerable.From(recs).Select('{EmployeeId:$.Id,Name:$.Name, FDPItemId:$.FDPItemId}').ToArray();

                            $.each(temp, function (_i, _d) {
                                $scope.Notify2.Employees.push(_d.EmployeeId);
                                $scope.Notify2.Names.push(_d.Name);
                                 

                            });

                            $scope.Notify2.SenderName = $rootScope.userName;
                            $scope.loadingVisible = true;
                            notificationService.notifyFlight($scope.Notify2).then(function (response) {



                                General.ShowNotify(Config.Text_SavedOk, 'success');


                                $scope.Notify2.Employees = [];
                                $scope.Notify2.Dates = [];
                                $scope.Notify2.Names = [];
                                $scope.Notify2.FDPs = [];
                                ///7-20//////////////
                                $scope.Notify2.Names2 = [],
                                    $scope.Notify2.Mobiles2 = [],
                                    $scope.Notify2.Messages2 = [];
                                //////////////////////
                                $scope.Notify2.Message = null;
                                if (!$scope.freeSMS)
                                    $scope.Notify2.TypeId = -1;

                                $scope.loadingVisible = true;
                                notificationService.getSMSHistoryTraining().then(function (response) {

                                    $scope.loadingVisible = false;
                                    $scope.dg_history_ds = response;

                                    $scope.start22();

                                }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });


                                // $scope.popup_notify_visible = false;




                            }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });


                         


                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_notify2_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {



        },
        onShown: function (e) {
            
            $scope.dg_history_instance.refresh(); 
            $scope.loadingVisible = true;
           
            $scope.Notify2.TypeId = 10020;
            $scope.buildMessage();
                if (!$scope.dg_emp3_ds) {
                    //Config.CustomerId
                    flightService.getDispatchSmsEmployees(Config.CustomerId).then(function (response) {

                        $scope.dg_emp3_ds = response;

                    }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });
                }

            notificationService.getSMSHistoryTraining().then(function (response) {

                    $scope.loadingVisible = false;
                    $scope.dg_history_ds = response;



                }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });

            


            //  $scope.selectedNotificationTypeId2 = 10016;



        },
        onHiding: function () {
             
            $scope.stop2();
             
            if ($scope.dg_emp3_instance)
                $scope.dg_emp3_instance.clearSelection();
            if (!$scope.freeSMS)
                $scope.selectedNotificationTypeId2 = -1;
            $scope.Notify2 = {
                ModuleId: $rootScope.moduleId,
                TypeId: -1,

                SMS: true,
                Email: true,
                App: true,
                Message: null,
                CustomerId: Config.CustomerId,
                SenderId: null,
                Employees: [],
                Dates: [],
                Names: [],
                FDPs: [],
                Names2: [],
                Mobiles2: [],
                Messages2: [],
            };
            $scope.popup_notify2_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        //position: 'right',
        bindingOptions: {
            visible: 'popup_notify2_visible',

            title: 'popup_notify2_title',

        }
    };
    //////////////////////////////////////
    //////////////////////////////////////////
    $scope.$on('$viewContentLoaded', function () {
       
        setTimeout(function () {
            $scope.showActive = true;
            //$scope.$broadcast('getFilterQuery', null);
        },  500);
    });
    $rootScope.$broadcast('PersonLoaded', null);
    ///end
}]);