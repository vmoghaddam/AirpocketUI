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
    var _delayNotification = function (id,from,to,no,h,m) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/notify/delay2/' + id+'/'+from+'/'+to+'/'+no+'/'+h+'/'+m).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
     
    var _notify = function (entity) {
        entity.SenderId = $rootScope.userId;
         
        var deferred = $q.defer();
       // $http.post($rootScope.serviceUrl + 'odata/notifications/save', entity).then(function (response) {
        $http.post(msgUrl + 'notifications/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
        
        
    };

    var _notify2 = function (entity) {
        entity.SenderId = $rootScope.userId;

        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/notifications/save2', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;


    };
    //odata/notifications/flight/save
    var _notifyFlight = function (entity) {
        entity.SenderId = $rootScope.userId;

        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/notifications/flight/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;


    };
    var _getPickupHistory = function (fid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/notifications/pickup/'+fid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    
    var _getSMSHistory = function (fid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/notifications/sms/' + fid+'/'+  $rootScope.userName.replace(".", "")  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getSMSHistoryAll = function () {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/notifications/sms/all/' + $rootScope.userName.replace(".", "")).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _sms = function (atext,nos) {
        var sms = {
            username: '9125591790',
            password: '@khavaN559',
            to: nos,
            //from: '2000800',
            from:'30001223136323',
            text:atext,

        };

        var deferred = $q.defer();
        $http.post(  'https://rest.payamak-panel.com/api/SendSMS/SendSMS', sms).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;


    };


    var _getSMSHistoryTraining = function () {

        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/notifications/taining/' ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getSMSHistoryTraining = _getSMSHistoryTraining;

    serviceFactory.notify = _notify;
    serviceFactory.notify2 = _notify2;
    serviceFactory.notifyFlight = _notifyFlight;
    serviceFactory.getNotification = _getNotification;
    serviceFactory.sms = _sms;
    serviceFactory.delayNotification = _delayNotification;
    serviceFactory.getPickupHistory = _getPickupHistory;
    serviceFactory.getSMSHistory = _getSMSHistory;
    serviceFactory.getSMSHistoryAll = _getSMSHistoryAll;
    //serviceFactory.delete = _delete;
    return serviceFactory;

}]);