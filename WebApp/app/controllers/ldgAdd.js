'use strict';
app.controller('ldgAddController', ['$scope', '$location', 'flightService', 'authService', '$routeParams', '$rootScope', '$window','$http', function ($scope, $location, flightService, authService, $routeParams, $rootScope, $window,$http) {
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
    ////////////////////////
    function isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }
    $scope.popup_add_visible = false;
    $scope.popup_height = $(window).height() - 300;
    $scope.popup_width = $(window).width() - 0;
    $scope.popup_add_title = 'Landing';
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
            $rootScope.$broadcast('onLNDAddHide', null);
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        width: 1000,
        heigth: 600,
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_add_visible',
            fullScreen: 'false',
            title: 'popup_add_title',
            

        }
    };

    /////////////////////////////////
    $scope.flight = null;
    $scope.fill = function (data) {
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
        $http.get('https://apiv1.sbvaresh.ir/api/tocard/flight/' + $scope.entity.FlightId + '/LND' /*+ '?from=' + _df + '&to=' + _dt*/).then(function (response) {

            $scope.fill(response.data.Data);
        });
        return;
        $scope.fdp = $scope.tempData.fdp;

        try {
            $scope.getLastMetar(function (obj) {
                console.log($scope.tempData.station);
                console.log(obj);
                $scope.metar = Enumerable.From(obj).Where(function (x) { return x.StationId == $scope.tempData.station; }).OrderByDescending(function (x) {
                    return Number(moment(new Date(x.observation_time)).format('YYMMDDHHmm'));
                }).FirstOrDefault();

            });
        }
        catch (exc) {

        }





        $scope.loadingVisible = true;

        flightService.epGetFlightLocal($scope.entity.FlightId).then(function (response) {

            $scope.loadingVisible = false;
            var diff = Math.abs((new Date()).getTime() - (new Date(response.Data.STALocal)).getTime()) / 3600000;

            $scope.flight = response.Data;

            $scope.loadingVisible = true;

            flightService.epGetTOLND2ByFlight($scope.entity.FlightId).then(function (response2) {

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
                                flightService.epReplaceTOLND2(response2.Data.server).then(function (res) {

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




        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ////////////////////////////////
    $scope.scroll_ldgadd_height = $(window).height() - 130;
    $scope.scroll_ldgadd = {
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
            height: 'scroll_ldgadd_height'
        }

    };
    var appWindow = angular.element($window);
    appWindow.bind('resize', function () {
        //alert('w: '+$(window).width());

        $scope.$apply(function () {
            $scope.scroll_ldgadd_height = $(window).height() - 130;
        });
    });
    /////////////////////////////////
    ////////////////////////////////
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
            value: '_flight.ToAirportIATA',
        }
    }

    $scope.txt_ATWeight = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.ActLandingWeight',
        }
    }
    $scope.txt_flap = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.Flap',
        }
    }
    $scope.txt_app = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.APP',
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


    ///////////////////////////

    $scope.txt_vga = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.VGA',
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



    ////////////////////////////////
    $scope.tempData = null;
    $scope.$on('onSign', function (event, prms) {

        if (prms.doc == 'asr')
            flightService.signDocLocal(prms, prms.doc).then(function (response) {
                // $scope.isEditable = false;
                // $scope.isLockVisible = false;
                $scope.url_sign = signFiles + prms.PICId + ".jpg";
                $scope.PIC = prms.PIC;
                $scope.signDate = moment(new Date(prms.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    });
    $scope._flight = null;
    $scope.$on('InitLdgAdd', function (event, prms) {


        $scope.tempData = null;



        $scope.tempData = prms;
        $scope._flight = prms.Flight;

        $scope.popup_add_visible = true;

    });

}]);

