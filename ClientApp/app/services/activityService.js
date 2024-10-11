'use strict';
app.factory('activityService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {



    var serviceFactory = {};
    var _getMain = function (cid, uid,eid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/dashboard/total/' + cid + '/' + mid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getDashboard = function (cid, mid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/dashboard/total/' + cid + '/' +    mid ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getAppDashboard = function (cid, eid) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/dashboard/app/' + cid + '/' + eid).then(function (response) {
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
     
    var _save = function (entity) {
        
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/useractivities/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
        
        
    };

    var _hitMenu = function (key,url,remark,moduleId) {
        var entity = {
            Id: -1,
            Date: null,
            UserId: $rootScope.userId,
            Key: key,
            Url: url,
            ModuleId: moduleId ? moduleId: $rootScope.moduleId,
            IsMain: 1,
            CustomerId: Config.CustomerId,
            Remark: remark,
        };
        _save(entity);
    };
    var _visitMessage = function (id) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/visitmessage/' + id  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _visitLibrary = function (employeeId,itemid  ) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/visitlibrary/' + employeeId + '/' + itemid ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _visitFile = function (employeeId, fileId) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/visitfile/' + employeeId + '/' + fileId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _downloadLibrary = function (employeeId, itemid) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/downloadlibrary/' + employeeId + '/' + itemid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    
    serviceFactory.save = _save;
    serviceFactory.hitMenu = _hitMenu;
    serviceFactory.getMenuHits = _getMenuHits;
    serviceFactory.getLastActivities = _getLastActivities;
    serviceFactory.getDashboard = _getDashboard;
    serviceFactory.getAppDashboard = _getAppDashboard;
    serviceFactory.visitLibrary = _visitLibrary;
    serviceFactory.visitFile = _visitFile;
    serviceFactory.visitMessage = _visitMessage;
    serviceFactory.downloadLibrary = _downloadLibrary;
    //serviceFactory.delete = _delete;
    return serviceFactory;

}]);