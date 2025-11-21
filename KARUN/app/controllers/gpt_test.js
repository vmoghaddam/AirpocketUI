'use strict';
app.controller('gpt_testController', ['$scope', '$location', '$routeParams', '$rootScope', 'authService', 'notificationService', '$route', 'mntService',
    function ($scope, $location, $routeParams, $rootScope, authService, notificationService, $route, mntService) {
        $scope.formData = {
            instructorName: 'test',
            assessorName: 'test',
            department: 'test',
            classFormat: null,
            instructorSignature: 'test',
            assessorSignature: 'test',
            trainingManagerSignature: 'test',
            questions: [],
        };

        $scope.textBoxOptions = {
            stylingMode: "underlined",
            placeholder: ""
        };
        $scope.formData.questions = [
            { text: 'Did the CRM trainer demonstrate the knowledge required for the role?', answer: 'Yes', comments: '' },
            { text: 'Did the CRM trainer support CRM concepts?', answer: '', comments: '' },
            { text: 'Did the CRM trainer encourage trainees to participate and share their experiences and self-analyze?', answer: 'Yes', comments: 'test' },
            { text: 'Did the CRM trainer identify and respond to the trainees needs relative to expertise/experience?', answer: '', comments: '' },
            { text: 'Did the CRM trainer show how CRM is integrated in technical training and line operations?', answer: '', comments: '' },
            { text: 'Did the CRM trainer incorporate company CRM standards when appropriate?', answer: '', comments: '' },
            { text: 'Did the CRM trainer identify and discuss the non-technical reasons involved in accidents, incidents, and events included in case studies?', answer: '', comments: '' },
            { text: 'Did the CRM trainer regularly check for understanding and resolve ambiguities?', answer: '', comments: '' },
            { text: 'Did the CRM trainer demonstrate effective instruction and facilitation skills?', answer: '', comments: '' },
        ];
        $scope.classFormatOptions = {
            items: ["Lecture", "Presentation", "Workshop"],
            value: null
        };

        $scope.dt_assessment = {
            type: "date",
            displayFormat: "yyyy-MM-dd",
            bindingOptions: {
                value: "formData.assessmentDate"
            }
        }

        $scope.btn_save = {
            onClick: function () {
                console.log("Form Data: ", $scope.formData);

            }
        }

    }]);