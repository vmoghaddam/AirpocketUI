app.controller("footerController", function ($scope, $rootScope, $routeParams, $location) {
 
    // $('.' + $scope.type).show();
    $('.' + $scope.type).addClass('active');
    if ($scope.type == 'apphome') {
        $('.footeritem').hide();
         $('.footerflight').width('20%').show();
		  $('.footernotification').width('20%').show();
		  $('.footercertification').width('20%').show();
         $('.footerlibrary').width('20%').show();
		  $('.footerforms').width('20%').show();
      
        //$('.footercourse').width('16.66%').show();
      
       // $('.footerdocument').width('16.66%').show();
    }
    
    if ($scope.type == 'applibrary') {
        $('.footeritem').hide();
         $('.footerflight').width('20%').show();
		  $('.footernotification').width('20%').show();
		  $('.footercertification').width('20%').show();
         $('.footerlibrary').width('20%').show();
		  $('.footerforms').width('20%').show();

    }
    //if ($scope.type == 'appdocument') {
    //    $('.footeritem').hide();
    //    //$('.applibrary').width('50%').show();
    //    //$('.apphome').width('50%').show();;
    //    $('.footerhome').width('100%').show();
         

    //}
    if ($scope.type == 'appcertificate') {
        $('.footeritem').hide();
        $('.footerflight').width('20%').show();
		  $('.footernotification').width('20%').show();
		  $('.footercertification').width('20%').show();
         $('.footerlibrary').width('20%').show();
		  $('.footerforms').width('20%').show();
         

    }
    if ($scope.type == 'appcourse') {
        $('.footeritem').hide();
        $('.footerflight').width('33.333%').show();
		  $('.footernotification').width('33.333%').show();
		  $('.footercertification').width('33.333%').show();


    }
    if ($scope.type == 'appmessage') {
        $('.footeritem').hide();
        $('.footerflight').width('33.333%').show();
		  $('.footernotification').width('33.333%').show();
		  $('.footercertification').width('33.333%').show();
    }
    if ($scope.type == 'appmessageitem') {
        $('.footeritem').hide();
        $('.footerflight').width('33.333%').show();
		  $('.footernotification').width('33.333%').show();
		  $('.footercertification').width('33.333%').show();
        
    }
    
    if ($scope.type == 'applibraryitem') {
        $('.footeritem').hide();
		 $('.footerflight').width('33.333%').show();
		  $('.footernotification').width('33.333%').show();
		  $('.footercertification').width('33.333%').show();
       
    }
    if ($scope.type == 'appdocumentitem') {
        $('.footeritem').hide();
        $('.footerflight').width('33.333%').show();
		  $('.footernotification').width('33.333%').show();
		  $('.footercertification').width('33.333%').show();
    }
    if ($scope.type == 'appflightcalendar') {
        $('.footeritem').hide();
        $('.footerflight').width('33.333%').show();
		  $('.footernotification').width('33.333%').show();
		  $('.footercertification').width('33.333%').show();


    }
	   if ($scope.type == 'appflight') {
        $('.footeritem').hide();
        $('.footerflight').width('20%').show();
		  $('.footernotification').width('20%').show();
		  $('.footercertification').width('20%').show();
         $('.footerlibrary').width('20%').show();
		  $('.footerforms').width('20%').show();

           
    }
	  if ($scope.type == 'forms') {
        $('.footeritem').hide();
       // $('.footerflight').width('16.66667%').show();
       // $('.footernotification').width('16.66667%').show();
       // $('.footercertification').width('16.66667%').show();
        $('.footerforms').width('33.33%').show();
        $('.footerformnew').width('33.33%').show();

        $('.footerformdelete').width('33.33%').show();


    }
    if ($scope.type == 'appflightstatistics') {
        $('.footeritem').hide();
         $('.footerflight').width('33.333%').show();
		  $('.footernotification').width('33.333%').show();
		  $('.footercertification').width('33.333%').show();


    }
    if ($scope.type == 'appflightlogbook') {
        $('.footeritem').hide();
         $('.footerflight').width('33.333%').show();
		  $('.footernotification').width('33.333%').show();
		  $('.footercertification').width('33.333%').show();


    }
    if ($scope.type == 'appdocument') {
        
        $('.footeritem').hide();
        $('.footerflight').width('33.333%').show();
		  $('.footernotification').width('33.333%').show();
		  $('.footercertification').width('33.333%').show();

    }
    if ($scope.type == 'appdocumentother') {
        $('.footeritem').hide();
       $('.footerflight').width('33.333%').show();
		  $('.footernotification').width('33.333%').show();
		  $('.footercertification').width('33.333%').show();


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
    $scope.$on('ActiveFooterItem', function (event, prms) {
        //footerbook
        alert('x');
        $('.footeritem').removeClass('active');
        $('.' + prms).addClass('active');


    });
    $rootScope.$broadcast('PageLoaded', 'footer');
    //end scope
});