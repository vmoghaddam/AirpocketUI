'use strict';
app.controller('appFlightNewController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'authService', 'notificationService','generalService', '$route','$compile',
 function ($scope, $location, $routeParams, $rootScope, flightService, authService, notificationService,generalService, $route,$compile) {
    
	$scope.prms = $routeParams.prms;
    $scope.firstBind = true;
    $scope.jgroup = $rootScope.JobGroup;
	
    $scope.typeId = null;
    $scope.title = "Schedule";
    ///////////////////////////////
    $scope.date_flightDate = {
        placeholder: "Enter Flight Date",
          adaptivityEnabled: true,
        type: "date",
          useMaskBehavior: true,
        bindingOptions: {
            value: 'newFlight.Date'
        }
    };
 generalService.getEmployee($rootScope.employeeId).then(function (employee) {
	 //console.log('EEEEEE',employee);
	 $rootScope.JobGroup2=employee.Employee.JobGroup;
	 $scope.jgroup2=$rootScope.JobGroup2;
   }, function (err) { $scope.loadingVisible = false; });

    ///////////////////////////////////////
    var detector = new MobileDetect(window.navigator.userAgent);
    console.log("Mobile: " + detector.mobile());
    console.log("Phone: " + detector.phone());
    console.log("Tablet: " + detector.tablet());
    console.log("OS: " + detector.os());
    console.log("userAgent: " + detector.userAgent());
    //////////////////////////
	var isLeapYear = function (year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};
	Date.prototype.getDaysInMonth = function (year, month) {
		var month=this.getMonth();
    return [31, ( isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};
	Date.prototype.addMonth = function (value) {
		
        var n = this.getDate();
        this.setDate(1);
		
        this.setMonth(this.getMonth() + value);
		
        this.setDate(Math.min(n, this.getDaysInMonth()));
		 
         return this;
    };
	 class schedule_month {
        id;
        caption;
        date;
        year;
        month;
        calendar;
        month_ds = [
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
        constructor(_id) {
            this.id = _id;
            this.date = new Date();
            this.year = this.date.getFullYear();
            this.month = this.date.getMonth();
            this.caption = this.year;
            this.caption = this.month_ds[this.month].Title + ' ' + this.year;
        }
        onChangeYear;
        onChangeMonth;
		onChangeYearMonth;
        calendar;
        dataSource;

        nextMonth(n) {
			
            this.date = this.date.addMonth(n);
			 
            this.year = this.date.getFullYear();
            this.month=this.date.getMonth();
			 
			this.caption = this.month_ds[this.month].Title + ' ' + this.year;
			//this.caption = this.year;
             this.onChangeYearMonth(this.year,this.month);
        }
        //getDataByMonth(m) {
        //    var data = Enumerable.From(this.dataSource).Where('$.Month==' + m).ToArray();
        //    return data;
        //}
        getScrollStyle = function () {
            return { height: (this.height - 40).toString() + 'px' };
        }


        getDataByDay(day) {

            var data = Enumerable.From(this.dataSource).Where(function (x) { return day == moment(new Date(x.Date)).format("YYYYMMDD"); }).ToArray();
            // console.log('build2',data);
            return data;
        }

        getItemsByDay(day) {

            var data = Enumerable.From(this.dataSource).Where(function (x) { return day == moment(new Date(x._date)).format("YYYYMMDD"); }).ToArray();
             //console.log('build2',data);
			 //console.log('build2',day);
            return data ? data  : [];
        }

        getSessionsByDay(day) {

            var data = Enumerable.From(this.dataSource.sessions).Where(function (x) { return day == moment(new Date(x.Date)).format("YYYYMMDD"); }).ToArray();
            var sessions = [];
            $.each(data, function (_i, _d) {
                $.each(_d.Items, function (_j, _s) {
                    sessions.push(_s);
                })
            });
            // console.log('build2',data);
            return sessions;
        }

        getExpiredByDay(day) {

            var data = Enumerable.From(this.dataSource.expired.Items).Where(function (x) { return day == moment(new Date(x.Date)).format("YYYYMMDD"); }).ToArray();
            //var expired = [];
           // $.each(data, function (_i, _d) {
            //    $.each(_d.Items, function (_j, _s) {
            //        sessions.push(_s);
            //    })
            //});
             
            return data?data:[];
        }
		

        build(_height, ins) {
            this.height = _height;
            var _ch = _height * 1.0 / 7;//($(window).height() - 190) * 1.0 / 6.4;


            this.calendar = [];
            try {
                var today = moment(new Date()).format('YYYY-MM-DD');
                $('#' + this.id + ' .day-wrapper').html('');
                $('#' + this.id + ' .day-wrapper').hide();
                //$scope.date = new Date(_date);
                //$scope.month = $scope.date.getMonth();
                //$scope.year = $scope.date.getFullYear();
                // alert($scope.year);
                this.caption = this.month_ds[this.month].Title + ' ' + this.year;
                // alert($scope.caption);
                var day = new Date(this.year, this.month, 1);
                var lastDay = (new Date(this.year, this.month + 1, 0)).getDate();
                var dayWeek = day.getDay();
                var dayIndex = dayWeek;
                var dayMonth = day.getDate();

                var c = dayIndex - 1;
                var inactiveBack = (new Date(this.year, this.month, 0)).getDate();
                var inactiveBackYear = (new Date(this.year, this.month, 0)).getFullYear();
                var inactiveBackMonth = (new Date(this.year, this.month, 0)).getMonth();
                var inactiveForward = (new Date(this.year, this.month + 1, 1)).getDate();
                var inactiveForwardYear = (new Date(this.year, this.month + 1, 1)).getFullYear();
                var inactiveForwardMonth = (new Date(this.year, this.month + 1, 1)).getMonth();

                while (c >= 0) {
                    var data_date = inactiveBackYear + '-' + pad(Number(inactiveBackMonth) + 1) + '-' + pad(Number(inactiveBack));
                    console.log(data_date);
                    var isToday = data_date == today ? ' today' : '';
                    
                    var html = "<div class='day-wrapper" + isToday + "' data-date='" + data_date + "' style='min-height:" + _ch + "px'>"
                        + "<div class='day-caption _inactive'>" + inactiveBack + "</div>"
                          + "<div ng-repeat='x in " + ins + ".getItemsByDay(" + data_date.replaceAll('-', '') + ")"+"' class='_event _session _cid{{x.Id}} _status_{{x.Id}}' ng-click='duty_click(  x.Id,x.DutyType  )'>"
                         + "<div class='_title'>{{get_duty_title(x)}}</div>"
                        
                        + "</div>"
                        //+ "<div ng-repeat='x in " + ins + ".dataSource"+"' class='_event _session _cid{{x.Id}} _status_{{x.Id}}' ng-click='duty_click(  x.Id  )'>{{x.Id}}"
                        //+ "<div class='_title'>{{(x.Title.length <= 25 ? x.Title : x.Title.substr(0, 25) +'...') }} ({{x.CourseId}})</div>"
                        //+ "<div style='font-size:12px;'>{{ momentTime(x.DateStart)  + ' - ' + momentTime(x.DateEnd) }}</div>"
                       // + "</div>"						 


					   //+ "<div ng-repeat='x in " + ins + ".getSessionsByDay(" + data_date.replaceAll('-', '') + ")' class='_event _session _cid{{x.CourseId}} _status_{{x.StatusId}}' ng-click='session_click(  x.CourseId  )'>"
                       // + "<div class='_title'>{{(x.Title.length <= 25 ? x.Title : x.Title.substr(0, 25) +'...') }} ({{x.CourseId}})</div>"
                       // + "<div style='font-size:12px;'>{{ momentTime(x.DateStart)  + ' - ' + momentTime(x.DateEnd) }}</div>"
                       // + "</div>"
						
                       // + "<div ng-repeat='x in " + ins + ".getExpiredByDay(" + data_date.replaceAll('-', '') + ")'>"
                       // + "   <div ng-repeat='s in x.Items'  class='_event _expired ' nh-click='showExpired(s.Items)'>"

                      //  + "       <div class='_title'>{{s.CertificateType}}  ({{ s.Count}} ) </div>"
                       // + "    </div>"
                       // + "</div>"
                         
                        + "</div>";


                   
                    
                    $('#' + this.id + ' #d' + c).html(html);
                    this.calendar.push({ cell: 'd' + c, date: data_date });
                    inactiveBack--;
                    c--;
                }

                while (dayMonth <= lastDay) {
                    //  console.log(data_date, this.getDataByDay(data_date));
                    // console.log(data_date, this.dataSource);
                    var data_date = this.year + '-' + pad(Number(this.month) + 1) + '-' + pad(Number(dayMonth));
                    var isToday = data_date == today ? ' today' : '';

                    var html = "<div class='day-wrapper" + isToday + "' data-date='" + data_date + "' style='min-height:" + _ch + "px'>"
                        + "<div class='day-caption'>" + dayMonth + "</div>"
						
						 + "<div ng-repeat='x in " + ins + ".getItemsByDay(" + data_date.replaceAll('-', '') + ")"+"' class='_event _session _cid{{x.Id}} _status_{{x.Id}}' ng-click='duty_click(  x.Id,x.DutyType  )'>"
                         + "<div class='_title'>{{get_duty_title(x)}}</div>"
                        
                        + "</div>"						 

						
                        //+ "<div ng-repeat='x in " + ins + ".getSessionsByDay(" + data_date.replaceAll('-', '') + ")' class='_event _session _cid{{x.CourseId}} _status_{{x.StatusId}}' ng-click='session_click(  x.CourseId  )'>"
                       // + "<div class='_title'>{{(x.Title.length <= 25 ? x.Title : x.Title.substr(0, 25) +'...') }} ({{x.CourseId}})</div>"
                       // + "<div style='font-size:12px;'>{{ momentTime(x.DateStart)  + ' - ' + momentTime(x.DateEnd) }}</div>"
                       // + "</div>"


                      //  + "<div ng-repeat='x in " + ins + ".getExpiredByDay(" + data_date.replaceAll('-', '') + ")'>"
                      //  + "   <div ng-repeat='s in x.Items'  class='_event _expired ' nh-click='showExpired(s.Items)'>"

                      //  + "       <div class='_title'>{{s.CertificateType}}  ({{ s.Count}} ) </div>"
                       // + "    </div>"
                       // + "</div>"


                        + "</div>";

                    this.calendar.push({ cell: 'd' + dayIndex, date: data_date });
                    $('#' + this.id + ' #d' + dayIndex).html(html);

                    dayMonth++;
                    dayIndex++;
                }

                while (dayIndex <= 41) {
                    var data_date = inactiveForwardYear + '-' + pad(Number(inactiveForwardMonth) + 1) + '-' + pad(Number(inactiveForward));
                    var isToday = data_date == today ? ' today' : '';
                     
                    var html = "<div class='day-wrapper" + isToday + "' data-date='" + data_date + "' style='min-height:" + _ch + "px'>"
                        + "<div class='day-caption _inactive'>" + inactiveForward + "</div>"
						 + "<div ng-repeat='x in " + ins + ".getItemsByDay(" + data_date.replaceAll('-', '') + ")"+"' class='_event _session _cid{{x.Id}} _status_{{x.Id}}' ng-click='duty_click(  x.Id,x.DutyType  )'>"
                         + "<div class='_title'>{{get_duty_title(x)}}</div>"
                        
                        + "</div>"
                        //+ "<div ng-repeat='x in " + ins + ".getSessionsByDay(" + data_date.replaceAll('-', '') + ")' class='_event _session _cid{{x.CourseId}} _status_{{x.StatusId}}' ng-click='session_click(  x.CourseId  )'>"
                        //+ "<div class='_title'>{{(x.Title.length <= 25 ? x.Title : x.Title.substr(0, 25) +'...') }} ({{x.CourseId}})</div>"
                        //+ "<div style='font-size:12px;'>{{ momentTime(x.DateStart)  + ' - ' + momentTime(x.DateEnd) }}</div>"
                        //+ "</div>"
						
						//+ "<div ng-repeat='x in " + ins + ".dataSource"+"' class='_event _session _cid{{x.Id}} _status_{{x.Id}}' ng-click='duty_click(  x.Id  )'>{{x.Id}}"
                        //+ "<div class='_title'>{{(x.Title.length <= 25 ? x.Title : x.Title.substr(0, 25) +'...') }} ({{x.CourseId}})</div>"
                        //+ "<div style='font-size:12px;'>{{ momentTime(x.DateStart)  + ' - ' + momentTime(x.DateEnd) }}</div>"
                       // + "</div>"
						
                       // + "<div ng-repeat='x in " + ins + ".getExpiredByDay(" + data_date.replaceAll('-', '') + ")'>"
                       // + "   <div ng-repeat='s in x.Items'  class='_event _expired ' nh-click='showExpired(s.Items)'>"

                       // + "       <div class='_title'>{{s.CertificateType}}  ({{ s.Count}} ) </div>"
                       // + "    </div>"
                       // + "</div>"
                        + "</div>";
                    $('#' + this.id + ' #d' + dayIndex).html(html);
                    this.calendar.push({ cell: 'd' + dayIndex, date: data_date });
                    dayIndex++;
                    inactiveForward++;
                }
                // $scope.isCalVisible = true;
                $compile($('#' + this.id + ' .day-wrapper'))($scope);
                $('#' + this.id + ' .day-wrapper').show();



            }
            catch (e) { alert(e); }
        }


       
        fill() {
            //$.each(this.dataSource.GroupedItems, function (_j, _c) {
            //    var _element = "<div class='_event _session  _cid" + _c.CourseId + "' ng-click='session_click(" + _c.CourseId + ")'>"
            //        + "<div class='_title'>" + (_c.Title.length <= 25 ? _c.Title : _c.Title.substr(0, 25) + "...") + "</div>"
            //        + "<div style='font-size:12px;'>" + moment(_c.DateStart).format('HH:mm') + " - " + moment(_c.DateEnd).format('HH:mm') + "</div>"
            //        + "</div>";
            //    var cell = Enumerable.From($scope.calendar).Where(function (x) { return x.date == moment(_d.Date).format('YYYY-MM-DD'); }).FirstOrDefault();
            //    if (cell) {
            //        $('#' + cell.cell).find('.day-wrapper').append(_element);
            //        console.log(_d.Date);
            //    }
            //});
        }
    }
    //2024-01-24
    $scope.schedule_month_01_ins = new schedule_month('sch_01');
	$scope.schedule_month_01_ins.onChangeYearMonth=function(_y,_m){
		$scope.bindAll(_y,_m+1);
	};
	 
	 $scope.schedule_month_01_ins.year = (new Date()).getFullYear();
     $scope.schedule_month_01_ins.month = (new Date()).getMonth();
	//$scope.schedule_month_01_ins.build($(window).height() - 160, 'schedule_month_01_ins');
	
	
	///////////////////
	$scope.get_duty_title=function(dty){
		
		return dty.DutyTypeTitle;
		
	};
	$scope.get_crew=function(flightid){
		if ($scope.selected_duty.type!=1165)
			return [];
		var crews=Enumerable.From($scope.selected_duty.crews).Where('$.FlightId=='+flightid).ToArray();
		
		return crews;
	};
	
	$scope.get_crew2=function(crews,flightid){
		 
		var crews=Enumerable.From(crews).Where('$.FlightId=='+flightid).ToArray();
		
		return crews;
	};
	$scope.get_pos=function(c){
		if (c.IsPositioning)
			return "DH";
		return c.Position;
	}
	$scope.duty_click=function(id,type){
		$scope.loadingVisible = true;
		
		flightService.getFDP(id,type).then(function (response2) {
			 $scope.loadingVisible = false;
			 $scope.selected_duty=response2;
			  $scope.popup_duty_visible = true;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err , 'error'); });
	};
	
	$scope.popup_duty_visible = false;
    $scope.popup_duty_title = 'Duty';
    $scope.popup_duty = {
        width: 300,
        height: 260,
        //position: 'left top',
        fullScreen: true,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [




            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove',onClick: function () { $scope.popup_duty_visible = false;} }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
           $('#duty_scrll').height($(window).height()-120);
        },
        onHiding: function () {

           $scope.popup_duty_visible = false;
        },
        bindingOptions: {
            visible: 'popup_duty_visible',
            

        }
    };
	//////////////////
    var tabs = [
     
       { text: "Today", id: 'today' },
		  { text: "Tomorrow", id: 'tomorrow' },
        { text: "All", id: 'all' },


    ];
    $scope.tabs = tabs;
	
	

    $scope.$watch("selectedTabIndex", function (newValue) {
        $('.tabc').hide();
        var id = tabs[newValue].id;
        $('#' + id).fadeIn(400, function () {
           /* var scroll_crew_tomorrow = $("#scroll_crew_tomorrow").dxScrollView().dxScrollView("instance");
            scroll_crew_tomorrow.scrollBy(1);

            var scroll_crew_tday = $("#scroll_crew_today").dxScrollView().dxScrollView("instance");
            scroll_crew_tday.scrollBy(1);

            var scrltom = $("#scrltom").dxScrollView().dxScrollView("instance");
            scrltom.scrollBy(1);

            var scrltod = $("#scrltod").dxScrollView().dxScrollView("instance");
            scrltod.scrollBy(1);*/
            
        });
        switch (id) {
            case 'today':
                //$scope.bindToday();
$scope.bind_duties();
                break;
            case 'tomorrow':
			$scope.bind_duties();
               // $scope.bindTomorrow();
                break;
            case 'all':
                //$scope.buildAcc();
                $scope.bindAll($scope.schedule_month_01_ins.year,$scope.schedule_month_01_ins.month+1);

                if ($scope.sch_instance)
                    $scope.sch_instance.repaint();
                break;
            default:
                break;
        }

    });
    $scope.tabs_options = {


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        bindingOptions: {

            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };
    $scope.selectedTabIndex = 0;
    //////////////////////

    $scope.scroll_height = 200;
    $scope.scroll_main = {
        width: '100%',
        bounceEnabled: true,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: false,
        refreshingText: 'Updating...',
        onPullDown: function (options) {
            $scope.bind();
            //Alert.getStartupNots(null, function (arg) {
            //    options.component.release();
            //    // refreshCarts(arg);
            //});
            options.component.release();

        },
        bindingOptions: { height: 'scroll_height', }
    };
    ///////////////////////////
    $scope.scroll_height_all = 100;
    $scope.scroll_all_instance = null;
    $scope.scroll_all = {
        width: '100%',
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: false,
        refreshingText: 'Updating...',
        onPullDown: function (options) {
            //$scope.bind();
            //Alert.getStartupNots(null, function (arg) {
            //    options.component.release();
            //    // refreshCarts(arg);
            //});
            options.component.release();

        },
        onInitialized: function (e) {
            //console.log(e.component);
            if (!$scope.scroll_all_instance)
                $scope.scroll_all_instance = e.component;

        },
        bindingOptions: { height: 'scroll_height_all', }
    };

    $scope.scroll_popup = {
        width: '100%',
        bounceEnabled: false,
        showScrollbar: 'never',
        pulledDownText: '',
        pullingDownText: '',
        useNative: false,
        refreshingText: 'Updating...',
        onPullDown: function (options) {
            //$scope.bind();
            //Alert.getStartupNots(null, function (arg) {
            //    options.component.release();
            //    // refreshCarts(arg);
            //});
            options.component.release();

        },
        onInitialized: function (e) {
           

        },
        heigh:'100%',
      //  bindingOptions: { height: 'scroll_height_all', }
    };
    /////////////////////////////
    $scope.scroll_tomorrow = {
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
        height: '100%',
         
    };
    $scope.scroll_crew = {
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
        height: '100%',

    };
    $scope.scroll_crew_today = {
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
        height: '100%',

    };
    ///////////////////////////
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
    //////////////////////////////

    ////////////////////////////////////////////////////
    $scope.dg_flight_columns = [

        { dataField: 'Date', caption: 'Date', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140 },
        { dataField: 'Leg', caption: 'Leg', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        { dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'HH:mm', width: 100 },
        { dataField: 'STA', caption: 'STA', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'HH:mm', width: 100 },
        //{ dataField: 'FlightNumber', caption: 'No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 80, fixed: false, fixedPosition: 'left' },
       // { dataField: 'Position', caption: 'Position', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
        //{ dataField: 'FromAirportIATA', caption: 'From', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },
       // { dataField: 'ToAirportIATA', caption: 'To', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 70 },

        //{ dataField: 'STD', caption: 'STD', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
        //{ dataField: 'ChocksOut', caption: 'Off Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
       // { dataField: 'Takeoff', caption: 'Departed', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },

       // { dataField: 'Landing', caption: 'Arrived', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
       // { dataField: 'ChocksIn', caption: 'On Block', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, width: 90, format: 'HH:mm' },
       // { dataField: 'FlightTime2', caption: 'Flight Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
       // { dataField: 'BlockTime', caption: 'Block Time', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
       // { dataField: 'Duty2', caption: 'Duty', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },



    ];

    $scope.dg_flight_selected = null;
    $scope.dg_flight_instance = null;
    $scope.dg_flight_ds = null;
    $scope.dg_flight = {
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
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: true,
        height: $(window).height() - 45 - 62,

        columns: $scope.dg_flight_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flight_instance)
                $scope.dg_flight_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_flight_selected = null;
            }
            else
                $scope.dg_flight_selected = data;


        },
        summary: {
            totalItems: [{
                name: "FlightTimeTotal",
                showInColumn: "FlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            },
            {
                name: "BlockTimeTotal",
                showInColumn: "BlockTime",
                displayFormat: "{0}",

                summaryType: "custom"
            }
                ,
            {
                name: "DutyTotal",
                showInColumn: "Duty",
                displayFormat: "{0}",

                summaryType: "custom"
            }
            ],
            calculateCustomSummary: function (options) {
                if (options.name === "FlightTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightH * 60 + options.value.FlightM;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "BlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.ActualFlightHOffBlock * 60 + options.value.ActualFlightMOffBlock;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "DutyTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.Duty;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



            }
        },
        bindingOptions: {
            dataSource: 'dg_flight_ds'
        }
    };
    ////////////////////////////////////////////////////
    $scope.ds = null;
    $scope.ds_today = null;
    $scope.ds_tomorrow = null;
    $scope.ds_all = null;
    $scope.ds_day = null;
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };
    $scope.getDay = function (dt) {
        return (new Date(dt)).getDate();
    };
	$scope.format_date=function(dt){
		
		if (!dt)
			return "-";
		return moment(dt).format('YYYY-MMM-DD');
	}
	$scope.format_datetime=function(dt){
		
		if (!dt)
			return "-";
		return moment(dt).format('YYYY-MMM-DD HH:mm');
	}
	$scope.format_time=function(dt){
		
		if (!dt)
			return "-";
		return moment(dt).format('HH:mm');
	}
	// (new Date(_d.STA)).addMinutes(offset);
		$scope.format_time_lcl=function(dt){
		
		if (!dt)
			return "-";
		var ldt=(new Date(dt)).addMinutes(210);
		return moment(ldt).format('HH:mm');
	}
    $scope.getFlightTileMonth = function (dt) {
        var mns = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        var _dt = new Date(dt);
        var m = _dt.getMonth();
        var mstr = mns[m];
        var year = _dt.getFullYear();
        var yearstr = year.toString().substring(2, 4);
        var str = mstr + ' ' + yearstr;
        return str;
    };
    $scope.getStatusClass = function (item) {

        return "fa fa-circle " + item.FlightStatus.toLowerCase();
    };
    $scope.getFlightClass = function (item) {
        var x = "lib-flight";
        if (item.IsPositioning == 1)
            x += " dh";
        return x;
    };
    $scope.getStatus  = function (item) {

        switch (item ) {
            case 'OffBlocked':
                return 'Block Off';
            case 'OnBlocked':
                return 'Block On';
            case 'Departed':
                return 'Take Off';
            case 'Arrived':
                return 'Landing';

            default:
                return item ;
        }
    };
    function formatTime2(date) {
        if ($rootScope.userName.toLowerCase() == 'shamsi')
            alert(date);
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
        //if ($rootScope.userName.toLowerCase() == 'shamsi')
        //    alert(dt);
        if (dt.toString().indexOf('T') != -1) {
            var prts = dt.toString().split('T')[1];
            var tm = prts.substr(0, 5);
            return (tm);
        }
        var _dt = new Date(dt);
        //new Date(year, month, day, hours, minutes, seconds, milliseconds)
        return formatTime2(_dt);
    };
    $scope.getDuration = function (x) {
        if (!x)
            return "-";
        return pad(Math.floor(x / 60)).toString() + ':' + pad(x % 60).toString()  ;
    };


    $scope.flight = null;
    $scope.flightDay = null;
    $scope.flightToday = null;
    $scope.flightTomorrow = null;
    $scope.showFlight = function (item, n, $event) {
        if (!detector.tablet()) {
            $scope.flight = item;
            $scope.popup_flight_visible = true;
        }
        else {
            if (n == 0) {
                $('.today-tile').removeClass('selected');
                $scope.flightToday = item;
            }
            if (n == 1) {
                $('.tomorrow-tile').removeClass('selected');
                $scope.flightTomorrow = item;
            }
            if (n == 2) {
                $('.day-tile').removeClass('selected');
                $scope.flightDay = item;
            }
            var tile = $($event.currentTarget);
            tile.addClass('selected');

            $scope.getCrewAbs(item.FlightId, n);
        }
    };
    $scope.crew = null;
    $scope.crewDay = null;
    $scope.crewToday = null;
    $scope.crewTomorrow = null;
    $scope.getCrewAbs = function (fid, n) {
        $scope.crew = null;
        $scope.crewDay = null;
        $scope.crewToday = null;
        $scope.crewTomorrow = null;
        $scope.loadingVisible = true;
      

        $scope.loadingVisible = true;
        flightService.getFlightCrews(fid).then(function (response) {
            $scope.loadingVisible = false;

            if (!n && n!=0) {
                $scope.crew = response;
            } else
                if (n == 0) {
                    $scope.crewToday = response;
                    
                } else
                    if (n == 1) {
                        $scope.crewTomorrow = response;
                    } else
                        if (n == 2) {
                            $scope.crewDay = response;
                        }



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    //////////////////////////////////
    $scope.popup_flight_visible = false;
    $scope.popup_flight_title = 'Flight';
    $scope.popup_flight = {
        width: 300,
        height: 260,
        //position: 'left top',
        fullScreen: true,
        showTitle: true,
        dragEnabled: false,
        toolbarItems: [




            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            $scope.getCrewAbs($scope.flight.FlightId);
        },
        onHiding: function () {

            $scope.flight = null;
            $scope.crew = null;
        },
        bindingOptions: {
            visible: 'popup_flight_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_flight_title',

        }
    };
	
	

    //close button
    $scope.popup_flight.toolbarItems[0].options.onClick = function (e) {

        $scope.popup_flight_visible = false;

    };
    //////////////////////////////////
	$scope.get_ds_duties=function(d){
		var df = new Date();
		if (d==1)
			df = (new Date()).addDays(1);
		  var _df=moment(df).format("YYYY-MM-DD");
		  
		  var _ds=Enumerable.From($scope.ds_duties).Where(function(x){return _df==moment(new Date(x.date)).format("YYYY-MM-DD");}).ToArray();
		  console.log('_ds',_ds);
		  return _ds;
	}
	$scope.bind_duties=function(){
		 var id = $rootScope.employeeId;
		if (!id)
			return;
		 $scope.loadingVisible = true;
		 var dt = (new Date()).addDays(1);
         var df = new Date();
		 
		 var _dt=moment(dt).format("YYYY-MM-DD");
		  var _df=moment(df).format("YYYY-MM-DD");
		 flightService.getDuties(id, _df, _dt).then(function (response) {
			 $scope.loadingVisible = false;
			 $scope.ds_duties=response;
			 $scope.ds_dty_today=$scope.get_ds_duties(0);
			  $scope.ds_dty_tom=$scope.get_ds_duties(1);
			 
			 console.log($scope.ds_duties);
		 }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
	}
    $scope.bindToday = function () {
        if ($scope.ds_today)
            return;
        $scope.loadingVisible = true;

        var dt = new Date();
        var df = new Date();
        // $scope.getCrewFlights($rootScope.employeeId, df, dt);
        var id = $rootScope.employeeId;
		if (!id)
			return;
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getCrewFlights(id, df, dt).then(function (response) {
            $scope.loadingVisible = false;
            // $.each(response, function (_i, _d) {
            //_d.Leg = _d.FromAirportIATA + ' - ' + _d.FlightNumber + ' - ' + _d.ToAirportIATA;
            //_d.STA = (new Date(_d.STA)).addMinutes(offset);

            //_d.STD = (new Date(_d.STD)).addMinutes(offset);
            //if (_d.ChocksIn)
            //    _d.ChocksIn = (new Date(_d.ChocksIn)).addMinutes(offset);
            //if (_d.ChocksOut)
            //    _d.ChocksOut = (new Date(_d.ChocksOut)).addMinutes(offset);
            //if (_d.Takeoff)
            //    _d.Takeoff = (new Date(_d.Takeoff)).addMinutes(offset);
            //if (_d.Landing)
            //    _d.Landing = (new Date(_d.Landing)).addMinutes(offset);
            //_d.DurationH = Math.floor(_d.FlightTime / 60);
            //_d.DurationM = _d.FlightTime % 60;
            //var fh = _d.FlightH * 60 + _d.FlightM;
            //_d.FlightTime2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();
            //var bm = _d.ActualFlightHOffBlock * 60 + _d.ActualFlightMOffBlock;
            //_d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
            //_d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
            //poosk
            //});
            $scope.ds_today = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    $scope.bindTomorrow = function () {
        
        if ($scope.ds_tomorrow)
            return;
        $scope.loadingVisible = true;

        var dt = (new Date()).addDays(1);
        var df = (new Date()).addDays(1);
        // $scope.getCrewFlights($rootScope.employeeId, df, dt);
        var id = $rootScope.employeeId;
		if (!id)
			return;
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getCrewFlights(id, df, dt).then(function (response) {
            $scope.loadingVisible = false;
          
            //$.each(response, function (_i, _d) {
            //    _d.Leg = _d.FromAirportIATA + ' - ' + _d.FlightNumber + ' - ' + _d.ToAirportIATA;
            //    _d.STA = (new Date(_d.STA)).addMinutes(offset);

            //    _d.STD = (new Date(_d.STD)).addMinutes(offset);
            //    if (_d.ChocksIn)
            //        _d.ChocksIn = (new Date(_d.ChocksIn)).addMinutes(offset);
            //    if (_d.ChocksOut)
            //        _d.ChocksOut = (new Date(_d.ChocksOut)).addMinutes(offset);
            //    if (_d.Takeoff)
            //        _d.Takeoff = (new Date(_d.Takeoff)).addMinutes(offset);
            //    if (_d.Landing)
            //        _d.Landing = (new Date(_d.Landing)).addMinutes(offset);
            //    _d.DurationH = Math.floor(_d.FlightTime / 60);
            //    _d.DurationM = _d.FlightTime % 60;
            //    var fh = _d.FlightH * 60 + _d.FlightM;
            //    _d.FlightTime2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();
            //    var bm = _d.ActualFlightHOffBlock * 60 + _d.ActualFlightMOffBlock;
            //    _d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
            //    _d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
            //    //poosk
            //});
            $scope.ds_tomorrow = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };
    $scope.bindAll = function (y,m) {
        //if ($scope.ds_all)
        //    return;

        $scope.loadingVisible = true;


        // $scope.getCrewFlights($rootScope.employeeId, df, dt);
        var id = $rootScope.employeeId;
		if (!id)
			return;
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
		
		flightService.getRoster(id,y,m).then(function (response2) { 
		    $scope.loadingVisible = false;
		     console.log('roster',response2); 
			 
			 
			 
			 var _rds=[];
			 $.each(response2,function(_i,_d){
				 var dt_start=new Date(_d.DateStartLocal);
				 var dt_end=new Date(_d.DateEndLocal);
				 switch(_d.DutyType){
					 case 1165:
					   _d._date=dt_start;
					    _rds.push(_d);
					   break;
					 default:
					   if (moment(dt_start).format("YYYYMMDD")==moment(dt_end.addMinutes(-1)).format("YYYYMMDD")){
					     _d._date=dt_start;
					     _rds.push(_d);
				        }
						else
						{
							 var _s=dt_start;
							 
							 while(moment(_s).format("YYYYMMDD")<=moment(dt_end.addMinutes(-1)).format("YYYYMMDD")){
								  var _obj=JSON.parse(JSON.stringify(_d));
								  _obj._date=_s;
								   _rds.push(_obj);
								 _s=_s.addDays(1);
							 }
						}
						
					   break;
				 }
				 /*if (moment(dt_start).format("YYYYMMDD")==moment(dt_end).format("YYYYMMDD")){
					 _d._date=dt_start;
					 _rds.push(_d);
				 }
				 else
				 {
					 _d._date=dt_start;
				 }*/
				 
				 
				 
			 });
			 $scope.schedule_month_01_ins.dataSource = _rds;
			 $scope.schedule_month_01_ins.build($(window).height() - 160, 'schedule_month_01_ins');
	    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err , 'error'); });
        
		
		
		return;
		flightService.getCrewFlightsGrouped(id).then(function (response) {
            $scope.loadingVisible = false;

            $scope.ds_all = response;
            if ($scope.sch_instance)
                $scope.sch_instance.repaint();

        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err , 'error'); });


    };
    $scope.bindDay = function (day) {
        $scope.ds_day = null;
        $scope.loadingVisible = true;

        var dt = new Date(day);
        var df = new Date(day);
        // $scope.getCrewFlights($rootScope.employeeId, df, dt);
        var id = $rootScope.employeeId;
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getCrewFlights(id, df, dt).then(function (response) {
            $scope.loadingVisible = false;
            //$.each(response, function (_i, _d) {
            //    _d.Leg = _d.FromAirportIATA + ' - ' + _d.FlightNumber + ' - ' + _d.ToAirportIATA;
            //    _d.STA = (new Date(_d.STA)).addMinutes(offset);

            //    _d.STD = (new Date(_d.STD)).addMinutes(offset);
            //    if (_d.ChocksIn)
            //        _d.ChocksIn = (new Date(_d.ChocksIn)).addMinutes(offset);
            //    if (_d.ChocksOut)
            //        _d.ChocksOut = (new Date(_d.ChocksOut)).addMinutes(offset);
            //    if (_d.Takeoff)
            //        _d.Takeoff = (new Date(_d.Takeoff)).addMinutes(offset);
            //    if (_d.Landing)
            //        _d.Landing = (new Date(_d.Landing)).addMinutes(offset);
            //    _d.DurationH = Math.floor(_d.FlightTime / 60);
            //    _d.DurationM = _d.FlightTime % 60;
            //    var fh = _d.FlightH * 60 + _d.FlightM;
            //    _d.FlightTime2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();
            //    var bm = _d.ActualFlightHOffBlock * 60 + _d.ActualFlightMOffBlock;
            //    _d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
            //    _d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
            //    //poosk
            //});
            $scope.ds_day = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


    };

    $scope.bind = function () {
   
        if ($scope.firstBind)
            $scope.loadingVisible = true;
		
	
		
        //libraryService.getPersonLibrary($rootScope.employeeId, $scope.typeId).then(function (response) {
        //    $scope.loadingVisible = false;
        //    $scope.firstBind = false;
        //    $.each(response, function (_i, _d) {
        //        // _d.ImageUrl = _d.ImageUrl ? $rootScope.clientsFilesUrl + _d.ImageUrl : '../../content/images/imguser.png';
        //        _d.DateExposure = moment(_d.DateExposure).format('MMMM Do YYYY, h:mm:ss a');
        //        _d.VisitedClass = "fa " + (_d.IsVisited ? "fa-eye w3-text-blue" : "fa-eye-slash w3-text-red");
        //        //_d.IsDownloaded = true;
        //        _d.DownloadedClass = "fa " + (_d.IsDownloaded ? "fa-cloud-download-alt w3-text-blue" : "fa-cloud w3-text-red");
        //        _d.class = (_d.IsDownloaded && _d.IsVisited) ? "card w3-text-dark-gray bg-white" : "card text-white bg-danger";
        //        _d.class = "card w3-text-dark-gray bg-white";
        //        _d.titleClass = (_d.IsDownloaded && _d.IsVisited) ? "" : "w3-text-red";
        //        _d.ImageUrl = _d.ImageUrl ? $rootScope.clientsFilesUrl + _d.ImageUrl : '../../content/images/image.png';
        //    });
        //    $scope.ds = response;
        //}, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        //var dt = $scope.popup_flight_dt ? $scope.popup_flight_dt : new Date(2200, 4, 19, 0, 0, 0);
        //var df = $scope.popup_flight_df ? $scope.popup_flight_df : new Date(1900, 4, 19, 0, 0, 0);
        var dt = new Date(2200, 4, 19, 0, 0, 0);
        var df = new Date(1900, 4, 19, 0, 0, 0);
        // $scope.getCrewFlights($rootScope.employeeId, df, dt);
        var id = $rootScope.employeeId;
        var offset = -1 * (new Date()).getTimezoneOffset();

        $scope.loadingVisible = true;
        flightService.getCrewFlights(id, df, dt).then(function (response) {
            $scope.loadingVisible = false;
	
            $.each(response, function (_i, _d) {
                _d.Leg = _d.FromAirportIATA + ' - ' + _d.FlightNumber + ' - ' + _d.ToAirportIATA;
                _d.STA = (new Date(_d.STA)).addMinutes(offset);

                _d.STD = (new Date(_d.STD)).addMinutes(offset);
                if (_d.ChocksIn)
                    _d.ChocksIn = (new Date(_d.ChocksIn)).addMinutes(offset);
                if (_d.ChocksOut)
                    _d.ChocksOut = (new Date(_d.ChocksOut)).addMinutes(offset);
                if (_d.Takeoff)
                    _d.Takeoff = (new Date(_d.Takeoff)).addMinutes(offset);
                if (_d.Landing)
                    _d.Landing = (new Date(_d.Landing)).addMinutes(offset);
                _d.DurationH = Math.floor(_d.FlightTime / 60);
                _d.DurationM = _d.FlightTime % 60;
                var fh = _d.FlightH * 60 + _d.FlightM;
                _d.FlightTime2 = pad(Math.floor(fh / 60)).toString() + ':' + pad(fh % 60).toString();
                var bm = _d.ActualFlightHOffBlock * 60 + _d.ActualFlightMOffBlock;
                _d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
                _d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
                //poosk
            });
            $scope.dg_flight_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



        ////////////////////////////////////
    };

    $scope.itemClick = function (bookId, employeeId) {
        //alert(bookId+' '+employeeId);
        $location.path('/applibrary/item/' + bookId);
    };

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {
        $rootScope.page_title = 'Flight > ' + $scope.title;
        $scope.scroll_height = $(window).height() - 45 - 62 - 100;

        $scope.scroll_height_all = $(window).height() - 505;
        $('#scrollviewall').height($(window).height() - 505);
        $('.col-tablet').height($(window).height() - 45 - 62 - 45);
        $('.div-crew').height($(window).height() - 552);
        $('#tomorrow').height($(window).height() - 45 - 62 - 30);
        $('#today').height($(window).height() - 45 - 62 - 30);
        $('.flightnew').fadeIn();
			
        // $scope.bindTomorrow();
    }
    //////////////////////////////////////////
    $scope.data = [];

    var priorities = [
        {
            text: "High priority",
            id: 1,
            color: "#cc5c53"
        }, {
            text: "Low priority",
            id: 2,
            color: "#ff9747"
        }
    ];
$scope.formatCellDateDay = function (dt,data) {
       
        return data.text; //moment(new Date(dt )).format('DD');
    };
    $scope.sch_instance = null;
    $scope.scheduler = null;
    $scope.sch_current = new Date();
    $scope.schedulerOptions = {
        // dataSource:  $scope.data,
        textExpr: 'Total',
        startDateExpr: 'Start',
        endDateExpr: 'End',
       appointmentTemplate: 'appointmentTemplate',
	     dataCellTemplate: 'dataCellTemplate',
	   
        views: ["month"],
        adaptivityEnabled: false,
        currentView: "month",
        startDayHour: 0,
        currentDate: new Date(),
        height: 340,
        bindingOptions: {
            dataSource: 'ds_all', //'dg_employees_ds',
            currentDate: 'sch_current',
            // height: 'dg_employees_height'
        },
        onContentReady: function (e) {
            if (!$scope.sch_instance)
                $scope.sch_instance = e.component;

        },
        onAppointmentClick: function (e) {
            $scope.flight = null;
            $scope.flightDay = null;
            $scope.bindDay(e.appointmentData.Start);
            e.cancel = true;
            return;
            var $el = $(e.event.target);
            if ($el.hasClass('cellposition')) {
                e.cancel = true;
                return;
            }
        },

    };

    $scope.speedDialActionOptions = {
        icon: "plus",
        onClick: showAppointmentPopup
    }

    function showAppointmentPopup() {
        var scheduler = $('#scheduler').dxScheduler('instance');
        scheduler.showAppointmentPopup();
    }
    //////////////////////////////////////////
    $scope.accToggle = function ($event) {
        // alert('c');
        //alert($scope.scroll_all_instance);
        $scope.scroll_all_instance.beginUpdate();
        $scope.scroll_height_all = 1000;
        // $scope.scroll_all_instance.repaint();
        $scope.scroll_all_instance.endUpdate();
        //var $this = $($event.target);
        //$this.toggleClass('active');
        //var panel = $this.next();

    };
    //////////////////////////////////////////
    
    $scope.accBuilt = false;
    $scope.accActive = false;
    $scope.buildAcc = function () {

        //  $scope.scroll_height_all = $(window).height() - 525;
        if ($scope.accBuilt)
            return;
        $scope.accBuilt = true;
        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {


            acc[i].addEventListener("click", function () {

                this.classList.toggle("active");
                $scope.accActive = !$scope.accActive;
                var panel = this.nextElementSibling;
                if (panel.style.maxHeight) {

                    //$scope.scroll_height_all = $(window).height() - 505;
                    $('#scrollviewall').height($(window).height() - 505 + 330);
                    $('.col-tablet2').height($(window).height() - 505 + 330);

                    panel.style.maxHeight = null;
                } else {
                    //alert(panel.scrollHeight);
                    $('#scrollviewall').height($(window).height() - 515);
                    $('.col-tablet2').height($(window).height() - 515);
                    //doof
                    //$scope.scroll_height_all = $(window).height() - 505 + 340;

                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        }
        for (i = 0; i < acc.length; i++) {
            var acc = acc[i];
            acc.classList.toggle("active");
            $scope.accActive = true;
            var _panel = acc.nextElementSibling;
            if (_panel.style.maxHeight) {
                $('#scrollviewall').height($(window).height() - 505 + 330);
                $('.col-tablet2').height($(window).height() - 505 + 330);
                _panel.style.maxHeight = null;
            } else {
                $('#scrollviewall').height($(window).height() - 515);
                $('.col-tablet2').height($(window).height() - 515);
                _panel.style.maxHeight = _panel.scrollHeight + "px";
            }
        }
    };
	
	
	
	
	/////////////////////////////////////////
	
	
    //////////////////////////////////////////
    $scope.$on('PageLoaded', function (event, prms) {
        //footerbook
        if (prms == 'footer')
            $('.footer' + $scope.active).addClass('active');
 

    });
    var vhHeight = $("body").height();
    var chromeNavbarHeight = vhHeight - window.innerHeight;
    window.addEventListener("orientationchange", function (event) {
        //   alert(chromeNavbarHeight);
        //var _height = screen.height-100;

        //no-rotate
        setTimeout(function () {
            //alert(window.outerHeight);
            var _height = window.outerHeight;
            // alert(screen.height);
            $('.col-tablet').height(_height - 45 - 62 - 45);
            var tb2 = _height - 515;
            if (!$scope.accActive)
                tb2 = _height - 505 + 330;
            $('.col-tablet2').height(tb2);
            $('.div-crew').height(_height - 552);
            $('#tomorrow').height(_height - 45 - 62 - 30);
            $('#today').height(_height - 45 - 62 - 30);
            if (screen.height < screen.width && !detector.tablet()) {
                $('.no-rotate').hide();
                $('.yes-rotate').show();
            }
            else { $('.no-rotate').show(); $('.yes-rotate').hide(); }
        },200);

    }, false);

    function reportWindowSize() {
        //heightOutput.textContent = window.innerHeight;
        //widthOutput.textContent = window.innerWidth;
       
    }

    window.onresize = function (event) {
        return;
        setTimeout(function () {
            //alert(window.outerHeight);
            var _height = window.outerHeight;
            // alert(screen.height);
            $('.col-tablet').height(_height - 45 - 62 - 45);
            var tb2 = _height - 515;
            if (!$scope.accActive)
                tb2 = _height - 505 + 330;
            $('.col-tablet2').height(tb2);
            $('.div-crew').height(_height - 552);
            $('#tomorrow').height(_height - 45 - 62 - 30);
            $('#today').height(_height - 45 - 62 - 30);
            if (screen.height < screen.width && !detector.tablet()) {
                $('.no-rotate').hide();
                $('.yes-rotate').show();
            }
            else { $('.no-rotate').show(); $('.yes-rotate').hide(); }
        }, 200);
    };
    //$(window).on("orientationchange", function (event) {
    //    // alert("This device is in " + event.orientation + " mode!");
    //    console.log(event);
    //});
    
    $rootScope.$broadcast('AppLibraryLoaded', null);
    window.onerror = function (message, url, lineNo) {
		
        console.log('Error: ' + message + '\n' + 'Line Number: ' + lineNo);
        return true;
    }







 



}]);