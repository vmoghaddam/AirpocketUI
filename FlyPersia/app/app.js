 
var app = angular.module('GriffinApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar', 'dx', 'ngSanitize', 'ngAnimate']).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]);
 
 
app.config(function ($routeProvider) {
      var version = 58622;
    //ati new 2
    $routeProvider.when("/cp", {
        controller: "firstLoginController",
        templateUrl: "app/views/firstlogin.html?v=" + version
    });

    
     
    $routeProvider.when("/apps", {
        controller: "appsController",
        templateUrl: "app/views/apps.html?v=" + version
    });
    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "app/views/home.html?v=" + version
    });
    $routeProvider.when("/home/:year/:month/:day", {
        controller: "homeController",
        templateUrl: "app/views/home.html?v=" + version
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "app/views/login.html?v=" + version
    });

    

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "app/views/signup.html?v=" + version
    });

    $routeProvider.when("/orders", {
        controller: "ordersController",
        templateUrl: "app/views/orders.html?v=" + version
    });

    $routeProvider.when("/refresh", {
        controller: "refreshController",
        templateUrl: "app/views/refresh.html?v=" + version
    });

    $routeProvider.when("/tokens", {
        controller: "tokensManagerController",
        templateUrl: "app/views/tokens.html?v=" + version
    });

    $routeProvider.when("/associate", {
        controller: "associateController",
        templateUrl: "app/views/associate.html?v=" + version
    });

    $routeProvider.when("/test", {
        controller: "testController",
        templateUrl: "app/views/test.html?v=" + version
    });

    $routeProvider.when("/airport", {
        controller: "airportController",
        templateUrl: "app/views/airport.html?v=" + version,
        isDispatch: false,
    });
    $routeProvider.when("/dispatch/airport", {
        controller: "airportController",
        templateUrl: "app/views/airport.html?v=" + version,
        isDispatch: true,
    });

    $routeProvider.when("/aircrafttype", {
        controller: "aircraftTypeController",
        templateUrl: "app/views/aircrafttype.html?v=" + version
    });
    $routeProvider.when("/location", {
        controller: "locationController",
        templateUrl: "app/views/location.html?v=" + version
    });
    $routeProvider.when("/jobgroup", {
        controller: "jobgroupController",
        templateUrl: "app/views/jobgroup.html?v=" + version
    });

    /*$routeProvider.when("/person", {
        controller: "personController",
        templateUrl: "app/views/person.html?v=" + "2166189567"
    });*/
	$routeProvider.when("/person", {
         controller: "zpersonController",
        templateUrl: "app/views/zperson.html?v=" + version
    });
	 $routeProvider.when("/person/z", {
        controller: "zpersonController",
        templateUrl: "app/views/zperson.html?v=" + version
    });
	 $routeProvider.when("/person/crew", {
        controller: "personController",
        templateUrl: "app/views/person.html??v=" + version,
        isCrew:true,
    });
    $routeProvider.when("/person/course", {
        controller: "personcourseController",
        templateUrl: "app/views/personcourse.html?v=" + version
    });
     
    $routeProvider.when("/person/book", {
        controller: "personbookController",
        templateUrl: "app/views/personbook.html?v=" + version
    });

    $routeProvider.when("/person/certificate", {
        controller: "personcertificateController",
        templateUrl: "app/views/personcertificate.html?v=" + version
    });

    $routeProvider.when("/course", {
        controller: "courseController",
        templateUrl: "app/views/course.html?v=" + version
    });
    $routeProvider.when("/course/person", {
        controller: "coursepersonController",
        templateUrl: "app/views/courseperson.html?v=" + version
    });
    $routeProvider.when("/course/type", {
        controller: "courseTypeController",
        templateUrl: "app/views/coursetype.html?v=" + version
    });
    $routeProvider.when("/flight/board", {
         controller: "boardController",
        templateUrl: "app/views/board.html?v=" + version,
        isAdmin: true,
    });
	$routeProvider.when("/flight/board/old", {
        controller: "flightBoardController",
        templateUrl: "app/views/flightboard.html?v=" + version
    });
    $routeProvider.when("/plan/board", {
        controller: "planBoardController",
        templateUrl: "app/views/planningboard.html?v=" + version
    });
    $routeProvider.when("/flight/board/ceo", {
        //controller: "ceoFlightBoardController",
        //templateUrl: "app/views/ceoflightboard.html?v=" + version
		 controller: "gntController",
        templateUrl: "app/views/gnt.html?v=" + version
    });
    $routeProvider.when("/flight/board/all", {
        controller: "flightBoardAllController",
        templateUrl: "app/views/flightboardall.html?v=" + version
    });
    $routeProvider.when("/dispatch/flights/:airport/:admin", {
        controller: "flightBoardAllController",
        templateUrl: "app/views/flightboardall.html?v=" + version,
        isDispatch: true,
    });
    $routeProvider.when("/maintenance/flights", {
        controller: "flightPlansMaintenanceController",
        templateUrl: "app/views/flightPlansMaintenance.html?v=" + version
    });

    $routeProvider.when("/maintenance/flights/calendar", {
        controller: "flightPlansCalendarMaintenanceController",
        templateUrl: "app/views/flightPlansCalendarMaintenance.html?v=" + version
    });


    $routeProvider.when("/maintenance/registers/assign", {
        controller: "planRegistersController",
        templateUrl: "app/views/planRegisters.html?v=" + version
    });
    $routeProvider.when("/maintenance/flights/registers", {
        controller: "changeFlightRegisterController",
        templateUrl: "app/views/changeflightregister.html?v=" + version
    });
    //$routeProvider.when("/flight/plan/register/:id", {
    //    controller: "flightPlanRegsiterController",
    //    templateUrl: "app/views/flightplanregister.html"
    //});

    $routeProvider.when("/library", {
        controller: "libraryController",
        templateUrl: "app/views/library.html?v=" + version,
        isDocument:false,
    });
    $routeProvider.when("/library/people", {
        controller: "libraryController",
        templateUrl: "app/views/librarypeople.html?v=" + version,
        isDocument: false,
    });
    $routeProvider.when("/library/:type/:publisher/:author", {
        controller: "libraryController",
        templateUrl: "app/views/library.html?v=" + version,
        isDocument: false,
    });
    $routeProvider.when("/option/:parent", {
        controller: "optionController",
        templateUrl: "app/views/option.html?v=" + version,
         
    });

    $routeProvider.when("/document", {
        controller: "libraryController",
        templateUrl: "app/views/document.html?v=" + version,
        isDocument: true,
    });

    $routeProvider.when("/publisher", {
        controller: "organizationController",
        templateUrl: "app/views/organization.html?v=" + version,
        TypeId: 77,
    });
    $routeProvider.when("/author", {
        controller: "personmiscController",
        templateUrl: "app/views/personmisc.html?v=" + version,
        TypeId: 75,
    });
   
    $routeProvider.when("/journal", {
        controller: "journalController",
        templateUrl: "app/views/journal.html?v=" + version,
        TypeId: 1,
    });
    $routeProvider.when("/conference", {
        controller: "journalController",
        templateUrl: "app/views/journal.html?v=" + version,
        TypeId: 2,
    });
    $routeProvider.when("/notification", {
        controller: "notificationController",
        templateUrl: "app/views/notification.html?v=" + version,
        
    });
    $routeProvider.when("/flight", {
        controller: "flightController",
        templateUrl: "app/views/flight.html?v=" + version,

    });
   


    


    $routeProvider.when("/flight/archive", {
        controller: "flightListController",
        templateUrl: "app/views/flightlist.html?v=" + version,
        type:-1,

    });
    $routeProvider.when("/flight/archive/:airport", {
        controller: "flightListController",
        templateUrl: "app/views/flightlist.html?v=" + version,
        type: -1,

    });

    
    $routeProvider.when("/maintenance/flights/irregular", {
        controller: "irregularFlightController",
        templateUrl: "app/views/irregularflight.html?v=" + version,
        type: 2,

    });
    
    $routeProvider.when("/flight/plans/closed", {
        controller: "flightPlanViewController",
        templateUrl: "app/views/flightplanview.html?v=" + version,
        type: 50,

    });
    $routeProvider.when("/commercial/flights/irregular", {
        controller: "irregularFlightController",
        templateUrl: "app/views/irregularflight.html?v=" + version,
        type: 1,

    });
    $routeProvider.when("/commercial/flights/plannig", {
        //controller: "flightController",
        //templateUrl: "app/views/flight.html",
        controller: "flightPlanningController",
        templateUrl: "app/views/flightPlanning.html?v=" + version,

    });
    $routeProvider.when("/commercial/plans/permits", {
        //controller: "flightPlanViewController",
        //templateUrl: "app/views/flightplanview.html",
         controller: "flightPlanPermitController",
        templateUrl: "app/views/flightplanpermit.html?v=" + version,
        //type: 50,

    });
    $routeProvider.when("/commercial/plans/crew", {
         
        controller: "flightPlanCrewController",
        templateUrl: "app/views/flightPlanCrew.html?v=" + version,
        //type: 50,

    });
    $routeProvider.when("/commercial/plans/apply", {
        //controller: "flightPlanApplyController",
        //templateUrl: "app/views/flightplanapply.html",
        controller: "flightPlanApply2Controller",
        templateUrl: "app/views/flightplanapply2.html?v=" + version,

    });
    $routeProvider.when("/commercial/plans", {
        controller: "flightPlanListController",
        templateUrl: "app/views/flightplanlist.html?v=" + version,


    });

    $routeProvider.when("/crewtest", {
        controller: "crewtestController",
        templateUrl: "app/views/crewtest.html?v=" + version
    });
    $routeProvider.when("/crew/assign/cockpit", {
        controller: "crewassignController",
        templateUrl: "app/views/crewassign.html?v=" + version,
        isCockpit: true,
    });
    $routeProvider.when("/crew/assign/cabin", {
        controller: "crewassignController",
        templateUrl: "app/views/crewassign.html?v=" + version,
        isCockpit: false,
    });
    $routeProvider.when("/crew/assign/timeline/cabin", {
        controller: "crewassign2Controller",
        templateUrl: "app/views/crewassign2.html?v=" + version,
        isCockpit: false,
    });
    $routeProvider.when("/crew/assign/timeline/cockpit", {
        controller: "crewassign2Controller",
        templateUrl: "app/views/crewassign2.html?v=" + version,
        isCockpit: true,
    });
    $routeProvider.when("/crew/assign2", {
        controller: "crewassign2Controller",
        templateUrl: "app/views/crewassign2.html?v=" + version
    });
    $routeProvider.when("/crew/report", {
        controller: "crewReportController",
        templateUrl: "app/views/crewReport.html?v=" + version
    });
    
    $routeProvider.when("/fuel/report", {
        controller: "fuelReportController",
        templateUrl: "app/views/fuelReport.html?v=" + version
    });
    $routeProvider.when("/delays/report", {
        controller: "flightDelaysController",
        templateUrl: "app/views/flightDelays.html?v=" + version
    });

    $routeProvider.when("/matchinglist", {
        controller: "mlistController",
        templateUrl: "app/views/mlist.html?v=" + version,
        TypeId: 75,
    });

    $routeProvider.when("/commercial/planning", {
        //controller: "flightController",
        //templateUrl: "app/views/flight.html",
        controller: "planController",
        templateUrl: "app/views/plan.html?v=" + version,

    });
    //$routeProvider.when("/crew/assign", {
    //    controller: "crewtestController",
    //    templateUrl: "app/views/crewtest.html"
    //});
    $routeProvider.when("/flight/report/security", {
        controller: "flightReportSecurityController",
        templateUrl: "app/views/flightreportsecurity.html?v=" + version
    });
    $routeProvider.when("/reg/availability", {
        controller: "regAvailabilityController",
        templateUrl: "app/views/regAvailability.html?v=" + version
    });
    $routeProvider.when("/route", {
        controller: "routeController",
        templateUrl: "app/views/route.html?v=" + version,
        isDispatch: false,
    });
    $routeProvider.when("/delay/codes", {
        controller: "delayCodesController",
        templateUrl: "app/views/delayCodes.html?v=" + version,
        isDispatch: false,
    });

    $routeProvider.when("/crew/assign/reg/cockpit", {
        controller: "crewassignregController",
        templateUrl: "app/views/crewassignreg.html?v=" + version,
        isCockpit: true,
    });
    $routeProvider.when("/crew/assign/reg/cabin", {
        controller: "crewassignregController",
        templateUrl: "app/views/crewassignreg.html?v=" + version,
        isCockpit: false,
    });

    $routeProvider.when("/roster/daily", {
        //controller: "rosterDailyController",
        //templateUrl: "app/views/rosterdaily.html?v=" + version,
		 controller: "rosterReport",
        templateUrl: "app/views/rosterreport.html?v=" + version,
        isCockpit: false,
    });

    $routeProvider.when("/roster/old", {
       // controller: "dailyRoster2Controller",
       // templateUrl: "app/views/dailyroster2.html?v=" + version,
       // isCockpit: false,
	    controller: "rosterController",
        templateUrl: "app/views/roster.html?v=" + version
    });
	
    $routeProvider.when("/crew/time/report", {
        controller: "crewTimeReportController",
        templateUrl: "app/views/crewTimeReport.html?v=" + version
    });
    //vahid new
    $routeProvider.when("/flights/report", {
        controller: "reportFlightsController",
        templateUrl: "app/views/reportFlights.html?v=" + version
    });


    $routeProvider.when("/roster", {
        controller: "rosterController",
        templateUrl: "app/views/roster.html?v=" + version
    });
    $routeProvider.when("/stat/delay", {
        controller: "statDelayController",
        templateUrl: "app/views/statDelay.html?v=" + version
    });
    $routeProvider.when("/users", {
        controller: "usersController",
        templateUrl: "app/views/users.html?v=" + version
    });
 $routeProvider.when("/gnt", {
        controller: "gntController",
        templateUrl: "app/views/gnt.html?v=" + version
    });
	
	 $routeProvider.when("/fdr", {
        controller: "reportFDRController",
        templateUrl: "app/views/reportFDR.html?v=" + version
    });
    $routeProvider.when("/fin/report", {
        controller: "finReportController",
        templateUrl: "app/views/finReport.html?v=" + version
    });
    $routeProvider.when("/fin/monthly/report", {
        controller: "finmonthController",
        templateUrl: "app/views/finmonthreport.html?v=" + version
    });
	
	$routeProvider.when("/delays", {
        controller: "delayReportController",
        templateUrl: "app/views/delayreport.html?v=" + version
    });
	
	  $routeProvider.when("/citypair", {
        controller: "citypairController",
        templateUrl: "app/views/citypair.html?v=" + version
    });
	
	 $routeProvider.when("/fdps1", {
        controller: "fdpsController",
        templateUrl: "app/views/fdps.html?v=" + version
    });
	  $routeProvider.when("/roster", {
        controller: "fdpsController",
        templateUrl: "app/views/fdps.html?v=" + version
    });
	 $routeProvider.when("/roster/adminx", {
        controller: "fdpsController",
        templateUrl: "app/views/fdps.html?v=" + version,
        isAdmin: true,
    });
	   $routeProvider.when("/ipaccess", {
        controller: "ipaccessController",
        templateUrl: "app/views/ipaccess.html"
    });
	
	 $routeProvider.when("/verify", {
        controller: "verifyController",
        templateUrl: "app/views/verify.html"
    });
	
	 $routeProvider.when("/forma", {
        controller: "formaController",
        templateUrl: "app/views/forma.html"
    });
	 $routeProvider.when("/board", {
        controller: "boardController",
        templateUrl: "app/views/board.html?v=" + version,
        isAdmin: true,
    });
	 $routeProvider.when("/board/test", {
        controller: "boardTestController",
        templateUrl: "app/views/boardtest.html?v=" + version,
        isAdmin: true,
    });
	$routeProvider.when("/reg/flights/monthly", {
        controller: "regFlightsMonthlyController",
        templateUrl: "app/views/regflightmonthly.html",
        
    });

    $routeProvider.when("/reg/flights/monthly/:yy/:mm", {
        controller: "regFlightsMonthlyController",
        templateUrl: "app/views/regflightmonthly.html",

    });

    $routeProvider.when("/flights/monthly", {
        controller: "flightsMonthlyController",
        templateUrl: "app/views/flightsmonthly.html",

    });
	
	$routeProvider.when("/delay/main", {
        controller: "delaykpiController",
        templateUrl: "app/views/delaybikpi.html?v=" + version,
        reloadOnSearch: false
    });
	$routeProvider.when("/delay/daily", {
        controller: "delaybidailyController",
        templateUrl: "app/views/delaybidaily.html?v=" + version,
        reloadOnSearch: false
    });
	
	  $routeProvider.when("/expiring/coursetype", {
        controller: "expiringCourseTypeController",
        templateUrl: "app/views/expiringCourseType.html?v=" + version
    });
	  $routeProvider.when("/groups/expiring", {
        controller: "expiringGroupController",
        templateUrl: "app/views/expiringgroup.html"
    });
	$routeProvider.when("/teachers", {
        controller: "teachersController",
        templateUrl: "app/views/teachers.html?v=" + version
    });
	
	 $routeProvider.when("/raw", {
        controller: "rawcmdController",
        templateUrl: "app/views/rawcmd.html"
    });
	
	  $routeProvider.when("/trn/stat", {
        controller: "trnStatController",
        templateUrl: "app/views/trnstat.html?v=" + version
    });
	
	
	  $routeProvider.when("/sim", {
        controller: "simController",
        templateUrl: "app/views/sim.html"
    });
	 $routeProvider.when("/flights/efbs", {
        controller: "reportEFBController",
        templateUrl: "app/views/reportEFB.html"
    });
	
	$routeProvider.when("/scheduling/adminx", {
        controller: "schedulingController",
        templateUrl: "app/views/scheduling.html?v=" + version,
        isAdmin: true,
    });
    $routeProvider.when("/scheduling", {
        controller: "schedulingController",
        templateUrl: "app/views/scheduling.html?v=" + version,
        isAdmin: false,
    });
	
	
	$routeProvider.when("/scheduling/z", {
        controller: "zschedulingController",
        templateUrl: "app/views/zscheduling.html?v=" + version,
        isAdmin: false,
    });
	$routeProvider.when("/scheduling/z/adminx", {
        controller: "zschedulingController",
        templateUrl: "app/views/zscheduling.html?v=" + version,
        isAdmin: true,
    });
	
	
	
	 $routeProvider.when("/fdp/log", {
        controller: "fdplogController",
        templateUrl: "app/views/fdplog.html?v=" + version,
        isAdmin: false,
    });
	
	  $routeProvider.when("/duty/timeline", {
        controller: "dutyTimelineController",
        templateUrl: "app/views/dutyTimeline.html?v=" + version
    });
	  $routeProvider.when("/duty/timeline/z", {
        controller: "zdutyTimelineController",
        templateUrl: "app/views/zdutyTimeline.html?v=" + version
    });
	
	
    $routeProvider.when("/trn/expiring/groups", {
        controller: "trnexpiringGroupController",
        templateUrl: "app/views/trnexpiringgroups.html?v=" + version
    });

    $routeProvider.when("/trn/schedule", {
        controller: "trnscheduleController",
        templateUrl: "app/views/trnschedule.html?v=" + version
    });

    $routeProvider.when("/trn/schedule/coursetype", {
        controller: "trnScheduleCourseTypeController",
        templateUrl: "app/views/trnschedulecoursetype.html?v=" + version
    });
    $routeProvider.when("/trn/schedule/course", {
        controller: "trnScheduleCourseController",
        templateUrl: "app/views/trnschedulecourse.html?v=" + version
    });


    $routeProvider.when("/trn/dashboard", {
        controller: "trnDashboardController",
        templateUrl: "app/views/trndashboard.html?v=" + version
    });
	$routeProvider.when("/qa/dashboard", {
        controller: "qaDashboard",
        templateUrl: "app/views/qaDashboard.html"
    });


    $routeProvider.when("/qa/status/:type/:title", {
        controller: "qaReportStatus",
        templateUrl: "app/views/qaReportStatus.html?v=" + version
    });


    $routeProvider.when("/qa/report", {
        controller: "qaReports",
        templateUrl: "app/views/qaReport.html"
    });
	
	//$routeProvider.when("/duty/timeline/z", {
    //    controller: "zdutyTimelineController",
    //    templateUrl: "/app/views/zdutyTimeline.html?v=" + version
    //});
	
    $routeProvider.when("/log/report", {
        controller: "reportlog",
        templateUrl: "app/views/reportlog.html?v=" + version
    });
     $routeProvider.when("/log/profile/report", {
        controller: "reportlogprofile",
        templateUrl: "app/views/reportlogprofile.html?v=" + version
    });
	
	 $routeProvider.when("/log/duty/report", {
        controller: "reportlogduty",
        templateUrl: "app/views/reportlogduty.html?v=" + version
    });
	
	 $routeProvider.when("/log/profile/report", {
        controller: "reportlogprofile",
        templateUrl: "app/views/reportlogprofile.html?v=" + version
    });
	
	  $routeProvider.when("/qa/hazard/log", {
        controller: "qahazardlog",
        templateUrl: "app/views/qahazardlog.html?v=" + version
    });
	
	$routeProvider.when("/recency", {
        controller: "recencyController",
        templateUrl: "app/views/recency.html?v=" + version
    });
   
	
	
	
	 $routeProvider.when("/summary/pax", {
        controller: "summary_pax_controller",
        templateUrl: "app/views/summary_pax.html",

    });
	
	
	
    $routeProvider.otherwise({ redirectTo: "/home" });

}); 
var protocol='http://';
if (window.location.href.indexOf('https') != -1)
	protocol='https://';
  var serviceBaseBiNew = protocol+'fleet.flypersia.aero/binew/';
 if (window.location.href.indexOf('fleet.flypersia.aero:90') != -1) {
    var webBase = protocol+'fleet.flypersia.aero:80/airpocket/';
    var serviceBase = protocol+'fleet.flypersia.aero:80/apiv2/';
	  var serviceBasePerson = protocol+'fleet.flypersia.aero:80/apiv3/';
	 var serviceBase2 = protocol+'fleet.flypersia.aero:80/apin/';
	  var serviceBaseBi = protocol+'fleet.flypersia.aero:80/bi/';
	  var liburl=protocol+'fleet.flypersia.aero:80/apilb/';
	  var serviceBaseTRN = protocol+'fleet.flypersia.aero:80/apitrn/';
}
else  if (window.location.href.indexOf('fleet.flypersia.aero:80') != -1) {
    var webBase = protocol+'fleet.flypersia.aero:80/airpocket/';
    var serviceBase =protocol+'fleet.flypersia.aero:80/apiv2/';
		  var serviceBasePerson = protocol+'fleet.flypersia.aero:80/apiv3/';
	 var serviceBase2 =protocol+'fleet.flypersia.aero:80/apin/';
	   var serviceBaseBi = protocol+'fleet.flypersia.aero:80/bi/';
	   	  var liburl=protocol+'fleet.flypersia.aero:80/apilb/';
		   var serviceBaseTRN = protocol+'fleet.flypersia.aero:80/apitrn/';
}
else
	if (window.location.href.indexOf('airpocket.flypersia.aero:90') != -1) {
    var webBase = protocol+'airpocket.flypersia.aero:90/airpocket/';
    var serviceBase = protocol+'airpocket.flypersia.aero:90/apiv2/';
	 var serviceBasePerson = protocol+'airpocket.flypersia.aero:90/apiv3/';
	 var serviceBase2 =protocol+'airpocket.flypersia.aero:90/apin/';
	  var serviceBaseBi = protocol+'airpocket.flypersia.aero:90/bi/';
	  	  var liburl=protocol+'fleet.flypersia.aero:90/apilb/';
		  var serviceBaseTRN = protocol+'fleet.flypersia.aero:90/apitrn/';
}
else
if (window.location.href.indexOf('fleet.flypersia.aero') != -1) {
    var webBase = protocol+'fleet.flypersia.aero/airpocket/';
    var serviceBase = protocol+'fleet.flypersia.aero/apiv2/';
	 var serviceBasePerson = protocol+'fleet.flypersia.aero/apiv3/';
	 var serviceBase2 = protocol+'fleet.flypersia.aero/apin/';
	  var serviceBaseBi = protocol+'fleet.flypersia.aero/bi/';
	    var serviceBaseBiNew = protocol+'fleet.flypersia.aero/binew/';
	  	  var liburl=protocol+'fleet.flypersia.aero/apilb/';
		    var serviceBaseTRN = protocol+'fleet.flypersia.aero/apitrn/';
}
else
	if (window.location.href.indexOf('91.92.185.187')!=-1)
	{
		 var webBase = 'http://91.92.185.187/airpocket/';
         var serviceBase = 'http://91.92.185.187/apiv2/';
		 var serviceBasePerson = 'http://91.92.185.187/apiv3/';
		  var serviceBase = 'http://91.92.185.187/apin/';
		    var serviceBaseBi = 'http://91.92.185.187/bi/';
				  var liburl=protocol+'91.92.185.187/apilb/';
				  var serviceBaseTRN = protocol+'91.92.185.187/apitrn/';
	}
	else if (window.location.href.indexOf(protocol+'fleet.flypersia.local') != -1) {
    var webBase = protocol+'fleet.flypersia.local/airpocket/';
    var serviceBase =protocol+'fleet.flypersia.local/apiv2/';
	   var serviceBasePerson =protocol+'fleet.flypersia.local/apiv3/';
	var serviceBase2 = protocol+'fleet.flypersia.local/apin/';
	 var serviceBaseBi = protocol+'fleet.flypersia.local/bi/';
	   var serviceBaseBiNew = protocol+'fleet.flypersia.local/binew/';
	 	  var liburl=protocol+'fleet.flypersia.local/apilb/';
		   var serviceBaseTRN = protocol+'fleet.flypersia.local/apitrn/';
}

