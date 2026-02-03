    
var app = angular.module('GriffinApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar', 'dx', 'ngSanitize', 'ngAnimate']).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]);
 
 
app.config(function ($routeProvider) {
    var version = 1;
    //ati new 2
    

    $routeProvider.when("/iqs", {
        controller: "iqs_controller",
        templateUrl: "/app/views/iqs.html"
    });

    $routeProvider.when("/iqs/hazard/list", {
        controller: "iqs_hazard_list_controller",
        templateUrl: "/app/views/iqs_hazard_list.html"
    });

     $routeProvider.when("/iqs/hazard/detail/:id", {
         controller: "iqs_hazard_detail_controller",
         templateUrl: "/app/views/iqs_hazard_detail.html"
     });

    $routeProvider.when("/iqs/audit/list", {
        controller: "iqs_audit_list_controller",
        templateUrl: "/app/views/iqs_audit_list.html"
    });

    $routeProvider.when("/iqs/audit/detail/:id", {
        controller: "iqs_audit_detail_controller",
        templateUrl: "/app/views/iqs_audit_detail.html"
    });

    $routeProvider.when("/iqs/occurrence/list", {
        controller: "iqs_occurrence_list_controller",
        templateUrl: "/app/views/iqs_occurrence_list.html"
    });

    $routeProvider.when("/iqs/occurrence/detail/:id", {
        controller: "iqs_occurrence_detail_controller",
        templateUrl: "/app/views/iqs_occurrence_detail.html"
    });

    $routeProvider.when("/iqs/moc/list", {
        controller: "iqs_moc_list_controller",
        templateUrl: "/app/views/iqs_moc_list.html"
    });

    $routeProvider.when("/iqs/moc/detail/:id", {
        controller: "iqs_moc_detail_controller",
        templateUrl: "/app/views/iqs_moc_detail.html"
    });


    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/app/views/login.html"
    });




    $routeProvider.otherwise({ redirectTo: "/iqs" });

});   

//////var serviceBase = 'http://grfn.api.epatrin.ir/';
//////var webBase = 'http://grfn.epatrin.ir/';
////if (window.location.href.indexOf('fleet.flypersia.aero') != -1) {
////    var webBase = 'http://fleet.flypersia.aero/airpocket/';
////    var serviceBase = 'http://fleet.flypersia.aero/api.airpocket/';
////}
////else {
////    //var serviceBase = 'http://apig.epapocket.ir/';
////    var serviceBase = 'http://localhost:58908/';
////   // var serviceBase = 'http://fleet.caspianairlines.com/api/';
////    var webBase = 'http://localhost:30000/';
////}
////var serviceBase = 'http://fleet.caspianairlines.com/api/';

//var serviceBaseAPI ='https://api0.apvaresh.com/';
//var serviceBaseTRN = 'https://trn.apvaresh.com/';

//var webBase = 'https://apvaresh.ir/';
//var serviceBase ='https://apinet.apvaresh.com/';
//var liburl = serviceBase;
//var serviceBase2 =  'https://localhost:5001/';

//var signFiles = 'https://fbpocket.ir/upload/signs/';

//var comAPI='https://api.apvaresh.com/';
//var msgUrl="https://msg.apvaresh.com/";
//var apiLog='https://yapilog.apvaresh.com/';
//var zlog='https://zlog.apvaresh.com/';
//var schUrl='https://sch.apvaresh.com/';
//var apigd='https://apigd.apvaresh.com/';
//var netProfile='https://netprofile.apvaresh.com/';
//var apireportflight='https://apireportflight.apvaresh.com/';
//var apixls='https://apixls.apvaresh.com/';
//var apiScheduling='https://varschedulingapi.airpocket.click/';

//var apiExternal = 'https://xpi.airpocket.online/';
//var airlineCode = 'vrh';

//var serviceSKYBAG = 'https://sbapi.apvaresh.com/';
//var weatherUrl='https://coreweather.varesh.click/';
//var staticFilesSKYBAG = 'https://fbpocket.ir/Upload/';

//var apimsg='https://apimsg.apvaresh.com/';
//var apiplanning='https://apiplanning.apvaresh.com/';
//var apilogdefault='https://var.apilogdefault.airpocket.online/';
//var apiapsb='https://apiapsb.apvaresh.com/';
//var apiprofile='https://apiprofile.apvaresh.com/';
//var apiauth='https://xauth.apvaresh.com/';
//var atcfiles='https://files.airpocket.online/varesh/atc/';
//var apiCAO='https://apicao.apvaresh.com/';
//var apiQA = 'https://apiqatemp.apvaresh.com/';
//var zapiqa = 'https://apiqa.apvaresh.com/';
//var apiQAAuthCard = 'https://apiqaauth.apvaresh.ir/';

//var zscheduling='https://zscheduling.apvaresh.com/';
//var zreportflight='https://apireportflight.apvaresh.com/';
//var zapinet='https://zapinet.apvaresh.com/';
//var zapiqalog = 'https://apiqalog.apvaresh.com/';
//var zfuel='https://apifuel.apvaresh.com/';
//    //'http://localhost:58908/';
//    //'http://localhost:40654/';

//    //'http://localhost:10707/';
////'http://ngauthenticationapi.azurewebsites.net/';

var serviceBaseAPI = 'https://pya.apiapsb.myaero.tech/';
var serviceBaseTRN = 'https://pya.apicaox.myaero.tech/';
var routeManuals = 'https://sb.varesh.click/upload/RouteManuals/';
var webBase = 'https://apvaresh.ir/';
var serviceBase = 'https://vrh.apinet.atbravo.link/';//'https://yapinet.apvaresh.com/'; 
var liburl = serviceBase;
var serviceBase2 = 'https://localhost:5001/';

var signFiles = 'https://fbpocket.ir/upload/signs/';

//var comAPI='https://api.apvaresh.com/';
var comAPI = 'https://pya.apifuel.myaero.tech/';
var msgUrl = "https://msg.apvaresh.com/";
//var apiLog='https://yapilog.apvaresh.com/';
var apiLog = 'https://pya.apilog.myaero.tech/';
var zlog = 'https://zlog.apvaresh.com/';
var schUrl = 'https://sch.apvaresh.com/';
var apigd = 'https://apigd.apvaresh.com/';
var netProfile = 'https://netprofile.apvaresh.com/';
//var apireportflight='https://apireportflight.apvaresh.com/'; 
var apireportflight = 'https://pya.apireportflight.myaero.tech/';
//var apixls='https://apixls.apvaresh.com/'; 
var apixls = 'https://pya.apixls.myaero.tech/';
var apiScheduling = 'https://varschedulingapi.airpocket.click/';

var apiExternal = 'https://xpi.airpocket.online/';
var airlineCode = 'vrh';

var serviceSKYBAG = 'https://sbapi.apvaresh.com/';
var weatherUrl = 'https://coreweather.varesh.click/';
var staticFilesSKYBAG = 'https://fbpocket.ir/Upload/';

var apimsg = 'https://apimsg.apvaresh.com/';
var apiplanning = 'https://pya.apiplanning.myaero.tech/';
var apilogdefault = 'https://var.apilogdefault.airpocket.online/';
var apiapsb = 'http://pya.apitrn.myaero.tech/';
//var apiprofile='https://apiprofile.apvaresh.com/';
var apiprofile = 'https://pya.apiprofile.myaero.tech/';
var apiauth = 'https://pya.apiauth.myaero.tech/';
var atcfiles = 'https://files.airpocket.online/varesh/atc/';
var apicao = 'https://apicao.apvaresh.com/';
var apiCAO = 'https://apicao.apvaresh.com/';
var apiQA = 'https://apiqatemp.apvaresh.com/';
var zapiqa = 'https://apiqa.apvaresh.com/';
var apiQAAuthCard = 'https://apiqaauth.apvaresh.ir/';

