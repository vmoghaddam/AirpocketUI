'use strict';
app.controller('trn_questionsController', ['$scope', '$location', 'flightService', 'authService', '$routeParams', '$rootScope', '$window', '$http', 'atoService', function ($scope, $location, flightService, authService, $routeParams, $rootScope, $window, $http, atoService) {

    $scope.isFullScreen = true;
    //////////////////////////////
    $scope.get_answer_class = function (d) {

        if (d == false)
            return "right_class";
        else
            return "left_class";
    }

    $scope.windowHeight = $(window).height();
    $scope.height_dy = 150;

    ////////////////////////
    $scope.popup_questions_visible = true;
    $scope.popup_height = '100%';
    $scope.popup_width = '100%';
    $scope.popup_questions_title = 'Questions';
    $scope.popup_instance = null;

    $scope.popup_questions = {


        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Sign', validationGroup: 'cabin', icon: 'fas fa-signature', onClick: function (e) {

                        atoService.sign_attendance_coures($scope.instructor).then(function (response) {

                        });


                    }
                }, toolbar: 'bottom'
            },


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_questions_visible = false;
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
                $scope.bind();
        },
        onHiding: function () {
            $rootScope.IsRootSyncEnabled = true;
            $scope.fltInfo = false;
            $scope.entity = {
                Id: -1,
                EventTitleIds: [],
                Anonymous: false

            };
            $scope.popup_questions_visible = false;
            $rootScope.$broadcast('onQACabinHide', null);
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_questions_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_questions_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isEditable',
            'toolbarItems[2].visible': 'isEditable',

        }
    };



    $scope.bind = function () {
        $scope.exam_id = 1
        atoService.get_questions_list($scope.exam_id).then(function (response) {

            $scope.questions = response.questions;



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
    $scope.$on('InitQuestions', function (event, prms) {



        $scope.tempData = prms;
   
        $scope.popup_questions_visible = true


    });
    //////////////////////////////

}]);  