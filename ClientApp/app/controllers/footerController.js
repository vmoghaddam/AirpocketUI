app.controller("footerController", function ($scope, $rootScope, $routeParams, $location) {

    // $('.' + $scope.type).show();
    $('.' + $scope.type).addClass('active');
    if ($scope.type == 'apphome') {
        $('.footeritem').hide();
         $('.footerflight').width('16.66%').show();
        $('.footerlibrary').width('16.66%').show();
        $('.footercertification').width('16.66%').show();
        $('.footercourse').width('16.66%').show();
        $('.footernotification').width('16.66%').show();
        $('.footerdocument').width('16.66%').show();
    }
    
    if ($scope.type == 'applibrary') {
        $('.footeritem').hide();
        //$('.applibrary').width('50%').show();
        //$('.apphome').width('50%').show();;
        $('.footerhome').width('100%').show();
       // $('.footerbook').width('25%').show();
       // $('.footervideo').width('25%').show();
      //  $('.footerpaper').width('25%').show();

    }
    if ($scope.type == 'appdocument') {
        $('.footeritem').hide();
        //$('.applibrary').width('50%').show();
        //$('.apphome').width('50%').show();;
        $('.footerhome').width('100%').show();
         

    }
    if ($scope.type == 'appcertificate') {
        $('.footeritem').hide();
        //$('.applibrary').width('50%').show();
        //$('.apphome').width('50%').show();;
        $('.footerhome').width('50%').show();
       // $('.footerall').width('25%').show();
       // $('.footerlast').width('25%').show();
        $('.footercourse').width('50%').show();
         

    }
    if ($scope.type == 'appcourse') {
        $('.footeritem').hide();
        //$('.applibrary').width('50%').show();
        //$('.apphome').width('50%').show();;
        $('.footerhome').width('50%').show();
      //  $('.footercoursepending').width('25%').show();
       // $('.footercourseactive').width('33.3333%').show();
        $('.footercertification').width('50%').show();


    }
    if ($scope.type == 'appmessage') {
        $('.footeritem').hide();
        $('.footerhome').width('100%').show();
    }
    if ($scope.type == 'appmessageitem') {
        $('.footeritem').hide();
        $('.footerhome').width('50%').show();
        $('.footernotification').width('50%').show();
        
    }
    
    if ($scope.type == 'applibraryitem') {
        $('.footeritem').hide();
       
    }
    if ($scope.type == 'appdocumentitem') {
        $('.footeritem').hide();
        $('.footerhome').width('50%').show();
        $('.footerdocument').width('50%').show();
    }
    if ($scope.type == 'appflight') {
        $('.footeritem').hide();
        //$('.applibrary').width('50%').show();
        //$('.apphome').width('50%').show();;
        $('.footerhome').width('100%').show();


    }


    $scope.$on('ShowFooterItems', function (event, prms) {
        //footerbook
        if (prms == '84') {
            $('.footerhome').width('33.3333%').show();
            $('.footerlibrary').width('33.3333%').show();
            $('.footerpaper').width('33.3333%').show();
        }
        if (prms == '83') {
            $('.footerhome').width('33.3333%').show();
            $('.footerlibrary').width('33.3333%').show();
            $('.footerbook').width('33.3333%').show();
        }
        if (prms == '85') {
            $('.footerhome').width('33.3333%').show();
            $('.footerlibrary').width('33.3333%').show();
            $('.footervideo').width('33.3333%').show();
        }


    });
    $rootScope.$broadcast('PageLoaded', 'footer');
    //end scope
});