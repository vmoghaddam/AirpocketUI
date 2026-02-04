'use strict';
app.controller('trn_grtController', ['$scope', function ($scope) {
    $scope.formData = {
        instructorName: '',
        assessmentDate: new Date(),
        applicantName: '',
        department: '',
        courseTitle: '',
        classFormat: '',
        remark: '',
        instructorSignature: '',
        managerSignature: '',
        courseItems: [],
    };

    $scope.formData.courseItems = [
        { number: '01', title: 'AIRCRAFT GENERAL', grade: '' },
        { number: '02', title: 'COMMUNICATION', grade: '' },
        { number: '03', title: 'NAVIGATION', grade: '' },
        { number: '04', title: 'FMS/GNS', grade: '' },
        { number: '05', title: 'APU', grade: '' },
        { number: '06', title: 'ELECTRICAL', grade: '' },
        { number: '07', title: 'HYDRAULIC', grade: '' },
        { number: '08', title: 'LANDING GEAR', grade: '' },
        { number: '09', title: 'AUTOMATIC FLIGHT', grade: '' },
        { number: '10', title: 'FLIGHT CONTROL', grade: '' },
        { number: '11', title: 'PNEUMATICS', grade: '' },
        { number: '12', title: 'AIRCONDITIONING', grade: '' },
        { number: '13', title: 'PRESSURIZATION', grade: '' },
        { number: '14', title: 'POWERPLANT', grade: '' },
        { number: '15', title: 'FIRE PROTECTION', grade: '' },
        { number: '16', title: 'ICE AND RAIN PROTECTION', grade: '' },
        { number: '17', title: 'FUEL', grade: '' },
        { number: '18', title: 'PERFORMANCE', grade: '' },
        { number: '19', title: 'WATER AND WASTE', grade: '' },
        { number: '20', title: 'EMERGENCY EQUIPMENT', grade: '' },
        { number: '21', title: 'INSTRUMENTATION', grade: '' },
        { number: '22', title: 'WARNING AND CAUTION', grade: '' },
        { number: '23', title: 'WEIGHT AND BALANCE', grade: '' },
        { number: '24', title: 'NORMAL PROCEDURE', grade: '' },
        { number: '25', title: 'EMERGENCY PROCEDURE', grade: '' },
        { number: '26', title: 'FLIGHT PLANNING', grade: '' }
    ];

    $scope.sb_grade = {
        placeholder: 'Grade',
        displayExpr: "title",
        valueExpr: 'title',
        dataSource: [{ id: 0, title: 'S' }, { id: 1, title: 'U/S' }],
    }

    $scope.sb_class = {
        placeholder: 'Class Format',
        displayExpr: "title",
        valueExpr: 'title',
        dataSource: [{ id: 0, title: 'Year 1' }, { id: 1, title: 'Year 2' }, { id: 2, title: 'Year 3' }],
    }

    $scope.btn_save = {
        onClick: function () {
            console.log("Form Data: ", $scope.formData);
        }
    }
}]);