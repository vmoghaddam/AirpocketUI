'use strict';
app.controller('appFlightStatisticsController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.firstBind = true;

    $scope.typeId = null;
    $scope.title = "Statistics";

    ///////////////////////////
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
    //////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = 'Flight > ' + $scope.title;
         
        $('.flightstatistics').fadeIn();

        // $scope.bindTomorrow();
    }
    /////////////////////////////////
    $scope.$on('PageLoaded', function (event, prms) {
        //footerbook
        if (prms == 'footer')
            $('.footer' + $scope.active).addClass('active');
 

    });
    var vhHeight = $("body").height();
    var chromeNavbarHeight = vhHeight - window.innerHeight;
    window.addEventListener("orientationchange", function (event) {
      
        //setTimeout(function () {
           
        //    var _height = window.outerHeight;
          
        //    $('.col-tablet').height(_height - 45 - 62 - 45);
        //    var tb2 = _height - 515;
        //    if (!$scope.accActive)
        //        tb2 = _height - 505 + 330;
        //    $('.col-tablet2').height(tb2);
        //    $('.div-crew').height(_height - 552);
        //    $('#tomorrow').height(_height - 45 - 62 - 30);
        //    $('#today').height(_height - 45 - 62 - 30);
        //    if (screen.height < screen.width && !detector.tablet()) {
        //        $('.no-rotate').hide();
        //        $('.yes-rotate').show();
        //    }
        //    else { $('.no-rotate').show(); $('.yes-rotate').hide(); }
        //},200);

    }, false);

    window.onresize = function (event) {
        return;
        setTimeout(function () {
           
            //var _height = window.outerHeight;
            
            //$('.col-tablet').height(_height - 45 - 62 - 45);
            //var tb2 = _height - 515;
            //if (!$scope.accActive)
            //    tb2 = _height - 505 + 330;
            //$('.col-tablet2').height(tb2);
            //$('.div-crew').height(_height - 552);
            //$('#tomorrow').height(_height - 45 - 62 - 30);
            //$('#today').height(_height - 45 - 62 - 30);
            //if (screen.height < screen.width && !detector.tablet()) {
            //    $('.no-rotate').hide();
            //    $('.yes-rotate').show();
            //}
            //else { $('.no-rotate').show(); $('.yes-rotate').hide(); }
        }, 200);
    };
    

    
    $rootScope.$broadcast('ActiveFooterItem', 'footerflightstatistics');


}]);