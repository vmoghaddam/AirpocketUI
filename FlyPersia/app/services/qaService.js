'use strict';
app.factory('qaService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {

    var serviceFactory = {};

    var _getQAByEmployee = function (employeeId) {
        var deferred = $q.defer();
        $http.get(apiQA + "api/get/qa/" + employeeId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getQAStatus = function (entity) {
        var deferred = $q.defer();
        $http.post(apiQA + "api/get/qa/status", entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _confirmReport = function (employeeId, type, id) {
        var deferred = $q.defer();
        $http.get(apiQA + "api/qa/confirm/report/" + employeeId + "/" + type + '/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _followUpHsitory = function (entityId, type) {
        var deferred = $q.defer();
        $http.get(apiQA + "api/get/followup/" + entityId + "/" + type).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }


    var _getEventTitle = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/csr/eventtitle').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }


    var _getFlightPhase = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/csr/flightphase').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getFlightInformation = function (Id) {

        var deferred = $q.defer();
        $http.get('https://localhost:44399/api/get/flightinformation/' + Id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getDamageBy = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/gia/dmgby').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getWeather = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/gia/weather').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getSurface = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/gia/surface').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getLighting = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/gia/lighting').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getMORCompnSpec = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/mor/compnspec').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }



    //var _saveCRS = function (entity) {

    //    var deferred = $q.defer();
    //    $http.post('http://localhost:9063/api/save/csr', entity).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {
    //        deferred.reject(Exceptions.getMessage(err));
    //    })

    //    return deferred.promise;
    //}

    var _saveMOR = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/save/mor', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
    var _saveVHR = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/save/vhr', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _saveGIA = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/save/gia', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getCSRById = function (Id) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/csr/byid/' + Id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getMORById = function (Id) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/mor/byid/' + Id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getVHRById = function (Id) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/vhr/' + Id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getGIAById = function (Id) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/gia/byid/' + Id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _saveCHR = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/save/chr', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getCHRById = function (Id) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/chr/byid/' + Id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getCHRReason = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/chr/reason').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _saveSHR = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/save/shr', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _saveFollowUp = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/save/followup', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getSHRById = function (Id) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/shr/byid/' + Id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getSHRReason = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/shr/reason').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }


    var _saveDHR = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/save/dhr', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getDHRById = function (Id) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/dhr/byid/' + Id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getOPCatagory = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/opcatagory').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getDISCatagory = function () {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/discatagory').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getSecurityReport = function (ymf, ymt) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/security/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getCyberReport = function (ymf, ymt) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/cyber/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getVoluntaryReport = function (ymf, ymt) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/voluntary/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }


    var _getCateringReport = function (ymf, ymt) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/catering/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getGroundReport = function (ymf, ymt) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/ground/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }


    var _getCabinReport = function (ymf, ymt) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/csr/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

      var _getCabinEventReport = function (ymf, ymt) {

        var deferred = $q.defer();
          $http.get(apiQA + 'api/qa/csr/event/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getMaintenanceReport = function (ymf, ymt) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/maintenance/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getMaintenanceRegReport = function (ymf, ymt) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/maintenance/reg/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getDispatchReport = function (ymf, ymt) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/dispatch/report/' + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getQAEmployee = function (type, entityId, referrerId) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/qa/employee/' + type + '/' + entityId + '/' + referrerId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }


    var _saveFollowUp = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/save/followup', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _acceptQA = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/qa/accept', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _rejectQA = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/qa/reject', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _referre = function (entity) {
        console.log(entity);
        var deferred = $q.defer();
        $http.post(apiQA + 'api/qa/referr', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }



    var _getReferredList = function (referreId, type, entityId) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/qa/get/referred/' + referreId + '/' + type + '/' + entityId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }


    var _getIsResponsible = function (employeeId, type, entityId) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/qa/isresponsible/' + employeeId + '/' + type + '/' + entityId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }


    var _getComments = function (entityId, type) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/qa/get/comments/' + entityId + '/' + type).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }



    var _sendComment = function (entity) {
        console.log(entity);
        var deferred = $q.defer();
        $http.post(apiQA + 'api/qa/send/comment', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _saveComment = function (entityId, type, employeeId) {
        var deferred = $q.defer();
        $http.get(apiQA + 'api/comment/' + entityId + "/" + type + "/" + employeeId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }



    var _getCyberIncident = function () {

        var deferred = $q.defer();
        $http.get(apiQA + '/api/get/cyber/incident').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getCyberAccess = function () {

        var deferred = $q.defer();
        $http.get(apiQA + '/api/get/cyber/accessibility').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getCyberMethod = function () {

        var deferred = $q.defer();
        $http.get(apiQA + '/api/get/cyber/method').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _saveCyber = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + '/api/save/cyber', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getCyberByFlightId = function (employeeId, flightId) {

        var deferred = $q.defer();
        $http.get(apiQA + '/api/get/cyber/' + employeeId + '/' + flightId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getCyberById = function (id) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/cyber/byid/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getImportedFile = function (entityId, employeeId, type) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/get/imported/file/' + entityId + '/' + 4011 + '/' + type).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _downloadQa = function (filename, filetype) {
        var deferred = $q.defer();
        var name = filename + "." + filetype;
        $http.get(apiQA + 'api/download/qa/' + filename + "/" + filetype, { responseType: 'arraybuffer' }).then(function (response) {
            deferred.resolve(response.data);
            console.log(response);
            //var headers = response.config.headers;
            //var filename = headers['content-disposition'].split('=')[1];

            var blob = new Blob([response.data], { type: "application/octet-stream" });
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = name;
            a.click();
            window.URL.revokeObjectURL(url);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _deleteAttachment = function (entity) {

        var deferred = $q.defer();
        $http.post(apiQA + 'api/delete/attachment', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getStation = function (cid) {

        var deferred = $q.defer();
        $http.get(apiQA + '/api/get/station').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getQAFormByDate = function (yearmonth, type) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/qa/form/date/' + yearmonth + "/" + type).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getQAFormByRegister = function (yf, yt, mf, mt, register, type) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/qa/form/register/' + yf + "/" + yt + "/" + (mf + 1) + "/" + (mt + 1) + "/" + register + "/" + type).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getQAFormByRoute = function (yf, yt, mf, mt, route, type) {

        var deferred = $q.defer();
        $http.get(apiQA + 'api/qa/form/route/' + yf + "/" + yt + "/" + (mf + 1) + "/" + (mt + 1) + "/" + route + "/" + type).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getCabinReporter = function () {

        var deferred = $q.defer();
        $http.get(apiQA + '/api/get/csr/reporter').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

	 var _saveFeedBack = function (entity) {
        console.log(entity);
        var deferred = $q.defer();
          $http.post(apiQA + 'api/qa/save/feedback', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

    var _getFeedBack = function (entityId, type) {
        var deferred = $q.defer();
        $http.get(apiQA + 'api/qa/get/feedback' + '/' + entityId + '/' + type).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }

      var _dltFeedBack = function (id) {
        var deferred = $q.defer();
          $http.get(apiQA + 'api/qa/delete/feedback' + '/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }
  
var _getDateVisit = function (employeeId) {

    var deferred = $q.defer();
    $http.get(apiQA + 'api/get/datevisit/' + employeeId).then(function (response) {
        deferred.resolve(response.data);
    }, function (err, status) {
        deferred.reject(Exceptions.getMessage(err));
    })

    return deferred.promise;
}

 var _setDateVisit = function (employeeId, type) {

    var deferred = $q.defer();
     $http.get(apiQA + 'api/set/datevisit/' + employeeId + '/' + type).then(function (response) {
        deferred.resolve(response.data);
    }, function (err, status) {
        deferred.reject(Exceptions.getMessage(err));
    })

    return deferred.promise;
}
 
 
 var _getVoyageReport = function (id) {

    var deferred = $q.defer();
    $http.get(apiQA + 'api/get/voyage/' + id ).then(function (response) {
        deferred.resolve(response.data);
    }, function (err, status) {
        deferred.reject(Exceptions.getMessage(err));
    })

    return deferred.promise;
}

    serviceFactory.getQAByEmployee = _getQAByEmployee;
    serviceFactory.getQAStatus = _getQAStatus;
    serviceFactory.confirmReport = _confirmReport;

    serviceFactory.getFlightInformation = _getFlightInformation;

    serviceFactory.getGIAById = _getGIAById;
    serviceFactory.saveGIA = _saveGIA;
    serviceFactory.getDamageBy = _getDamageBy;
    serviceFactory.getWeather = _getWeather;
    serviceFactory.getSurface = _getSurface;
    serviceFactory.getLighting = _getLighting;


    //serviceFactory.saveCSR = _saveCRS;
    serviceFactory.getCSRById = _getCSRById;
    serviceFactory.getEventTitle = _getEventTitle;
    serviceFactory.getFlightPhase = _getFlightPhase;
    serviceFactory.getCabinReporter = _getCabinReporter;


    serviceFactory.getCHRById = _getCHRById;
    serviceFactory.saveCHR = _saveCHR;
    serviceFactory.getCHRReason = _getCHRReason;

    serviceFactory.getSHRById = _getSHRById;
    serviceFactory.saveSHR = _saveSHR;
    serviceFactory.getSHRReason = _getSHRReason;

    serviceFactory.getVHRById = _getVHRById;
    serviceFactory.saveVHR = _saveVHR;

    serviceFactory.saveMOR = _saveMOR;
    serviceFactory.getMORById = _getMORById;
    serviceFactory.getMORCompnSpec = _getMORCompnSpec;

    serviceFactory.saveDHR = _saveDHR;
    serviceFactory.getDHRById = _getDHRById;
    serviceFactory.getOPCatagory = _getOPCatagory;
    serviceFactory.getDISCatagory = _getDISCatagory;

    serviceFactory.saveFollowUp = _saveFollowUp;
    serviceFactory.followUpHsitory = _followUpHsitory;

    serviceFactory.getCateringReport = _getCateringReport
    serviceFactory.getSecurityReport = _getSecurityReport
    serviceFactory.getGroundReport = _getGroundReport
    serviceFactory.getMaintenanceReport = _getMaintenanceReport
    serviceFactory.getMaintenanceRegReport = _getMaintenanceRegReport
    serviceFactory.getCabinReport = _getCabinReport
    serviceFactory.getCabinEventReport = _getCabinEventReport
    serviceFactory.getDispatchReport = _getDispatchReport
    serviceFactory.getVoluntaryReport = _getVoluntaryReport
    serviceFactory.getCyberReport = _getCyberReport


    serviceFactory.getQAEmployee = _getQAEmployee

    serviceFactory.referre = _referre
    serviceFactory.getReferredList = _getReferredList

    serviceFactory.acceptQA = _acceptQA
    serviceFactory.rejectQA = _rejectQA

    serviceFactory.getIsResponsible = _getIsResponsible

    serviceFactory.getComments = _getComments
    serviceFactory.sendComment = _sendComment

    serviceFactory.getCyberByFlightId = _getCyberByFlightId;
    serviceFactory.getCyberById = _getCyberById;
    serviceFactory.saveCyber = _saveCyber;
    serviceFactory.getCyberIncident = _getCyberIncident;
    serviceFactory.getCyberAccess = _getCyberAccess;
    serviceFactory.getCyberMethod = _getCyberMethod;

    serviceFactory.getImportedFile = _getImportedFile;
    serviceFactory.downloadQa = _downloadQa;
    serviceFactory.deleteAttachment = _deleteAttachment;

    serviceFactory.saveComment = _saveComment;
    serviceFactory.getStation = _getStation;


    serviceFactory.getQAFormByDate = _getQAFormByDate;
    serviceFactory.getQAFormByRegister = _getQAFormByRegister;
    serviceFactory.getQAFormByRoute = _getQAFormByRoute;

 serviceFactory.saveFeedBack = _saveFeedBack;
    serviceFactory.getFeedBack = _getFeedBack;
    serviceFactory.dltFeedBack = _dltFeedBack;

	serviceFactory.getDateVisit = _getDateVisit;
serviceFactory.setDateVisit = _setDateVisit;
    
	 serviceFactory.getVoyageReport = _getVoyageReport;
    return serviceFactory;

}]);