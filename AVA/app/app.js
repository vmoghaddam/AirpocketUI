﻿    
var app = angular.module('GriffinApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar', 'dx', 'ngSanitize', 'ngAnimate', 'angularjs-gauge', 'nvd3']).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]).config(configApp);
 
 
function configApp(ngGaugeProvider) {

    // setting the default parameters for 
    // gauge instances globally.
    ngGaugeProvider.setOptions({
        type: 'arch',
        size: 180,
        cap: 'round',
        thick: 12,
       // foregroundColor: "#ff8645",   // note the camelCase notation for parameter name
       // backgroundColor: "#e4e4e4"
    });

}
app.config(function ($routeProvider) {
    var version = 100;
    //ati new 2
    $routeProvider.when("/cp", {
        controller: "firstLoginController",
        templateUrl: "/app/views/firstlogin.html"
    });

    
     
    $routeProvider.when("/apps", {
        controller: "appsController",
        templateUrl: "/app/views/apps.html?v=" + "111"
    });
    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/home.html?v="+'666'
    });
    $routeProvider.when("/home/:year/:month/:day", {
        controller: "homeController",
        templateUrl: "/app/views/home.html?v=" + '666'
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/app/views/login.html"
    });

    

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "/app/views/signup.html"
    });

    $routeProvider.when("/orders", {
        controller: "ordersController",
        templateUrl: "/app/views/orders.html"
    });

    $routeProvider.when("/refresh", {
        controller: "refreshController",
        templateUrl: "/app/views/refresh.html"
    });

    $routeProvider.when("/tokens", {
        controller: "tokensManagerController",
        templateUrl: "/app/views/tokens.html"
    });

    $routeProvider.when("/associate", {
        controller: "associateController",
        templateUrl: "/app/views/associate.html"
    });

    $routeProvider.when("/test", {
        controller: "testController",
        templateUrl: "/app/views/test.html"
    });

    $routeProvider.when("/airport", {
        controller: "airportController",
        templateUrl: "/app/views/airport.html",
        isDispatch: false,
    });
    $routeProvider.when("/dispatch/airport", {
        controller: "airportController",
        templateUrl: "/app/views/airport.html",
        isDispatch: true,
    });

    $routeProvider.when("/aircrafttype", {
        controller: "aircraftTypeController",
        templateUrl: "/app/views/aircrafttype.html"
    });
    $routeProvider.when("/location", {
        controller: "locationController",
        templateUrl: "/app/views/location.html"
    });
    $routeProvider.when("/jobgroup", {
        controller: "jobgroupController",
        templateUrl: "/app/views/jobgroup.html"
    });

    $routeProvider.when("/person", {
        controller: "zpersonController",
        templateUrl: "/app/views/zperson.html?v=54"
    });
     $routeProvider.when("/person/crew", {
        controller: "zpersonController",
        templateUrl: "/app/views/zperson.html?v=56",
        isCrew:true,
    }); 
    $routeProvider.when("/person/course", {
        controller: "personcourseController",
        templateUrl: "/app/views/personcourse.html"
    });
     
    $routeProvider.when("/person/book", {
        controller: "personbookController",
        templateUrl: "/app/views/personbook.html"
    });

    $routeProvider.when("/person/certificate", {
        controller: "personcertificateController",
        templateUrl: "/app/views/personcertificate.html"
    });

    $routeProvider.when("/course", {
        controller: "courseController",
        templateUrl: "/app/views/course.html"
    });
    $routeProvider.when("/course/person", {
        controller: "coursepersonController",
        templateUrl: "/app/views/courseperson.html?v=1999"
    });
    $routeProvider.when("/course/type", {
        controller: "courseTypeController",
        templateUrl: "/app/views/coursetype.html"
    });
    $routeProvider.when("/flight/board", {
        controller: "flightBoardController",
        templateUrl: "/app/views/flightboard.html"
    });
    $routeProvider.when("/plan/board", {
        controller: "planBoardController",
        templateUrl: "/app/views/planningboard.html"
    });
    $routeProvider.when("/flight/board/ceo", {
        controller: "ceoFlightBoardController",
        templateUrl: "/app/views/ceoflightboard.html"
    });
    $routeProvider.when("/flight/board/all", {
        controller: "flightBoardAllController",
        templateUrl: "/app/views/flightboardall.html"
    });
    $routeProvider.when("/dispatch/flights/:airport/:admin", {
        controller: "flightBoardAllController",
        templateUrl: "/app/views/flightboardall.html",
        isDispatch: true,
    });
    $routeProvider.when("/maintenance/flights", {
        controller: "flightPlansMaintenanceController",
        templateUrl: "/app/views/flightPlansMaintenance.html"
    });

    $routeProvider.when("/maintenance/flights/calendar", {
        controller: "flightPlansCalendarMaintenanceController",
        templateUrl: "/app/views/flightPlansCalendarMaintenance.html"
    });


    $routeProvider.when("/maintenance/registers/assign", {
        controller: "planRegistersController",
        templateUrl: "/app/views/planRegisters.html"
    });
    $routeProvider.when("/maintenance/flights/registers", {
        controller: "changeFlightRegisterController",
        templateUrl: "/app/views/changeflightregister.html"
    });
    //$routeProvider.when("/flight/plan/register/:id", {
    //    controller: "flightPlanRegsiterController",
    //    templateUrl: "/app/views/flightplanregister.html"
    //});

    $routeProvider.when("/library", {
        controller: "libraryController",
        templateUrl: "/app/views/library.html?v=111",
        isDocument:false,
    });
    $routeProvider.when("/library/people", {
        controller: "libraryController",
        templateUrl: "/app/views/librarypeople.html",
        isDocument: false,
    });
    $routeProvider.when("/library/:type/:publisher/:author", {
        controller: "libraryController",
        templateUrl: "/app/views/library.html?v=433",
        isDocument: false,
    });
    $routeProvider.when("/option/:parent", {
        controller: "optionController",
        templateUrl: "/app/views/option.html",
         
    });

    $routeProvider.when("/document", {
        controller: "libraryController",
        templateUrl: "/app/views/document.html",
        isDocument: true,
    });

    $routeProvider.when("/publisher", {
        controller: "organizationController",
        templateUrl: "/app/views/organization.html",
        TypeId: 77,
    });
    $routeProvider.when("/author", {
        controller: "personmiscController",
        templateUrl: "/app/views/personmisc.html",
        TypeId: 75,
    });
   
    $routeProvider.when("/journal", {
        controller: "journalController",
        templateUrl: "/app/views/journal.html",
        TypeId: 1,
    });
    $routeProvider.when("/conference", {
        controller: "journalController",
        templateUrl: "/app/views/journal.html",
        TypeId: 2,
    });
    $routeProvider.when("/notification", {
        controller: "notificationController",
        templateUrl: "/app/views/notification.html",
        
    });
    $routeProvider.when("/flight", {
        controller: "flightController",
        templateUrl: "/app/views/flight.html",

    });
   


    


    $routeProvider.when("/flight/archive", {
        controller: "flightListController",
        templateUrl: "/app/views/flightlist.html",
        type:-1,

    });
    $routeProvider.when("/flight/archive/:airport", {
        controller: "flightListController",
        templateUrl: "/app/views/flightlist.html",
        type: -1,

    });

    
    $routeProvider.when("/maintenance/flights/irregular", {
        controller: "irregularFlightController",
        templateUrl: "/app/views/irregularflight.html",
        type: 2,

    });
    
    $routeProvider.when("/flight/plans/closed", {
        controller: "flightPlanViewController",
        templateUrl: "/app/views/flightplanview.html",
        type: 50,

    });
    $routeProvider.when("/commercial/flights/irregular", {
        controller: "irregularFlightController",
        templateUrl: "/app/views/irregularflight.html",
        type: 1,

    });
    $routeProvider.when("/commercial/flights/plannig", {
        //controller: "flightController",
        //templateUrl: "/app/views/flight.html",
        controller: "flightPlanningController",
        templateUrl: "/app/views/flightPlanning.html",

    });
    $routeProvider.when("/commercial/plans/permits", {
        //controller: "flightPlanViewController",
        //templateUrl: "/app/views/flightplanview.html",
         controller: "flightPlanPermitController",
        templateUrl: "/app/views/flightplanpermit.html",
        //type: 50,

    });
    $routeProvider.when("/commercial/plans/crew", {
         
        controller: "flightPlanCrewController",
        templateUrl: "/app/views/flightPlanCrew.html",
        //type: 50,

    });
    $routeProvider.when("/commercial/plans/apply", {
        //controller: "flightPlanApplyController",
        //templateUrl: "/app/views/flightplanapply.html",
        controller: "flightPlanApply2Controller",
        templateUrl: "/app/views/flightplanapply2.html",

    });
    $routeProvider.when("/commercial/plans", {
        controller: "flightPlanListController",
        templateUrl: "/app/views/flightplanlist.html",


    });

    $routeProvider.when("/crewtest", {
        controller: "crewtestController",
        templateUrl: "/app/views/crewtest.html"
    });
    $routeProvider.when("/crew/assign/cockpit", {
        controller: "crewassignController",
        templateUrl: "/app/views/crewassign.html",
        isCockpit: true,
    });
    $routeProvider.when("/crew/assign/cabin", {
        controller: "crewassignController",
        templateUrl: "/app/views/crewassign.html",
        isCockpit: false,
    });
    $routeProvider.when("/crew/assign/timeline/cabin", {
        controller: "crewassign2Controller",
        templateUrl: "/app/views/crewassign2.html",
        isCockpit: false,
    });
    $routeProvider.when("/crew/assign/timeline/cockpit", {
        controller: "crewassign2Controller",
        templateUrl: "/app/views/crewassign2.html",
        isCockpit: true,
    });
    $routeProvider.when("/crew/assign2", {
        controller: "crewassign2Controller",
        templateUrl: "/app/views/crewassign2.html"
    });
    $routeProvider.when("/crew/report", {
        controller: "crewReportController",
        templateUrl: "/app/views/crewReport.html"
    });
    
    $routeProvider.when("/fuel/report", {
        controller: "fuelReportController",
        templateUrl: "/app/views/fuelReport.html?v=200"
    });
    $routeProvider.when("/delays/report", {
        controller: "flightDelaysController",
        templateUrl: "/app/views/flightDelays.html"
    });

    $routeProvider.when("/matchinglist", {
        controller: "mlistController",
        templateUrl: "/app/views/mlist.html",
        TypeId: 75,
    });

    $routeProvider.when("/commercial/planning", {
        //controller: "flightController",
        //templateUrl: "/app/views/flight.html",
        controller: "planController",
        templateUrl: "/app/views/plan.html",

    });
    //$routeProvider.when("/crew/assign", {
    //    controller: "crewtestController",
    //    templateUrl: "/app/views/crewtest.html"
    //});
    $routeProvider.when("/flight/report/security", {
        controller: "flightReportSecurityController",
        templateUrl: "/app/views/flightreportsecurity.html"
    });
    $routeProvider.when("/reg/availability", {
        controller: "regAvailabilityController",
        templateUrl: "/app/views/regAvailability.html"
    });
    $routeProvider.when("/route", {
        controller: "routeController",
        templateUrl: "/app/views/route.html",
        isDispatch: false,
    });
    $routeProvider.when("/delay/codes", {
        controller: "delayCodesController",
        templateUrl: "/app/views/delayCodes.html",
        isDispatch: false,
    });

    $routeProvider.when("/crew/assign/reg/cockpit", {
        controller: "crewassignregController",
        templateUrl: "/app/views/crewassignreg.html",
        isCockpit: true,
    });
    $routeProvider.when("/crew/assign/reg/cabin", {
        controller: "crewassignregController",
        templateUrl: "/app/views/crewassignreg.html",
        isCockpit: false,
    });

    $routeProvider.when("/roster/daily", {
        //controller: "rosterDailyController",
        //templateUrl: "/app/views/rosterdaily.html",
        controller: "rosterReport",
        templateUrl: "/app/views/rosterreport.html",
        isCockpit: false,
    });

    //$routeProvider.when("/roster", {
    //    controller: "dailyRoster2Controller",
    //    templateUrl: "/app/views/dailyroster2.html",
    //    isCockpit: false,
    //});
    $routeProvider.when("/crew/time/report", {
        controller: "crewTimeReportController",
        templateUrl: "/app/views/crewTimeReport.html?v=105"
    });
    //vahid new
    $routeProvider.when("/flights/report", {
        controller: "reportFlightsController",
        templateUrl: "/app/views/reportFlights.html"
    });
    $routeProvider.when("/crew/report/fixtime", {
        controller: "fixTimeReportController",
        templateUrl: "/app/views/fixtimereport.html"
    });


    $routeProvider.when("/roster", {
        controller: "rosterController",
        templateUrl: "/app/views/roster.html"
    });
    $routeProvider.when("/stat/delay", {
        controller: "statDelayController",
        templateUrl: "/app/views/statDelay.html"
    });
    $routeProvider.when("/users", {
        controller: "usersController",
        templateUrl: "/app/views/users.html"
    });

    $routeProvider.when("/gnt", {
        controller: "gntController",
        templateUrl: "/app/views/gnt.html"
    });
    $routeProvider.when("/fdr", {
        controller: "reportFDRController",
        templateUrl: "/app/views/reportFDR.html"
    });
    $routeProvider.when("/fin/report", {
        controller: "finReportController",
        templateUrl: "/app/views/finReport.html"
    });
    $routeProvider.when("/fin/monthly/report", {
        controller: "finmonthController",
        templateUrl: "/app/views/finmonthreport.html"
    });

    $routeProvider.when("/delays", {
        controller: "delayReportController",
        templateUrl: "/app/views/delayreport.html"
    });
	$routeProvider.when("/delays/flight", {
        controller: "delayReportFlightController",
        templateUrl: "/app/views/delayreportflight.html?v=100"
    });

    $routeProvider.when("/citypair", { 
        controller: "citypairController",
        templateUrl: "/app/views/citypair.html"
    });


    $routeProvider.when("/fdps", {
        controller: "fdpsController",
        templateUrl: "/app/views/fdps.html"
    });

    $routeProvider.when("/fdps/fly", {
        controller: "fdpsflyController",
        templateUrl: "/app/views/fdpsfly.html"
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
        templateUrl: "/app/views/forma.html"
    });
    $routeProvider.when("/roster/admin", {
        controller: "fdpsController",
        templateUrl: "/app/views/fdps.html",
        isAdmin: true,
    });

    $routeProvider.when("/board", {
        controller: "boardController",
        templateUrl: "/app/views/board.html?v=924",
        isAdmin: true,
    });
    $routeProvider.when("/board/fly", {
        controller: "boardflyController",
        templateUrl: "/app/views/boarfly.html",
        isAdmin: true,
    });

    $routeProvider.when("/board/test", {
        controller: "boardTestController",
        templateUrl: "/app/views/boardtest.html",
        isAdmin: true,
    });
    $routeProvider.when("/reg/flights/monthly", {
        controller: "regFlightsMonthlyController",
        templateUrl: "/app/views/regflightmonthly.html",
        
    });

    $routeProvider.when("/reg/flights/monthly/:yy/:mm", {
        controller: "regFlightsMonthlyController",
        templateUrl: "/app/views/regflightmonthly.html",

    });

    $routeProvider.when("/flights/monthly", {
        controller: "flightsMonthlyController",
        templateUrl: "/app/views/flightsmonthly.html",

    });

    $routeProvider.when("/formmovaled", {
        controller: "formmovaledController",
        templateUrl: "/app/views/formmovaled.html"
    });
    $routeProvider.when("/fuel", {
        controller: "fuelController",
        templateUrl: "/app/views/fuelbi.html",
        reloadOnSearch: false
    });
    $routeProvider.when("/fuel/main", {
        controller: "fuelkpiController",
        templateUrl: "/app/views/fuelbikpi.html",
        reloadOnSearch: false
    });
    $routeProvider.when("/delay/main", {
        controller: "delaykpiController",
        templateUrl: "/app/views/delaybikpi.html",
        reloadOnSearch: false
    });

    $routeProvider.when("/delay/daily", {
        controller: "delaybidailyController",
        templateUrl: "/app/views/delaybidaily.html",
        reloadOnSearch: false
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
        templateUrl: "/app/views/nira.html?v=100"
    });

    $routeProvider.when("/asr", {
        controller: "asrreportController",
        templateUrl: "/app/views/asrreport.html"
    });

    $routeProvider.when("/flights/efbs", {
        controller: "reportEFBController",
        templateUrl: "/app/views/reportEFB.html?v=1009"
    });


    $routeProvider.when("/expiring/coursetype", {
        controller: "expiringCourseTypeController",
        templateUrl: "/app/views/expiringCourseType.html"
    });
    $routeProvider.when("/duty/timeline", {
        controller: "dutyTimelineController",
        templateUrl: "/app/views/dutyTimeline.html"
    });
    $routeProvider.when("/scheduling/admin", {
        controller: "schedulingvrhController",
        templateUrl: "/app/views/schedulingvrh.html?v=17081",
        isAdmin: true,
    });
    $routeProvider.when("/scheduling", {
        controller: "schedulingvrhController",
        templateUrl: "/app/views/schedulingvrh.html?v=16071",
        isAdmin: false,
    });

    $routeProvider.when("/groups/expiring", {
        controller: "expiringGroupController",
        templateUrl: "/app/views/expiringgroup.html"
    });

    $routeProvider.when("/fixedtime", {
        controller: "fixTimeController",
        templateUrl: "/app/views/fixtime.html"
    });

    $routeProvider.when("/crew/report/fixtime/daily", {
        controller: "fixTimeReportDailyController",
        templateUrl: "/app/views/fixtimereportdaily.html?v=1005"
    });


    $routeProvider.when("/teachers", {
        controller: "teachersController",
        templateUrl: "/app/views/teachers.html"
    });

    $routeProvider.when("/raw", {
        controller: "rawcmdController",
        templateUrl: "/app/views/rawcmd.html"
    });
	$routeProvider.when("/scheduling/grid", {
        controller: "schedulinggridController",
        templateUrl: "/app/views/schedulinggrid.html"
    });
 $routeProvider.when("/report/flight/daily", {
        controller: "reportFlightDailyController",
        templateUrl: "/app/views/reportflightdaily.html?v=101104802"
    });
	   $routeProvider.when("/report/flight/daily/station", {
        controller: "reportFlightDailyStationController",
        templateUrl: "/app/views/reportflightdailystation.html"
    });
	
  $routeProvider.when("/trn/stat", {
        controller: "trnStatController",
        templateUrl: "/app/views/trnstat.html?v=1100"
    });
	
	$routeProvider.when("/trn/expiring/groups", {
        controller: "trnexpiringGroupController",
        templateUrl: "/app/views/trnexpiringgroups.html"
    });

    $routeProvider.when("/trn/schedule", {
        controller: "trnscheduleController",
        templateUrl: "/app/views/trnschedule.html"
    });

    $routeProvider.when("/trn/schedule/coursetype", {
        controller: "trnScheduleCourseTypeController",
        templateUrl: "/app/views/trnschedulecoursetype.html"
    });
    $routeProvider.when("/trn/schedule/course", {
        controller: "trnScheduleCourseController",
        templateUrl: "/app/views/trnschedulecourse.html"
    });


    $routeProvider.when("/trn/dashboard", {
        controller: "trnDashboardController",
        templateUrl: "/app/views/trndashboard.html"
    });
	
	 $routeProvider.when("/duty/timeline/z", {
        controller: "zdutyTimelineController",
        templateUrl: "/app/views/zdutyTimeline.html?v=505"
    });
	 
	
	$routeProvider.when("/scheduling/z", {
        controller: "zschedulingController",
        templateUrl: "app/views/zscheduling.html",
        isAdmin: false,
    });
	
	
	  $routeProvider.when("/cabin/report", {
      controller: "cabinReports",
      templateUrl: "/app/views/cabinReports.html?v=1123"
  });
	  $routeProvider.when("/sim", {
        controller: "simController",
        templateUrl: "app/views/sim.html?v=4143"
    });

   $routeProvider.when("/mnt/status", {
       controller: "mntStatusController",
    templateUrl: "/app/views/mntStatus.html?v=1130"
   });
   
   
      $routeProvider.when("/request/form", {
        controller: "requestFormController",
        templateUrl: "/app/views/requestForm.html?v=1130"
    });

    $routeProvider.when("/nis/form", {
        controller: "nisFollowUpController",
        templateUrl: "/app/views/nisFollowUp.html?v=1130"
    });

    $routeProvider.when("/logestic/form", {
        controller: "logesticRequestController",
        templateUrl: "/app/views/logesticRequest.html?v=1130"
    });

     $routeProvider.when("/disagg/form", {
         controller: "disaggregationController",
         templateUrl: "/app/views/disaggregation.html?v=1130"
    });

     $routeProvider.when("/agg/form", {
         controller: "aggregateController",
         templateUrl: "/app/views/aggregate.html?v=1130"
    });

    $routeProvider.when("/receipt/form", {
        controller: "receiptController",
         templateUrl: "/app/views/receipt.html?v=1130"
    });

    //$routeProvider.when("/delivery/form", {
    //    controller: "directDeliveryController",
    //    templateUrl: "/app/views/directDelivery.html?v=1130"
    //});

    $routeProvider.when("/vira/inventory", {
        controller: "vira_inventoryController",
        templateUrl: "/app/views/vira_inventory.html?v=1130"
    });

     $routeProvider.when("/vira/beginning", {
         controller: "vira_beginningController",
        templateUrl: "/app/views/vira_beginning_inventory.html?v=1130"
    });

     $routeProvider.when("/vira/part/type", {
        controller: "vira_part_typeController",
        templateUrl: "/app/views/vira_part_type.html?v=1130"
    });

     $routeProvider.when("/vira/request", {
         controller: "vira_request_listController",
        templateUrl: "/app/views/vira_request_list.html?v=1130"
    });
  $routeProvider.when("/vira/request/cartable", {
         controller: "vira_request_cartableController",
        templateUrl: "/app/views/vira_request_cartable.html?v=1130"
    });

    $routeProvider.when("/vira/request/cartable/line", {
         controller: "vira_request_cartable_lineController",
        templateUrl: "/app/views/vira_request_cartable_line.html?v=1130"
    });

    $routeProvider.when("/vira/partnumber", {
        controller: "vira_part_numberController",
        templateUrl: "/app/views/vira_part_number.html?v=1130"
    });

      $routeProvider.when("/vira/inventory/total", {
          controller: "inventory_totalController",
        templateUrl: "/app/views/vira_inventory_total.html?v=1130"
    });

    $routeProvider.when("/vira/cardex", {
          controller: "vira_cardexController",
        templateUrl: "/app/views/vira_cardex.html?v=1130"
    });

 $routeProvider.when("/forms/vacation", {
     controller: "formsVacationController",
     templateUrl: "/app/views/formsvacation.html?v=1130"
 });
 
  $routeProvider.when("/forms/vacation/responsible", {
     controller: "forms_vacation_responsibleController",
     templateUrl: "/app/views/form_vacation_responsible.html?v=1130"
  });


    $routeProvider.when("/exam/client/:id/:cid", {
        controller: "exam_client_controller",
        templateUrl: "/app/views/exam_client.html?v=" + '5673'
    });

    $routeProvider.when("/fdm/main", {
        controller: "fdm_main_controller",
        templateUrl: "/app/views/fdm_main.html?v=" + '5673'
    });


    $routeProvider.when("/fdm/main/z", {
        controller: "zfdm_main_controller",
        templateUrl: "/app/views/zfdm_main.html?v=" + '5673'
    });


    $routeProvider.otherwise({ redirectTo: "/home" });

});   

