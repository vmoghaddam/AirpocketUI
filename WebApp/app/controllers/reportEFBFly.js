'use strict';
app.controller('reportEFBFlyController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', 'flightBagService', '$sce', '$window', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route, flightBagService, $sce, $window) {
    $scope.prms = $routeParams.prms;

    $scope.IsFBVisible = true;
    $scope.IsVrVisible = true;
    var vrs = ['m.saghi', 'pirveysi', 'h.pirveisi', 'm.kadivar', 'mirzaei', 'rasouli', 'm.miri', 'n.sabouri', 'izadkhah'];
    $scope.IsVrVisible = vrs.indexOf($rootScope.userName.toLowerCase()) == -1;

    $scope.ASRVR = true;
    if ($rootScope.userName.toLowerCase() == 'hemati') $scope.ASRVR = false;


    $scope.isOPSStaff = false;



    $scope.IsFBVisible = $scope.IsFBVisible || $scope.isOPSStaff;

    var isTaxiVisible = false;
    if ($rootScope.userName.toLowerCase() == 'ashrafi')
        isTaxiVisible = true;
    // printElem($('#ofp-doc'));
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        // validationGroup: 'ctrsearch',bind 
        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_flight_ds = null;
            $scope.doRefresh = true;
            $scope.bind();
            //var result = e.validationGroup.validate();

            //if (!result.isValid) {
            //    General.ShowNotify(Config.Text_FillRequired, 'error');
            //    return;
            //}
            //$scope.dg_flight_total_ds = null;
            //$scope.dg_flight_ds = null;
            //var caption = 'From ' + moment($scope.dt_from).format('YYYY-MM-DD') + ' to ' + moment($scope.dt_to).format('YYYY-MM-DD');
            //$scope.dg_flight_total_instance.columnOption('date', 'caption', caption);
            //$scope.getCrewFlightsTotal($scope.dt_from, $scope.dt_to);
        }

    };

    $scope.btn_print = {
        text: 'Print',
        type: 'default',

        width: 120,
        // validationGroup: 'ctrsearch',bind 
        bindingOptions: {},
        onClick: function (e) {
            if ($scope.selectedTabId == 'ofp')
                printElem($('#ofp-doc'), 1);
            if ($scope.selectedTabId == 'log')
                printElem($('#log-con'));
            if ($scope.selectedTabId == 'metar')
                printElem($('#metar-con'));
            if ($scope.selectedTabId == 'taf')
                printElem($('#taf-con'));
            if ($scope.selectedTabId == 'notam')
                printElem($('#notam-con'));

        }

    };
    $scope.btn_asr = {
        text: 'ASR',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {

            var flt = $rootScope.getSelectedRow($scope.dg_flight_instance);
            if (!flt) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = { FlightId: flt.ID };

            $rootScope.$broadcast('InitAsrAdd', data);

        },
        bindingOptions: {
            disabled: '!selectedFlight || !selectedFlight.AttASR'
        }
    };

    $scope.btn_vr = {
        text: 'Voyage Report',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {
            var flt = $rootScope.getSelectedRow($scope.dg_flight_instance);
            if (!flt) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = { FlightId: flt.ID };

            $rootScope.$broadcast('InitVrAdd', data);

        },
        bindingOptions: {
            disabled: '!selectedFlight || !selectedFlight.AttVoyageReport'
        }
    };
    $scope.btn_dr = {
        text: 'Dispatch Release',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {

            var flt = $rootScope.getSelectedRow($scope.dg_flight_instance);
            if (!flt) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = { FlightId: flt.ID };

            $rootScope.$broadcast('InitDrAdd', data);



        },
        bindingOptions: {
            disabled: '!selectedFlight'
        }
    };


    $scope.popup_atc_visible = false;
    $scope.popup_atc = {
        height: $(window).height() - 200,
        width: 600,
        title: 'ATC FLIGHT PLAN',
        showTitle: true,

        toolbarItems: [




            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', onClick: function (e) {


                        $scope.popup_atc_visible = false;
                    }
                }, toolbar: 'bottom'
            },

        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {

        },
        onShown: function (e) {

        },
        onHiding: function () {

            //$scope.clearEntity();

            $scope.popup_atc_visible = false;

        },
        onContentReady: function (e) {

        },
        fullScreen: false,
        bindingOptions: {
            visible: 'popup_atc_visible',


        }
    };
    $scope.atc_area = {

        bindingOptions: {
            height: 'scroll_atc_height',
            value: "ATCHtml"
        }
    };
    $scope.atctitle = 'ATC';
    $scope.btn_atc = {
        text: 'ATC Flight Plan',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {

            var flt = $rootScope.getSelectedRow($scope.dg_flight_instance);
            if (!flt) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = { FlightId: flt.ID };

            // $rootScope.$broadcast('InitDrAdd', data);
            if (flt.ATCPlan) {

                if (!flt.ATCPlan.includes('atc-')) {

                    $scope.ATCHtml = flt.ATCPlan; // $sce.trustAsHtml($scope.selectedFlight.ATCPlan);

                    $scope.popup_atc_visible = true;
                    $scope.isATCTXT = true;
                }
                else {
                    $scope.isATCTXT = false;
                    //  var _url = staticFiles2 + '/atc/' + +  $scope.selectedFlight.ATCPlan;
                    //  $scope.showPdf({ url: _url, caption: 'ATC Flight Plan (' + $scope.selectedFlight.FlightNumber + ')' });
                    var _url = 'https://fleet.flypersia.aero/apiapsb/upload/atc/' + flt.ATCPlan.replace('"', '').replace('"', '').replace("'", "").replace("'", "");
                    window.open(_url);
                }
            }


        },
        bindingOptions: {
            disabled: '!selectedFlight'
        }
    };
    $scope.fltdocClick = function (type) {
        var flight = $rootScope.getSelectedRow($scope.dg_flight_instance);
        if (!flight) {

            return;
        }
        switch (type) {
            case 'ddl':
                if (flight.CPInstructor)
                    $window.open('https://fleet.flypersia.aero/apiapsb/upload/atc/' + flight.CPInstructor, '_blank');
                return;
            case 'spwx':
                if (flight.CPP2)
                    $window.open('https://fleet.flypersia.aero/apiapsb/upload/atc/' + flight.CPP2, '_blank');
                return;

            case 'notam':

                if (flight.CPISCCM)
                    $window.open('https://fleet.flypersia.aero/apiapsb/upload/atc/' + flight.CPISCCM, '_blank');
                return;
            case 'other':
                if (flight.CPSCCM)
                    $window.open('https://fleet.flypersia.aero/apiapsb/upload/atc/' + flight.CPSCCM, '_blank');
                return;
            case 'packinglist':
                if (flight.CPP1)
                    $window.open('https://fleet.flypersia.aero/apiapsb/upload/atc/' + flight.CPP1, '_blank');
                return;


            default:
                return;
        }

    };
    $scope.get_doc_class = function (type) {
        var flight = $rootScope.getSelectedRow($scope.dg_flight_instance);
        if (!flight) {

            return;
        }

        switch (type) {
            case 'ddl':
                return flight.CPInstructor ? "docon" : "";
            case 'spwx':
                return flight.CPP2 ? "docon" : "";
            case 'notam':
                return flight.CPISCCM ? "docon" : "";
            case 'other':
                return flight.CPSCCM ? "docon" : "";
            case 'packinglist':
                return flight.CPP1 ? "docon" : "";


            default:
                return "";
        }
    };
    $scope.is_vsible = function (type) {
        var flight = $rootScope.getSelectedRow($scope.dg_flight_instance);
        if (!flight) {

            return;
        }
         

        switch (type) {
            case 'ddl':
                return flight.DateVisitDDL;
            case 'spwx':
                return flight.DateVisitSPWX;
            case 'notam':
                return flight.DateVisitNOTAM;
            case 'other':
                return flight.DateVisitOTHER;
            case 'packinglist':
                return flight.DateVisitPACKINGLIST;


            default:
                return "";
        }
    };
    $scope.btn_to = {
        text: 'TO',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {

            var flt = $rootScope.getSelectedRow($scope.dg_flight_instance);
            if (!flt) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = { FlightId: flt.ID, Flight: flt };

            $rootScope.$broadcast('InitTOAdd', data);

        },

    };
    $scope.btn_lnd = {
        text: 'LND',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {

            var flt = $rootScope.getSelectedRow($scope.dg_flight_instance);
            if (!flt) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = { FlightId: flt.ID, Flight: flt };

            $rootScope.$broadcast('InitLdgAdd', data);

        },

    };
    $scope.btn_ofp = {
        text: 'OFP',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {
            var flt = $rootScope.getSelectedRow($scope.dg_flight_instance);
            if (!flt) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = { FlightId: flt.ID };

            $rootScope.$broadcast('InitOFPAdd', data);

        },
        bindingOptions: {
            disabled: 'IsLegLocked'
        }
    };
    $scope.btn_log = {
        text: 'Log',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {
            var flt = $rootScope.getSelectedRow($scope.dg_flight_instance);
            if (!flt) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            var data = { FlightId: flt.ID };

            $rootScope.$broadcast('InitLogAdd', data);

        },
        bindingOptions: {
            disabled: 'IsLegLocked'
        }
    };

    ////10-13////////////
    $scope.btn_jl = {
        text: 'Journey Log',
        type: 'default',
        //icon: 'search',
        width: '100%', //37,

        onClick: function (e) {
            var flt = $rootScope.getSelectedRow($scope.dg_flight_instance);
            if (!flt) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            $scope.bindJL(flt.FlightId);


        },
        bindingOptions: {
            disabled: '!selectedFlight'
        }
    };


    $scope.jlObj = null;
    $scope.jl = { asr: false, vr: false, pos1: false, pos2: false, sign: '' };
    $scope.bindJL = function (fid) {

        $scope.jl = { asr: false, vr: false, pos1: false, pos2: false, sign: '' };
        //jl.ReportingTime

        $scope.loadingVisible = true;

        flightBagService.getJL(fid).then(function (response) {
            console.log(response);
            $scope.loadingVisible = false;
            //_d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
            //if (_d.JLSignedBy) {
            //    //$scope.isEditable = false;
            //    _d.url_sign = signFiles + _d.PICId + ".jpg";
            //    _d.PIC2 = _d.PIC;
            //    _d.signDate = moment(new Date(_d.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
            //}

            $scope.jlObj = response;
            $scope.jl = response;
            $scope.jl.STD2 = CreateDate($scope.jl.STD);
            $scope.jl.DutyEnd2 = CreateDate($scope.jl.DutyEnd);

            //response.legs[i]
            //$scope.jl.ReportingTime
            $scope.jl.StartTime = (CreateDate(response.legs[0].STD)).addMinutes(-60);
            if (response.legs[0].JLSignedBy)
                $scope.jl.sign = signFiles + response.legs[0].JLSignedBy + ".jpg";
            console.log($scope.jlObj);


            $scope.jl.sectors = [];
            for (var i = 0; i < 6; i++) {
                var s = i + 1;
                var sec = { sector: s };
                if (response.legs.length >= s) {
                    var flight = response.legs[i];


                    sec.from = flight.FromAirportIATA;
                    sec.to = flight.ToAirportIATA;
                    sec.no = flight.FlightNumber;
                    sec.mm = moment(new Date(flight.STD)).format('MM');
                    sec.dd = moment(new Date(flight.STD)).format('DD');
                    sec.leg = flight;
                    $scope.totalBlockTime += sec.leg.BlockTime ? sec.leg.BlockTime : 0;
                    sec.leg.RemDuty = '';
                    if (flight.BlockOn) {

                        var usedDuty = $scope.getDuration(new Date(flight.BlockOn), (new Date(response.legs[0].STD)).addMinutes(-60));
                        sec.leg.RemDuty = $scope.jl.MaxFDP - usedDuty;

                    }
                    // alert(CreateDate(sec.leg.BlockOff));
                    sec.leg.BlockOff2 = CreateDate(sec.leg.BlockOff);
                    sec.leg.BlockOn2 = CreateDate(sec.leg.BlockOn);
                    sec.leg.Landing2 = CreateDate(sec.leg.Landing);
                    sec.leg.TakeOff2 = CreateDate(sec.leg.TakeOff);
                }

                $scope.jl.sectors.push(sec);
            }
            var cockpit = Enumerable.From(response.crew).Where('$.JobGroupCode.startsWith("00101")').OrderBy('$.IsPositioning').ThenBy('$.GroupOrder').ThenBy('$.Name').ToArray();
            var cabin = Enumerable.From(response.crew).Where('$.JobGroupCode.startsWith("00102")').OrderBy('$.IsPositioning').ThenBy('$.GroupOrder').ThenBy('$.Name').ToArray();

            $scope.jl.cockpit = [];
            $scope.jl.cabin = [];
            var n = 0;
            var j = cabin.length;
            if (cockpit.length > j)
                j = cockpit.length;
            //if (8 > j) j = 8;
            $scope.jl.crews = [];
            //bahrami-6-2
            $scope.jl.crewscockpit = [];
            $scope.jl.crewscabin = [];
            console.log('cockpit', cockpit);
            $.each(cockpit, function (_i, co) {
                if (_i == 0) {
                    co.TotalDuty = $scope.jl.Duty;
                    co.TotalLandings = response.legs.length;
                }
                if (co.Position == "Captain")
                    co.Position = "CPT";
                if (co.Position == "P2" || co.Position == "FO")
                    co.Position = "F/O";
                if (co.IsPositioning)
                    co.Position = 'DH';
                $scope.jl.crewscockpit.push(co);

            });
            $.each(cabin, function (_i, co) {
                if (co.IsPositioning)
                    co.Position = 'DH';
                if (co.Position && (co.Position == 'Purser' || co.Position == 'SCCM'))
                    co.Position = 'F/P';
                if (co.Position && (co.Position == 'FA' || co.Position == 'CCM'))
                    co.Position = 'F/A';
                if (co.JobGroup == "ISCCM")
                    co.Position = "IF/P";
                $scope.jl.crewscabin.push(co);
            });

            //if ($scope.jl.crewscockpit.length < 7)
            //    for (var i = $scope.jl.crewscockpit.length; i < 7; i++) {
            //        $scope.jl.crewscockpit.push({ Position: ' ', Name: ' ' });

            //    }


            //if ($scope.jl.crewscabin.length < 7)
            //    for (var i = $scope.jl.crewscabin.length; i < 7; i++) {
            //        $scope.jl.crewscabin.push({ Position: ' ', Name: ' ' });
            //    }


            ///////////////////////////
            for (var i = 0; i < j; i++) {
                var ca = {};
                if (cabin.length > i)
                    ca = cabin[i];

                var co = {};
                if (cockpit.length > i)
                    co = cockpit[i];

                //////////////////////////////////
                if (co.Position == "Captain")
                    co.Position = "CPT";
                // if (co.JobGroup == "TRE" || co.JobGroup == "TRI" || co.JobGroup == "LTC")

                // co.Position = 'IP';
                if (co.IsPositioning)
                    co.Position = 'DH';
                //////////////////////////////////


                if (ca.Position && ca.Position == 'Purser')
                    ca.Position = 'SCCM';
                if (ca.Position && ca.Position == 'FA')
                    ca.Position = 'CCM';
                if (ca.JobGroup == "ISCCM")
                    ca.Position = "ISCCM";

                if (ca.IsPositioning)
                    ca.Position = 'DH';

                // bahrami-6-2
                if (!ca.Name) { ca.Name = ''; ca.Position = ''; }
                if (!co.Name) { co.Name = ''; co.Position = ''; }
                $scope.jl.crews.push({ cabin: ca, cockpit: co });


            }

            $scope.jl.rvsm1 = [];
            //$scope.jl.rvsm1.push($scope.fillRVSM(1, response.legs));
            //$scope.jl.rvsm1.push($scope.fillRVSM(2, response.legs));
            //$scope.jl.rvsm1.push($scope.fillRVSM(3, response.legs));
            $scope.jl.rvsm2 = [];
            //$scope.jl.rvsm2.push($scope.fillRVSM(4, response.legs));
            //$scope.jl.rvsm2.push($scope.fillRVSM(5, response.legs));
            //$scope.jl.rvsm2.push($scope.fillRVSM(6, response.legs));

            $('#pos1').prop('checked', $scope.jl.pos1);

            $('#pos2').prop('checked', $scope.jl.pos2);

            $('#vr').prop('checked', $scope.jl.vr);
            $('#asr').prop('checked', $scope.jl.asr);
            if ($scope.jl.sign)
                $("#_jlsign").attr('src', $scope.jl.sign);

            $scope.isContentVisible = true;
            console.log('jl jl jl jl', $scope.jl);

            $scope.popup_jl_visible = true;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




    };

    $scope.__bindJL = function (fid) {
        $scope.jl = { asr: false, vr: false, pos1: false, pos2: false, sign: '' };
        $scope.loadingVisible = true;

        flightBagService.getJL(fid).then(function (response) {
            $scope.loadingVisible = false;


            $scope.jlObj = response;
            $scope.jl = response;
            if (response.legs[0].JLSignedBy)
                $scope.jl.sign = signFiles + response.legs[0].JLSignedBy + ".jpg";
            console.log($scope.jlObj);


            $scope.jl.sectors = [];
            for (var i = 0; i < 6; i++) {
                var s = i + 1;
                var sec = { sector: s };
                if (response.legs.length >= s) {
                    var flight = response.legs[i];
                    sec.from = flight.FromAirportIATA;
                    sec.to = flight.ToAirportIATA;
                    sec.no = flight.FlightNumber;
                    sec.mm = moment(new Date(flight.STD)).format('MM');
                    sec.dd = moment(new Date(flight.STD)).format('DD');
                    sec.leg = flight;
                }

                $scope.jl.sectors.push(sec);
            }
            var cockpit = Enumerable.From(response.crew).Where('$.JobGroupCode.startsWith("00101")').OrderBy('$.IsPositioning').ThenBy('$.GroupOrder').ThenBy('$.Name').ToArray();
            var cabin = Enumerable.From(response.crew).Where('$.JobGroupCode.startsWith("00102")').OrderBy('$.IsPositioning').ThenBy('$.GroupOrder').ThenBy('$.Name').ToArray();

            $scope.jl.cockpit = [];
            $scope.jl.cabin = [];
            var n = 0;
            var j = cabin.length;
            if (cockpit.length > j)
                j = cockpit.length;
            if (8 > j) j = 8;
            $scope.jl.crews = [];
            //bahrami-6-2
            $scope.jl.crewscockpit = [];
            $scope.jl.crewscabin = [];
            //console.log(cockpit);
            $.each(cockpit, function (_i, co) {
                if (co.Position == "Captain")
                    co.Position = "CPT";
                if (co.IsPositioning)
                    co.Position = 'DH';
                $scope.jl.crewscockpit.push(co);

            });
            $.each(cabin, function (_i, co) {
                if (co.IsPositioning)
                    co.Position = 'DH';
                if (co.Position && co.Position == 'Purser')
                    co.Position = 'SCCM';
                if (co.Position && co.Position == 'FA')
                    co.Position = 'CCM';
                if (co.JobGroup == "ISCCM")
                    co.Position = "ISCCM";
                $scope.jl.crewscabin.push(co);
            });

            if ($scope.jl.crewscockpit.length < 7)
                for (var i = $scope.jl.crewscockpit.length; i < 7; i++) {
                    $scope.jl.crewscockpit.push({ Position: ' ', Name: ' ' });

                }


            if ($scope.jl.crewscabin.length < 7)
                for (var i = $scope.jl.crewscabin.length; i < 7; i++) {
                    $scope.jl.crewscabin.push({ Position: ' ', Name: ' ' });
                }


            ///////////////////////////
            for (var i = 0; i < j; i++) {
                var ca = {};
                if (cabin.length > i)
                    ca = cabin[i];

                var co = {};
                if (cockpit.length > i)
                    co = cockpit[i];

                //////////////////////////////////
                if (co.Position == "Captain")
                    co.Position = "CPT";
                // if (co.JobGroup == "TRE" || co.JobGroup == "TRI" || co.JobGroup == "LTC")

                // co.Position = 'IP';
                if (co.IsPositioning)
                    co.Position = 'DH';
                //////////////////////////////////


                if (ca.Position && ca.Position == 'Purser')
                    ca.Position = 'SCCM';
                if (ca.Position && ca.Position == 'FA')
                    ca.Position = 'CCM';
                if (ca.JobGroup == "ISCCM")
                    ca.Position = "ISCCM";

                if (ca.IsPositioning)
                    ca.Position = 'DH';

                // bahrami-6-2
                if (!ca.Name) { ca.Name = ''; ca.Position = ''; }
                if (!co.Name) { co.Name = ''; co.Position = ''; }
                $scope.jl.crews.push({ cabin: ca, cockpit: co });


            }

            $scope.jl.rvsm1 = [];
            $scope.jl.rvsm1.push($scope.fillRVSM(1, response.legs));
            $scope.jl.rvsm1.push($scope.fillRVSM(2, response.legs));
            $scope.jl.rvsm1.push($scope.fillRVSM(3, response.legs));
            $scope.jl.rvsm2 = [];
            $scope.jl.rvsm2.push($scope.fillRVSM(4, response.legs));
            $scope.jl.rvsm2.push($scope.fillRVSM(5, response.legs));
            $scope.jl.rvsm2.push($scope.fillRVSM(6, response.legs));

            $scope.popup_jl_visible = true;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



    };

    $scope.fillRVSM = function (n, legs) {
        var obj = { leg: n };
        if (legs.length >= n) {
            var leg = legs[n - 1];
            obj.RVSM_GND_CPT = leg.RVSM_GND_CPT;
            obj.RVSM_GND_STBY = leg.RVSM_GND_STBY;
            obj.RVSM_GND_FO = leg.RVSM_GND_FO;
            obj.RVSM_FLT_CPT = leg.RVSM_FLT_CPT;
            obj.RVSM_FLT_STBY = leg.RVSM_FLT_STBY;
            obj.RVSM_FLT_FO = leg.RVSM_FLT_FO;
        }
        return obj;
    };
    //oooo
    function printElem($elem, ofp) {

        var contents = $elem.html();//'<h1>Vahid</h1>' $elem.html();
        var frame1 = $('<iframe id="_iframe" />');
        frame1[0].name = "frame1";
        frame1.css({ "position": "absolute", "top": "-1000000px" });
        $("body").append(frame1);
        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
        frameDoc.document.open();
        //Create a new HTML document.
        frameDoc.document.write('<html><head><title></title>');
        frameDoc.document.write('</head><body style="padding:50px">');
        //Append the external CSS file.
        //frameDoc.document.write('<link href="content/css/main.css" rel="stylesheet" type="text/css" />');
        // frameDoc.document.write('<link href="../dist/css/AdminLTE.min.css" rel="stylesheet" type="text/css" />');

        frameDoc.document.write('<link href="content/css/bootstrap.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/w3.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/ionicons.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/fontawsome2.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/dx.common.css" rel="stylesheet" />');

        frameDoc.document.write('<link href="content/css/main.css" rel="stylesheet" />');
        frameDoc.document.write('<link href="content/css/fontawsome2.css" rel="stylesheet" />');
        frameDoc.document.write('<link href="content/css/efb.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/core-ui.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/ejthemes/default-theme/ej.web.all.min.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/default.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/default-responsive.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/ejthemes/responsive-css/ej.responsive.css" rel="stylesheet" />');
        //Append the DIV contents.
        frameDoc.document.write(contents);
        frameDoc.document.write('</body></html>');
        frameDoc.document.close();
        setTimeout(function () {
            //nilo
            if (ofp) {
                /////////////////
                var sob = 0;
                var sobValue = null;
                var sobprops = ['prop_pax_adult', 'prop_pax_child', 'prop_pax_infant', crewAId, crewBId, crewCId];


                $.each($scope.OFP.props, function (_i, _d) {

                    if (_d.PropName == sobId) {

                        sobValue = _d.PropValue;
                    }


                    if (_d.PropValue)
                        $('#_iframe').contents().find('#' + _d.PropName).val(_d.PropValue);
                    if (_d.PropName == 'prop_pax_adult') {
                        $('#_iframe').contents().find('#' + _d.PropName).val($scope.selectedFlight.PaxAdult);

                    }
                    if (_d.PropName == 'prop_pax_child') {
                        $('#_iframe').contents().find('#' + _d.PropName).val($scope.selectedFlight.PaxChild);

                    }
                    if (_d.PropName == 'prop_pax_infant') {
                        $('#_iframe').contents().find('#' + _d.PropName).val($scope.selectedFlight.PaxInfant);

                    }
                    //prop_offblock

                    if (_d.PropName == 'prop_offblock') {
                        $('#_iframe').contents().find('#' + _d.PropName).val(toTime(($scope.selectedFlight.BlockOff)));

                    }
                    //prop_takeoff
                    if (_d.PropName == 'prop_takeoff') {

                        $('#_iframe').contents().find('#' + _d.PropName).val(toTime(($scope.selectedFlight.TakeOff)));

                    }
                    //prop_landing
                    if (_d.PropName == 'prop_landing') {
                        $('#_iframe').contents().find('#' + _d.PropName).val(toTime(($scope.selectedFlight.Landing)));

                    }
                    //prop_onblock
                    if (_d.PropName == 'prop_onblock') {
                        $('#_iframe').contents().find('#' + _d.PropName).val(toTime($scope.selectedFlight.BlockOn));

                    }

                    if (sobprops.indexOf(_d.PropName) != -1) {
                        var vlu = _toNum($('#_iframe').contents().find('#' + _d.PropName).val());
                        if (!isNaN(vlu))
                            sob += vlu;
                    }

                });


                if (sob != sobValue) {
                    $('#_iframe').contents().find('#' + sobId).val(sob);

                }
                if (true) {
                    var times = $('#_iframe').contents().find("input[data-info^='time_']");// $("input[data-info^='time_']");
                    var objs = [];
                    $.each(times, function (_w, _t) {
                        var data = $(_t).data('info');
                        objs.push({ id: $(_t).attr('id'), index: Number(data.split('_')[1]), value: data.split('_')[2] });
                    });
                    objs = Enumerable.From(objs).OrderBy('$.index').ToArray();
                    var to = CreateDate($scope.selectedFlight.TakeOff);
                    $.each(objs, function (_w, _t) {
                        to = new Date(to.addMinutes(_t.value));
                        $('#_iframe').contents().find('#' + _t.id).val(toTime(to));

                    });
                }


                if ($scope.url_sign)
                    $('#_iframe').contents().find('#sig_pic_img').attr('src', $scope.url_sign);
                else
                    $('#_iframe').contents().find('#sig_pic_img').attr('src', '');

                /////END OFP
            }





            var pos1 = $('#_iframe').contents().find('#pos1');
            var pos2 = $('#_iframe').contents().find('#pos2');
            var vr = $('#_iframe').contents().find('#vr');
            var asr = $('#_iframe').contents().find('#asr');
            var jlsign = $('#_iframe').contents().find('#_jlsign');
            if ($scope.jl.pos1)
                pos1.prop('checked', true);
            if ($scope.jl.pos2)
                pos2.prop('checked', true);
            if ($scope.jl.asr)
                asr.prop('checked', true);
            if ($scope.jl.vr)
                vr.prop('checked', true);
            if ($scope.jl.sign)
                // jlsign.css('background-image', 'url("' + $scope.jl.sign + '")');
                jlsign.attr('src', $scope.jl.sign);
            setTimeout(function () {
                window.frames["frame1"].focus();
                window.frames["frame1"].print();
                frame1.remove();
            }, 2000);


        }, 500);
    }
    $scope.scroll_jl_height = 200;
    $scope.scroll_jl = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_jl_height', }
    };
    $scope.popup_jl_visible = false;
    $scope.popup_jl_title = 'Journey Log';
    $scope.popup_jl = {
        shading: true,
        width: 1150,
        height: function () { return $(window).height() * 1 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [



            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Print', icon: 'print', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {


                        printElem($('#jl'));


                    }


                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_jl_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.scroll_jl_height = $(window).height() - 10 - 110;

        },
        onShown: function (e) {

            $('#pos1').prop('checked', $scope.jl.pos1);

            $('#pos2').prop('checked', $scope.jl.pos2);
            $('#vr').prop('checked', $scope.jl.vr);
            $('#asr').prop('checked', $scope.jl.asr);
            if ($scope.jl.sign)
                $("#_jlsign").attr('src', $scope.jl.sign);
        },
        onHiding: function () {
            $scope.jl = { asr: false, vr: false, pos1: false, pos2: false, sign: '' };
            $('#pos1').prop('checked', $scope.jl.pos1);
            $('#pos2').prop('checked', $scope.jl.pos2);
            $('#vr').prop('checked', $scope.jl.vr);
            $('#asr').prop('checked', $scope.jl.asr);
            $("#_jlsign").attr('src', '');
            $scope.popup_jl_visible = false;

        },
        bindingOptions: {
            visible: 'popup_jl_visible',

            title: 'popup_jl_title',


        }
    };
    /////////////////////////


    $scope.btn_persiandate = {
        //text: 'Search',
        type: 'default',
        icon: 'event',
        width: 35,
        //validationGroup: 'dlasearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.popup_date_visible = true;
        }

    };
    $scope.popup_date_visible = false;
    $scope.popup_date_title = 'Date Picker';
    var pd1 = null;
    var pd2 = null;
    $scope.popup_date = {
        title: 'Shamsi Date Picker',
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 200,
        width: 300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,


        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {

            pd1 = $(".date1").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {

                    //console.log(new Date(unix));
                    $scope.$apply(function () {

                        $scope.dt_from = new Date(unix);
                    });

                },

            });
            pd1.setDate(new Date($scope.dt_from.getTime()));
            pd2 = $(".date2").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {
                    $scope.$apply(function () {
                        $scope.dt_to = new Date(unix);
                    });
                },

            });
            pd2.setDate(new Date($scope.dt_to.getTime()));

        },
        onHiding: function () {
            pd1.destroy();
            pd2.destroy();
            $scope.popup_date_visible = false;

        },
        showCloseButton: true,
        bindingOptions: {
            visible: 'popup_date_visible',



        }
    };
    /////////////////////////////////////////


    $scope.bind = function () {
        //iruser558387
        var dts = [];
        if ($scope.dt_to) {
            var _dt = moment($scope.dt_to).format('YYYY-MM-DDTHH:mm:ss');
            dts.push('dt=' + _dt);
        }
        if ($scope.dt_from) {
            var _df = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');
            dts.push('df=' + _df);
        }
        dts.push('status=' + ($scope.fstatus ? $scope.fstatus : 'null'));
        dts.push('ip=' + ($scope.ip ? $scope.ip : 'null'));
        dts.push('cpt=' + ($scope.cpt ? $scope.cpt : 'null'));
        dts.push('asrvr=' + ($scope.fasrvr ? $scope.fasrvr : 'null'));


        var prms = dts.join('&');


        var url = 'api/applegs';//2019-06-06T00:00:00';
        if ($scope.isOPSStaff)
            url += "/1/";
        else
            url += "/0/";
        if (prms)
            url += '?' + prms;
        $scope.loadingVisible = true;

        flightBagService.getAppLegs(url).then(function (response) {
            $scope.loadingVisible = false;

            $.each(response, function (_i, _d) {
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                if (_d.JLSignedBy) {
                    //$scope.isEditable = false;
                    _d.url_sign = signFiles + _d.PICId + ".jpg";
                    _d.PIC2 = _d.PIC;
                    _d.signDate = moment(new Date(_d.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
                }

                //    var std = (new Date(_d.STDDay));
                //    persianDate.toLocale('en');
                //    _d.STDDayPersian = new persianDate(std).format("DD-MM-YYYY");
                //    _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                //    _d.SITATime2 = $scope.formatMinutes(_d.SITATime);
                //    _d.FlightTimeActual2 = $scope.formatMinutes(_d.FlightTimeActual);
                //    _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);



                //    _d.TaxiTO = subtractDates(_d.Takeoff, _d.ChocksOut);
                //    _d.TaxiLND = subtractDates(_d.ChocksIn, _d.Landing);
                //    _d.TaxiTO2 = $scope.formatMinutes(_d.TaxiTO);
                //    _d.TaxiLND2 = $scope.formatMinutes(_d.TaxiLND);

                //    //magu6
                //    _d.TotalPaxAll = _d.TotalPax + _d.PaxInfant;
            });
            $scope.dg_flight_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        if ($scope.doRefresh) {
            //  $scope.filters = $scope.getFilters();
            //  $scope.dg_flight_ds.filter = $scope.filters;
            $scope.doRefresh = false;
            $scope.dg_flight_instance.refresh();
        }

    };
    //////////////////////////////////////////
    $scope.dt_to = new Date().addDays(0);
    $scope.dt_from = new Date().addDays(0);
    var startDate = new Date(2019, 10, 30);
    if (startDate > $scope.dt_from)
        $scope.dt_from = startDate;

    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',

        bindingOptions: {
            value: 'dt_from',

        }
    };
    $scope.date_to = {
        type: "date",
        placeholder: 'To',
        width: '100%',

        bindingOptions: {
            value: 'dt_to',

        }
    };
    ///////////////////////////////////
    $scope.formatMinutes = function (mm) {
        if (!mm)
            return "";
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    };
    $scope.getCrewFlightsTotal = function (df, dt) {

        $scope.loadingVisible = true;
        flightService.getCrewFlightsTotal(df, dt).then(function (response) {
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {

                // _d.DurationH = Math.floor(_d.FlightTime / 60);
                // _d.DurationM = _d.FlightTime % 60;
                // var fh = _d.FlightH * 60 + _d.FlightM;
                _d.FlightTime2 = $scope.formatMinutes(_d.FlightTime);
                _d.FixTime2 = $scope.formatMinutes(_d.FixTime);
                //var bm = _d.BlockH * 60 + _d.BlockM;
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d.SITATime2 = $scope.formatMinutes(_d.SITATime);
            });
            $scope.dg_flight_total_ds = response;



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.getCrewFlights = function (id, df, dt) {
        $scope.dg_flight_ds = null;
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getCrewFlights(id, df, dt).then(function (response) {
            console.log(response);
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.Route = _d.FromAirportIATA + '-' + _d.ToAirportIATA;
                _d.STA = (new Date(_d.STA)).addMinutes(offset);

                _d.STD = (new Date(_d.STD)).addMinutes(offset);
                if (_d.ChocksIn)
                    _d.ChocksIn = (new Date(_d.ChocksIn)).addMinutes(offset);
                if (_d.ChocksOut)
                    _d.ChocksOut = (new Date(_d.ChocksOut)).addMinutes(offset);
                if (_d.Takeoff)
                    _d.Takeoff = (new Date(_d.Takeoff)).addMinutes(offset);
                if (_d.Landing)
                    _d.Landing = (new Date(_d.Landing)).addMinutes(offset);
                _d.DurationH = Math.floor(_d.FlightTime / 60);
                _d.DurationM = _d.FlightTime % 60;
                var fh = _d.FlightH * 60 + _d.FlightM;

                _d.FlightTime2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();
                _d.ScheduledFlightTime2 = $scope.formatMinutes(_d.ScheduledFlightTime);

                var bm = _d.ActualFlightHOffBlock * 60 + _d.ActualFlightMOffBlock;
                //_d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d.SITATime2 = $scope.formatMinutes(_d.SITATime);
                _d.FixTime2 = $scope.formatMinutes(_d.FixTime);
                _d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
                //poosk
            });
            $scope.dg_flight_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    //////////////////////////////////
    $scope.loadingVisible = false;
    $scope.loadPanel = {
        message: 'Please wait...',

        showIndicator: true,
        showPane: true,
        shading: true,
        closeOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        // position: { of: "body" },
        onShown: function () {

        },
        onHidden: function () {

        },
        bindingOptions: {
            visible: 'loadingVisible'
        }
    };
    ////////////////////////////////////
    $scope.statusDs = [
        { Id: 1, Title: 'Done' },
        { Id: 2, Title: 'Scheduled' },
        { Id: 3, Title: 'Canceled' },
        { Id: 4, Title: 'Starting' },
        { Id: 5, Title: 'All' },
    ];
    $scope.fstatus = 5;
    $scope.sb_Status = {
        placeholder: 'Status',
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.statusDs,

        onSelectionChanged: function (arg) {

        },

        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'fstatus',


        }
    };


    $scope.asrvrDs = [
        { Id: 1, Title: 'ASR & VR' },

        { Id: 5, Title: 'All' },
    ];
    $scope.fasrvr = 5;
    $scope.sb_asrvr = {
        placeholder: 'ASR & VR',
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.asrvrDs,

        onSelectionChanged: function (arg) {

        },

        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'fasrvr',



        }
    };


    $scope.ip = null;
    $scope.sb_IP = {
        placeholder: 'IP',
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceIP(),

        onSelectionChanged: function (arg) {

        },
        searchExpr: ["ScheduleName", "Name"],
        displayExpr: "ScheduleName",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'ip',


        }
    };
    $scope.cpt = null;
    $scope.sb_CPT = {
        placeholder: 'Captain',
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceCaptain(),

        onSelectionChanged: function (arg) {

        },
        searchExpr: ["ScheduleName", "Name"],
        displayExpr: "ScheduleName",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'cpt',


        }
    };
    //////////////////////////////////
    $scope.formatDate = function (dt) {
        return moment(new Date(dt)).format('MMM-DD-YYYY').toUpperCase();
    };
    $scope.formatDateTime = function (dt) {
        return moment(new Date(dt)).format('MMM-DD-YYYY  HH:mm').toUpperCase();
    };
    $scope.formatTime = function (dt) {
        if (!dt) return "";
        return moment(new Date(dt)).format('HH:mm').toUpperCase();
    };
    $scope.formatTime2 = function (date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();

        //hours = hours % 12;
        //hours = hours ? hours : 12; // the hour '0' should be '12'
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes;
        return strTime;
    }
    $scope.getTimeFormated = function (dt) {
        if (!dt)
            return "-";
        //if ($scope.userName.toLowerCase() == 'shamsi')
        //    alert(dt);
        if (dt.toString().indexOf('T') != -1) {
            var prts = dt.toString().split('T')[1];
            var tm = prts.substr(0, 5);
            return (tm);
        }
        var _dt = new Date(dt);
        //new Date(year, month, day, hours, minutes, seconds, milliseconds)
        return $scope.formatTime2(_dt);
    };
    $scope.getTimeHHMM = function (dt) {
        persianDate.toLocale('en');
        return moment(dt).format('HHmm');
    };
    $scope.getTimeHHMM2 = function (x, prm) {
        if (!x || !x[prm])
            return '-';
        return moment(x[prm]).format('HHmm');
    };
    $scope.formatDateLong = function (dt) {
        return moment(dt).format('ddd DD MMM YY');
    };
    $scope.formatDateShort = function (dt) {
        return moment(dt).format('YYYY-MM-DD');
    };
    $scope.getDuration = function (x) {
        if (!x)
            return "-";
        if (x < 0) {
            x = -x;
            return "- " + pad(Math.floor(x / 60)).toString() + ':' + pad(x % 60).toString();
        }
        return pad(Math.floor(x / 60)).toString() + ':' + pad(x % 60).toString();
    };
    $scope.getStatusClass = function (item) {

        return "fa fa-circle " + item.FlightStatus.toLowerCase();
    };
    $scope.getStatus = function (item) {

        switch (item) {
            case 'OffBlocked':
                return 'Block Off';
            case 'OnBlocked':
                return 'Block On';
            case 'Departed':
                return 'Take Off';
            case 'Arrived':
                return 'Landing';

            default:
                return item;
        }
    };
    $scope.getBlockOff = function (x, b) {
        if (!x)
            return '-';
        if (!b)
            return $scope.getTimeHHMM2(x, 'BlockOff');
        //if (b && [3, 15].indexOf(x.FlightStatusId) == -1)
        //    return '-'
        return $scope.getTimeHHMM2(x, 'BlockOff');
    };
    $scope.getBlockOn = function (x, b) {
        if (!x)
            return '-';
        if (!b)
            return $scope.getTimeHHMM2(x, 'BlockOn');
        //if (b && [3, 15].indexOf(x.FlightStatusId) == -1)
        //    return '-';
        return $scope.getTimeHHMM2(x, 'BlockOn');
    };
    $scope.getTakeOff = function (x, b) {
        if (!x)
            return '-';
        if (!b)
            return $scope.getTimeHHMM2(x, 'TakeOff');
        //if (b && [3, 15].indexOf(x.FlightStatusId) == -1)
        //    return '-';
        return $scope.getTimeHHMM2(x, 'TakeOff');
    };
    $scope.getLanding = function (x, b) {
        if (!x)
            return '-';
        if (!b)
            return $scope.getTimeHHMM2(x, 'Landing');
        // if (b && [3, 15].indexOf(x.FlightStatusId) == -1)
        //     return '-';
        return $scope.getTimeHHMM2(x, 'Landing');
    };
    $scope.getSTD = function (x) {
        return $scope.getTimeHHMM2(x, 'STD');
    };
    $scope.getSTA = function (x) {
        return $scope.getTimeHHMM2(x, 'STA');
    };



    $scope.getBlockOffLocal = function (x, b) {
        if (!x)
            return '-';
        if (!b)
            return $scope.getTimeHHMM2(x, 'BlockOffLocal');
        if (b && [3, 15].indexOf(x.FlightStatusId) == -1)
            return '-'
        return $scope.getTimeHHMM2(x, 'BlockOffLocal');
    };
    $scope.getBlockOnLocal = function (x, b) {
        if (!x)
            return '-';
        if (!b)
            return $scope.getTimeHHMM2(x, 'BlockOnLocal');
        if (b && [3, 15].indexOf(x.FlightStatusId) == -1)
            return '-';
        return $scope.getTimeHHMM2(x, 'BlockOnLocal');
    };
    $scope.getTakeOffLocal = function (x, b) {
        if (!x)
            return '-';
        if (!b)
            return $scope.getTimeHHMM2(x, 'TakeOffLocal');
        if (b && [3, 15].indexOf(x.FlightStatusId) == -1)
            return '-';
        return $scope.getTimeHHMM2(x, 'TakeOffLocal');
    };
    $scope.getLandingLocal = function (x, b) {
        if (!x)
            return '-';
        if (!b)
            return $scope.getTimeHHMM2(x, 'LandingLocal');
        if (b && [3, 15].indexOf(x.FlightStatusId) == -1)
            return '-';
        return $scope.getTimeHHMM2(x, 'LandingLocal');
    };
    $scope.getSTDLocal = function (x) {
        return $scope.getTimeHHMM2(x, 'STDLocal');
    };
    $scope.getSTALocal = function (x) {
        return $scope.getTimeHHMM2(x, 'STALocal');
    };

    $scope.showMVTTime = function (x) {
        //  if (!x)
        //      return false;
        //  return [1, 4].indexOf(x.FlightStatusId) == -1;
        return true;
    };
    ////////////////////

    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.tabs = [

        { text: "LOG", id: 'log' },
        { text: "OFP", id: 'ofp' },
        { text: "METAR", id: 'metar' },
        { text: "TAF", id: 'taf' },
        { text: "NOTAM", id: 'notam' },
        { text: "CHARTS", id: 'charts' },
        { text: "DOCUMENTS", id: 'docs' },
    ];

    $scope.$watch("selectedTabIndex", function (newValue) {

        try {
            $('.tabc').hide();
            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $('#' + id).fadeIn();

            switch (id) {
                case 'calendar':
                    $scope.bindCrew();
                    break;
                case 'route':

                    break;
                case 'register':

                    break;
                case 'errors':
                    $scope.bindASRs();
                    break;

                default:
                    break;
            }
            if ($scope.dg_errors_instance)
                $scope.dg_errors_instance.refresh();
            if ($scope.dg_crew_instance)
                $scope.dg_crew_instance.refresh();
        }
        catch (e) {

        }

    });
    $scope.tabs_options = {
        scrollByContent: true,
        showNavButtons: true,


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabIndex = -1;
            $scope.selectedTabIndex = 0;
        },
        bindingOptions: {
            //visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };

    $scope.rightHeight = $(window).height() - 205;
    $scope.scroll_right = {
        width: '100%',
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: true,
        refreshingText: 'Updating...',
        onPullDown: function (options) {

            options.component.release();

        },
        onInitialized: function (e) {


        },
        bindingOptions: {
            height: 'rightHeight'
        }

    };

    ///////////////////////////////////
    $scope.dg_flight_columns = [];

    $scope.dg_flight_columns = [


        //{
        //    cellTemplate: function (container, options) {
        //        $("<div style='text-align:center'/>")
        //            .html(options.rowIndex + 1)
        //            .appendTo(container);
        //    }, name: 'row', caption: '#', width: 70, fixed: true, fixedPosition: 'left', allowResizing: false, cssClass: 'rowHeader' 
        //},
        //{ dataField: 'RN', caption: '#', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 70, name: 'rn', fixed: true, fixedPosition: 'left', visible: false },

        { dataField: 'STDDay', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 120, format: 'yy-MMM-dd', sortIndex: 0, sortOrder: 'asc', fixed: true, fixedPosition: 'left' },
        //{ dataField: 'PDate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left' },
        //{ dataField: 'FlightType', caption: 'Day', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },
        { dataField: 'AttASR', caption: 'ASR', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 50, fixed: true, fixedPosition: 'left', visible: $scope.ASRVR },
        { dataField: 'AttVoyageReport', caption: 'VR', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 50, fixed: true, fixedPosition: 'left', visible: $scope.ASRVR },
        { dataField: 'FlightNumber', caption: 'Flight No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },
        { dataField: 'FlightStatus', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: false, fixedPosition: 'left', fixed: true, fixedPosition: 'left' },
        { dataField: 'AircraftType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 90, sortIndex: 1, sortOrder: 'asc' },
        { dataField: 'Register', caption: 'Reg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, sortIndex: 2, sortOrder: 'asc' },
        { dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80 },
        //{ dataField: 'STDLocal', caption: 'Sch. Dep.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm', },
        //{ dataField: 'STALocal', caption: 'Sch. Arr.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 115, format: 'HH:mm' },
        //{ dataField: 'DepartureLocal', caption: 'Dep.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm', sortIndex: 2, sortOrder: 'asc' },
        //{ dataField: 'ArrivalLocal', caption: 'Arr.', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },



        //{ dataField: 'PaxAdult', caption: 'Adult', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
        //{ dataField: 'PaxChild', caption: 'Child.', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
        //{ dataField: 'PaxInfant', caption: 'Infant', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
        //magu6
        //{ dataField: 'TotalPax', caption: 'Revenued Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
        //{ dataField: 'TotalPaxAll', caption: 'Total Pax', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },

        // { dataField: 'FuelDeparture', caption: 'UpLift', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
        //{ dataField: 'CargoCount', caption: 'Cargo', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
        //{ dataField: 'CargoWeight', caption: 'Cargo(W)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },

        //{ dataField: 'BaggageCount', caption: 'Baggage', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },
        //{ dataField: 'BaggageWeight', caption: 'Baggage(W)', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, },



        //{ dataField: 'CockpitTotal', caption: 'Cockpit', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
        // { dataField: 'CabinTotal', caption: 'Cabin', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 90, },
        { dataField: 'P1Name', caption: 'Captain', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'IPName', caption: 'IP', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },

        //   { dataField: 'FO', caption: 'FO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        //   { dataField: 'Safety', caption: 'Safety', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },



        { dataField: 'BlockTime2', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },
        { dataField: 'FlightTime2', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },

        //{ dataField: 'TaxiTO2', caption: 'Taxi T/O', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right', visible: isTaxiVisible },
        //{ dataField: 'TaxiLND2', caption: 'Taxi LND', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right', visible: isTaxiVisible },

        //{ dataField: 'FlightTime2', caption: 'Sch. FLT Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right' },
        //{ dataField: 'SITATime2', caption: 'SITA FLT Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right' },
        //{ dataField: 'FlightTimeActual2', caption: 'Act. FLT Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'right' },
        //{ dataField: 'BlockTime2', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },
        // { dataField: 'ActualFlightTimeToSITA', caption: 'Actual/SITA', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 100, fixed: true, fixedPosition: 'right' },








    ];

    $scope.dg_flight_selected = null;
    $scope.dg_flight_instance = null;
    $scope.dg_flight_ds = null;
    $scope.selectedFlight = null;
    $scope.selectedFlightCrews = [];
    $scope.OFP = null;
    $scope.OFPHtml = '';
    var crewAId = null;
    var crewBId = null;
    var crewCId = null;
    var sobId = null;
    $scope.bindCrews = function (flightId) {
        $scope.selectedFlightCrews = [];
        //$scope.loadingVisible = true;
        flightBagService.getAppLegCrews(flightId).then(function (response) {
            $scope.selectedFlightCrews = response;

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    var toTime = function (dt) {
        if (!dt)
            return "";



        return moment(new Date(dt)).format('HHmm');
    };
    var _toNum = function (v) {
        try {
            return !v ? 0 : Number(v);
        }
        catch (e) {
            return 0;
        }
    };
    function CreateDate(s) {
        if (!s)
            return null;
        s = s.toString();
        var prts = s.split('T');
        var dts = prts[0].split('-');
        var tms = prts[1].split(':');
        var dt = new Date(dts[0], dts[1] - 1, dts[2], tms[0], tms[1], tms[2]);
        // var b = s.split(/\D+/);
        // return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
        return dt;
    }
    $scope.fillProps = function (props) {
        $('.prop').html(' ');

        //9-11

        var sob = 0;
        var sobValue = null;
        var sobprops = ['prop_pax_adult', 'prop_pax_child', 'prop_pax_infant', crewAId, crewBId, crewCId];



        $.each(props, function (_i, _d) {

            if (_d.PropName == sobId) {

                sobValue = _d.PropValue;
            }


            if (_d.PropValue)
                $('#' + _d.PropName).val(_d.PropValue);
            if (_d.PropName == 'prop_pax_adult') {
                $('#' + _d.PropName).val($scope.selectedFlight.PaxAdult);

            }
            if (_d.PropName == 'prop_pax_child') {
                $('#' + _d.PropName).val($scope.selectedFlight.PaxChild);

            }
            if (_d.PropName == 'prop_pax_infant') {
                $('#' + _d.PropName).val($scope.selectedFlight.PaxInfant);

            }
            //prop_offblock

            if (_d.PropName == 'prop_offblock') {
                $('#' + _d.PropName).val(toTime(($scope.selectedFlight.BlockOff)));

            }
            //prop_takeoff
            if (_d.PropName == 'prop_takeoff') {

                $('#' + _d.PropName).val(toTime(($scope.selectedFlight.TakeOff)));

            }
            //prop_landing
            if (_d.PropName == 'prop_landing') {
                $('#' + _d.PropName).val(toTime(($scope.selectedFlight.Landing)));

            }
            //prop_onblock
            if (_d.PropName == 'prop_onblock') {
                $('#' + _d.PropName).val(toTime($scope.selectedFlight.BlockOn));

            }

            if (sobprops.indexOf(_d.PropName) != -1) {
                var vlu = _toNum($('#' + _d.PropName).val());
                if (!isNaN(vlu))
                    sob += vlu;
            }

        });

        if (sob != sobValue) {
            $('#' + sobId).val(sob);

        }
        if (true) {
            var times = $("input[data-info^='time_']");
            var objs = [];
            $.each(times, function (_w, _t) {
                var data = $(_t).data('info');
                objs.push({ id: $(_t).attr('id'), index: Number(data.split('_')[1]), value: data.split('_')[2] });
            });
            objs = Enumerable.From(objs).OrderBy('$.index').ToArray();
            var to = CreateDate($scope.selectedFlight.TakeOff);
            $.each(objs, function (_w, _t) {
                to = new Date(to.addMinutes(_t.value));
                $('#' + _t.id).val(toTime(to));

            });
        }


        if ($scope.url_sign)
            $('#sig_pic_img').attr('src', $scope.url_sign);
        else
            $('#sig_pic_img').attr('src', '');

    };
    function _printElem($elem) {

        var contents = $elem.html();//'<h1>Vahid</h1>' $elem.html();
        var frame1 = $('<iframe />');
        frame1[0].name = "frame1";
        frame1.css({ "position": "absolute", "top": "-1000000px" });
        $("body").append(frame1);
        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
        frameDoc.document.open();
        //Create a new HTML document.
        frameDoc.document.write('<html><head><title></title>');
        frameDoc.document.write('</head><body>');
        //Append the external CSS file.
        //frameDoc.document.write('<link href="content/css/main.css" rel="stylesheet" type="text/css" />');
        // frameDoc.document.write('<link href="../dist/css/AdminLTE.min.css" rel="stylesheet" type="text/css" />');

        frameDoc.document.write('<link href="content/css/bootstrap.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/w3.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/ionicons.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/fontawsome2.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/dx.common.css" rel="stylesheet" />');

        frameDoc.document.write('<link href="content/css/main.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="content/css/core-ui.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/ejthemes/default-theme/ej.web.all.min.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/default.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/default-responsive.css" rel="stylesheet" />');
        //frameDoc.document.write('<link href="sfstyles/ejthemes/responsive-css/ej.responsive.css" rel="stylesheet" />');
        //Append the DIV contents.
        frameDoc.document.write(contents);
        frameDoc.document.write('</body></html>');
        frameDoc.document.close();
        setTimeout(function () {
            window.frames["frame1"].focus();
            window.frames["frame1"].print();
            frame1.remove();
        }, 500);
    }
    $scope._COR = function (r) {
        //if (r.FRE)
        //    return r.FRE;
        return r.COR;
    }

    $scope._Empty = function (d) {
        if (d == 0)
            return '';
        return d;
    }
    $scope._Time = function (d) {
        if (!d)
            return d;
        return d.substr(0, 5);
    }
    $scope.fillSOB = function () {
        var _sob = ($scope.selectedFlight.PaxAdult ? $scope.selectedFlight.PaxAdult : 0)
            + ($scope.selectedFlight.PaxChild ? $scope.selectedFlight.PaxChild : 0)
            + ($scope.selectedFlight.PaxInfant ? $scope.selectedFlight.PaxInfant : 0);
        var c1 = $('#prop_crew1').val();
        var c2 = $('#prop_crew2').val();
        var c3 = $('#prop_crew3').val();
        _sob += (c1 ? _toNum(c1) : 0) + (c2 ? _toNum(c2) : 0) + (c3 ? _toNum(c3) : 0);
        $('#prop_sob').val(_sob);
    }
    function time_convert(num) {
        var hours = Math.floor(num / 60);
        var minutes = num % 60;
        return hours.toString().padStart(2, '0') + minutes.toString().padStart(2, '0');
    }
    $scope.fillETA = function () {
        if ($scope.selectedFlight.TakeOff) {
            var tos = moment(CreateDate($scope.selectedFlight.TakeOff)).format('HHmm');
            var to = _toNum(tos.substr(0, 2)) * 60 + _toNum(tos.substr(2, 2));

            $.each($scope.entity.JPlan, function (_i, _d) {
                var mm = _toNum(_d.TTM.split(':')[0]) * 60 + _toNum(_d.TTM.split(':')[1]);

                if (_i == 0) {
                    var n = mm + to;
                    $('#prop_' + _d._key + '_eta_' + _i).val(time_convert(n));
                    _d.eta = time_convert(n);
                }
                else {
                    var pre = $scope.entity.JPlan[_i - 1];
                    //var pre_eta = $('#prop_' + _d._key + '_eta_' + (_i - 1).toString()).val();
                    var pre_eta = pre.eta;
                    var pre_ata = $('#prop_' + pre._key + '_ata_' + (_i - 1).toString()).val();
                    var _t = pre_ata ? pre_ata : pre_eta;

                    var _tn = _toNum(_t.substr(0, 2)) * 60 + _toNum(_t.substr(2, 2));
                    _tn += _toNum(_d.TME.split(':')[0]) * 60 + _toNum(_d.TME.split(':')[1]);
                    $('#prop_' + _d._key + '_eta_' + _i).val(time_convert(_tn));
                    _d.eta = time_convert(_tn);
                }

                //var _base = CreateDate($scope.flight.TakeOff);
                //var _eta = new Date(_base.addMinutes(mm));
                // $('#prop_' + _d._key + '_eta_' + _i).val(toTime(_eta));
            });
        }
    }
    $scope.fuel_total = 0;
    $scope.plan_fuel_offblock = 0;
    $scope.plan_fuel_takeoff = 0;
    $scope.fillOFP = function (data, callback) {
        data.JPlan = data.JPlan ? JSON.parse(data.JPlan) : [];
        data.JAPlan1 = data.JAPlan1 ? JSON.parse(data.JAPlan1) : [];
        data.JAPlan2 = data.JAPlan2 ? JSON.parse(data.JAPlan2) : [];
        data.JFuel = data.JFuel ? JSON.parse(data.JFuel) : [];

        data.JCSTBL = data.JCSTBL ? JSON.parse(data.JCSTBL) : [];
        data.JALDRF = data.JALDRF ? JSON.parse(data.JALDRF) : [];
        data.JALDRF_FL = Enumerable.From(data.JALDRF).Where('$.FL =="320"').FirstOrDefault();
        data.JALDRF = Enumerable.From(data.JALDRF).Where('$.FL !="320"').ToArray();

        data.JWTDRF = data.JWTDRF ? JSON.parse(data.JWTDRF) : [];

        console.log('JPlan', data.JPlan);
        $scope.plan_fuel_offblock = 0;
        $scope.plan_fuel_takeoff = 0;
        try {

            //11-26
            $scope.selectedFlight.ALT1 = data.JAPlan1.slice(-1).pop().WAP;

            $scope.fuel_total = $scope.selectedFlight.FuelRemaining + $scope.selectedFlight.FuelUplift;
            var p_offblock = Enumerable.From(data.JFuel).Where('$._key=="fuel_offblk"').FirstOrDefault();
            if (p_offblock)
                $scope.plan_fuel_offblock = p_offblock.value;


            var p_tof = Enumerable.From(data.JFuel).Where('$._key=="fuel_tof"').FirstOrDefault();
            if (p_tof)
                $scope.plan_fuel_takeoff = p_tof.value;

            p_tof.value = $scope.fuel_total - 200;
            p_offblock.value = $scope.fuel_total;

            $.each(data.JPlan, function (_i, _d) {
                _d._FRE = _d.FRE;
                _d.FRE = $scope.fuel_total - _d.FUS;
            });

            $scope.bindStations();

        }
        catch (e_f) {
        }







        console.log('plan offblock   ASDASDASDASD ', $scope.plan_fuel_offblock);
        try {

            var lst = data.JPlan[data.JPlan.length - 1].TTM;
            var mm = _toNum(lst.split(':')[0]) * 60 + _toNum(lst.split(':')[1]);

            var _base = $scope.selectedFlight.TakeOff ? CreateDate($scope.selectedFlight.TakeOff) : CreateDate($scope.selectedFlight.STD);

            $scope.ETA = new Date(_base.addMinutes(mm));

        }
        catch (eer) {

        }

        $scope.entity = data;
        setTimeout(function () {
            callback();
        }, 100);

    };
    function isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }
    $scope.alt1 = null;
    $scope.bindOFP = function (flightId) {
        $scope.url_sign = null;
        $scope.PIC = null;
        $scope.signDate = null;
        $scope.OFP = null;
        $scope.OFPHtml = '';
        //$scope.loadingVisible = true;

        flightBagService.getAppLegOFP(flightId).then(function (response) {
            $scope.fillOFP(response, function () {
                $scope.props = response.props;
                var updates = [];
                var takeOffChanged = false;
                var sob = 0;
                var sobValue = null;
                var sobprops = ['prop_pax_adult', 'prop_pax_child', 'prop_pax_infant', crewAId, crewBId, crewCId];
                $('#prop_fuel_req').attr('readonly', true).addClass('noborder');
                $.each($scope.props, function (_i, _d) {


                    if (_d.PropName == 'prop_fuel_extra') {

                        if ($scope.fuel_total)
                            $('#' + _d.PropName).val($scope.fuel_total - $scope.plan_fuel_offblock);
                        else
                            $('#' + _d.PropName).val(0);
                        $('#' + _d.PropName + '_due').val($scope.selectedFlight.ALT3);
                    }

                    else
                        if (_d.PropValue)
                            $('#' + _d.PropName).val(_d.PropValue);

                    if (_d.PropName.includes('_usd_') && isNumeric(_d.PropValue)) {

                        try {
                            var ofp = $('#' + _d.PropName).data('ofp');
                            var diff = Number($('#' + _d.PropName).val()) - Number(ofp);


                            var diffId = $('#' + _d.PropName).attr('id').replace('_usd_', '_dusd_');
                            $('#' + diffId).val(diff);
                        }
                        catch (ex) {

                        }

                    }

                    if (_d.PropName == 'prop_fuel_req' && $scope.dr) {
                        $('#' + _d.PropName).val($scope.dr.MinFuelRequiredPilotReq);
                        updates.push({ OFPId: $scope.entity.Id, PropName: _d.PropName, User: $rootScope.userTitle, PropValue: $scope.selectedFlight.PaxAdult });
                    }


                    if (_d.PropName == 'prop_pax_adult' /*&& $scope.flight.PaxAdult != _d.PropValue*/) {
                        $('#' + _d.PropName).val($scope.selectedFlight.PaxAdult);
                        updates.push({ OFPId: $scope.entity.Id, PropName: _d.PropName, User: $rootScope.userTitle, PropValue: $scope.selectedFlight.PaxAdult });

                    }
                    if (_d.PropName == 'prop_pax_child' /*&& $scope.flight.PaxChild != _d.PropValue*/) {
                        $('#' + _d.PropName).val($scope.selectedFlight.PaxChild);
                        updates.push({ OFPId: $scope.entity.Id, PropName: _d.PropName, User: $rootScope.userTitle, PropValue: $scope.selectedFlight.PaxChild });
                    }
                    if (_d.PropName == 'prop_pax_infant' /*&& $scope.flight.PaxInfant != _d.PropValue*/) {
                        $('#' + _d.PropName).val($scope.selectedFlight.PaxInfant);
                        updates.push({ OFPId: $scope.entity.Id, PropName: _d.PropName, User: $rootScope.userTitle, PropValue: $scope.selectedFlight.PaxInfant });
                    }
                    //prop_offblock

                    if (_d.PropName == 'prop_offblock' /*&& toTime(CreateDate($scope.flight.BlockOff)) != _d.PropValue*/) {
                        $('#' + _d.PropName).val(toTime(CreateDate($scope.selectedFlight.BlockOff)));
                        updates.push({ OFPId: $scope.entity.Id, PropName: _d.PropName, User: $rootScope.userTitle, PropValue: toTime(CreateDate($scope.selectedFlight.BlockOff)) });
                    }
                    //prop_takeoff
                    if (_d.PropName == 'prop_takeoff' /*&& toTime(CreateDate($scope.flight.TakeOff)) != _d.PropValue*/) {
                        takeOffChanged = true;
                        $('#' + _d.PropName).val(toTime(CreateDate($scope.selectedFlight.TakeOff)));
                        updates.push({ OFPId: $scope.entity.Id, PropName: _d.PropName, User: $rootScope.userTitle, PropValue: toTime(CreateDate($scope.selectedFlight.TakeOff)) });
                    }
                    //prop_landing
                    if (_d.PropName == 'prop_landing' /*&& toTime(CreateDate($scope.flight.Landing)) != _d.PropValue*/) {
                        $('#' + _d.PropName).val(toTime(CreateDate($scope.selectedFlight.Landing)));
                        updates.push({ OFPId: $scope.entity.Id, PropName: _d.PropName, User: $rootScope.userTitle, PropValue: toTime(CreateDate($scope.selectedFlight.Landing)) });
                    }
                    //prop_onblock
                    if (_d.PropName == 'prop_onblock' /*&& toTime(CreateDate($scope.flight.BlockOn)) != _d.PropValue*/) {
                        $('#' + _d.PropName).val(toTime(CreateDate($scope.selectedFlight.BlockOn)));
                        updates.push({ OFPId: $scope.entity.Id, PropName: _d.PropName, User: $rootScope.userTitle, PropValue: toTime(CreateDate($scope.selectedFlight.BlockOn)) });
                    }



                });
                $scope.fillSOB();
                $scope.fillETA();


            });
			/*
            $scope.OFP = response;
             
            if (response) {
		
                if (response.JLSignedBy) {
                   
                    $scope.url_sign = signFiles + response.PICId + ".png";
                    console.log($scope.url_sign);
                    $scope.PIC = response.PIC;
                    $scope.signDate = moment(new Date(response.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
                }
                else {
                    $scope.url_sign = null;
                    $scope.PIC = null;
                    $scope.signDate = null;
                }
                $scope.OFPHtml = $sce.trustAsHtml(response.TextOutput);
                setTimeout(function () {
                    var $clear = $("input[id^='prop_clearance']");
                    
                   
                    var $adult = $clear.nextAll('.prop:first');
                    crewAId = $adult.attr('id');

                    var $child = $adult.nextAll('.prop:first');
                    crewBId = $child.attr('id');

                    var $infant = $child.nextAll('.prop:first');
                    crewCId = $infant.attr('id');

                    var $sob = $('#prop_pax_infant').nextAll('.prop:first');
                    sobId = ($sob.attr('id'));
                   		console.log('sig_disp_img', signFiles+$scope.OFP.User +".png");
           $('#sig_disp_img').attr('src', signFiles+$scope.OFP.User +".png");
                    $scope.fillProps($scope.OFP.props);
				 
                }, 500);
            }*/

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.stations = [];
    $scope.selectedStations = [];
    $scope.getStationClass = function (x) {
        var index = $scope.selectedStations.indexOf(x);
        if (index != -1)
            return "station selected";
        else
            return "station";
    };
    $scope.bindStations = function () {
        $scope.stations = [];
        $scope.stations.push($scope.selectedFlight.FromAirportIATA);
        $scope.stations.push($scope.selectedFlight.ToAirportIATA);
        if ($scope.selectedFlight.ALT1)
            $scope.stations.push($scope.selectedFlight.ALT1);
        if ($scope.selectedFlight.ALT2)
            $scope.stations.push($scope.selectedFlight.ALT2);

        $scope.stations = Enumerable.From($scope.stations).Distinct().ToArray();
        $scope.stations.push('OIIX');
        $scope.selectedStations = Enumerable.From($scope.stations).ToArray();
        $scope.folderSIGWX = [];
        var dates = [];
        dates.push(moment(new Date($scope.selectedFlight.STDDayLocal)).format('YYYY-MM-DD'));
        dates.push(moment(new Date($scope.selectedFlight.STADayLocal)).format('YYYY-MM-DD'));
        dates = Enumerable.From(dates).Distinct().ToArray();
        $.each(dates, function (_i, _d) {
            var sigwx = {
                // source: g,
                date: _d,
                items: [],
            };
            sigwx.items.push({ caption: 'SIGWX Chart', no: '2105', title: 'Current', url: staticFilesSKYBAG + 'Weather/SIGWX/ADDS/SIGWX_ADDS_' + replaceAll(_d, '-', '') + '_2105.png' });
            sigwx.items.push({ caption: 'SIGWX Chart', no: '3105', title: 'Previous', url: staticFilesSKYBAG + 'Weather/SIGWX/ADDS/SIGWX_ADDS_' + replaceAll(_d, '-', '') + '_3105.png' });
            $scope.folderSIGWX.push(sigwx);
        });
    };
    $scope.showAVMETSIGWX = function (valid, rem) {
        //SIGWX_IRIMO_20210824_VALID00LVLIRAN
        var dt = moment(new Date($scope.selectedFlight.STADayLocal)).format('YYYYMMDD');
        var fn = dt + '-' + 'sig' + valid + '.png';
        var _url = staticFilesSKYBAG + 'Weather/AVMET/' + fn;

        $scope.showImage({ url: _url, caption: 'SIGWX Chart' + ' Valid: ' + rem });

    };
    $scope.getSIGWXClass = function (g, obj) {
        return '';
        return g[obj] ? "hasInfo" : '';
    };
    $scope.scroll_metar_height = $(window).height() - 280;
    $scope.scroll_metar = {
        width: '100%',
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: true,
        refreshingText: 'Updating...',
        onPullDown: function (options) {

            options.component.release();

        },
        onInitialized: function (e) {


        },
        bindingOptions: {
            height: 'scroll_metar_height'
        }

    };

    $scope.scroll_taf = {
        width: '100%',
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: true,
        refreshingText: 'Updating...',
        onPullDown: function (options) {

            options.component.release();

        },
        onInitialized: function (e) {


        },
        bindingOptions: {
            height: 'scroll_metar_height'
        }

    };
    $scope.scroll_notam = {
        width: '100%',
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: true,
        refreshingText: 'Updating...',
        onPullDown: function (options) {

            options.component.release();

        },
        onInitialized: function (e) {


        },
        bindingOptions: {
            height: 'scroll_metar_height'
        }

    };

    $scope.Metar = null;
    $scope.Taf = null;
    $scope.NOTAM = null;
    $scope.filteredMETAR = [];
    $scope.filteredTAF = [];
    $scope.filteredNOTAM = [];
    $scope.filterMetar = function () {
        $scope.filteredMETAR = Enumerable.From($scope.Metar)
            .Where(function (x) { return $scope.selectedStations.indexOf(x.StationId) != -1; })
            .OrderBy(function (x) { return $scope.stations.indexOf(x.StationId); }).ThenByDescending(function (x) {
                return Number(moment(new Date(x.observation_time)).format('YYMMDDHHmm'));

            }).ToArray();
    };
    $scope.filterTaf = function () {
        $scope.filteredTAF = Enumerable.From($scope.Taf)
            .Where(function (x) { return $scope.selectedStations.indexOf(x.StationId) != -1; })
            .OrderBy(function (x) { return $scope.stations.indexOf(x.StationId); }).ThenByDescending(function (x) {
                return Number(moment(new Date(x.observation_time)).format('YYMMDDHHmm'));

            }).ToArray();
    };
    $scope.filterNOTAM = function () {
        $scope.filteredNOTAM = Enumerable.From($scope.NOTAM)
            .Where(function (x) { return $scope.selectedStations.indexOf(x.StationId) != -1; })
            .OrderBy(function (x) { return $scope.stations.indexOf(x.StationId); }).ThenByDescending(function (x) {
                return Number(moment(new Date(x.observation_time)).format('YYMMDDHHmm'));

            })
            .ToArray();
    };
    $scope.stationClick = function (x) {
        var index = $scope.selectedStations.indexOf(x);
        if (index != -1)
            $scope.selectedStations.splice(index, 1);
        else
            $scope.selectedStations.push(x);

        $scope.filterMetar();
        $scope.filterTaf();
        $scope.filterNOTAM();

    };
    $scope.bindWX = function (flightId) {

        //$scope.loadingVisible = true;
        flightBagService.getMETAR(flightId).then(function (response) {

            $scope.Metar = response.Data;
            $scope.filterMetar();
            flightBagService.getTAF(flightId).then(function (response2) {

                $scope.Taf = response2.Data;
                $scope.filterTaf();
                flightBagService.getNOTAM(flightId).then(function (response3) {

                    $scope.NOTAM = response3.Data;
                    $scope.filterNOTAM();

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.folderSIGWX = [];
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    $scope.showWind = function (lvl, valid) {
        var dt = moment(new Date($scope.selectedFlight.STADayLocal)).format('YYYYMMDD');
        //WIND_ADDS_20210823_FL180_VALID30
        var fn = 'WIND_ADDS_' + dt + '_FL' + lvl + '_VALID' + valid + '.png';
        var _url = staticFilesSKYBAG + 'Weather/WIND/ADDS/' + fn;
        $scope.showImage({ url: _url, caption: 'Wind & Temperature Level: ' + lvl + ' Valid: ' + valid });
    };
    $scope.showImage = function (item) {
        var data = { url: item.url, caption: item.caption };

        $rootScope.$broadcast('InitImageViewer', data);
    };
    $scope.dg_flight = {
        wordWrapEnabled: false,
        rowAlternationEnabled: false,
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 500 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 115,

        columns: $scope.dg_flight_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flight_instance)
                $scope.dg_flight_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_flight_selected = null;
                $scope.selectedFlight = null;
                $scope.selectedFlightCrews = [];
            }
            else {
                $scope.dg_flight_selected = data;
                $scope.selectedFlight = data;
                $scope.bindCrews($scope.selectedFlight.FlightId);
                $scope.bindOFP($scope.selectedFlight.FlightId);

                $scope.bindWX($scope.selectedFlight.FlightId);
            }


        },
        summary: {
            totalItems: [
                {
                    column: "row",
                    summaryType: "count",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    name: "TaxiTOTotal",
                    showInColumn: "TaxiTO2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "TaxiLNDTotal",
                    showInColumn: "TaxiLND2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "TaxiTOAvg",
                    showInColumn: "TaxiTO2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                {
                    name: "TaxiLNDAvg",
                    showInColumn: "TaxiLND2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },

                {
                    name: "FlightTimeTotal",
                    showInColumn: "FlightTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "FlightTimeAvg",
                    showInColumn: "FlightTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                {
                    name: "ActualFlightTimeTotal",
                    showInColumn: "FlightTimeActual2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "ActualFlightTimeAvg",
                    showInColumn: "FlightTimeActual2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                {
                    name: "SITATimeTotal",
                    showInColumn: "SITATime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "SITATimeAvg",
                    showInColumn: "SITATime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },
                {
                    name: "BlockTimeTotal",
                    showInColumn: "BlockTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "BlockTimeAvg",
                    showInColumn: "BlockTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },

                {
                    name: "JLBlockTimeTotal",
                    showInColumn: "JLBlockTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "JLBlockTimeAvg",
                    showInColumn: "JLBlockTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },

                {
                    name: "JLFlightTimeTotal",
                    showInColumn: "JLFlightTime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                },
                {
                    name: "JLFlightTimeAvg",
                    showInColumn: "JLFlightTime2",
                    displayFormat: "Avg: {0}",

                    summaryType: "custom"
                },


                {
                    column: "PaxAdult",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "PaxAdult",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "PaxChild",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "PaxChild",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "PaxInfant",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "PaxInfant",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "TotalPax",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "TotalPax",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                //magu6
                {
                    column: "TotalPaxAll",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "TotalPaxAll",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "CockpitTotal",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },
                {
                    column: "CabinTotal",
                    summaryType: "avg",
                    customizeText: function (data) {
                        return 'Avg: ' + Number(data.value).toFixed(1);
                    }
                },

                {
                    column: "FuelDeparture",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "CargoCount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "CargoWeight",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "BaggageWeight",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },
                {
                    column: "BaggageCount",
                    summaryType: "sum",
                    customizeText: function (data) {
                        return data.value;
                    }
                },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "ActualFlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTimeActual;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "ActualFlightTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTimeActual;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }
                if (options.name === "FlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "FlightTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;

                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = (options.totalValueMinutes + options.value.FlightTime);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }


                if (options.name === "JLFlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.JLFlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "JLFlightTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;

                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = (options.totalValueMinutes + options.value.JLFlightTime);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }



                if (options.name === "SITATimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.SITATime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "SITATimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.SITATime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }

                if (options.name === "BlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "BlockTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }

                if (options.name === "JLBlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.JLBlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "JLBlockTimeAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.JLBlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }

                if (options.name === "TaxiTOTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.TaxiTO;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "TaxiLNDTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.TaxiLND;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "TaxiTOAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.TaxiTO;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }
                if (options.name === "TaxiLNDAvg") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';
                        options.cnt = 0;
                    }
                    if (options.summaryProcess === "calculate") {
                        options.cnt++;
                        options.totalValueMinutes = options.totalValueMinutes + options.value.TaxiLND;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();

                    }
                    if (options.summaryProcess === "finalize") {
                        options.totalValueMinutes = Math.round(options.totalValueMinutes / options.cnt);
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();
                    }
                }



            }
        },
        "export": {
            enabled: true,
            fileName: "Flights_Report",
            allowExportSelectedData: false,

        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>Flights</span>"
                        );
                }
            });
        },
        onExporting: function (e) {
            e.component.beginUpdate();
            e.component.columnOption("row", "visible", false);
            e.component.columnOption("rn", "visible", true);


        },
        onExported: function (e) {
            e.component.columnOption("row", "visible", true);
            e.component.columnOption("rn", "visible", false);
            e.component.endUpdate();
        },
        onRowPrepared: function (e) {


            if (!$scope.isOPSStaff && e.rowType == 'data' && e.data && (e.data.AttASR == 1 || e.data.AttVoyageReport == 1)) {
                e.rowElement.css('background', '#d9d9d9');
            }

        },

        onCellPrepared: function (e) {
            if (!$scope.isOPSStaff && e.rowType === "data" && e.column.dataField == "FlightStatus")
                e.cellElement.addClass(e.data.FlightStatus.toLowerCase());
            if (e.rowType === "data" && e.column.dataField == "AttVoyageReport" && e.data.AttVoyageReport == 1) {
                if (!e.data.VR_OPSStaffStatusId)
                    e.cellElement.css('background', '#ff6600');
                if (e.data.VR_OPSStaffStatusId == 1)
                    e.cellElement.css('background', '#66ccff');
                if (e.data.VR_OPSStaffStatusId == 2)
                    e.cellElement.css('background', '#00ff99');
            }

            if (e.rowType === "data" && e.column.dataField == "AttASR" && e.data.AttASR == 1) {
                if (!e.data.ASR_OPSStaffStatusId)
                    e.cellElement.css('background', '#ff6600');
                if (e.data.ASR_OPSStaffStatusId == 1)
                    e.cellElement.css('background', '#66ccff');
                if (e.data.ASR_OPSStaffStatusId == 2)
                    e.cellElement.css('background', '#00ff99');
            }
        },
        bindingOptions: {
            dataSource: 'dg_flight_ds'
        },
        columnChooser: {
            enabled: true
        },

    };
    //////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> EFB Report';


        $('.reportEFB').fadeIn(400, function () {

        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {

        $('.tabc').height($(window).height() - 200);
        $('#rightColumn').height($(window).height() - 220);
        $('#rightColumn2').height($(window).height() - 220);
    });

    $rootScope.$broadcast('FlightsReportLoaded', null);

}]);