'use strict';
app.factory('testService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var testServiceFactory = {};

    //var _getOrders = function () {

    //    return $http.get(serviceBase + 'api/orders').then(function (results) {

    //        return results;
    //    });
    //};

    //ordersServiceFactory.getOrders = _getOrders;

    return testServiceFactory;

}]);