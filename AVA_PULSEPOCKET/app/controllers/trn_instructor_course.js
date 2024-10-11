'use strict';
app.controller('trn_instructor_courseController', ['$scope', '$location', 'authService', '$routeParams', '$rootScope', '$window', function ($scope, $location, authService, $routeParams, $rootScope, $window) {


    $scope.exam = function () {
        $scope.popup_exam_visible = true;
    }

    $scope.popup_exam_visible = false;
    $scope.popup_height = '100%';
    $scope.popup_width = '100%';
    $scope.popup_exam_title = 'Exam Form';
    $scope.popup_instance = null;

    $scope.popup_exam = {

      
        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'success', text: 'Sign', validationGroup: 'cabin', icon: 'fas fa-signature', onClick: function (e) {

                      


                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'cabin', onClick: function (e) {
                       

                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_exam_visible = false;
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
            $rootScope.IsRootSyncEnabled = true;
            $scope.fltInfo = false;
            $scope.entity = {
                Id: -1,
                EventTitleIds: [],
                Anonymous: false

            };
            $scope.popup_exam_visible = false;
            $rootScope.$broadcast('onQACabinHide', null);
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_exam_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_exam_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isEditable',
            'toolbarItems[2].visible': 'isEditable',

        }
    };

    $scope.scroll_checklist_height = $(window).height() - 100;
    $scope.scroll_checklist = {
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
            height: 'scroll_checklist_height'
        }

    };

    $scope.trainees = [
        { id: 1, name: 'AMIRHOSSEIN AKHLAGHI', presence: 90, score: 82, finalResult: 'Re-exam', showDetails: false },
        { id: 2, name: 'SEYED BAHRAM MADANI', presence: 100, score: '-', finalResult: 'Re-exam', showDetails: false },
        { id: 3, name: 'MAHDI RABIEI', presence: 85, score: 92, finalResult: 'Pass', showDetails: false },
        { id: 4, name: 'MOHSEN RAHIMI', presence: 100, score: 91, finalResult: 'Pass', showDetails: false },
        { id: 5, name: 'ALI RAJABI', presence: 100, score: 94, finalResult: 'Pass', showDetails: false },
        { id: 6, name: 'MOHAMMAD ALI GHADERI SAVIRI', presence: 100, score: 95, finalResult: 'Pass', showDetails: false },
        { id: 7, name: 'EHSAN SALIMI', presence: 90, score: 95, finalResult: 'Pass', showDetails: false },
        { id: 8, name: 'MOSTAFA BAHOUSH HASANJANI', presence: 70, score: 89, finalResult: 'Re-exam', showDetails: false },
        { id: 9, name: 'HAMIDREZA JABBARI', presence: 100, score: 90, finalResult: 'Pass', showDetails: false },
        { id: 10, name: 'POUYAN ABBASI', presence: 100, score: 95, finalResult: 'Pass', showDetails: false },
        { id: 11, name: 'SABA JOKAR', presence: 75, score: 100, finalResult: 'Pass', showDetails: false },
        { id: 12, name: 'VAHID NOROUZI KOKEH', presence: 0, score: '-', finalResult: 'Re-exam', showDetails: false }
    ];

    $scope.toggleCardDetails = function (id) {
        console.log("------Id------\n", id);
        var trainee = $scope.trainees.find(function (t) { return t.id === id; });
        trainee.showDetails = !trainee.showDetails;
        console.log("------ng-show------\n", trainee.showDetails);
        console.log("------trainee------\n", trainee);
    };

    $scope.updateFinalResult = function (id, result) {
        var trainee = $scope.trainees.find(function (t) { return t.id === id; });
        trainee.finalResult = result;
    };

    // Function to detect large screen
    $scope.isLargeScreen = function () {
        return $window.innerWidth >= 768;
    };



}]);


