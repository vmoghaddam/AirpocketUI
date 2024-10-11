'use strict';
app.controller('toAddController', ['$scope', '$location', 'flightService', 'authService', '$routeParams', '$rootScope', '$window','$http', function ($scope, $location, flightService, authService, $routeParams, $rootScope, $window,$http) {
    $scope.isNew = true;
    $scope.isEditable = false;
    $scope.isLockVisible = false;
    $scope.isContentVisible = false;
    $scope.isFullScreen = false;
    var detector = new MobileDetect(window.navigator.userAgent);

    //if (detector.mobile() && !detector.tablet())
    $scope.isFullScreen = true;

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
    /////////////////////////////////
    $scope.entity = {
        Id: -1,


    };
    $scope.txt_reg = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: '_flight.Register',
        }
    }
    $scope.txt_date = {
        readOnly: true,
        type: "datetime",
        width: '100%',
        pickerType: "rollers",
        displayFormat: "yyyy-MM-dd",
        interval: 15,
        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: '_flight.STD',

        }
    };

    $scope.txt_fltNo = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: '_flight.FlightNumber',
        }
    }

    $scope.txt_airport = {
        hoverStateEnabled: false,
        min: 0,
        readOnly: true,
        bindingOptions: {
            value: '_flight.FromAirportIATA',
        }
    }

    $scope.txt_info = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.Information',
        }
    }
    $scope.txt_ctime = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.CTime',
        }
    }


    $scope.sb_ac = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: ["ON", "OFF"],

        bindingOptions: {
            value: 'entity.AC'

        }
    };

    $scope.sb_ai = {
        showClearButton: true,
        searchEnabled: false,
        dataSource: ["ON", "OFF"],

        bindingOptions: {
            value: 'entity.AI'

        }
    };



    $scope.txt_nepr = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.NERP',
        }
    }

    $scope.txt_mepr = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.MERP',
        }
    }

    $scope.txt_atemp = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.ATEMP',
        }
    }

    $scope.txt_fepr = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.FERP',
        }
    }

    $scope.txt_v1 = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.V1',
        }
    }

    $scope.txt_vr = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.Vr',
        }
    }

    $scope.txt_v2 = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.V2',
        }
    }

    $scope.txt_vslats = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.VSLAT',
        }
    }

    $scope.txt_vflaps = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.VFLAP',
        }
    }

    $scope.txt_vclean = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.VCLEAN',
        }
    }

    $scope.txt_zfw = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.ZFW',
        }
    }

    $scope.txt_toWeight = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.TOWeight',
        }
    }

    $scope.txt_flap = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.Flap',
        }
    }
    $scope.txt_cg = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.CG',
        }
    }

    $scope.txt_stab = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.StabTrim',
        }
    }

    $scope.txt_rw = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.RW',
        }
    }

    $scope.txt_tl = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.TL',
        }
    }

    $scope.txt_wind = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.Wind',
        }
    }

    $scope.txt_visibility = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.Visibility',
        }
    }
    $scope.txt_temp = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.Temp',
        }
    }

    $scope.txt_qhn = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.QNH',
        }
    }
    $scope.txt_wx = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.WXCondition',
        }
    }

    $scope.txt_rwinuse = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.RWINUSE',
        }
    }
    ////////////////////////////////
    function isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }
    $scope.popup_add_visible = false;
    $scope.popup_height = $(window).height() - 300;
    $scope.popup_width = $(window).width() - 0;
    $scope.popup_add_title = 'Take Off';
    $scope.popup_instance = null;

    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [
          
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_add_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $rootScope.IsRootSyncEnabled = false;
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {

            if ($scope.isNew) {
                $scope.isContentVisible = true;
            }
            if ($scope.tempData != null)
                $scope.bind();





        },
        onHiding: function () {
            $rootScope.IsRootSyncEnabled = true;
            //$scope.clearEntity();
            $scope.entity = {
                Id: -1,


            };
            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onTOAddHide', null);
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        width: 1000,
        heigth:600,
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_add_visible',
            fullScreen: 'false',
            title: 'popup_add_title',
            
            

        }
    };


    $scope.flight = null;
    $scope.fill = function (data) {
        console.log(data);
        $scope.entity = data;
    };
    $scope.isLockVisible = false;


    $scope.fdp = null;
    $scope.getLastMetar = function (callback) {

        if ($rootScope.getOnlineStatus()) {
            flightService.updateMETARs($scope.fdp.FDPId).then(function (response) {


                $scope.fdp.METAR = response.Data;
                callback($scope.fdp.METAR);

                //$scope.filtered = Enumerable.From($scope.fdp.METAR)
                //    .Where(function (x) { return $scope.selectedStations.indexOf(x.StationId) != -1; })
                //    .OrderBy(function (x) { return $scope.stations.indexOf(x.StationId); }).ThenByDescending(function (x) {
                //        return Number(moment(new Date(x.observation_time)).format('YYMMDDHHmm'));

                //    }).ToArray();



            }, function (err) { callback($scope.fdp.METAR); });
        }
        else {
            callback($scope.fdp.METAR);
        }
    };
    $scope.metar = null;
    $scope.bind = function () {

       
       


        $scope.entity.FlightId = $scope.tempData.FlightId;

        $http.get('https://apiv1.sbvaresh.ir/api/tocard/flight/' + $scope.entity.FlightId + '/TO' /*+ '?from=' + _df + '&to=' + _dt*/).then(function (response) {
          
            $scope.fill(response.data.Data);
        });
        //https://apiv1.sbvaresh.ir/api/tocard/flight/1100/TO
        return;

        //if ($rootScope.getOnlineStatus()) {
        //    $rootScope.checkInternet(function (st) {
        //        if (st) {
        //            flightService.checkLock($scope.entity.FlightId, 'tolnd').then(function (response) {
        //                $scope.isLockVisible = false;
        //                if (response.IsSuccess && response.Data.canLock) {
        //                    $scope.isLockVisible = true;
        //                }
        //            }, function (err) { });
        //        }
        //        else {
        //            General.ShowNotifyBottom("The application cannot connect to the Server. Please check your internet connection.", 'error');
        //        }
        //    });

        //}


        $scope.loadingVisible = true;

        flightService.epGetFlightLocal($scope.entity.FlightId).then(function (response) {

            $scope.loadingVisible = false;
            var diff = Math.abs((new Date()).getTime() - (new Date(response.Data.STALocal)).getTime()) / 3600000;

            $scope.flight = response.Data;

            $scope.loadingVisible = true;

            flightService.epGetTOLNDByFlight($scope.entity.FlightId).then(function (response2) {

                $scope.loadingVisible = false;
                $scope.isEditable = (diff <= 24);


                if (!response2.Data) {
                    $scope.entity.Id = -1;
                    $scope.isNew = true;


                }
                else {
                    if (response2.Data.JLSignedBy) {
                        //$scope.isEditable = false;
                        $scope.url_sign = signFiles + response.Data.PICId + ".jpg";
                        $scope.PIC = response.Data.PIC;
                        $scope.signDate = moment(new Date(response.Data.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
                    }
                    if (response2.Data.Alert) {
                        General.Confirm("The report updated by " + response2.Data.Alert + ". Would you like to get edited report?", function (res) {
                            if (res) {

                                //var dto = { Id: $scope.ati_flight.ID, };
                                $scope.loadingVisible = true;
                                flightService.epReplaceTOLND(response2.Data.server).then(function (res) {

                                    $scope.isNew = false;
                                    $scope.fill(res);
                                    $scope.loadingVisible = false;


                                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                            }
                            else {
                                $scope.$apply(function () {
                                    $scope.isNew = false;


                                    $scope.fill(response2.Data);
                                });

                            }
                        });
                    }
                    else {

                        $scope.isNew = false;
                        $scope.fill(response2.Data);
                    }
                }

                //console.log('ASR',response2.Data);

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


            //$scope.entity.FlightNo = response.Data.FlightNumber;
            //$scope.entity.Date = new Date(response.Data.STDDay);
            //$scope.entity.ACReg = response.Data.Register;
            //$scope.entity.Route = response.Data.FromAirportIATA + ' - ' + response.Data.ToAirportIATA
            //$scope.entity.FlightNo = response.Data.FlightNumber
            //$scope.FlightNo = {
            //    min: 0,
            //    bindingOptions: {
            //        value: 'entity.FlightNo',
            //    }
            //};

            //$scope.Date = {
            //    min: 0,
            //    bindingOptions: {
            //        value: 'entity.Date',
            //    }
            //};

            //$scope.Route = {
            //    min: 0,
            //    bindingOptions: {
            //        value: 'entity.Route',
            //    }
            //};

            //$scope.ACType = {
            //    min: 0,
            //    bindingOptions: {
            //        value: 'entity.ACType',
            //    }
            //};

            //$scope.ACReg = {
            //    min: 0,
            //    bindingOptions: {
            //        value: 'entity.ACReg',
            //    }
            //};


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ////////////////////////////////
    $scope.scroll_toadd_height = $(window).height() - 130;
    $scope.scroll_toadd = {
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
            height: 'scroll_toadd_height'
        }

    };
    ////////////////////////////////
    $scope.tempData = null;
    $scope.$on('onSign', function (event, prms) {

        if (prms.doc == 'tolnd')
            flightService.signDocLocal(prms, prms.doc).then(function (response) {
                // $scope.isEditable = false;
                // $scope.isLockVisible = false;
                $scope.url_sign = signFiles + prms.PICId + ".jpg";
                $scope.PIC = prms.PIC;
                $scope.signDate = moment(new Date(prms.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    });
    $scope._flight = null;
    $scope.$on('InitTOAdd', function (event, prms) {

        $scope.tempData = null;



        $scope.tempData = prms;
        $scope._flight = prms.Flight;

        $scope.popup_add_visible = true;

    });

}]);




