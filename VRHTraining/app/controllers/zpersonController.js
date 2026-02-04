'use strict';
app.controller('zpersonController', ['$scope', '$location', '$routeParams', '$rootScope', 'zpersonService', 'authService', 'notificationService', 'flightService', '$route', 'ztrnService', '$window', '$timeout', function ($scope, $location, $routeParams, $rootScope, personService, authService, notificationService, flightService, $route, trnService, $window, $timeout) {
    $scope.prms = $routeParams.prms;
    $scope.isManager = $rootScope.HasDepartmentManager();
    $scope.is_export_enabled = !$scope.isManager;
    $scope.IsEditable = $rootScope.IsProfileEditable(); //$rootScope.roles.indexOf('Admin') != -1;
    $scope.IsNewVisible = $scope.IsEditable || $rootScope.HasHR();//$rootScope.roles.indexOf('Profiles-Ground-Edit')!=-1 || $rootScope.roles.indexOf('Profiles-Crew-Edit')!=-1;
    $scope.IsCoursesVisible = $rootScope.roles.indexOf('Admin') != -1 || $rootScope.userName.toLowerCase() == 'abbaspour' || $rootScope.userName.toLowerCase() == 'dehghan';
    $scope.IsAccountEdit = $rootScope.roles.indexOf('Crew Scheduler') != -1;
    $scope.editButtonIcon = 'edit';
    $scope.editButtonText = 'Edit';
    $scope.isCrew = $route.current.isCrew;
    if (!$scope.IsEditable) {
        $scope.editButtonText = 'View';
        $scope.editButtonIcon = 'card';
    }
    $scope.changeBtnContentAt = 1024;
    //$scope.windowWidth = screen.width;
    //$(window).resize(function() {
    //	$scope.windowWidth = screen.width;
    //})
    //////////////////////////////////
    $scope.dsUrl = null;
    $scope.filterVisible = false;
    $scope.btn_delete = {
        text: screen.width > $scope.changeBtnContentAt ? 'Delete' : '',
        type: 'danger',
        icon: screen.width > $scope.changeBtnContentAt ? '' : 'clear',
        width: screen.width > $scope.changeBtnContentAt ? 100 : 36,

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



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify2(err.message, 'error', 5000); });

                }
            });
        }
    };
    $scope.btn_view = {
        text: screen.width > $scope.changeBtnContentAt ? 'View' : '',
        type: 'default',
        icon: screen.width > $scope.changeBtnContentAt ? '' : 'card',
        width: screen.width > $scope.changeBtnContentAt ? 100 : 36,

        visible: false,
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
        text: screen.width > $scope.changeBtnContentAt ? 'New' : '',
        type: 'default',
        icon: screen.width > $scope.changeBtnContentAt ? '' : 'plus',
        width: screen.width > $scope.changeBtnContentAt ? 100 : 36,

        onClick: function (e) {

            var data = { Id: null };

            $rootScope.$broadcast('InitZAddPerson', data);
        },
        bindingOptions: {
            visible: 'IsNewVisible'
        }

    };

    $scope.btn_edit = {
        text: screen.width > $scope.changeBtnContentAt ? 'View/Edit' : '',
        type: 'default',
        icon: screen.width > $scope.changeBtnContentAt ? '' : 'edit',
        width: screen.width > $scope.changeBtnContentAt ? 115 : 36,

        bindingOptions: {
            //icon: screen.width> $scope.changeBtnContentAt ? '':'edit',
            // text:'editButtonText',
        },
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = $scope.dg_selected;
            $rootScope.$broadcast('InitZAddPerson', data);
          
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
        text: screen.width > $scope.changeBtnContentAt ? 'Search' : '',
        type: 'success',
        icon: screen.width > $scope.changeBtnContentAt ? '' : 'search',
        width: screen.width > $scope.changeBtnContentAt ? 95 : 36,

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
                    .append($("<img>", { "src": $rootScope.clientsFilesUrl + (options.value ? options.value : 'imguser.png'), "css": { height: '50px', width: '50px', borderRadius: '100%' } }))
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
    $scope.groupDs = ['Cockpit', 'Cabin'];
    $scope.dg_columns2 = [
        {
            name: '_row',
            cellTemplate: function (container, options) {
                $("<div style='text-align:center'/>")
                    .html(options.rowIndex + 1)
                    .appendTo(container);
            }, caption: '#', width: 60, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader', fixed: screen.width > 1024 ? true : false, fixedPosition: 'left'
        },

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
        { dataField: 'InActive', caption: 'InActive', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: true, width: 80, fixed: screen.width > 1024 ? true : false, fixedPosition: 'left' },
        { dataField: 'IsDeleted', caption: 'O/A', name: 'oae', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: true, width: 60, fixed: screen.width > 1024 ? true : false, fixedPosition: 'left', visible: true },
        {
            dataField: 'JobGroupRoot', caption: 'Group', allowResizing: true

            , alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left',
            visible: screen.width > 1024 ? true : false
        },
        /*{
           dataField: 'PostRoot', caption: 'Post', allowResizing: true
                    
           , alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left',
           visible: screen.width> 1024 ? true : false
       },*/
        {
            dataField: 'JobGroup', caption: 'Pos.', allowResizing: true

            , alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: screen.width > 1024 ? true : false, fixedPosition: 'left'
        },
        {
            dataField: 'HomeBase', caption: 'H/B', name: 'HB', allowResizing: true

            , alignment: 'center', dataType: 'string', allowEditing: false, width: 90, fixed: screen.width > 1024 ? true : false, fixedPosition: 'left'
        },

        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: screen.width > 1024 ? true : false, fixedPosition: 'left' },
        //  { dataField: 'ScheduleName', caption: 'Schedule', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },

        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'NID', caption: 'NID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'RemainMedical', caption: 'Medical', name: 'medical', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
        { dataField: 'RemainPassport', caption: 'Passport', name: 'passport', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },

        { dataField: 'RemainLicence', caption: 'Licence', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
      /*  { dataField: 'RemainRIGHT_SEAT_QUALIFICATION', caption: 'RIGHTSEAT', name: 'RIGHTSEAT', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100 },*/
        { dataField: 'RemainPROFICIENCY_ASSESSMENT', caption: 'PROF', name: 'PROF', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120, visible: false },
        { dataField: 'RemainRouteCheck', caption: 'ROUTE', name: 'ROUTE', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120, visible: false },
        //{ dataField: 'RemainProficiency', caption: 'LPC', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
        //{ dataField: 'RemainProficiencyOPC', caption: 'OPC', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
        //{ dataField: 'RemainLPR', caption: 'LPR', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },

        { dataField: 'RemainAvSec', caption: 'TRG07B', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
        { dataField: 'RemainTRG02', caption: 'TRG02', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, visible: false },	
        { dataField: 'RemainTRG01', caption: 'TRG01', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, visible: false },
        { dataField: 'RemainTRG07A', caption: 'TRG07A', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, visible: false },
        { dataField: 'RemainTRG16', caption: 'TRG16', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, visible: false },

        { dataField: 'RemainSMS', caption: 'SMS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },

        { dataField: 'RemainSMSL1L2L3', caption: 'SMS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, visible: false },


        { dataField: 'RemainSMSL2L3', caption: 'SMS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, visible: false },
        { dataField: 'Remain18', caption: 'SMSL2', name: 'SMSL2', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain19', caption: 'SMS', name: 'SMSL3', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainLOAD_CONTROL', caption: 'LOAD', name: 'LOAD', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },

        //7-12
        //{ dataField: 'RemainSEPTP', caption: 'SEPT-P', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
        { dataField: 'RemainSEPT', caption: 'ESET', name: 'ESET', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },


        { dataField: 'RemainDG', caption: 'DG', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
        { dataField: 'RemainCRM', caption: 'CRM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
        { dataField: 'RemainCCRM', caption: 'CCRM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
        //moradi
         { dataField: 'RemainFirstAid', caption: 'FirstAid', name: 'FirstAid', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, visible:false },
        //{ dataField: 'RemainLine', caption: 'Line', name: 'Line', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100 },
        //{ dataField: 'Reserved1', caption: 'LIFUS', name: 'LIFUS', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 60 },
      /*  { dataField: 'RemainLineC1', caption: '737', name: '737', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false, },*/
        { dataField: 'RemainLineC3', caption: 'MD', name: 'MD', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        //{ dataField: 'RemainLineC2', caption: 'AIRBUS', name: 'AIRBUS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },

        { dataField: 'RemainRecurrent', caption: 'Recurrent', name: 'Recurrent', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainCAO', caption: 'GRT', name: 'GRT', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100 },
        { dataField: 'RemainEGPWS', caption: 'FMT', name: 'FMT', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: true },

        { dataField: 'RemainHotWeather', caption: 'HOTWX', name: 'HOTWX', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
        { dataField: 'RemainColdWeather', caption: 'COLDWX', name: 'COLDWX', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
        //{ dataField: 'RemainCMC', caption: 'CMC', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90 },
        ////nasiri



        { dataField: 'RemainLineC1', caption: 'Type', name: 'Type', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainLineC3', caption: 'Check', name: 'FlightCheck', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        //moradi2

        // { dataField: 'RemainTypeAirbus', caption: 'FRMS', name: 'FRMS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100 },

        { dataField: 'RemainHF', caption: 'HF', name: 'HF', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain66', caption: 'FAM', name: 'FAM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainASD', caption: 'ASD', name: 'ASD', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        //{ dataField: 'Remain1', caption: 'ASD IKA',name:'ASDIKA', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
        { dataField: 'RemainGOM', caption: 'GOM', name: 'GOM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain55', caption: 'ULD', name: 'ULD', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain78', caption: 'GSE', name: 'GSE', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain83', caption: 'BAGGAGE', name: 'BAGGAGE', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain62', caption: 'PASSENGER', name: 'PASSENGER', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainASF', caption: 'ASF', name: 'ASF', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainCC', caption: 'CC', name: 'CC', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainERP', caption: 'ERP', name: 'ERP', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },

        { dataField: 'RemainMB', caption: 'M&B', name: 'MB', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainMP', caption: 'M&P', name: 'MP', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },

        { dataField: 'RemainMB', caption: 'LOADSHEET', name: 'LOADSHEET', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120, visible: false },
        { dataField: 'Remain79', caption: 'LOADSHEET', name: 'LOADSHEETGRH', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120, visible: false },
        { dataField: 'RemainPS', caption: 'PS', name: 'PS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainANNEX', caption: 'ANNEX', name: 'ANNEX', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainDRM', caption: 'DRM', name: 'DRM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainFMTD', caption: 'FMT.', name: 'FMTD', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainMEL', caption: 'MEL', name: 'MEL', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainMET', caption: 'MET', name: 'MET', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainPER', caption: 'PERF.', name: 'PER', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainRVSM', caption: 'RVSM.', name: 'RVSM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainDisManual', caption: 'MANUAL', name: 'MANUAL', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainLRC', caption: 'COMM', name: 'RC', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainCALR', caption: 'CALR', name: 'CALR', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainRSP', caption: 'F/P', name: 'RSP', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain4', caption: 'F/M', name: 'FM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain5', caption: 'A/T/M', name: 'ATM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain6', caption: 'NAV.', name: 'NAV', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain7', caption: 'A/I', name: 'AI', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'RemainSpecialApproval', caption: 'S/A', name: 'SA', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain3', caption: 'DEICING', name: 'DEICING', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },

        { dataField: 'Remain14', caption: 'EWIS', name: 'EWIS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain15', caption: 'FTS', name: 'FTS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain16', caption: 'PART145', name: 'PART145', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain12', caption: 'PARTM', name: 'PARTM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain17', caption: 'MOE', name: 'MOE', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain8', caption: 'ATL', name: 'ATL', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain9', caption: 'RAMP', name: 'RAMP', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain10', caption: 'ENGINE', name: 'ENGINE', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain56', caption: 'C2A2', name: 'C2A2', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain11', caption: 'B737', name: 'B737', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain13', caption: 'LEGISLATION', name: 'LEGISLATION', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },



        { dataField: 'Remain20', caption: 'AIROPS', name: 'AIROPS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain21', caption: 'OM', name: 'OM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain24', caption: 'CAME', name: 'CAME', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },

        { dataField: 'Remain22', caption: 'ANALYSIS', name: 'ANALYSIS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain23', caption: 'AUDIT', name: 'AUDIT', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },

        { dataField: 'Remain25', caption: 'MPA', name: 'MPA', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },
        { dataField: 'Remain26', caption: 'ADSB', name: 'ADSB', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },

        { dataField: 'Remain27', caption: 'FCL', name: 'FCL', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },

        { dataField: 'RemainLineC1', caption: 'TYPE.', name: 'TYPEM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, visible: false },

    ];

    //nasiri
    $scope._cer = $rootScope.getCertificateTypeList();
    $scope._cerDetails = $rootScope.getCertificateTypeListDetails();
    $scope._cerRemFields = $rootScope.getCertificateTypeLisRemainingFields();
    $scope.formatDate = function (dt) {
        if (!dt)
            return "";
        return moment(new Date(dt)).format("YYYY-MMM-DD");
    };
    $scope.showImage = function (item) {
        var data = { url: item.url, caption: item.caption };

        $rootScope.$broadcast('InitImageViewer', data);
    };
    $scope.is_crew = false;
    $scope.is_cockpit = false;
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
        //3-16
        selection: { mode: 'multiple' },

        columnAutoWidth: false,
        height: $(window).height() - 135,

        columns: $scope.dg_columns2,
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            $scope.is_crew = false;
            $scope.is_cockpit = false;

            if (!data) {
                $scope.dg_selected = null;
            }
            else {
                $scope.dg_selected = data;
                $scope.is_crew = data.JobGroupCode.startsWith('00102') || data.JobGroupCode.startsWith('00101');
                $scope.is_cockpit = data.JobGroupCode.startsWith('00101');
            }


        },
        "export": {
            enabled: $scope.is_export_enabled,
            fileName: "Employees",
            allowExportSelectedData: true
        },
        customizeExportData: function (cols, rows) {
            rows.forEach(function (row) {
                var rowValues = row.values;
                for (let i = 0; i < rowValues.length; i++) {
                    if (rowValues[i] == -100000)
                        rowValues[i] = "";
                }
            });
        },
        onCellPrepared: function (e) {


            if (e.rowType != 'data' || ['InActive', 'JobGroupRoot', 'JobGroup', 'Name', 'Mobile', 'Reserved1'].indexOf(e.column.dataField) != -1 || e.column.name == '_row')
                return;
            if (e.rowType == 'data' && ['IsDeleted'].indexOf(e.column.dataField) != -1) {
                if (e.data.IsDeleted)
                    e.cellElement.css("backgroundColor", "#ff99ff");
            }
            else
                $scope.styleCell(e, e.data[e.column.dataField]);
            /*
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

           
           if (e.rowType === "data" && e.column.dataField == "RemainLine") {
               $scope.styleCell(e, e.data.RemainLine);
           }
           if (e.rowType === "data" && e.column.dataField == "RemainEGPWS") {
               $scope.styleCell(e, e.data.RemainEGPWS);
           }
           if (e.rowType === "data" && e.column.dataField == "RemainCAO") {
               $scope.styleCell(e, e.data.RemainCAO);
           }
 
          if (e.rowType === "data" && e.column.dataField == "RemainRecurrent") {
               $scope.styleCell(e, e.data.RemainRecurrent);
           }
            if (e.rowType === "data" && e.column.dataField == "RemainCMC") {
               $scope.styleCell(e, e.data.RemainCMC);
           }
           */

            /*
            if (e.rowType === 'data'
                && ((e.column.dataField == "RemainMedical")
                 || (e.column.dataField == "RemainPassport")
                  || (e.column.dataField == "RemainLicence")
                 || (e.column.dataField == "RemainProficiency")
                 || (e.column.dataField == "RemainProficiencyOPC")
                || (e.column.dataField == "RemainLPR")
                || (e.column.dataField == "RemainAvSec")
                || (e.column.dataField == "RemainSMS")

                || (e.column.dataField == "RemainCRM")
                || (e.column.dataField == "RemainCCRM")
                || (e.column.dataField == "RemainSEPT")
               
                || (e.column.dataField == "RemainSEPTP")
                || (e.column.dataField == "RemainDG")
                || (e.column.dataField == "RemainFirstAid")
              
                || (e.column.dataField == "RemainLine")
                || (e.column.dataField == "RemainCAO")
                
                || (e.column.dataField == "RemainEGPWS")
                || (e.column.dataField == "RemainRecurrent")
                
                || (e.column.dataField == "RemainCMC")
                )
                && ((!e.value && e.value!=0) || e.value == '-100000')) {
                 
                e.cellElement.html('?'); 
        	
            }*/

            if (e.column.dataField == "Remain10") {
                if (e.value == '-100000')
                    e.cellElement.html('?');
                else e.cellElement.html('✓');
            }
            else
                if (e.column.dataField == "Remain56") {
                    if (e.value == '-100000')
                        e.cellElement.html('?');
                    else e.cellElement.html('✓');
                }

            if ((!e.value && e.value != 0) || e.value == '-100000') {
                if (e.column.name == '_row') return;

                //if (e.rowType === 'data' && (e.column.dataField == "RemainASD" || e.column.dataField == "Remain1" || e.column.dataField == "Remain3"))
                //	e.cellElement.html('N/A');
                //else
                e.cellElement.html('?');
            }

            //  if (e.rowType === 'data' && e.value == '1000000')
            //  {
            //     e.cellElement.html('N/A');
            //  }

        },
        onCellClick: function (e) {
            if (!e.column.dataField) {
                return;
            }
            else

                if (e.column.dataField == 'InActive' /*|| e.rowType!='data' ||  e.column.name=='_row'*/) {

                    General.Confirm("Are you sure?", function (res) {
                        if (res) {

                            var newvalue = !e.value;
                            e.data.InActive = newvalue;
                            personService.active({ Id: e.data.Id }).then(function (response) {

                                $scope.dg_instance.refresh(true);

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                        }
                    });


                }
                else {
                    //return;
                    //nasiri  
                    if ($scope._cerRemFields.indexOf(e.column.dataField) != -1) {
                        if (!e.data)
                            return;
                        var typ = Enumerable.From($scope._cerDetails).Where('$.RemField=="' + e.column.dataField + '"').FirstOrDefault();
                        $scope.loadingVisible = true;
                        trnService.getCertificateObj(e.data.PersonId, typ.type, typ.title).then(function (response) {

                            $scope.loadingVisible = false;
                            var emp = response.Data.employee;

                            var _caption = emp.Name + ', ' + (typ.caption ? typ.caption : typ.title)
                                + ', ' + 'ISSUE: ' + (typ.issue ? $scope.formatDate(emp[typ.issue]) : '')
                                + ', ' + 'EXPIRE: ' + (typ.expire ? $scope.formatDate(emp[typ.expire]) : '');
                            if (response.Data.certificate && response.Data.certificate.ImgUrl) {
                                //$scope.showImage({ url: $rootScope.clientsFilesUrl + "/" + response.Data.certificate.ImgUrl, caption: _caption });
                                $window.open($rootScope.clientsFilesUrl + "/" + response.Data.certificate.ImgUrl, '_blank');
                            }
                            else
                                if (response.Data.document && response.Data.document.FileUrl) {
                                    //$scope.showImage({ url: $rootScope.clientsFilesUrl + "/" + response.Data.document.FileUrl, caption: _caption });}
                                    $window.open($rootScope.clientsFilesUrl + "/" + response.Data.document.FileUrl, '_blank');
                                }




                                else {
                                    General.ShowNotify('The related DOCUMENT not found', 'error');
                                }
                        }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });


                    }
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
        if (value > 90)
            return;
        //moradi2
        //12-14
        if ((!value && value !== 0) || value == -100000) {
            //#a6a6a6
            //11-09
            if (e.rowType === 'data' && (e.column.dataField == "RemainASD" || e.column.dataField == "Remain1" || e.column.dataField == "Remain3")) {
                return;
            }
            else {
                e.cellElement.css("backgroundColor", "#a6a6a6");
                e.cellElement.css("color", "#fff");
                return;
            }

        }
        if (value > 60 && value <= 90 && e.column.dataField != "Remain10" && e.column.dataField != "Remain56") {
            e.cellElement.css("backgroundColor", "#ffff00");
            e.cellElement.css("color", "#000");
        }
        else if (value > 30 && e.column.dataField != "Remain10" && e.column.dataField != "Remain56") {
            e.cellElement.css("backgroundColor", "#ffd9b3");
            e.cellElement.css("color", "#000");
        }
        else if (value > 10 && e.column.dataField != "Remain10" && e.column.dataField != "Remain56") {
            e.cellElement.css("backgroundColor", "#ffa64d");
            e.cellElement.css("color", "#000");
        }
        else if (value > 0 && e.column.dataField != "Remain10" && e.column.dataField != "Remain56") {
            e.cellElement.css("backgroundColor", "#ff6600");
            e.cellElement.css("color", "#000");
        }
        else if (value <= 0 && e.column.dataField != "Remain10" && e.column.dataField != "Remain56") {
            e.cellElement.css("backgroundColor", "#ff0000");
            e.cellElement.css("color", "#fff");
        }
        //e.cellElement.css("backgroundColor", "#ffcccc");
    }
    $scope.doRefresh = false;
    $scope.showActive = false;





    $scope.rankGroup = '';
    //nool
    var _ranks = ['Cockpit', 'Cabin', 'F/D', 'GRND', 'COMM', 'CAMO', 'MAINTENANCE', 'TRAINING', 'LEGAL', 'QA', 'FINANCIAL', 'HR', 'IT', 'SECURITY', 'MANAGEMENT',
        'FLIGT_OPS_STAFF',
        'ENG_AND_MAINT_STAFF',
        'MNG_STAFF',
        'SECURITY_STAFF',

        'All'];
    $scope.sb_rankgroup = {
        width: 230,
        showClearButton: false,
        searchEnabled: false,
        //dataSource: ['Cockpit','Cabin','F/D','GRND','COMM','CAMO','MAINTENANCE','TRAINING','LEGAL','QA','All'],


        //readOnly:true,
        onValueChanged: function (e) {

            $scope.dg_instance.beginUpdate();


            ///////2023-08-30

            $scope.dg_instance.columnOption('oae', 'visible', e.value == 'Cockpit' || e.value == 'Cabin');

            $scope.dg_instance.columnOption('medical', 'visible', e.value == 'Cockpit' || e.value == 'Cabin');
            $scope.dg_instance.columnOption('passport', 'visible', e.value == 'Cockpit' || e.value == 'Cabin');

            $scope.dg_instance.columnOption('Licence', 'visible', e.value == 'Cockpit');
            $scope.dg_instance.columnOption('HOTWX', 'visible', e.value == 'Cockpit' || e.value == 'F/D');
            $scope.dg_instance.columnOption('COLDWX', 'visible', e.value == 'Cockpit' || e.value == 'F/D');

            $scope.dg_instance.columnOption('LPC', 'visible', e.value == 'Cockpit');
            $scope.dg_instance.columnOption('OPC', 'visible', e.value == 'Cockpit');
            $scope.dg_instance.columnOption('RIGHTSEAT', 'visible', e.value == 'Cockpit');
            $scope.dg_instance.columnOption('LIFUS', 'visible', e.value == 'Cockpit');
            $scope.dg_instance.columnOption('LPR', 'visible', e.value == 'Cockpit');
            $scope.dg_instance.columnOption('GRT', 'visible', e.value == 'Cockpit');

            $scope.dg_instance.columnOption('Line', 'visible', e.value == 'Cockpit' /*|| e.value == 'Cabin'*/);

            //$scope.dg_instance.columnOption('737', 'visible', e.value == 'Cabin' /*|| e.value == 'Cabin'*/);

            $scope.dg_instance.columnOption('B737', 'visible', e.value == 'Cabin' /*|| e.value == 'Cabin'*/);//asalAdd


            $scope.dg_instance.columnOption('MD', 'visible', false /*e.value == 'Cabin'*/ /*|| e.value == 'Cabin'*/);
            //$scope.dg_instance.columnOption('AIRBUS', 'visible', e.value == 'Cabin' /*|| e.value == 'Cabin'*/);

            $scope.dg_instance.columnOption('AvSec', 'visible', e.value == 'Cockpit' || e.value == 'Cabin');
            $scope.dg_instance.columnOption('TRG07B', 'visible', e.value == 'Cockpit' || e.value == 'Cabin');

            //$scope.dg_instance.columnOption('CyberSec', 'visible',   e.value == 'COMM');
            $scope.dg_instance.columnOption('RemainSMS', 'visible', e.value == 'Cockpit' || e.value == 'Cabin');
            $scope.dg_instance.columnOption('RemainSMSL1L2L3', 'visible', e.value != 'MANAGEMENT' && e.value != 'QA' && e.value != 'Cockpit' && e.value != 'Cabin');
            $scope.dg_instance.columnOption('RemainSMSL2L3', 'visible', e.value == 'MANAGEMENT');

            $scope.dg_instance.columnOption('SEPT-P', 'visible', e.value == 'Cockpit' || e.value == 'Cabin');
            $scope.dg_instance.columnOption('SEPT-T', 'visible', e.value == 'Cockpit' || e.value == 'Cabin');
            $scope.dg_instance.columnOption('ESET', 'visible', e.value == 'Cockpit' || e.value == 'Cabin');
            $scope.dg_instance.columnOption('DG', 'visible', e.value == 'Cockpit' || e.value == 'Cabin' || e.value == 'GRND' || e.value == 'COMM_' || e.value == 'F/D');
            $scope.dg_instance.columnOption('CRM', 'visible', e.value == 'Cockpit' || e.value == 'F/D' || e.value == 'Cabin');
            $scope.dg_instance.columnOption('CCRM', 'visible', e.value == 'Cockpit' || e.value == 'Cabin');
            $scope.dg_instance.columnOption('FirstAid', 'visible', e.value == 'Cabin' || e.value == 'Cabin');
            $scope.dg_instance.columnOption('FMT', 'visible', e.value == 'Cabin' || e.value == 'Cockpit');

            $scope.dg_instance.columnOption('FlightCheck', 'visible', false);
            $scope.dg_instance.columnOption('TYPEM', 'visible', e.value == 'MAINTENANCE');
           /* $scope.dg_instance.columnOption('Recurrent', 'visible', e.value == 'Cabin');*/
            $scope.dg_instance.columnOption('CMC', 'visible', e.value == 'Cockpit' || e.value == 'Cabin');

           

            $scope.dg_instance.columnOption('ASD', 'visible', e.value == 'GRND' || e.value == 'COMM_'   || e.value == 'MAINTENANCE');
            $scope.dg_instance.columnOption('FAM', 'visible', e.value == 'CAMO');

            $scope.dg_instance.columnOption('DEICING', 'visible', e.value == 'GRND' || e.value == 'COMM_' );
            $scope.dg_instance.columnOption('GOM', 'visible', e.value == 'GRND' || e.value == 'TRAINING' || e.value == 'QA');
            $scope.dg_instance.columnOption('ULD', 'visible', e.value == 'GRND');
            $scope.dg_instance.columnOption('GSE', 'visible', e.value == 'GRND');
            $scope.dg_instance.columnOption('BAGGAGE', 'visible', e.value == 'GRND');
            $scope.dg_instance.columnOption('PASSENGER', 'visible', e.value == 'GRND'||e.value == 'IT' || e.value == 'LEGAL');
            //$scope.dg_instance.columnOption('ASDIKA', 'visible',   e.value == 'COMM'  || e.value == 'GRND'  || e.value=='MAINTENANCE');
            
            //$scope.dg_instance.columnOption('ASF', 'visible', e.value == 'GRND' || e.value == 'COMM');
            //$scope.dg_instance.columnOption('CC', 'visible', e.value == 'GRND' || e.value == 'COMM');
            $scope.dg_instance.columnOption('LOAD', 'visible', e.value == 'GRND' || e.value == 'COMM_');

            $scope.dg_instance.columnOption('ERP', 'visible', e.value == 'GRND' || e.value == 'COMM_' || e.value == 'SECURITY' || e.value == 'QA' || e.value == 'MANAGEMENT' || e.value == 'QA');
            $scope.dg_instance.columnOption('TRG01', 'visible', e.value == 'MANAGEMENT' || e.value == 'All' || e.value == 'GRND' || e.value == 'COMM' || e.value == 'SECURITY' || e.value == 'QA' || e.value == 'CAMO' || e.value == 'MAINTENANCE' || e.value == 'LEGAL' || e.value == 'IT' || e.value == 'FINANCIAL' || e.value == 'CEO' || e.value == 'HR' || e.value == 'TRAINING');
            $scope.dg_instance.columnOption('TRG02', 'visible', e.value == 'IT' || e.value == 'LEGAL' || e.value == 'TRAINING' || e.value == 'QA' || e.value == 'CAMO')
            $scope.dg_instance.columnOption('HF', 'visible', e.value == 'LEGAL' || e.value == 'TRAINING' || e.value == 'QA' || e.value == 'MAINTENANCE' || e.value == 'CAMO' || e.value == 'SECURITY' || e.value == 'GRND')
           
            $scope.dg_instance.columnOption('TRG07A', 'visible', e.value == 'MANAGEMENT')
            $scope.dg_instance.columnOption('TRG16', 'visible', e.value == 'SECURITY');
            $scope.dg_instance.columnOption('MB', 'visible', e.value == 'F/D');
            // $scope.dg_instance.columnOption('MP', 'visible', e.value == 'F/D');
            $scope.dg_instance.columnOption('LOADSHEETGRH', 'visible',  e.value == 'GRND'  );
            //$scope.dg_instance.columnOption('PS', 'visible', e.value == 'GRND' || e.value == 'COMM');
            //$scope.dg_instance.columnOption('ANNEX', 'visible', e.value == 'F/D');
            //$scope.dg_instance.columnOption('DRM', 'visible', e.value == 'F/D');
            $scope.dg_instance.columnOption('FMTD', 'visible', /*e.value == 'F/D'*/false);
            $scope.dg_instance.columnOption('MEL', 'visible', e.value == 'F/D' || e.value == 'QA' || e.value == 'MAINTENANCE' || e.value == 'CAMO');
            // $scope.dg_instance.columnOption('MET', 'visible', e.value == 'F/D');
            $scope.dg_instance.columnOption('PER', 'visible', e.value == 'F/D');
            $scope.dg_instance.columnOption('RC', 'visible', e.value == 'F/D');
            $scope.dg_instance.columnOption('CALR', 'visible', e.value == 'F/D');
            $scope.dg_instance.columnOption('RVSM', 'visible', e.value == 'F/D');
            $scope.dg_instance.columnOption('MANUAL', 'visible', e.value == 'F/D');
            $scope.dg_instance.columnOption('AI', 'visible', e.value == 'F/D');
            $scope.dg_instance.columnOption('NAV', 'visible', e.value == 'F/D');
            $scope.dg_instance.columnOption('ATM', 'visible', e.value == 'F/D');
            $scope.dg_instance.columnOption('RSP', 'visible', e.value == 'F/D');
            $scope.dg_instance.columnOption('FM', 'visible', e.value == 'F/D');
            // $scope.dg_instance.columnOption('SA', 'visible', e.value == 'F/D');
            $scope.dg_instance.columnOption('PROF', 'visible', e.value == 'GRND_' || e.value == 'COMM_');
            // $scope.dg_instance.columnOption('ROUTE', 'visible',);
            $scope.dg_instance.columnOption('SMSL3', 'visible', e.value == 'QA');









            $scope.dg_instance.columnOption('SMSL2', 'visible', e.value == 'LEGAL');

            $scope.dg_instance.columnOption('OM', 'visible',  e.value == 'QA');
            $scope.dg_instance.columnOption('AIROPS', 'visible',  e.value == 'QA'  || e.value=='TRAINING');	
            $scope.dg_instance.columnOption('CAME', 'visible',  e.value == 'QA'  ||  e.value == 'CAMO');
            $scope.dg_instance.columnOption('ANALYSIS', 'visible',  e.value == 'QA');
            $scope.dg_instance.columnOption('AUDIT', 'visible', e.value == 'QA');
            $scope.dg_instance.columnOption('EWIS', 'visible', e.value == 'MAINTENANCE' || e.value == 'CAMO' || e.value == 'QA');
            $scope.dg_instance.columnOption('FTS', 'visible', e.value == 'MAINTENANCE' || e.value == 'CAMO' || e.value == 'QA');
            $scope.dg_instance.columnOption('PART145', 'visible', e.value == 'MAINTENANCE' || e.value == 'CAMO' || e.value == 'TRAINING' || e.value == 'QA' );
            $scope.dg_instance.columnOption('PARTM', 'visible', e.value == 'CAMO' || e.value == 'TRAINING' || e.value == 'QA' || e.value == 'MAINTENANCE');
            $scope.dg_instance.columnOption('MOE', 'visible', e.value == 'MAINTENANCE' || e.value == 'TRAINING' || e.value == 'QA' );
            $scope.dg_instance.columnOption('ATL', 'visible', e.value == 'MAINTENANCE' || e.value == 'CAMO' || e.value == 'QA'|| e.value == 'MAINTENANCE');
            $scope.dg_instance.columnOption('RAMP', 'visible', e.value == 'MAINTENANCE');
            $scope.dg_instance.columnOption('ENGINE', 'visible', e.value == 'CAMO');
           /* $scope.dg_instance.columnOption('C2A2', 'visible', e.value == 'CAMO');*/
            //$scope.dg_instance.columnOption('B737', 'visible', e.value == 'MAINTENANCE'  );
            //$scope.dg_instance.columnOption('LEGISLATION', 'visible', e.value == 'MAINTENANCE');

            $scope.dg_instance.columnOption('MPA', 'visible', e.value == 'CAMO' || e.value == 'QA');
            $scope.dg_instance.columnOption('ADSB', 'visible', e.value == 'CAMO' || e.value == 'QA');
            $scope.dg_instance.columnOption('FCL', 'visible', e.value == 'TRAINING');
            ////////

            $scope.dg_instance.endUpdate();
            $scope.$broadcast('getFilterQuery', null);
        },
        bindingOptions: {
            value: 'rankGroup',
            dataSource: 'ds_ranks',

        }
    };


    if ($rootScope.HasDepartmentManager() && !$rootScope.HasHR()) {
        trnService.getManagerGroups($rootScope.employeeId).then(function (response) {

            $scope.loadingVisible = false;

            //$scope.schedule_crs_ins.dataSource = response;
            $scope.ds_ranks = response;
            $scope.rankGroup = $scope.ds_ranks && $scope.ds_ranks.length > 0 ? $scope.ds_ranks[0] : '';
            //console.log($scope.ds_rank);
            //console.log($scope.rankGroup);
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    }
    else {
        $scope.ds_ranks = _ranks;
        $scope.rankGroup = 'Cockpit';
    }



    $scope.chk_active = {
        text: 'Only Actives',
        onValueChanged: function (e) {
            $scope.$broadcast('getFilterQuery', null);
        },
        bindingOptions: {
            value: 'showActive',


        }
    };

    ////////////////////
    //3-16
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
            var _pid = data.JobGroup == 'P2' ? '0' : '1';
            console.log(data);
            $window.open($rootScope.zreportServerTRNForms + '?type=opc&nid=' + data.NID + '&pid=' + _pid, '_blank');
        },
        bindingOptions: {

        }

    };
    $scope.btn_sms = {
        text: screen.width > $scope.changeBtnContentAt ? 'Notify' : '',
        type: 'default',
        icon: screen.width > $scope.changeBtnContentAt ? '' : 'email',
        width: screen.width > $scope.changeBtnContentAt ? 100 : 36,

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
    //moradi2
    $scope.btn_training = {
        text: screen.width > $scope.changeBtnContentAt ? 'Training' : '',
        type: 'default',
        icon: screen.width > $scope.changeBtnContentAt ? '' : 'event',
        width: screen.width > $scope.changeBtnContentAt ? 110 : 36,

        // onClick: function (e) {
        //    $window.open('#!/training/', '_blank');
        //},
        onClick: function (e) {
            var obj = $rootScope.getSelectedRow($scope.dg_instance);
            if (obj)
                $window.open('https://fleet.flypersia.aero/trncard/frmreportview.aspx?type=11&pid=' + (obj.PersonId * 2 + 1237), '_blank');
            // $scope.selected_person_id = obj.PersonId;
            //https://fleet.flypersia.aero/trncard/frmreportview.aspx?type=11&pid=238
            //$scope.popup_course_visible = true;
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

                        if (!result.isValid) {
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
    //////////////////////
    //2021-06-29
    //USER
    //////////////////////////////////////
    $scope.btn_user = {
        text: 'User',
        type: 'default',
        icon: 'user',
        width: 120,
        onClick: function (e) {
            $scope.dg_selected = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.dg_selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var isCrew = $scope.dg_selected.JobGroupCode.startsWith('00101') || $scope.dg_selected.JobGroupCode.startsWith('00102');
            if (!isCrew) {
                return;
            }
            $scope.getUsers(function () {
                $scope.loadingVisible = true;
                personService.getCrewLight(Config.CustomerId, $scope.dg_selected.Id).then(function (response) {
                    $scope.loadingVisible = false;
                    var _data = response[0];
                    $scope.employee = _data;
                    $scope.dto_user.FirstName = $scope.employee.FirstName;
                    $scope.dto_user.LastName = $scope.employee.LastName;
                    $scope.dto_user.PhoneNumber = $scope.employee.Mobile;
                    $scope.dto_user.PersonId = $scope.employee.PersonId;
                    console.log($scope.employee);
                    if (!$scope.employee.UserId) {
                        $scope.user = null;
                        $scope.userId = null;
                    }
                    else {


                        $scope.user = Enumerable.From($scope.users).Where('$.Id=="' + $scope.employee.UserId + '"').FirstOrDefault();

                    }

                    $scope.dto_user.UserId = null;
                    $scope.dto_user.Id = null;
                    $scope.dto_user.UserName = null;
                    $scope.IsUserEdit = false;
                    if ($scope.user) {
                        $scope.dto_user.UserId = $scope.user.Id;
                        $scope.dto_user.UserName = $scope.user.UserName;
                        $scope.dto_user.Id = $scope.user.Id;
                        $scope.IsUserEdit = true;
                    }

                    $scope.popup_user_visible = true;
                });
            });


        },
        bindingOptions: {
            //visible: 'IsEditable'
        }

    };

    $scope.selectedPassword = null;
    $scope.btn_password = {
        text: 'Password',
        type: 'default',
        icon: 'key',
        width: 150,

        onClick: function (e) {
            $scope.selectedPassword = $rootScope.getSelectedRow($scope.dg_instance);
            if (!$scope.selectedPassword) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var isCrew = $scope.selectedPassword.JobGroupCode.startsWith('00101') || $scope.selectedPassword.JobGroupCode.startsWith('00102');
            if (!isCrew) {
                return;
            }
            $scope.loadingVisible = true;
            personService.getCrewLight(Config.CustomerId, $scope.selectedPassword.Id).then(function (response) {
                $scope.loadingVisible = false;
                var _data = response[0];

                if (!_data.UserId) {
                    General.ShowNotify("user not found", 'error');
                    return;
                }
                $scope.selectedPassword = _data;
                $scope.popup_password_visible = true;
            });


        }

    };
    /////////////////////////////////////
    $scope.newPassword = '';
    $scope.txt_newPassword = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'newPassword',


        }
    };
    $scope.popup_password_visible = false;
    $scope.popup_password_title = 'Password';

    $scope.popup_password = {

        fullScreen: false,
        showTitle: true,
        width: 400,
        height: 200,
        toolbarItems: [

            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'password', bindingOptions: {} }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {


        },
        onHiding: function () {

            // $scope.clearEntity();

            $scope.popup_password_visible = false;

        },
        onContentReady: function (e) {

        },
        bindingOptions: {
            visible: 'popup_password_visible',

        }
    };
    $scope.popup_password.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_password_visible = false;
    };

    //save button
    $scope.popup_password.toolbarItems[0].options.onClick = function (e) {
        //sook
        // alert($scope.dto.Roles);
        var result = e.validationGroup.validate();

        if (!result.isValid) {
            General.ShowNotify(Config.Text_FillRequired, 'error');
            return;
        }
        var dto = { Id: $scope.selectedPassword.UserId, Password: $scope.newPassword }

        $scope.loadingVisible = true;
        authService.setPassword(dto).then(function (response) {
            $scope.loadingVisible = false;
            $scope.newPassword = '';
            $scope.popup_password_visible = false;


        },
            function (err) {
                $scope.loadingVisible = false;
                $scope.message = err.message;
                General.ShowNotify(err.message, 'error');

            });

    };
    /////////////////////////////
    $scope.dto_user = {
        UserId: null,
        UserName: null,
        Password: '1234@aA',
        FirstName: null,
        LastName: null,
        PhoneNumber: null,
        Email: '',
        PersonId: -1,
        Id: null,
    };
    $scope.popup_user_visible = false;
    $scope.popup_user_title = 'User';
    $scope.popup_user_instance = null;
    $scope.popup_user = {

        fullScreen: false,
        showTitle: true,
        width: 400,
        height: 400,
        toolbarItems: [

            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'useradd', bindingOptions: {} }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {


        },
        onHiding: function () {

            // $scope.clearEntity();
            $scope.users = [];
            $scope.user = null;
            $scope.employeeId = null;
            $scope.userId = null;
            $scope.personId = null;
            $scope.employee = null;
            $scope.IsUserEdit = false;
            $scope.dto_user = {
                Id: null,
                UserId: null,
                UserName: null,
                Password: '1234@aA',
                FirstName: null,
                LastName: null,
                PhoneNumber: null,
                Email: '',
                PersonId: -1,
            };
            $scope.popup_user_visible = false;

        },
        onContentReady: function (e) {
            if (!$scope.popup_user_instance)
                $scope.popup_user_instance = e.component;

        },
        bindingOptions: {
            visible: 'popup_user_visible',

        }
    };
    $scope.popup_user.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_user_visible = false;
    };

    //save button
    $scope.popup_user.toolbarItems[0].options.onClick = function (e) {
        //sook

        var result = e.validationGroup.validate();

        if (!result.isValid) {
            General.ShowNotify(Config.Text_FillRequired, 'error');
            return;
        }
        $scope.dto_user.Email = $scope.dto_user.FirstName.replace(/\s/g, '') + '.' + $scope.dto_user.LastName.replace(/\s/g, '') + '@airpocket.ir';
        $scope.loadingVisible = true;
        if (!$scope.IsUserEdit) {
            //if ($scope.personId)
            //    $scope.dto.PersonId = $scope.personId;
            //else
            //    $scope.dto.PersonId = -1;
            authService.register2($scope.dto_user).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dto_user = {
                    UserId: null,
                    UserName: null,
                    Password: '1234@aA',
                    FirstName: null,
                    LastName: null,
                    PhoneNumber: null,
                    Email: '',
                    PersonId: -1,
                    Id: null,
                };
                $scope.personId = null;
                $scope.popup_user_visible = false;


            },
                function (err) {
                    $scope.loadingVisible = false;
                    $scope.message = err.message;
                    General.ShowNotify(err.message, 'error');

                });
        }
        else {

            authService.updateUser($scope.dto_user).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dto_user = {
                    UserId: null,
                    UserName: null,
                    Password: '1234@aA',
                    FirstName: null,
                    LastName: null,
                    PhoneNumber: null,
                    Email: '',
                    PersonId: -1,
                    Id: null,
                };
                $scope.popup_user_visible = false;


            },
                function (err) {
                    $scope.loadingVisible = false;
                    $scope.message = err.message;
                    General.ShowNotify(err.message, 'error');

                });
        }


    };
    /////////////////////////////////////
    $scope.users = [];
    $scope.getUsers = function (callback) {

        $scope.loadingVisible = true;
        authService.getUsers().then(function (response) {
            $scope.loadingVisible = false;

            $scope.users = response;
            if (callback)
                callback();


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.getDatasourceEmployees = function (cid) {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/employees/light/' + cid,
                    version: 4
                }),

            sort: ['LastName'],
        });
    };
    $scope.isPropDisabled = false;
    $scope.employeeId = null;
    $scope.userId = null;
    $scope.user = null;
    $scope.personId = null;
    $scope.employee = null;
    $scope.IsUserEdit = false;

    $scope.txtuser_UserName = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'dto_user.UserName',

        }
    };
    $scope.txtuser_Password = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'dto_user.Password',


        }
    };
    $scope.txtuser_FirstName = {
        hoverStateEnabled: false,

        valueChangeEvent: 'keyup',
        onValueChanged: function (e) {
            // $scope.nameChanged();
        },
        readOnly: true,
        bindingOptions: {
            value: 'dto_user.FirstName',

        }
    };
    $scope.txtuser_LastName = {
        hoverStateEnabled: false,
        valueChangeEvent: 'keyup',
        onValueChanged: function (e) {
            //$scope.nameChanged();
        },
        readOnly: true,
        bindingOptions: {
            value: 'dto_user.LastName',

        }
    };
    $scope.txtuser_phone = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'dto_user.PhoneNumber',

        }
    };
    $scope.sb_employees = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $scope.getDatasourceEmployees(Config.CustomerId),
        //itemTemplate: function (data) {
        //    return $rootScope.getSbTemplateAirport(data);
        //},

        searchExpr: ["Name"],
        displayExpr: "Name",
        valueExpr: 'PersonId',
        onSelectionChanged: function (arg) {

            $scope.employee = arg.selectedItem;
            $scope.dto_user.FirstName = $scope.employee.FirstName;
            $scope.dto_user.LastName = $scope.employee.LastName;
            $scope.dto_user.PhoneNumber = $scope.employee.Mobile;
            $scope.dto_user.PersonId = $scope.employee.personId;
            console.log($scope.employee);
            if (!$scope.employee.UserId) {
                $scope.user = null;
                $scope.userId = null;
            }
            else {


                $scope.user = Enumerable.From($scope.users).Where('$.Id=="' + $scope.employee.UserId + '"').FirstOrDefault();

            }

            $scope.dto_user.UserId = null;
            $scope.dto_user.UserName = null;
            $scope.IsUserEdit = false;
            if ($scope.user) {
                $scope.dto_user.UserId = $scope.user.Id;
                $scope.dto_user.UserName = $scope.user.UserName;

                $scope.IsUserEdit = true;
            }



        },
        bindingOptions: {
            value: 'personId',

        }
    };
    //////////////////////
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
        if ($scope.rankGroup != 'All')
            filters.push(['JobGroupRoot', '=', $scope.rankGroup]);

        return filters;
    };
    $scope.bind = function () {

        $scope.loadingVisible = true;
        var active = $scope.showActive ? 1 : -1;
        var grp = $scope.rankGroup == 'All' ? '-1' : $scope.rankGroup.replace('/', 'x');
        personService.getProfiles(Config.CustomerId, active, grp).then(function (response2) {
            $.each(response2.data, function (_i, _d) {

                _d.Reserved1 = _d.Reserved1 == 'true' ? true : false;
            });
            $scope.loadingVisible = false;
            $scope.dg_ds = response2.data;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        return;

        if (!$scope.dg_ds) {
            $scope.dg_ds = {
                store: {
                    type: "odata",
                    url: /*$rootScope.serviceUrl*/netProfile + 'odata/employees/light/' + ($scope.isCrew ? 'crew/' : '') + Config.CustomerId,
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
    //training 2021-07  
    //chico
    $scope.btn_courses = {
        text: screen.width > $scope.changeBtnContentAt ? 'Courses' : '',
        type: 'default',
        icon: screen.width > $scope.changeBtnContentAt ? '' : 'doc',
        width: screen.width > $scope.changeBtnContentAt ? 105 : 36,

        onClick: function (e) {
            var obj = $rootScope.getSelectedRow($scope.dg_instance);
            if (obj)
                $scope.selected_person_id = obj.PersonId;
            $scope.popup_course_visible = true;
        },
        bindingOptions: {

        }

    };
    $scope.btn_download = {
        text: 'Download Certificates',
        type: 'success',
        //icon: 'search',
        width: 250,

        bindingOptions: {},
        onClick: function (e) {
            var obj = $rootScope.getSelectedRow($scope.dg_instance);
            if (obj) {
                $window.open('https://ava.reporttrn.airpocket.app/filehandler.ashx?type=people&pid=' + obj.PersonId, '_blank');

            }

        }

    };
    $scope.personCourses = null;
    $scope.dg_courses_columns = [
        {
            dataField: "CoursePeopleStatusId", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                //var fn = options.value == 1 ? 'registered-24' : 'red';
                var fn = 'pending-24';
                if (options.value == 1)
                    fn = 'registered-24';
                else if (options.value == 0)
                    fn = 'red';


                $("<div>")
                    .append("<img src='content/images/" + fn + ".png' />")
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left',//  sortIndex: 0, sortOrder: "desc"
        },
        { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 140 },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 300, fixed: true, fixedPosition: 'left' },
        { dataField: 'CourseType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'DateStart', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 150, sortIndex: 0, sortOrder: "desc" },
        { dataField: 'DateEnd', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 150 },
        { dataField: 'CoursePeopleStatus', caption: 'Result', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'DateIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 150 },
        { dataField: 'DateExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 150 },
        { dataField: 'CertificateNo', caption: 'Cer. NO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'TrainingDirector', caption: 'Director', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Organization', caption: 'Center', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'No', caption: 'Class Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
{
    caption: "Download",
    width: 100,
    alignment: "center",
    allowFiltering: false,
    allowSorting: false,
    cellTemplate: function (container, options) {
 if (options.data.CoursePeopleStatus !== "PASSED") {
            return; 
        }
        
        var url = "https://ava.reporttrn.airpocket.app/frmreportview.aspx?type=18&id=" + options.data.Id;

       
        $("<i>")
            .addClass("fa fa-download")
            .css({
                cursor: "pointer",
                fontSize: "18px",
                color: "#444",
                padding: "6px"
            })
            .hover(
                function () { $(this).css("color", "#0078ff"); },
                function () { $(this).css("color", "#444"); }
            )
            .on("click", function (e) {
                e.stopPropagation(); 
                window.open(url, "_blank");
            })
            .appendTo(container);
    }
}


    ];
    $scope.dg_courses_selected = null;
    $scope.dg_courses_instance = null;
    $scope.dg_courses_ds = null;
    $scope.dg_courses_height = 620;
    $scope.dg_courses = {
        sorting: {
            mode: "single"
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


        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'standard' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        // height: $(window).height()-130,

        columns: $scope.dg_courses_columns,
        onContentReady: function (e) {
            if (!$scope.dg_courses_instance)
                $scope.dg_courses_instance = e.component;

            //$scope.dg_cduties_height = $(window).height() - 131;
        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_courses_selected = null;

            }
            else {
                $scope.dg_courses_selected = data;

            }
        },

        onRowPrepared: function (e) {
            if (e.data && !e.data.IsNotificationEnabled) {
                e.rowElement.css('background', '#f2f2f2');

            }

        },
        bindingOptions: {
            dataSource: 'dg_courses_ds',
            height: 'dg_courses_height',
        }
    };
    /////////////////////////
    $scope.dg_arccourse_columns = [
        { dataField: 'Organization', caption: 'Organization', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: true, fixedPosition: 'left' },

        { dataField: 'DateStart', caption: 'DateStart', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, sortIndex: 0, sortOrder: "desc" },
        { dataField: 'DateEnd', caption: 'DateEnd', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'No', caption: 'Class Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left' },

        { dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'TrainingDirector', caption: 'Training Director', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },

       /* { dataField: 'Recurrent', caption: 'Recurrent', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },*/
        { dataField: 'Duration', caption: 'Duration (hrs)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },



    ];
    $scope.dg_arccourse_selected = null;
    $scope.dg_arccourse_instance = null;
    $scope.dg_arccourses_ds = null;
    $scope.dg_arccourse_height = 540;
    $scope.dg_arccourse = {
        sorting: {
            mode: "single"
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


        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'standard' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_arccourse_columns,
        onContentReady: function (e) {
            if (!$scope.dg_arccourse_instance)
                $scope.dg_arccourse_instance = e.component;

            //$scope.dg_cduties_height = $(window).height() - 131;
        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_arccourse_selected = null;

            }
            else {
                console.log('dg_course', data);
                $scope.dg_arccourse_selected = data;
                $scope.course_Title = data.Title;
                $scope.course_OrganizationId = Number(data.OrganizationId);
                $scope.course_Location = data.Location;
                $scope.course_Instructor = data.Instructor;
                $scope.course_TrainingDirector = data.TrainingDirector;
                $scope.course_Duration = data.Duration;
                $scope.course_Interval = data.Interval;
                $scope.course_CalanderTypeId = data.CalanderTypeId;
                $scope.course_DateStart = new Date(data.DateStart);
                $scope.course_DateEnd = new Date(data.DateEnd);

            }
        },

        onRowPrepared: function (e) {

        },
        bindingOptions: {
            dataSource: 'dg_arccourses_ds',
            height: 'dg_arccourse_height',
        }
    };


    $scope.crs_result = null;
    $scope.crs_ctype = null;
    $scope.crs_cer = null;
    $scope.crs_re = null;
    $scope.crs_last = null;
    $scope.popup_course_visible = false;
    $scope.popup_course = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_course"
        },
        shading: true,
        title: 'Courses',
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 800,
        width: $(window).width() - 200,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [

            {
                widget: 'dxSelectBox', location: 'before', options: {
                    dataSource: [{ id: -2, title: 'All' }, { id: 1, title: 'Passed' }, { id: 0, title: 'Failed' }, { id: -1, title: 'Unknown' }],
                    displayExpr: 'title',
                    valueExpr: 'id',
                    placeholder: 'Result',
                    showClearButton: true,
                    width: 120,
                    onValueChanged: function (e) {
                        $scope.crs_result = e.value;
                    },
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxSelectBox', location: 'before', options: {
                    dataSource: $rootScope.getDatasourceCourseTypeNew(),
                    displayExpr: 'Title',
                    valueExpr: 'Id',
                    placeholder: 'Course Type',
                    searchEnabled: true,
                    showClearButton: true,
                    onValueChanged: function (e) {
                        $scope.crs_ctype = e.value;
                    },
                    width: 200,
                }, toolbar: 'bottom'
            },
            //{
            //    widget: 'dxSelectBox', location: 'before', options: {
            //        dataSource: $rootScope.getDatasourceCertificateTypes(),
            //        displayExpr: 'Title',
            //        valueExpr: 'Id',
            //        placeholder: 'Certificate Type',
            //        searchEnabled: true,
            //        showClearButton: true,
            //        onValueChanged: function (e) {
            //            $scope.crs_cer = e.value;
            //        },
            //        width: 200,
            //    }, toolbar: 'bottom'
            //},
            //{
            //    widget: 'dxSelectBox', location: 'before', options: {
            //        dataSource: [{ id: -2, title: 'All' }, { id: 1, title: 'Recurrent' }, { id: 0, title: 'Initial' } ],
            //        displayExpr: 'title',
            //        valueExpr: 'id',
            //        placeholder: 'Re/In',
            //        showClearButton: true,
            //        width: 100,
            //        onValueChanged: function (e) {
            //            $scope.crs_re = e.value;
            //        },
            //    }, toolbar: 'bottom'
            //},
            {
                widget: 'dxSelectBox', location: 'before', options: {
                    dataSource: [{ id: 0, title: 'All' }, { id: 1, title: 'Last' }],
                    displayExpr: 'title',
                    valueExpr: 'id',
                    placeholder: 'Last/All',
                    showClearButton: true,
                    width: 100,
                    onValueChanged: function (e) {
                        $scope.crs_last = e.value;
                    },
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    width: 40,
                    type: 'success', icon: 'find', onClick: function (arg) {

                        if (!$scope.selected_person_id) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.bindPersoncourses();


                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Add Certificate', icon: 'add', onClick: function (arg) {
                        if ($scope.isManager)
                            return;
                        if ($scope.selected_person_id)
                            $scope.popup_cer_visible = true;

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    width: 130,
                    type: 'danger', text: 'Remove', onClick: function (arg) {
                        if ($scope.isManager)
                            return;
                        if ($scope.selected_person_id) {
                            var selected = $rootScope.getSelectedRow($scope.dg_courses_instance);
                            if (!selected) {
                                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                                return;
                            }

                            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                                if (res) {

                                    var dto = { pid: $scope.selected_person_id, cid: selected.CourseId };
                                    $scope.loadingVisible = true;
                                    trnService.deleteCoursePeople(dto).then(function (response) {
                                        $scope.loadingVisible = false;
                                        if (response.IsSuccess) {
                                            General.ShowNotify(Config.Text_SavedOk, 'success');
                                            //zool
                                            $scope.personCourses = Enumerable.From($scope.personCourses).Where('$.CourseId!=' + selected.CourseId).ToArray();
                                            $scope.bindPersoncourses();
                                        }
                                        else
                                            General.ShowNotify(response.Errors[0], 'error');




                                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                                }
                            });
                            ////////////////


                        }

                    }
                }, toolbar: 'bottom'
            },
            //      {
            //          widget: 'dxButton', location: 'after', options: {
            //              type: 'default', text: 'Certificates', icon: 'print', onClick: function (arg) {
            //if ($scope.isManager)
            //	return;
            //                  if (!$scope.selected_person_id) {
            //                      General.ShowNotify(Config.Text_NoRowSelected, 'error');
            //                      return;
            //                  }
            //                  $window.open($rootScope.reportServer + '?type=11&pid=' + $scope.selected_person_id, '_blank');

            //              }
            //          }, toolbar: 'bottom'
            //      },
            //      {
            //          widget: 'dxButton', location: 'after', options: {
            //              type: 'default', text: 'Courses', icon: 'print', onClick: function (arg) {
            //if ($scope.isManager)
            //	return;
            //                  if (!$scope.selected_person_id) {
            //                      General.ShowNotify(Config.Text_NoRowSelected, 'error');
            //                      return;
            //                  }
            //                  $window.open($rootScope.reportServer + '?type=12&pid=' + $scope.selected_person_id, '_blank');
            //              }
            //          }, toolbar: 'bottom'
            //      },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_course_visible = false;

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
            // $scope.getCrewAbs2($scope.flight.ID);
            if ($scope.dg_courses_instance)
                $scope.dg_courses_instance.refresh();


        },
        onHiding: function () {

            $scope.dg_courses_instance.clearSelection();
            $scope.dg_courses_ds = null;
            $scope.personCourses = null;
            $scope.popup_course_visible = false;

        },
        bindingOptions: {
            visible: 'popup_course_visible',
            // 'toolbarItems[0].options.value': 'crs_result',
            // 'toolbarItems[1].options.value': 'rptcd_dateTo',
            // 'toolbarItems[2].options.value': 'rptcd_caco',


        }
    };


    $scope.popup_cer_visible = false;
    $scope.popup_cer = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_cer"
        },
        shading: true,
        title: 'Courses',
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 700,
        width: $(window).width() - 400,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'remove', validationGroup: 'pceradd', onClick: function (e) {

                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var dto = {};

                        //doolo


                        dto.Id = -1;
                        dto.PersonId = $scope.selected_person_id;
                        dto.CustomerId = Config.CustomerId;
                        dto.IsGeneral = 1;
                        dto.CourseTypeId = $scope.course_Type;
                        dto.CertificateNo = $scope.course_CertificateNo;
                        dto.Title = $scope.course_Title;
                        dto.DateStart = moment($scope.course_DateStart).format('YYYY-MM-DD');
                        dto.DateEnd = moment($scope.course_DateEnd).format('YYYY-MM-DD');
                        dto.DateIssue = moment($scope.course_DateIssue).format('YYYY-MM-DD');
                        dto.DateExpire = moment($scope.course_DateExpire).format('YYYY-MM-DD');
                        dto.OrganizationId = $scope.course_OrganizationId;
                        dto.Location = $scope.course_Location;
                        dto.Instructor = $scope.course_Instructor;
                        dto.TrainingDirector = $scope.course_TrainingDirector;
                        dto.Duration = $scope.course_Duration;
                        dto.DurationUnitId = 27;
                        dto.Interval = $scope.course_Interval;
                        dto.CalanderTypeId = $scope.course_CalanderTypeId;
                        // dto.Recurrent = $scope.entity.Recurrent;
                        // dto.Remark = $scope.entity.Remark;
                        dto.IsNotificationEnabled = 0;
                        //dto.Sessions = Enumerable.From($scope.entity.Sessions).Select('$.Key').ToArray();
                        console.log(dto);

                        $scope.loadingVisible = true;
                        trnService.saveCertificate(dto).then(function (response) {


                            $scope.clear_course();

                            General.ShowNotify(Config.Text_SavedOk, 'success');


                            var exists = Enumerable.From($scope.personCourses).Where('$.Id==' + response.Data.Id).FirstOrDefault();
                            if (exists) {
                                $scope.personCourses = Enumerable.From($scope.personCourses).Where('$.Id!=' + response.Data.Id).ToArray();
                            }
                            $scope.personCourses.push(response.Data);



                            $scope.loadingVisible = false;
                            $scope.bindPersoncourses();

                            // $scope.popup_cer_visible = false;




                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                        //////////////////

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_cer_visible = false;

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
            // $scope.getCrewAbs2($scope.flight.ID);
            if ($scope.dg_arccourse_instance)
                $scope.dg_arccourse_instance.refresh();


        },
        onHiding: function () {
            $scope.clear_course();
            $scope.dg_arccourse_instance.clearSelection();
            $scope.dg_arccourse_ds = null;

            $scope.popup_cer_visible = false;

        },
        bindingOptions: {
            visible: 'popup_cer_visible',
            // 'toolbarItems[0].options.value': 'crs_result',
            // 'toolbarItems[1].options.value': 'rptcd_dateTo',
            // 'toolbarItems[2].options.value': 'rptcd_caco',


        }
    };
    $scope.clear_course = function () {
        $scope.course_Type = null;
        $scope.course_CertificateNo = null;
        $scope.course_Title = null;
        $scope.course_DateStart = null;
        $scope.course_DateEnd = null;
        $scope.course_DateIssue = null;
        $scope.course_DateExpire = null;
        $scope.course_OrganizationId = null;
        $scope.course_Location = null;
        $scope.course_Instructor = null;
        $scope.course_TrainingDirector = null;
        $scope.course_Duration = null;

        $scope.course_Interval = null;
        $scope.course_CalanderTypeId = null;
    };
    $scope.bindPersoncoursesFirst = function (callback) {
        if (!$scope.personCourses) {
            $scope.loadingVisible = true;
            trnService.getPersonCourses($scope.selected_person_id).then(function (response) {
                $scope.loadingVisible = false;
                $scope.personCourses = response.Data;
                callback();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        else callback();
    };
    $scope.bindPersoncourses = function () {
        $scope.bindPersoncoursesFirst(function () {

            var ds = $scope.personCourses;
            if ($scope.crs_result == 0 || $scope.crs_result == 1) {
                ds = Enumerable.From(ds).Where('$.CoursePeopleStatusId==' + $scope.crs_result).ToArray();
            }
            if ($scope.crs_ctype) {
                ds = Enumerable.From(ds).Where('$.CourseTypeId==' + $scope.crs_ctype).ToArray();
            }
            if ($scope.crs_cer) {
                ds = Enumerable.From(ds).Where('$.CertificateTypeId==' + $scope.crs_cer).ToArray();
            }
            if ($scope.crs_re == 0 || $scope.crs_re == 1) {
                ds = Enumerable.From(ds).Where('$.Recurrent==' + $scope.crs_re).ToArray();
            }
            if ($scope.crs_last) {
                ds = Enumerable.From(ds).Where('$.RankLast==1').ToArray();
            }

            $scope.dg_courses_ds = ds;

        });

    };
    $scope.getDatasourceEmployees = function (cid) {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: serviceBaseTRN + 'api/employees/abs/query/',

                }),

            sort: ['JobGroup', 'LastName', 'FirstName'],
        });
    };

    $scope.selected_person_id = null;
    $scope.sb_employees = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $scope.getDatasourceEmployees(Config.CustomerId),
        //itemTemplate: function (data) {
        //    return $rootScope.getSbTemplateAirport(data);
        //},

        searchExpr: ["Name", "JobGroup", "NID", "PID"],
        displayExpr: "Name",
        valueExpr: 'PersonId',
        onSelectionChanged: function (arg) {
            $scope.dg_courses_instance.clearSelection();
            $scope.dg_courses_ds = null;
            $scope.personCourses = null;
            $scope.selected_person = null;
            if (arg.selectedItem) {
                $scope.selected_person = arg.selectedItem;
                $scope.bindPersoncourses();
            }

        },
        itemTemplate: "field",
        bindingOptions: {
            value: 'selected_person_id',
            readOnly: 'isManager'

        }
    };

    $scope.course_Type = null;
    $scope.course_TypeItem = null;
    $scope.course_set_expire = function () {
        if ($scope.course_Interval && $scope.course_CalanderTypeId && $scope.course_DateIssue) {
            if ($scope.course_CalanderTypeId == 12) {
                $scope.course_DateExpire = (new Date($scope.course_DateIssue)).addYears($scope.course_Interval);

            }
            if ($scope.course_CalanderTypeId == 13)
                $scope.course_DateExpire = (new Date($scope.course_DateIssue)).addMonths($scope.course_Interval);
            if ($scope.course_CalanderTypeId == 14)
                $scope.course_DateExpire = (new Date($scope.course_DateIssue)).addDays($scope.course_Interval);
        }
    };
    $scope.sb_course_type = {
        dataSource: $rootScope.getDatasourceCourseTypeNew(),
        placeholder: 'Select Course Type',
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        onSelectionChanged: function (e) {
            $scope.course_TypeItem = e.selectedItem;
            if (!e.selectedItem)
                return;
            //if (!$scope.course_Interval)
            $scope.course_Interval = e.selectedItem.Interval;
            //if (!$scope.course_Duration)
            $scope.course_Duration = e.selectedItem.Duration;
            //if (!$scope.course_CalanderTypeId)
            $scope.course_CalanderTypeId = e.selectedItem.CalenderTypeId;
            //if ($scope.isNew) {
            //    if (e.selectedItem && e.selectedItem.Interval)
            //        $scope.entity.Interval = e.selectedItem.Interval;
            //    if (e.selectedItem && e.selectedItem.CalenderTypeId)
            //        $scope.entity.CalanderTypeId = e.selectedItem.CalenderTypeId;
            //    if (e.selectedItem && e.selectedItem.Duration)
            //        $scope.entity.Duration = e.selectedItem.Duration;
            //}
            //$scope.selectedType = e.selectedItem;
            //$scope.certype = null;
            //$scope.ctgroups = null;
            //if (e.selectedItem) {
            //    $scope.certype = e.selectedItem.CertificateType;

            //    $scope.ctgroups = e.selectedItem.JobGroups;
            //}
            $scope.course_set_expire();

            $scope.dg_arccourse_instance.clearSelection();

            $scope.loadingVisible = true;
            trnService.getCoursesByType(e.selectedItem.Id, 3).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dg_arccourses_ds = response.Data;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        },
        bindingOptions: {
            value: 'course_Type',

        }

    };
    $scope.date_course_resultissue = {
        width: '100%',
        type: 'date',
        onValueChanged: function (e) {

            $scope.course_set_expire();
        },
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'course_DateIssue',
            // disabled: 'isCertidicateDisabled',
        }
    };
    $scope.txt_course_Title = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'course_Title',
        }
    };
    $scope.txt_course_Instructor = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'course_Instructor',
        }
    };
    $scope.txt_course_TrainingDirector = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'course_TrainingDirector',
        }
    };


    $scope.date_course_DateStart = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'course_DateStart',

        }
    };
    $scope.date_course_DateEnd = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            if (e.value) {
                $scope.course_DateIssue = (new Date(e.value)).addDays(1);
            }

        },
        bindingOptions: {
            value: 'course_DateEnd',

        }
    };

    $scope.txt_course_Location = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'course_Location',
        }
    };

    $scope.txt_course_Duration = {
        min: 1,

        bindingOptions: {
            value: 'course_Duration',
        }
    };
    $scope.txt_course_Interval = {
        min: 1,
        onValueChanged: function (e) {

            $scope.course_set_expire();
        },
        bindingOptions: {
            value: 'course_Interval',
        }
    };
    $scope.sb_course_DurationUnitId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(26),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'course_DurationUnitId',

        }
    };
    $scope.sb_course_CalanderTypeId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(11),
        displayExpr: "Title",
        valueExpr: 'Id',
        onValueChanged: function (e) {

            $scope.course_set_expire();
        },
        bindingOptions: {
            value: 'course_CalanderTypeId',

        }
    };
    $scope.sb_course_OrganizationId = {
        dataSource: $rootScope.getDatasourceAirline(),
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",

        bindingOptions: {
            value: 'course_OrganizationId',

        }

    };

    $scope.date_course_resultexpire = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'course_DateExpire',
            // disabled: 'isCertidicateDisabled',
        }
    };
    $scope.txt_course_resultno = {
        hoverStateEnabled: false,

        bindingOptions: {
            value: 'course_CertificateNo',
            //disabled:'isCertidicateDisabled',
        }
    };
    ////////////////////////////////////////////
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
        { dataField: 'LastName', caption: 'Last Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150, sortIndex: 0, sortOrder: 'asc' },
        { dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 150 },
        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, },


    ];
    $scope.dg_history_columns = [

        //{ dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 250 },
        //  { dataField: 'Mobile', caption: 'Monile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, },


        { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 140 },
        //{ dataField: 'TypeStr', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Message', caption: 'Message', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, },

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
        return;
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
        var ids = Enumerable.From($scope.dg_history_ds).Where('$.RefId && $.Status!="Delivered" && $.Status!="Delivered"').OrderByDescending('$.Id').Take(100).Select('$.RefId').ToArray();
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
        width: $(window).width() - 100,
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
        }, 500);
    });
    $rootScope.$broadcast('PersonLoaded', null);
    ///end
}]);