'use strict';
app.controller('loginController', ['$scope', '$location', 'authService', 'ngAuthSettings', '$rootScope','$http', function ($scope, $location, authService, ngAuthSettings, $rootScope,$http) {
    var detector = new MobileDetect(window.navigator.userAgent);
    console.log("Mobile: " + detector.mobile());
    console.log("Phone: " + detector.phone());
    console.log("Tablet: " + detector.tablet());
    console.log("OS: " + detector.os());
    console.log("userAgent: " + detector.userAgent());
    $scope.loginData = {
        userName: "",
        password: "",
        useRefreshTokens: false,
        scope: [Config.CustomerId + '*ap'],
    };

    var ceo = authService.getCEO();
    
    if (ceo) {
        $scope.loginData.userName = ceo.userName;
        $scope.loginData.password = ceo.password;
    }


    $scope.message = "";

    $scope.login = function () {
        $scope.message = null;
        $('form').fadeOut(700);
        $('.wait').addClass('yaxis').fadeIn(1500);

        $('.wrapper').addClass('form-success');

        authService.login($scope.loginData).then(function (response) {




            //if ($rootScope.history.length <= 1) {
            //    $location.path('/home');
            //}
            //else {
            //    console.log($rootScope.history[$rootScope.history.length - 2]);
            //    //  alert($rootScope.history[$rootScope.history.length - 2]);
            //    $location.path($rootScope.history[$rootScope.history.length - 2]);
            //    console.log($rootScope.history[$rootScope.history.length - 2]);
            //}

            //$rootScope.app_selected

            $rootScope.userName = authService.authentication.userName;

            //let apiKey = '1e169b8624484597afff2bb8f0084a40';
            //$.getJSON('https://api.bigdatacloud.net/data/ip-geolocation?key=' + apiKey, function (data) {
            //    //console.log(JSON.stringify(data, null, 2));

            //    var dtoInfo = {
            //        user: $rootScope.userName,
            //        ip: data.ip,
            //        city: data.location.city,
            //        info: JSON.stringify(data, null, 2),
            //    };
            //    $http.post(/*'https://fleet.caspianairlines.com/airpocketexternal/api/login/save'*/'http://localhost:12271/api/login/save', dtoInfo).then(function (response) {
            //        console.log(response);
            //    }, function (err, status) {

            //        console.log('error sending login info', err);
            //    });
            //});

           


           // alert($rootScope.EmailConfirmed);
             if ( $rootScope.EmailConfirmed != "True")
                $rootScope.navigatefirstlogin();
             else {
                 if (!ceo && $rootScope.userName != 'ceo')
                     $location.path('/apps');
                 else
                 {
                     authService.setModule(3);
                     $location.path('/flight/board/ceo');
                 }
             }
               


        },
       function (err) {
          
           $scope.message = err.data.error_description;
           $('.wait').hide();
           $('.wrapper').removeClass('form-success');
           $('form').fadeIn(700);
           
       });
    };

    $scope.authExternalProvider = function (provider) {

        var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';

        var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/ExternalLogin?provider=" + provider
                                                                    + "&response_type=token&client_id=" + ngAuthSettings.clientId
                                                                    + "&redirect_uri=" + redirectUri;
        window.$windowScope = $scope;

        var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
    };

    $scope.authCompletedCB = function (fragment) {

        $scope.$apply(function () {

            if (fragment.haslocalaccount == 'False') {

                authService.logOut();

                authService.externalAuthData = {
                    provider: fragment.provider,
                    userName: fragment.external_user_name,
                    externalAccessToken: fragment.external_access_token
                };

                $location.path('/associate');

            }
            else {
                //Obtain access token and redirect to orders
                var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                authService.obtainAccessToken(externalData).then(function (response) {

                    $location.path('/orders');

                },
             function (err) {
                 $scope.message = err.error_description;
             });
            }

        });
    }
}]);



app.controller('firstLoginController', ['$scope', '$location', 'authService', 'ngAuthSettings', '$rootScope', function ($scope, $location, authService, ngAuthSettings, $rootScope) {

    $scope.cp = {
        OldPassword: '',
        NewPassword: '',
        ConfirmPassword: '',
    };

    $scope.message = "";

    $scope.change = function () {
        
        
        if (!$scope.cp.OldPassword || !$scope.cp.NewPassword || !$scope.cp.ConfirmPassword)
            return;
        $('form').fadeOut(700);
        $('.wait').addClass('yaxis').fadeIn(1500);

        $('.wrapper').addClass('form-success');
         
        authService.changePassword($scope.cp).then(function (response) {
            authService.changeTel({ eid: $rootScope.employeeId, tel: $scope.cp.NewPassword }).then(function (response) { }, function (err) { });

            $rootScope.logOut();

            //if ($rootScope.history.length <= 1) {
            //    $location.path('/home');
            //}
            //else {
            //    console.log($rootScope.history[$rootScope.history.length - 2]);
            //    //  alert($rootScope.history[$rootScope.history.length - 2]);
            //    $location.path($rootScope.history[$rootScope.history.length - 2]);
            //    console.log($rootScope.history[$rootScope.history.length - 2]);
            //}

            //$rootScope.app_selected

            //$rootScope.userName = authService.authentication.userName;
            //$location.path('/apps');


        },
       function (err) {
           $scope.message = err.message;
           General.ShowNotify(err.message, 'error');
           $('.wait').hide();
           $('.wrapper').removeClass('form-success');
           $('form').fadeIn(700);
       });
    };

    $scope.authExternalProvider = function (provider) {

        var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';

        var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/ExternalLogin?provider=" + provider
                                                                    + "&response_type=token&client_id=" + ngAuthSettings.clientId
                                                                    + "&redirect_uri=" + redirectUri;
        window.$windowScope = $scope;

        var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
    };

    $scope.authCompletedCB = function (fragment) {

        $scope.$apply(function () {

            if (fragment.haslocalaccount == 'False') {

                authService.logOut();

                authService.externalAuthData = {
                    provider: fragment.provider,
                    userName: fragment.external_user_name,
                    externalAccessToken: fragment.external_access_token
                };

                $location.path('/associate');

            }
            else {
                //Obtain access token and redirect to orders
                var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                authService.obtainAccessToken(externalData).then(function (response) {

                    $location.path('/orders');

                },
             function (err) {
                 $scope.message = err.error_description;
             });
            }

        });
    }
}]);
