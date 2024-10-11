'use strict';
app.controller('verifyController', ['$scope', '$location', 'authService', 'ngAuthSettings', '$rootScope', 'localStorageService', '$timeout', function ($scope, $location, authService, ngAuthSettings, $rootScope, localStorageService, $timeout) {
    var detector = new MobileDetect(window.navigator.userAgent);
     
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
    $scope.isWrong = false;

    $scope.login = function () {

        $('form').fadeOut(700);
        $('.wait').addClass('yaxis').fadeIn(1500);

        $('.wrapper').addClass('form-success');

        authService.login($scope.loginData).then(function (response) {

             

            $rootScope.userName = authService.authentication.userName;
            
            if ($rootScope.EmailConfirmed != "True")
                $rootScope.navigatefirstlogin();
            else {
                if (!ceo && $rootScope.userName != 'ceo')
                    $location.path('/apps');
                else {
                    authService.setModule(3);
                    $location.path('/flight/board/ceo');
                }
            }



        },
       function (err) {
           $scope.message = err.error_description;
           $('.wait').hide();
           $('.wrapper').removeClass('form-success');
           $('form').fadeIn(700);
       });
    };

    $scope.code = localStorageService.get('code') ;
    $scope.userName = $scope.code.userName;
    $scope.phone = $scope.code.phone;
    $scope.no = '***' + $scope.code.no;
    $scope.vcode = null;
    $scope.verify = function () {
        if (!$scope.vcode)
            return;
        $('form').fadeOut(700);
        $('.wait').addClass('yaxis').fadeIn(1500);

        $('.wrapper').addClass('form-success');
        var loginData = {};
        loginData.userName = $scope.userName;
        loginData.password = 'airpocket';
        loginData.useRefreshTokens = false;
        var cip = $scope.code.value;
        cip = cip.split("+").join("#");
        loginData.scope = [Config.CustomerId + '*ap' + '*' + cip + '*' + $scope.vcode];
       
        //loginData.scope = [Config.CustomerId + '*ap'];
       // loginData.scope.push($scope.code.value);
      //  loginData.scope.push($scope.vcode);
       
        authService.login(loginData).then(function (response) {



            $rootScope.userName = authService.authentication.userName;

            if ($rootScope.EmailConfirmed != "True")
                $rootScope.navigatefirstlogin();
            else {
                if (!ceo && $rootScope.userName != 'ceo')
                    $location.path('/apps');
                else {
                    authService.setModule(3);
                    $location.path('/flight/board/ceo');
                }
            }



        },
       function (err) {
           $scope.message = err.error_description;
           $('.wait').hide();
           $('.wrapper').removeClass('form-success');
           $('form').fadeIn(700);
           $scope.isWrong = true;
       });


        ////////////////////
    };
    $scope.goLogin = function () {
        $scope.isWrong = false;
        $scope.vcode = null;
        $location.path('/login');
    };

    $scope.resend = function () {
        $scope.isWrong = false;
        $scope.vcode = null;
        $('form').fadeOut(700);
        $('.wait').addClass('yaxis').fadeIn(1500);

        $('.wrapper').addClass('form-success');

        var dto = { code: $scope.code.value,phone:$scope.phone };
        authService.resend(dto).then(function (response) {
            $('.wait').hide();
            $('.wrapper').removeClass('form-success');
            $('form').fadeIn(700);
            $scope.start();

        }, function (err) {   General.ShowNotify(err.message, 'error'); });
    }

    $scope.countDownVisible = false;
    $scope.counter = 30;
    var stopped;
    $scope.countdown = function () {
        $scope.countDownVisible = true;
        stopped = $timeout(function () {
            console.log($scope.counter);
            $scope.counter--;
            if ($scope.counter > 0)
                $scope.countdown();
            else {
                $scope.stop();
                //$scope.refreshSMSStatus();
            }
        }, 1000);
    };


    $scope.stop = function () {
        $timeout.cancel(stopped);
        $scope.countDownVisible = false;
        $scope.counter = 30;

    };
    $scope.start = function () {
        $scope.counter = 30;
        $scope.countDownVisible = true;
        $scope.countdown();
    }
    ///////////////////////
    
    ////////////////////////
    $scope.start();
 
}]);


function validate(evt) {
    var theEvent = evt || window.event;

    // Handle paste
    if (theEvent.type === 'paste') {
        key = event.clipboardData.getData('text/plain');
    } else {
        // Handle key press
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
        theEvent.returnValue = false;
        if (theEvent.preventDefault) theEvent.preventDefault();
    }
}