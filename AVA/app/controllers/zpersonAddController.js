'use strict';
app.controller('zpersonAddController', ['$scope', '$location', 'personService', 'zpersonService', 'authService', '$routeParams', '$rootScope','trnService','$window', function ($scope, $location, personService, zpersonService,authService, $routeParams, $rootScope,trnService,$window) {
	$scope.isNew = true;
  /*  $scope.IsEditable = $rootScope.roles.indexOf('Admin') != -1 || $rootScope.userName.toLowerCase() == 'i.zamani' || $rootScope.userName.toLowerCase() == 'dehghan'  || $rootScope.userName.toLowerCase() == 'khorshidi'
	|| $rootScope.userName.toLowerCase() == '1abbaspour1'
	|| $rootScope.userName.toLowerCase() == 'r.nasiri'
	|| $rootScope.userName.toLowerCase() == 'mohamadi'
	|| $rootScope.userName.toLowerCase() == 'demo'
	|| $rootScope.userName.toLowerCase() == 'training'
	;*/
	$scope.IsEditable = $rootScope.roles.indexOf('Admin') != -1 || $rootScope.userName.toLowerCase() == 'demo'
	|| $rootScope.roles.indexOf('Profiles-Ground-Edit')!=-1
	|| $rootScope.roles.indexOf('Profiles-Crew-Edit')!=-1;
	
	$scope.IsEditable = $rootScope.roles.indexOf('Admin') != -1 || $rootScope.userName.toLowerCase() == 'i.zamani' || $rootScope.userName.toLowerCase() == 'dehghan'  || $rootScope.userName.toLowerCase() == 'khorshidi'
	|| $rootScope.userName.toLowerCase() == '1abbaspour1'
	|| $rootScope.userName.toLowerCase() == 'r.nasiri'
	|| $rootScope.userName.toLowerCase() == 'mohamadi'
	|| $rootScope.userName.toLowerCase() == 'demo'
	|| $rootScope.roles.indexOf('Profiles-Ground-Edit')!=-1
	|| $rootScope.roles.indexOf('Profiles-Crew-Edit')!=-1
	|| $rootScope.roles.indexOf('BasePocket Admin')!=-1
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
        InActive:0,
        DateInactiveEnd:null,
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
            DateCaoCardIssue:null,
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
FMTIssueDate: null,
FMTExpireDate: null,
MELExpireDate: null,
MELIssueDate: null,
METIssueDate: null,
METExpireDate: null,
PERIssueDate: null,
PERExpireDate: null,

IssueDate1: null,
ExpireDate1: null,
IssueDate2: null,
ExpireDate2: null,
			//de-icing
IssueDate3: null,
ExpireDate3: null,
//drm-crm
IssueDate4: null,
ExpireDate4: null,

IssueDate5: null,
ExpireDate5: null,
IssueDate6: null,
ExpireDate6: null,
IssueDate7: null,
ExpireDate7: null,
IssueDate8: null,
ExpireDate8: null,
IssueDate9: null,
ExpireDate9: null,
IssueDate10: null,
ExpireDate10: null,
			
IssueDate11: null,
ExpireDate11: null,
	
	IssueDate12: null,
ExpireDate12: null,
	
	IssueDate13: null,
ExpireDate13: null,
	
	IssueDate14: null,
ExpireDate14: null,
	
IssueDate15: null,
ExpireDate15: null,
			
IssueDate16: null,
ExpireDate16: null,
			
IssueDate17: null,
ExpireDate17: null,
			
IssueDate18: null,
ExpireDate18: null,
			
IssueDate19: null,
ExpireDate19: null,
			
IssueDate20: null,
ExpireDate20: null,
			
IssueDate20: null,
ExpireDate20: null,
IssueDate21: null,
ExpireDate21: null,
IssueDate22: null,
ExpireDate22: null,
IssueDate23: null,
ExpireDate23: null,
IssueDate24: null,
ExpireDate24: null,
IssueDate25: null,
ExpireDate25: null,
IssueDate26: null,
ExpireDate26: null,
			IssueDate27: null,
ExpireDate27: null,
				
IssueDate28: null,
ExpireDate28: null,

IssueDate29: null,
ExpireDate29: null,

IssueDate30: null,
ExpireDate30: null,

IssueDate31: null,
ExpireDate31: null,

IssueDate32: null,
ExpireDate32: null,

IssueDate33: null,
ExpireDate33: null,

IssueDate34: null,
ExpireDate34: null,

IssueDate35: null,
ExpireDate35: null,

IssueDate36: null,
IssueDate37: null,
IssueDate38: null,
IssueDate39: null,
IssueDate40: null,
IssueDate41: null,
IssueDate42: null,
IssueDate43: null,
IssueDate44: null,
IssueDate45: null,
IssueDate46: null,
IssueDate47: null,
IssueDate48: null,
IssueDate49: null,
IssueDate50: null,

ExpireDate36: null,
ExpireDate37: null,
ExpireDate38: null,
ExpireDate39: null,
ExpireDate40: null,
ExpireDate41: null,
ExpireDate42: null,
ExpireDate43: null,
ExpireDate44: null,
ExpireDate45: null,
ExpireDate46: null,
ExpireDate47: null,
ExpireDate48: null,
ExpireDate49: null,
ExpireDate50: null,
IssueDateTRG02:null,
ExpireDateTRG02:null,


RouteCheckIssueDate:null,
RouteCheckExpireDate:null,


LOAD_CONTROL_ExpireDate:null,
LOAD_CONTROL_IssueDate:null,

PROFICIENCY_ASSESSMENT_IsuueDate:null,
PROFICIENCY_ASSESSMENT_ExpireDate:null,
MPIssueDate:null,
MPExpireDate:null,
CALRIssueDate:null,
CALRExpireDate:null,
SpecialApprovalIssueDate:null,
SpecialApprovalExpireDate:null,
TRG01IssueDate:null,
TRG01ExpireDate:null,
TRG07AIssueDate:null,
TRG07AExpireDate:null,

TRG16IssueDate:null,
TRG16ExpireDate:null,


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
        DateIssue: null,
        DateExpire:null,
        Documents:[],
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
        FileType:null,
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
        AircraftType:null,
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

        $scope.entityDocument.DateIssue = data.DateIssue;
        $scope.entityDocument.DateExpire = data.DateExpire;
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
        $scope.entityDocument.DateIssue = null;
        $scope.entityDocument.DateExpire = null;
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
        $scope.entity.BaseAirportId= null;
        $scope.entity.DateInactiveBegin= null;
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
        $scope.entity.Person.AircraftTypeId= null;
        $scope.entity.Person.DateTypeIssue= null;
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
$scope.entity.Person.FMTIssueDate = null;
$scope.entity.Person.FMTExpireDate = null;
$scope.entity.Person.MELExpireDate = null;
$scope.entity.Person.MELIssueDate = null;
$scope.entity.Person.METIssueDate = null;
$scope.entity.Person.METExpireDate = null;
$scope.entity.Person.PERIssueDate = null;
$scope.entity.Person.PERExpireDate = null;

$scope.entity.Person.IssueDate1 = null;
$scope.entity.Person.ExpireDate1 = null;
$scope.entity.Person.IssueDate2 = null;
$scope.entity.Person.ExpireDate2 = null;

$scope.entity.Person.IssueDate3 = null;
$scope.entity.Person.ExpireDate3 = null;

$scope.entity.Person.IssueDate4 = null;
$scope.entity.Person.ExpireDate4 = null;

$scope.entity.Person.IssueDate5 = null;
$scope.entity.Person.ExpireDate5 = null;

$scope.entity.Person.IssueDate6 = null;
$scope.entity.Person.ExpireDate6 = null;

$scope.entity.Person.IssueDate7 = null;
$scope.entity.Person.ExpireDate7 = null;

$scope.entity.Person.IssueDate8 = null;
$scope.entity.Person.ExpireDate8 = null;

$scope.entity.Person.IssueDate9 = null;
$scope.entity.Person.ExpireDate9 = null;

$scope.entity.Person.IssueDate10 = null;
$scope.entity.Person.ExpireDate10 = null;	

$scope.entity.Person.IssueDate10 = null;
$scope.entity.Person.ExpireDate10 = null;

$scope.entity.Person.IssueDate11 = null;
$scope.entity.Person.ExpireDate11 = null;

$scope.entity.Person.IssueDate12 = null;
$scope.entity.Person.ExpireDate12 = null;

$scope.entity.Person.IssueDate13 = null;
$scope.entity.Person.ExpireDate13 = null;

$scope.entity.Person.IssueDate14 = null;
$scope.entity.Person.ExpireDate14 = null;

$scope.entity.Person.IssueDate15 = null;
$scope.entity.Person.ExpireDate15 = null;

$scope.entity.Person.IssueDate16 = null;
$scope.entity.Person.ExpireDate16 = null;

$scope.entity.Person.IssueDate17 = null;
$scope.entity.Person.ExpireDate17 = null;

$scope.entity.Person.IssueDate18 = null;
$scope.entity.Person.ExpireDate18 = null;

$scope.entity.Person.IssueDate19 = null;
$scope.entity.Person.ExpireDate19 = null;

$scope.entity.Person.IssueDate20 = null;
$scope.entity.Person.ExpireDate20 = null;
		
$scope.entity.Person.IssueDate21 = null;
$scope.entity.Person.ExpireDate21 = null;

$scope.entity.Person.IssueDate22 = null;
$scope.entity.Person.ExpireDate22 = null;

$scope.entity.Person.IssueDate23 = null;
$scope.entity.Person.ExpireDate23 = null;

$scope.entity.Person.IssueDate24 = null;
$scope.entity.Person.ExpireDate24 = null;
		
$scope.entity.Person.IssueDate25 = null;
$scope.entity.Person.ExpireDate25 = null;

$scope.entity.Person.IssueDate26 = null;
$scope.entity.Person.ExpireDate26 = null;
		
$scope.entity.Person.IssueDate27 = null;
$scope.entity.Person.ExpireDate27 = null;

$scope.entity.Person.IssueDate28 = null;
$scope.entity.Person.IssueDate29 = null;
$scope.entity.Person.IssueDate30 = null;
$scope.entity.Person.IssueDate31 = null;
$scope.entity.Person.IssueDate32 = null;
$scope.entity.Person.IssueDate33 = null;
$scope.entity.Person.IssueDate34 = null;
$scope.entity.Person.IssueDate35 = null;

$scope.entity.Person.IssueDate36 = null;
$scope.entity.Person.IssueDate37 = null;
$scope.entity.Person.IssueDate38 = null;
$scope.entity.Person.IssueDate39 = null;
$scope.entity.Person.IssueDate40 = null;
$scope.entity.Person.IssueDate41 = null;
$scope.entity.Person.IssueDate42 = null;
$scope.entity.Person.IssueDate43 = null;
$scope.entity.Person.IssueDate44 = null;
$scope.entity.Person.IssueDate45 = null;
$scope.entity.Person.IssueDate46 = null;
$scope.entity.Person.IssueDate47 = null;
$scope.entity.Person.IssueDate48 = null;
$scope.entity.Person.IssueDate49 = null;
$scope.entity.Person.IssueDate50 = null;
$scope.entity.Person.IssueDateTRG02=null;


$scope.entity.Person.ExpireDate28 = null;
$scope.entity.Person.ExpireDate29 = null;
$scope.entity.Person.ExpireDate30 = null;
$scope.entity.Person.ExpireDate31 = null;
$scope.entity.Person.ExpireDate32 = null;
$scope.entity.Person.ExpireDate33 = null;
$scope.entity.Person.ExpireDate34 = null;
$scope.entity.Person.ExpireDate35 = null;

$scope.entity.Person.ExpireDate36 = null;
$scope.entity.Person.ExpireDate37 = null;
$scope.entity.Person.ExpireDate38 = null;
$scope.entity.Person.ExpireDate39 = null;
$scope.entity.Person.ExpireDate40 = null;
$scope.entity.Person.ExpireDate41 = null;
$scope.entity.Person.ExpireDate42 = null;
$scope.entity.Person.ExpireDate43 = null;
$scope.entity.Person.ExpireDate44 = null;
$scope.entity.Person.ExpireDate45 = null;
$scope.entity.Person.ExpireDate46 = null;
$scope.entity.Person.ExpireDate47 = null;
$scope.entity.Person.ExpireDate48 = null;
$scope.entity.Person.ExpireDate49 = null;
$scope.entity.Person.ExpireDate50 = null;
$scope.entity.Person.ExpireDateTRG02= null;

$scope.entity.Person. RouteCheckIssueDate= null;
$scope.entity.Person.RouteCheckExpireDate= null;


$scope.entity.Person.LOAD_CONTROL_ExpireDate= null;
$scope.entity.Person.LOAD_CONTROL_IssueDate= null;

$scope.entity.Person.PROFICIENCY_ASSESSMENT_IsuueDate= null;
$scope.entity.Person.PROFICIENCY_ASSESSMENT_ExpireDate= null;
$scope.entity.Person.MPIssueDate= null;
$scope.entity.Person.MPExpireDate= null;
$scope.entity.Person.CALRIssueDate= null;
$scope.entity.Person.CALRExpireDate= null;
$scope.entity.Person.SpecialApprovalIssueDate= null;
$scope.entity.Person.SpecialApprovalExpireDate= null;
$scope.entity.Person.TRG01IssueDate= null;
$scope.entity.Person.TRG01ExpireDate= null;

$scope.entity.Person.TRG07AIssueDate= null;
$scope.entity.Person.TRG07AExpireDate= null;

$scope.entity.Person.TRG16IssueDate= null;
$scope.entity.Person.TRG16ExpireDate= null;

			

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
		

$scope.entity.Person.LRCIssueDate = data.LRCIssueDate ;
$scope.entity.Person.LRCExpireDate = data.LRCExpireDate ;
$scope.entity.Person.RSPIssueDate = data.RSPIssueDate ;
$scope.entity.Person.RSPExpireDate = data.RSPExpireDate ;
$scope.entity.Person.CTUIssueDate = data.CTUIssueDate ;
$scope.entity.Person.CTUExpireDate = data.CTUExpireDate ;
$scope.entity.Person.SAIssueDate = data.SAIssueDate ;
$scope.entity.Person.SAExpireDate = data.SAExpireDate ;
$scope.entity.Person.HFIssueDate = data.HFIssueDate ;
$scope.entity.Person.HFExpireDate = data.HFExpireDate ;
$scope.entity.Person.ASDIssueDate = data.ASDIssueDate ;
$scope.entity.Person.ASDExpireDate = data.ASDExpireDate ;
$scope.entity.Person.GOMIssueDate = data.GOMIssueDate ;
$scope.entity.Person.GOMExpireDate = data.GOMExpireDate ;
$scope.entity.Person.ASFIssueDate = data.ASFIssueDate ;
$scope.entity.Person.ASFExpireDate = data.ASFExpireDate ;
$scope.entity.Person.CCIssueDate = data.CCIssueDate ;
$scope.entity.Person.CCExpireDate = data.CCExpireDate ;
$scope.entity.Person.ERPIssueDate = data.ERPIssueDate ;
$scope.entity.Person.ERPExpireDate = data.ERPExpireDate ;
$scope.entity.Person.MBIssueDate = data.MBIssueDate ;
$scope.entity.Person.MBExpireDate = data.MBExpireDate ;
$scope.entity.Person.PSIssueDate = data.PSIssueDate ;
$scope.entity.Person.PSExpireDate = data.PSExpireDate ;
$scope.entity.Person.ANNEXIssueDate = data.ANNEXIssueDate ;
$scope.entity.Person.ANNEXExpireDate = data.ANNEXExpireDate ;
$scope.entity.Person.DRMIssueDate = data.DRMIssueDate ;
$scope.entity.Person.DRMExpireDate = data.DRMExpireDate ;
$scope.entity.Person.FMTDIssueDate = data.FMTDIssueDate ;
$scope.entity.Person.FMTDExpireDate = data.FMTDExpireDate ;
$scope.entity.Person.FMTIssueDate = data.FMTIssueDate ;
$scope.entity.Person.FMTExpireDate = data.FMTExpireDate ;
$scope.entity.Person.MELExpireDate = data.MELExpireDate ;
$scope.entity.Person.MELIssueDate = data.MELIssueDate ;
$scope.entity.Person.METIssueDate = data.METIssueDate ;
$scope.entity.Person.METExpireDate = data.METExpireDate ;
$scope.entity.Person.PERIssueDate = data.PERIssueDate ;
$scope.entity.Person.PERExpireDate = data.PERExpireDate ;

$scope.entity.Person.IssueDate1 = data.IssueDate1 ;
$scope.entity.Person.ExpireDate1 = data.ExpireDate1 ;
$scope.entity.Person.IssueDate2 = data.IssueDate2 ;
$scope.entity.Person.ExpireDate2 = data.ExpireDate2 ;

$scope.entity.Person.IssueDate3 = data.IssueDate3 ;
$scope.entity.Person.ExpireDate3 = data.ExpireDate3 ;

$scope.entity.Person.IssueDate4 = data.IssueDate4 ;
$scope.entity.Person.ExpireDate4 = data.ExpireDate4 ;

$scope.entity.Person.IssueDate5 = data.IssueDate5 ;
$scope.entity.Person.ExpireDate5 = data.ExpireDate5 ;

$scope.entity.Person.IssueDate6 = data.IssueDate6 ;
$scope.entity.Person.ExpireDate6 = data.ExpireDate6 ;

$scope.entity.Person.IssueDate7 = data.IssueDate7 ;
$scope.entity.Person.ExpireDate7 = data.ExpireDate7 ;

$scope.entity.Person.IssueDate8 = data.IssueDate8 ;
$scope.entity.Person.ExpireDate8 = data.ExpireDate8 ;

$scope.entity.Person.IssueDate9 = data.IssueDate9 ;
$scope.entity.Person.ExpireDate9 = data.ExpireDate9 ;

$scope.entity.Person.IssueDate10 = data.IssueDate10 ;
$scope.entity.Person.ExpireDate10 = data.ExpireDate10 ;
		
$scope.entity.Person.IssueDate11 = data.IssueDate11 ;
$scope.entity.Person.ExpireDate11 = data.ExpireDate11 ;
		
$scope.entity.Person.IssueDate12 = data.IssueDate12 ;
$scope.entity.Person.ExpireDate12 = data.ExpireDate12 ;
		
$scope.entity.Person.IssueDate13 = data.IssueDate13 ;
$scope.entity.Person.ExpireDate13 = data.ExpireDate13 ;
		
$scope.entity.Person.IssueDate14 = data.IssueDate14 ;
$scope.entity.Person.ExpireDate14 = data.ExpireDate14 ;
		
$scope.entity.Person.IssueDate15 = data.IssueDate15 ;
$scope.entity.Person.ExpireDate15 = data.ExpireDate15 ;
		
$scope.entity.Person.IssueDate16 = data.IssueDate16 ;
$scope.entity.Person.ExpireDate16 = data.ExpireDate16 ;
		
$scope.entity.Person.IssueDate17 = data.IssueDate17 ;
$scope.entity.Person.ExpireDate17 = data.ExpireDate17 ;
		
$scope.entity.Person.IssueDate18 = data.IssueDate18 ;
$scope.entity.Person.ExpireDate18 = data.ExpireDate18 ;
		
$scope.entity.Person.IssueDate19 = data.IssueDate19 ;
$scope.entity.Person.ExpireDate19 = data.ExpireDate19 ;
		
$scope.entity.Person.IssueDate20 = data.IssueDate20 ;
$scope.entity.Person.ExpireDate20 = data.ExpireDate20 ;
		
$scope.entity.Person.IssueDate21 = data.IssueDate21 ;
$scope.entity.Person.ExpireDate21 = data.ExpireDate21 ;

$scope.entity.Person.IssueDate22 = data.IssueDate22 ;
$scope.entity.Person.ExpireDate22 = data.ExpireDate22 ;

$scope.entity.Person.IssueDate23 = data.IssueDate23 ;
$scope.entity.Person.ExpireDate23 = data.ExpireDate23 ;

$scope.entity.Person.IssueDate24 = data.IssueDate24 ;
$scope.entity.Person.ExpireDate24 = data.ExpireDate24 ;
		
$scope.entity.Person.IssueDate25 = data.IssueDate25 ;
$scope.entity.Person.ExpireDate25 = data.ExpireDate25 ;

$scope.entity.Person.IssueDate26 = data.IssueDate26 ;
$scope.entity.Person.ExpireDate26 = data.ExpireDate26 ;
$scope.entity.Person.IssueDate27 = data.IssueDate27 ;
$scope.entity.Person.ExpireDate27 = data.ExpireDate27 ;

$scope.entity.Person.IssueDate28 = data.IssueDate28 ;
$scope.entity.Person.IssueDate29 = data.IssueDate29 ;
$scope.entity.Person.IssueDate30 = data.IssueDate30 ;
$scope.entity.Person.IssueDate31 = data.IssueDate31 ;
$scope.entity.Person.IssueDate32 = data.IssueDate32 ;
$scope.entity.Person.IssueDate33 = data.IssueDate33 ;
$scope.entity.Person.IssueDate34 = data.IssueDate34 ;
$scope.entity.Person.IssueDate35 = data.IssueDate35 ;

$scope.entity.Person.IssueDate36 = data.IssueDate36 ;
$scope.entity.Person.IssueDate37 = data.IssueDate37 ;
$scope.entity.Person.IssueDate38 = data.IssueDate38 ;
$scope.entity.Person.IssueDate39 = data.IssueDate39 ;
$scope.entity.Person.IssueDate40 = data.IssueDate40 ;
$scope.entity.Person.IssueDate41 = data.IssueDate41 ;
$scope.entity.Person.IssueDate42 = data.IssueDate42 ;
$scope.entity.Person.IssueDate43 = data.IssueDate43 ;
$scope.entity.Person.IssueDate44 = data.IssueDate44 ;
$scope.entity.Person.IssueDate45 = data.IssueDate45 ;
$scope.entity.Person.IssueDate46 = data.IssueDate46 ;
$scope.entity.Person.IssueDate47 = data.IssueDate47 ;
$scope.entity.Person.IssueDate48 = data.IssueDate48 ;
$scope.entity.Person.IssueDate49 = data.IssueDate49 ;
$scope.entity.Person.IssueDate50 = data.IssueDate50 ;
$scope.entity.Person.IssueDateTRG02= data.IssueDateTRG02 ;

$scope.entity.Person.ExpireDate28 = data.ExpireDate28 ;
$scope.entity.Person.ExpireDate29 = data.ExpireDate29 ;
$scope.entity.Person.ExpireDate30 = data.ExpireDate30 ;
$scope.entity.Person.ExpireDate31 = data.ExpireDate31 ;
$scope.entity.Person.ExpireDate32 = data.ExpireDate32 ;
$scope.entity.Person.ExpireDate33 = data.ExpireDate33 ;
$scope.entity.Person.ExpireDate34 = data.ExpireDate34 ;
$scope.entity.Person.ExpireDate35 = data.ExpireDate35 ;

$scope.entity.Person.ExpireDate36 = data.ExpireDate36 ;
$scope.entity.Person.ExpireDate37 = data.ExpireDate37 ;
$scope.entity.Person.ExpireDate38 = data.ExpireDate38 ;
$scope.entity.Person.ExpireDate39 = data.ExpireDate39 ;
$scope.entity.Person.ExpireDate40 = data.ExpireDate40 ;
$scope.entity.Person.ExpireDate41 = data.ExpireDate41 ;
$scope.entity.Person.ExpireDate42 = data.ExpireDate42 ;
$scope.entity.Person.ExpireDate43 = data.ExpireDate43 ;
$scope.entity.Person.ExpireDate44 = data.ExpireDate44 ;
$scope.entity.Person.ExpireDate45 = data.ExpireDate45 ;
$scope.entity.Person.ExpireDate46 = data.ExpireDate46 ;
$scope.entity.Person.ExpireDate47 = data.ExpireDate47 ;
$scope.entity.Person.ExpireDate48 = data.ExpireDate48 ;
$scope.entity.Person.ExpireDate49 = data.ExpireDate49 ;
$scope.entity.Person.ExpireDate50 = data.ExpireDate50 ;
$scope.entity.Person.ExpireDateTRG02= data.ExpireDateTRG02 ;




$scope.entity.Person.RouteCheckIssueDate= data.RouteCheckIssueDate;
$scope.entity.Person.RouteCheckExpireDate= data.RouteCheckExpireDate;



$scope.entity.Person.LOAD_CONTROL_ExpireDate=data.LOAD_CONTROL_ExpireDate;
$scope.entity.Person.LOAD_CONTROL_IssueDate=data.LOAD_CONTROL_IssueDate;

$scope.entity.Person.PROFICIENCY_ASSESSMENT_IsuueDate= data.PROFICIENCY_ASSESSMENT_IsuueDate;
$scope.entity.Person.PROFICIENCY_ASSESSMENT_ExpireDate= data.PROFICIENCY_ASSESSMENT_ExpireDate;
$scope.entity.Person.MPIssueDate= data.MPIssueDate;
$scope.entity.Person.MPExpireDate= data.MPExpireDate;
$scope.entity.Person.CALRIssueDate= data.CALRIssueDate;
$scope.entity.Person.CALRExpireDate= data.CALRExpireDate;
$scope.entity.Person.SpecialApprovalIssueDate= data.SpecialApprovalIssueDate;
$scope.entity.Person.SpecialApprovalExpireDate= data.SpecialApprovalExpireDate;
$scope.entity.Person.TRG01IssueDate= data.TRG01IssueDate;
$scope.entity.Person.TRG01ExpireDate= data.TRG01ExpireDate;

$scope.entity.Person.TRG07AIssueDate= data.TRG07AIssueDate;
$scope.entity.Person.TRG07AExpireDate= data.TRG07AExpireDate;

$scope.entity.Person.TRG16IssueDate= data.TRG16IssueDate;
$scope.entity.Person.TRG16ExpireDate= data.TRG16ExpireDate;

        $scope.entity.Person.Educations = data.Educations;
        $scope.entity.Person.Expreienses = data.Expreienses;
        $scope.entity.Person.AircraftTypes = data.AircraftTypes;
        $scope.entity.Person.Documents = data.Documents;
        $.each($scope.entity.Person.Documents, function (_i, _d) {
            _d.Count = _d.Documents.length;
        });
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
        $scope.bindPersoncourses();
        //alert($scope.entity.Person.DateTypeIssue);


    };
    //////////////////////////////
  //nasiri
    $scope.formatDate = function (dt) {
        if (!dt)
            return "";
        return    moment(new Date(dt)).format("YYYY-MMM-DD");
    };
    $scope.doc_click = function(str) {
		//return;
        var list = $rootScope.getCertificateTypeList();
        var list2 = $rootScope.getCertificateTypeListDetails();
         
        if (list.indexOf(str) != -1) { 
		
            $scope.loadingVisible = true;
            var typ = Enumerable.From(list2).Where('$.title=="' + str + '"').FirstOrDefault();
            trnService.getCertificateObj($scope.entity.Person.PersonId, typ.type,str).then(function (response) {

                $scope.loadingVisible = false;
                var emp = response.Data.employee;

                var _caption = emp.Name + ', ' + (typ.caption ? typ.caption : typ.title)
                    + ', ' + 'ISSUE: ' + (typ.issue ? $scope.formatDate(emp[typ.issue]) : '')
                    + ', ' + 'EXPIRE: ' + (typ.expire ? $scope.formatDate( emp[typ.expire]):'');
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
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
     }
    $scope.showImage = function (item) {
		if (checkURLIsImage(item.url)){
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
        //{ text: "Education", id: 'education', visible_btn: false },
        //  { text: "حساب بانکی", id: 'account', visible_btn: false },
        //{ text: "Certificate", id: 'certificate', visible_btn: true },
        { text: "Document", id: 'file', visible_btn: false, visible_btn2: true },
       // { text: "Experience", id: 'experience', visible_btn: false, visible: $scope.isView },
       // { text: "Rating", id: 'rating', visible_btn: false, visible: $scope.isView },
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
    $scope.tab_file = false;
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


           
            
          //  $scope.btn_visible_education = newValue == 1;
            

            $scope.tab_file = newValue == 1;
           // $scope.btn_visible_experience = newValue == 3;
           // $scope.btn_visible_rating = newValue ==4;
            $scope.btn_visible_aircrafttype = newValue == 2;
        
          //  $scope.btn_visible_course = newValue == 7;

            

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
    //////////////////////////
    $scope.ds_doc_type = [];
    $scope.doc_selected = null;
    $scope.get_doc_class = function (id) {
        if ($scope.doc_selected == id)
            return "doc-box doc-box-selected";
        return "doc-box";
    }
    $scope.click_doc = function (id) {
        $scope.doc_selected = id;
        $scope.ds_doc_type = [];
        $scope.btn_visible_file = false;
        // alert($scope.doc_selected);
        switch (id) {
            case 'part1':
                $scope.btn_visible_file = true;
                $scope.btn_visible_crt = false;
                $scope.ds_doc_type = [
                    {
                        "Id": 46,
                        "Title": "Birth Certificate",
                        "ParentId": 44,
                        "IsSystem": true,
                        "OrderIndex": 2,
                        "Parent": "Document Type",
                        "CreatorId": null,
                        "Prop1": null
                    },
                    {
                        "Id": 47,
                        "Title": "National Card",
                        "ParentId": 44,
                        "IsSystem": true,
                        "OrderIndex": 3,
                        "Parent": "Document Type",
                        "CreatorId": null,
                        "Prop1": null
                    },
                    {
                        "Id": 48,
                        "Title": "Passport",
                        "ParentId": 44,
                        "IsSystem": true,
                        "OrderIndex": 4,
                        "Parent": "Document Type",
                        "CreatorId": null,
                        "Prop1": null
                    },
                    {
                        "Id": 1186,
                        "Title": "Crew Member Certificate",
                        "ParentId": 44,
                        "IsSystem": false,
                        "OrderIndex": 104,
                        "Parent": "Document Type",
                        "CreatorId": null,
                        "Prop1": null
                    },
                    {
                        "Id": 301050,
                        "Title": "Educational Doc.",
                        "ParentId": 44,
                        "IsSystem": false,
                        "OrderIndex": 105,
                        "Parent": "Document Type",
                        "CreatorId": null,
                        "Prop1": null
                    },

                ];
               
                break;
            case 'part9':
                $scope.btn_visible_file = true;
                $scope.btn_visible_crt = false;
                //Other Official Documents
                $scope.ds_doc_type = [
                    {
                        "Id": 1186,
                        "Title": "Crew Member Certificate",
                        "ParentId": 44,
                        "IsSystem": false,
                        "OrderIndex": 104,
                        "Parent": "Document Type",
                        "CreatorId": null,
                        "Prop1": null
                    },
                    {
                        "Id": 301051,
                        "Title": "Other Official Documents",
                        "ParentId": 44,
                        "IsSystem": false,
                        "OrderIndex": 104,
                        "Parent": "Document Type",
                        "CreatorId": null,
                        "Prop1": null
                    },
                ];
                break;
            case 'part3':
                $scope.btn_visible_file = true;
                $scope.btn_visible_crt = false;
                $scope.ds_doc_type = [
                    {
                        "Id": 49,
                        "Title": "Medical Record",
                        "ParentId": 44,
                        "IsSystem": true,
                        "OrderIndex": 5,
                        "Parent": "Document Type",
                        "CreatorId": null,
                        "Prop1": null
                    },
                ];
                break;
            case 'part4':
                $scope.btn_visible_file = true;
                $scope.btn_visible_crt = false;
                $scope.ds_doc_type = [
                    {
                        "Id": 301052,
                        "Title": "LogBook Record",
                        "ParentId": 44,
                        "IsSystem": true,
                        "OrderIndex": 5,
                        "Parent": "Document Type",
                        "CreatorId": null,
                        "Prop1": null
                    },
                ];
                break;
            case 'part2':
                $scope.btn_visible_file = true;
                $scope.btn_visible_crt = false;
                $scope.ds_doc_type = [
                    {
                        "Id": 1181,
                        "Title": "Flight Crew Licence",
                        "ParentId": 44,
                        "IsSystem": false,
                        "OrderIndex": 100,
                        "Parent": "Document Type",
                        "CreatorId": null,
                        "Prop1": null
                    },
                ];
                break;
            case 'part8':
                $scope.btn_visible_file = false;
                $scope.btn_visible_crt = true;
                $scope.dg_courses_instance.refresh();
                break;
            default:
                break;
        }
        var ids = Enumerable.From($scope.ds_doc_type).Select('$.Id').ToArray();
        $scope.ds_dg_file = Enumerable.From($scope.entity.Person.Documents).Where(function (x) { return ids.indexOf(x.DocumentTypeId) != -1; }).ToArray();
    }
    $scope.get_doc_style = function (id) {
        var color = '';
        switch (id) {
            case 'part1':
                color = '#ff8bfe';
                break;
            case 'part2':
                color = '#a5ff01';
                break;
            case 'part3':
                color = '#ddd';
                break;
            case 'part4':
                color = '#f7ed7e';
                break;
            case 'part5':
                color = '#b1ffff';
                break;
            case 'part6':
                color = '#ffff01';
                break;
            case 'part7':
                color = '#01ffff';
                break;
            case 'part8':
                color = '#01ffff';
                break;
            case 'part9':
                color = '#ff0823';
                break;

            default:
                color = '#eee';
                break;
        }
        if (id == $scope.doc_selected)
            return {
                'border-color': color,
                'background':color
            };
        return {
            'border-color':color
        };
    }
    $scope.get_content_style = function () {
        var id = $scope.doc_selected;
        var color = '';
        switch (id) {
            case 'part1':
                color = '#ff8bfe';
                break;
            case 'part2':
                color = '#a5ff01';
                break;
            case 'part3':
                color = '#ddd';
                break;
            case 'part4':
                color = '#f7ed7e';
                break;
            case 'part5':
                color = '#b1ffff';
                break;
            case 'part6':
                color = '#ffff01';
                break;
            case 'part7':
                color = '#01ffff';
                break;
            case 'part8':
                color = '#01ffff';
                break;
            case 'part9':
                color = '#ff0823';
                break;

            default:
                color = '#eee';
                break;
        }
        
        return {
            'border-color': color
        };
    }
    $scope.is_dg_file_visible = function () {
        var visible = ['part1', 'part2', 'part3', 'part4', 'part5', 'part6', 'part7','part9'];
        return visible.indexOf($scope.doc_selected) != -1;
    }
    $scope.is_dg_courses_visible = function () {
        var visible = ['part8'];
        return visible.indexOf($scope.doc_selected) != -1;
    }
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
        if (newValue && newValue.length == 10 ) {
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
        text:'LPC',
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
	  $scope.txt_examiner = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.Phone2',
            readOnly: 'IsMainDisabled',
        }
    };
	 $scope.txt_fstd1 = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.EmailPassword',
            readOnly: 'IsMainDisabled',
        }
    };
	 $scope.txt_fstd2 = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'entity.Person.FaxTelNumber',
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
        readOnly:true,
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
        height:60,
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
        dataSource: [1,2,3,4,5,6],
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
           // $scope.entity.Person.SEPTExpireDate = (new Date(e.value)).addYears(1);
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
          //  $scope.entity.Person.SEPTPExpireDate = (new Date(e.value)).addYears(3);
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
    //TRAINING
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
         //   $scope.entity.Person.DangerousGoodsExpireDate = (new Date(e.value)).addYears(2);
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
               // $scope.entity.Person.CCRMExpireDate = (new Date(e.value)).addYears(3);
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
          //  $scope.entity.Person.CRMExpireDate = (new Date(e.value)).addYears(1);
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
			var y=3;
			if ($scope.group_root=='100' || $scope.group_root=='200' || $scope.group_root=='500' || $scope.group_root=='400' || $scope.group_root=='300' || $scope.group_root=='002')
				y=2;
          //  if ($scope.group_root != null)
			//	$scope.entity.Person.SMSExpireDate = (new Date(e.value)).addYears(y);
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
          //  $scope.entity.Person.TypeMDExpireDate = (new Date(e.value)).addYears(1);
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
           // $scope.entity.Person.TypeAirbusExpireDate = (new Date(e.value)).addYears(2);
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
            if (!($scope.isNew || !$scope.entity.Person.LineExpireDate))
                 return;
            if (!e.value) {
                $scope.entity.Person.LineExpireDate = null;
                return;
            }
           // $scope.entity.Person.LineExpireDate = (new Date(e.value)).addYears(1);
        },
        bindingOptions: {
            value: 'entity.Person.LineIssueDate',
            readOnly: 'IsMainDisabled',
           
        }
    };
    
    $scope.date_LineExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.LineExpireDate',
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
         //   $scope.entity.Person.Type737ExpireDate = (new Date(e.value)).addYears(1);
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
         //   $scope.entity.Person.FirstAidExpireDate = (new Date(e.value)).addYears(1);
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
			var y=3;
			if ($scope.group_root=='100' || $scope.group_root=='200' || $scope.group_root=='400' || $scope.group_root=='500' || $scope.group_root=='300')
				y=2;
          //  $scope.entity.Person.AviationSecurityExpireDate = (new Date(e.value)).addYears(y);
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
          //  $scope.entity.Person.LineExpireDate = (new Date(e.value)).addYears(3);
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
  


  
   $scope.date_EGPWSIssueDate  = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function(e) {
           
            if (!e.value) {
                $scope.entity.Person.EGPWSExpireDate = null;
                return;
            }
        
			//if ($scope.isNew || !$scope.entity.Person.EGPWSExpireDate)
                   //   $scope.entity.Person.EGPWSExpireDate = (new Date(e.value)).addYears(2);
			
        },
        bindingOptions: {
            value: 'entity.Person.EGPWSIssueDate',
            readOnly: 'IsMainDisabled',
            disabled: 'IsCerDisabled',
        }
    };
	 $scope.date_EGPWSExpireDate  = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        
        bindingOptions: {
            value: 'entity.Person.EGPWSExpireDate',
            readOnly: 'IsMainDisabled',
            disabled: 'IsCerDisabled',
        }
    };
	
	
	   $scope.date_EGPWSIssueDate_x = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function(e) {
           
            if (!e.value) {
                $scope.entity.Person.FMTExpireDate = null;
                return;
            }
        
			//if ($scope.isNew || !$scope.entity.Person.EGPWSExpireDate)
                   //   $scope.entity.Person.EGPWSExpireDate = (new Date(e.value)).addYears(2);
			
        },
        bindingOptions: {
            value: 'entity.Person.FMTIssueDate',
            readOnly: 'IsMainDisabled',
            disabled: 'IsCerDisabled',
        }
    };
    
    $scope.date_EGPWSExpireDate_x = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        
        bindingOptions: {
            value: 'entity.Person.FMTExpireDate',
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
           // $scope.entity.Person.UpsetRecoveryTrainingExpireDate = (new Date(e.value)).addYears(1);
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
            //$scope.entity.Person.ColdWeatherOperationExpireDate = (new Date(e.value)).addYears(1);
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
            //$scope.entity.Person.HotWeatherOperationExpireDate = (new Date(e.value)).addYears(1);
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
            disabled:'LPRDisabled',
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
			//if ($scope.isNew || !$scope.entity.Person.DateNextCheckUP)
           // $scope.entity.Person.DateNextCheckUP = (new Date(e.value)).addYears(1);
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
        onValueChanged:function(e){
            
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
			//if ($scope.isNew || !$scope.entity.Person.DateTypeExpire)
           // $scope.entity.Person.DateTypeExpire = (new Date(e.value)).addYears(1);
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
            //$scope.entity.Person.RecurrentExpireDate = (new Date(e.value)).addYears(1);
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
	
	$scope.isGroupReadOnly=true;
	$scope.selectedDep = null;
	$scope.selectedDepObj = null;
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

            $scope.selectedDep = e.selectedItem ? e.selectedItem.Title  : '';
			   $scope.selectedDepObj = e.selectedItem ? e.selectedItem  : null;
            $scope.isGroupReadOnly= e.selectedItem?false:true;
			if ( e.selectedItem) {
				console.log(e.selectedItem.Remark);
				if (e.selectedItem.Remark == '4000')
					$scope.group_ds=Enumerable.From($scope.ds_allgroups).Where(function(x){ return x.Remark && x.Remark.startsWith(e.selectedItem.Remark) || x.Remark == '004';}).OrderBy('$.Remark').ToArray();		
				else
					$scope.group_ds=Enumerable.From($scope.ds_allgroups).Where(function(x){ return x.Remark && x.Remark.startsWith(e.selectedItem.Remark);}).OrderBy('$.Remark').ToArray();	
			}
			/*$scope.group_ds={
                store: {
                    type: "odata",
                    url: $rootScope.serviceUrl + 'odata/base/jobgroups/'+ Config.CustomerId,
                  
                     version: 4,
                   
                },
                 filter: ['Remark', 'startswith', e.selectedItem.Remark],
                sort: ['Remark'],

            };*/
		    	
			else
				$scope.group_ds=null;
			
			// $scope.groupIns.reset();
			// $scope.groupIns2.reset();

        },
        bindingOptions: {
            value: 'entity.Locations[0].LocationId',
            readOnly: 'IsMainDisabled',
        }

    };
	$scope.group_ds=null;
	$scope.groupIns=null;
	$scope.group_title=null;
	$scope.group_fulltitle=null;
	$scope.group_root=null;
	$scope.group_manager=null;
	$scope.parent_code=null;
	//2024-01-06
    $scope.sb_group = {
        showClearButton: true,
        searchEnabled: true,
        //dataSource: $rootScope.getDatasourceGroups(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateGroup(data);
        },
		onInitialized:function(e){
			if (!$scope.groupIns)
				$scope.groupIns=e.component;
		},
		onSelectionChanged:function(e){
			if (!e.selectedItem)
			{
				 $scope.group_title=null;
				$scope.group_root=null;
				$scope.parent_code=null;
				$scope.group_fulltitle=null;
				$scope.group_manager=null;
				 return;
			}
			console.log('onSelection',e);
			$scope.group_title=e.selectedItem.Title;
			$scope.group_root=e.selectedItem.RootCode;
			$scope.parent_code=e.selectedItem.ParentCode;
			$scope.group_fulltitle=e.selectedItem.TitleFormated;
			$scope.group_manager=$scope.group_fulltitle.toLowerCase().includes('manager');
			$scope.post_visible=$scope.post_titles.indexOf($scope.post_title)!=-1 || $scope.post_manager || $scope.group_manager;
			console.log('ROOT ROOT',$scope.group_title);
			
		},
        //displayExpr: "TitleFormated",
		displayExpr: "TitleFormated",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.GroupId',
            readOnly: 'isGroupReadOnly',
			dataSource:'group_ds'
        }
    };
	
	$scope.post_visible=false;
	$scope.post_title=null;
	$scope.post_fulltitle=null;
	$scope.post_code=null;
	$scope.post_id=null;
	$scope.post_manager=false;
	$scope.post_titles=['safety auditor','safety officer'];
	$scope.groupIns2=null;
    $scope.sb_group2 = {
        showClearButton: true,
        searchEnabled: true,
        //dataSource: $rootScope.getDatasourceGroups(),
        itemTemplate: function (data) {
            return $rootScope.getSbTemplateGroup(data);
        },
		onInitialized:function(e){
			
			if (!$scope.groupIns2)
				$scope.groupIns2=e.component;
		},
		onSelectionChanged:function(e){
			if (!e.selectedItem)
			{
				$scope.post_title=null;
	            $scope.post_code=null;
	            $scope.post_id=null;
				$scope.post_visible=false;
				$scope.post_fulltitle=null;
				$scope.post_manager=false;
				//TitleFormated
				 return;
			}
			$scope.post_id=e.selectedItem.Id;
			$scope.post_title=e.selectedItem.Title?e.selectedItem.Title.toLowerCase():null;
			$scope.post_code=e.selectedItem.Remark;
			$scope.post_fulltitle=e.selectedItem.TitleFormated;
			$scope.post_manager=$scope.post_fulltitle.toLowerCase().includes('manager');
				//TitleFormated
			$scope.post_visible=$scope.post_titles.indexOf($scope.post_title)!=-1 || $scope.post_manager || $scope.group_manager;
		},
        displayExpr: "TitleFormated",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'entity.Person.IntervalNDT',
            readOnly: 'isGroupReadOnly',
			dataSource:'group_ds'
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
        //dataSource: $rootScope.getDatasourceOption(44),
        displayExpr: "Title",
        valueExpr: 'Id',
        
        onSelectionChanged: function (e) {

            $scope.entityDocument.DocumentType = e.selectedItem ? e.selectedItem.Title : null;
            


        },
        bindingOptions: {
            dataSource: 'ds_doc_type',
            value: 'entityDocument.DocumentTypeId',
        }
    };
    $scope.date_issue_doc = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entityDocument.DateIssue',

        }
    };
    $scope.date_expire_doc = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'entityDocument.DateExpire',

        }
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
        searchExpr: ['Type','Manufacturer'],
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
            $scope.img_url = $rootScope.clientsFilesUrl+ $scope.uploadedFileImage;

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
            var item = { Id:id,Title: e.request.responseText, FileUrl: e.request.responseText };
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
    $scope.dg_height = 153;
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
                widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Add', width: 120, icon: 'plus', validationGroup: 'educationadd', onClick: function (e) {

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
            { widget: 'dxButton', location: 'before', options: { type: 'default', text: 'Edit', width: 120, icon: 'edit', validationGroup: 'certificateadd', bindingOptions: { visible: 'btn_visible_certificate', disabled: 'IsMainDisabled' }}, toolbar: 'bottom' },
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

            ///lllll
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
            ////certificates
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Add Certificate', width: 190, icon: 'plus', validationGroup: 'certificateadd', bindingOptions: { visible: 'btn_visible_crt', disabled: 'IsMainDisabled' }, onClick: function (e) {
                       // alert('x');
                        $scope.popup_cer_visible = true;
                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'before', options: {
                    type: 'default', text: 'Delete', width: 120, icon: 'clear', validationGroup: 'certificateadd', bindingOptions: { visible: 'btn_visible_crt', disabled: 'IsMainDisabled' }, onClick: function (e) {
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
            $scope.pop_width = size.width - 30;
            if ($scope.pop_width > 1400)
                $scope.pop_width = 1400;
            $scope.pop_height = $(window).height() - 30;
            $scope.dg_height = $scope.pop_height - 153;
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
            'toolbarItems[3].visible':'btn_visible_certificate',
            'toolbarItems[4].visible':'btn_visible_certificate',
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

            'toolbarItems[18].visible': 'btn_visible_crt',
            'toolbarItems[19].visible': 'btn_visible_crt',

            'toolbarItems[20].visible': 'IsEditable',
        }
    };

    
    //$scope.popup_add.toolbarItems[18].options.onClick = function (e) {

    //}


    //close button
    $scope.popup_add.toolbarItems[21].options.onClick = function (e) {


        $scope.popup_add_visible = false;
    };
    //save button
    $scope.popup_add.toolbarItems[20].options.onClick = function (e) {
       
		
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
		
		
		
		
		if ($scope.entity.Person.FMTIssueDate)
            $scope.entity.Person.FMTIssueDate = (new Date($scope.entity.Person.FMTIssueDate)).addMinutes(offset);
		
 
		  if ($scope.entity.Person.FMTExpireDate)
            $scope.entity.Person.FMTExpireDate = (new Date($scope.entity.Person.FMTExpireDate)).addMinutes(offset);
		
 
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
		
 
		  if ($scope.entity.Person.PERExpireDate)
            $scope.entity.Person.PERExpireDate = (new Date($scope.entity.Person.PERExpireDate)).addMinutes(offset);
		
		
		 
		 
		 
		
 if ($scope.entity.Person.IssueDate1)
            $scope.entity.Person.IssueDate1 = (new Date($scope.entity.Person.IssueDate1)).addMinutes(offset);
		
		 if ($scope.entity.Person.IssueDate2)
            $scope.entity.Person.IssueDate2 = (new Date($scope.entity.Person.IssueDate2)).addMinutes(offset);
		

		if ($scope.entity.Person.IssueDate3)
            $scope.entity.Person.IssueDate3 = (new Date($scope.entity.Person.IssueDate3)).addMinutes(offset);
		
		if ($scope.entity.Person.IssueDate4)
            $scope.entity.Person.IssueDate4 = (new Date($scope.entity.Person.IssueDate4)).addMinutes(offset);
		
		if ($scope.entity.Person.IssueDate5)
            $scope.entity.Person.IssueDate5 = (new Date($scope.entity.Person.IssueDate5)).addMinutes(offset);
		
		if ($scope.entity.Person.IssueDate6)
            $scope.entity.Person.IssueDate6 = (new Date($scope.entity.Person.IssueDate6)).addMinutes(offset);
		
		if ($scope.entity.Person.IssueDate7)
            $scope.entity.Person.IssueDate7 = (new Date($scope.entity.Person.IssueDate7)).addMinutes(offset);
		
		if ($scope.entity.Person.IssueDate8)
            $scope.entity.Person.IssueDate8 = (new Date($scope.entity.Person.IssueDate8)).addMinutes(offset);
		
		if ($scope.entity.Person.IssueDate9)
            $scope.entity.Person.IssueDate9 = (new Date($scope.entity.Person.IssueDate9)).addMinutes(offset);
		
		if ($scope.entity.Person.IssueDate10)
            $scope.entity.Person.IssueDate10 = (new Date($scope.entity.Person.IssueDate10)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate11)
            $scope.entity.Person.IssueDate11 = (new Date($scope.entity.Person.IssueDate11)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate12)
            $scope.entity.Person.IssueDate12 = (new Date($scope.entity.Person.IssueDate12)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate13)
            $scope.entity.Person.IssueDate13 = (new Date($scope.entity.Person.IssueDate13)).addMinutes(offset);
if ($scope.entity.Person.IssueDate14)
            $scope.entity.Person.IssueDate14 = (new Date($scope.entity.Person.IssueDate14)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate15)
            $scope.entity.Person.IssueDate15 = (new Date($scope.entity.Person.IssueDate15)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate16)
            $scope.entity.Person.IssueDate16 = (new Date($scope.entity.Person.IssueDate16)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate17)
            $scope.entity.Person.IssueDate17 = (new Date($scope.entity.Person.IssueDate17)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate18)
            $scope.entity.Person.IssueDate18 = (new Date($scope.entity.Person.IssueDate18)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate19)
            $scope.entity.Person.IssueDate19 = (new Date($scope.entity.Person.IssueDate19)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate20)
            $scope.entity.Person.IssueDate20 = (new Date($scope.entity.Person.IssueDate20)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate21)
            $scope.entity.Person.IssueDate21 = (new Date($scope.entity.Person.IssueDate21)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate22)
            $scope.entity.Person.IssueDate22 = (new Date($scope.entity.Person.IssueDate22)).addMinutes(offset);
if ($scope.entity.Person.IssueDate23)
            $scope.entity.Person.IssueDate23 = (new Date($scope.entity.Person.IssueDate23)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate24)
            $scope.entity.Person.IssueDate24 = (new Date($scope.entity.Person.IssueDate24)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate25)
            $scope.entity.Person.IssueDate25 = (new Date($scope.entity.Person.IssueDate25)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate26)
            $scope.entity.Person.IssueDate26 = (new Date($scope.entity.Person.IssueDate26)).addMinutes(offset);
		 if ($scope.entity.Person.IssueDate27)
            $scope.entity.Person.IssueDate27 = (new Date($scope.entity.Person.IssueDate27)).addMinutes(offset);
		 if ($scope.entity.Person.ExpireDate1)
            $scope.entity.Person.ExpireDate1 = (new Date($scope.entity.Person.ExpireDate1)).addMinutes(offset);
		 if ($scope.entity.Person.ExpireDate2)
            $scope.entity.Person.ExpireDate2 = (new Date($scope.entity.Person.ExpireDate2)).addMinutes(offset);
		
		 if ($scope.entity.Person.ExpireDate3)
            $scope.entity.Person.ExpireDate3 = (new Date($scope.entity.Person.ExpireDate3)).addMinutes(offset);
		
		 if ($scope.entity.Person.ExpireDate4)
            $scope.entity.Person.ExpireDate4 = (new Date($scope.entity.Person.ExpireDate4)).addMinutes(offset);
		
		 if ($scope.entity.Person.ExpireDate5)
            $scope.entity.Person.ExpireDate5 = (new Date($scope.entity.Person.ExpireDate5)).addMinutes(offset);
		
		 if ($scope.entity.Person.ExpireDate6)
            $scope.entity.Person.ExpireDate6 = (new Date($scope.entity.Person.ExpireDate6)).addMinutes(offset);
		
		 if ($scope.entity.Person.ExpireDate7)
            $scope.entity.Person.ExpireDate7 = (new Date($scope.entity.Person.ExpireDate7)).addMinutes(offset);
		
		 if ($scope.entity.Person.ExpireDate8)
            $scope.entity.Person.ExpireDate8 = (new Date($scope.entity.Person.ExpireDate8)).addMinutes(offset);
		
		 if ($scope.entity.Person.ExpireDate9)
            $scope.entity.Person.ExpireDate9 = (new Date($scope.entity.Person.ExpireDate9)).addMinutes(offset);
		
		 if ($scope.entity.Person.ExpireDate10)
            $scope.entity.Person.ExpireDate10 = (new Date($scope.entity.Person.ExpireDate10)).addMinutes(offset);
		 if ($scope.entity.Person.ExpireDate11)
            $scope.entity.Person.ExpireDate11 = (new Date($scope.entity.Person.ExpireDate11)).addMinutes(offset);
		 if ($scope.entity.Person.ExpireDate12)
            $scope.entity.Person.ExpireDate12 = (new Date($scope.entity.Person.ExpireDate12)).addMinutes(offset);
		 if ($scope.entity.Person.ExpireDate13)
            $scope.entity.Person.ExpireDate13 = (new Date($scope.entity.Person.ExpireDate13)).addMinutes(offset);
 if ($scope.entity.Person.ExpireDate14)
            $scope.entity.Person.ExpireDate14 = (new Date($scope.entity.Person.ExpireDate14)).addMinutes(offset);
 if ($scope.entity.Person.ExpireDate15)
            $scope.entity.Person.ExpireDate15 = (new Date($scope.entity.Person.ExpireDate15)).addMinutes(offset);
 if ($scope.entity.Person.ExpireDate16)
            $scope.entity.Person.ExpireDate16 = (new Date($scope.entity.Person.ExpireDate16)).addMinutes(offset);
		 if ($scope.entity.Person.ExpireDate17)
            $scope.entity.Person.ExpireDate17 = (new Date($scope.entity.Person.ExpireDate17)).addMinutes(offset);
 if ($scope.entity.Person.ExpireDate18)
            $scope.entity.Person.ExpireDate18 = (new Date($scope.entity.Person.ExpireDate18)).addMinutes(offset);
		 if ($scope.entity.Person.ExpireDate19)
            $scope.entity.Person.ExpireDate19 = (new Date($scope.entity.Person.ExpireDate19)).addMinutes(offset);
		 if ($scope.entity.Person.ExpireDate20)
            $scope.entity.Person.ExpireDate20 = (new Date($scope.entity.Person.ExpireDate20)).addMinutes(offset);
		 if ($scope.entity.Person.ExpireDate21)
            $scope.entity.Person.ExpireDate21 = (new Date($scope.entity.Person.ExpireDate21)).addMinutes(offset);
 if ($scope.entity.Person.ExpireDate22)
            $scope.entity.Person.ExpireDate22 = (new Date($scope.entity.Person.ExpireDate22)).addMinutes(offset);
		 if ($scope.entity.Person.ExpireDate23)
            $scope.entity.Person.ExpireDate23 = (new Date($scope.entity.Person.ExpireDate23)).addMinutes(offset);
		 if ($scope.entity.Person.ExpireDate24)
            $scope.entity.Person.ExpireDate24 = (new Date($scope.entity.Person.ExpireDate24)).addMinutes(offset);
		 if ($scope.entity.Person.ExpireDate25)
            $scope.entity.Person.ExpireDate25 = (new Date($scope.entity.Person.ExpireDate25)).addMinutes(offset);
 if ($scope.entity.Person.ExpireDate26)
            $scope.entity.Person.ExpireDate26 = (new Date($scope.entity.Person.ExpireDate26)).addMinutes(offset);
		 if ($scope.entity.Person.ExpireDate27)
            $scope.entity.Person.ExpireDate27 = (new Date($scope.entity.Person.ExpireDate27)).addMinutes(offset);
		
		
		if ($scope.entity.Person.ExpireDate28)
            $scope.entity.Person.ExpireDate28 = (new Date($scope.entity.Person.ExpireDate28)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate29)
            $scope.entity.Person.ExpireDate29 = (new Date($scope.entity.Person.ExpireDate29)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate30)
            $scope.entity.Person.ExpireDate30 = (new Date($scope.entity.Person.ExpireDate30)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate31)
            $scope.entity.Person.ExpireDate31 = (new Date($scope.entity.Person.ExpireDate31)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate32)
            $scope.entity.Person.ExpireDate32 = (new Date($scope.entity.Person.ExpireDate32)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate33)
            $scope.entity.Person.ExpireDate33 = (new Date($scope.entity.Person.ExpireDate33)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate34)
            $scope.entity.Person.ExpireDate34 = (new Date($scope.entity.Person.ExpireDate34)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate35)
            $scope.entity.Person.ExpireDate35 = (new Date($scope.entity.Person.ExpireDate35)).addMinutes(offset);
		
		if ($scope.entity.Person.ExpireDate36)
            $scope.entity.Person.ExpireDate36 = (new Date($scope.entity.Person.ExpireDate36)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate37)
            $scope.entity.Person.ExpireDate37 = (new Date($scope.entity.Person.ExpireDate37)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate38)
            $scope.entity.Person.ExpireDate38 = (new Date($scope.entity.Person.ExpireDate38)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate39)
            $scope.entity.Person.ExpireDate39 = (new Date($scope.entity.Person.ExpireDate39)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate40)
            $scope.entity.Person.ExpireDate40 = (new Date($scope.entity.Person.ExpireDate40)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate41)
            $scope.entity.Person.ExpireDate41 = (new Date($scope.entity.Person.ExpireDate41)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate42)
            $scope.entity.Person.ExpireDate42 = (new Date($scope.entity.Person.ExpireDate42)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate43)
            $scope.entity.Person.ExpireDate43 = (new Date($scope.entity.Person.ExpireDate43)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate44)
            $scope.entity.Person.ExpireDate44 = (new Date($scope.entity.Person.ExpireDate44)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate45)
            $scope.entity.Person.ExpireDate45 = (new Date($scope.entity.Person.ExpireDate45)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate46)
            $scope.entity.Person.ExpireDate46 = (new Date($scope.entity.Person.ExpireDate46)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate47)
            $scope.entity.Person.ExpireDate47 = (new Date($scope.entity.Person.ExpireDate47)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate48)
            $scope.entity.Person.ExpireDate48 = (new Date($scope.entity.Person.ExpireDate48)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate49)
            $scope.entity.Person.ExpireDate49 = (new Date($scope.entity.Person.ExpireDate49)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDate50)
            $scope.entity.Person.ExpireDate50 = (new Date($scope.entity.Person.ExpireDate50)).addMinutes(offset);
		if ($scope.entity.Person.ExpireDateTRG02)
            $scope.entity.Person.ExpireDateTRG02 = (new Date($scope.entity.Person.ExpireDateTRG02)).addMinutes(offset);
		
		
		 if ($scope.entity.Person.IssueDate28)
            $scope.entity.Person.IssueDate28 = (new Date($scope.entity.Person.IssueDate28)).addMinutes(offset);
		 if ($scope.entity.Person.IssueDate29)
            $scope.entity.Person.IssueDate29 = (new Date($scope.entity.Person.IssueDate29)).addMinutes(offset);
		 if ($scope.entity.Person.IssueDate30)
            $scope.entity.Person.IssueDate30 = (new Date($scope.entity.Person.IssueDate30)).addMinutes(offset);
		 if ($scope.entity.Person.IssueDate31)
            $scope.entity.Person.IssueDate31 = (new Date($scope.entity.Person.IssueDate31)).addMinutes(offset);
		 if ($scope.entity.Person.IssueDate32)
            $scope.entity.Person.IssueDate32 = (new Date($scope.entity.Person.IssueDate32)).addMinutes(offset);
		 if ($scope.entity.Person.IssueDate33)
            $scope.entity.Person.IssueDate33 = (new Date($scope.entity.Person.IssueDate33)).addMinutes(offset);
		 if ($scope.entity.Person.IssueDate34)
            $scope.entity.Person.IssueDate34 = (new Date($scope.entity.Person.IssueDate34)).addMinutes(offset);
		 if ($scope.entity.Person.IssueDate35)
            $scope.entity.Person.IssueDate35 = (new Date($scope.entity.Person.IssueDate35)).addMinutes(offset);
		
		if ($scope.entity.Person.IssueDate36)
            $scope.entity.Person.IssueDate36 = (new Date($scope.entity.Person.IssueDate36)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate37)
            $scope.entity.Person.IssueDate37 = (new Date($scope.entity.Person.IssueDate37)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate38)
            $scope.entity.Person.IssueDate38 = (new Date($scope.entity.Person.IssueDate38)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate39)
            $scope.entity.Person.IssueDate39 = (new Date($scope.entity.Person.IssueDate39)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate40)
            $scope.entity.Person.IssueDate40 = (new Date($scope.entity.Person.IssueDate40)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate41)
            $scope.entity.Person.IssueDate41 = (new Date($scope.entity.Person.IssueDate41)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate42)
            $scope.entity.Person.IssueDate42 = (new Date($scope.entity.Person.IssueDate42)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate43)
            $scope.entity.Person.IssueDate43 = (new Date($scope.entity.Person.IssueDate43)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate44)
            $scope.entity.Person.IssueDate44 = (new Date($scope.entity.Person.IssueDate44)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate45)
            $scope.entity.Person.IssueDate45 = (new Date($scope.entity.Person.IssueDate45)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate46)
            $scope.entity.Person.IssueDate46 = (new Date($scope.entity.Person.IssueDate46)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate47)
            $scope.entity.Person.IssueDate47 = (new Date($scope.entity.Person.IssueDate47)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate48)
            $scope.entity.Person.IssueDate48 = (new Date($scope.entity.Person.IssueDate48)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate49)
            $scope.entity.Person.IssueDate49 = (new Date($scope.entity.Person.IssueDate49)).addMinutes(offset);
		if ($scope.entity.Person.IssueDate50)
            $scope.entity.Person.IssueDate50 = (new Date($scope.entity.Person.IssueDate50)).addMinutes(offset);
		
			if ($scope.entity.Person.IssueDateTRG02)
            $scope.entity.Person.IssueDateTRG02 = (new Date($scope.entity.Person.IssueDateTRG02)).addMinutes(offset);
		
		
			if ($scope.entity.Person.RouteCheckIssueDate)
            $scope.entity.Person.RouteCheckIssueDate = (new Date($scope.entity.Person.RouteCheckIssueDate)).addMinutes(offset);
		

	if ($scope.entity.Person.RouteCheckExpireDate)
            $scope.entity.Person.RouteCheckExpireDate = (new Date($scope.entity.Person.RouteCheckExpireDate)).addMinutes(offset);
		
		
		
		
			if ($scope.entity.Person.LOAD_CONTROL_IssueDate)
            $scope.entity.Person.LOAD_CONTROL_IssueDate = (new Date($scope.entity.Person.LOAD_CONTROL_IssueDate)).addMinutes(offset);
		

	if ($scope.entity.Person.LOAD_CONTROL_ExpireDate)
            $scope.entity.Person.LOAD_CONTROL_ExpireDate = (new Date($scope.entity.Person.LOAD_CONTROL_ExpireDate)).addMinutes(offset);
		
		
		
		

	if ($scope.entity.Person.PROFICIENCY_ASSESSMENT_IsuueDate)
            $scope.entity.Person.PROFICIENCY_ASSESSMENT_IsuueDate = (new Date($scope.entity.Person.PROFICIENCY_ASSESSMENT_IsuueDate)).addMinutes(offset);
		

	if ($scope.entity.Person.PROFICIENCY_ASSESSMENT_ExpireDate)
            $scope.entity.Person.PROFICIENCY_ASSESSMENT_ExpireDate = (new Date($scope.entity.Person.PROFICIENCY_ASSESSMENT_ExpireDate)).addMinutes(offset);
		

	if ($scope.entity.Person.MPIssueDate)
            $scope.entity.Person.MPIssueDate = (new Date($scope.entity.Person.MPIssueDate)).addMinutes(offset);
		

	if ($scope.entity.Person.MPExpireDate)
            $scope.entity.Person.MPExpireDate = (new Date($scope.entity.Person.MPExpireDate)).addMinutes(offset);
		

	if ($scope.entity.Person.CALRIssueDate)
            $scope.entity.Person.CALRIssueDate = (new Date($scope.entity.Person.CALRIssueDate)).addMinutes(offset);
		

	if ($scope.entity.Person.CALRExpireDate)
            $scope.entity.Person.CALRExpireDate = (new Date($scope.entity.Person.CALRExpireDate)).addMinutes(offset);
		

	if ($scope.entity.Person.SpecialApprovalIssueDate)
            $scope.entity.Person.SpecialApprovalIssueDate = (new Date($scope.entity.Person.SpecialApprovalIssueDate)).addMinutes(offset);
		

	if ($scope.entity.Person.SpecialApprovalExpireDate)
            $scope.entity.Person.SpecialApprovalExpireDate = (new Date($scope.entity.Person.SpecialApprovalExpireDate)).addMinutes(offset);
		

	if ($scope.entity.Person.TRG01IssueDate)
            $scope.entity.Person.TRG01IssueDate = (new Date($scope.entity.Person.TRG01IssueDate)).addMinutes(offset);
		

	if ($scope.entity.Person.TRG01ExpireDate)
            $scope.entity.Person.TRG01ExpireDate = (new Date($scope.entity.Person.TRG01ExpireDate)).addMinutes(offset);
		
		
		
		if ($scope.entity.Person.TRG07AIssueDate)
            $scope.entity.Person.TRG07AIssueDate = (new Date($scope.entity.Person.TRG07AIssueDate)).addMinutes(offset);
		

	if ($scope.entity.Person.TRG07AExpireDate)
            $scope.entity.Person.TRG07AExpireDate = (new Date($scope.entity.Person.TRG07AExpireDate)).addMinutes(offset);
		

	if ($scope.entity.Person.TRG16IssueDate)
            $scope.entity.Person.TRG16IssueDate = (new Date($scope.entity.Person.TRG16IssueDate)).addMinutes(offset);
		

	if ($scope.entity.Person.TRG16ExpireDate)
            $scope.entity.Person.TRG16ExpireDate = (new Date($scope.entity.Person.TRG16ExpireDate)).addMinutes(offset);
		
      //  $scope.datefrom = General.getDayFirstHour(new Date(dfrom));
     //   $scope.dateEnd = General.getDayLastHour(new Date(new Date(dfrom).addDays($scope.days_count - 1)));
        //doolko
        //entity.Person.DateTypeIssue
       // if ($scope.entity.Person.DateTypeIssue)
       //     $scope.entity.Person.DateTypeIssue = new Date((new Date($scope.entity.DateTypeIssue)).addMinutes(offset));
       // if ($scope.entity.Person.DateTypeExpire)
       //     $scope.entity.Person.DateTypeExpire = new Date((new Date($scope.entity.DateTypeExpire)).addMinutes(offset));

       
		 $scope.loadingVisible = true;
       
        zpersonService.save($scope.entity).then(function (response) {

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
    $scope.popup_cer_visible = false;
    $scope.popup_cer = {
        elementAttr: {
            //  id: "elementId",
            class: "popup_cer"
        },
        shading: true,
        title: 'Courses',
        //position: { my: 'left', at: 'left', of: window, offset: '5 0' },
        height: 700,
        width: $(window).width() - 400,
        fullScreen: false,
        showTitle: true,
        dragEnabled: true,

        toolbarItems: [


            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'success', text: 'Save', icon: 'remove', validationGroup: 'pceradd', onClick: function (e) {

                        var result = e.validationGroup.validate();

                        if (!result.isValid) {
                            General.ShowNotify(Config.Text_FillRequired, 'error');
                            return;
                        }
                        var dto = {};

                        //doolo


                        dto.Id = -1;
                        dto.PersonId = $scope.entity.Person.PersonId;
                        dto.CustomerId = Config.CustomerId;
                        dto.IsGeneral = 1;
                        dto.CourseTypeId = $scope.course_Type;
                        dto.CertificateNo = $scope.course_CertificateNo;
                        dto.Title = $scope.course_Title;
                        dto.DateStart = moment($scope.course_DateStart).format('YYYY-MM-DD');
                        dto.DateEnd = moment($scope.course_DateEnd).format('YYYY-MM-DD');
                        dto.DateIssue = moment($scope.course_DateIssue).format('YYYY-MM-DD');
                        dto.DateExpire = moment($scope.course_DateExpire).format('YYYY-MM-DD');
                        dto.OrganizationId = $scope.course_OrganizationId;
                        dto.Location = $scope.course_Location;
                        dto.Instructor = $scope.course_Instructor;
                        dto.TrainingDirector = $scope.course_TrainingDirector;
                        dto.Duration = $scope.course_Duration;
                        dto.DurationUnitId = 27;
                        dto.Interval = $scope.course_Interval;
                        dto.CalanderTypeId = $scope.course_CalanderTypeId;
                        // dto.Recurrent = $scope.entity.Recurrent;
                        // dto.Remark = $scope.entity.Remark;
                        dto.IsNotificationEnabled = 0;
                        //dto.Sessions = Enumerable.From($scope.entity.Sessions).Select('$.Key').ToArray();
                        console.log(dto);

                        $scope.loadingVisible = true;
                        trnService.saveCertificate(dto).then(function (response) {


                            $scope.clear_course();

                            General.ShowNotify(Config.Text_SavedOk, 'success');


                            var exists = Enumerable.From($scope.personCourses).Where('$.Id==' + response.Data.Id).FirstOrDefault();
                            if (exists) {
                                $scope.personCourses = Enumerable.From($scope.personCourses).Where('$.Id!=' + response.Data.Id).ToArray();
                            }
                            $scope.personCourses.push(response.Data);



                            $scope.loadingVisible = false;
                            $scope.bindPersoncourses();

                            // $scope.popup_cer_visible = false;




                        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

                        //////////////////

                    }
                }, toolbar: 'bottom'
            },
            {
                widget: 'dxButton', location: 'after', options: {
                    type: 'danger', text: 'Close', icon: 'remove', onClick: function (arg) {

                        $scope.popup_cer_visible = false;

                    }
                }, toolbar: 'bottom'
            }
        ],
        visible: false,

        closeOnOutsideClick: false,
        onTitleRendered: function (e) {
            // $(e.titleElement).addClass('vahid');
            // $(e.titleElement).css('background-color', '#f2552c');
        },
        onShowing: function (e) {




        },
        onShown: function (e) {
            // $scope.getCrewAbs2($scope.flight.ID);
            if ($scope.dg_arccourse_instance)
                $scope.dg_arccourse_instance.refresh();


        },
        onHiding: function () {
            $scope.clear_course();
            $scope.dg_arccourse_instance.clearSelection();
            $scope.dg_arccourse_ds = null;

            $scope.popup_cer_visible = false;

        },
        bindingOptions: {
            visible: 'popup_cer_visible',
            // 'toolbarItems[0].options.value': 'crs_result',
            // 'toolbarItems[1].options.value': 'rptcd_dateTo',
            // 'toolbarItems[2].options.value': 'rptcd_caco',


        }
    };
    $scope.clear_course = function () {
        $scope.course_Type = null;
        $scope.course_CertificateNo = null;
        $scope.course_Title = null;
        $scope.course_DateStart = null;
        $scope.course_DateEnd = null;
        $scope.course_DateIssue = null;
        $scope.course_DateExpire = null;
        $scope.course_OrganizationId = null;
        $scope.course_Location = null;
        $scope.course_Instructor = null;
        $scope.course_TrainingDirector = null;
        $scope.course_Duration = null;

        $scope.course_Interval = null;
        $scope.course_CalanderTypeId = null;
    };
    $scope.dg_arccourse_columns = [
        { dataField: 'Organization', caption: 'Organization', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 300, fixed: true, fixedPosition: 'left' },

        { dataField: 'DateStart', caption: 'DateStart', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130, sortIndex: 0, sortOrder: "desc" },
        { dataField: 'DateEnd', caption: 'DateEnd', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 130 },
        { dataField: 'No', caption: 'Class Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120, fixed: true, fixedPosition: 'left' },

        { dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },
        { dataField: 'TrainingDirector', caption: 'Training Director', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, width: 150 },

        { dataField: 'Recurrent', caption: 'Recurrent', allowResizing: true, alignment: 'center', dataType: 'boolean', allowEditing: false, width: 100 },
        { dataField: 'Duration', caption: 'Duration (hrs)', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },



    ];
    $scope.dg_arccourse_selected = null;
    $scope.dg_arccourse_instance = null;
    $scope.dg_arccourses_ds = null;
    $scope.dg_arccourse_height = 540;
    $scope.dg_arccourse = {
        sorting: {
            mode: "single"
        },
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,


        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'standard' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,


        columns: $scope.dg_arccourse_columns,
        onContentReady: function (e) {
            if (!$scope.dg_arccourse_instance)
                $scope.dg_arccourse_instance = e.component;

            //$scope.dg_cduties_height = $(window).height() - 131;
        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_arccourse_selected = null;

            }
            else {
                console.log('dg_course', data);
                $scope.dg_arccourse_selected = data;
                $scope.course_Title = data.Title;
                $scope.course_OrganizationId = Number(data.OrganizationId);
                $scope.course_Location = data.Location;
                $scope.course_Instructor = data.Instructor;
                $scope.course_TrainingDirector = data.TrainingDirector;
                $scope.course_Duration = data.Duration;
                $scope.course_Interval = data.Interval;
                $scope.course_CalanderTypeId = data.CalanderTypeId;
                $scope.course_DateStart = new Date(data.DateStart);
                $scope.course_DateEnd = new Date(data.DateEnd);

            }
        },

        onRowPrepared: function (e) {

        },
        bindingOptions: {
            dataSource: 'dg_arccourses_ds',
            height: 'dg_arccourse_height',
        }
    };
    $scope.course_Type = null;
    $scope.course_TypeItem = null;
    $scope.course_set_expire = function () {
        if ($scope.course_Interval && $scope.course_CalanderTypeId && $scope.course_DateIssue) {
            if ($scope.course_CalanderTypeId == 12) {
                $scope.course_DateExpire = (new Date($scope.course_DateIssue)).addYears($scope.course_Interval);

            }
            if ($scope.course_CalanderTypeId == 13)
                $scope.course_DateExpire = (new Date($scope.course_DateIssue)).addMonths($scope.course_Interval);
            if ($scope.course_CalanderTypeId == 14)
                $scope.course_DateExpire = (new Date($scope.course_DateIssue)).addDays($scope.course_Interval);
        }
    };
    $scope.sb_course_type = {
        dataSource: $rootScope.getDatasourceCourseTypeNew(),
        placeholder: 'Select Course Type',
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",
        onSelectionChanged: function (e) {
            $scope.course_TypeItem = e.selectedItem;
            if (!e.selectedItem)
                return;
            //if (!$scope.course_Interval)
            $scope.course_Interval = e.selectedItem.Interval;
            //if (!$scope.course_Duration)
            $scope.course_Duration = e.selectedItem.Duration;
            //if (!$scope.course_CalanderTypeId)
            $scope.course_CalanderTypeId = e.selectedItem.CalenderTypeId;
            //if ($scope.isNew) {
            //    if (e.selectedItem && e.selectedItem.Interval)
            //        $scope.entity.Interval = e.selectedItem.Interval;
            //    if (e.selectedItem && e.selectedItem.CalenderTypeId)
            //        $scope.entity.CalanderTypeId = e.selectedItem.CalenderTypeId;
            //    if (e.selectedItem && e.selectedItem.Duration)
            //        $scope.entity.Duration = e.selectedItem.Duration;
            //}
            //$scope.selectedType = e.selectedItem;
            //$scope.certype = null;
            //$scope.ctgroups = null;
            //if (e.selectedItem) {
            //    $scope.certype = e.selectedItem.CertificateType;

            //    $scope.ctgroups = e.selectedItem.JobGroups;
            //}
            $scope.course_set_expire();

            $scope.dg_arccourse_instance.clearSelection();

            $scope.loadingVisible = true;
            trnService.getCoursesByTypeOutside(e.selectedItem.Id, 3).then(function (response) {
                $scope.loadingVisible = false;
                $scope.dg_arccourses_ds = response.Data;

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });

        },
        bindingOptions: {
            value: 'course_Type',

        }

    };
    $scope.date_course_resultissue = {
        width: '100%',
        type: 'date',
        onValueChanged: function (e) {

            $scope.course_set_expire();
        },
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'course_DateIssue',
            // disabled: 'isCertidicateDisabled',
        }
    };
    $scope.txt_course_Title = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'course_Title',
        }
    };
    $scope.txt_course_Instructor = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'course_Instructor',
        }
    };
    $scope.txt_course_TrainingDirector = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'course_TrainingDirector',
        }
    };


    $scope.date_course_DateStart = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'course_DateStart',

        }
    };
    $scope.date_course_DateEnd = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
            if (e.value) {
                $scope.course_DateIssue = (new Date(e.value)).addDays(1);
            }

        },
        bindingOptions: {
            value: 'course_DateEnd',

        }
    };

    $scope.txt_course_Location = {
        hoverStateEnabled: false,
        bindingOptions: {
            value: 'course_Location',
        }
    };

    $scope.txt_course_Duration = {
        min: 1,

        bindingOptions: {
            value: 'course_Duration',
        }
    };
    $scope.txt_course_Interval = {
        min: 1,
        onValueChanged: function (e) {

            $scope.course_set_expire();
        },
        bindingOptions: {
            value: 'course_Interval',
        }
    };
    $scope.sb_course_DurationUnitId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(26),
        displayExpr: "Title",
        valueExpr: 'Id',
        bindingOptions: {
            value: 'course_DurationUnitId',

        }
    };
    $scope.sb_course_CalanderTypeId = {
        showClearButton: true,
        searchEnabled: true,
        dataSource: $rootScope.getDatasourceOption(11),
        displayExpr: "Title",
        valueExpr: 'Id',
        onValueChanged: function (e) {

            $scope.course_set_expire();
        },
        bindingOptions: {
            value: 'course_CalanderTypeId',

        }
    };
    $scope.sb_course_OrganizationId = {
        dataSource: $rootScope.getDatasourceAirline(),
        showClearButton: true,
        searchEnabled: true,
        searchExpr: ["Title"],
        valueExpr: "Id",
        displayExpr: "Title",

        bindingOptions: {
            value: 'course_OrganizationId',

        }

    };

    $scope.date_course_resultexpire = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        bindingOptions: {
            value: 'course_DateExpire',
            // disabled: 'isCertidicateDisabled',
        }
    };
    $scope.txt_course_resultno = {
        hoverStateEnabled: false,

        bindingOptions: {
            value: 'course_CertificateNo',
            //disabled:'isCertidicateDisabled',
        }
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

                        var ids = Enumerable.From($scope.ds_doc_type).Select('$.Id').ToArray();
                        $scope.ds_dg_file = Enumerable.From($scope.entity.Person.Documents).Where(function (x) { return ids.indexOf(x.DocumentTypeId) != -1; }).ToArray();


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

                        var exist = Enumerable.From($scope.entity.Person.Expreienses).Where("$.Organization=='" + $scope.entityExp.Organization+"'" + ' && $.AircraftTypeId==' + $scope.entityExp.AircraftTypeId + " && $.JobTitle=='" + $scope.entityExp.JobTitle + "' && $.Id!=" + $scope.entityExp.Id).FirstOrDefault();
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
                    type: 'success', text: 'Save', icon: 'check', validationGroup: 'aircrafttypeadd',  onClick: function (e) {
                         
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
                    element = "<a  href='"+$rootScope.clientsFilesUrl+"/" + options.value + "' class='w3-button w3-block w3-blue' style=' margin:0 auto 0px auto;text-decoration:none' target='_blank'>Download</a>";
                  
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
        { dataField: "DocumentType", caption: "Type", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false, width: 250 },
        { dataField: "Count", caption: "Count", allowResizing: true, alignment: "center", dataType: 'string', allowEditing: false, width: 90 },
        { dataField: 'DateIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 120 },
        { dataField: 'DateExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'date', allowEditing: false, width: 120 },
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

            dataSource: 'ds_dg_file',
            height: 'dg_height',
        },
        // dataSource:ds

    };
    $scope.ds_dg_file = [];
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
        height:230,
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
        { dataField: "Remark", caption: "Remark", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false,width:400 },
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
        { dataField: "Category", caption: "Category", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false  },
        { dataField: "Organization", caption: "Organization", allowResizing: true, alignment: "left", dataType: 'string', allowEditing: false,width:250 },

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
          //  $scope.entity.Person.DateCaoCardExpire = (new Date(e.value)).addYears(1);
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
		//return;
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
			 
           // $scope.entity.Person.MBExpireDate = (new Date(e.value)).addYears(3);
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
			 
            //$scope.entity.Person.RSPExpireDate = (new Date(e.value)).addYears(3);
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
			 var y=5;
			if ($scope.group_root=='100')
				y=2;
            //$scope.entity.Person.LRCExpireDate = (new Date(e.value)).addYears(y);
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
			 
            //$scope.entity.Person.PERExpireDate = (new Date(e.value)).addYears(3);
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
			 
            //$scope.entity.Person.METExpireDate = (new Date(e.value)).addYears(3);
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
			var y=3;
			if ($scope.group_root=='300')
				y=2;
            //$scope.entity.Person.MELExpireDate = (new Date(e.value)).addYears(y);
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
			 
           // $scope.entity.Person.HFExpireDate = (new Date(e.value)).addYears(2);
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
			 var y=3;
			if ($scope.group_root=='100' || $scope.group_root=='200' || $scope.group_root=='400' || $scope.group_root=='500' || $scope.group_root=='300' || $scope.group_root=='002')
				y=2;
			//if ($scope.group_root != null)
			//	$scope.entity.Person.ERPExpireDate = (new Date(e.value)).addYears(y);
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
			 
           // $scope.entity.Person.DRMExpireDate = (new Date(e.value)).addYears(3);
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
			 
           // $scope.entity.Person.ANNEXExpireDate = (new Date(e.value)).addYears(3);
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
			 var y=2;
			
			if ($scope.group_root=='100')
				y=2;
            //$scope.entity.Person.ASDExpireDate = (new Date(e.value)).addYears(y);
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
	
	//Airside Safety and Driving IKA
	$scope.date_DateIssue1 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate1 = null;
                return;
            }
			 
           // $scope.entity.Person.ExpireDate1 = (new Date(e.value)).addYears(2);
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate1',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire1 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate1',
            readOnly: 'IsMainDisabled',
        }
    };
	//Cyber Security
	$scope.date_DateIssue2 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate2 = null;
                return;
            }
			 var y=3;
			if ($scope.group_root=='100' || $scope.group_root=='200'  || $scope.group_root=='400'  || $scope.group_root=='500' || $scope.group_root=='300')
				y=2;
           // $scope.entity.Person.ExpireDate2 = (new Date(e.value)).addYears(y);
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate2',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire2 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate2',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
   $scope.date_DateIssue3 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate3 = null;
                return;
            }
			var y=1;
			if ($scope.group_root=='400')
				y=2;
           // $scope.entity.Person.ExpireDate3 = (new Date(e.value)).addYears(y);
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate3',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire3 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate3',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateIssue4 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate4 = null;
                return;
            }
			 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate4',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire4 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate4',
            readOnly: 'IsMainDisabled',
        }
    };
	
	$scope.date_DateIssue5 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate5 = null;
                return;
            }
			 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate5',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire5 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate5',
            readOnly: 'IsMainDisabled',
        }
    };
	
	$scope.date_DateIssue6 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate6 = null;
                return;
            }
			 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate6',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire6 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate6',
            readOnly: 'IsMainDisabled',
        }
    };
	
	$scope.date_DateIssue7 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate7 = null;
                return;
            }
			 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate7',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire7 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate7',
            readOnly: 'IsMainDisabled',
        }
    };
	//MAINT ATL
	$scope.date_DateIssue8 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate8 = null;
                return;
            }
			 
			 
           // $scope.entity.Person.ExpireDate8 = (new Date(e.value)).addYears(2);
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate8',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire8 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate8',
            readOnly: 'IsMainDisabled',
        }
    };
	
	//MAINT RAMP
	$scope.date_DateIssue9 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate9 = null;
                return;
            }
			//   $scope.entity.Person.ExpireDate9 = (new Date(e.value)).addYears(2);
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate9',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire9 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate9',
            readOnly: 'IsMainDisabled',
        }
    };
	//MAINT ENGINE RUNUP
	$scope.date_DateIssue10 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate10 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate10 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate10',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire10 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate10',
            readOnly: 'IsMainDisabled',
        }
    };	
	


	//MAINT B737 FAM
	$scope.date_DateIssue11 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate11 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate11 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate11',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire11 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate11',
            readOnly: 'IsMainDisabled',
        }
    };
	