var zscheduling = 'https://pya.apischeduling.myaero.tech'//'https://zscheduling.apvaresh.com/';
var zreportflight = 'https://apireportflight.apvaresh.com/';
var zapinet = 'https://apinet.apvaresh.ir/';
var zapiqalog = 'https://apiqalog.apvaresh.com/';
var zfuel = 'https://apifuel.apvaresh.com/';
//var zapireportflight='https://zapireportflight.apvaresh.com/';
var zapireportflight = 'https://pya.apireportflight.myaero.tech/';
var serviceRequest = 'https://apiform.apvaresh.com/';
var ychbapi = 'https://yfapi.apvaresh.ir/';
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});
 
//app.config(function ($httpProvider) {




app.config(['$httpProvider', function ($httpProvider) {
   
    $httpProvider.interceptors.push('authInterceptorService');
}]);

app.directive('ngRightClick', function ($parse) {
    return function (scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function (event) {
            scope.$apply(function () {
                event.preventDefault();
                fn(scope, { $event: event });
            });
        });
    };
});
app.directive('ngRepeatEndWatch', function () {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attrs) {
            if (attrs.ngRepeat) {
                if (scope.$parent.$last) {
                    if (attrs.ngRepeatEndWatch !== '') {
                        if (typeof scope.$parent.$parent[attrs.ngRepeatEndWatch] === 'function') {
                            // Executes defined function
                            scope.$parent.$parent[attrs.ngRepeatEndWatch]();
                        } else {
                            // For watcher, if you prefer
                            scope.$parent.$parent[attrs.ngRepeatEndWatch] = true;
                        }
                    } else {
                        // If no value was provided than we will provide one on you controller scope, that you can watch
                        // WARNING: Multiple instances of this directive could yeild unwanted results.
                        scope.$parent.$parent.ngRepeatEnd = true;
                    }
                }
            } else {
                throw 'ngRepeatEndWatch: `ngRepeat` Directive required to use this Directive';
            }
        }
    };
});

app.directive(
    "repeatComplete",
    function ($rootScope) {

        // Because we can have multiple ng-repeat directives in
        // the same container, we need a way to differentiate
        // the different sets of elements. We'll add a unique ID
        // to each set.
        var uuid = 0;


        // I compile the DOM node before it is linked by the
        // ng-repeat directive.
        function compile(tElement, tAttributes) {

            // Get the unique ID that we'll be using for this
            // particular instance of the directive.
            var id = ++uuid;

            // Add the unique ID so we know how to query for
            // DOM elements during the digests.
            tElement.attr("repeat-complete-id", id);

            // Since this directive doesn't have a linking phase,
            // remove it from the DOM node.
            tElement.removeAttr("repeat-complete");

            // Keep track of the expression we're going to
            // invoke once the ng-repeat has finished
            // rendering.
            var completeExpression = tAttributes.repeatComplete;

            // Get the element that contains the list. We'll
            // use this element as the launch point for our
            // DOM search query.
            var parent = tElement.parent();

            // Get the scope associated with the parent - we
            // want to get as close to the ngRepeat so that our
            // watcher will automatically unbind as soon as the
            // parent scope is destroyed.
            var parentScope = (parent.scope() || $rootScope);

            // Since we are outside of the ng-repeat directive,
            // we'll have to check the state of the DOM during
            // each $digest phase; BUT, we only need to do this
            // once, so save a referene to the un-watcher.
            var unbindWatcher = parentScope.$watch(
                function () {

                    console.info("Digest running.");

                    // Now that we're in a digest, check to see
                    // if there are any ngRepeat items being
                    // rendered. Since we want to know when the
                    // list has completed, we only need the last
                    // one we can find.
                    var lastItem = parent.children("*[ repeat-complete-id = '" + id + "' ]:last");

                    // If no items have been rendered yet, stop.
                    if (!lastItem.length) {

                        return;

                    }

                    // Get the local ng-repeat scope for the item.
                    var itemScope = lastItem.scope();

                    // If the item is the "last" item as defined
                    // by the ng-repeat directive, then we know
                    // that the ng-repeat directive has finished
                    // rendering its list (for the first time).
                    if (itemScope.$last) {

                        // Stop watching for changes - we only
                        // care about the first complete rendering.
                        unbindWatcher();

                        // Invoke the callback.
                        itemScope.$eval(completeExpression);

                    }

                }
            );

        }

        // Return the directive configuration. It's important
        // that this compiles before the ngRepeat directive
        // compiles the DOM node.
        return ({
            compile: compile,
            priority: 1001,
            restrict: "A"
        });

    }
);

app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
});

