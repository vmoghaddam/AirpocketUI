app.controller('iqs_hazard_detail_controller', ['$routeParams', '$location', '$scope', 'DataService',
    function ($routeParams, $location, $scope, DataService) {
        
        $scope.tab = 'overview';

        var idParam = $routeParams.id;
        $scope.isNew = !idParam || idParam === 'new';

        $scope.identificationMethods = DataService.getHazardIdentificationMethods();

        $scope.severityLevels = [
            { code: 'A', title: 'Catastrophic' },
            { code: 'B', title: 'Major' },
            { code: 'C', title: 'Significant' },
            { code: 'D', title: 'Minor' },
            { code: 'E', title: 'Negligible' }
        ];

        $scope.likelihoodLevels = [
            { code: 5, title: 'Frequent' },
            { code: 4, title: 'Occasional' },
            { code: 3, title: 'Remote' },
            { code: 2, title: 'Improbable' },
            { code: 1, title: 'Extremely improbable' }
        ];

        $scope.currentAssessment = {
            severity: 'C',
            likelihood: 3
        };

        function createEmptyHazard() {
            return {
                id: null,
                code: '',
                title: '',
                ownerDept: '',
                status: 'Open',
                initialRisk: 'Medium',
                residualRisk: 'Medium',
                summary: '',
                keyDriver: ''
            };
        }

        function createEmptySource() {
            return {
                id: null,
                hazardId: null,
                methodCode: '',
                methodTitle: '',
                refCode: '',
                refTitle: '',
                refModule: '',
                refRecordId: null,
                dateIdentified: null,
                isPrimary: false,
                note: ''
            };
        }

        if ($scope.isNew) {
            $scope.item = createEmptyHazard();
            $scope.sources = [createEmptySource()];
            $scope.relatedOccurrences = [];
            $scope.relatedMocs = [];
            $scope.occurrenceCount = 0;
            $scope.mocCount = 0;
            $scope.riskAssessments = [];
            $scope.actions = [];
            $scope.monitoring = [];
        } else {
            var id = parseInt(idParam, 10);
            $scope.item = DataService.getHazardById(id);

            $scope.sources = DataService.getHazardSources(id);
            if (!$scope.sources || !$scope.sources.length) {
                $scope.sources = [createEmptySource()];
            }

            $scope.relatedOccurrences = DataService.getOccurrencesByHazardId(id);
            $scope.relatedMocs = [];
            $scope.occurrenceCount = DataService.getOccurrenceCountByHazardId(id);
            $scope.mocCount = 0;

            $scope.riskAssessments = DataService.getRiskAssessmentsByHazardId(id);
            $scope.actions = DataService.getHazardActionsByHazardId(id);
            $scope.monitoring = DataService.getHazardMonitoringByHazardId(id);

            if ($scope.riskAssessments.length) {
                var ra = $scope.riskAssessments[0];
                if (ra.initial === 'High') {
                    $scope.currentAssessment.severity = 'B';
                    $scope.currentAssessment.likelihood = 4;
                } else if (ra.initial === 'Medium') {
                    $scope.currentAssessment.severity = 'C';
                    $scope.currentAssessment.likelihood = 3;
                } else {
                    $scope.currentAssessment.severity = 'D';
                    $scope.currentAssessment.likelihood = 2;
                }
            }
        }

        $scope.setTab = function (t) { $scope.tab = t; };
        $scope.isTab = function (t) { return $scope.tab === t; };

        $scope.addSource = function () {
            $scope.sources.push(createEmptySource());
        };

        $scope.removeSource = function (index) {
            if ($scope.sources.length > 1) {
                $scope.sources.splice(index, 1);
            }
        };

        $scope.setPrimary = function (index) {
            $scope.sources.forEach(function (s, i) {
                s.isPrimary = (i === index);
            });
        };

        $scope.currentRiskCode = function () {
            return $scope.currentAssessment.likelihood + '' + $scope.currentAssessment.severity;
        };

        $scope.currentRiskBand = function () {
            var l = $scope.currentAssessment.likelihood;
            var s = $scope.currentAssessment.severity;

            var sevWeight = 0;
            switch (s) {
                case 'A': sevWeight = 5; break;
                case 'B': sevWeight = 4; break;
                case 'C': sevWeight = 3; break;
                case 'D': sevWeight = 2; break;
                case 'E': sevWeight = 1; break;
                default: sevWeight = 0; break;
            }

            var score = sevWeight * l;

            if (score >= 18) {
                return 'Unacceptable';
            }
            if (score >= 12) {
                return 'Undesirable';
            }
            if (score >= 6) {
                return 'Acceptable with controls';
            }
            return 'Acceptable';
        };

        $scope.riskCellClass = function (sev, lik) {
            var sevWeight = 0;
            switch (sev) {
                case 'A': sevWeight = 5; break;
                case 'B': sevWeight = 4; break;
                case 'C': sevWeight = 3; break;
                case 'D': sevWeight = 2; break;
                case 'E': sevWeight = 1; break;
                default: sevWeight = 0; break;
            }
            var score = sevWeight * lik;

            var band;
            if (score >= 18) {
                band = 'Unacceptable';
            } else if (score >= 12) {
                band = 'Undesirable';
            } else if (score >= 6) {
                band = 'Acceptable with controls';
            } else {
                band = 'Acceptable';
            }

            var cls = 'risk-cell ';
            if (band === 'Unacceptable') {
                cls += 'risk-high';
            } else if (band === 'Undesirable' || band === 'Acceptable with controls') {
                cls += 'risk-med';
            } else {
                cls += 'risk-low';
            }

            if ($scope.currentAssessment.severity === sev && $scope.currentAssessment.likelihood === lik) {
                cls += ' risk-selected';
            }
            return cls;
        };

        $scope.save = function () {
            var saved = DataService.saveHazard(angular.copy($scope.item));
            DataService.saveHazardSources(saved.id, angular.copy($scope.sources));
            $location.path('/iqs/hazard/list');
        };

        $scope.cancel = function () {
            $location.path('/iqs/hazard/list');
        };
    }
]);


