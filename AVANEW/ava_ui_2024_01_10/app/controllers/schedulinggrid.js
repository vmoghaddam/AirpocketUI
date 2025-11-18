'use strict';
app.controller('schedulinggridController', ['$scope', '$location', '$routeParams', '$rootScope', '$timeout', '$compile', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', 'schedulingService', function ($scope, $location, $routeParams, $rootScope, $timeout, $compile, flightService, weatherService, aircraftService, authService, notificationService, $route, $window, schedulingService) {
    $scope.bound = false;
    
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

    $scope.dt_from = new Date();//new Date(2021,11,1).addDays(0);
    $scope.dt_to = new Date($scope.dt_from).addDays(14);

    $scope.rank = 'Cockpit';
    if ($scope.IsCabin && !$scope.IsCockpit)
        $scope.rank = 'Cabin';
    $scope.rank = 'All';
    $scope.sb_rank = {
        placeholder: 'Rank',
        showClearButton: false,
        searchEnabled: false,
        readOnly:true, //!($scope.IsCabin && $scope.IsCockpit),
        dataSource: ['Cockpit', 'Cabin','All'], //['IP,P1', 'P2', 'TRE', 'TRI', 'P1', 'ISCCM,SCCM', 'CCM', 'ISCCM', 'SCCM'],

        onSelectionChanged: function (arg) {

        },

        bindingOptions: {
            value: 'rank',


        }
    };

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

    $scope.IsCabin = true;
    $scope.IsCockpit = true;

    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        // validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {
            $scope.buildGrid();
            $scope.bind();
            //$scope.bindDutyTimeLine(function () {
            //    $scope.createGantt();
            //    // $scope.initSelection();




            //    if ($(window).width() > $(window).height()) {
            //        //height: calc(100% - 300px);
            //        //$scope.footerfilter = false;
            //        $('.gantt-main-container').height($(window).height() - $scope.bottom);//.css('height', 'calc(100% - 40px)');
            //    }
            //});

        }

    };
    $scope.btn_x = {
        text: 'x',
        type: 'success',
        icon: 'search',
        width: 120,
        // validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {
            //$compile($(".cell-duty").contents())($scope);
            $scope.dg_main_instance.repaint();
        }

    };

    $scope.fillCrew = function (callback) {


        var _dt = moment($scope.dt_from).format('YYYY-MM-DDTHH:mm:ss');

        
        $scope.loadingVisible = true;
       // schedulingService.getCrewForRosterByDateNew(1, _dt).then(function (response) {
        var _code = '';
        flightService.getCrewForRosterByDateNewGroup(_code, _dt).then(function (response) {

            $scope.loadingVisible = false;

            $scope.ds_crew = response;
            
            if ($scope.IsCabin && $scope.IsCockpit) {
                $scope.ds_crew_roster = Enumerable.From($scope.ds_crew).ToArray();
            }
            if ($scope.IsCockpit) {
                $scope.ds_crew_roster = Enumerable.From($scope.ds_crew).Where('$.JobGroupCode.startsWith("00101")').ToArray();
            }
            if ($scope.IsCabin) {
                $scope.ds_crew_roster = Enumerable.From($scope.ds_crew).Where('$.JobGroupCode.startsWith("00102")').ToArray();
            }
            
            //$scope.updateFlightsDsInit();
            $.each($scope.ds_crew, function (_i, crw) {
                crw._OrderIndex = $scope.getCrewOrderIndex(crw.JobGroup);
                //var _cflts = $scope.getCrewFlightsObj(crw.Id);
                var _cfltsSum = 0;//Enumerable.From(_cflts).Sum('$.FlightTime');


                crw.isFtl = false;
                crw.CurrentFlightsTime = _cfltsSum;

                crw.RosterFlights = crw.Flight28 + _cfltsSum;
                crw.RosterFlightsStr = $scope.formatMinutes(crw.RosterFlights);



            });




            $scope.crewDuties = [];

            if (callback) {
                callback();
            }


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.getCrewOrderIndex = function (g) {
        switch (g) {
            case 'TRE':
                return 1;
            case 'TRI':
                return 2;
            case 'P1':
                return 3;
            case 'P2':
                return 4;
            case 'ISCCM':
                return 5;
            case 'SCCM':
                return 6;
            case 'CCM':
                return 7;
            default:
                return 1000;
        }
    };

    $scope.createMainDs = function () {
        var ds = [];
        //ds.push({
        //    ScheduleName: 'DOOLZADEH',
        //    day20220728: "<div>THR-MHD</div><div>MHD-THR</div>",


        //});
       

        $scope.dg_main_ds = $scope.ds_crew;
    };
    $scope.splitRoute = function (route) {
        try{
            var prts = route.split('-');
            var outs = [];
            var c = 0;
            $.each(prts, function (_i, _d) {
                if (_i < prts.length - 1) {
                    outs.push("<div class='f12'>"+ prts[_i] + '-' + prts[_i + 1]+"</div>");
                }
            })
            return outs.join('');
        }
        catch (ee) {

            return route;
        }

    }
    $scope.getDutyTemplate = function (x) {
        

        switch (x.DutyType) {
            case 1165:
                var str = "<div class='cell-duty cell-fdp'>"
                    + "<div class='f12'>" + $scope.splitRoute( x.InitRoute)+"</div>"
                   // + "<div class='f12'>" + x.InitNo.split('_').join(',') + "</div>"
                   // + "<div class='f12'>" + x.InitRoute + "</div>"
                   // + "<div class='f12'>" + moment(new Date(x.StartLocal)).format('HHmm') + " " + moment(new Date(x.EndLocal)).format('HHmm') + " " + moment(new Date(x.RestToLocal)).format('HHmm') + "</div>"
                    +"</div>";
                return str;
            case 1167:
                var str = "<div class='cell-duty cell-" + x.DutyType + "'>"
                    + "<div class='f12'>" + x.DutyTypeTitle + "<span style='display:inline-block;margin-left:5px;'><i ng-click='removeDutyCal(" + x.Id + "," + x.CrewId + ")' class='fa fa-minus-circle'></i></span></div>"

                   // + "<div class='f12'>" + moment(new Date(x.StartLocal)).format('HHmm') + " " + moment(new Date(x.EndLocal)).format('HHmm') + "</div>"
                    + "</div>";
                return str;
            case 1168:
                var str = "<div class='cell-duty cell-" + x.DutyType + "'>"+ "<table style='width:100%'>"
                    + "<tr>"
                    + "<td>"
                    + "<div class='f12'>" + x.DutyTypeTitle + "</div>"
                    + "<div class='f12'>" + moment(new Date(x.StartLocal)).format('HHmm') + " " + moment(new Date(x.EndLocal)).format('HHmm') + "</div>"
                    + "</td>"
                    + "<td style='width:20%;text-align:center'><i ng-click='removeDutyCal("+x.Id+","+x.CrewId+")' class='fa fa-minus-circle'></i></td>"
                    + "</tr>"

                    + "</table>" + "</div>";
                  var str1 = "<div class='cell-duty cell-" + x.DutyType + "'>"
                      + "<div class='f12'>" + x.DutyTypeTitle + "<span style='display:inline-block;margin-left:5px;'><i ng-click='removeDutyCal(" + x.Id + "," + x.CrewId +")' class='fa fa-minus-circle'></i></span></div>"

                    //+ "<div class='f12'>" + moment(new Date(x.StartLocal)).format('HHmm') + " " + moment(new Date(x.EndLocal)).format('HHmm')  + "</div>"
                    + "</div>";
                return str1;
            case 1170:
                var str = "<div class='cell-duty cell-" + x.DutyType + "'>"
                    + "<div class='f12'>" + x.DutyTypeTitle + "</div>"

                    //+ "<div class='f12'>" + moment(new Date(x.StartLocal)).format('HHmm') + " " + moment(new Date(x.EndLocal)).format('HHmm') + "</div>"
                    + "</div>";
                return str;
            case 5000:
                case 5001:
                var str = "<div class='cell-duty cell-" + x.DutyType + " duty-" + x.DutyType + "'>"
                    + "<div class='f12'>" + x.DutyTypeTitle + "</div>"

                   // + "<div class='f12'>" + moment(new Date(x.StartLocal)).format('HHmm') + " " + moment(new Date(x.EndLocal)).format('HHmm') + "</div>"
                    + "</div>";
                return str;

            default:
                var str = "<div class='cell-duty cell-" + x.DutyType + " duty-" + x.DutyType+"' >"
                    + "<div class='f12'>" + x.DutyTypeTitle + "<span style='display:inline-block;margin-left:5px;'><i ng-click='removeDutyCal(" + x.Id + "," + x.CrewId + ")' class='fa fa-minus-circle'></i></span></div>"

                   // + "<div class='f12'>" + moment(new Date(x.StartLocal)).format('HHmm') + " " + moment(new Date(x.EndLocal)).format('HHmm') + "</div>"
                    + "</div>";
                return str;
                
        }
    };
    $scope.bindDutiesTimeLine = function () {
        var _df = moment($scope.dt_from).format('YYYY-MM-DD');
        var _dt = moment($scope.dt_to).format('YYYY-MM-DD');
        flightService.getAssignGrid(_df, _dt ).then(function (response) {
           console.log(response);
            $scope.timeline_data = response;
            $.each($scope.ds_crew, function (_i, _d) {
                for (var key in _d) {
                    if (key.startsWith('day'))
                        _d[key] = '';
                }
                _d._duties = Enumerable.From(response.duties).Where('$.CrewId==' + _d.Id).ToArray();
                $.each(_d._duties, function (_j, _x) {
                    var start = new Date(_x.StartLocal);
                    var end = new Date(_x.EndLocal);
                    if (_x.DutyType == 1165)
                        end = start;
                    var seconds = end.getSeconds();
                    var minutes = end.getMinutes();
                    var hour = end.getHours();
                    if (seconds == 0 && minutes == 0 && hour == 0)
                        end = start;
                    var stdate = start;
                   


                    ////////////////////
                    while (Number(moment(stdate).format('YYYYMMDD')) <= Number(moment(end).format('YYYYMMDD'))) {
                        var cid = 'day' + moment(stdate).format('YYYYMMDD');
                        if (!_d[cid])
                            _d[cid] = "";

                        _d[cid] += $scope.getDutyTemplate(_x);
                        
                        stdate = stdate.addDays(1);
                    }
                    //////////////////////

                });
            });
            //console.log($scope.ds_crew);
           // $scope.dg_main_instance.repaint();
           
            setTimeout(function () { 
                
               
                $scope.dg_main_instance.repaint();
                $scope.$apply(function () {
                    $compile($(".cell-duty").contents())($scope);
                     
                });
            },  1000  );
        }, function (err) { });




    };
    $scope.bind = function () {
        if ($scope.bound) {
            $scope.bindDutiesTimeLine();
        }
        else {
            $scope.bound = true;
            $scope.fillCrew(function () {
                $scope.createMainDs();
                $scope.bindDutiesTimeLine();
            });
        }
        
       
    };
    var bound1 = -1;
    var bound2 = -1;
    $scope.buildGrid = function () {
        var _d1 = Number(moment($scope.dt_from).format('YYYYMMDD'));
        var _d2 = Number(moment($scope.dt_to).format('YYYYMMDD'));
        if (_d1 == bound1 && _d2 == bound2)
            return;

        bound1 = _d1;
        bound2 = _d2;

        //dt_from
        var stdate = $scope.dt_from;


        $scope.dg_main_instance.beginUpdate();
        $scope.dg_main_instance.option('columns', [])
        $scope.dg_main_instance.addColumn({ dataField: 'ScheduleName', caption: 'Name', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200, fixed: true, fixedPosition: 'left', sortIndex: 1, sortOrder: 'asc'    });
        $scope.dg_main_instance.addColumn({ dataField: 'JobGroup', caption: 'Rank', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left', });
        $scope.dg_main_instance.addColumn({ dataField: '_OrderIndex', caption: 'IDX', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 50, visible:false,sortIndex:0,sortOrder:'asc' });
        //_OrderIndex
        while (Number(moment(stdate).format('YYYYMMDD')) <= Number(moment($scope.dt_to).format('YYYYMMDD'))) {
           
            var _caption = moment(stdate).format('YY-MM-DD');
            var cid = moment(stdate).format('YYYYMMDD');
            $scope.dg_main_instance.addColumn({ dataField: 'day' + cid, caption: _caption, allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, minWidth:120   });
            stdate = stdate.addDays(1);
        }
        $scope.dg_main_instance.endUpdate();

       

    };
    ////////////////////////////////////
    $scope.formatMinutes = function (mm) {


        if (!mm && mm !== 0)
            return "-";
        var sgn = "";
        if (mm < 0)
            sgn = "-";
        mm = Math.abs(Math.round(mm));
        return sgn + pad(Math.floor(mm / 60)).toString() + ':' + pad(Math.round((mm % 60))).toString();
    };
    /////////////////////////////////////
    $scope.dg_main_columns = [


    ];
    $scope.dg_main_height = $(window).height() - 130;
    $scope.dg_main_selected = null;
    $scope.dg_main_instance = null;
    $scope.dg_main_ds = [];
    $scope.dg_main = {
        wordWrapEnabled: true,
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: false,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'none' },
        selection: { mode: 'single' },
        noDataText: '',
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        width:'100%',
        height: $(window).height() - 110,
        columnAutoWidth: true,

        columns: $scope.dg_main_columns,
        onContentReady: function (e) {
            if (!$scope.dg_main_instance)
                $scope.dg_main_instance = e.component;

        },
        onSelectionChanged: function (e) {
            ////nasiri
            //var data = e.selectedRowsData[0];

            //if (!data) {
            //    $scope.dg_people_selected = null;
            //    $scope.IsUploadVisible = false;
            //}
            //else {
            //    //soos
            //    $scope.dg_people_selected = data;
            //    $scope.IsUploadVisible = $scope.IsEditable && data.CoursePeopleStatusId == 1;
            //    var tid = data.CertificateTypeId ? data.CertificateTypeId : -1;
            //    console.log('selected', data);
            //    $scope.upload_url = serviceBaseTRN + 'api/upload/certificate/' + data.Id + '/' + data.PersonId + '/' + tid + '/' + $scope.selectedCourse.Id;
            //}


        },
        onCellClick: function (e) {
            ////7-27
            //var clmn = e.column;
            //var field = clmn.dataField;
            //if (field.indexOf("Session") != -1 && field.indexOf("SessionAttendance") == -1) {
            //    var obj = { pid: e.data.PersonId, cid: $scope.selectedCourse.Id, sid: field };
            //    $scope.loadingVisible = true;
            //    trnService.saveCourseSessionPres(obj).then(function (response) {
            //        $scope.loadingVisible = false;
            //        e.data[field] = !e.data[field];

            //    }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


            //}
            //if (clmn.name == "ImgUrl" && e.data.ImgUrl)
            //    $window.open($rootScope.clientsFilesUrl + e.data.ImgUrl, '_blank');
        },
        onCellPrepared(options) {
            const fieldData = options.value;
            
            let fieldHtml = '';
            if (fieldData && options.column.dataField.startsWith('day')) {
               // console.log(options);
                //if (fieldData.diff) {
                //    options.cellElement.addClass((fieldData.diff > 0) ? 'inc' : 'dec');
                //    fieldHtml += `<div class='current-value'>${
                //        DevExpress.localization.formatNumber(fieldData.value, { type: 'currency', currency: 'USD', precision: 2 })
                //        }</div> <div class='diff'>${
                //        Math.abs(fieldData.diff).toFixed(2)
                //        }  </div>`;
                //} else {
                //    fieldHtml = fieldData.value;
                //}
                fieldHtml = options.value;
             
                options.cellElement.html(fieldHtml);
            }
        },
        onContextMenuPreparing: function (e) {
             
            if (e.target == "content") {
                $scope.selectedCrew = e.row.data;
                $scope.selectedColumnCaption = '20' + e.column.caption;
                var dts = $scope.selectedColumnCaption.split('-');
                $scope.eventDate = (new Date(dts[0], Number(dts[1]) - 1, dts[2])).setHours(0, 0, 0, 0);
                // e.items can be undefined
                if (!e.items) e.items = [];
                e.items = $scope.cellContextMenuItems;
                // Add a custom menu item
               // e.items.push({
               //     text: "Log Column Caption",
                //    onItemClick: function () {
               //         console.log(e.column.caption);
               //     }
               // });


               // e.items.push({  text: 'STBY AM', onItemClick: $scope.assign1168, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1168' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>STBY AM</td></tr></table>", });


            }
        },
        bindingOptions: {
            dataSource: 'dg_main_ds', //'dg_employees_ds',

        }
    };
    $scope.OnlyRoster = false;
    $scope.cellContextMenuItems = [

        { visible: !$scope.OnlyRoster, text: 'STBY AM', onItemClick: function (e) { $scope.assign1168(e); }, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1168' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>STBY AM</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'STBY PM', onItemClick: function (e) { $scope.assign1167(e); }, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1167' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>STBY PM</td></tr></table>", },
        //lay
        { visible: !$scope.OnlyRoster, text: 'STBY Other Airline', onItemClick: function (e) { $scope.assign300010(e); } , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1167' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>STBY Other Airline</td></tr></table>", },
        ///////////////////



        { visible: !$scope.OnlyRoster, text: 'Day Off', onItemClick: function (e) { $scope.assign10000(e); }  , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-10000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Day Off</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Requested Off', onItemClick: function (e) { $scope.assign100008(e); }  , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-10000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Requested Off</td></tr></table>", },
        // { text: 'Assign Stan By AM', onItemClick: $scope.assign1168, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1168' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Stand By AM</td></tr></table>", },
        // { text: 'Assign Stan By PM', onItemClick: $scope.assign1167, template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1167' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Assign Stand By PM</td></tr></table>", },

        { visible: !$scope.OnlyRoster, text: 'Office', onItemClick: function (e) { $scope.assign5001(e); }  , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-5001' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Office</td></tr></table>", },
        //soltani
        { text: 'Training', onItemClick: function (e) { $scope.assign5000(e); }  , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-5000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Training</td></tr></table>", },

        { visible: !$scope.OnlyRoster, text: 'Meeting', onItemClick: function (e) { $scope.assign100001(e); }  , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100001' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Meeting</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Reserve', onItemClick: function (e) { $scope.assign1170(e); }  , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1170' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Reserve</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Vacation', onItemClick: function (e) { $scope.assign1169(e); }  , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-1169' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Vacation</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Ground', onItemClick: function (e) { $scope.assign100000(e); }  , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Ground</td></tr></table>", },

        { text: 'Simulator', onItemClick: function (e) { $scope.assign100003(e); }  , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100003' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Simulator</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Sick', onItemClick: function (e) { $scope.assign100002(e); }  , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100002' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Sick</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Expired Medical', onItemClick: function (e) { $scope.assign100005(e); }  , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100005' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Expired Medical</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Expired Licence', onItemClick: function (e) { $scope.assign100004(e); } , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100004' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Expired Licence</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Expired Passport', onItemClick: function (e) { $scope.assign100006(e); }  , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100006' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Expired Passport</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'No Flight', onItemClick: function (e) { $scope.assign100007(e); }  , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>No Flight</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Refuse', onItemClick: function (e) { $scope.assign100009(e); } , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-100000' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Refuse</td></tr></table>", },

        //2020-10-27
        { visible: !$scope.OnlyRoster, text: 'Mission', onItemClick: function (e) { $scope.assign100025(e); }  , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-5001' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Mission</td></tr></table>", },

        { visible: !$scope.OnlyRoster, text: 'Duty', onItemClick: function (e) { $scope.assign300008(e); } , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-300008' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Duty</td></tr></table>", },
        { visible: !$scope.OnlyRoster, text: 'Rest', onItemClick: function (e) { $scope.assign300009(e); } , template: "<table><tr><td style='vertical-align:middle;'><div class='duty-300009' style='width:15px;height:15px;border-radius:50%;'></div></td><td style='vertical-align:top;padding-left:5px;'>Rest</td></tr></table>", },
        ///////////////////////////////////

    ];
    $scope.selectedCrew = null;
    $scope.selectedColumnCaption = null;
    $scope.assign1168 = function (e) {
         
         
         
        $scope.event_status = 1168;
        $scope.FromDateEvent = $scope.eventDate;
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(13 * 60);
        $scope.popup_event_title = 'STBY AM';
        $scope.popup_event_visible = true;
       
    };
    $scope.assign1167 = function (e) {
        $scope.event_status = 1167;
        $scope.FromDateEvent = (new Date($scope.eventDate)).setHours(12, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes((13 * 60));
        $scope.popup_event_title = 'STBY PM';
        $scope.popup_event_visible = true;
    };
    $scope.assign10000 = function (e) {
        $scope.event_status = 10000;
        $scope.FromDateEvent = $scope.eventDate;
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes((23 * 60) + 59);
        //$scope.FromDateEvent = (new Date($scope.contextMenuCellData.startDate)).setHours(8, 0, 0, 0);
        //$scope.ToDateEvent = (new Date($scope.FromDateEvent)).addHours(12);
        $scope.popup_event_title = 'Day Off';
        $scope.popup_event_visible = true;
    };
    $scope.assign5000 = function (e) {
        $scope.event_status = 5000;
        $scope.FromDateEvent = (new Date($scope.eventDate)).setHours(8, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(4 * 60);
        $scope.popup_event_title = 'Training';
        $scope.popup_event_visible = true;
    };
    $scope.assign5001 = function (e) {
        $scope.event_status = 5001;
        $scope.FromDateEvent = (new Date($scope.eventDate)).setHours(8, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(9 * 60);
        $scope.popup_event_title = 'Office';
        $scope.popup_event_visible = true;
    };

    $scope.assign1169 = function (e) {
        $scope.event_status = 1169;
        $scope.FromDateEvent = $scope.eventDate;
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Vacation';
        $scope.popup_event_visible = true;
    };
    $scope.assign100000 = function (e) {
        $scope.event_status = 100000;
        $scope.FromDateEvent = $scope.eventDate;
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Ground';
        $scope.popup_event_visible = true;
    };
    $scope.assign100001 = function (e) {
        $scope.event_status = 100001;
        $scope.FromDateEvent = (new Date($scope.eventDate)).setHours(8, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(4 * 60);
        $scope.popup_event_title = 'Meeting';
        $scope.popup_event_visible = true;
    };

    $scope.assign100002 = function (e) {
        $scope.event_status = 100002;
        $scope.FromDateEvent = $scope.eventDate;
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Sick';
        $scope.popup_event_visible = true;
    };
    $scope.assign100003 = function (e) {
        $scope.event_status = 100003;
        $scope.FromDateEvent = (new Date($scope.eventDate)).setHours(8, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(4 * 60);
        $scope.popup_event_title = 'Simulator';
        $scope.popup_event_visible = true;
    };
    $scope.assign100004 = function (e) {
        $scope.event_status = 100004;
        $scope.FromDateEvent = (new Date($scope.eventDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Expired Licence';
        $scope.popup_event_visible = true;
    };
    $scope.assign100005 = function (e) {
        $scope.event_status = 100005;
        $scope.FromDateEvent = (new Date($scope.eventDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Expired Medical';
        $scope.popup_event_visible = true;
    };
    $scope.assign100006 = function (e) {
        $scope.event_status = 100006;
        $scope.FromDateEvent = (new Date($scope.eventDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Expired Passport';
        $scope.popup_event_visible = true;
    };
    $scope.assign100007 = function (e) {
        $scope.event_status = 100007;
        $scope.FromDateEvent = (new Date($scope.eventDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'No Flt';
        $scope.popup_event_visible = true;

    };
    $scope.assign100008 = function (e) {
        $scope.event_status = 100008;
        $scope.FromDateEvent = (new Date($scope.eventDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Requested Off';
        $scope.popup_event_visible = true;

    };
    $scope.assign100009 = function (e) {
        $scope.event_status = 100009;
        $scope.FromDateEvent = (new Date($scope.eventDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Refuse';
        $scope.popup_event_visible = true;

    };
    $scope.assign1170 = function (e) {
        $scope.event_status = 1170;
        $scope.FromDateEvent = (new Date($scope.eventDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(24 * 60);
        $scope.popup_event_title = 'Reserve';
        $scope.popup_event_visible = true;
    };
    //2020-10-27
    $scope.assign100025 = function (e) {
        $scope.event_status = 100025;
        $scope.FromDateEvent = (new Date($scope.eventDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(0 * 60);
        $scope.popup_event_title = 'Mission';
        $scope.popup_event_visible = true;
    };
    //300008
    $scope.assign300008 = function (e) {
        $scope.event_status = 300008;
        $scope.FromDateEvent = (new Date($scope.eventDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(23 * 60 + 59);
        $scope.popup_event_title = 'Duty';
        $scope.popup_event_visible = true;
    };
    //300009
    $scope.assign300009 = function (e) {
        $scope.event_status = 300009;
        $scope.FromDateEvent = (new Date($scope.eventDate)).setHours(0, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(23 * 60 + 59);
        $scope.popup_event_title = 'Rest';
        $scope.popup_event_visible = true;
    };
    //300010
    //lay
    $scope.assign300010 = function (e) {
        $scope.event_status = 300010;
        $scope.FromDateEvent = (new Date($scope.eventDate)).setHours(4, 0, 0, 0);
        $scope.ToDateEvent = (new Date($scope.FromDateEvent)).addMinutes(10 * 60);
        $scope.popup_event_title = 'Other Airline STBY';
        $scope.popup_event_visible = true;
    };



    $scope.date_from_event = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'FromDateEvent',

        }
    };
    $scope.date_to_event = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'ToDateEvent',

        }
    };
    $scope.date_from_event_hh = {
        type: "time",
        width: '100%',

        displayFormat: "HH:mm",
        interval: 15,

        bindingOptions: {
            value: 'FromDateEvent',
        }
    };
    $scope.date_to_event = {
        type: "date",
        width: '100%',

        onValueChanged: function (arg) {

        },
        bindingOptions: {
            value: 'ToDateEvent',

        }
    };
    $scope.date_to_event_hh = {
        type: "time",
        width: '100%',

        displayFormat: "HH:mm",
        interval: 15,

        bindingOptions: {
            value: 'ToDateEvent',
        }
    };
    $scope.remark_event = {
        height: 60,
        bindingOptions: {
            value: 'RemarkEvent',

        }
    };

    $scope.bl_hh = null;
    $scope.num_bl_hh = {
        min: 0,
        showSpinButtons: true,
        bindingOptions: {
            value: 'bl_hh',

        }
    };
    $scope.bl_mm = null;
    $scope.num_bl_mm = {
        min: 0,
        max: 59,
        showSpinButtons: true,
        bindingOptions: {
            value: 'bl_mm',

        }
    };
    //reposition
    $scope.ev_fx_hh = null;
    $scope.num_ev_fx_hh = {
        min: 0,
        showSpinButtons: true,
        bindingOptions: {
            value: 'ev_fx_hh',

        }
    };
    $scope.ev_fx_mm = null;
    $scope.num_ev_fx_mm = {
        min: 0,
        max: 59,
        showSpinButtons: true,
        bindingOptions: {
            value: 'ev_fx_mm',

        }
    };

    $scope.addDutyToTimeLine = function (dty) {
        $scope.selectedCrew._duties.push(dty);
        var start = new Date(dty.StartLocal);
        var end = new Date(dty.EndLocal);
        console.log('start',start);
        console.log('end', end);

        var seconds = end.getSeconds();
        var minutes = end.getMinutes();
        var hour = end.getHours();
        if (seconds == 0 && minutes == 0 && hour == 0)
            end = start;

        var stdate = start;
        while (Number(moment(stdate).format('YYYYMMDD')) <= Number(moment(end).format('YYYYMMDD'))) {
            var cid = 'day' + moment(stdate).format('YYYYMMDD');
            if (!$scope.selectedCrew[cid])
                $scope.selectedCrew[cid] = "";

            $scope.selectedCrew[cid] += $scope.getDutyTemplate(dty);

            stdate = stdate.addDays(1);
        }
        setTimeout(function () {


           // $scope.dg_main_instance.repaint();
            $scope.$apply(function () {
                $compile($(".cell-duty").contents())($scope);

            });
        }, 1000);
       
    };
    $scope.clearCrewDays = function (crew) {
        for (var key in crew) {
            if (key.startsWith('day'))
                crew[key] = '';
        }
    };
    $scope.removeDutyCal = function (id, crewId) {
        try {
            var crew = Enumerable.From($scope.ds_crew).Where('$.Id==' + crewId).FirstOrDefault();
            var duty = Enumerable.From(crew._duties).Where('$.Id==' + id).FirstOrDefault();
            var _now = moment(new Date()).format('YYYYMMDD');
            var _start = moment(new Date(duty.StartLocal)).format('YYYYMMDD');
            var _end = moment(new Date(duty.EndLocal)).format('YYYYMMDD');
            if (_start < _now) {
                var myDialog = DevExpress.ui.dialog.custom({
                    rtlEnabled: true,
                    title: "Error",
                    message: "You cannot remove the object",
                    buttons: [{ text: "OK", onClick: function () { } }]
                });
                myDialog.show();
                return;
            }

            var dto = { fdp: id };

            $scope.loadingVisible = true;
            schedulingService.saveDeleteFDP(dto).then(function (response) {
                $scope.loadingVisible = false;
                $scope.clearCrewDays(crew);
                crew._duties = Enumerable.From(crew._duties).Where('$.Id!=' + id).ToArray();
                var _startDuties = Enumerable.From(crew._duties)
                    //.Where(function (x) { return moment(new Date(x.StartLocal)).format('YYYYMMDD') == _start; })
                    .ToArray();
                crew['day' + _start] = '';
                $.each(_startDuties, function (_j, _x) {
                    var start = new Date(_x.StartLocal);
                    var end = new Date(_x.EndLocal);
                    var seconds = end.getSeconds();
                    var minutes = end.getMinutes();
                    var hour = end.getHours();
                    if (seconds == 0 && minutes == 0 && hour == 0)
                        end = start;

                    var stdate = start;

                    ////////////////////
                    while (Number(moment(stdate).format('YYYYMMDD')) <= Number(moment(end).format('YYYYMMDD'))) {
                        var cid = 'day' + moment(stdate).format('YYYYMMDD');
                        if (!crew[cid])
                            crew[cid] = "";

                        crew[cid] += $scope.getDutyTemplate(_x);

                        stdate = stdate.addDays(1);
                    }
                    //////////////////////

                });
            //$scope.$apply(function () {
            //    $scope.dg_main_instance.repaint();

            //});

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


           
        }
        catch (e) {
            alert(e);
        }
        //General.Confirm('Are you sure?', function (res) {
        //    if (res) {
              
               
               
        //    }
        //});



        //console.log(duty);
    };

    function getEventTitle(id) {
        switch (id) {
            case 100000:
                return "Ground";
            case 100001:
                return "Meeting";
            case 100002:
                return "Sick";
            case 100003:
                return "Simulator";
            case 100004:
                return "Expired Licence";
            case 100005:
                return "Expired Medical";
            case 100006:
                return "Expired Passport";
            case 100007:
                return "No Flight";
            case 100008:
                return "Requested Off";
            case 100009:
                return "Refuse";
            case 1169:
                return "Vacation";
            case 1170:
                return "Reserve";
            //2020-10-27
            case 100025:
                return "Mission";
            case 300008:
                return "Duty";
            case 300009:
                return "Rest";
            //lay
            case 300010:
                return "Other Airline STBY";
            default:
                return "-";
        }
    }
    $scope.createEvent = function (_crew, _type, _typeTitle, eventFrom, eventEnd, remark) {
        //if ([300007, 300010].indexOf(_type) == -1 && new Date(eventFrom) < $scope.firstHour && !$scope.isAdmin) {

        //    var myDialog = DevExpress.ui.dialog.custom({
        //        rtlEnabled: true,
        //        title: "Error",
        //        message: "You cannot modify crew list due to FLIGHT STATUS.Please contact the administrator.",
        //        buttons: [{ text: "OK", onClick: function () { } }]
        //    });
        //    myDialog.show();
        //    return;
        //}
        var crewid = _crew.Id; //_crew.data.Id;
        var crew = _crew; //_crew.data;
        if (!_typeTitle)
            _typeTitle = getEventTitle(_type);

        //$scope.dg_crew_stby_ds = Enumerable.From($scope.dg_crew_stby_ds).Where('$.Id!=' + crewid).ToArray();
        $scope._eventId = $scope._eventId - 1;
        var offset = 1 * (new Date()).getTimezoneOffset();
        var stby = {
            Id: $scope._eventId, //-($scope.crewDuties.length + 1),
            type: 0,
            JobGroup: crew.JobGroup,
            GroupId: crew.GroupId,
            ScheduleName: crew.ScheduleName,
            //Duty: 180,
        };
        stby.crewId = crewid;
        stby.isPrePost = false;
        stby.LastLocationId = crew.LastLocationId;
        stby.LastLocation = crew.LastLocation;
        stby.FirstLocationId = crew.LastLocationId;
        stby.FirstLocation = crew.LastLocation;
        stby.day = new Date(eventFrom);
        stby.DutyStartLocal = new Date(eventFrom);
        stby.Remark = remark;
        stby.DutyEndLocal = new Date(eventEnd);
        stby.dutyType = _type;
        stby.dutyTypeTitle = _typeTitle;


        stby.DutyStart = (new Date(stby.DutyStartLocal)).addMinutes(offset);
        stby.DutyEnd = (new Date(stby.DutyEndLocal)).addMinutes(offset);
        if (_type != 10000 && _type != 1169 && _type != 100000 && _type != 100001 && _type != 100002 && _type != 100004 && _type != 100005 && _type != 100006 && _type != 100007 && _type != 100008 && _type != 100009
            //2020-10-27
            && _type != 100025
        ) {
            stby.RestToLocal = (new Date(stby.DutyEndLocal)).addMinutes(12 * 60);
            stby.RestTo = (new Date(stby.RestToLocal)).addMinutes(offset);
        }
        else {
            stby.RestToLocal = stby.DutyEndLocal;
            stby.RestTo = stby.DutyEnd;
        }
        var diff = Math.abs(new Date(eventEnd) - new Date(eventFrom));
        stby.Duty = Math.floor((diff / 1000) / 60);

        stby.flights = null;
        stby.IsOver = false;

        return stby;

    };
    $scope.IsEventOverLapped = function (event) {
        //4-20
        var f;
        if (event.dutyType == 10000) {
            f = Enumerable.From($scope.cal_crew_ds).Where(function (x) {

                var _until = x.EndUTC;
                return (new Date(event.DutyStart) >= new Date(x.StartUTC) && new Date(event.DutyStart) <= new Date(_until))
                    ||
                    (new Date(event.RestTo) >= new Date(x.StartUTC) && new Date(event.RestTo) <= new Date(_until))
                    ||
                    (new Date(x.StartUTC) >= new Date(event.DutyStart) && new Date(x.StartUTC) <= new Date(event.RestUntil))

            }).FirstOrDefault();
        }
        else {
            f = Enumerable.From($scope.cal_crew_ds).Where(function (x) {
                //EndUTC
                var _until = x.RestUntil;
                if (!_until)
                    _until = x.EndUTC;
                return (new Date(event.DutyStart) >= new Date(x.StartUTC) && new Date(event.DutyStart) <= new Date(_until))
                    ||
                    (new Date(event.RestTo) >= new Date(x.StartUTC) && new Date(event.RestTo) <= new Date(_until))
                    ||
                    (new Date(x.StartUTC) >= new Date(event.DutyStart) && new Date(x.StartUTC) <= new Date(event.RestUntil))

            }).FirstOrDefault();
        }

        console.log('IsEventOverLapped-------------------------------------');
        console.log(event);
        console.log($scope.cal_crew_ds);
        console.log('---------------');
        console.log(f);
        console.log('IsEventOverLapped-------------------------------------');
        if (f)
            return true;
        return false;
    };
    $scope.saveNewDutyCal = function (crewid, callback) {
        var dto = {
            DateStart: new Date($scope.FromDateEvent),
            DateEnd: new Date($scope.ToDateEvent),
            CityId: -1,
            CrewId: crewid,
            DutyType: $scope.event_status,
            Remark: $scope.RemarkEvent

        }
        dto.BL = 0;
        dto.FX = 0;
        if ($scope.event_status == 100025) {
            var _blmm = ($scope.bl_hh ? $scope.bl_hh : 0) * 60 + $scope.bl_mm;
            dto.BL = _blmm;

            var _fxmm = ($scope.ev_fx_hh ? $scope.ev_fx_hh : 0) * 60 + $scope.ev_fx_mm;
            dto.FX = _fxmm;

        }
        $scope.loadingVisible = true;

        schedulingService.saveDuty(dto).then(function (response) {
            $scope.loadingVisible = false;
            response.dutyTypeTitle = response.DutyTypeTitle;
            response.dutyType = response.DutyType;
            // $scope.cal_crew_ds.push(response);
           
            // $scope.cal_crew_instance.repaint();
            $scope.bl_hh = null;
            $scope.bl_mm = null;
            //reposition
            $scope.ev_fx_hh = null;
            $scope.ev_fx_mm = null;

            flightService.getDutyTimeLineById(response.Id).then(function (response2) {
                console.log('new duty', response2);
                $scope.addDutyToTimeLine(response2);
                callback(response);
                //setTimeout(function () {
                //    $scope.dg_main_instance.repaint();
                //}, 500);
            }, function (err) { });
           
           



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.popup_event = {
        width: 350,
        height: 460,
        //position: 'left top',
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,
        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Ok', icon: 'check', validationGroup: 'eventadd2', onClick: function (arg) {

                        // console.log($scope.data);
                        //return;
                        var result = arg.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var crewid = $scope.selectedCrew.Id;
                        $scope.dg_calcrew_selected = $scope.selectedCrew;

                        var eventFrom = new Date($scope.FromDateEvent);
                        var eventEnd = new Date($scope.ToDateEvent);
                        //var rosterFrom = new Date(General.getDayFirstHour(new Date($scope.dt_fromSearched)));
                        //getDayLastHour
                        //var rosterTo = new Date(getMidNight(new Date($scope.dt_toSearched)));
                        //////////////////////////////
                        if ($scope.event_status == 10000) {
                            //nool

                            //  alert(crewid);
                            var _event = $scope.createEvent($scope.selectedCrew, 10000, 'RERRP', eventFrom, eventEnd, $scope.RemarkEvent);
                            var check = $scope.IsEventOverLapped(_event);
                            if (check) {
                                General.ShowNotify('Overlapped Duties Found', 'error');
                                return;
                            }
                            else {
                                $scope.saveNewDutyCal($scope.selectedCrew.Id, function () { $scope.popup_event_visible = false; });


                            }


                        }
                        ///////////////////////////////////
                        //if ($scope.event_status == 5000 || $scope.event_status == 5001) {
                        //    if ((eventFrom >= rosterFrom && eventFrom <= rosterTo) || (eventEnd >= rosterFrom && eventEnd <= rosterTo)) {
                        //        // alert(crewid);

                        //        var _event = $scope.createEvent($scope.dg_calcrew_selected, $scope.event_status, ($scope.event_status==5000?'Training':'Office'), eventFrom, eventEnd);
                        //        var check = $scope.IsEventOverLapped(_event);
                        //        if (check) {
                        //            General.ShowNotify('Overlapped Duties Found', 'error');
                        //            return;
                        //        }
                        //        else
                        //        {
                        //            $scope.cal_crew_ds.push(_event);
                        //            $scope.cal_crew_instance.repaint();
                        //            $scope.crewDuties.push(_event);
                        //            console.log('event duties');
                        //            console.log($scope.crewDuties);
                        //            $scope.popup_event_visible = false;
                        //        }


                        //    }


                        //}
                        else if ($scope.event_status == 5000 || $scope.event_status == 5001
                            || $scope.event_status == 100001 || $scope.event_status == 100003 || $scope.event_status == 1170 || $scope.event_status == 1167
                            || $scope.event_status == 1168
                        ) {
                            //nool


                            var _event = $scope.createEvent($scope.dg_calcrew_selected, $scope.event_status, null, eventFrom, eventEnd, $scope.RemarkEvent);
                            var check = $scope.IsEventOverLapped(_event);
                            if (check) {
                                General.ShowNotify('Overlapped Duties Found', 'error');
                                return;
                            }
                            else {

                                $scope.saveNewDutyCal($scope.dg_calcrew_selected.Id, function () { $scope.popup_event_visible = false; });


                            }


                        }
                        //2020-10-27
                        else if ($scope.event_status == 100025) {
                            $scope.saveNewDutyCal($scope.dg_calcrew_selected.Id, function () { $scope.popup_event_visible = false; });
                        }
                        //dlutopol
                        else {
                            //nool


                            var _event = $scope.createEvent($scope.dg_calcrew_selected, $scope.event_status, null, eventFrom, eventEnd, $scope.RemarkEvent);
                            var check = false; //$scope.IsEventOverLapped(_event);
                            if (check) {
                                General.ShowNotify('Overlapped Duties Found', 'error');
                                return;
                            }
                            else {

                                $scope.saveNewDutyCal($scope.dg_calcrew_selected.Id, function () { $scope.popup_event_visible = false; });

                            }


                        }

                        //////////////////////////////

                    }
                }, toolbar: 'bottom'
            },

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,

        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {

        },
        onHiding: function () {
            $scope.ToDateEvent = null;
            $scope.FromDateEvent = null;
            $scope.event_status = null;
            $scope.RemarkEvent = null;

        },
        bindingOptions: {
            visible: 'popup_event_visible',
            //width: 'pop_width',
            //height: 'pop_height',
            title: 'popup_event_title',

        }
    };
    ////////////////////////////////////


    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }

    var appWindow = angular.element($window);

    appWindow.bind('resize', function () {
        return;
        if ($(window).width() > $(window).height()) {
            $scope.$apply(function () {
                $scope.footerfilter = false;
                $scope.IsLandscape = true;

            });

            $('.gantt-main-container').height($(window).height() - 85);


        } else {
            // alert('x');
            $scope.$apply(function () {

                $scope.footerfilter = true;
                $scope.IsLandscape = false;

            });
            $('.gantt-main-container').height($(window).height() - 205);
        }

    });




    //////////////////////////
    $scope.$on('$viewContentLoaded', function () {

        $('.schgrid').fadeIn(400, function () {
        //    ////////////////////////////////
        //    setTimeout(function () {
        //        //$scope.bindFlights(function () {

        //        //    $scope.createGantt();
        //        //    $scope.initSelection();




        //        //    if ($(window).width() > $(window).height()) {
        //        //        //height: calc(100% - 300px);
        //        //        //$scope.footerfilter = false;
        //        //        $('.gantt-main-container').height($(window).height() - $scope.bottom);//.css('height', 'calc(100% - 40px)');
        //        //    }
        //        //    //else {
        //        //    //    $scope.footerfilter = true;
        //        //    //    $('.gantt-main-container').height($(window).height() - 205);
        //        //    //}
        //        //});




        //    }, 2000);








           ///////////////////////////////////
        });


    });
    //////////////////////////////////////

}]);