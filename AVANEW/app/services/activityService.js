'use strict';
app.factory('activityService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {



    var serviceFactory = {};
    var _getDashboard = function (cid, mid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/dashboard/total/' + cid + '/' +    mid ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getMenuHits = function (cid,uid,mid,top) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/menuhits/top/'+cid+'/'+uid+'/'+mid+'/'+top  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getLastActivities = function (cid,   mid, uid,top) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/useractivities/top/'+cid+'/'+mid+'/'+uid+'/'+top).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFlightsSummary = function (cid, date) {
        var _df = moment(date).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/dashboard/flight/' + cid + '?date=' + _df).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getIRAirports = function () {

        var deferred = $q.defer();
        $http.get(serviceBase + "odata/airports/all?$filter=CountryId eq 103 and IATA ne '-'"  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
     
    var _save = function (entity) {
        
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/useractivities/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
        
        
    };

    var _hitMenu = function (key,url,remark) {
        var entity = {
            Id: -1,
            Date: null,
            UserId: $rootScope.userId,
            Key: key,
            Url: url,
            ModuleId: $rootScope.moduleId,
            IsMain: 1,
            CustomerId: Config.CustomerId,
            Remark: remark,
        };
        _save(entity);
    };
    serviceFactory.getIRAirports = _getIRAirports;
    serviceFactory.save = _save;
    serviceFactory.hitMenu = _hitMenu;
    serviceFactory.getMenuHits = _getMenuHits;
    serviceFactory.getLastActivities = _getLastActivities;
    serviceFactory.getDashboard = _getDashboard;
    serviceFactory.getFlightsSummary = _getFlightsSummary;
    //serviceFactory.delete = _delete;
    return serviceFactory;

}]);