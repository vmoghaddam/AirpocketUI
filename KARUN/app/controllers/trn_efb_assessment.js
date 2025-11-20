'use strict';
app.controller('trn_efb_assessmentControll', ['$scope', function ($scope) {
    $scope.formData = {
        date: new Date(),
        crewName: '',
        checkType: '',
        finalAssessment: '',
        specialComments: '',
        crewSignature: '',
        instructorSignature: '',
        beforeStartActions: [],
        afterStartTaxiBeforeTakeoff: [],
        afterTakeoffClimb: [],
        cruise: [],
        descentApproachBeforeLanding: [],
        afterLandingParkingLeaving: [],
        abnormalEmergency: [],
    };

    $scope.formData.beforeStartActions = [
        { description: 'Briefing', assessment: '' },
        { description: 'Dispatch Preparation & Calculations', assessment: '' },
        { description: 'Before Start Preparations & Setting', assessment: '' },
        { description: 'Review, Monitor, and Cross-check Actions Conscientiously', assessment: '' },
        { description: 'Before Start Records', assessment: '' },
        { description: 'Concentrate on One Thing at a Time, Ensure Tasks are Completed and Don’t Become Distracted', assessment: '' },
        { description: 'Carry Out Instructions as Directed', assessment: '' }
    ];

    $scope.formData.afterStartTaxiBeforeTakeoff = [
        { description: 'ATC Instructions & Clearance Records During Taxi', assessment: '' },
        { description: 'Before Takeoff Settings', assessment: '' },
        { description: 'Review, Monitor, and Cross-check Actions Conscientiously', assessment: '' },
        { description: 'Carry Out Instructions as Directed', assessment: '' }
    ];

    $scope.formData.afterTakeoffClimb = [
        { description: 'Review, Monitor, and Cross-check Actions Conscientiously', assessment: '' },
        { description: 'After Takeoff & Climb Records', assessment: '' },
        { description: 'Carry Out Instructions as Directed', assessment: '' }
    ];

    $scope.formData.cruise = [
        { description: 'Review, Monitor, and Cross-check Actions Conscientiously', assessment: '' },
        { description: 'Fuel Monitoring & Actions if Needed', assessment: '' },
        { description: 'Cruise Records', assessment: '' },
        { description: 'Cruise Management (Calculations for Best Cruise Efficiency)', assessment: '' },
        { description: 'Descent Briefing', assessment: '' },
        { description: 'Carry Out Instructions as Directed', assessment: '' }
    ];

    $scope.formData.descentApproachBeforeLanding = [
        { description: 'Descent Planning & Calculations', assessment: '' },
        { description: 'Review, Monitor, and Cross-check Actions Conscientiously During Descent', assessment: '' },
        { description: 'Descent Records', assessment: '' },
        { description: 'Special Briefing (if needed)', assessment: '' },
        { description: 'Carry Out Instructions as Directed', assessment: '' }
    ];

    $scope.formData.afterLandingParkingLeaving = [
        { description: 'After Landing Records (Times, Remaining Fuel, etc.)', assessment: '' },
        { description: 'Review and Check to Ensure that Information is Entered and Recorded Correctly', assessment: '' },
        { description: 'Leaving Records', assessment: '' },
        { description: 'Carry Out Instructions as Directed', assessment: '' }
    ];

    $scope.formData.abnormalEmergency = [
        { description: 'Use of QRH and Emergency Checklist', assessment: '' },
        { description: 'Use of SOP and Abnormal Procedures', assessment: '' },
        { description: 'Carry Out Instructions as Directed', assessment: '' }
    ];

    $scope.sb_assessment = {
        placeholder: 'Overall Assessment',
        displayExpr: "title",
        valueExpr: 'title',
        dataSource: [{ id: 0, title: 'FL' }, { id: 1, title: 'F' }, { id: 2, title: 'G' }, { id: 3, title: 'VG' }, { id: 4, title: 'O' }],
    }

    $scope.dt_date = {
        bindingOption: {
            //value:
        }
    }

    $scope.btn_save = {
        onClick: function () {
            console.log("Form Data: ", $scope.formData);
        }
    }

}]);