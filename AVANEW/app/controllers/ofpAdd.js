'use strict';
app.controller('ofpAddController', ['$scope', '$location', 'flightBagService', 'authService', '$routeParams', '$rootScope', '$window', '$compile', '$sce', function ($scope, $location, flightBagService, authService, $routeParams, $rootScope, $window, $compile, $sce) {
    $scope.isNew = true;
    $scope.isContentVisible = false;
    $scope.isFullScreen = false;
    $scope.isEditable = false;
    $scope.isLockVisible = false;
    var detector = new MobileDetect(window.navigator.userAgent);

    if (detector.mobile() && !detector.tablet())
        $scope.isFullScreen = false;

    $scope.entity = {
        Id: -1,

    };

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
    }

    ////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_height = $(window).height()-50;
    $scope.popup_width = 900;
    $scope.popup_add_title = 'Operational Flight Plan';
    $scope.popup_instance = null;

    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Sign', icon: 'fas fa-signature', onClick: function (e) {
                        if ($rootScope.getOnlineStatus()) {
                            //$scope.entity.Id
                            var data = { FlightId: $scope.entity.FlightId, documentType: 'ofp' };

                            $rootScope.$broadcast('InitSignAdd', data);
                        }
                        else {
                            General.ShowNotify("You are OFFLINE.Please check your internet connection", 'error');
                        }

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Save All', icon: 'check', onClick: function (e) {
                        if (!$rootScope.getOnlineStatus()) {
                            alert('You are OFFLINE.Please check your internet connection.');
                            return;
                        }
                        $scope.bind(function () {
                            //syncOFPProps
                            $scope.loadingVisible = true;
                            flightBagService.syncOFPProps($scope.entity.Id, true, function () { }).then(function (response2) {

                                $scope.loadingVisible = false;
                                General.ShowNotify(Config.Text_SavedOk, 'success');

                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        });


                    }
                }, toolbar: 'bottom'
            },
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
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {

            if ($scope.isNew) {
                $scope.isContentVisible = true;
            }
            if ($scope.tempData != null)
                $scope.bind();


            //$("#ofp-doc").on("click", ".prop", function () {
            //    $('.prop').removeClass('selected');
            //    $(this).addClass('selected');
            //    $scope.propClick($(this).attr('id'), $(this).html());
            //});


        },
        onHiding: function () {
            //$("#ofp-doc")
            //    .off("click", ".prop");
            $scope.props = [];

            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onDrAddHide', null);
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        isFullScreen: false,
        bindingOptions: {
            visible: 'popup_add_visible',
            //fullScreen: 'isFullScreen',
            title: 'popup_add_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[1].visible': 'isEditable',
            'toolbarItems[0].visible': 'isLockVisible',

        }
    };

    $scope.propType = 'number';
    $scope.propValueStr = null;
    $scope.propValueNum = null;
    $scope.propName = null;
    $scope.props = [];
    $scope.txtIns = null;
    $scope.txt_prop = {
        onInitialized: function (e) {
            if (!$scope.txtIns)
                $scope.txtIns = e.component;
            //setTimeout(function () {
            //    e.component.focus();
            //}, 0);
        },
        bindingOptions: {
            value: 'propValueStr',
        }
    };
    $scope.num_prop = {
        bindingOptions: {
            value: 'propValueNum',
        }
    };

    $scope.popup_value_instance = null;
    $scope.popup_value_visible = false;
    $scope.popup_value = {

        shadingColor: 'rgba(255,255,255,0.1)',
        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Save', icon: 'check', onClick: function (e) {

                        var dto = { OFPId: $scope.entity.Id, PropName: $scope.propName, User: $rootScope.userTitle };
                        if ($scope.propType == 'number') {
                            if ($scope.propValueNum === 0)
                                dto.PropValue = '0';
                            else
                                dto.PropValue = $scope.propValueNum ? $scope.propValueNum.toString() : '...';
                        }
                        else {
                            dto.PropValue = $scope.propValueStr ? $scope.propValueStr : '...';
                        }
                        $scope.loadingVisible = true;
                        flightBagService.saveOFPProp(dto).then(function (response2) {

                            $scope.loadingVisible = false;
                            // General.ShowNotify(Config.Text_SavedOk, 'success');
                            $('#' + $scope.propName).html(dto.PropValue);
                            $scope.popup_value_visible = false;

                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
                        //if (!result.isValid) {
                        //    General.ShowNotify(Config.Text_FillRequired, 'error');
                        //    return;
                        //}

                        //$scope.loadingVisible = true;
                        //flightBagService.saveDR($scope.entity).then(function (response2) {
                        //    $scope.loadingVisible = false;
                        //    if (response2.IsSuccess) {
                        //        General.ShowNotify(Config.Text_SavedOk, 'success');
                        //        console.log('DR', response2.Data);
                        //        $scope.popup_add_visible = false;
                        //    }


                        //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_value_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],
        // position:'left top',
        //position: { my: 'right', at: 'right', of: window, offset: '-15 0' },
        position: {
            my: "right top",
            at: "right top",
            offset: '-15 60'
        },
        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.popup_instance.repaint();
        },
        onShown: function (e) {
            $scope.txtIns.focus();
        },
        onHiding: function () {
            $('.prop').removeClass('selected');
            $scope.propType = 'number';
            $scope.propValueStr = null;
            $scope.propValueNum = null;
            $scope.propName = null;

            $scope.popup_value_visible = false;

        },
        onContentReady: function (e) {
            if (!$scope.popup_value_instance) {
                $scope.popup_value_instance = e.component;
            }
        },
        title: 'Value',
        height: 200,
        width: 700,
        bindingOptions: {
            visible: 'popup_value_visible',


        }
    };

    /////////////////////////////////
    function _replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
    $scope.flight = null;
    $scope.propClick = function (propId, value) {
        // alert(propId);


        $scope.$apply(function () {
            value = _replaceAll(value, ' ', '');


            $scope.propName = propId;
            $scope.propType = 'number';
            if (propId.startsWith('prop_ofbcpt'))
                $scope.propType = 'string';
            if (propId.startsWith('prop_ofbfo'))
                $scope.propType = 'string';
            if (propId.startsWith('prop_clearance'))
                $scope.propType = 'string';



            if ($scope.propType == 'string')
                $scope.propValueStr = value;
            else
                $scope.propValueNum = value;
            $scope.propType = 'string';
            $scope.popup_value_visible = true;
        });

    };
    //$scope.propClick = function (event) {
    //    alert('x  '+ $(event.target).attr("id") ); 
    //};
    $scope.OFPHtml = '';
    $scope.fill = function (data) {
        $scope.entity = data;

        $scope.OFPHtml = $sce.trustAsHtml($scope.entity.TextOutput);

        //  $compile($("#ofp-doc").contents())($scope);
        //alert('x');

        //alert('init');
        //flightBagService.saveOFPProp({ OFPId: 10, PropName: 'dool', PropValue: 'vahid10', User: $rootScope.userTitle}).then(function (response2) {

        //    alert('saved');


        //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    $scope.isLockVisible = false;
    var toTime = function (dt) {
        if (!dt)
            return "";
        return moment(new Date(dt)).format('HHmm');
    };
    $scope.bind = function (callback) {

        $scope.entity.FlightId = $scope.tempData.FlightId;

        //if ($rootScope.getOnlineStatus()) {

        //    flightBagService.checkLock($scope.entity.FlightId,'ofp').then(function (response) {
        //        $scope.isLockVisible = false;
        //        if (response.IsSuccess && response.Data.canLock) {
        //            $scope.isLockVisible = true;
        //        }
        //    }, function (err) { });
        //}

        $scope.loadingVisible = true;
        flightBagService.epGetFlight($scope.entity.FlightId).then(function (response) {
            $scope.flight = response.Data;
            flightBagService.epGetOFPByFlight($scope.entity.FlightId).then(function (response2) {
                

                
                if (response2.Data.JLSignedBy) {
                    // $scope.isEditable = false;
                    $scope.url_sign = signFiles + response2.Data.PICId + ".png";
                    $scope.PIC = response2.Data.PIC;
                    $scope.signDate = moment(new Date(response2.Data.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
                }

                $scope.loadingVisible = false;



                

                if (!response2.Data) {

                    $scope.isNew = true;
                    $scope.entity = {
                        Id: -1,

                    };
                    $scope.entity.FlightId = $scope.tempData.FlightId;

                }
                else {

                    $scope.isNew = false;
                    $scope.fill(response2.Data);

                    $scope.loadingVisible = true;
                    flightBagService.epGetOFPProps($scope.entity.Id).then(function (response3) {
                        $scope.loadingVisible = false;
                        $scope.props = response3.Data;
                        $('.prop').html(' ');

                        //9-11
                        var updates = [];
                        var takeOffChanged = false;
                        $.each($scope.props, function (_i, _d) {
                            // if (_d.Id == 140)
                            //    alert(_d.PropValue);

                            if (_d.PropValue)
                                $('#' + _d.PropName).html(_d.PropValue);
                            
                            if (_d.PropName == 'prop_pax_adult' && $scope.flight.PaxAdult != _d.PropValue) {
                               
                                $('#' + _d.PropName).html($scope.flight.PaxAdult);
                                updates.push({ OFPId: $scope.entity.Id, PropName: _d.PropName, User: $rootScope.userTitle, PropValue: $scope.flight.PaxAdult });
                                //var dto = { OFPId: $scope.entity.Id, PropName: _d.propName, User: $rootScope.userTitle, PropValue: $scope.flight.PaxAdult };
                                //flightBagService.saveOFPProp(dto);
                            }
                            if (_d.PropName == 'prop_pax_child' && $scope.flight.PaxChild != _d.PropValue) {
                                $('#' + _d.PropName).html($scope.flight.PaxChild);
                                updates.push({ OFPId: $scope.entity.Id, PropName: _d.PropName, User: $rootScope.userTitle, PropValue: $scope.flight.PaxChild });
                            }
                            if (_d.PropName == 'prop_pax_infant' && $scope.flight.PaxInfant != _d.PropValue) {
                                $('#' + _d.PropName).html($scope.flight.PaxInfant);
                                updates.push({ OFPId: $scope.entity.Id, PropName: _d.PropName, User: $rootScope.userTitle, PropValue: $scope.flight.PaxInfant });
                            }
                            //prop_offblock
                            if (_d.PropName == 'prop_offblock' && toTime($scope.flight.BlockOff) != _d.PropValue) {
                                $('#' + _d.PropName).html(toTime($scope.flight.BlockOff));
                                updates.push({ OFPId: $scope.entity.Id, PropName: _d.PropName, User: $rootScope.userTitle, PropValue: toTime($scope.flight.BlockOff) });
                            }
                            //prop_takeoff
                            if (_d.PropName == 'prop_takeoff' && toTime($scope.flight.TakeOff) != _d.PropValue) {
                                takeOffChanged = true;
                                $('#' + _d.PropName).html(toTime($scope.flight.TakeOff));
                                updates.push({ OFPId: $scope.entity.Id, PropName: _d.PropName, User: $rootScope.userTitle, PropValue: toTime($scope.flight.TakeOff) });
                            }
                            //prop_landing
                            if (_d.PropName == 'prop_landing' && toTime($scope.flight.Landing) != _d.PropValue) {
                                $('#' + _d.PropName).html(toTime($scope.flight.Landing));
                                updates.push({ OFPId: $scope.entity.Id, PropName: _d.PropName, User: $rootScope.userTitle, PropValue: toTime($scope.flight.Landing) });
                            }
                            //prop_onblock
                            if (_d.PropName == 'prop_onblock' && toTime($scope.flight.BlockOn) != _d.PropValue) {
                                $('#' + _d.PropName).html(toTime($scope.flight.BlockOn));
                                updates.push({ OFPId: $scope.entity.Id, PropName: _d.PropName, User: $rootScope.userTitle, PropValue: toTime($scope.flight.BlockOn) });
                            }


                        });
                        //if (takeOffChanged) {
                        //    var times = $("span[data-info^='time_']");
                        //    var objs = [];
                        //    $.each(times, function (_w, _t) {
                        //        var data = $(_t).data('info');
                        //        objs.push({ id: $(_t).attr('id'), index: Number(data.split('_')[1]), value: data.split('_')[2] });
                        //    });
                        //    objs = Enumerable.From(objs).OrderBy('$.index').ToArray();
                        //    var to = new Date($scope.flight.TakeOff);
                        //    $.each(objs, function (_w, _t) {
                        //        to = new Date(to.addMinutes(_t.value));
                        //        $('#' + _t.id).html(toTime(to));
                        //        updates.push({ OFPId: $scope.entity.Id, PropName: _t.id, User: $rootScope.userTitle, PropValue: toTime(to) });
                        //    });
                        //}



                        //if (updates.length > 0)
                        //    flightBagService.saveOFPPropBulk(updates);
                        if ($scope.url_sign)
                            $('#sig_pic_img').attr('src', $scope.url_sign);
                        



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



                    ////////////////////////
                    /////////////////////////
                    ///////////////////////////
                }

                //console.log('ASR',response2.Data);
                if (callback)
                    callback();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        });

        




        // }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    ////////////////////////////////
    $scope.scroll_dradd_height = $(window).height() - 150;
    var appWindow = angular.element($window);
    appWindow.bind('resize', function () {
        //alert('w: '+$(window).width());

        $scope.$apply(function () {
            $scope.scroll_dradd_height = $(window).height() - 100;
        });
    });
    $scope.scroll_dradd = {
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
            height: 'scroll_dradd_height'
        }

    };
    /////////////////////////////////
    $scope.tempData = null;
    $scope.$on('onSign', function (event, prms) {

        if (prms.doc == 'ofp')
            flightBagService.signDocLocal(prms, prms.doc).then(function (response) {

                // $scope.isEditable = false;
                //$scope.isLockVisible = false;
                $scope.url_sign = signFiles + prms.PICId + ".png";
                $scope.PIC = prms.PIC;
                $scope.signDate = moment(new Date(prms.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
                if ($scope.url_sign)
                    $('#sig_pic_img').attr('src', $scope.url_sign);
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    });
    $scope.$on('InitOFPAdd', function (event, prms) {



        $scope.tempData = null;

        $scope.tempData = prms;


        $scope.popup_add_visible = true;

    });

}]);