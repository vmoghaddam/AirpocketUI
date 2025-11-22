'use strict';
app.controller('testController', ['$scope', 'testService', 'authService', function ($scope, testService,authService) {
    alert(authService.IsAuthurized());
    
    //$scope.orders = [];

    //ordersService.getOrders().then(function (results) {

    //    $scope.orders = results.data;

    //}, function (error) {
    //    //alert(error.data.message);
    //});

}]);