////var serviceBase = 'http://grfn.api.epatrin.ir/';
////var webBase = 'http://grfn.epatrin.ir/';
//if (window.location.href.indexOf('fleet.flypersia.aero') != -1) {
//    var webBase = 'http://fleet.flypersia.aero/airpocket/';
//    var serviceBase = 'http://fleet.flypersia.aero/api.airpocket/';
//}
//else {
//    //var serviceBase = 'http://apig.epapocket.ir/';
//    var serviceBase = 'http://localhost:58908/';
//   // var serviceBase = 'http://fleet.caspianairlines.com/api/';
//    var webBase = 'http://localhost:30000/';
//} 
//var serviceBase = 'http://fleet.caspianairlines.com/api/';

var serviceBaseAPI ='https://ava.api.airpocket.app/';  //*
var serviceBaseTRN = 'https://ava.apitrn.airpocket.app/';
 
 
var webBase = 'https://ava.airpocket.app/';  //*
var serviceBase ='https://ava.apinet.airpocket.app/'; //*
var serviceBaseAeroTango='https://ava.apinet.aerotango.app/';
var liburl = serviceBase;
var serviceBase2 =  'https://localhost:5001/'; 
 
var signFiles = 'https://_fbpocket.ir/upload/signs/';
var apimain='https://ava.api.airpocket.app/';
var comAPI='https://ava.api.airpocket.app/'; 
var msgUrl="https://ava.apinet.airpocket.app/"; 
var apiLog='https://ava.apilog.airpocket.app/'; //*
var schUrl='https://_sch.apvaresh.com/'; 
var apigd='https://ava.api.airpocket.app/';//'http://ava.api.airpocket.app/'; 
var netProfile='https://_netprofile.apvaresh.com/'; 
var apireportflight='https://ava.apireportflight.airpocket.app/'; //* 
var zreportflight=apireportflight ;
var apixls='https://ava.apixls.airpocket.app/'; //*
var apiScheduling='https://ava.apischeduling.aerotango.app/';
 var zapiScheduling="https://ava.apischeduling.aerotango.app/";

