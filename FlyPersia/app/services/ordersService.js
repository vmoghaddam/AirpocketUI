'use strict';
app.factory('ordersService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

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

    ordersServiceFactory.getOrders = _getOrders;

    return ordersServiceFactory;

}]);