else {
  var webBase =  protocol+'172.16.32.35/airpocket/';
 var serviceBase = protocol+'172.16.32.35/apiv2/';
 var serviceBase2 = protocol+'172.16.32.35/apin/';
 var serviceBaseBi = protocol+'172.16.32.35/bi/';
 	  var liburl=protocol+'172.16.32.35/apilb/';
	  var serviceBaseTRN = protocol+'172.16.32.35/apitrn/';
}



var serviceBaseAPI = 'https://fleet.flypersia.aero/expapi/';
var staticFilesSKYBAG = 'https://fbpocket.ir/Upload/';
var serviceSKYBAG = 'https://fb.flypersia.aero/fbservice/';
var serviceNOTAM = 'https://fb.flypersia.aero/fbservice/';

var netsch="https://fleet.flypersia.aero/netsch/";
var apisch="https://fleet.flypersia.aero/apisch/";
var apischedling="https://fleet.flypersia.aero/apischeduling/";


var apiSchedulingNew ="https://fleet.flypersia.aero/apischedulingnew/";
  var zapiScheduling="https://fleet.flypersia.aero/zscheduling/"; 
var apiprofile='https://fleet.flypersia.aero/zprofile/';


var apiScheduling="https://fleet.flypersia.aero/zscheduling/"; 
var apireportflight = 'https://fleet.flypersia.aero/zreportflight/';
var zapitrn=  'https://fleet.flypersia.aero/ztrn/';

