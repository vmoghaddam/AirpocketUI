 
var app = angular.module('GriffinApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar', 'dx', 'ngSanitize', 'ngAnimate' ]).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]);
 
 
app.config(function ($routeProvider) {
    var version = 856;
    //ati new 2
    $routeProvider.when("/cp", {
        controller: "firstLoginController",
        templateUrl: "/app/views/firstlogin.html?v=100"
    });

    
     
    $routeProvider.when("/apps", {
        controller: "appsController",
        templateUrl: "/app/views/apps.html?v=" + version
    });
    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/home.html?v="+"672"
    });
    $routeProvider.when("/home/:year/:month/:day", {
        controller: "homeController",
        templateUrl: "/app/views/home.html?v=" + "1067"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/app/views/login.html?v=" + version
    });

    

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "/app/views/signup.html?v=" + version
    });

    $routeProvider.when("/orders", {
        controller: "ordersController",
        templateUrl: "/app/views/orders.html?v=" + version
    });

    $routeProvider.when("/refresh", {
        controller: "refreshController",
        templateUrl: "/app/views/refresh.html?v=" + version
    });

    $routeProvider.when("/tokens", {
        controller: "tokensManagerController",
        templateUrl: "/app/views/tokens.html?v=" + version
    });

    $routeProvider.when("/associate", {
        controller: "associateController",
        templateUrl: "/app/views/associate.html?v=" + version
    });

    $routeProvider.when("/test", {
        controller: "testController",
        templateUrl: "/app/views/test.html?v=" + version
    });

    $routeProvider.when("/airport", {
        controller: "airportController",
        templateUrl: "/app/views/airport.html?v=" + version,
        isDispatch: false,
    });
    $routeProvider.when("/dispatch/airport", {
        controller: "airportController",
        templateUrl: "/app/views/airport.html?v=" + version,
        isDispatch: true,
    });

    $routeProvider.when("/aircrafttype", {
        controller: "aircraftTypeController",
        templateUrl: "/app/views/aircrafttype.html?v=" + version
    });
    $routeProvider.when("/location", {
        controller: "locationController",
        templateUrl: "/app/views/location.html?v=" + version
    });
    $routeProvider.when("/jobgroup", {
        controller: "jobgroupController",
        templateUrl: "/app/views/jobgroup.html?v=" + version
    });

    $routeProvider.when("/person", {
        controller: "personController",
        templateUrl: "/app/views/person.html?v=" + "42112402"
    });
	 $routeProvider.when("/person/crew", {
        controller: "personController",
        templateUrl: "/app/views/person.html?v=" + "412214012",
        isCrew:true,
    });
    $routeProvider.when("/person/course", {
        controller: "personcourseController",
        templateUrl: "/app/views/personcourse.html?v=" + version
    });
     
    $routeProvider.when("/person/book", {
        controller: "personbookController",
        templateUrl: "/app/views/personbook.html?v=" + version
    });

    $routeProvider.when("/person/certificate", {
        controller: "personcertificateController",
        templateUrl: "/app/views/personcertificate.html?v=" + version
    });

    $routeProvider.when("/course", {
        controller: "courseController",
        templateUrl: "/app/views/course.html?v=" + version
    });
    $routeProvider.when("/course/person", {
        controller: "coursepersonController",
        templateUrl: "/app/views/courseperson.html?v=" + version
    });
    $routeProvider.when("/course/type", {
        controller: "courseTypeController",
        templateUrl: "/app/views/coursetype.html?v=" + version
    });
    $routeProvider.when("/flight/board", {
         controller: "boardController",
        templateUrl: "/app/views/board.html?v=" + "222",
        isAdmin: true,
    });
	$routeProvider.when("/flight/board/old", {
        controller: "flightBoardController",
        templateUrl: "/app/views/flightboard.html?v=" + "30311"
    });
    $routeProvider.when("/plan/board", {
        controller: "planBoardController",
        templateUrl: "/app/views/planningboard.html?v=" + version
    });
   // $routeProvider.when("/flight/board/ceo", {
        //controller: "ceoFlightBoardController",
        //templateUrl: "/app/views/ceoflightboard.html?v=" + version
