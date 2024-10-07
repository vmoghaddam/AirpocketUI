'use strict';
app.controller('usersController', ['$scope', '$location', '$routeParams', '$rootScope', 'flightService', 'aircraftService', 'authService', 'notificationService', '$route', function ($scope, $location, $routeParams, $rootScope, flightService, aircraftService, authService, notificationService, $route) {
    $scope.prms = $routeParams.prms;
    $scope.dto = {
        UserName: '',
        FirstName: '',
        LastName: '',
        Email: '',
        Password: '',
        PhoneNumber: '',
        Station: '',
    };

    $scope.getDatasourceEmployees = function (cid) {
        return new DevExpress.data.DataSource({
            store:

                new DevExpress.data.ODataStore({
                    url: $rootScope.serviceUrl + 'odata/employees/light/' + cid,
                    version: 4
                }),

            sort: ['LastName'],
        });
    };
    $scope.isPropDisabled = false;
    $scope.employeeId = null;
    $scope.personId = null;
    $scope.employee = null;
    $scope.sb_employees = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $scope.getDatasourceEmployees(Config.CustomerId),
        //itemTemplate: function (data) {
        //    return $rootScope.getSbTemplateAirport(data);
        //},
         
        searchExpr: ["Name"],
        displayExpr: "Name",
        valueExpr: 'PersonId',
        onSelectionChanged: function (arg) {

            $scope.employee = arg.selectedItem;
            $scope.isPropDisabled = $scope.employee;
            $scope.dto.FirstName = null;
            $scope.dto.LastName = null;
            $scope.dto.PhoneNumber = null;
            if ($scope.employee) {
                $scope.dto.FirstName = $scope.employee.FirstName;
                $scope.dto.LastName = $scope.employee.LastName;
                $scope.dto.PhoneNumber = $scope.employee.Mobile;
            }
            // $scope.fillSchedule2();

        },
        bindingOptions: {
            value: 'personId',

        }
    };



    $scope.btn_search = {
        text: 'Search',
        type: 'success',
        icon: 'search',
        width: 120,
        validationGroup: 'ctrsearch',
        bindingOptions: {},
        onClick: function (e) {
    //        var dto = {
    //            Email: 'ati1@email.com',
    //            UserName: 'ati1',
    //            Password: '1234@aA',
    //            FirstName: 'Atrina',
    //            LastName: 'Moghaddam',
    //        };
    //        authService.register2(dto).then(function (response) {
    //            alert('ok');
    //            console.log(response);


    //        },
    //function (err) {
    //    $scope.message = err.message;
    //    General.ShowNotify(err.message, 'error');
        
    //});


    //        return;
            $scope.dg_flight_total_ds = null;
            $scope.dg_flight_ds = null;
            //var caption = 'From ' + moment($scope.dt_from).format('YYYY-MM-DD') + ' to ' + moment($scope.dt_to).format('YYYY-MM-DD');
            // $scope.dg_flight_total_instance.columnOption('date', 'caption', caption);
            $scope.getUsers();
        }

    };
    
    function generatePassword() {
        var length = 8;
        var capital="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var numbers="0123456789";
        var charset = "abcdefghijklmnopqrstuvwxyz";
        var retVal = "";
        retVal += capital.charAt(Math.floor(Math.random() *capital.length));
        for (var i = 0, n = charset.length; i < 4; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        for (var i = 0, n = numbers.length; i < 2; ++i) {
            retVal += numbers.charAt(Math.floor(Math.random() * n));
        }
        retVal += "@";
        return retVal;
    }
    $scope.btn_new = {
        text: 'New',
        type: 'default',
        icon: 'plus',
        width: 120,
        onClick: function (e) {
            $scope.IsEdit = false;
            $scope.IsDisabled = false;
            $scope.dto = {
                UserName: '',
                FirstName: '',
                LastName: '',
                Email: '',
                PhoneNumber: '',
                Station: '',
                Password: '1234@aA', //generatePassword(),
                Roles:null,
            };
            $scope.popup_add_visible = true;
        },


    };
    $scope.IsEdit = false;
    $scope.btn_edit = {
         text: 'Edit',
        type: 'default',
         icon: 'edit',
        width: 120,
        
        onClick: function (e) {
           var selected = $rootScope.getSelectedRow($scope.dg_flight_total_instance);
           if (!selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
           $scope.IsEdit = true;
           $scope.IsDisabled = selected.PersonId;
           $scope.dto = {
               Id:selected.Id,
               UserName: selected.UserName,
               FirstName: selected.FirstName,
               LastName: selected.LastName,
               Email: selected.Email,
               Password: selected.PasswordHash, //generatePassword(),
               PhoneNumber: selected.PhoneNumber,
               Station:selected.SecurityStamp,
               Roles: null,

            };
            $scope.personId = selected.PersonId;
           $scope.getUserRoles(selected.Id, function (ds) {
               $scope.dto.Roles = Enumerable.From(ds).Select('$.Name').ToArray();
               $scope.popup_add_visible = true;
           });
        

            
        }

    };
    $scope.selected = null;
    $scope.btn_password = {
        text: 'Password',
        type: 'default',
        icon: 'key',
        width: 150,

        onClick: function (e) {
            $scope.selected = $rootScope.getSelectedRow($scope.dg_flight_total_instance);
            if (!$scope.selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            $scope.popup_password_visible = true;

        }

    };
    $scope.btn_disable = {
        text: 'Disable',
        type: 'default',
        
        width: 150,

        onClick: function (e) {
            $scope.selected = $rootScope.getSelectedRow($scope.dg_flight_total_instance);
            if (!$scope.selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            General.Confirm("The selected user will be disabled. Are you sure?", function (res) {
                if (res) {

                    var dto = { Id: $scope.selected.Id, };
                    $scope.loadingVisible = true;
                    authService.disable(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.dg_flight_total_ds = null;
                        $scope.dg_flight_ds = null;

                        $scope.getUsers();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify2(err.message, 'error', 5000); });

                }
            });

        }

    };


    $scope.btn_enable = {
        text: 'Enable',
        type: 'default',

        width: 150,

        onClick: function (e) {
            $scope.selected = $rootScope.getSelectedRow($scope.dg_flight_total_instance);
            if (!$scope.selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            if (!$scope.selected.LockoutEnabled) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }
            General.Confirm("The selected user will be enabled. Are you sure?", function (res) {
                if (res) {

                    var dto = { Id: $scope.selected.Id, };
                    $scope.loadingVisible = true;
                    authService.enable(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.dg_flight_total_ds = null;
                        $scope.dg_flight_ds = null;

                        $scope.getUsers();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify2(err.message, 'error', 5000); });

                }
            });

        }

    };


    $scope.btn_role = {
        text: 'Roles',
        type: 'default',
        icon: 'key',
        width: 130,

        onClick: function (e) {
            
            $scope.popup_role_visible = true;

        }

    };
    $scope.btn_delete = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',
        width: 120,
        
        onClick: function (e) {

            var selected = $rootScope.getSelectedRow($scope.dg_flight_total_instance);
            if (!selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    var dto = { Id: selected.Id, };
                    $scope.loadingVisible = true;
                    authService.deleteUser(dto).then(function (response) {
                        $scope.loadingVisible = false;
                        General.ShowNotify(Config.Text_SavedOk, 'success');
                        $scope.dg_flight_total_ds = null;
                        $scope.dg_flight_ds = null;
                        
                        $scope.getUsers();



                    }, function (err) { $scope.loadingVisible = false; General.ShowNotify2(err.message, 'error', 5000); });

                }
            });
        }
    };
    ///////////////////////////////////
    $scope.formatMinutes = function (mm) {
        return pad(Math.floor(mm / 60)).toString() + ':' + pad(mm % 60).toString();
    };
    $scope.getUsers = function () {

        $scope.loadingVisible = true;
        authService.getUsers().then(function (response) {
            $scope.loadingVisible = false;

            $scope.dg_flight_total_ds = response;



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.roles = null;
    $scope.userRoles = null;
    $scope.getRoles = function () {

        $scope.loadingVisible = true;
        authService.getRoles().then(function (response) {
            $scope.loadingVisible = false;

            $scope.roles = response;



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.getUserRoles = function (id,callback) {

        $scope.loadingVisible = true;
        authService.getUserRoles(id).then(function (response) {
            $scope.loadingVisible = false;

            callback(response);




        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };


    $scope.getClaims = function (  callback) {

        $scope.loadingVisible = true;
        authService.getClaims().then(function (response) {
            $scope.loadingVisible = false;

            callback(response);




        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.getRoleClaims = function (id,callback) {

        $scope.loadingVisible = true;
        authService.getRoleClaims(id).then(function (response) {
            $scope.loadingVisible = false;

            callback(response);




        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };
    $scope.getUserClaims = function (id, callback) {

        $scope.loadingVisible = true;
        authService.getUserClaims(id).then(function (response) {
            $scope.loadingVisible = false;

            callback(response);




        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

    $scope.fillUserRoles = function (id) {
        $scope.getUserRoles(id, function (data) {
            var ds = [];
            $.each($scope.roles, function (_i, _d) {
                var row = { Id: _d.Id, Name2: _d.Name2, Selected: 0 ,Name:_d.Name,userId:id};
                var exist = Enumerable.From(data).Where("$.RoleId=='" + _d.Id + "'").FirstOrDefault();
                if (exist)
                    row.Selected = 1;
                ds.push(row);
            });
            ds = Enumerable.From(ds).OrderBy('$.Name2').ToArray();
            $scope.dg_flight_ds = ds;
            $scope.getUserClaims(id, function (data2) {
                data2 = Enumerable.From(data2).OrderBy('$.Name').ToArray();
                $scope.dg_claims_ds = data2;
            });
        });
    };
    $scope.getCrewFlights = function (id, df, dt) {
        $scope.dg_flight_ds = null;
        var offset = -1 * (new Date()).getTimezoneOffset();
        $scope.loadingVisible = true;
        flightService.getCrewFlights(id, df, dt).then(function (response) {
            console.log(response);
            $scope.loadingVisible = false;
            $.each(response, function (_i, _d) {
                _d.Route = _d.FromAirportIATA + '-' + _d.ToAirportIATA;
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
                _d.ScheduledFlightTime2 = $scope.formatMinutes(_d.ScheduledFlightTime);

                var bm = _d.ActualFlightHOffBlock * 60 + _d.ActualFlightMOffBlock;
                //_d.BlockTime = pad(Math.floor(bm / 60)).toString() + ':' + pad(bm % 60).toString();
                _d.BlockTime2 = $scope.formatMinutes(_d.BlockTime);
                _d.SITATime2 = $scope.formatMinutes(_d.SITATime);
                _d.FixTime2 = $scope.formatMinutes(_d.FixTime);
                _d.Duty2 = pad(Math.floor(_d.Duty / 60)).toString() + ':' + pad(_d.Duty % 60).toString();
                //poosk
            });
            $scope.dg_flight_ds = response;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
    };

     
    //////////////////////////////////
    $scope.nameChanged = function () {
        if ($scope.IsEdit)
            return;
        if (!$scope.dto.FirstName && !$scope.dto.LastName)
        {
            $scope.dto.UserName = '';
            return;
        }
        $scope.dto.UserName = $scope.dto.FirstName.replace(/\s/g, '').substr(0, 1) + '.' + $scope.dto.LastName.replace(/\s/g, '');
    };
    $scope.IsDisabled = false;
    $scope.txt_FirstName = {
        hoverStateEnabled: false,

        valueChangeEvent: 'keyup',
        onValueChanged:function(e){
            $scope.nameChanged();
        },
        bindingOptions: {
            value: 'dto.FirstName',
            readOnly: 'IsDisabled',
            disabled: 'isPropDisabled',

        }
    };
    $scope.txt_LastName = {
        hoverStateEnabled: false,
        valueChangeEvent: 'keyup',
        onValueChanged: function (e) {
            $scope.nameChanged();
        },
        bindingOptions: {
            value: 'dto.LastName',
            readOnly: 'IsDisabled',
            disabled: 'isPropDisabled',
        }
    };
    $scope.txt_Email = {
        mode: 'email',
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'dto.Email',

        }
    };
    $scope.txt_UserName = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'dto.UserName',

        }
    };
    $scope.txt_phone = {
        hoverStateEnabled: false,
        
        bindingOptions: {
            value: 'dto.PhoneNumber',
            disabled: 'isPropDisabled',
        }
    };
    $scope.txt_Password = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'dto.Password',
            

        }
    };
    $scope.newPassword = '';
    $scope.txt_newPassword = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'newPassword',


        }
    };
    $scope.tag_roles= {
        displayExpr: 'Name2',
        valueExpr: 'Name',
        hideSelectedItems: true,
        searchEnabled: true,
        bindingOptions: {
            dataSource: 'roles',
            value:'dto.Roles',

        }
    };
    $scope.sb_airport = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceAirport(),
        
        
        searchExpr: ["IATA", "Country", "SortName", "City"],
        displayExpr: "IATA",
        valueExpr: 'IATA',
        bindingOptions: {
            value: 'dto.Station',


        }
    };
    //////////////////////////////////////
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_instance = null;
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,
        width: 500,
        height: 550,
        toolbarItems: [

            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'useradd', bindingOptions: {} }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {


        },
        onHiding: function () {

            // $scope.clearEntity();
            $scope.dg_flight_total_ds = null;
            $scope.dg_flight_ds = null;
            $scope.getUsers();
            $scope.popup_add_visible = false;

        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        bindingOptions: {
            visible: 'popup_add_visible',

        }
    };
    $scope.popup_add.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_add_visible = false;
    };

    //save button
    $scope.popup_add.toolbarItems[0].options.onClick = function (e) {
        //sook
       // alert($scope.dto.Roles);
        var result = e.validationGroup.validate();

        if (!result.isValid) {
            General.ShowNotify(Config.Text_FillRequired, 'error');
            return;
        }
        $scope.dto.Email = $scope.dto.FirstName.replace(/\s/g, '') + '.' + $scope.dto.LastName.replace(/\s/g, '') + '@airpocket.ir';
        $scope.loadingVisible = true;
        if (!$scope.IsEdit) {
            if ($scope.personId)
                $scope.dto.PersonId = $scope.personId;
            else
                $scope.dto.PersonId = -1;
            authService.register2($scope.dto).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dto = {
                    Id: null,
                    UserName: '',
                    FirstName: '',
                    LastName: '',
                    Email: '',
                    PhoneNumber:'',
                    Password: '1234@aA', //generatePassword(),
                    Station:'',
                    Roles: null,
                    PersonId:null,
                };
                $scope.personId = null;
                console.log(response);


            },
                     function (err) {
                         $scope.loadingVisible = false;
                         $scope.message = err.message;
                         General.ShowNotify(err.message, 'error');

                     });
        }
        else
        {
            console.log($scope.dto);
            if ($scope.personId)
                $scope.dto.PersonId = $scope.personId;
            else
                $scope.dto.PersonId = -1;
            authService.updateUser($scope.dto).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dto = {
                    Id:null,
                    UserName: '',
                    FirstName: '',
                    LastName: '',
                    Email: '',
                    PhoneNumber: '',
                    Station: '',
                    Password: '1234@aA', //generatePassword(),
                    Roles: null,
                };
                $scope.popup_add_visible = false;


            },
                                function (err) {
                                    $scope.loadingVisible = false;
                                    $scope.message = err.message;
                                    General.ShowNotify(err.message, 'error');

                                });
        }
        

    };
    /////////////////////////////////////

    $scope.popup_rep_visible = false;
    $scope.popup_report_title = 'Report';

    $scope.popup_rep  = {

        fullScreen: false,
        showTitle: true,
        width: 1100,
        height: 800,
        toolbarItems: [

           // { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'password', bindingOptions: {} }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {


        },
        onHiding: function () {

            // $scope.clearEntity();

            $scope.popup_rep_visible = false;

        },
        onContentReady: function (e) {

        },
        bindingOptions: {
            visible: 'popup_rep_visible',

        }
    };
    $scope.popup_rep.toolbarItems[0].options.onClick = function (e) {

        $scope.popup_rep_visible = false;
    };

    $scope.dg_raw_selected = null;
    $scope.dg_raw_instance = null;
    $scope.dg_raw_ds = null;
    $scope.dg_raw = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: {
            mode: "single"
        },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        //3-16
        selection: { mode: 'single' },

        columnAutoWidth: true,
        height:500,

        //columns: $scope.dg_columns2,
        onContentReady: function (e) {
            if (!$scope.dg_raw_instance)
                $scope.dg_raw_instance = e.component;

        },
        onSelectionChanged: function (e) {
            


        },
        "export": {
            enabled: true,
            fileName: "Report",
            allowExportSelectedData: true
        },

        onCellClick: function (e) {

        },

        editing: {
            allowUpdating: false,
            mode: 'cell'
        },
        bindingOptions: {
            dataSource: 'dg_raw_ds'
        }
    };

    //////////////////////////////////////
    $scope.popup_password_visible = false;
    $scope.popup_password_title = 'Password';
    
    $scope.popup_password = {

        fullScreen: false,
        showTitle: true,
        width: 400,
        height: 200,
        toolbarItems: [

            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'password', bindingOptions: {} }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {


        },
        onHiding: function () {

            // $scope.clearEntity();
             
            $scope.popup_password_visible = false;

        },
        onContentReady: function (e) {
           
        },
        bindingOptions: {
            visible: 'popup_password_visible',

        }
    };
    $scope.popup_password.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_password_visible = false;
    };

    //save button
    $scope.popup_password.toolbarItems[0].options.onClick = function (e) {
        //sook
        // alert($scope.dto.Roles);
        var result = e.validationGroup.validate();

        if (!result.isValid) {
            General.ShowNotify(Config.Text_FillRequired, 'error');
            return;
        }
        var dto={Id:$scope.selected.Id,Password:$scope.newPassword}
        
        $scope.loadingVisible = true;
        authService.setPassword(dto).then(function (response) {
            $scope.loadingVisible = false;
            $scope.newPassword = '';
            $scope.popup_password_visible = false;


        },
                  function (err) {
                      $scope.loadingVisible = false;
                      $scope.message = err.message;
                      General.ShowNotify(err.message, 'error');

                  });

    };
    /////////////////////////////
    $scope.popup_role_visible = false;
    $scope.popup_role_title = 'Roles';

    $scope.popup_role = {

        fullScreen: false,
        showTitle: true,
        width: 900,
        height: 600,
        toolbarItems: [

          //  { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'password', bindingOptions: {} }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {
            $scope.dg_role_instance.repaint();
            $scope.dg_rc_instance.repaint();

        },
        onHiding: function () {

            // $scope.clearEntity();

            $scope.popup_role_visible = false;

        },
        onContentReady: function (e) {

        },
        bindingOptions: {
            visible: 'popup_role_visible',

        }
    };
    $scope.popup_role.toolbarItems[0].options.onClick = function (e) {

        $scope.popup_role_visible = false;
    };

    //save button
    //$scope.popup_password.toolbarItems[0].options.onClick = function (e) {
    //    //sook
    //    // alert($scope.dto.Roles);
    //    var result = e.validationGroup.validate();

    //    if (!result.isValid) {
    //        General.ShowNotify(Config.Text_FillRequired, 'error');
    //        return;
    //    }
    //    var dto = { Id: $scope.selected.Id, Password: $scope.newPassword }

    //    $scope.loadingVisible = true;
    //    authService.setPassword(dto).then(function (response) {
    //        $scope.loadingVisible = false;
    //        $scope.newPassword = '';
    //        $scope.popup_password_visible = false;


    //    },
    //              function (err) {
    //                  $scope.loadingVisible = false;
    //                  $scope.message = err.message;
    //                  General.ShowNotify(err.message, 'error');

    //              });

    //};
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
    //////////////////////////////////
    $scope.dg_flight_total_columns = [

        { dataField: 'LockoutEnabled', caption: 'DIS', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, fixed: false, fixedPosition: 'left',width:90 },
         { dataField: 'UserName', caption: 'UserName', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left',width:170  },
        { dataField: 'LastName', caption: 'Last Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left',width:200 },
        { dataField: 'FirstName', caption: 'First Name', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left',width:200 },
           
            { dataField: 'PhoneNumber', caption: 'Phone', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left',width:120   },
        // { dataField: 'Email', caption: 'Email', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', width: 300 },



    ];

    $scope.dg_flight_total_selected = null;
    $scope.dg_flight_total_instance = null;
    $scope.dg_flight_total_ds = null;
    $scope.dg_flight_total = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: {
            mode: "multiple"
        },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 140,

        columns: $scope.dg_flight_total_columns,
        onContentReady: function (e) {
            if (!$scope.dg_flight_total_instance)
                $scope.dg_flight_total_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_flight_ds = null;
                $scope.dg_flight_total_selected = null;
                 
            }
            else {
                $scope.dg_flight_total_selected = data;
                $scope.fillUserRoles(data.Id);
            }

            //nono

        },
        summary: {
            totalItems: [{
                name: "FlightTimeTotal",
                showInColumn: "FlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            },
            {
                name: "SITATimeTotal",
                showInColumn: "SITATime2",
                displayFormat: "{0}",

                summaryType: "custom"
            }
                ,
            {
                name: "FixTimeTotal",
                showInColumn: "FixTime2",
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

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "SITATimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.SITATime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "FixTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FixTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }



            }
        },
        "export": {
            enabled: true,
            fileName: "Users",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                       // .addClass("informer")
                        .append(
                           "<span style='color:white;'>Users</span>"
                        );
                }
            });
        },
        onExporting: function (e) {
            e.component.beginUpdate();
            e.component.columnOption("row", "visible", false);
        },
        onExported: function (e) {
            e.component.columnOption("row", "visible", true);
            e.component.endUpdate();
        },
        onRowPrepared: function (e) {
            if (e.rowType === "data" && e.data.PersonId) {
               
                e.rowElement.css("backgroundColor", "#b3ffcc");
            }
            if (e.rowType === "data" && e.data.LockoutEnabled) {

                e.rowElement.css("backgroundColor", "#666666");
                e.rowElement.css("color", "white");
            }
            //42 %  10

        },
        bindingOptions: {
            dataSource: 'dg_flight_total_ds'
        }
    };
    //////////////////////////////////
    $scope.dg_flight_columns = [
               { dataField: 'Selected', caption: '', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, fixed: false, fixedPosition: 'left' ,width:90},
          { dataField: 'Name2', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false,  fixed: false, fixedPosition: 'left' },
             

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

        columnAutoWidth: false,
        height: $(window).height() - 140,

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
        onCellClick: function (e) {
            //kar
            if (e.rowType != 'data')
                return;
            if (e.column.dataField != 'Selected')
                return;

            
            var old = e.value;
            var newValue = e.value == 0 ? 1 : 0;
            var dto = {userId:e.data.userId,role:e.data.Name};
            if (newValue == 1) {
                $scope.loadingVisible = true;
                authService.addUserRole(dto).then(function (response) {
                    $scope.loadingVisible = false;
                    e.data.Selected = newValue;
                    
                },
                  function (err) {
                        $scope.loadingVisible = false;
                          $scope.message = err.message;
                          General.ShowNotify(err.message, 'error');

                });
            }
            else
            {
                $scope.loadingVisible = true;
                authService.removeUserRole(dto).then(function (response) {
                    $scope.loadingVisible = false;
                    e.data.Selected = newValue;
                },
                  function (err) {
                      $scope.loadingVisible = false;
                      $scope.message = err.message;
                      General.ShowNotify(err.message, 'error');

                  });
            }
           
        },
        summary: {
            totalItems: [{
                name: "BlockTimeTotal",
                showInColumn: "BlockTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            }, {
                name: "FlightTimeTotal",
                showInColumn: "ScheduledFlightTime2",
                displayFormat: "{0}",

                summaryType: "custom"
            },
                {
                    name: "SITATimeTotal",
                    showInColumn: "SITATime2",
                    displayFormat: "{0}",

                    summaryType: "custom"
                }
                ,
                {
                    name: "FixTimeTotal",
                    showInColumn: "FixTime2",
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

                        options.totalValueMinutes = options.totalValueMinutes + options.value.ScheduledFlightTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "SITATimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.SITATime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }

                if (options.name === "FixTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.FixTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }
                if (options.name === "BlockTimeTotal") {
                    if (options.summaryProcess === "start") {
                        options.totalValueMinutes = 0;
                        options.totalValue = '';

                    }
                    if (options.summaryProcess === "calculate") {

                        options.totalValueMinutes = options.totalValueMinutes + options.value.BlockTime;
                        options.totalValue = pad(Math.floor(options.totalValueMinutes / 60)).toString() + ':' + pad(options.totalValueMinutes % 60).toString();



                    }
                }


            }
        },
        "export": {
            enabled: false,
            fileName: "CREW_TIMES",
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift({
                location: "before",
                template: function () {
                    return $("<div/>")
                       // .addClass("informer")
                        .append(
                           "<span style='color:white;'>User Roles</span>"
                        );
                }
            });
        },
        onExporting: function (e) {
            e.component.beginUpdate();
            e.component.columnOption("row", "visible", false);
        },
        onExported: function (e) {
            e.component.columnOption("row", "visible", true);
            e.component.endUpdate();
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.IsPositioning)
                e.rowElement.css('background', '#ffccff');

        },
        bindingOptions: {
            dataSource: 'dg_flight_ds'
        }
    };
    ////////////////////////////////////
    $scope.dg_claims_columns = [
        {
            caption: 'User Access', columns: [
                  { dataField: 'Name', caption: 'Role', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left',   },

         { dataField: 'ClaimValue', caption: 'Module', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
          { dataField: 'Claim', caption: 'Access', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },

            ]
        },
          

    ];

    $scope.dg_claims_selected = null;
    $scope.dg_claims_instance = null;
    $scope.dg_claims_ds = null;
    $scope.dg_claims = {
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

        columnAutoWidth: false,
        height: $(window).height() - 140,

        columns: $scope.dg_claims_columns,
        onContentReady: function (e) {
            if (!$scope.dg_claims_instance)
                $scope.dg_claims_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_claims_selected = null;
            }
            else
                $scope.dg_claims_selected = data;


        },
        
        "export": {
            enabled: false,
            fileName: "CREW_TIMES",
            allowExportSelectedData: false
        },
        //onToolbarPreparing: function (e) {
        //    e.toolbarOptions.items.unshift({
        //        location: "before",
        //        template: function () {
        //            return $("<div/>")
        //               // .addClass("informer")
        //                .append(
        //                   "<span style='color:white;'>User Roles</span>"
        //                );
        //        }
        //    });
        //},
        onExporting: function (e) {
            e.component.beginUpdate();
            e.component.columnOption("row", "visible", false);
        },
        onExported: function (e) {
            e.component.columnOption("row", "visible", true);
            e.component.endUpdate();
        },
        onRowPrepared: function (e) {
            if (e.data && e.data.IsPositioning)
                e.rowElement.css('background', '#ffccff');

        },
       
        bindingOptions: {
            dataSource: 'dg_claims_ds'
        }
    };
    /////////////////////////////////
    $scope.dg_rc_columns = [
        {
            caption: 'Role Access', columns: [
                //  { dataField: 'Name', caption: 'Role', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', },

         { dataField: 'ClaimValue', caption: 'Module', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },
          { dataField: 'Claim', caption: 'Access', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left' },

            ]
        },


    ];

    $scope.dg_rc_selected = null;
    $scope.dg_rc_instance = null;
    $scope.dg_rc_ds = null;
    $scope.dg_rc = {
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

        columnAutoWidth: false,
        height:480,

        columns: $scope.dg_rc_columns,
        onContentReady: function (e) {
            if (!$scope.dg_rc_instance)
                $scope.dg_rc_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_rc_selected = null;
            }
            else
                $scope.dg_rc_selected = data;


        },

        
         

        bindingOptions: {
            dataSource: 'dg_rc_ds'
        }
    };
    /////////////////////////////////
    $scope.dg_role_columns = [
       
           { dataField: 'Name', caption: 'Role', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, fixed: false, fixedPosition: 'left', },

      


    ];

    $scope.dg_role_selected = null;
    $scope.dg_role_instance = null;
    $scope.dg_role_ds = null;
    $scope.dg_role = {
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

        columnAutoWidth: false,
        height: 480,

        columns: $scope.dg_role_columns,
        onContentReady: function (e) {
            if (!$scope.dg_role_instance)
                $scope.dg_role_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_role_selected = null;
                $scope.dg_rc_ds = null;
            }
            else {
                $scope.dg_role_selected = data;
                $scope.getRoleClaims(data.Id, function (_dt) {
                    $scope.dg_rc_ds = _dt;
                });
            }



        },




        bindingOptions: {
            dataSource: 'roles'
        }
    };
    //////////////////////////////////
    if (!authService.isAuthorized()) {

        authService.redirectToLogin();
        
    }
    else if ($rootScope.userName.toLowerCase() != 'razbani' && $rootScope.userName.toLowerCase() != 'demo')
        $rootScope.navigatehome();
    else {
        $rootScope.page_title = '> Users';


        $('.users').fadeIn(400, function () {
            $scope.getRoles();
        });
    }
    //////////////////////////////////////////

    $scope.$on('$viewContentLoaded', function () {


    });

    $rootScope.$broadcast('CrewTimeReportLoaded', null);

}]);