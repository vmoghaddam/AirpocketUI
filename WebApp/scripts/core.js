
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
function formatTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();

    //hours = hours % 12;
    //hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes;
    return strTime;
}
function formatTime2(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();

    //hours = hours % 12;
    //hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + '' + minutes;
    return strTime;
}

function formatHourAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + '' + ampm;
    return strTime;
}


function subtractDates(d1, d2) {


    var diff = Math.abs(new Date(d1) - new Date(d2));
    var minutes = ((diff / 1000) / 60);
    return minutes;
}
function subtractDatesHHMM(d1, d2) {


    var diff = Math.abs(new Date(d1) - new Date(d2));
    var minutes = ((diff / 1000) / 60);
    var hh = Math.floor(minutes / 60);
    var mm = minutes % 60;
    return [hh, mm];
}
// new Date("dateString") is browser-dependent and discouraged, so we'll write
// a simple parse function for U.S. date format (which does no error checking)
function parseDate(date) {
    var mdy = str.split('/');

    return new Date(mdy[2], mdy[0] - 1, mdy[1]);
}
function round2(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
function datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    var dfirst = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    var dsecond = new Date(second.getFullYear(), second.getMonth(), second.getDate());
    return Math.round((dsecond - dfirst) / (1000 * 60 * 60 * 24));
}

function daysBetween(date1, date2) {   //Get 1 day in milliseconds   
    var one_day = 1000 * 60 * 60 * 24;    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();    // Calculate the difference in milliseconds  
    var difference_ms = date2_ms - date1_ms;        // Convert back to days and return   
    return Math.round(difference_ms / one_day);
}
function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number.toString();
}
function minutesToHourString(m) {
    return pad(Math.floor(m / 60)).toString() + ':' + pad(m % 60).toString();
}
if (!Date.prototype.toUTCDateTimeDigits) {
    (function () {



        Date.prototype.toUTCDateTimeDigits = function () {
            return this.getUTCFullYear() +
                pad(this.getUTCMonth() + 1) +
                pad(this.getUTCDate()) +
                'T' +
                pad(this.getUTCHours()) +
                pad(this.getUTCMinutes()) +
                pad(this.getUTCSeconds()) +
                'Z';
        };

    }());
}

if (!Date.prototype.toDateTimeDigits) {
    (function () {



        Date.prototype.toDateTimeDigits = function () {
            return this.getFullYear() +
                pad(this.getMonth() + 1) +
                pad(this.getDate()) +
                'T' +
                pad(this.getHours()) +
                pad(this.getMinutes()) +
                pad(this.getSeconds()) +
                'Z';
        };

    }());
}
Date.prototype.getDatePart = function () {
    return this.getFullYear() +
        pad(this.getMonth() + 1) +
        pad(this.getDate());
};
Date.prototype.getDatePartSlash = function () {
    return this.getFullYear() + "/" +
        pad(this.getMonth() + 1) + "/" +
        pad(this.getDate());
};
Date.prototype.getDatePartArray = function () {
    var result = [];
    result.push(this.getFullYear());
    result.push(this.getMonth());
    result.push(this.getDate());
    return result;
};
Date.prototype.getTimePartArray = function () {
    var result = [];
    result.push(this.getHours());
    result.push(this.getMinutes());
    result.push(this.getSeconds());
    return result;
};
Date.prototype.addYears = function (n) {
    var y = this.getFullYear();
    this.setFullYear(y + n);
    return this;
};
Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
};
Date.prototype.addMinutes = function (h) {
    this.setTime(this.getTime() + (h * 60 * 1000));
    return this;
};
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};
Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('');
};
Date.prototype.yyyymmddtime = function (utc) {


    if (!utc) {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();
        var result = [this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
        ].join('/');
        result += " " + this.toLocaleTimeString();
    }

    else {
        result = "";
        var umm = this.getUTCMonth() + 1; // getMonth() is zero-based
        var udd = this.getUTCDate();
        var uhh = this.getUTCHours();
        var umi = this.getUTCMinutes();
        var uss = this.getUTCSeconds();
        result = this.getUTCFullYear() + "/"
            + ((umm > 9 ? '' : '0') + umm) + "/"
            + ((udd > 9 ? '' : '0') + udd) + " "
            +
            ((uhh > 9 ? '' : '0') + uhh) + ":" + ((umi > 9 ? '' : '0') + umi) + ":" + ((uss > 9 ? '' : '0') + uss);
    }

    return result;
};

Date.prototype.yyyymmddtimenow = function (utc) {
    var now = new Date();

    if (!utc) {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();
        var result = [this.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
        ].join('/');
        var hh = now.getHours();
        var mi = now.getMinutes();
        var ss = now.getSeconds();
        result += " " //+ this.toLocaleTimeString();
          + ((hh > 9 ? '' : '0') + hh) + ":" + ((mi > 9 ? '' : '0') + mi) + ":" + ((ss > 9 ? '' : '0') + ss);
    }

    else {
        result = "";
        var umm = this.getUTCMonth() + 1; // getMonth() is zero-based
        var udd = this.getUTCDate();
       
        var uhh = now.getUTCHours();
        
        var umi = now.getUTCMinutes();
        var uss = now.getUTCSeconds();
        result = this.getUTCFullYear() + "/"
            + ((umm > 9 ? '' : '0') + umm) + "/"
            + ((udd > 9 ? '' : '0') + udd) + " "
            +
            ((uhh > 9 ? '' : '0') + uhh) + ":" + ((umi > 9 ? '' : '0') + umi) + ":" + ((uss > 9 ? '' : '0') + uss);
    }

    return result;
};
Date.isLeapYear = function (year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.isLeapYear = function () {
    return Date.isLeapYear(this.getFullYear());
};

Date.prototype.getDaysInMonth = function () {
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};
function getUTCHour(hour) {
    var dt = new Date();
    dt.setHours(hour, 0, 0, 0);
    var hh = dt.getUTCHours();
    var mi = dt.getUTCMinutes();
    return ((hh > 9 ? '' : '0') + hh) + ":" + ((mi > 9 ? '' : '0') + mi);
}

Date.prototype.hhmmnow = function (utc) {

    var result = "";
    if (!utc) {
        result = "";
        var hh = this.getHours();
        var mi = this.getMinutes();
        var ss = this.getSeconds();
        result +=
            ((hh > 9 ? '' : '0') + hh) + ":" + ((mi > 9 ? '' : '0') + mi);// + ":" + ((ss > 9 ? '' : '0') + ss);
    }

    else {
        result = "";

        var uhh = this.getUTCHours();
        var umi = this.getUTCMinutes();
        var uss = this.getUTCSeconds();
        result =
            ((uhh > 9 ? '' : '0') + uhh) + ":" + ((umi > 9 ? '' : '0') + umi);// + ":" + ((uss > 9 ? '' : '0') + uss);
    }

    return result;
};

Date.prototype.ToUTC = function () {
    //2017-12-31T20:30:00.000Z

    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return this.getFullYear() + '-' + ((mm > 9 ? '' : '0') + mm) + '-' + ((dd > 9 ? '' : '0') + dd) + 'T' + '12:00:00.000Z';

};

Date.prototype.ToUTC2 = function (i) {
    //2017-12-31T20:30:00.000Z

    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return this.getFullYear() + '-' + ((mm > 9 ? '' : '0') + mm) + '-' + ((dd > 9 ? '' : '0') + dd) + 'T' + (!i ? '12:00:00.000Z' : '00:00:00.000Z');

};


if (typeof JSON.clone !== "function") {
    JSON.clone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };
}
if (typeof JSON.copy !== "function") {
    JSON.copy = function (source, destination) {
        for (var key in source) {

            var value = source[key];
            destination[key] = value;

        }
    };
}

if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
        padString = String(typeof padString !== 'undefined' ? padString : ' ');
        if (this.length >= targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}
Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

Date.prototype.isDstObserved = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
};

function GetTimeStr(minutes) {
    var hours = Math.floor(minutes / 60);
    var minutes = minutes % 60;
    var pad = "00"
    var ans = hours.toString() + ":" + pad.substring(0, pad.length - minutes.toString().length) + minutes.toString();
    return ans;
};
General = {};
//magu3-16
General.getDayFirstHour = function (d) {
    var dif = 0;
       dif = -60;
   
   // var off = (new Date(d)).getTimezoneOffset();
   // if (off == -270)
   //     dif = -60;
    var result = new Date(new Date(d.setHours(0)).setMinutes(0)).setSeconds(0);
   // if (dif != 0)
   //     result = new Date(result).addMinutes(dif);
   // alert(dif);
    return result;
};
General.getDayLastHour = function (d) {
    return new Date(new Date(d.setHours(23)).setMinutes(59)).setSeconds(59);
};
General.MonthDataSource = [
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
General.WeekDayDataSource = [
    { Id: 0, Title: 'Sunday' },
    { Id: 1, Title: 'Monday' },
    { Id: 2, Title: 'Tuesday' },
    { Id: 3, Title: 'Wednesday' },
    { Id: 4, Title: 'Thursday' },
    { Id: 5, Title: 'Friday' },
    { Id: 6, Title: 'Saturday' },


];
General.IsNumber = function (obj) {
    return !isNaN(parseFloat(obj))
};
General.getDsUrl = function (e) {
    var url = e.url;
    var parts = [];
    if (e.params.$filter)
        parts.push('$filter=' + e.params.$filter);
    if (e.params.$orderby)
        parts.push('$orderby=' + e.params.$orderby);
    if (parts.length > 0) {
        var ext = parts.join("&");
        url = url + "?" + ext;
    }
    return url;
};
General.getDigitalDateByUnix = function (unix) {
    var day = new persianDate(unix);

    var result = Number(day.year().toString() + day.month().toString().padStart(2, "0") + day.date().toString().padStart(2, "0"));
    return result;
};

General.ShowOK = function () {
    DevExpress.ui.notify({
        type: 'success',
        message: "تغییرات با موفقیت ذخیره شد",
        position: {
            my: "center top",
            at: "center top"
        }
    });
};
General.ShowNotify = function (str, t) {
    //'info' | 'warning' | 'error' | 'success' | 'custom'
    DevExpress.ui.notify({
        message: str,
        position: {
            my: "center top",
            at: "center top"
        },
        type: t,
        displayTime: 3000,
    });
};
General.ShowNotify2 = function (str, t, d) {
    //'info' | 'warning' | 'error' | 'success' | 'custom'
    DevExpress.ui.notify({
        message: str,
        position: {
            my: "center top",
            at: "center top"
        },
        type: t,
        displayTime: d,
    });
};

General.Confirm = function (str, callback) {
    var myDialog = DevExpress.ui.dialog.custom({
        rtlEnabled: true,
        title: "Confirm",
        message: str,
        buttons: [{ text: "No", onClick: function () { callback(false); } }, { text: "Yes", onClick: function () { callback(true); } }]
    });
    myDialog.show();

};

General.Modal = function (str, callback) {
    var myDialog = DevExpress.ui.dialog.custom({
        rtlEnabled: true,
        title: "پیغام",
        message: str,
        buttons: [{ text: "برگشت", onClick: function () { callback(); } }]
    });
    myDialog.show();

};
General.generateINTFull = function (key) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;

    var day = d.getDate();
    var h = d.getHours();
    var min = d.getMinutes();

    var ms = d.getMilliseconds();
    var s = d.getSeconds();
    return key.toString() + '_' + year.toString() + month.toString() + day.toString() + h.toString() + min.toString() + s.toString() + ms.toString();
};
General.addComma = function (str) {
    if (!str)
        return str;
    str = str.toString();
    var objRegex = new RegExp('(-?[0-9]+)([0-9]{3})');

    while (objRegex.test(str)) {
        str = str.replace(objRegex, '$1,$2');
    }

    return str;
};
General.removeComma = function (str) {

    if (str) {
        str = str.toString();
        return str.replace(/,/g, '');
    }
    return str;
};


