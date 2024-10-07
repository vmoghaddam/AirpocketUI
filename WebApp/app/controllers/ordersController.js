'use strict';
app.controller('ordersController', ['$scope', '$location', 'ordersService', 'authService', function ($scope, $location, ordersService, authService) {

    // authService.checkAuth();
    if (!authService.isAuthorized()) {
        console.log('redirect');
        authService.redirectToLogin();
    }
    else {
        $('.orders').fadeIn();
        // $location.path('/login');
        // return;
        //alert('vahid');
        //var token = "Xc5DwawK9TbuMk9mE7br03E26exnI9qXk5lriS24HmOHGxkfhyCJllWeQEkKfsaXgvCwr81IcIs2zRnrZKzHU98pqIFuhlu0jIbwDqWbw5A91WzddbosfGyHOKuSx2DvcOz4FMtw-w4kYO-zMO8F42PrpdVrqpoy3EiRIiizsaTHXpytuFULHSflktzOguU-VKoI3aziswhQ1sTE0dZZ8njxQJjfLoYTPtf77pN91EnWJBlgjwEQnO_5LajVtxHL5w5Y0iW58ToJFVEPyvcVCa4-jJ8PJ6LIiDXeNQdLKzttD0oPEFv7IrGWYP82HbRSyUlS3Lf33n8d6uZIFBJev1defuNEGTU3sF8pOixUcN0HqIwDiOD3iPXseBZaDU93xShc9Y15EkvidrQe7PhPfw50t8NX6MI1ObwZs4cca_m-tIymVUBAkfVDai7JoVFaXtWYypmTQ_syothheu7Zxxji2NCCjb0-UPwuZTHp6F5q5SwAhvIlv3CWaxsVzC4ssHL3b_5RpESb1os58YOMcYO3VMDuSqXZ1uG9RroiHTPotyKoYJrUo4x5_VfXc0pq";
        //var headers = { 'Content-Type': 'application/x-www-form-urlencoded'};

        ////  headers.Authorization = 'Bearer ' + token;


        //$.ajax({
        //    type: 'GET',
        //    datatype: "json",
        //    contentType: 'application/json; charset=utf-8',
        //    url:'http://localhost:58908/odata/options/all/1',
        //    headers: headers
        //}).done(function (data) {
        //    console.log(data);

        //    }).fail(function (a, b, c) {
        //        console.log('errorxxx');
        //        console.log(a);
        //        console.log(b);
        //        console.log(c);
        //    });

        ////alert('test');
        ////$.ajax({
        ////    type: 'GET',
        ////    url: 'http://localhost:58908/odata/options/all/1',

        ////    jsonpCallback: 'callback',
        ////    dataType: 'json',
        ////    success: function (data, textStatus, XmlHttpRequest) {


        ////        console.log(data);

        ////    },
        ////    error: function (XMLHttpRequest, textStatus, errorThrown) {

        ////        console.log(XMLHttpRequest);
        ////        console.log(textStatus);
        ////        console.log(errorThrown);
        ////    },
        ////    async: true

        ////});
        //return;
        /////////////////////////////
        $scope.orders = [];

        ordersService.getOrders().then(function (results) {

            $scope.orders = results.data;

        }, function (error) {
            //alert(error.data.message);
        });
    }
    

}]);