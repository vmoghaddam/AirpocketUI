'use strict';
app.controller('mapController', ['$scope', '$location',   'flightService', '$routeParams', '$rootScope', 'trnService', '$window','mapService', '$sce',function ($scope, $location,   flightService, $routeParams, $rootScope, trnService, $window,mapService,$sce) {

	
	
	$scope.popup_add_visible = false;
	$scope.popup_instance = null;
	 $scope.popup_add = {

        fullScreen: true,
        showTitle: true,

        toolbarItems: [
             { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            

        },
        onShown: function (e) {
             $scope.selected_tile='tab-info';
			 $('.tab-info' ).fadeIn();
          $scope.bind_flight();

        },
        onHiding: function () {

            

            $scope.popup_add_visible = false;
           
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        bindingOptions: {
            visible: 'popup_add_visible',
            width: 'pop_width',
            height: 'pop_height',
            title: 'popup_add_title',
           
        }
    };

    //close button
    $scope.popup_add.toolbarItems[0].options.onClick = function (e) {


        $scope.popup_add_visible = false;
    };
	
	var appWindow = angular.element($window);
	appWindow.bind('resize', function () {
	    
	});
	
	$scope.flight;
	$scope.crew;
	$scope.bind_flight=function(){
	   mapService.getFlight( $scope.mapt_data.APFlightId ).then(function (response) {
		   $scope.flight=response.flight;
		   if ($scope.flight.FlightNumber.indexOf('VRH')==-1)
			   $scope.flight.FlightNumber='VRH'+$scope.flight.FlightNumber;
		   
		   $scope.crew=response.crew;
		   console.log('map flight',$scope.crew);
		   
		   var is_flight_onlie=[2,14,20,21,23,24,25].indexOf($scope.flight.FlightStatusID)!=-1;
		   $scope.map_url=$sce.trustAsResourceUrl('https://map.airpocket.app/fr.html?source=map&icao=vrh&no='
												  +$scope.flight.FlightNumber+'&date='
												  +moment(new Date($scope.flight.STDDayLocal)).format("YYYY-MM-DD")+'&mode='+(is_flight_onlie?'online':'offline'));
												  
			var _intv=setInterval(function() {	
			var message={
					type:'info',
					reg:$scope.flight.Register,
					route:$scope.flight.FromAirportIATA+'-'+$scope.flight.ToAirportIATA,
					dep:moment($scope.flight.TakeOffLocalX).format('HH:mm'),
					arr:moment($scope.flight.LandingLocalX).format('HH:mm'),
					status:$scope.flight.FlightStatus,
					takeoff:$scope.flight.TakeOffLocalX,
					departed:is_flight_onlie?1:0,
					
				};
				//console.log(message);
				$('#imap-'+$scope.mapt_data.Id).get(0).contentWindow.postMessage(message, "*");
                       clearInterval(_intv);
	                 }
	             , 2000);			
			
												  
		    //alert($scope.map_url);
		   
		   
	    }, function (err) { });
		   
	};
	
	$scope.mapt_data = null;
	$scope.get_map_style=function(){
	   var isMobile=$scope.detector?$scope.detector.mobile():false;
	   var _height=isMobile?300:$(window).height()-140;
		
		return{
			 height:_height,
		};
		 
	};
	$scope.get_map_container_style=function(){
	   var isMobile=$scope.detector?$scope.detector.mobile():false;
	   var _height=isMobile?300:$(window).height()-110;
		
		return{
			 height:_height,
		};
		 
	};
	
	$scope.get_info_container_style=function(){
	   var isMobile=$scope.detector?$scope.detector.mobile():false;
	   var _height=isMobile?300:$(window).height()-148;
		
		return{
			 height:_height,
		};
		 
	};
	
	
	$scope.selected_tile='';
	$scope.tile_click=function(tile){
		$scope.selected_tile=tile;
		$('.tab-map').hide();
		$('.'+tile).fadeIn();
	};
	$scope.get_tile_class=function(tile){
		return tile==$scope.selected_tile?'tab-map-selected':'';
	}
	
    $scope.format_date=function(dt){
		
		return moment(dt).format('YYYY-MM-DD');
	};
	$scope.format_time=function(dt){
		
		return moment(dt).format('HH:mm');
	};
    $scope.$on('InitMap', function (event, prms) {
         
         $scope.mapt_data = prms;
         $scope.detector = new MobileDetect(window.navigator.userAgent);
         //$scope.scroll_height = $scope.pop_height - 140;
          $scope.popup_add_visible = true;
        

    });
//////////////////////////////

}]);  