///////////////////////////////////////////////////////////////
Weather = {};
Weather.getCompassPoint = function (num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
};
Weather.prepareWeather = function (weather) {

    var deg = 90 + Number(weather.currently.windBearing);
    weather.latitude = Number(weather.latitude).toFixed(4);
    weather.longitude = Number(weather.longitude).toFixed(4);
    weather.currently.windDeg = 'rotate(' + deg + 'deg)';
    weather.currently.windPoint = 'Winds from the ' + Weather.getCompassPoint(Number(weather.currently.windBearing));
    weather.currently.humidity = (Number(weather.currently.humidity) * 100).toFixed(1);
    weather.currently.cloudCover = (Number(weather.currently.cloudCover) * 100).toFixed(1);
    weather.currently.visibility = (Number(weather.currently.visibility) * 1000).toFixed(0);
    if (weather.hourly) {
        weather.hourly.h1 = {};
        weather.hourly.h2 = {};
        weather.hourly.h3 = {};
        weather.hourly.h4 = {};
        //  alert(formatHourAMPM($scope.weatherUpdateTime));
        for (var i = 1; i <= 4; i++) {
            var wh = weather.hourly.data[i];
            var hour = null;

            switch (i) {
                case 1:
                    hour = weather.hourly.h1;
                    break;
                case 2:
                    hour = weather.hourly.h2;
                    break;
                case 3:
                    hour = weather.hourly.h3;
                    break;
                case 4:
                    hour = weather.hourly.h4;
                    break;
                default:
                    break;
            }

            hour.time = formatHourAMPM(new Date(wh.time * 1000));
            hour.icon = wh.icon;
            hour.summary = wh.summary;
            hour.temperature = wh.temperature;
            hour.windtotal = wh.windSpeed + ' ' + Weather.getCompassPoint(Number(wh.windBearing));
            hour.visibility = Number(wh.visibility) * 1000;
            hour.cloudCover = (Number(wh.cloudCover) * 100).toFixed(1);

        }
    }

};
/////////////////////////////////////////////////////////////////
Flight = {};
Flight.Weather1 = '{"latitude":37.3833007812,"longitude":55.4519996643,"timezone":"Asia/Tehran","currently":{"time":1550464596,"summary":"Partly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":8.75,"apparentTemperature":8.75,"dewPoint":2.96,"humidity":0.67,"pressure":1016.5,"windSpeed":1.17,"windGust":17.43,"windBearing":171,"cloudCover":0.59,"uvIndex":0,"visibility":10.64,"ozone":349.29},"daily":{"summary":"Light rain today and tomorrow, with high temperatures bottoming out at 7°C on Wednesday.","icon":"rain","data":[{"time":1550435400,"summary":"Mostly cloudy in the morning.","icon":"partly-cloudy-day","sunriseTime":1550459136,"sunsetTime":1550498491,"moonPhase":0.45,"precipIntensity":0.0686,"precipIntensityMax":0.5486,"precipIntensityMaxTime":1550435400,"precipProbability":0.26,"precipType":"rain","temperatureHigh":16.44,"temperatureHighTime":1550489400,"temperatureLow":4.68,"temperatureLowTime":1550539800,"apparentTemperatureHigh":16.44,"apparentTemperatureHighTime":1550489400,"apparentTemperatureLow":3.3,"apparentTemperatureLowTime":1550539800,"dewPoint":0.14,"humidity":0.52,"pressure":1013.15,"windSpeed":4.99,"windGust":21.55,"windGustTime":1550435400,"windBearing":166,"cloudCover":0.33,"uvIndex":4,"uvIndexTime":1550478600,"visibility":13.62,"ozone":352.36,"temperatureMin":7.1,"temperatureMinTime":1550460600,"temperatureMax":16.44,"temperatureMaxTime":1550489400,"apparentTemperatureMin":5.81,"apparentTemperatureMinTime":1550442600,"apparentTemperatureMax":16.44,"apparentTemperatureMaxTime":1550489400},{"time":1550521800,"summary":"Foggy starting in the afternoon, continuing until evening.","icon":"fog","sunriseTime":1550545463,"sunsetTime":1550584954,"moonPhase":0.49,"precipIntensity":0.2159,"precipIntensityMax":0.348,"precipIntensityMaxTime":1550586600,"precipProbability":0.79,"precipType":"rain","temperatureHigh":8.01,"temperatureHighTime":1550557800,"temperatureLow":2.66,"temperatureLowTime":1550637000,"apparentTemperatureHigh":7.86,"apparentTemperatureHighTime":1550561400,"apparentTemperatureLow":0.8,"apparentTemperatureLowTime":1550637000,"dewPoint":-1.44,"humidity":0.57,"pressure":1016.02,"windSpeed":4.15,"windGust":14.4,"windGustTime":1550575800,"windBearing":248,"cloudCover":0.57,"uvIndex":3,"uvIndexTime":1550561400,"visibility":10.88,"ozone":372.07,"temperatureMin":4.68,"temperatureMinTime":1550539800,"temperatureMax":8.01,"temperatureMaxTime":1550557800,"apparentTemperatureMin":3.3,"apparentTemperatureMinTime":1550539800,"apparentTemperatureMax":7.86,"apparentTemperatureMaxTime":1550561400},{"time":1550608200,"summary":"Mostly cloudy until evening.","icon":"partly-cloudy-day","sunriseTime":1550631789,"sunsetTime":1550671417,"moonPhase":0.53,"precipIntensity":0.1295,"precipIntensityMax":0.3454,"precipIntensityMaxTime":1550615400,"precipProbability":0.6,"precipType":"rain","temperatureHigh":7.42,"temperatureHighTime":1550662200,"temperatureLow":-2.42,"temperatureLowTime":1550716200,"apparentTemperatureHigh":6.6,"apparentTemperatureHighTime":1550665800,"apparentTemperatureLow":-5.8,"apparentTemperatureLowTime":1550716200,"dewPoint":-3.91,"humidity":0.56,"pressure":1029.69,"windSpeed":3.98,"windGust":16.24,"windGustTime":1550647800,"windBearing":194,"cloudCover":0.57,"uvIndex":3,"uvIndexTime":1550651400,"visibility":12.55,"ozone":364.32,"temperatureMin":0.26,"temperatureMinTime":1550691000,"temperatureMax":7.42,"temperatureMaxTime":1550662200,"apparentTemperatureMin":-2.19,"apparentTemperatureMinTime":1550691000,"apparentTemperatureMax":6.6,"apparentTemperatureMaxTime":1550665800},{"time":1550694600,"summary":"Clear throughout the day.","icon":"clear-day","sunriseTime":1550718114,"sunsetTime":1550757880,"moonPhase":0.57,"precipIntensity":0,"precipIntensityMax":0.0025,"precipIntensityMaxTime":1550770200,"precipProbability":0,"temperatureHigh":13.98,"temperatureHighTime":1550752200,"temperatureLow":0.77,"temperatureLowTime":1550802600,"apparentTemperatureHigh":13.98,"apparentTemperatureHighTime":1550752200,"apparentTemperatureLow":-1.72,"apparentTemperatureLowTime":1550802600,"dewPoint":-6.15,"humidity":0.44,"pressure":1023.33,"windSpeed":7.71,"windGust":12.94,"windGustTime":1550773800,"windBearing":112,"cloudCover":0,"uvIndex":4,"uvIndexTime":1550734200,"visibility":16.09,"ozone":324.01,"temperatureMin":-2.42,"temperatureMinTime":1550716200,"temperatureMax":13.98,"temperatureMaxTime":1550752200,"apparentTemperatureMin":-5.8,"apparentTemperatureMinTime":1550716200,"apparentTemperatureMax":13.98,"apparentTemperatureMaxTime":1550752200},{"time":1550781000,"summary":"Clear throughout the day.","icon":"clear-day","sunriseTime":1550804438,"sunsetTime":1550844342,"moonPhase":0.6,"precipIntensity":0,"precipIntensityMax":0.0025,"precipIntensityMaxTime":1550835000,"precipProbability":0,"temperatureHigh":16.89,"temperatureHighTime":1550835000,"temperatureLow":3.62,"temperatureLowTime":1550885400,"apparentTemperatureHigh":16.89,"apparentTemperatureHighTime":1550835000,"apparentTemperatureLow":1.44,"apparentTemperatureLowTime":1550885400,"dewPoint":-4.72,"humidity":0.41,"pressure":1018.82,"windSpeed":3.56,"windGust":12.5,"windGustTime":1550781000,"windBearing":130,"cloudCover":0,"uvIndex":4,"uvIndexTime":1550820600,"visibility":16.09,"ozone":348.91,"temperatureMin":0.77,"temperatureMinTime":1550802600,"temperatureMax":16.89,"temperatureMaxTime":1550835000,"apparentTemperatureMin":-1.72,"apparentTemperatureMinTime":1550802600,"apparentTemperatureMax":16.89,"apparentTemperatureMaxTime":1550835000},{"time":1550867400,"summary":"Clear throughout the day.","icon":"clear-day","sunriseTime":1550890761,"sunsetTime":1550930803,"moonPhase":0.64,"precipIntensity":0,"precipIntensityMax":0.0025,"precipIntensityMaxTime":1550932200,"precipProbability":0,"temperatureHigh":19.04,"temperatureHighTime":1550921400,"temperatureLow":4.09,"temperatureLowTime":1550975400,"apparentTemperatureHigh":19.04,"apparentTemperatureHighTime":1550921400,"apparentTemperatureLow":2.44,"apparentTemperatureLowTime":1550975400,"dewPoint":-2.63,"humidity":0.41,"pressure":1017.08,"windSpeed":5.84,"windGust":11.68,"windGustTime":1550950200,"windBearing":121,"cloudCover":0,"uvIndex":4,"uvIndexTime":1550910600,"visibility":16.09,"ozone":368.84,"temperatureMin":3.62,"temperatureMinTime":1550885400,"temperatureMax":19.04,"temperatureMaxTime":1550921400,"apparentTemperatureMin":1.44,"apparentTemperatureMinTime":1550885400,"apparentTemperatureMax":19.04,"apparentTemperatureMaxTime":1550921400},{"time":1550953800,"summary":"Partly cloudy throughout the day.","icon":"partly-cloudy-night","sunriseTime":1550977083,"sunsetTime":1551017264,"moonPhase":0.67,"precipIntensity":0.0025,"precipIntensityMax":0.0051,"precipIntensityMaxTime":1550961000,"precipProbability":0.02,"precipType":"rain","temperatureHigh":20.66,"temperatureHighTime":1551007800,"temperatureLow":7.97,"temperatureLowTime":1551054600,"apparentTemperatureHigh":20.66,"apparentTemperatureHighTime":1551007800,"apparentTemperatureLow":6.24,"apparentTemperatureLowTime":1551054600,"dewPoint":-2.2,"humidity":0.38,"pressure":1015.48,"windSpeed":4.17,"windGust":11.67,"windGustTime":1550953800,"windBearing":112,"cloudCover":0.19,"uvIndex":3,"uvIndexTime":1550993400,"visibility":16.09,"ozone":374.14,"temperatureMin":4.09,"temperatureMinTime":1550975400,"temperatureMax":20.66,"temperatureMaxTime":1551007800,"apparentTemperatureMin":2.44,"apparentTemperatureMinTime":1550975400,"apparentTemperatureMax":20.66,"apparentTemperatureMaxTime":1551007800},{"time":1551040200,"summary":"Partly cloudy in the morning.","icon":"partly-cloudy-day","sunriseTime":1551063405,"sunsetTime":1551103725,"moonPhase":0.71,"precipIntensity":0.0025,"precipIntensityMax":0.0127,"precipIntensityMaxTime":1551054600,"precipProbability":0.05,"precipType":"rain","temperatureHigh":18.16,"temperatureHighTime":1551094200,"temperatureLow":8.49,"temperatureLowTime":1551148200,"apparentTemperatureHigh":18.16,"apparentTemperatureHighTime":1551094200,"apparentTemperatureLow":6.41,"apparentTemperatureLowTime":1551148200,"dewPoint":0.41,"humidity":0.45,"pressure":1012.83,"windSpeed":4.81,"windGust":23.14,"windGustTime":1551123000,"windBearing":164,"cloudCover":0.15,"uvIndex":4,"uvIndexTime":1551083400,"visibility":16.09,"ozone":363.59,"temperatureMin":7.97,"temperatureMinTime":1551054600,"temperatureMax":18.16,"temperatureMaxTime":1551094200,"apparentTemperatureMin":6.24,"apparentTemperatureMinTime":1551054600,"apparentTemperatureMax":18.16,"apparentTemperatureMaxTime":1551094200}]},"flags":{"sources":["cmc","gfs","icon","isd","madis"],"nearest-station":0,"units":"ca"},"offset":3.5}';
Flight.Weather2 = '{"latitude":43.16103,"longitude":-77.610924,"timezone":"America/New_York","currently":{"time":1550465255,"summary":"Light Snow","icon":"snow","nearestStormDistance":0,"precipIntensity":0.1524,"precipIntensityError":0.0508,"precipProbability":1,"precipType":"snow","temperature":-4.22,"apparentTemperature":-10.69,"dewPoint":-6.74,"humidity":0.82,"pressure":1012.05,"windSpeed":20.92,"windGust":21.15,"windBearing":77,"cloudCover":1,"uvIndex":0,"visibility":2.93,"ozone":322.44},"offset":-5}';
Flight.Weather3 = '{"latitude":35.6892013549805,"longitude":51.3134002685547,"timezone":"Asia/Tehran","currently":{"time":1551100899,"summary":"Partly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":11.56,"apparentTemperature":11.56,"dewPoint":-8.75,"humidity":0.23,"pressure":1019.62,"windSpeed":24.4,"windGust":28.55,"windBearing":231,"cloudCover":0.35,"uvIndex":0,"visibility":10.17,"ozone":396.99},"hourly":{"summary":"Partly cloudy until this evening.","icon":"partly-cloudy-day","data":[{"time":1551097800,"summary":"Breezy and Partly Cloudy","icon":"wind","precipIntensity":0,"precipProbability":0,"temperature":12.52,"apparentTemperature":12.52,"dewPoint":-8.6,"humidity":0.22,"pressure":1019.59,"windSpeed":28.63,"windGust":30.38,"windBearing":237,"cloudCover":0.37,"uvIndex":1,"visibility":10.04,"ozone":400.02},{"time":1551101400,"summary":"Partly Cloudy","icon":"partly-cloudy-day","precipIntensity":0,"precipProbability":0,"temperature":11.4,"apparentTemperature":11.4,"dewPoint":-8.78,"humidity":0.23,"pressure":1019.62,"windSpeed":23.74,"windGust":28.26,"windBearing":230,"cloudCover":0.35,"uvIndex":0,"visibility":10.19,"ozone":396.5},{"time":1551105000,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":9.57,"apparentTemperature":7.11,"dewPoint":-7.76,"humidity":0.29,"pressure":1019.73,"windSpeed":17.41,"windGust":20.07,"windBearing":236,"cloudCover":0.23,"uvIndex":0,"visibility":12.39,"ozone":391.47},{"time":1551108600,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":7.59,"apparentTemperature":6.16,"dewPoint":-6.21,"humidity":0.37,"pressure":1019.79,"windSpeed":8.14,"windGust":11.97,"windBearing":251,"cloudCover":0.07,"uvIndex":0,"visibility":16.09,"ozone":386.21},{"time":1551112200,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":6.27,"apparentTemperature":6.27,"dewPoint":-5.96,"humidity":0.41,"pressure":1019.83,"windSpeed":2.93,"windGust":10.72,"windBearing":315,"cloudCover":0.01,"uvIndex":0,"visibility":16.09,"ozone":380.67},{"time":1551115800,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":5.54,"apparentTemperature":5.54,"dewPoint":-6.51,"humidity":0.42,"pressure":1019.83,"windSpeed":4.72,"windGust":9.37,"windBearing":3,"cloudCover":0.01,"uvIndex":0,"visibility":16.09,"ozone":375.84},{"time":1551119400,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":5.02,"apparentTemperature":4.17,"dewPoint":-6.96,"humidity":0.42,"pressure":1019.78,"windSpeed":4.88,"windGust":7.97,"windBearing":20,"cloudCover":0.01,"uvIndex":0,"visibility":16.09,"ozone":373.27},{"time":1551123000,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":4.71,"apparentTemperature":4.71,"dewPoint":-7.31,"humidity":0.41,"pressure":1019.67,"windSpeed":4.3,"windGust":6.45,"windBearing":33,"cloudCover":0,"uvIndex":0,"visibility":16.09,"ozone":372.92},{"time":1551126600,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":4.54,"apparentTemperature":4.54,"dewPoint":-7.53,"humidity":0.41,"pressure":1019.53,"windSpeed":3.91,"windGust":5.31,"windBearing":44,"cloudCover":0,"uvIndex":0,"visibility":16.09,"ozone":373.88},{"time":1551130200,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":4.52,"apparentTemperature":4.52,"dewPoint":-7.52,"humidity":0.41,"pressure":1019.35,"windSpeed":3.94,"windGust":5.26,"windBearing":46,"cloudCover":0,"uvIndex":0,"visibility":16.09,"ozone":375.74},{"time":1551133800,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":4.59,"apparentTemperature":4.59,"dewPoint":-7.29,"humidity":0.42,"pressure":1019.13,"windSpeed":4.47,"windGust":6.29,"windBearing":37,"cloudCover":0,"uvIndex":0,"visibility":16.09,"ozone":378.45},{"time":1551137400,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":4.65,"apparentTemperature":3.67,"dewPoint":-7,"humidity":0.43,"pressure":1018.93,"windSpeed":5.09,"windGust":7.52,"windBearing":23,"cloudCover":0,"uvIndex":0,"visibility":16.09,"ozone":381.65},{"time":1551141000,"summary":"Clear","icon":"clear-night","precipIntensity":0.0051,"precipProbability":0.02,"precipType":"rain","temperature":4.53,"apparentTemperature":3.42,"dewPoint":-6.83,"humidity":0.43,"pressure":1018.82,"windSpeed":5.38,"windGust":7.98,"windBearing":10,"cloudCover":0,"uvIndex":0,"visibility":16.09,"ozone":385.03},{"time":1551144600,"summary":"Clear","icon":"clear-night","precipIntensity":0.0051,"precipProbability":0.03,"precipType":"rain","temperature":4.23,"apparentTemperature":3.1,"dewPoint":-6.77,"humidity":0.45,"pressure":1018.81,"windSpeed":5.33,"windGust":7.68,"windBearing":357,"cloudCover":0,"uvIndex":0,"visibility":16.09,"ozone":388.55},{"time":1551148200,"summary":"Clear","icon":"clear-night","precipIntensity":0,"precipProbability":0,"temperature":4,"apparentTemperature":2.9,"dewPoint":-6.62,"humidity":0.46,"pressure":1018.79,"windSpeed":5.17,"windGust":7.35,"windBearing":347,"cloudCover":0,"uvIndex":0,"visibility":16.09,"ozone":391.66},{"time":1551151800,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":3.98,"apparentTemperature":3.98,"dewPoint":-6.11,"humidity":0.48,"pressure":1018.67,"windSpeed":4.78,"windGust":7.5,"windBearing":341,"cloudCover":0,"uvIndex":0,"visibility":16.09,"ozone":393.72},{"time":1551155400,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":4.38,"apparentTemperature":4.38,"dewPoint":-5.22,"humidity":0.5,"pressure":1018.46,"windSpeed":4.02,"windGust":8.1,"windBearing":326,"cloudCover":0,"uvIndex":0,"visibility":16.09,"ozone":394.73},{"time":1551159000,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":5.09,"apparentTemperature":5.09,"dewPoint":-4.38,"humidity":0.5,"pressure":1018.07,"windSpeed":4.38,"windGust":9.21,"windBearing":311,"cloudCover":0,"uvIndex":1,"visibility":16.09,"ozone":394.38},{"time":1551162600,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":5.97,"apparentTemperature":5.1,"dewPoint":-3.98,"humidity":0.49,"pressure":1017.33,"windSpeed":5.28,"windGust":11.28,"windBearing":301,"cloudCover":0,"uvIndex":2,"visibility":16.09,"ozone":392.05},{"time":1551166200,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":7.22,"apparentTemperature":6.09,"dewPoint":-4.01,"humidity":0.45,"pressure":1016.24,"windSpeed":6.69,"windGust":14.27,"windBearing":284,"cloudCover":0,"uvIndex":4,"visibility":16.09,"ozone":387.74},{"time":1551169800,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":8.56,"apparentTemperature":7.18,"dewPoint":-4.26,"humidity":0.4,"pressure":1015.02,"windSpeed":8.66,"windGust":17.24,"windBearing":275,"cloudCover":0,"uvIndex":4,"visibility":16.09,"ozone":382.1},{"time":1551173400,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":9.89,"apparentTemperature":8.57,"dewPoint":-4.59,"humidity":0.36,"pressure":1013.82,"windSpeed":9.66,"windGust":19.3,"windBearing":272,"cloudCover":0,"uvIndex":4,"visibility":16.09,"ozone":375.29},{"time":1551177000,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":11.18,"apparentTemperature":11.18,"dewPoint":-5.01,"humidity":0.32,"pressure":1012.63,"windSpeed":9.98,"windGust":20.5,"windBearing":280,"cloudCover":0,"uvIndex":3,"visibility":16.09,"ozone":367.27},{"time":1551180600,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":12.05,"apparentTemperature":12.05,"dewPoint":-5.49,"humidity":0.29,"pressure":1011.55,"windSpeed":10.38,"windGust":20.82,"windBearing":292,"cloudCover":0,"uvIndex":2,"visibility":16.09,"ozone":359.49},{"time":1551184200,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":12.21,"apparentTemperature":12.21,"dewPoint":-5.98,"humidity":0.28,"pressure":1010.78,"windSpeed":8.42,"windGust":19.86,"windBearing":310,"cloudCover":0,"uvIndex":1,"visibility":16.09,"ozone":353.65},{"time":1551187800,"summary":"Clear","icon":"clear-day","precipIntensity":0,"precipProbability":0,"temperature":11.41,"apparentTemperature":11.41,"dewPoint":-6.48,"humidity":0.28,"pressure":1010.34,"windSpeed":6.21,"windGust":17.61,"windBearing":3,"cloudCover":0,"uvIndex":0,"visibility":16.09,"ozone":349.79},{"time":1551191400,"summary":"Clear","icon":"clear-night","precipIntensity":0.0102,"precipProbability":0.02,"precipType":"rain","temperature":10.01,"apparentTemperature":10.01,"dewPoint":-6.91,"humidity":0.3,"pressure":1010.02,"windSpeed":6.69,"windGust":14.89,"windBearing":27,"cloudCover":0,"uvIndex":0,"visibility":16.09,"ozone":347.05},{"time":1551195000,"summary":"Clear","icon":"clear-night","precipIntensity":0.0279,"precipProbability":0.01,"precipType":"rain","temperature":8.82,"apparentTemperature":8.44,"dewPoint":-7.26,"humidity":0.31,"pressure":1009.69,"windSpeed":4.94,"windGust":12.41,"windBearing":11,"cloudCover":0.02,"uvIndex":0,"visibility":16.09,"ozone":344.97},{"time":1551198600,"summary":"Clear","icon":"clear-night","precipIntensity":0.0711,"precipProbability":0.01,"precipType":"rain","temperature":8.06,"apparentTemperature":8.06,"dewPoint":-7.52,"humidity":0.32,"pressure":1009.35,"windSpeed":3.35,"windGust":10.17,"windBearing":353,"cloudCover":0.06,"uvIndex":0,"visibility":16.09,"ozone":343.54},{"time":1551202200,"summary":"Clear","icon":"clear-night","precipIntensity":0.1422,"precipProbability":0.01,"precipType":"rain","temperature":7.58,"apparentTemperature":7.58,"dewPoint":-7.57,"humidity":0.33,"pressure":1008.98,"windSpeed":2.93,"windGust":8.27,"windBearing":345,"cloudCover":0.14,"uvIndex":0,"visibility":16.09,"ozone":342.69},{"time":1551205800,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.2464,"precipProbability":0.02,"precipType":"rain","temperature":7.37,"apparentTemperature":7.37,"dewPoint":-7.22,"humidity":0.35,"pressure":1008.51,"windSpeed":2.32,"windGust":6.71,"windBearing":20,"cloudCover":0.31,"uvIndex":0,"visibility":16.09,"ozone":342.22},{"time":1551209400,"summary":"Partly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.3937,"precipProbability":0.02,"precipType":"rain","temperature":7.25,"apparentTemperature":7.25,"dewPoint":-6.45,"humidity":0.37,"pressure":1007.95,"windSpeed":3.14,"windGust":5.58,"windBearing":48,"cloudCover":0.58,"uvIndex":0,"visibility":16.09,"ozone":342.12},{"time":1551213000,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.5232,"precipProbability":0.03,"precipType":"rain","temperature":7.17,"apparentTemperature":7.17,"dewPoint":-5.51,"humidity":0.4,"pressure":1007.35,"windSpeed":3.72,"windGust":5.68,"windBearing":31,"cloudCover":0.84,"uvIndex":0,"visibility":16.09,"ozone":342.53},{"time":1551216600,"summary":"Overcast","icon":"cloudy","precipIntensity":0.541,"precipProbability":0.04,"precipType":"rain","temperature":7.02,"apparentTemperature":6.27,"dewPoint":-4.61,"humidity":0.43,"pressure":1006.76,"windSpeed":5.34,"windGust":9.03,"windBearing":23,"cloudCover":0.97,"uvIndex":0,"visibility":16.09,"ozone":343.8},{"time":1551220200,"summary":"Overcast","icon":"cloudy","precipIntensity":0.4623,"precipProbability":0.05,"precipType":"rain","temperature":6.85,"apparentTemperature":5.27,"dewPoint":-3.73,"humidity":0.47,"pressure":1006.16,"windSpeed":8.22,"windGust":15.76,"windBearing":27,"cloudCover":0.98,"uvIndex":0,"visibility":10.99,"ozone":345.84},{"time":1551223800,"summary":"Overcast","icon":"cloudy","precipIntensity":0.381,"precipProbability":0.06,"precipType":"rain","temperature":6.74,"apparentTemperature":4.58,"dewPoint":-2.89,"humidity":0.5,"pressure":1005.61,"windSpeed":10.88,"windGust":21.95,"windBearing":33,"cloudCover":0.97,"uvIndex":0,"visibility":5.76,"ozone":347.74},{"time":1551227400,"summary":"Overcast","icon":"cloudy","precipIntensity":0.3073,"precipProbability":0.06,"precipType":"rain","temperature":6.63,"apparentTemperature":4.37,"dewPoint":-2.22,"humidity":0.53,"pressure":1005.16,"windSpeed":11.3,"windGust":23.29,"windBearing":35,"cloudCover":0.95,"uvIndex":0,"visibility":4.63,"ozone":348.41},{"time":1551231000,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.2184,"precipProbability":0.06,"precipType":"rain","temperature":6.44,"apparentTemperature":4.49,"dewPoint":-1.76,"humidity":0.56,"pressure":1004.82,"windSpeed":9.5,"windGust":19.76,"windBearing":34,"cloudCover":0.93,"uvIndex":0,"visibility":7.64,"ozone":347.88},{"time":1551234600,"summary":"Mostly Cloudy","icon":"partly-cloudy-night","precipIntensity":0.1626,"precipProbability":0.06,"precipType":"rain","temperature":6.22,"apparentTemperature":4.76,"dewPoint":-1.43,"humidity":0.58,"pressure":1004.55,"windSpeed":7.34,"windGust":15.13,"windBearing":34,"cloudCover":0.9,"uvIndex":0,"visibility":11.57,"ozone":347.14},{"time":1551238200,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0.1778,"precipProbability":0.06,"precipType":"rain","temperature":6.17,"apparentTemperature":5.01,"dewPoint":-1.24,"humidity":0.59,"pressure":1004.36,"windSpeed":6.23,"windGust":12.34,"windBearing":46,"cloudCover":0.84,"uvIndex":0,"visibility":13.79,"ozone":347.05},{"time":1551241800,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0.2794,"precipProbability":0.08,"precipType":"rain","temperature":6.55,"apparentTemperature":5.47,"dewPoint":-1.18,"humidity":0.58,"pressure":1004.24,"windSpeed":6.16,"windGust":11.38,"windBearing":68,"cloudCover":0.76,"uvIndex":0,"visibility":14.29,"ozone":347.62},{"time":1551245400,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0.4216,"precipProbability":0.09,"precipType":"rain","temperature":7.24,"apparentTemperature":6.17,"dewPoint":-1.17,"humidity":0.55,"pressure":1004.05,"windSpeed":6.53,"windGust":10.93,"windBearing":84,"cloudCover":0.7,"uvIndex":1,"visibility":14.21,"ozone":348.32},{"time":1551249000,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0.5182,"precipProbability":0.11,"precipType":"rain","temperature":7.97,"apparentTemperature":6.98,"dewPoint":-1.04,"humidity":0.53,"pressure":1003.58,"windSpeed":6.61,"windGust":10.24,"windBearing":82,"cloudCover":0.7,"uvIndex":2,"visibility":14,"ozone":348.66},{"time":1551252600,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0.541,"precipProbability":0.12,"precipType":"rain","temperature":8.98,"apparentTemperature":8.18,"dewPoint":-0.78,"humidity":0.5,"pressure":1002.82,"windSpeed":6.47,"windGust":9.27,"windBearing":63,"cloudCover":0.76,"uvIndex":3,"visibility":13.66,"ozone":348.64},{"time":1551256200,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0.5232,"precipProbability":0.13,"precipType":"rain","temperature":10.03,"apparentTemperature":10.03,"dewPoint":-0.48,"humidity":0.48,"pressure":1002.04,"windSpeed":5.95,"windGust":8.72,"windBearing":55,"cloudCover":0.83,"uvIndex":3,"visibility":13.18,"ozone":348.63},{"time":1551259800,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0.4801,"precipProbability":0.12,"precipType":"rain","temperature":10.79,"apparentTemperature":10.79,"dewPoint":-0.17,"humidity":0.47,"pressure":1001.43,"windSpeed":6.34,"windGust":9.27,"windBearing":34,"cloudCover":0.87,"uvIndex":3,"visibility":12.75,"ozone":348.69},{"time":1551263400,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0.4191,"precipProbability":0.11,"precipType":"rain","temperature":11.07,"apparentTemperature":11.07,"dewPoint":0.14,"humidity":0.47,"pressure":1000.98,"windSpeed":8.88,"windGust":10.91,"windBearing":3,"cloudCover":0.86,"uvIndex":3,"visibility":12.34,"ozone":348.8},{"time":1551267000,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0.3454,"precipProbability":0.1,"precipType":"rain","temperature":10.84,"apparentTemperature":10.84,"dewPoint":0.36,"humidity":0.48,"pressure":1000.78,"windSpeed":10.27,"windGust":12.84,"windBearing":345,"cloudCover":0.85,"uvIndex":2,"visibility":11.57,"ozone":349.61},{"time":1551270600,"summary":"Mostly Cloudy","icon":"partly-cloudy-day","precipIntensity":0.2794,"precipProbability":0.09,"precipType":"rain","temperature":10.28,"apparentTemperature":10.28,"dewPoint":0.35,"humidity":0.5,"pressure":1000.98,"windSpeed":10.57,"windGust":14.23,"windBearing":336,"cloudCover":0.85,"uvIndex":1,"visibility":9.74,"ozone":352.09}]},"daily":{"summary":"Light rain tomorrow through Thursday, with high temperatures falling to 11°C on Friday.","icon":"rain","data":[{"time":1551040200,"summary":"Partly cloudy until evening.","icon":"partly-cloudy-day","sunriseTime":1551064301,"sunsetTime":1551104815,"moonPhase":0.71,"precipIntensity":0.061,"precipIntensityMax":0.188,"precipIntensityMaxTime":1551040200,"precipProbability":0.23,"precipType":"rain","temperatureHigh":12.82,"temperatureHighTime":1551094200,"temperatureLow":3.98,"temperatureLowTime":1551151800,"apparentTemperatureHigh":12.82,"apparentTemperatureHighTime":1551094200,"apparentTemperatureLow":2.9,"apparentTemperatureLowTime":1551148200,"dewPoint":-4.37,"humidity":0.42,"pressure":1020.95,"windSpeed":8.37,"windGust":30.38,"windGustTime":1551097800,"windBearing":272,"cloudCover":0.37,"uvIndex":4,"uvIndexTime":1551083400,"visibility":11.41,"ozone":378.29,"temperatureMin":4.71,"temperatureMinTime":1551123000,"temperatureMax":12.82,"temperatureMaxTime":1551094200,"apparentTemperatureMin":4.17,"apparentTemperatureMinTime":1551119400,"apparentTemperatureMax":12.82,"apparentTemperatureMaxTime":1551094200},{"time":1551126600,"summary":"Mostly cloudy overnight.","icon":"partly-cloudy-night","sunriseTime":1551150626,"sunsetTime":1551191271,"moonPhase":0.74,"precipIntensity":0.0381,"precipIntensityMax":0.3937,"precipIntensityMaxTime":1551209400,"precipProbability":0.1,"precipType":"rain","temperatureHigh":12.21,"temperatureHighTime":1551184200,"temperatureLow":6.17,"temperatureLowTime":1551238200,"apparentTemperatureHigh":12.21,"apparentTemperatureHighTime":1551184200,"apparentTemperatureLow":4.37,"apparentTemperatureLowTime":1551227400,"dewPoint":-6.17,"humidity":0.39,"pressure":1014.61,"windSpeed":3.99,"windGust":20.82,"windGustTime":1551180600,"windBearing":331,"cloudCover":0.05,"uvIndex":4,"uvIndexTime":1551166200,"visibility":16.09,"ozone":370.32,"temperatureMin":3.98,"temperatureMinTime":1551151800,"temperatureMax":12.21,"temperatureMaxTime":1551184200,"apparentTemperatureMin":2.9,"apparentTemperatureMinTime":1551148200,"apparentTemperatureMax":12.21,"apparentTemperatureMaxTime":1551184200},{"time":1551213000,"summary":"Foggy in the evening.","icon":"fog","sunriseTime":1551236949,"sunsetTime":1551277727,"moonPhase":0.78,"precipIntensity":0.3581,"precipIntensityMax":0.541,"precipIntensityMaxTime":1551252600,"precipProbability":0.34,"precipType":"rain","temperatureHigh":11.07,"temperatureHighTime":1551263400,"temperatureLow":3.88,"temperatureLowTime":1551321000,"apparentTemperatureHigh":11.07,"apparentTemperatureHighTime":1551263400,"apparentTemperatureLow":1.13,"apparentTemperatureLowTime":1551321000,"dewPoint":-1.55,"humidity":0.51,"pressure":1003.83,"windSpeed":6.39,"windGust":41.92,"windGustTime":1551292200,"windBearing":1,"cloudCover":0.88,"uvIndex":3,"uvIndexTime":1551252600,"visibility":9.93,"ozone":352.89,"temperatureMin":6.17,"temperatureMinTime":1551238200,"temperatureMax":11.07,"temperatureMaxTime":1551263400,"apparentTemperatureMin":4.37,"apparentTemperatureMinTime":1551227400,"apparentTemperatureMax":11.07,"apparentTemperatureMaxTime":1551263400},{"time":1551299400,"summary":"Partly cloudy starting in the evening.","icon":"partly-cloudy-night","sunriseTime":1551323272,"sunsetTime":1551364182,"moonPhase":0.81,"precipIntensity":0.127,"precipIntensityMax":0.5867,"precipIntensityMaxTime":1551371400,"precipProbability":0.17,"precipType":"rain","temperatureHigh":12.36,"temperatureHighTime":1551353400,"temperatureLow":4.41,"temperatureLowTime":1551407400,"apparentTemperatureHigh":12.36,"apparentTemperatureHighTime":1551353400,"apparentTemperatureLow":2.22,"apparentTemperatureLowTime":1551407400,"dewPoint":-3.49,"humidity":0.45,"pressure":1005.02,"windSpeed":7.69,"windGust":32.56,"windGustTime":1551299400,"windBearing":309,"cloudCover":0.29,"uvIndex":6,"uvIndexTime":1551342600,"visibility":16,"ozone":331.64,"temperatureMin":3.88,"temperatureMinTime":1551321000,"temperatureMax":12.36,"temperatureMaxTime":1551353400,"apparentTemperatureMin":1.13,"apparentTemperatureMinTime":1551321000,"apparentTemperatureMax":12.36,"apparentTemperatureMaxTime":1551353400},{"time":1551385800,"summary":"Mostly cloudy throughout the day.","icon":"partly-cloudy-day","sunriseTime":1551409594,"sunsetTime":1551450637,"moonPhase":0.84,"precipIntensity":0.0305,"precipIntensityMax":0.0914,"precipIntensityMaxTime":1551429000,"precipProbability":0.22,"precipType":"rain","temperatureHigh":10.67,"temperatureHighTime":1551439800,"temperatureLow":3.58,"temperatureLowTime":1551465000,"apparentTemperatureHigh":10.67,"apparentTemperatureHighTime":1551439800,"apparentTemperatureLow":0.91,"apparentTemperatureLowTime":1551493800,"dewPoint":-4.59,"humidity":0.46,"pressure":1003.43,"windSpeed":4.67,"windGust":16.05,"windGustTime":1551403800,"windBearing":336,"cloudCover":0.75,"uvIndex":3,"uvIndexTime":1551425400,"visibility":15.4,"ozone":357.13,"temperatureMin":3.58,"temperatureMinTime":1551465000,"temperatureMax":10.67,"temperatureMaxTime":1551439800,"apparentTemperatureMin":2.22,"apparentTemperatureMinTime":1551407400,"apparentTemperatureMax":10.67,"apparentTemperatureMaxTime":1551439800},{"time":1551472200,"summary":"Partly cloudy in the morning.","icon":"partly-cloudy-night","sunriseTime":1551495915,"sunsetTime":1551537092,"moonPhase":0.87,"precipIntensity":0.0127,"precipIntensityMax":0.0457,"precipIntensityMaxTime":1551529800,"precipProbability":0.07,"precipType":"rain","temperatureHigh":10.93,"temperatureHighTime":1551529800,"temperatureLow":4.73,"temperatureLowTime":1551583800,"apparentTemperatureHigh":10.93,"apparentTemperatureHighTime":1551529800,"apparentTemperatureLow":3.24,"apparentTemperatureLowTime":1551580200,"dewPoint":-8.6,"humidity":0.34,"pressure":1007.33,"windSpeed":10.06,"windGust":17.73,"windGustTime":1551519000,"windBearing":298,"cloudCover":0.19,"uvIndex":6,"uvIndexTime":1551515400,"visibility":16.09,"ozone":329.58,"temperatureMin":3.71,"temperatureMinTime":1551497400,"temperatureMax":10.93,"temperatureMaxTime":1551529800,"apparentTemperatureMin":0.91,"apparentTemperatureMinTime":1551493800,"apparentTemperatureMax":10.93,"apparentTemperatureMaxTime":1551529800},{"time":1551558600,"summary":"Partly cloudy until evening.","icon":"partly-cloudy-day","sunriseTime":1551582236,"sunsetTime":1551623546,"moonPhase":0.9,"precipIntensity":0.1473,"precipIntensityMax":0.3124,"precipIntensityMaxTime":1551601800,"precipProbability":0.12,"precipType":"rain","temperatureHigh":10.98,"temperatureHighTime":1551616200,"temperatureLow":5,"temperatureLowTime":1551670200,"apparentTemperatureHigh":10.98,"apparentTemperatureHighTime":1551616200,"apparentTemperatureLow":2.51,"apparentTemperatureLowTime":1551670200,"dewPoint":-8.52,"humidity":0.32,"pressure":1010.02,"windSpeed":3.54,"windGust":13.04,"windGustTime":1551573000,"windBearing":354,"cloudCover":0.23,"uvIndex":5,"uvIndexTime":1551601800,"visibility":16.09,"ozone":331.84,"temperatureMin":4.73,"temperatureMinTime":1551583800,"temperatureMax":10.98,"temperatureMaxTime":1551616200,"apparentTemperatureMin":3.24,"apparentTemperatureMinTime":1551580200,"apparentTemperatureMax":10.98,"apparentTemperatureMaxTime":1551616200},{"time":1551645000,"summary":"Mostly cloudy throughout the day.","icon":"partly-cloudy-day","sunriseTime":1551668556,"sunsetTime":1551710000,"moonPhase":0.93,"precipIntensity":0.0457,"precipIntensityMax":0.3099,"precipIntensityMaxTime":1551724200,"precipProbability":0.08,"precipType":"rain","temperatureHigh":11.29,"temperatureHighTime":1551699000,"temperatureLow":3.86,"temperatureLowTime":1551760200,"apparentTemperatureHigh":11.29,"apparentTemperatureHighTime":1551699000,"apparentTemperatureLow":2.44,"apparentTemperatureLowTime":1551745800,"dewPoint":-7.23,"humidity":0.35,"pressure":1012.61,"windSpeed":9.11,"windGust":21.85,"windGustTime":1551663000,"windBearing":306,"cloudCover":0.61,"uvIndex":3,"uvIndexTime":1551684600,"visibility":15.26,"ozone":333.88,"temperatureMin":5,"temperatureMinTime":1551670200,"temperatureMax":11.29,"temperatureMaxTime":1551699000,"apparentTemperatureMin":2.51,"apparentTemperatureMinTime":1551670200,"apparentTemperatureMax":11.29,"apparentTemperatureMaxTime":1551699000}]},"flags":{"sources":["cmc","gfs","icon","isd","madis"],"nearest-station":0.043,"units":"ca"},"offset":3.5}';
Flight.statusDataSource = [
    




    { id: 1, title: 'Scheduled', bgcolor: '#ffd480', color: '#fff', class: 'schedule', selectable: true },
{ id: 5, title: 'Delay', bgcolor: '#ff0000', color: '#fff', class: 'schedule', selectable: true },
    { id: 22, title: 'Boarding', bgcolor: '#ff66ff', color: '#fff', class: 'boarding', selectable: true },
    { id: 20, title: 'Start', bgcolor: '#80ffff', color: '#000', class: 'start', selectable: false },

     { id: 23, title: 'Gate Closed', bgcolor: '#cc33ff', color: '#fff', class: 'gateclosed', selectable: true },
      { id: 24, title: 'Ready', bgcolor: '#9900cc', color: '#fff', class: 'ready', selectable: true },
       { id: 25, title: 'Start', bgcolor: '#80ffff', color: '#000', class: 'start', selectable: true },


     { id: 14, title: 'Off Block', bgcolor: '#80ffff', color: '#fff', class: 'offblock', selectable: true },
    { id: 21, title: 'Taxi', bgcolor: '#00b3b3', color: '#fff', class: 'taxi', selectable: true },


  //  { id: 14, title: 'Off Block', bgcolor: '#00cc66', color: '#fff', class: 'offblock',selectable:true },
    { id: 2, title: 'Take Off', bgcolor: '#00ff00', color: '#000', class: 'takeoff', selectable: true },
    { id: 3, title: 'Landed', bgcolor: '#99ccff', color: '#000', class: 'landing', selectable: true },
    { id: 15, title: 'On Block', bgcolor: '#66b3ff', color: '#000', class: 'onblock', selectable: true },
    { id: 4, title: 'Canceled', bgcolor: '#808080', color: '#fff', class: 'cancel', selectable: true },
    { id: 9, title: 'Returned To Ramp', bgcolor: '#9900cc', color: '#fff', class: 'returntoramp', selectable: true },

    { id: 17, title: 'Diverted', bgcolor: '#e6e600', color: '#000', class: 'redirect', selectable: true },
    { id: 7, title: 'Diverted', bgcolor: '#e6e600', color: '#000', class: 'diverted' },

    { id: 6, title: 'Inactive', bgcolor: '#cccccc', color: '#000', class: 'inactive', selectable: true },

    { id: 8, title: 'Ground', bgcolor: '#ff8000', color: '#fff', class: 'ground' },

    { id: 10, title: 'Overlap', bgcolor: '#f44336', color: '#fff', class: 'overlap' },
    { id: 11, title: 'Gap', bgcolor: '#ff5722', color: '#fff', class: 'gap' },
    { id: 12, title: 'New', bgcolor: '#2196F3', color: '#fff', class: 'new' },
    { id: 13, title: 'Updated', bgcolor: '#4CAF50', color: '#fff', class: 'updated' },


    { id: 16, title: 'Gap-Overlap', bgcolor: '#8b0000', color: '#fff', class: 'gapoverlap' },

     { id: 10000, title: 'A-CHECK', bgcolor: 'slategray', color: '#fff', class: 'st10000 hatch-aog' },
      { id: 10001, title: 'C-CHECK', bgcolor: 'slategray', color: '#fff', class: 'st10001 hatch-aog' },
      { id: 10002, title: 'AOG', bgcolor: 'slategray', color: '#fff', class: 'st10002 hatch-aog' },

        { id: 10003, title: 'BACKUP', bgcolor: 'slategray', color: '#fff', class: 'st10003 hatch-aog' },
      { id: 10004, title: 'TECH', bgcolor: 'slategray', color: '#fff', class: 'st10004 hatch-aog' },
      { id: 10005, title: 'CHECK', bgcolor: 'slategray', color: '#fff', class: 'st10005 hatch-aog' },

         




];
Flight.BaseMetaData = [
    { iata: 'THR', bgcolor: '#ddffdd' },
    { iata: 'MHD', bgcolor: '#ffffcc' },
    { iata: 'TBZ', bgcolor: '#ddffff' },
    { iata: 'SYZ', bgcolor: '#ffdddd' },
    { iata: 'OMH', bgcolor: '#ffe6ff' },
];
Flight.getBaseMetaData = function (iata) {
    var d = Enumerable.From(Flight.BaseMetaData).Where("$.iata=='" + iata + "'").FirstOrDefault();

    return d;
};
Flight.filteredStatusDataSource = [
    { id: 1, title: 'Scheduled', bgcolor: '#f0f0f0', color: '#000', class: 'schedule' },
    { id: 14, title: 'Off Block', bgcolor: '#0086b3', color: '#fff', class: 'offblock' },
    { id: 2, title: 'Departed', bgcolor: '#00bfff', color: '#fff', class: 'takeoff' },
    { id: 3, title: 'Arrived', bgcolor: '#4CAF50', color: '#fff', class: 'landing' },

    { id: 15, title: 'On Block', bgcolor: '#005960', color: '#fff', class: 'onblock' },
];
Flight.getStatus = function (id) {
    var st = Enumerable.From(Flight.statusDataSource).Where("$.id==" + id).FirstOrDefault();
    return st;
};

