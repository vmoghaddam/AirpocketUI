app.controller("filterController", function ($scope, $rootScope, $routeParams, $location) {
   
    var url = $location.url();
    $('.' + $scope.type).show();
    $scope.table = Enumerable.From(Config.Types).Where("$.type =='" + $scope.type + "'").FirstOrDefault();
    if ($scope.table)
        $scope.table = $scope.table.table;


    $scope.stringOperatorDs = [{ Id: 1, Title: 'Contains' }, { Id: 2, Title: 'Starts with' }, { Id: 3, Title: 'Ends with' },];
    $scope.numberOperatorDs = [{ Id: 4, Title: 'Equals' }, { Id: 5, Title: '>' }, { Id: 6, Title: '<' },];

    $scope.operatorName = 1;
    ////////////////////////////////////////
    $scope.sb_city = {
        showClearButton: true,
        
        searchEnabled: true,

        dataSource: new DevExpress.data.DataSource({
            store: new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/cities/all',
                version: 4
            }),
            sort: ['City'],
        }),
        searchExpr: ["City", "Country"],
        valueExpr: "Id",
        searchMode: 'startsWith',
        displayExpr: "FullName",
      

    };
    $scope.sb_location = {
        dataSource: $rootScope.getDatasourceLoctionCustomer(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateLocation2(data);
        },
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title", "FullCode"],
        valueExpr: "Id",
        displayExpr: "Title",
        bindingOptions: {
            value: 'entity.LocationId',
            readOnly: 'IsMainDisabled',
        }

    };
    ////////////////////////////////////////
    this.$onInit = function () {
        // console.log('$onInit');
        // $('.sboption').dxSelectBox("instance").option('dataSource', $scope.stringOperatorDs);
    };
    this.$postLink = function () {
        //// use `this.selected` passed down from bindings: {}
        //// a safer option would be to parseInt(this.selected, 10)
        //// to coerce to a Number to lookup the Array index, however
        //// this works just fine for the demo :)
        ////  console.log('$postLink');
        ////$('.sboption').dxSelectBox("instance").option('dataSource', $scope.stringOperatorDs);
        $('.sboption').each(function (e) {
            var pid = $(this).attr('pid');
            $(this).dxSelectBox("instance").option('dataSource', $rootScope.getDatasourceOption(Number(pid)))
        });
        //$('.sbcoding').each(function (e) {

        //    $(this).dxSelectBox("instance").option('dataSource', $rootScope.getCodingDatasource())
        //});
        //$('.sbdowry').each(function (e) {

        //    // $(this).dxSelectBox("instance").option('dataSource', $rootScope.getCodingDatasource())
        //});
        //$('.sbbasket').each(function (e) {

        //    // $(this).dxSelectBox("instance").option('dataSource', $rootScope.getCodingDatasource())
        //});
        //$('.sbmonth').each(function (e) {

        //    $(this).dxSelectBox("instance").option('dataSource', General.MonthDataSource)
        //});
        //$('.sbemployee').each(function (e) {

        //    $(this).dxSelectBox("instance").option('dataSource', $rootScope.getEmployeeDatasource(Config.User.currentLocationId))
        //});
        $('.sbcity').each(function (e) {

           // $(this).dxSelectBox("instance").option('dataSource', $rootScope.getCityDatasource())
        });
    };
    //$('.sboption').each(function (e) {
    //    var pid = $(this).attr('pid');
    //  $(this).dxSelectBox("instance").option('dataSource', $rootScope.getDatasource_Option(Number(pid)))
    //});
    $scope.onOptionInitialized = function (e) {
        var pid = $(e.element).attr('pid');
        // $(e.element).dxSelectBox("instance").option('dataSource', $scope.stringOperatorDs);
        // console.log(e.component.option('dataSource'));
        // console.log('onOptionInitialized');
    };

   

    $scope.getOperatorStr = function (n) {
        switch (n) {
            case 1:
                return 'contains';
            case 2:
                return 'startswith';
            case 3:
                return 'endswith';
            case 4:
                return '=';
            case 5:
                return '>';
            case 6:
                return '<';
            default:
                return '';
        }
    };
    $scope.getIdStr = function (id) {
        //Enumerable.From($scope.entity.Reletives).Where("$.Id !=  " + $scope.dg_children_selected.Id).ToArray();
        if (!$scope.table)
            return id;
        var item = Enumerable.From(Config.Fields).Where("$.key ==  '" + id + "'").FirstOrDefault();
        if (item)
            return item.value;
        else
            return id;



    };
    $scope.$on('getFilterQuery', function (event, prms) {


        var filter = [];
        $('.item').each(function (e) {
            // alert('x');

            var value = '';
            var id = $(this).attr('id');
            var operator = $(this).find('.operator').dxSelectBox("instance");
            var operatorValue = operator.option('value');
            var texteditor = $(this).find('.text');
            var dateeditor = $(this).find('.date');
            var numbereditor = $(this).find('.number');
            var optioneditor = $(this).find('.sb');
            var type = null;


            if (texteditor.length > 0) {
                 
                var editor = texteditor.dxTextBox("instance");
                
                value = editor.option('value'); type = 'text';
                
            }
            else if (dateeditor.length > 0) { value = dateeditor.dxDateBox("instance").option('value'); type = 'date'; }
            else if (numbereditor.length > 0) { value = numbereditor.dxNumberBox("instance").option('value'); type = 'number'; }
            else if (optioneditor.length > 0) { value = optioneditor.dxSelectBox("instance").option('value'); type = 'number'; }
            if (value && value != 'null') {
                var row = [];
                var idstr = $scope.getIdStr(id);

                row.push(idstr);
                row.push($scope.getOperatorStr(operatorValue));
                if (type == 'number')
                    row.push(Number(value));
                else
                    row.push(value);
                filter.push(row);
                filter.push('and');
            }
        });
        if (filter.length > 0)
            filter.splice(-1, 1);
         
        $rootScope.$broadcast('getFilterResponse', filter);
    });

    $scope.values = {
         TypeId:null,
    };


    $scope.$on('initFilters', function (event, prms) {
        var key = prms.key;
        $.each(prms.values, function (_i, _d) {
            if (_d.value && _d.value != -1) {
                $scope.values[_d.id] = _d.value;
                $('#' + _d.id).hide();
            }

        });
        
        //$.each(prms.values, function (_i, _d ) {
        //    //alert(_d.id + '  ' + _d.value);
        //    if (_d.value && _d.value != -1) {
        //        var $elem = $('#' + _d.id);
        //        console.log($elem.find('.operator'));
        //        var operator = $elem.find('.operator').dxSelectBox("instance");
        //        // var operatorValue = operator.option('value');
        //        var texteditor = $elem.find('.text');
        //        var dateeditor = $elem.find('.date');
        //        var numbereditor = $elem.find('.number');
        //        var optioneditor = $elem.find('.sb');
        //        if (texteditor.length > 0) {

        //            var editor = texteditor.dxTextBox("instance");

        //            value = editor.option('value'); type = 'text';

        //        }
        //        else if (dateeditor.length > 0) {
        //            value = dateeditor.dxDateBox("instance").option('value');
        //            type = 'date';
        //        }
        //        else if (numbereditor.length > 0) {
        //            value = numbereditor.dxNumberBox("instance").option('value');
        //            type = 'number';
        //        }
        //        else if (optioneditor.length > 0) {
        //            alert('x');
        //            optioneditor.dxSelectBox("instance").option('value', _d.value);
        //            operator.option('value', 4);
        //        }
        //    }
            

        //});
    });

    //$scope.$on('getFilterQuery', function (event, prms) {
    //    $rootScope.$broadcast('getFilterResponse', []);
    //});

    $rootScope.$broadcast('FilterLoaded', null);
    //end scope
});