var zapinet=  'https://fleet.flypersia.aero/zapinet/';
var apiQA='https://fleet.flypersia.aero/zapiqa/';

var zapiapsb='https://fleet.flypersia.aero/zapiapsb/';
var apiapsb ='https://fleet.flypersia.aero/zapiapsb/';


var zapi =  'https://fleet.flypersia.aero/zapi/';

var zreportflight=apireportflight ;

var weatherUrl='https://fleet.flypersia.aero/zwx/';
var atcfiles='https://fleet.flypersia.aero/airpocket/upload/atc/';
var fltfiles='https://fleet.flypersia.aero/airpocket/upload/flt/';
var zfuel=  'https://fleet.flypersia.aero/zapifuel/';
  
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
app.run(['authService', 'activityService', '$rootScope', '$location', '$templateCache','localStorageService', function (authService, activityService, $rootScope, $location, $templateCache,localStorageService) {
    //alert($location.absUrl());
    // Config.CustomerId = 4;
	localStorageService.remove('ceo');
    $rootScope.CustomerName = 'FlyPersia';
    $rootScope.CustomerPhone = '+982148000000';
    $rootScope.CustomerEmail = 'OpsEng@FlyPersia.aero';
	$rootScope.reportServer = "https://fleet.flypersia.aero/report/frmreportview.aspx";
		$rootScope.reportServerTRN = "https://fleet.flypersia.aero/reporttrn/frmreportview.aspx";
		$rootScope.zreportServerTRN = "https://fleet.flypersia.aero/zreporttrn/frmreportview.aspx";
		$rootScope.reportServerCrew = "https://fleet.flypersia.aero/reportcrew/frmreportview.aspx";
		$rootScope.zreportServerTRNForms = "https://fleet.flypersia.aero/zreportattform/frmreportview.aspx";
    Config.CustomerId = 1;
    if ($location.absUrl().indexOf('fleet.flypersia.aero') != -1) {
        webBase = protocol+'fleet.flypersia.aero/airpocket/';
        serviceBase = protocol+'fleet.flypersia.aero/apiv2/';
    }
	 
    persianDate.toLocale('en');
	  ////////////////////////////////
    $rootScope.startingBIYear = 1398;
    ////////////////////////////////
   
    $rootScope.$on('$viewContentLoaded', function () {
        //ati12
        if (authService.IsAuthurized() && $rootScope.EmailConfirmed != "True") {
            $rootScope.navigatefirstlogin();
            return;
        }
           
        $templateCache.removeAll();
    });
    $rootScope.serviceUrl = serviceBase;
	$rootScope.serviceUrlBi = serviceBaseBi;
    $rootScope.fileHandlerUrl = webBase + 'filehandler.ashx';
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
	$rootScope.navigateSimple = function (target ) {

        
        $location.path(target);


    };
	$rootScope.HasRegChange = function () {
        
        var role = Enumerable.From($rootScope.roles).Where('$=="Changing Register"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };
	 $rootScope.HasFlightsExportRole = function () {
        
        var role = Enumerable.From($rootScope.roles).Where('$=="Exporting Flights To XLSX"').FirstOrDefault();
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
	$rootScope.HasCabinView = function () {
        
        var role = Enumerable.From($rootScope.roles).Where('$=="Base Pocket - View (Cabin)"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };
	$rootScope.HasCockpitView = function () {
        
        var role = Enumerable.From($rootScope.roles).Where('$=="Base Pocket - View (Cockpit)"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };
	 
	$rootScope.HasAllEmployeeView = function () {
        //Base Pocket - View (All)
		 var role = Enumerable.From($rootScope.roles).Where('$=="Base Pocket - View (All)"').FirstOrDefault();
        if (role)
            return true;
       if (!$rootScope.HasCabinView() && !$rootScope.HasCockpitView())
		   return true;
        return false;
    };
    $rootScope.HasTrainingAccess = function () {

        var role = Enumerable.From($rootScope.roles).Where('$=="Department Manager" || $=="Training View" || $=="BasePocket Admin"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };
	$rootScope.HasDispatch = function () {
        
        var role = Enumerable.From($rootScope.roles).Where('$=="Dispatch"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };
	$rootScope.HasAccessToCrewList = function () {

        var role = Enumerable.From($rootScope.roles).Where('$=="Flight Crew List"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };
	$rootScope.HasAccessToCrewListCAMO = function () {

        var role = Enumerable.From($rootScope.roles).Where('$=="Flight Crew List (CAMO)"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };
	$rootScope.HasTrainingView = function () {

        var role = Enumerable.From($rootScope.roles).Where('$=="Training View"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };
	//BasePocket Admin
	$rootScope.HasTrainingAdmin = function () {

        var role = Enumerable.From($rootScope.roles).Where('$=="BasePocket Admin"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };
	$rootScope.HasHR = function () {

        var role = Enumerable.From($rootScope.roles).Where('$=="HR"').FirstOrDefault();
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
        if ($rootScope.userName == 'demo')
            return true;
        //profile_users
		 if (key == 'profile_users'){
			 
			 console.log($rootScope.userName.toUpperCase());
		 }
        if (key == 'profile_users' && $rootScope.userName != 'razbani' && $rootScope.userName.toUpperCase() != 'A.NEZHADROSTAM'  ) {

            return false;


        }
		else   if (key == 'profile_users') return true;
		
		 if (key == 'trn_roster' && ($rootScope.userName.toLowerCase().startsWith('r.nasiri')  || $rootScope.userName.toLowerCase().startsWith('khorshidi')
		      || $rootScope.userName.toLowerCase().startsWith('m.namishadehi')	 
		    )  ) {

            return true;


        }
       
       
       
        if (key == 'flight_board_ceo') {
            if (authService.getCEO())
                return false;
            return false;

        }
        if (key == 'flight_board') {
            if (authService.getCEO())
                return true;
           

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
         var _roles=Enumerable.From($rootScope.roles).Where(function(x){  return x!='Flight Crew List' && x!='Flight Crew List (CAMO)'  && x!='Adding Flight Mechanic'; }).ToArray();
		 console.log('ROLES',_roles);
		 if (_roles && _roles.length == 1 && (_roles[0] == 'FlightPocket View'))
            return true;
        if (_roles && _roles.length == 1 && (_roles[0] == 'Transport' || _roles[0] == 'Station'))
            return true;
         
         var arr = Enumerable.From($rootScope.claims).Select('$.page').Distinct().ToArray();
         
        return arr.length==1 && arr[0]!='flight_admin' && arr[0]=='flight_board' ? true : false;
        

    };
	$rootScope.HasAccessToAddFM=function(){
		
		 var _roles=Enumerable.From($rootScope.roles).Where(function(x){  return x=='Adding Flight Mechanic' ; }).ToArray();
		 return _roles && _roles.length>0;
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
            { title: 'COLDWX', type: 8, issue: 'ColdWeatherOperationIssueDate', expire: 'ColdWeatherOperationExpireDate', RemField: 'RemainColdWeather',},
            { title: 'HOTWX', type: 9, issue: 'HotWeatherOperationIssueDate', expire: 'HotWeatherOperationExpireDate', RemField: 'RemainHotWeather',},
            { title: 'FIRSTAID', type: 10, issue: 'FirstAidIssueDate', expire: 'FirstAidExpireDate', RemField: 'RemainFirstAid',},
            { title: 'GRT', type: 103, issue: 'DateCaoCardIssue', expire: 'DateCaoCardIssue', RemField: 'RemainCAO', },
            { title: 'ANNUALRECURRENT', type: 11, issue: 'RecurrentIssueDate', expire: 'RecurrentExpireDate', RemField: 'RemainRecurrent', },
            { title: 'FMT', type: 104, issue: 'EGPWSIssueDate', expire: 'EGPWSExpireDate', RemField: 'RemainEGPWS', },
			
			//{ title: 'TRG02', type: 105, issue: 'LineIssueDate', expire: 'LineExpireDate', RemField: 'RemainLine', },
			{ title: 'TRG02', type: 105, issue: 'IssueDate2', expire: 'ExpireDate2', RemField: 'RemainTRG02', },
				{ title: 'TRG16', type: 242, issue: 'IssueDate2', expire: 'ExpireDate2', RemField: 'RemainTRG16', },
			
			  { title: 'Flight Crew Licence', type: 10000, issue: 'Issue10000', expire: 'Expire10000', RemField: 'RemainLicence', },
				  {title:'IP',type:10001},
				   {title:'IP2',type:10006},
				  
				    { title: 'Medical Certificate', type: 10002, issue: 'Issue10002', expire: 'Expire10000', RemField: 'RemainMedical', },
					  {title:'Passport',type:10003,RemField: 'RemainPassport',},
					    {title:'Line Check',type:10004,RemField: 'RemainNDT',},
							{title:'Crew Member Certificate',type:10005,RemField: 'RemainCMC',},
							
							
							
							  { title: 'Proficiency_Assessment', type: 243, issue: 'PROFICIENCY_ASSESSMENT_IsuueDate', expire: 'PROFICIENCY_ASSESSMENT_ExpireDate',  RemField:'RemainPROFICIENCY_ASSESSMENT', },
			{title:'HF',type:14,RemField: 'RemainHF',},
			
			{ RemField: 'RemainERP', title: 'ERP',type:34,name:'ERP', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
{ RemField: 'RemainMB', title: 'MB',type:181,name:'MB', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		{ RemField: 'RemainASD', title: 'ASD',type:26,name:'ASD', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		
		{ RemField: 'RemainGOM', title: 'GOM',type:27,name:'GOM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
        { RemField: 'RemainASF', title: 'ASF',type:116,name:'ASF', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		{ RemField: 'RemainCC', title: 'CC',type:115,name:'CC', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		
		{ RemField: 'RemainMP', title: 'MP',type:120,name:'MP', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		
		{ RemField: 'RemainMB', title: 'LOADSHEET',type:181,name:'LOADSHEET', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 120,visible:false },
		{ RemField: 'RemainPS', title: 'PS',type:114,name:'PS' , allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		{ RemField: 'RemainANNEX', title: 'ANNEX',type:124,name:'ANNEX', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		{ RemField: 'RemainDRM', title: 'DRM',type:123,name:'DRM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		{ RemField: 'RemainFMTD', title: 'FMTD',type:113,name:'FMTD', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		{ RemField: 'RemainMEL', title: 'MEL',type:30,name:'MEL', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		{ RemField: 'RemainMET', title: 'MET',type:121,name:'MET', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
	
		{ RemField: 'RemainLRC', title: 'COMM',type:119,name:'RC', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		{ RemField: 'RemainCALR', title: 'CALR',type:170,name:'CALR', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		{ RemField: 'RemainRSP', title: 'FP',type:176,name:'RSP', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		{ RemField: 'Remain4', title: 'FM',type:175,name:'FM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		{ RemField: 'Remain5', title: 'ATM',type:166,name:'ATM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		{ RemField: 'Remain6', title: 'NAV',type:183,name:'NAV', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		{ RemField: 'Remain7', title: 'AI',type:203,name:'AI', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		{ RemField: 'RemainSpecialApproval',type:199, title: 'SA',name:'SA', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			{ RemField: 'Remain3', title: 'DEICING',type:25,name:'DEICING', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		
		{ RemField: 'Remain14', title: 'EWIS',type:17,name:'EWIS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
     		{ RemField: 'Remain15', title: 'FTS',type:211,name:'FTS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			{ RemField: 'Remain16', title: 'PART145',type:0,name:'PART145', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			{ RemField: 'Remain12', title: 'PARTM',type:0,name:'PARTM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			{ RemField: 'Remain17', title: 'MOE',type:0,name:'MOE', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			{ RemField: 'Remain8', title: 'ATL',type:0,name:'ATL', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			{ RemField: 'Remain9', title: 'RAMP',type:0,name:'RAMP', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
	    	{ RemField: 'Remain10', title: 'ENGINE',type:0,name:'ENGINE', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			{ RemField: 'Remain11', title: 'B737',type:0,name:'B737', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			{ RemField: 'Remain13', title: 'LEGISLATION',type:0,name:'LEGISLATION', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			
		
			
			{ RemField: 'Remain20', title: 'AIROPS',type:0,name:'AIROPS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			{ RemField: 'Remain21', title: 'OM',type:0,name:'OM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			{ RemField: 'Remain24', title: 'CAME',type:0,name:'CAME', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			
			{ RemField: 'Remain22', title: 'ANALYSIS',type:0,name:'ANALYSIS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			{ RemField: 'Remain23', title: 'AUDIT',type:0,name:'AUDIT', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			
{ RemField: 'Remain25', title: 'MPA',type:0,name:'MPA', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			{ RemField: 'Remain26', title: 'ADSB',type:0,name:'ADSB', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			
			{ RemField: 'Remain27', title: 'FCL',type:0,name:'FCL', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
							
			{ RemField: 'RemainType737', title: 'TYPE',type:230,name:'TYPEM', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },	
			{ RemField: 'RemainLOAD_CONTROL', title: 'LOAD',type:180,name:'LOAD', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			{ RemField: 'RemainTRG01', title: 'TRG01',type:225,name:'LOAD', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
{ RemField: 'Remain19', title: 'SMSL3',type:198,name:'SMS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
		  { RemField: 'RemainSMSL2L3',type:-1000, title: 'SMSL2L3', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90,visible:false },
		  { RemField: 'RemainSMSL1L2L3', type:-1001,title: 'SMSL1L2L3', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90,visible:false },
				{ RemField: 'Remain18', title: 'SMSL2',type:197,name:'SMS', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100,visible:false },
			
			 { RemField: 'RemainTRG07A', title: 'TRG07A',type:233, allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90,visible:false },	
			
			
        ];
    };
	
	
	$rootScope.getCertificateTypeList = function () {
       /* return ['SEPTP', 'SEPT', 'LPC', 'OPC', 'LPR', 'DG', 'CRM', 'CCRM', 'SMS', 'AVSEC', 'COLDWX', 'HOTWX', 'FIRSTAID', 'GRT', 'ANNUALRECURRENT', 'FMT','TRG02'
		 ,'Flight Crew Licence'
		 ,'IP'
		 , 'Medical Certificate'
		 ,'Crew Member Certificate'
		 ,'Passport'
		 ,'Line Check'
		 ,'Proficiency Assessment'
		 ,'HF'
		];*/
		return Enumerable.From($rootScope.getCertificateTypeListDetails()).Select('$.title').ToArray();
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
    $rootScope.getDatasourceGroups = function (str) {
		if (!str)
			return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/base/jobgroups/'+ Config.CustomerId,
                //  key: "Id",
                // keyType: "Int32",
                version: 4
            }),
          
            sort: ['Remark'],
        });
		else
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/base/jobgroups/'+ Config.CustomerId,
                //  key: "Id",
                // keyType: "Int32",
                version: 4
            }),
             filter: ['Remark', 'startswith', str],
            sort: ['Remark'],
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
	////////////////////////////////////////////////
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
 