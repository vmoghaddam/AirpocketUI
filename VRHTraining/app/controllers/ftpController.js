 
app.controller('ftpController', ['$scope', '$location', 'flightService', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, flightService, authService, $routeParams, $rootScope, $window) {
    $scope.isNew = true;
    $scope.isEditable = false;
    $scope.isLockVisible = false;
    $scope.isContentVisible = false;
    $scope.isFullScreen = false;
    var detector = new MobileDetect(window.navigator.userAgent);

    //if (detector.mobile() && !detector.tablet())
    $scope.isFullScreen = false;



    ////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_height = $(window).height();
    $scope.popup_width = $(window).width() - 500;
    $scope.popup_add_title = 'DISCRETION REPORT';
    $scope.popup_instance = null;
	
	var check_hhmm=function(a,b){
		if (!a && a!==0)
			return false;
		if (!b && b!==0)
			return false;
		return true;
	}
	var check_num=function(a){
		  if (!a && a!==0)
			  return false;
		  return true;
	}

    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [
           
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_add_visible = false;
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

            if ($scope.isNew) {
                $scope.isContentVisible = true;
            }
            if ($scope.tempData != null)
                $scope.bind();





        },
        onHiding: function () {
            $rootScope.IsRootSyncEnabled = true;
            //$scope.clearEntity();
            $scope.entity = {
                Id: -1,
                IsSecurityEvent: false,
                IsAirproxATC: false,
                IsTCASRA: false,
                IsWakeTur: false,
                IsBirdStrike: false,
                IsOthers: false,

            };
            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onAsrAddHide', null);
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_add_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_add_title',
            height: 'popup_height',
            width: 'popup_width',
           // 'toolbarItems[0].visible': 'isLockVisible',
           // 'toolbarItems[1].visible': 'isEditable',

        }
    };

    /////////////////////////////////

 $scope.scroll_ftpadd_height = $(window).height() - 130
    $scope.scroll_ftpadd = {
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
            height: 'scroll_ftpadd_height'
        }

    };
    /////////////////////////////////
    $scope.flight = null;
    $scope.fill = function (data) {
       // $scope.entity = data;
    };
    $scope.isLockVisible = false;
    $scope.bind = function () {
         
		 



       
        $scope.loadingVisible = true;

        flightService.getFTPReport($scope.tempData.FlightId).then(function (response) {
              console.log('ftp',response);
			$scope.view=response.view;
			$scope.crews=response.crews;
			$scope.flights=response.flights;
			$scope.flights_details=response.flights_details;
			$scope.route=response.route;
			$scope.fdate=response.date;
			$scope.entity=response.view;
			$scope.entity.flight_id = $scope.tempData.FlightId;
			
			$scope.entity.pre_flight_reduced_rest_hh=check_num($scope.entity.pre_flight_reduced_rest)?Math.floor($scope.entity.pre_flight_reduced_rest/60):null;
$scope.entity.extended_fdp_value_hh=check_num($scope.entity.extended_fdp_value)?Math.floor($scope.entity.extended_fdp_value/60):null;
$scope.entity.extended_fdp_split_value_hh=check_num($scope.entity.extended_fdp_split_value)?Math.floor($scope.entity.extended_fdp_split_value/60):null;
$scope.entity.extended_fdp_inflight_rest_value_hh=check_num($scope.entity.extended_fdp_inflight_rest_value)?Math.floor($scope.entity.extended_fdp_inflight_rest_value/60):null;
$scope.entity.max_legal_fdp_value_hh=check_num($scope.entity.max_legal_fdp_value)?Math.floor($scope.entity.max_legal_fdp_value/60):null;
$scope.entity.discretion_value_hh=check_num($scope.entity.discretion_value)?Math.floor($scope.entity.discretion_value/60):null;


$scope.entity.pre_flight_reduced_rest_mm=check_num($scope.entity.pre_flight_reduced_rest)? ($scope.entity.pre_flight_reduced_rest%60):null;
$scope.entity.extended_fdp_value_mm=check_num($scope.entity.extended_fdp_value)? ($scope.entity.extended_fdp_value%60):null;
$scope.entity.extended_fdp_split_value_mm=check_num($scope.entity.extended_fdp_split_value)? ($scope.entity.extended_fdp_split_value%60):null;
$scope.entity.extended_fdp_inflight_rest_value_mm=check_num($scope.entity.extended_fdp_inflight_rest_value)? ($scope.entity.extended_fdp_inflight_rest_value%60):null;
$scope.entity.max_legal_fdp_value_mm=check_num($scope.entity.max_legal_fdp_value)? ($scope.entity.max_legal_fdp_value%60):null;
$scope.entity.discretion_value_mm=check_num($scope.entity.discretion_value)? ($scope.entity.discretion_value%60):null;


            $scope.loadingVisible = false;
             

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ////////////////////////////////
    $scope.scroll_asradd_height = $(window).height() - 130;
    $scope.scroll_asradd = {
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
            height: 'scroll_asradd_height'
        }

    };

    /////////////////////////////////
   /* $scope.entity = {
         
        last_duty_started:null,
		last_duty_started_lcl:null,

    };*/
     
    

    // extended_fdp_value
	$scope.num_extended_fdp_value_hh = {
        hoverStateEnabled: false,
        min: 0,
		placeholder:'hrs',
        bindingOptions: {
            value: 'entity.extended_fdp_value_hh',
        }
    }
	$scope.num_extended_fdp_value_mm = {
        hoverStateEnabled: false,
        min: 0,
		placeholder:'min',
        bindingOptions: {
            value: 'entity.extended_fdp_value_mm',
        }
    }
//extended_fdp_split_value
$scope.num_extended_fdp_split_value_hh = {
        hoverStateEnabled: false,
        min: 0,
		 placeholder:'hrs',
        bindingOptions: {
            value: 'entity.extended_fdp_split_value_hh',
        }
    }
	$scope.num_extended_fdp_split_value_mm = {
        hoverStateEnabled: false,
        min: 0,
		 placeholder:'min',
        bindingOptions: {
            value: 'entity.extended_fdp_split_value_mm',
        }
    }
//extended_fdp_inflight_rest_value
$scope.num_extended_fdp_inflight_rest_value_hh = {
        hoverStateEnabled: false,
        min: 0,
		placeholder:'hrs',
        bindingOptions: {
            value: 'entity.extended_fdp_inflight_rest_value_hh',
        }
    }
	$scope.num_extended_fdp_inflight_rest_value_mm = {
        hoverStateEnabled: false,
        min: 0,
		placeholder:'min',
        bindingOptions: {
            value: 'entity.extended_fdp_inflight_rest_value_mm',
        }
    }
//max_legal_fdp_value
$scope.num_max_legal_fdp_value_hh = {
        hoverStateEnabled: false,
        min: 0,
		placeholder:'hrs',
        bindingOptions: {
            value: 'entity.max_legal_fdp_value_hh',
        }
    }
	$scope.num_max_legal_fdp_value_mm = {
        hoverStateEnabled: false,
        min: 0,
		placeholder:'min',
        bindingOptions: {
            value: 'entity.max_legal_fdp_value_mm',
        }
    }
//discretion_value
$scope.num_discretion_value_hh = {
        hoverStateEnabled: false,
        min: 0,
		placeholder:'hrs',
        bindingOptions: {
            value: 'entity.discretion_value_hh',
        }
    }
	$scope.num_discretion_value_mm = {
        hoverStateEnabled: false,
        min: 0,
		placeholder:'min',
        bindingOptions: {
            value: 'entity.discretion_value_mm',
        }
    }
	
	
	
	
	$scope.txt_comment = {
		 height: '200',
        bindingOptions: {
            value: 'entity.comment',
           

        }
    };
	
	
	
	//pre_flight_reduced_rest
	$scope.num_pre_flight_reduced_rest_hh = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.pre_flight_reduced_rest_hh',
        }
    }
	$scope.num_pre_flight_reduced_rest_mm = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.pre_flight_reduced_rest_mm',
        }
    }
	
	
	//last_duty_started
	 $scope.time_last_duty_started = {
        type: "time",
        width: '100%',
        //pickerType: "rollers",
        displayFormat: "HHmm",
		useMaskBehavior:true,
		showDropDownButton:false,
        interval: 15,
        onValueChanged: function (arg) {
			 
            if (!$scope.entity.last_duty_started)
				$scope.entity.last_duty_started_lcl=null;
			else
			{
				
				$scope.entity.last_duty_started_lcl=(new Date($scope.entity.last_duty_started)).addMinutes(210);
			}
            ///////////////////////
        },
        bindingOptions: {
            value: 'entity.last_duty_started',

        }
    };
	$scope.time_last_duty_started_lcl = {
        type: "time",
        width: '100%',
		readOnly:true,
        //pickerType: "rollers",
        displayFormat: "HHmm",
		useMaskBehavior:true,
		showDropDownButton:false,
        interval: 15,
         
        bindingOptions: {
            value: 'entity.last_duty_started_lcl',

        }
    };
	
	//last_duty_ended
	$scope.time_last_duty_ended = {
        type: "time",
        width: '100%',
        //pickerType: "rollers",
        displayFormat: "HHmm",
		useMaskBehavior:true,
		showDropDownButton:false,
        interval: 15,
        onValueChanged: function (arg) {
			 
            if (!$scope.entity.last_duty_ended)
				$scope.entity.last_duty_ended_lcl=null;
			else
			{
				
				$scope.entity.last_duty_ended_lcl=(new Date($scope.entity.last_duty_ended)).addMinutes(210);
			}
            ///////////////////////
        },
        bindingOptions: {
            value: 'entity.last_duty_ended',

        }
    };
	$scope.time_last_duty_ended_lcl = {
        type: "time",
        width: '100%',
		readOnly:true,
        //pickerType: "rollers",
        displayFormat: "HHmm",
		useMaskBehavior:true,
		showDropDownButton:false,
        interval: 15,
        
        bindingOptions: {
            value: 'entity.last_duty_ended_lcl',

        }
    };
	//rest_earned
	$scope.time_rest_earned = {
        type: "time",
        width: '100%',
        //pickerType: "rollers",
        displayFormat: "HHmm",
		useMaskBehavior:true,
		showDropDownButton:false,
        interval: 15,
        onValueChanged: function (arg) {
			 
            if (!$scope.entity.rest_earned)
				$scope.entity.rest_earned_lcl=null;
			else
			{
				
				$scope.entity.rest_earned_lcl=(new Date($scope.entity.rest_earned)).addMinutes(210);
			}
            ///////////////////////
        },
        bindingOptions: {
            value: 'entity.rest_earned',

        }
    };
	$scope.time_rest_earned_lcl = {
        type: "time",
        width: '100%',
		readOnly:true,
        //pickerType: "rollers",
        displayFormat: "HHmm",
		useMaskBehavior:true,
		showDropDownButton:false,
        interval: 15,
         
        bindingOptions: {
            value: 'entity.rest_earned_lcl',

        }
    };
	//next_duty_planned
	$scope.time_next_duty_planned = {
        type: "time",
        width: '100%',
        //pickerType: "rollers",
        displayFormat: "HHmm",
		useMaskBehavior:true,
		showDropDownButton:false,
        interval: 15,
        onValueChanged: function (arg) {
			 
            if (!$scope.entity.next_duty_planned)
				$scope.entity.next_duty_planned_lcl=null;
			else
			{
				
				$scope.entity.next_duty_planned_lcl=(new Date($scope.entity.next_duty_planned)).addMinutes(210);
			}
            ///////////////////////
        },
        bindingOptions: {
            value: 'entity.next_duty_planned',

        }
    };
	$scope.time_next_duty_planned_lcl = {
        type: "time",
        width: '100%',
		readOnly:true,
        //pickerType: "rollers",
        displayFormat: "HHmm",
		useMaskBehavior:true,
		showDropDownButton:false,
        interval: 15,
         
        bindingOptions: {
            value: 'entity.next_duty_planned_lcl',

        }
    };
	//next_duty_actual
	$scope.time_next_duty_actual = {
        type: "time",
        width: '100%',
        //pickerType: "rollers",
        displayFormat: "HHmm",
		useMaskBehavior:true,
		showDropDownButton:false,
        interval: 15,
        onValueChanged: function (arg) {
			 
            if (!$scope.entity.next_duty_actual)
				$scope.entity.next_duty_actual_lcl=null;
			else
			{
				
				$scope.entity.next_duty_actual_lcl=(new Date($scope.entity.next_duty_actual)).addMinutes(210);
			}
            ///////////////////////
        },
        bindingOptions: {
            value: 'entity.next_duty_actual',

        }
    };
	$scope.time_next_duty_actual_lcl = {
        type: "time",
        width: '100%',
		readOnly:true,
        //pickerType: "rollers",
        displayFormat: "HHmm",
		useMaskBehavior:true,
		showDropDownButton:false,
        interval: 15,
         
        bindingOptions: {
            value: 'entity.next_duty_actual_lcl',

        }
    };
	
    ///////////////////////////////

    $scope.tdWidth = $(window).width() / 31.0;
    $scope.rows = [-100, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10]
    $scope.columns = [-100, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    $scope.getTdClass = function (c, r) {
        var cls = "";
        if (r == 0 && c == 0) { return "ctd-center ctd"; }
        if (r != -100) {
            if (c == -100) {
                cls = "ctd-empty";
            }
            else {
                cls = "ctd";
            }
        }
        else {
            //if (c != -100) return "ctd-empty";
            //else
            //    return "ctd";
            cls = "ctd-empty";
        }
        if (c == $scope.entity.AATXAbove && r == $scope.entity.AATYAbove) {
            cls += " ctd-selected";
        }

        return cls;

    }
    $scope.tableAboveClicked = function (r, c) {
        $scope.entity.AATXAbove = c;
        $scope.entity.AATYAbove = r;
    }



    $scope.getAsClass = function (c, r) {
        var cls = "";
        if (r == 0 && c == 0) { return "ctd-center ctd"; }
        if (r != -100) {
            if (c == -100) {
                cls = "ctd-empty";
            }
            else {
                cls = "ctd";
            }
        }
        else {
            //if (c != -100) return "ctd-empty";
            //else
            //    return "ctd";
            cls = "ctd-empty";
        }


        if (c == $scope.entity.AATXAstern && r == $scope.entity.AATYAstern) {
            cls += " ctd-selected";
        }
        return cls;

    }
    $scope.tableAsternClicked = function (r, c) {
        $scope.entity.AATXAstern = c;
        $scope.entity.AATYAstern = r;
    }


    $scope.to_time=function(dt){
		if (!dt)
			return '';
		return moment(new Date(dt)).format('HH:mm');
	}
	
	$scope.to_hhmm=function(dt){
		if (!dt)
			return '';
		return Math.floor(dt /60).toString()+':'+(dt % 60).toString();
	}

    ////////////////////////////////
    $scope.tempData = null;
    $scope.$on('onSign', function (event, prms) {

        if (prms.doc == 'asr')
            flightService.signDocLocal(prms, prms.doc).then(function (response) {
                // $scope.isEditable = false;
                // $scope.isLockVisible = false;
                $scope.url_sign = signFiles + prms.PICId + ".jpg";
                $scope.PIC = prms.PIC;
                $scope.signDate = moment(new Date(prms.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    });
    $scope.$on('InitFtpReport', function (event, prms) {


        $scope.tempData = null;




        $scope.tempData = prms;


        $scope.popup_add_visible = true;

    });

}]);