Flight.IsDutyViolated = function (period, mins, maxfdp, reduction) {
    if (!reduction)
        reduction = 0;
    if (!maxfdp)
        maxfdp = 13 * 60;
    maxfdp -= reduction;
    switch (period) {
        case 1:

            return mins > maxfdp;
        case 7:
            return mins > 60 * 60;
        case 14:
            return mins > 110 * 60;
        case 28:
            return mins > 190 * 60;
        case 12:
            return mins > 1800 * 60;
        default:
            return false;
    }
};

Flight.IsFlightViolated = function (period, mins) {
    switch (period) {

        case 28:
            return mins > 100 * 60;
        case 12:
            return mins > 900 * 60;
        default:
            return false;
    }
};

var statusDataSource2 = [
    { id: 1, title: 'Schedule', bgcolor: '#f0f0f0', color: '#000', class: 'schedule' },

    { id: 4, title: 'Cancel', bgcolor: '#a65959', color: '#fff', class: 'cancel' },

    { id: 6, title: 'Inactive', bgcolor: '#ffff00', color: '#fff', class: 'inactive' },
    { id: 7, title: 'Diverted', bgcolor: '#ee82ee', color: '#fff', class: 'diverted' },
    { id: 8, title: 'Ground', bgcolor: '#ff8000', color: '#fff', class: 'ground' },
    { id: 9, title: 'NoData', bgcolor: '#787878', color: '#fff', class: 'nodata' },




];
Flight.activeDatasource = [];
Flight.renderlabelInterval = null;
Flight.renderLables = function (id) {
    // var _d = Enumerable.From(activeDatasource).Where('$.taskID==' + id).FirstOrDefault();
    if ($('#task-' + activeDatasource[activeDatasource.length - 1].taskId).length > 0)
        clearInterval(renderlabelInterval);
    $('.lbl_from').remove();
    $('.lbl_to').remove();
    $.each(activeDatasource, function (_i, _d) {
        var el = $('#task-' + _d.taskId);

        var p1 = el.parents('.e-childContainer');
        var echartcell = p1.parents('.e-chartcell');
        var p1_left = parseInt(p1.css('left'));
        var div_from = "<div id='task-" + _d.taskId + "-from' style='position:absolute;color:black;' class='lbl_from'>" + _d.from + "</div>";
        echartcell.append(div_from);
        var from = $('#task-' + _d.taskId + '-from');
        from_left = p1_left - from.width() - 5;
        from.css('left', from_left + 'px');
        // from.css('top', 5 + 'px');

        var div_to = "<div id='task-" + _d.taskId + "-to' style='position:absolute;color:black;'  class='lbl_to'>" + _d.to + "</div>";
        echartcell.append(div_to);
        var to = $('#task-' + _d.taskId + '-to');
        to_left = p1_left + p1.width() + 5;;
        to.css('left', to_left + 'px');
        // to.css('top', 5 + 'px');
    });
};
Flight.cindex = 0;
Flight.renderCompletedFunction = function (val, index) {
    //if (val == 5095) {
    //     var $e1 = $('.task-5095');
    //        console.log($e1.length);
    //        var $echildContainer = $e1.parents(".e-childContainer");
    //        console.log($echildContainer.length);
    //        var $echildContainer_left = $echildContainer.position().left;
    //        console.log($echildContainer_left);
    //        var $echartcell = $echildContainer.parents('.e-chartcell');
    //        console.log($echartcell.length);
    //        $echartcell.append("<span class='sbani' style='position:absolute;left:" + ($echildContainer_left - 10) + "px'>U</span>");
    //}
    return;
    Flight.cindex++;
    //console.log('taskid: ' + val + '    ' + index + '#  ' + cindex + '   ' + activeDatasource.length);
    if (Flight.cindex == Flight.activeDatasource.length) {
        Flight.cindex = 0;
        // renderlabelInterval=setInterval(function () { renderLables(); }, 100);
    }
    // renderLables(val);
};


