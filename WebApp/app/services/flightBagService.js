'use strict';
app.factory('flightBagService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {
    var serviceFactory = {};

    //"odata/fdp/crew/dates"
    var _getCrewFDPs = function (id, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase2 + 'odata/fdp/crew/dates/' + id + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewFDPsDuties = function (id, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase2 + 'odata/duties/crew/dates/' + id + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewFDPsFlights = function (id, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase2 + 'odata/flights/crew/dates/' + id + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewFDPsFTL = function (id, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase2 + 'odata/ftl/crew/dates/' + id + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewFDP = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/fdp/crew/single/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getCrewFlights = function (id, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase2 + 'odata/crew/flights/app/' + id + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    //[Route("odata/crew/flights/crew/fdp/{crewid}/{fdpid}")]
    var _getCrewFlightsByFDP = function (cid, fid) {

        var deferred = $q.defer();
        $http.get(serviceBase2 + 'odata/crew/flights/crew/fdp/' + cid + '/' + fid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewFlightsReport = function (id, df, dt, airline, fromapt, toapt, status) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        //public async Task<IHttpActionResult> GetCrewFlightsReportApp2(DateTime from, DateTime to, int id,int? airline=null,int? status=null,int? fromAirport=null,int? toAirport=null)
        var deferred = $q.defer();
        var url = serviceBase2 + 'odata/crew/report/flights/app2/' + id + '?from=' + _df + '&to=' + _dt;
        if (airline)
            url += '&airline=' + airline;
        if (status)
            url += '&status=' + status;
        if (fromapt)
            url += '&fromAirport=' + fromapt;
        if (toapt)
            url += '&toAirport=' + toapt;
        $http.get(url).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewFlightsGrouped = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase2 + 'odata/crew/report/flights/app/grouped/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlightCrews = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase2 + 'odata/flight/crews/new/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveFDP = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/cp/fdp/create', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveDuty = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/cp/duty/create', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _addFlightToFDP = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/cp/fdp/flight/add', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _updateCPFDP = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/cp/fdp/update', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _updateFlightFDP = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/cp/fdp/flight/update', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _updateFlightFDPDirect = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/cp/fdp/flight/update/direct', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _removeFlightFromFDP = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/cp/fdp/flight/remove', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _updateFlightStatus = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/cp/fdp/flight/status', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _updateFDPTimes = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/cp/fdp/rt', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getFlight = function (id) {
        var offset = -1 * (new Date()).getTimezoneOffset();
        var url = serviceBase2 + 'odata/cp/flight/' + id + '/' + offset;

        var deferred = $q.defer();
        $http.get(url).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getSun = function () {
        var offset = -1 * (new Date()).getTimezoneOffset();
        var url = 'https://api.sunrise-sunset.org/json?lat=35.715298&lng=51.404343';

        var deferred = $q.defer();
        $http.get(url).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getSunFlight = function (df, dt, fid, tid) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        //public async Task<IHttpActionResult> GetCrewFlightsReportApp2(DateTime from, DateTime to, int id,int? airline=null,int? status=null,int? fromAirport=null,int? toAirport=null)
        var deferred = $q.defer();
        var url = serviceBase2 + 'odata/time/sunflight/' + '?dep=' + _df + '&arr=' + _dt + '&fid=' + fid + '&tid=' + tid;
        //public async Task<IHttpActionResult> GetSunFlight (DateTime dep, DateTime arr,string fid,string tid)
        $http.get(url).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    ///////////////////////////////

    var _epGetCrewFlights = function (df, dt) {

        var deferred = $q.defer();
        if ($rootScope.online) {
            $http.get($rootScope.apiUrl + 'crew/flights/' + df + '/' + dt /*+ '?from=' + _df + '&to=' + _dt*/).then(function (response) {


                if ($rootScope.isServerMode)
                    deferred.resolve(response.data);
                else if (response.data.IsSuccess)
                    db.sync.SyncAppCrewFlightsByDateRange(df, dt, response.data.Data, function (syncResult) {


                        deferred.resolve(syncResult);
                    });
                // deferred.resolve(response.data);



            }, function (err, status) {

                deferred.reject(Exceptions.getMessage(err));
            });
        }
        else if (!$rootScope.isServerMode) {
            db.GetAppCrewFlightsByDates(df, dt, function (results) {

                var response = {};
                response.Data = results;
                response.IsSuccess = 1;
                console.log('fetch offline-flights', response);
                deferred.resolve(response);
            });
        }
        else {
            deferred.resolve({ Data: [], IsSuccess: 0 });
        }


        return deferred.promise;





    };

    var _epGetCrewCalendar = function (cid, from, to) {

        var deferred = $q.defer();
        if ($rootScope.online) {
            $http.get($rootScope.apiUrl + 'crew/calendar/' + cid + '/' + from + '/' + to /*+ '?from=' + _df + '&to=' + _dt*/).then(function (response) {
                //alert('y');

                if ($rootScope.isServerMode)
                    deferred.resolve(response.data);
                else if (response.data.IsSuccess)
                    db.sync.SyncCalendar(from, to, response.data.Data, function (syncResult) {

                        deferred.resolve(syncResult);
                    });



            }, function (err, status) {

                deferred.reject(Exceptions.getMessage(err));
            });
        }
        else if (!$rootScope.isServerMode) {
            db.GetCalendar(from, to, function (results) {
                console.log('fetch offline');
                var response = {};
                response.Data = results;
                response.IsSuccess = 1;
                deferred.resolve(response);
            });
        }
        else {
            deferred.resolve({ Data: [], IsSuccess: 0 });
        }


        return deferred.promise;





    };

    var _epGetCrewDuties = function (cid, from, to) {

        var deferred = $q.defer();
        if ($rootScope.online) {
            $http.get($rootScope.apiUrl + 'crew/duties/' + cid + '/' + from + '/' + to + '/1' /*+ '?from=' + _df + '&to=' + _dt*/).then(function (response) {
                //alert('y');

                if ($rootScope.isServerMode)
                    deferred.resolve(response.data);
                else if (response.data.IsSuccess)
                    db.sync.SyncDuties(from, to, response.data.Data, function (syncResult) {

                        deferred.resolve(syncResult);
                    });



            }, function (err, status) {

                deferred.reject(Exceptions.getMessage(err));
            });
        }
        else if (!$rootScope.isServerMode) {
            db.GetDuties(from, to, function (results) {
                console.log('fetch offline');
                var response = {};
                response.Data = results;
                response.IsSuccess = 1;
                deferred.resolve(response);
            });
        }
        else {
            deferred.resolve({ Data: [], IsSuccess: 0 });
        }


        return deferred.promise;





    };

    var _epGetFlightCommanders = function (flightId) {
        var deferred = $q.defer();
        $http.get($rootScope.apiUrl + 'flight/commanders/' + flightId).then(function (response) {

            deferred.resolve(response.data);


        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });
        return deferred.promise;
    };
    var _epGetFlightCrews = function (flightId) {
        //db.sync.SyncFlightCrews
        var deferred = $q.defer();
        //$http.get($rootScope.apiUrl + 'flight/crews/' + flightId ).then(function (response) {
        //    deferred.resolve(response.data);
        //}, function (err, status) {

        //    deferred.reject(Exceptions.getMessage(err));
        //});

        if ($rootScope.online) {
            $http.get($rootScope.apiUrl + 'flight/crews/' + flightId).then(function (response) {
                if ($rootScope.isServerMode)
                    deferred.resolve(response.data);
                else if (response.data.IsSuccess)
                    db.sync.SyncFlightCrews(flightId, response.data.Data, function (syncResult) {

                        deferred.resolve(syncResult);
                    });



            }, function (err, status) {

                deferred.reject(Exceptions.getMessage(err));
            });
        }
        else if (!$rootScope.isServerMode) {
            db.GetFlightCrews(flightId, function (results) {
                console.log('_epGetFlightCrews', 'fetch offline');
                var response = {};
                response.Data = results;
                response.IsSuccess = 1;
                deferred.resolve(response);
            });
        }
        else {
            deferred.resolve({ Data: [], IsSuccess: 0 });
        }

        return deferred.promise;
    };

   
    var _epGetFlightLocal = function (flightId) {

        var deferred = $q.defer();
        db.GetAppFlightCrew(flightId).then(function (flt) {
            var data = {};
            data.IsSuccess = 0;
            if (flt)
                data.IsSuccess = 1;
            data.Data = flt;

            deferred.resolve(data);
        });


        return deferred.promise;
    };

    var _calculateFlight = function (flt) {
        flt.BlockTime = null;
        flt.FlightTime = null;
        flt.DelayBlockOff = null;
        if (flt.BlockOff && flt.BlockOn)
            flt.BlockTime = getMinutesDiff(flt.BlockOff, flt.BlockOn);
        if (flt.TakeOff && flt.Landing)
            flt.FlightTime = getMinutesDiff(flt.TakeOff, flt.Landing);
        if (flt.BlockOff)
            flt.DelayBlockOff = getMinutesDiff(flt.STD, flt.BlockOff);

    };
    var _epGetFlightDelays = function (flightId) {

        var deferred = $q.defer();
        $http.get($rootScope.apiUrl + 'flight/delays/' + flightId /*+ '?from=' + _df + '&to=' + _dt*/).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _epSaveLogOverwriteServer = function (entity) {
        var deferred = $q.defer();
        var changes = {

            JLDate: momentFromatLocalUTC(entity.JLDate),
            JLUserId: $rootScope.employeeId,
            IsSynced: 1,
        };
        if ($rootScope.getOnlineStatus()) {
            $http.post($rootScope.apiUrl + 'flight/log/save', entity).then(function (response) {
                changes.JLDate = momentFromatLocalUTC(response.data.Data);
                // alert(entity.FlightId);

                db.Update('AppCrewFlights', entity.FlightId, changes, function (row2) {
                    deferred.resolve({ Data: row2, IsSuccess: 1 });
                });

            }, function (err, status) {
                deferred.resolve({ Data: err, IsSuccess: 0 });

            });
        }
        else {
            deferred.resolve({ Data: 'Operation Failed. Check your Network Connection.', IsSuccess: 0 });
        }

        return deferred.promise;


    };
    var _signDoc = function (entity) {
        var deferred = $q.defer();

        $http.post($rootScope.apiUrl + 'flight/sign', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _signDocLocal = function (entity, doc) {
        var deferred = $q.defer();
        var table = '';
        var fid = entity.FlightId;
        switch (doc) {
            case 'log':
                table = 'AppCrewFlights';
                fid = entity.ID;
                break;
            case 'vr':
                table = 'VR';
                break;
            case 'dr':
                table = 'DR';
                break;
            case 'asr':
                table = 'ASR';
                break;
            case 'ofp':
                table = 'OFP';
                break;
            default:
                deferred.reject('wrong document type');
                return;
        }
        var _db = db.getDb();
        _db[table]
            .filter(function (rec) {

                return rec.FlightId == fid
            }).first(function (item) {
                if (!item) {
                    deferred.reject('no record found');
                    return;
                }

                item.PICId = entity.PICId;
                item.PIC = entity.PIC;
                item.JLSignedBy = entity.JLSignedBy;
                item.JLDatePICApproved = entity.JLDatePICApproved;
                _db[table].put(item).then(
                    function (suc) { deferred.resolve(suc); },
                    function (err) { deferred.reject('update failed'); }
                );

            });



        return deferred.promise;
    };
    var _epSaveLog = function (entity) {
        var deferred = $q.defer();
        var changes = {
            //BlockOff: toIsoDateTime(entity.BlockOff),
            //BlockOn: toIsoDateTime(entity.BlockOn),
            //TakeOff: toIsoDateTime(entity.TakeOff),
            //Landing: toIsoDateTime(entity.Landing),
            BlockOff: momentFromatLocalUTC(entity.BlockOffDate),
            BlockOn: momentFromatLocalUTC(entity.BlockOnDate),
            TakeOff: momentFromatLocalUTC(entity.TakeOffDate),
            Landing: momentFromatLocalUTC(entity.LandingDate),

            FuelRemaining: entity.FuelRemaining,
            FuelUplift: entity.FuelUplift,
            FuelUsed: entity.FuelUsed,
            FuelDensity: entity.FuelDensity,
            FuelTotal: entity.FuelTotal,

            PaxAdult: entity.PaxAdult,
            PaxChild: entity.PaxChild,
            PaxInfant: entity.PaxInfant,
            PaxTotal: entity.PaxTotal,

            BaggageWeight: entity.BaggageWeight,
            CargoWeight: entity.CargoWeight,

            SerialNo: entity.SerialNo,
            LTR: entity.LTR,
            PF: entity.PF,

            RVSM_GND_CPT: entity.RVSM_GND_CPT,
            RVSM_GND_STBY: entity.RVSM_GND_STBY,
            RVSM_GND_FO: entity.RVSM_GND_FO,

            RVSM_FLT_CPT: entity.RVSM_FLT_CPT,
            RVSM_FLT_STBY: entity.RVSM_FLT_STBY,
            RVSM_FLT_FO: entity.RVSM_FLT_FO,

            CommanderNote: entity.CommanderNote,

            AttRepositioning1: entity.AttRepositioning1,
            AttRepositioning2: entity.AttRepositioning2,

            Version: entity.Version,
            JLDate: momentFromatLocalUTC(entity.JLDate),

            DelayBlockOff: entity.DelayBlockOff,
            BlockTime: entity.BlockTime,
            FlightTime: entity.FlightTime,
            IsSynced: 1,

            JLUserId: $rootScope.employeeId,
        };
        //var row = db.Update('AppCrewFlights', entity.FlightId, changes, function () { });
        //console.log('row',row);
        db.Update('AppCrewFlights', entity.FlightId, changes, function (row) {
            // _calculateFlight(row);

            if ($rootScope.getOnlineStatus() && entity.Server) {
                $http.post($rootScope.apiUrl + 'flight/log/save', entity).then(function (response) {

                    var dateChanges = { JLDate: momentFromatLocalUTC(response.data.Data) };
                    db.Update('AppCrewFlights', entity.FlightId, dateChanges, function (row2) {
                        deferred.resolve({ Data: row2, IsSuccess: 1 });
                    });

                }, function (err, status) {
                    //desynced
                    row.IsSynced = 0;
                    db.deSyncedItem('AppCrewFlights', entity.FlightId, function () {
                        deferred.resolve({ Data: row, IsSuccess: 1 });
                    });

                });
            }
            else {
                //desynced
                row.IsSynced = 0;
                db.deSyncedItem('AppCrewFlights', entity.FlightId, function () {
                    deferred.resolve({ Data: row, IsSuccess: 1 });
                });

            }
        });





        return deferred.promise;
    };

    var _epSyncFlight = function (entity) {
        entity.IsSynced = 1;
        var deferred = $q.defer();
        entity.JLDate = momentFromatLocalUTC(entity.JLDate);
        db.sync.SyncCrewFlight(entity, function (row) {
            deferred.resolve({ Data: row, IsSuccess: 1 });
        });
        return deferred.promise;
    };

    var _updateTAFs = function (fdpId) {
        var deferred = $q.defer();
        $http.get($rootScope.apiUrlExt + 'weather/taf/adds/FDP/' + fdpId).then(function (response) {
            if (!response.data.IsSuccess) { deferred.reject("TAF ERROR"); alert('error2'); }
            db.sync.SyncTAF(fdpId, response.data.Data, function (dbData) {
                deferred.resolve(dbData);
            });

        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });
        return deferred.promise;
    };
    var _updateMETARs = function (fdpId) {
        var deferred = $q.defer();
        $http.get($rootScope.apiUrlExt + 'weather/metar/adds/FDP/' + fdpId).then(function (response) {
            if (!response.data.IsSuccess)
                deferred.reject("METAR ERROR");
            db.sync.SyncMETAR(fdpId, response.data.Data, function (dbData) {
                deferred.resolve(dbData);
            });

        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });
        return deferred.promise;
    };
    var _updateNOTAMs = function (fdpId) {
        var deferred = $q.defer();
        $http.get($rootScope.apiUrlExt + 'airport/notam/FDP/' + fdpId).then(function (response) {
            if (!response.data.IsSuccess)
                deferred.reject("NOTAM ERROR");
            db.sync.SyncNOTAM(fdpId, response.data.Data, function (dbData) {
                deferred.resolve(dbData);
            });

        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });
        return deferred.promise;
    };
    var _getTAFs = function (fdpId, flag) {
        var deferred = $q.defer();
        db.GetTAFs(fdpId, function (data) {

            var result = { IsSuccess: 1, Data: data };
            if ((!data || data.length == 0) && flag) {
                result.IsSuccess = 0;

                if ($rootScope.getOnlineStatus()) {
                    $http.get($rootScope.apiUrlExt + 'weather/taf/adds/FDP/' + fdpId).then(function (response) {
                        if (!response.data.IsSuccess) { deferred.reject("TAF ERROR"); alert('error2'); }
                        db.sync.SyncTAF(fdpId, response.data.Data, function (dbData) {
                            deferred.resolve(dbData);
                        });

                    }, function (err, status) {

                        deferred.reject(Exceptions.getMessage(err));
                    });
                }
                else
                    deferred.resolve(result);



            }
            else {

                deferred.resolve(result);
            }

        });
        return deferred.promise;

    };


    var _getMETARs = function (fdpId, flag) {
        var deferred = $q.defer();
        db.GetMETARs(fdpId, function (data) {
            var result = { IsSuccess: 1, Data: data };
            if ((!data || data.length == 0) && flag) {
                result.IsSuccess = 0;

                if ($rootScope.getOnlineStatus()) {
                    $http.get($rootScope.apiUrlExt + 'weather/metar/adds/FDP/' + fdpId).then(function (response) {
                        if (!response.data.IsSuccess)
                            deferred.reject("METAR ERROR");
                        db.sync.SyncMETAR(fdpId, response.data.Data, function (dbData) {
                            deferred.resolve(dbData);
                        });

                    }, function (err, status) {

                        deferred.reject(Exceptions.getMessage(err));
                    });
                }
                else
                    deferred.resolve(result);


            }
            else {

                deferred.resolve(result);
            }

        });
        return deferred.promise;
        //var deferred = $q.defer();
        //$http.get($rootScope.apiUrl + 'weather/metar/adds/FDP/' + fdpId).then(function (response) {
        //    if (!response.data.IsSuccess)
        //        deferred.reject("METAR ERROR");
        //    db.sync.SyncMETAR(fdpId, response.data.Data, function (dbData) {
        //        deferred.resolve(dbData);
        //    });

        //}, function (err, status) {

        //    deferred.reject(Exceptions.getMessage(err));
        //});

        //return deferred.promise;
    };


    var _getNOTAMs = function (fdpId, flag) {
        var deferred = $q.defer();
        db.GetNOTAMs(fdpId, function (data) {
            var result = { IsSuccess: 1, Data: data };
            if ((!data || data.length == 0) && flag) {
                result.IsSuccess = 0;

                if ($rootScope.getOnlineStatus()) {
                    $http.get($rootScope.apiUrlExt + 'airport/notam/FDP/' + fdpId).then(function (response) {
                        if (!response.data.IsSuccess)
                            deferred.reject("NOTAM ERROR");
                        db.sync.SyncNOTAM(fdpId, response.data.Data, function (dbData) {
                            deferred.resolve(dbData);
                        });

                    }, function (err, status) {

                        deferred.reject(Exceptions.getMessage(err));
                    });
                }
                else
                    deferred.resolve(result);



            }
            else {

                deferred.resolve(result);
            }

        });
        return deferred.promise;
        //var deferred = $q.defer();


        //return deferred.promise;
    };

    var _epReplaceASR = function (item) {
        var deferred = $q.defer();
        //db.Clear("ASR", function () {
        db.DeleteAsr(item.FlightId, function () {
            item.IsSynced = 1;
            item.Alert = null;
            item.server = null;
            db.Put('ASR', item.Id, item, function (dbitem) {
                deferred.resolve(dbitem);
            });
        });
        return deferred.promise;
    };
    var _epReplaceDR = function (item) {
        var deferred = $q.defer();
        //db.Clear("ASR", function () {
        db.DeleteDr(item.FlightId, function () {
            item.IsSynced = 1;
            item.Alert = null;
            item.server = null;
            db.Put('DR', item.Id, item, function (dbitem) {
                deferred.resolve(dbitem);
            });
        });
        return deferred.promise;
    };
    var _epReplaceOFP = function (item) {
        var deferred = $q.defer();
        //db.Clear("ASR", function () {
        db.DeleteOFP(item.FlightId, function () {
            item.IsSynced = 1;
            item.Alert = null;
            item.server = null;
            db.Put('OFP', item.Id, item, function (dbitem) {
                deferred.resolve(dbitem);
            });
        });
        return deferred.promise;
    };
    var _epReplaceOFPProp = function (item) {
        var deferred = $q.defer();

        db.DeleteOFPPropById(item.Id, function () {
            item.IsSynced = 1;

            db.PutOFPPropById(item.Id, item, function (dbitem) {
                deferred.resolve(dbitem);
            });
        });
        return deferred.promise;
    };
    var _epGetASRByFlight = function (flightId) {
        var deferred = $q.defer();


        $http.get(serviceBaseAPI + 'api/asr/flight/' + flightId /*+ '?from=' + _df + '&to=' + _dt*/).then(function (response) {
            deferred.resolve(response.data)
        });


        return deferred.promise;
    };
    var _epGetFlight = function (flightId) {

        var deferred = $q.defer();
        $http.get(serviceBase2 + 'api/flight/' + flightId).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _epGetASRByFlight2 = function (flightId) {
        var deferred = $q.defer();
        db.GetASRsByFlightId(flightId, function (_dbitem) {
            var dbitem = _dbitem && _dbitem.length > 0 ? _dbitem[0] : null;
            console.log('asr get bd', dbitem);
            if ((dbitem && dbitem.IsSynced == 0) || !$rootScope.getOnlineStatus()) {
                var data = { IsSuccess: 1, Data: dbitem };
                console.log('asr local', data);
                deferred.resolve(data);
            }
            else {
                if ($rootScope.getOnlineStatus()) {
                    $http.get($rootScope.apiUrl + 'asr/flight/' + flightId /*+ '?from=' + _df + '&to=' + _dt*/).then(function (response) {
                        if (response.data.IsSuccess && response.data.Data) {
                            db.Clear("ASR", function () {
                                response.data.Data.IsSynced = 1;
                                db.Put('ASR', response.data.Data.Id, response.data.Data, function (dbitem) {
                                    deferred.resolve(response.data);
                                });
                            });
                        }
                        else
                            deferred.resolve(response.data);


                    }, function (err, status) {

                        deferred.reject(Exceptions.getMessage(err));
                    });
                }
                else {
                    var data = { IsSuccess: 1, Data: dbitem };
                    deferred.resolve(data);
                }

            }
        });



        return deferred.promise;
    };
    var momentUtcNowString = function () {
        return moment.utc().format('YYYYMMDDHHmm');
    };
    var _saveASR = function (entity) {
        var pk = entity.FlightId;
        var deferred = $q.defer();
        entity.IsSynced = 1;

        entity.DateUpdate = momentUtcNowString();
        db.Put('ASR', entity.FlightId, entity, function (row) {
            if ($rootScope.getOnlineStatus()) {
                entity.OccurrenceDate = moment(new Date(entity.OccurrenceDate)).format('YYYY-MM-DD-HH-mm');
                $http.post($rootScope.apiUrl + 'asr/save', entity).then(function (response) {
                    if (response.data.IsSuccess) {
                        //deferred.resolve(response.data);
                        var item = response.data.Data;
                        item.IsSynced = 1;
                        db.Delete('ASR', pk, function () {
                            db.Put('ASR', item.FlightId, item, function (dbitem) {
                                deferred.resolve({ Data: dbitem, IsSuccess: 1 });
                            });
                        });

                    }
                    else
                        deferred.resolve(response.data);

                }, function (err, status) {

                    deferred.reject(Exceptions.getMessage(err));
                });
            }
            else {
                row.IsSynced = 0;
                db.deSyncedItem('ASR', entity.FlightId, function () {
                    deferred.resolve({ Data: row, IsSuccess: 1 });
                });
            }
        });
        return deferred.promise;

        //var deferred = $q.defer();
        //$http.post($rootScope.apiUrl + 'asr/save', entity).then(function (response) {
        //    deferred.resolve(response.data);
        //}, function (err, status) {

        //    deferred.reject(Exceptions.getMessage(err));
        //});

        //return deferred.promise;
    };


     //2023-02-12
    var _saveDR = function (entity) {

        var deferred = $q.defer();
        $http.post(apiapsb + 'api/efb/dr/save', entity).then(function (response) {

            deferred.resolve(response.data);

        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });
        return deferred.promise;


    };
    //2023-02-12
    var _epGetDRByFlight = function (flightId) {
        var deferred = $q.defer();

        $http.get(apiapsb + 'api/efb/dr/' + flightId /*+ '?from=' + _df + '&to=' + _dt*/).then(function (response) {

            deferred.resolve(response.data);


        });
        return deferred.promise;

    };
    //2023-02-12
    var _saveATC = function (entity) {
        var deferred = $q.defer();
        $http.post(apiapsb + 'api/atc/text/input', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveATC = _saveATC;
    //2023-02-12
    var _getATC = function (id) {
        var deferred = $q.defer();
        $http.get(apiapsb + 'api/atc/text/get/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getATC = _getATC;
    //////////////////////////////////


    var _saveOFPProp = function (entity) {
        var pk = entity.OFPId;
        var deferred = $q.defer();
        entity.IsSynced = 1;

        db.GetOFPPropByName(entity.OFPId, entity.PropName, function (_result) {

            if (!_result) {
                deferred.reject("no property found in local db");
                return;
            }
            entity.Id = _result.Id;
            entity.DateUpdate = momentUtcNowString();
            db.PutOFPProp(entity.OFPId, entity.PropName, entity, function (row) {

                if ($rootScope.getOnlineStatus()) {

                    $http.post($rootScope.apiUrl + 'ofp/prop/save', entity).then(function (response) {
                        if (response.data.IsSuccess) {
                            //deferred.resolve(response.data);
                            var item = response.data.Data;
                            item.IsSynced = 1;
                            db.DeleteOFPProp(item.OFPId, item.PropName, function () {
                                db.PutOFPProp(item.OFPId, item.PropName, item, function (dbitem) {
                                    deferred.resolve({ Data: dbitem, IsSuccess: 1 });
                                });
                            });

                        }
                        else
                            deferred.resolve(response.data);

                    }, function (err, status) {

                        deferred.reject(Exceptions.getMessage(err));
                    });
                }
                else {

                    row.IsSynced = 0

                    db.deSyncedOFPProp(entity.OFPId, entity.PropName, function () {

                        deferred.resolve({ Data: row, IsSuccess: 1 });
                    });
                }
            });


        });



        return deferred.promise;


    };


    var _saveOFPPropBulk = function (objs) {
        var deferred = $q.defer();
        $.each(objs, function (_w, entity) {
            entity.IsSynced = 1;
            db.GetOFPPropByName(entity.OFPId, entity.PropName, function (_result) {

                if (!_result) {
                    deferred.reject("no property found in local db :" + entity.PropName);
                    return;
                }
                entity.Id = _result.Id;
                entity.DateUpdate = momentUtcNowString();
                db.PutOFPProp(entity.OFPId, entity.PropName, entity, function (row) {

                    if ($rootScope.getOnlineStatus()) {

                        $http.post($rootScope.apiUrl + 'ofp/prop/save', entity).then(function (response) {
                            if (response.data.IsSuccess) {
                                //deferred.resolve(response.data);
                                var item = response.data.Data;
                                item.IsSynced = 1;
                                db.DeleteOFPProp(item.OFPId, item.PropName, function () {
                                    db.PutOFPProp(item.OFPId, item.PropName, item, function (dbitem) {
                                        deferred.resolve({ Data: dbitem, IsSuccess: 1 });
                                    });
                                });

                            }
                            else
                                deferred.resolve(response.data);

                        }, function (err, status) {

                            deferred.reject(Exceptions.getMessage(err));
                        });
                    }
                    else {

                        row.IsSynced = 0

                        db.deSyncedOFPProp(entity.OFPId, entity.PropName, function () {

                            deferred.resolve({ Data: row, IsSuccess: 1 });
                        });
                    }
                });


            });
        });

        //var pk = entity.OFPId;

        //entity.IsSynced = 1;





        return deferred.promise;


    };
    ////////////////////////////////////////
    
    //gool
    var _epGetDRsByFlights = async function (dto) {
        var deferred = $q.defer();
        $http.post($rootScope.apiUrl + 'drs', dto).then(sr => {
            if (sr.data.IsSuccess) {
                var serverProps = sr.data.Data;
                var _db = db.getDb();
                _db.DR
                    .filter(function (asr) {

                        return dto.ids.indexOf(Number(asr.FlightId)) != -1;
                    }).toArray(function (localProps) {
                        var _deletedKeys = [];
                        var _putList = [];
                        $.each(serverProps, function (_i, serverProp) {

                            var localProp = Enumerable.From(localProps).Where('$.FlightId==' + serverProp.FlightId).FirstOrDefault();

                            var _localDate = localProp ? Number(localProp.DateUpdate) : -1;
                            var _serverDate = Number(serverProp.DateUpdate);
                            // if (serverProp.Id == 136) {
                            //alert('local: ' + _localDate + '   server:' + _serverDate);
                            // }
                            if (localProp && localProp.IsSynced == 0 && _localDate >= _serverDate) {

                            }
                            else if (_serverDate > _localDate) {
                                //if (serverProp.Id == 136) {
                                //alert('replace 136');
                                //}
                                serverProp.IsSynced = 1;
                                //_epReplaceOFPProp(serverProp).then(rp => { });
                                _deletedKeys.push(serverProp.Id);
                                _putList.push(serverProp);
                            }

                        });

                        if (_deletedKeys.length > 0)
                            db.DeleteDrByIds(_deletedKeys, function () {
                                _db.DR.bulkPut(_putList).then(bpres => { });
                            });
                        deferred.resolve(sr.data);
                    });
                //////////////////////////////
            }
            else {
                deferred.reject('error in getting drs from server');
            }
        });



        return deferred.promise;
    };
    var _epGetOFPByFlights = async function (dto) {
        var deferred = $q.defer();
        // var dto = { ids: flightIds };

        $http.post($rootScope.apiUrl + 'ofp/flights', dto).then(sr => {
            var serverOFPs = sr.data.Data.ofps;
            var serverProps = sr.data.Data.ofpProps;
            $.each(serverOFPs, function (_i, serverOFP) {
                db.DeleteOFP(serverOFP.FlightId, function () {

                    serverOFP.IsSynced = 1;
                    db.Put('OFP', serverOFP.FlightId, serverOFP, function (dbitem) {
                        //deferred.resolve(response.data);
                    });



                });


            });

            ////PROPS
            var pids = Enumerable.From(serverProps).Select('Number($.Id)').ToArray();
            console.log('PROP IDS:', pids);
            var _db = db.getDb();
            _db.OFPProp
                .filter(function (asr) {

                    return pids.indexOf(Number(asr.Id)) != -1;
                }).toArray(function (localProps) {
                    var _deletedKeys = [];
                    var _putList = [];
                    $.each(serverProps, function (_i, serverProp) {

                        var localProp = Enumerable.From(localProps).Where('$.Id==' + serverProp.Id).FirstOrDefault();

                        var _localDate = localProp ? Number(localProp.DateUpdate) : -1;
                        var _serverDate = Number(serverProp.DateUpdate);
                        // if (serverProp.Id == 136) {
                        //alert('local: ' + _localDate + '   server:' + _serverDate);
                        // }
                        if (localProp && localProp.IsSynced == 0 && _localDate >= _serverDate) {

                        }
                        else if (_serverDate > _localDate) {
                            //if (serverProp.Id == 136) {
                            //alert('replace 136');
                            //}
                            serverProp.IsSynced = 1;
                            //_epReplaceOFPProp(serverProp).then(rp => { });
                            _deletedKeys.push(serverProp.Id);
                            _putList.push(serverProp);
                        }

                    });

                    if (_deletedKeys.length > 0)
                        db.DeleteOFPPropByIds(_deletedKeys, function () {
                            _db.OFPProp.bulkPut(_putList).then(bpres => { });
                        });
                    deferred.resolve(sr.data);
                });




        });
        return deferred.promise;
    };
    var _epGetOFPByFlight = function (flightId) {
        var deferred = $q.defer();


        $http.get(serviceBase2 + 'api/ofp/flight/' + flightId).then(function (response) {
            deferred.resolve(response.data);
        });



        //}
        //else {
        //    var data = { IsSuccess: 1, Data: dbitem };

        //    deferred.resolve(data);
        //}
        //});

        return deferred.promise;
    };
    var _epGetOFPProps = function (ofpId) {
        var deferred = $q.defer();
        $http.get(serviceBase2 + 'api/ofp/props/' + ofpId).then(function (response) {
            deferred.resolve(response.data);
        });
        return deferred.promise;
    };
     
    var _epGetOFPProps2 = function (ofpId) {
        var deferred = $q.defer();

        db.GetOFPProps(ofpId, function (_dbitem) {
            //var dbitem = _dbitem && _dbitem.length > 0 ? _dbitem[0] : null;
            if ($rootScope.getOnlineStatus()) {
                $http.get($rootScope.apiUrl + 'ofp/props/' + ofpId).then(function (response) {
                    if (response.data.IsSuccess && response.data.Data) {
                        //deferred.resolve({ IsSuccess: 1, Data: response.data.Data }); 
                        var dbRows = response.data.Data;

                        var output = [];
                        var upd = 1;

                        $.each(dbRows, function (_i, _dbRow) {
                            var localRow = Enumerable.From(_dbitem).Where('$.Id==' + _dbRow.Id).FirstOrDefault();
                            var _dbdate = !localRow ? 0 : Number(localRow.DateUpdate);
                            var _serverdate = Number(_dbRow.DateUpdate);
                            if (!localRow || _serverdate > _dbdate) {
                                _dbRow.IsSynced = 1;
                                output.push(_dbRow);
                                db.DeleteOFPPropById(_dbRow.Id, function () {


                                    db.PutOFPPropById(_dbRow.Id, _dbRow, function (row) {

                                        // output.push(row);
                                        upd++;
                                        //if (upd == dbRows.length)
                                        //   deferred.resolve({ IsSuccess: 1, Data: output });
                                    });

                                });
                            }

                            else if (localRow.IsSynced == 0 && _serverdate <= _dbdate) {


                                output.push(localRow);
                                // upd++;
                                //if (upd == dbRows.length)
                                //    deferred.resolve({ IsSuccess: 1, Data: output });
                            }
                            else {


                                output.push(localRow);
                                // upd++;
                                //if (upd == dbRows.length)
                                //    deferred.resolve({ IsSuccess: 1, Data: output });
                            }

                        });
                        deferred.resolve({ IsSuccess: 1, Data: output });
                    }
                    else
                        deferred.resolve({ IsSuccess: 1, Data: dbitem });


                });






            }
            else {
                var data = { IsSuccess: 1, Data: _dbitem };

                deferred.resolve(data);
            }
        });

        return deferred.promise;
    };
    ////////////////////////////////////////
    var _epReplaceVR = function (item) {
        var deferred = $q.defer();
        //db.Clear("VR", function () {
        db.DeleteVr(item.FlightId, function () {
            item.IsSynced = 1;
            item.Alert = null;
            item.server = null;
            db.Put('VR', item.Id, item, function (dbitem) {
                deferred.resolve(dbitem);
            });
        });
        return deferred.promise;
    };
    //2021-11-29
    var _epGetVRByFlight = function (flightId) {
        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/voyage/flight/' + flightId /*+ '?from=' + _df + '&to=' + _dt*/).then(function (response) {
            deferred.resolve(JSON.parse( response.data))
        });



        return deferred.promise;
    };
    var _saveVR = function (entity) {
        var pk = entity.FlightId;
        var deferred = $q.defer();
        entity.IsSynced = 1;
        entity.DateUpdate = momentUtcNowString();
        db.Put('VR', entity.FlightId, entity, function (row) {
            if ($rootScope.getOnlineStatus()) {
                //entity.OccurrenceDate = moment(new Date(entity.OccurrenceDate)).format('YYYY-MM-DD-HH-mm');
                $http.post($rootScope.apiUrl + 'voyage/save', entity).then(function (response) {
                    if (response.data.IsSuccess) {
                        //deferred.resolve(response.data);
                        var item = response.data.Data;
                        item.IsSynced = 1;
                        db.Delete('VR', pk, function () {
                            db.Put('VR', item.FlightId, item, function (dbitem) {
                                deferred.resolve({ Data: dbitem, IsSuccess: 1 });
                            });
                        });

                    }
                    else
                        deferred.resolve(response.data);

                }, function (err, status) {

                    deferred.reject(Exceptions.getMessage(err));
                });
            }
            else {
                row.IsSynced = 0;
                db.deSyncedItem('VR', entity.FlightId, function () {
                    deferred.resolve({ Data: row, IsSuccess: 1 });
                });
            }
        });
        return deferred.promise;


    };
    //////////////////////////////////

    var _epGetVRByFlight2 = function (flightId) {

        var deferred = $q.defer();
        $http.get($rootScope.apiUrl + 'voyage/flight/' + flightId /*+ '?from=' + _df + '&to=' + _dt*/).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveVR2 = function (entity) {
        var pk = entity.Id;
        var deferred = $q.defer();
        entity.IsSynced = 1;
        db.Put('VRs', entity.Id, entity, function (row) {
            if ($rootScope.getOnlineStatus()) {
                $http.post($rootScope.apiUrl + 'voyage/save', entity).then(function (response) {
                    if (response.data.IsSuccess) {
                        //deferred.resolve(response.data);
                        var item = response.data.Data;
                        db.Delete('VRs', pk, function () {
                            db.Put('VRs', item.Id, item, function (dbitem) {
                                deferred.resolve({ Data: dbitem, IsSuccess: 1 });
                            });
                        });

                    }
                    else
                        deferred.resolve(response.data);

                }, function (err, status) {

                    deferred.reject(Exceptions.getMessage(err));
                });
            }
            else {
                row.IsSynced = 0;
                db.deSyncedItem('VRs', entity.Id, function () {
                    deferred.resolve({ Data: row, IsSuccess: 1 });
                });
            }
        });
        return deferred.promise;
        //var deferred = $q.defer();
        //$http.post($rootScope.apiUrl + 'voyage/save', entity).then(function (response) {
        //    deferred.resolve(response.data);
        //}, function (err, status) {

        //    deferred.reject(Exceptions.getMessage(err));
        //});

        //return deferred.promise;
    };
    var _epCheckLog = function (dto) {
        var deferred = $q.defer();
        if ($rootScope.getOnlineStatus()) {
            $http.post($rootScope.apiUrl + 'flight/log/check', dto).then(function (response) {
                deferred.resolve(response.data);
            }, function (err, status) {

                //deferred.reject(Exceptions.getMessage(err));
                deferred.resolve(dto);
            });
        }
        else {
            deferred.resolve(dto);
        }
        return deferred.promise;
    };

    var _getSyncDto = function (flt) {

        var dto = { Server: true };
        dto.FlightId = flt.FlightId;
        dto.CrewId = flt.CrewId;
        dto.DelayBlockOff = null;
        dto.BlockTime = null;
        dto.FlightTime = null;
        if (flt.BlockOff)
            dto.BlockOffDate = momentFromatFroServerUTC(flt.BlockOff);
        if (flt.BlockOn)
            dto.BlockOnDate = momentFromatFroServerUTC(flt.BlockOn);
        if (flt.TakeOff)
            dto.TakeOffDate = momentFromatFroServerUTC(flt.TakeOff);
        if (flt.Landing)
            dto.LandingDate = momentFromatFroServerUTC(flt.Landing);

        dto.FuelRemaining = flt.FuelRemaining;
        dto.FuelUplift = flt.FuelUplift;
        dto.FuelUsed = flt.FuelUsed;
        dto.FuelDensity = flt.FuelDensity;
        dto.FuelTotal = flt.FuelTotal;
        ////////////
        dto.PaxAdult = flt.PaxAdult;
        dto.PaxChild = flt.PaxChild;
        dto.PaxInfant = flt.PaxInfant;
        dto.PaxTotal = flt.PaxTotal;

        dto.BaggageWeight = flt.BaggageWeight;
        dto.CargoWeight = flt.CargoWeight;

        dto.SerialNo = flt.SerialNo;
        dto.LTR = flt.LTR;
        dto.PF = flt.PF;

        dto.RVSM_GND_CPT = flt.RVSM_GND_CPT;
        dto.RVSM_GND_STBY = flt.RVSM_GND_STBY;
        dto.RVSM_GND_FO = flt.RVSM_GND_FO;

        dto.RVSM_FLT_CPT = flt.RVSM_FLT_CPT;
        dto.RVSM_FLT_STBY = flt.RVSM_FLT_STBY;
        dto.RVSM_FLT_FO = flt.RVSM_FLT_FO;

        dto.CommanderNote = flt.CommanderNote;

        dto.AttRepositioning1 = flt.AttRepositioning1;
        dto.AttRepositioning2 = flt.AttRepositioning2;


        ///////////////
        //sook
        dto.JLUserId = flt.CrewId;
        dto.JLDate = momentUtcNow();
        dto.Version = flt.Version;

        //$scope.loadingVisible = true;
        //flightService.epSaveLogOverwriteServer($scope.dto).then(function (response) {
        //    $scope.loadingVisible = false;

        //    if (response.IsSuccess) {
        //        General.ShowNotify(Config.Text_SavedOk, 'success');
        //        $rootScope.$broadcast('onFlightLocgSaved', response.Data);

        //    }
        //    else {
        //        General.ShowNotify(response.Data, 'error');
        //    }
        //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        return dto;
    };
    var _autoSyncLogs = async function (callback) {
        var _db = db.getDb();
        var flights = await _db.AppCrewFlights
            .filter(function (flight) {

                return flight.IsSynced == 0;
            }).toArray();

        if (!flights || flights.length == 0) {
            callback({
                total: 0,
                synced: 0,
                remark: 'no logs found',
            });
            return;
        }
        var logResult = { total: flights.length };

        var promises = [];
        var checkResults = [];
        $.each(flights, function (_i, flight) {
            var dto = { JLDate: flight.JLDate, CrewId: flight.CrewId, FlightId: flight.FlightId };
            promises.push($http.post($rootScope.apiUrl + 'flight/log/check', dto).then(cr => { checkResults.push({ flt: flight, result: cr }); }));
        });


        $q.all(promises).then(result => {

            var passed = [];
            $.each(checkResults, function (_i, _d) {
                var flt = _d.flt;
                if (_d.result.data.IsSuccess) {

                    var checkResult = _d.result.data.Data;

                    if (!checkResult) { passed.push(_getSyncDto(flt)); }
                    else {

                        if ((checkResult.JLUserId && checkResult.JLUserId != flt.JLUserId)
                            || (checkResult.JLUserId && getTimeForSync(checkResult.JLDate) > getTimeForSync(flt.JLDate))
                        ) {
                            console.log('Cant Sync ', checkResult);
                        }
                        else {

                            passed.push(_getSyncDto(flt));

                        }
                    }

                }
            });

            if (passed.length > 0) {
                var syncedPromises = [];
                var resps = [];
                $.each(passed, function (_i, _dto) {

                    syncedPromises.push($http.post($rootScope.apiUrl + 'flight/log/save', _dto).then(resp => { resps.push({ id: _dto.FlightId, dt: resp.data.Data }); }));
                });
                var jlDate = null;
                $q.all(syncedPromises).then(result => {

                    var _cntr = 0;
                    $.each(resps, function (_w, _item) {
                        var _flt = Enumerable.From(flights).Where('$.FlightId==' + _item.id).FirstOrDefault();
                        if (_flt) {
                            var changes = {
                                JLDate: momentFromatLocalUTC(_item.dt),
                                JLUserId: $rootScope.employeeId,
                                IsSynced: 1,
                            };
                            db.Update('AppCrewFlights', _item.id, changes, function (_obj) {

                                _cntr++;
                                if (_cntr >= resps.length) {

                                    $rootScope.$broadcast('COMMAND', { title: 'BIND_FLIGHTS' });
                                    logResult.synced = passed.length;
                                    logResult.remark = (logResult.total - passed.length) + ' flight(s) cant sync';
                                    callback(logResult);
                                }
                            });
                        }

                    });
                });

            }
            else {
                logResult.synced = 0;
                logResult.remark = logResult.total + ' flight(s) cant sync';
                callback(logResult);
                return;
            }

        });

        //callback(flights);
    };

    var _autoSyncASR = async function (callback) {
        var _db = db.getDb();
        var asrs = await _db.ASR
            .filter(function (asr) {

                return asr.IsSynced == 0;
            }).toArray();

        if (!asrs || asrs.length == 0) {
            callback({
                total: 0,
                synced: 0,
                remark: 'no asrs found',
            });
            return;
        }
        var logResult = { total: asrs.length };
        var flightIds = Enumerable.From(asrs).Select('$.FlightId').ToArray();
        var dto = { ids: flightIds };
        $http.post($rootScope.apiUrl + 'asr/flights', dto).then(sr => {
            console.log('asr server result', sr);
            var resps = sr.data.Data;

            $.each(asrs, function (_i, _local) {
                var _server = Enumerable.From(resps).Where('$.FlightId==' + _local.FlightId).FirstOrDefault();
                if (!_server) {
                    console.log('update server 0 ' + _local.FlightId);
                    ////// UPDATE SERVER /////////////////////
                    _local.User = $rootScope.userTitle
                    _local.OccurrenceDate = moment(new Date(_local.OccurrenceDate)).format('YYYY-MM-DD-HH-mm');
                    $http.post($rootScope.apiUrl + 'asr/save', _local).then(function (response1) {
                        if (response1.data.IsSuccess) {

                            var item = response1.data.Data;
                            item.IsSynced = 1;
                            db.Delete('ASR', _local.FlightId, function () {
                                db.Put('ASR', item.FlightId, item, function (dbitem) { });
                            });

                        }


                    });
                    /////////END UPDATE SERVER ////////////////////////////


                } else {
                    var _localDate = Number(_local.DateUpdate);
                    var _serverDate = Number(_server.DateUpdate);
                    if (_serverDate >= _localDate) {
                        console.log('update local ' + _local.FlightId);
                        ///////////////// UPDATE LOCAL ///////////////////
                        _epReplaceASR(_server).then(rp => { });
                        ////////////////END UPDATE LOCAL //////////////////
                    }
                    else {
                        console.log(_serverDate + '   local: ' + _localDate);
                        console.log('update server 1 ' + _local.FlightId);
                        /////////////////UPDATE SERVER //////////////////////////
                        _local.User = $rootScope.userTitle
                        _local.OccurrenceDate = moment(new Date(_local.OccurrenceDate)).format('YYYY-MM-DD-HH-mm');
                        $http.post($rootScope.apiUrl + 'asr/save', _local).then(function (response1) {
                            if (response1.data.IsSuccess) {

                                var item = response1.data.Data;
                                item.IsSynced = 1;
                                db.Delete('ASR', _local.FlightId, function () {
                                    db.Put('ASR', item.FlightId, item, function (dbitem) { });
                                });

                            }


                        });
                        ////////////////END UPDATE SERVER //////////////////////
                    }
                }

            });


        });

        //var promises = [];
        //var checkResults = [];
        //$.each(asrs, function (_i, asr) {
        //    var dto = { JLDate: flight.JLDate, CrewId: flight.CrewId, FlightId: flight.FlightId };
        //    promises.push($http.post($rootScope.apiUrl + 'flight/log/check', dto).then(cr => { checkResults.push({ flt: flight, result: cr }); }));
        //});



    };

    var _autoSyncVR = async function (callback) {
        var _db = db.getDb();
        var asrs = await _db.VR
            .filter(function (asr) {

                return asr.IsSynced == 0;
            }).toArray();

        if (!asrs || asrs.length == 0) {
            callback({
                total: 0,
                synced: 0,
                remark: 'no vrs found',
            });
            return;
        }
        var logResult = { total: asrs.length };
        var flightIds = Enumerable.From(asrs).Select('$.FlightId').ToArray();
        var dto = { ids: flightIds };
        $http.post($rootScope.apiUrl + 'vr/flights', dto).then(sr => {
            console.log('vr server result', sr);
            var resps = sr.data.Data;

            $.each(asrs, function (_i, _local) {
                var _server = Enumerable.From(resps).Where('$.FlightId==' + _local.FlightId).FirstOrDefault();
                if (!_server) {
                    console.log('update server 0 ' + _local.FlightId);
                    ////// UPDATE SERVER /////////////////////
                    _local.User = $rootScope.userTitle
                    _local.OccurrenceDate = moment(new Date(_local.OccurrenceDate)).format('YYYY-MM-DD-HH-mm');
                    $http.post($rootScope.apiUrl + 'voyage/save', _local).then(function (response1) {
                        if (response1.data.IsSuccess) {

                            var item = response1.data.Data;
                            item.IsSynced = 1;
                            db.Delete('VR', _local.FlightId, function () {
                                db.Put('VR', item.FlightId, item, function (dbitem) { });
                            });

                        }


                    });
                    /////////END UPDATE SERVER ////////////////////////////


                } else {
                    var _localDate = Number(_local.DateUpdate);
                    var _serverDate = Number(_server.DateUpdate);
                    if (_serverDate >= _localDate) {
                        console.log('update local ' + _local.FlightId);
                        ///////////////// UPDATE LOCAL ///////////////////
                        _epReplaceVR(_server).then(rp => { });

                        ////////////////END UPDATE LOCAL //////////////////
                    }
                    else {
                        console.log(_serverDate + '   local: ' + _localDate);
                        console.log('update server 1 ' + _local.FlightId);
                        /////////////////UPDATE SERVER //////////////////////////
                        _local.User = $rootScope.userTitle
                        _local.OccurrenceDate = moment(new Date(_local.OccurrenceDate)).format('YYYY-MM-DD-HH-mm');
                        $http.post($rootScope.apiUrl + 'voyage/save', _local).then(function (response1) {
                            if (response1.data.IsSuccess) {

                                var item = response1.data.Data;
                                item.IsSynced = 1;
                                db.Delete('VR', _local.FlightId, function () {
                                    db.Put('VR', item.FlightId, item, function (dbitem) { });
                                });

                            }


                        });
                        ////////////////END UPDATE SERVER //////////////////////
                    }
                }

            });


        });




    };



    var _autoSyncDR = async function (callback) {
        var _db = db.getDb();
        var asrs = await _db.DR
            .filter(function (asr) {

                return asr.IsSynced == 0;
            }).toArray();

        if (!asrs || asrs.length == 0) {
            callback({
                total: 0,
                synced: 0,
                remark: 'no drs found',
            });
            return;
        }
        var logResult = { total: asrs.length };
        var flightIds = Enumerable.From(asrs).Select('$.FlightId').ToArray();
        var dto = { ids: flightIds };
        $http.post($rootScope.apiUrl + 'dr/flights', dto).then(sr => {
            console.log('dr server result', sr);
            var resps = sr.data.Data;

            $.each(asrs, function (_i, _local) {
                var _server = Enumerable.From(resps).Where('$.FlightId==' + _local.FlightId).FirstOrDefault();
                if (!_server) {
                    console.log('update server 0 ' + _local.FlightId);
                    ////// UPDATE SERVER /////////////////////
                    _local.User = $rootScope.userTitle

                    $http.post($rootScope.apiUrl + 'dr/save', _local).then(function (response1) {
                        if (response1.data.IsSuccess) {

                            var item = response1.data.Data;
                            item.IsSynced = 1;
                            db.Delete('DR', _local.FlightId, function () {
                                db.Put('DR', item.FlightId, item, function (dbitem) { });
                            });

                        }


                    });
                    /////////END UPDATE SERVER ////////////////////////////


                } else {
                    var _localDate = Number(_local.DateUpdate);
                    var _serverDate = Number(_server.DateUpdate);
                    if (_serverDate >= _localDate) {
                        console.log('update local ' + _local.FlightId);
                        ///////////////// UPDATE LOCAL ///////////////////
                        _epReplaceDR(_server).then(rp => { });

                        ////////////////END UPDATE LOCAL //////////////////
                    }
                    else {
                        console.log(_serverDate + '   local: ' + _localDate);
                        console.log('update server 1 ' + _local.FlightId);
                        /////////////////UPDATE SERVER //////////////////////////
                        _local.User = $rootScope.userTitle
                        _local.OccurrenceDate = moment(new Date(_local.OccurrenceDate)).format('YYYY-MM-DD-HH-mm');
                        $http.post($rootScope.apiUrl + 'dr/save', _local).then(function (response1) {
                            if (response1.data.IsSuccess) {

                                var item = response1.data.Data;
                                item.IsSynced = 1;
                                db.Delete('DR', _local.FlightId, function () {
                                    db.Put('DR', item.FlightId, item, function (dbitem) { });
                                });

                            }


                        });
                        ////////////////END UPDATE SERVER //////////////////////
                    }
                }

            });


        });




    };


    var _autoSyncOFP = async function (callback) {
        var _db = db.getDb();
        var asrs = await _db.OFP
            .filter(function (asr) {

                return asr.IsSynced == 0;
            }).toArray();

        if (!asrs || asrs.length == 0) {
            callback({
                total: 0,
                synced: 0,
                remark: 'no ofps found',
            });
            return;
        }
        var logResult = { total: asrs.length };
        var flightIds = Enumerable.From(asrs).Select('$.FlightId').ToArray();
        var dto = { ids: flightIds };
        $http.post($rootScope.apiUrl + 'ofp/flights', dto).then(sr => {
            console.log('ofp server result', sr);
            var resps = sr.data.Data;

            $.each(asrs, function (_i, _local) {
                var _server = Enumerable.From(resps).Where('$.FlightId==' + _local.FlightId).FirstOrDefault();
                if (!_server) {
                    console.log('update server 0 ' + _local.FlightId);
                    ////// UPDATE SERVER /////////////////////
                    _local.User = $rootScope.userTitle

                    $http.post($rootScope.apiUrl + 'ofp/save', _local).then(function (response1) {
                        if (response1.data.IsSuccess) {

                            var item = response1.data.Data;
                            item.IsSynced = 1;
                            db.Delete('OFP', _local.FlightId, function () {
                                db.Put('OFP', item.FlightId, item, function (dbitem) { });
                            });

                        }


                    });
                    /////////END UPDATE SERVER ////////////////////////////


                } else {
                    var _localDate = Number(_local.DateUpdate);
                    var _serverDate = Number(_server.DateUpdate);
                    if (_serverDate >= _localDate) {
                        console.log('update local ' + _local.FlightId);
                        ///////////////// UPDATE LOCAL ///////////////////
                        _epReplaceOFP(_server).then(rp => { });

                        ////////////////END UPDATE LOCAL //////////////////
                    }
                    else {
                        console.log(_serverDate + '   local: ' + _localDate);
                        console.log('update server 1 ' + _local.FlightId);
                        /////////////////UPDATE SERVER //////////////////////////
                        _local.User = $rootScope.userTitle
                        _local.OccurrenceDate = moment(new Date(_local.OccurrenceDate)).format('YYYY-MM-DD-HH-mm');
                        $http.post($rootScope.apiUrl + 'ofp/save', _local).then(function (response1) {
                            if (response1.data.IsSuccess) {

                                var item = response1.data.Data;
                                item.IsSynced = 1;
                                db.Delete('OFP', _local.FlightId, function () {
                                    db.Put('OFP', item.FlightId, item, function (dbitem) { });
                                });

                            }


                        });
                        ////////////////END UPDATE SERVER //////////////////////
                    }
                }

            });


        });




    };




    var _autoSyncOFPProp = async function (callback) {

        var _db = db.getDb();
        var asrs = await _db.OFPProp
            .filter(function (asr) {

                return asr.IsSynced == 0;
            }).toArray();

        if (!asrs || asrs.length == 0) {

            callback({
                total: 0,
                synced: 0,
                remark: 'no ofp props found',
            });
            return;
        }
        var logResult = { total: asrs.length };
        var flightIds = Enumerable.From(asrs).Select('$.Id').ToArray();

        var dto = { ids: flightIds };

        $http.post($rootScope.apiUrl + 'ofp/props/ids', dto).then(sr => {

            var resps = sr.data.Data;
            var serverUpdates = [];
            $.each(asrs, function (_i, _local) {
                var _server = Enumerable.From(resps).Where('$.Id==' + _local.Id).FirstOrDefault();
                if (_server) {
                    var _localDate = Number(_local.DateUpdate);
                    var _serverDate = Number(_server.DateUpdate);
                    if (_serverDate >= _localDate) {
                        ///////////////// UPDATE LOCAL ///////////////////
                        _epReplaceOFPProp(_server).then(rp => { });
                        ////////////////END UPDATE LOCAL //////////////////
                    }
                    else {


                        _local.User = $rootScope.userTitle
                        serverUpdates.push(_local);


                    }




                }

            });

            if (serverUpdates.length > 0) {
                /////////////////UPDATE SERVER //////////////////////////
                $http.post($rootScope.apiUrl + 'ofp/props/save', serverUpdates).then(function (response1) {
                    if (response1.data.IsSuccess && response1.data.Data && response1.data.Data.length > 0) {
                        $.each(response1.data.Data, function (_i, _r) {
                            _r.IsSynced = 1;
                            db.DeleteOFPPropById(_r.Id, function () {
                                db.PutOFPPropById(_r.Id, _r, function (dbitem) { });
                            });
                        });
                    }
                });
                ////////////////END UPDATE SERVER //////////////////////
            }



        });






    };

    var _syncOFPProps = function (ofpId, overwrite, callback) {

        var _db = db.getDb();
        _db.OFPProp
            .filter(function (asr) {

                return asr.OFPId == ofpId;
            }).toArray(function (asrs) {
                /////// BEGIN ///////////////////
                if (!asrs || asrs.length == 0) {

                    callback({
                        total: 0,
                        synced: 0,
                        remark: 'no ofp props found',
                    });
                    return;
                }
                var logResult = { total: asrs.length };
                var flightIds = Enumerable.From(asrs).Select('$.Id').ToArray();

                var dto = { ids: flightIds };

                $http.post($rootScope.apiUrl + 'ofp/props/ids', dto).then(sr => {

                    var resps = sr.data.Data;
                    var serverUpdates = [];
                    $.each(asrs, function (_i, _local) {
                        var _server = Enumerable.From(resps).Where('$.Id==' + _local.Id).FirstOrDefault();
                        if (_server) {
                            var _localDate = Number(_local.DateUpdate);
                            var _serverDate = Number(_server.DateUpdate);
                            if (_serverDate >= _localDate && !overwrite) {
                                ///////////////// UPDATE LOCAL ///////////////////
                                _epReplaceOFPProp(_server).then(rp => { });
                                ////////////////END UPDATE LOCAL //////////////////
                            }
                            else {


                                _local.User = $rootScope.userTitle
                                serverUpdates.push(_local);


                            }




                        }

                    });

                    if (serverUpdates.length > 0) {
                        /////////////////UPDATE SERVER //////////////////////////
                        $http.post($rootScope.apiUrl + 'ofp/props/save', serverUpdates).then(function (response1) {
                            if (response1.data.IsSuccess && response1.data.Data && response1.data.Data.length > 0) {
                                $.each(response1.data.Data, function (_i, _r) {
                                    _r.IsSynced = 1;
                                    db.DeleteOFPPropById(_r.Id, function () {
                                        db.PutOFPPropById(_r.Id, _r, function (dbitem) { });
                                    });
                                });
                            }
                        });
                        ////////////////END UPDATE SERVER //////////////////////
                    }



                });



                /////// END  ///////////////////////
            });






    };

    var _checkLock = function (flightId, doc) {

        var deferred = $q.defer();

        $http.get($rootScope.apiUrl + 'check/lock/' + flightId + '/' + doc).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            //deferred.reject(Exceptions.getMessage(err));
            deferred.resolve("error");
        });

        return deferred.promise;
    };
    //////////////////////////////////
    //2023-02-13
    var _getAppLegs = function (url) {

        var deferred = $q.defer();
        $http.get(apiapsb + url).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getAppLegCrews = function (fltid) {

        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/appleg/crew/'+fltid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getAppLegOFP = function (fltid) {

        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/appleg/ofp/' + fltid).then(function (response) {
            if (response.data.Id == -1)
                deferred.resolve(null);
            else
                deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _getJL = function (fid) {

        var deferred = $q.defer();
        $http.get(serviceBaseAPI + "api/jl/"+fid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };



    ///////////////////////////
    //2021-11-29
    var _remarkVRManager = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseAPI + 'api/vr/remark/manager/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.remarkVRManager = _remarkVRManager;
    var _remarkVRStaff = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseAPI + 'api/vr/remark/staff/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.remarkVRStaff = _remarkVRStaff;



    var _remarkASRManager = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseAPI + 'api/asr/remark/manager/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.remarkASRManager = _remarkASRManager;
    var _remarkASRStaff = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseAPI + 'api/asr/remark/staff/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.remarkASRStaff = _remarkASRStaff;



    var _getMETAR = function (flt) {

        var deferred = $q.defer();
        $http.get(serviceSKYBAG + "api/weather/metar/adds/archive/flight/" + flt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getMETAR = _getMETAR;

    var _getTAF = function (flt) {

        var deferred = $q.defer();
        $http.get(serviceSKYBAG + "api/weather/taf/adds/archive/flight/" + flt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getTAF = _getTAF;

    var _getNOTAM = function (flt) {

        var deferred = $q.defer();
        $http.get(serviceSKYBAG + "api/airport/notam/archive/flight/" + flt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getNOTAM = _getNOTAM;
    ////////////////////////////
    serviceFactory.getJL = _getJL;
    serviceFactory.getAppLegs = _getAppLegs;
    serviceFactory.getAppLegCrews = _getAppLegCrews;
    serviceFactory.getAppLegOFP = _getAppLegOFP;
    ///////////////////////
    serviceFactory.checkLock = _checkLock;
    serviceFactory.autoSyncLogs = _autoSyncLogs;
    serviceFactory.autoSyncASR = _autoSyncASR;
    serviceFactory.autoSyncVR = _autoSyncVR;
    serviceFactory.autoSyncDR = _autoSyncDR;
    serviceFactory.autoSyncOFP = _autoSyncOFP;
    serviceFactory.autoSyncOFPProp = _autoSyncOFPProp;
    serviceFactory.syncOFPProps = _syncOFPProps;
    serviceFactory.epGetDRByFlight = _epGetDRByFlight;
    serviceFactory.epGetDRsByFlights = _epGetDRsByFlights;
    serviceFactory.epGetOFPByFlight = _epGetOFPByFlight;
    serviceFactory.epGetOFPByFlights = _epGetOFPByFlights;
    serviceFactory.epGetOFPProps = _epGetOFPProps;
    serviceFactory.epGetASRByFlight = _epGetASRByFlight;
    serviceFactory.saveASR = _saveASR;
    serviceFactory.saveDR = _saveDR;
    serviceFactory.saveOFPProp = _saveOFPProp;
    serviceFactory.saveOFPPropBulk = _saveOFPPropBulk;
    serviceFactory.epGetVRByFlight = _epGetVRByFlight;
    serviceFactory.saveVR = _saveVR;
    serviceFactory.epReplaceASR = _epReplaceASR;
    serviceFactory.epReplaceVR = _epReplaceVR;
    serviceFactory.epReplaceDR = _epReplaceDR;
    serviceFactory.epReplaceOFP = _epReplaceOFP;
    serviceFactory.epReplaceOFPProp = _epReplaceOFPProp;

    serviceFactory.updateTAFs = _updateTAFs;
    serviceFactory.updateMETARs = _updateMETARs;
    serviceFactory.updateNOTAMs = _updateNOTAMs;
    serviceFactory.getTAFs = _getTAFs;
    serviceFactory.getMETARs = _getMETARs;
    serviceFactory.getNOTAMs = _getNOTAMs;
    serviceFactory.epGetCrewFlights = _epGetCrewFlights;

    serviceFactory.epGetFlightCrews = _epGetFlightCrews;
    serviceFactory.epGetFlightCommanders = _epGetFlightCommanders;
    serviceFactory.epGetFlight = _epGetFlight;
    serviceFactory.epGetFlightLocal = _epGetFlightLocal;
    serviceFactory.epGetFlightDelays = _epGetFlightDelays;
    serviceFactory.epSaveLog = _epSaveLog;
    serviceFactory.signDoc = _signDoc;
    serviceFactory.signDocLocal = _signDocLocal;
    serviceFactory.epCheckLog = _epCheckLog;
    serviceFactory.epSyncFlight = _epSyncFlight;
    serviceFactory.epSaveLogOverwriteServer = _epSaveLogOverwriteServer;

    serviceFactory.epGetCrewCalendar = _epGetCrewCalendar;
    serviceFactory.epGetCrewDuties = _epGetCrewDuties;

    ///////////////////////////////////

    serviceFactory.getSun = _getSun;
    serviceFactory.getSunFlight = _getSunFlight;
    serviceFactory.getFlight = _getFlight;
    serviceFactory.updateFDPTimes = _updateFDPTimes;
    serviceFactory.removeFlightFromFDP = _removeFlightFromFDP;
    serviceFactory.updateFlightStatus = _updateFlightStatus;
    serviceFactory.getCrewFDPs = _getCrewFDPs;
    serviceFactory.getCrewFDP = _getCrewFDP;
    serviceFactory.getCrewFlights = _getCrewFlights;
    serviceFactory.getCrewFlightsByFDP = _getCrewFlightsByFDP;
    serviceFactory.getCrewFlightsReport = _getCrewFlightsReport;
    serviceFactory.getCrewFlightsGrouped = _getCrewFlightsGrouped;
    serviceFactory.getFlightCrews = _getFlightCrews;
    serviceFactory.addFlightToFDP = _addFlightToFDP;
    serviceFactory.updateCPFDP = _updateCPFDP;
    serviceFactory.updateFlightFDP = _updateFlightFDP;
    serviceFactory.updateFlightFDPDirect = _updateFlightFDPDirect;
    serviceFactory.saveFDP = _saveFDP;
    serviceFactory.saveDuty = _saveDuty;
    serviceFactory.getCrewFDPsFTL = _getCrewFDPsFTL;
    serviceFactory.getCrewFDPsFlights = _getCrewFDPsFlights;
    serviceFactory.getCrewFDPsDuties = _getCrewFDPsDuties;
    return serviceFactory;

}]);