//PART M PART-M MAINTENANCE,TRAINING
	$scope.date_DateIssue12 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate12 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate12 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate12',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire12 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate12',
            readOnly: 'IsMainDisabled',
        }
    };
	

//MAINT LEGISLATION
	$scope.date_DateIssue13 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate13 = null;
                return;
            }
			 //$scope.entity.Person.ExpireDate13 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate13',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire13 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate13',
            readOnly: 'IsMainDisabled',
        }
    };
	


//MAINT EWIS
	$scope.date_DateIssue14 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate14 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate14 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate14',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire14 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate14',
            readOnly: 'IsMainDisabled',
        }
    };

	//MAINT FTS
	$scope.date_DateIssue15 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate15 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate15 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate15',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire15 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate15',
            readOnly: 'IsMainDisabled',
        }
    };
	

	//MAINT PART 145
	$scope.date_DateIssue16 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate16 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate16 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate16',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire16 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate16',
            readOnly: 'IsMainDisabled',
        }
    };
	

	//MAINT MOE
	$scope.date_DateIssue17 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate17 = null;
                return;
            }
			 //$scope.entity.Person.ExpireDate17 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate17',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire17 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate17',
            readOnly: 'IsMainDisabled',
        }
    };
	