Flight.getDelayFunction = function (val) {

    var dataItem = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + val).FirstOrDefault();

    return dataItem.delay;
};




$.views.converters("round", function (val) {
    // Convert data-value or expression to upper case
    return Math.round(val);
});
//getLinkedId
$.views.converters("getLinkedId", function (val) {



    // Convert data-value or expression to upper case
    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + val).FirstOrDefault();

    return data.LinkedFlight ? data.LinkedFlight : '';
});
$.views.converters("statusClass", function (val) {



    // Convert data-value or expression to upper case
    var dataItem = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + val).FirstOrDefault();

    if (dataItem) {
        if (!dataItem.status)
            return "";
        var cls = '';
        //googool
        if (dataItem.status == 1 && !dataItem.FlightPlanId) {
            cls = 'nonschedule2';
        }
        else {
            var status = Enumerable.From(Flight.statusDataSource).Where('$.id==' + dataItem.status).FirstOrDefault();
            cls = status.class;
        }

        var lnk = '';

        if (dataItem.LinkedFlight) {

            lnk = ' linked-flight';
        }
        return cls + lnk;
    }
    else {

        return "";
    }
});

$.views.converters("delayClass", function (val) {



    // Convert data-value or expression to upper case
    var dataItem = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + val).FirstOrDefault();

    if (dataItem && dataItem.notes && Number(dataItem.notes) > 0) {
        return " hatch-delay";
    }
    else {

        return "";
    }
});

