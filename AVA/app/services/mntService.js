﻿'use strict';
app.factory('mntService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', '$rootScope', function ($http, $q, localStorageService, ngAuthSettings, $rootScope) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var ordersServiceFactory = {};

    var _getLLP = function (id) {

        return $http.get($rootScope.serviceMnt + 'api/mnt/get/aircraft/llp/' + id).then(function (results) {
            return results;
        });
    };
    var _getCheck = function (id) {

        return $http.get($rootScope.serviceMnt + 'api/mnt/get/aircraft/checks/aircraft/' + id).then(function (results) {
            return results;
        });
    };
    var _getADSB = function (id) {

        return $http.get($rootScope.serviceMnt + 'api/mnt/get/aircraft/adsbs/aircraft/' + id).then(function (results) {
            return results;
        });
    };
    var _getEngADSB = function (id) {

        return $http.get($rootScope.serviceMnt + 'api/mnt/get/aircraft/adsbs/engine/' + id).then(function (results) {
            return results;
        });
    };
    var _getEngLlp = function (id) {

        return $http.get($rootScope.serviceMnt + 'api/mnt/get/aircraft/llps/engine/' + id).then(function (results) {
            return results;
        });
    };

    var _getMntTotal = function (id) {

        return $http.get($rootScope.serviceMnt + 'api/mnt/get/total').then(function (results) {
            return results;
        });
    };
    var _getEngine = function (engid, engno) {

        return $http.get($rootScope.serviceMnt + 'api/mnt/get/eng/' + engid + '/' + engno).then(function (results) {
            return results;
        });
    };
    var _saveLLP = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceMnt + 'api/mnt/aircraft/status', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveADSB = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceMnt + 'api/mnt/aircraft/adsb/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveCheck = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceMnt + 'api/mnt/aircraft/check/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveEngStatus = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceMnt + 'api/mnt/engine/status', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveEngLlp = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceMnt + 'api/mnt/engine/llp/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveEngAdsb = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceMnt + 'api/mnt/engine/adsb/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _deletEngAdsb = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceMnt + 'api/mnt/engine/adsb/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _deletAcCheck = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceMnt + 'api/mnt/aircraft/check/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _deletAcAdsb = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceMnt + 'api/mnt/aircraft/adsb/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _deletEngLlp = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceMnt + 'api/mnt/engine/llp/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getDashboard = function () {
        //00000
        var deferred = $q.defer();
        $http.get($rootScope.serviceMnt + 'api/mnt/dashboard/-1').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;



    };


    var _authenticate = function (entity) {
        var deferred = $q.defer();
        $http.post('https://lmmcore.online/api/Authenticate', entity).then(function (response) {

            var responseData = response.data.data;

            console.log(responseData);
            localStorageService.set('authorizationMnt', {
                token: responseData.token, refreshToken: responseData.refreshToken, expires: responseData.tokenTimeout, useRefreshTokens: true
            });
           // $rootScope.vira_user_id = 8;
           // $rootScope.vira_user_delafult_stock_id = 19;
           // $rootScope.vira_user_delafult_location_id = 19;
            if (entity.ap_username == 'e.shakeri2') {

                $rootScope.vira_user_id = 19;
                $rootScope.vira_user_delafult_stock_id = 19;
                $rootScope.vira_user_delafult_location_id = 35;
                localStorageService.set('vira_user_id', 19);
                localStorageService.set('vira_user_delafult_stock_id', 19);
                localStorageService.set('vira_user_delafult_location_id', 35);
            }
            else {
                $rootScope.vira_user_id = 8;
                $rootScope.vira_user_delafult_stock_id = 19;
                $rootScope.vira_user_delafult_location_id = 19;
                localStorageService.set('vira_user_id', 8);
                localStorageService.set('vira_user_delafult_stock_id', 19);
                localStorageService.set('vira_user_delafult_location_id', 19);
            }


            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _addPartNumber = function (entity) {
        var deferred = $q.defer();
        var authorizationMnt = localStorageService.get('authorizationMnt');
        console.log('token: ', authorizationMnt.token);
        $http.post('https://lmmcore.online/api/CMPPartNumber/Add', entity, {
            headers: { 'Authorization': 'Bearer ' + authorizationMnt.token }

        }).then(function (response) {


            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _addReceipt = function (entity) {
        var deferred = $q.defer();
        var authorizationMnt = localStorageService.get('authorizationMnt');
        console.log('token: ', authorizationMnt.token);
        $http.post('https://lmmcore.online/api/LGSStockManagement/AddReceipt', entity, {
            headers: { 'Authorization': 'Bearer ' + authorizationMnt.token }

        }).then(function (response) {


            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    

    var _getAFCTType = function () {
        var deferred = $q.defer();
        var authorizationMnt = localStorageService.get('authorizationMnt');


        var token = authorizationMnt.token;
        console.log('Token:', 'bearer ' +token);

        $http.get("https://lmmcore.online/api/ACFTType/GetAll", {
          //  headers: {
          //      'Authorization': 'bearer ' + token,
         //   }
        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

   var _getAFCTModel = function () {
        var deferred = $q.defer();
        var authorizationMnt = localStorageService.get('authorizationMnt');


        var token = authorizationMnt.token;
        console.log('Token:', 'bearer ' +token);

       $http.get("https://lmmcore.online/api/ACFTModel/GetAll", {
          //  headers: {
          //      'Authorization': 'bearer ' + token,
         //   }
        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getAFCTRegister = function () {
        var deferred = $q.defer();
        var authorizationMnt = localStorageService.get('authorizationMnt');


        var token = authorizationMnt.token;
        console.log('Token:', 'bearer ' +token);

        $http.get("https://lmmcore.online/api/ACFTRegister/GetAll", {
          //  headers: {
          //      'Authorization': 'bearer ' + token,
         //   }
        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

     var _getPartType = function () {
        var deferred = $q.defer();
        var authorizationMnt = localStorageService.get('authorizationMnt');


        var token = authorizationMnt.token;
        console.log('Token:', token);

         $http.get("https://lmmcore.online/api/CMPPartType/GetAll", {
            //withCredentials: true,
            headers: {
                'Authorization': 'bearer ' + token,
            }
        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


     var _getReceiptPN= function (parentId) {
        var deferred = $q.defer();
        var authorizationMnt = localStorageService.get('authorizationMnt');
        var token = authorizationMnt.token;
        
         $http.get("https://lmmcore.online/api/GeneralInfo/GetByParent?parentId=" + parentId, {
            //withCredentials: true,
            headers: {
                'Authorization': 'bearer ' + token,
            }
        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

       var _getPNSelection = function (entity) {
        var deferred = $q.defer();
        var authorizationMnt = localStorageService.get('authorizationMnt');
        var token = authorizationMnt.token;
           $http.post("https://lmmcore.online/api/CMPPartNumber/GetAllPagination?page=1&size=10000", entity, {
            //withCredentials: true,
            headers: {
                'Authorization': 'bearer ' + token,
            }
        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _get_inventory = function (dto) {
        var deferred = $q.defer();
        
        $http.post("https://lmmcore.online/api/LGSStockManagement/GetInventoryByComponent?page=1&size=1000", dto, {
            
            
        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_inventory = _get_inventory;


    var _get_locations = function (dto) {
        if (!dto)
            dto = {};
        var deferred = $q.defer();

        $http.post(vira_api + "api/GILocation/GetAllPagination?page=1&size=1000", dto, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_locations = _get_locations;

    var _get_user_locations = function (dto) {
        var deferred = $q.defer();

        $http.post(vira_api+"api/UMUser/GetUserLocationList", dto, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_user_locations = _get_user_locations;


    var _get_register = function () {
        var deferred = $q.defer();

        $http.get(vira_api+"api/ACFTRegister/GetAll", {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_register = _get_register;


     var _get_ac_type = function () {
        var deferred = $q.defer();

        $http.get(vira_api+"api/ACFTType/GetAll", {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_ac_type = _get_ac_type;


    var _get_shop = function () {
        var deferred = $q.defer();
        var entity = {};
        $http.post(vira_api+"api/GILocation/GetAllPagination?page=1&size=1000", entity ,{


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_shop = _get_shop;

     var _get_component = function (entity) {
        var deferred = $q.defer();

         $http.post(vira_api +"api/LGSStockManagement/GetInventoryByComponent?page=1&size1000" , entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_component = _get_component;


     var _add_delivery_order = function (entity) {
        var deferred = $q.defer();

         $http.post(vira_api +"api/LGSStockManagement/AddDeliveryOrder" , entity, {


        }).then(function (response) {
            deferred.resolve(response.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.add_delivery_order = _add_delivery_order;

     var _get_company = function () {
        var deferred = $q.defer();

         $http.get(vira_api +"api/GICompany/GetAll" , {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_company = _get_company;

     var _get_part_number = function (entity) {
        var deferred = $q.defer();

         $http.post(vira_api + "api/LGSStockManagement/GetInventoryByPartNumber?page=1&size=10000", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_part_number = _get_part_number;

    var _get_selected_component = function (entity) {
        var deferred = $q.defer();

        $http.post(vira_api + "api/LGSStockManagement/GetSelectedComponent", entity, {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_selected_component = _get_selected_component;



    var _get_selected_component_all = function (items) {
        var deferred = $q.defer();

        var syncedPromises = [];
        var resps = [];

        $.each(items, function (_d, _item) {

            syncedPromises.push($http.post(vira_api + "api/LGSStockManagement/GetSelectedComponent", _item).then(resp => { resps.push(resp); }));
        });

        var components = [];
        $q.all(syncedPromises).then(result => {
            $.each(resps, function (_l, _row) {
                $.each(_row.data.data, function (_k, _dt) {
                    components.push(_dt);
                });
            });
            deferred.resolve(components);
        });

        //$http.post(vira_api + "api/LGSStockManagement/GetSelectedComponent", entity, {


        //}).then(function (response) {
        //    deferred.resolve(response.data.data);
        //}, function (err) {
        //    console.error('HTTP request error:', err);
        //    deferred.reject(Exceptions.getMessage(err));
        //});

        return deferred.promise;
    };
    ordersServiceFactory.get_selected_component_all = _get_selected_component_all;


    var _get_ata_chart = function () {

        var deferred = $q.defer();

        $http.get(vira_api + "api/GIATAChapter/GetAll", {


        }).then(function (response) {
            deferred.resolve(response.data.data);
        }, function (err) {
            console.error('HTTP request error:', err);
            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    ordersServiceFactory.get_ata_chart = _get_ata_chart;



    ordersServiceFactory.authenticate = _authenticate;

    ordersServiceFactory.addPartNumber = _addPartNumber;
    ordersServiceFactory.getAFCTType = _getAFCTType;
    ordersServiceFactory.getAFCTModel = _getAFCTModel;
    ordersServiceFactory.getAFCTRegister = _getAFCTRegister;
    ordersServiceFactory.getPartType = _getPartType;
    ordersServiceFactory.getReceiptPN = _getReceiptPN;
    ordersServiceFactory.addReceipt = _addReceipt;
    ordersServiceFactory.getPNSelection = _getPNSelection;

    ordersServiceFactory.getDashboard = _getDashboard;
    ordersServiceFactory.getLLP = _getLLP;
    ordersServiceFactory.getADSB = _getADSB;
    ordersServiceFactory.getCheck = _getCheck;
    ordersServiceFactory.getEngADSB = _getEngADSB;
    ordersServiceFactory.getEngLlp = _getEngLlp;
    ordersServiceFactory.getMntTotal = _getMntTotal;
    ordersServiceFactory.getEngine = _getEngine;


    ordersServiceFactory.saveLLP = _saveLLP;
    ordersServiceFactory.saveADSB = _saveADSB;
    ordersServiceFactory.saveCheck = _saveCheck;
    ordersServiceFactory.saveEngStatus = _saveEngStatus;
    ordersServiceFactory.saveEngLlp = _saveEngLlp;
    ordersServiceFactory.saveEngAdsb = _saveEngAdsb;


    ordersServiceFactory.deleteEngAdsb = _deletEngAdsb;
    ordersServiceFactory.deleteAcCheck = _deletAcCheck;
    ordersServiceFactory.deleteAcAdsb = _deletAcAdsb;
    ordersServiceFactory.deleteEngLlp = _deletEngLlp;

    return ordersServiceFactory;

}]);