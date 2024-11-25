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



    ////////////////////////
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
        // fullScreen:false,
		width:1000,
height:860,
        bindingOptions: {
            visible: 'popup_add_visible',
            fullScreen: 'false',
            title: 'popup_add_title',
           

        }
    };

    /////////////////////////////////


    /////////////////////////////////
    $scope.flight = null;
    $scope.fill = function (data) {
        $scope.entity = data;
    };
    $scope.isLockVisible = false;
    $scope.bind = function () {
        $scope.entity.FlightId = $scope.tempData.FlightId;


 $http.get(serviceSKYBAG+'api/tocard/flight/' + $scope.entity.FlightId + '/LND' /*+ '?from=' + _df + '&to=' + _dt*/).then(function (response) {
          
            $scope.fill(response.data.Data);
        });
		return;
        //if ($rootScope.getOnlineStatus()) {
        //    $rootScope.checkInternet(function (st) {
        //        if (st) {
        //            flightService.checkLock($scope.entity.FlightId, 'asr').then(function (response) {
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
            value: '_flight.ToAirportIATA',
        }
    }

    $scope.txt_info = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.Information',
        }
    }

    $scope.txt_time = {
        type: "datetime",
        width: '100%',
        pickerType: "rollers",
        displayFormat: "HH:mm",
        readOnly: true,
        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'flight.Landing',

        }
    };

    $scope.txt_rw = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.RW',
        }
    }

    $scope.txt_ta = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.TA',
        }
    }

    $scope.txt_fe = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.FE',
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

   

    $scope.txt_cloud = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.Cloud',
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
            value: 'entity.QHN',
        }
    }

    $scope.txt_dewp = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.DewP',
        }
    }

    $scope.txt_wx = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.WXCondition',
        }
    }

    $scope.txt_star = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.STAR',
        }
    }

    $scope.txt_app = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.APP',
        }
    }

    $scope.txt_mass = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.MAS',
        }
    }

    $scope.txt_flap = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.Flap',
        }
    }

    $scope.txt_stab = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.StabTrim',
        }
    }

    $scope.txt_verf = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.Verf',
        }
    }

    $scope.txt_ATWeight = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.ActLandingWeight',
        }
    }

    $scope.txt_lda = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.LDA',
        }
    }

    

    $scope.txt_altFuel = {
        hoverStateEnabled: false,
        min: 0,
        bindingOptions: {
            value: 'entity.FuelToAlternate',
        }
    }


    //////////////////////////////
    $scope.tdWidth = $(window).width() / 31.0;
    $scope.rows = [-100, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10]
    $scope.columns = [-100, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    $scope.getTdClass = function (c, r) {
        var cls = "";
        if (r == 0 && c == 0) { return "ctd-center ctd"; }
        if (r != -100) {
            if (c == -100) {
                cls = "ctd-empty";
            }
            else {
                cls = "ctd";
            }
        }
        else {
            //if (c != -100) return "ctd-empty";
            //else
            //    return "ctd";
            cls = "ctd-empty";
        }
        if (c == $scope.entity.AATXAbove && r == $scope.entity.AATYAbove) {
            cls += " ctd-selected";
        }

        return cls;

    }
    $scope.tableAboveClicked = function (r, c) {
        $scope.entity.AATXAbove = c;
        $scope.entity.AATYAbove = r;
    }



    $scope.getAsClass = function (c, r) {
        var cls = "";
        if (r == 0 && c == 0) { return "ctd-center ctd"; }
        if (r != -100) {
            if (c == -100) {
                cls = "ctd-empty";
            }
            else {
                cls = "ctd";
            }
        }
        else {
            //if (c != -100) return "ctd-empty";
            //else
            //    return "ctd";
            cls = "ctd-empty";
        }


        if (c == $scope.entity.AATXAstern && r == $scope.entity.AATYAstern) {
            cls += " ctd-selected";
        }
        return cls;

    }
    $scope.tableAsternClicked = function (r, c) {
        $scope.entity.AATXAstern = c;
        $scope.entity.AATYAstern = r;
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
    $scope.$on('InitLdgAdd', function (event, prms) {

        
        $scope.tempData = null;



        $scope.tempData = prms;

  $scope._flight = prms.Flight;
        $scope.popup_add_visible = true;

    });

}]);