$.views.converters("boxTypeClass", function (val) {



    // Convert data-value or expression to upper case
    var dataItem = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + val).FirstOrDefault();
    var cls = "nobox";
    if (dataItem.IsBox) {
        cls = "box";
        if (dataItem.WOCLError == 1)
            return "box boxDutyOver";
        if (dataItem.IsDutyOver == 1)
            return "box boxDutyOver";
            //  if (dataItem.HasCrewProblem)
            //     return "box hascrewproblem";
            //  else if (dataItem.AllCrewAssigned)
            //      return "box allasigned";
        else if (dataItem.ExtendedBySplitDuty)
            return "box extended";

    }

    return cls;

});

$.views.converters("statusIcon", function (val) {



    // Convert data-value or expression to upper case
    var dataItem = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + val).FirstOrDefault();

    if (dataItem) {
        if (!dataItem.status)
            return "";
        if (dataItem.status == 1)
            return "";

        switch (dataItem.status) {
            case 14:
                return '<i style="position:relative;top:0px;left:2px;font-size:12px;color:white" class="far fa-square"></i>';
            case 2:
                return '<i style="position:relative;top:0px;left:2px;font-size:12px;color:white" class="fas fa-plane-departure"></i>';
            case 3:
                return '<i style="position:relative;top:0px;left:2px;font-size:12px;color:white" class="fas fa-plane-arrival"></i>';
            default:
                return "";
        }



    }
    else
        return "";
});
$.views.converters("delayIcon", function (val) {

    return '<i style="position:relative;top:0px;font-size:12px;color:white;display:block" class="fas fa-hourglass-start"></i>';
});
$.views.converters("testConverter", function (val) {
    return val;
});
$.views.converters("delayElement", function (val) {
    var element = '';
    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + val).FirstOrDefault();
    if (data.status > 0) {
        if (data.delay > 0) {
            var delay = Math.round(data.delay);
            element = delay
                + '<i style="position:relative;top:0px;font-size:12px;color:white;display:block" class="fas fa-hourglass-start"></i>'
            ;
        }
    }
    return element;
});
$.views.converters("delayElementLight", function (val) {
    var element = '';
    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + val).FirstOrDefault();
    if (data.status > 0) {
        if (data.delay > 0) {
            var delay = Math.round(data.delay);
            // element = "<span style='display:inline-block;margin-top:7px;font-size:9px'>" + delay + "</span>";
            element = "<span style='display:inline-block;margin-top:7px;font-size:9px'>" + "</span>";


        }
    }
    return element;
});
$.views.converters("delayElementLightCeo", function (val) {
    var element = '';
    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + val).FirstOrDefault();
    if (data.status > 0) {
        if (data.delay > 0) {
            var delay = Math.round(data.delay);
            // element = "<span style='display:inline-block;margin-top:7px;font-size:9px'>" + delay + "</span>";
            element = "<span style='display:inline-block;margin-top:-1px;font-size:11px;font-weight:bold'>" +delay+ "</span>";


        }
    }
    return element;
});
$.views.converters("arrivalDelayElement", function (val) {
    var parts = val.toString().split("-");
    var taskId = parts[0];
    var width = parts[1];
    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    var element = '';
    if (data.status > 0) {
        if (data.delayLanding > 0) {
            var adelay = Math.round(data.delayLanding);
            var dwidth = ((data.delayLanding / 60) / data.duration) * width;
            element = '<div class="e-gantt-template-progressbar1 KKK" style="font-size:9px;overflow:visible;opacity:0.2;text-align:left;color:white;padding-top:1px;border:0px solid red !important;margin-top:2px;right:0 !important;left:initial !important;width:' + dwidth + 'px; border-radius:0 !important;margin-left:2px;background: #ff5722!important;opacity:1 !important;top:-1px;position:absolute;height:100%;padding-left:5px">'
                + adelay
                + '<i style="position:relative;top:0px;font-size:12px;color:white;display:block" class="fas fa-hourglass-end"></i>'
                + '</div>';
        }
    }
    return element;
});
$.views.converters("arrivalDelayElementLight", function (val) {
    var parts = val.toString().split("-");
    var taskId = parts[0];
    var width = parts[1];
    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    var element = '';
    if (data.status > 0) {
        if (data.delayLanding > 0) {
            var adelay = Math.round(data.delayLanding);
            var dwidth = ((data.delayLanding / 60) / data.duration) * width;
            element = '<div class="e-gantt-template-progressbar1 KKK" style="font-size:9px;overflow:visible;opacity:0.2;text-align:left;color:white;padding-top:1px;border:0px solid red !important;margin-top:2px;right:0 !important;left:initial !important;width:' + dwidth + 'px; border-radius:0 !important;margin-left:2px;background: #ff5722!important;opacity:1 !important;top:-1px;position:absolute;height:100%;padding-left:0px;text-align:center">'

            + "<span style='display:inline-block;margin-top:7px;font-size:9px;position:relative;'>" + adelay + "</span>"
                + '</div>';
        }
    }
    return element;
});
$.views.converters("takeOffElement", function (val) {

    var parts = val.toString().split("-");
    var taskId = parts[0];
    var width = parts[1];

    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    var element = '';
    if (data.status > 0 && data.status != 14) {
        if (data.Takeoff) {
            var d1 = new Date(data.STD);
            var d2 = new Date(data.Takeoff);
            var delay = (subtractDates(d2, d1) / 60);


            var dwidth = (delay / data.duration) * width;
            element = '<div class="e-gantt-template-progressbar1 KKK" style="font-size:9px;overflow:visible;opacity:0.2;text-align:center;color:white;padding-top:1px;border-right:1px dotted white !important;margin-top:2px; left:0 !important;width:' + dwidth + 'px; border-radius:0 !important;margin-left:2px;background: transparent !important;opacity:1 !important;top:-1px;position:absolute;height:100%">'

                + '<i style="position:absolute;top:1px;right:-8px;font-size:12px;color:white;display:block;color:yellow" class="fas fa-plane-departure"></i>'
                + '</div>';

        }
    }
    return element;
});
$.views.converters("rampElement", function (val) {

    var parts = val.toString().split("-");
    var taskId = parts[0];
    var width = parts[1];

    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    var element = '';
    if (data.status > 0) {
        if (data.RampDate) {

            var d1 = new Date(data.STD);
            var d2 = new Date(data.RampDate);
            var delay = (subtractDates(d2, d1) / 60);
            //alert(d1);
            //alert(d2);
            //alert(data.duration);
            //alert(delay);

            var dwidth = (delay / data.duration) * width;
            element = '<div class="e-gantt-template-progressbar1 ramp" style="font-size:9px;overflow:visible;opacity:0.2;text-align:center;color:white;padding-top:1px;border-right:1px dotted white !important;margin-top:2px; left:0 !important;width:' + dwidth + 'px; border-radius:0 !important;margin-left:2px;background: transparent !important;opacity:1 !important;top:-1px;position:absolute;height:100%">'

                + '<i style="position:absolute;top:1px;right:-8px;font-size:12px;color:white;display:block;color:yellow" class="fas fa-long-arrow-alt-left"></i>'
                + '</div>';

        }
    }
    return element;
});

