'use statics';
app.controller('trn_lifus', ['$scope', function ($scope) {
    $scope.formData = {
        date: new Date(),
        name: '',
        acType: '',
        instructor: '',
        lifusRole: '',
        sectors: [
            { date: '', flightNo: '', from: '', to: '', flightTime: '', commanderName: '', commanderSignature: '' },
            { date: '', flightNo: '', from: '', to: '', flightTime: '', commanderName: '', commanderSignature: '' },
            { date: '', flightNo: '', from: '', to: '', flightTime: '', commanderName: '', commanderSignature: '' },
            { date: '', flightNo: '', from: '', to: '', flightTime: '', commanderName: '', commanderSignature: '' }
        ],
        preFlightPreparation: {},
        preFlightAtAeroplane: {},
        procedures: {},
        aeroplaneHandling: {},
        operationalProficiency: {},
        backgroundKnowledge: {},
        generalImpression: '',
        instructorSignature: '',
        traineeSignature: ''
    };

}]);