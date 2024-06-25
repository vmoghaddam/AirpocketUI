'use strict';
app.factory('vira_general_service', ['$http', '$q', 'localStorageService', 'ngAuthSettings', '$rootScope', function ($http, $q, localStorageService, ngAuthSettings, $rootScope) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var ordersServiceFactory = {};

    var _get_part_type = function () {
        var deferred = $q.defer();

        $http.get(vira_api + "api/CMPPartType/GetAll", {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_part_type = _get_part_type;

     var _delete_part_type = function (id) {
        var deferred = $q.defer();

         $http.post(vira_api + "api/CMPPartType/Delete?id=" + id, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.delete_part_type = _delete_part_type;

     var _get_position = function () {
        var deferred = $q.defer();

         $http.get(vira_api + "api/CMPPosition/GetAllPagination?page=1&size=1000", {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_position = _get_position;

    var _add_part_type = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/CMPPartType/Add", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.add_part_type = _add_part_type;

   var _edit_part_type = function (entity) {
        var deferred = $q.defer();

       $http.post(vira_api + "api/CMPPartType/Edit", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.edit_part_type = _edit_part_type;

    var _get_user_location = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/UMUser/GetUserLocationList", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_user_location = _get_user_location;

   var _validate_request = function (entity) {
        var deferred = $q.defer();

       $http.post(vira_api + "api/LGSRequest/ValidateRequestItems", entity, {


       }).then(function (response) {
           deferred.resolve(response.data );
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.validate_request = _validate_request;

   var _add_request = function (entity) {
        var deferred = $q.defer();

       $http.post(vira_api + "api/LGSRequest/Add", entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.add_request = _add_request;

  var _edit_request = function (entity) {
        var deferred = $q.defer();

      $http.post(vira_api + "api/LGSRequest/Edit", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.edit_request = _edit_request;

   var _get_request_cartable = function (entity) {
        var deferred = $q.defer();

       $http.post(vira_api + "api/LGSStockManagement/GetRequestCartable?page=1&size=1000", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_request_cartable = _get_request_cartable;

    var _get_request_cartable_line = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/LGSRequest/GetRequestCartable?page=1&size=1000", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_request_cartable_line = _get_request_cartable_line;


   var _get_request = function (id) {
        var deferred = $q.defer();

       $http.get(vira_api + "api/LGSRequest/GetRequest/" + id, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_request = _get_request;

   var _get_request_cartable_item = function (id) {
        var deferred = $q.defer();

       $http.get(vira_api + "api/LGSStockManagement/GetRequestItemCartable?id=" + id,{


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_request_cartable_item = _get_request_cartable_item;

    var _get_request_cartable_item_line = function (id) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/LGSRequest/GetRequestItemCartable?id=" + id, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_request_cartable_item_line = _get_request_cartable_item_line;

     var _approve_request = function (entity) {
        var deferred = $q.defer();

         $http.post(vira_api + "api/LGSRequest/Approve" , entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.approve_request = _approve_request;

    var _cancel_request = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/LGSRequest/Cancel" , entity, {


        }).then(function (response) {
            deferred.resolve(response.data );
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.cancel_request = _cancel_request;

     var _get_partnumebr_interchabge = function (id) {
        var deferred = $q.defer();

         $http.get(vira_api + "api/LGSStockManagement/GetPartNumberInterchange?id=" + id, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_partnumebr_interchabge = _get_partnumebr_interchabge;

    var _get_stock_paper = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/LGSStockManagement/GetStockPaper?page=1&size=1000", entity , {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_stock_paper = _get_stock_paper;

  var _get_stock_paper_item = function (entity) {
        var deferred = $q.defer();

      $http.post(vira_api + "api/LGSStockManagement/GetStockPaperItem?page=1&size=1000", entity , {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_stock_paper_item = _get_stock_paper_item;

    var _get_beginning_inventory = function (id) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/LGSStockManagement/GetBeginningInventory?locationId=" + id ,  {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_beginning_inventory = _get_beginning_inventory;

     var _add_beginning_inventory = function (entity) {
        var deferred = $q.defer();

         $http.post(vira_api + "api/LGSStockManagement/AddBeginningInventory", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.add_beginning_inventory = _add_beginning_inventory;

    var _edit_beginning_inventory = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/LGSStockManagement/UpdateBeginningInventory", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.edit_beginning_inventory = _edit_beginning_inventory;

     var _delete_beginning_inventory = function (id) {
        var deferred = $q.defer();

         $http.post(vira_api + "api/LGSStockManagement/DeleteBeginningInventory?id=" + id , {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.delete_beginning_inventory = _delete_beginning_inventory;

    var _add_nis = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/LGSNIS/Add", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.add_nis = _add_nis;

     var _get_year = function (id) {
        var deferred = $q.defer();

         $http.get(vira_api + "api/FINFinancialYear/GetFinancialYear/" + id, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_year = _get_year;

    var _get_cardex = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/LGSStockManagement/GetInventoryCardex", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_cardex = _get_cardex;
     var _edit_part_number = function (entity) {
        var deferred = $q.defer();

         $http.post(vira_api + "api/CMPPartNumber/Edit", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.edit_part_number = _edit_part_number;

  var _delete_part_number = function (id) {
        var deferred = $q.defer();

      $http.post(vira_api + "api/CMPPartNumber/Delete?id=" + id, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.delete_part_number = _delete_part_number;

    return ordersServiceFactory;

}]);