//		 controller: "gntController",
  //      templateUrl: "/app/views/gnt.html?v=" + "1500"
   // });
	 $routeProvider.when("/board/ceo", {
        
		 controller: "gntController",
        templateUrl: "/app/views/gnt.html?v=" + "1500"
    });
    $routeProvider.when("/flight/board/all", {
        controller: "flightBoardAllController",
        templateUrl: "/app/views/flightboardall.html?v=" + version
    });
    $routeProvider.when("/dispatch/flights/:airport/:admin", {
        controller: "flightBoardAllController",
        templateUrl: "/app/views/flightboardall.html?v=" + version,
        isDispatch: true,
    });
    $routeProvider.when("/maintenance/flights", {
        controller: "flightPlansMaintenanceController",
        templateUrl: "/app/views/flightPlansMaintenance.html?v=" + version
    });

    $routeProvider.when("/maintenance/flights/calendar", {
        controller: "flightPlansCalendarMaintenanceController",
        templateUrl: "/app/views/flightPlansCalendarMaintenance.html?v=" + version
    });


    $routeProvider.when("/maintenance/registers/assign", {
        controller: "planRegistersController",
        templateUrl: "/app/views/planRegisters.html?v=" + version
    });
    $routeProvider.when("/maintenance/flights/registers", {
        controller: "changeFlightRegisterController",
        templateUrl: "/app/views/changeflightregister.html?v=" + version
    });
    //$routeProvider.when("/flight/plan/register/:id", {
    //    controller: "flightPlanRegsiterController",
    //    templateUrl: "/app/views/flightplanregister.html"
    //});

    $routeProvider.when("/library", {
        controller: "libraryController",
        templateUrl: "/app/views/library.html?v=120180",
        isDocument:false,
    });
    $routeProvider.when("/library/people", {
        controller: "libraryController",
        templateUrl: "/app/views/librarypeople.html?v=" + version,
        isDocument: false,
    });
    $routeProvider.when("/library/:type/:publisher/:author", {
        controller: "libraryController",
        templateUrl: "/app/views/library.html?v=11200",
        isDocument: false,
    });
    $routeProvider.when("/option/:parent", {
        controller: "optionController",
        templateUrl: "/app/views/option.html?v=" + version,
         
    });

    $routeProvider.when("/document", {
        controller: "libraryController",
        templateUrl: "/app/views/document.html?v=" + version,
        isDocument: true,
    });

    $routeProvider.when("/publisher", {
        controller: "organizationController",
        templateUrl: "/app/views/organization.html?v=" + version,
        TypeId: 77,
    });
    $routeProvider.when("/author", {
        controller: "personmiscController",
        templateUrl: "/app/views/personmisc.html?v=" + version,
        TypeId: 75,
    });
   
    $routeProvider.when("/journal", {
        controller: "journalController",
        templateUrl: "/app/views/journal.html?v=" + version,
        TypeId: 1,
    });
    $routeProvider.when("/conference", {
        controller: "journalController",
        templateUrl: "/app/views/journal.html?v=" + version,
        TypeId: 2,
    });
    $routeProvider.when("/notification", {
        controller: "notificationController",
        templateUrl: "/app/views/notification.html?v=" + version,
        
    });
    $routeProvider.when("/flight", {
        controller: "flightController",
        templateUrl: "/app/views/flight.html?v=" + version,

    });
   


    


    $routeProvider.when("/flight/archive", {
        controller: "flightListController",
        templateUrl: "/app/views/flightlist.html?v=" + version,
        type:-1,

    });
    $routeProvider.when("/flight/archive/:airport", {
        controller: "flightListController",
        templateUrl: "/app/views/flightlist.html?v=" + version,
        type: -1,

    });

    
    $routeProvider.when("/maintenance/flights/irregular", {
        controller: "irregularFlightController",
        templateUrl: "/app/views/irregularflight.html?v=" + version,
        type: 2,

    });
    
    $routeProvider.when("/flight/plans/closed", {
        controller: "flightPlanViewController",
        templateUrl: "/app/views/flightplanview.html?v=" + version,
        type: 50,

    });
    $routeProvider.when("/commercial/flights/irregular", {
        controller: "irregularFlightController",
        templateUrl: "/app/views/irregularflight.html?v=" + version,
        type: 1,

    });
    $routeProvider.when("/commercial/flights/plannig", {
        //controller: "flightController",
        //templateUrl: "/app/views/flight.html",
        controller: "flightPlanningController",
        templateUrl: "/app/views/flightPlanning.html?v=" + version,

    });
    $routeProvider.when("/commercial/plans/permits", {
        //controller: "flightPlanViewController",
        //templateUrl: "/app/views/flightplanview.html",
         controller: "flightPlanPermitController",
        templateUrl: "/app/views/flightplanpermit.html?v=" + version,
        //type: 50,

    });
    $routeProvider.when("/commercial/plans/crew", {
         
        controller: "flightPlanCrewController",
        templateUrl: "/app/views/flightPlanCrew.html?v=" + version,
        //type: 50,

    });
    $routeProvider.when("/commercial/plans/apply", {
        //controller: "flightPlanApplyController",
        //templateUrl: "/app/views/flightplanapply.html",
        controller: "flightPlanApply2Controller",
        templateUrl: "/app/views/flightplanapply2.html?v=" + version,

    });
    $routeProvider.when("/commercial/plans", {
        controller: "flightPlanListController",
        templateUrl: "/app/views/flightplanlist.html?v=" + version,


    });

    $routeProvider.when("/crewtest", {
        controller: "crewtestController",
        templateUrl: "/app/views/crewtest.html?v=" + version
    });
    $routeProvider.when("/crew/assign/cockpit", {
        controller: "crewassignController",
        templateUrl: "/app/views/crewassign.html?v=" + version,
        isCockpit: true,
    });
    $routeProvider.when("/crew/assign/cabin", {
        controller: "crewassignController",
        templateUrl: "/app/views/crewassign.html?v=" + version,
        isCockpit: false,
    });
    $routeProvider.when("/crew/assign/timeline/cabin", {
        controller: "crewassign2Controller",
        templateUrl: "/app/views/crewassign2.html?v=" + version,
        isCockpit: false,
    });
    $routeProvider.when("/crew/assign/timeline/cockpit", {
        controller: "crewassign2Controller",
        templateUrl: "/app/views/crewassign2.html?v=" + version,
        isCockpit: true,
    });
    $routeProvider.when("/crew/assign2", {
        controller: "crewassign2Controller",
        templateUrl: "/app/views/crewassign2.html?v=" + version
    });
    $routeProvider.when("/crew/report", {
        controller: "crewReportController",
        templateUrl: "/app/views/crewReport.html?v=" + version
    });
    
    $routeProvider.when("/fuel/report", {
        controller: "fuelReportController",
        templateUrl: "/app/views/fuelReport.html?v=" + version
    });
    $routeProvider.when("/delays/report", {
        controller: "flightDelaysController",
        templateUrl: "/app/views/flightDelays.html?v=" + version
    });

    $routeProvider.when("/matchinglist", {
        controller: "mlistController",
        templateUrl: "/app/views/mlist.html?v=" + version,
        TypeId: 75,
    });

    $routeProvider.when("/commercial/planning", {
        //controller: "flightController",
        //templateUrl: "/app/views/flight.html",
        controller: "planController",
        templateUrl: "/app/views/plan.html?v=" + "1002",

    });
    //$routeProvider.when("/crew/assign", {
    //    controller: "crewtestController",
    //    templateUrl: "/app/views/crewtest.html"
    //});
    $routeProvider.when("/flight/report/security", {
        controller: "flightReportSecurityController",
        templateUrl: "/app/views/flightreportsecurity.html?v=" + version
    });
    $routeProvider.when("/reg/availability", {
        controller: "regAvailabilityController",
        templateUrl: "/app/views/regAvailability.html?v=" + version
    });
    $routeProvider.when("/route", {
        controller: "routeController",
        templateUrl: "/app/views/route.html",
        isDispatch: false,
    });
    $routeProvider.when("/delay/codes", {
        controller: "delayCodesController",
        templateUrl: "/app/views/delayCodes.html?v=" + version,
        isDispatch: false,
    });

    $routeProvider.when("/crew/assign/reg/cockpit", {
        controller: "crewassignregController",
        templateUrl: "/app/views/crewassignreg.html?v=" + version,
        isCockpit: true,
    });
    $routeProvider.when("/crew/assign/reg/cabin", {
        controller: "crewassignregController",
        templateUrl: "/app/views/crewassignreg.html?v=" + version,
        isCockpit: false,
    });

    $routeProvider.when("/roster/daily", {
        //controller: "rosterDailyController",
        //templateUrl: "/app/views/rosterdaily.html?v=" + version,
		 controller: "rosterReport",
        templateUrl: "/app/views/rosterreport.html?v=140",
        isCockpit: false,
    });

    $routeProvider.when("/roster/old", {
       // controller: "dailyRoster2Controller",
       // templateUrl: "/app/views/dailyroster2.html?v=" + version,
       // isCockpit: false,
	    controller: "rosterController",
        templateUrl: "/app/views/roster.html"
    });
	
    $routeProvider.when("/crew/time/report", {
        controller: "crewTimeReportController",
        templateUrl: "/app/views/crewTimeReport.html?v=" + version
    });
    //vahid new
    $routeProvider.when("/flights/report", {
        controller: "reportFlightsController",
        templateUrl: "/app/views/reportFlights.html?v=" + "1111002"
    });


    $routeProvider.when("/roster", {
        controller: "rosterController",
        templateUrl: "/app/views/roster.html?v=" + version
    });
    $routeProvider.when("/stat/delay", {
        controller: "statDelayController",
        templateUrl: "/app/views/statDelay.html?v=" + version
    });
    $routeProvider.when("/users", {
        controller: "usersController",
        templateUrl: "/app/views/users.html?v=" + "1218345"
    });
 $routeProvider.when("/gnt", {
        controller: "gntController",
        templateUrl: "/app/views/gnt.html?v=" + "1500"
    });
	
	 $routeProvider.when("/fdr", {
        controller: "reportFDRController",
        templateUrl: "/app/views/reportFDR.html?v=" + version
    });
    $routeProvider.when("/fin/report", {
        controller: "finReportController",
        templateUrl: "/app/views/finReport.html?v=" + version
    });
    $routeProvider.when("/fin/monthly/report", {
        controller: "finmonthController",
        templateUrl: "/app/views/finmonthreport.html?v=" + version
    });
	
	$routeProvider.when("/delays", {
        controller: "delayReportController",
        templateUrl: "/app/views/delayreport.html?v=" + "50112"
    });
	
	  $routeProvider.when("/citypair", {
        controller: "citypairController",
        templateUrl: "/app/views/citypair.html?v=1000"
	});
	
	 $routeProvider.when("/fdps1", {
        controller: "fdpsController",
        templateUrl: "/app/views/fdps.html?v=212815"
    });
	  $routeProvider.when("/roster", {
        controller: "fdpsController",
        templateUrl: "/app/views/fdps.html?v=4215010"
    });
	 $routeProvider.when("/roster/admin", {
        controller: "fdpsController",
        templateUrl: "/app/views/fdps.html?v=2231610",
        isAdmin: true,
    });
	   $routeProvider.when("/ipaccess", {
        controller: "ipaccessController",
        templateUrl: "/app/views/ipaccess.html"
    });
	
	 $routeProvider.when("/verify", {
        controller: "verifyController",
        templateUrl: "/app/views/verify.html"
    });
	
	 $routeProvider.when("/forma", {
        controller: "formaController",
        templateUrl: "/app/views/forma.html?v=100"
    });
	 $routeProvider.when("/board", {
        controller: "boardController",
        templateUrl: "/app/views/board.html?v=222",
        isAdmin: true,
    });
	 $routeProvider.when("/board/test", {
        controller: "boardTestController",
        templateUrl: "/app/views/boardtest.html?v=150",
        isAdmin: true,
    });
	 $routeProvider.when("/reg/flights/monthly", {
        controller: "regFlightsMonthlyController",
        templateUrl: "/app/views/regflightmonthly.html?v=100",
        
    });
	 
	$routeProvider.when("/reg/flights/monthly/:yy/:mm", {
        controller: "regFlightsMonthlyController",
        templateUrl: "/app/views/regflightmonthly.html?v=100",

    });

    $routeProvider.when("/flights/monthly", {
        controller: "flightsMonthlyController",
        templateUrl: "/app/views/flightsmonthly.html",

    });
	$routeProvider.when("/crew/report/fixtime", {
        controller: "fixTimeReportController",
        templateUrl: "/app/views/fixtimereport.html?v=101005"
    });
	
	 $routeProvider.when("/formmovaled", {
        controller: "formmovaledController",
        templateUrl: "/app/views/formmovaled.html?v=100"
    });
	
	
    $routeProvider.when("/formmovaled/yearly", {
        controller: "formmovaledYearlyController",
        templateUrl: "/app/views/formmovaledyearly.html"
    });

    $routeProvider.when("/citypair/yearly", {
        controller: "citypairYearlyController",
        templateUrl: "/app/views/citypairyearly.html"
    });

    $routeProvider.when("/forma/yearly", {
        controller: "formaYearlyController",
        templateUrl: "/app/views/formayearly.html"
    });
	
	 $routeProvider.when("/delay/daily", {
        controller: "delaybidailyController",
        templateUrl: "/app/views/delaybidaily.html?v=100",
        reloadOnSearch: false
    });
	
	 $routeProvider.when("/delays/airports", {
        controller: "delayAirportReportController",
        templateUrl: "/app/views/delayairportreport.html"
    });
	
	$routeProvider.when("/training", {
        controller: "trainingController",
        templateUrl: "/app/views/training.html"
    });

	 $routeProvider.when("/nira", {
        controller: "niraController",
        templateUrl: "/app/views/nira.html?v=10100"
    });
	
	  $routeProvider.when("/asr", {
        controller: "asrreportController",
        templateUrl: "/app/views/asrreport.html"
    });
	// $routeProvider.when("/flights/efbs", {
    //    controller: "reportEFBController",
    //    templateUrl: "/app/views/reportEFB.html?v=100110"
    //});
	 $routeProvider.when("/flights/efbs", {
        controller: "zreportEFBController",
        templateUrl: "/app/views/zreportEFB.html?v=100115"
    });
	 $routeProvider.when("/duty/timeline", {
        controller: "dutyTimelineController",
        templateUrl: "/app/views/dutyTimeline.html"
    });
    $routeProvider.when("/scheduling/admin", {
        controller: "schedulingController",
        templateUrl: "/app/views/scheduling.html?v=101011102",
        isAdmin: true,
    });
    $routeProvider.when("/scheduling", {
        controller: "schedulingController",
        templateUrl: "/app/views/scheduling.html?v=101101102",
        isAdmin: false,
    });
	$routeProvider.when("/scheduling/roster", {
        controller: "schedulingController",
        templateUrl: "/app/views/scheduling.html?v=101101102",
        isAdmin: false,
		isRoster:true,
    });
	
	$routeProvider.when("/fixedtime", {
        controller: "fixTimeController",
        templateUrl: "/app/views/fixtime.html?v=100"
    });
	
	 $routeProvider.when("/crew/report/fixtime/daily", {
        controller: "fixTimeReportDailyController",
        templateUrl: "/app/views/fixtimereportdaily.html?v=100"
    });
	 $routeProvider.when("/raw", {
        controller: "rawcmdController",
        templateUrl: "/app/views/rawcmd.html"
    });
	 $routeProvider.when("/delay/main", {
        controller: "delaykpiController",
        templateUrl: "/app/views/delaybikpi.html",
        reloadOnSearch: false
    });
	
	
	
	 $routeProvider.when("/fdm", {
        controller: "fdmController",
        templateUrl: "/app/views/fdm.html?v=20",

    });
	
	 $routeProvider.when("/fdm/ops", {
        controller: "fdmOpsController",
        templateUrl: "/app/views/fdmops.html?v=20",

    });
	
	$routeProvider.when("/fdm/dashboard", {
        controller: "fdmDashboardController",
        templateUrl: "/app/views/fdmDashboard.html?v=20"
    });

     $routeProvider.when("/fdm/dashboard/cpt/monthly", {
        controller: "fdmDashboardPilotMonthlyController",
        templateUrl: "/app/views/fdmDashboardPilotMonthly.html"
    });


    $routeProvider.when("/fdm/dashboard/cpt/new", {
        controller: "fdmDashboardCptNew",
        templateUrl: "/app/views/fdmDashboardCptNew.html?v=20"
    });
	
    $routeProvider.when("/fdm/qa", {
        controller: "fdmQAController",
        templateUrl: "/app/views/fdmQA.html?v=20"
    });

    $routeProvider.when("/fdm/dashboard/reg/monthly", {
        controller: "fdmRegMonthlyController",
        templateUrl: "/app/views/fdmRegMonthly.html"
    });

  $routeProvider.when("/fdm/crew/report/:crewId", {
        controller: "fdmCrewReportController",
        templateUrl: "/app/views/fdmCrewReport.html"
    });
	
	
	
	 $routeProvider.when("/login/info", {
        controller: "logininfoController",
        templateUrl: "/app/views/logininfo.html"
    });
    $routeProvider.otherwise({ redirectTo: "/home" });

});   

