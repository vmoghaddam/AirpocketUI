'use strict';
app.controller('trn_zftt', ['$scope', function ($scope) {


    $scope.formData = {
        date: new Date(),
        crewMembersName: '',
        typeOfCheck: '',
        check_list: [],
        wind_mlw: [],
        tow_mlw: [],
        cross_wind: [],
        tail_wind: [],
        mtow_cross: [],
        mtow_tail: [],
        finalAssessment: '',
        comments: '',
        crewMemberSignature: '',
        instructorSignature: ''
    };

    $scope.formData.check_list = [
        { description: 'Taxi to RWY entering with 90° turn to line Up', assessment: '' },
        { description: 'Then Taxi on RWY and back track after a 180° turn on RWY', assessment: '' },
        { description: 'Then Taxi on RWY to perform a line up with 180° turn', assessment: '' },
        { description: 'Take-off', assessment: '' },
        { description: 'VISUAL CIRCUIT, ILS assisted, TOUCH and GO', assessment: '' },
        { description: 'VISUAL CIRCUIT, NON ILS assisted, FULL STOP landing NO Autothrottle', assessment: '' },
        { description: 'VISUAL CIRCUIT, NON ILS assisted, TOUCH AND GO', assessment: '' },
    ];

    $scope.formData.wind_mlw = [
        { description: 'Take Off', assessment: '' },
        { description: 'VISUAL CIRCUIT, NON ILS assisted, CROSS WIND landing', assessment: '' },
    ];

    $scope.formData.tow_mlw = [
        { description: 'Take-off for VISUAL CIRCUIT, NON ILS assisted', assessment: '' },
        { description: 'REJECTED Landing at 50ft', assessment: '' },
        { description: 'VISUAL CIRCUIT, NON ILS assisted and landing', assessment: '' },

    ];

    $scope.formData.cross_wind = [
        { description: 'Take-off with WINDSHEAR and TURBULENCE', assessment: '' },
        { description: 'VISUAL CIRCUIT, NON ILS assisted', assessment: '' },
        { description: 'Landing with REDUCE FLAPS SETTING', assessment: '' },
    ]

    $scope.formData.tail_wind = [
        { description: 'Take-off, ENG FLAME OUT at (V1-10kt)', assessment: '' },
        { description: 'REJECTED TAKE-OFF', assessment: '' },
    ];

    $scope.formData.mtow_cross = [
        { description: 'Take-off with ENG FLAME OUT after landing gear retraction completed then Reduced to MLW', assessment: '' },
        { description: 'Single Engine Operation Visual Circuit, NON ILS assisted', assessment: '' },
        { description: 'GO AROUND from CAT I minimum', assessment: '' },
        { description: 'Single Engine Operation Visual Circuit - NON ILS assisted, Landing', assessment: '' },
    ];

    $scope.formData.mtow_tail = [
        { description: 'TAKE-OFF', assessment: '' },
        { description: 'VISUAL CIRCUIT, NON ILS assisted, landing AT MLW', assessment: '' }

    ]

    $scope.sb_rate = {
        placeholder: '',
        displayExpr: "title",
        valueExpr: 'title',
        dataSource: [{ id: 0, title: 'FL' }, { id: 1, title: 'F' }, { id: 2, title: 'G' }, { id: 3, title: 'VG' }, { id: 4, title: 'O' }],
    }



    $scope.btn_save = {
        onClick: function () {
            console.log("Form Data: ", $scope.formData);
        }
    }
}]);