namespace Report
{
    partial class rptOPC
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            DevExpress.XtraPrinting.BarCode.QRCodeGenerator qrCodeGenerator1 = new DevExpress.XtraPrinting.BarCode.QRCodeGenerator();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(rptOPC));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode1 = new DevExpress.DataAccess.Json.JsonSchemaNode("root", true);
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode2 = new DevExpress.DataAccess.Json.JsonSchemaNode("PID", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode3 = new DevExpress.DataAccess.Json.JsonSchemaNode("Phone", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode4 = new DevExpress.DataAccess.Json.JsonSchemaNode("BaseAirportId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode5 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateInactiveBegin", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode6 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateInactiveEnd", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode7 = new DevExpress.DataAccess.Json.JsonSchemaNode("InActive", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<bool>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode8 = new DevExpress.DataAccess.Json.JsonSchemaNode("Locations", true, DevExpress.DataAccess.Json.JsonNodeType.Array);
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode9 = new DevExpress.DataAccess.Json.JsonSchemaNode("Id", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode10 = new DevExpress.DataAccess.Json.JsonSchemaNode("EmployeeId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode11 = new DevExpress.DataAccess.Json.JsonSchemaNode("LocationId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode12 = new DevExpress.DataAccess.Json.JsonSchemaNode("IsMainLocation", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<bool>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode13 = new DevExpress.DataAccess.Json.JsonSchemaNode("OrgRoleId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode14 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateActiveStartP", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode15 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateActiveEndP", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode16 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateActiveStart", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode17 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateActiveEnd", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode18 = new DevExpress.DataAccess.Json.JsonSchemaNode("Remark", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode19 = new DevExpress.DataAccess.Json.JsonSchemaNode("Phone", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode20 = new DevExpress.DataAccess.Json.JsonSchemaNode("OrgRole", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode21 = new DevExpress.DataAccess.Json.JsonSchemaNode("Title", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode22 = new DevExpress.DataAccess.Json.JsonSchemaNode("FullCode", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode23 = new DevExpress.DataAccess.Json.JsonSchemaNode("Id", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode24 = new DevExpress.DataAccess.Json.JsonSchemaNode("PersonId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode25 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateJoinCompany", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode26 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateJoinCompanyP", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode27 = new DevExpress.DataAccess.Json.JsonSchemaNode("IsActive", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<bool>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode28 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateRegisterP", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<double>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode29 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateConfirmedP", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<double>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode30 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateRegister", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode31 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateConfirmed", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode32 = new DevExpress.DataAccess.Json.JsonSchemaNode("IsDeleted", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<bool>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode33 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateActiveStart", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode34 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateActiveEnd", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode35 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateLastLoginP", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode36 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateLastLogin", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode37 = new DevExpress.DataAccess.Json.JsonSchemaNode("Username", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode38 = new DevExpress.DataAccess.Json.JsonSchemaNode("Password", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode39 = new DevExpress.DataAccess.Json.JsonSchemaNode("CustomerId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode40 = new DevExpress.DataAccess.Json.JsonSchemaNode("GroupId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode41 = new DevExpress.DataAccess.Json.JsonSchemaNode("Person", true);
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode42 = new DevExpress.DataAccess.Json.JsonSchemaNode("PersonId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode43 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateCreate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode44 = new DevExpress.DataAccess.Json.JsonSchemaNode("MarriageId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode45 = new DevExpress.DataAccess.Json.JsonSchemaNode("NID", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode46 = new DevExpress.DataAccess.Json.JsonSchemaNode("SexId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode47 = new DevExpress.DataAccess.Json.JsonSchemaNode("FirstName", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode48 = new DevExpress.DataAccess.Json.JsonSchemaNode("LastName", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode49 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateBirth", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode50 = new DevExpress.DataAccess.Json.JsonSchemaNode("Email", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode51 = new DevExpress.DataAccess.Json.JsonSchemaNode("EmailPassword", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode52 = new DevExpress.DataAccess.Json.JsonSchemaNode("Phone1", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode53 = new DevExpress.DataAccess.Json.JsonSchemaNode("Phone2", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode54 = new DevExpress.DataAccess.Json.JsonSchemaNode("Mobile", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode55 = new DevExpress.DataAccess.Json.JsonSchemaNode("FaxTelNumber", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode56 = new DevExpress.DataAccess.Json.JsonSchemaNode("PassportNumber", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode57 = new DevExpress.DataAccess.Json.JsonSchemaNode("DatePassportIssue", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode58 = new DevExpress.DataAccess.Json.JsonSchemaNode("DatePassportExpire", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode59 = new DevExpress.DataAccess.Json.JsonSchemaNode("Address", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode60 = new DevExpress.DataAccess.Json.JsonSchemaNode("IsActive", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<bool>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode61 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateJoinAvation", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode62 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateLastCheckUP", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode63 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateNextCheckUP", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode64 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateYearOfExperience", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode65 = new DevExpress.DataAccess.Json.JsonSchemaNode("CaoCardNumber", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode66 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateCaoCardIssue", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode67 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateCaoCardExpire", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode68 = new DevExpress.DataAccess.Json.JsonSchemaNode("CompetencyNo", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode69 = new DevExpress.DataAccess.Json.JsonSchemaNode("CaoInterval", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode70 = new DevExpress.DataAccess.Json.JsonSchemaNode("CaoIntervalCalanderTypeId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode71 = new DevExpress.DataAccess.Json.JsonSchemaNode("IsDeleted", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<bool>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode72 = new DevExpress.DataAccess.Json.JsonSchemaNode("Remark", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode73 = new DevExpress.DataAccess.Json.JsonSchemaNode("StampNumber", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode74 = new DevExpress.DataAccess.Json.JsonSchemaNode("StampUrl", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode75 = new DevExpress.DataAccess.Json.JsonSchemaNode("TechLogNo", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode76 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateIssueNDT", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode77 = new DevExpress.DataAccess.Json.JsonSchemaNode("IntervalNDT", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode78 = new DevExpress.DataAccess.Json.JsonSchemaNode("NDTNumber", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode79 = new DevExpress.DataAccess.Json.JsonSchemaNode("NDTIntervalCalanderTypeId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode80 = new DevExpress.DataAccess.Json.JsonSchemaNode("IsAuditor", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode81 = new DevExpress.DataAccess.Json.JsonSchemaNode("IsAuditee", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode82 = new DevExpress.DataAccess.Json.JsonSchemaNode("Nickname", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode83 = new DevExpress.DataAccess.Json.JsonSchemaNode("CityId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode84 = new DevExpress.DataAccess.Json.JsonSchemaNode("FatherName", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode85 = new DevExpress.DataAccess.Json.JsonSchemaNode("IDNo", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode86 = new DevExpress.DataAccess.Json.JsonSchemaNode("RowId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode87 = new DevExpress.DataAccess.Json.JsonSchemaNode("UserId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode88 = new DevExpress.DataAccess.Json.JsonSchemaNode("ImageUrl", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode89 = new DevExpress.DataAccess.Json.JsonSchemaNode("CustomerCreatorId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode90 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateExpireNDT", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode91 = new DevExpress.DataAccess.Json.JsonSchemaNode("ProficiencyExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode92 = new DevExpress.DataAccess.Json.JsonSchemaNode("CrewMemberCertificateExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode93 = new DevExpress.DataAccess.Json.JsonSchemaNode("LicenceExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode94 = new DevExpress.DataAccess.Json.JsonSchemaNode("LicenceIRExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode95 = new DevExpress.DataAccess.Json.JsonSchemaNode("SimulatorLastCheck", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode96 = new DevExpress.DataAccess.Json.JsonSchemaNode("SimulatorNextCheck", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode97 = new DevExpress.DataAccess.Json.JsonSchemaNode("RampPassNo", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode98 = new DevExpress.DataAccess.Json.JsonSchemaNode("RampPassExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode99 = new DevExpress.DataAccess.Json.JsonSchemaNode("LanguageCourseExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode100 = new DevExpress.DataAccess.Json.JsonSchemaNode("LicenceTitle", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode101 = new DevExpress.DataAccess.Json.JsonSchemaNode("LicenceInitialIssue", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode102 = new DevExpress.DataAccess.Json.JsonSchemaNode("RaitingCertificates", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode103 = new DevExpress.DataAccess.Json.JsonSchemaNode("LicenceIssueDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode104 = new DevExpress.DataAccess.Json.JsonSchemaNode("LicenceDescription", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode105 = new DevExpress.DataAccess.Json.JsonSchemaNode("ProficiencyCheckType", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode106 = new DevExpress.DataAccess.Json.JsonSchemaNode("ProficiencyCheckDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode107 = new DevExpress.DataAccess.Json.JsonSchemaNode("ProficiencyValidUntil", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode108 = new DevExpress.DataAccess.Json.JsonSchemaNode("ICAOLPRLevel", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode109 = new DevExpress.DataAccess.Json.JsonSchemaNode("ICAOLPRValidUntil", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode110 = new DevExpress.DataAccess.Json.JsonSchemaNode("MedicalClass", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode111 = new DevExpress.DataAccess.Json.JsonSchemaNode("CMCEmployedBy", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode112 = new DevExpress.DataAccess.Json.JsonSchemaNode("CMCOccupation", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode113 = new DevExpress.DataAccess.Json.JsonSchemaNode("PostalCode", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode114 = new DevExpress.DataAccess.Json.JsonSchemaNode("ProficiencyIPC", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode115 = new DevExpress.DataAccess.Json.JsonSchemaNode("ProficiencyOPC", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode116 = new DevExpress.DataAccess.Json.JsonSchemaNode("MedicalLimitation", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode117 = new DevExpress.DataAccess.Json.JsonSchemaNode("ProficiencyDescription", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode118 = new DevExpress.DataAccess.Json.JsonSchemaNode("VisaExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode119 = new DevExpress.DataAccess.Json.JsonSchemaNode("SEPTIssueDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode120 = new DevExpress.DataAccess.Json.JsonSchemaNode("SEPTExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode121 = new DevExpress.DataAccess.Json.JsonSchemaNode("SEPTPIssueDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode122 = new DevExpress.DataAccess.Json.JsonSchemaNode("SEPTPExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode123 = new DevExpress.DataAccess.Json.JsonSchemaNode("DangerousGoodsIssueDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode124 = new DevExpress.DataAccess.Json.JsonSchemaNode("DangerousGoodsExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode125 = new DevExpress.DataAccess.Json.JsonSchemaNode("CCRMIssueDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode126 = new DevExpress.DataAccess.Json.JsonSchemaNode("CCRMExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode127 = new DevExpress.DataAccess.Json.JsonSchemaNode("CRMIssueDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode128 = new DevExpress.DataAccess.Json.JsonSchemaNode("CRMExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode129 = new DevExpress.DataAccess.Json.JsonSchemaNode("SMSIssueDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode130 = new DevExpress.DataAccess.Json.JsonSchemaNode("SMSExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode131 = new DevExpress.DataAccess.Json.JsonSchemaNode("AviationSecurityIssueDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode132 = new DevExpress.DataAccess.Json.JsonSchemaNode("AviationSecurityExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode133 = new DevExpress.DataAccess.Json.JsonSchemaNode("EGPWSIssueDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode134 = new DevExpress.DataAccess.Json.JsonSchemaNode("EGPWSExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode135 = new DevExpress.DataAccess.Json.JsonSchemaNode("UpsetRecoveryTrainingIssueDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode136 = new DevExpress.DataAccess.Json.JsonSchemaNode("UpsetRecoveryTrainingExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode137 = new DevExpress.DataAccess.Json.JsonSchemaNode("ColdWeatherOperationIssueDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode138 = new DevExpress.DataAccess.Json.JsonSchemaNode("HotWeatherOperationIssueDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode139 = new DevExpress.DataAccess.Json.JsonSchemaNode("ColdWeatherOperationExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode140 = new DevExpress.DataAccess.Json.JsonSchemaNode("HotWeatherOperationExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode141 = new DevExpress.DataAccess.Json.JsonSchemaNode("PBNRNAVIssueDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode142 = new DevExpress.DataAccess.Json.JsonSchemaNode("PBNRNAVExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode143 = new DevExpress.DataAccess.Json.JsonSchemaNode("FirstAidIssueDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode144 = new DevExpress.DataAccess.Json.JsonSchemaNode("FirstAidExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode145 = new DevExpress.DataAccess.Json.JsonSchemaNode("ScheduleName", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode146 = new DevExpress.DataAccess.Json.JsonSchemaNode("Code", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode147 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateTypeIssue", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode148 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateTypeExpire", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode149 = new DevExpress.DataAccess.Json.JsonSchemaNode("AircraftTypeId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode150 = new DevExpress.DataAccess.Json.JsonSchemaNode("ProficiencyDescriptionOPC", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode151 = new DevExpress.DataAccess.Json.JsonSchemaNode("ProficiencyCheckDateOPC", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode152 = new DevExpress.DataAccess.Json.JsonSchemaNode("ProficiencyValidUntilOPC", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode153 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateTRIExpired", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode154 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateTREExpired", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode155 = new DevExpress.DataAccess.Json.JsonSchemaNode("LineIssueDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode156 = new DevExpress.DataAccess.Json.JsonSchemaNode("LineExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode157 = new DevExpress.DataAccess.Json.JsonSchemaNode("RecurrentIssueDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode158 = new DevExpress.DataAccess.Json.JsonSchemaNode("RecurrentExpireDate", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode159 = new DevExpress.DataAccess.Json.JsonSchemaNode("Educations", true, DevExpress.DataAccess.Json.JsonNodeType.Array, typeof(object[]));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode160 = new DevExpress.DataAccess.Json.JsonSchemaNode("Expreienses", true, DevExpress.DataAccess.Json.JsonNodeType.Array, typeof(object[]));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode161 = new DevExpress.DataAccess.Json.JsonSchemaNode("AircraftTypes", true, DevExpress.DataAccess.Json.JsonNodeType.Array);
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode162 = new DevExpress.DataAccess.Json.JsonSchemaNode("AircraftType", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode163 = new DevExpress.DataAccess.Json.JsonSchemaNode("ManufacturerId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode164 = new DevExpress.DataAccess.Json.JsonSchemaNode("Manufacturer", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(string));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode165 = new DevExpress.DataAccess.Json.JsonSchemaNode("Id", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode166 = new DevExpress.DataAccess.Json.JsonSchemaNode("AircraftTypeId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode167 = new DevExpress.DataAccess.Json.JsonSchemaNode("PersonId", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<long>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode168 = new DevExpress.DataAccess.Json.JsonSchemaNode("IsActive", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<bool>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode169 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateLimitBegin", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode170 = new DevExpress.DataAccess.Json.JsonSchemaNode("DateLimitEnd", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(System.Nullable<System.DateTime>));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode171 = new DevExpress.DataAccess.Json.JsonSchemaNode("Remark", true, DevExpress.DataAccess.Json.JsonNodeType.Property, typeof(object));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode172 = new DevExpress.DataAccess.Json.JsonSchemaNode("Certificates", true, DevExpress.DataAccess.Json.JsonNodeType.Array, typeof(object[]));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode173 = new DevExpress.DataAccess.Json.JsonSchemaNode("Courses", true, DevExpress.DataAccess.Json.JsonNodeType.Array, typeof(object[]));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode174 = new DevExpress.DataAccess.Json.JsonSchemaNode("Documents", true, DevExpress.DataAccess.Json.JsonNodeType.Array, typeof(object[]));
            DevExpress.DataAccess.Json.JsonSchemaNode jsonSchemaNode175 = new DevExpress.DataAccess.Json.JsonSchemaNode("Ratings", true, DevExpress.DataAccess.Json.JsonNodeType.Array, typeof(object[]));
            this.TopMargin = new DevExpress.XtraReports.UI.TopMarginBand();
            this.BottomMargin = new DevExpress.XtraReports.UI.BottomMarginBand();
            this.Detail = new DevExpress.XtraReports.UI.DetailBand();
            this.xrLabel25 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel24 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrBarCode1 = new DevExpress.XtraReports.UI.XRBarCode();
            this.xrLabel23 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel22 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrPictureBox2 = new DevExpress.XtraReports.UI.XRPictureBox();
            this.img = new DevExpress.XtraReports.UI.XRPictureBox();
            this.xrPictureBox1 = new DevExpress.XtraReports.UI.XRPictureBox();
            this.xrLabel21 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel20 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel19 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel18 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel17 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel16 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel15 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel14 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel13 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel12 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel11 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel10 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel9 = new DevExpress.XtraReports.UI.XRLabel();
            this.lblPIC = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel7 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel6 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel5 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel4 = new DevExpress.XtraReports.UI.XRLabel();
            this.lblName = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel3 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel2 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel1 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrPictureBox3 = new DevExpress.XtraReports.UI.XRPictureBox();
            this.jsonDataSource1 = new DevExpress.DataAccess.Json.JsonDataSource(this.components);
            this.xrCrossBandBox1 = new DevExpress.XtraReports.UI.XRCrossBandBox();
            ((System.ComponentModel.ISupportInitialize)(this)).BeginInit();
            // 
            // TopMargin
            // 
            this.TopMargin.HeightF = 10F;
            this.TopMargin.Name = "TopMargin";
            // 
            // BottomMargin
            // 
            this.BottomMargin.HeightF = 10F;
            this.BottomMargin.Name = "BottomMargin";
            // 
            // Detail
            // 
            this.Detail.Controls.AddRange(new DevExpress.XtraReports.UI.XRControl[] {
            this.xrLabel25,
            this.xrLabel24,
            this.xrBarCode1,
            this.xrLabel23,
            this.xrLabel22,
            this.xrPictureBox2,
            this.img,
            this.xrPictureBox1,
            this.xrLabel21,
            this.xrLabel20,
            this.xrLabel19,
            this.xrLabel18,
            this.xrLabel17,
            this.xrLabel16,
            this.xrLabel15,
            this.xrLabel14,
            this.xrLabel13,
            this.xrLabel12,
            this.xrLabel11,
            this.xrLabel10,
            this.xrLabel9,
            this.lblPIC,
            this.xrLabel7,
            this.xrLabel6,
            this.xrLabel5,
            this.xrLabel4,
            this.lblName,
            this.xrLabel3,
            this.xrLabel2,
            this.xrLabel1,
            this.xrPictureBox3});
            this.Detail.HeightF = 414.1667F;
            this.Detail.Name = "Detail";
            this.Detail.BeforePrint += new DevExpress.XtraReports.UI.BeforePrintEventHandler(this.Detail_BeforePrint);
            // 
            // xrLabel25
            // 
            this.xrLabel25.Font = new DevExpress.Drawing.DXFont("Arial", 8F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel25.ForeColor = System.Drawing.Color.Black;
            this.xrLabel25.LocationFloat = new DevExpress.Utils.PointFloat(393.8465F, 343.1666F);
            this.xrLabel25.Multiline = true;
            this.xrLabel25.Name = "xrLabel25";
            this.xrLabel25.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel25.SizeF = new System.Drawing.SizeF(157.4933F, 23F);
            this.xrLabel25.StylePriority.UseFont = false;
            this.xrLabel25.StylePriority.UseForeColor = false;
            this.xrLabel25.StylePriority.UseTextAlignment = false;
            this.xrLabel25.Text = "AMIN DAVARI";
            this.xrLabel25.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // xrLabel24
            // 
            this.xrLabel24.Font = new DevExpress.Drawing.DXFont("Arial", 8F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel24.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(0)))), ((int)(((byte)(192)))));
            this.xrLabel24.LocationFloat = new DevExpress.Utils.PointFloat(393.8465F, 320.1667F);
            this.xrLabel24.Multiline = true;
            this.xrLabel24.Name = "xrLabel24";
            this.xrLabel24.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel24.SizeF = new System.Drawing.SizeF(157.4934F, 23F);
            this.xrLabel24.StylePriority.UseFont = false;
            this.xrLabel24.StylePriority.UseForeColor = false;
            this.xrLabel24.StylePriority.UseTextAlignment = false;
            this.xrLabel24.Text = "OPS TRAINING MANAGER";
            this.xrLabel24.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // xrBarCode1
            // 
            this.xrBarCode1.Alignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            this.xrBarCode1.ExpressionBindings.AddRange(new DevExpress.XtraReports.UI.ExpressionBinding[] {
            new DevExpress.XtraReports.UI.ExpressionBinding("BeforePrint", "Text", "\'https://fleet.flypersia.aero/zreportattform/frmreportview.aspx?type=opc&nid=\'+To" +
                    "Str([Person].[NID])")});
            this.xrBarCode1.LocationFloat = new DevExpress.Utils.PointFloat(446.3334F, 10F);
            this.xrBarCode1.Name = "xrBarCode1";
            this.xrBarCode1.Padding = new DevExpress.XtraPrinting.PaddingInfo(10, 10, 0, 0, 100F);
            this.xrBarCode1.ShowText = false;
            this.xrBarCode1.SizeF = new System.Drawing.SizeF(105.0066F, 103.8334F);
            qrCodeGenerator1.CompactionMode = DevExpress.XtraPrinting.BarCode.QRCodeCompactionMode.Byte;
            this.xrBarCode1.Symbology = qrCodeGenerator1;
            // 
            // xrLabel23
            // 
            this.xrLabel23.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel23.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(0)))), ((int)(((byte)(192)))));
            this.xrLabel23.LocationFloat = new DevExpress.Utils.PointFloat(8.336658F, 293.9999F);
            this.xrLabel23.Multiline = true;
            this.xrLabel23.Name = "xrLabel23";
            this.xrLabel23.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel23.SizeF = new System.Drawing.SizeF(169.1667F, 23F);
            this.xrLabel23.StylePriority.UseFont = false;
            this.xrLabel23.StylePriority.UseForeColor = false;
            this.xrLabel23.StylePriority.UseTextAlignment = false;
            this.xrLabel23.Text = "FSTD Operator/Location:";
            this.xrLabel23.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel22
            // 
            this.xrLabel22.ExpressionBindings.AddRange(new DevExpress.XtraReports.UI.ExpressionBinding[] {
            new DevExpress.XtraReports.UI.ExpressionBinding("BeforePrint", "Text", "[Person].[EmailPassword]")});
            this.xrLabel22.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel22.LocationFloat = new DevExpress.Utils.PointFloat(280.8368F, 212.8335F);
            this.xrLabel22.Multiline = true;
            this.xrLabel22.Name = "xrLabel22";
            this.xrLabel22.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel22.SizeF = new System.Drawing.SizeF(204.1665F, 23F);
            this.xrLabel22.StylePriority.UseFont = false;
            this.xrLabel22.StylePriority.UseTextAlignment = false;
            this.xrLabel22.Text = "OPC";
            this.xrLabel22.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            this.xrLabel22.Visible = false;
            // 
            // xrPictureBox2
            // 
            this.xrPictureBox2.Borders = DevExpress.XtraPrinting.BorderSide.None;
            this.xrPictureBox2.ImageSource = new DevExpress.XtraPrinting.Drawing.ImageSource("img", resources.GetString("xrPictureBox2.ImageSource"));
            this.xrPictureBox2.LocationFloat = new DevExpress.Utils.PointFloat(219.16F, 1.666667F);
            this.xrPictureBox2.Name = "xrPictureBox2";
            this.xrPictureBox2.SizeF = new System.Drawing.SizeF(117.5067F, 47.16665F);
            this.xrPictureBox2.Sizing = DevExpress.XtraPrinting.ImageSizeMode.StretchImage;
            this.xrPictureBox2.StylePriority.UseBorders = false;
            // 
            // img
            // 
            this.img.BorderColor = System.Drawing.Color.LightGray;
            this.img.Borders = ((DevExpress.XtraPrinting.BorderSide)((((DevExpress.XtraPrinting.BorderSide.Left | DevExpress.XtraPrinting.BorderSide.Top) 
            | DevExpress.XtraPrinting.BorderSide.Right) 
            | DevExpress.XtraPrinting.BorderSide.Bottom)));
            this.img.LocationFloat = new DevExpress.Utils.PointFloat(9.166667F, 10F);
            this.img.Name = "img";
            this.img.SizeF = new System.Drawing.SizeF(90.00002F, 103.8334F);
            this.img.Sizing = DevExpress.XtraPrinting.ImageSizeMode.StretchImage;
            this.img.StylePriority.UseBorderColor = false;
            this.img.StylePriority.UseBorders = false;
            // 
            // xrPictureBox1
            // 
            this.xrPictureBox1.Borders = DevExpress.XtraPrinting.BorderSide.None;
            this.xrPictureBox1.ImageSource = new DevExpress.XtraPrinting.Drawing.ImageSource("img", resources.GetString("xrPictureBox1.ImageSource"));
            this.xrPictureBox1.LocationFloat = new DevExpress.Utils.PointFloat(456.3335F, 248.0001F);
            this.xrPictureBox1.Name = "xrPictureBox1";
            this.xrPictureBox1.SizeF = new System.Drawing.SizeF(76.6666F, 23.00002F);
            this.xrPictureBox1.Sizing = DevExpress.XtraPrinting.ImageSizeMode.StretchImage;
            this.xrPictureBox1.StylePriority.UseBorders = false;
            this.xrPictureBox1.Visible = false;
            // 
            // xrLabel21
            // 
            this.xrLabel21.ExpressionBindings.AddRange(new DevExpress.XtraReports.UI.ExpressionBinding[] {
            new DevExpress.XtraReports.UI.ExpressionBinding("BeforePrint", "Text", "[Person].[ProficiencyValidUntilOPC]")});
            this.xrLabel21.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel21.LocationFloat = new DevExpress.Utils.PointFloat(125.8366F, 366.1666F);
            this.xrLabel21.Multiline = true;
            this.xrLabel21.Name = "xrLabel21";
            this.xrLabel21.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel21.SizeF = new System.Drawing.SizeF(186.6667F, 23F);
            this.xrLabel21.StylePriority.UseFont = false;
            this.xrLabel21.StylePriority.UseTextAlignment = false;
            this.xrLabel21.Text = "Examiner:";
            this.xrLabel21.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            this.xrLabel21.TextFormatString = "{0:dd/MM/yyyy}";
            // 
            // xrLabel20
            // 
            this.xrLabel20.ExpressionBindings.AddRange(new DevExpress.XtraReports.UI.ExpressionBinding[] {
            new DevExpress.XtraReports.UI.ExpressionBinding("BeforePrint", "Text", "[Person].[ProficiencyCheckDateOPC]")});
            this.xrLabel20.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel20.LocationFloat = new DevExpress.Utils.PointFloat(125.8366F, 343.1666F);
            this.xrLabel20.Multiline = true;
            this.xrLabel20.Name = "xrLabel20";
            this.xrLabel20.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel20.SizeF = new System.Drawing.SizeF(186.6667F, 23F);
            this.xrLabel20.StylePriority.UseFont = false;
            this.xrLabel20.StylePriority.UseTextAlignment = false;
            this.xrLabel20.Text = "Examiner:";
            this.xrLabel20.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            this.xrLabel20.TextFormatString = "{0:dd/MM/yyyy}";
            // 
            // xrLabel19
            // 
            this.xrLabel19.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel19.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(0)))), ((int)(((byte)(192)))));
            this.xrLabel19.LocationFloat = new DevExpress.Utils.PointFloat(8.336563F, 366.1668F);
            this.xrLabel19.Multiline = true;
            this.xrLabel19.Name = "xrLabel19";
            this.xrLabel19.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel19.SizeF = new System.Drawing.SizeF(117.5F, 23F);
            this.xrLabel19.StylePriority.UseFont = false;
            this.xrLabel19.StylePriority.UseForeColor = false;
            this.xrLabel19.StylePriority.UseTextAlignment = false;
            this.xrLabel19.Text = "Valid Until:";
            this.xrLabel19.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel18
            // 
            this.xrLabel18.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel18.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(0)))), ((int)(((byte)(192)))));
            this.xrLabel18.LocationFloat = new DevExpress.Utils.PointFloat(8.336563F, 343.1669F);
            this.xrLabel18.Multiline = true;
            this.xrLabel18.Name = "xrLabel18";
            this.xrLabel18.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel18.SizeF = new System.Drawing.SizeF(117.5F, 23F);
            this.xrLabel18.StylePriority.UseFont = false;
            this.xrLabel18.StylePriority.UseForeColor = false;
            this.xrLabel18.StylePriority.UseTextAlignment = false;
            this.xrLabel18.Text = "Date of check:";
            this.xrLabel18.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel17
            // 
            this.xrLabel17.ExpressionBindings.AddRange(new DevExpress.XtraReports.UI.ExpressionBinding[] {
            new DevExpress.XtraReports.UI.ExpressionBinding("BeforePrint", "Text", "[Person].[Phone2]")});
            this.xrLabel17.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel17.LocationFloat = new DevExpress.Utils.PointFloat(125.8366F, 320.1667F);
            this.xrLabel17.Multiline = true;
            this.xrLabel17.Name = "xrLabel17";
            this.xrLabel17.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel17.SizeF = new System.Drawing.SizeF(243.3333F, 23F);
            this.xrLabel17.StylePriority.UseFont = false;
            this.xrLabel17.StylePriority.UseTextAlignment = false;
            this.xrLabel17.Text = "Examiner:";
            this.xrLabel17.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel16
            // 
            this.xrLabel16.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel16.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(0)))), ((int)(((byte)(192)))));
            this.xrLabel16.LocationFloat = new DevExpress.Utils.PointFloat(8.336563F, 320.1667F);
            this.xrLabel16.Multiline = true;
            this.xrLabel16.Name = "xrLabel16";
            this.xrLabel16.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel16.SizeF = new System.Drawing.SizeF(117.5F, 23F);
            this.xrLabel16.StylePriority.UseFont = false;
            this.xrLabel16.StylePriority.UseForeColor = false;
            this.xrLabel16.StylePriority.UseTextAlignment = false;
            this.xrLabel16.Text = "Examiner:";
            this.xrLabel16.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel15
            // 
            this.xrLabel15.ExpressionBindings.AddRange(new DevExpress.XtraReports.UI.ExpressionBinding[] {
            new DevExpress.XtraReports.UI.ExpressionBinding("BeforePrint", "Text", "[Person].[FaxTelNumber]")});
            this.xrLabel15.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel15.LocationFloat = new DevExpress.Utils.PointFloat(177.5034F, 294F);
            this.xrLabel15.Multiline = true;
            this.xrLabel15.Name = "xrLabel15";
            this.xrLabel15.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel15.SizeF = new System.Drawing.SizeF(341.6666F, 23F);
            this.xrLabel15.StylePriority.UseFont = false;
            this.xrLabel15.StylePriority.UseTextAlignment = false;
            this.xrLabel15.Text = "OPC";
            this.xrLabel15.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel14
            // 
            this.xrLabel14.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel14.LocationFloat = new DevExpress.Utils.PointFloat(125.8367F, 271F);
            this.xrLabel14.Multiline = true;
            this.xrLabel14.Name = "xrLabel14";
            this.xrLabel14.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel14.SizeF = new System.Drawing.SizeF(311.6666F, 23F);
            this.xrLabel14.StylePriority.UseFont = false;
            this.xrLabel14.StylePriority.UseTextAlignment = false;
            this.xrLabel14.Text = "B737-300/900";
            this.xrLabel14.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel13
            // 
            this.xrLabel13.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel13.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(0)))), ((int)(((byte)(192)))));
            this.xrLabel13.LocationFloat = new DevExpress.Utils.PointFloat(8.336665F, 271.0001F);
            this.xrLabel13.Multiline = true;
            this.xrLabel13.Name = "xrLabel13";
            this.xrLabel13.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel13.SizeF = new System.Drawing.SizeF(117.5F, 23F);
            this.xrLabel13.StylePriority.UseFont = false;
            this.xrLabel13.StylePriority.UseForeColor = false;
            this.xrLabel13.StylePriority.UseTextAlignment = false;
            this.xrLabel13.Text = "Aircraft/FSTD:";
            this.xrLabel13.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel12
            // 
            this.xrLabel12.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel12.LocationFloat = new DevExpress.Utils.PointFloat(125.8366F, 248F);
            this.xrLabel12.Multiline = true;
            this.xrLabel12.Name = "xrLabel12";
            this.xrLabel12.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel12.SizeF = new System.Drawing.SizeF(100F, 23F);
            this.xrLabel12.StylePriority.UseFont = false;
            this.xrLabel12.StylePriority.UseTextAlignment = false;
            this.xrLabel12.Text = "OPC";
            this.xrLabel12.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel11
            // 
            this.xrLabel11.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel11.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(0)))), ((int)(((byte)(192)))));
            this.xrLabel11.LocationFloat = new DevExpress.Utils.PointFloat(8.336665F, 248.0001F);
            this.xrLabel11.Multiline = true;
            this.xrLabel11.Name = "xrLabel11";
            this.xrLabel11.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel11.SizeF = new System.Drawing.SizeF(117.5F, 23.00002F);
            this.xrLabel11.StylePriority.UseFont = false;
            this.xrLabel11.StylePriority.UseForeColor = false;
            this.xrLabel11.StylePriority.UseTextAlignment = false;
            this.xrLabel11.Text = "Type of Check:";
            this.xrLabel11.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel10
            // 
            this.xrLabel10.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel10.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(0)))), ((int)(((byte)(192)))));
            this.xrLabel10.LocationFloat = new DevExpress.Utils.PointFloat(8.336665F, 225.0001F);
            this.xrLabel10.Multiline = true;
            this.xrLabel10.Name = "xrLabel10";
            this.xrLabel10.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel10.SizeF = new System.Drawing.SizeF(117.5F, 23F);
            this.xrLabel10.StylePriority.UseFont = false;
            this.xrLabel10.StylePriority.UseForeColor = false;
            this.xrLabel10.StylePriority.UseTextAlignment = false;
            this.xrLabel10.Text = "Check:";
            this.xrLabel10.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel9
            // 
            this.xrLabel9.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel9.LocationFloat = new DevExpress.Utils.PointFloat(125.8366F, 225F);
            this.xrLabel9.Multiline = true;
            this.xrLabel9.Name = "xrLabel9";
            this.xrLabel9.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel9.SizeF = new System.Drawing.SizeF(122.5F, 23F);
            this.xrLabel9.StylePriority.UseFont = false;
            this.xrLabel9.StylePriority.UseTextAlignment = false;
            this.xrLabel9.Text = "Proficiency Check";
            this.xrLabel9.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // lblPIC
            // 
            this.lblPIC.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.lblPIC.LocationFloat = new DevExpress.Utils.PointFloat(125.8366F, 202F);
            this.lblPIC.Multiline = true;
            this.lblPIC.Name = "lblPIC";
            this.lblPIC.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.lblPIC.SizeF = new System.Drawing.SizeF(100F, 23F);
            this.lblPIC.StylePriority.UseFont = false;
            this.lblPIC.StylePriority.UseTextAlignment = false;
            this.lblPIC.Text = "PIC";
            this.lblPIC.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel7
            // 
            this.xrLabel7.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel7.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(0)))), ((int)(((byte)(192)))));
            this.xrLabel7.LocationFloat = new DevExpress.Utils.PointFloat(8.336665F, 202.0001F);
            this.xrLabel7.Multiline = true;
            this.xrLabel7.Name = "xrLabel7";
            this.xrLabel7.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel7.SizeF = new System.Drawing.SizeF(117.5F, 23F);
            this.xrLabel7.StylePriority.UseFont = false;
            this.xrLabel7.StylePriority.UseForeColor = false;
            this.xrLabel7.StylePriority.UseTextAlignment = false;
            this.xrLabel7.Text = "Checked as:";
            this.xrLabel7.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel6
            // 
            this.xrLabel6.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(0)))), ((int)(((byte)(192)))));
            this.xrLabel6.LocationFloat = new DevExpress.Utils.PointFloat(8.34F, 172F);
            this.xrLabel6.Multiline = true;
            this.xrLabel6.Name = "xrLabel6";
            this.xrLabel6.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel6.SizeF = new System.Drawing.SizeF(543F, 23F);
            this.xrLabel6.StylePriority.UseForeColor = false;
            this.xrLabel6.StylePriority.UseTextAlignment = false;
            this.xrLabel6.Text = "is registered in FlyPersia Airlines Training Department Data Base as follows.";
            this.xrLabel6.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel5
            // 
            this.xrLabel5.ExpressionBindings.AddRange(new DevExpress.XtraReports.UI.ExpressionBinding[] {
            new DevExpress.XtraReports.UI.ExpressionBinding("BeforePrint", "Text", "[Person].[NDTNumber]")});
            this.xrLabel5.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel5.LocationFloat = new DevExpress.Utils.PointFloat(157.5033F, 149F);
            this.xrLabel5.Multiline = true;
            this.xrLabel5.Name = "xrLabel5";
            this.xrLabel5.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel5.SizeF = new System.Drawing.SizeF(143.3333F, 22.99999F);
            this.xrLabel5.StylePriority.UseFont = false;
            this.xrLabel5.StylePriority.UseTextAlignment = false;
            this.xrLabel5.Text = "xrLabel5";
            this.xrLabel5.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel4
            // 
            this.xrLabel4.ExpressionBindings.AddRange(new DevExpress.XtraReports.UI.ExpressionBinding[] {
            new DevExpress.XtraReports.UI.ExpressionBinding("BeforePrint", "Text", "[Person].[LicenceTitle]")});
            this.xrLabel4.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel4.ForeColor = System.Drawing.Color.Black;
            this.xrLabel4.LocationFloat = new DevExpress.Utils.PointFloat(8.339996F, 149F);
            this.xrLabel4.Multiline = true;
            this.xrLabel4.Name = "xrLabel4";
            this.xrLabel4.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel4.SizeF = new System.Drawing.SizeF(149.1633F, 23F);
            this.xrLabel4.StylePriority.UseFont = false;
            this.xrLabel4.StylePriority.UseForeColor = false;
            this.xrLabel4.StylePriority.UseTextAlignment = false;
            this.xrLabel4.Text = "AIRLINE TRANSPORT PILOT LICENCE";
            this.xrLabel4.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // lblName
            // 
            this.lblName.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F, DevExpress.Drawing.DXFontStyle.Bold);
            this.lblName.LocationFloat = new DevExpress.Utils.PointFloat(349.1667F, 123.8334F);
            this.lblName.Multiline = true;
            this.lblName.Name = "lblName";
            this.lblName.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.lblName.SizeF = new System.Drawing.SizeF(203F, 23.00001F);
            this.lblName.StylePriority.UseFont = false;
            this.lblName.StylePriority.UseTextAlignment = false;
            this.lblName.Text = "lblName";
            this.lblName.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel3
            // 
            this.xrLabel3.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(0)))), ((int)(((byte)(192)))));
            this.xrLabel3.LocationFloat = new DevExpress.Utils.PointFloat(9.166667F, 123.8334F);
            this.xrLabel3.Multiline = true;
            this.xrLabel3.Name = "xrLabel3";
            this.xrLabel3.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel3.SizeF = new System.Drawing.SizeF(327.5F, 23.00001F);
            this.xrLabel3.StylePriority.UseForeColor = false;
            this.xrLabel3.StylePriority.UseTextAlignment = false;
            this.xrLabel3.Text = "It is confirmed that the data of proficiency check for";
            this.xrLabel3.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel2
            // 
            this.xrLabel2.Font = new DevExpress.Drawing.DXFont("Arial", 11F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel2.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(0)))), ((int)(((byte)(192)))));
            this.xrLabel2.LocationFloat = new DevExpress.Utils.PointFloat(138.3333F, 77.5F);
            this.xrLabel2.Multiline = true;
            this.xrLabel2.Name = "xrLabel2";
            this.xrLabel2.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel2.SizeF = new System.Drawing.SizeF(280.0034F, 23F);
            this.xrLabel2.StylePriority.UseFont = false;
            this.xrLabel2.StylePriority.UseForeColor = false;
            this.xrLabel2.StylePriority.UseTextAlignment = false;
            this.xrLabel2.Text = "Registration Form";
            this.xrLabel2.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // xrLabel1
            // 
            this.xrLabel1.Font = new DevExpress.Drawing.DXFont("Arial", 11F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel1.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(0)))), ((int)(((byte)(0)))), ((int)(((byte)(192)))));
            this.xrLabel1.LocationFloat = new DevExpress.Utils.PointFloat(138.3333F, 54.5F);
            this.xrLabel1.Multiline = true;
            this.xrLabel1.Name = "xrLabel1";
            this.xrLabel1.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel1.SizeF = new System.Drawing.SizeF(280.0034F, 23F);
            this.xrLabel1.StylePriority.UseFont = false;
            this.xrLabel1.StylePriority.UseForeColor = false;
            this.xrLabel1.StylePriority.UseTextAlignment = false;
            this.xrLabel1.Text = "Skill Test/Proficiency Check";
            this.xrLabel1.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // xrPictureBox3
            // 
            this.xrPictureBox3.BorderColor = System.Drawing.Color.LightGray;
            this.xrPictureBox3.Borders = DevExpress.XtraPrinting.BorderSide.None;
            this.xrPictureBox3.ImageSource = new DevExpress.XtraPrinting.Drawing.ImageSource("img", resources.GetString("xrPictureBox3.ImageSource"));
            this.xrPictureBox3.LocationFloat = new DevExpress.Utils.PointFloat(393.8465F, 343.1666F);
            this.xrPictureBox3.Name = "xrPictureBox3";
            this.xrPictureBox3.SizeF = new System.Drawing.SizeF(157.4934F, 62.50021F);
            this.xrPictureBox3.Sizing = DevExpress.XtraPrinting.ImageSizeMode.StretchImage;
            this.xrPictureBox3.StylePriority.UseBorderColor = false;
            this.xrPictureBox3.StylePriority.UseBorders = false;
            // 
            // jsonDataSource1
            // 
            this.jsonDataSource1.ConnectionName = "OPC_Connection";
            this.jsonDataSource1.Name = "jsonDataSource1";
            jsonSchemaNode8.Nodes.Add(jsonSchemaNode9);
            jsonSchemaNode8.Nodes.Add(jsonSchemaNode10);
            jsonSchemaNode8.Nodes.Add(jsonSchemaNode11);
            jsonSchemaNode8.Nodes.Add(jsonSchemaNode12);
            jsonSchemaNode8.Nodes.Add(jsonSchemaNode13);
            jsonSchemaNode8.Nodes.Add(jsonSchemaNode14);
            jsonSchemaNode8.Nodes.Add(jsonSchemaNode15);
            jsonSchemaNode8.Nodes.Add(jsonSchemaNode16);
            jsonSchemaNode8.Nodes.Add(jsonSchemaNode17);
            jsonSchemaNode8.Nodes.Add(jsonSchemaNode18);
            jsonSchemaNode8.Nodes.Add(jsonSchemaNode19);
            jsonSchemaNode8.Nodes.Add(jsonSchemaNode20);
            jsonSchemaNode8.Nodes.Add(jsonSchemaNode21);
            jsonSchemaNode8.Nodes.Add(jsonSchemaNode22);
            jsonSchemaNode161.Nodes.Add(jsonSchemaNode162);
            jsonSchemaNode161.Nodes.Add(jsonSchemaNode163);
            jsonSchemaNode161.Nodes.Add(jsonSchemaNode164);
            jsonSchemaNode161.Nodes.Add(jsonSchemaNode165);
            jsonSchemaNode161.Nodes.Add(jsonSchemaNode166);
            jsonSchemaNode161.Nodes.Add(jsonSchemaNode167);
            jsonSchemaNode161.Nodes.Add(jsonSchemaNode168);
            jsonSchemaNode161.Nodes.Add(jsonSchemaNode169);
            jsonSchemaNode161.Nodes.Add(jsonSchemaNode170);
            jsonSchemaNode161.Nodes.Add(jsonSchemaNode171);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode42);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode43);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode44);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode45);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode46);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode47);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode48);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode49);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode50);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode51);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode52);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode53);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode54);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode55);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode56);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode57);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode58);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode59);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode60);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode61);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode62);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode63);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode64);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode65);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode66);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode67);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode68);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode69);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode70);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode71);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode72);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode73);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode74);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode75);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode76);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode77);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode78);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode79);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode80);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode81);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode82);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode83);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode84);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode85);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode86);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode87);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode88);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode89);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode90);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode91);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode92);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode93);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode94);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode95);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode96);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode97);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode98);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode99);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode100);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode101);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode102);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode103);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode104);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode105);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode106);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode107);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode108);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode109);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode110);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode111);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode112);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode113);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode114);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode115);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode116);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode117);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode118);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode119);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode120);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode121);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode122);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode123);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode124);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode125);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode126);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode127);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode128);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode129);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode130);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode131);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode132);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode133);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode134);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode135);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode136);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode137);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode138);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode139);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode140);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode141);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode142);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode143);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode144);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode145);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode146);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode147);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode148);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode149);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode150);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode151);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode152);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode153);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode154);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode155);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode156);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode157);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode158);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode159);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode160);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode161);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode172);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode173);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode174);
            jsonSchemaNode41.Nodes.Add(jsonSchemaNode175);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode2);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode3);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode4);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode5);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode6);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode7);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode8);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode23);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode24);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode25);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode26);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode27);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode28);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode29);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode30);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode31);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode32);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode33);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode34);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode35);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode36);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode37);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode38);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode39);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode40);
            jsonSchemaNode1.Nodes.Add(jsonSchemaNode41);
            this.jsonDataSource1.Schema = jsonSchemaNode1;
            // 
            // xrCrossBandBox1
            // 
            this.xrCrossBandBox1.AnchorVertical = ((DevExpress.XtraReports.UI.VerticalAnchorStyles)((DevExpress.XtraReports.UI.VerticalAnchorStyles.Top | DevExpress.XtraReports.UI.VerticalAnchorStyles.Bottom)));
            this.xrCrossBandBox1.EndBand = this.Detail;
            this.xrCrossBandBox1.EndPointFloat = new DevExpress.Utils.PointFloat(0F, 414.1667F);
            this.xrCrossBandBox1.Name = "xrCrossBandBox1";
            this.xrCrossBandBox1.StartBand = this.Detail;
            this.xrCrossBandBox1.StartPointFloat = new DevExpress.Utils.PointFloat(0F, 0F);
            this.xrCrossBandBox1.WidthF = 563F;
            // 
            // rptOPC
            // 
            this.Bands.AddRange(new DevExpress.XtraReports.UI.Band[] {
            this.TopMargin,
            this.BottomMargin,
            this.Detail});
            this.ComponentStorage.AddRange(new System.ComponentModel.IComponent[] {
            this.jsonDataSource1});
            this.CrossBandControls.AddRange(new DevExpress.XtraReports.UI.XRCrossBandControl[] {
            this.xrCrossBandBox1});
            this.DataSource = this.jsonDataSource1;
            this.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F);
            this.Margins = new DevExpress.Drawing.DXMargins(10, 10, 10, 10);
            this.PageHeight = 827;
            this.PageWidth = 583;
            this.PaperKind = DevExpress.Drawing.Printing.DXPaperKind.A5;
            this.Version = "19.2";
            ((System.ComponentModel.ISupportInitialize)(this)).EndInit();

        }

        #endregion

        private DevExpress.XtraReports.UI.TopMarginBand TopMargin;
        private DevExpress.XtraReports.UI.BottomMarginBand BottomMargin;
        private DevExpress.XtraReports.UI.DetailBand Detail;
        private DevExpress.XtraReports.UI.XRLabel lblName;
        private DevExpress.XtraReports.UI.XRLabel xrLabel3;
        private DevExpress.XtraReports.UI.XRLabel xrLabel2;
        private DevExpress.XtraReports.UI.XRLabel xrLabel1;
        private DevExpress.DataAccess.Json.JsonDataSource jsonDataSource1;
        private DevExpress.XtraReports.UI.XRLabel xrLabel21;
        private DevExpress.XtraReports.UI.XRLabel xrLabel20;
        private DevExpress.XtraReports.UI.XRLabel xrLabel19;
        private DevExpress.XtraReports.UI.XRLabel xrLabel18;
        private DevExpress.XtraReports.UI.XRLabel xrLabel17;
        private DevExpress.XtraReports.UI.XRLabel xrLabel16;
        private DevExpress.XtraReports.UI.XRLabel xrLabel15;
        private DevExpress.XtraReports.UI.XRLabel xrLabel14;
        private DevExpress.XtraReports.UI.XRLabel xrLabel13;
        private DevExpress.XtraReports.UI.XRLabel xrLabel12;
        private DevExpress.XtraReports.UI.XRLabel xrLabel11;
        private DevExpress.XtraReports.UI.XRLabel xrLabel10;
        private DevExpress.XtraReports.UI.XRLabel xrLabel9;
        private DevExpress.XtraReports.UI.XRLabel lblPIC;
        private DevExpress.XtraReports.UI.XRLabel xrLabel7;
        private DevExpress.XtraReports.UI.XRLabel xrLabel6;
        private DevExpress.XtraReports.UI.XRLabel xrLabel5;
        private DevExpress.XtraReports.UI.XRLabel xrLabel4;
        private DevExpress.XtraReports.UI.XRPictureBox xrPictureBox1;
        private DevExpress.XtraReports.UI.XRPictureBox img;
        private DevExpress.XtraReports.UI.XRCrossBandBox xrCrossBandBox1;
        private DevExpress.XtraReports.UI.XRLabel xrLabel22;
        private DevExpress.XtraReports.UI.XRPictureBox xrPictureBox2;
        private DevExpress.XtraReports.UI.XRBarCode xrBarCode1;
        private DevExpress.XtraReports.UI.XRLabel xrLabel23;
        private DevExpress.XtraReports.UI.XRLabel xrLabel25;
        private DevExpress.XtraReports.UI.XRLabel xrLabel24;
        private DevExpress.XtraReports.UI.XRPictureBox xrPictureBox3;
    }
}
