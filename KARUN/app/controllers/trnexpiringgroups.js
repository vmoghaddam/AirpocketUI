'use strict';
app.controller('trnexpiringGroupController', ['$scope', '$location', '$routeParams', '$rootScope', 'courseService', 'authService', 'trnService', function ($scope, $location, $routeParams, $rootScope, courseService, authService, trnService) {
    $scope.prms = $routeParams.prms;


    $scope.getMainStyle = function () {
        var h = $(window).height() - 110;
        return {
            height:h+'px'
        }
    }
    $scope.momentDay = function (date) {
        if (!date)
            return '-';
        return moment(date).format('DD (dd)');
    };
    $scope.momentDate = function (date) {
        if (!date)
            return '-';
        return moment(date).format('YYYY-MMM-DD');
    };
    $scope.selected_l1 = null;
    $scope.get_l1_style = function (g) {
        
        if (!$scope.selected_l1)
            return {};
        if ($scope.selected_l1.GroupId == g.GroupId)
            return {
                background: '#ddd',
                fontWeight:'bold',
            };
        return {};

    };
    $scope.back_root = function () {
        $scope.selected_l1 = null;
    }
    $scope.back_l1 = function () {
        $scope.selected_l2 = null;
    }
    $scope.back_l2 = function () {
        $scope.selected_l3 = null;
    }
    $scope.back_l3 = function () {
        $scope.selected_l4 = null;
    }
    $scope.back_l4 = function () {
        $scope.selected_l5 = null;
    }
    $scope.group_l1_click = function (g) {
        var old = $scope.selected_l1 ? $scope.selected_l1.GroupId : -1;
        $scope.selected_l1 = g;
        if ($scope.selected_l1.GroupId != old) {
            $scope.selected_l2 = null;
            $scope.selected_l3 = null;
            $scope.selected_l4 = null;
            $scope.selected_l5 = null;

            $scope.ds_barchart_expiring_l2 = [];
            $scope.barchart_l2_expiring_series = [];
            $scope.ds_barchart_expired_l2 = [];
            $scope.barchart_l2_expired_series = [];

            $scope.ds_barchart_expiring_l3 = [];
            $scope.barchart_l3_expiring_series = [];
            $scope.ds_barchart_expired_l3 = [];
            $scope.barchart_l3_expired_series = [];

            $scope.ds_barchart_expiring_l4 = [];
            $scope.barchart_l4_expiring_series = [];
            $scope.ds_barchart_expired_l4 = [];
            $scope.barchart_l4_expired_series = [];

            $scope.ds_barchart_expiring_l5 = [];
            $scope.barchart_l5_expiring_series = [];
            $scope.ds_barchart_expired_l5 = [];
            $scope.barchart_l5_expired_series = [];

            $scope.ds_employees_l2 = [];
            $scope.ds_employees_l3 = [];
            $scope.ds_employees_l4 = [];
            $scope.ds_employees_l5 = [];

            //expiring   ////////////////////////////////////////////////////
 
            var expiring = Enumerable.From($scope.ds_employees).Where('$.IsExpiring==1 && ($.L2Code.startsWith("' + $scope.selected_l1.GroupCode + '") || $.JobGroupCode2=="' + $scope.selected_l1.GroupCode + '")').ToArray();

            var grouped = Enumerable.From(expiring)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.CertificateType + '_' + (item.L2Title != '-' ? item.L2Title : item.JobGroup) + '_' + (item.L2Code != '-' ? item.L2Code : item.JobGroupCode2); }, null, (key, g) => {

                    return {
                        Type: key.split('_')[0],
                        Group: key.split('_')[1],
                        GroupCode: key.split('_')[2],
                        Count: g.source.length

                    }
                }).ToArray();



            var jobgroups = Enumerable.From(grouped).Select('$.Group').Distinct().ToArray();

            var grouped2 = Enumerable.From(grouped)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.Type; }, null, (key, g) => {
                    return {
                        Type: key.split('_')[0],

                        Items: g.source

                    }
                }).ToArray();


            $scope.ds_barchart_expiring_l2 = [];
            $scope.barchart_l2_expiring_series = [];
            $.each(jobgroups, function (_j, _e) {
                var series = {

                    valueField: _e,
                    name: _e,
                    showInLegend: true,
                    //color: $rootScope.getColorFromSet2(c),
                };
                $scope.barchart_l2_expiring_series.push(series);
            });
            $.each(grouped2, function (_i, _d) {
                var row = { Type: _d.Type };
                $.each(jobgroups, function (_j, _e) {
                    var cer = Enumerable.From(_d.Items).Where('$.Group=="' + _e + '"').FirstOrDefault();
                    row[_e] = cer ? cer.Count : null;

                });

                $scope.ds_barchart_expiring_l2.push(row);
            });
            /////Expired ///////////////////
             var expired = Enumerable.From($scope.ds_employees).Where('$.IsExpired==1 && ($.L2Code.startsWith("' + $scope.selected_l1.GroupCode + '") || $.JobGroupCode2=="' + $scope.selected_l1.GroupCode + '")').ToArray();

            var grouped_expired = Enumerable.From(expired)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                      .GroupBy(function (item) { return item.CertificateType + '_' + (item.L2Title != '-' ? item.L2Title : item.JobGroup) + '_' + (item.L2Code != '-' ? item.L2Code : item.JobGroupCode2); }, null, (key, g) => {

                    return {
                        Type: key.split('_')[0],
                        Group: key.split('_')[1],
                        GroupCode: key.split('_')[2],
                        Count: g.source.length

                    }
                }).ToArray();



            var jobgroups_expired = Enumerable.From(grouped_expired).Select('$.Group').Distinct().ToArray();

            var grouped2_expired = Enumerable.From(grouped_expired)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.Type; }, null, (key, g) => {
                    return {
                        Type: key.split('_')[0],

                        Items: g.source

                    }
                }).ToArray();


            $scope.ds_barchart_expired_l2 = [];
            $scope.barchart_l2_expired_series = [];
            $.each(jobgroups_expired, function (_j, _e) {
                var series = {

                    valueField: _e,
                    name: _e,
                    showInLegend: true,
                    //color: $rootScope.getColorFromSet2(c),
                };
                $scope.barchart_l2_expired_series.push(series);
            });
            $.each(grouped2_expired, function (_i, _d) {
                var row = { Type: _d.Type };
                $.each(jobgroups_expired, function (_j, _e) {
                    var cer = Enumerable.From(_d.Items).Where('$.Group=="' + _e + '"').FirstOrDefault();
                    row[_e] = cer ? cer.Count : null;

                });

                $scope.ds_barchart_expired_l2.push(row);
            });
            
            ////////////////////////////////
            var employees = Enumerable.From($scope.ds_employees)
              
                .Where('($.IsExpired==1 || $.IsExpiring==1) && ($.L2Code.startsWith("' + $scope.selected_l1.GroupCode + '") || $.JobGroupCode2=="' + $scope.selected_l1.GroupCode + '")')

                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { console.log(item.L1Title); return item.PersonId + '_' + item.Name + '_' + item.NID + '_' + item.L1Title + '_' + item.JobGroup; }, null, (key, g) => {
                    return {
                        PersonId: key.split('_')[0],
                        Name: key.split('_')[1],
                        NID: key.split('_')[2],
                        RootGroup: key.split('_')[3],
                        Group: key.split('_')[4],
                        Expired: Enumerable.From(g.source).Where('$.IsExpired==1').ToArray().length,
                        Expiring: Enumerable.From(g.source).Where('$.IsExpiring==1').ToArray().length,

                        Items: g.source

                    }
                }).ToArray();
            $scope.ds_employees_l2 = employees;

            

            ///////////////////////////////


        }

    };
    /////////////////////////////
    $scope.selected_l2 = null;
    $scope.get_l2_style = function (g) {

        if (!$scope.selected_l2)
            return {};
        if ($scope.selected_l2.GroupId == g.GroupId)
            return {
                background: '#ddd',
                fontWeight: 'bold',
            };
        return {};

    };

    $scope.group_l2_click = function (g) {
        var old = $scope.selected_l2 ? $scope.selected_l2.GroupId : -1;
        $scope.selected_l2 = g;
        if ($scope.selected_l2.GroupId != old) {
            
            $scope.selected_l3 = null;
            $scope.selected_l4 = null;
            $scope.selected_l5 = null;

            $scope.ds_barchart_expiring_l3 = [];
            $scope.barchart_l3_expiring_series = [];
            $scope.ds_barchart_expired_l3 = [];
            $scope.barchart_l3_expired_series = [];

            $scope.ds_barchart_expiring_l4 = [];
            $scope.barchart_l4_expiring_series = [];
            $scope.ds_barchart_expired_l4 = [];
            $scope.barchart_l4_expired_series = [];

            $scope.ds_barchart_expiring_l5 = [];
            $scope.barchart_l5_expiring_series = [];
            $scope.ds_barchart_expired_l5 = [];
            $scope.barchart_l5_expired_series = [];

            $scope.ds_employees_l3 = [];
            $scope.ds_employees_l4 = [];
            $scope.ds_employees_l5 = [];

            //expiring   ////////////////////////////////////////////////////
 
            var expiring = Enumerable.From($scope.ds_employees).Where('$.IsExpiring==1 && ($.L3Code.startsWith("' + $scope.selected_l2.GroupCode + '") || $.JobGroupCode2=="' + $scope.selected_l2.GroupCode + '")').ToArray();

            var grouped = Enumerable.From(expiring)
                //.GroupBy("$.ArgNum", null, (key, g) => {
 
                    .GroupBy(function (item) { return item.CertificateType + '_' + (item.L3Title != '-' ? item.L3Title : item.JobGroup) + '_' + (item.L3Code != '-' ? item.L3Code : item.JobGroupCode2); }, null, (key, g) => {

                    return {
                        Type: key.split('_')[0],
                        Group: key.split('_')[1],
                        GroupCode: key.split('_')[2],
                        Count: g.source.length

                    }
                }).ToArray();



            var jobgroups = Enumerable.From(grouped).Select('$.Group').Distinct().ToArray();

            var grouped2 = Enumerable.From(grouped)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.Type; }, null, (key, g) => {
                    return {
                        Type: key.split('_')[0],

                        Items: g.source

                    }
                }).ToArray();


            $scope.ds_barchart_expiring_l3 = [];
            $scope.barchart_l3_expiring_series = [];
            $.each(jobgroups, function (_j, _e) {
                var series = {

                    valueField: _e,
                    name: _e,
                    showInLegend: true,
                    //color: $rootScope.getColorFromSet2(c),
                };
                $scope.barchart_l3_expiring_series.push(series);
            });
            $.each(grouped2, function (_i, _d) {
                var row = { Type: _d.Type };
                $.each(jobgroups, function (_j, _e) {
                    var cer = Enumerable.From(_d.Items).Where('$.Group=="' + _e + '"').FirstOrDefault();
                    row[_e] = cer ? cer.Count : null;

                });

                $scope.ds_barchart_expiring_l3.push(row);
            });
            /////Expired ///////////////////
             var expired = Enumerable.From($scope.ds_employees).Where('$.IsExpired==1 && ($.L3Code.startsWith("' + $scope.selected_l2.GroupCode + '") || $.JobGroupCode2=="' + $scope.selected_l2.GroupCode + '")').ToArray();

            var grouped_expired = Enumerable.From(expired)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.CertificateType + '_' + (item.L3Title != '-' ? item.L3Title : item.JobGroup) + '_' + (item.L3Code != '-' ? item.L3Code : item.JobGroupCode2); }, null, (key, g) => {

                    return {
                        Type: key.split('_')[0],
                        Group: key.split('_')[1],
                        GroupCode: key.split('_')[2],
                        Count: g.source.length

                    }
                }).ToArray();



            var jobgroups_expired = Enumerable.From(grouped_expired).Select('$.Group').Distinct().ToArray();

            var grouped2_expired = Enumerable.From(grouped_expired)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.Type; }, null, (key, g) => {
                    return {
                        Type: key.split('_')[0],

                        Items: g.source

                    }
                }).ToArray();


            $scope.ds_barchart_expired_l3 = [];
            $scope.barchart_l3_expired_series = [];
            $.each(jobgroups_expired, function (_j, _e) {
                var series = {

                    valueField: _e,
                    name: _e,
                    showInLegend: true,
                    //color: $rootScope.getColorFromSet2(c),
                };
                $scope.barchart_l3_expired_series.push(series);
            });
            $.each(grouped2_expired, function (_i, _d) {
                var row = { Type: _d.Type };
                $.each(jobgroups_expired, function (_j, _e) {
                    var cer = Enumerable.From(_d.Items).Where('$.Group=="' + _e + '"').FirstOrDefault();
                    row[_e] = cer ? cer.Count : null;

                });

                $scope.ds_barchart_expired_l3.push(row);
            });
            ////////////////////////////////
            var employees = Enumerable.From($scope.ds_employees)
               // .Where('$.IsExpired==1 && $.L3Code.startsWith("' + $scope.selected_l2.GroupCode + '")')
                .Where('($.IsExpired==1 || $.IsExpiring==1) && ($.L3Code.startsWith("' + $scope.selected_l2.GroupCode + '") || $.JobGroupCode2=="' + $scope.selected_l2.GroupCode + '")')

                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) {   return item.PersonId + '_' + item.Name + '_' + item.NID + '_' + item.L1Title + '_' + item.JobGroup; }, null, (key, g) => {
                    return {
                        PersonId: key.split('_')[0],
                        Name: key.split('_')[1],
                        NID: key.split('_')[2],
                        RootGroup: key.split('_')[3],
                        Group: key.split('_')[4],
                        Expired: Enumerable.From(g.source).Where('$.IsExpired==1').ToArray().length,
                        Expiring: Enumerable.From(g.source).Where('$.IsExpiring==1').ToArray().length,

                        Items: g.source

                    }
                }).ToArray();
            $scope.ds_employees_l3 = employees;



            ///////////////////////////////
        }


         

       

    };

    /////////////////////////////
    $scope.selected_l3 = null;
    $scope.get_l3_style = function (g) {

        if (!$scope.selected_l3)
            return {};
        if ($scope.selected_l3.GroupId == g.GroupId)
            return {
                background: '#ddd',
                fontWeight: 'bold',
            };
        return {};

    };

    $scope.group_l3_click = function (g) {
         
        var old = $scope.selected_l3 ? $scope.selected_l3.GroupId : -1;
        $scope.selected_l3 = g;

        if ($scope.selected_l3.GroupId != old) {

            
            $scope.selected_l4 = null;
            $scope.selected_l5 = null;


            $scope.ds_barchart_expiring_l4 = [];
            $scope.barchart_l4_expiring_series = [];
            $scope.ds_barchart_expired_l4 = [];
            $scope.barchart_l4_expired_series = [];

            $scope.ds_barchart_expiring_l5 = [];
            $scope.barchart_l5_expiring_series = [];
            $scope.ds_barchart_expired_l5 = [];
            $scope.barchart_l5_expired_series = [];

            $scope.ds_employees_l4 = [];
            $scope.ds_employees_l5 = [];

            //expiring   ////////////////////////////////////////////////////
            var expiring = Enumerable.From($scope.ds_employees).Where('$.IsExpiring==1 && ($.L4Code.startsWith("' + $scope.selected_l3.GroupCode + '") || $.JobGroupCode2=="' + $scope.selected_l3.GroupCode+'")').ToArray();
          
            var grouped = Enumerable.From(expiring)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.CertificateType + '_' + (item.L4Title != '-' ? item.L4Title : item.JobGroup) + '_' + (item.L4Code != '-' ? item.L4Code : item.JobGroupCode2); }, null, (key, g) => {
                    return {
                        Type: key.split('_')[0],
                        Group: key.split('_')[1],
                        GroupCode: key.split('_')[2],
                        Count: g.source.length

                    }
                }).ToArray();

           

            var jobgroups = Enumerable.From(grouped).Select('$.Group').Distinct().ToArray();
           
            var grouped2 = Enumerable.From(grouped)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.Type; }, null, (key, g) => {
                    return {
                        Type: key.split('_')[0],

                        Items: g.source

                    }
                }).ToArray();
           

            $scope.ds_barchart_expiring_l4 = [];
            $scope.barchart_l4_expiring_series = [];
            $.each(jobgroups, function (_j, _e) {
                var series = {

                    valueField: _e,
                    name: _e,
                    showInLegend: true,
                    //color: $rootScope.getColorFromSet2(c),
                };
                $scope.barchart_l4_expiring_series.push(series);
            });
            $.each(grouped2, function (_i, _d) {
                var row = { Type: _d.Type };
                $.each(jobgroups, function (_j, _e) {
                    var cer = Enumerable.From(_d.Items).Where('$.Group=="' + _e + '"').FirstOrDefault();
                    row[_e] = cer ? cer.Count : null;

                });

                $scope.ds_barchart_expiring_l4.push(row);

            });
            
            /////Expired ///////////////////
            var expired = Enumerable.From($scope.ds_employees).Where('$.IsExpired==1 && ($.L4Code.startsWith("' + $scope.selected_l3.GroupCode + '") || $.JobGroupCode2=="' + $scope.selected_l3.GroupCode + '")').ToArray();
             
            console.log('l4 expiried', expiring);
            var grouped_expired = Enumerable.From(expired)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.CertificateType + '_' + (item.L4Title != '-' ? item.L4Title : item.JobGroup) + '_' + (item.L4Code != '-' ? item.L4Code : item.JobGroupCode2); }, null, (key, g) => {
                    return {
                        Type: key.split('_')[0],
                        Group: key.split('_')[1],
                        GroupCode: key.split('_')[2],
                        Count: g.source.length

                    }
                }).ToArray();

            console.log('l4 expiried', grouped_expired);

            var jobgroups_expired = Enumerable.From(grouped_expired).Select('$.Group').Distinct().ToArray();
            console.log('l4 expiried jobgroups', jobgroups_expired);
            var grouped2_expired = Enumerable.From(grouped_expired)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.Type; }, null, (key, g) => {
                    return {
                        Type: key.split('_')[0],

                        Items: g.source

                    }
                }).ToArray();

            console.log('l4 expiried grouped2', grouped2_expired);
            $scope.ds_barchart_expired_l4 = [];
            $scope.barchart_l4_expired_series = [];
            $.each(jobgroups_expired, function (_j, _e) {
                var series = {

                    valueField: _e,
                    name: _e,
                    showInLegend: true,
                    //color: $rootScope.getColorFromSet2(c),
                };
                $scope.barchart_l4_expired_series.push(series);
            });
            $.each(grouped2_expired, function (_i, _d) {
                var row = { Type: _d.Type };
                $.each(jobgroups_expired, function (_j, _e) {
                    var cer = Enumerable.From(_d.Items).Where('$.Group=="' + _e + '"').FirstOrDefault();
                    row[_e] = cer ? cer.Count : null;

                });

                $scope.ds_barchart_expired_l4.push(row);
            });
            console.log('l4 expiried chard ds', $scope.ds_barchart_expired_l4);
            ////////////////////////////////
            // var expired = Enumerable.From($scope.ds_employees).Where('$.IsExpired==1 && ($.L4Code.startsWith("' + $scope.selected_l3.GroupCode + '") || $.JobGroupCode2=="' + $scope.selected_l3.GroupCode + '")').ToArray();

            var employees = Enumerable.From($scope.ds_employees)
                .Where('($.IsExpired==1 || $.IsExpiring==1) && ($.L4Code.startsWith("' + $scope.selected_l3.GroupCode + '") || $.JobGroupCode2=="' + $scope.selected_l3.GroupCode+'")')
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.PersonId + '_' + item.Name + '_' + item.NID + '_' + item.L1Title + '_' + item.JobGroup; }, null, (key, g) => {
                    return {
                        PersonId: key.split('_')[0],
                        Name: key.split('_')[1],
                        NID: key.split('_')[2],
                        RootGroup: key.split('_')[3],
                        Group: key.split('_')[4],
                        Expired: Enumerable.From(g.source).Where('$.IsExpired==1').ToArray().length,
                        Expiring: Enumerable.From(g.source).Where('$.IsExpiring==1').ToArray().length,

                        Items: g.source

                    }
                }).ToArray();
            $scope.ds_employees_l4 = employees;



            ///////////////////////////////
        }

        


    };

    /////////////////////////////
    $scope.selected_l4 = null;
    $scope.get_l4_style = function (g) {
        
        if (!$scope.selected_l4)
            return {};
        if ($scope.selected_l4.GroupId == g.GroupId)
            return {
                background: '#ddd',
                fontWeight: 'bold',
            };
        return {};

    };

    $scope.group_l4_click = function (g) {
        
        var old = $scope.selected_l4 ? $scope.selected_l4.GroupId : -1;
        $scope.selected_l4 = g;

        if ($scope.selected_l4.GroupId != old) {

            $scope.selected_l5 = null;

            

            $scope.ds_barchart_expiring_l5 = [];
            $scope.barchart_l5_expiring_series = [];
            $scope.ds_barchart_expired_l5 = [];
            $scope.barchart_l5_expired_series = [];
            $scope.ds_employees_l5 = [];

            //expiring   ////////////////////////////////////////////////////
 
            var expiring = Enumerable.From($scope.ds_employees).Where('$.IsExpiring==1 && ($.L5Code.startsWith("' + $scope.selected_l4.GroupCode + '") || $.JobGroupCode2=="' + $scope.selected_l4.GroupCode + '")').ToArray();

            var grouped = Enumerable.From(expiring)
                //.GroupBy("$.ArgNum", null, (key, g) => {
            
                    .GroupBy(function (item) { return item.CertificateType + '_' + (item.L5Title != '-' ? item.L5Title : item.JobGroup) + '_' + (item.L5Code != '-' ? item.L5Code : item.JobGroupCode2); }, null, (key, g) => {
                    return {
                        Type: key.split('_')[0],
                        Group: key.split('_')[1],
                        GroupCode: key.split('_')[2],
                        Count: g.source.length

                    }
                }).ToArray();



            var jobgroups = Enumerable.From(grouped).Select('$.Group').Distinct().ToArray();

            var grouped2 = Enumerable.From(grouped)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.Type; }, null, (key, g) => {
                    return {
                        Type: key.split('_')[0],

                        Items: g.source

                    }
                }).ToArray();


            $scope.ds_barchart_expiring_l5 = [];
            $scope.barchart_l5_expiring_series = [];
            $.each(jobgroups, function (_j, _e) {
                var series = {

                    valueField: _e,
                    name: _e,
                    showInLegend: true,
                    //color: $rootScope.getColorFromSet2(c),
                };
                $scope.barchart_l5_expiring_series.push(series);
            });
            $.each(grouped2, function (_i, _d) {
                var row = { Type: _d.Type };
                $.each(jobgroups, function (_j, _e) {
                    var cer = Enumerable.From(_d.Items).Where('$.Group=="' + _e + '"').FirstOrDefault();
                    row[_e] = cer ? cer.Count : null;

                });

                $scope.ds_barchart_expiring_l5.push(row);
            });
            /////Expired ///////////////////
             var expired = Enumerable.From($scope.ds_employees).Where('$.IsExpired==1 && ($.L5Code.startsWith("' + $scope.selected_l4.GroupCode + '") || $.JobGroupCode2=="' + $scope.selected_l4.GroupCode + '")').ToArray();

            var grouped_expired = Enumerable.From(expired)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                     .GroupBy(function (item) { return item.CertificateType + '_' + (item.L5Title != '-' ? item.L5Title : item.JobGroup) + '_' + (item.L5Code != '-' ? item.L5Code : item.JobGroupCode2); }, null, (key, g) => {
                    return {
                        Type: key.split('_')[0],
                        Group: key.split('_')[1],
                        GroupCode: key.split('_')[2],
                        Count: g.source.length

                    }
                }).ToArray();



            var jobgroups_expired = Enumerable.From(grouped_expired).Select('$.Group').Distinct().ToArray();

            var grouped2_expired = Enumerable.From(grouped_expired)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.Type; }, null, (key, g) => {
                    return {
                        Type: key.split('_')[0],

                        Items: g.source

                    }
                }).ToArray();


            $scope.ds_barchart_expired_l5 = [];
            $scope.barchart_l5_expired_series = [];
            $.each(jobgroups_expired, function (_j, _e) {
                var series = {

                    valueField: _e,
                    name: _e,
                    showInLegend: true,
                    //color: $rootScope.getColorFromSet2(c),
                };
                $scope.barchart_l5_expired_series.push(series);
            });
            $.each(grouped2_expired, function (_i, _d) {
                var row = { Type: _d.Type };
                $.each(jobgroups_expired, function (_j, _e) {
                    var cer = Enumerable.From(_d.Items).Where('$.Group=="' + _e + '"').FirstOrDefault();
                    row[_e] = cer ? cer.Count : null;

                });

                $scope.ds_barchart_expired_l5.push(row);
            });
            ////////////////////////////////
            var employees = Enumerable.From($scope.ds_employees)
               
                .Where('($.IsExpired==1 || $.IsExpiring==1) && ($.L5Code.startsWith("' + $scope.selected_l3.GroupCode + '") || $.JobGroupCode2=="' + $scope.selected_l4.GroupCode + '")')

                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.PersonId + '_' + item.Name + '_' + item.NID + '_' + item.L1Title + '_' + item.JobGroup; }, null, (key, g) => {
                    return {
                        PersonId: key.split('_')[0],
                        Name: key.split('_')[1],
                        NID: key.split('_')[2],
                        RootGroup: key.split('_')[3],
                        Group: key.split('_')[4],
                        Expired: Enumerable.From(g.source).Where('$.IsExpired==1').ToArray().length,
                        Expiring: Enumerable.From(g.source).Where('$.IsExpiring==1').ToArray().length,

                        Items: g.source

                    }
                }).ToArray();
            $scope.ds_employees_l5 = employees;



            ///////////////////////////////
        }

    };

    /////////////////////////////
    $scope.selected_l5 = null;
    $scope.get_l5_style = function (g) {

        if (!$scope.selected_l5)
            return {};
        if ($scope.selected_l5.GroupId == g.GroupId)
            return {
                background: '#ddd',
                fontWeight: 'bold',
            };
        return {};

    };

    $scope.group_l5_click = function (g) {
       
        var old = $scope.selected_l5 ? $scope.selected_l5.GroupId : -1;
        $scope.selected_l5 = g;

        if ($scope.selected_l5.GroupId != old) {



            
        }

    };
    ///////////////////////////
    $scope.pie_expiring_instance = null;
    $scope.pie_expiring = {
        rtlEnabled: false,
        onInitialized: function (e) {
            if (!$scope.pie_expiring_instance)
                $scope.pie_expiring_instance = e.component;
        },
         sizeGroup: 'sg1',
        type: "doughnut",
       // palette: ['#00cc66', '#ff5c33'],
        // diameter: 0.85,
        legend: {
             visible: false,
            horizontalAlignment: 'left',
            customizeText: function (e) {
                return "AAA";
            },
            //verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function () {
                return { text: (this.value) };
            }
        },
        "export": {
            enabled: false
        },
        series: [

            {
                name: 'Current',
                ignoreEmptyPoints: true,
                argumentField: "GroupTitle",
                valueField: "IndexExpiring",
                label: {
                    position: 'outside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 12,
                        color: 'black',
                    },

                    connector: {
                        visible: true
                    },
                    customizeText: function (arg) {

                        return arg.argument;
                    }
                }
            }

        ],
        title: {
            margin: {
                left: 30
            },
            font: {
                size: 16,
            },
            text:'Expiring Index'
        },
        size: {
            height: 300,
        },
        bindingOptions: {
            dataSource: 'ds_groups',
           // 'title.text': 'Expiring Index',

        }
    };


    $scope.pie_expired_instance = null;
    $scope.pie_expired = {
        rtlEnabled: false,
        onInitialized: function (e) {
            if (!$scope.pie_expired_instance)
                $scope.pie_expired_instance = e.component;
        },
          sizeGroup: 'sg1',
        type: "doughnut",
        // palette: ['#00cc66', '#ff5c33'],
        // diameter: 0.85,
        legend: {
            visible: false,
            //horizontalAlignment: 'center',
            //verticalAlignment: 'bottom',
            //orientation:'vertical',
        },
        tooltip: {
            enabled: true,
            zIndex: 10000,
            customizeTooltip: function () {
                return { text: (this.value) };
            }
        },
        "export": {
            enabled: false
        },
        series: [

            {
                name: 'Current',
                ignoreEmptyPoints: true,
                argumentField: "GroupTitle",
                valueField: "IndexExpired",
                label: {
                    position: 'inside',
                    backgroundColor: 'transparent',
                    visible: true,
                    font: {
                        size: 12,
                        color: 'white',
                    },

                    connector: {
                        visible: true
                    },
                    customizeText: function (arg) {

                        return arg.percentText;
                    }
                }
            }

        ],
        title: {
            margin: {
                left: 30
            },
            font: {
                size: 16,
            },
            text: 'Expired Index'
        },
        size: {
            height: 300,
        },
        bindingOptions: {
            dataSource: 'ds_groups',
            // 'title.text': 'Expired Index',

        }
    };
    ////////////////////////////////////////
    $scope.ds_barchart_expiring_l1 = [];
    $scope.barchart_l1_expiring_series = [];
    $scope.bar_chart_expiring_l1 = {
        size: {
            height: 450,
        },
        sizeGroup: 'sg1',
        palette:'Material',
        commonSeriesSettings: {
            argumentField: 'Type',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        title: {
            text: 'Expiring', font: { size: 13 }
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },
        bindingOptions: {
            series: 'barchart_l1_expiring_series',
            dataSource: 'ds_barchart_expiring_l1',
        }
    };
    //////////////////////////
    $scope.ds_barchart_expired_l1 = [];
    $scope.barchart_l1_expired_series = [];
    $scope.bar_chart_expired_l1 = {
        size: {
            height: 450,
        },
        sizeGroup: 'sg1',
        palette: 'Material',
        commonSeriesSettings: {
            argumentField: 'Type',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        title: {
            text: 'Expired', font: {size:13}
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },
        bindingOptions: {
            series: 'barchart_l1_expired_series',
            dataSource: 'ds_barchart_expired_l1',
        }
    };
    //////////////////////////
    $scope.ds_barchart_expiring_l2 = [];
    $scope.barchart_l2_expiring_series = [];
    $scope.bar_chart_expiring_l2 = {
        sizeGroup: 'sg2',
        palette: 'Green Mist',
        commonSeriesSettings: {
            argumentField: 'Type',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        title: {
            text: 'Expiring', font: { size: 12 }
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },
        bindingOptions: {
            series: 'barchart_l2_expiring_series',
            dataSource: 'ds_barchart_expiring_l2',
        }
    };
    //////////////////////////
    $scope.ds_barchart_expired_l2 = [];
    $scope.barchart_l2_expired_series = [];
    $scope.bar_chart_expired_l2 = {
        sizeGroup: 'sg2',
        palette: 'Green Mist',
        commonSeriesSettings: {
            argumentField: 'Type',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        title: {
            text: 'Expired', font: { size: 12 }
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },
        bindingOptions: {
            series: 'barchart_l2_expired_series',
            dataSource: 'ds_barchart_expired_l2',
        }
    };
    //////////////////////////
    $scope.ds_barchart_expiring_l3 = [];
    $scope.barchart_l3_expiring_series = [];
    $scope.bar_chart_expiring_l3 = {
        palette: 'Bright',
        commonSeriesSettings: {
            argumentField: 'Type',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        title: {
            text: 'Expiring', font: { size: 12 }
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },
        bindingOptions: {
            series: 'barchart_l3_expiring_series',
            dataSource: 'ds_barchart_expiring_l3',
        }
    };
    //////////////////////////
    $scope.ds_barchart_expired_l3 = [];
    $scope.barchart_l3_expired_series = [];
    $scope.bar_chart_expired_l3 = {
        palette: 'Bright',
        commonSeriesSettings: {
            argumentField: 'Type',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        title: {
            text: 'Expired', font: { size: 12 }
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },
        bindingOptions: {
            series: 'barchart_l3_expired_series',
            dataSource: 'ds_barchart_expired_l3',
        }
    };
    //////////////////////////
    $scope.ds_barchart_expiring_l4 = [];
    $scope.barchart_l4_expiring_series = [];
    $scope.bar_chart_expiring_l4 = {
        
        palette: 'DarkMoon',
        commonSeriesSettings: {
            argumentField: 'Type',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        title: {
            text: 'Expiring', font: { size: 12 }
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },
        bindingOptions: {
            series: 'barchart_l4_expiring_series',
            dataSource: 'ds_barchart_expiring_l4',
        }
    };
    //////////////////////////
    $scope.ds_barchart_expired_l4 = [];
    $scope.barchart_l4_expired_series = [];
    $scope.bar_chart_expired_l4 = {
        palette: 'DarkMoon',
        commonSeriesSettings: {
            argumentField: 'Type',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        title: {
            text: 'Expired', font: { size: 12 }
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },
        bindingOptions: {
            series: 'barchart_l4_expired_series',
            dataSource: 'ds_barchart_expired_l4',
        }
    };
    //////////////////////////
    $scope.ds_barchart_expiring_l5 = [];
    $scope.barchart_l5_expiring_series = [];
    $scope.bar_chart_expiring_l5 = {
        palette: 'Violet',
        commonSeriesSettings: {
            argumentField: 'Type',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        title: {
            text: 'Expiring', font: { size: 12 }
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },
        bindingOptions: {
            series: 'barchart_l5_expiring_series',
            dataSource: 'ds_barchart_expiring_l5',
        }
    };
    //////////////////////////
    $scope.ds_barchart_expired_l5 = [];
    $scope.barchart_l5_expired_series = [];
    $scope.bar_chart_expired_l5 = {
        palette: 'Violet',
        commonSeriesSettings: {
            argumentField: 'Type',
            type: 'bar',
            hoverMode: 'allArgumentPoints',
            selectionMode: 'allArgumentPoints',
            label: {
                visible: true,
                format: {
                    type: 'fixedPoint',
                    precision: 0,
                },
            },
        },
        argumentAxis: {
            label: {
                displayMode: 'rotate',
                rotationAngle: -45,
                overlappingBehavior: 'rotate',
            },
            overlappingBehavior: 'rotate',
        },
        title: {
            text: 'Expired', font: { size: 12 }
        },
        legend: {
            verticalAlignment: 'bottom',
            horizontalAlignment: 'center',
        },
        export: {
            enabled: false,
        },
        onPointClick(e) {
            e.target.select();
        },
        bindingOptions: {
            series: 'barchart_l5_expired_series',
            dataSource: 'ds_barchart_expired_l5',
        }
    };
    //////////////////////////
    

    $scope.ds_employees_l1 = [];
    $scope.dg_emp_l1_columns = [
        { dataField: 'RootGroup', caption: '', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
        { dataField: 'Group', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: false, fixedPosition: 'left', },

        { dataField: 'Expired', caption: 'Expired', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 110, fixed: false, fixedPosition: 'left',sortIndex:0,sortOrder:'desc' },

        { dataField: 'Expiring', caption: 'Expiring', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 110, fixed: false, fixedPosition: 'right', sortIndex: 1, sortOrder: 'desc' },


    ];
    $scope.dg_emp_l1_selected = null;
    $scope.dg_emp_l1_instance = null;

    $scope.dg_emp_l1 = {
        wordWrapEnabled: true,
        scrolling: {
            showScrollbar:'always'
        },
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_emp_l1_columns,
        onContentReady: function (e) {
            if (!$scope.dg_emp_l1_instance)
                $scope.dg_emp_l1_instance = e.component;

            $(e.element).on("dxmousewheel", function (e) {
                e.preventDefault();
            });  
        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) { $scope.dg_emp_l1_selected = null;  }
            else {
                $scope.dg_emp_l1_selected = data;
                $scope.ds_employees_l1_items = data.Items;
                 
            }


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "Expired" && e.data.Expired > 0) {
                e.cellElement.css("backgroundColor", "#ff471a");
                e.cellElement.css("color", "#fff");

            }
            if (e.rowType === "data" && e.column.dataField == "Expiring" && e.data.Expiring > 0) {
                e.cellElement.css("backgroundColor", "#ffa64d");
                e.cellElement.css("color", "#000");
            }
           
        },
        height: $(window).height() - 165,
        bindingOptions: {
            dataSource: 'ds_employees_l1', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };

    $scope.ds_employees_l1_items = [];
    $scope.dg_emp_l1_items_columns = [
        { dataField: 'CertificateType', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: false, fixedPosition: 'left', },
        { dataField: 'DateIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140, fixed: false, fixedPosition: 'left' },
        { dataField: 'DateExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140, fixed: false, fixedPosition: 'left' },
        { dataField: 'Remain', caption: 'Remaining', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 140, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc' },

         

    ];
    $scope.dg_emp_l1_items_selected = null;
    $scope.dg_emp_l1_items_instance = null;

    $scope.dg_emp_l1_items = {
        wordWrapEnabled: true,
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_emp_l1_items_columns,
        onContentReady: function (e) {
            if (!$scope.dg_emp_l1_items_instance)
                $scope.dg_emp_l1_items_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) { $scope.dg_emp_l1_items_selected = null; }
            else {
                $scope.dg_emp_l1_items_selected = data;

            }


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "Remain" && e.data.IsExpired  ) {
                e.cellElement.css("backgroundColor", "#ff471a");
                e.cellElement.css("color", "#fff");

            }
            if (e.rowType === "data" && e.column.dataField == "Remain" && e.data.IsExpiring  ) {
                e.cellElement.css("backgroundColor", "#ffa64d");
                e.cellElement.css("color", "#000");
            }

        },
        height: $(window).height() - 195,
        bindingOptions: {
            dataSource: 'ds_employees_l1_items', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
    ///////////////////////////
    $scope.ds_employees_l2 = [];
    $scope.dg_emp_l2_columns = [
        { dataField: 'RootGroup', caption: '', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
        { dataField: 'Group', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: false, fixedPosition: 'left', },

        { dataField: 'Expired', caption: 'Expired', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 110, fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'desc' },

        { dataField: 'Expiring', caption: 'Expiring', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 110, fixed: false, fixedPosition: 'right', sortIndex: 1, sortOrder: 'desc' },


    ];
    $scope.dg_emp_l2_selected = null;
    $scope.dg_emp_l2_instance = null;

    $scope.dg_emp_l2 = {
        wordWrapEnabled: true,
        scrolling: {
            showScrollbar: 'always'
        },
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_emp_l2_columns,
        onContentReady: function (e) {
            if (!$scope.dg_emp_l2_instance)
                $scope.dg_emp_l2_instance = e.component;

            $(e.element).on("dxmousewheel", function (e) {
                e.preventDefault();
            });
        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) { $scope.dg_emp_l2_selected = null; }
            else {
                $scope.dg_emp_l2_selected = data;
                $scope.ds_employees_l2_items = data.Items;

            }


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "Expired" && e.data.Expired > 0) {
                e.cellElement.css("backgroundColor", "#ff471a");
                e.cellElement.css("color", "#fff");

            }
            if (e.rowType === "data" && e.column.dataField == "Expiring" && e.data.Expiring > 0) {
                e.cellElement.css("backgroundColor", "#ffa64d");
                e.cellElement.css("color", "#000");
            }

        },
        height: $(window).height() - 165,
        bindingOptions: {
            dataSource: 'ds_employees_l2', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };

    $scope.ds_employees_l2_items = [];
    $scope.dg_emp_l2_items_columns = [
        { dataField: 'CertificateType', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: false, fixedPosition: 'left', },
        { dataField: 'DateIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140, fixed: false, fixedPosition: 'left' },
        { dataField: 'DateExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140, fixed: false, fixedPosition: 'left' },
        { dataField: 'Remain', caption: 'Remaining', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 140, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc' },



    ];
    $scope.dg_emp_l2_items_selected = null;
    $scope.dg_emp_l2_items_instance = null;

    $scope.dg_emp_l2_items = {
        wordWrapEnabled: true,
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_emp_l2_items_columns,
        onContentReady: function (e) {
            if (!$scope.dg_emp_l2_items_instance)
                $scope.dg_emp_l2_items_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) { $scope.dg_emp_l2_items_selected = null; }
            else {
                $scope.dg_emp_l2_items_selected = data;

            }


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "Remain" && e.data.IsExpired) {
                e.cellElement.css("backgroundColor", "#ff471a");
                e.cellElement.css("color", "#fff");

            }
            if (e.rowType === "data" && e.column.dataField == "Remain" && e.data.IsExpiring) {
                e.cellElement.css("backgroundColor", "#ffa64d");
                e.cellElement.css("color", "#000");
            }

        },
        height: $(window).height() - 195,
        bindingOptions: {
            dataSource: 'ds_employees_l2_items', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
    ////////////////////////
    $scope.ds_employees_l3 = [];
    $scope.dg_emp_l3_columns = [
        { dataField: 'RootGroup', caption: '', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
        { dataField: 'Group', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: false, fixedPosition: 'left', },

        { dataField: 'Expired', caption: 'Expired', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 110, fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'desc' },

        { dataField: 'Expiring', caption: 'Expiring', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 110, fixed: false, fixedPosition: 'right', sortIndex: 1, sortOrder: 'desc' },


    ];
    $scope.dg_emp_l3_selected = null;
    $scope.dg_emp_l3_instance = null;

    $scope.dg_emp_l3 = {
        wordWrapEnabled: true,
        scrolling: {
            showScrollbar: 'always'
        },
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_emp_l3_columns,
        onContentReady: function (e) {
            if (!$scope.dg_emp_l3_instance)
                $scope.dg_emp_l3_instance = e.component;

            $(e.element).on("dxmousewheel", function (e) {
                e.preventDefault();
            });
        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) { $scope.dg_emp_l3_selected = null; }
            else {
                $scope.dg_emp_l3_selected = data;
                $scope.ds_employees_l3_items = data.Items;

            }


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "Expired" && e.data.Expired > 0) {
                e.cellElement.css("backgroundColor", "#ff471a");
                e.cellElement.css("color", "#fff");

            }
            if (e.rowType === "data" && e.column.dataField == "Expiring" && e.data.Expiring > 0) {
                e.cellElement.css("backgroundColor", "#ffa64d");
                e.cellElement.css("color", "#000");
            }

        },
        height: $(window).height() - 165,
        bindingOptions: {
            dataSource: 'ds_employees_l3', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };

    $scope.ds_employees_l3_items = [];
    $scope.dg_emp_l3_items_columns = [
        { dataField: 'CertificateType', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: false, fixedPosition: 'left', },
        { dataField: 'DateIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140, fixed: false, fixedPosition: 'left' },
        { dataField: 'DateExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140, fixed: false, fixedPosition: 'left' },
        { dataField: 'Remain', caption: 'Remaining', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 140, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc' },



    ];
    $scope.dg_emp_l3_items_selected = null;
    $scope.dg_emp_l3_items_instance = null;

    $scope.dg_emp_l3_items = {
        wordWrapEnabled: true,
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_emp_l3_items_columns,
        onContentReady: function (e) {
            if (!$scope.dg_emp_l3_items_instance)
                $scope.dg_emp_l3_items_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) { $scope.dg_emp_l3_items_selected = null; }
            else {
                $scope.dg_emp_l3_items_selected = data;

            }


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "Remain" && e.data.IsExpired) {
                e.cellElement.css("backgroundColor", "#ff471a");
                e.cellElement.css("color", "#fff");

            }
            if (e.rowType === "data" && e.column.dataField == "Remain" && e.data.IsExpiring) {
                e.cellElement.css("backgroundColor", "#ffa64d");
                e.cellElement.css("color", "#000");
            }

        },
        height: $(window).height() - 195,
        bindingOptions: {
            dataSource: 'ds_employees_l3_items', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };

    /////////////////////////////
    $scope.ds_employees_l4 = [];
    $scope.dg_emp_l4_columns = [
        { dataField: 'RootGroup', caption: '', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
        { dataField: 'Group', caption: 'Group', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: false, fixedPosition: 'left', },
        { dataField: 'Name', caption: 'Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: false, fixedPosition: 'left', },

        { dataField: 'Expired', caption: 'Expired', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 110, fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'desc' },

        { dataField: 'Expiring', caption: 'Expiring', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 110, fixed: false, fixedPosition: 'right', sortIndex: 1, sortOrder: 'desc' },


    ];
    $scope.dg_emp_l4_selected = null;
    $scope.dg_emp_l4_instance = null;

    $scope.dg_emp_l4 = {
        wordWrapEnabled: true,
        scrolling: {
            showScrollbar: 'always'
        },
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_emp_l4_columns,
        onContentReady: function (e) {
            if (!$scope.dg_emp_l4_instance)
                $scope.dg_emp_l4_instance = e.component;

            $(e.element).on("dxmousewheel", function (e) {
                e.preventDefault();
            });
        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) { $scope.dg_emp_l4_selected = null; }
            else {
                $scope.dg_emp_l4_selected = data;
                $scope.ds_employees_l4_items = data.Items;

            }


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "Expired" && e.data.Expired > 0) {
                e.cellElement.css("backgroundColor", "#ff471a");
                e.cellElement.css("color", "#fff");

            }
            if (e.rowType === "data" && e.column.dataField == "Expiring" && e.data.Expiring > 0) {
                e.cellElement.css("backgroundColor", "#ffa64d");
                e.cellElement.css("color", "#000");
            }

        },
        height: $(window).height() - 165,
        bindingOptions: {
            dataSource: 'ds_employees_l4', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };

    $scope.ds_employees_l4_items = [];
    $scope.dg_emp_l4_items_columns = [
        { dataField: 'CertificateType', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 200, fixed: false, fixedPosition: 'left', },
        { dataField: 'DateIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140, fixed: false, fixedPosition: 'left' },
        { dataField: 'DateExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'datetime', allowEditing: false, format: 'yyyy-MMM-dd', width: 140, fixed: false, fixedPosition: 'left' },
        { dataField: 'Remain', caption: 'Remaining', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 140, fixed: false, fixedPosition: 'left', fixed: false, fixedPosition: 'left', sortIndex: 0, sortOrder: 'asc' },



    ];
    $scope.dg_emp_l4_items_selected = null;
    $scope.dg_emp_l4_items_instance = null;

    $scope.dg_emp_l4_items = {
        wordWrapEnabled: true,
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
        columnFixing: {
            enabled: true
        },
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_emp_l4_items_columns,
        onContentReady: function (e) {
            if (!$scope.dg_emp_l4_items_instance)
                $scope.dg_emp_l4_items_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) { $scope.dg_emp_l4_items_selected = null; }
            else {
                $scope.dg_emp_l4_items_selected = data;

            }


        },
        onCellPrepared: function (e) {
            if (e.rowType === "data" && e.column.dataField == "Remain" && e.data.IsExpired) {
                e.cellElement.css("backgroundColor", "#ff471a");
                e.cellElement.css("color", "#fff");

            }
            if (e.rowType === "data" && e.column.dataField == "Remain" && e.data.IsExpiring) {
                e.cellElement.css("backgroundColor", "#ffa64d");
                e.cellElement.css("color", "#000");
            }

        },
        height: $(window).height() - 195,
        bindingOptions: {
            dataSource: 'ds_employees_l4_items', //'dg_employees_ds',
            // height: 'dg_employees_height'
        }
    };
   //////////////////////////







    $scope.get_month_class = function (i) {
        return i % 2 == 0 ? 'row_odd' : 'row_even';
    }

    $scope.get_dates = function (items, month) {
        var days = Enumerable.From(items).Where('$.Month=="' + month + '"').ToArray();
        return days;
    };
    $scope.get_day_items = function (items, day) {
        var rec = Enumerable.From(items).Where(function (x) { return moment(x.Date).format('YYYYMMDD') == moment(day).format('YYYYMMDD'); }).FirstOrDefault();
        
        if (rec)
            return rec.Items;
        else
            return [];
    };
    $scope.day_click = function (dt, rows) {
        console.log('day_click');
        console.log(dt);
        console.log(rows);
        $scope.popup_day_date = dt;
        $scope.popup_day_ds = rows;
        $scope.popup_day_visible = true;
    }
    /////////////////////
    $scope.get_day_container_style = function () {
        var h = $(window).height() - 250;
        return {
            height: h + 'px',
        }
    }
    $scope.popup_day_date = null;
    $scope.popup_day_ds = [];
    $scope.popup_day_visible = false;
    $scope.popup_day = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_emp"
        },
        shading: true,
        title: 'Details',
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: $(window).height() - 100,
        width: $(window).width() - 300,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [



            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_day_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {
            


        },
        onHiding: function () {
            $scope.popup_day_date = null;
            $scope.popup_day_ds = [];
            $scope.popup_day_visible = false;

        },
        bindingOptions: {
            visible: 'popup_day_visible',



        }
    };

    /////////////////////
    $scope.bindMain = function ( ) {

        $scope.ds_groups = [];
        $scope.ds_employees = [];
        $scope.loadingVisible = true;

        trnService.getTrnExpiringGroups().then(function (response) {
            $scope.loadingVisible = false;

            $scope.ds_groups = response.groups;
            $scope.ds_employees = response.employees;
            $scope.ds_dates = response.Dates;

            console.log(response);

            //expiring   ////////////////////////////////////////////////////
            var expiring = Enumerable.From($scope.ds_employees).Where('$.IsExpiring==1').ToArray();
            var grouped = Enumerable.From(expiring)
            //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.CertificateType+'_'+item.L1Title+'_'+item.L1Code  ; }, null, (key, g) => {
            return {
                Type: key.split('_')[0],
                Group: key.split('_')[1],
                GroupCode: key.split('_')[2],
                Count:g.source.length

            }
                }).ToArray();


            
            var jobgroups = Enumerable.From(grouped).Select('$.Group').Distinct().ToArray();

            var grouped2 = Enumerable.From(grouped)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.Type  ; }, null, (key, g) => {
                    return {
                        Type: key.split('_')[0],
                        
                        Items: g.source 

                    }
                }).ToArray();
            

            $scope.ds_barchart_expiring_l1 = [];
            $scope.barchart_l1_expiring_series = [];
            $.each(jobgroups, function (_j, _e) {
                var series = {

                    valueField: _e,
                    name: _e,
                    showInLegend: true,
                    //color: $rootScope.getColorFromSet2(c),
                };
                $scope.barchart_l1_expiring_series.push(series);
            });
            $.each(grouped2, function (_i, _d) {
                var row = { Type: _d.Type };
                $.each(jobgroups, function (_j, _e) {
                    var cer = Enumerable.From(_d.Items).Where('$.Group=="' + _e + '"').FirstOrDefault();
                    row[_e] = cer ? cer.Count : null;
                   
                });
               
                $scope.ds_barchart_expiring_l1.push(row);
            });
            /////Expired ///////////////////
            var expired = Enumerable.From($scope.ds_employees).Where('$.IsExpired==1').ToArray();
            var grouped_expired = Enumerable.From(expired)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.CertificateType + '_' + item.L1Title + '_' + item.L1Code; }, null, (key, g) => {
                    return {
                        Type: key.split('_')[0],
                        Group: key.split('_')[1],
                        GroupCode: key.split('_')[2],
                        Count: g.source.length

                    }
                }).ToArray();



            var jobgroups_expired = Enumerable.From(grouped_expired).Select('$.Group').Distinct().ToArray();

            var grouped2_expired = Enumerable.From(grouped_expired)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { return item.Type; }, null, (key, g) => {
                    return {
                        Type: key.split('_')[0],

                        Items: g.source

                    }
                }).ToArray();


            $scope.ds_barchart_expired_l1 = [];
            $scope.barchart_l1_expired_series = [];
            $.each(jobgroups_expired, function (_j, _e) {
                var series = {

                    valueField: _e,
                    name: _e,
                    showInLegend: true,
                    //color: $rootScope.getColorFromSet2(c),
                };
                $scope.barchart_l1_expired_series.push(series);
            });
            $.each(grouped2_expired, function (_i, _d) {
                var row = { Type: _d.Type };
                $.each(jobgroups_expired, function (_j, _e) {
                    var cer = Enumerable.From(_d.Items).Where('$.Group=="' + _e + '"').FirstOrDefault();
                    row[_e] = cer ? cer.Count : null;

                });

                $scope.ds_barchart_expired_l1.push(row);
            });
            ////////////////////////////////
            var employees = Enumerable.From($scope.ds_employees)
                //.GroupBy("$.ArgNum", null, (key, g) => {
                .GroupBy(function (item) { console.log(item.L1Title); return item.PersonId + '_' + item.Name + '_' + item.NID + '_'   + item.L1Title + '_' + item.JobGroup; }, null, (key, g) => {
                    return {
                        PersonId: key.split('_')[0],
                        Name: key.split('_')[1],
                        NID: key.split('_')[2],
                        RootGroup: key.split('_')[3],
                        Group: key.split('_')[4],
                        Expired: Enumerable.From(g.source).Where('$.IsExpired==1').ToArray().length,
                        Expiring: Enumerable.From(g.source).Where('$.IsExpiring==1').ToArray().length,

                        Items: g.source

                    }
                }).ToArray();
            $scope.ds_employees_l1 = employees ;

            /////////////////////////////////



            /////////////////////////////

        }, function (err) { General.ShowNotify(err.message, 'error'); });
    }

    //////////////////////////////

    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
    }
    else {

        $rootScope.page_title = '> Groups';
        $('.trnexpiringgrps').fadeIn();
    }
    $scope.$on('$viewContentLoaded', function () {
        setTimeout(function () {

            $scope.bindMain();

        }, 1500);
    });
    //////////////////////////////////////////
    $rootScope.$broadcast('PersonCourseLoaded', null);





}]);