Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};
function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}
Date.prototype.addMinutes = function (h) {
    this.setTime(this.getTime() + (h * 60 * 1000));
    return this;
};
Date.prototype.ToUTC=function(){
//2017-12-31T20:30:00.000Z
   
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

return this.getFullYear()+'-'+((mm>9 ? '' : '0') + mm)+'-'+( (dd>9 ? '' : '0') + dd)+'T'+'12:00:00.000Z';

}

if (typeof JSON.clone !== "function") {
    JSON.clone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };
}
if (typeof JSON.copy !== "function") {
    JSON.copy = function (source,destination) {
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

General = {};
General.MonthDataSource = [
    { Id: 1, Title: 'فروردین' },
    { Id: 2, Title: 'اردیبهشت' },
    { Id: 3, Title: 'خرداد' },
    { Id: 4, Title: 'تیر' },
    { Id: 5, Title: 'مرداد' },
    { Id: 6, Title: 'شهریور' },
    { Id: 7, Title: 'مهر' },
    { Id: 8, Title: 'آبان' },
    { Id: 9, Title: 'آذر' },
    { Id: 10, Title: 'دی' },
    { Id: 11, Title: 'بهمن' },
    { Id: 12, Title: 'اسفند' },

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
        displayTime: 2000,
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

General.removeHtmlTags = function (str) {

    if (str) {
       str=str.replace(/<\/?[^>]+(>|$)/g, "");
       return str;
    }
    return str;
};
General.shortenString = function (str,n) {
var temp=str;
    if (str) {
    switch(n)
{
case 200:
str=str.replace(/^(.{200}[^\s]*).*/, "$1")  ;
 
break;
case 150:
str=str.replace(/^(.{150}[^\s]*).*/, "$1")  ;
 
break;

case 300:
str=str.replace(/^(.{300}[^\s]*).*/, "$1")  ;
break;
  default:
    str=str.replace(/^(.{100}[^\s]*).*/, "$1")  ;
break;
}
      // str=str.replace(/^(.{100}[^\s]*).*/, "$1")  ;
       if (temp.length>str.length)
            str+=" ...";
       return str;
    }
    return str;
};

//t.replace(/^(.{100}[^\s]*).*/, "$1") + "\n")