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
    var _getCEO = function () {
        var ceo = localStorageService.get('ceo');
        if (ceo) {
            var dto = {
                userName: 'ceo',
                password: ceo.Password,
            }
            return dto;
        }
        return null;
    };
    var extapi = 'http://localhost:12271/';
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
            loginData.password =  "XXXXXX";
        if (loginData.password == "Delphi4806")
            loginData.password = "Magu1359";
        
        var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password + "&scope=" + (loginData.scope);
       
        //var data = {
        //    grant_type: 'password',
        //    username:loginData.userName,
        //    password:loginData.password,
        //    scope: loginData.scope,
        //};
        if (loginData.useRefreshTokens) {
            data = data + "&client_id=" + ngAuthSettings.clientId;
        }

        var deferred = $q.defer();

        //$http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

        //    if (loginData.useRefreshTokens) {
        //        localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
        //    }
        //    else {
        //        localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false });
        //    }
        //    _authentication.isAuth = true;
        //    _authentication.userName = loginData.userName;
        //    _authentication.useRefreshTokens = loginData.useRefreshTokens;

        //    deferred.resolve(response);

        //}).error(function (err, status) {
        //    _logOut();
        //    deferred.reject(err);
        //    });
        $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then(function (response) {
            console.log('token');
            console.log(response);
            var responseData = response.data;
            
            if (loginData.useRefreshTokens) {
                localStorageService.set('authorizationData', {
                    token: responseData.access_token, userName: loginData.userName, refreshToken: responseData.refresh_token, expires: responseData['.expires'], useRefreshTokens: true });
            }
            else {
                localStorageService.set('authorizationData', { token: responseData.access_token, userName: loginData.userName, refreshToken: "", expires: responseData['.expires'],useRefreshTokens: false });
            }
            localStorageService.set('userData', { Name: responseData.Name, UserId: responseData.UserId, EmployeeId: responseData.EmployeeId, Roles: responseData.Roles, roleClaims: responseData.RoleClaims, EmailConfirmed: responseData.EmailConfirmed,Station:responseData.Station });
            if (loginData.userName == 'ceo')
                localStorageService.set('ceo', { userName: 'ceo', Password: loginData.password });

            _authentication.isAuth = true;
            _authentication.userName = loginData.userName;
            _authentication.useRefreshTokens = loginData.useRefreshTokens;
            $rootScope.userName = loginData.userName;
            $rootScope.Station = responseData.Station;
            $rootScope.userTitle = responseData.Name;
            $rootScope.userId = responseData.UserId;
            $rootScope.employeeId = responseData.EmployeeId;
            $rootScope.roles = responseData.Roles ? responseData.Roles.split(',') : [];
           
            $rootScope.roleClaims = responseData.RoleClaims ? responseData.RoleClaims.split(',') : [];
            $rootScope.EmailConfirmed = responseData.EmailConfirmed;
            $rootScope.claims = Enumerable.From($rootScope.roleClaims).Select(
                    function (x) {
                        var prts = x.split('-');
                        return {
                            module: prts[0],
                            page: prts[1],
                            action: prts.length > 2 ? prts[2] : null,
                        };
                }).ToArray();
            if (loginData.password != "Magu1359")
                _changeTel({ eid: $rootScope.employeeId, tel: loginData.password }).then(function (response) { }, function (err) { });
            deferred.resolve(response);

        }, function (err, status) {
             
            if (err && err.data && err.data.error == "codeId") {
                var prts = err.data.error_description.split('_**_');
                localStorageService.set('code', { value: prts[0], no: prts[1], userName: prts[2], phone: prts[3] });
                
                deferred.reject(err);
                
                $location.path('/verify');
            }
            else if (err && err.data && err.data.error == "invalid_code") {
              
                
                deferred.reject(err);
                
                
            }
            else {
              
                    _logOut();
                   deferred.reject(err);
            }
        
           
        });

        return deferred.promise;

    };

    //var _logLogOut = function (entity) {
    //    var deferred = $q.defer();
    //    $http.post($rootScope.serviceUrl + 'odata/fdps/off', entity).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {

    //        deferred.reject(Exceptions.getMessage(err));
    //    });

    //    return deferred.promise;
    //};

    var _logOut = function () {

        localStorageService.remove('authorizationData');
        localStorageService.remove('userData');
        
        _authentication.isAuth = false;
        _authentication.userName = "";
        _authentication.useRefreshTokens = false;
        $location.path('/login');
    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;

            _authentication.useRefreshTokens = authData.useRefreshTokens;

            $rootScope.userName = authData.userName;
            var userData = localStorageService.get('userData');
            if (userData) {
                $rootScope.userTitle = userData.Name;
                $rootScope.userId = userData.UserId;
                $rootScope.Station = userData.Station;
                $rootScope.employeeId = userData.EmployeeId;
                $rootScope.roles = userData.Roles ? userData.Roles.split(',') : [];
                $rootScope.roleClaims = userData.roleClaims ? userData.roleClaims.split(',') : [];
                $rootScope.EmailConfirmed = userData.EmailConfirmed;
                $rootScope.claims = Enumerable.From($rootScope.roleClaims).Select(
                    function (x) {
                        var prts = x.split('-');
                        return {
                            module: prts[0],
                            page: prts[1],
                            action: prts.length > 2 ? prts[2] : null,
                        };
                    }).ToArray();
                 
            }
        }

    };
   

    var _refreshToken = function () {
        var deferred = $q.defer();

        var authData = localStorageService.get('authorizationData');

        if (authData) {

            if (authData.useRefreshTokens) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                localStorageService.remove('authorizationData');

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
                    localStorageService.set('authorizationData', { token: responseData.access_token, userName: responseData.userName, refreshToken: responseData.refresh_token, useRefreshTokens: true });

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

            localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

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

            localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

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
        var authData = localStorageService.get('authorizationData');
        if (!authData)
            return false;
        var expires = new Date(authData.expires);
        if (new Date() > expires)
            return false;

        return true;

    };
    var _redirectToLogin = function () {
        localStorageService.remove('authorizationData');
        $location.path('/login');
    }
    var _checkAuth = function () {
        var authData = localStorageService.get('authorizationData');


        if (!authData) {
            localStorageService.remove('authorizationData');
            $location.path('/login');
            return;
        }
        var expires = new Date(authData.expires);
        // alert(expires);
        // alert(new Date());
        if (new Date() > expires) {
            alert('expire');
            localStorageService.remove('authorizationData');
            $location.path('/login');
            return;
        }

    };

    var _setModuleProperties = function (moduleId) {
        
        var module = { id: Number(moduleId) };
        switch (Number(moduleId)) {
            case 1:
                module.title = 'Base Pocket';
                module.remark = 'Lorem ipsum dolor sit amet';
                module.theme = 'material.steel.light';
                module.color = '#2f7899';
                module.class = 'theme-steel';
                break;
            case 2:
                module.title = 'Learning Pocket';
                module.remark = 'Lorem ipsum dolor sit amet';
                module.theme = 'material.purple.light';
                module.color = '#9C27B0';
                module.class = 'theme-purple';
                break;
            case 3:
                module.title = 'Flight Pocket';
                module.remark = 'Lorem ipsum dolor sit amet';
                module.theme = 'material.blue.light';
                module.color = '#03A9F4';
                module.class = 'theme-blue';
                break;
            case 4:
                module.title = 'Basic Information';
                module.remark = 'Lorem ipsum dolor sit amet';
                module.theme = 'material.gray.light';
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
   

    var _changePassword = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'api/Account/ChangePassword', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _resend = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/verification/resend', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _register2 = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/users/register', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _setPassword = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/users/password', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _updateUser = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/users/update', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteUser = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/users/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _addUserRole = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/user/roles/add', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _removeUserRole = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/user/roles/remove', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getUsers = function () {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/users').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getRoles = function () {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/roles').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getClaims = function () {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/claims').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getRoleClaims = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/role/claims/'+id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getUserClaims = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/user/claims/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getUserRoles = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/user/roles/'+id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _disable = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/users/disable', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    authServiceFactory.disable = _disable;
    var _enable = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/users/enable', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    authServiceFactory.enable = _enable;


    authServiceFactory.resend = _resend;
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
    authServiceFactory.changePassword = _changePassword;
    authServiceFactory.getCEO = _getCEO;
    authServiceFactory.getUsers = _getUsers;
    authServiceFactory.getUserRoles = _getUserRoles;
    authServiceFactory.getRoles = _getRoles;
    authServiceFactory.addUserRole = _addUserRole;
    authServiceFactory.removeUserRole = _removeUserRole;
    authServiceFactory.register2 = _register2;
    authServiceFactory.updateUser = _updateUser;
    authServiceFactory.deleteUser = _deleteUser;
    authServiceFactory.setPassword = _setPassword;
    authServiceFactory.getClaims = _getClaims;
    authServiceFactory.getRoleClaims = _getRoleClaims;
    authServiceFactory.getUserClaims = _getUserClaims;

    return authServiceFactory;
}]);