var apiExternal = 'https://_xpi.airpocket.app/';
var airlineCode = 'vrh';

var serviceSKYBAG = 'https://_api.sbvaresh.ir/';
var weatherUrl='https://wxava.skybag.app/';
var staticFilesSKYBAG = 'https://fbpocket.ir/Upload/';

var apimsg='https://_apimsg.apvaresh.com/';
var apiplanning='https://ava.apiplanning.airpocket.app/'; //*
var apilogdefault='https://ava.apilogdefault.airpocket.app/'; //*
var apiapsb='https://ava.apiapsb.airpocket.app/';
var apiprofile='https://ava.apiprofile.airpocket.app/';
var apiauth='https://ava.apinet.airpocket.app//'; //*
var atcfiles='https://files.airpocket.app/air1/atc/';

var apiCAO='https://ava.apicaox.airpocket.app/';

var zapinet='https://ava.apinet.airpocket.app/';
var zfuel='https://ava.apifuel.airpocket.app/';
var zapitrn='https://ava.apitrn.airpocket.app/';
var vira_api = "https://lmmcore.online/";
var zapinet2 = 'https://ava.zapinet.airpocket.app/';
var api_fdm = 'http://localhost:22554/';

var temp_url='https://ava.temp.apinet.airpocket.app/';
    //'http://localhost:58908/';
    //'http://localhost:40654/';
   var serviceRequest = 'https://ava.apiform.airpocket.app/';
    //'http://localhost:10707/';
