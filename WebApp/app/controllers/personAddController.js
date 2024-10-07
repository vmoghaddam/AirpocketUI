'use strict';
app.controller('personAddController', ['$scope', '$location', 'personService', 'authService', '$routeParams', '$rootScope', 'trnService', '$window', function ($scope, $location, personService, authService, $routeParams, $rootScope, trnService, $window) {

    $scope.isNew = true;
    $scope.IsEditable = $rootScope.roles.indexOf('Admin') != -1 || $rootScope.userName.toLowerCase() == 'i.zamani' || $rootScope.userName.toLowerCase() == 'dehghan' || $rootScope.userName.toLowerCase() == 'khorshidi'
        || $rootScope.userName.toLowerCase() == '1abbaspour1'
        || $rootScope.userName.toLowerCase() == 'r.nasiri'
        || $rootScope.userName.toLowerCase() == 'mohamadi'
        || $rootScope.userName.toLowerCase() == 'demo'
        || $rootScope.userName.toLowerCase() == 'training'
        ;

    $scope.entity = {
        Id: null,
        PersonId: null,
        DateJoinCompany: null,
        DateJoinCompanyP: null,
        IsActive: 1,
        DateRegisterP: -1,
        DateConfirmedP: null,
        DateRegister: null,
        DateConfirmed: null,
        IsDeleted: 0,
        DateActiveStart: null,
        DateActiveEnd: null,
        DateLastLoginP: null,
        DateLastLogin: null,
        Username: null,
        Password: null,
        PID: null,
        Phone: null,
        GroupId: null,
        CustomerId: Config.CustomerId,
        BaseAirportId: null,
        DateInactiveBegin: null,
        InActive: 0,
        DateInactiveEnd: null,
        Person: {

            PersonId: null,
            DateCreate: null,
            MarriageId: null,
            NID: null,
            SexId: null,
            FirstName: null,
            LastName: null,
            DateBirth: null,
            Email: null,
            EmailPassword: null,
            Phone1: null,
            Phone2: null,
            Mobile: null,
            FaxTelNumber: null,
            PassportNumber: null,
            DatePassportIssue: null,
            DatePassportExpire: null,
            Address: null,
            IsActive: 1,
            DateJoinAvation: null,
            DateLastCheckUP: null,
            DateNextCheckUP: null,
            DateYearOfExperience: null,
            CaoCardNumber: null,
            DateCaoCardIssue: null,
            DateCaoCardExpire: null,
            CompetencyNo: null,
            CaoInterval: null,
            CaoIntervalCalanderTypeId: null,
            IsDeleted: 0,
            Remark: null,
            StampNumber: null,
            StampUrl: null,
            TechLogNo: null,
            DateIssueNDT: null,
            IntervalNDT: null,
            NDTNumber: null,
            NDTIntervalCalanderTypeId: null,
            IsAuditor: null,
            IsAuditee: null,
            Nickname: null,
            CityId: null,
            FatherName: null,
            IDNo: null,
            RowId: null,
            UserId: null,
            ImageUrl: null,
            CustomerCreatorId: null,
            DateExpireNDT: null,


            ProficiencyExpireDate: null,
            CrewMemberCertificateExpireDate: null,
            LicenceExpireDate: null,
            LicenceIRExpireDate: null,
            SimulatorLastCheck: null,
            SimulatorNextCheck: null,
            RampPassNo: null,
            RampPassExpireDate: null,
            LanguageCourseExpireDate: null,
            LicenceTitle: null,
            LicenceInitialIssue: null,
            RaitingCertificates: null,
            LicenceIssueDate: null,
            LicenceDescription: null,
            ProficiencyCheckType: null,
            ProficiencyCheckDate: null,
            ProficiencyValidUntil: null,
            ICAOLPRLevel: null,
            ICAOLPRValidUntil: null,
            MedicalClass: null,
            CMCEmployedBy: null,
            CMCOccupation: null,
            PostalCode: null,
            ProficiencyIPC: null,
            ProficiencyOPC: null,
            ProficiencyDescription: null,
            MedicalLimitation: null,
            VisaExpireDate: null,

            SEPTIssueDate: null,
            SEPTExpireDate: null,
            SEPTPIssueDate: null,
            SEPTPExpireDate: null,
            DangerousGoodsIssueDate: null,
            DangerousGoodsExpireDate: null,
            CCRMIssueDate: null,
            CCRMExpireDate: null,
            CRMIssueDate: null,
            CRMExpireDate: null,
            SMSIssueDate: null,
            SMSExpireDate: null,
            FirstAidIssueDate: null,
            FirstAidExpireDate: null,

            AviationSecurityIssueDate: null,
            AviationSecurityExpireDate: null,
            EGPWSIssueDate: null,
            EGPWSExpireDate: null,
            UpsetRecoveryTrainingIssueDate: null,
            UpsetRecoveryTrainingExpireDate: null,
            ColdWeatherOperationIssueDate: null,
            HotWeatherOperationIssueDate: null,
            ColdWeatherOperationExpireDate: null,
            HotWeatherOperationExpireDate: null,
            PBNRNAVIssueDate: null,
            PBNRNAVExpireDate: null,

            ScheduleName: null,
            Code: null,
            AircraftTypeId: null,
            DateTypeIssue: null,
            DateTypeExpire: null,

            ProficiencyDescriptionOPC: null,
            ProficiencyCheckDateOPC: null,
            ProficiencyValidUntilOPC: null,
            DateTRIExpired: null,
            DateTREExpired: null,

            DateIssueNDT: null,
            DateExpireNDT: null,

            DateCaoCardExpire: null,
            DateCaoCardIssue: null,
            LineIssueDate: null,
            LineExpireDate: null,
            RecurrentIssueDate: null,
            RecurrentExpireDate: null,
            Type737IssueDate: null,
            Type737ExpireDate: null,
            TypeMDIssueDate: null,
            TypeMDExpireDate: null,
            TypeAirbusIssueDate: null,
            TypeAirbusExpireDate: null,

            LRCIssueDate: null,
            LRCExpireDate: null,
            RSPIssueDate: null,
            RSPExpireDate: null,
            CTUIssueDate: null,
            CTUExpireDate: null,
            SAIssueDate: null,
            SAExpireDate: null,
            HFIssueDate: null,
            HFExpireDate: null,
            ASDIssueDate: null,
            ASDExpireDate: null,
            GOMIssueDate: null,
            GOMExpireDate: null,
            ASFIssueDate: null,
            ASFExpireDate: null,
            CCIssueDate: null,
            CCExpireDate: null,
            ERPIssueDate: null,
            ERPExpireDate: null,
            MBIssueDate: null,
            MBExpireDate: null,
            PSIssueDate: null,
            PSExpireDate: null,
            ANNEXIssueDate: null,
            ANNEXExpireDate: null,
            DRMIssueDate: null,
            DRMExpireDate: null,
            FMTDIssueDate: null,
            FMTDExpireDate: null,
            MELExpireDate: null,
            MELIssueDate: null,
            METIssueDate: null,
            METExpireDate: null,
            PERIssueDate: null,
            PERExpireDate: null,



            LPCC1ExpireDate: null,
            LPCC2ExpireDate: null,
            LPCC3ExpireDate: null,
            LPCC1IssueDate: null,
            LPCC2IssueDate: null,
            LPCC3IssueDate: null,
            OPCC1IssueDate: null,
            OPCC2IssueDate: null,
            OPCC3IssueDate: null,
            LineC1IssueDate: null,
            LineC2IssueDate: null,
            LineC3IssueDate: null,
            LineC1ExpireDate: null,
            LineC2ExpireDate: null,
            LineC3ExpireDate: null,
            RampIssueDate: null,
            RampExpireDate: null,
            ACIssueDate: null,
            ACExpireDate: null,
            UPRTIssueDate: null,
            UPRTExpireDate: null,
            SFIIssueDate: null,
            SFIExpireDate: null,
            SFEIssueDate: null,
            SFEExpireDate: null,
            TRI2IssueDate: null,
            TRI2ExpireDate: null,
            TRE2IssueDate: null,
            TRE2ExpireDate: null,
            IRIIssueDate: null,
            IRIExpireDate: null,
            IREIssueDate: null,
            IREExpireDate: null,
            CRIIssueDate: null,
            CRIExpireDate: null,
            CREIssueDate: null,
            CREExpireDate: null,
            SFI2IssueDate: null,
            SFI2ExpireDate: null,
            SFE2IssueDate: null,
            SFE2ExpireDate: null,
            AirCrewIssueDate: null,
            AirCrewExpireDate: null,
            AirOpsIssueDate: null,
            AirOpsExpireDate: null,
            SOPIssueDate: null,
            SOPExpireDate: null,
            Diff31IssueDate: null,
            Diff31ExpireDate: null,
            Diff34IssueDate: null,
            Diff34ExpireDate: null,
            OMA1IssueDate: null,
            OMA1ExpireDate: null,
            OMB1IssueDate: null,
            OMB1ExpireDate: null,
            OMC1IssueDate: null,
            OMC1ExpireDate: null,
            OMA2IssueDate: null,
            OMA2ExpireDate: null,
            OMB2IssueDate: null,
            OMB2ExpireDate: null,
            OMC2IssueDate: null,
            OMC2ExpireDate: null,
            OMA3IssueDate: null,
            OMA3ExpireDate: null,
            OMB3IssueDate: null,
            OMB3ExpireDate: null,
            OMC3IssueDate: null,
            OMC3ExpireDate: null,
            MapIssueDate: null,
            MapExpireDate: null,
            ComResIssueDate: null,
            ComResExpireDate: null,
            OPCC1ExpireDate: null,
            OPCC2ExpireDate: null,
            OPCC3ExpireDate: null,


            Educations: [],
            Expreienses: [],
            AircraftTypes: [],
            Documents: [],
            Ratings: [],

            OtherAirline: 0,

        },

        Locations: [
            {
                Id: -1,
                EmployeeId: -1,
                LocationId: null,
                IsMainLocation: 1,
                OrgRoleId: null,
                DateActiveStartP: null,
                DateActiveEndP: null,
                DateActiveStart: null,
                DateActiveEnd: null,
                Remark: null,
                Phone: null,
                OrgRole: null,
                Title: null,
                FullCode: null,
            }
        ]
    };
    $scope.entityFile = {
        Id: null,
        DocumentTypeId: null,
        FileTypeId: null,
        FileUrl: null,
        Title: null,
        ParentId: null,
    };
    $scope.entityDocument = {
        PersonId: -1,
        Title: null,
        Remark: null,
        DocumentTypeId: null,
        Id: null,
        DocumentType: null,
        Documents: [],
    };
    $scope.entityEducation = {
        Id: null,
        PersonId: -1,
        EducationDegreeId: null,
        DateCatch: null,
        College: null,
        Remark: null,
        Title: null,
        StudyFieldId: null,
        StudyField: null,
        EducationDegree: null,
        FileUrl: null,
        FileTitle: null,
        SysUrl: null,
        FileType: null,
    };
    //$scope.txt_EducationRemark = {
    //    hoverStateEnabled: false,
    //    readOnly:true,
    //    bindingOptions: {

    //        value: 'entityEducation.FileUrl',

    //    }
    //};
    $scope.txt_EducationFileUrl = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'entityEducation.FileUrl',

        }
    };
    $scope.txt_EducationSysUrl = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'entityEducation.SysUrl',

        }
    };
    $scope.txt_EducationFileType = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'entityEducation.FileType',

        }
    };


    $scope.entityExp = {
        PersonId: -1,
        OrganizationId: null,
        Employer: null,
        AircraftTypeId: null,
        Remark: null,
        DateStart: null,
        DateEnd: null,
        Organization: null,
        JobTitle: null,
        AircraftType: null,
        Id: null,
    };
    $scope.entityRating = {
        Id: null,
        PersonId: -1,
        AircraftTypeId: null,
        RatingId: null,
        DateIssue: null,
        DateExpire: null,
        CategoryId: null,
        AircraftType: null,
        RatingOrganization: null,
        OrganizationId: null,
        Category: null,
    };
    $scope.entityAircrafttype = {
        Id: null,
        AircraftTypeId: null,
        PersonId: -1,
        IsActive: 1,
        DateLimitBegin: null,
        DateLimitEnd: null,
        Remark: null,
        Manufacturer: null,
        AircraftType: null,
    };
    $scope.bindEntityAircrafttype = function (data) {
        $scope.entityAircrafttype.Id = data.Id;
        $scope.entityAircrafttype.AircraftTypeId = data.AircraftTypeId;
        $scope.entityAircrafttype.PersonId = data.PersonId;
        $scope.entityAircrafttype.IsActive = data.IsActive;
        $scope.entityAircrafttype.DateLimitBegin = data.DateLimitBegin;
        $scope.entityAircrafttype.DateLimitEnd = data.DateLimitEnd;
        $scope.entityAircrafttype.Remark = data.Remark;
    };
    $scope.bindEducation = function (data) {
        $scope.entityEducation.Id = data.Id;
        $scope.entityEducation.PersonId = data.PersonId;
        $scope.entityEducation.EducationDegreeId = data.EducationDegreeId;
        $scope.entityEducation.DateCatch = data.DateCatch;
        $scope.entityEducation.College = data.College;
        $scope.entityEducation.Remark = data.Remark;
        $scope.entityEducation.Title = data.Title;
        $scope.entityEducation.StudyFieldId = data.StudyFieldId;
        $scope.entityEducation.StudyField = data.StudyField;
        $scope.entityEducation.EducationDegree = data.EducationDegree;
        $scope.entityEducation.FileUrl = data.FileUrl;
        $scope.download = "";
        if ($scope.entityEducation.FileUrl)
            $scope.download = $rootScope.clientsFilesUrl + "/" + $scope.entityEducation.FileUrl;
        $scope.entityEducation.FileTitle = data.FileTitle;
        $scope.entityEducation.SysUrl = data.SysUrl;
        $scope.entityEducation.FileType = data.FileType;
    };


    $scope.bindDocumnet = function (data) {
        $scope.entityDocument.PersonId = data.PersonId;
        $scope.entityDocument.Title = data.Title;
        $scope.entityDocument.Remark = data.Remark;
        $scope.entityDocument.DocumentTypeId = data.DocumentTypeId;
        $scope.entityDocument.Id = data.Id;
        $scope.entityDocument.DocumentType = data.DocumentType;
        $scope.entityDocument.Documents = data.Documents;
    };
    $scope.entityDocument2 = {};
    $scope.bindDocumnetView = function (data) {
        $scope.entityDocument2 = {};
        $scope.entityDocument2.PersonId = data.PersonId;
        $scope.entityDocument2.Title = data.Title;
        $scope.entityDocument2.Remark = data.Remark;
        $scope.entityDocument2.DocumentTypeId = data.DocumentTypeId;
        $scope.entityDocument2.Id = data.Id;
        $scope.entityDocument2.DocumentType = data.DocumentType;
        $scope.entityDocument2.Documents = data.Documents;
    };
    $scope.bindExp = function (data) {
        $scope.entityExp.PersonId = data.PersonId;
        $scope.entityExp.OrganizationId = data.OrganizationId;
        $scope.entityExp.Employer = data.Employer;
        $scope.entityExp.AircraftTypeId = data.AircraftTypeId;
        $scope.entityExp.Remark = data.Remark;
        $scope.entityExp.DateStart = data.DateStart;
        $scope.entityExp.DateEnd = data.DateEnd;
        $scope.entityExp.Organization = data.Organization;
        $scope.entityExp.JobTitle = data.JobTitle;
        $scope.entityExp.AircraftType = data.AircraftType;
        $scope.entityExp.Id = data.Id;
    };
    $scope.bindRating = function (data) {
        $scope.entityRating.Id = data.Id;
        $scope.entityRating.PersonId = data.PersonId;
        $scope.entityRating.AircraftTypeId = data.AircraftTypeId;
        $scope.entityRating.RatingId = data.RatingId;
        $scope.entityRating.DateIssue = data.DateIssue;
        $scope.entityRating.DateExpire = data.DateExpire;
        $scope.entityRating.CategoryId = data.CategoryId;
        $scope.entityRating.AircraftType = data.AircraftType;
        $scope.entityRating.RatingOrganization = data.RatingOrganization;
        $scope.entityRating.OrganizationId = data.OrganizationId;
        $scope.entityRating.Category = data.Category;
    };

    $scope.clearEntityDocumnet = function () {
        $scope.entityDocument.PersonId = -1;
        $scope.entityDocument.Title = null;
        $scope.entityDocument.Remark = null;
        $scope.entityDocument.DocumentTypeId = null;
        $scope.entityDocument.Id = null;
        $scope.entityDocument.DocumentType = null;
        $scope.entityDocument.Documents = [];
        $scope.uploader_document_instance.reset();
    };
    $scope.clearEntity = function () {
        $scope.entity.Id = null;
        $scope.entity.PersonId = -1;
        $scope.entity.DateJoinCompany = null;
        $scope.entity.DateJoinCompanyP = null;
        $scope.entity.IsActive = 1;
        $scope.entity.DateRegisterP = -1;
        $scope.entity.DateConfirmedP = null;
        $scope.entity.DateRegister = null;
        $scope.entity.DateConfirmed = null;
        $scope.entity.IsDeleted = 0;
        $scope.entity.DateActiveStart = null;
        $scope.entity.DateActiveEnd = null;
        $scope.entity.DateLastLoginP = null;
        $scope.entity.DateLastLogin = null;
        $scope.entity.Username = null;
        $scope.entity.Password = null;
        $scope.entity.CustomerId = Config.CustomerId;
        $scope.entity.PID = null;
        $scope.entity.Phone = null;
        $scope.entity.BaseAirportId = null;
        $scope.entity.DateInactiveBegin = null;
        $scope.entity.DateInactiveEnd = null;
        $scope.entity.InActive = 0;
        $scope.entity.Person.OtherAirline = 0;
        $scope.nid = null;

        $scope.entity.Person.DateCreate = null;
        $scope.entity.Person.MarriageId = null;
        $scope.entity.Person.NID = null;
        $scope.entity.Person.SexId = null;
        $scope.entity.Person.FirstName = null;
        $scope.entity.Person.LastName = null;
        $scope.entity.Person.DateBirth = null;
        $scope.entity.Person.Email = null;
        $scope.entity.Person.EmailPassword = null;
        $scope.entity.Person.Phone1 = null;
        $scope.entity.Person.Phone2 = null;
        $scope.entity.Person.Mobile = null;
        $scope.entity.Person.FaxTelNumber = null;
        $scope.entity.Person.PassportNumber = null;
        $scope.entity.Person.DatePassportIssue = null;
        $scope.entity.Person.DatePassportExpire = null;
        $scope.entity.Person.Address = null;
        $scope.entity.Person.IsActive = 1;
        $scope.entity.Person.DateJoinAvation = null;
        $scope.entity.Person.DateLastCheckUP = null;
        $scope.entity.Person.DateNextCheckUP = null;
        $scope.entity.Person.DateYearOfExperience = null;
        $scope.entity.Person.CaoCardNumber = null;
        $scope.entity.Person.DateCaoCardIssue = null;
        $scope.entity.Person.DateCaoCardExpire = null;
        $scope.entity.Person.LineIssueDate = null;
        $scope.entity.Person.LineExpireDate = null;
        $scope.entity.Person.RecurrentIssueDate = null;
        $scope.entity.Person.RecurrentExpireDate = null;
        $scope.entity.Person.CompetencyNo = null;
        $scope.entity.Person.CaoInterval = null;
        $scope.entity.Person.CaoIntervalCalanderTypeId = null;
        $scope.entity.Person.IsDeleted = 0;
        $scope.entity.Person.Remark = null;
        $scope.entity.Person.StampNumber = null;
        $scope.entity.Person.StampUrl = null;
        $scope.entity.Person.TechLogNo = null;
        $scope.entity.Person.DateIssueNDT = null;
        $scope.entity.Person.IntervalNDT = null;
        $scope.entity.Person.NDTNumber = null;
        $scope.entity.Person.NDTIntervalCalanderTypeId = null;
        $scope.entity.Person.IsAuditor = null;
        $scope.entity.Person.IsAuditee = null;
        $scope.entity.Person.Nickname = null;
        $scope.entity.Person.CityId = null;
        $scope.entity.Person.FatherName = null;
        $scope.entity.Person.IDNo = null;
        $scope.entity.Person.CustomerCreatorId = null;
        $scope.entity.Person.ImageUrl = null;
        $scope.entity.Person.UserId = null;
        $scope.entity.Person.DateExpireNDT = null;





        $scope.entity.Person.ProficiencyExpireDate = null;
        $scope.entity.Person.CrewMemberCertificateExpireDate = null;
        $scope.entity.Person.LicenceExpireDate = null;
        $scope.entity.Person.LicenceIRExpireDate = null;
        $scope.entity.Person.SimulatorLastCheck = null;
        $scope.entity.Person.SimulatorNextCheck = null;
        $scope.entity.Person.RampPassNo = null;
        $scope.entity.Person.RampPassExpireDate = null;
        $scope.entity.Person.LanguageCourseExpireDate = null;
        $scope.entity.Person.LicenceTitle = null;
        $scope.entity.Person.LicenceInitialIssue = null;
        $scope.entity.Person.RaitingCertificates = null;
        $scope.entity.Person.LicenceIssueDate = null;
        $scope.entity.Person.LicenceDescription = null;
        $scope.entity.Person.ProficiencyCheckType = null;
        $scope.entity.Person.ProficiencyCheckDate = null;
        $scope.entity.Person.ProficiencyValidUntil = null;
        $scope.entity.Person.ICAOLPRLevel = null;
        $scope.entity.Person.ICAOLPRValidUntil = null;
        $scope.entity.Person.MedicalClass = null;
        $scope.entity.Person.CMCEmployedBy = null;
        $scope.entity.Person.CMCOccupation = null;
        $scope.entity.Person.PostalCode = null;
        $scope.entity.Person.ProficiencyIPC = null;
        $scope.entity.Person.ProficiencyOPC = null;
        $scope.entity.Person.ProficiencyDescription = null;
        $scope.entity.Person.MedicalLimitation = null;
        $scope.entity.Person.VisaExpireDate = null;

        $scope.entity.Person.SEPTIssueDate = null;
        $scope.entity.Person.SEPTExpireDate = null;
        $scope.entity.Person.SEPTPIssueDate = null;
        $scope.entity.Person.SEPTPExpireDate = null;
        $scope.entity.Person.DangerousGoodsIssueDate = null;
        $scope.entity.Person.DangerousGoodsExpireDate = null;
        $scope.entity.Person.CCRMIssueDate = null;
        $scope.entity.Person.CCRMExpireDate = null;
        $scope.entity.Person.CRMIssueDate = null;
        $scope.entity.Person.CRMExpireDate = null;
        $scope.entity.Person.SMSIssueDate = null;
        $scope.entity.Person.SMSExpireDate = null;
        $scope.entity.Person.FirstAidIssueDate = null;
        $scope.entity.Person.FirstAidExpireDate = null;
        $scope.entity.Person.AviationSecurityIssueDate = null;
        $scope.entity.Person.AviationSecurityExpireDate = null;
        $scope.entity.Person.EGPWSIssueDate = null;
        $scope.entity.Person.EGPWSExpireDate = null;
        $scope.entity.Person.UpsetRecoveryTrainingIssueDate = null;
        $scope.entity.Person.UpsetRecoveryTrainingExpireDate = null;
        $scope.entity.Person.ColdWeatherOperationIssueDate = null;
        $scope.entity.Person.HotWeatherOperationIssueDate = null;

        $scope.entity.Person.ColdWeatherOperationExpireDate = null;
        $scope.entity.Person.HotWeatherOperationExpireDate = null;

        $scope.entity.Person.PBNRNAVIssueDate = null;
        $scope.entity.Person.PBNRNAVExpireDate = null;

        $scope.entity.Person.Code = null;
        $scope.entity.Person.ScheduleName = null;
        $scope.entity.Person.AircraftTypeId = null;
        $scope.entity.Person.DateTypeIssue = null;
        $scope.entity.Person.DateTypeExpire = null;
        $scope.entity.Person.ProficiencyDescriptionOPC = null;
        $scope.entity.Person.ProficiencyCheckDateOPC = null;
        $scope.entity.Person.ProficiencyValidUntilOPC = null;
        $scope.entity.Person.DateTRIExpired = null;
        $scope.entity.Person.DateTREExpired = null;


        $scope.entity.Person.DateIssueNDT = null;
        $scope.entity.Person.DateExpireNDT = null;

        $scope.entity.Person.DateCaoCardExpire = null;
        $scope.entity.Person.DateCaoCardIssue = null;
        $scope.entity.Person.LineIssueDate = null;
        $scope.entity.Person.LineExpireDate = null;
        $scope.entity.Person.RecurrentIssueDate = null;
        $scope.entity.Person.RecurrentExpireDate = null;
        $scope.entity.Person.Type737IssueDate = null;
        $scope.entity.Person.Type737ExpireDate = null;
        $scope.entity.Person.TypeMDIssueDate = null;
        $scope.entity.Person.TypeMDExpireDate = null;

        $scope.entity.Person.TypeAirbusIssueDate = null;
        $scope.entity.Person.TypeAirbusExpireDate = null;


        $scope.entity.Person.LRCIssueDate = null;
        $scope.entity.Person.LRCExpireDate = null;
        $scope.entity.Person.RSPIssueDate = null;
        $scope.entity.Person.RSPExpireDate = null;
        $scope.entity.Person.CTUIssueDate = null;
        $scope.entity.Person.CTUExpireDate = null;
        $scope.entity.Person.SAIssueDate = null;
        $scope.entity.Person.SAExpireDate = null;
        $scope.entity.Person.HFIssueDate = null;
        $scope.entity.Person.HFExpireDate = null;
        $scope.entity.Person.ASDIssueDate = null;
        $scope.entity.Person.ASDExpireDate = null;
        $scope.entity.Person.GOMIssueDate = null;
        $scope.entity.Person.GOMExpireDate = null;
        $scope.entity.Person.ASFIssueDate = null;
        $scope.entity.Person.ASFExpireDate = null;
        $scope.entity.Person.CCIssueDate = null;
        $scope.entity.Person.CCExpireDate = null;
        $scope.entity.Person.ERPIssueDate = null;
        $scope.entity.Person.ERPExpireDate = null;
        $scope.entity.Person.MBIssueDate = null;
        $scope.entity.Person.MBExpireDate = null;
        $scope.entity.Person.PSIssueDate = null;
        $scope.entity.Person.PSExpireDate = null;
        $scope.entity.Person.ANNEXIssueDate = null;
        $scope.entity.Person.ANNEXExpireDate = null;
        $scope.entity.Person.DRMIssueDate = null;
        $scope.entity.Person.DRMExpireDate = null;
        $scope.entity.Person.FMTDIssueDate = null;
        $scope.entity.Person.FMTDExpireDate = null;
        $scope.entity.Person.MELExpireDate = null;
        $scope.entity.Person.MELIssueDate = null;
        $scope.entity.Person.METIssueDate = null;
        $scope.entity.Person.METExpireDate = null;
        $scope.entity.Person.PERIssueDate = null;
        $scope.entity.Person.PERExpireDate = null;


        $scope.entity.Person.LPCC1ExpireDate = null;
        $scope.entity.Person.LPCC2ExpireDate = null;
        $scope.entity.Person.LPCC3ExpireDate = null;
        $scope.entity.Person.LPCC1IssueDate = null;
        $scope.entity.Person.LPCC2IssueDate = null;
        $scope.entity.Person.LPCC3IssueDate = null;
        $scope.entity.Person.OPCC1IssueDate = null;
        $scope.entity.Person.OPCC2IssueDate = null;
        $scope.entity.Person.OPCC3IssueDate = null;
        $scope.entity.Person.LineC1IssueDate = null;
        $scope.entity.Person.LineC2IssueDate = null;
        $scope.entity.Person.LineC3IssueDate = null;
        $scope.entity.Person.LineC1ExpireDate = null;
        $scope.entity.Person.LineC2ExpireDate = null;
        $scope.entity.Person.LineC3ExpireDate = null;
        $scope.entity.Person.RampIssueDate = null;
        $scope.entity.Person.RampExpireDate = null;
        $scope.entity.Person.ACIssueDate = null;
        $scope.entity.Person.ACExpireDate = null;
        $scope.entity.Person.UPRTIssueDate = null;
        $scope.entity.Person.UPRTExpireDate = null;
        $scope.entity.Person.SFIIssueDate = null;
        $scope.entity.Person.SFIExpireDate = null;
        $scope.entity.Person.SFEIssueDate = null;
        $scope.entity.Person.SFEExpireDate = null;
        $scope.entity.Person.TRI2IssueDate = null;
        $scope.entity.Person.TRI2ExpireDate = null;
        $scope.entity.Person.TRE2IssueDate = null;
        $scope.entity.Person.TRE2ExpireDate = null;
        $scope.entity.Person.IRIIssueDate = null;
        $scope.entity.Person.IRIExpireDate = null;
        $scope.entity.Person.IREIssueDate = null;
        $scope.entity.Person.IREExpireDate = null;
        $scope.entity.Person.CRIIssueDate = null;
        $scope.entity.Person.CRIExpireDate = null;
        $scope.entity.Person.CREIssueDate = null;
        $scope.entity.Person.CREExpireDate = null;
        $scope.entity.Person.SFI2IssueDate = null;
        $scope.entity.Person.SFI2ExpireDate = null;
        $scope.entity.Person.SFE2IssueDate = null;
        $scope.entity.Person.SFE2ExpireDate = null;
        $scope.entity.Person.AirCrewIssueDate = null;
        $scope.entity.Person.AirCrewExpireDate = null;
        $scope.entity.Person.AirOpsIssueDate = null;
        $scope.entity.Person.AirOpsExpireDate = null;
        $scope.entity.Person.SOPIssueDate = null;
        $scope.entity.Person.SOPExpireDate = null;
        $scope.entity.Person.Diff31IssueDate = null;
        $scope.entity.Person.Diff31ExpireDate = null;
        $scope.entity.Person.Diff34IssueDate = null;
        $scope.entity.Person.Diff34ExpireDate = null;
        $scope.entity.Person.OMA1IssueDate = null;
        $scope.entity.Person.OMA1ExpireDate = null;
        $scope.entity.Person.OMB1IssueDate = null;
        $scope.entity.Person.OMB1ExpireDate = null;
        $scope.entity.Person.OMC1IssueDate = null;
        $scope.entity.Person.OMC1ExpireDate = null;
        $scope.entity.Person.OMA2IssueDate = null;
        $scope.entity.Person.OMA2ExpireDate = null;
        $scope.entity.Person.OMB2IssueDate = null;
        $scope.entity.Person.OMB2ExpireDate = null;
        $scope.entity.Person.OMC2IssueDate = null;
        $scope.entity.Person.OMC2ExpireDate = null;
        $scope.entity.Person.OMA3IssueDate = null;
        $scope.entity.Person.OMA3ExpireDate = null;
        $scope.entity.Person.OMB3IssueDate = null;
        $scope.entity.Person.OMB3ExpireDate = null;
        $scope.entity.Person.OMC3IssueDate = null;
        $scope.entity.Person.OMC3ExpireDate = null;
        $scope.entity.Person.MapIssueDate = null;
        $scope.entity.Person.MapExpireDate = null;
        $scope.entity.Person.ComResIssueDate = null;
        $scope.entity.Person.ComResExpireDate = null;
        $scope.entity.Person.OPCC1ExpireDate = null;
        $scope.entity.Person.OPCC2ExpireDate = null;
        $scope.entity.Person.OPCC3ExpireDate = null;


        $scope.entity.Person.Educations = [];
        $scope.entity.Person.Expreienses = [];
        $scope.entity.Person.AircraftTypes = [];
        $scope.entity.Person.Documents = [];
        $scope.entity.Person.Ratings = [];
        $scope.entity.Person.Certificates = [];

        $scope.entity.Locations[0].Id = -1;


        $scope.entity.Locations[0].EmployeeId = -1;
        $scope.entity.Locations[0].LocationId = null;
        $scope.entity.Locations[0].IsMainLocation = 1;
        $scope.entity.Locations[0].OrgRoleId = null;
        $scope.entity.Locations[0].DateActiveStartP = null;
        $scope.entity.Locations[0].DateActiveEndP = null;
        $scope.entity.Locations[0].DateActiveStart = null;
        $scope.entity.Locations[0].DateActiveEnd = null;
        $scope.entity.Locations[0].Remark = null;
        $scope.entity.Locations[0].Phone = null;
        $scope.entity.Locations[0].OrgRole = null;
        $scope.entity.Locations[0].Title = null;
        $scope.entity.Locations[0].FullCode = null;
        $scope.img_url = 'content/images/imguser.png';

    };
    //xxxx
    $scope.clearEntityRating = function () {
        $scope.entityRating.Id = null;
        $scope.entityRating.PersonId = -1;
        $scope.entityRating.AircraftTypeId = null;
        $scope.entityRating.RatingId = null;
        $scope.entityRating.DateIssue = null;
        $scope.entityRating.DateExpire = null;
        $scope.entityRating.CategoryId = null;
        $scope.entityRating.AircraftType = null;
        $scope.entityRating.RatingOrganization = null;
        $scope.entityRating.OrganizationId = null;
        $scope.entityRating.Category = null;
    };
    $scope.clearEntityEducation = function () {
        $scope.entityEducation.Id = null;
        $scope.entityEducation.PersonId = -1;
        $scope.entityEducation.EducationDegreeId = null;
        $scope.entityEducation.DateCatch = null;
        $scope.entityEducation.College = null;
        $scope.entityEducation.Remark = null;
        $scope.entityEducation.Title = null;
        $scope.entityEducation.StudyFieldId = null;
        $scope.entityEducation.FileUrl = null;
        $scope.download = "";
        $scope.entityEducation.FileTitle = null;
        $scope.entityEducation.SysUrl = null;
        $scope.entityEducation.FileType = null;
    };
    $scope.clearEntityFile = function () {
        $scope.entityFile.Id = null;
        $scope.entityFile.DocumentTypeId = null;
        $scope.entityFile.FileTypeId = null;
        $scope.entityFile.FileUrl = null;
        $scope.entityFile.Title = null;
        $scope.entityFile.ParentId = null;
    };
    $scope.clearEntityExp = function () {
        $scope.entityExp.PersonId = -1;
        $scope.entityExp.OrganizationId = null;
        $scope.entityExp.Employer = null;
        $scope.entityExp.AircraftTypeId = null;
        $scope.entityExp.Remark = null;
        $scope.entityExp.DateStart = null;
        $scope.entityExp.DateEnd = null;
        $scope.entityExp.Organization = null;
        $scope.entityExp.JobTitle = null;
        $scope.entityExp.AircraftType = null;
        $scope.entityExp.Id = null;
    };

    $scope.clearEntityAircrafttype = function () {
        $scope.entityAircrafttype.Id = null;
        $scope.entityAircrafttype.AircraftTypeId = null;
        $scope.entityAircrafttype.PersonId = -1;
        $scope.entityAircrafttype.IsActive = 1;
        $scope.entityAircrafttype.DateLimitBegin = null;
        $scope.entityAircrafttype.DateLimitEnd = null;
        $scope.entityAircrafttype.Remark = null;
        $scope.entityAircrafttype.AircraftType = null;
        $scope.entityAircrafttype.Manufacturer = null;
    };
    $scope.clearEntityEducation = function () {
        $scope.entityEducation.Id = null;
        $scope.entityEducation.PersonId = -1;
        $scope.entityEducation.EducationDegreeId = null;
        $scope.entityEducation.DateCatch = null;
        $scope.entityEducation.College = null;
        $scope.entityEducation.Remark = null;
        $scope.entityEducation.Title = null;
        $scope.entityEducation.StudyFieldId = null;
        $scope.entityEducation.StudyField = null;
        $scope.entityEducation.EducationDegree = null;
        $scope.entityEducation.FileUrl = null;
        $scope.download = "";
        $scope.entityEducation.FileTitle = null;
        $scope.entityEducation.SysUrl = null;
        $scope.entityEducation.FileType = null;
    };
    $scope.bindPerson = function (data) {
        //Person
        $scope.entity.Person.PersonId = data.PersonId;
        $scope.entity.Person.DateCreate = data.DateCreate;
        $scope.entity.Person.MarriageId = data.MarriageId;
        $scope.entity.Person.NID = data.NID;
        $scope.entity.Person.SexId = data.SexId;
        $scope.entity.Person.FirstName = data.FirstName;
        $scope.entity.Person.LastName = data.LastName;
        $scope.entity.Person.DateBirth = data.DateBirth;
        $scope.entity.Person.Email = data.Email;
        $scope.entity.Person.EmailPassword = data.EmailPassword;
        $scope.entity.Person.Phone1 = data.Phone1;
        $scope.entity.Person.Phone2 = data.Phone2;
        $scope.entity.Person.Mobile = data.Mobile;
        $scope.entity.Person.FaxTelNumber = data.FaxTelNumber;
        $scope.entity.Person.PassportNumber = data.PassportNumber;
        $scope.entity.Person.DatePassportIssue = data.DatePassportIssue;
        $scope.entity.Person.DatePassportExpire = data.DatePassportExpire;
        $scope.entity.Person.Address = data.Address;
        $scope.entity.Person.IsActive = data.IsActive;
        $scope.entity.Person.DateJoinAvation = data.DateJoinAvation;
        $scope.entity.Person.DateLastCheckUP = data.DateLastCheckUP;
        $scope.entity.Person.DateNextCheckUP = data.DateNextCheckUP;
        $scope.entity.Person.DateYearOfExperience = data.DateYearOfExperience;
        $scope.entity.Person.CaoCardNumber = data.CaoCardNumber;
        $scope.entity.Person.DateCaoCardIssue = data.DateCaoCardIssue;
        $scope.entity.Person.DateCaoCardExpire = data.DateCaoCardExpire;
        $scope.entity.Person.LineIssueDate = data.LineIssueDate;
        $scope.entity.Person.LineExpireDate = data.LineExpireDate;
        $scope.entity.Person.RecurrentIssueDate = data.RecurrentIssueDate;
        $scope.entity.Person.RecurrentExpireDate = data.RecurrentExpireDate;

        $scope.entity.Person.CompetencyNo = data.CompetencyNo;
        $scope.entity.Person.CaoInterval = data.CaoInterval;
        $scope.entity.Person.CaoIntervalCalanderTypeId = data.CaoIntervalCalanderTypeId;
        $scope.entity.Person.IsDeleted = data.IsDeleted;
        $scope.entity.Person.Remark = data.Remark;
        $scope.entity.Person.StampNumber = data.StampNumber;
        $scope.entity.Person.StampUrl = data.StampUrl;
        $scope.entity.Person.TechLogNo = data.TechLogNo;
        $scope.entity.Person.DateIssueNDT = data.DateIssueNDT;
        $scope.entity.Person.IntervalNDT = data.IntervalNDT;
        $scope.entity.Person.NDTNumber = data.NDTNumber;
        $scope.entity.Person.NDTIntervalCalanderTypeId = data.NDTIntervalCalanderTypeId;
        $scope.entity.Person.IsAuditor = data.IsAuditor;
        $scope.entity.Person.IsAuditee = data.IsAuditee;
        $scope.entity.Person.Nickname = data.Nickname;
        $scope.entity.Person.CityId = data.CityId;
        $scope.entity.Person.FatherName = data.FatherName;
        $scope.entity.Person.IDNo = data.IDNo;
        $scope.entity.Person.RowId = data.RowId;
        $scope.entity.Person.UserId = data.UserId;
        $scope.entity.Person.ImageUrl = data.ImageUrl;
        if (data.ImageUrl)
            $scope.img_url = $rootScope.clientsFilesUrl + data.ImageUrl;
        else
            $scope.img_url = 'content/images/imguser.png';
        $scope.entity.Person.CustomerCreatorId = data.CustomerCreatorId;
        $scope.entity.Person.DateExpireNDT = data.DateExpireNDT;

        $scope.entity.Person.ProficiencyExpireDate = data.ProficiencyExpireDate;
        $scope.entity.Person.CrewMemberCertificateExpireDate = data.CrewMemberCertificateExpireDate;
        $scope.entity.Person.LicenceExpireDate = data.LicenceExpireDate;
        $scope.entity.Person.LicenceIRExpireDate = data.LicenceIRExpireDate;
        $scope.entity.Person.SimulatorLastCheck = data.SimulatorLastCheck;
        $scope.entity.Person.SimulatorNextCheck = data.SimulatorNextCheck;
        $scope.entity.Person.RampPassNo = data.RampPassNo;
        $scope.entity.Person.RampPassExpireDate = data.RampPassExpireDate;
        $scope.entity.Person.LanguageCourseExpireDate = data.LanguageCourseExpireDate;
        $scope.entity.Person.LicenceTitle = data.LicenceTitle;
        $scope.entity.Person.LicenceInitialIssue = data.LicenceInitialIssue;
        $scope.entity.Person.RaitingCertificates = data.RaitingCertificates;
        $scope.entity.Person.LicenceIssueDate = data.LicenceIssueDate;
        $scope.entity.Person.LicenceDescription = data.LicenceDescription;
        $scope.entity.Person.ProficiencyCheckType = data.ProficiencyCheckType;
        $scope.entity.Person.ProficiencyCheckDate = data.ProficiencyCheckDate;
        $scope.entity.Person.ProficiencyValidUntil = data.ProficiencyValidUntil;
        $scope.entity.Person.ICAOLPRLevel = data.ICAOLPRLevel;
        $scope.entity.Person.ICAOLPRValidUntil = data.ICAOLPRValidUntil;
        $scope.entity.Person.MedicalClass = data.MedicalClass;
        $scope.entity.Person.CMCEmployedBy = data.CMCEmployedBy;
        $scope.entity.Person.CMCOccupation = data.CMCOccupation;
        $scope.entity.Person.PostalCode = data.PostalCode;
        $scope.entity.Person.ProficiencyIPC = data.ProficiencyIPC;
        $scope.entity.Person.ProficiencyOPC = data.ProficiencyOPC;
        $scope.entity.Person.ProficiencyDescription = data.ProficiencyDescription;
        $scope.entity.Person.MedicalLimitation = data.MedicalLimitation;
        $scope.entity.Person.VisaExpireDate = data.VisaExpireDate;

        $scope.entity.Person.SEPTIssueDate = data.SEPTIssueDate;
        $scope.entity.Person.SEPTExpireDate = data.SEPTExpireDate;
        $scope.entity.Person.SEPTPIssueDate = data.SEPTPIssueDate;
        $scope.entity.Person.SEPTPExpireDate = data.SEPTPExpireDate;
        $scope.entity.Person.DangerousGoodsIssueDate = data.DangerousGoodsIssueDate;
        $scope.entity.Person.DangerousGoodsExpireDate = data.DangerousGoodsExpireDate;
        $scope.entity.Person.CCRMIssueDate = data.CCRMIssueDate;
        $scope.entity.Person.CCRMExpireDate = data.CCRMExpireDate;
        $scope.entity.Person.CRMIssueDate = data.CRMIssueDate;
        $scope.entity.Person.CRMExpireDate = data.CRMExpireDate;
        $scope.entity.Person.SMSIssueDate = data.SMSIssueDate;
        $scope.entity.Person.SMSExpireDate = data.SMSExpireDate;
        $scope.entity.Person.FirstAidIssueDate = data.FirstAidIssueDate;
        $scope.entity.Person.FirstAidExpireDate = data.FirstAidExpireDate;

        $scope.entity.Person.AircraftTypeId = data.AircraftTypeId;
        $scope.entity.Person.DateTypeIssue = data.DateTypeIssue;
        $scope.entity.Person.DateTypeExpire = data.DateTypeExpire;

        $scope.entity.Person.AviationSecurityIssueDate = data.AviationSecurityIssueDate;
        $scope.entity.Person.AviationSecurityExpireDate = data.AviationSecurityExpireDate;
        $scope.entity.Person.EGPWSIssueDate = data.EGPWSIssueDate;
        $scope.entity.Person.EGPWSExpireDate = data.EGPWSExpireDate;
        $scope.entity.Person.UpsetRecoveryTrainingIssueDate = data.UpsetRecoveryTrainingIssueDate;
        $scope.entity.Person.UpsetRecoveryTrainingExpireDate = data.UpsetRecoveryTrainingExpireDate;
        $scope.entity.Person.ColdWeatherOperationIssueDate = data.ColdWeatherOperationIssueDate;
        $scope.entity.Person.HotWeatherOperationIssueDate = data.HotWeatherOperationIssueDate;

        $scope.entity.Person.ColdWeatherOperationExpireDate = data.ColdWeatherOperationExpireDate;
        $scope.entity.Person.HotWeatherOperationExpireDate = data.HotWeatherOperationExpireDate;

        $scope.entity.Person.PBNRNAVIssueDate = data.PBNRNAVIssueDate;
        $scope.entity.Person.PBNRNAVExpireDate = data.PBNRNAVExpireDate;

        $scope.entity.Person.Code = data.Code;
        $scope.entity.Person.ScheduleName = data.ScheduleName;

        $scope.entity.Person.ProficiencyDescriptionOPC = data.ProficiencyDescriptionOPC;
        $scope.entity.Person.ProficiencyCheckDateOPC = data.ProficiencyCheckDateOPC;
        $scope.entity.Person.ProficiencyValidUntilOPC = data.ProficiencyValidUntilOPC;
        $scope.entity.Person.DateTRIExpired = data.DateTRIExpired;
        $scope.entity.Person.DateTREExpired = data.DateTREExpired;
        $scope.entity.Person.Type737IssueDate = data.Type737IssueDate;
        $scope.entity.Person.Type737ExpireDate = data.Type737ExpireDate;

        $scope.entity.Person.TypeMDIssueDate = data.TypeMDIssueDate;
        $scope.entity.Person.TypeMDExpireDate = data.TypeMDExpireDate;

        $scope.entity.Person.TypeAirbusIssueDate = data.TypeAirbusIssueDate;
        $scope.entity.Person.TypeAirbusExpireDate = data.TypeAirbusExpireDate;


        $scope.entity.Person.LRCIssueDate = data.LRCIssueDate;
        $scope.entity.Person.LRCExpireDate = data.LRCExpireDate;
        $scope.entity.Person.RSPIssueDate = data.RSPIssueDate;
        $scope.entity.Person.RSPExpireDate = data.RSPExpireDate;
        $scope.entity.Person.CTUIssueDate = data.CTUIssueDate;
        $scope.entity.Person.CTUExpireDate = data.CTUExpireDate;
        $scope.entity.Person.SAIssueDate = data.SAIssueDate;
        $scope.entity.Person.SAExpireDate = data.SAExpireDate;
        $scope.entity.Person.HFIssueDate = data.HFIssueDate;
        $scope.entity.Person.HFExpireDate = data.HFExpireDate;
        $scope.entity.Person.ASDIssueDate = data.ASDIssueDate;
        $scope.entity.Person.ASDExpireDate = data.ASDExpireDate;
        $scope.entity.Person.GOMIssueDate = data.GOMIssueDate;
        $scope.entity.Person.GOMExpireDate = data.GOMExpireDate;
        $scope.entity.Person.ASFIssueDate = data.ASFIssueDate;
        $scope.entity.Person.ASFExpireDate = data.ASFExpireDate;
        $scope.entity.Person.CCIssueDate = data.CCIssueDate;
        $scope.entity.Person.CCExpireDate = data.CCExpireDate;
        $scope.entity.Person.ERPIssueDate = data.ERPIssueDate;
        $scope.entity.Person.ERPExpireDate = data.ERPExpireDate;
        $scope.entity.Person.MBIssueDate = data.MBIssueDate;
        $scope.entity.Person.MBExpireDate = data.MBExpireDate;
        $scope.entity.Person.PSIssueDate = data.PSIssueDate;
        $scope.entity.Person.PSExpireDate = data.PSExpireDate;
        $scope.entity.Person.ANNEXIssueDate = data.ANNEXIssueDate;
        $scope.entity.Person.ANNEXExpireDate = data.ANNEXExpireDate;
        $scope.entity.Person.DRMIssueDate = data.DRMIssueDate;
        $scope.entity.Person.DRMExpireDate = data.DRMExpireDate;
        $scope.entity.Person.FMTDIssueDate = data.FMTDIssueDate;
        $scope.entity.Person.FMTDExpireDate = data.FMTDExpireDate;
        $scope.entity.Person.MELExpireDate = data.MELExpireDate;
        $scope.entity.Person.MELIssueDate = data.MELIssueDate;
        $scope.entity.Person.METIssueDate = data.METIssueDate;
        $scope.entity.Person.METExpireDate = data.METExpireDate;
        $scope.entity.Person.PERIssueDate = data.PERIssueDate;
        $scope.entity.Person.PERExpireDate = data.PERExpireDate;



        $scope.entity.Person.LPCC1ExpireDate = data.LPCC1ExpireDate;
        $scope.entity.Person.LPCC2ExpireDate = data.LPCC2ExpireDate;
        $scope.entity.Person.LPCC3ExpireDate = data.LPCC3ExpireDate;
        $scope.entity.Person.LPCC1IssueDate = data.LPCC1IssueDate;
        $scope.entity.Person.LPCC2IssueDate = data.LPCC2IssueDate;
        $scope.entity.Person.LPCC3IssueDate = data.LPCC3IssueDate;
        $scope.entity.Person.OPCC1IssueDate = data.OPCC1IssueDate;
        $scope.entity.Person.OPCC2IssueDate = data.OPCC2IssueDate;
        $scope.entity.Person.OPCC3IssueDate = data.OPCC3IssueDate;
        $scope.entity.Person.LineC1IssueDate = data.LineC1IssueDate;
        $scope.entity.Person.LineC2IssueDate = data.LineC2IssueDate;
        $scope.entity.Person.LineC3IssueDate = data.LineC3IssueDate;
        $scope.entity.Person.LineC1ExpireDate = data.LineC1ExpireDate;
        $scope.entity.Person.LineC2ExpireDate = data.LineC2ExpireDate;
        $scope.entity.Person.LineC3ExpireDate = data.LineC3ExpireDate;
        $scope.entity.Person.RampIssueDate = data.RampIssueDate;
        $scope.entity.Person.RampExpireDate = data.RampExpireDate;
        $scope.entity.Person.ACIssueDate = data.ACIssueDate;
        $scope.entity.Person.ACExpireDate = data.ACExpireDate;
        $scope.entity.Person.UPRTIssueDate = data.UPRTIssueDate;
        $scope.entity.Person.UPRTExpireDate = data.UPRTExpireDate;
        $scope.entity.Person.SFIIssueDate = data.SFIIssueDate;
        $scope.entity.Person.SFIExpireDate = data.SFIExpireDate;
        $scope.entity.Person.SFEIssueDate = data.SFEIssueDate;
        $scope.entity.Person.SFEExpireDate = data.SFEExpireDate;
        $scope.entity.Person.TRI2IssueDate = data.TRI2IssueDate;
        $scope.entity.Person.TRI2ExpireDate = data.TRI2ExpireDate;
        $scope.entity.Person.TRE2IssueDate = data.TRE2IssueDate;
        $scope.entity.Person.TRE2ExpireDate = data.TRE2ExpireDate;
        $scope.entity.Person.IRIIssueDate = data.IRIIssueDate;
        $scope.entity.Person.IRIExpireDate = data.IRIExpireDate;
        $scope.entity.Person.IREIssueDate = data.IREIssueDate;
        $scope.entity.Person.IREExpireDate = data.IREExpireDate;
        $scope.entity.Person.CRIIssueDate = data.CRIIssueDate;
        $scope.entity.Person.CRIExpireDate = data.CRIExpireDate;
        $scope.entity.Person.CREIssueDate = data.CREIssueDate;
        $scope.entity.Person.CREExpireDate = data.CREExpireDate;
        $scope.entity.Person.SFI2IssueDate = data.SFI2IssueDate;
        $scope.entity.Person.SFI2ExpireDate = data.SFI2ExpireDate;
        $scope.entity.Person.SFE2IssueDate = data.SFE2IssueDate;
        $scope.entity.Person.SFE2ExpireDate = data.SFE2ExpireDate;
        $scope.entity.Person.AirCrewIssueDate = data.AirCrewIssueDate;
        $scope.entity.Person.AirCrewExpireDate = data.AirCrewExpireDate;
        $scope.entity.Person.AirOpsIssueDate = data.AirOpsIssueDate;
        $scope.entity.Person.AirOpsExpireDate = data.AirOpsExpireDate;
        $scope.entity.Person.SOPIssueDate = data.SOPIssueDate;
        $scope.entity.Person.SOPExpireDate = data.SOPExpireDate;
        $scope.entity.Person.Diff31IssueDate = data.Diff31IssueDate;
        $scope.entity.Person.Diff31ExpireDate = data.Diff31ExpireDate;
        $scope.entity.Person.Diff34IssueDate = data.Diff34IssueDate;
        $scope.entity.Person.Diff34ExpireDate = data.Diff34ExpireDate;
        $scope.entity.Person.OMA1IssueDate = data.OMA1IssueDate;
        $scope.entity.Person.OMA1ExpireDate = data.OMA1ExpireDate;
        $scope.entity.Person.OMB1IssueDate = data.OMB1IssueDate;
        $scope.entity.Person.OMB1ExpireDate = data.OMB1ExpireDate;
        $scope.entity.Person.OMC1IssueDate = data.OMC1IssueDate;
        $scope.entity.Person.OMC1ExpireDate = data.OMC1ExpireDate;
        $scope.entity.Person.OMA2IssueDate = data.OMA2IssueDate;
        $scope.entity.Person.OMA2ExpireDate = data.OMA2ExpireDate;
        $scope.entity.Person.OMB2IssueDate = data.OMB2IssueDate;
        $scope.entity.Person.OMB2ExpireDate = data.OMB2ExpireDate;
        $scope.entity.Person.OMC2IssueDate = data.OMC2IssueDate;
        $scope.entity.Person.OMC2ExpireDate = data.OMC2ExpireDate;
        $scope.entity.Person.OMA3IssueDate = data.OMA3IssueDate;
        $scope.entity.Person.OMA3ExpireDate = data.OMA3ExpireDate;
        $scope.entity.Person.OMB3IssueDate = data.OMB3IssueDate;
        $scope.entity.Person.OMB3ExpireDate = data.OMB3ExpireDate;
        $scope.entity.Person.OMC3IssueDate = data.OMC3IssueDate;
        $scope.entity.Person.OMC3ExpireDate = data.OMC3ExpireDate;
        $scope.entity.Person.MapIssueDate = data.MapIssueDate;
        $scope.entity.Person.MapExpireDate = data.MapExpireDate;
        $scope.entity.Person.ComResIssueDate = data.ComResIssueDate;
        $scope.entity.Person.ComResExpireDate = data.ComResExpireDate;
        $scope.entity.Person.OPCC1ExpireDate = data.OPCC1ExpireDate;
        $scope.entity.Person.OPCC2ExpireDate = data.OPCC2ExpireDate;
        $scope.entity.Person.OPCC3ExpireDate = data.OPCC3ExpireDate;




        $scope.entity.Person.Educations = data.Educations;
        $scope.entity.Person.Expreienses = data.Expreienses;
        $scope.entity.Person.AircraftTypes = data.AircraftTypes;
        $scope.entity.Person.Documents = data.Documents;
        $scope.entity.Person.Ratings = data.Ratings;

        $scope.entity.Person.Certificates = data.Certificates;


        $scope.entity.Person.DateIssueNDT = data.DateIssueNDT;
        $scope.entity.Person.DateExpireNDT = data.DateExpireNDT;

        $scope.entity.Person.DateCaoCardExpire = data.DateCaoCardExpire;
        $scope.entity.Person.DateCaoCardIssue = data.DateCaoCardIssue;
        $scope.entity.Person.OtherAirline = data.OtherAirline;
        //////////////////////
    };
    $scope.bindLocation = function (data) {
        $scope.entity.Locations[0].Id = data.Id;
        $scope.entity.Locations[0].EmployeeId = data.EmployeeId;
        $scope.entity.Locations[0].LocationId = data.LocationId;
        $scope.entity.Locations[0].IsMainLocation = data.IsMainLocation;
        $scope.entity.Locations[0].OrgRoleId = data.OrgRoleId;
        $scope.entity.Locations[0].DateActiveStartP = data.DateActiveStartP;
        $scope.entity.Locations[0].DateActiveEndP = data.DateActiveEndP;
        $scope.entity.Locations[0].DateActiveStart = data.DateActiveStart;
        $scope.entity.Locations[0].DateActiveEnd = data.DateActiveEnd;
        $scope.entity.Locations[0].Remark = data.Remark;
        $scope.entity.Locations[0].Phone = data.Phone;
        $scope.entity.Locations[0].OrgRole = data.OrgRole;
        $scope.entity.Locations[0].Title = data.Title;
        $scope.entity.Locations[0].FullCode = data.FullCode;
    };
    $scope.bind = function (data) {
        $scope.bindPerson(data.Person);

        $scope.entity.Id = data.Id;
        $scope.entity.PersonId = data.PersonId;
        $scope.entity.PID = data.PID;
        $scope.entity.Phone = data.Phone;
        $scope.entity.DateJoinCompany = data.DateJoinCompany;
        $scope.entity.GroupId = data.GroupId;
        $scope.entity.Username = data.Username;
        $scope.entity.Password = data.Password;
        $scope.entity.DateLastLogin = data.DateLastLogin;
        $scope.entity.DateJoinCompanyP = data.DateJoinCompanyP;
        $scope.entity.IsActive = data.IsActive;
        $scope.entity.DateRegisterP = data.DateRegisterP;
        $scope.entity.DateConfirmedP = data.DateConfirmedP;
        $scope.entity.DateRegister = data.DateRegister;
        $scope.entity.DateConfirmed = data.DateConfirmed;
        $scope.entity.IsDeleted = data.IsDeleted;
        $scope.entity.DateActiveStart = data.DateActiveStart;
        $scope.entity.DateActiveEnd = data.DateActiveEnd;
        $scope.entity.DateLastLoginP = data.DateLastLoginP;
        $scope.entity.BaseAirportId = data.BaseAirportId;
        $scope.entity.DateInactiveBegin = data.DateInactiveBegin;
        $scope.entity.InActive = data.InActive;
        $scope.entity.DateInactiveEnd = data.DateInactiveEnd;

        if (data.Locations && data.Locations.length > 0) {
            $scope.bindLocation(data.Locations[0]);
        }

        //alert($scope.entity.Person.DateTypeIssue);


    };
    //////////////////////////////
    //nasiri
    $scope.formatDate = function (dt) {
        if (!dt)
            return "";
        return moment(new Date(dt)).format("YYYY-MMM-DD");
    };
    $scope.doc_click = function (str) {
        return;
        var list = $rootScope.getCertificateTypeList();
        var list2 = $rootScope.getCertificateTypeListDetails();

        if (list.indexOf(str) != -1) {

            $scope.loadingVisible = true;
            var typ = Enumerable.From(list2).Where('$.title=="' + str + '"').FirstOrDefault();
            trnService.getCertificateObj($scope.entity.Person.PersonId, typ.type, str).then(function (response) {

                $scope.loadingVisible = false;
                var emp = response.Data.employee;

                var _caption = emp.Name + ', ' + (typ.caption ? typ.caption : typ.title)
                    + ', ' + 'ISSUE: ' + (typ.issue ? $scope.formatDate(emp[typ.issue]) : '')
                    + ', ' + 'EXPIRE: ' + (typ.expire ? $scope.formatDate(emp[typ.expire]) : '');
                /* if (response.Data.document && response.Data.document.FileUrl)
                    
                     $scope.showImage({ url: $rootScope.clientsFilesUrl + "/" + response.Data.document.FileUrl, caption: _caption });
 
                 else if (response.Data.certificate && response.Data.certificate.ImgUrl)
                  
                     $scope.showImage({ url: $rootScope.clientsFilesUrl + "/" + response.Data.certificate.ImgUrl, caption: _caption });
               
                 else {
                     General.ShowNotify('The related DOCUMENT not found', 'error');
                 }*/




                if (response.Data.certificate && response.Data.certificate.ImgUrl)

                    $scope.showImage({ url: $rootScope.clientsFilesUrl + "/" + response.Data.certificate.ImgUrl, caption: _caption });
                else
                    if (response.Data.document && response.Data.document.FileUrl)

                        $scope.showImage({ url: $rootScope.clientsFilesUrl + "/" + response.Data.document.FileUrl, caption: _caption });
                    else {
                        General.ShowNotify('The related DOCUMENT not found', 'error');
                    }
            }, function (err) { $scope.loadingVisible = false; $scope.popup_notify_visible = false; General.ShowNotify(err.message, 'error'); });





        }
        else {
            var doc = Enumerable.From($scope.entity.Person.Documents).Where('$.DocumentType=="' + str + '"').FirstOrDefault();
            if (doc) {
                var _url = doc.Documents[0].FileUrl;
                $scope.showImage({ url: _url, caption: '' });
                // $window.open($rootScope.clientsFilesUrl + "/" + url, '_blank');
                // var _doc = JSON.parse(JSON.stringify(doc));

                // $scope.bindDocumnetView(_doc);
                // $scope.popup_file_view_visible = true;
            }
            else {
                General.ShowNotify("No Documents Found", 'error');
            }
        }

    };
    function checkURLIsImage(url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }
    $scope.showImage = function (item) {
        if (checkURLIsImage(item.url)) {
            var data = { url: item.url, caption: item.caption };

            $rootScope.$broadcast('InitImageViewer', data);
        }
        else
            $window.open(item.url, '_blank');

    };

    //////////////////////////
    $scope.loadingVisible = false;
    $scope.loadPanel = {
        message: 'Please wait...',

        showIndicator: true,
        showPane: true,
        shading: true,
        closeOnOutsideClick: false,
        shadingColor: "rgba(0,0,0,0.4)",
        // position: { of: "body" },
        onShown: function () {

        },
        onHidden: function () {

        },
        bindingOptions: {
            visible: 'loadingVisible'
        }
    };
    ////////////////////////
    var tabs = [
        { text: "Main", id: 'main', visible_btn: false },
        { text: "Education", id: 'education', visible_btn: false },
        //  { text: "حساب بانکی", id: 'account', visible_btn: false },
        //{ text: "Certificate", id: 'certificate', visible_btn: true },
        { text: "Document", id: 'file', visible_btn: false, visible_btn2: true },
        { text: "Experience", id: 'experience', visible_btn: false, visible: $scope.isView },
        { text: "Rating", id: 'rating', visible_btn: false, visible: $scope.isView },
        { text: "Aircraft Type", id: 'aircrafttype', visible_btn: false, visible: $scope.isView },
        // { text: "Certificates", id: 'certificate', visible_btn: false, visible: $scope.isView },
        // { text: "Courses", id: 'course', visible_btn: false, visible: $scope.isView },
        //{ text: "Membership", id: 'membership', visible_btn: false, visible: $scope.isView },


    ];
    $scope.btn_visible_education = false;
    $scope.btn_visible_certificate = false;
    $scope.btn_visible_file = false;
    $scope.btn_visible_experience = false;
    $scope.btn_visible_rating = false;
    $scope.btn_visible_aircrafttype = false;
    $scope.btn_visible_certificate = false;
    $scope.btn_visible_course = false;

    $scope.btn_location_education = 'after';
    $scope.btn_location_certificate = 'after';
    $scope.btn_location_file = 'after';
    $scope.btn_location_experience = 'after';
    $scope.btn_location_rating = 'after';
    $scope.tabs = tabs;
    $scope.selectedTabIndex = 0;
    $scope.$watch("selectedTabIndex", function (newValue) {

        try {
            $scope.selectedTab = tabs[newValue];
            $('.tab').hide();
            $('.' + $scope.selectedTab.id).fadeIn(100, function () {


            });

            $scope.dg_education_instance.repaint();
            $scope.dg_file_instance.repaint();
            $scope.dg_exp_instance.repaint();
            $scope.dg_rating_instance.repaint();
            $scope.dg_aircrafttype_instance.repaint();

            //var myVar = setInterval(function () {

            //    var scl = $("#dg_education").find('.dx-datagrid-rowsview').dxScrollable('instance');
            //    scl.scrollTo({ left: 0 });
            //    var scl2 = $("#dg_file").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl2.scrollTo({ left: 0 });
            //    var scl3 = $("#dg_exp").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl3.scrollTo({ left: 0 });
            //    var scl4 = $("#dg_rating").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl4.scrollTo({ left: 0 });
            //    var scl5 = $("#dg_aircrafttype").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl5.scrollTo({ left: 0 });

            //    clearInterval(myVar);
            //}, 100);




            $scope.btn_visible_education = newValue == 1;


            $scope.btn_visible_file = newValue == 2;
            $scope.btn_visible_experience = newValue == 3;
            $scope.btn_visible_rating = newValue == 4;
            $scope.btn_visible_aircrafttype = newValue == 5;

            $scope.btn_visible_course = newValue == 7;



        }
        catch (e) {

        }

    });
    $scope.tabs_options = {


        onItemClick: function (arg) {
            //$scope.selectedTab = arg.itemData;

        },
        bindingOptions: {

            dataSource: { dataPath: "tabs", deep: true },
            selectedIndex: 'selectedTabIndex'
        }

    };
    /////////////////////////
    $scope.IsMainDisabled = false;
    $scope.IsNIDDisabled = false;
    $scope.nid = null;
    $scope.doNID = true;
    $scope.getByNID = function (newValue) {

        $scope.IsMainDisabled = true;
        $scope.loadingVisible = true;
        personService.getEmployee(newValue, Config.CustomerId).then(function (response) {

            $scope.loadingVisible = false;
            $scope.IsMainDisabled = false;
            //$scope.bind(response);
            //console.log(response);

            if (!response) {
                $scope.entity.Person.PersonId = -1;
                $scope.entity.PersonId = -1;
                $scope.entity.Id = -1;
                $scope.entity.CustomerCreatorId = Config.CustomerId;
                $scope.entity.Person.NID = newValue;

                return;
            }

            $scope.bind(response);

            if (!$scope.isNew)
                $scope.doNID = false;


        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });


        //$rootScope.loadingVisible = true;
        //Client.getEntityByNID(newValue, $scope.entity.FkCustomer, $scope.rootLocation.FkParentId,
        //    function (data) {

        //        $scope.$apply(function () {
        //            $rootScope.loadingVisible = false;

        //            //$scope.entity.Id = -1;
        //            if (data.FkPerson && data.FkPerson != -1) {

        //                $scope.bind(data);
        //            }
        //            else {
        //                $scope.entity.FkCustomerCreator = $scope.entity.FkCustomer;

        //                $scope.IsMainDisabled = false;
        //                $scope.IsPIDDisabled = false;
        //            }

        //        });


        //    },
        //    function (ex) {
        //        $scope.$apply(function (e) {
        //            $rootScope.loadingVisible = false;
        //            $scope.c_nid = null;
        //        });
        //        General.ShowNotify(ex.message, 'error');
        //    });
    };
    $scope.$watch("nid", function (newValue) {

        if (newValue == $scope.entity.Person.NID)
            return;
        if (newValue && newValue.length == 10) {
            if ($scope.doNID)
                $scope.getByNID(newValue);
            else {
                $scope.entity.Person.NID = newValue;
                $scope.IsMainDisabled = false;
            }
        }
        else {
            $scope.IsMainDisabled = true;

        }
    });
    $scope.txt_nid = {

        valueChangeEvent: 'keyup',
        readOnly: false,
        hoverStateEnabled: false,

        mask: "999-999999-9",

        maskInvalidMessage: 'Wrong value',
        bindingOptions: {
            value: 'nid',
            readOnly: 'IsNIDDisabled'
        }
    };

    $scope.chk_ProficiencyIPC = {
        hoverStateEnabled: false,
        text: 'LPC',
        bindingOptions: {
            value: 'entity.Person.ProficiencyIPC',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.chk_ProficiencyOPC = {
        hoverStateEnabled: false,
        text: 'OPC',
        bindingOptions: {
            value: 'entity.Person.ProficiencyOPC',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.txt_LicenceTitle = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.LicenceTitle',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.txt_RaitingCertificates = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.RaitingCertificates',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.txt_LicenceDescription = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.LicenceDescription',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_MedicalLimitation = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.MedicalLimitation',
            readOnly: 'IsMainDisabled',
        }
    };


    $scope.txt_ProficiencyDescription = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.ProficiencyDescription',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_ProficiencyDescriptionOPC = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.ProficiencyDescriptionOPC',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.txt_CMCEmployedBy = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.CMCEmployedBy',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.txt_CMCOccupation = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.CMCOccupation',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.txt_PostalCode = {
        hoverStateEnabled: false,
        mask: "9999999999",
        bindingOptions: {
            value: 'entity.Person.PostalCode',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.txt_CaoCardNumber = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.CaoCardNumber',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_NDTNumber = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.NDTNumber',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_Code = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.Code',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_ScheduleName = {
        hoverStateEnabled: false,
        readOnly: true,
        bindingOptions: {
            value: 'entity.Person.ScheduleName',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_FirstName = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.FirstName',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_LastName = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.LastName',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_FatherName = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.FatherName',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_Address = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.Address',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_PassportNumber = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.PassportNumber',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_DocumentTitle = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entityDocument.Remark',

        }
    };
    $scope.txt_DocumentTitle2 = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entityDocument2.Remark',

        }
    };
    $scope.txt_EducationField = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entityEducation.Title',

        }
    };
    $scope.txt_EducationCollege = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entityEducation.College',

        }
    };
    $scope.txt_EducationRemark = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entityEducation.Remark',

        }
    };
    $scope.txt_AircraftTypeRemark = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entityAircrafttype.Remark',

        }
    };

    $scope.txt_ExpRemark = {
        hoverStateEnabled: false,
        height: 60,
        bindingOptions: {
            value: 'entityExp.Remark',

        }
    };
    $scope.txt_ExpJobTitle = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entityExp.JobTitle',

        }
    };
    $scope.txt_ExpOrganization = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entityExp.Organization',

        }
    };

    $scope.txt_Mobile = {


        hoverStateEnabled: false,
        mask: "AB00-0000000",
        maskRules: {
            "A": /[0]/,
            "B": /[9]/,

        },
        maskChar: '_',
        maskInvalidMessage: 'Wrong value',

        bindingOptions: {
            value: 'entity.Person.Mobile',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.emailValidationRules = {
        validationRules: [
            //    {
            //    type: "required",
            //    message: "Email is required"
            //},
            {
                type: "email",
                message: "Email is invalid"
            }]
    };
    $scope.txt_Email = {
        mode: 'email',
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.Email',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_phone = {
        readOnly: false,
        hoverStateEnabled: false,

        mask: "A00000009999",
        maskRules: {
            "A": /[0]/,


        },
        maskChar: ' ',
        maskInvalidMessage: 'Wrong value',
        rtlEnabled: false,
        bindingOptions: {
            value: 'entity.Person.Phone1',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_ephone = {
        readOnly: false,
        hoverStateEnabled: false,

        mask: "A00000009999",
        maskRules: {
            "A": /[0]/,


        },
        maskChar: ' ',
        maskInvalidMessage: 'Wrong value',
        rtlEnabled: false,
        bindingOptions: {
            value: 'entity.Phone',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_IDNo = {
        readOnly: false,
        hoverStateEnabled: false,

        mask: "9999999999",

        maskChar: ' ',
        maskInvalidMessage: 'Wrong value',
        rtlEnabled: false,
        bindingOptions: {
            value: 'entity.Person.IDNo',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_PID = {
        readOnly: false,
        hoverStateEnabled: false,
        //mask: "9999999999",
        // maskChar: ' ',
        // maskInvalidMessage: 'Wrong value',
        rtlEnabled: false,
        bindingOptions: {
            value: 'entity.PID',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.LPRDisabled = false;
    $scope.txt_ICAOLPRLevel = {
        min: 1,
        max: 6,
        onValueChanged: function (e) {

            $scope.LPRDisabled = e.value == 6;
        },
        bindingOptions: {
            value: 'entity.Person.ICAOLPRLevel',
            readOnly: 'IsMainDisabled',
        }
    };

    //$scope.timeBase = 'LCL';
    $scope.sb_ICAOLPRLevel = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: [1, 2, 3, 4, 5, 6],
        //readOnly:true,
        onValueChanged: function (e) {
            $scope.LPRDisabled = e.value == 6;

        },
        bindingOptions: {
            value: 'entity.Person.ICAOLPRLevel',
            readOnly: 'IsMainDisabled',
            // readOnly: 'depReadOnly'
        }
    };

    $scope.txt_MedicalClass = {
        min: 1,
        max: 3,
        bindingOptions: {
            value: 'entity.Person.MedicalClass',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_CaoInterval = {
        min: 1,
        bindingOptions: {
            value: 'entity.Person.CaoInterval',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.txt_IntervalNDT = {
        min: 1,
        bindingOptions: {
            value: 'entity.Person.IntervalNDT',
            readOnly: 'IsMainDisabled',
        }
    }

    $scope.date_DateBirth = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.DateBirth',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.date_DateCompany = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.DateJoinCompany',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.date_DateCaoCardIssue = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.DateCaoCardIssue',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.date_DateCaoCardExpire = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.DateCaoCardExpire',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_DateIssueNDT = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.DateIssueNDT',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.date_DateExpireNDT = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.DateExpireNDT',
            readOnly: 'IsMainDisabled',
        }
    };

    ////////////////////////
    //$scope.entity.Person.VisaExpireDate
    $scope.date_VisaExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.VisaExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };
    ///////////////////////////////////////////

    $scope.date_SEPTIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            // if (!($scope.isNew || !$scope.entity.Person.SEPTExpireDate))
            //      return;
            if (!e.value) {
                $scope.entity.Person.SEPTExpireDate = null;
                return;
            }
            //if ($scope.isNew || !$scope.entity.Person.SEPTExpireDate)
            $scope.entity.Person.SEPTExpireDate = (new Date(e.value)).addYears(1);
        },
        bindingOptions: {
            value: 'entity.Person.SEPTIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_SEPTExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.SEPTExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };
    //////////////
    $scope.date_SEPTPIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            // if (!($scope.isNew || !$scope.entity.Person.SEPTPExpireDate))
            //    return;
            if (!e.value) {
                $scope.entity.Person.SEPTPExpireDate = null;
                return;
            }
            //	if ($scope.isNew || !$scope.entity.Person.SEPTPExpireDate)
            $scope.entity.Person.SEPTPExpireDate = (new Date(e.value)).addYears(3);
        },
        bindingOptions: {
            value: 'entity.Person.SEPTPIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_SEPTPExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.SEPTPExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };
    /////////////////

    $scope.date_DangerousGoodsIssueDate = {
        width: '100%',
        type: 'date',
        onValueChanged: function (e) {
            //if (!($scope.isNew || !$scope.entity.Person.DangerousGoodsExpireDate))
            //    return;
            if (!e.value) {
                $scope.entity.Person.DangerousGoodsExpireDate = null;
                return;
            }
            //if ($scope.isNew || !$scope.entity.Person.DangerousGoodsExpireDate)
            $scope.entity.Person.DangerousGoodsExpireDate = (new Date(e.value)).addYears(2);
        },
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.DangerousGoodsIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_DangerousGoodsExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.DangerousGoodsExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_CCRMIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            //if (!($scope.isNew || !$scope.entity.Person.CCRMExpireDate))
            //    return;
            if (!e.value) {
                $scope.entity.Person.CCRMExpireDate = null;
                return;
            }
            //if ($scope.isNew || !$scope.entity.Person.CCRMExpireDate)
            $scope.entity.Person.CCRMExpireDate = (new Date(e.value)).addYears(3);
        },
        bindingOptions: {
            value: 'entity.Person.CCRMIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_CCRMExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.CCRMExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_CRMIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            // if (!($scope.isNew || !$scope.entity.Person.CRMExpireDate))
            //    return;
            if (!e.value) {
                $scope.entity.Person.CRMExpireDate = null;
                return;
            }
            //	if ($scope.isNew || !$scope.entity.Person.CRMExpireDate)
            $scope.entity.Person.CRMExpireDate = (new Date(e.value)).addYears(1);
        },
        bindingOptions: {
            value: 'entity.Person.CRMIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_CRMExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.CRMExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_SMSIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            //if (!($scope.isNew || !$scope.entity.Person.SMSExpireDate))
            //    return;
            if (!e.value) {
                $scope.entity.Person.SMSExpireDate = null;
                return;
            }
            //if ($scope.isNew || !$scope.entity.Person.SMSExpireDate)
            $scope.entity.Person.SMSExpireDate = (new Date(e.value)).addYears(2);
        },
        bindingOptions: {
            value: 'entity.Person.SMSIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_SMSExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.SMSExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };
    /////////////////////
    //Flight Check
    $scope.date_TypeMDIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            //if (!($scope.isNew || !$scope.entity.Person.TypeMDIssueDate))
            //    return;
            if (!e.value) {
                $scope.entity.Person.TypeMDExpireDate = null;
                return;
            }
            $scope.entity.Person.TypeMDExpireDate = (new Date(e.value)).addYears(1);
        },
        bindingOptions: {
            value: 'entity.Person.TypeMDIssueDate',
            readOnly: 'IsMainDisabled',
            disabled: 'IsCerDisabled',
        }
    };

    $scope.date_TypeMDExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.TypeMDExpireDate',
            readOnly: 'IsMainDisabled',
            disabled: 'IsCerDisabled',
        }
    };


    //FRMS
    $scope.date_TypeAirbusIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            //if (!($scope.isNew || !$scope.entity.Person.TypeAirbusIssueDate))
            //    return;
            if (!e.value) {
                $scope.entity.Person.TypeAirbusExpireDate = null;
                return;
            }
            $scope.entity.Person.TypeAirbusExpireDate = (new Date(e.value)).addYears(2);
        },
        bindingOptions: {
            value: 'entity.Person.TypeAirbusIssueDate',
            readOnly: 'IsMainDisabled',
            disabled: 'IsCerDisabled',
        }
    };

    $scope.date_TypeAirbusExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.TypeAirbusExpireDate',
            readOnly: 'IsMainDisabled',
            disabled: 'IsCerDisabled',
        }
    };
    $scope.date_LineIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            if (!($scope.isNew || !$scope.entity.Person.DateExpireNDT))
                return;
            if (!e.value) {
                $scope.entity.Person.DateExpireNDT = null;
                return;
            }
            $scope.entity.Person.DateExpireNDT = (new Date(e.value)).addYears(1);
        },
        bindingOptions: {
            value: 'entity.Person.DateIssueNDT',
            readOnly: 'IsMainDisabled',

        }
    };

    $scope.date_LineExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.DateExpireNDT',
            readOnly: 'IsMainDisabled',

        }
    };

    $scope.date_Type737IssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            //if (!($scope.isNew || !$scope.entity.Person.Type737IssueDate))
            //    return;
            if (!e.value) {
                $scope.entity.Person.Type737ExpireDate = null;
                return;
            }
            $scope.entity.Person.Type737ExpireDate = (new Date(e.value)).addYears(1);
        },
        bindingOptions: {
            value: 'entity.Person.Type737IssueDate',
            readOnly: 'IsMainDisabled',
            disabled: 'IsCerDisabled',
        }
    };

    $scope.date_Type737ExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.Type737ExpireDate',
            readOnly: 'IsMainDisabled',
            disabled: 'IsCerDisabled',
        }
    };

    ///////////////////
    $scope.date_FirstAidIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            //  if (!($scope.isNew || !$scope.entity.Person.FirstAidExpireDate))
            //     return;
            if (!e.value) {
                $scope.entity.Person.FirstAidExpireDate = null;
                return;
            }
            //if ($scope.isNew || !$scope.entity.Person.FirstAidExpireDate)
            $scope.entity.Person.FirstAidExpireDate = (new Date(e.value)).addYears(1);
        },
        bindingOptions: {
            value: 'entity.Person.FirstAidIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_FirstAidExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.FirstAidExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };
    //////////////

    $scope.date_AviationSecurityIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            // if (!($scope.isNew || !$scope.entity.Person.AviationSecurityExpireDate))
            //     return;
            if (!e.value) {
                $scope.entity.Person.AviationSecurityExpireDate = null;
                return;
            }
            //if ($scope.isNew || !$scope.entity.Person.AviationSecurityExpireDate)
            $scope.entity.Person.AviationSecurityExpireDate = (new Date(e.value)).addYears(2);
        },
        bindingOptions: {
            value: 'entity.Person.AviationSecurityIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_AviationSecurityExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.AviationSecurityExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };





    $scope.date_Trg2IssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            // if (!($scope.isNew || !$scope.entity.Person.AviationSecurityExpireDate))
            //     return;
            if (!e.value) {
                $scope.entity.Person.LineExpireDate = null;
                return;
            }
            //if ($scope.isNew || !$scope.entity.Person.LineExpireDate)
            $scope.entity.Person.LineExpireDate = (new Date(e.value)).addYears(3);
        },
        bindingOptions: {
            value: 'entity.Person.LineIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_Trg2ExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.LineExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };




    $scope.date_EGPWSIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.EGPWSExpireDate = null;
                return;
            }

            //if ($scope.isNew || !$scope.entity.Person.EGPWSExpireDate)
            $scope.entity.Person.EGPWSExpireDate = (new Date(e.value)).addYears(2);

        },
        bindingOptions: {
            value: 'entity.Person.EGPWSIssueDate',
            readOnly: 'IsMainDisabled',
            disabled: 'IsCerDisabled',
        }
    };

    $scope.date_EGPWSExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.EGPWSExpireDate',
            readOnly: 'IsMainDisabled',
            disabled: 'IsCerDisabled',
        }
    };

    $scope.date_UpsetRecoveryTrainingIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            //  if (!($scope.isNew || !$scope.entity.Person.UpsetRecoveryTrainingExpireDate))
            //      return;
            if (!e.value) {
                $scope.entity.Person.UpsetRecoveryTrainingExpireDate = null;
                return;
            }
            //if ($scope.isNew || !$scope.entity.Person.UpsetRecoveryTrainingExpireDate)
            $scope.entity.Person.UpsetRecoveryTrainingExpireDate = (new Date(e.value)).addYears(1);
        },
        bindingOptions: {
            value: 'entity.Person.UpsetRecoveryTrainingIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_UpsetRecoveryTrainingExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.UpsetRecoveryTrainingExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_ColdWeatherOperationIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            // if (!($scope.isNew || !$scope.entity.Person.ColdWeatherOperationExpireDate))
            //     return;
            if (!e.value) {
                $scope.entity.Person.ColdWeatherOperationExpireDate = null;
                return;
            }
            //if ($scope.isNew || !$scope.entity.Person.ColdWeatherOperationExpireDate)
            $scope.entity.Person.ColdWeatherOperationExpireDate = (new Date(e.value)).addYears(1);
        },
        bindingOptions: {
            value: 'entity.Person.ColdWeatherOperationIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.date_ColdWeatherOperationExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.ColdWeatherOperationExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_HotWeatherOperationIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            // if (!($scope.isNew || !$scope.entity.Person.HotWeatherOperationExpireDate))
            //     return;
            if (!e.value) {
                $scope.entity.Person.HotWeatherOperationExpireDate = null;
                return;
            }
            //if ($scope.isNew || !$scope.entity.Person.HotWeatherOperationExpireDate)
            $scope.entity.Person.HotWeatherOperationExpireDate = (new Date(e.value)).addYears(1);
        },
        bindingOptions: {
            value: 'entity.Person.HotWeatherOperationIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.date_HotWeatherOperationExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.HotWeatherOperationExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_PBNRNAVIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.PBNRNAVIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_PBNRNAVExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.PBNRNAVExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };



    //////////////////////////////////////////
    $scope.chk_other = {
        text: 'Other Airline',
        bindingOptions: {
            value: 'entity.Person.OtherAirline',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.chk_inactive = {
        text: 'InActive',
        bindingOptions: {
            value: 'entity.InActive',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.date_DateInactiveBegin = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.DateInactiveBegin',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.date_DateInactiveEnd = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.DateInactiveEnd',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.sb_Base = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceRoutesFromAirport(Config.AirlineId),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAirport(data);
        },
        onSelectionChanged: function (arg) {

        },
        searchExpr: ["IATA", "Country", "SortName", "City"],
        displayExpr: "IATA",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.BaseAirportId',


        }
    };
    /////////////////////////////////////////////
    $scope.date_LanguageCourseExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.LanguageCourseExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_LicenceInitialIssue = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.LicenceInitialIssue',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_LicenceIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.LicenceIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_LicenceExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.LicenceExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.date_LicenceIRExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.LicenceIRExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };


    $scope.date_ProficiencyCheckDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.ProficiencyCheckDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_ProficiencyValidUntil = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.ProficiencyValidUntil',
            readOnly: 'IsMainDisabled',
        }
    };
    /////////////////
    $scope.date_ProficiencyCheckDateOPC = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.ProficiencyCheckDateOPC',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_ProficiencyValidUntilOPC = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.ProficiencyValidUntilOPC',
            readOnly: 'IsMainDisabled',
        }
    };
    ////////////////////


    $scope.date_ICAOLPRValidUntil = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.ICAOLPRValidUntil',
            readOnly: 'IsMainDisabled',
            disabled: 'LPRDisabled',
        }
    };


    $scope.date_CrewMemberCertificateExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.CrewMemberCertificateExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };

    ////////////////////////

    $scope.date_DatePassportIssue = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.DatePassportIssue',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.date_DatePassportExpire = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.DatePassportExpire',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_DateNextCheckUP = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.DateNextCheckUP',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.date_DateLastCheckUP = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            //if (!($scope.isNew || !$scope.entity.Person.DateNextCheckUP))
            //    return;
            if (!e.value) {
                $scope.entity.Person.DateNextCheckUP = null;
                return;
            }
            if ($scope.isNew || !$scope.entity.Person.DateNextCheckUP)
                $scope.entity.Person.DateNextCheckUP = (new Date(e.value)).addYears(1);
        },
        bindingOptions: {
            value: 'entity.Person.DateLastCheckUP',
            readOnly: 'IsMainDisabled',
        }
    };
    /////////////////////
    $scope.sb_AircraftTypeId2 = {
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAircraft(data);
        },
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceAircrafts(),
        displayExpr: "Type",
        valueExpr: 'Id',
        searchExpr: ['Type', 'Manufacturer'],
        onSelectionChanged: function (e) {

            //  $scope.entityAircrafttype.AircraftType = e.selectedItem ? e.selectedItem.Type : null;
            //  $scope.entityAircrafttype.Manufacturer = e.selectedItem ? e.selectedItem.Manufacturer : null;

        },
        bindingOptions: {
            value: 'entity.Person.AircraftTypeId',

        }
    };

    $scope.date_TRIExpire = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

        },
        bindingOptions: {
            value: 'entity.Person.DateTRIExpired',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.date_TREExpire = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.DateTREExpired',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_TypeExpire = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.DateTypeExpire',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.date_TypeIssue = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            if (!($scope.isNew || !$scope.entity.Person.DateTypeExpire))
                return;
            if (!e.value) {
                $scope.entity.Person.DateTypeExpire = null;
                return;
            }
            if ($scope.isNew || !$scope.entity.Person.DateTypeExpire)
                $scope.entity.Person.DateTypeExpire = (new Date(e.value)).addYears(1);
        },
        bindingOptions: {
            value: 'entity.Person.DateTypeIssue',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_RecurrentIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            if (!($scope.isNew || !$scope.entity.Person.RecurrentExpireDate))
                return;
            if (!e.value) {
                $scope.entity.Person.RecurrentExpireDate = null;
                return;
            }
            $scope.entity.Person.RecurrentExpireDate = (new Date(e.value)).addYears(1);
        },
        bindingOptions: {
            value: 'entity.Person.RecurrentIssueDate',
            readOnly: 'IsMainDisabled',
            disabled: 'IsCerDisabled',
        }
    };

    $scope.date_RecurrentExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.RecurrentExpireDate',
            readOnly: 'IsMainDisabled',
            disabled: 'IsCerDisabled',
        }
    };
    ///////////////////
    $scope.date_DateJoinAvation = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entity.Person.DateJoinAvation',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.date_EducationDateCatch = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entityEducation.DateCatch',

        }
    };

    $scope.date_ExpDateStart = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entityExp.DateStart',

        }
    };
    $scope.date_ExpDateEnd = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entityExp.DateEnd',

        }
    };

    $scope.date_RatingDateIssue = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entityRating.DateIssue',

        }
    };
    $scope.date_RatingDateExpire = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entityRating.DateExpire',

        }
    };
    ////////////////////////////
    $scope.btn_delete_file = {
        text: 'Delete',
        type: 'danger',
        icon: 'clear',


        onClick: function (e) {
            var selected = $rootScope.getSelectedRow($scope.dg_upload_instance);
            if (!selected) {
                General.ShowNotify(Config.Text_NoRowSelected, 'error');
                return;
            }

            General.Confirm(Config.Text_DeleteConfirm, function (res) {
                if (res) {

                    $scope.entityDocument.Documents = Enumerable.From($scope.entityDocument.Documents).Where('$.Id!=' + selected.Id).ToArray();
                    $scope.dg_upload_instance.refresh();

                }
            });
        }
    };
    //////////////////////////////////
    $scope.sb_OrganizationId = {
        dataSource: $rootScope.getDatasourceRatingOrgs(),
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        bindingOptions: {
            value: 'entityRating.OrganizationId',

        },
        onSelectionChanged: function (e) {

            $scope.entityRating.Organization = e.selectedItem ? e.selectedItem.Title : null;
        },

    };

    $scope.isGroupReadOnly = true;
    $scope.selectedDep = null;
    $scope.sb_location = {
        dataSource: $rootScope.getDatasourceLoctionCustomer(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateLocation(data);
        },
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title", "FullCode"],
        valueExpr: "Id",
        displayExpr: "Title",
        onSelectionChanged: function (e) {

            $scope.selectedDep = e.selectedItem ? e.selectedItem.Title : '';
            $scope.isGroupReadOnly = e.selectedItem ? false : true;
            if (e.selectedItem)
                /*$scope.group_ds={
                    store: {
                        type: "odata",
                        url: $rootScope.serviceUrl + 'odata/base/jobgroups/'+ Config.CustomerId,
                      
                         version: 4,
                       
                    },
                     filter: ['Remark', 'startswith', e.selectedItem.Remark],
                    sort: ['Remark'],
    
                };*/
                $scope.group_ds = Enumerable.From($scope.ds_allgroups).Where(function (x) { return x.Remark && x.Remark.startsWith(e.selectedItem.Remark); }).OrderBy('$.Remark').ToArray();
            else
                $scope.group_ds = null;

            // $scope.groupIns.reset();
            // $scope.groupIns2.reset();

        },
        bindingOptions: {
            value: 'entity.Locations[0].LocationId',
            readOnly: 'IsMainDisabled',
        }

    };
    $scope.group_ds = null;
    $scope.groupIns = null;
    $scope.group_title = null;
    $scope.sb_group = {
        showClearButton: true,
        searchEnabled: true,
        //dataSource: $rootScope.getDatasourceGroups(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateGroup(data);
        },
        onInitialized: function (e) {

            if (!$scope.groupIns)
                $scope.groupIns = e.component;
        },
        onSelectionChanged: function (e) {
            if (!e.selectedItem) {
                $scope.group_title = null;
                return;
            }
            $scope.group_title = e.selectedItem.Title;

        },
        //displayExpr: "TitleFormated",
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.GroupId',
            readOnly: 'isGroupReadOnly',
            dataSource: 'group_ds'
        }
    };

    $scope.groupIns2 = null;
    $scope.sb_group2 = {
        showClearButton: true,
        searchEnabled: true,
        //dataSource: $rootScope.getDatasourceGroups(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateGroup(data);
        },
        onInitialized: function (e) {

            if (!$scope.groupIns2)
                $scope.groupIns2 = e.component;
        },
        displayExpr: "TitleFormated",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.Person.IntervalNDT',
            readOnly: 'isGroupReadOnly',
            dataSource: 'group_ds'
        }
    };


    $scope.sb_city = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceCityByCountry(103),
        displayExpr: "FullName",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.Person.CityId',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.sb_Sex = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(29),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.Person.SexId',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.sb_calandertype = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(11),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.Person.CaoIntervalCalanderTypeId',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.sb_calandertypendt = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(11),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.Person.NDTIntervalCalanderTypeId',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.sb_MarriageId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(15),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.Person.MarriageId',
            readOnly: 'IsMainDisabled',
        }
    };
    $scope.sb_post = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(36),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.Locations[0].OrgRoleId',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.sb_CityId = {
        showClearButton: true,
        width: '100%',
        searchEnabled: true,

        dataSource: new DevExpress.data.DataSource({
            store: new DevExpress.data.ODataStore({
                url: $rootScope.serviceUrl + 'odata/cities/all',
                version: 4
            }),
            sort: ['City'],
        }),
        searchExpr: ["City", "Country"],
        valueExpr: "Id",
        searchMode: 'startsWith',
        displayExpr: "FullName",
        bindingOptions: {
            value: 'entity.CityId',
        }

    };
    $scope.sb_DocumentTypeId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(44),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entityDocument.DocumentTypeId',

        },
        onSelectionChanged: function (e) {

            $scope.entityDocument.DocumentType = e.selectedItem ? e.selectedItem.Title : null;


        },
    };
    $scope.sb_DocumentTypeId2 = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(44),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entityDocument2.DocumentTypeId',

        },
        onSelectionChanged: function (e) {

            $scope.entityDocument2.DocumentType = e.selectedItem ? e.selectedItem.Title : null;


        },
    };
    $scope.sb_EducationDegreeId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(18),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entityEducation.EducationDegreeId',

        },
        onSelectionChanged: function (e) {

            $scope.entityEducation.EducationDegree = e.selectedItem ? e.selectedItem.Title : null;


        },
    };
    $scope.sb_EducationField = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(59),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entityEducation.StudyFieldId',

        },
        onSelectionChanged: function (e) {

            $scope.entityEducation.StudyField = e.selectedItem ? e.selectedItem.Title : null;


        },
    };

    $scope.sb_ExpAircraftTypeId = {
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAircraft(data);
        },
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceAircrafts(),
        displayExpr: "Type",
        valueExpr: 'Id',
        searchExpr: ['Type', 'Manufacturer'],
        bindingOptions: {
            value: 'entityExp.AircraftTypeId',

        },
        onSelectionChanged: function (e) {

            $scope.entityExp.AircraftType = e.selectedItem ? e.selectedItem.Type : null;


        },
    };

    $scope.sb_RatingAircraftTypeId = {
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAircraft(data);
        },
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceAircrafts(),
        displayExpr: "Type",
        valueExpr: 'Id',
        searchExpr: ['Type', 'Manufacturer'],
        bindingOptions: {
            value: 'entityRating.AircraftTypeId',

        },

        onSelectionChanged: function (e) {

            $scope.entityRating.AircraftType = e.selectedItem ? e.selectedItem.Type : null;
        },

    };
    $scope.sb_AircraftTypeId = {
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateAircraft(data);
        },
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceAircrafts(),
        displayExpr: "Type",
        valueExpr: 'Id',
        searchExpr: ['Type', 'Manufacturer'],
        onSelectionChanged: function (e) {

            $scope.entityAircrafttype.AircraftType = e.selectedItem ? e.selectedItem.Type : null;
            $scope.entityAircrafttype.Manufacturer = e.selectedItem ? e.selectedItem.Manufacturer : null;

        },
        bindingOptions: {
            value: 'entityAircrafttype.AircraftTypeId',

        }
    };
    $scope.sb_RatingCategoryId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(51),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entityRating.CategoryId',

        },
        onSelectionChanged: function (e) {

            $scope.entityRating.Category = e.selectedItem ? e.selectedItem.Title : null;
        },
    };

    /////////////////////////////
    $scope.img_url = 'content/images/imguser.png';
    $scope.uploaderValueImage = [];
    $scope.uploadedFileImage = null;
    $scope.uploader_image = {
        //uploadedMessage: 'بارگزاری شد',
        multiple: false,
        // selectButtonText: 'انتخاب تصویر',
        labelText: '',
        accept: "image/*",
        uploadMethod: 'POST',
        uploadMode: "instantly",
        rtlEnabled: true,
        uploadUrl: $rootScope.fileHandlerUrl + '?t=clientfiles',
        onValueChanged: function (arg) {

        },
        onUploaded: function (e) {
            $scope.uploadedFileImage = e.request.responseText;
            $scope.entity.Person.ImageUrl = e.request.responseText;
            $scope.img_url = $rootScope.clientsFilesUrl + $scope.uploadedFileImage;

        },
        bindingOptions: {
            value: 'uploaderValueImage'
        }
    };
    $scope.uploaderValueDocument = [];
    $scope.uploadedFileDocument = null;
    $scope.uploader_document_instance = null;
    $scope.uploader_document = {
        //uploadedMessage: 'بارگزاری شد',
        multiple: false,
        // selectButtonText: 'انتخاب تصویر',
        labelText: '',
        // accept: "image/*",
        uploadMethod: 'POST',
        uploadMode: "instantly",

        uploadUrl: $rootScope.fileHandlerUrl + '?t=clientfiles',
        onValueChanged: function (arg) {

        },
        onUploaded: function (e) {
            // console.log(e.request.responseText);
            //  console.log(e.request);
            var id = ($scope.entityDocument.Documents.length + 1) * -1;
            var item = { Id: id, Title: e.request.responseText, FileUrl: e.request.responseText };
            item.SysUrl = $scope.uploaderValueDocument[0].name;
            item.FileType = $scope.uploaderValueDocument[0].type;
            $scope.entityDocument.Documents.push(item);
            console.log($scope.uploaderValueDocument);
            //$scope.uploadedFileDocument = e.request.responseText;
            //$scope.entity.ImgUrl = e.request.responseText;
            // $scope.img_url = $rootScope.clientsFilesUrl + $scope.uploadedFileDocument;

        },
        onContentReady: function (e) {
            if (!$scope.uploader_document_instance)
                $scope.uploader_document_instance = e.component;

        },
        bindingOptions: {
            value: 'uploaderValueDocument'
        }
    };

    $scope.uploaderValueEdu = [];
    $scope.uploadedFileEdu = null;
    $scope.uploader_edu_instance = null;
    $scope.download = "";
    $scope.uploader_edu = {
        //uploadedMessage: 'بارگزاری شد',
        multiple: false,
        // selectButtonText: 'انتخاب تصویر',
        labelText: '',
        // accept: "image/*",
        uploadMethod: 'POST',
        uploadMode: "instantly",

        uploadUrl: $rootScope.fileHandlerUrl + '?t=clientfiles',
        onValueChanged: function (arg) {

        },
        onUploaded: function (e) {
            //  alert(e.request.responseText);
            //  alert(e.request.responseText);
            //  var id = ($scope.entityDocument.Documents.length + 1) * -1;
            //  var item = { Id: id, Title: e.request.responseText, FileUrl: e.request.responseText };
            // item.SysUrl = $scope.uploaderValueDocument[0].name;
            //  item.FileType = $scope.uploaderValueDocument[0].type;
            //  $scope.entityDocument.Documents.push(item);
            //  console.log($scope.uploaderValueDocument);

            $scope.entityEducation.FileTitle = $scope.uploaderValueEdu[0].name;
            $scope.entityEducation.SysUrl = $scope.uploaderValueEdu[0].name;

            $scope.entityEducation.FileUrl = e.request.responseText;
            $scope.download = $rootScope.clientsFilesUrl + "/" + $scope.entityEducation.FileUrl;
            $scope.entityEducation.FileType = $scope.uploaderValueEdu[0].type;

        },
        onContentReady: function (e) {
            if (!$scope.uploader_edu_instance)
                $scope.uploader_edu_instance = e.component;

        },
        bindingOptions: {
            value: 'uploaderValueEdu'
        }
    };

    /////////////////////////////
    $scope.scroll_height = 200;
    $scope.scroll_main = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height', }
    };
    $scope.scroll_education = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height', }
    };
    $scope.scroll_certificate = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height', }
    };
    $scope.scroll_file = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height', }
    };
    $scope.scroll_experience = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height', }
    };
    $scope.scroll_rating = {
        scrollByContent: true,
        scrollByThumb: true,
        bindingOptions: { height: 'scroll_height', }
    };
    var dg_selected = null;
    $scope.dg_height = 200;
    $scope.pop_width = 600;
    $scope.pop_height = 350;
    $scope.popup_add_visible = false;
    $scope.popup_add_title = 'New';
    $scope.popup_instance = null;
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'educationadd', onClick: function (e) {

                        $scope.popup_education_visible = true;
                    }
                }, toolbar: 'bottom', bindingOptions: { visible: 'btn_visible_education', disabled: 'IsMainDisabled' }
            },
            {
                widget: 'dxButton', location: 'before', toolbar: 'bottom', options: {
                    type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'educationadd', bindingOptions: { visible: 'btn_visible_education', disabled: 'IsMainDisabled' }, onClick: function (e) {
                        dg_selected = $rootScope.getSelectedRow($scope.dg_education_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.bindEducation(dg_selected);
                        $scope.popup_education_visible = true;
                    }
                }
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'educationadd', bindingOptions: { visible: 'btn_visible_education', disabled: 'IsMainDisabled' }, onClick: function (e) {
                        dg_selected = $rootScope.getSelectedRow($scope.dg_education_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.entity.Person.Educations = Enumerable.From($scope.entity.Person.Educations).Where('$.Id!=' + dg_selected.Id).ToArray();
                    }
                }, toolbar: 'bottom'
            },


            {
                widget: 'dxButton', location: 'before', options: {
                    onClick: function (e) {

                    }, type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'certificateadd', bindingOptions: { visible: 'btn_visible_certificate', disabled: 'IsMainDisabled' }
                }, toolbar: 'bottom',
            },
            { widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'certificateadd', bindingOptions: { visible: 'btn_visible_certificate', disabled: 'IsMainDisabled' } }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'certificateadd', bindingOptions: { visible: 'btn_visible_certificate', disabled: 'IsMainDisabled' } }, toolbar: 'bottom' },

            {
                widget: 'dxButton', location: 'before', toolbar: 'bottom', options: {
                    type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'fileadd', bindingOptions: { visible: 'btn_visible_file', disabled: 'IsMainDisabled' }, onClick: function (e) {
                        $scope.popup_file_visible = true;
                    }
                }
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'fileadd', bindingOptions: { visible: 'btn_visible_file', disabled: 'IsMainDisabled' }, onClick: function (e) {
                        dg_selected = $rootScope.getSelectedRow($scope.dg_file_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.bindDocumnet(dg_selected);
                        $scope.popup_file_visible = true;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'fileadd', bindingOptions: { visible: 'btn_visible_file', disabled: 'IsMainDisabled' }
                    , onClick: function (e) {
                        //kook
                        dg_selected = $rootScope.getSelectedRow($scope.dg_file_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.entity.Person.Documents = Enumerable.From($scope.entity.Person.Documents).Where('$.Id!=' + dg_selected.Id).ToArray();

                        // $scope.entityDocument.Id = id;
                        //$scope.entity.Person.Documents.push(JSON.clone($scope.entityDocument));


                    }
                }, toolbar: 'bottom'
            },



            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'experienceadd', bindingOptions: { visible: 'btn_visible_experience', disabled: 'IsMainDisabled' }, onClick: function (e) {

                        $scope.popup_exp_visible = true;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'experienceadd', bindingOptions: { visible: 'btn_visible_experience', disabled: 'IsMainDisabled' }, onClick: function (e) {
                        dg_selected = $rootScope.getSelectedRow($scope.dg_exp_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.bindExp(dg_selected);
                        $scope.popup_exp_visible = true;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'experienceadd', bindingOptions: { visible: 'btn_visible_experience', disabled: 'IsMainDisabled' }, onClick: function (e) {
                        dg_selected = $rootScope.getSelectedRow($scope.dg_exp_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.entity.Person.Expreienses = Enumerable.From($scope.entity.Person.Expreienses).Where('$.Id!=' + dg_selected.Id).ToArray();


                    }
                }, toolbar: 'bottom'
            },

            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'ratingadd', bindingOptions: { visible: 'btn_visible_rating', disabled: 'IsMainDisabled' }, onClick: function (e) {
                        $scope.popup_rating_visible = true;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'ratingadd', bindingOptions: { visible: 'btn_visible_rating', disabled: 'IsMainDisabled' }, onClick: function (e) {
                        dg_selected = $rootScope.getSelectedRow($scope.dg_rating_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.bindRating(dg_selected);
                        $scope.popup_rating_visible = true;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'ratingadd', bindingOptions: { visible: 'btn_visible_rating', disabled: 'IsMainDisabled' }, onClick: function (e) {
                        dg_selected = $rootScope.getSelectedRow($scope.dg_rating_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.entity.Person.Ratings = Enumerable.From($scope.entity.Person.Ratings).Where('$.Id!=' + dg_selected.Id).ToArray();


                    }
                }, toolbar: 'bottom'
            },


            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'aircraftadd', bindingOptions: { visible: 'btn_visible_aircrafttype', disabled: 'IsMainDisabled' }, onClick: function (e) {
                        $scope.popup_aircrafttype_visible = true;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'aircraftadd', bindingOptions: { visible: 'btn_visible_aircrafttype', disabled: 'IsMainDisabled' }, onClick: function (e) {
                        dg_selected = $rootScope.getSelectedRow($scope.dg_aircrafttype_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.bindEntityAircrafttype(dg_selected);
                        $scope.popup_aircrafttype_visible = true;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'aircraftadd', bindingOptions: { visible: 'btn_visible_aircrafttype', disabled: 'IsMainDisabled' }, onClick: function (e) {
                        dg_selected = $rootScope.getSelectedRow($scope.dg_aircrafttype_instance);
                        if (!dg_selected) {
                            General.ShowNotify(Config.Text_NoRowSelected, 'error');
                            return;
                        }
                        $scope.entity.Person.AircraftTypes = Enumerable.From($scope.entity.Person.AircraftTypes).Where('$.Id!=' + dg_selected.Id).ToArray();
                    }
                }, toolbar: 'bottom'
            },


            { widget: 'dxButton', location: 'after', options: { type: 'success', text: 'Save', icon: 'check', validationGroup: 'personadd', bindingOptions: {} }, toolbar: 'bottom' },
            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: true,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            $scope.popup_instance.repaint();


            //$scope.pop_width_related = $scope.pop_width - 200;
            //if ($scope.pop_width_related <= 800)
            //    $scope.pop_width_related = 800;
            //630; //size.height;

            //var size = $rootScope.get_windowSizePadding(40);
            //$scope.pop_width = size.width;
            //if ($scope.pop_width > 1200)
            //    $scope.pop_width = 1200;
            //$scope.pop_height = size.height;
            // $scope.dg_height = $scope.pop_height - 140;

        },
        onShown: function (e) {
            $scope.selectedTabIndex = 0;
            if ($scope.isNew) {

            }
            if ($scope.tempData != null)
                $scope.nid = $scope.tempData.NID;

            var size = $rootScope.getWindowSize();
            $scope.pop_width = size.width;
            if ($scope.pop_width > 1400)
                $scope.pop_width = 1400;
            $scope.pop_height = $(window).height() - 30;
            $scope.dg_height = $scope.pop_height - 133;
            $scope.scroll_height = $scope.pop_height - 140;



        },
        onHiding: function () {

            $scope.clearEntity();

            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onPersonHide', null);
        },
        onContentReady: function (e) {
            if (!$scope.popup_instance)
                $scope.popup_instance = e.component;

        },
        bindingOptions: {
            visible: 'popup_add_visible',
            width: 'pop_width',
            height: 'pop_height',
            title: 'popup_add_title',
            'toolbarItems[0].visible': 'btn_visible_education',
            'toolbarItems[1].visible': 'btn_visible_education',
            'toolbarItems[2].visible': 'btn_visible_education',
            'toolbarItems[3].visible': 'btn_visible_certificate',
            'toolbarItems[4].visible': 'btn_visible_certificate',
            'toolbarItems[5].visible': 'btn_visible_certificate',
            'toolbarItems[6].visible': 'btn_visible_file',
            'toolbarItems[7].visible': 'btn_visible_file',
            'toolbarItems[8].visible': 'btn_visible_file',
            'toolbarItems[9].visible': 'btn_visible_experience',
            'toolbarItems[10].visible': 'btn_visible_experience',
            'toolbarItems[11].visible': 'btn_visible_experience',
            'toolbarItems[12].visible': 'btn_visible_rating',
            'toolbarItems[13].visible': 'btn_visible_rating',
            'toolbarItems[14].visible': 'btn_visible_rating',
            'toolbarItems[15].visible': 'btn_visible_aircrafttype',
            'toolbarItems[16].visible': 'btn_visible_aircrafttype',
            'toolbarItems[17].visible': 'btn_visible_aircrafttype',
            'toolbarItems[18].visible': 'IsEditable',
        }
    };

    //close button
    $scope.popup_add.toolbarItems[19].options.onClick = function (e) {


        $scope.popup_add_visible = false;
    };

    //save button
    $scope.popup_add.toolbarItems[18].options.onClick = function (e) {
        //sook
        var result = e.validationGroup.validate();

        if (!result.isValid) {
            General.ShowNotify(Config.Text_FillRequired, 'error');
            return;
        }
        //if ($scope.isNew) {
        //    $scope.entity.Id = -1;
        //    $scope.entity.Person.CustomerCreatorId = Config.CustomerId;
        //    $scope.entity.Person.Id = -1;

        //}
        //if ($scope.isNew)
        //    $scope.entity.Id = -1;
        //$scope.entity.Id = -1;
        //$scope.entity.PersonId = -1;
        //$scope.entity.PID = '12345';
        //$scope.entity.Person.FirstName = 'vahid';umg
        $scope.entity.Person.MarriageId = 16;

        var offset = -1 * (new Date()).getTimezoneOffset();
        if ($scope.entity.DateInactiveBegin)
            $scope.entity.DateInactiveBegin = (new Date($scope.entity.DateInactiveBegin)).addMinutes(offset);
        if ($scope.entity.DateInactiveEnd)
            $scope.entity.DateInactiveEnd = (new Date($scope.entity.DateInactiveEnd)).addMinutes(offset);

        //DatePassportExpire
        if ($scope.entity.Person.DatePassportExpire)
            $scope.entity.Person.DatePassportExpire = (new Date($scope.entity.Person.DatePassportExpire)).addMinutes(offset);
        //DateNextCheckUP
        if ($scope.entity.Person.DateNextCheckUP)
            $scope.entity.Person.DateNextCheckUP = (new Date($scope.entity.Person.DateNextCheckUP)).addMinutes(offset);


        if ($scope.entity.Person.DateTRIExpired)
            $scope.entity.Person.DateTRIExpired = (new Date($scope.entity.Person.DateTRIExpired)).addMinutes(offset);
        if ($scope.entity.Person.DateTREExpired)
            $scope.entity.Person.DateTREExpired = (new Date($scope.entity.Person.DateTREExpired)).addMinutes(offset);
        if ($scope.entity.Person.DateLastCheckUP)
            $scope.entity.Person.DateLastCheckUP = (new Date($scope.entity.Person.DateLastCheckUP)).addMinutes(offset);
        if ($scope.entity.Person.DateNextCheckUP)
            $scope.entity.Person.DateNextCheckUP = (new Date($scope.entity.Person.DateNextCheckUP)).addMinutes(offset);
        if ($scope.entity.Person.CrewMemberCertificateExpireDate)
            $scope.entity.Person.CrewMemberCertificateExpireDate = (new Date($scope.entity.Person.CrewMemberCertificateExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.ICAOLPRValidUntil)
            $scope.entity.Person.ICAOLPRValidUntil = (new Date($scope.entity.Person.ICAOLPRValidUntil)).addMinutes(offset);

        if ($scope.entity.Person.LicenceInitialIssue)
            $scope.entity.Person.LicenceInitialIssue = (new Date($scope.entity.Person.LicenceInitialIssue)).addMinutes(offset);
        if ($scope.entity.Person.LicenceExpireDate)
            $scope.entity.Person.LicenceExpireDate = (new Date($scope.entity.Person.LicenceExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.LicenceIRExpireDate)
            $scope.entity.Person.LicenceIRExpireDate = (new Date($scope.entity.Person.LicenceIRExpireDate)).addMinutes(offset);

        if ($scope.entity.Person.ProficiencyCheckDate)
            $scope.entity.Person.ProficiencyCheckDate = (new Date($scope.entity.Person.ProficiencyCheckDate)).addMinutes(offset);
        if ($scope.entity.Person.ProficiencyValidUntil)
            $scope.entity.Person.ProficiencyValidUntil = (new Date($scope.entity.Person.ProficiencyValidUntil)).addMinutes(offset);



        if ($scope.entity.Person.ProficiencyCheckDateOPC)
            $scope.entity.Person.ProficiencyCheckDateOPC = (new Date($scope.entity.Person.ProficiencyCheckDateOPC)).addMinutes(offset);
        if ($scope.entity.Person.ProficiencyValidUntilOPC)
            $scope.entity.Person.ProficiencyValidUntilOPC = (new Date($scope.entity.Person.ProficiencyValidUntilOPC)).addMinutes(offset);


        if ($scope.entity.Person.DateIssueNDT)
            $scope.entity.Person.DateIssueNDT = (new Date($scope.entity.Person.DateIssueNDT)).addMinutes(offset);
        if ($scope.entity.Person.DateExpireNDT)
            $scope.entity.Person.DateExpireNDT = (new Date($scope.entity.Person.DateExpireNDT)).addMinutes(offset);

        if ($scope.entity.Person.DateCaoCardIssue)
            $scope.entity.Person.DateCaoCardIssue = (new Date($scope.entity.Person.DateCaoCardIssue)).addMinutes(offset);
        if ($scope.entity.Person.DateCaoCardExpire)
            $scope.entity.Person.DateCaoCardExpire = (new Date($scope.entity.Person.DateCaoCardExpire)).addMinutes(offset);
        if ($scope.entity.Person.EGPWSIssueDate)
            $scope.entity.Person.EGPWSIssueDate = (new Date($scope.entity.Person.EGPWSIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.EGPWSExpireDate)
            $scope.entity.Person.EGPWSExpireDate = (new Date($scope.entity.Person.EGPWSExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.RecurrentIssueDate)
            $scope.entity.Person.RecurrentIssueDate = (new Date($scope.entity.Person.RecurrentIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.RecurrentExpireDate)
            $scope.entity.Person.RecurrentExpireDate = (new Date($scope.entity.Person.RecurrentExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.LineIssueDate)
            $scope.entity.Person.LineIssueDate = (new Date($scope.entity.Person.LineIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.LineExpireDate)
            $scope.entity.Person.LineExpireDate = (new Date($scope.entity.Person.LineExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.Type737IssueDate)
            $scope.entity.Person.Type737IssueDate = (new Date($scope.entity.Person.Type737IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.TypeMDIssueDate)
            $scope.entity.Person.TypeMDIssueDate = (new Date($scope.entity.Person.TypeMDIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.TypeMDExpireDate)
            $scope.entity.Person.TypeMDExpireDate = (new Date($scope.entity.Person.TypeMDExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.TypeAirbusIssueDate)
            $scope.entity.Person.TypeAirbusIssueDate = (new Date($scope.entity.Person.TypeAirbusIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.TypeAirbusExpireDate)
            $scope.entity.Person.TypeAirbusExpireDate = (new Date($scope.entity.Person.TypeAirbusExpireDate)).addMinutes(offset);



        if ($scope.entity.Person.LRCIssueDate)
            $scope.entity.Person.LRCIssueDate = (new Date($scope.entity.Person.LRCIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.LRCExpireDate)
            $scope.entity.Person.LRCExpireDate = (new Date($scope.entity.Person.LRCExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.RSPIssueDate)
            $scope.entity.Person.RSPIssueDate = (new Date($scope.entity.Person.RSPIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.RSPExpireDate)
            $scope.entity.Person.RSPExpireDate = (new Date($scope.entity.Person.RSPExpireDate)).addMinutes(offset);

        $scope.entity.Person.CTUIssueDate
        if ($scope.entity.Person.TypeAirbusExpireDate)
            $scope.entity.Person.TypeAirbusExpireDate = (new Date($scope.entity.Person.TypeAirbusExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.CTUIssueDate)
            $scope.entity.Person.CTUIssueDate = (new Date($scope.entity.Person.CTUIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.SAIssueDate)
            $scope.entity.Person.SAIssueDate = (new Date($scope.entity.Person.SAIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.SAExpireDate)
            $scope.entity.Person.SAExpireDate = (new Date($scope.entity.Person.SAExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.HFIssueDate)
            $scope.entity.Person.HFIssueDate = (new Date($scope.entity.Person.HFIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.HFExpireDate)
            $scope.entity.Person.HFExpireDate = (new Date($scope.entity.Person.HFExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.ASDIssueDate)
            $scope.entity.Person.ASDIssueDate = (new Date($scope.entity.Person.ASDIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.ASDExpireDate)
            $scope.entity.Person.ASDExpireDate = (new Date($scope.entity.Person.ASDExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.GOMIssueDate)
            $scope.entity.Person.GOMIssueDate = (new Date($scope.entity.Person.GOMIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.GOMExpireDate)
            $scope.entity.Person.GOMExpireDate = (new Date($scope.entity.Person.GOMExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.ASFIssueDate)
            $scope.entity.Person.ASFIssueDate = (new Date($scope.entity.Person.ASFIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.ASFExpireDate)
            $scope.entity.Person.ASFExpireDate = (new Date($scope.entity.Person.ASFExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.CCIssueDate)
            $scope.entity.Person.CCIssueDate = (new Date($scope.entity.Person.CCIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.CCExpireDate)
            $scope.entity.Person.CCExpireDate = (new Date($scope.entity.Person.CCExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.ERPIssueDate)
            $scope.entity.Person.ERPIssueDate = (new Date($scope.entity.Person.ERPIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.ERPExpireDate)
            $scope.entity.Person.ERPExpireDate = (new Date($scope.entity.Person.ERPExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.MBIssueDate)
            $scope.entity.Person.MBIssueDate = (new Date($scope.entity.Person.MBIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.MBExpireDate)
            $scope.entity.Person.MBExpireDate = (new Date($scope.entity.Person.MBExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.PSIssueDate)
            $scope.entity.Person.PSIssueDate = (new Date($scope.entity.Person.PSIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.PSExpireDate)
            $scope.entity.Person.PSExpireDate = (new Date($scope.entity.Person.PSExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.ANNEXIssueDate)
            $scope.entity.Person.ANNEXIssueDate = (new Date($scope.entity.Person.ANNEXIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.ANNEXExpireDate)
            $scope.entity.Person.ANNEXExpireDate = (new Date($scope.entity.Person.ANNEXExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.DRMIssueDate)
            $scope.entity.Person.DRMIssueDate = (new Date($scope.entity.Person.DRMIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.DRMExpireDate)
            $scope.entity.Person.DRMExpireDate = (new Date($scope.entity.Person.DRMExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.FMTDIssueDate)
            $scope.entity.Person.FMTDIssueDate = (new Date($scope.entity.Person.FMTDIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.FMTDExpireDate)
            $scope.entity.Person.FMTDExpireDate = (new Date($scope.entity.Person.FMTDExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.MELExpireDate)
            $scope.entity.Person.MELExpireDate = (new Date($scope.entity.Person.MELExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.MELIssueDate)
            $scope.entity.Person.MELIssueDate = (new Date($scope.entity.Person.MELIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.METIssueDate)
            $scope.entity.Person.METIssueDate = (new Date($scope.entity.Person.METIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.METExpireDate)
            $scope.entity.Person.METExpireDate = (new Date($scope.entity.Person.METExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.PERIssueDate)
            $scope.entity.Person.PERIssueDate = (new Date($scope.entity.Person.PERIssueDate)).addMinutes(offset);


        if ($scope.entity.Person.PERExpireDate) $scope.entity.Person.PERExpireDate = (new Date($scope.entity.Person.PERExpireDate)).addMinutes(offset);


        if ($scope.entity.Person.LPCC1ExpireDate) $scope.entity.Person.LPCC1ExpireDate = (new Date($scope.entity.Person.LPCC1ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.LPCC2ExpireDate) $scope.entity.Person.LPCC2ExpireDate = (new Date($scope.entity.Person.LPCC2ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.LPCC3ExpireDate) $scope.entity.Person.LPCC3ExpireDate = (new Date($scope.entity.Person.LPCC3ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.LPCC1IssueDate) $scope.entity.Person.LPCC1IssueDate = (new Date($scope.entity.Person.LPCC1IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.LPCC2IssueDate) $scope.entity.Person.LPCC2IssueDate = (new Date($scope.entity.Person.LPCC2IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.LPCC3IssueDate) $scope.entity.Person.LPCC3IssueDate = (new Date($scope.entity.Person.LPCC3IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.OPCC1IssueDate) $scope.entity.Person.OPCC1IssueDate = (new Date($scope.entity.Person.OPCC1IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.OPCC2IssueDate) $scope.entity.Person.OPCC2IssueDate = (new Date($scope.entity.Person.OPCC2IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.OPCC3IssueDate) $scope.entity.Person.OPCC3IssueDate = (new Date($scope.entity.Person.OPCC3IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.LineC1IssueDate) $scope.entity.Person.LineC1IssueDate = (new Date($scope.entity.Person.LineC1IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.LineC2IssueDate) $scope.entity.Person.LineC2IssueDate = (new Date($scope.entity.Person.LineC2IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.LineC3IssueDate) $scope.entity.Person.LineC3IssueDate = (new Date($scope.entity.Person.LineC3IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.LineC1ExpireDate) $scope.entity.Person.LineC1ExpireDate = (new Date($scope.entity.Person.LineC1ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.LineC2ExpireDate) $scope.entity.Person.LineC2ExpireDate = (new Date($scope.entity.Person.LineC2ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.LineC3ExpireDate) $scope.entity.Person.LineC3ExpireDate = (new Date($scope.entity.Person.LineC3ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.RampIssueDate) $scope.entity.Person.RampIssueDate = (new Date($scope.entity.Person.RampIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.RampExpireDate) $scope.entity.Person.RampExpireDate = (new Date($scope.entity.Person.RampExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.ACIssueDate) $scope.entity.Person.ACIssueDate = (new Date($scope.entity.Person.ACIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.ACExpireDate) $scope.entity.Person.ACExpireDate = (new Date($scope.entity.Person.ACExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.UPRTIssueDate) $scope.entity.Person.UPRTIssueDate = (new Date($scope.entity.Person.UPRTIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.UPRTExpireDate) $scope.entity.Person.UPRTExpireDate = (new Date($scope.entity.Person.UPRTExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.SFIIssueDate) $scope.entity.Person.SFIIssueDate = (new Date($scope.entity.Person.SFIIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.SFIExpireDate) $scope.entity.Person.SFIExpireDate = (new Date($scope.entity.Person.SFIExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.SFEIssueDate) $scope.entity.Person.SFEIssueDate = (new Date($scope.entity.Person.SFEIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.SFEExpireDate) $scope.entity.Person.SFEExpireDate = (new Date($scope.entity.Person.SFEExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.TRI2IssueDate) $scope.entity.Person.TRI2IssueDate = (new Date($scope.entity.Person.TRI2IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.TRI2ExpireDate) $scope.entity.Person.TRI2ExpireDate = (new Date($scope.entity.Person.TRI2ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.TRE2IssueDate) $scope.entity.Person.TRE2IssueDate = (new Date($scope.entity.Person.TRE2IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.TRE2ExpireDate) $scope.entity.Person.TRE2ExpireDate = (new Date($scope.entity.Person.TRE2ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.IRIIssueDate) $scope.entity.Person.IRIIssueDate = (new Date($scope.entity.Person.IRIIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.IRIExpireDate) $scope.entity.Person.IRIExpireDate = (new Date($scope.entity.Person.IRIExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.IREIssueDate) $scope.entity.Person.IREIssueDate = (new Date($scope.entity.Person.IREIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.IREExpireDate) $scope.entity.Person.IREExpireDate = (new Date($scope.entity.Person.IREExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.CRIIssueDate) $scope.entity.Person.CRIIssueDate = (new Date($scope.entity.Person.CRIIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.CRIExpireDate) $scope.entity.Person.CRIExpireDate = (new Date($scope.entity.Person.CRIExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.CREIssueDate) $scope.entity.Person.CREIssueDate = (new Date($scope.entity.Person.CREIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.CREExpireDate) $scope.entity.Person.CREExpireDate = (new Date($scope.entity.Person.CREExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.SFI2IssueDate) $scope.entity.Person.SFI2IssueDate = (new Date($scope.entity.Person.SFI2IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.SFI2ExpireDate) $scope.entity.Person.SFI2ExpireDate = (new Date($scope.entity.Person.SFI2ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.SFE2IssueDate) $scope.entity.Person.SFE2IssueDate = (new Date($scope.entity.Person.SFE2IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.SFE2ExpireDate) $scope.entity.Person.SFE2ExpireDate = (new Date($scope.entity.Person.SFE2ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.AirCrewIssueDate) $scope.entity.Person.AirCrewIssueDate = (new Date($scope.entity.Person.AirCrewIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.AirCrewExpireDate) $scope.entity.Person.AirCrewExpireDate = (new Date($scope.entity.Person.AirCrewExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.AirOpsIssueDate) $scope.entity.Person.AirOpsIssueDate = (new Date($scope.entity.Person.AirOpsIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.AirOpsExpireDate) $scope.entity.Person.AirOpsExpireDate = (new Date($scope.entity.Person.AirOpsExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.SOPIssueDate) $scope.entity.Person.SOPIssueDate = (new Date($scope.entity.Person.SOPIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.SOPExpireDate) $scope.entity.Person.SOPExpireDate = (new Date($scope.entity.Person.SOPExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.Diff31IssueDate) $scope.entity.Person.Diff31IssueDate = (new Date($scope.entity.Person.Diff31IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.Diff31ExpireDate) $scope.entity.Person.Diff31ExpireDate = (new Date($scope.entity.Person.Diff31ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.Diff34IssueDate) $scope.entity.Person.Diff34IssueDate = (new Date($scope.entity.Person.Diff34IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.Diff34ExpireDate) $scope.entity.Person.Diff34ExpireDate = (new Date($scope.entity.Person.Diff34ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.OMA1IssueDate) $scope.entity.Person.OMA1IssueDate = (new Date($scope.entity.Person.OMA1IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.OMA1ExpireDate) $scope.entity.Person.OMA1ExpireDate = (new Date($scope.entity.Person.OMA1ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.OMB1IssueDate) $scope.entity.Person.OMB1IssueDate = (new Date($scope.entity.Person.OMB1IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.OMB1ExpireDate) $scope.entity.Person.OMB1ExpireDate = (new Date($scope.entity.Person.OMB1ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.OMC1IssueDate) $scope.entity.Person.OMC1IssueDate = (new Date($scope.entity.Person.OMC1IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.OMC1ExpireDate) $scope.entity.Person.OMC1ExpireDate = (new Date($scope.entity.Person.OMC1ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.OMA2IssueDate) $scope.entity.Person.OMA2IssueDate = (new Date($scope.entity.Person.OMA2IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.OMA2ExpireDate) $scope.entity.Person.OMA2ExpireDate = (new Date($scope.entity.Person.OMA2ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.OMB2IssueDate) $scope.entity.Person.OMB2IssueDate = (new Date($scope.entity.Person.OMB2IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.OMB2ExpireDate) $scope.entity.Person.OMB2ExpireDate = (new Date($scope.entity.Person.OMB2ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.OMC2IssueDate) $scope.entity.Person.OMC2IssueDate = (new Date($scope.entity.Person.OMC2IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.OMC2ExpireDate) $scope.entity.Person.OMC2ExpireDate = (new Date($scope.entity.Person.OMC2ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.OMA3IssueDate) $scope.entity.Person.OMA3IssueDate = (new Date($scope.entity.Person.OMA3IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.OMA3ExpireDate) $scope.entity.Person.OMA3ExpireDate = (new Date($scope.entity.Person.OMA3ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.OMB3IssueDate) $scope.entity.Person.OMB3IssueDate = (new Date($scope.entity.Person.OMB3IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.OMB3ExpireDate) $scope.entity.Person.OMB3ExpireDate = (new Date($scope.entity.Person.OMB3ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.OMC3IssueDate) $scope.entity.Person.OMC3IssueDate = (new Date($scope.entity.Person.OMC3IssueDate)).addMinutes(offset);
        if ($scope.entity.Person.OMC3ExpireDate) $scope.entity.Person.OMC3ExpireDate = (new Date($scope.entity.Person.OMC3ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.MapIssueDate) $scope.entity.Person.MapIssueDate = (new Date($scope.entity.Person.MapIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.MapExpireDate) $scope.entity.Person.MapExpireDate = (new Date($scope.entity.Person.MapExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.ComResIssueDate) $scope.entity.Person.ComResIssueDate = (new Date($scope.entity.Person.ComResIssueDate)).addMinutes(offset);
        if ($scope.entity.Person.ComResExpireDate) $scope.entity.Person.ComResExpireDate = (new Date($scope.entity.Person.ComResExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.OPCC1ExpireDate) $scope.entity.Person.OPCC1ExpireDate = (new Date($scope.entity.Person.OPCC1ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.OPCC2ExpireDate) $scope.entity.Person.OPCC2ExpireDate = (new Date($scope.entity.Person.OPCC2ExpireDate)).addMinutes(offset);
        if ($scope.entity.Person.OPCC3ExpireDate) $scope.entity.Person.OPCC3ExpireDate = (new Date($scope.entity.Person.OPCC3ExpireDate)).addMinutes(offset);


        //  $scope.datefrom = General.getDayFirstHour(new Date(dfrom));
        //   $scope.dateEnd = General.getDayLastHour(new Date(new Date(dfrom).addDays($scope.days_count - 1)));
        //doolko
        //entity.Person.DateTypeIssue
        // if ($scope.entity.Person.DateTypeIssue)
        //     $scope.entity.Person.DateTypeIssue = new Date((new Date($scope.entity.DateTypeIssue)).addMinutes(offset));
        // if ($scope.entity.Person.DateTypeExpire)
        //     $scope.entity.Person.DateTypeExpire = new Date((new Date($scope.entity.DateTypeExpire)).addMinutes(offset));


        $scope.loadingVisible = true;

        personService.save($scope.entity).then(function (response) {

            $scope.clearEntity();


            General.ShowNotify(Config.Text_SavedOk, 'success');

            $rootScope.$broadcast('onPersonSaved', response);



            $scope.loadingVisible = false;
            if (!$scope.isNew)
                $scope.popup_add_visible = false;



        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        //Transaction.Aid.save($scope.entity, function (data) {

        //    $scope.clearEntity();


        //    General.ShowNotify('تغییرات با موفقیت ذخیره شد', 'success');

        //    $rootScope.$broadcast('onAidSaved', data);

        //    $scope.$apply(function () {
        //        $scope.loadingVisible = false;
        //        if (!$scope.isNew)
        //            $scope.popup_add_visible = false;
        //    });

        //}, function (ex) {
        //    $scope.$apply(function () {
        //        $scope.loadingVisible = false;
        //    });
        //    General.ShowNotify(ex.message, 'error');
        //});

    };
    ////////////////////////////
    $scope.pop_width_file = 750;
    $scope.pop_height_file = 600;
    $scope.popup_file_visible = false;
    $scope.popup_file_title = 'New Document';
    $scope.popup_file = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fileadd', bindingOptions: {}, onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        //var exist = Enumerable.From($scope.entity.Person.Educations).Where('$.EducationDegreeId==' + $scope.entityEducation.EducationDegreeId + ' && ' + '$.StudyFieldId==' + $scope.entityEducation.StudyFieldId + ' && $.Id!=' + $scope.entityEducation.Id).FirstOrDefault();
                        //if (exist) {
                        //    General.ShowNotify(Config.Text_SameItemExist, 'error');
                        //    return;
                        //}
                        if (!$scope.entityDocument.Id) {
                            var id = ($scope.entity.Person.Documents.length + 1) * -1;

                            $scope.entityDocument.Id = id;
                            $scope.entity.Person.Documents.push(JSON.clone($scope.entityDocument));
                            $scope.clearEntityDocumnet();
                        }
                        else {

                            //dg_selected = JSON.clone($scope.entityAircrafttype);
                            JSON.copy($scope.entityDocument, dg_selected);
                            $scope.clearEntityDocumnet();
                            $scope.popup_file_visible = false;
                        }
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_file_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            if ($scope.pop_width_file > $scope.pop_width)
                $scope.pop_width_file = $scope.pop_width;
            if ($scope.pop_height_file > $scope.pop_height)
                $scope.pop_height_file = $scope.pop_height;


            //$scope.scroll_height = $scope.pop_height - 140;


        },
        onShown: function (e) {

            $scope.dg_upload_instance.repaint();
        },
        onHiding: function () {
            $scope.clearEntityDocumnet();
            $scope.clearEntityFile();

            $scope.popup_file_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_file_visible',
            width: 'pop_width_file',
            height: 'pop_height_file',
            title: 'popup_file_title',

        }
    };
    ///////////////////////////

    $scope.popup_file_view_visible = false;
    $scope.popup_file_view_title = 'Document';
    $scope.popup_file_view = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_file_view_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            if ($scope.pop_width_file > $scope.pop_width)
                $scope.pop_width_file = $scope.pop_width;
            if ($scope.pop_height_file > $scope.pop_height)
                $scope.pop_height_file = $scope.pop_height;


            //$scope.scroll_height = $scope.pop_height - 140;


        },
        onShown: function (e) {

            $scope.dg_upload_instance.repaint();
        },
        onHiding: function () {

            $scope.clearEntityFile();

            $scope.popup_file_view_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_file_view_visible',
            width: 'pop_width_file',
            height: 'pop_height_file',
            title: 'popup_file_view_title',

        }
    };
    ////////////////////////////
    $scope.pop_width_education = 600;
    $scope.pop_height_education = 600;
    $scope.popup_education_visible = false;
    $scope.popup_education_title = 'New Education';
    $scope.popup_education = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'educationadd', bindingOptions: {}, onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        var exist = Enumerable.From($scope.entity.Person.Educations).Where('$.EducationDegreeId==' + $scope.entityEducation.EducationDegreeId + ' && ' + '$.StudyFieldId==' + $scope.entityEducation.StudyFieldId + ' && $.Id!=' + $scope.entityEducation.Id).FirstOrDefault();
                        if (exist) {
                            General.ShowNotify(Config.Text_SameItemExist, 'error');
                            return;
                        }
                        if (!$scope.entityEducation.Id) {
                            var id = ($scope.entity.Person.Educations.length + 1) * -1;

                            $scope.entityEducation.Id = id;
                            $scope.entity.Person.Educations.push(JSON.clone($scope.entityEducation));
                            $scope.clearEntityEducation();
                        }
                        else {

                            //dg_selected = JSON.clone($scope.entityAircrafttype);
                            JSON.copy($scope.entityEducation, dg_selected);
                            $scope.clearEntityEducation();
                            $scope.popup_education_visible = false;
                        }
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_education_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            if ($scope.pop_width_education > $scope.pop_width)
                $scope.pop_width_education = $scope.pop_width;
            if ($scope.pop_height_education > $scope.pop_height)
                $scope.pop_height_education = $scope.pop_height;


            //$scope.scroll_height = $scope.pop_height - 140;


        },
        onShown: function (e) {


        },
        onHiding: function () {

            $scope.clearEntityEducation();

            $scope.popup_education_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_education_visible',
            width: 'pop_width_education',
            height: 'pop_height_education',
            title: 'popup_education_title',

        }
    };
    ////////////////////////////
    $scope.pop_width_exp = 600;
    $scope.pop_height_exp = 450;
    $scope.popup_exp_visible = false;
    $scope.popup_exp_title = 'New Experience';
    $scope.popup_exp = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'experienceadd', bindingOptions: {}, onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        var exist = Enumerable.From($scope.entity.Person.Expreienses).Where("$.Organization=='" + $scope.entityExp.Organization + "'" + ' && $.AircraftTypeId==' + $scope.entityExp.AircraftTypeId + " && $.JobTitle=='" + $scope.entityExp.JobTitle + "' && $.Id!=" + $scope.entityExp.Id).FirstOrDefault();
                        if (exist) {
                            General.ShowNotify(Config.Text_SameItemExist, 'error');
                            return;
                        }
                        if (!$scope.entityExp.Id) {
                            var id = ($scope.entity.Person.Expreienses.length + 1) * -1;

                            $scope.entityExp.Id = id;
                            $scope.entity.Person.Expreienses.push(JSON.clone($scope.entityExp));

                            $scope.clearEntityExp();

                        }
                        else {

                            //dg_selected = JSON.clone($scope.entityAircrafttype);
                            JSON.copy($scope.entityExp, dg_selected);
                            $scope.clearEntityExp();
                            $scope.popup_exp_visible = false;
                        }
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_exp_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            if ($scope.pop_width_exp > $scope.pop_width)
                $scope.pop_width_exp = $scope.pop_width;
            if ($scope.pop_height_exp > $scope.pop_height)
                $scope.pop_height_exp = $scope.pop_height;


            //$scope.scroll_height = $scope.pop_height - 140;


        },
        onShown: function (e) {


        },
        onHiding: function () {

            $scope.clearEntityExp();

            $scope.popup_exp_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_exp_visible',
            width: 'pop_width_exp',
            height: 'pop_height_exp',
            title: 'popup_exp_title',

        }
    };
    ///////////////////////////
    $scope.pop_width_rating = 600;
    $scope.pop_height_rating = 360;
    $scope.popup_rating_visible = false;
    $scope.popup_rating_title = 'New Rating';
    $scope.popup_rating = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'ratingadd', bindingOptions: {}, onClick: function (e) {
                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        var exist = Enumerable.From($scope.entity.Person.Ratings).Where('$.OrganizationId==' + $scope.entityRating.OrganizationId + ' && $.AircraftTypeId==' + $scope.entityRating.AircraftTypeId + ' && $.CategoryId==' + $scope.entityExp.JobTitle + ' && $.Id!=' + $scope.entityRating.Id).FirstOrDefault();
                        if (exist) {
                            General.ShowNotify(Config.Text_SameItemExist, 'error');
                            return;
                        }
                        if (!$scope.entityRating.Id) {
                            var id = ($scope.entity.Person.Ratings.length + 1) * -1;

                            $scope.entityRating.Id = id;
                            $scope.entity.Person.Ratings.push(JSON.clone($scope.entityRating));

                            $scope.clearEntityRating();

                        }
                        else {

                            //dg_selected = JSON.clone($scope.entityAircrafttype);
                            JSON.copy($scope.entityRating, dg_selected);
                            $scope.clearEntityRating();
                            $scope.popup_rating_visible = false;
                        }
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_rating_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            if ($scope.pop_width_rating > $scope.pop_width)
                $scope.pop_width_rating = $scope.pop_width;
            if ($scope.pop_height_rating > $scope.pop_height)
                $scope.pop_height_rating = $scope.pop_height;


            //$scope.scroll_height = $scope.pop_height - 140;


        },
        onShown: function (e) {


        },
        onHiding: function () {

            $scope.clearEntityRating();

            $scope.popup_rating_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_rating_visible',
            width: 'pop_width_rating',
            height: 'pop_height_rating',
            title: 'popup_rating_title',

        }
    };
    ////////////////////////////

    $scope.pop_width_aircrafttype = 600;
    $scope.pop_height_aircrafttype = 300;
    $scope.popup_aircrafttype_visible = false;
    $scope.popup_aircrafttype_title = 'New Aircraft Type';
    $scope.popup_aircrafttype = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'aircrafttypeadd', onClick: function (e) {

                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }

                        var exist = Enumerable.From($scope.entity.Person.AircraftTypes).Where('$.AircraftTypeId==' + $scope.entityAircrafttype.AircraftTypeId + ' && $.Id!=' + $scope.entityAircrafttype.Id).FirstOrDefault();
                        if (exist) {
                            General.ShowNotify(Config.Text_SameItemExist, 'error');
                            return;
                        }
                        if (!$scope.entityAircrafttype.Id) {
                            var id = ($scope.entity.Person.AircraftTypes.length + 1) * -1;

                            $scope.entityAircrafttype.Id = id;
                            $scope.entity.Person.AircraftTypes.push(JSON.clone($scope.entityAircrafttype));
                            $scope.clearEntityAircrafttype();
                        }
                        else {

                            //dg_selected = JSON.clone($scope.entityAircrafttype);
                            JSON.copy($scope.entityAircrafttype, dg_selected);
                            $scope.clearEntityAircrafttype();
                            $scope.popup_aircrafttype_visible = false;
                        }

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_aircrafttype_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            if ($scope.pop_width_aircrafttype > $scope.pop_width)
                $scope.pop_width_aircrafttype = $scope.pop_width;
            if ($scope.pop_height_aircrafttype > $scope.pop_height)
                $scope.pop_height_aircrafttype = $scope.pop_height;


            //$scope.scroll_height = $scope.pop_height - 140;


        },
        onShown: function (e) {


        },
        onHiding: function () {

            $scope.clearEntityAircrafttype();

            $scope.popup_aircrafttype_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_aircrafttype_visible',
            width: 'pop_width_aircrafttype',
            height: 'pop_height_aircrafttype',
            title: 'popup_aircrafttype_title',

        }
    };
    ///////////////////////////
    $scope.dg_education_columns = [
        { dataField: "EducationDegree", caption: "Degree", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 250 },
        { dataField: "StudyField", caption: "Field", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false },
        { dataField: "College", caption: "College", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 250 },
        { dataField: "DateCatch", caption: "Date", allowResizing: true, alignment: "center", dataType: 'date', allowEditing: false, width: 150 },
        {
            dataField: "FileUrl",
            width: 120,
            alignment: 'center',
            caption: 'Attachment',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var element = "<div></div>";
                if (options.value)
                    element = "<a  href='" + $rootScope.clientsFilesUrl + "/" + options.value + "' class='w3-button w3-block w3-blue' style=' margin:0 auto 0px auto;text-decoration:none' target='_blank'>Download</a>";

                $("<div>")
                    //.append("<img src='content/images/" + fn + ".png' />")
                    .append(element)
                    .appendTo(container);
            },
        },
    ];
    $scope.dg_education_selected = null;
    $scope.dg_education_instance = null;
    $scope.dg_education = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_education_columns,
        onContentReady: function (e) {
            if (!$scope.dg_education_instance)
                $scope.dg_education_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_education_selected = null;
            }
            else
                $scope.dg_education_selected = data;


        },
        bindingOptions: {

            dataSource: 'entity.Person.Educations',
            height: 'dg_height',
        },
        // dataSource:ds

    };

    $scope.dg_file_columns = [
        { dataField: "DocumentType", caption: "DocumentType", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 250 },
        { dataField: "Remark", caption: "Remark", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false },



    ];
    $scope.dg_file_selected = null;
    $scope.dg_file_instance = null;
    $scope.dg_file = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_file_columns,
        onContentReady: function (e) {
            if (!$scope.dg_file_instance)
                $scope.dg_file_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_file_selected = null;
            }
            else
                $scope.dg_file_selected = data;


        },
        bindingOptions: {

            dataSource: 'entity.Person.Documents',
            height: 'dg_height',
        },
        // dataSource:ds

    };
    ///////////////////////////
    $scope.dg_upload_columns = [

        { dataField: "FileUrl", caption: "Uploaded", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false },
        { dataField: "SysUrl", caption: "File", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 200 },
        { dataField: "FileType", caption: "File Type", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 150 },
        {
            dataField: "FileUrl",
            width: 120,
            alignment: 'center',
            caption: 'Attachment',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var element = "<div></div>";
                if (options.value)
                    element = "<a  href='" + $rootScope.clientsFilesUrl + "/" + options.value + "' class='w3-button w3-block w3-blue' style=' margin:0 auto 0px auto;text-decoration:none' target='_blank'>Download</a>";

                $("<div>")
                    //.append("<img src='content/images/" + fn + ".png' />")
                    .append(element)
                    .appendTo(container);
            },
        },


    ];
    $scope.dg_upload_selected = null;
    $scope.dg_upload_instance = null;
    $scope.dg_upload = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },
        height: 230,
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: false, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_upload_columns,
        onContentReady: function (e) {
            if (!$scope.dg_upload_instance)
                $scope.dg_upload_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_upload_selected = null;
            }
            else
                $scope.dg_upload_selected = data;


        },
        bindingOptions: {

            dataSource: 'entityDocument.Documents',

        },
        // dataSource:ds

    };
    ///////////////////////////
    $scope.dg_upload2_columns = [

        { dataField: "FileUrl", caption: "Uploaded", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false },
        { dataField: "SysUrl", caption: "File", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 200 },
        { dataField: "FileType", caption: "File Type", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 150 },
        {
            dataField: "FileUrl",
            width: 120,
            alignment: 'center',
            caption: 'Attachment',
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var element = "<div></div>";
                if (options.value)
                    element = "<a  href='" + $rootScope.clientsFilesUrl + "/" + options.value + "' class='w3-button w3-block w3-blue' style=' margin:0 auto 0px auto;text-decoration:none' target='_blank'>Download</a>";

                $("<div>")
                    //.append("<img src='content/images/" + fn + ".png' />")
                    .append(element)
                    .appendTo(container);
            },
        },


    ];
    $scope.dg_upload2_selected = null;
    $scope.dg_upload2_instance = null;
    $scope.dg_upload2 = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },
        height: 230,
        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: false, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_upload2_columns,
        onContentReady: function (e) {
            if (!$scope.dg_upload2_instance)
                $scope.dg_upload2_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_upload2_selected = null;
            }
            else
                $scope.dg_upload2_selected = data;


        },
        bindingOptions: {

            dataSource: 'entityDocument2.Documents',

        },
        // dataSource:ds

    };
    ///////////////////////////
    $scope.dg_exp_columns = [
        { dataField: "JobTitle", caption: "Job Title", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 250 },
        { dataField: "Organization", caption: "Organization", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 200 },
        { dataField: "Remark", caption: "Remark", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 400 },
        { dataField: "AircraftType", caption: "AC Type", allowResizing: true, alignment: "center", dataType: 'string', allowEditing: false, width: 130 },
        { dataField: "DateStart", caption: "From", allowResizing: true, alignment: "center", dataType: 'date', allowEditing: false, width: 140 },
        { dataField: "DateEnd", caption: "To", allowResizing: true, alignment: "center", dataType: 'date', allowEditing: false, width: 140 },
    ];
    $scope.dg_exp_selected = null;
    $scope.dg_exp_instance = null;
    $scope.dg_exp = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_exp_columns,
        onContentReady: function (e) {
            if (!$scope.dg_exp_instance)
                $scope.dg_exp_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_exp_selected = null;
            }
            else
                $scope.dg_exp_selected = data;


        },
        bindingOptions: {

            dataSource: 'entity.Person.Expreienses',
            height: 'dg_height',
        },
        // dataSource:ds

    };
    ////////////////////////////
    $scope.dg_aircrafttype_columns = [
        { dataField: "AircraftType", caption: "Aircraft Type", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 250 },
        { dataField: "Remark", caption: "Remark", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false },


    ];
    $scope.dg_aircrafttype_selected = null;
    $scope.dg_aircrafttype_instance = null;
    $scope.dg_aircrafttype = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_aircrafttype_columns,
        onContentReady: function (e) {
            if (!$scope.dg_aircrafttype_instance)
                $scope.dg_aircrafttype_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_aircrafttype_selected = null;
            }
            else
                $scope.dg_aircrafttype_selected = data;


        },
        bindingOptions: {

            dataSource: 'entity.Person.AircraftTypes',
            height: 'dg_height',
        },
        // dataSource:ds

    };
    ////////////////////////////////
    $scope.dg_certificate_columns = [
        {
            dataField: "ExpireStatus", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {

                var fn = 'green';
                switch (options.value) {
                    case 1:
                        fn = 'red';
                        break;
                    case 2:
                        fn = 'orange';
                        break;

                    default:
                        break;
                }
                $("<div>")
                    .append("<img src='content/images/" + fn + ".png' />")
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left'
        },



        { dataField: 'CerNumber', caption: 'Certificate No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 130, fixed: true, fixedPosition: 'left' },
        { dataField: 'ExpireDate', caption: 'Expire Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, fixed: true, fixedPosition: 'left' },
        { dataField: 'DateIssue', caption: 'Issue Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, fixed: false, fixedPosition: 'left' },
        { dataField: 'Remain', caption: 'Remain', allowResizing: true, alignment: 'center', dataType: 'number', allowEditing: false, width: 70, fixed: false, fixedPosition: 'left' },


        { dataField: 'CourseNo', caption: 'Course No.', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 100, },
        { dataField: 'CourseTitle', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200, fixed: true, fixedPosition: 'left' },
        { dataField: 'CourseOrganization', caption: 'Organization', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        //  { dataField: 'CT_Title', caption: 'Course Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        //{ dataField: 'CaoTypeTitle', caption: 'Cao Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        // { dataField: 'Duration2', caption: 'Duration', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'CourseDateStart', caption: 'DateStart', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, sortIndex: 0, sortOrder: "desc" },

        { dataField: 'CourseRecurrent', caption: 'Recurrent', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },


    ];
    $scope.dg_certificate_selected = null;
    $scope.dg_certificate_instance = null;
    $scope.dg_certificate = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_certificate_columns,
        onContentReady: function (e) {
            if (!$scope.dg_certificate_instance)
                $scope.dg_certificate_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_certificate_selected = null;
            }
            else
                $scope.dg_certificate_selected = data;


        },
        bindingOptions: {

            dataSource: 'entity.Person.Certificates',
            height: 'dg_height',
        },
        // dataSource:ds

    };
    //////////////////////////////
    $scope.dg_course_columns = [
        {
            dataField: "StatusId", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                var fn = 'pending-24';
                switch (options.value) {
                    case 67:
                        fn = 'registered-24';
                        break;
                    case 69:
                        fn = 'canceled-24';
                        break;
                    case 68:
                        fn = 'Attended-24';
                        break;
                    case 70:
                        fn = 'failed-24';
                        break;
                    case 71:
                        fn = 'passed-24';
                        break;
                    default:
                        break;
                }
                $("<div>")
                    .append("<img src='content/images/" + fn + ".png' />")
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left',
        },
        { dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100, fixed: true, fixedPosition: 'left', sortIndex: 0, sortOrder: "desc" },
        { dataField: 'No', caption: 'No.', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 100, },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: true, fixedPosition: 'left' },
        //  { dataField: 'CT_Title', caption: 'Course Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        //{ dataField: 'CaoTypeTitle', caption: 'Cao Type', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 200 },
        // { dataField: 'Duration2', caption: 'Duration', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'DateStart', caption: 'DateStart', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, sortIndex: 0, sortOrder: "desc" },
        { dataField: 'DateEnd', caption: 'DateEnd', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'Recurrent', caption: 'Recurrent', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },

        { dataField: 'Organization', caption: 'Organization', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'TrainingDirector', caption: 'Training Director', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },

        { dataField: 'DateIssue', caption: 'Issue Date', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, fixed: true, fixedPosition: 'right' },
        { dataField: 'CerNumber', caption: 'Certificate No', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150, fixed: true, fixedPosition: 'right' },

    ];
    $scope.dg_course_selected = null;


    $scope.dg_course_instance = null;
    $scope.dg_course_ds = null;
    $scope.dg_course = {
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        height: $(window).height() - 175,

        columns: $scope.dg_course_columns,
        onContentReady: function (e) {
            if (!$scope.dg_course_instance)
                $scope.dg_course_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_course_selected = null;

            }
            else {
                $scope.dg_course_selected = data;

            }



        },
        bindingOptions: {
            dataSource: 'dg_course_ds'
        }
    };
    ////////////////////////////
    $scope.dg_rating_columns = [
        { dataField: "AircraftType", caption: "Aircraft Type", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 250 },
        { dataField: "Category", caption: "Category", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false },
        { dataField: "Organization", caption: "Organization", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 250 },

        { dataField: "DateIssue", caption: "Issue Date", allowResizing: true, alignment: "center", dataType: 'date', allowEditing: false, width: 200 },
        { dataField: "DateExpire", caption: "Expire Date", allowResizing: true, alignment: "center", dataType: 'date', allowEditing: false, width: 200 },
    ];
    $scope.dg_rating_selected = null;
    $scope.dg_rating_instance = null;
    $scope.dg_rating = {
        showRowLines: true,
        showColumnLines: true,
        sorting: { mode: 'multiple' },

        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'infinite' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        filterRow: { visible: true, showOperationChooser: true, },
        columnAutoWidth: false,
        columns: $scope.dg_rating_columns,
        onContentReady: function (e) {
            if (!$scope.dg_rating_instance)
                $scope.dg_rating_instance = e.component;

        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_rating_selected = null;
            }
            else
                $scope.dg_rating_selected = data;


        },
        bindingOptions: {

            dataSource: 'entity.Person.Ratings',
            height: 'dg_height',
        },
        // dataSource:ds

    };
    ////////////////////////////
    $scope.date_DateCaoCardIssue = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!($scope.isNew || !$scope.entity.Person.DateCaoCardExpire))
                return;
            if (!e.value) {
                $scope.entity.Person.DateCaoCardExpire = null;
                return;
            }
            $scope.entity.Person.DateCaoCardExpire = (new Date(e.value)).addYears(1);
        },
        bindingOptions: {
            value: 'entity.Person.DateCaoCardIssue',
            readOnly: 'IsMainDisabled',

        }
    };

    $scope.date_DateCaoCardExpire = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.DateCaoCardExpire',
            readOnly: 'IsMainDisabled',

        }
    };
    ////////////////////////////////////
    $scope.popup_file2_visible = false;
    $scope.popup_file2_title = 'New Document';
    $scope.popup_file2 = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'fileadd', bindingOptions: {}, onClick: function (e) {


                        if ($scope.pdoc_title && $scope.pdoc_type) {
                            var dto = {
                                personId: $scope.entity.Person.PersonId,
                                type: $scope.pdoc_type,
                                url: $scope.pdoc_title
                            };
                            $scope.loadingVisible = true;
                            trnService.savePersonDoc(dto).then(function (response) {

                                $scope.loadingVisible = false;
                                $scope.popup_file2_visible = false;
                            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                        }


                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) {
                        $scope.popup_file2_visible = false;
                    }
                }, toolbar: 'bottom'
            }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {


        },
        onShown: function (e) {


        },
        onHiding: function () {
            $scope.pdoc_type = null;
            $scope.pdoc_title = null;

            $scope.popup_file2_visible = false;
            // $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_file2_visible',
            width: '500',
            height: '300',
            title: 'popup_file2_title',

        }
    };
    $scope.uploaderValueDocument2 = [];
    $scope.uploadedFileDocument2 = null;
    $scope.uploader_document_instance2 = null;
    $scope.uploader_document2 = {
        //uploadedMessage: 'بارگزاری شد',
        multiple: false,
        // selectButtonText: 'انتخاب تصویر',
        labelText: '',
        // accept: "image/*",
        uploadMethod: 'POST',
        uploadMode: "instantly",

        uploadUrl: $rootScope.fileHandlerUrl + '?t=clientfiles',
        onValueChanged: function (arg) {

        },
        onUploaded: function (e) {
            $scope.pdoc_title = e.request.responseText;
            // var id = ($scope.entityDocument.Documents.length + 1) * -1;
            // var item = { Id: id, Title: e.request.responseText, FileUrl: e.request.responseText };
            // item.SysUrl = $scope.uploaderValueDocument[0].name;
            // item.FileType = $scope.uploaderValueDocument[0].type;
            // $scope.entityDocument.Documents.push(item);
            // console.log($scope.uploaderValueDocument);


        },
        onContentReady: function (e) {
            if (!$scope.uploader_document_instance2)
                $scope.uploader_document_instance2 = e.component;

        },
        bindingOptions: {
            value: 'uploaderValueDocument2'
        }
    };
    $scope.savedoc_click = function (str) {
        return;
        $scope.pdoc_type = str;
        $scope.popup_file2_visible = true;
    }
    $scope.pdoc_title = null;
    $scope.pdoc_type = null;
    $scope.txt_pdoc = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'pdoc_title',

        }
    };

    ////DISPATCH//////////////////////////
    $scope.date_WBIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.MBExpireDate = null;
                return;
            }

            $scope.entity.Person.MBExpireDate = (new Date(e.value)).addYears(3);
        },
        bindingOptions: {
            value: 'entity.Person.MBIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_WBExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.MBExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };


    $scope.date_FPIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.RSPExpireDate = null;
                return;
            }

            $scope.entity.Person.RSPExpireDate = (new Date(e.value)).addYears(3);
        },
        bindingOptions: {
            value: 'entity.Person.RSPIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_FPExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.RSPExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };



    $scope.date_RCIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.LRCExpireDate = null;
                return;
            }

            $scope.entity.Person.LRCExpireDate = (new Date(e.value)).addYears(5);
        },
        bindingOptions: {
            value: 'entity.Person.LRCIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_RCExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.LRCExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };


    $scope.date_PERIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.PERExpireDate = null;
                return;
            }

            $scope.entity.Person.PERExpireDate = (new Date(e.value)).addYears(3);
        },
        bindingOptions: {
            value: 'entity.Person.PERIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_PERExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.PERExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };


    $scope.date_METIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.METExpireDate = null;
                return;
            }

            $scope.entity.Person.METExpireDate = (new Date(e.value)).addYears(3);
        },
        bindingOptions: {
            value: 'entity.Person.METIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_METExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.METExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };


    $scope.date_MELIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.MELExpireDate = null;
                return;
            }

            $scope.entity.Person.MELExpireDate = (new Date(e.value)).addYears(3);
        },
        bindingOptions: {
            value: 'entity.Person.MELIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_MELExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.MELExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };


    $scope.date_HFIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.HFExpireDate = null;
                return;
            }

            $scope.entity.Person.HFExpireDate = (new Date(e.value)).addYears(2);
        },
        bindingOptions: {
            value: 'entity.Person.HFIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_HFExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.HFExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };


    $scope.date_ERPIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.ERPExpireDate = null;
                return;
            }

            $scope.entity.Person.ERPExpireDate = (new Date(e.value)).addYears(3);
        },
        bindingOptions: {
            value: 'entity.Person.ERPIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_ERPExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ERPExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };



    $scope.date_DRMIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.DRMExpireDate = null;
                return;
            }

            $scope.entity.Person.DRMExpireDate = (new Date(e.value)).addYears(3);
        },
        bindingOptions: {
            value: 'entity.Person.DRMIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_DRMExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.DRMExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };


    $scope.date_ANNEXIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.ANNEXExpireDate = null;
                return;
            }

            $scope.entity.Person.ANNEXExpireDate = (new Date(e.value)).addYears(3);
        },
        bindingOptions: {
            value: 'entity.Person.ANNEXIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_ANNEXExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ANNEXExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };



    $scope.date_ASDIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.ASDExpireDate = null;
                return;
            }

            $scope.entity.Person.ASDExpireDate = (new Date(e.value)).addYears(3);
        },
        bindingOptions: {
            value: 'entity.Person.ASDIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_ASDExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ASDExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };



    $scope.date_GOMIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.GOMExpireDate = null;
                return;
            }

            $scope.entity.Person.GOMExpireDate = (new Date(e.value)).addYears(3);
        },
        bindingOptions: {
            value: 'entity.Person.GOMIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_GOMExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.GOMExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };


    $scope.date_ASFIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.ASFExpireDate = null;
                return;
            }

            $scope.entity.Person.ASFExpireDate = (new Date(e.value)).addYears(3);
        },
        bindingOptions: {
            value: 'entity.Person.ASFIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_ASFExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ASFExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };


    $scope.date_CCIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.CCExpireDate = null;
                return;
            }

            $scope.entity.Person.CCExpireDate = (new Date(e.value)).addYears(3);
        },
        bindingOptions: {
            value: 'entity.Person.CCIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_CCExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.CCExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };


    $scope.date_PSIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.PSExpireDate = null;
                return;
            }

            $scope.entity.Person.PSExpireDate = (new Date(e.value)).addYears(3);
        },
        bindingOptions: {
            value: 'entity.Person.PSIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_PSExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.PSExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };


    $scope.date_FMTDIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {

            if (!e.value) {
                $scope.entity.Person.FMTDExpireDate = null;
                return;
            }

            $scope.entity.Person.FMTDExpireDate = (new Date(e.value)).addYears(1);
        },
        bindingOptions: {
            value: 'entity.Person.FMTDIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };

    $scope.date_FMTDExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.FMTDExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };

    ///////////////////////////
    $scope.tempData = null;
    $scope.ds_allgroups = [];
    $scope.$on('InitAddPerson', function (event, prms) {


        $scope.tempData = null;
        $scope.doNID = true;
        if (!prms.Id) {

            $scope.isNew = true;

            $scope.popup_add_title = 'New';

        }

        else {

            $scope.popup_add_title = 'Edit';
            $scope.tempData = prms;
            $scope.isNew = false;
            //console.log(prms.NID);

        }

        var size = $rootScope.getWindowSize();

        $scope.pop_width = size.width;
        if ($scope.pop_width > 1400)
            $scope.pop_width = 1400;
        $scope.pop_height = $(window).height() - 30;
        $scope.dg_height = $scope.pop_height - 133;
        $scope.scroll_height = $scope.pop_height - 140;

        personService.getGroups(Config.CustomerId).then(function (response) {
            $scope.ds_allgroups = response.data;
            console.log('all groupos', $scope.ds_allgroups);
            $scope.popup_add_visible = true;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });



    });
    //////////////////////////////

}]);  