'use strict';
app.controller('trn_instructor', ['$scope', function ($scope) {
    $scope.formData = {
        date: new Date(),
        instructorName: '',
        assessorName: '',
        department: '',
        courseTitle: '',
        classFormat: '',
        finalAssessment: '',
        comments: '',
        assessorSignature: '',
        headSignature: '',
        instructorEfficiency: [
            { description: 'Demonstrate knowledge of subject matter', rating: '' },
            { description: 'Integrate current development / research findings into the content', rating: '' },
            { description: 'Shows relevance and appropriateness of course content', rating: '' },
            { description: 'Provides appropriate source material and references', rating: '' },
            { description: 'Refer participants to additional source material where appropriate', rating: '' }
        ],
        methodsOfPresentation: [
            { description: 'Is well prepared and presents material in a well-organized manner', rating: '' },
            { description: 'Demonstrate appropriateness and effectiveness of teaching technique / methods', rating: '' },
            { description: 'Presentation demonstrates professional / discipline competence', rating: '' },
            { description: 'Evidence of placing the Presentation in context', rating: '' },
            { description: 'Handouts/powerpoint are legible, with appropriate, current and accurate information', rating: '' }
        ],
        communicationInteraction: [
            { description: 'Encourages participant’s inquiry/ class discussion', rating: '' },
            { description: 'Exhibits Enthusiasm and interest with students', rating: '' },
            { description: 'Expresses ideas clearly and audibly. Responds clearly to participant’s question', rating: '' },
            { description: 'Responds to participant’s needs and incorporates feedback', rating: '' },
            { description: 'Deals fairly with participants', rating: '' }
        ],
        learning: [
            { description: 'Stimulates critical thinking and analysis', rating: '' },
            { description: 'Adjusts to individual and group needs', rating: '' },
            { description: 'Meets participant’s needs through a range of teaching styles', rating: '' },
            { description: 'Demonstrate respect for alternative points of view', rating: '' }
        ],
        approachability: [
            { description: 'Open to suggestions from participants', rating: '' },
            { description: 'Exhibits a positive attitude to all participants', rating: '' },
            { description: 'Treats participant’s with respect', rating: '' }
        ],
        teacherProfessionalism: [
            { description: 'Appearance', rating: '' },
            { description: 'Attitude', rating: '' },
            { description: 'Communication skills', rating: '' }
        ]
    };

    $scope.classFormatOptions = {
        placeholder: 'Select Class Format',
        displayExpr: "title",
        valueExpr: 'title',
        dataSource: [
            { id: 0, title: 'Lecture' },
            { id: 1, title: 'Presentation' },
            { id: 2, title: 'Workshop' }
        ]
    };

    $scope.ratingOptions = {
        placeholder: '',
        displayExpr: "title",
        valueExpr: 'title',
        dataSource: [
            { id: 0, title: 'Excellent' },
            { id: 1, title: 'Good' },
            { id: 2, title: 'Satisfactory' },
            { id: 3, title: 'Need Improvement' },
            { id: 4, title: 'Unacceptable' }
        ]
    };

    $scope.btn_save = {
        onClick: function () {
            console.log("Form Data: ", $scope.formData);
        }
    };
}]);