'use strict';
app.factory('biService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {
    var serviceFactory = {};
    var biUrl = serviceBase;
    var _getFuelMonthly = function (year) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/fuel/monthly/' + year).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFuelMonthlyTypes = function (year) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/fuel/monthly/types/' + year).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFuelMonthlyRoutes = function (year) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/fuel/monthly/routes/' + year).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFuelMonthlyRegisters = function (year) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/fuel/monthly/registers/' + year).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFuelDaily = function (year,month) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/fuel/daily/year/month/' + year+'/'+month).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFuelTypeDaily = function (year, month) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/fuel/daily/type/year/month/' + year + '/' + month).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFuelRouteDaily = function (year, month) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/fuel/daily/route/year/month/' + year + '/' + month).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFuelRegisterDaily = function (year, month) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/fuel/daily/register/year/month/' + year + '/' + month).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFuelRoutesYearly = function (year) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/fuel/routes/year/' + year).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFuelTypesYearly = function (year) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/fuel/types/year/' + year).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

var _getFuelRouteMonthly = function (year,route) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/fuel/route/monthly/' + year+'/'+route).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    //////// DELAYS ////////////////////////////////
    var _getDelayMonthly = function (year) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/monthly/' + year  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getDelayDaily = function (year,month) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/daily/' + year+'/'+month).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getDelayDailyYMS = function (yms) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/daily/' + yms ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getDelayCategoriesMonthly = function (year) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/categories/monthly/' + year).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getDelayCategoriesDaily = function (year, month) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/categories/daily/' + year+'/'+month).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getDelayCategoriesDailyYMS = function (yms) {
       
        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/categories/daily/' +yms).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getDelayAirportsDailyYMS = function (yms) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/airports/daily/' + yms).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getDelayCategoriesDailyYMSCat = function (yms) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/categories/daily/ymscat/' + yms).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCatNames = function () {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/categories/'  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getAirports = function () {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/airports/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getDelayTechnicalsMonthly = function (year) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/technicals/monthly/' + year).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getDelayTechnicalsDaily = function (year,month) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/technicals/daily/' + year+'/'+month).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getDelayAirportsMonthly = function (year) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/airports/monthly/' + year).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getDelayAirportsDaily = function (year,month) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/airports/daily/' + year+'/'+month).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDelayMonthlyCatAirportsAll = function (year) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/monthly/cat/airport/' + year).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDelayMonthlyCatAirportsByAirport = function (year,airport) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/monthly/cat/airport/' + year + '/' + airport+'/-/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getDelayDailyCatAirportsByAirport = function (year, airport) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/daily/cat/airport/' + year+'/'+month + '/' + airport + '/-/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDelayItems = function (year, month,day,cat,apt) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/items/' + year + '/' + month + '/' + day + '/'+cat+'/'+apt+'/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getDelayItemsYMS = function (yms, cat, apt,range) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/items/' + yms + '/' + cat + '/' + apt + '/'+range+'/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getAirportDelayedFlights = function (year, month, airport) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/detail/monthly/airport/' + year + '/' + month + '/'+airport+'/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDelayedFlights = function (year, month, airport,min,max) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/detail/monthly/' + year + '/' + month + '/' + airport + '/'+min+'/'+max+'/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDelayedFlightCats = function (year, month,cat, airport, min, max) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/detail/monthly/cat/' + year + '/' + month + '/'+cat+'/' + airport + '/' + min + '/' + max + '/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getDelayedFlightCatRegister = function (year, month, cat,reg, airport, min, max) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/detail/monthly/cat/reg/' + year + '/' + month + '/' + cat +'/'+reg+ '/' + airport + '/' + min + '/' + max + '/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getFlightDelays = function (flight) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/detail/flight/' + flight ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getMonthAirportsSummary = function (yms) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/airports/monthly/summary/' + yms).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getMonthCategoriesSummary = function (yms) {

        var deferred = $q.defer();
        $http.get(biUrl + 'bi/delay/categories/monthly/summary/' + yms).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    serviceFactory.getMonthAirportsSummary = _getMonthAirportsSummary;
    serviceFactory.getMonthCategoriesSummary = _getMonthCategoriesSummary;
    serviceFactory.getDelayAirportsMonthly = _getDelayAirportsMonthly;
    serviceFactory.getDelayCategoriesMonthly = _getDelayCategoriesMonthly;
    serviceFactory.getDelayTechnicalsMonthly = _getDelayTechnicalsMonthly;
    serviceFactory.getFuelMonthly = _getFuelMonthly;
    serviceFactory.getFuelMonthlyTypes = _getFuelMonthlyTypes;
    serviceFactory.getFuelMonthlyRoutes = _getFuelMonthlyRoutes;
    serviceFactory.getFuelMonthlyRegisters = _getFuelMonthlyRegisters;
    serviceFactory.getFuelDaily = _getFuelDaily;
    serviceFactory.getFuelRoutesYearly = _getFuelRoutesYearly;
    serviceFactory.getFuelRouteMonthly = _getFuelRouteMonthly;
    serviceFactory.getFuelTypesYearly = _getFuelTypesYearly;
    serviceFactory.getFuelTypeDaily = _getFuelTypeDaily;
    serviceFactory.getFuelRouteDaily = _getFuelRouteDaily;
    serviceFactory.getFuelRegisterDaily = _getFuelRegisterDaily;
    //////// DELAYS //////////////////////////////////
    serviceFactory.getDelayMonthly = _getDelayMonthly;
    serviceFactory.getDelayMonthlyCatAirportsAll = _getDelayMonthlyCatAirportsAll;
    serviceFactory.getDelayMonthlyCatAirportsByAirport = _getDelayMonthlyCatAirportsByAirport;
    serviceFactory.getAirportDelayedFlights = _getAirportDelayedFlights;
    serviceFactory.getFlightDelays = _getFlightDelays;
    serviceFactory.getDelayedFlights = _getDelayedFlights;
    serviceFactory.getDelayedFlightCats = _getDelayedFlightCats;
    serviceFactory.getDelayedFlightCatRegister = _getDelayedFlightCatRegister;
    //////Daily/////////////////////
    serviceFactory.getDelayDaily = _getDelayDaily;
    serviceFactory.getDelayDailyYMS = _getDelayDailyYMS;
    serviceFactory.getDelayCategoriesDaily = _getDelayCategoriesDaily;
    serviceFactory.getDelayCategoriesDailyYMS = _getDelayCategoriesDailyYMS;
    serviceFactory.getDelayAirportsDailyYMS = _getDelayAirportsDailyYMS;
    serviceFactory.getDelayCategoriesDailyYMSCat = _getDelayCategoriesDailyYMSCat;
    serviceFactory.getDelayTechnicalsDaily = _getDelayTechnicalsDaily;
    serviceFactory.getDelayAirportsDaily = _getDelayAirportsDaily;
    serviceFactory.getDelayDailyCatAirportsByAirport = _getDelayDailyCatAirportsByAirport;
    serviceFactory.getCatNames = _getCatNames;
    serviceFactory.getAirports = _getAirports;

    /////////////////////////////
    serviceFactory.getDelayItems = _getDelayItems;
    serviceFactory.getDelayItemsYMS = _getDelayItemsYMS;


    return serviceFactory;

}]);