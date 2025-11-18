'use strict';
app.controller('trn_line_check', ['$scope', function ($scope) {
    $scope.formData = {
        date: new Date(),
        name: '',
        codeNo: '',
        location: '',
        acType: '',
        acRegistration: '',
        comments: '',
        signatureCaptain: '',
        signatureIP: '',
        preFlight: [
            { description: 'EFB Usage', rating: '' },
            { description: 'Weather Analysis', rating: '' },
            { description: 'Flight Plan and Fuel Analysis', rating: '' },
            { description: 'Walk-Around', rating: '' },
            { description: 'Technical Log', rating: '' },
            { description: 'Take-off Data and Load Sheet', rating: '' },
            { description: 'Crew Flight Briefing', rating: '' },
            { description: 'Cockpit Set-up', rating: '' },
            { description: 'Start Procedure', rating: '' },
            { description: 'Taxi', rating: '' },
            { description: 'Clearance', rating: '' }
        ],
        takeOff: [
            { description: 'Briefing', rating: '' },
            { description: 'V1, Vr, V2 Compliance', rating: '' },
            { description: 'Thrust Settings', rating: '' },
            { description: 'Engine Monitoring', rating: '' }
        ],
        climb: [
            { description: 'Noise Abatement Procedure', rating: '' },
            { description: 'Flap Retraction Schedule', rating: '' },
            { description: 'Speed and Altitude Control', rating: '' },
            { description: 'Climb Procedure/SID', rating: '' },
            { description: 'Clearance Compliance', rating: '' }
        ],
        cruise: [
            { description: 'En route Procedures', rating: '' },
            { description: 'Fuel Management', rating: '' },
            { description: 'RVSM/BRNAV Procedures', rating: '' },
            { description: 'Weather Management', rating: '' }
        ],
        descent: [
            { description: 'Briefing', rating: '' },
            { description: 'Procedure', rating: '' },
            { description: 'Landing Data', rating: '' },
            { description: 'Procedure Compliance', rating: '' }
        ],
        approach: [
            { description: 'Procedure', rating: '' },
            { description: 'Auto-pilot Operation', rating: '' },
            { description: 'Speed Control', rating: '' },
            { description: 'Altitude Control', rating: '' },
            { description: 'Minima Compliance', rating: '' },
            { description: 'Use of Radio Equipment', rating: '' },
            { description: 'Use of Navigation Aids', rating: '' }
        ],
        landing: [
            { description: 'Landing Procedure', rating: '' },
            { description: 'Speed Control', rating: '' },
            { description: 'Use of Reverse Thrust', rating: '' },
            { description: 'Braking Technique', rating: '' }
        ],
        afterLandingShutdown: [
            { description: 'Taxi', rating: '' },
            { description: 'Procedure and Checklist', rating: '' }
        ],
        generalCRM: [
            { description: 'Behavior', rating: '' },
            { description: 'Communication', rating: '' },
            { description: 'Aircraft System', rating: '' },
            { description: 'Adherence to SOP', rating: '' },
            { description: 'Checklists', rating: '' },
            { description: 'Callouts', rating: '' },
            { description: 'Knowledge of Emergency Equipment', rating: '' },
            { description: 'Post flight', rating: '' },
            { description: 'Paperwork', rating: '' },
            { description: 'Fight Deck Discipline', rating: '' }
        ],
        additionalGeneralCRM: [
            { description: 'Crew Coordination', rating: '' },
            { description: 'Leadership', rating: '' },
            { description: 'Communication', rating: '' }
        ]
    };

    $scope.formDataPM = {
        date: new Date(),
        name: '',
        codeNo: '',
        location: '',
        acType: '',
        acRegistration: '',
        comments: '',
        signatureCaptain: '',
        signatureIP: '',
        preFlight: [
            { description: 'EFB Usage', rating: '' },
            { description: 'Weather Analysis', rating: '' },
            { description: 'Flight Plan and Fuel Analysis', rating: '' },
            { description: 'Walk-Around', rating: '' },
            { description: 'Technical Log', rating: '' },
            { description: 'Take-off Data and Load Sheet', rating: '' },
            { description: 'Crew Flight Briefing', rating: '' },
            { description: 'Cockpit Set-up', rating: '' },
            { description: 'Start Procedure', rating: '' },
            { description: 'Taxi', rating: '' },
            { description: 'Clearance', rating: '' }
        ],
        takeOff: [
            { description: 'Briefing', rating: '' },
            { description: 'V1, Vr, V2 Compliance', rating: '' },
            { description: 'Thrust Settings', rating: '' },
            { description: 'Engine Monitoring', rating: '' }
        ],
        climb: [
            { description: 'Noise Abatement Procedure', rating: '' },
            { description: 'Flap Retraction Schedule', rating: '' },
            { description: 'Speed and Altitude Control', rating: '' },
            { description: 'Climb Procedure/SID', rating: '' },
            { description: 'Clearance Compliance', rating: '' }
        ],
        cruise: [
            { description: 'En route Procedures', rating: '' },
            { description: 'Fuel Management', rating: '' },
            { description: 'RVSM/BRNAV Procedures', rating: '' },
            { description: 'Weather Management', rating: '' }
        ],
        descent: [
            { description: 'Briefing', rating: '' },
            { description: 'Procedure', rating: '' },
            { description: 'Landing Data', rating: '' },
            { description: 'Procedure Compliance', rating: '' }
        ],
        approach: [
            { description: 'Procedure', rating: '' },
            { description: 'Auto-pilot Operation', rating: '' },
            { description: 'Speed Control', rating: '' },
            { description: 'Altitude Control', rating: '' },
            { description: 'Minima Compliance', rating: '' },
            { description: 'Use of Radio Equipment', rating: '' },
            { description: 'Use of Navigation Aids', rating: '' }
        ],
        landing: [
            { description: 'Landing Procedure', rating: '' },
            { description: 'Speed Control', rating: '' },
            { description: 'Use of Reverse Thrust', rating: '' },
            { description: 'Braking Technique', rating: '' }
        ],
        afterLandingShutdown: [
            { description: 'Taxi', rating: '' },
            { description: 'Procedure and Checklist', rating: '' }
        ],
        generalCRM: [
            { description: 'Behavior', rating: '' },
            { description: 'Communication', rating: '' },
            { description: 'Aircraft System', rating: '' },
            { description: 'Adherence to SOP', rating: '' },
            { description: 'Checklists', rating: '' },
            { description: 'Callouts', rating: '' },
            { description: 'Knowledge of Emergency Equipment', rating: '' },
            { description: 'Post flight', rating: '' },
            { description: 'Paperwork', rating: '' },
            { description: 'Fight Deck Discipline', rating: '' }
        ],
        additionalGeneralCRM: [
            { description: 'Crew Coordination', rating: '' },
            { description: 'Leadership', rating: '' },
            { description: 'Communication', rating: '' }
        ]
    };

    $scope.ratingOptions = {
        placeholder: '',
        displayExpr: "title",
        valueExpr: 'title',
        dataSource: [
            { id: 0, title: 'Satisfactory' },
            { id: 1, title: 'Unsatisfactory' },
            { id: 2, title: 'Not Applicable' }
        ]
    };

    $scope.ratingOptionsPM = angular.copy($scope.ratingOptions);

    $scope.btn_save = {
        onClick: function () {
            console.log("PF Form Data: ", $scope.formData);
            console.log("PM Form Data: ", $scope.formDataPM);
        }
    };
}]);