'use strict';
app.controller('trnscheduleController', ['$scope', '$location', '$routeParams', '$rootScope', 'courseService', 'authService', 'trnService', function ($scope, $location, $routeParams, $rootScope, courseService, authService, trnService) {
    $scope.prms = $routeParams.prms;

    $scope.getMainStyle = function () {
        var h = $(window).height() - 110;
        return {
            height: h + 'px'
        }
    }
    $scope.getScrollStyle = function () {
        return { height: ($(window).height() - 190).toString() + 'px', background:'yellow' };
    };



   

    $scope.nextMonth = function (n) {
        $scope.date = $scope.date.addMonths(n);
        $scope.build($scope.date);
    };

    $scope.caption = "";

    $scope.date = new Date();
    $scope.month = null;
    $scope.year = null;
    $scope.calendar = [];
    var GMonthDataSource = [
        { Id: 0, Title: 'January' },
        { Id: 1, Title: 'February' },
        { Id: 2, Title: 'March' },
        { Id: 3, Title: 'April' },
        { Id: 4, Title: 'May' },
        { Id: 5, Title: 'June' },
        { Id: 6, Title: 'July' },
        { Id: 7, Title: 'August' },
        { Id: 8, Title: 'September' },
        { Id: 9, Title: 'October' },
        { Id: 10, Title: 'November' },
        { Id: 11, Title: 'December' },

    ];
    //alert($scope.month + '   ' + $scope.year);
    $scope.build = function (_date) {
        var _ch = ($(window).height() - 190)*1.0/6.4;


        $scope.calendar = [];
        try {
            var today = moment(new Date()).format('YYYY-MM-DD');
            $('.day-wrapper').html('');
            $('.day-wrapper').hide();
            $scope.date = new Date(_date);
            $scope.month = $scope.date.getMonth();
            $scope.year = $scope.date.getFullYear();
           // alert($scope.year);
            $scope.caption =  GMonthDataSource[$scope.month].Title + ' ' + $scope.year;
           // alert($scope.caption);
            var day = new Date($scope.year, $scope.month, 1);
            var lastDay = (new Date($scope.year, $scope.month + 1, 0)).getDate();
            var dayWeek = day.getDay();
            var dayIndex = dayWeek;
            var dayMonth = day.getDate();

            var c = dayIndex - 1;
            var inactiveBack = (new Date($scope.year, $scope.month, 0)).getDate();
            var inactiveBackYear = (new Date($scope.year, $scope.month, 0)).getFullYear();
            var inactiveBackMonth = (new Date($scope.year, $scope.month, 0)).getMonth();
            var inactiveForward = (new Date($scope.year, $scope.month + 1, 1)).getDate();
            var inactiveForwardYear = (new Date($scope.year, $scope.month + 1, 1)).getFullYear();
            var inactiveForwardMonth = (new Date($scope.year, $scope.month + 1, 1)).getMonth();

            while (c >= 0) {
                var data_date = inactiveBackYear + '-' + pad(Number(inactiveBackMonth) + 1) + '-' + pad(Number(inactiveBack));
                var isToday = data_date == today ? ' today' : '';
                var html = "<div class='day-wrapper" + isToday + "' data-date='" + data_date + "' style='min-height:" + _ch+"px'>"
                    + "<div class='day-caption _inactive'>" + inactiveBack + "</div>"
                    + "</div>";
                $('#d' + c).html(html);
                $scope.calendar.push({ cell: 'd' + c, date: data_date });
                inactiveBack--;
                c--;
            }

            while (dayMonth <= lastDay) {

                var data_date = $scope.year + '-' + pad(Number($scope.month) + 1) + '-' + pad(Number(dayMonth));
                var isToday = data_date == today ? ' today' : '';

                var html = "<div class='day-wrapper" + isToday + "' data-date='" + data_date + "' style='min-height:" + _ch+"px'>"
                    + "<div class='day-caption'>" + dayMonth + "</div>"
                    //+ "<div class='event flight'><i class='fas fa-plane'></i><span>4<span></div>"
                    //+ "<div class='event office'><span>OFFICE<span></div>"
                    + "</div>";
                //if (dayMonth == 12)
                //    html = "<div class='day-wrapper'>"
                //        + "<div class='day-caption'>" + dayMonth + "</div>"
                //        + "<div class='event flight'><i class='fas fa-plane'></i><span>4<span></div>"
                //        + "<div class='event office'><span>OFFICE<span></div>"
                //        + "</div>";
                $scope.calendar.push({ cell: 'd' + dayIndex, date: data_date });
                $('#d' + dayIndex).html(html);

                dayMonth++;
                dayIndex++;
            }

            while (dayIndex <= 41) {
                var data_date = inactiveForwardYear + '-' + pad(Number(inactiveForwardMonth) + 1) + '-' + pad(Number(inactiveForward));
                var isToday = data_date == today ? ' today' : '';
                var html = "<div class='day-wrapper" + isToday + "' data-date='" + data_date + "' style='min-height:" + _ch+"px'>"
                    + "<div class='day-caption _inactive'>" + inactiveForward + "</div>"
                    + "</div>";
                $('#d' + dayIndex).html(html);
                $scope.calendar.push({ cell: 'd' + dayIndex, date: data_date });
                dayIndex++;
                inactiveForward++;
            }
            $scope.isCalVisible = true;
            $('.day-wrapper').show();

           // $scope.fill();

        }
        catch (e) { alert(e); }



    };


    /////////////////////////////

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {

        $rootScope.page_title = '> Schedule';
        $('.trnschedule').fadeIn();
    }
    $scope.$on('$viewContentLoaded', function () {
        setTimeout(function () {
           

        }, 2500);


        $scope.initDate = new Date();

        $('._cal').on('click', '.day-wrapper', function (event) {
            $scope.click($(this).data('date'));
        });

        $scope.build($scope.initDate);

        //  if ($scope.isFullScreen)

        
          //  else
          //      $scope.scrollStyle = { height: ($scope.popup_height - 190).toString() + 'px' };




    });
    //////////////////////////////////////////

}]);