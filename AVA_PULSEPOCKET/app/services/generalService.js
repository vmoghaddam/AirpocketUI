'use strict';
app.factory('generalService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope){

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var ordersServiceFactory = {};

    var _getOrders = function () {

        return $http.get(serviceBase + 'odata/options/all/1').then(function (results) {
            console.log('orders');
            console.log(results);

            return results;
        }
            //    , function (error) { console.log('errors'); console.log(error); }
        );
    };
    var _saveJournal = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/journals/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _saveOption = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/option/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteJournal = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/journals/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _deleteOption = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/option/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getEmployee = function (id) {


        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employee/' +  id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getExpiringCertificates = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employees/expiringcertificates/last/' + id ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getExpiringCertificates2 = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/expires/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getLastCertificates = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employees/certificates/last/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getAllCertificates = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employees/certificates/all/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getPersonActiveCourse = function (id) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employees/activecourses/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getPersonPendingCourse = function (id) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/employees/pendingcourses/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getNotification = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/notification/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getNotifications = function (id) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/notifications/employee/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    ///7-17////////////////////////
    var _getSMSNotificationNew = function (id) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/notifications/crew/sms/new/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getSMSNotification = function (id) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/notifications/crew/sms/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _smsVisit = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/notifications/sms/visit', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.getSMSNotificationNew = _getSMSNotificationNew;
    ordersServiceFactory.getSMSNotification = _getSMSNotification;
    ordersServiceFactory.smsVisit = _smsVisit;
	
	 var _getEmployeeCertificates = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBaseTRN + 'api/crew/certificates/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.getEmployeeCertificates = _getEmployeeCertificates;
    //////////////////////////////
    ordersServiceFactory.getEmployee = _getEmployee;
    ordersServiceFactory.getExpiringCertificates = _getExpiringCertificates;
    ordersServiceFactory.getExpiringCertificates2 = _getExpiringCertificates2;
    ordersServiceFactory.getLastCertificates = _getLastCertificates;
    ordersServiceFactory.getAllCertificates = _getAllCertificates;
    ordersServiceFactory.getPersonActiveCourse = _getPersonActiveCourse;
    ordersServiceFactory.getPersonPendingCourse = _getPersonPendingCourse;
    ordersServiceFactory.getNotifications = _getNotifications;
    ordersServiceFactory.getNotification = _getNotification;
    ordersServiceFactory.getOrders = _getOrders;
    ordersServiceFactory.saveOption = _saveOption;
    ordersServiceFactory.saveJournal = _saveJournal;
    ordersServiceFactory.deleteJournal = _deleteJournal;
    ordersServiceFactory.deleteOption = _deleteOption;

    return ordersServiceFactory;

}]);