//var protocol='http://';
//if (window.location.href.indexOf('https') != -1)
var	protocol='https://';
var _reportServer = "https://fleet.caspianairlines.com/report/frmreportview.aspx";
var _reportServerDelay = "https://fleet.caspianairlines.com/reportdelay/frmreportview.aspx";
var _reportServerTemp = "https://fleet.caspianairlines.com/reportTemp/frmreportview.aspx";
var _reportServerEFB = "https://fleet.caspianairlines.com/reportefb/frmreportview.aspx";
 var serviceBase =protocol+ 'fleet.caspianairlines.com/api/';
  var serviceBaseV2 =protocol+ 'fleet.caspianairlines.com/apiv2/';
   var serviceBaseV3 =protocol+ 'fleet.caspianairlines.com/apiv3/';
     var serviceBaseNet =protocol+ 'fleet.caspianairlines.com/apinetv1/';
	    var serviceBaseNetBeta =protocol+ 'fleet.caspianairlines.com/apinetv11/';
		 var serviceBaseNetPlan =protocol+ 'fleet.caspianairlines.com/apinetplan/';
var webBase = protocol+ 'fleet.caspianairlines.com/';
var signFiles = 'https://fbpocket.ir/upload/signs/';
var serviceBase2 =  'https://fleet.caspianairlines.com/fbservicea/'; 
 //var webBase = 'http://localhost:30273/';

