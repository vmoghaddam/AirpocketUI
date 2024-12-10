app.controller("footerController", function ($scope, $rootScope, $routeParams, $location) {


    $scope.is_crew = ['TRI', 'TRE', 'P1', 'P2', 'ISCCM', 'SCCM', 'CCM', 'Cockpit', 'Cabin'].indexOf($rootScope.Position) != -1;

    // $('.' + $scope.type).show();
    $('.' + $scope.type).addClass('active');
    if ($scope.type == 'apphome') {
        $('.footeritem').hide();
        if ($scope.is_crew) {

            $('.footerflight').width('20%').show();
            // $('.footernotification').width('20%').show();
            $('.footercertification').width('20%').show();
            $('.footerlibrary').width('20%').show();
            $('.footertrnpanel').width('20%').show();
            $('.footerhome').width('20%').show();
        }
        else {
            $('.footerlibrary').width('25%').show();
            $('.footertrnpanel').width('25%').show();
            $('.footerhelp').width('25%').show();
            $('.footerhome').width('25%').show();
        }



    }

    if ($scope.type == 'trn-instructor-panel') {
        $('.footeritem').hide();
        if ($scope.is_crew) {


            $('.footerhome').width('100%').show();

        }
        else {
            $('.footerhome').width('100%').show();
        }



    }

    if ($scope.type == 'trn-instructor-course') {
        $('.footeritem').hide();
        if ($scope.is_crew) {


            $('.footertrnpanel').width('33.3333%').show();
            //$('.footertrnexam').width('20%').show();
            $('.footertrnattendance').width('33.3333%').show();
            $('.footertrnsigncourse').width('33.3333%').show();
            
            //$('.footertrsurvay').width('20%').show();
            //$('.footertrnquestions').width('20%').show();

        }
        else {
            $('.footertrnpanel').width('50%').show();
            //$('.footertrnexam').width('20%').show();
            $('.footertrnattendance').width('50%').show();
            //$('.footertrsurvay').width('20%').show();
            //$('.footertrnquestions').width('20%').show();
        }



    }

    if ($scope.type == 'applibrary') {
        $('.footeritem').hide();
        if ($scope.is_crew) {

            $('.footerflight').width('20%').show();
            // $('.footernotification').width('16.667%').show();
            $('.footercertification').width('20%').show();
            $('.footerlibrary').width('20%').show();
            $('.footerforms').width('20%').show();
            //$('.footerhelp').width('16.667%').show();
            $('.footerhome').width('20%').show();

        }
        else {
            $('.footerlibrary').width('33.33%').show();
            $('.footerforms').width('33.33%').show();
            // $('.footerhelp').width('25%').show();
            $('.footerhome').width('33.33%').show();
        }


    }
    if ($scope.type == 'help') {
        $('.footeritem').hide();

        $('.footerlibrary').width('33.33%').show();
        $('.footerforms').width('33.33%').show();
        // $('.footerhelp').width('25%').show();
        $('.footerhome').width('33.33%').show();



    }



    if ($scope.type == 'appcertificate') {

        $('.footeritem').hide();
        if ($scope.is_crew) {

            // $('.footerflight').width('33.333%').show();

            $('.footerhome').width('33.333%').show();
            $('.footercertification').width('33.333%').show();
            $('.footercourse').width('33.333%').show();

            //$('.footernotification').width('33.333%').show();

        }
        else {
            $('.footerhome').width('50%').show();
            $('.footercertification').width('50%').show();
        }



    }
    if ($scope.type == 'appcourse') {
        $('.footeritem').hide();
        if ($scope.is_crew) {

            $('.footerflight').width('33.333%').show();
            $('.footernotification').width('33.333%').show();
            $('.footercertification').width('33.333%').show();
        }
        else {
            $('.footerlibrary').width('100%').show();
        }



    }
    if ($scope.type == 'appmessage') {
        $('.footeritem').hide();
        if ($scope.is_crew) {
            $('.footerflight').width('33.333%').show();
            $('.footernotification').width('33.333%').show();
            $('.footercertification').width('33.333%').show();
        }
        else {
            $('.footerlibrary').width('100%').show();
        }

    }
    if ($scope.type == 'appmessageitem') {
        $('.footeritem').hide();
        if ($scope.is_crew) {
            $('.footerflight').width('33.333%').show();
            $('.footernotification').width('33.333%').show();
            $('.footercertification').width('33.333%').show();
        }
        else {
            $('.footerlibrary').width('100%').show();
        }


    }

    if ($scope.type == 'applibraryitem') {
        $('.footeritem').hide();
        if ($scope.is_crew) {
            $('.footerflight').width('33.333%').show();
            $('.footernotification').width('33.333%').show();
            $('.footercertification').width('33.333%').show();
        }
        else {
            $('.footerlibrary').width('100%').show();
        }


    }
    if ($scope.type == 'appdocumentitem') {
        $('.footeritem').hide();
        if ($scope.is_crew) {
            $('.footerflight').width('33.333%').show();
            $('.footernotification').width('33.333%').show();
            $('.footercertification').width('33.333%').show();
        }
        else {
            $('.footerlibrary').width('100%').show();
        }

    }
    if ($scope.type == 'appflightcalendar') {
        $('.footeritem').hide();
        if ($scope.is_crew) {
            $('.footerflight').width('33.333%').show();
            $('.footernotification').width('33.333%').show();
            $('.footercertification').width('33.333%').show();
        }
        else {
            $('.footerlibrary').width('100%').show();
        }



    }
    if ($scope.type == 'appflight') {
        $('.footeritem').hide();
        if ($scope.is_crew) {
            $('.footerflight').width('14.28%').show();
            //$('.footernotification').width('20%').show();
            $('.footercertification').width('14.28%').show();
            $('.footerlibrary').width('14.28%').show();
            $('.footerforms').width('14.28%').show();
            $('.footerhome').width('14.28%').show();
            $('.footerforms').width('14.28%').show();
            $('.footertrnpanel').width('14.28%').show();
        }
        else {
            $('.footerlibrary').width('20%').show();
            $('.footerforms').width('20%').show();
            $('.footerhelp').width('20%').show();
            $('.footerforms').width('20%').show();
            $('.footertrnpanel').width('20%').show();
        }



    }
    if ($scope.type == 'appflightstatistics') {
        $('.footeritem').hide();
        if ($scope.is_crew) {
            $('.footerflight').width('33.333%').show();
            $('.footernotification').width('33.333%').show();
            $('.footercertification').width('33.333%').show();
        }
        else {
            $('.footerlibrary').width('100%').show();
        }



    }
    if ($scope.type == 'appflightlogbook') {
        $('.footeritem').hide();
        if ($scope.is_crew) {
            $('.footerflight').width('33.333%').show();
            $('.footernotification').width('33.333%').show();
            $('.footercertification').width('33.333%').show();
        }
        else {
            $('.footerlibrary').width('100%').show();
        }



    }
    if ($scope.type == 'appdocument') {

        $('.footeritem').hide();
        if ($scope.is_crew) {
            $('.footerflight').width('33.333%').show();
            $('.footernotification').width('33.333%').show();
            $('.footercertification').width('33.333%').show();
        }
        else {
            $('.footerlibrary').width('100%').show();
        }


    }
    if ($scope.type == 'appdocumentother') {
        $('.footeritem').hide();
        if ($scope.is_crew) {
            $('.footerflight').width('33.333%').show();
            $('.footernotification').width('33.333%').show();
            $('.footercertification').width('33.333%').show();
        }
        else {
            $('.footerlibrary').width('100%').show();
        }



    }

    if ($scope.type == 'forms') {
        $('.footeritem').hide();
        $('.footerflight').width('16.66667%').show();
        $('.footernotification').width('16.66667%').show();
        $('.footercertification').width('16.66667%').show();
        $('.footerforms').width('16.66667%').show();
        $('.footerformnew').width('16.66667%').show();

        $('.footerformdelete').width('16.66667%').show();


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