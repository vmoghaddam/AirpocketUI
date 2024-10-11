'use strict';
app.controller('personViewController', ['$scope', '$location', 'personService', 'authService', '$routeParams', '$rootScope', function ($scope, $location, personService, authService, $routeParams, $rootScope) {
    $scope.isNew = true;


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

            Educations: [],
            Expreienses: [],
            AircraftTypes: [],
            Documents: [],
            Ratings: [],


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


        $scope.entity.Person.Educations = [];
        $scope.entity.Person.Expreienses = [];
        $scope.entity.Person.Certificates = [];
        $scope.entity.Person.Courses = [];
        $scope.entity.Person.AircraftTypes = [];
        $scope.entity.Person.Documents = [];
        $scope.entity.Person.Ratings = [];

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


        $scope.entity.Person.Educations = data.Educations;
        $scope.entity.Person.Expreienses = data.Expreienses;
        $scope.entity.Person.Certificates = data.Certificates;
        $scope.entity.Person.Courses=data.Courses;
        $scope.entity.Person.AircraftTypes = data.AircraftTypes;
        $scope.entity.Person.Documents = data.Documents;
        $scope.entity.Person.Ratings = data.Ratings;
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

        if (data.Locations && data.Locations.length > 0) {
            $scope.bindLocation(data.Locations[0]);
        }



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
        { text: "Certificates", id: 'certificate', visible_btn: false, visible: $scope.isView },
        { text: "Courses", id: 'course', visible_btn: false, visible: $scope.isView },
        { text: "Education", id: 'education', visible_btn: false },
        //  { text: "حساب بانکی", id: 'account', visible_btn: false },
        //{ text: "Certificate", id: 'certificate', visible_btn: true },
        { text: "Document", id: 'file', visible_btn: false, visible_btn2: true },
        { text: "Experience", id: 'experience', visible_btn: false, visible: $scope.isView },
        { text: "Rating", id: 'rating', visible_btn: false, visible: $scope.isView },
        { text: "Aircraft Type", id: 'aircrafttype', visible_btn: false, visible: $scope.isView },
       


    ];
    $scope.btn_visible_education = false;
    $scope.btn_visible_certificate = false;
    $scope.btn_visible_file = false;
    $scope.btn_visible_experience = false;
    $scope.btn_visible_rating = false;
    $scope.btn_visible_aircrafttype = false;

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
            $scope.dg_certificate_instance.repaint();
            $scope.dg_course_instance.repaint();
            //$scope.dg_aids_instance.repaint();
            //$scope.dg_aidsnc_instance.repaint();
            var myVar = setInterval(function () {

                var scl = $("#dg_education").find('.dx-datagrid-rowsview').dxScrollable('instance');
                scl.scrollTo({ left: 0 });
                var scl2 = $("#dg_file").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl2.scrollTo({ left: 0 });
                var scl3 = $("#dg_exp").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl3.scrollTo({ left: 0 });
                var scl4 = $("#dg_rating").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl4.scrollTo({ left: 0 });
                var scl5 = $("#dg_aircrafttype").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl5.scrollTo({ left: 0 });
                var scl6 = $("#dg_certificate").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl6.scrollTo({ left: 0 });
                var scl7 = $("#dg_course").find('.dx-datagrid-rowsview').dxScrollable('instance'); scl7.scrollTo({ left: 0 });
                //var scl3 = $("#dg_aids").find('.dx-datagrid-rowsview').dxScrollable('instance');
                //scl3.scrollTo({ left: 10000 });
                //var scl4 = $("#dg_aidsnc").find('.dx-datagrid-rowsview').dxScrollable('instance');
                //scl4.scrollTo({ left: 10000 });
                clearInterval(myVar);
            }, 100);


            //$scope.btn_visible = $scope.selectedTab.visible_btn;
            //$scope.btn_visible2 = $scope.selectedTab.visible_btn2;

            $scope.btn_visible_education = newValue == 1;

            // $scope.btn_visible_certificate = newValue == 2;
            $scope.btn_visible_file = newValue == 2;
            $scope.btn_visible_experience = newValue == 3;
            $scope.btn_visible_rating = newValue == 4;
            $scope.btn_visible_aircrafttype = newValue == 5;

            //$scope.btn_location_education = newValue == 1?'before': 'after';
            //$scope.btn_location_certificate = newValue == 2 ? 'before' : 'after';
            //$scope.btn_location_file = ewValue == 3 ? 'before' : 'after';
            //$scope.btn_location_experience = newValue == 4 ? 'before' : 'after';
            //$scope.btn_location_rating = newValue == 5 ? 'before' : 'after';

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
    $scope.IsMainDisabled = true;
    $scope.IsNIDDisabled = false;
    $scope.nid = null;
    $scope.getByNID = function (newValue) {

        $scope.IsMainDisabled = true;
        $scope.loadingVisible = true;
        personService.getEmployeeForView(newValue, Config.CustomerId).then(function (response) {
            $scope.loadingVisible = false;
           // $scope.IsMainDisabled = false;
            //$scope.bind(response);
            console.log(response); 
            if (!response) {
                $scope.entity.Person.PersonId = -1;
                $scope.entity.PersonId = -1;
                $scope.entity.Id = -1;
                $scope.entity.CustomerCreatorId = Config.CustomerId;
                $scope.entity.Person.NID = newValue;

                return;
            }
            $scope.bind(response);

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
            $scope.getByNID(newValue);
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
        text: 'IPC',
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
    }
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
        bindingOptions: {
            value: 'entity.Person.DateLastCheckUP',
            readOnly: 'IsMainDisabled',
        }
    };
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
    $scope.sb_group = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceGroups(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateGroup(data);
        },
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.GroupId',
            readOnly: 'IsMainDisabled',
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
        bindingOptions: {
            value: 'entity.Locations[0].LocationId',
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
    $scope.popup_add = {

        fullScreen: false,
        showTitle: true,

        toolbarItems: [
           

            { widget: 'dxButton', location: 'after', options: { type: 'danger', text: 'Close', icon: 'remove', onClick: function (e) { $scope.popup_add_visible = false;} }, toolbar: 'bottom' }
        ],

        visible: false,
        dragEnabled: false,
        closeOnOutsideClick: false,
        onShowing: function (e) {
            var size = $rootScope.getWindowSize();

            $scope.pop_width = size.width;
            if ($scope.pop_width > 1200)
                $scope.pop_width = 1200;
            //$scope.pop_width_related = $scope.pop_width - 200;
            //if ($scope.pop_width_related <= 800)
            //    $scope.pop_width_related = 800;
            $scope.pop_height = $(window).height() - 30; //630; //size.height;
            $scope.dg_height = $scope.pop_height - 133;
            $scope.scroll_height = $scope.pop_height - 140;
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

            //var dsclient = $rootScope.getClientsDatasource($scope.LocationId);
            //$scope.clientInstance.option('dataSource', dsclient);

            if ($scope.tempData != null)
                $scope.nid = $scope.tempData.NID;
            //     $scope.bind($scope.tempData);

        },
        onHiding: function () {

            $scope.clearEntity();

            $scope.popup_add_visible = false;
            $rootScope.$broadcast('onPersonHide', null);
        },
        bindingOptions: {
            visible: 'popup_add_visible',
            width: 'pop_width',
            height: 'pop_height',
            title: 'popup_add_title',
           
        }
    };

    //close button
    

    
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
    ////////////////////////////
    $scope.pop_width_education = 600;
    $scope.pop_height_education = 450;
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
    /////////////////////////////////
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
    /////////////////////////////
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
      //  height: $(window).height() - 175,

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
            dataSource: 'entity.Person.Courses',
            height: 'dg_height',
        }
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
    $scope.tempData = null;
    $scope.$on('InitViewPerson', function (event, prms) {


        $scope.tempData = null;

        if (!prms.Id) {

            $scope.isNew = true;
            $scope.popup_add_title = 'View';

        }

        else {

            $scope.popup_add_title = 'View';
            $scope.tempData = prms;
            $scope.isNew = false;
            //console.log(prms.NID);

        }

        $scope.popup_add_visible = true;

    });
    //////////////////////////////

}]);  