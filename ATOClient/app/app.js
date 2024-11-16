
var app = angular.module('GriffinApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar',  'ngSanitize', 'ngAnimate', 'angularjs-gauge', 'nvd3']).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]).config(configApp);
configApp.$inject = ['ngGaugeProvider'];

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
    


    $routeProvider.when("/apps", {
        controller: "appsController",
        templateUrl: "/app/views/apps.html?v=" + version
    });
    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/home.html?v=" + '5673'
    });
   
    

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/app/views/login.html"
    });



    

    $routeProvider.when("/verify", {
        controller: "verifyController",
        templateUrl: "/app/views/verify.html"
    });

    $routeProvider.when("/profile", {
        controller: "profileController",
        templateUrl: "/app/views/profile.html?v=" + '5673'
    });

    $routeProvider.when("/exam/:id", {
        controller: "question_list_controller",
        templateUrl: "/app/views/question_list.html?v=" + '5673'
    });
    $routeProvider.when("/exam/:id/:cid", {
        controller: "question_list_controller",
        templateUrl: "/app/views/question_list.html?v=" + '5673'
    });

    $routeProvider.when("/quiz/paging", {
        controller: "question_paging_controller",
        templateUrl: "/app/views/question_paging.html?v=" + '5673'
    });
   

      $routeProvider.when("/tile", {
          controller: "atoTileController",
        templateUrl: "/app/views/atoTile.html?v=" + '5673'
    });
   

    $routeProvider.otherwise({ redirectTo: "/home" });

});

 

var serviceBaseAPI = 'https://ava.api.airpocket.app/';  //*
var serviceBaseTRN = 'https://ava.apitrn.airpocket.app/';


var webBase = 'https://ava.airpocket.app/';  //*
var serviceBase = 'https://ava.apinet.airpocket.app/'; //*
var liburl = serviceBase;
var serviceBase2 = 'https://localhost:5001/';

var signFiles = 'https://_fbpocket.ir/upload/signs/';
var apimain = 'https://ava.api.airpocket.app/';
var comAPI = 'https://_api.apvaresh.com/';
var msgUrl = "https://ava.apinet.airpocket.app/";
var apiLog = 'https://ava.apilog.airpocket.app/'; //*
var schUrl = 'https://_sch.apvaresh.com/';
var apigd = 'https://ava.api.airpocket.app/';//'http://ava.api.airpocket.app/'; 
var netProfile = 'https://_netprofile.apvaresh.com/';
var apireportflight = 'https://ava.apireportflight.airpocket.app/'; //* 
var zreportflight = apireportflight;
var apixls = 'https://ava.apixls.airpocket.app/'; //*
var apiScheduling = 'https://ava.apischeduling.airpocket.app/';
var zapiScheduling = "https://ava.apischeduling.airpocket.app/";

var apiExternal = 'https://_xpi.airpocket.app/';
var airlineCode = 'vrh';

var serviceSKYBAG = 'https://_api.sbvaresh.ir/';
var weatherUrl = 'https://wxava.skybag.app/';
var staticFilesSKYBAG = 'https://fbpocket.ir/Upload/';

var apimsg = 'https://_apimsg.apvaresh.com/';
var apiplanning = 'https://ava.apiplanning.airpocket.app/'; //*
var apilogdefault = 'https://ava.apilogdefault.airpocket.app/'; //*
var apiapsb = 'https://ava.apiapsb.airpocket.app/';
var apiprofile = 'https://ava.apiprofile.airpocket.app/';
var apiauth = 'https://ava.apinet.airpocket.app//'; //*
var atcfiles = 'https://files.airpocket.app/air1/atc/';

var apiCAO = 'https://_apicao.apvaresh.com/';

var zapinet = 'https://ava.apinet.airpocket.app/';
var zfuel = 'https://ava.apifuel.airpocket.app/';
var zapitrn = 'https://ava.apitrn.airpocket.app/';

//var api_ato_client = 'https://ava.ato.apiclient.airpocket.app/';
//var api_ato = 'https://ava.apitrn.airpocket.app/';

var api_ato_client = 'http://localhost:4006/';
var api_ato = 'http://localhost:4005/';


 
var vira_api = "https://lmmcore.online/";
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

