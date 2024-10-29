'use strict';
app.controller('profileController', ['$scope', '$location', '$routeParams', '$rootScope', '$route', '$window', '$timeout', 'authService', 'atoService',
    function ($scope, $location, $routeParams, $rootScope, $route, $window, $timeout, authService, atoService) {
        $scope.prms = $routeParams.prms;
        if (!authService.isAuthorized()) {

            authService.redirectToLogin();
        }

        $scope.windowHeight = $(window).height()

        $scope.selectedTab = 1;

        $scope.selectTab = function (tabIndex) {
            $scope.selectedTab = tabIndex;
        };

        $scope.isActiveTab = function (tabIndex) {
            return $scope.selectedTab === tabIndex;
        };
        ///////////////////////////////////
        var storedUserData = localStorage.getItem('profile')

        if (storedUserData) {
            $scope.profile = JSON.parse(storedUserData)
            $scope.profile.DateBirth = new Date($scope.profile.DateBirth)
            $scope.person_id = $scope.profile.Id;
        } else {
            console.log('User data not found in local storage')
        }

        //////////////////////////////////
        $scope.exam = function () {
            $window.location.href = '/#!/quiz/list';
        };

        $scope.Cockpit = [36, 37, 38, 30, 31, 32, 33, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        $scope.bind = function () {
            
            atoService.get_instructor_course($scope.person_id).then(function (response) {

                $scope.instructor_courses = response.Data;
                console.log("--------Course Response--------\n", response);
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            atoService.get_person_exam($scope.person_id).then(function (response) {

                $scope.events = response.Data;
               
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
            atoService.get_person_certificates(4766).then(function (response) {

                if (response && response.length > 0) {
                    var jg = response[0].JobGroup;
                    if (jg == 'TRE')
                        $scope.Cockpit.push(35);
                    if (jg == 'TRI')
                        $scope.Cockpit.push(34);
                    if (['CCM', 'SCCM', 'ISCCM'].indexOf(jg) != -1)
                        $scope.Cockpit = [1, 3, 5, 36, 6, 7, 11, 31];
                }
                var _now = new Date();
                var _start = new Date(_now.getFullYear(), _now.getMonth(), _now.getDate(), 0, 0, 0, 0);
                $.each(response, function (_i, _d) {
                    var _expDate = new Date(_d.EXPYear, _d.EXPMonth - 1, _d.EXPDay + 1, 0, 0, 0, 0);
                    if (_d.Status != 'UNKNOWN')
                        _d.Remain = moment(_expDate).diff(moment(_start), 'days');
                    else
                        _d.Remain = 'UNKNOWN';
                });
                var data = Enumerable.From(response).Where(function (x) { return $scope.Cockpit.indexOf(x.TypeId) != -1; }).OrderBy('$.StatusId').ThenBy('$.Remain').ToArray();


                $scope.certificates = data;
              
            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }

        $scope.getRemainClass = function (item) {
            if (item.StatusId == 0)
                return 'cer-expired';
            else if (item.StatusId == 1)
                return 'cer-expiring';
            else if (item.StatusId == 2)
                return 'cer-unknown';
            else return 'cer-valid';

        };

        $scope.formatDateCer = function (dt) {
            if (!dt)
                return "unknown";
            return moment(new Date(dt)).format('MMM-DD-YYYY').toUpperCase();
        };


        ///////////////////////
        if (!authService.isAuthorized()) {

            authService.redirectToLogin();
        }
        else {
            $rootScope.page_title = '> Profile';
            $('.profile').fadeIn();
        }

        //////////////////////////////////////////
        $scope.$on('$viewContentLoaded', function () {

            $scope.bind();
            setTimeout(function () {

            }, 500);
        });
        $rootScope.$broadcast('ProfileLoaded', null);
        ///end
    }]);