//SMS L2
$scope.date_DateIssue18 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate18 = null;
                return;
            }
			 //$scope.entity.Person.ExpireDate18 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate18',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire18 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate18',
            readOnly: 'IsMainDisabled',
        }
    };
	

//SMS L3
$scope.date_DateIssue19 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate19 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate19 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate19',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire19 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate19',
            readOnly: 'IsMainDisabled',
        }
    };

	//AIROPS
$scope.date_DateIssue20 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate20 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate20 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate20',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire20 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate20',
            readOnly: 'IsMainDisabled',
        }
    };
	
	//CAME
$scope.date_DateIssue24 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate24 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate24 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate24',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire24 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate24',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	
	//AUDIT TECHNIQUES
$scope.date_DateIssue23 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate23 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate23 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate23',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire23 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate23',
            readOnly: 'IsMainDisabled',
        }
    };
	

	//FAILURE MODE AND EFFECT ANALYSIS
$scope.date_DateIssue22 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate22 = null;
                return;
            }
		//	 $scope.entity.Person.ExpireDate22 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate22',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire22 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate22',
            readOnly: 'IsMainDisabled',
        }
    };
	
	//OM
$scope.date_DateIssue21 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate21 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate21 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate21',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire21 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate21',
            readOnly: 'IsMainDisabled',
        }
    };
	

	//MPA