app.run(['authService', 'activityService', 'mntService', 'vira_general_service', '$rootScope', '$location', '$templateCache', function (authService, activityService, mntService, vira_general_service, $rootScope, $location, $templateCache) {
    

    $rootScope._load = 0;
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
    $rootScope.reportServerTRN = "https://ava.report.airpocket.app/frmreportview.aspx";
    //$rootScope.serviceMnt = 'https://ava.apimnt.airpocket.app/';
    $rootScope.serviceMnt = 'http://localhost:9063/';

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
    $rootScope.navigateSimple = function (target) {


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
    $rootScope.HasACStatus = function () {

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
        if ($rootScope.userName.toLowerCase() == 'kusha' || $rootScope.userName.toLowerCase() == 'mehregan')
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
        try {

            var rec = Enumerable.From(Config.MenuItems).Where('$.moduleId==' + $rootScope.moduleId + ' && $.key=="' + key + '"').FirstOrDefault();
            activityService.hitMenu(key, target, 'Visiting ' + $rootScope.module + ' > ' + rec.title);
        }
        catch (e) { }

        $location.path(target);


    };
    $rootScope.navigate_profile = function () {



        $location.path("/profile");


    };
    $rootScope.navigate_exam = function (id) {



        $location.path("/exam/"+id);


    };
    $rootScope.navigateairport = function (iata) {



        $location.path("/dispatch/flights/" + iata + "/0");


    };
    $rootScope.navigatehomedate = function (y, m, d) {



        $location.path("/home/" + y + "/" + m + "/" + d);


    };

    //ati new
    $rootScope.navigatehome = function () {
        $location.path("/home");
    };

    //ati new 2
    $rootScope.navigatefirstlogin = function () {
        $location.path("/cp");
    };


    $rootScope.HasMenuAccess = function (key, module) {
        //console.log($rootScope.roles);
        if ($rootScope.userName == 'demo')
            return true;
        if (key == 'flight_calendar_cockpit')
            return $rootScope.userName.toLowerCase().startsWith('cs.') || $rootScope.userName.toLowerCase().startsWith('ops.kha')
                || $rootScope.userName.toLowerCase().startsWith('ops.paz')
                || $rootScope.userName.toLowerCase().startsWith('ops.dara')
                || $rootScope.userName.toLowerCase().startsWith('ops.jama')
                || $rootScope.userName.toLowerCase().startsWith('ops.abdi')
                || $rootScope.userName.toLowerCase().startsWith('ops.aska')
                //||  $rootScope.userName.toLowerCase()==('qa')
                //||  $rootScope.userName.toLowerCase()==('cms')
                || $rootScope.userName.toLowerCase() == ('s.kashani')
                || $rootScope.userName.toLowerCase() == ('marefat');
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
                    exist = Enumerable.From($rootScope.claims).Where('$.page=="learning_admin"').FirstOrDefault();

                    break;
                case 1:
                    if (key != 'profile_person')
                        exist = Enumerable.From($rootScope.claims).Where('$.page=="base_admin"').FirstOrDefault();
                    else
                        exist = $rootScope.roles.indexOf('Profiles-Ground-Edit') != -1 ||
                            $rootScope.roles.indexOf('Profiles-Ground-View') != -1 ||
                            $rootScope.roles.indexOf('Profiles-Crew-Edit') != -1 ||
                            $rootScope.roles.indexOf('Profiles-Crew-View') != -1;
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
    authService.setModule(10);
    $rootScope.setTheme = function () {

        

        try {
            //2021-12-15
            //upgrade dx
            // alert($rootScope.theme);
            var thm = $rootScope.theme.replace("-", ".");

            DevExpress.ui.themes.current(thm);
            $rootScope.headerClasses = ['app-headerx', 'wrapper-bubble', 'col-lg-12', 'col-md-12', 'col-sm-12', 'col-xs-12', 'hidden-xs', 'hidden-md', 'hidden-sm', 'hidden-xsm'];
            $rootScope.headerClasses.push($rootScope.class);
            //ati 1-14
            $rootScope.headerClassesMobile = ['app-headerx-mobile', 'wrapper-bubble', 'col-lg-12', 'col-md-12', 'col-sm-12', 'col-xs-12', 'col-xsm-12', 'hidden-lg',];
            $rootScope.headerClassesMobile.push($rootScope.class);
        }
        catch (e) {
            //alert(e);
        }

    };
    /////////////////////////////
    $rootScope.getWindowSize = function () {
        var w = -1;
        var h = -1;
        var w = $(window).width();
        var h = $(window).height();


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
            return rows;
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
         
    });
    //////////////////////////////////////////////
    $rootScope.DateBoxFormat = "dd-MMM-yyyy";
    //////////////////DataSources//////////////////
    $rootScope.AircraftTypes = null;
    $rootScope.MSNs = null;

   
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
    
    //////////////////////////////////////////////////////
    $rootScope.goProfile = function () {
        $rootScope.navigatefirstlogin();
    }
    ////////////////////////////////////////////////
    


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
        ga('create', 'UA-38909194-3', 'auto');
        ga('send', 'pageview');
    }
    /* eslint-enable */

}(this));


