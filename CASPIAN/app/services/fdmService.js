'use strict';
app.factory('fdmService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {

    var serviceFactory = {};

    ////////////
    var _getFdm = function (yf, yt) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/get/fdm/" + yf + "/" + yt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    /////////////
    var _makeVisible = function (year, month) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/visible/" + year + "/" + month).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    //var _getFdmIncidentType = function (df, dt) {
    //    var deferred = $q.defer();
    //    $http.get(apiFdm + "api/fdm/dashboard/type/" + df + "/" + dt).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {
    //        // deferred.reject(Exeptions.getMessage(err));
    //    });

    //    return deferred.promise;
    //}


    /////////////////////
    var _getFdmEventsName = function (ymf, ymt) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/dashboard/eventname/" + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }



    ////////////
    var _getFdmRegisterEvent = function (df, dt) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/dashboard/register/" + df + "/" + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }




    ////////////////
    var _getTopCpt = function (ymf, ymt) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/get/fdm/top/cpt/" + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _compareTopCpt = function (ymf, ymt) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/compare/top/cpt/" + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _compareTopRegister = function (ymf, ymt) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/compare/top/register/" + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getTopCpt2 = function (yf, yt, mf, mt) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/get/fdm/top/cpt2/" + yf + "/" + yt + "/" + mf + "/" + mt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getTopCptByMonth = function (year, month) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/get/fdm/top/cpt/month/" + year + "/" + month).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }


    /////////////////////
    var _getTopCptEvents = function (count, df, dt) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/dashboard/cpt/top/event/" + count + "/" + df + "/" + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }



    ////////////////////
    var _getEventsDaily = function (df, dt) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/dashboard/all/events/" + df + "/" + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }



    //////////////
    var _getCptMonthly = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/dashboard/cpt/monthly/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getCptMonthly2 = function (year, month, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/cpt/monthly/" + year + "/" + month + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }
    ////////////
    var _getCptEventsMonthly = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/dashboard/cpt/events/monthly/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getCptEventsMonthly = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/dashboard/cpt/events/monthly2/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }



    var _getCptEventsMonthly2 = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/dashboard/cpt/events/monthly2/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    /////////////
    var _getCptFoEventsMonthly = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/cpt/fo/events/monthly/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getCptFoEventsMonthly2 = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/cpt/fo/events/monthly2/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    ///////////
    var _getCptIpEventsMonthly = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/cpt/ip/events/monthly/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getCptIpEventsMonthly2 = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/cpt/ip/events/monthly2/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }


    ////////////////
    var _getIpCptEventsMonthly = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/ip/cpt/events/monthly/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getIpCptEventsMonthly2 = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/ip/cpt/events/monthly2/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    //var _getCptFoEventsDaily = function (df, dt, id) {
    //    var deferred = $q.defer();
    //    $http.get(apiFdm + "api/fdm/cpt/fo/events/daily/" + df + "/" + dt + "/" + id).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {
    //        // deferred.reject(Exeptions.getMessage(err));
    //    });

    //    return deferred.promise;
    //}


    //var _getCptIpEventsDaily = function (df, dt, id) {
    //    var deferred = $q.defer();
    //    $http.get(apiFdm + "api/fdm/cpt/ip/events/daily/" + df + "/" + dt + "/" + id).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {
    //        // deferred.reject(Exeptions.getMessage(err));
    //    });

    //    return deferred.promise;
    //}

    //var _getIpCptEventsDaily = function (df, dt, id) {
    //    var deferred = $q.defer();
    //    $http.get(apiFdm + "api/fdm/ip/cpt/events/daily/" + df + "/" + dt + "/" + id).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {
    //        // deferred.reject(Exeptions.getMessage(err));
    //    });

    //    return deferred.promise;
    //}

    //var _getFoEventsDaily = function (df, dt, id) {
    //    var deferred = $q.defer();
    //    $http.get(apiFdm + "api/fdm/dashboard/fo/events/" + df + "/" + dt + "/" + id).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {
    //        // deferred.reject(Exeptions.getMessage(err));
    //    });

    //    return deferred.promise;
    //}

    //var _getCptEventNotResponsibleMonthly = function (id, monthf, montht, year) {
    //    var deferred = $q.defer();
    //    $http.get(apiFdm + "api/fdm/cpt/event/notresponsilbe/" + id + "/" + monthf + "/" + montht + "/" + year).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {
    //        // deferred.reject(Exeptions.getMessage(err));
    //    });

    //    return deferred.promise;
    //}

    ///////////////
    var _getCptRegEventsMonthly = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/cpt/events/register/monthly/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getCptRegEventsMonthly2 = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/cpt/events/register/monthly2/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }
    //////////////
    var _getFoEventsMonthly = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/dashboard/fo/events/monthly/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getFoEventsMonthly2 = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/dashboard/fo/events/monthly2/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }


    ////////////////
    var _getRegEventsMonthly = function (ymf, ymt, id) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/register/events/monthly/" + ymf + "/" + ymt + "/" + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }


    //var _getAllFDM = function (p1id, regId, typeId, df, dt) {
    //    var deferred = $q.defer();
    //    $http.get(apiFdm + "api/fdm/events/" + p1id + "/" + regId + "/" + typeId + "/" + df + "/" + dt).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {
    //        // deferred.reject(Exeptions.getMessage(err));
    //    });

    //    return deferred.promise;
    //}

    var _getCptFDMInfo = function (df, dt, crewId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/get/cpt/fdm/info/" + df + "/" + dt + "/" + crewId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getCptAirport = function (yf, yt, mf, mt, crewId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/get/airport/cpt/" + yf + "/" + yt + "/" + mf + "/" + mt + "/" + crewId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    //var _getFDMFoDaily = function (p2id, df, dt) {
    //    var deferred = $q.defer();
    //    $http.get(apiFdm + "api/fdm/fo/daily/" + p2id + "/" + df + "/" + dt).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {
    //        // deferred.reject(Exeptions.getMessage(err));
    //    });

    //    return deferred.promise;
    //}

    /////////////
    var _getFDMFoMonthly = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/fo/monthly/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getFDMFoMonthly2 = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/fo/monthly2/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    //var _getFDMFoReg = function (p2id, df, dt) {
    //    var deferred = $q.defer();
    //    $http.get(apiFdm + "api/fdm/fo/register/" + p2id + "/" + df + "/" + dt).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {
    //        // deferred.reject(Exeptions.getMessage(err));
    //    });

    //    return deferred.promise;
    //}

    //////////////
    var _getFDMFoRegMonthly = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/fo/register/monthly/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getFDMFoRegMonthly2 = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/fo/register/monthly2/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }
    //var _getFDMRegDaily = function (df, dt, reg) {
    //    var deferred = $q.defer();
    //    $http.get(apiFdm + "api/fdm/register/daily/" + df + "/" + dt + "/" + reg).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {
    //        // deferred.reject(Exeptions.getMessage(err));
    //    });

    //    return deferred.promise;
    //}

    ///////////////
    var _getFDMRegMonthly = function (ymf, ymt, reg) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/register/monthly/" + ymf + "/" + ymt + "/" + reg).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getEvetnByRegMonthly = function (yf, mf) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/register/monthly/" + yf + "/" + mf).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    //var _getFDMRegCptDaily = function (df, dt, reg) {
    //    var deferred = $q.defer();
    //    $http.get(apiFdm + "api/fdm/register/cpt/daily/" + df + "/" + dt + "/" + reg).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {
    //        // deferred.reject(Exeptions.getMessage(err));
    //    });

    //    return deferred.promise;
    //}

    ////////////////////
    var _getFDMRegCptMonthly = function (ymf, ymt, reg) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/register/cpt/monthly/" + ymf + "/" + ymt + "/" + reg).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    //var _getRegEventsDaily = function (df, dt, reg) {
    //    var deferred = $q.defer();
    //    $http.get(apiFdm + "api/fdm/register/events/daily/" + df + "/" + dt + "/" + reg).then(function (response) {
    //        deferred.resolve(response.data);
    //    }, function (err, status) {
    //        // deferred.reject(Exeptions.getMessage(err));
    //    });

    //    return deferred.promise;
    //}


    ///////////////
    var _getAllCptMonthly = function (yf, yt, mf, mt) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/get/cpt/monthly/" + yf + "/" + yt + "/" + mf + "/" + mt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }


    //////////////
    var _getCptPhaseMonthly = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/get/cpt/phase/monthly/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getCptPhaseMonthly2 = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/get/cpt/phase/monthly2/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getCptTotal = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/get/total/cpt/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    var _getFoTotal = function (ymf, ymt, cptId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/get/total/fo/" + ymf + "/" + ymt + "/" + cptId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    ///////////////
    var _deleteFDM = function (rowId) {
        var deferred = $q.defer();
        $http.post(apiFdm + "api/delete/fdm/" + rowId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }

    ////////////////////
    var _FDMStatus = function (rowId, status, usr) {
        var deferred = $q.defer();
        $http.post(apiFdm + "api/status/fdm/" + rowId + "/" + status + "/" + usr).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }


    //////////////
    var _confirmFDM = function (rowId) {
        var deferred = $q.defer();
        $http.post(apiFdm + "api/confirm/fdm/" + rowId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));
        });

        return deferred.promise;
    }


    ///////////////
    var _fdmDashboardMonthly = function (year, month) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/dashboard/monthly/" + year + "/" + month ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));

        });
        return deferred.promise;
    }

    //////////////
    var _DeleteEvent = function (id) {
        var deferred = $q.defer();
        $http.get(apiFdm + "/api/fdm/delete/event/" + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            // deferred.reject(Exeptions.getMessage(err));

        });
        return deferred.promise;
    }

    ///////////////
    var _cptRoute = function (ymf, ymt, crewId) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/cpt/route/" + ymf + "/" + ymt + "/" + crewId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

        });
        return deferred.promise;
    }

    var _FDMRoute = function (ymf, ymt) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/route/" + ymf + "/" + ymt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

        });
        return deferred.promise;
    }


    var _lockMDFDM = function (year, month, usr) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/lock/md/" + year + "/" + month + "/" + usr).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

        });
        return deferred.promise;
    }

    var _lockBoeingFDM = function (year, month, usr) {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/lock/boeing/" + year + "/" + month + "/" + usr).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

        });
        return deferred.promise;
    }
    var _FDMAVG = function () {
        var deferred = $q.defer();
        $http.get(apiFdm + "api/fdm/avg").then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

        });
        return deferred.promise;
    }



    //serviceFactory.getAllFDM = _getAllFDM;
    serviceFactory.getFdm = _getFdm;
    //serviceFactory.getFdmIncidentType = _getFdmIncidentType;
    serviceFactory.getFdmEventsName = _getFdmEventsName;
    serviceFactory.getFdmRegisterEvent = _getFdmRegisterEvent;
    //serviceFactory.getCptScores = _getCptScores;
    //serviceFactory.getCptLastScores = _getCptLastScores;
    serviceFactory.getTopCptEvents = _getTopCptEvents;
    //serviceFactory.getLastCptEvents = _getLastCptEvents;
    serviceFactory.getEventsDaily = _getEventsDaily;
    //serviceFactory.getCptDaily = _getCptDaily;
    //serviceFactory.getCptEvents = _getCptEvents;
    //serviceFactory.getCptFoEvents = _getCptFoEvents;
    //serviceFactory.getRegCptEvents = _getRegCptEvents;
    serviceFactory.getCptMonthly = _getCptMonthly;
    serviceFactory.getCptFoEventsMonthly = _getCptFoEventsMonthly;
    serviceFactory.getCptRegEventsMonthly = _getCptRegEventsMonthly;
    //serviceFactory.getFDMFoDaily = _getFDMFoDaily;
    serviceFactory.getFDMFoMonthly = _getFDMFoMonthly;
    //serviceFactory.getFDMFoReg = _getFDMFoReg;
    serviceFactory.getFDMFoRegMonthly = _getFDMFoRegMonthly;
    //serviceFactory.getCptEventNotResponsibleMonthly = _getCptEventNotResponsibleMonthly;
    //serviceFactory.getCptFoEventsDaily = _getCptFoEventsDaily;
    serviceFactory.getCptIpEventsMonthly = _getCptIpEventsMonthly;
    //serviceFactory.getCptIpEventsDaily = _getCptIpEventsDaily;
    //serviceFactory.getFDMRegDaily = _getFDMRegDaily;
    serviceFactory.getFDMRegMonthly = _getFDMRegMonthly;
    serviceFactory.getEvetnByRegMonthly = _getEvetnByRegMonthly;
    //serviceFactory.getFDMRegCptDaily = _getFDMRegCptDaily;
    serviceFactory.getFDMRegCptMonthly = _getFDMRegCptMonthly;
    serviceFactory.getCptEventsMonthly = _getCptEventsMonthly;
    serviceFactory.getFoEventsMonthly = _getFoEventsMonthly;
    //serviceFactory.getFoEventsDaily = _getFoEventsDaily;
    serviceFactory.getRegEventsMonthly = _getRegEventsMonthly;
    //serviceFactory.getRegEventsDaily = _getRegEventsDaily;
    serviceFactory.getIpCptEventsMonthly = _getIpCptEventsMonthly;
    //serviceFactory.getIpCptEventsDaily = _getIpCptEventsDaily;
    serviceFactory.getAllCptMonthly = _getAllCptMonthly;
    serviceFactory.getCptPhaseMonthly = _getCptPhaseMonthly;
    serviceFactory.getCptFDMInfo = _getCptFDMInfo;
    serviceFactory.getTopCpt = _getTopCpt;
    serviceFactory.compareTopCpt = _compareTopCpt;
    serviceFactory.compareTopRegister = _compareTopRegister;

    serviceFactory.getTopCptByMonth = _getTopCptByMonth;
    //serviceFactory.getAllCpt = _getAllCpt;
    serviceFactory.deleteFDM = _deleteFDM;
    serviceFactory.FDMStatus = _FDMStatus;
    serviceFactory.confirmFDM = _confirmFDM;
    serviceFactory.DeleteEvent = _DeleteEvent;
    serviceFactory.fdmDashboardMonthly = _fdmDashboardMonthly;
    serviceFactory.makeVisible = _makeVisible;
    serviceFactory.cptRoute = _cptRoute;
    serviceFactory.FDMRoute = _FDMRoute;
    serviceFactory.lockMDFDM = _lockMDFDM;
    serviceFactory.lockBoeingFDM = _lockBoeingFDM;
    serviceFactory.FDMAVG = _FDMAVG;

    serviceFactory.getCptEventsMonthly2 = _getCptEventsMonthly2;
    serviceFactory.getCptFoEventsMonthly2 = _getCptFoEventsMonthly2;
    serviceFactory.getCptIpEventsMonthly2 = _getCptIpEventsMonthly2;
    serviceFactory.getCptMonthly2 = _getCptMonthly2;
    serviceFactory.getIpCptEventsMonthly2 = _getIpCptEventsMonthly2;
    serviceFactory.getCptRegEventsMonthly2 = _getCptRegEventsMonthly2;
    serviceFactory.getCptPhaseMonthly2 = _getCptPhaseMonthly2;
    serviceFactory.getTopCpt2 = _getTopCpt2;
    serviceFactory.getCptTotal = _getCptTotal;
    serviceFactory.getFoTotal = _getFoTotal;
    serviceFactory.getFDMFoRegMonthly2 = _getFDMFoRegMonthly2;
    serviceFactory.getFDMFoMonthly2 = _getFDMFoMonthly2;
    serviceFactory.getFoEventsMonthly2 = _getFoEventsMonthly2;
    serviceFactory.getCptAirport = _getCptAirport;


    return serviceFactory;

}]);