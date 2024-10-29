'use strict';
app.controller('recencyController', ['$scope', '$location', '$routeParams', '$rootScope', 'courseService', 'authService', 'ztrnService', '$window', '$compile','recencyService'
, function ($scope, $location, $routeParams, $rootScope, courseService, authService, trnService, $window, $compile,recencyService) {
    $scope.prms = $routeParams.prms;
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
	
	
   $scope.getMainStyle = function () {
        var h = $(window).height() - 150;
        return {
            height: h + 'px',
            
        }
    }
	
	$scope.active_header = '_all_crew'; //'_scheduleyear_header';
    $scope._header_click = function (h, tab) {
        $('._xheader').removeClass('selected');
        $('.' + h).addClass('selected');
        $scope.active_header = h;
        $('._header_child').hide();
        
        $('.' + tab).fadeIn(300, function () {
            
            
             $scope.dg_all_instance.repaint();
			 $scope.dg_route_instance.repaint();
			 $scope.dg_employees_instance.repaint();

            

        });
    };

    $('._crew').fadeIn(300, function () {


    });
	
	$scope.momentDate = function (date) {
        if (!date)
            return '-';
        return moment(date).format('YYYY-MMM-DD');
    };
    $scope.momentTime = function (date) {
        if (!date)
            return '-';
        return moment(date).format('HH:mm');
    };
	
	 $scope.getMainStyle2 = function () {
        var h = $(window).height() - 160;
        return {
            height: h + 'px',

        }
    }
	
	
	$scope.get_profiles_ds = function (callback) {
        $scope.loadingVisible = true;

        //var t = $scope.coursetypeid ? $scope.coursetypeid : -1;
        recencyService.getCockpit().then(function (response) {
            $scope.loadingVisible = false;
            
            $scope.dg_employees_ds = response;
			callback();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
	
	$scope.get_routes_ds = function (callback) {
        $scope.loadingVisible = true;

        //var t = $scope.coursetypeid ? $scope.coursetypeid : -1;
        recencyService.getRoutes().then(function (response) {
            $scope.loadingVisible = false;
            
            $scope.dg_route_ds = response;
			callback();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
	
	$scope.get_all_ds = function (callback) {
        $scope.loadingVisible = true;

        //var t = $scope.coursetypeid ? $scope.coursetypeid : -1;
        recencyService.getRecencyAll().then(function (response) {
            $scope.loadingVisible = false;
            
            $scope.dg_all_ds = response;
			callback();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
	
	
	
	 $scope.dg_employees_columns = [


        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixedPosition: 'left', },
        { dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 140, fixedPosition: 'left' },


    ];
    $scope.dg_employees_instance = null;
    $scope.dg_employees_ds = null;
    $scope.dg_employees = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
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

        columnAutoWidth: false,
        height: $(window).height() - 175,

        columns: $scope.dg_employees_columns,
        onContentReady: function (e) {
            if (!$scope.dg_employees_instance)
                $scope.dg_employees_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_employees_selected = null;
                 $scope.dg_rec_crew_ds=[];

            }
            else {
                $scope.dg_employees_selected = data;
                $scope.get_recency_crew(data.Id,function(){});
            }



        },
        onCellClick: function (e) {
            ////7-27
            //var clmn = e.column;
            //var field = clmn.dataField;

            //if (clmn.name == "AttForm" && e.data.AttForm)
            //    $window.open($rootScope.clientsFilesUrl + e.data.AttForm, '_blank');
        },
        bindingOptions: {
            dataSource: 'dg_employees_ds'
        }
    };
	
	
	
	 $scope.dg_route_columns = [


        { dataField: 'FromIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixedPosition: 'left', },
        { dataField: 'ToIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,   fixedPosition: 'left' },
		{ dataField: 'FromICAO', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixedPosition: 'left', },
        { dataField: 'ToICAO', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false,   fixedPosition: 'left' },
		{ dataField: 'FltCount', caption: 'Flts', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false,   fixedPosition: 'left' },


    ];
    $scope.dg_route_instance = null;
    $scope.dg_route_ds = null;
    $scope.dg_route = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
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

        columnAutoWidth: false,
        height: $(window).height() - 175,

        columns: $scope.dg_route_columns,
        onContentReady: function (e) {
            if (!$scope.dg_route_instance)
                $scope.dg_route_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_employees_selected = null;
                 $scope.dg_rec_route_ds=[];

            }
            else {
                $scope.dg_route_selected = data;
                $scope.get_recency_route(data.FromIATA+"-"+data.ToIATA,function(){});
            }



        },
        onCellClick: function (e) {
            ////7-27
            //var clmn = e.column;
            //var field = clmn.dataField;

            //if (clmn.name == "AttForm" && e.data.AttForm)
            //    $window.open($rootScope.clientsFilesUrl + e.data.AttForm, '_blank');
        },
        bindingOptions: {
            dataSource: 'dg_route_ds'
        }
    };
	
	
		 $scope.dg_rec_crew_columns = [
		 {caption:'Route',columns:[
		    
			{ dataField: 'FromIATA', caption: 'From(IATA)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixedPosition: 'left' },
			{ dataField: 'ToIATA', caption: 'To(IATA)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixedPosition: 'left' },
			{ dataField: 'FromICAO', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixedPosition: 'left' },
			{ dataField: 'ToICAO', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixedPosition: 'left' },
		 ]},
		 {caption:'Last Update',columns:[
		    
			{ dataField: 'FlightNumber', caption: 'Flt No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixedPosition: 'left' },
			{ dataField: 'date_flight', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime' ,format: 'yyyy-MMM-dd', allowEditing: false, width: 140, fixedPosition: 'left' },
		 ]},
		 { dataField: 'date_expire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'datetime' ,format: 'yyyy-MMM-dd', allowEditing: false, width: 140, fixedPosition: 'left' },
		  { dataField: 'RemainExpire', caption: 'Remain', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false,   fixedPosition: 'left' },
		 
		 

         

    ];
    $scope.dg_rec_crew_instance = null;
    $scope.dg_rec_crew_ds = null;
    $scope.dg_rec_crew = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
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

        columnAutoWidth: false,
        height: $(window).height() - 175,

        columns: $scope.dg_rec_crew_columns,
        onContentReady: function (e) {
            if (!$scope.dg_rec_crew_instance)
                $scope.dg_rec_crew_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_rec_crew_selected = null;
                 //$scope.dg_rec_crew_ds=[];

            }
            else {
                $scope.dg_rec_crew_selected = data;
                //$scope.get_recency_crew(data.Id,function(){});
            }



        },
		onCellPrepared: function (e) {
			if (e.rowType=='data' && ['RemainExpire'].indexOf(e.column.dataField)!=-1){
				if (e.data.RemainExpire<=0)
					e.cellElement.css("backgroundColor", "#ff8080");
				else
					e.cellElement.css("backgroundColor", "#99ff99");
			}
		},
        onCellClick: function (e) {
            ////7-27
            //var clmn = e.column;
            //var field = clmn.dataField;

            //if (clmn.name == "AttForm" && e.data.AttForm)
            //    $window.open($rootScope.clientsFilesUrl + e.data.AttForm, '_blank');
        },
        bindingOptions: {
            dataSource: 'dg_rec_crew_ds'
        }
    };
	
	
	
	
	
	 $scope.dg_rec_route_columns = [
		 {caption:'Crew',columns:[
		    
			{ dataField: 'LastName', caption: 'LastName', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, fixedPosition: 'left' },
			{ dataField: 'FirstName', caption: 'FirstName', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixedPosition: 'left' },
			{ dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixedPosition: 'left' },
			
		 ]},
		 {caption:'Last Update',columns:[
		    
			{ dataField: 'FlightNumber', caption: 'Flt No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixedPosition: 'left' },
			{ dataField: 'date_flight', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime' ,format: 'yyyy-MMM-dd', allowEditing: false, width: 140, fixedPosition: 'left' },
		 ]},
		 { dataField: 'date_expire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'datetime' ,format: 'yyyy-MMM-dd', allowEditing: false, width: 140, fixedPosition: 'left' },
		  { dataField: 'RemainExpire', caption: 'Remain', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false,   fixedPosition: 'left' },
		 
		 

         

    ];
    $scope.dg_rec_route_instance = null;
    $scope.dg_rec_route_ds = null;
    $scope.dg_rec_route = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
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

        columnAutoWidth: false,
        height: $(window).height() - 175,

        columns: $scope.dg_rec_route_columns,
        onContentReady: function (e) {
            if (!$scope.dg_rec_route_instance)
                $scope.dg_rec_route_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_rec_route_selected = null;
                 //$scope.dg_rec_crew_ds=[];

            }
            else {
                $scope.dg_rec_route_selected = data;
                //$scope.getRecencyRoute(data.Id,function(){});
            }



        },
		onCellPrepared: function (e) {
			if (e.rowType=='data' && ['RemainExpire'].indexOf(e.column.dataField)!=-1){
				if (e.data.RemainExpire<=0)
					e.cellElement.css("backgroundColor", "#ff8080");
				else
					e.cellElement.css("backgroundColor", "#99ff99");
			}
		},
        onCellClick: function (e) {
            ////7-27
            //var clmn = e.column;
            //var field = clmn.dataField;

            //if (clmn.name == "AttForm" && e.data.AttForm)
            //    $window.open($rootScope.clientsFilesUrl + e.data.AttForm, '_blank');
        },
        bindingOptions: {
            dataSource: 'dg_rec_route_ds'
        }
    };
	
	
	
	
	
	
	
	 $scope.dg_all_columns = [
	 {caption:'Route',columns:[
	 { dataField: 'FromIATA', caption: 'From(IATA)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixedPosition: 'left' },
			{ dataField: 'ToIATA', caption: 'To(IATA)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixedPosition: 'left' },
			{ dataField: 'FromICAO', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixedPosition: 'left' },
			{ dataField: 'ToICAO', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixedPosition: 'left' },
		
	 ]},
		 {caption:'Crew',columns:[
		    
			{ dataField: 'LastName', caption: 'LastName', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, fixedPosition: 'left' },
			{ dataField: 'FirstName', caption: 'FirstName', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixedPosition: 'left' },
			{ dataField: 'JobGroup', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixedPosition: 'left' },
			
		 ]},
		 {caption:'Last Update',columns:[
		    
			{ dataField: 'FlightNumber', caption: 'Flt No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 110, fixedPosition: 'left' },
			{ dataField: 'date_flight', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime' ,format: 'yyyy-MMM-dd', allowEditing: false, width: 120, fixedPosition: 'left' },
		 ]},
		 { dataField: 'date_expire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'datetime' ,format: 'yyyy-MMM-dd', allowEditing: false, width: 120, fixedPosition: 'left' },
		  { dataField: 'RemainExpire', caption: 'Remain', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false,   fixedPosition: 'left' },
		 
		 

         

    ];
    $scope.dg_all_instance = null;
    $scope.dg_all_ds = null;
    $scope.dg_all = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
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

        columnAutoWidth: false,
        height: $(window).height() - 175,

        columns: $scope.dg_all_columns,
        onContentReady: function (e) {
            if (!$scope.dg_all_instance)
                $scope.dg_all_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_all_selected = null;
                 //$scope.dg_rec_crew_ds=[];

            }
            else {
                $scope.dg_all_selected = data;
                //$scope.getRecencyRoute(data.Id,function(){});
            }



        },
		onCellPrepared: function (e) {
			if (e.rowType=='data' && ['RemainExpire'].indexOf(e.column.dataField)!=-1){
				if (e.data.RemainExpire<=0)
					e.cellElement.css("backgroundColor", "#ff8080");
				else
					e.cellElement.css("backgroundColor", "#99ff99");
			}
		},
        onCellClick: function (e) {
            ////7-27
            //var clmn = e.column;
            //var field = clmn.dataField;

            //if (clmn.name == "AttForm" && e.data.AttForm)
            //    $window.open($rootScope.clientsFilesUrl + e.data.AttForm, '_blank');
        },
        bindingOptions: {
            dataSource: 'dg_all_ds'
        }
    };
	
	
	$scope.get_recency_crew = function (id,callback) {
        $scope.loadingVisible = true;

        //var t = $scope.coursetypeid ? $scope.coursetypeid : -1;
        recencyService.getRecencyCrew(id).then(function (response) {
            $scope.loadingVisible = false;
            
            $scope.dg_rec_crew_ds = response;
			callback();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
	
	$scope.get_recency_route = function (route,callback) {
        $scope.loadingVisible = true;

        //var t = $scope.coursetypeid ? $scope.coursetypeid : -1;
        recencyService.getRecencyRoute(route).then(function (response) {
            $scope.loadingVisible = false;
            
            $scope.dg_rec_route_ds = response;
			callback();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
	
	
	

	
	///////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Recency';
        $('.recency').fadeIn();
    }
    ////////////////////////






  $scope.$on('$viewContentLoaded', function () {
         setTimeout(function () {
			 $scope.get_profiles_ds(function(){
				  $scope.get_routes_ds(function(){
					  
					   $scope.get_all_ds(function(){});
				  });
				 
			 });
             /*$scope.getSummary(function () {

                 $scope.getCourseTypes(function () {
                     $scope.getGroups('00001',function () {


                     });

                 });

             });*/

             //$scope.rank = 'Cockpit';

         }, 500);
         


    });

    /////////////////////
}]);