app.run(['authService', 'activityService', '$rootScope', '$location', '$templateCache', function (authService, activityService, $rootScope, $location, $templateCache) {
    //alert($location.absUrl());
    // Config.CustomerId = 1;
    $rootScope.CustomerName = 'Caspian';
    $rootScope.CustomerPhone = '+982148063000';
    $rootScope.CustomerEmail = 'OpsEng@Caspian.aero';
    Config.CustomerId = 4;
    if ($location.absUrl().indexOf('fleet.flypersia.aero') != -1) {
        webBase = 'http://fleet.flypersia.aero/airpocket/';
        serviceBase = 'http://fleet.flypersia.aero/api.airpocket/';
    }
    ////////////////////////////////
    $rootScope.reportServer = "https://report.apvaresh.com/frmreportview.aspx";
    $rootScope.reportServerTRN = "https://trnreport.apvaresh.com/frmreportview.aspx";
    ////////////////////////////////
    $rootScope.startingBIYear = 1398;
    ////////////////////////////////
    persianDate.toLocale('en');
   
    $rootScope.$on('$viewContentLoaded', function () {
        //ati12
        if (authService.IsAuthurized() && $rootScope.EmailConfirmed != "True") {
            $rootScope.navigatefirstlogin();
            return;
        }
           
        $templateCache.removeAll();
    });
    $rootScope.serviceUrl = serviceBase;
    $rootScope.fileHandlerUrl = webBase + 'filehandler.ashx';
	// $rootScope.fileHandlerUrl ='https://trn.apvaresh.com/'+'filehandler.ashx';
    $rootScope.clientsFilesUrl = 'https://files.airpocket.online/varesh/certificates/';//webBase + 'upload/clientsfiles/';
    $rootScope.app_title = 'AirPocket';
    $rootScope.page_title = '';
    $rootScope.app_remark = 'Lorem ipsum dolor sit amet';
    $rootScope.module = '';
    $rootScope.moduleId = -1;
    $rootScope.moduleRemark = '';
    $rootScope.theme = '';
    $rootScope.color = '';
    $rootScope.class = '';
    $rootScope.userName = '';
    $rootScope.userTitle = '';
    $rootScope.userId = null;
    $rootScope.employeeId = null;
    //vahid
    $rootScope.roles = null;
    $rootScope.navigateSimple = function (target ) {

        
        $location.path(target);


    };
	$rootScope.InvisibleCrew = function () {
        
        var role = Enumerable.From($rootScope.roles).Where('$=="View Invisible Crew"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };
    $rootScope.HasDepartmentManager = function () {
        
        var role = Enumerable.From($rootScope.roles).Where('$=="Department Manager"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };
    $rootScope.HasTrainingAccess = function () {

        var role = Enumerable.From($rootScope.roles).Where('$=="Department Manager" || $=="Training View" || $=="BasePocket Admin"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };


    $rootScope.HasAccessToCrewList = function () {
		//if ($rootScope.userName.toLowerCase()=='line')
		//	return false
		//else
        //    return true;
		//if ($rootScope.userName.toLowerCase().startsWith('stn.'))
		//	return false;
		//else
		if ($rootScope.userName.toLowerCase()=='kusha' || $rootScope.userName.toLowerCase()=='mehregan' || $rootScope.userName.toLowerCase()=='yasna' || $rootScope.userName.toLowerCase()=='sales.sry' || $rootScope.userName.toLowerCase()=='alrafa')
			return false;
		else return true;
        var role = Enumerable.From($rootScope.roles).Where('$=="Flight Crew List"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };
    //ati12
    $rootScope.logOut = function () {

        authService.logOut();
    };
    $rootScope.apps = function () { $location.path('/apps'); };
    $rootScope.menu = function () {


        $('._menu').hide();
        $('#module' + $rootScope.moduleId).show();
        document.getElementById("mySidenav").style.width = "100%";
    };
    $rootScope.closeMenu = function () {
        document.getElementById("mySidenav").style.width = "0";
    };
    $rootScope.navigate = function (target, key) {
        
        var rec = Enumerable.From(Config.MenuItems).Where('$.moduleId==' + $rootScope.moduleId + ' && $.key=="' +  key + '"').FirstOrDefault();
        activityService.hitMenu(key, target, 'Visiting ' + $rootScope.module+' > '+rec.title);
         
        $location.path(target); 
       
       
    };
    $rootScope.navigateairport = function (iata) {

        

        $location.path("/dispatch/flights/"+iata+"/0");


    };
    $rootScope.navigatehomedate = function (y,m,d) {



        $location.path("/home/" + y + "/"+m+"/"+d);


    };

    //ati new
    $rootScope.navigatehome  = function ( ) {
          $location.path("/home"  );
    };

    //ati new 2
    $rootScope.navigatefirstlogin = function () {
        $location.path("/cp");
    };


    $rootScope.HasMenuAccess = function (key, module) {
		//console.log($rootScope.roles);
        if ($rootScope.userName == 'demo')
            return true;
		if (key=='flight_calendar_cockpit' ){
			var role = Enumerable.From($rootScope.roles).Where('$=="Crew Scheduler"').FirstOrDefault();
			return role || $rootScope.userName.toLowerCase().startsWith('cs.') ||  $rootScope.userName.toLowerCase().startsWith('ops.kha')
		||  $rootScope.userName.toLowerCase().startsWith('ops.paz')
		||  $rootScope.userName.toLowerCase().startsWith('ops.dara')
		||  $rootScope.userName.toLowerCase().startsWith('ghorbani')
		||  $rootScope.userName.toLowerCase().startsWith('ops.jama')
		||  $rootScope.userName.toLowerCase().startsWith('ops.abdi')
		||  $rootScope.userName.toLowerCase().startsWith('ops.aska')
		||  $rootScope.userName.toLowerCase()==('qa')
		||  $rootScope.userName.toLowerCase()==('cms');
		}
        //profile_users
        if (key == 'profile_users' && $rootScope.userName != 'razbani') {

            return false;


        }
       
       
        if (key == 'flight_board_ceo') {
            if (authService.getCEO())
                return true;
            return false;

        }
        if (key == 'flight_board') {
            if (authService.getCEO())
                return false;
           

        }
		 if (key == 'flight_board') {
            if (authService.getCEO())
                return false;
           

        }
        var exist = Enumerable.From($rootScope.claims).Where('$.page=="' + key + '"').FirstOrDefault();
        
        if (!exist) {
            switch (module) {
                case 3:
                    exist = Enumerable.From($rootScope.claims).Where('$.page=="flight_admin"').FirstOrDefault();
                    
                    break;
                case 2:
                    exist = Enumerable.From($rootScope.claims).Where('$.page=="learning_admin" || $.page=="learning_view"').FirstOrDefault();
                    
                    break;
                case 1:
					if (key!='profile_person')
                    exist = Enumerable.From($rootScope.claims).Where('$.page=="base_admin"').FirstOrDefault();
					else
						exist=$rootScope.roles.indexOf('Profiles-Ground-Edit')!=-1 ||
							$rootScope.roles.indexOf('Profiles-Ground-View')!=-1 ||
							$rootScope.roles.indexOf('Profiles-Crew-Edit')!=-1 ||
							$rootScope.roles.indexOf('Profiles-Crew-View')!=-1 ;
						//exist=Enumerable.From($rootScope.claims).Where('$.page=="Profiles-Ground-Edit" || $.page=="Profiles-Ground-View" || $.page=="Profiles-Crew-Edit" || $.page=="Profiles-Crew-View"').FirstOrDefault();
                     
                    break;
                default:
                    break;

            }
        }
        //alert(exist ? true : false);
        var result = exist ? true : false;
      //  if (result)
        //    console.log(module+'  '+key);
        return result;
    };
    $rootScope.IsFlightBoardEditable = function () {
        var exist = Enumerable.From($rootScope.claims).Where('($.page=="flight_board" && $.action=="edit") || $.page=="flight_admin"').FirstOrDefault();
        return exist ? true : false;
    };
    $rootScope.IsProfileEditable = function () {
        var exist = Enumerable.From($rootScope.claims).Where('($.page=="profile_person" && $.action=="edit") || $.page=="base_admin"').FirstOrDefault();
        return exist ? true : false;
    };
    $rootScope.IsLibraryEditable = function () {
        var exist = Enumerable.From($rootScope.claims).Where('($.page=="learning_admin") || ($.page=="library_book" && $.action=="edit") || ($.page=="library_video" && $.action=="edit") || ($.page=="library_paper" && $.action=="edit")').FirstOrDefault();
        return exist ? true : false;
    };
    $rootScope.IsDocEditable = function () {
        var exist = Enumerable.From($rootScope.claims).Where('($.page=="learning_admin") || ($.page=="library_document" && $.action=="edit") ').FirstOrDefault();
        return exist ? true : false;
    };
    $rootScope.IsOnlyFlightView = function () {

        if ($rootScope.roles && $rootScope.roles.length == 1 && ($rootScope.roles[0] == 'Transport' || $rootScope.roles[0] == 'Station'))
            return true;
         
         var arr = Enumerable.From($rootScope.claims).Select('$.page').Distinct().ToArray();

        return arr.length==1 && arr[0]!='flight_admin' ? true : false;
        

    };
    $rootScope.HasAccessToFlightPocket = function () {
         
        var exist = Enumerable.From($rootScope.roleClaims).Where('$.indexOf("FlightPocket")!=-1').FirstOrDefault();
        return exist ? true : false;
    };
    $rootScope.HasAccessToBasePocket = function () {

        var exist = Enumerable.From($rootScope.roleClaims).Where('$.indexOf("BasePocket")!=-1').FirstOrDefault();
        return exist ? true : false;
    };
    $rootScope.HasAccessToLearningPocket = function () {

        var exist = Enumerable.From($rootScope.roleClaims).Where('$.indexOf("LearningPocket")!=-1').FirstOrDefault();
        return exist ? true : false;
    };
	$rootScope.HasAccessToQA = function () {
         
       var role = Enumerable.From($rootScope.roles).Where('$=="QA"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };
	 $rootScope.HasDepartmentManager = function () {
        
        var role = Enumerable.From($rootScope.roles).Where('$=="Department Manager"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };
	$rootScope.HasTrainingAdmin = function () {

        var role = Enumerable.From($rootScope.roles).Where('$=="BasePocket Admin"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };
    /////////////////////

    $rootScope.headerClasses = ['app-headerx', 'wrapper-bubble', 'col-lg-12', 'col-md-12', 'col-sm-12', 'col-xs-12'];
    //ati 1-14
    $rootScope.headerClassesMobile = ['app-headerx', 'wrapper-bubble', 'col-lg-12', 'col-md-12', 'col-sm-12', 'col-xs-12'];
    $rootScope.headerHeight = 81;
    $rootScope.detector = new MobileDetect(window.navigator.userAgent);
    if ($rootScope.detector.mobile())
        $rootScope.headerHeight = 55;
    
    /////////////////////////////////////

    
    authService.fillAuthData();
    authService.fillModuleData();

    $rootScope.setTheme = function () {
        //DevExpress.ui.themes.current($rootScope.theme);
        //$rootScope.headerClasses = ['app-headerx', 'wrapper-bubble', 'col-lg-12', 'col-md-12', 'col-sm-12', 'col-xs-12','hidden-xs'];
        //$rootScope.headerClasses.push($rootScope.class);

        ////ati 1-14
        //$rootScope.headerClassesMobile = ['app-headerx-mobile', 'wrapper-bubble', 'col-lg-12', 'col-md-12', 'col-sm-12', 'col-xs-12','hidden-lg', 'hidden-md', 'hidden-sm'];
        //$rootScope.headerClassesMobile.push($rootScope.class);

        try {
            //2021-12-15
            //upgrade dx
            var thm = $rootScope.theme.replace("-", ".");

            DevExpress.ui.themes.current(thm);
            $rootScope.headerClasses = ['app-headerx', 'wrapper-bubble', 'col-lg-12', 'col-md-12', 'col-sm-12', 'col-xs-12', 'hidden-xs', 'hidden-md', 'hidden-sm','hidden-xsm'];
            $rootScope.headerClasses.push($rootScope.class);
            //ati 1-14
            $rootScope.headerClassesMobile = ['app-headerx-mobile', 'wrapper-bubble', 'col-lg-12', 'col-md-12', 'col-sm-12', 'col-xs-12','col-xsm-12', 'hidden-lg', ];
            $rootScope.headerClassesMobile.push($rootScope.class);
        }
        catch (e) {
            //alert(e);
        }
       
    };
    /////////////////////////////
    $rootScope.getWindowSize  = function ( ) {
        var w = -1;
        var h = -1;
        var w = $(window).width()  ;
        var h = $(window).height()  ;
        

        return { width: w, height: h };
    };

    //////////////////////////
    $rootScope.setTheme();
    $rootScope.history = [];
    //nasiri
  $rootScope.getCertificateTypeList = function () {
        return ['SEPTP', 'SEPT', 'LPC', 'OPC', 'LPR', 'DG', 'CRM', 'CCRM', 'SMS', 'AVSEC', 'COLDWX', 'HOTWX', 'FIRSTAID', 'GRT', 'ANNUALRECURRENT', 'FMT','TRG02'
		 ,'Flight Crew Licence'
		 ,'IP'
		 , 'Medical Certificate'
		 ,'Crew Member Certificate'
		 ,'Passport'
		 ,'Line Check'
		];
    };
    $rootScope.getCertificateTypeListDetails = function () {
        return [
            { title: 'SEPTP', type: 1, issue: 'SEPTPIssueDate', expire: 'SEPTPExpireDate', caption: 'SEPT-P', RemField:'RemainSEPTP', },
            { title: 'SEPT', type: 2, issue: 'SEPTIssueDate', expire: 'SEPTIssueDate', caption: 'SEPT-T', RemField: 'RemainSEPT', },
            { title: 'LPC', type: 100, issue: 'ProficiencyCheckDate', expire: 'ProficiencyValidUntil', RemField: 'RemainProficiency',},
            { title: 'OPC', type: 101, issue: 'ProficiencyCheckDateOPC', expire: 'ProficiencyValidUntilOPC', RemField: 'RemainProficiencyOPC', },
            { title: 'LPR', type: 102, issue: '', expire: 'ICAOLPRValidUntil', RemField: 'RemainLPR', },
            { title: 'DG', type: 3, issue: 'DangerousGoodsIssueDate', expire: 'DangerousGoodsExpireDate', RemField: 'RemainDG', },
            { title: 'CRM', type: 4, issue: 'UpsetRecoveryTrainingIssueDate', expire: 'UpsetRecoveryTrainingExpireDate', RemField: 'RemainCRM',},
            { title: 'CCRM', type: 5, issue: 'CCRMIssueDate', expire: 'CCRMExpireDate', RemField: 'RemainCCRM', },
            { title: 'SMS', type: 6, issue: 'SMSIssueDate', expire: 'SMSIssueDate', RemField: 'RemainSMS', },
            { title: 'AVSEC', type: 7, issue: 'AviationSecurityIssueDate', expire: 'AviationSecurityExpireDate', RemField: 'RemainAvSec', },
            { title: 'COLDWX', type: 8, issue: 'ColdWeatherOperationIssueDate', expire: 'ColdWeatherOperationExpireDate', RemField: '',},
            { title: 'HOTWX', type: 9, issue: 'HotWeatherOperationIssueDate', expire: 'HotWeatherOperationExpireDate', RemField: '',},
            { title: 'FIRSTAID', type: 10, issue: 'FirstAidIssueDate', expire: 'FirstAidExpireDate', RemField: 'RemainFirstAid',},
            { title: 'GRT', type: 103, issue: 'DateCaoCardIssue', expire: 'DateCaoCardIssue', RemField: 'RemainCAO', },
            { title: 'ANNUALRECURRENT', type: 11, issue: 'RecurrentIssueDate', expire: 'RecurrentExpireDate', RemField: 'RemainRecurrent', },
            { title: 'FMT', type: 104, issue: 'EGPWSIssueDate', expire: 'EGPWSExpireDate', RemField: 'RemainEGPWS', },
			{ title: 'TRG02', type: 105, issue: 'LineIssueDate', expire: 'LineExpireDate', RemField: 'RemainNDT', },
			  { title: 'Flight Crew Licence', type: 10000, issue: 'Issue10000', expire: 'Expire10000', RemField: 'RemainLicence', },
				  {title:'IP',type:10001},
				  
				    { title: 'Medical Certificate', type: 10002, issue: 'Issue10002', expire: 'Expire10000', RemField: 'RemainMedical', },
					  {title:'Passport',type:10003,RemField: 'RemainPassport',},
					    {title:'Line Check',type:10004,RemField: 'RemainLine',},
							{title:'Crew Member Certificate',type:10005,RemField: 'RemainCMC',},
        ];
    };
    $rootScope.getCertificateTypeLisRemainingFields = function () {
        var ds = $rootScope.getCertificateTypeListDetails();
        return Enumerable.From(ds).Select('$.RemField').ToArray();
    };

    $rootScope.getSelectedRow = function (instance) {
        if (!instance)
            return null;
        var rows = instance.getSelectedRowsData();
        if (rows && rows.length > 0)
            return rows[0];
        return null;
    };
    $rootScope.getSelectedRows = function (instance) {
        if (!instance)
            return null;
        var rows = instance.getSelectedRowsData();
        if (rows && rows.length > 0)
            return rows ;
        return null;
    };
    $rootScope.getNextDate = function (interval, ctype, date) {
         
        if (!interval || !ctype || !date)
            return null;
        ctype = Number(ctype);
        var nextDate = new Date(date);
         
        //year
        if (ctype == 12) {
            nextDate = nextDate.setFullYear(nextDate.getFullYear() + interval);
            return nextDate;
        }
        //month
        if (ctype == 13) {
            nextDate = nextDate.setMonth(nextDate.getMonth() + interval);
            return nextDate;
        }
        //day
        if (ctype == 14) {
            nextDate = nextDate.setDate(nextDate.getDate() + interval);
            return nextDate;
        }
        return null;
    };
    $rootScope.$on('$routeChangeSuccess', function () {
        $rootScope.history.push($location.$$path);
       
    });
    //////////////////////////////////////////////
    $rootScope.DateBoxFormat = "dd-MMM-yyyy";
    //////////////////DataSources//////////////////
    $rootScope.AircraftTypes = null;
    $rootScope.MSNs = null;

    $rootScope.getDatasourceOption = function (pid) {
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/options/'+pid,
              //  key: "Id",
               // keyType: "Int32",
                version: 4
            }),
            //filter: ['ParentId', '=', pid],
            sort: ['OrderIndex', 'Title'],
        });
    };
    $rootScope.getDatasourceLibraryItemTypes = function () {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/options/' + '82',
                    //  key: "Id",
                    // keyType: "Int32",
                    // version: 4
                }),
             filter: ['Id', '<>', 86],
            sort: ['OrderIndex', 'Title'],
        });
    };
    $rootScope.getDatasourcePersonCourseStatus = function () {
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/options/personcoursestatus'  ,
                //  key: "Id",
                // keyType: "Int32",
                // version: 4
            }),
            //filter: ['ParentId', '=', pid],
            sort: ['OrderIndex', 'Title'],
        });
    };
    $rootScope.getDatasourceCityByCountry = function (cid) {
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/cities/country/' + cid,
                //  key: "Id",
                // keyType: "Int32",
                  version: 4
            }),
            //filter: ['ParentId', '=', pid],
            sort: ['City'],
        });
    };
    $rootScope.getDatasourceAirport = function () {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/airports/all'  ,
                    //  key: "Id",
                    // keyType: "Int32",
                    version: 4
                }),
            filter: ['IATA', '<>', '-'],
            sort: ['IATA'],
        });
    };
    $rootScope.getDatasourceRoutesFromAirport = function (id) {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/flights/routes/from/airline/' + id,
                    //  key: "Id",
                    // keyType: "Int32",
                    version: 4
                }),
            filter: ['IATA', '<>', '-'],
            sort: ['IATA'],
        });
    };
    $rootScope.getDatasourceRoutes = function (id) {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/flights/routes/airline/'+id,
                    //  key: "Id",
                    // keyType: "Int32",
                    version: 4
                }),
             
            sort: ['FromAirportIATA'],
        });
    };
    $rootScope.getDatasourceCountries = function () {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/countries/',
                    //  key: "Id",
                    // keyType: "Int32",
                    version: 4
                }),
            //filter: ['ParentId', '=', pid],
            sort: ['Name'],
        });
    };
    $rootScope.getDatasourceLoctionCustomer = function () {
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/locations/' + Config.CustomerId,
                //  key: "Id",
                // keyType: "Int32",
                // version: 4
            }),
            //filter: ['ParentId', '=', pid],
            sort: ['FullCode'],
        });
    };
    $rootScope.getDatasourceAircrafts = function () {
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/aircrafttypes/all'  ,
                //  key: "Id",
                // keyType: "Int32",
                version: 4
            }),
            //filter: ['ParentId', '=', pid],
            sort: ['Manufacturer','Type'],
        });
    };
    $rootScope.getDatasourceAuthors= function () {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/authors',
                    //  key: "Id",
                    // keyType: "Int32",
                    version: 4
                }),
            //filter: ['ParentId', '=', pid],
            sort: ['Name' ],
        });
    };
    $rootScope.getDatasourceCourseType = function () {
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/courses/types',
                //  key: "Id",
                // keyType: "Int32",
                version: 4
            }),
            //filter: ['ParentId', '=', pid],
            sort: ['Title'],
        });
    };
    $rootScope.getDatasourceCaoType = function () {
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/base/caotypes',
                //  key: "Id",
                // keyType: "Int32",
                version: 4
            }),
            //filter: ['ParentId', '=', pid],
            sort: ['Title'],
        });
    };
    $rootScope.getDatasourceAirline = function () {
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/base/airlines',
                //  key: "Id",
                // keyType: "Int32",
                version: 4
            }),
            //filter: ['ParentId', '=', pid],
            sort: ['Title'],
        });
    };
    $rootScope.getDatasourceRatingOrgs = function () {
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/base/ratingorganization',
                //  key: "Id",
                // keyType: "Int32",
                version: 4
            }),
            //filter: ['ParentId', '=', pid],
            sort: ['Title'],
        });
    };
    $rootScope.getDatasourcePublishers = function () {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/base/publishers',
                    //  key: "Id",
                    // keyType: "Int32",
                    version: 4
                }),
            //filter: ['ParentId', '=', pid],
            sort: ['Title'],
        });
    };
    
    $rootScope.getDatasourceJournals = function () {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/base/journals',
                    //  key: "Id",
                    // keyType: "Int32",
                    version: 4
                }),
            //filter: ['ParentId', '=', pid],
            sort: ['Title'],
        });
    };
    $rootScope.getDatasourceCurrencies = function () {
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/base/currencies',
                //  key: "Id",
                // keyType: "Int32",
                version: 4
            }),
            //filter: ['ParentId', '=', pid],
            sort: ['Title'],
        });
    };
    $rootScope.getDatasourceGroups = function () {
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/base/jobgroups/'+ Config.CustomerId,
                //  key: "Id",
                // keyType: "Int32",
                version: 4
            }),
            //filter: ['ParentId', '=', pid],
            sort: ['FullCode'],
        });
    };

    $rootScope.getDatasourceFolders = function () {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/base/library/folders/' + Config.CustomerId,
                    //  key: "Id",
                    // keyType: "Int32",
                    version: 4
                }),
            //filter: ['ParentId', '=', pid],
            sort: ['Fullcode'],
        });
    };

    $rootScope.getDatasourceFlightsAcTypes = function (cid) {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/flights/actypes/' + cid,
                    version: 4
                }),
            
            sort: ['Title'],
        });
    };
    $rootScope.getDatasourceFlightsRegisters = function (cid) {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/flights/registers/' + cid,
                    version: 4
                }),

            sort: ['Title'],
        });
    };
    $rootScope.getDatasourceFlightsFrom = function (cid) {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/flights/from/' + cid,
                    version: 4
                }),

            sort: ['Title'],
        });
    };
    $rootScope.getDatasourceFlightsTo = function (cid) {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/flights/to/' + cid,
                    version: 4
                }),

            sort: ['Title'],
        });
    };
    $rootScope.getDatasourceFlightPermits = function () {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/flights/plan/permits/',
                    //  key: "Id",
                    // keyType: "Int32",
                    version: 4
                }),
          
            sort: ['Title'],
        });
    };
    $rootScope.getDatasourceDelayCategory = function () {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/flights/delaycodecats/',
                    //  key: "Id",
                    // keyType: "Int32",
                    version: 4
                }),

            sort: ['Title'],
        });
    };
    //vahid new
    $rootScope.getDatasourceIP = function () {
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/crew/ip'  ,
                //  key: "Id",
                // keyType: "Int32",
                version: 4
            }),
            //filter: ['ParentId', '=', pid],
            sort: ['ScheduleName' ],
        });
    };
    //vahid new
    $rootScope.getDatasourceCaptain = function () {
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/crew/captain',
                //  key: "Id",
                // keyType: "Int32",
                version: 4
            }),
            //filter: ['ParentId', '=', pid],
            sort: ['ScheduleName'],
        });
    };

    //training
    $rootScope.getDatasourceCertificateTypes = function () {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: serviceBaseTRN + 'api/certificate/types/query',
                    //  key: "Id",
                    // keyType: "Int32",
                    //version: 4
                }),
            //filter: ['ParentId', '=', pid],
            sort: ['Title'],
        });
    };
    $rootScope.getDatasourceCourseTypeNew = function () {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: serviceBaseTRN + 'api/course/types/query', 
                    //  key: "Id",
                    // keyType: "Int32" ,
                    
                }),
            //filter: ['ParentId', '=', pid],
            sort: ['Title'],
        });
    };
    ///////////////////////////////////////////////
    $rootScope.getSbTemplateAirport = function (data) {
        var tmpl =
            "<div>"
            + "<div class='tmpl-col-left' style='width:30%'>" + data.IATA + "</div>"
            + "<div class='tmpl-col-right' style='width:20%'>" + data.SortName + "</div>"
            + "<div class='tmpl-col-right'>" + data.City + "</div>"


            + "</div>";
        return tmpl;
       
    };
    $rootScope.getSbTemplateRouteTo = function (data) {
        var tmpl =
            "<div>"
            + "<div class='tmpl-col-left' style='width:30%'>" + data.ToAirportIATA + "</div>"
            + "<div class='tmpl-col-right' style='width:20%'>" + data.ToSortName + "</div>"
            + "<div class='tmpl-col-right'>" + data.ToCity + "</div>"


            + "</div>";
        return tmpl;

    };
    $rootScope.getSbTemplateRoute = function (data) {
        var tmpl =
            "<div>"
            + "<div class='tmpl-col-left'>" + data.FromAirportIATA + "</div>"
            + "<div class='tmpl-col-right'>" + data.ToAirportIATA + "</div>"


            + "</div>";
        return tmpl;

    };
    $rootScope.getSbTemplateLocation = function (data) {
        var tmpl =
            "<div>"
            + "<div class='tmpl-col-left'>" + data.TitleFormated + "</div>"
            + "<div class='tmpl-col-right'>" + data.FullCode + "</div>"


            + "</div>";
        return tmpl;
    };
    $rootScope.getSbTemplateLocation2 = function (data) {
        var tmpl =
            "<div>" + data.TitleFormated
             


            + "</div>";
        return tmpl;
    };
    $rootScope.getSbTemplateGroup = function (data) {
        var tmpl =
            "<div>" + data.TitleFormated



            + "</div>";
        return tmpl;
    };
    $rootScope.getSbTemplateAircraft = function (data) {
        var tmpl =
            "<div>"
            + "<div class='tmpl-col-left'>" + data.Type + "</div>"
            + "<div class='tmpl-col-right'>" + data.Manufacturer + "</div>"


            + "</div>";
        return tmpl;
    };
    //////////////////////////////////////////////////////
    $rootScope.goProfile = function () {
        $rootScope.navigatefirstlogin();
    }
    ////////////////////////////////////////////////
    $rootScope.colorSet1 = [
        '#ff7b25',
        '#80ced6',
        '#eca1a6',
        '#6b5b95',
        '#e3eaa7',
        '#86af49',
        '#ffff4d',
        '#3399ff',
        
        '#feb236',
        '#b5e7a0',
        '#d64161',
        '#00ff00',
       

       

        '#bdcebe',
       
        '#c1946a',
        '#034f84',
        '#c94c4c',
        '#92a8d1',
        '#50394c',
        
        '#4040a1',
        '#622569',
        '#eeac99',
        '#588c7e',
        '#ffcc5c',
        '#a2836e',
        '#87bdd8',
        '#CC00CC',
        '#00FF00',
        '#03A9F4',
        '#607D8B',
        '#9966FF',
        '#00FF99',
        '#0099CC',
        '#AD1457',
    ];

    $rootScope.colorSet2 = [
        '#0099cc',
       // '#66b3ff',
       
        '#00cc99',
        '#cc0052',
        '#cc7a00',

        '#9900cc',
        '#558000',
        '#996633',
        '#00cccc',



    ];
    $rootScope.colorSetLight = [
        '#d9d9d9',
        '#ffe6cc',
        '#e0e0d1',
        '#d1e0e0',
        '#d1d1e0',
        '#f2d9e6',

    ];
    $rootScope.colorSet3 = [
        '#00ace6',
        '#339966',

        '#ff0066',
        '#ff9900',

        '#bf00ff',
        '#77b300',
        '#bf8040',
        '#00ffff',



    ];

    $rootScope.colorSetChart = [
        '#ffcccc',
        '#d9d9d9',

        '#4dd2ff',
        '#66ff99',

        '#ff99ff',
        '#66ffe0',
         
    ];
    $rootScope.colorSetChart2 = [
        '#4dffd2',
        '#cccccc',

        '#b3ccff',
        '#ffd699',

        '#ff99ff',
        '#66ffe0',

    ];


    $rootScope.getColorFromSet = function (n) {
        //0 based
        if (n > $rootScope.colorSet1.length - 1)
            n = n % ($rootScope.colorSet1.length - 1);
        return $rootScope.colorSet1[n];
    };
    $rootScope.getColorFromSet1 = function (n) {
        //0 based
        if (n > $rootScope.colorSet1.length - 1)
            n = n % ($rootScope.colorSet1.length - 1);
        return $rootScope.colorSet1[n];
    };
    $rootScope.getColorFromSet2 = function (n) {
        //0 based
        if (n > $rootScope.colorSet2.length - 1)
            n = n % ($rootScope.colorSet2.length - 1);
        return $rootScope.colorSet2[n];
    };
    $rootScope.getColorFromSetLight = function (n) {
        //0 based
        if (n > $rootScope.colorSetLight.length - 1)
            n = n % ($rootScope.colorSetLight.length - 1);
        return $rootScope.colorSetLight[n];
    };
    $rootScope.getColorFromSet3 = function (n) {
        //0 based
        if (n > $rootScope.colorSet3.length - 1)
            n = n % ($rootScope.colorSet3.length - 1);
        return $rootScope.colorSet3[n];
    };


    $rootScope.colorSetRed = [
        '#ff3300',
        

        '#e68a00',
        


        '#ff33cc',
       

        '#802000',
        

        '#e6e600',
        '#800060',

    ];
    $rootScope.colorSetGreen = [
        '#00cc00', 
        '#339966',
         
        
        '#00cca3',

        
        '#006666',

       
        '#00ccff',





    ];
    $rootScope.colorSetGray = [
        '#b3b3b3',
        '#b3b3cc',
        '#b3cccc',
        '#666666',
        

    ];
    $rootScope.getColorFromSetRed  = function (n) {
        //0 based
        if (n > $rootScope.colorSetRed .length - 1)
            n = n % ($rootScope.colorSetRed .length - 1);
        return $rootScope.colorSetRed [n];
    };
    $rootScope.getColorFromSetGreen = function (n) {
        //0 based
        if (n > $rootScope.colorSetGreen.length - 1)
            n = n % ($rootScope.colorSetGreen.length - 1);
        return $rootScope.colorSetGreen[n];
    };
    $rootScope.getColorFromSetGray = function (n) {
        //0 based
        if (n > $rootScope.colorSetGray.length - 1)
            n = n % ($rootScope.colorSetGray.length - 1);
        return $rootScope.colorSetGray[n];
    };
    ////////////////////////////////////////////////
}]);



