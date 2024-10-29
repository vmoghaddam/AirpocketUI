'use strict';
app.controller('jobgroupSelectSimpleController', ['$scope', '$location', 'authService', '$routeParams', '$rootScope','$http', function ($scope, $location, authService, $routeParams, $rootScope,$http) {



    //////////////////////////
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
    $scope.dg_columns = [
       // { dataField: 'OrderIndex', caption: 'Order', allowResizing: true, alignment: 'left', dataType: 'number', visible: false, allowEditing: false, encodeHtml: false, sortIndex: 0, sortOrder: "asc" },
        //{ dataField: 'Type', caption: 'Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false, width: 200, },
        { dataField: 'Selected', caption: '', allowResizing: true, alignment: 'left', dataType: 'boolean', allowEditing: false, encodeHtml: false,width:70 },
		{ dataField: 'TitleFormated', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false, },
        { dataField: 'FullCode', caption: 'Code', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false, width: 200,  },
		 { dataField: 'Remark', caption: 'Code', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, encodeHtml: false, width: 200, sortIndex: 0, sortOrder: "asc",visible:false },

    ];
    $scope.dg_selected = null;
    $scope.dg_instance = null;
    $scope.dg_ds = null;
	$scope.selectedkeys=[];
    $scope.dg = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',
keyExpr:'Id',
        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'none' },

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_columns,
        onContentReady: function (e) {
            if (!$scope.dg_instance)
                $scope.dg_instance = e.component;

        },
		onCellClick:function(e){
			
			e.data.Selected=!e.data.Selected;
			if (e.data.Selected){
				var _sub=Enumerable.From($scope.dg_ds).Where(function(x){return x.Remark.startsWith(e.data.Remark);}).ToArray();
				   $.each(_sub,function(_j,_x){
					   _x.Selected=true;
				   });
				
			}
			else{
				var _sub=Enumerable.From($scope.dg_ds).Where(function(x){return x.Remark.startsWith(e.data.Remark);}).ToArray();
				   $.each(_sub,function(_j,_x){
					   _x.Selected=false;
				   });
			}
		},
        onSelectionChanged: function (e) {
			console.log('deselect',$scope.dg_instance.currentDeselectedRowKeys);
            var data = e.selectedRowsData;

            if (!data) {
                $scope.dg_selected = null;
            }
            else
			{   
		       $scope.dg_selected = data;
			 
			   $.each(data,function(_i,_d){
				   
				   var _sub=Enumerable.From($scope.dg_ds).Where(function(x){return x.Remark.startsWith(_d.Remark);}).Select('Number($.Id)').ToArray();
				   $.each(_sub,function(_j,_x){$scope.selectedkeys.push(_x);});
			   });
			   console.log($scope.selectedkeys);
			}
			
			
			
			//console.log(data);
          //  console.log('keys',$scope.dg_instance.getSelectedRowKeys());

        },
        bindingOptions: {

            dataSource: 'dg_ds',
            height: 'dg_height',
			selectedRowKeys:'selectedkeys'
        },
        // dataSource:ds

    };

    /////////////////////////////
    $scope.dg_height = 100;
    $scope.pop_width = 850;
    $scope.pop_height = 500;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'Groups';
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            { widget: 'dxButton', location: 'after', options: { type: 'default', text: 'Ok', icon: 'check', bindingOptions: {} }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            var size = $rootScope.getWindowSize();
            if (size.width <= 800) {
                $scope.pop_width = size.width;
                $scope.pop_height = size.height;
            }
            $scope.dg_height = $scope.pop_height - 100;
            //var size = $rootScope.get_windowSizePadding(40);
            //$scope.pop_width = size.width;
            //if ($scope.pop_width > 1200)
            //    $scope.pop_width = 1200;
            //$scope.pop_height = size.height;
            // $scope.dg_height = $scope.pop_height - 140;

        },
        onShown: function (e) {


            $scope.bind();

        },
        onHiding: function () {



            $scope.popup_add_visible = false;

        },
        bindingOptions: {
            visible: 'popup_add_visible',
            width: 'pop_width',
            height: 'pop_height',
            title: 'popup_add_title'
        }
    };

    //close button
    $scope.popup_add.toolbarItems[1].options.onClick = function (e) {

        $scope.popup_add_visible = false;
    };

    //save button
    $scope.popup_add.toolbarItems[0].options.onClick = function (e) {
        //console.log($scope.dg_selected);
		var selected=Enumerable.From($scope.dg_ds).Where('$.Selected').ToArray();
        if (!selected || selected.length==0) {
            General.ShowNotify(Config.Text_NoRowSelected, 'error');
            return;
        }
		
        $rootScope.$broadcast('onJobGroupSelectSimpleHide', selected);
        $scope.popup_add_visible = false;
    };
    ////////////////////////////
    $scope.bind = function () {
		
		 $http.get( $rootScope.serviceUrl + 'odata/base/jobgroups/' + Config.CustomerId).then(function (response) {
           $scope.dg_ds=response.data;
		   $.each($scope.dg_ds,function(_i,_d){
			   
			   _d.Selected=false;
		   });
        }, function (err, status) {

            //deferred.reject(Exceptions.getMessage(err));
        });
		
		return;
        if (!$scope.dg_ds) {
            $scope.dg_ds = {
                store: {
                    type: "odata",
                    //url: $rootScope.serviceUrl + 'odata/base/jobgroups/'+ Config.CustomerId  ,
                    url: $rootScope.serviceUrl + 'odata/base/jobgroups/' + Config.CustomerId,
                    key: ["Id"],
                    version: 4,

                },

            };
        }
        else {
            $scope.dg_instance.clearSelection();
        }



    };
    ////////////////////////////

    $scope.$on('InitJobGroupSelectSimple', function (event, prms) {


        $scope.popup_add_visible = true;

    });
    //////////////////////////////

}]);  