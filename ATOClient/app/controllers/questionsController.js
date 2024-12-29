'use strict';
app.controller('questionsController', ['$scope', '$location', 'flightService', 'authService', '$routeParams', '$rootScope', '$window', '$http', function ($scope, $location, flightService, authService, $routeParams, $rootScope, $window, $http) {

    $scope.isFullScreen = true;
    //////////////////////////////


    $scope.flightCrew = [];
    $scope.cabinCrew = [];

    $scope.circumstances = {};
    $scope.report = {};
    $scope.verification = {};
    $scope.remarks = {};







    $scope.isItemSelected = function (item) {
        return $scope.items.some(existingItem => existingItem.item_id === item.item_id);
    };


    ////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_height = $(window).height() - 300;
    $scope.popup_width = $(window).width() - 200;
    $scope.popup_add_title = 'FDP Form';
    $scope.popup_instance = null;

    $scope.popup_add = {


        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Sign', icon: 'fas fa-signature', onClick: function (e) {
                        if ($rootScope.getOnlineStatus()) {
                            $rootScope.checkInternet(function (st) {
                                if (st) {
                                    var data = { FlightId: $scope.entity.FlightId, documentType: 'vr' };

                                    $rootScope.$broadcast('InitSignAdd', data);
                                }
                                else {
                                    General.ShowNotify("You are OFFLINE.Please check your internet connection", 'error');
                                }
                            });


                        }
                        else {
                            General.ShowNotify("You are OFFLINE.Please check your internet connection", 'error');
                        }

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Save', icon: 'check', validationGroup: 'logadd', onClick: function (e) {


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
            $rootScope.IsRootSyncEnabled = false;
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {

            if ($scope.tempData != null)
                $scope.bind();





        },
        onHiding: function () {


            $scope.popup_add_visible = false;

        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        isFullScreen: false,
        bindingOptions: {
            visible: 'popup_add_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_add_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[1].visible': 'isEditable',
            'toolbarItems[0].visible': 'isLockVisible',

        }
    };



    $scope.bind = function () {
        atoService.get_questions_list($scope.exam_id).then(function (response) {
            console.log('---Get Exam----', response);
            $.each(response.Data.questions, function (_i, _d) {
                _d.id2 = _d.id;
            });
            $scope.exam = response.Data.exam;
            $scope.status_id = $scope.exam.status_id;
            $scope.questions = response.Data.questions;

            $scope.profile = response.Data.profile;
            $scope.total_questions = response.Data.toal_questions;
            $scope.total_answered = response.Data.total_answerd;
            $scope.total_remained = response.Data.total_remained;
            $scope.refresh_summary();
            $scope.startTimer();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    }



    ////////////////////////////////
    $scope.scroll_vradd_height = $(window).height() - 130;
    $scope.scroll_vradd = {
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
            height: 'scroll_vradd_height'
        }

    };
    /////////////////////////////////
    $scope.tempData = null;
    $scope.$on('onSign', function (event, prms) {

        if (prms.doc == 'vr')
            flightService.signDocLocal(prms, prms.doc).then(function (response) {
                // $scope.isEditable = false;
                //   $scope.isLockVisible = false;
                $scope.url_sign = signFiles + prms.PICId + ".jpg";
                $scope.PIC = prms.PIC;
                $scope.signDate = moment(new Date(prms.JLDatePICApproved)).format('YYYY-MM-DD HH:mm');
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

    });

    $scope.tempData = null;
    $scope.$on('InitQuestionsList', function (event, prms) {



        $scope.tempData = prms;
        $scope.popup_add_visible = true


    });
    //////////////////////////////

}]);  