(function (global) {
    var MONTHS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    var COLORS = [
        '#4dc9f6',
        '#f67019',
        '#f53794',
        '#537bc4',
        '#acc236',
        '#166a8f',
        '#00a950',
        '#58595b',
        '#8549ba'
    ];

    var Samples = global.Samples || (global.Samples = {});
    var Color = global.Color;

    Samples.utils = {
        // Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
        srand: function (seed) {
            this._seed = seed;
        },

        rand: function (min, max) {
            var seed = this._seed;
            min = min === undefined ? 0 : min;
            max = max === undefined ? 1 : max;
            this._seed = (seed * 9301 + 49297) % 233280;
            return min + (this._seed / 233280) * (max - min);
        },

        numbers: function (config) {
            var cfg = config || {};
            var min = cfg.min || 0;
            var max = cfg.max || 1;
            var from = cfg.from || [];
            var count = cfg.count || 8;
            var decimals = cfg.decimals || 8;
            var continuity = cfg.continuity || 1;
            var dfactor = Math.pow(10, decimals) || 0;
            var data = [];
            var i, value;

            for (i = 0; i < count; ++i) {
                value = (from[i] || 0) + this.rand(min, max);
                if (this.rand() <= continuity) {
                    data.push(Math.round(dfactor * value) / dfactor);
                } else {
                    data.push(null);
                }
            }

            return data;
        },

        labels: function (config) {
            var cfg = config || {};
            var min = cfg.min || 0;
            var max = cfg.max || 100;
            var count = cfg.count || 8;
            var step = (max - min) / count;
            var decimals = cfg.decimals || 8;
            var dfactor = Math.pow(10, decimals) || 0;
            var prefix = cfg.prefix || '';
            var values = [];
            var i;

            for (i = min; i < max; i += step) {
                values.push(prefix + Math.round(dfactor * i) / dfactor);
            }

            return values;
        },

        months: function (config) {
            var cfg = config || {};
            var count = cfg.count || 12;
            var section = cfg.section;
            var values = [];
            var i, value;

            for (i = 0; i < count; ++i) {
                value = MONTHS[Math.ceil(i) % 12];
                values.push(value.substring(0, section));
            }

            return values;
        },

        color: function (index) {
            return COLORS[index % COLORS.length];
        },

        transparentize: function (color, opacity) {
            var alpha = opacity === undefined ? 0.5 : 1 - opacity;
            return Color(color).alpha(alpha).rgbString();
        }
    };

    // DEPRECATED
    window.randomScalingFactor = function () {
        return Math.round(Samples.utils.rand(-100, 100));
    };

    // INITIALIZATION

    Samples.utils.srand(Date.now());

    // Google Analytics
    /* eslint-disable */
    if (document.location.hostname.match(/^(www\.)?chartjs\.org$/)) {
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date(); a = s.createElement(o),
                m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
        ga('create', 'UA-28909194-3', 'auto');
        ga('send', 'pageview');
    }
    /* eslint-enable */

}(this));
 
 
app.factory('DataService', [function () {
    var hazards = [
        {
            id: 1,
            code: 'H-00023',
            title: 'Bird strike on approach to OIII',
            summary: 'Risk of bird strike during approach and landing at OIII due to wildlife activity in the vicinity of the airport.',
            ownerDept: 'Flight Safety',
            status: 'In progress',
            initialRisk: 'High',
            residualRisk: 'Medium',
            keyDriver: 'Bird activity and runway proximity to wildlife habitats.'
        },
        {
            id: 2,
            code: 'H-00041',
            title: 'Ramp collision risk during pushback',
            summary: 'Risk of collision between aircraft and ground equipment or vehicles during pushback at OIMM.',
            ownerDept: 'Ground Operations',
            status: 'Open',
            initialRisk: 'High',
            residualRisk: 'Medium',
            keyDriver: 'Complex ramp layout and variable experience of ramp staff.'
        }
    ];

    var hazardSources = [
        {
            id: 1,
            hazardId: 1,
            methodCode: 'OCC',
            methodTitle: 'Occurrence report',
            refCode: 'ASR-2025-00123',
            refTitle: 'Bird strike on final OIII RWY29',
            refModule: 'Occurrences',
            dateIdentified: '2025-02-10',
            isPrimary: true,
            note: ''
        },
        {
            id: 2,
            hazardId: 1,
            methodCode: 'AUD',
            methodTitle: 'Internal audit',
            refCode: 'AUD-2025-03',
            refTitle: 'Internal safety audit – Flight Ops',
            refModule: 'Audit',
            dateIdentified: '2025-03-14',
            isPrimary: false,
            note: ''
        },
        {
            id: 3,
            hazardId: 2,
            methodCode: 'AUD',
            methodTitle: 'Internal audit',
            refCode: 'AUD-2025-05',
            refTitle: 'Internal audit – Ground operations OIMM',
            refModule: 'Audit',
            dateIdentified: '2025-05-18',
            isPrimary: true,
            note: ''
        }
    ];

    var hazardIdentificationMethods = [
        { code: 'OCC', title: 'Occurrence report' },
        { code: 'AUD', title: 'Internal / external audit' },
        { code: 'MOC', title: 'MOC risk assessment' },
        { code: 'MEET', title: 'Safety meeting / review' },
        { code: 'STUDY', title: 'Study / analysis' }
    ];

    var riskAssessments = [
        {
            id: 1,
            hazardId: 1,
            assessmentNo: 'RA-2025-001',
            date: '2025-02-10',
            initial: 'High',
            residual: 'Medium',
            initialIndex: '4B',
            residualIndex: '2C',
            acceptability: 'Acceptable with controls'
        },
        {
            id: 2,
            hazardId: 2,
            assessmentNo: 'RA-2025-002',
            date: '2025-05-20',
            initial: 'Medium',
            residual: 'Low',
            initialIndex: '3C',
            residualIndex: '2D',
            acceptability: 'Acceptable'
        }
    ];

    var hazardActions = [
        {
            id: 1,
            hazardId: 1,
            actionNo: 'HA-2025-001',
            action: 'Implement wildlife hazard management plan at OIII in coordination with airport operator.',
            type: 'Preventive',
            owner: 'Flight Safety',
            targetDate: '2025-06-30',
            status: 'In progress'
        },
        {
            id: 2,
            hazardId: 1,
            actionNo: 'HA-2025-002',
            action: 'Issue flight crew briefing on bird strike risk and final approach procedures.',
            type: 'Preventive',
            owner: 'Flight Operations',
            targetDate: '2025-05-31',
            status: 'Implemented'
        },
        {
            id: 3,
            hazardId: 2,
            actionNo: 'HA-2025-003',
            action: 'Update ramp marshalling and pushback procedure and provide refresher training.',
            type: 'Corrective',
            owner: 'Ground Operations',
            targetDate: '2025-07-15',
            status: 'In progress'
        }
    ];

    var hazardMonitoring = [
        {
            id: 1,
            hazardId: 1,
            indicator: 'Bird strike rate per 1,000 flights on OIII arrivals',
            method: 'Trend of occurrence reports + internal safety audit + meetings with airport wildlife control.',
            frequency: 'Monthly',
            lastReview: '2025-06-01',
            nextReview: '2025-09-01',
            conclusion: 'Risk reduced from High to Medium; controls appear effective but remain under close monitoring.'
        },
        {
            id: 2,
            hazardId: 2,
            indicator: 'Ramp incidents related to pushback and marshalling per 10,000 movements',
            method: 'Ramp inspections, ground safety reports, internal audits.',
            frequency: 'Quarterly',
            lastReview: '2025-05-31',
            nextReview: '2025-08-31',
            conclusion: 'Initial actions implemented; further monitoring required to confirm sustained improvement.'
        }
    ];

    var occurrences = [
        {
            id: 1,
            date: '2025-02-10',
            ref: 'ASR-2025-00123',
            type: 'Bird strike on approach',
            hazardId: 1,
            hazardSummary: 'Bird strike on approach to OIII',
            severity: 'Minor damage',
            status: 'Closed'
        },
        {
            id: 2,
            date: '2025-02-18',
            ref: 'ASR-2025-00145',
            type: 'Bird strike – engine ingestion',
            hazardId: 1,
            hazardSummary: 'Bird strike on approach to OIII',
            severity: 'Significant',
            status: 'Closed'
        },
        {
            id: 3,
            date: '2025-05-10',
            ref: 'GSR-2025-00031',
            type: 'Ramp incident – pushback clearance',
            hazardId: 2,
            hazardSummary: 'Ramp collision risk during pushback',
            severity: 'Near miss',
            status: 'Open'
        }
    ];

    var mocs = [
        {
            id: 1,
            mocNo: 'MOC-2025-001',
            title: 'Wildlife hazard management programme at OIII',
            status: 'In progress',
            requestedBy: 'Flight Safety',
            reason: 'Risk of bird strike on approach to OIII; need for structured wildlife hazard management.',
            hazardIds: [1]
        }
    ];

    var audits = [
        {
            id: 1,
            auditNo: 'AUD-2025-03',
            auditType: 'INTERNAL',
            title: 'Internal safety audit – Flight Operations Q1/2025',
            scope: 'Flight operations, bird control measures, approach procedures at OIII',
            objective: 'Verify effectiveness of bird strike risk controls and compliance with company flight operations manual and CAO.IRI Air OPS.',
            standards: 'Company OM-A Chapter 8; CAO.IRI Air OPS CAT; SMS Manual Section 5 (Safety assurance).',
            dept: 'Flight Safety',
            location: 'OIII – Tehran Mehrabad',
            leadAuditor: 'Safety Manager Flight Ops',
            team: 'Senior safety officer, FO line training captain',
            startDate: '2025-03-10',
            endDate: '2025-03-14',
            status: 'Closed'
        },
        {
            id: 2,
            auditNo: 'AUD-2025-05',
            auditType: 'INTERNAL',
            title: 'Internal audit – Ground operations OIMM',
            scope: 'Ramp safety, pushback procedures, marshalling',
            objective: 'Assess ground handling conformity with ground operations manual and ramp safety procedures.',
            standards: 'Ground Operations Manual; CAO.IRI Air OPS; Part-145 interfaces.',
            dept: 'Quality Assurance',
            location: 'OIMM – Mashhad',
            leadAuditor: 'Quality Manager',
            team: 'QA auditor, Ground ops representative',
            startDate: '2025-05-15',
            endDate: '2025-05-18',
            status: 'Open'
        }
    ];

    var auditFindings = [
        {
            id: 1,
            auditId: 1,
            findingNo: 'F-01',
            title: 'Inadequate bird control programme at OIII',
            severity: 'Major',
            status: 'Open',
            dueDate: '2025-06-30',
            hazardIds: [1],
            actionPlan: 'Implement enhanced bird control programme, formal wildlife hazard management plan and regular coordination with airport operator.',
            actionOwner: 'Flight Safety Manager / Airport coordination focal point',
            actionTargetDate: '2025-06-30',
            followUpStatus: 'In progress',
            followUpDate: '2025-07-30',
            effectivenessNote: 'Effectiveness to be verified via follow-up audit and trend in bird-strike occurrences.'
        },
        {
            id: 2,
            auditId: 2,
            findingNo: 'F-02',
            title: 'Ramp marshalling and pushback not fully in line with procedures',
            severity: 'Minor',
            status: 'Open',
            dueDate: '2025-07-15',
            hazardIds: [2],
            actionPlan: 'Update ramp safety procedures, refresh marshalling and pushback training and introduce on-the-job supervision checks.',
            actionOwner: 'Ground Operations Manager',
            actionTargetDate: '2025-07-15',
            followUpStatus: 'Planned',
            followUpDate: '2025-09-01',
            effectivenessNote: 'Monitoring via ramp inspections and safety reports; effectiveness not yet evaluated.'
        }
    ];

    return {
        getHazards: function () {
            return hazards;
        },
        getHazardById: function (id) {
            return hazards.find(function (h) { return h.id === id; });
        },
        saveHazard: function (hazard) {
            if (!hazard.id) {
                hazard.id = hazards.length + 1;
                hazards.push(hazard);
            } else {
                var idx = hazards.findIndex(function (h) { return h.id === hazard.id; });
                if (idx >= 0) hazards[idx] = hazard;
            }
            return hazard;
        },
        getHazardSources: function (hazardId) {
            return hazardSources.filter(function (s) { return s.hazardId === hazardId; });
        },
        saveHazardSources: function (hazardId, sources) {
            for (var i = hazardSources.length - 1; i >= 0; i--) {
                if (hazardSources[i].hazardId === hazardId) {
                    hazardSources.splice(i, 1);
                }
            }
            sources.forEach(function (s, idx) {
                s.id = idx + 1;
                s.hazardId = hazardId;
                hazardSources.push(s);
            });
        },
        getHazardIdentificationMethods: function () {
            return hazardIdentificationMethods;
        },
        getRiskAssessmentsByHazardId: function (hazardId) {
            return riskAssessments.filter(function (r) { return r.hazardId === hazardId; });
        },
        getHazardActionsByHazardId: function (hazardId) {
            return hazardActions.filter(function (a) { return a.hazardId === hazardId; });
        },
        getHazardMonitoringByHazardId: function (hazardId) {
            return hazardMonitoring.filter(function (m) { return m.hazardId === hazardId; });
        },
        getOccurrences: function () {
            return occurrences;
        },
        getOccurrenceById: function (id) {
            return occurrences.find(function (o) { return o.id === id; });
        },
        getOccurrencesByHazardId: function (hazardId) {
            return occurrences.filter(function (o) { return o.hazardId === hazardId; });
        },
        getOccurrenceCountByHazardId: function (hazardId) {
            return occurrences.filter(function (o) { return o.hazardId === hazardId; }).length;
        },
        getMocs: function () {
            return mocs;
        },
        getMocById: function (id) {
            return mocs.find(function (m) { return m.id === id; });
        },
        getHazardsByIds: function (ids) {
            return hazards.filter(function (h) { return ids.indexOf(h.id) !== -1; });
        },
        getAudits: function () {
            return audits;
        },
        getAuditById: function (id) {
            return audits.find(function (a) { return a.id === id; });
        },
        getAuditFindingsByAuditId: function (auditId) {
            return auditFindings.filter(function (f) { return f.auditId === auditId; });
        }
    };
}]);