'use strict';
app.controller('trn_line_crm', ['$scope', function ($scope) {

    $scope.formData = {
        date: new Date(),
        crewMembersName: '',
        typeOfCheck: '',
        workloadManagement: [
            { description: 'Are calm, relaxed, careful and not impulsive', assessment: '' },
            { description: 'Prepare, prioritize and schedule tasks effectively', assessment: '' },
            { description: 'Recognize high workload', assessment: '' },
            { description: 'Offer and accept assistance, delegate when necessary, and ask for help early', assessment: '' },
            { description: 'Review, monitor, and cross-check actions conscientiously', assessment: '' },
            { description: 'Follow procedures appropriately and consistently', assessment: '' },
            { description: 'Concentrate on one thing at a time, ensure tasks are completed and don’t become distracted', assessment: '' },
            { description: 'Carry out instructions as directed', assessment: '' }
        ],
        communications: [
            { description: 'Know what, how much and who they need to communicate to', assessment: '' },
            { description: 'Ensure the recipient is ready and able to receive the information', assessment: '' },
            { description: 'Pass messages and information clearly, accurately, timely and adequately', assessment: '' },
            { description: 'Check the other person has the correct understanding when passing important information', assessment: '' },
            { description: 'Listen actively, patiently and demonstrate understanding when receiving information', assessment: '' },
            { description: 'Ask relevant and effective questions and offer suggestions', assessment: '' },
            { description: 'Use appropriate body language, eye contact and tone', assessment: '' },
            { description: 'Are open and receptive to other people\'s view', assessment: '' }
        ],
        leadershipTeamwork: [
            { description: 'Agree and clear on the team’s objectives and members roles', assessment: '' },
            { description: 'Are friendly, enthusiastic, motivating and considerate of others', assessment: '' },
            { description: 'Use initiative, give direction and take responsibility when required', assessment: '' },
            { description: 'Are open and honest about thoughts, concerns and intentions', assessment: '' },
            { description: 'Give and receive criticism and/or praise well, and admit mistakes', assessment: '' },
            { description: 'Confidently do and say what is important to them', assessment: '' },
            { description: 'Balance rank authority and demonstrate respect and tolerance for other people', assessment: '' },
            { description: 'Involve others in planning and share tasks fairly', assessment: '' }
        ],
        situationAwareness: [
            { description: 'Are aware of what the aircraft and its systems are doing', assessment: '' },
            { description: 'Are aware of where the aircraft is and its environment', assessment: '' },
            { description: 'Keep track of time and fuel', assessment: '' },
            { description: 'Are aware of the condition of people involved in the operation including the passengers', assessment: '' },
            { description: 'Recognize what is likely to happen, plan and stay ahead of the game', assessment: '' },
            { description: 'Identify threats to the safety of the aircraft and people', assessment: '' },
            { description: 'Develop “what if?” scenarios and make pre-decisions', assessment: '' }
        ],
        problemSolving: [
            { description: 'Identify and verify why things have gone wrong and do not jump to conclusions or make assumptions', assessment: '' },
            { description: 'Seek accurate and adequate information from appropriate resources', assessment: '' },
            { description: 'Persevere in working through a problem', assessment: '' },
            { description: 'Use and agree on an appropriate decision-making process', assessment: '' },
            { description: 'Agree on essential and desirable criteria and priorities', assessment: '' },
            { description: 'Consider as many options as practicable', assessment: '' },
            { description: 'Make decisions when they need to review and change if required', assessment: '' },
            { description: 'Consider risks but do not take unnecessary risks', assessment: '' }
        ],
        finalAssessment: '',
        comments: '',
        crewMemberSignature: '',
        instructorSignature: ''
    };

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