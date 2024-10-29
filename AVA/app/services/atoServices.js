'use strict';
app.factory('atoService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {
    var serviceFactory = {};

    var _save_question_answer = function (entity) {
        var deferred = $q.defer();
        console.log('----service----', entity)
        $http.post("https://ava.apitrn.airpocket.app/api/exam/student/answer", entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(getMessage(err));
        });

        return deferred.promise;
    };

    serviceFactory.save_question_answer = _save_question_answer;


    return serviceFactory;

}]);