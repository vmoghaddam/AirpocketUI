$(document).ready(function () {
    var dfrom = new Date(2020, 6, 20, 0, 0, 0, 0);
    var ndays = 2;
    var regs = ['CAR','KPA','KPB','CPD','CAS','CPV','FPA','FPC'];
    /////config/////////////////
    var hourWidth = 75;
    ///////////////////////////

    var refreshHeights = function () {


        $('.cell-hour').width(hourWidth);
        $('.cell-day').width((hourWidth+1) * 24-1);
        $('.row-top-mirror').height($('.row-top').height() - 1);
        $('.mid-line').height($('.flights-box').height());
        $('.hour-line').height($('.flights-box').height());
        $('.flights').on('scroll', function () {
            $('.regs').scrollTop($(this).scrollTop());
        });



    };


    function createDate(year, month, day, hh, mm, ss) {
        var d = new Date();
    }
    function _gpad2(n) {
        var str = "" + n
        var pad = "00"
        var ans = pad.substring(0, pad.length - str.length) + str
        return ans;
    }

    persianDate.toLocale('en');
    var tempDate = new Date(dfrom);
    var $timeBar = $('.header-time');
    var $dayBar = $('.header-date');
    var $flightArea = $('.flights');
    var c = 1;
    for (var i = 1; i <= ndays; i++) {
        for (var j = 0; j < 24; j++) {
            var secondDate = (new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), j, 0, 0, 0)).addMinutes(-270);

            var hourElem = "<div class='cell-hour' style='display:inline-block;float:left;'>" + _gpad2(j) + "<span class='second-time'>" + moment(secondDate).format('HH:mm') + "</span></div>";
            $timeBar.append(hourElem);
            if (c < 24 * ndays) {
                var hleft = c * (hourWidth + 1) - 0.8;
                var hline = "<div class='hour-line' style='top:0px;left:" + hleft + "px'></div>";
                $flightArea.append(hline);
            }
           
            c++;
        }
        var dayElem = "<div class='cell-day' style='display:inline-block;float:left;'>" + moment(tempDate).format('dd DD-MMM-YYYY')
        + " (" + new persianDate(tempDate).format("DD-MM-YYYY") + ")" + "</div>";
        $dayBar.append(dayElem);

        if (i < ndays) {
            var midleft = i * 24 * (hourWidth + 1) - 1;
            var midline = "<div class='mid-line' style='top:0px;left:" + midleft + "px'></div>";
            $flightArea.append(midline);
        }
       

        tempDate=tempDate.addDays(1);
    }
    $dayBar.append("<div style='clear:both'></div>");
    $timeBar.append("<div style='clear:both'></div>");
    $('.timeline').width((hourWidth + 1) * ndays * 24);
    $('.flights').width((hourWidth + 1) * ndays * 24);



    $('#btn').click(function () {
        alert('x');
        refreshHeights();
    });


    refreshHeights();

});