$.views.converters("landingElement", function (val) {

    var parts = val.toString().split("-");
    var taskId = parts[0];
    var width = parts[1];

    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    var element = '';
    if (data.status > 0) {
        if (data.Takeoff) {
            var d1 = new Date(data.STD);
            var d2 = new Date(data.Landing);
            var delay = (subtractDates(d2, d1) / 60);


            var dwidth = (delay / data.duration) * width;
            element = '<div class="e-gantt-template-progressbar1 KKK" style="z-index:1000;font-size:9px;overflow:visible;opacity:0.2;text-align:center;color:white;padding-top:1px;border-right:1px dotted white !important;margin-top:2px; left:0 !important;width:' + dwidth + 'px; border-radius:0 !important;margin-left:2px;background: transparent !important;opacity:1 !important;top:-1px;position:absolute;height:100%">'

                + '<i style="position:absolute;top:18px;right:-8px;font-size:12px;color:white;display:block;color:yellow" class="fas fa-plane-arrival"></i>'
                + '</div>';

        }
    }
    console.log('land element');
    console.log(element);
    return element;
});
//xati
$.views.converters("boxItems", function (val) {

    var parts = val.toString().split("-");
    var taskId = parts[0];
    var width = parts[1];
    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    if (!data.IsBox)
        return "";
    //data.Sectors = 2;
    //data.FDP = '4:00';
    //data.MaxFDP = '10:30';
    var element = "";
    var box_duration = data.duration;
    console.log('fdp fdp fdp fdp fdp fdp');
    console.log(data);
    $.each(data.BoxItems, function (_i, _d) {
        var abr = Enumerable.From(Flight.FlightTypes).Where('$.Id==' + _d.FlightTypeID).FirstOrDefault().Abr;
        var lhours = Flight.subtractDatesHours(new Date(_d.STD), new Date(data.STD));

        var left = (lhours / data.duration) * width;

        var dwidth = (_d.duration / data.duration) * width;
        if (_i == data.BoxItems.length - 1)
            dwidth -= 7;
        var std = formatTime(new Date(_d.STD));
        var sta = formatTime(new Date(_d.STA));
        var errorx = _d.MaleFemalError;
        var errormatch = _d.MatchingListError > 0;
        //#990099
        var bkcolor = '#a6a6a6';
        if (_d.SplitDuty == true && !_d.IsPositioning)
            bkcolor = '#7094db';
        else if (_d.SplitDuty == true && _d.IsPositioning == true)
            bkcolor = '#e600e6';
        else if (_d.IsPositioning == true)
            bkcolor = '#990099';

        var positioning = _d.IsPositioning == true ? 'P' : '';
        var spduty = _d.SplitDuty == true ? 'S' : '';
        element += '<div class="e-gantt-template-progressbar1 div-flight" data-flightid="' + _d.ID + '" style="left:' + left + 'px !important;font-size:9px;overflow:visible;opacity:1;text-align:center;color:white;padding-top:1px;border:1px solid gray !important;margin-top:4px; width:' + dwidth + 'px; border-radius:0 !important;margin-left:2px;background: ' + (bkcolor) + ' !important;opacity:1 !important;top:-1px;position:absolute;height:30px">'
            // +'<span style="font-size:12px;line-height:29px;font-family:Segoe UI">('+abr+') '+_d.taskName+'</span>'
           + "<span style='font-size:9px;position: absolute;top:3px;left:0;writing-mode:vertical-lr; text-orientation:mixed'>" + std + "</span>"
           + "<span style='font-size:9px;position: absolute;top:3px;right:-1px;writing-mode:vertical-lr; text-orientation:mixed'>" + sta + "</span>"
          + '<span style="font-size:9px;line-height:29px;font-family:Segoe UI;position:relative;top:-9px">' + (_d.FromAirportIATA + '-' + _d.ToAirportIATA) + '</span>'
            + '<span style="font-size:11px;line-height:29px;font-family:Segoe UI;display:block;position:relative;top:-26px">'
            // + (errorx ? '<i class="fas fa-user" style="font-size:9px;position: relative;left:-2px;top:-1px;color:red"></i>' : '')
             + (errormatch ? '<i class="fas fa-puzzle-piece" style="font-size:9px;position: relative;left:0px;top:-1px;color:red"></i>' : '')
             + (positioning ? '<span style="font-size:9px;font-style: italic;position:relative;left:-2px;top:-5px">P</span>' : '')

             + (spduty ? '<span style="font-size:9px;font-style: italic;position:relative;left:-2px;top: 4px">S</span>' : '')
            + _d.FlightNumber

            + '</span>'

                   + '</div>';

    });
    var error = (data.IsDutyOver /*|| data.MaleFemalError || data.MatchingListError*/);
    element += '<div style="font-size:10px;position:absolute;bottom:-3px;left:0;width:100%;background:' + (error ? 'red' : 'white') + ';text-align:center;color:' + (error ? 'white' : 'black') + ';font-weight:bold">'
        + (data.HasCrew ? '<i class="fas fa-user" style="font-size:8px;position: relative;left:-2px;top:-1px"></i>' : '')
        + 'D ' + minutesToHourString(data.Duty) + ', '
     //+ 'Sectors: ' + data.Sectors + ', '
     + 'M ' + minutesToHourString(data.MaxFDPExtended)

    + '</div>';
    //  element += '<div class="e-gantt-template-progressbar1 KKK" style="left:200px !important;font-size:9px;overflow:visible;opacity:1;text-align:center;color:white;padding-top:1px;border:1px solid red !important;margin-top:5px;  ;width:' + dwidth + 'px; border-radius:0 !important;margin-left:2px;background: pink !important;opacity:1 !important;top:-1px;position:absolute;height:85%">'
    //           + '</div>';
    return element;
});
Flight.FlightTypes = [{ Id: 109, Abr: 'S' }
    , { Id: 1112, Abr: 'C' }
    , { Id: 1113, Abr: 'F' }
    , { Id: 1114, Abr: 'P' }
];
$.views.converters("flightCaption", function (val) {

    var taskId = val;


    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    var abr = Enumerable.From(Flight.FlightTypes).Where('$.Id==' + data.FlightTypeID).FirstOrDefault().Abr;

    if (data.IsBox)
        return "";
    else
        return "<span style='display:inline-block;font-size:12px;z-index:2000'>(" + abr + ")</span><span style='display:inline-block;margin-left:2px;font-size:12px'>" + data.taskName + "</span>";
});
$.views.converters("getFlightRoute", function (val) {
    //aloosk
    var taskId = val;


    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
   
    if (data.FlightStatusID >= 10000)
        return "&nbsp;";
    if (data.ID == 11117) {


    }
    var abr = Enumerable.From(Flight.FlightTypes).Where('$.Id==' + data.FlightTypeID).FirstOrDefault().Abr;

    if (data.IsBox)
        return "";
    else {
        var elem = "<span style='display:inline-block;font-size:12px'>(" + abr + ")</span><span style='display:inline-block;margin-left:2px;font-size:12px'>" + data.taskName + "</span>";
        if (data.FlightStatusID == 17 || data.RedirectReasonId) {
            elem = data.FromAirportIATA + "-" + data.OToAirportIATA + ">" + data.ToAirportIATA;
            //elem += "<div style='position:relative;top:-12px;z-index:2000'><span style='display:inline-block;margin-top:2px;font-size:11px'>" + data.FlightNumber + "</span></div>";
        }
        else if (data.LinkedFlight) {
            elem = data.FromAirportIATA + "-" + data.ToAirportIATA;
            //elem += "<div style='position:relative;top:-12px;z-index:2000'><span style='display:inline-block;margin-top:2px;font-size:10px'>" + data.FlightNumber + "<span style='font-size:9px;'>(" + data.LinkedFlightNumber + ")</span>" + "</span></div>";
        }
        else {
            elem = data.FromAirportIATA + "-" + data.ToAirportIATA;
            // elem += "<div style='position:relative;top:-12px;z-index:2000'><span style='display:inline-block;margin-top:2px;font-size:11px'>" + data.FlightNumber + "</span></div>";
        }



        return elem;
    }

});
$.views.converters("flightCaptionLight", function (val) {
    //aloosk
    var taskId = val;


    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    if (data.ID == 11117) {
        console.log('diversion');
        console.log(data);
    }
    var abr = Enumerable.From(Flight.FlightTypes).Where('$.Id==' + data.FlightTypeID).FirstOrDefault().Abr;

    if (data.IsBox)
        return "";
    else {
        var elem = "<span style='display:inline-block;font-size:10px'>(" + abr + ")</span><span style='display:inline-block;margin-left:2px;font-size:11px'>" + data.taskName + "</span>";
        if (data.FlightStatusID == 17 || data.RedirectReasonId) {
            elem = "<div style='position:relative;top:-5px;z-index:2000'><span style='display:inline-block;margin-left:1px;font-size:9px'>" + data.FromAirportIATA + "-" + data.OToAirportIATA + ">" + data.ToAirportIATA + "</span></div>";
            elem += "<div style='position:relative;top:-12px;z-index:2000'><span style='display:inline-block;margin-top:2px;font-size:11px'>" + data.FlightNumber + "</span></div>";
        }
        else if (data.LinkedFlight) {
            elem = "<div style='position:relative;top:-5px;z-index:2000'><span style='display:inline-block;margin-left:1px;font-size:10px'>" + data.FromAirportIATA + "-" + data.ToAirportIATA + "</span></div>";
            elem += "<div style='position:relative;top:-12px;z-index:2000'><span style='display:inline-block;margin-top:2px;font-size:10px'>" + data.FlightNumber + "<span style='font-size:9px;'>(" + data.LinkedFlightNumber + ")</span>" + "</span></div>";
        }
        else {
            elem = "<div style='position:relative;top:-5px;z-index:2000'><span style='display:inline-block;margin-left:1px;font-size:10px'>" + data.FromAirportIATA + "-" + data.ToAirportIATA + "</span></div>";
            elem += "<div style='position:relative;top:-12px;z-index:2000'><span style='display:inline-block;margin-top:2px;font-size:11px'>" + data.FlightNumber + "</span></div>";
        }

        //if (data.FlightStatusID != 17) {
        //    elem = "<div style='position:relative;top:-5px;z-index:2000'><span style='display:inline-block;font-size:9px'>(" + abr + ")</span><span style='display:inline-block;margin-left:1px;font-size:10px'>" + data.FromAirportIATA + "-" + data.ToAirportIATA + "</span></div>";
        //    elem += "<div style='position:relative;top:-12px;z-index:2000'><span style='display:inline-block;margin-top:2px;font-size:11px'>" + data.FlightNumber + "</span></div>";
        //}
        //else if (data.FlightStatusID == 17 || data.RedirectReasonId) {
        //    elem = "<div style='position:relative;top:-5px;z-index:2000'><span style='display:inline-block;font-size:9px'>(" + abr + ")</span><span style='display:inline-block;margin-left:1px;font-size:10px'>" + data.FromAirportIATA + "-" + data.OToAirportIATA + ">" + data.ToAirportIATA  + "</span></div>";
        //    elem += "<div style='position:relative;top:-12px;z-index:2000'><span style='display:inline-block;margin-top:2px;font-size:11px'>" + data.FlightNumber + "</span></div>";
        //}

        return elem;
    }

});
$.views.converters("flightCaptionLight2", function (val) {
    //aloosk
    var taskId = val;


    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    if (data.ID == 11117) {
        console.log('diversion');
        console.log(data);
    }
    var abr = Enumerable.From(Flight.FlightTypes).Where('$.Id==' + data.FlightTypeID).FirstOrDefault().Abr;

    if (data.IsBox)
        return "";
    else {
        var elem = "<span style='display:inline-block;font-size:10px'>(" + abr + ")</span><span style='display:inline-block;margin-left:2px;font-size:11px;font-weight:bold'>" + data.taskName + "</span>";
        if (data.FlightStatusID == 17 || data.RedirectReasonId) {
            //elem = "<div style='position:relative;top:-5px;z-index:2000'><span style='display:inline-block;margin-left:1px;font-size:9px'>" + data.FromAirportIATA + "-" + data.OToAirportIATA + ">" + data.ToAirportIATA + "</span></div>";
            elem = "<div style='position:relative;top:-5px;z-index:2000;font-size:11px;font-weight:bold;height:15px;'><span style='display:inline-block;font-size:11px;position:relative;top:3px;'>" + data.FlightNumber + "</span></div>";
        }
        else if (data.LinkedFlight) {
            //elem = "<div style='position:relative;top:-5px;z-index:2000'><span style='display:inline-block;margin-left:1px;font-size:10px'>" + data.FromAirportIATA + "-" + data.ToAirportIATA + "</span></div>";
            elem = "<div style='position:relative;top:-5px;z-index:2000;font-size:11px;font-weight:bold;height:15px;'><span style='display:inline-block;font-size:10px;position:relative;top:3px;'>" + data.FlightNumber + "<span style='font-size:9px;display:inline-block;margin-left:2px;'>(" + data.LinkedFlightNumber + ")</span>" + "</span></div>";
        }
        else if (data.FlightStatusID >= 10000) {
            //elem = "<div style='position:relative;top:-5px;z-index:2000'><span style='display:inline-block;margin-left:1px;font-size:10px'>" + data.FromAirportIATA + "-" + data.ToAirportIATA + "</span></div>";
            elem = "<div style='position:relative;top:-5px;z-index:2000;font-size:11px;font-weight:bold;height:15px;'><span style='display:inline-block;font-size:11px;position:relative;top:3px;padding:0 5px 0 5px;background:yellow; color:black'>" + data.FlightNumber + "</span></div>";
        }
        else if (data.FlightStatusID == 4) {
            //elem = "<div style='position:relative;top:-5px;z-index:2000'><span style='display:inline-block;margin-left:1px;font-size:10px'>" + data.FromAirportIATA + "-" + data.ToAirportIATA + "</span></div>";
            
            elem = "<div style='position:relative;top:-5px;z-index:2000;font-size:12px;font-weight:bold;height:15px;'><span style='display:inline-block;font-size:11px;position:relative;top:3px;'>" + data.FlightNumber + "<span style='display:inline-block;margin-left:2px;font-size:11px'>(CNL)</span></span></div>";
        }
        else {
            //elem = "<div style='position:relative;top:-5px;z-index:2000'><span style='display:inline-block;margin-left:1px;font-size:10px'>" + data.FromAirportIATA + "-" + data.ToAirportIATA + "</span></div>";
            elem = "<div style='position:relative;top:-5px;z-index:2000;font-size:11px;font-weight:bold;height:15px;'><span style='display:inline-block;font-size:12px;position:relative;top:3px;'>" + data.FlightNumber + "</span></div>";
        }



        return elem;
    }

});
$.views.converters("getSTDTime", function (val) {
    var taskId = val;


    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    if (data.IsBox)
        return "";
    var std = formatTime(new Date(data.STD));

    return "<span style='font-size:9px;position: absolute;top:3px;left:0;writing-mode:vertical-lr; text-orientation:mixed'>" + std + "</span>";
});
$.views.converters("getSTATime", function (val) {
    var taskId = val;


    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    if (data.IsBox)
        return "";
    var sta = formatTime(new Date(data.STA));

    return "<span style='font-size:9px;position: absolute;top:3px;right:-1px;writing-mode:vertical-lr; text-orientation:mixed'>" + sta + "</span>";
});
//dook
$.views.converters("getSTDTime2", function (val) {
    var taskId = val;


    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    if (data.IsBox)
        return "";
    var std = formatTime2(new Date(data.STD));

    return std;//"<span style='font-size:9px;position: absolute;top:3px;left:0;writing-mode:vertical-lr; text-orientation:mixed'>" + std + "</span>";
});
$.views.converters("getSTATime2", function (val) {
    var taskId = val;


    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    if (data.IsBox)
        return "";
    var sta = formatTime2(new Date(data.STA));

    return sta; "<span style='font-size:9px;position: absolute;top:3px;right:-1px;writing-mode:vertical-lr; text-orientation:mixed'>" + sta + "</span>";
});

