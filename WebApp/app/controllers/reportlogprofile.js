'use strict';
app.controller('reportlogprofile', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', 'flightBagService', 'qalogService', '$sce', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route, flightBagService, qalogService, $sce) {
    $scope.prms = $routeParams.prms;
    $scope.IsFBVisible = true;
    $scope.IsVrVisible = true;
    var vrs = ['m.saghi', 'pirveysi', 'h.pirveisi', 'm.kadivar', 'mirzaei', 'rasouli', 'm.miri', 'n.sabouri', 'izadkhah'];
    $scope.IsVrVisible = vrs.indexOf($rootScope.userName.toLowerCase()) == -1;

    $scope.ASRVR = true;
    if ($rootScope.userName.toLowerCase() == 'hemati') $scope.ASRVR = false;


    $scope.isOPSStaff = false;



    $scope.IsFBVisible = $scope.IsFBVisible || $scope.isOPSStaff;

    var isTaxiVisible = false;
    if ($rootScope.userName.toLowerCase() == 'ashrafi')
        isTaxiVisible = true;
    // printElem($('#ofp-doc'));
    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        // validationGroup: 'ctrsearch',bind 
        bindingOptions: {},
        onClick: function (e) {
            $scope.dg_profile_ds = null;
            $scope.doRefresh = true;
            $scope.bind();

        }

    };





    $scope.scroll_jl_height = 200;
    $scope.scroll_jl = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_jl_height', }
    };
    $scope.popup_jl_visible = false;
    $scope.popup_jl_title = 'Journey Log';
    $scope.popup_jl = {
        shading: true,
        width: 1150,
        height: function () { return $(window).height() * 1 },
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [



            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'default', text: 'Print', icon: 'print', bindingOptions: { disabled: 'IsApproved' }, onClick: function (arg) {


                        printElem($('#jl'));


                    }


                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_jl_visible = false; } }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.scroll_jl_height = $(window).height() - 10 - 110;

        },
        onShown: function (e) {

            $('#pos1').prop('checked', $scope.jl.pos1);

            $('#pos2').prop('checked', $scope.jl.pos2);
            $('#vr').prop('checked', $scope.jl.vr);
            $('#asr').prop('checked', $scope.jl.asr);
            if ($scope.jl.sign)
                $("#_jlsign").attr('src', $scope.jl.sign);
        },
        onHiding: function () {
            $scope.jl = { asr: false, vr: false, pos1: false, pos2: false, sign: '' };
            $('#pos1').prop('checked', $scope.jl.pos1);
            $('#pos2').prop('checked', $scope.jl.pos2);
            $('#vr').prop('checked', $scope.jl.vr);
            $('#asr').prop('checked', $scope.jl.asr);
            $("#_jlsign").attr('src', '');
            $scope.popup_jl_visible = false;

        },
        bindingOptions: {
            visible: 'popup_jl_visible',

            title: 'popup_jl_title',


        }
    };
    /////////////////////////


    $scope.btn_persiandate = {
        //text: 'Search',
        type: 'default',
        icon: 'event',
        width: 35,
        //validationGroup: 'dlasearch',
        bindingOptions: {},
        onClick: function (e) {

            $scope.popup_date_visible = true;
        }

    };
    $scope.popup_date_visible = false;
    $scope.popup_date_title = 'Date Picker';
    var pd1 = null;
    var pd2 = null;
    $scope.popup_date = {
        title: 'Shamsi Date Picker',
        shading: true,
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 200,
        width: 300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,


        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {

            pd1 = $(".date1").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {

                    //console.log(new Date(unix));
                    $scope.$apply(function () {

                        $scope.dt_from = new Date(unix);
                    });

                },

            });
            pd1.setDate(new Date($scope.dt_from.getTime()));
            pd2 = $(".date2").pDatepicker({
                format: 'l',
                autoClose: true,
                calendar: {
                    persian: {
                        locale: 'en'
                    }
                },
                onSelect: function (unix) {
                    $scope.$apply(function () {
                        $scope.dt_to = new Date(unix);
                    });
                },

            });
            pd2.setDate(new Date($scope.dt_to.getTime()));

        },
        onHiding: function () {
            pd1.destroy();
            pd2.destroy();
            $scope.popup_date_visible = false;

        },
        showCloseButton: true,
        bindingOptions: {
            visible: 'popup_date_visible',



        }
    };
    /////////////////////////////////////////


    $scope.bind = function () {
        //iruser558387


        var df = moment($scope.dt_from).format('YYYY-MM-DD');
        var dt = moment($scope.dt_to).format('YYYY-MM-DD');
        $scope.loadingVisible = true;

        qalogService.getFlightLogMain(df, dt).then(function (response) {
            $scope.loadingVisible = false;

            console.log(response);
            $scope.dg_profile_ds = response.Data;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




    };

    $scope.bindDetails = function (fid) {
        //iruser558387



        $scope.loadingVisible = true;

        qalogService.getFlightLogDetail(fid).then(function (response) {
            $scope.loadingVisible = false;

            console.log(response);
            $scope.dg_det_profile_ds = response.Data.flight_log;
            $scope.dg_det_crew_ds = response.Data.crew_log;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });




    };
    //////////////////////////////////////////
    $scope.dt_to = new Date().addDays(0);
    $scope.dt_from = new Date().addDays(0);
    var startDate = new Date(2019, 10, 30);
    if (startDate > $scope.dt_from)
        $scope.dt_from = startDate;

    $scope.date_from = {
        type: "date",
        placeholder: 'From',
        width: '100%',

        bindingOptions: {
            value: 'dt_from',

        }
    };
    $scope.date_to = {
        type: "date",
        placeholder: 'To',
        width: '100%',

        bindingOptions: {
            value: 'dt_to',

        }
    };
    ///////////////////////////////////
    $scope.formatMinutes = function (mm) {
        if (!mm)
            return "";
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    };


    //////////////////////////////////
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
    ////////////////////////////////////
    $scope.statusDs = [
        { Id: 1, Title: 'Done' },
        { Id: 2, Title: 'Scheduled' },
        { Id: 3, Title: 'Canceled' },
        { Id: 4, Title: 'Starting' },
        { Id: 5, Title: 'All' },
    ];
    $scope.fstatus = 5;
    $scope.sb_Status = {
        placeholder: 'Status',
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.statusDs,

        onSelectionChanged: function (arg) {

        },

        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'fstatus',


        }
    };


    $scope.asrvrDs = [
        { Id: 1, Title: 'ASR & VR' },

        { Id: 5, Title: 'All' },
    ];
    $scope.fasrvr = 5;
    $scope.sb_asrvr = {
        placeholder: 'ASR & VR',
        showClearButton: false,
        searchEnabled: false,
        dataSource: $scope.asrvrDs,

        onSelectionChanged: function (arg) {

        },

        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'fasrvr',



        }
    };


    $scope.ip = null;
    $scope.sb_IP = {
        placeholder: 'IP',
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceIP(),

        onSelectionChanged: function (arg) {

        },
        searchExpr: ["ScheduleName", "Name"],
        displayExpr: "ScheduleName",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'ip',


        }
    };
    $scope.cpt = null;
    $scope.sb_CPT = {
        placeholder: 'Captain',
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceCaptain(),

        onSelectionChanged: function (arg) {

        },
        searchExpr: ["ScheduleName", "Name"],
        displayExpr: "ScheduleName",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'cpt',


        }
    };
    //////////////////////////////////
    $scope.formatDate = function (dt) {
        return moment(new Date(dt)).format('MMM-DD-YYYY').toUpperCase();
    };
    $scope.formatDateTime = function (dt) {
        return moment(new Date(dt)).format('MMM-DD-YYYY  HH:mm').toUpperCase();
    };
    $scope.formatTime = function (dt) {
        if (!dt) return "";
        return moment(new Date(dt)).format('HH:mm').toUpperCase();
    };
    $scope.formatTime2 = function (date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();

        //hours = hours % 12;
        //hours = hours ? hours : 12; // the hour '0' should be '12'
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes;
        return strTime;
    }
    $scope.getTimeFormated = function (dt) {
        if (!dt)
            return "-";
        //if ($scope.userName.toLowerCase() == 'shamsi')
        //    alert(dt);
        if (dt.toString().indexOf('T') != -1) {
            var prts = dt.toString().split('T')[1];
            var tm = prts.substr(0, 5);
            return (tm);
        }
        var _dt = new Date(dt);
        //new Date(year, month, day, hours, minutes, seconds, milliseconds)
        return $scope.formatTime2(_dt);
    };
    $scope.getTimeHHMM = function (dt) {
        persianDate.toLocale('en');
        return moment(dt).format('HHmm');
    };
    $scope.getTimeHHMM2 = function (x, prm) {
        if (!x || !x[prm])
            return '-';
        return moment(x[prm]).format('HHmm');
    };
    $scope.formatDateLong = function (dt) {
        return moment(dt).format('ddd DD MMM YY');
    };
    $scope.formatDateShort = function (dt) {
        return moment(dt).format('YYYY-MM-DD');
    };
    $scope.getDuration = function (x) {
        if (!x)
            return "-";
        if (x < 0) {
            x = -x;
            return "- " + pad(Math.floor(x / 60)).toString() + ':' + pad(x % 60).toString();
        }
        return pad(Math.floor(x / 60)).toString() + ':' + pad(x % 60).toString();
    };
    $scope.getStatusClass = function (item) {

        return "fa fa-circle " + item.FlightStatus.toLowerCase();
    };
    $scope.getStatus = function (item) {

        switch (item) {
            case 'OffBlocked':
                return 'Block Off';
            case 'OnBlocked':
                return 'Block On';
            case 'Departed':
                return 'Take Off';
            case 'Arrived':
                return 'Landing';

            default:
                return item;
        }
    };
    $scope.getBlockOff = function (x, b) {
        if (!x)
            return '-';
        if (!b)
            return $scope.getTimeHHMM2(x, 'BlockOff');
        //if (b && [3, 15].indexOf(x.FlightStatusId) == -1)
        //    return '-'
        return $scope.getTimeHHMM2(x, 'BlockOff');
    };
    $scope.getBlockOn = function (x, b) {
        if (!x)
            return '-';
        if (!b)
            return $scope.getTimeHHMM2(x, 'BlockOn');
        //if (b && [3, 15].indexOf(x.FlightStatusId) == -1)
        //    return '-';
        return $scope.getTimeHHMM2(x, 'BlockOn');
    };
    $scope.getTakeOff = function (x, b) {
        if (!x)
            return '-';
        if (!b)
            return $scope.getTimeHHMM2(x, 'TakeOff');
        //if (b && [3, 15].indexOf(x.FlightStatusId) == -1)
        //    return '-';
        return $scope.getTimeHHMM2(x, 'TakeOff');
    };
    $scope.getLanding = function (x, b) {
        if (!x)
            return '-';
        if (!b)
            return $scope.getTimeHHMM2(x, 'Landing');
        // if (b && [3, 15].indexOf(x.FlightStatusId) == -1)
        //     return '-';
        return $scope.getTimeHHMM2(x, 'Landing');
    };
    $scope.getSTD = function (x) {
        return $scope.getTimeHHMM2(x, 'STD');
    };
    $scope.getSTA = function (x) {
        return $scope.getTimeHHMM2(x, 'STA');
    };



    $scope.getBlockOffLocal = function (x, b) {
        if (!x)
            return '-';
        if (!b)
            return $scope.getTimeHHMM2(x, 'BlockOffLocal');
        if (b && [3, 15].indexOf(x.FlightStatusId) == -1)
            return '-'
        return $scope.getTimeHHMM2(x, 'BlockOffLocal');
    };
    $scope.getBlockOnLocal = function (x, b) {
        if (!x)
            return '-';
        if (!b)
            return $scope.getTimeHHMM2(x, 'BlockOnLocal');
        if (b && [3, 15].indexOf(x.FlightStatusId) == -1)
            return '-';
        return $scope.getTimeHHMM2(x, 'BlockOnLocal');
    };
    $scope.getTakeOffLocal = function (x, b) {
        if (!x)
            return '-';
        if (!b)
            return $scope.getTimeHHMM2(x, 'TakeOffLocal');
        if (b && [3, 15].indexOf(x.FlightStatusId) == -1)
            return '-';
        return $scope.getTimeHHMM2(x, 'TakeOffLocal');
    };
    $scope.getLandingLocal = function (x, b) {
        if (!x)
            return '-';
        if (!b)
            return $scope.getTimeHHMM2(x, 'LandingLocal');
        if (b && [3, 15].indexOf(x.FlightStatusId) == -1)
            return '-';
        return $scope.getTimeHHMM2(x, 'LandingLocal');
    };
    $scope.getSTDLocal = function (x) {
        return $scope.getTimeHHMM2(x, 'STDLocal');
    };
    $scope.getSTALocal = function (x) {
        return $scope.getTimeHHMM2(x, 'STALocal');
    };

    $scope.showMVTTime = function (x) {
        //  if (!x)
        //      return false;
        //  return [1, 4].indexOf(x.FlightStatusId) == -1;
        return true;
    };
    ////////////////////

    $scope.selectedTabIndex = -1;
    $scope.selectedTabId = null;
    $scope.tabs = [

        { text: "Flight", id: 'log' },
        { text: "Duty", id: 'ofp' },

    ];

    $scope.$watch("selectedTabIndex", function (newValue) {

        try {
            $('.tabc').hide();
            var id = $scope.tabs[newValue].id;
            $scope.selectedTabId = id;
            $('#' + id).fadeIn();

            switch (id) {
                case 'calendar':

                    break;
                case 'route':

                    break;
                case 'register':

                    break;
                case 'errors':

                    break;

                default:
                    break;
            }
            if ($scope.dg_det_crew_instance)
                $scope.dg_det_crew_instance.refresh();
            if ($scope.dg_det_profile_instance)
                $scope.dg_det_profile_instance.refresh();
        }
        catch (e) {

        }

    });
    $scope.tabs_options = {
        scrollByContent: true,
        showNavButtons: true,


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        onItemRendered: function (e) {
            $scope.selectedTabIndex = -1;
            $scope.selectedTabIndex = 0;
        },
        bindingOptions: {
            //visible: 'tabsdatevisible',
            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };

    $scope.rightHeight = $(window).height() - 205;
    $scope.scroll_right = {
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
            height: 'rightHeight'
        }

    };

    ///////////////////////////////////
    $scope.dg_profile_columns = [];

    $scope.dg_profile_columns = [

        { dataField: 'InActive', caption: 'InActive', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: true, width: 80, fixed: screen.width > 1024 ? true : false, fixedPosition: 'left' },
        { dataField: 'IsDeleted', caption: 'O/A', name: 'oae', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: true, width: 60, fixed: screen.width > 1024 ? true : false, fixedPosition: 'left', visible: true },
        {
            dataField: 'JobGroupRoot', caption: 'Group', allowResizing: true

            , alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left',
            visible: screen.width > 1024 ? true : false
        },
        {
            dataField: 'JobGroup', caption: 'Pos.', allowResizing: true

            , alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: screen.width > 1024 ? true : false, fixedPosition: 'left'
        },

        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: screen.width > 1024 ? true : false, fixedPosition: 'left' },
        //  { dataField: 'ScheduleName', caption: 'Schedule', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },

        { dataField: 'Mobile', caption: 'Mobile', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },
        { dataField: 'NID', caption: 'NID', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130 },











    ];




    $scope.dg_profile_selected = null;
    $scope.dg_profile_instance = null;
    $scope.dg_profile_ds = null;
    $scope.selectedProfile = null;
    $scope.selectedFlightCrews = [];
    $scope.OFP = null;
    $scope.OFPHtml = '';
    var crewAId = null;
    var crewBId = null;
    var crewCId = null;
    var sobId = null;

    var toTime = function (dt) {
        if (!dt)
            return "";



        return moment(new Date(dt)).format('HHmm');
    };
    var _toNum = function (v) {
        try {
            return !v ? 0 : Number(v);
        }
        catch (e) {
            return 0;
        }
    };
    function CreateDate(s) {
        if (!s)
            return null;
        s = s.toString();
        var prts = s.split('T');
        var dts = prts[0].split('-');
        var tms = prts[1].split(':');
        var dt = new Date(dts[0], dts[1] - 1, dts[2], tms[0], tms[1], tms[2]);
        // var b = s.split(/\D+/);
        // return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
        return dt;
    }


    function isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }


    $scope.stations = [];
    $scope.selectedStations = [];
    $scope.getStationClass = function (x) {
        var index = $scope.selectedStations.indexOf(x);
        if (index != -1)
            return "station selected";
        else
            return "station";
    };
    $scope.bindStations = function () {
        $scope.stations = [];
        $scope.stations.push($scope.selectedFlight.FromAirportIATA);
        $scope.stations.push($scope.selectedFlight.ToAirportIATA);
        if ($scope.selectedFlight.ALT1)
            $scope.stations.push($scope.selectedFlight.ALT1);
        if ($scope.selectedFlight.ALT2)
            $scope.stations.push($scope.selectedFlight.ALT2);

        $scope.stations = Enumerable.From($scope.stations).Distinct().ToArray();
        $scope.stations.push('OIIX');
        $scope.selectedStations = Enumerable.From($scope.stations).ToArray();
        $scope.folderSIGWX = [];
        var dates = [];
        dates.push(moment(new Date($scope.selectedFlight.STDDayLocal)).format('YYYY-MM-DD'));
        dates.push(moment(new Date($scope.selectedFlight.STADayLocal)).format('YYYY-MM-DD'));
        dates = Enumerable.From(dates).Distinct().ToArray();
        $.each(dates, function (_i, _d) {
            var sigwx = {
                // source: g,
                date: _d,
                items: [],
            };
            sigwx.items.push({ caption: 'SIGWX Chart', no: '2105', title: 'Current', url: staticFilesSKYBAG + 'Weather/SIGWX/ADDS/SIGWX_ADDS_' + replaceAll(_d, '-', '') + '_2105.png' });
            sigwx.items.push({ caption: 'SIGWX Chart', no: '3105', title: 'Previous', url: staticFilesSKYBAG + 'Weather/SIGWX/ADDS/SIGWX_ADDS_' + replaceAll(_d, '-', '') + '_3105.png' });
            $scope.folderSIGWX.push(sigwx);
        });
    };
    $scope.showAVMETSIGWX = function (valid, rem) {
        //SIGWX_IRIMO_20210824_VALID00LVLIRAN
        var dt = moment(new Date($scope.selectedFlight.STADayLocal)).format('YYYYMMDD');
        var fn = dt + '-' + 'sig' + valid + '.png';
        var _url = staticFilesSKYBAG + 'Weather/AVMET/' + fn;

        $scope.showImage({ url: _url, caption: 'SIGWX Chart' + ' Valid: ' + rem });

    };
    $scope.getSIGWXClass = function (g, obj) {
        return '';
        return g[obj] ? "hasInfo" : '';
    };
    $scope.scroll_metar_height = $(window).height() - 280;
    $scope.scroll_metar = {
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
            height: 'scroll_metar_height'
        }

    };

    $scope.scroll_taf = {
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
            height: 'scroll_metar_height'
        }

    };
    $scope.scroll_notam = {
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
            height: 'scroll_metar_height'
        }

    };

    $scope.Metar = null;
    $scope.Taf = null;
    $scope.NOTAM = null;
    $scope.filteredMETAR = [];
    $scope.filteredTAF = [];
    $scope.filteredNOTAM = [];
    $scope.filterMetar = function () {
        $scope.filteredMETAR = Enumerable.From($scope.Metar)
            .Where(function (x) { return $scope.selectedStations.indexOf(x.StationId) != -1; })
            .OrderBy(function (x) { return $scope.stations.indexOf(x.StationId); }).ThenByDescending(function (x) {
                return Number(moment(new Date(x.observation_time)).format('YYMMDDHHmm'));

            }).ToArray();
    };
    $scope.filterTaf = function () {
        $scope.filteredTAF = Enumerable.From($scope.Taf)
            .Where(function (x) { return $scope.selectedStations.indexOf(x.StationId) != -1; })
            .OrderBy(function (x) { return $scope.stations.indexOf(x.StationId); }).ThenByDescending(function (x) {
                return Number(moment(new Date(x.observation_time)).format('YYMMDDHHmm'));

            }).ToArray();
    };
    $scope.filterNOTAM = function () {
        $scope.filteredNOTAM = Enumerable.From($scope.NOTAM)
            .Where(function (x) { return $scope.selectedStations.indexOf(x.StationId) != -1; })
            .OrderBy(function (x) { return $scope.stations.indexOf(x.StationId); }).ThenByDescending(function (x) {
                return Number(moment(new Date(x.observation_time)).format('YYMMDDHHmm'));

            })
            .ToArray();
    };
    $scope.stationClick = function (x) {
        var index = $scope.selectedStations.indexOf(x);
        if (index != -1)
            $scope.selectedStations.splice(index, 1);
        else
            $scope.selectedStations.push(x);

        $scope.filterMetar();
        $scope.filterTaf();
        $scope.filterNOTAM();

    };
    $scope.bindWX = function (flightId) {

        //$scope.loadingVisible = true;
        flightBagService.getMETAR(flightId).then(function (response) {

            $scope.Metar = response.Data;
            $scope.filterMetar();
            flightBagService.getTAF(flightId).then(function (response2) {

                $scope.Taf = response2.Data;
                $scope.filterTaf();
                flightBagService.getNOTAM(flightId).then(function (response3) {

                    $scope.NOTAM = response3.Data;
                    $scope.filterNOTAM();

                }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.folderSIGWX = [];
    function replaceAll(str, find, replace) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    $scope.showWind = function (lvl, valid) {
        var dt = moment(new Date($scope.selectedFlight.STADayLocal)).format('YYYYMMDD');
        //WIND_ADDS_20210823_FL180_VALID30
        var fn = 'WIND_ADDS_' + dt + '_FL' + lvl + '_VALID' + valid + '.png';
        var _url = staticFilesSKYBAG + 'Weather/WIND/ADDS/' + fn;
        $scope.showImage({ url: _url, caption: 'Wind & Temperature Level: ' + lvl + ' Valid: ' + valid });
    };
    $scope.showImage = function (item) {
        var data = { url: item.url, caption: item.caption };

        $rootScope.$broadcast('InitImageViewer', data);
    };
    $scope.dg_profile = {
        wordWrapEnabled: false,
        rowAlternationEnabled: false,
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 500 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 115,

        columns: $scope.dg_profile_columns,
        onContentReady: function (e) {
            if (!$scope.dg_profile_instance)
                $scope.dg_profile_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_profile_selected = null;
                $scope.selectedProfile = null;
                
            }
            else {
                $scope.dg_profile_selected = data;
                $scope.selectedProfile = data;
                //$scope.bindCrews($scope.selectedFlight.FlightId);
                // $scope.bindOFP($scope.selectedFlight.FlightId);
                // $scope.bindStations();
                // $scope.bindWX($scope.selectedFlight.FlightId);

                $scope.bindDetails($scope.selectedProfile.Id);
            }


        },

        "export": {
            enabled: false,
            fileName: "Flights_Report",
            allowExportSelectedData: false,

        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                        // .addClass("informer")
                        .append(
                            "<span style='color:white;'>Profiles</span>"
                        );
                }
            });
        },
        onExporting: function (e) {
            e.component.beginUpdate();
            e.component.columnOption("row", "visible", false);
            e.component.columnOption("rn", "visible", true);


        },
        onExported: function (e) {
            e.component.columnOption("row", "visible", true);
            e.component.columnOption("rn", "visible", false);
            e.component.endUpdate();
        },
        onRowPrepared: function (e) {


            if (!$scope.isOPSStaff && e.rowType == 'data' && e.data && (e.data.AttASR == 1 || e.data.AttVoyageReport == 1)) {
                e.rowElement.css('background', '#d9d9d9');
            }

        },

        onCellPrepared: function (e) {
          
        },
        bindingOptions: {
            dataSource: 'dg_profile_ds'
        },
        columnChooser: {   
            //dfgdfgdfg
            enabled: true
        },

    };


    $scope.dg_det_profile_columns = [

        { dataField: 'DateCreate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 140, format: 'yy-MMM-dd HH:mm', fixed: true, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc' },
       // { dataField: 'Username', caption: 'User', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: true, fixedPosition: 'left' },
        { dataField: 'CertificateType', caption: 'Property', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: true, fixedPosition: 'left' },

        {
            caption: 'Issue Date', columns: [
                { dataField: 'DateIssueOld', caption: 'Old Value', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 170, fixed: false, fixedPosition: 'left' },
                { dataField: 'DateIssue', caption: 'New Value', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 170 },
            ]
        },

        {
            caption: 'Expire Date', columns: [
                { dataField: 'DateExpireOld', caption: 'Old Value', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 170, fixed: false, fixedPosition: 'left' },
                { dataField: 'DateExpire', caption: 'New Value', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth: 170 },
            ]
        },

        






    ];
    $scope.dg_det_profile = {
        wordWrapEnabled: true,
        rowAlternationEnabled: false,
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 500 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 145,

        columns: $scope.dg_det_profile_columns,
        onContentReady: function (e) {
            if (!$scope.dg_det_profile_instance)
                $scope.dg_det_profile_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_det_profile_selected = null;

            }
            else {
                $scope.dg_det_profile_selected = data;

            }


        },

        "export": {
            enabled: false,
            fileName: "Flights_Report",
            allowExportSelectedData: false,

        },




        bindingOptions: {
            dataSource: 'dg_det_profile_ds'
        },
        columnChooser: {
            enabled: false
        },

    };

    $scope.dg_det_crew_columns = [
        { dataField: 'DateCreate', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 140, format: 'yy-MMM-dd HH:mm', fixed: true, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc' },
        { dataField: 'Username', caption: 'User', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left' },

        { dataField: 'DutyType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: true, fixedPosition: 'left' },

        { dataField: 'CrewName', caption: 'Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },
        { dataField: 'DateStart', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 140, format: 'yy-MMM-dd HH:mm', fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc' },
        { dataField: 'DateEnd', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 140, format: 'yy-MMM-dd HH:mm', fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc' },
        {
            caption: 'FDP',
            columns: [
                { dataField: 'Position', caption: 'Pos', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left' },
                //Route
                { dataField: 'Route', caption: 'Route', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },
                //Flights
                { dataField: 'Flights', caption: 'Flights', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: false, fixedPosition: 'left' },

            ]
        },



        { dataField: 'Action', caption: 'Action', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: true, fixedPosition: 'left' },
    ];

    $scope.dg_det_crew = {
        wordWrapEnabled: true,
        rowAlternationEnabled: false,
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 500 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 145,

        columns: $scope.dg_det_crew_columns,
        onContentReady: function (e) {
            if (!$scope.dg_det_crew_instance)
                $scope.dg_det_crew_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_det_crew_selected = null;

            }
            else {
                $scope.dg_det_crew_selected = data;

            }


        },

        "export": {
            enabled: false,
            fileName: "Flights_Report",
            allowExportSelectedData: false,

        },




        bindingOptions: {
            dataSource: 'dg_det_crew_ds'
        },
        columnChooser: {
            enabled: false
        },

    };
    //////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = '> Flights Log';


        $('.reportlog').fadeIn(400, function () {

        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {

        $('.tabc').height($(window).height() - 200);
        $('#rightColumn').height($(window).height() - 220);
        $('#rightColumn2').height($(window).height() - 220);
    });

    $rootScope.$broadcast('FlightsReportLoaded', null);

}]);