//'http://ngauthenticationapi.azurewebsites.net/';
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});
 
//app.config(function ($httpProvider) {
app.config(['$httpProvider' , function ($httpProvider ) {

    $httpProvider.interceptors.push('authInterceptorService');
    $httpProvider.defaults.headers.common = {
        'ReqKey':localStorage.getItem("userData")   ? localStorage.getItem("userData").UserId:''
        
    };
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

app.run(['authService', 'activityService', 'mntService', 'vira_general_service', '$rootScope', '$location', '$templateCache', function (authService, activityService, mntService, vira_general_service, $rootScope, $location, $templateCache) {
    //alert($location.absUrl());
    // Config.CustomerId = 1;
	
	
	$rootScope._load=0;
    $rootScope.CustomerName = 'Caspian';
    $rootScope.CustomerPhone = '+982148063000';
    $rootScope.CustomerEmail = 'OpsEng@Caspian.aero';
    Config.CustomerId = 4;
    if ($location.absUrl().indexOf('fleet.flypersia.aero') != -1) {
        webBase = 'http://fleet.flypersia.aero/airpocket/';
        serviceBase = 'http://fleet.flypersia.aero/api.airpocket/';
    }
    ////////////////////////////////
    $rootScope.reportServer = "https://ava.report.airpocket.app/frmreportview.aspx";
	$rootScope.formsReportServer = "https://ava.formsreport.airpocket.app/frmreportview.aspx";
    $rootScope.reportServerTRN = "https://ava.reporttrn.airpocket.app/frmreportview.aspx";
	$rootScope.zreportServerTRN = "https://ava.reporttrn.airpocket.app/frmreportview.aspx";
	$rootScope.zreportServerTRNForms="https://ava.reporttrn.airpocket.app/frmreportview.aspx";
	$rootScope.serviceMnt = 'https://ava.apimnt.airpocket.app/';
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
    $rootScope.clientsFilesUrl = 'https://files.airpocket.app/varesh/certificates/';//webBase + 'upload/clientsfiles/';
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
	$rootScope.HasDispatch = function () {
        
        var role = Enumerable.From($rootScope.roles).Where('$=="Dispatch"').FirstOrDefault();
        if (role)
            return true;
        return false;
    };
	
	$rootScope.HasViewFSG = function () {
        
       if ($rootScope.userName.toLowerCase() == 'demo')
            return true;
		if ($rootScope.userName.toLowerCase() == 'sadati')
            return true;
		if ($rootScope.userName.toLowerCase() == 'stn.hamidi')
            return true;
		//sadati
		//stn.hamidi
        return false;
    };
	 $rootScope.HasACStatus = function () {
         if ($rootScope.userName.toLowerCase()=='khanjani')
			 return true;
        var role = Enumerable.From($rootScope.roles).Where('$=="A/C Status"').FirstOrDefault();
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

$rootScope.HasHR = function () {

        var role = Enumerable.From($rootScope.roles).Where('$=="HR"').FirstOrDefault();
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
			var role_hide_crew = Enumerable.From($rootScope.roles).Where('$=="Hide Crew"').FirstOrDefault();
		if ($rootScope.userName.toLowerCase()=='kusha' || $rootScope.userName.toLowerCase()=='mehregan')
			return false;
		//console.log(role_hide_crew);
		if (role_hide_crew)
			return false;
		//else return true;
        var role = Enumerable.From($rootScope.roles).Where('$=="Flight Crew List"').FirstOrDefault();
        if (role)
            return true;
		 var role = Enumerable.From($rootScope.roles).Where('$=="Flight Crew List"').FirstOrDefault();
        if (role)
            return true;
		var role = Enumerable.From($rootScope.roles).Where('$=="Show Flight Crew"').FirstOrDefault();
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
        try {

            var rec = Enumerable.From(Config.MenuItems).Where('$.moduleId==' + $rootScope.moduleId + ' && $.key=="' + key + '"').FirstOrDefault();
            activityService.hitMenu(key, target, 'Visiting ' + $rootScope.module + ' > ' + rec.title);
        }
        catch (e) { }
         
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
		if (key=='flight_calendar_cockpit' )
			return $rootScope.userName.toLowerCase().startsWith('cs.') ||  $rootScope.userName.toLowerCase().startsWith('ops.kha')
		||  $rootScope.userName.toLowerCase().startsWith('ops.paz')
		||  $rootScope.userName.toLowerCase().startsWith('ops.dara')
		||  $rootScope.userName.toLowerCase().startsWith('ops.jama')
		||  $rootScope.userName.toLowerCase().startsWith('ops.abdi')
		||  $rootScope.userName.toLowerCase().startsWith('ops.aska')
		//||  $rootScope.userName.toLowerCase()==('qa')
		//||  $rootScope.userName.toLowerCase()==('cms')
		||  $rootScope.userName.toLowerCase()==('s.kashani')
		||  $rootScope.userName.toLowerCase()==('marefat');
        //profile_users
        if (key == 'profile_users' && $rootScope.userName != 'razbani') {

            return false;


        }
       
       if (key == 'requests_scheduling') {
             return $rootScope.userName.toUpperCase()=='CS.YAZDANI' || $rootScope.userName.toLowerCase() == 'demo';

        }
		if (key == 'requests') {
             return $rootScope.userName.toUpperCase()=='KERMANSHAHI' ||   $rootScope.userName.toUpperCase()=='N.TALEBI' || $rootScope.userName.toLowerCase() == 'demo';

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
                    exist = Enumerable.From($rootScope.claims).Where('$.page=="learning_admin"').FirstOrDefault();
                    
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
	//2023-09-10
	$rootScope.IsFlightPlan=function(){
		 if ($rootScope.userName.toLowerCase() == 'demo')
            return true;
		var comm = Enumerable.From($rootScope.roles).Where('$=="Commercial"').FirstOrDefault();
		if (comm)
			return true;
		
	};
    $rootScope.IsFlightBoardEditable = function () {
		var comm = Enumerable.From($rootScope.roles).Where('$=="Commercial" || $=="Dispatch"').FirstOrDefault();
        var exist = Enumerable.From($rootScope.claims).Where('($.page=="flight_board" && $.action=="edit") || $.page=="flight_admin"').FirstOrDefault();
        return (exist || comm) ? true : false;
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
		var exeps=['Hide Crew'];
		var _roles=$rootScope.roles ?Enumerable.From($rootScope.roles).Where(function(x) {return exeps.indexOf(x)==-1;}).ToArray():[];
console.log('_roles hide crew',_roles);
        if ($rootScope.roles && $rootScope.roles.length == 1 && ($rootScope.roles[0] == 'Transport' || $rootScope.roles[0] == 'Station'))
            return true;
		if (_roles.length==1)
			return true;
         
         var arr = Enumerable.From($rootScope.claims).Select('$.page').Distinct().ToArray();

        return arr.length==1 && arr[0]!='flight_admin' ? true : false;
        

    };
	$rootScope.IsOnlyFDR = function () {

        if ($rootScope.roles && $rootScope.roles.length == 1 && ($rootScope.roles[0] == 'FDR Report' ))
            return true;
         
        else return false;
        

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
	
		$rootScope.HasHideCrew = function () {

        var role = Enumerable.From($rootScope.roles).Where('$="Hide Crew"').FirstOrDefault();
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
	 $rootScope.vira_user_id = 8;
    $rootScope.vira_user_delafult_stock_id = 19;
    $rootScope.HasAccessToLGS = function () {

        var exist = Enumerable.From($rootScope.roleClaims).Where('$.indexOf("LGS")!=-1').FirstOrDefault();
        return exist ? true : false;
    };



    $rootScope.fill_vira_information = function(){
        mntService.get_ata_chart().then(function (res1) {
            
            $rootScope.vira_ds_ata = res1;

        });
    };


    $rootScope.vira_locations = null;
    $rootScope.vira_user_locations_all = null;
    $rootScope.fill_vira_locations = function (callback) {
        mntService.get_locations().then(function (res1) {

            var _filtered = Enumerable.From(res1).Where('$.title.startsWith("AVA")').ToArray();
            $.each(_filtered, function (_i, _d) {
                _d.gI_LocationId = _d.id;
                _d.uM_UserId = $rootScope.vira_user_id;
            });
            $rootScope.vira_locations = _filtered;

            vira_general_service.get_user_location({}).then(function (res2) {
                var _filtered2 = Enumerable.From(res2).Where('$.title.startsWith("AVA")').ToArray();
                $rootScope.vira_user_locations_all = _filtered2;
            });




            if (callback)
                callback();

        });
    };


    $rootScope.menu_broadcast = function (key, prms) {
        $rootScope.$broadcast(key, prms);
    }





    /////////////////////////////////////////////
	
	
	
	
	
	
	
	
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
 
 
 