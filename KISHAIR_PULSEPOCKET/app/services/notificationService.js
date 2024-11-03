'use strict';
app.factory('notificationService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {



    var serviceFactory = {};
     
    var _getNotification = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/notification/' +  id  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
     
    var _notify = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/notifications/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
        
        
    };
    
    serviceFactory.notify = _notify;
    serviceFactory.getNotification = _getNotification;
    //serviceFactory.delete = _delete;
    return serviceFactory;

}]);