$scope.date_DateIssue25 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate25 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate25 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate25',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire25 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate25',
            readOnly: 'IsMainDisabled',
        }
    };
	
//ADSB
$scope.date_DateIssue26 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate26 = null;
                return;
            }
		//	 $scope.entity.Person.ExpireDate26 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate26',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire26 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate26',
            readOnly: 'IsMainDisabled',
        }
    };
	
//FCL
$scope.date_DateIssue27 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate27 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate27 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate27',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire27 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate27',
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
			 
            //$scope.entity.Person.GOMExpireDate = (new Date(e.value)).addYears(3);
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
			 
           // $scope.entity.Person.ASFExpireDate = (new Date(e.value)).addYears(3);
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
			 
          //  $scope.entity.Person.CCExpireDate = (new Date(e.value)).addYears(3);
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
			 
           // $scope.entity.Person.PSExpireDate = (new Date(e.value)).addYears(3);
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
			 
           // $scope.entity.Person.FMTDExpireDate = (new Date(e.value)).addYears(1);
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
	
	
	
	
	//continuation type - maintenance
	$scope.date_DateIssue28 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate28 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate28 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate28',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	//mel - QA,TRAINIG
	$scope.date_DateIssue29 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate29 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate29 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate29',
            readOnly: 'IsMainDisabled',
        }
    };
	
	//aircraft access doors and familiarization - ground handling
	$scope.date_DateIssue30 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate30 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate30 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate30',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	//refresh type - maintenance
	$scope.date_DateIssue31 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate31 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate31 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate31',
            readOnly: 'IsMainDisabled',
        }
    };
	
	//aviation regulation - legal
	$scope.date_DateIssue32 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate32 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate32 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate32',
            readOnly: 'IsMainDisabled',
        }
    };
	
	//customer care - training
	$scope.date_DateIssue33 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate33 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate33 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate33',
            readOnly: 'IsMainDisabled',
        }
    };
	
	//load sheet - training
	$scope.date_DateIssue34 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate34 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate34 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate34',
            readOnly: 'IsMainDisabled',
        }
    };
	
	//airport service fam - training
	$scope.date_DateIssue35 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate35 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate35 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate35',
            readOnly: 'IsMainDisabled',
        }
    };
    
    $scope.date_DateExpire28 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate28',
            readOnly: 'IsMainDisabled',
        }
    };
	
	$scope.date_DateExpire29 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate29',
            readOnly: 'IsMainDisabled',
        }
    };
	
	$scope.date_DateExpire30 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate30',
            readOnly: 'IsMainDisabled',
        }
    };
	
	$scope.date_DateExpire31 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate31',
            readOnly: 'IsMainDisabled',
        }
    };
	
	$scope.date_DateExpire32 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate32',
            readOnly: 'IsMainDisabled',
        }
    };
	
	$scope.date_DateExpire33 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate33',
            readOnly: 'IsMainDisabled',
        }
    };
	
	$scope.date_DateExpire34 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate34',
            readOnly: 'IsMainDisabled',
        }
    };
	
	$scope.date_DateExpire35 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate35',
            readOnly: 'IsMainDisabled',
        }
    };
	
	//AIROPS NO EXPIRY DATE
	$scope.date_DateIssue36 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate36 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate36 = (new Date(e.value)).addYears(100); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate36',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateExpire36 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate36',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	//AIROPS_CC_FC NO EXPIRY DATE
	$scope.date_DateIssue37 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate37 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate37 = (new Date(e.value)).addYears(100); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate37',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateExpire37 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate37',
            readOnly: 'IsMainDisabled',
        }
    };
	
	//FTL 2 YR
	$scope.date_DateIssue38 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate38 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate38 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate38',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateExpire38 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate38',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	//MONEY LAUNDRY 2yr
	$scope.date_DateIssue39 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate39 = null;
                return;
            }
		//	 $scope.entity.Person.ExpireDate39 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate39',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateExpire39 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate39',
            readOnly: 'IsMainDisabled',
        }
    };
	
	//CRM 2yr
	$scope.date_DateIssue40 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate40 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate40 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate40',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateExpire40 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate40',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	//RECEIVING INSPECTION 2yr
	$scope.date_DateIssue41 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate41 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate41 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate41',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateExpire41 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate41',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	//PASSENGER SERVICE 2yr
	$scope.date_DateIssue42 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate42 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate42 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate42',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateExpire42 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate42',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	//SECURITY 2yr
	$scope.date_DateIssue43 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate43 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate43 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate43',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateExpire43 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate43',
            readOnly: 'IsMainDisabled',
        }
    };
	
	//DEEP CLEAN 2yr
	$scope.date_DateIssue44 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate44 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate44 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate44',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateExpire44 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate44',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	//ERP 2 yr
	$scope.date_DateIssue45 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate45 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate45 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate45',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateExpire45 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate45',
            readOnly: 'IsMainDisabled',
        }
    };
	
	//SMS 2yr
	$scope.date_DateIssue46 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate46 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate46 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate46',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateExpire46 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate46',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	
	//CATERING HEALTH 2YR
	$scope.date_DateIssue47 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate47 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate47 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate47',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateExpire47 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate47',
            readOnly: 'IsMainDisabled',
        }
    };
	//SECURITY MANUAL 2yr
	$scope.date_DateIssue48 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate48 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate48 = (new Date(e.value)).addYears(2); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate48',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateExpire48 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate48',
            readOnly: 'IsMainDisabled',
        }
    };
	
	$scope.date_DateIssue49 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate49 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate49 = (new Date(e.value)).addYears(1); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate49',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateExpire49 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate49',
            readOnly: 'IsMainDisabled',
        }
    };
	
	$scope.date_DateIssue50 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDate50 = null;
                return;
            }
			// $scope.entity.Person.ExpireDate50 = (new Date(e.value)).addYears(1); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDate50',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateExpire50 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDate50',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateIssueTRG02 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.ExpireDateTRG02 = null;
                return;
            }
			// $scope.entity.Person.ExpireDateTRG02 = (new Date(e.value)).addYears(1); 
            
        },
        bindingOptions: {
            value: 'entity.Person.IssueDateTRG02',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_DateExpireTRGTRG02 = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.ExpireDateTRG02',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	
	
	 



$scope.date_RouteCheckIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.RouteCheckExpireDate = null;
                return;
            }
			// $scope.entity.Person.ExpireDateTRG02 = (new Date(e.value)).addYears(1); 
            
        },
        bindingOptions: {
            value: 'entity.Person.RouteCheckIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_RouteCheckExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.RouteCheckExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_LOAD_CONTROL_IssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.LOAD_CONTROL_ExpireDate = null;
                return;
            }
			// $scope.entity.Person.ExpireDateTRG02 = (new Date(e.value)).addYears(1); 
            
        },
        bindingOptions: {
            value: 'entity.Person.LOAD_CONTROL_IssueDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_LOAD_CONTROL_ExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.LOAD_CONTROL_ExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	


$scope.date_PROFICIENCY_ASSESSMENT_IsuueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.PROFICIENCY_ASSESSMENT_ExpireDate = null;
                return;
            }
			// $scope.entity.Person.ExpireDateTRG02 = (new Date(e.value)).addYears(1); 
            
        },
        bindingOptions: {
            value: 'entity.Person.PROFICIENCY_ASSESSMENT_IsuueDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_PROFICIENCY_ASSESSMENT_ExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.PROFICIENCY_ASSESSMENT_ExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	


$scope.date_MPIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.MPExpireDate = null;
                return;
            }
			// $scope.entity.Person.ExpireDateTRG02 = (new Date(e.value)).addYears(1); 
            
        },
        bindingOptions: {
            value: 'entity.Person.MPIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_MPExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.MPExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	


$scope.date_CALRIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.CALRExpireDate = null;
                return;
            }
			// $scope.entity.Person.ExpireDateTRG02 = (new Date(e.value)).addYears(1); 
            
        },
        bindingOptions: {
            value: 'entity.Person.CALRIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_CALRExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.CALRExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	


$scope.date_SpecialApprovalIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.SpecialApprovalExpireDate = null;
                return;
            }
			// $scope.entity.Person.ExpireDateTRG02 = (new Date(e.value)).addYears(1); 
            
        },
        bindingOptions: {
            value: 'entity.Person.SpecialApprovalIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_SpecialApprovalExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.SpecialApprovalExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	


$scope.date_TRG01IssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.TRG01ExpireDate = null;
                return;
            }
			// $scope.entity.Person.ExpireDateTRG02 = (new Date(e.value)).addYears(1); 
            
        },
        bindingOptions: {
            value: 'entity.Person.TRG01IssueDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_TRG01ExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.TRG01ExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	
	$scope.date_TRG07AIssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.TRG07AExpireDate = null;
                return;
            }
			// $scope.entity.Person.ExpireDateTRG02 = (new Date(e.value)).addYears(1); 
            
        },
        bindingOptions: {
            value: 'entity.Person.TRG07AIssueDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_TRG07AExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.TRG07AExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	


$scope.date_TRG16IssueDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,
        onValueChanged: function (e) {
           
            if (!e.value) {
                $scope.entity.Person.TRG16ExpireDate = null;
                return;
            }
			// $scope.entity.Person.ExpireDateTRG02 = (new Date(e.value)).addYears(1); 
            
        },
        bindingOptions: {
            value: 'entity.Person.TRG16IssueDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	
	$scope.date_TRG16ExpireDate = {
        width: '100%',
        type: 'date',
        displayFormat: $rootScope.DateBoxFormat,

        bindingOptions: {
            value: 'entity.Person.TRG16ExpireDate',
            readOnly: 'IsMainDisabled',
        }
    };
	
	///////////////////////////
    $scope.tempData = null;
	$scope.ds_allgroups=[];
    $scope.$on('InitZAddPerson', function (event, prms) {
		
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
        $scope.dg_height = $scope.pop_height - 153;
        $scope.scroll_height = $scope.pop_height - 140;
		
		personService.getGroups(Config.CustomerId).then(function (response) {
			$scope.ds_allgroups=response.data;
			console.log('all groupos',$scope.ds_allgroups);
            $scope.popup_add_visible = true;
        }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
       
        

    });

    ///////////////////////////////////////
    $scope.personCourses = null;
    $scope.dg_courses_columns = [
        {
            dataField: "CoursePeopleStatusId", caption: '',
            width: 55,
            allowFiltering: false,
            allowSorting: false,
            cellTemplate: function (container, options) {
                //var fn = options.value == 1 ? 'registered-24' : 'red';
                var fn = 'pending-24';
                if (options.value == 1)
                    fn = 'registered-24';
                else if (options.value == 0)
                    fn = 'red';


                $("<div>")
                    .append("<img src='content/images/" + fn + ".png' />")
                    .appendTo(container);
            },
            fixed: true, fixedPosition: 'left',//  sortIndex: 0, sortOrder: "desc"
        },
        { dataField: 'No', caption: 'Class Id', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 120 },
        //{ dataField: 'Status', caption: 'Status', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 140 },
        { dataField: 'Title', caption: 'Title', allowResizing: true, alignment: 'left', dataType: 'string', allowEditing: false, minWidth: 300, fixed: true, fixedPosition: 'left' },
       // { dataField: 'CourseType', caption: 'Type', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'DateStart', caption: 'Start', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 150, sortIndex: 0, sortOrder: "desc" },
        { dataField: 'DateEnd', caption: 'End', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 150 },
        { dataField: 'CoursePeopleStatus', caption: 'Result', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 100 },
        { dataField: 'DateIssue', caption: 'Issue', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 150 },
        { dataField: 'DateExpire', caption: 'Expire', allowResizing: true, alignment: 'center', dataType: 'date', format: 'yyyy-MM-dd', allowEditing: false, width: 150 },
       // { dataField: 'CertificateNo', caption: 'Cer. NO', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 150 },
       // { dataField: 'Instructor', caption: 'Instructor', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
       // { dataField: 'TrainingDirector', caption: 'Director', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
        { dataField: 'Organization', caption: 'Center', allowResizing: true, alignment: 'center', dataType: 'string', allowEditing: false, width: 200 },
       



    ];
    $scope.dg_courses_selected = null;
    $scope.dg_courses_instance = null;
    $scope.dg_courses_ds = null;
    //$scope.pop_height = $(window).height() - 30;
   // $scope.dg_height = $scope.pop_height - 153;
    $scope.dg_courses_height = $(window).height() - 153 - 30;
    $scope.dg_courses = {
        sorting: {
            mode: "single"
        },
        headerFilter: {
            visible: false
        },
        filterRow: {
            visible: true,
            showOperationChooser: true,
        },
        showRowLines: true,
        showColumnLines: true,


        noDataText: '',

        allowColumnReordering: true,
        allowColumnResizing: true,
        scrolling: { mode: 'standard' },
        paging: { pageSize: 100 },
        showBorders: true,
        selection: { mode: 'single' },

        columnAutoWidth: false,
        // height: $(window).height()-130,

        columns: $scope.dg_courses_columns,
        onContentReady: function (e) {
            if (!$scope.dg_courses_instance)
                $scope.dg_courses_instance = e.component;

            //$scope.dg_cduties_height = $(window).height() - 131;
        },
        onSelectionChanged: function (e) {
            var data = e.selectedRowsData[0];

            if (!data) {
                $scope.dg_courses_selected = null;

            }
            else {
                $scope.dg_courses_selected = data;

            }
        },

        onRowPrepared: function (e) {
            if (e.data && !e.data.IsNotificationEnabled) {
                e.rowElement.css('background', '#f2f2f2');

            }

        },
        bindingOptions: {
            dataSource: 'dg_courses_ds',
            height: 'dg_courses_height',
        }
    };

    $scope.bindPersoncoursesFirst = function (callback) {
        if (!$scope.personCourses) {
            $scope.loadingVisible = true;
            trnService.getPersonCourses($scope.entity.Person.PersonId).then(function (response) {
                $scope.loadingVisible = false;
                $scope.personCourses = response.Data;
                callback();

            }, function (err) { $scope.loadingVisible = false; General.ShowNotify(err.message, 'error'); });
        }
        else callback();
    };
    $scope.bindPersoncourses = function () {
        $scope.bindPersoncoursesFirst(function () {

            var ds = $scope.personCourses;
            //if ($scope.crs_result == 0 || $scope.crs_result == 1) {
            //    ds = Enumerable.From(ds).Where('$.CoursePeopleStatusId==' + $scope.crs_result).ToArray();
            //}
            //if ($scope.crs_ctype) {
            //    ds = Enumerable.From(ds).Where('$.CourseTypeId==' + $scope.crs_ctype).ToArray();
            //}
            //if ($scope.crs_cer) {
            //    ds = Enumerable.From(ds).Where('$.CertificateTypeId==' + $scope.crs_cer).ToArray();
            //}
            //if ($scope.crs_re == 0 || $scope.crs_re == 1) {
            //    ds = Enumerable.From(ds).Where('$.Recurrent==' + $scope.crs_re).ToArray();
            //}
            //if ($scope.crs_last) {
            //    ds = Enumerable.From(ds).Where('$.RankLast==1').ToArray();
            //}

            $scope.dg_courses_ds = ds;

        });

    };

    //////////////////////////////
	//accordion
	var accordionTabs = 4;
	for (let i = 1; i <= accordionTabs; i++) {
		$(document).on("click", "#heading"+i, function() {
			var d = document.getElementById("collapse"+i);
			if (d.className == "collapse") {
				d.className = "collapse show";
				document.getElementById("heading"+i).className = "card-header show";
				for (let j = 1; j<=accordionTabs; j++) {
					if (j != i) {
						document.getElementById("collapse"+j).className = "collapse";
						document.getElementById("heading"+j).className = "card-header";
					}
				}
			} 
			else if (d.className == "collapse show") {
				d.className = "collapse";
				document.getElementById("heading"+i).className = "card-header";
			}
		});	
	}
	

}]);  