var serviceBaseAPI =protocol+ 'fleet.caspianairlines.com/airpocketexternal/';
var serviceBaseAPI3 =protocol+ 'fleet.caspianairlines.com/airpocketexternal3/';
var serviceBaseNetAPI=protocol+ 'fleet.caspianairlines.com/airpocketexternalnet/';
var serviceBaseAPIMSG =protocol+ 'fleet.caspianairlines.com/msgapi/';
var serviceBaseAPIXLS =protocol+ 'fleet.caspianairlines.com/xlsapi/';

var serviceBaseAPICER =protocol+ 'fleet.caspianairlines.com/cerapi/';

var staticFilesSKYBAG = 'https://fbpocket.ir/Upload/';
var serviceSKYBAG='https://fleet.caspianairlines.com/fbserviceb/';
var msgUrl = "https://fleet.caspianairlines.com/apimsg/api/";
var apiapsb='https://fleet.caspianairlines.com/apiapsb/api/';

var apiFdm='https://fleet.caspianairlines.com/apifdm/';

var apiCAO='https://fleet.caspianairlines.com/apicao/';

var apiskybag='https://fleet.caspianairlines.com/zsbapi/api/';
var zapinet='https://fleet.caspianairlines.com/zapinet/';

var zfuel='https://fleet.caspianairlines.com/zfuel/';

