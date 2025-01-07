'use strict';
app.controller('qaOperationPopup', ['$scope', 'qaService', '$routeParams', '$rootScope','$window', function ($scope, qaService, $routeParams, $rootScope, $window) {
     

    $scope.isNotLocked = true;
    //$scope.Type = null;
    $scope.Type = $routeParams.type;
	$scope.isResponsible = false;

    $scope.popup_operation_visible = false;
    $scope.popup_height = $(window).height() - 100;
    $scope.popup_width = 1500;
    $scope.popup_operation_title = $rootScope.Title;
    $scope.popup_instance = null;
    $scope.isFullScreen = true;

    $scope.popup_operation = {


        showTitle: true,

        toolbarItems: [

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Refere', onClick: function (e) {

                        $rootScope.$broadcast('InitQAEmployee', { Type: $scope.tempData.Type, Id: $scope.tempData.Id, Category: $scope.tempData.Category });
                        if ($scope.tempData.Category == 'new')
                            $scope.tempData.Category = 'open'

                    }
                }, toolbar: 'bottom'
            },
             
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Close The Report', validationGroup: 'result', onClick: function (e) {


                        $scope.entity.Category = $scope.tempData.Category;
                        $scope.entity.Id = $scope.tempData.Id;
                        $scope.entity.Type = $scope.tempData.Type;
                        $scope.entity.EmployeeId = $scope.tempData.EmployeeId;
                        $scope.entity.isResponsible = $scope.isResponsible;
                        $scope.entity.Result = $rootScope.result.Result;
                        General.Confirm("Are You Sure?", function (res) {
                            if (res) {
                                $scope.loadingVisible = true;
                                qaService.acceptQA($scope.entity).then(function (response) {
                                    $scope.loadingVisible = false;
                                    $rootScope.result.Result = null;
                                    General.ShowNotify(Config.Text_SavedOk, 'success');
                                    if ($scope.isResponsible == true) {

                                        if (response.IsSuccess == true && $scope.tempData.Category == 'open') {
                                            var row = Enumerable.From($rootScope.dg_open_ds).Where("$.Id==" + $scope.entity.Id).FirstOrDefault();
                                            row.Status = "Closed";
                                            row.EmployeeStatus = "Closed";
                                            row.Status = 1;
                                            $rootScope.dg_determined_ds.push(row);
                                            $rootScope.dg_open_ds = Enumerable.From($rootScope.dg_open_ds).Where(function (x) {
                                                return x.Id != $scope.entity.Id;
                                            }).ToArray();
                                        }

                                        if (response.IsSuccess == true && $scope.tempData.Category == 'new') {
                                            var row = Enumerable.From($rootScope.dg_new_ds).Where("$.Id==" + $scope.entity.Id).FirstOrDefault();
                                            row.Status = "Closed";
                                            row.EmployeeStatus = "Closed";
                                            row.Status = 1;
                                            $scope.tempData.Category = "open";
                                            $rootScope.dg_determined_ds.push(row);
                                            $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds).Where(function (x) {
                                                return x.Id != $scope.entity.Id;
                                            }).ToArray();
                                        }
                                    } else {
                                        if (response.IsSuccess == true && $scope.tempData.Category == 'open') {
                                            var row = Enumerable.From($rootScope.dg_open_ds).Where("$.Id==" + $scope.entity.Id).FirstOrDefault();
                                            row.Status = "Closed";
                                            row.EmployeeStatus = "Closed";
                                            $rootScope.dg_determined_ds.push(row);
                                            $rootScope.dg_open_ds = Enumerable.From($rootScope.dg_open_ds).Where(function (x) {
                                                return x.Id != $scope.entity.Id;
                                            }).ToArray();
                                        }

                                        if (response.IsSuccess == true && $scope.tempData.Category == 'new') {
                                            var row = Enumerable.From($rootScope.dg_new_ds).Where("$.Id==" + $scope.entity.Id).FirstOrDefault();
                                            row.Status = "Closed";
                                            row.EmployeeStatus = "Closed";
                                            $rootScope.dg_determined_ds.push(row);
                                            $rootScope.dg_new_ds = Enumerable.From($rootScope.dg_new_ds).Where(function (x) {
                                                return x.Id != $scope.entity.Id;
                                            }).ToArray();
                                        }
                                    }
                                });
                            }

                        });
                    }
                }, toolbar: 'bottom'
            },
			{
                widget: 'dxButton', location: 'before' ,options: {
                    type: 'default' , text: 'Print', onClick: function (e) {

                      //qaService.qa_print_xls($scope.tempData.Id).then(function(response){
					  //console.log(response); 
					  //});
						if($scope.tempData.Type == 3){
						   $window.open('https://report.apvaresh.com/frmreportview.aspx?type=mor&fid='+ $scope.tempData.Id, '_blank')
						}else if($scope.tempData.Type == 0){
							$window.open('https://report.apvaresh.com/frmreportview.aspx?type=csr&fid=' + $scope.tempData.Id, '_blank')
						}else{
							return;
						}
                    }
                }, toolbar: 'bottom',
				
              
            },
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $rootScope.IsRootSyncEnabled = false;
            $scope.popup_instance.repaint();


        },
        onShown: function (e) {

            if ($scope.isNew) {
                $scope.isContentVisible = true;
            }
            if ($scope.tempData != null)
                $scope.bind();

            //$rootScope.referred_list_instance.repaint();
            //$rootScope.$broadcast('InitTest', $scope.tempData);



        },
        onHiding: function () {
            $scope.entity = {
                Id: -1,
                EventTitleIds: [],

            };
            $scope.entity.Result = null;
            $scope.popup_operation_visible = false;
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        // fullScreen:false,
        bindingOptions: {
            visible: 'popup_operation_visible',
            fullScreen: 'isFullScreen',
            title: 'popup_operation_title',
            height: 'popup_height',
            width: 'popup_width',
            'toolbarItems[0].visible': 'isNotLocked',
            //'toolbarItems[1].visible': 'isNotLocked',
            'toolbarItems[2].visible': 'isNotLocked',

        }
    };

    $scope.bind = function () {
        qaService.getIsResponsible($scope.tempData.EmployeeId, $scope.tempData.Type, $scope.tempData.Id).then(function (response) {
            if (response.IsSuccess == true)
                $scope.isResponsible = true
        });
    }



    $scope.$on('InitOperationPopup', function (event, prms) {

		$scope.tempData = prms;
		console.log("tempData",$scope.tempData);
		
        $scope.Type = $scope.tempData.Type;
        $scope.isNotLocked = $scope.tempData.isNotLocked

        $scope.popup_operation_visible = true;
    });

    $scope.cabinLoaded = function () {
        $rootScope.$broadcast('InitQACabin', $scope.tempData);
        qaService.setReceiverLog($scope.tempData.Entity.FollowingId).then(function (res) {
            console.log(res);
        });
    }

    $scope.cateringLoaded = function () {
        $rootScope.$broadcast('InitQACatering', $scope.tempData);
        qaService.setReceiverLog($scope.tempData.Entity.FollowingId).then(function (res) {
            console.log(res);
        });
    }

    $scope.securityLoaded = function () {
        $rootScope.$broadcast('InitQASecurity', $scope.tempData);
        qaService.setReceiverLog($scope.tempData.Entity.FollowingId).then(function (res) {
            console.log(res);
        });
    }

    $scope.maintenanceLoaded = function () {
        $rootScope.$broadcast('InitQAMaintenance', $scope.tempData);
        qaService.setReceiverLog($scope.tempData.Entity.FollowingId).then(function (res) {
            console.log(res);
        });
    }

    $scope.dispatchLoaded = function () {
        $rootScope.$broadcast('InitQADispatch', $scope.tempData);
        qaService.setReceiverLog($scope.tempData.Entity.FollowingId).then(function (res) {
            console.log(res);
        });
    }

    $scope.groundLoaded = function () {
        console.log($scope.tempData);
        $rootScope.$broadcast('InitQAGround', $scope.tempData);
        qaService.setReceiverLog($scope.tempData.Entity.FollowingId).then(function (res) {
            console.log(res);
        });
    }

    $scope.voluntaryLoaded = function () {
        $rootScope.$broadcast('InitVHR', $scope.tempData);
        qaService.setReceiverLog($scope.tempData.Entity.FollowingId).then(function (res) {
            console.log(res);
        });
    }

    $scope.cyberLoaded = function () {
        $rootScope.$broadcast('InitQACyberSecurity', $scope.tempData);
        qaService.setReceiverLog($scope.tempData.Entity.FollowingId).then(function (res) {
            console.log(res);
        });
    }
	
    $scope.asrLoaded = function () {

        console.log($scope.tempData);
        $rootScope.$broadcast('InitEfbAsr', $scope.tempData);
        qaService.setReceiverLog($scope.tempData.Entity.FollowingId).then(function (res) {
            console.log(res);
        });
}
	 $scope.vrLoaded = function () {
         $rootScope.$broadcast('InitVoyage', $scope.tempData);
         qaService.setReceiverLog($scope.tempData.Entity.FollowingId).then(function (res) {
             console.log(res);
         });
 }

}]);


