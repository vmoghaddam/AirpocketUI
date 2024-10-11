app.controller('cpController', ['$scope', '$location', 'authService', 'ngAuthSettings', '$rootScope', function ($scope, $location, authService, ngAuthSettings, $rootScope) {

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
               authService.changeTel({ eid: $rootScope.employeeId, tel: $scope.cp.NewPassword}).then(function (response) { }, function (err) { });

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
