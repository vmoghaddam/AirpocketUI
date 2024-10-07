
var app = angular.module('GriffinClientApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar', 'dx', 'ngSanitize', 'ngAnimate']).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]);
 

app.config(function ($routeProvider) {
    console.log($routeProvider);

    $routeProvider.when("/apps", {
        controller: "appsController",
        templateUrl: "/app/views/apps.html?v=20"
    });
    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/app/views/home.html?v=20"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/app/views/login.html?v=20"
    });
    $routeProvider.when("/cp", {
        controller: "cpController",
        templateUrl: "/app/views/cp.html?v=20"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "/app/views/signup.html?v=20"
    });

    

    $routeProvider.when("/refresh", {
        controller: "refreshController",
        templateUrl: "/app/views/refresh.html?v=20"
    });

    $routeProvider.when("/tokens", {
        controller: "tokensManagerController",
        templateUrl: "/app/views/tokens.html?v=20"
    });

    $routeProvider.when("/associate", {
        controller: "associateController",
        templateUrl: "/app/views/associate.html?v=20"
    });
    $routeProvider.when("/appflight", {
        controller: "appFlightController",
        templateUrl: "/app/views/appflight.html?v=20",
        //type:'all',
       // type: 'book',
    });
    $routeProvider.when("/applibrary/:fid/:pid", {
        controller: "appLibraryController",
        templateUrl: "/app/views/applibrary.html?v=20",
        reloadOnSearch: false,
        //type:'all',
        type:'book',
    });
    $routeProvider.when("/applibrary/:fid/:pid/:chid", {
        controller: "appLibraryController",
        templateUrl: "/app/views/applibrary.html?v=20",
        //type:'all',
        type: 'book',
    });

    $routeProvider.when("/applibrary/books", {
        controller: "appLibraryController",
        templateUrl: "/app/views/applibrary.html?v=20",
        type: 'book',
    });
    $routeProvider.when("/applibrary/papers", {
        controller: "appLibraryController",
        templateUrl: "/app/views/applibrary.html?v=20",
        type: 'paper',
    });
    $routeProvider.when("/applibrary/videos", {
        controller: "appLibraryController",
        templateUrl: "/app/views/applibrary.html?v=20",
        type: 'video',
    });
    $routeProvider.when("/applibrary/item/:id", {
        controller: "appLibraryItemController",
        templateUrl: "/app/views/applibraryitem.html?v=20",
        
    });

    $routeProvider.when("/appcertificate/all", {
        controller: "appCertificateController",
        templateUrl: "/app/views/appcertificate.html?v=20",
        type: 'all',
    });
    $routeProvider.when("/appcertificate/last", {
        controller: "appCertificateController",
        templateUrl: "/app/views/appcertificate.html?v=20",
        type: 'last',
    });
   
    $routeProvider.when("/appcourse/active", {
        controller: "appCourseController",
        templateUrl: "/app/views/appcourse.html?v=20",
        type: 'active',
    });
    $routeProvider.when("/appcourse/archive", {
        controller: "appCourseController",
        templateUrl: "/app/views/appcourse.html?v=20",
        type: 'archive',
    });
    $routeProvider.when("/appmessage", {
        controller: "appMessageController",
        templateUrl: "/app/views/appmessage.html?v=20",
        
    });
    $routeProvider.when("/appdocument", {
        controller: "appDocumentController",
        templateUrl: "/app/views/appdocument.html?v=20",

    });
    $routeProvider.when("/appdocument/item/:id", {
        controller: "appDocumentItemController",
        templateUrl: "/app/views/appdocumentitem.html?v=20",

    });
    $routeProvider.when("/appmessage/item/:id", {
        controller: "appMessageItemController",
        templateUrl: "/app/views/messageitem.html?v=20",

    });

    $routeProvider.when("/pdfviewer/:url/:title/:id", {
        controller: "pdfViewerController",
        templateUrl: "/app/views/pdfviewer.html?v=20",

    });
    
 
    $routeProvider.otherwise({ redirectTo: "/home" });

});   

//var serviceBase = 'http://grfn.api.epatrin.ir/';
// var webBase = 'http://grfn.epatrin.ir/';
//var clientBase = 'http://grfn.app.epatrin.ir/';

