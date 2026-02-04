'use strict';
app.controller('trn_fstd_monitoringController', ['$scope', function ($scope) {

    $scope.formData = {
        fstdApproval: '',
        location: '',
        operator: '',
        fstdType: '',
        aircraftType: '',
        approvalLevel: '',
        qualificationValidUntil: new Date(),
        restrictions: '',
        otherRemarks: '',
        signature: '',
        intendedScope: [],
        systemDifferences: []
    };

    $scope.formData.intendedScope = [
        { name: 'Low Visibility Training', remarks: '' },
        { name: 'Recurrent Training/Checking', remarks: '' },
        { name: 'Operation from either Pilot\'s Seat', remarks: '' },
        { name: 'Difference Training', remarks: '' },
        { name: 'Recency of Experience', remarks: '' },
        { name: 'Zero Flight Time Training', remarks: '' },
        { name: 'Other', remarks: '' }
    ];

    $scope.formData.systemDifferences = [
        { system: 'FMS', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'Placards and Markings', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'Unit of measurement', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'Switching Philosophy', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'Checklist Device and holstering', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'Engine Type', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'Thrust Reversers', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'Propellers and autofeather system', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'APU', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'Communication', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'Navigation', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'HUD', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'Flight Controls', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'Air Conditioning', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'Pressurisation', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'Landing Gear', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'Limitations', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'General', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'Special procedures', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'LVO', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' },
        { system: 'EPIS-Load/CCA-software-load', differences: '', syllabusRef: '', complianceLevel: '', fchar: '', proc: '' }
    ];

    $scope.btn_save = {
        onClick: function () {
            console.log("Form Data: ", $scope.formData)
        }
    }
}]);