$.views.converters("getTimeSch", function (val) {
    var taskId = val;

    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    if (data.IsBox)
        return "";
    if (data.FlightStatusID >= 10000)
        return "&nbsp;";
    //return (new Date(data.STD)).yyyymmddtime(false) + " " + (new Date(data.STA)).yyyymmddtime(false);
   
        var std = formatTime2(new Date(data.STD));
        var sta = formatTime2(new Date(data.STA));

    return std + ' ' + sta;

});

$.views.converters("getTime2", function (val) {
    var taskId = val;

    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    if (data.IsBox)
        return "";
    if (data.FlightStatusID >= 10000)
        return "&nbsp;";
    //return (new Date(data.STD)).yyyymmddtime(false) + " " + (new Date(data.STA)).yyyymmddtime(false);
    if (data.ChocksOut)
        var std = formatTime2(new Date(data.ChocksOut));
    else
        var std = formatTime2(new Date(data.STD));

    if (data.ChocksIn)
        var sta = formatTime2(new Date(data.ChocksIn));
    else
        var sta = formatTime2(new Date(data.STA));

    return std + ' ' + sta;

});


$.views.converters("flightCaptionBox", function (val) {

    var taskId = val;


    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    if (data.ID == 11117) {
        console.log('diversion');
        console.log(data);
    }
    // var abr = Enumerable.From(Flight.FlightTypes).Where('$.Id==' + data.FlightTypeID).FirstOrDefault().Abr;
    var error = 0;

    if (data.IsBox)
        return "";
    else {
        var elem = "<span style='display:inline-block;margin-left:2px;font-size:11px'>" + data.taskName + "</span>";
        if (data.FlightStatusID == 17 || data.RedirectReasonId) {
            elem = "<div style='position:relative;top:-5px;z-index:2000'><span style='display:inline-block;margin-left:1px;font-size:10px'>" + data.FromAirportIATA + "-" + data.OToAirportIATA + ">" + data.ToAirportIATA + "</span></div>";
            elem += "<div style='position:relative;top:-12px;z-index:2000'><span style='display:inline-block;margin-top:2px;font-size:11px'>" + data.FlightNumber + "</span></div>";
        }
        else {
            elem = "<div style='position:relative;top:-5px;z-index:2000'><span style='display:inline-block;margin-left:1px;font-size:10px'>" + data.FromAirportIATA + "-" + data.ToAirportIATA + "</span></div>";
            elem += "<div style='position:relative;top:-12px;z-index:2000'><span style='display:inline-block;margin-top:2px;font-size:11px'>" + data.FlightNumber + "</span>"
            + (error ? "<i class='fas fa-user' style='font-size:8px;position: relative;left:-2px;top:-1px;color:red'></i>" : "")
            + "</div>";
        }



        return elem;
    }

});

$.views.converters("redirectElement", function (val) {

    var parts = val.toString().split("-");
    var taskId = parts[0];
    var width = parts[1];

    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    var element = '';
    if (data.status > 0) {
        if (data.RedirectDate) {

            var d1 = new Date(data.STD);
            var d2 = new Date(data.RedirectDate);
            var delay = (subtractDates(d2, d1) / 60);


            var dwidth = (delay / data.duration) * width;
            element = '<div class="e-gantt-template-progressbar1 KKK" style="font-size:9px;overflow:visible;opacity:0.2;text-align:center;color:white;padding-top:1px;border-right:1px dotted white !important;margin-top:2px; left:0 !important;width:' + dwidth + 'px; border-radius:0 !important;margin-left:2px;background: transparent !important;opacity:1 !important;top:-1px;position:absolute;height:100%">'

                + '<i style="position:absolute;top:0px;right:-8px;font-size:12px;color:yellow;display:block; " class="fas fa-random"></i>'
                + '</div>';

        }
    }
    return element;
});

Gantt = {};
Gantt.renderCompletedFunction = function (val, index) {
    var taskId = val;
    var data = Enumerable.From(Flight.activeDatasource).Where('$.taskId==' + taskId).FirstOrDefault();
    var elem = $(".xati");
    if (data.IsBox) {
        // alert(elem.length);
    }
    //     alert(val + '   ' + index);
};
var myHelpers = { renderCompleted: Flight.renderCompletedFunction, getDelay: Flight.getDelayFunction, renderCompleted2: Gantt.renderCompletedFunction };

$.views.helpers(myHelpers);
Flight.renderLables1 = function () {
    $.each(resourceGanttData, function (_i, _d) {
        var el = $('#task-' + _d.taskId);
        var p1 = el.parents('.e-childContainer');
        var echartcell = p1.parents('.e-chartcell');
        var p1_left = parseInt(p1.css('left'));
        var div_from = "<div id='task-" + _d.taskId + "-from' style='position:absolute;color:black;'>" + _d.from + "</div>";
        echartcell.append(div_from);
        var from = $('#task-' + _d.taskId + '-from');
        from_left = p1_left - from.width() - 10;
        from.css('left', from_left + 'px');

        var div_to = "<div id='task-" + _d.taskId + "-to' style='position:absolute;color:black;'>" + _d.to + "</div>";
        echartcell.append(div_to);
        var to = $('#task-' + _d.taskId + '-to');
        to_left = p1_left + p1.width() + 10;;
        to.css('left', to_left + 'px');
    });
};

Flight.renderTasks = function () {
    $.each(resourceGanttData, function (_i, _d) {
        var $element = $('#task-' + _d.taskId);


        var $childtaskbar = $element.parents('.e-gantt-childtaskbar');
        if (_d.status) {

            var status = Enumerable.From(statusDataSource).Where('$.id==' + _d.status).FirstOrDefault();
            $childtaskbar.css('color', status.color).css('background-color', status.bgcolor);
            $childtaskbar.addClass(status.title);
            //   console.log($childtaskbar.css('background-color') + ' ' + _d.taskID);
        }

    });
};
Flight.subtractDates = function (d1, d2) {


    var diff = Math.abs(new Date(d1) - new Date(d2));
    var minutes = ((diff / 1000) / 60);
    return minutes;
};
Flight.subtractDatesHours = function (d1, d2) {


    var diff = Math.abs(new Date(d1) - new Date(d2));
    var hours = ((diff / 1000) / 60 / 60);
    return hours;
};
Flight.calculateDuration = function (h, m) {
    return h * 1.0 + (m * 1.0 / 60.0);
};
Flight.calculateDelay = function (item) {
    if (!item.TakeOff)
        return;
    var d1 = new Date(item.startDate);
    var d2 = new Date(item.TakeOff);
    var delay = (subtractDates(d1, d2));
    item.delay = delay;
    //if (item.delay && item.delay > 0)
    {
        item.duration = Number(item.baseDuration) + (item.delay / 60) + (item.delayLanding / 60);
        item.progress = ((item.delay / 60) / item.duration) * 100;

    }
    Flight.calculateBaseEndDate(item);
    Flight.calculateBaseStartDate(item);
    //  console.log(item);

};

Flight.calculateEstimatedDelay = function (item) {
    if (item.ChocksOut)
        return;

    item.delay = item.EstimatedDelay;
    if (item.delay && item.delay > 0) {
        item.duration = Number(item.baseDuration) + (item.delay / 60);
        item.progress = ((item.delay / 60) / item.duration) * 100;


    }
    else {
        item.duration = Number(item.baseDuration);
        item.progress = 0;
    }
    Flight.calculateBaseEndDate(item);
    Flight.calculateBaseStartDate(item);

    //  console.log(item);

};
Flight.XcalculateDelayOffBlock = function (item) {
    //zook
    if (!item.ChocksOut)
        return;
    var d1 = new Date(item.startDate);
    var d2 = new Date(item.ChocksOut);
    var delay = (subtractDates(d1, d2));
    item.delay = delay;
    //if (item.delay && item.delay > 0)
    {
        item.duration = Number(item.baseDuration) + (item.delay / 60); //+ (item.delayLanding / 60);
        item.progress = ((item.delay / 60) / item.duration) * 100;

    }
    Flight.calculateBaseEndDate(item);
    Flight.calculateBaseStartDate(item);

    //  console.log(item);

};

Flight.calculateDelayOffBlock = function (item) {
    //zook
    if (!item.ChocksOut)
        return;
    var d1 = new Date(item.startDate);
    var d2 = new Date(item.ChocksOut);
    var delay = (subtractDates(d1, d2));
    item.delay = delay;
    //if (item.delay && item.delay > 0)
    {
        item.duration = Number(item.baseDuration) + (item.delay / 60); //+ (item.delayLanding / 60);
        item.progress = ((item.delay / 60) / item.duration) * 100;

    }
    Flight.calculateBaseEndDate(item);
    Flight.calculateBaseStartDate(item);
    if (item.ID == 10485) {
        console.log('10485');
        console.log(item.delay);
        console.log(item.delayLanding);
        console.log(item.baseDuration);

    }
    //  console.log(item);

};

Flight.calculateDelayLanding = function (item) {
    if (!item.Landing)
        return;
    var d1 = new Date(item.baseEndDate);
    var d2 = new Date(item.Landing);
    var delay = (subtractDates(d1, d2));
    item.delayLanding = delay;
    // if (item.delayLanding && item.delayLanding > 0)
    {
        item.duration = Number(item.baseDuration) + (item.delay / 60) + (item.delayLanding / 60);


    }

    //  console.log(item);

};
Flight.calculateDelayLandingOnBlock = function (item) {
    if (!item.ChocksIn)
        return;
    // var d1 = new Date(item.baseEndDate);
    var d1 = new Date(item.STA);
    var d2 = new Date(item.ChocksIn);
    var delay = (subtractDates(d1, d2));
    item.delayLanding = delay;
    // if (item.delayLanding && item.delayLanding > 0)
    {
        //soosk
        item.duration = Number(item.baseDuration) + (item.delay / 60) + (item.delayLanding / 60);


    }

    //  console.log(item);

};
Flight.XcalculateDelayLandingOnBlock = function (item) {
    if (!item.ChocksIn)
        return;
    // var d1 = new Date(item.baseEndDate);
    var d1 = new Date(item.STA);
    var d2 = new Date(item.ChocksIn);
    var delay = (subtractDates(d1, d2));
    item.delayLanding = delay;
    // if (item.delayLanding && item.delayLanding > 0)
    {
        //soosk
        item.duration = Number(item.baseDuration) + (item.delayLanding / 60);


    }

    //  console.log(item);

};