var serviceBase = 'http://localhost:8888/';
var serviceBaseTRN = 'http://localhost:4000/';
//var serviceBase = 'http://fleet.flypersia.aero:90/api.airpocket/';
var webBase = 'http://localhost:30000/';
//var webBase = 'http://fleet.flypersia.aero:90/airpocket/';
var clientBase = 'http://localhost:22323/';
//var clientBase = 'http://fleet.flypersia.aero:90/uairpocket/';


    //'http://localhost:58908/';
    //'http://localhost:40654/';
   
    //'http://localhost:10707/';
//'http://ngauthenticationapi.azurewebsites.net/';
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'ngAuthApp'
});
 
//app.config(function ($httpProvider) {
app.config(['$httpProvider', function ($httpProvider) {
   
    $httpProvider.interceptors.push('authInterceptorService');
}]);
 
app.run(['authService', 'activityService', '$rootScope', '$location', '$templateCache', function (authService, activityService, $rootScope, $location, $templateCache) {
    
    $rootScope.$on('$viewContentLoaded', function () {
        
        $templateCache.removeAll();
    });
    $rootScope.serviceUrl = serviceBase;
    $rootScope.fileHandlerUrl = webBase + 'filehandler.ashx';
    $rootScope.clientsFilesUrl = webBase + 'upload/clientsfiles/';
    $rootScope.webBase=webBase;
    $rootScope.app_title = 'WebPocket';
    $rootScope.page_title = '';
    $rootScope.app_remark = 'Lorem ipsum dolor sit amet';
    $rootScope.module = 'Web Application';
    $rootScope.moduleId = 100;
    $rootScope.moduleRemark = '';
    $rootScope.theme = 'material.orange-light';
    $rootScope.color = '';
    $rootScope.class = '';
    $rootScope.userName = '';
    $rootScope.userTitle = '';
    $rootScope.userId = null;
    $rootScope.employeeId = null;
    $rootScope.logOut = function () { authService.logOut(); };
    $rootScope.apps = function () { $location.path('/apps'); };
    $rootScope.menu = function () {


       
       // $('#module' + $rootScope.moduleId).show();
        var windowWidth = $(window).width();
         
        var container = $('.maincontainer').width();
        $('#mySidenav').css('left', (windowWidth - container) / 2 + 'px').width(container);
       
       // $('#mySidenav').width(container);
        //document.getElementById("mySidenav").style.width = "100%";
    };
    $rootScope.closeMenu = function () {
        document.getElementById("mySidenav").style.width = "0";
    };
    $rootScope.navigate = function (target, key,module) {
        
        var rec = Enumerable.From(Config.MenuItems).Where('$.key=="' +  key + '"').FirstOrDefault();
        activityService.hitMenu(key, target, 'Visiting ' + $rootScope.module+' > '+rec.title,module);
         
        $location.path(target); 
       
       
    };
    $rootScope.headerClasses = ['app-headerx', 'wrapper-bubble', 'col-lg-12', 'col-md-12', 'col-sm-12', 'col-xs-12'];
    Config.CustomerId = 4;
    authService.fillAuthData();
    //authService.fillModuleData();

    $rootScope.setTheme = function () {
        
        DevExpress.ui.themes.current($rootScope.theme);
         
       
    };
    $rootScope.setTheme();
    //$rootScope.setTheme = function () {
    //    DevExpress.ui.themes.current($rootScope.theme);
    //    $rootScope.headerClasses = ['app-headerx', 'wrapper-bubble', 'col-lg-12', 'col-md-12', 'col-sm-12', 'col-xs-12'];
    //    $rootScope.headerClasses.push($rootScope.class);

    //};
    /////////////////////////////
    $rootScope.getWindowSize  = function ( ) {
        var w = -1;
        var h = -1;
        var w = $(window).width()  ;
        var h = $(window).height()  ;
        

        return { width: w, height: h };
    };

    //////////////////////////
    
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
    $rootScope.getDatasourceOption = function (pid) {
        return new DevExpress.data.DataSource({
            store:

            new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/options/'+pid,
              //  key: "Id",
               // keyType: "Int32",
               // version: 4
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
    ///////////////////////////////////////////////
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
    $rootScope.goPrivacy = function () {
        $location.path("/cp");
    };
    ////////////////////////////////////////////////////
}]);
 
 
 