if (window.location.href.indexOf('fleet.caspianairlines') != -1) {
    var webBase = protocol+ 'fleet.caspianairlines.com/';
    var serviceBase = protocol+ 'fleet.caspianairlines.com/api/';
	var serviceBaseV2 = protocol+ 'fleet.caspianairlines.com/apiv2/';
	  var serviceBaseV3 =protocol+ 'fleet.caspianairlines.com/apiv3/';
	   var serviceBaseNet =protocol+ 'fleet.caspianairlines.com/apinetv1/';
	    var serviceBaseNetPlan =protocol+ 'fleet.caspianairlines.com/apinetplan/';
	    var serviceBaseNetBeta =protocol+ 'fleet.caspianairlines.com/apinetv11/';
	var signFiles = protocol+'fleet.caspianairlines.com/upload/signs/';
    var serviceBase2 = protocol+'fleet.caspianairlines.com/fbservicea/'; 
}
else {
    //var serviceBase = 'http://apig.epapocket.ir/';
   var serviceBase = protocol+ 'fleet.caspianairlines.com/api/';
     var serviceBaseV2 = protocol+ 'fleet.caspianairlines.com/apiv2/';
	   var serviceBaseV3 =protocol+ 'fleet.caspianairlines.com/apiv3/';
	     var serviceBaseNet =protocol+ 'fleet.caspianairlines.com/apinetv1/';
		  var serviceBaseNetPlan =protocol+ 'fleet.caspianairlines.com/apinetplan/';
		  var serviceBaseNetBeta =protocol+ 'fleet.caspianairlines.com/apinetv11/';
var webBase = protocol+ 'fleet.caspianairlines.com/';
var signFiles = protocol+'fleet.caspianairlines.com/upload/signs/';
    var serviceBase2 = protocol+'fleet.caspianairlines.com/fbservicea/'; 
	 _reportServer = protocol+'fleet.caspianairlines.com'+"/report/frmreportview.aspx";
	  _reportServerDelay = protocol+'fleet.caspianairlines.com'+"/reportdelay/frmreportview.aspx";
	 _reportServerTemp = protocol+'fleet.caspianairlines.com'+"/reporttemp/frmreportview.aspx";
	 
	 
	 
	 var serviceBaseAPI =protocol+'fleet.caspianairlines.com'+'/airpocketexternal/';
	var serviceBaseAPIMSG =protocol+ 'fleet.caspianairlines.com/msgapi/';
	var serviceBaseAPIXLS =protocol+ '172.168.103.37/xlsapi/';

var serviceBaseAPI3 =protocol+'fleet.caspianairlines.com'+'/airpocketexternal3/';
var serviceBaseNetAPI=protocol+'fleet.caspianairlines.com'+'/airpocketexternalnet/';
	 
	 
}
 var apiLog = "https://fleet.caspianairlines.com/apilog/";
 
   var serviceBaseBiNew = 'https://fleet.caspianairlines.com/zdelay/';
  var serviceBaseBi = 'https://fleet.caspianairlines.com/zdelay/';
