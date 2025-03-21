﻿'use strict';
app.factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService', function ($q, $injector, $location, localStorageService) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {
       

        config.headers = config.headers || {};

        var authData = localStorageService.get('authorizationData');
        var userData = localStorageService.get('userData');

        var authDataVIRA = localStorageService.get('authorizationMnt');
        
  
        if (config.url.startsWith(vira_api)) {
            if (authDataVIRA) {

                //config.headers.Authorization = 'Bearer ' + authDataVIRA.token;
                config.headers.Authorization = 'Bearer ' + authData.token;
            }
        }
        else
        if (authData) {

            config.headers.Authorization = 'Bearer ' + authData.token;
            config.headers.Reqkey = userData.UserId;
            config.headers.Reqname = authData.userName;
            config.headers.Reqroles = userData.Roles;
        }
      
        return config;
    }

    var _responseError = function (rejection) {
        
        if (rejection.status === 401) {
             
            var authService = $injector.get('authService');
            var authData = localStorageService.get('authorizationData');

            //if (authData) {
            //    if (authData.useRefreshTokens) {
            //        $location.path('/refresh');
            //        return $q.reject(rejection);
            //    }
            //}
            ////authService.logOut();
            ////$location.path('/login');
        }
        return $q.reject(rejection);
    }



    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;
  

    return authInterceptorServiceFactory;
}]);