app.factory('DataService', [function () {
    var hazards = [
        {
            id: 1,
            code: 'H-00023',
            title: 'Bird strike on approach to OIII',
            summary: 'Risk of bird strike during approach and landing at OIII due to wildlife activity in the vicinity of the airport.',
            ownerDept: 'Flight Safety',
            status: 'In progress',
            initialRisk: 'High',
            residualRisk: 'Medium',
            keyDriver: 'Bird activity and runway proximity to wildlife habitats.'
        },
        {
            id: 2,
            code: 'H-00041',
            title: 'Ramp collision risk during pushback',
            summary: 'Risk of collision between aircraft and ground equipment or vehicles during pushback at OIMM.',
            ownerDept: 'Ground Operations',
            status: 'Open',
            initialRisk: 'High',
            residualRisk: 'Medium',
            keyDriver: 'Complex ramp layout and variable experience of ramp staff.'
        }
    ];

    var hazardSources = [
        {
            id: 1,
            hazardId: 1,
            methodCode: 'OCC',
            methodTitle: 'Occurrence report',
            refCode: 'ASR-2025-00123',
            refTitle: 'Bird strike on final OIII RWY29',
            refModule: 'Occurrences',
            dateIdentified: '2025-02-10',
            isPrimary: true,
            note: ''
        },
        {
            id: 2,
            hazardId: 1,
            methodCode: 'AUD',
            methodTitle: 'Internal audit',
            refCode: 'AUD-2025-03',
            refTitle: 'Internal safety audit – Flight Ops',
            refModule: 'Audit',
            dateIdentified: '2025-03-14',
            isPrimary: false,
            note: ''
        },
        {
            id: 3,
            hazardId: 2,
            methodCode: 'AUD',
            methodTitle: 'Internal audit',
            refCode: 'AUD-2025-05',
            refTitle: 'Internal audit – Ground operations OIMM',
            refModule: 'Audit',
            dateIdentified: '2025-05-18',
            isPrimary: true,
            note: ''
        }
    ];

    var hazardIdentificationMethods = [
        { code: 'OCC', title: 'Occurrence report' },
        { code: 'AUD', title: 'Internal / external audit' },
        { code: 'MOC', title: 'MOC risk assessment' },
        { code: 'MEET', title: 'Safety meeting / review' },
        { code: 'STUDY', title: 'Study / analysis' }
    ];

    var riskAssessments = [
        {
            id: 1,
            hazardId: 1,
            assessmentNo: 'RA-2025-001',
            date: '2025-02-10',
            initial: 'High',
            residual: 'Medium',
            initialIndex: '4B',
            residualIndex: '2C',
            acceptability: 'Acceptable with controls'
        },
        {
            id: 2,
            hazardId: 2,
            assessmentNo: 'RA-2025-002',
            date: '2025-05-20',
            initial: 'Medium',
            residual: 'Low',
            initialIndex: '3C',
            residualIndex: '2D',
            acceptability: 'Acceptable'
        }
    ];

    var hazardActions = [
        {
            id: 1,
            hazardId: 1,
            actionNo: 'HA-2025-001',
            action: 'Implement wildlife hazard management plan at OIII in coordination with airport operator.',
            type: 'Preventive',
            owner: 'Flight Safety',
            targetDate: '2025-06-30',
            status: 'In progress'
        },
        {
            id: 2,
            hazardId: 1,
            actionNo: 'HA-2025-002',
            action: 'Issue flight crew briefing on bird strike risk and final approach procedures.',
            type: 'Preventive',
            owner: 'Flight Operations',
            targetDate: '2025-05-31',
            status: 'Implemented'
        },
        {
            id: 3,
            hazardId: 2,
            actionNo: 'HA-2025-003',
            action: 'Update ramp marshalling and pushback procedure and provide refresher training.',
            type: 'Corrective',
            owner: 'Ground Operations',
            targetDate: '2025-07-15',
            status: 'In progress'
        }
    ];

    var hazardMonitoring = [
        {
            id: 1,
            hazardId: 1,
            indicator: 'Bird strike rate per 1,000 flights on OIII arrivals',
            method: 'Trend of occurrence reports + internal safety audit + meetings with airport wildlife control.',
            frequency: 'Monthly',
            lastReview: '2025-06-01',
            nextReview: '2025-09-01',
            conclusion: 'Risk reduced from High to Medium; controls appear effective but remain under close monitoring.'
        },
        {
            id: 2,
            hazardId: 2,
            indicator: 'Ramp incidents related to pushback and marshalling per 10,000 movements',
            method: 'Ramp inspections, ground safety reports, internal audits.',
            frequency: 'Quarterly',
            lastReview: '2025-05-31',
            nextReview: '2025-08-31',
            conclusion: 'Initial actions implemented; further monitoring required to confirm sustained improvement.'
        }
    ];

    var occurrences = [
        {
            id: 1,
            date: '2025-02-10',
            ref: 'ASR-2025-00123',
            type: 'Bird strike on approach',
            hazardId: 1,
            hazardSummary: 'Bird strike on approach to OIII',
            severity: 'Minor damage',
            status: 'Closed'
        },
        {
            id: 2,
            date: '2025-02-18',
            ref: 'ASR-2025-00145',
            type: 'Bird strike – engine ingestion',
            hazardId: 1,
            hazardSummary: 'Bird strike on approach to OIII',
            severity: 'Significant',
            status: 'Closed'
        },
        {
            id: 3,
            date: '2025-05-10',
            ref: 'GSR-2025-00031',
            type: 'Ramp incident – pushback clearance',
            hazardId: 2,
            hazardSummary: 'Ramp collision risk during pushback',
            severity: 'Near miss',
            status: 'Open'
        }
    ];

    var mocs = [
        {
            id: 1,
            mocNo: 'MOC-2025-001',
            title: 'Wildlife hazard management programme at OIII',
            status: 'In progress',
            requestedBy: 'Flight Safety',
            reason: 'Risk of bird strike on approach to OIII; need for structured wildlife hazard management.',
            hazardIds: [1]
        }
    ];

    var audits = [
        {
            id: 1,
            auditNo: 'AUD-2025-03',
            auditType: 'INTERNAL',
            title: 'Internal safety audit – Flight Operations Q1/2025',
            scope: 'Flight operations, bird control measures, approach procedures at OIII',
            objective: 'Verify effectiveness of bird strike risk controls and compliance with company flight operations manual and CAO.IRI Air OPS.',
            standards: 'Company OM-A Chapter 8; CAO.IRI Air OPS CAT; SMS Manual Section 5 (Safety assurance).',
            dept: 'Flight Safety',
            location: 'OIII – Tehran Mehrabad',
            leadAuditor: 'Safety Manager Flight Ops',
            team: 'Senior safety officer, FO line training captain',
            startDate: '2025-03-10',
            endDate: '2025-03-14',
            status: 'Closed'
        },
        {
            id: 2,
            auditNo: 'AUD-2025-05',
            auditType: 'INTERNAL',
            title: 'Internal audit – Ground operations OIMM',
            scope: 'Ramp safety, pushback procedures, marshalling',
            objective: 'Assess ground handling conformity with ground operations manual and ramp safety procedures.',
            standards: 'Ground Operations Manual; CAO.IRI Air OPS; Part-145 interfaces.',
            dept: 'Quality Assurance',
            location: 'OIMM – Mashhad',
            leadAuditor: 'Quality Manager',
            team: 'QA auditor, Ground ops representative',
            startDate: '2025-05-15',
            endDate: '2025-05-18',
            status: 'Open'
        }
    ];

    var auditFindings = [
        {
            id: 1,
            auditId: 1,
            findingNo: 'F-01',
            title: 'Inadequate bird control programme at OIII',
            severity: 'Major',
            status: 'Open',
            dueDate: '2025-06-30',
            hazardIds: [1],
            actionPlan: 'Implement enhanced bird control programme, formal wildlife hazard management plan and regular coordination with airport operator.',
            actionOwner: 'Flight Safety Manager / Airport coordination focal point',
            actionTargetDate: '2025-06-30',
            followUpStatus: 'In progress',
            followUpDate: '2025-07-30',
            effectivenessNote: 'Effectiveness to be verified via follow-up audit and trend in bird-strike occurrences.'
        },
        {
            id: 2,
            auditId: 2,
            findingNo: 'F-02',
            title: 'Ramp marshalling and pushback not fully in line with procedures',
            severity: 'Minor',
            status: 'Open',
            dueDate: '2025-07-15',
            hazardIds: [2],
            actionPlan: 'Update ramp safety procedures, refresh marshalling and pushback training and introduce on-the-job supervision checks.',
            actionOwner: 'Ground Operations Manager',
            actionTargetDate: '2025-07-15',
            followUpStatus: 'Planned',
            followUpDate: '2025-09-01',
            effectivenessNote: 'Monitoring via ramp inspections and safety reports; effectiveness not yet evaluated.'
        }
    ];

    return {
        getHazards: function () {
            return hazards;
        },
        getHazardById: function (id) {
            return hazards.find(function (h) { return h.id === id; });
        },
        saveHazard: function (hazard) {
            if (!hazard.id) {
                hazard.id = hazards.length + 1;
                hazards.push(hazard);
            } else {
                var idx = hazards.findIndex(function (h) { return h.id === hazard.id; });
                if (idx >= 0) hazards[idx] = hazard;
            }
            return hazard;
        },
        getHazardSources: function (hazardId) {
            return hazardSources.filter(function (s) { return s.hazardId === hazardId; });
        },
        saveHazardSources: function (hazardId, sources) {
            for (var i = hazardSources.length - 1; i >= 0; i--) {
                if (hazardSources[i].hazardId === hazardId) {
                    hazardSources.splice(i, 1);
                }
            }
            sources.forEach(function (s, idx) {
                s.id = idx + 1;
                s.hazardId = hazardId;
                hazardSources.push(s);
            });
        },
        getHazardIdentificationMethods: function () {
            return hazardIdentificationMethods;
        },
        getRiskAssessmentsByHazardId: function (hazardId) {
            return riskAssessments.filter(function (r) { return r.hazardId === hazardId; });
        },
        getHazardActionsByHazardId: function (hazardId) {
            return hazardActions.filter(function (a) { return a.hazardId === hazardId; });
        },
        getHazardMonitoringByHazardId: function (hazardId) {
            return hazardMonitoring.filter(function (m) { return m.hazardId === hazardId; });
        },
        getOccurrences: function () {
            return occurrences;
        },
        getOccurrenceById: function (id) {
            return occurrences.find(function (o) { return o.id === id; });
        },
        getOccurrencesByHazardId: function (hazardId) {
            return occurrences.filter(function (o) { return o.hazardId === hazardId; });
        },
        getOccurrenceCountByHazardId: function (hazardId) {
            return occurrences.filter(function (o) { return o.hazardId === hazardId; }).length;
        },
        getMocs: function () {
            return mocs;
        },
        getMocById: function (id) {
            return mocs.find(function (m) { return m.id === id; });
        },
        getHazardsByIds: function (ids) {
            return hazards.filter(function (h) { return ids.indexOf(h.id) !== -1; });
        },
        getAudits: function () {
            return audits;
        },
        getAuditById: function (id) {
            return audits.find(function (a) { return a.id === id; });
        },
        getAuditFindingsByAuditId: function (auditId) {
            return auditFindings.filter(function (f) { return f.auditId === auditId; });
        }
    };
}]);