//var signFiles =webBase'upload/signs/';


 
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


app.run(['authService', 'activityService', '$rootScope', '$location', '$templateCache','flightService','$timeout', function (authService, activityService, $rootScope, $location, $templateCache,flightService,$timeout) {
    //alert($location.absUrl());
    Config.CustomerId = 4;
	 $rootScope.CustomerName = 'Caspian';
    $rootScope.CustomerPhone = '+982148063000';
    $rootScope.CustomerEmail = 'OpsEng@Caspian.aero';
	$rootScope.reportServer =_reportServer; //"https://fleet.caspianairlines.com/report/frmreportview.aspx";
	$rootScope.reportServerTemp =_reportServerTemp;
	$rootScope.reportServerEFB =_reportServerEFB;
	$rootScope.reportServerDelay =_reportServerDelay;
    if (window.location.href.indexOf('fleet.caspianairlines') != -1) {
    var webBase = protocol+ 'fleet.caspianairlines.com/';
    var serviceBase = protocol+ 'fleet.caspianairlines.com/api/';
}
else{
	  var serviceBase = protocol+ 'fleet.caspianairlines.com/api/';
var webBase = protocol+ 'fleet.caspianairlines.com/';
}

 

    persianDate.toLocale('en');
    
    $rootScope.$on('$viewContentLoaded', function () {
        //ati new 2
       if (authService.IsAuthurized() && $rootScope.EmailConfirmed != "True") {
            $rootScope.navigatefirstlogin();
            return;
        }
           
        $templateCache.removeAll();
    });
    $rootScope.serviceUrl = serviceBase;
	 $rootScope.serviceUrlNet = serviceBaseNet;
	
    $rootScope.fileHandlerUrl = /*webBase*/window.location.protocol + "//" + window.location.host +"/"+ 'filehandler.ashx';
    $rootScope.clientsFilesUrl = webBase + 'upload/clientsfiles/';
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
    $rootScope.logOut = function () { authService.logOut(); };
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
        if ($rootScope.userName == 'demo')
            return true;
        //profile_users
        if (key == 'profile_users' ) {
          if ($rootScope.userName == 'it.razbani')
            return true;
		else 
 if ($rootScope.userName == 'it.entezari')
            return true;
			else 
 if ($rootScope.userName == 'it.ghaffari')
            return true;
		else return false;

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
		if (key=='efb')
		{
			 if ($rootScope.userName.toLowerCase() == 'demo')
                  return true;
			   if ($rootScope.userName.toLowerCase().includes('razbani'))
                  return true;
			  if ($rootScope.userName.toLowerCase().includes('kabiri'))
                  return true;
			  if ($rootScope.userName.toLowerCase().includes('mohammadi'))
                  return true;
			    if ($rootScope.userName.toLowerCase().includes('ops.rezabandehlou'))
                  return true;
			   if ($rootScope.userName.toLowerCase().includes('ops.shakoory'))
                  return true;
			   if ($rootScope.userName.toLowerCase().includes('houshyar'))
                  return true;
			  var efbexist = Enumerable.From($rootScope.claims).Where('$.page=="' + key + '"').FirstOrDefault();
			  if (efbexist) return true;
			  return false;
		}
        var exist = Enumerable.From($rootScope.claims).Where('$.page=="' + key + '"').FirstOrDefault();
        
        if (!exist) {
            switch (module) {
                case 3:
                    exist = Enumerable.From($rootScope.claims).Where('$.page=="flight_admin"').FirstOrDefault();
                    
                    break;
                case 2:
                    exist = Enumerable.From($rootScope.claims).Where('$.page=="learning_admin"').FirstOrDefault();
                    
                    break;
                case 1:
                    exist = Enumerable.From($rootScope.claims).Where('$.page=="base_admin"').FirstOrDefault();
                     
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

          if ($rootScope.roles && $rootScope.roles.length == 1 &&   ($rootScope.roles[0] == 'Transport' || $rootScope.roles[0] == 'Station'))
            return true;
         
         var arr = Enumerable.From($rootScope.claims).Select('$.page').Distinct().ToArray();

        return arr.length==1 && arr[0]!='flight_admin' ? true : false;
        

    };
	 $rootScope.IsApsHasDelayRole = function () {

         // if ($rootScope.roles && $rootScope.roles.length == 1 &&   ($rootScope.roles[0] == 'Transport' || $rootScope.roles[0] == 'Station'))
         //   return true;
         
        // var arr = Enumerable.From($rootScope.claims).Select('$.page').Distinct().ToArray();

       // return arr.length==1 && arr[0]!='flight_admin' ? true : false;
        console.log($rootScope.roles);

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
            DevExpress.ui.themes.current($rootScope.theme);
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
	//console.log('$rootScope.getDatasourceRoutesFromAirport');
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
	
	$rootScope.isnirastarted=false;
	$rootScope.niratimer = function () {
         
         $timeout(function () {
            console.log('startNiraConflict timer');
			console.log(window.location);
			if (window.location.href.includes("board")){
				flightService.getNiraConflicted(7).then(function (response) {
             
                console.log('nira',response);
				if (response && response.length>0)
				  DevExpress.ui.notify({ message: "Unsynced flight(s) found in NIRA", width: 900, shading: true,position:'top center' }, "error", 3000);


            }, function (err) {   });
			}
			
			
			
            $rootScope.niratimer();
        }, 1000*60*10);
    };
	$rootScope.startNiraConflict=function(){
		
		if ( $rootScope.userName.toLowerCase().startsWith('comm.')  ||  $rootScope.userName.toLowerCase()=='demo' ||  $rootScope.userName.toLowerCase()=='nira')
		{
			console.log('startNiraConflict');
			if (!$rootScope.isnirastarted){
				$rootScope.isnirastarted=true;
			    $rootScope.niratimer();
				
			}
			
		}
	}
	
	console.log('app started');
	$rootScope.startNiraConflict();
    //////////////////////////////////////////////////////
	 $rootScope.goProfile = function () {
		  
        $rootScope.navigatefirstlogin();
    }

   /////////////////////////////////////////
   
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
   
   
   ///////////////////////////////////////////
}]);
 
 
 