Flight.calculateBaseEndDate = function (item) {

    var edate = new Date(item.startDate);
    edate = edate.addHours(item.duration);
    item.baseEndDate = edate;

};
Flight.calculateBaseStartDate = function (item) {
    var date = new Date(item.startDate);
    if (!item.delay || item.delay == 0) {
        item.baseStartDate = date;
        return;
    }


    date = date.addMinutes(item.delay);
    item.baseStartDate = date;
    //console.log(item.baseStartDate);

};
Flight.processData = function (_d) {

    _d.delay = 0;
    _d.delayLanding = 0;
    _d.baseDuration = Number(_d.duration);
    if (_d.TakeOff) {
        var d1 = new Date(_d.startDate);
        var d2 = new Date(_d.TakeOff);
        var delay = (subtractDates(d1, d2));
        _d.delay = delay;
        //          console.log(delay);
    }
    if (_d.delay && _d.delay > 0) {
        _d.duration = Number(_d.duration) + (_d.delay / 60);
        _d.progress = ((_d.delay / 60) / _d.duration) * 100;

    }
    Flight.calculateBaseEndDate(_d);
    Flight.calculateBaseStartDate(_d);
};
Flight.processDataOffBlock2 = function (_d) {

    _d.delay = 0;
    _d.delayLanding = 0;
    _d.baseDuration = Number(_d.duration);


    Flight.calculateBaseEndDate(_d);
    Flight.calculateBaseStartDate(_d);


};

//joosku
Flight.processDataOffBlock = function (_d) {

    _d.delay = 0;
    _d.delayLanding = 0;
    _d.baseDuration = Number(_d.duration);

    if (_d.ChocksOut && new Date(_d.ChocksOut) > new Date(_d.startDate)) {
        var d1 = new Date(_d.startDate);
        var d2 = new Date(_d.ChocksOut);
        var delay = (subtractDates(d1, d2));
        _d.delay = delay;
        //          console.log(delay);
    }
    else if (_d.EstimatedDelay > 0 && _d.status == 1) {
        _d.delay = _d.EstimatedDelay;
    }
    if (_d.delay && _d.delay > 5) {
        _d.duration = Number(_d.duration) + (_d.delay / 60);
        _d.progress = ((_d.delay / 60) / _d.duration) * 100;

    }
    //looki
    Flight.calculateBaseEndDate(_d);
    
    Flight.calculateBaseStartDate(_d);
    //jati
    ////////////Landing Delay////////////////////
    if (_d.ChocksIn && new Date(_d.STA) < new Date(_d.ChocksIn)) {

        // var delaylanding = (subtractDates(new Date(_d.baseEndDate), new Date(_d.ChocksIn)));
        //NEW
        var delaylanding = (subtractDates(new Date(_d.STA), new Date(_d.ChocksIn)));
       
        _d.delayLanding = delaylanding;
        _d.duration = Number(_d.baseDuration) /*+ (_d.delay / 60)*/ + (_d.delayLanding / 60);
    }
    //if (_d.FlightNumber == '10')
    //     alert(_d.duration);
    /////////////////////////////////
    //hoosk

    Flight.calculateBaseEndDate(_d);
    
    Flight.calculateBaseStartDate(_d);

};


Flight.proccessDataSource = function (ds) {

    $.each(ds, function (_i, _d) {
        // Flight.processData(_d);
        Flight.processDataOffBlock(_d);
        if (_d.IsBox) {
            $.each(_d.BoxItems, function (_j, _x) {
                Flight.processDataOffBlock(_x);
            });
        }
        // console.log(_d);
    });
    return ds;
};
//six
Flight.proccessDataSource2 = function (ds) {

    $.each(ds, function (_i, _d) {
        // Flight.processData(_d);
        Flight.processDataOffBlock2(_d);
        if (_d.IsBox) {
            $.each(_d.BoxItems, function (_j, _x) {
                Flight.processDataOffBlock2(_x);
            });
        }
        // console.log(_d);
    });
    return ds;
};

Flight.proccessFlight = function (_d) {

    // Flight.processData(_d);
    Flight.processDataOffBlock(_d);
    if (_d.IsBox) {
        $.each(_d.BoxItems, function (_j, _x) {
            Flight.processDataOffBlock(_x);
        });
    }
    // console.log(_d);

    return _d;
};



Flight.calculateNextTaskDelay = function (current, dataSource, gantt) {
    if (!current.delay)
        return;
    //Date.parse(datetimeStart) < Date.parse(datetimeEnd)
    var next = Enumerable.From(dataSource).Where('$.status==1 && $.startDate.getDatePart()==' + current.startDate.getDatePart() + ' && $.startDate.getTime() > ' + current.startDate.getTime() + '  && $.RegisterID==' + current.RegisterID).OrderBy('$.startDate').FirstOrDefault();


    if (!next)
        return;
    next.delay = current.delay;
    next.EstimatedDelay = next.delay;
    next.duration = Number(next.baseDuration) + (next.delay / 60) + (next.delayLanding / 60);
    next.progress = ((next.delay / 60) / next.duration) * 100;
    Flight.calculateBaseEndDate(next);
    Flight.calculateBaseStartDate(next);

    // var ganttObj = $("#resourceGantt").data("ejGantt");
    gantt.updateRecordByTaskId(next);
    Flight.calculateNextTaskDelay(next, dataSource, gantt);

};

Flight.calculateNextTaskDelayOffBlock = function (current, dataSource, gantt) {
    if (!current.delay)
        return;
    //Date.parse(datetimeStart) < Date.parse(datetimeEnd)
    var next = Enumerable.From(dataSource).Where('$.status==1 && $.startDate.getDatePart()==' + current.startDate.getDatePart() + ' && $.startDate.getTime() > ' + current.startDate.getTime() + '  && $.RegisterID==' + current.RegisterID).OrderBy('$.startDate').FirstOrDefault();


    if (!next)
        return;
    next.delay = current.delay;
    next.EstimatedDelay = next.delay;
    next.EstimatedDelayChanged = true;
    next.duration = Number(next.baseDuration) + (next.delay / 60) + (next.delayLanding / 60);
    next.progress = ((next.delay / 60) / next.duration) * 100;
    Flight.calculateBaseEndDate(next);
    Flight.calculateBaseStartDate(next);

    // var ganttObj = $("#resourceGantt").data("ejGantt");
    gantt.updateRecordByTaskId(next);
    Flight.calculateNextTaskDelayOffBlock(next, dataSource, gantt);

};

Flight.findOverlaps = function (data, rowId, callback) {
    console.log('find overlaps');
    var row = Enumerable.From(data).Where("$.RegisterID==" + rowId).ToArray();
    $.each(row, function (_i, _d) {
        var overlap = Enumerable.From(row)
            .Where(function (x) {
                var criteria = ((new Date(_d.STD) >= new Date(x.STD) && new Date(_d.STD) <= new Date(x.STA)) || (new Date(_d.STA) >= new Date(x.STD) && new Date(_d.STA) <= new Date(x.STA)))

                    && x.RegisterID == _d.RegisterID && x.taskId != _d.taskId;
                // console.log(criteria);

                return criteria;
            }).FirstOrDefault();
        if (overlap) {

            // console.log(_d.Id+'  '+_d.status);
            if (_d.status == 11 || _d.status == 16) {
                _d.status = 16;
                // _d.initStatus.push(16);
            }
            else {
                _d.status = 10;
                // _d.initStatus.push(10);
            }
        }
        else {
            //_d.initStatus = Enumerable.From(_d.initStatus).Where("$!=" + 10).ToArray();
            //_d.status = 1;// _d.initStatus[_d.initStatus.length - 1];

        }
    });
    if (callback)
        callback();
};

Flight.findGaps = function (data, res, callback) {
    console.log('find gaps');
    $.each(res, function (_j, _res) {
        var row = Enumerable.From(data).Where("$.RegisterID==" + _res.resourceId).OrderBy(function (x) { return new Date(x.STD) }).ToArray();
        $.each(row, function (_i, _d) {

            if (_i > 0) {
                var pre = row[_i - 1];
                // console.log(_d.FromAirport + '   ' + pre.ToAirport);
                // console.log(pre);
                if (_d.FromAirport != pre.ToAirport) {
                    // console.log('find gaps');
                    // console.log(_d.status);
                    // console.log(_d.initStatus);

                    if (_d.status == 10 || _d.status == 16) {

                        _d.status = 16;
                        //console.log('gaps ' + _d.Id + '  ' + _d.status);
                        //console.log(_d);
                        //var vmdata = Enumerable.From(data).Where('$.Id==' + _d.Id).FirstOrDefault();
                        //console.log(vmdata);
                        // _d.initStatus.push(16);
                    }
                    else {
                        _d.status = 11;
                        // _d.initStatus.push(11);
                    }


                }
                else {
                    // _d.initStatus = Enumerable.From(_d.initStatus).Where("$!=" + 11).ToArray();
                    _d.status = 1;// _d.initStatus[_d.initStatus.length - 1];

                }
            }
            else {
                // _d.initStatus = Enumerable.From(_d.initStatus).Where("$!=" + 11).ToArray();
                _d.status = 1;// _d.initStatus[_d.initStatus.length - 1];
            }
        });
    });
    if (callback)
        callback();

};

Flight.getEstimatedOffBlock = function (flight) {
    //console.log(flight);
    if (flight.delay > 0) {

        var d = new Date((new Date(flight.STD)).addMinutes(flight.delay));

        return d;

    }

    return new Date(flight.STD);
};


////////
Flight.findOverlapsgrid = function (data, rowId) {
    var row = Enumerable.From(data).Where("$.RegisterID==" + rowId).ToArray();
    $.each(row, function (_i, _d) {
        var overlap = Enumerable.From(row)
            .Where(function (x) {
                var criteria = ((new Date(_d.STD) >= new Date(x.STD) && new Date(_d.STD) <= new Date(x.STA)) || (new Date(_d.STA) >= new Date(x.STD) && new Date(_d.STA) <= new Date(x.STA)))

                    && x.RegisterID == _d.RegisterID && x.Id != _d.Id;


                return criteria;
            }).FirstOrDefault();
        if (overlap) {
            if (_d.status == 11 || _d.status == 16) {
                _d.status = 16;
                _d.FlightStatus = Flight.getStatus(_d.status).title;
            }
            else {
                _d.status = 10;
                _d.FlightStatus = Flight.getStatus(_d.status).title;
                //_d.initStatus.push(10);
            }


        }
        else {
            //  _d.initStatus = Enumerable.From(_d.initStatus).Where("$!=" + 10).ToArray();
            //  _d.status = _d.initStatus[_d.initStatus.length - 1];
            //  _d.FlightStatus = Flight.getStatus(_d.status).title;

        }
    });
};

Flight.findGapsgrid = function (data) {
    var res = Enumerable.From(data).Select('$.RegisterID').Distinct().ToArray();


    $.each(res, function (_j, _res) {
        var row = Enumerable.From(data).Where("$.RegisterID==" + _res).OrderBy(function (x) { return new Date(x.STD) }).ToArray();
        console.log('findgapflights');
        console.log(row);
        $.each(row, function (_i, _d) {

            if (_i > 0) {
                var pre = row[_i - 1];
                // console.log(_d.FromAirport + '   ' + pre.ToAirport);
                // console.log(pre);
                if (_d.FromAirport != pre.ToAirport) {
                    if (_d.status == 10 || _d.status == 16) {
                        _d.status = 16;
                        _d.FlightStatus = Flight.getStatus(_d.status).title;
                    }
                    else {
                        _d.status = 11;
                        _d.FlightStatus = Flight.getStatus(_d.status).title;
                        // _d.initStatus.push(11);
                    }

                }
                else {
                    // _d.initStatus = Enumerable.From(_d.initStatus).Where("$!=" + 11).ToArray();
                    // _d.status = _d.initStatus[_d.initStatus.length - 1];
                    _d.status = 1;
                    _d.FlightStatus = Flight.getStatus(_d.status).title;

                }
            }
            else {
                //_d.initStatus = Enumerable.From(_d.initStatus).Where("$!=" + 11).ToArray();
                //_d.status = _d.initStatus[_d.initStatus.length - 1];
                _d.status = 1;
                _d.FlightStatus = Flight.getStatus(_d.status).title;
            }
        });
    });


};

Flight.getLastFlight = function (data, msn) {
    //OrderByDescending
    var result = Enumerable.From(data).Where("$.RegisterID==" + msn).OrderByDescending(function (x) { return new Date(x.STD) }).FirstOrDefault();
    return result;
};

////////////////////////////////////////////////////////////////
function GetTimeOffset(dt) {
    var date = new Date(dt);
    if (dt >= new Date(2019, 0, 1, 0, 0, 0, 0) && dt < new Date(2019, 2, 22, 0, 0, 0, 0))
        return -210;
    else
        if (dt >= new Date(2019, 2, 22, 0, 0, 0, 0) && dt < new Date(2019, 8, 22, 0, 0, 0, 0))
            return -270;
        else
            if (dt >= new Date(2019, 8, 22, 0, 0, 0, 0) && dt < new Date(2020, 0, 1, 0, 0, 0, 0))
                return -210;

    if (dt >= new Date(2020, 0, 1, 0, 0, 0, 0) && dt < new Date(2020, 2, 21, 0, 0, 0, 0))
        return -210;
    else
        if (dt >= new Date(2020, 2, 21, 0, 0, 0, 0) && dt < new Date(2020, 8, 21, 0, 0, 0, 0))
            return -270;
        else
            if (dt >= new Date(2020, 8, 21, 0, 0, 0, 0) && dt < new Date(2021, 0, 1, 0, 0, 0, 0))
                return -210;


}


/////////////////////////////////////