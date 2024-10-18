'use strict';
app.controller('trn_instructor_panelController', ['$scope', '$location', 'authService', '$routeParams', '$rootScope', '$window', 'instructorService', function ($scope, $location, authService, $routeParams, $rootScope, $window, instructorService) {

    var tabs = [

        { text: "Instructor", id: 'instructor' },
        { text: "Director", id: 'director' },
    ];
    $scope.tabs = tabs;

    $scope.$watch("selectedTabIndex", function (newValue) {
        $('.tabc').hide();
        var id = tabs[newValue].id;
        $('#' + id).fadeIn(400, function () {
          

        });
        switch (id) {
            case 'instructor':
                $scope.bind_active();
                break;
            case 'director':
                break;
           

                if ($scope.sch_instance)
                    $scope.sch_instance.repaint();
                break;
            default:
                break;
        }

    });
    $scope.tabs_options = {


        onItemClick: function (arg) {
            
        },
        bindingOptions: {

            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };
    $scope.selectedTabIndex = 0;


    $scope.scroll_course_height = $(window).height() - 145;
    $scope.scroll_course = {
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
            height: 'scroll_course_height'
        }

    };

    $scope.scroll_archived_height = $(window).height() - 145;
    $scope.scroll_archived = {
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
            height: 'scroll_archived_height'
        }

    };

    $scope.bind_active = function () {
        instructorService.get_instructor_course($rootScope.userId).then(function (response) {

            $scope.instructor_courses = response;
            console.log("--------Course Response--------\n", response);
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        instructorService.get_director_course($rootScope.userId).then(function (response) {

            $scope.director_courses = response;
            console.log("--------Course Response--------\n", response);
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    }

}]);


