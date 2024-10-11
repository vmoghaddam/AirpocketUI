'use strict';
app.controller('homeController', ['$scope', 'authService', 'activityService', 'generalService', '$rootScope', function ($scope, authService, activityService, generalService,  $rootScope) {
     
    $rootScope.page_title = $rootScope.app_title;
    ////////////////////////////////////
    //////////////////////////////////////
    //ati
    $scope.speedValue = 40;
    $scope.gaugeValue = 20;
    $scope.linearGaugeValue = 42.8;

    $scope.$watch("speedValue", function (speedValue) {
        $scope.gaugeValue = speedValue / 2;
    });

    //$scope.$watch("speedValue", function (speedValue) {
    //    $scope.linearGaugeValue = 50 - speedValue * 0.24;
    //});

    $scope.options = {
        speed: {
            geometry: {
                startAngle: 225,
                endAngle: 315
            },
            scale: {
                startValue: 20,
                endValue: 200,
                tickInterval: 20,
                minorTickInterval: 10
            },
            valueIndicator: {
                type: "twoColorNeedle",
                color: "none",
                secondFraction: 0.24,
                secondColor: "#f05b41"
            },
            bindingOptions: {
                value: "speedValue"
            },
            size: {
                width: 260
            }
        },
        coolant: {
            geometry: {
                startAngle: 180,
                endAngle: 90
            },
            scale: {
                startValue: 0,
                endValue: 100,
                tickInterval: 50
            },
            valueIndicator: {
                color: "#f05b41"
            },
            bindingOptions: {
                value: "gaugeValue",
            },
            size: {
                width: 90,
                height: 90
            }
        },
        psi: {
            scale: {
                startValue: 100,
                endValue: 0,
                tickInterval: 50
            },
            geometry: {
                startAngle: 90,
                endAngle: 0
            },
            valueIndicator: {
                color: "#f05b41"
            },
            bindingOptions: {
                value: "gaugeValue",
            },
            size: {
                width: 90,
                height: 90
            }
        },
        rpm: {
            scale: {
                startValue: 100,
                endValue: 0,
                tickInterval: 50
            },
            geometry: {
                startAngle: -90,
                endAngle: -180
            },
            valueIndicator: {
                color: "#f05b41"
            },
            bindingOptions: {
                value: "gaugeValue",
            },
            size: {
                width: 90,
                height: 90
            }
        },
        instantFuel: {
            scale: {
                startValue: 0,
                endValue: 100,
                tickInterval: 50
            },
            geometry: {
                startAngle: 0,
                endAngle: -90
            },
            valueIndicator: {
                color: "#f05b41"
            },
            bindingOptions: {
                value: "gaugeValue",
            },
            size: {
                width: 90,
                height: 90
            }
        },
        fuel: {
            scale: {
                startValue: 0,
                endValue: 50,
                tickInterval: 25,
                minorTickInterval: 12.5,
                minorTick: {
                    visible: true
                },
                label: {
                    visible: false
                }
            },
            valueIndicator: {
                color: "#f05b41",
                size: 8,
                offset: 7
            },
            bindingOptions: {
                value: "linearGaugeValue",
            },
            size: {
                width: 90,
                height: 20
            }
        },
        slider: {
            min: 0,
            max: 200,
            bindingOptions: {
                value: "speedValue"
            },
            width: 155
        }
    };
    ///////////////////////////////////////////
    ////////////////////////////////////////////
    $scope.scroll_height = 200;
    $scope.scroll_main = {
        width: '100%',
        bounceEnabled: true,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
       // useNative:false,
        refreshingText: 'Updating...',
        onPullDown: function (options) {
            //7-17
            $scope.bind();
            /////////////////////


            //Alert.getStartupNots(null, function (arg) {
            //    options.component.release();
            //    // refreshCarts(arg);
            //});
            options.component.release();

        },
         bindingOptions: { height: 'scroll_height', }
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
    };


    //$scope.recent = [];

   
    $scope.recent = [];
    $scope.library = null;
    $scope.alertAction = function (type) {
        if (type == 83)
            $rootScope.navigate('/applibrary/books', 'applibrary-book',2);
        if (type == 84)
            $rootScope.navigate('/applibrary/papers', 'applibrary-paper',2);
        if (type == 85)
            $rootScope.navigate('/applibrary/videos', 'applibrary-video', 2);
        if (type == 1000)
            $rootScope.navigate('/appmessage', 'appmessage', -1);
        if (type == 1001)
            $rootScope.navigate('/appcertificate/last', 'appcertificate-last', 1);
        if (type == 1002)
            $rootScope.navigate('/appcourse/active', 'appcourse-active', 1);
        
    };

    $scope.IsPassportExpiring = false;
    $scope.IsPassportExpired = false;
    $scope.PassportCaption = null;
    $scope.PassportRemark = null;

    $scope.IsMedicalExpiring = false;
    $scope.IsMedicalExpired = false;
    $scope.MedicalCaption = null;
    $scope.MedicalRemark = null;

    $scope.IsCAOExpiring = false;
    $scope.IsCAOExpired = false;
    $scope.CAOCaption = null;
    $scope.CAORemark = null;

    $scope.IsNDTExpiring = false;
    $scope.IsNDTExpired = false;
    $scope.NDTCaption = null;
    $scope.NDTRemark = null;

    $scope.IsPersonalDocumentVisible = false;
    $scope.IsLibraryVisible = false;
    $scope.IsCertificatesVisible = false;
    $scope.IsNotificationVisible = false;
    $scope.notTitle = null;
    $scope.notAbs = null;
    $scope.notSender = null;
    $scope.notDate = null;
    $scope.notSenderDate = null;
    $scope.bindNotification = function (data) {
        var n = Number(data.Nots);
        $scope.IsNotificationVisible = n > 0;
        if (n > 0) {
            if (n == 1) {
                $scope.notTitle = "You have a new message";
                $scope.notSender = "Sent by <b>" + data.LastNotSender + "</b>";
                
            }
            else {
                $scope.notTitle = "You have <b>" + n + "</b> new messages";
                $scope.notSender = "<span class='font-size-13'>The last sent by</span> <b>" + data.LastNotSender + "</b>";
                
            }
            $scope.notDate = "<span class='font-size-13'>on </span><b>" + moment(data.LastNotDate).format('MMMM Do YYYY, h:mm:ss a') + "</b>";
            $scope.notSenderDate = $scope.notSender + '<span>   </span>' + $scope.notDate;

            $scope.notAbs = General.shortenString(General.removeHtmlTags(data.LastNotAbs), 100);
        }
    };
    $scope.getlic1 = function (caption, remain) {

        var _caption = Number(remain) > 1 ? "In <span class='bold font-size-16'>" + remain + "</span> days" : "<span class='bold font-size-16'>Tomorrow</span>";
        var _remark = "Your <span style='font-size:13px;' class='bold '>"+caption+" </span> expires";
        var elem = "<div class='col-lg-3 col-md-6 col-sm-6  applibraryitem' style='padding:2px 3px 5px 3px;' >"
           +" <div class='card text-white text-black-50' style='margin:0; padding:10px 7px 10px 0px;display:block;height:80px'>"
              + " <div class='col-lg-9 col-md-10 col-sm-10 col-xs-10' style='padding-right:0;padding-left:10px'>"
               +    " <div style='font-weight:normal;' >"+_caption+"  </div>"
            +    " <div style='margin-top:5px;font-size:13px;'  >"+_remark+"</div>"
              +  "</div>"
              +  "<div class='col-lg-3 col-md-2 col-sm-2 col-xs-2' style='text-align:center'>"
            +   "   <i style='font-size:40px;' class='fas fa-info-circle text-warning'></i>"
              +  "</div>"

              +  "<div style='clear:both'></div>"

          +  "</div>"
        +"</div>";
        return elem;
    };
    $scope.getlic2 = function (caption, remain) {
      //  $scope.PassportCaption = Number(employee.RemainPassport) < 0 ? "<span class='bold font-size-16'>" + Math.abs(Number(employee.RemainPassport)) + "</span> days ago" : "<span class='bold font-size-16'>Today</span>";
      //  $scope.PassportRemark = Number(employee.RemainPassport) < 0 ? "Your <span class='bold '>Passport</span> expired" : "Your <span class='bold '>Passport</span> expires";
        if (remain == -100000) {
            var _caption =   "<span class='bold font-size-16'>" + "Alert" + "</span> " ;
            var _remark =   "Your <span class='bold '>" + caption + "</span> data not found." ;
        }
        else {
            var _caption = Number(remain) < 0 ? "<span class='bold font-size-16'>" + Math.abs(Number(remain)) + "</span> days ago" : "<span class='bold font-size-16'>Today</span>";
            var _remark = Number(remain) < 0 ? "Your <span class='bold '>" + caption + "</span> expired" : "Your <span class='bold '>" + caption + "</span> expires";
        }
       
        var elem = "<div class='col-lg-3 col-md-6 col-sm-6  applibraryitem' style='padding:2px 3px 5px 3px;' >"
            + " <div class='card text-white text-black-50' style='margin:0; padding:10px 7px 10px 0px;display:block;height:80px'>"
            + " <div class='col-lg-9 col-md-10 col-sm-10 col-xs-10' style='padding-right:0;padding-left:10px'>"
            + " <div style='font-weight:normal;' >" + _caption + "  </div>"
            + " <div style='margin-top:5px;font-size:13px;'  >" + _remark + "</div>"
            + "</div>"
            + "<div class='col-lg-3 col-md-2 col-sm-2 col-xs-2' style='text-align:center'>"
            + "   <i  class='fas fa-times-circle text-warning' style='font-size:40px;color:red !important'></i>"
            + "</div>"

            + "<div style='clear:both'></div>"

            + "</div>"
            + "</div>";
        return elem;
    };
    $scope.bindEmployee2 = function (data) {
        var employee = data.Employee;
        //if (employee.RemainMedical && employee.RemainMedical <= 30 && employee.RemainMedical > 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic1("Medical Certificate", employee.RemainMedical));
        //}
        //else  if (!employee.RemainMedical ||  employee.RemainMedical < 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic2("Medical Certificate", employee.RemainMedical));

        //}

        //if (employee.RemainCMC && employee.RemainCMC <= 30 && employee.RemainCMC > 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic1("Crew Member Certificate", employee.RemainCMC));
        //}
        //else if (!employee.RemainCMC || employee.RemainCMC < 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic2("Crew Member Certificate", employee.RemainCMC));

        //}


        


        //if (employee.RemainCCRM && employee.RemainCCRM <= 30 && employee.RemainCCRM > 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic1("CCRM", employee.RemainCCRM));
        //}
        //else if (!employee.RemainCCRM || employee.RemainCCRM < 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic2("CCRM", employee.RemainCCRM));

        //}


        //if (employee.RemainSMS && employee.RemainSMS <= 30 && employee.RemainSMS > 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic1("SMS", employee.RemainSMS));
        //}
        //else if (!employee.RemainSMS || employee.RemainSMS < 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic2("SMS", employee.RemainSMS));

        //}


        //if (employee.RemainSEPT && employee.RemainSEPT <= 30 && employee.RemainSEPT > 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic1("Theoretical SEPT", employee.RemainSEPT));
        //}
        //else if (!employee.RemainSEPT || employee.RemainSEPT < 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic2("Theoretical SEPT", employee.RemainSEPT));

        //}


        //if (employee.RemainSEPTP && employee.RemainSEPTP <= 30 && employee.RemainSEPTP > 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic1("Practical SEPT", employee.RemainSEPTP));
        //}
        //else if (!employee.RemainSEPTP || employee.RemainSEPTP < 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic2("Practical SEPT", employee.RemainSEPTP));

        //}

        //if (employee.RemainDG && employee.RemainDG <= 30 && employee.RemainDG > 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic1("Dangerous Goods", employee.RemainDG));
        //}
        //else if (!employee.RemainDG || employee.RemainDG < 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic2("Dangerous Goods", employee.RemainDG));

        //}

        //if (employee.RemainLPR && employee.RemainLPR <= 30 && employee.RemainLPR > 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic1("LPR", employee.RemainLPR));
        //}
        //else if (!employee.RemainLPR || employee.RemainLPR < 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic2("LPR", employee.RemainLPR));

        //}


        //if (employee.RemainAvSec && employee.RemainAvSec <= 30 && employee.RemainAvSec > 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic1("Aviation Security", employee.RemainAvSec));
        //}
        //else if (!employee.RemainAvSec || employee.RemainAvSec < 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic2("Aviation Security", employee.RemainAvSec));

        //}


        //if (employee.RemainProficiency && employee.RemainProficiency <= 30 && employee.RemainProficiency > 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic1("Skill Test/Proficiency", employee.RemainProficiency));
        //}
        //else if (!employee.RemainProficiency || employee.RemainProficiency < 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic2("Skill Test/Proficiency", employee.RemainProficiency));

        //}


        //if (employee.RemainFirstAid && employee.RemainFirstAid <= 30 && employee.RemainFirstAid > 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic1("First Aid", employee.RemainFirstAid));
        //}
        //else if (!employee.RemainFirstAid || employee.RemainFirstAid < 0) {
        //    $scope.IsPersonalDocumentVisible = true;
        //    $('#persoanllic').append($scope.getlic2("First Aid", employee.RemainFirstAid));

        //}

    };
    $scope.bindEmployee = function (data) {
       
        var employee = data.Employee;
         //Passport
        if (employee.RemainPassport && employee.RemainPassport <= 30 && employee.RemainPassport > 0) {
            $scope.IsPersonalDocumentVisible = true;
            $scope.IsPassportExpiring = true;
            $scope.PassportCaption = Number(employee.RemainPassport) > 1 ? "In <span class='bold font-size-16'>" + employee.RemainPassport + "</span> days" : "<span class='bold font-size-16'>Tomorrow</span>" ;
            $scope.PassportRemark = "Your <span class='bold '>Passport</span> expires";
        }
        if (employee.RemainPassport != null && employee.RemainPassport <= 0) {
            $scope.IsPersonalDocumentVisible = true;
            $scope.IsPassportExpired = true;
            $scope.IsPersonalDocumentVisible = true;
            $scope.PassportCaption = Number(employee.RemainPassport) < 0 ? "<span class='bold font-size-16'>" + Math.abs(Number(employee.RemainPassport)) + "</span> days ago" : "<span class='bold font-size-16'>Today</span>";
            $scope.PassportRemark = Number(employee.RemainPassport) < 0 ? "Your <span class='bold '>Passport</span> expired" :"Your <span class='bold '>Passport</span> expires";
        }
        //Medical
        if (employee.RemainMedical && employee.RemainMedical <= 30 && employee.RemainMedical > 0) {
            $scope.IsPersonalDocumentVisible = true;
            $scope.IsMedicalExpiring = true;
            $scope.MedicalCaption = Number(employee.RemainMedical) > 1 ? "In <span class='bold font-size-16'>" + employee.RemainMedical + "</span> days" : "<span class='bold font-size-16'>Tomorrow</span>";
            $scope.MedicalRemark = "Your <span class='bold '>Medical Certificate</span> expires";
        }
        if (employee.RemainMedical != null && employee.RemainMedical <= 0) {
            $scope.IsPersonalDocumentVisible = true;
            $scope.IsMedicalExpired = true;
            $scope.MedicalCaption = Number(employee.RemainMedical) < 0 ? "<span class='bold font-size-16'>" + Math.abs(Number(employee.RemainMedical)) + "</span> days ago" : "<span class='bold font-size-16'>Today</span>";
            $scope.MedicalRemark = Number(employee.RemainMedical) < 0 ? "Your <span class='bold'>Medical Certificate</span> expired" : "Your <span class='bold '>Medical Certificate</span> expires";
        }
        //CAO
        if (employee.RemainCAO && employee.RemainCAO <= 30 && employee.RemainCAO > 0) {
            $scope.IsPersonalDocumentVisible = true;
            $scope.IsCAOExpiring = true;
            $scope.CAOCaption = Number(employee.RemainCAO) > 1 ? "In <span class='bold font-size-16'>" + employee.RemainCAO + "</span> days" : "<span class='bold font-size-16'>Tomorrow</span>";
            $scope.CAORemark = "Your <span class='bold '>CAO Certificate</span> expires";
        }
        if (employee.RemainCAO != null && employee.RemainCAO <= 0) {
            $scope.IsCAOExpired = true;
            $scope.CAOCaption = Number(employee.RemainCAO) < 0 ? "<span class='bold font-size-16'>" + Math.abs(Number(employee.RemainCAO)) + "</span> days ago" : "<span class='bold font-size-16'>Today</span>";
            $scope.CAORemark = Number(employee.RemainCAO) < 0 ? "Your <span class='bold'>CAO Certificate</span> expired" : "Your <span class='bold '>CAO Certificate</span> expires";
        }
        //NDT
        if (employee.RemainNDT && employee.RemainNDT <= 30 && employee.RemainNDT > 0) {
            $scope.IsNDTExpiring = true;
            $scope.NDTCaption = Number(employee.RemainNDT) > 1 ? "In <span class='bold font-size-16'>" + employee.RemainNDT + "</span> days" : "<span class='bold font-size-16'>Tomorrow</span>";
            $scope.NDTRemark = "Your <span class='bold '>NDT Certificate</span> expires";
        }
        if (employee.RemainNDT != null && employee.RemainNDT <= 0) {
            $scope.IsNDTExpired = true;
            $scope.NDTCaption = Number(employee.RemainNDT) < 0 ? "<span class='bold font-size-16'>" + Math.abs(Number(employee.RemainNDT)) + "</span> days ago" : "<span class='bold font-size-16'>Today</span>";
            $scope.NDTRemark = Number(employee.RemainNDT) < 0 ? "Your <span class='bold'>NDT Certificate</span> expired" : "Your <span class='bold '>NDT Certificate</span> expires";
        }
        ///////////////////////
    };

    $scope.certificates = null;
    $scope.bindCertificates = function (data) {
        if (!data || data.length == 0)
            return;
        $scope.IsPersonalDocumentVisible = true;
        $.each(data, function (_i, _d) {
            if (_d.IsExpired)
            {
                $('#persoanllic').append($scope.getlic2(_d.Title, _d.Remaining));
            } else {
                $('#persoanllic').append($scope.getlic1(_d.Title, _d.Remaining));
            }
        });
        //$.each(data, function (_i, _d) {
        //    $scope.IsCertificatesVisible = true;
        //    if (_d.Remain != null) {
        //        _d.DateIssue = moment(_d.DateIssue).format('MMMM Do YYYY');
        //        _d.class = Number(_d.Remain) >= 0 ? "card text-black-50" : "card text-white bg-red";
        //        _d.icon = Number(_d.Remain) >= 0 ? "fas fa-certificate text-warning" : "fas fa-certificate";
        //        _d.ExpireRemark = Number(_d.Remain) >= 0 ? "Expiring " : "Expired ";
        //        var days = "<span class='bold '>" + Math.abs(_d.Remain) + "</span>";
        //        if (_d.Remain == 1)
        //            days = "tomorrow";
        //        else if (_d.Remain == 0)
        //            days = "today";
        //        else if (_d.Remain > 0)
        //            days = "in " + days + " days";
        //        else
        //            days = days + " day(s) ago";
        //        _d.ExpireRemark = _d.ExpireRemark + days;

        //    }
            
        //        //_d.ExpireRemark = Number(_d.Remain) > 1 ? "In <span class='bold font-size-16'>" + employee.RemainPassport + "</span> days" : "<span class='bold font-size-16'>Tomorrow</span>";
        //});
        //$scope.certificates = data;
    };
    $scope.IsCoursesVisible = false;
    $scope.courses = null;
    $scope.bindCourses = function (data) {
         
        $.each(data, function (_i, _d) {
            $scope.IsCoursesVisible = true;
            _d.class = "card w3-text-gray bg-white";
            _d.icon = (_d.Remain != null && _d.Remain <= 10) ? "fas fa-chalkboard-teacher text-red" : "fas fa-chalkboard-teacher text-blue";
           
            _d.start = "";
            if (_d.Remain != null) {
                if (Number(_d.Remain) == 0)
                    _d.start = "Starts today";
                else if (Number(_d.Remain) == 1)
                    _d.start = "Starts tomorrow";
                else
                    _d.start = "Starts in " + _d.Remain + " days on " + moment(_d.DateStart).format('MMMM Do YYYY');
            }
           // _d.start = _d.Remain == null ? "" ? ("Starts " + (Number(_d.Remain) == 0 ? "Today" : " in " + Number(_d.Remain) + " days on " + moment(_d.DateStart).format('MMMM Do YYYY'))) ;
            //if (_d.Remain != null) {
            //    _d.DateIssue = moment(_d.DateIssue).format('MMMM Do YYYY');
            //    _d.class = Number(_d.Remain) >= 0 ? "card text-white bg-orange" : "card text-white bg-red";
            //    _d.ExpireRemark = Number(_d.Remain) >= 0 ? "Expiring " : "Expired ";
            //    var days = "<span class='bold '>" + Math.abs(_d.Remain) + "</span>";
            //    if (_d.Remain == 1)
            //        days = "tomorrow";
            //    else if (_d.Remain == 0)
            //        days = "today";
            //    else if (_d.Remain > 0)
            //        days = "in " + days + " days";
            //    else
            //        days = days + " day(s) ago";
            //    _d.ExpireRemark = _d.ExpireRemark + days;

            //}

            //_d.ExpireRemark = Number(_d.Remain) > 1 ? "In <span class='bold font-size-16'>" + employee.RemainPassport + "</span> days" : "<span class='bold font-size-16'>Tomorrow</span>";
        });
        $scope.courses = data;
    };
    ////8-22//////////////////
    $scope.moment3 = function (date) {
        if (!date)
            return "";
        return moment(date).format('ddd MM-DD-YYYY');
    };
    $scope.moment4 = function (date) {
        if (!date)
            return "";
        return moment(date).format('HH:mm');
    };
    $scope.getDutyHeaderClass = function (x) {
        return 'duty-' + x.Type;
    }
    ////7-17///////////////////
    $scope.sms = [];
    function formatTime2(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();

       
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes;
        alert(strTime);
        return strTime;
    }
    $scope.moment2 = function (date) {
        if (!date)
            return "";
        return moment(date).format('MM-DD-YYYY HH:mm');
    };
    $scope.getTimeFormated = function (dt) {
        if (!dt)
            return "-";
        
        if (dt.toString().indexOf('T') != -1) {
            var prts = dt.toString().split('T')[1];
            var tm = prts.substr(0, 5);
            return (tm);
        }
        var _dt = new Date(dt);
        //new Date(year, month, day, hours, minutes, seconds, milliseconds)
        return formatTime2(_dt);
    };
    $scope.getDateTimeFormated = function (dt) {
        if (!dt)
            return "-";

        if (dt.toString().indexOf('T') != -1) {
            var prts = dt.toString().split('T')[1];
            var tm = prts.substr(0, 5);
            return (tm);
        }
        var _dt = new Date(dt);
        alert(_dt);
        //new Date(year, month, day, hours, minutes, seconds, milliseconds)
        return moment2(_dt);
    };
    $scope.getNotificationClass = function (id) {
        switch (id) {
            case 10010:
            case 10011:
            case 10012:
            case 10013:
                return 'text-pickup';
            case 10014:
                return 'text-cancel';
            case 10015:
                return 'text-delay';
            default:
                return 'text-general';
        }
    };
    $scope.notClick = function (id, $event) {
        $event.stopPropagation();
        $scope.loadingVisible = true;
        generalService.smsVisit({Id:id}).then(function (response) {
            $scope.loadingVisible = false;
            $scope.sms = Enumerable.From($scope.sms).Where('$.Id!=' + id).ToArray();

        }, function (err) { });
    }
    $scope.bind2 = function () {
        activityService.getAppDashboard(Config.CustomerId, $rootScope.employeeId).then(function (response) {

            $scope.loadingVisible = false;
            $scope.bindNotification(response);
            $.each(response.Library, function (_i, _d) {
                $scope.IsLibraryVisible = true;
                if (_d.Type == 83)
                    _d.icon = "icon ion-md-bookmarks w3-text-red";
                if (_d.Type == 84)
                    _d.icon = "icon ion-md-journal w3-text-red";
                if (_d.Type == 85)
                    _d.icon = "icon ion-md-arrow-dropright-circle w3-text-red";
                if (_d.Type == 86)
                    _d.icon = "icon ion-md-document w3-text-red";
            });
            $scope.library = response.Library;
            /////7-17/////////////////////////
            generalService.getSMSNotificationNew($rootScope.userId).then(function (_sms) {
                $scope.sms = _sms;
                generalService.getExpiringCertificates2($rootScope.userId).then(function (response) {
                    console.log('certificates');
                    console.log(response);
                    $scope.bindCertificates(response);
                    generalService.getPersonPendingCourse($rootScope.userId).then(function (response) {

                        $scope.bindCourses(response);
                        //////////////////////

                    }, function (err) { });
                    //////////////////////

                }, function (err) { });

            }, function (err) { });
            ///////////////////////////////////





            //////////////////////

        }, function (err) { $scope.loadingVisible = false; });

    }
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }
    ///////////////////////////
    $scope.bind = function () {
        $scope.loadingVisible = true;

        generalService.getEmployee($rootScope.employeeId).then(function (employee) {

            $scope.bindEmployee2(employee);

            activityService.getAppDashboard(Config.CustomerId, $rootScope.employeeId).then(function (response) {

                $scope.loadingVisible = false;
                $scope.bindNotification(response);
                $.each(response.Library, function (_i, _d) {
                    $scope.IsLibraryVisible = true;
                    if (_d.Type == 83)
                        _d.icon = "icon ion-md-bookmarks w3-text-red";
                    if (_d.Type == 84)
                        _d.icon = "icon ion-md-journal w3-text-red";
                    if (_d.Type == 85)
                        _d.icon = "icon ion-md-arrow-dropright-circle w3-text-red";
                    if (_d.Type == 86)
                        _d.icon = "icon ion-md-document w3-text-red";
                });
                $scope.library = response.Library;
                /////7-17/////////////////////////
                generalService.getSMSNotificationNew($rootScope.userId).then(function (_sms) {
                    $scope.scroll_height = $(window).height() - 45 - 70;
                    $scope.sms = _sms;
                    generalService.getExpiringCertificates2($rootScope.userId).then(function (response) {
                        console.log('certificates');
                        console.log(response);
                        $scope.scroll_height = $(window).height() - 45 - 70;
                        $scope.bindCertificates(response);
                        generalService.getPersonPendingCourse($rootScope.userId).then(function (response) {
                            $scope.scroll_height = $(window).height() - 45 - 70;
                            $scope.bindCourses(response);
                            //////////////////////

                        }, function (err) { });
                        //////////////////////

                    }, function (err) { });

                }, function (err) { });
                ///////////////////////////////////


                
                 

                //////////////////////

            }, function (err) { $scope.loadingVisible = false; });
             
            //////////////////////

        }, function (err) { $scope.loadingVisible = false; });

       
    };
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {

       $scope.scroll_height = $(window).height()-45-70;
        $scope.bind();
        
    }


     
    //////////////////////////////////

}]);