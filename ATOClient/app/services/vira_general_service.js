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

    var _get_company = function () {
        var deferred = $q.defer();

        $http.get(vira_api + "api/GICompany/GetAll", {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_company = _get_company;

   var _add_company = function (entity) {
        var deferred = $q.defer();

       $http.post(vira_api + "api/GICompany/Add",entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.add_company = _add_company;

   var _edit_company = function (entity) {
        var deferred = $q.defer();

       $http.post(vira_api + "api/GICompany/Edit",entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.edit_company = _edit_company;

    var _delete_company = function (id) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/GICompany/Delete?id=" + id, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.delete_company = _delete_company;

    var _get_shipment = function () {
        var deferred = $q.defer();

        $http.get(vira_api + "api/GICompany/GetAllShipment", {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_shipment = _get_shipment;

    var _add_shipment = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/GICompany/AddShipment",entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.add_shipment = _add_shipment;

    var _edit_shipment = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/GICompany/EditShipment",entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.edit_shipment = _edit_shipment;

    var _delete_shipment = function (id) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/GICompany/DeleteShipment?id=" + id, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.delete_shipment = _delete_shipment;

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
    var _get_nis_approving = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/LGSNIS/GetNISApprovingCartable?page=1&size=1000",entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_nis_approving = _get_nis_approving;
    var _get_nis_list = function (entity) {
        var deferred = $q.defer();

        $http.get("http://localhost:9063/api/vira/get/nis/list",entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_nis_list = _get_nis_list;

    var _delivery_order_wr = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/LGSStockManagement/GetDeliveryOrderForWR", entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.delivery_order_wr = _delivery_order_wr;

    var _delete_component_cache = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/LGSComponentCache/Delete", entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.delete_component_cache = _delete_component_cache;

   var _get_tag_location = function (id) {
        var deferred = $q.defer();

       $http.get(vira_api + "api/GeneralInfo/GetTagByLocation?warehousetype=" + id, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_tag_location = _get_tag_location;

   var _approve_nis = function (entity) {
        var deferred = $q.defer();

       $http.post(vira_api + "api/LGSNIS/Approve",entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.approve_nis = _approve_nis;

    var _cancel_nis = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/LGSNIS/Cancel",entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.cancel_nis = _cancel_nis;

    var _document_save = function (entity) {
        var deferred = $q.defer();

        $http.post("http://localhost:9063/api/mnt/document/save", entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.document_save = _document_save;
     var _document_save_result = function (entity) {
        var deferred = $q.defer();

         $http.post("http://localhost:9063/api/mnt/document/result", entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.document_save_result = _document_save_result;

    var _document_save_request = function (entity) {
        var deferred = $q.defer();

        $http.post("http://localhost:9063/api/vira/document/save/request", entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.document_save_request = _document_save_request;

    var _document_save_do = function (entity) {
        var deferred = $q.defer();

        $http.post("http://localhost:9063/api/vira/document/save/do", entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.document_save_do = _document_save_do;

    var _document_save_nis = function (entity) {
        var deferred = $q.defer();

        $http.post("http://localhost:9063/vira/document/save/nis", entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.document_save_nis = _document_save_nis;

 var _document_sync_request = function (entity) {
        var deferred = $q.defer();

     $http.get("http://localhost:9063/api/document/request/sync", entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.document_sync_request = _document_sync_request;

    return ordersServiceFactory;

}]);