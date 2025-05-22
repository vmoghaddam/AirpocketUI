namespace Report
{
    partial class rptFPCAVA
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
            DevExpress.XtraPrinting.BarCode.QRCodeGenerator qrCodeGenerator1 = new DevExpress.XtraPrinting.BarCode.QRCodeGenerator();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(rptFPCAVA));
            DevExpress.XtraReports.UI.XRWatermark xrWatermark1 = new DevExpress.XtraReports.UI.XRWatermark();
            this.TopMargin = new DevExpress.XtraReports.UI.TopMarginBand();
            this.BottomMargin = new DevExpress.XtraReports.UI.BottomMarginBand();
            this.Detail = new DevExpress.XtraReports.UI.DetailBand();
            this.xrBarCode1 = new DevExpress.XtraReports.UI.XRBarCode();
            this.lblHead = new DevExpress.XtraReports.UI.XRLabel();
            this.lblInstructor = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel12 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel11 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel7 = new DevExpress.XtraReports.UI.XRLabel();
            this.lblFrom = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel8 = new DevExpress.XtraReports.UI.XRLabel();
            this.lblTo = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel9 = new DevExpress.XtraReports.UI.XRLabel();
            this.lblDuration = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel10 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel6 = new DevExpress.XtraReports.UI.XRLabel();
            this.lblCer = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel5 = new DevExpress.XtraReports.UI.XRLabel();
            this.lblName = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel4 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel1 = new DevExpress.XtraReports.UI.XRLabel();
            this.lblCerNo = new DevExpress.XtraReports.UI.XRLabel();
            this.lblClassId = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel2 = new DevExpress.XtraReports.UI.XRLabel();
            this.xrLabel3 = new DevExpress.XtraReports.UI.XRLabel();
            this.lblIssue = new DevExpress.XtraReports.UI.XRLabel();
            this.lblExpire = new DevExpress.XtraReports.UI.XRLabel();
            this.lblExpiryCaption = new DevExpress.XtraReports.UI.XRLabel();
            this.xrPictureBox1 = new DevExpress.XtraReports.UI.XRPictureBox();
            this.img_ins1 = new DevExpress.XtraReports.UI.XRPictureBox();
            ((System.ComponentModel.ISupportInitialize)(this)).BeginInit();
            // 
            // TopMargin
            // 
            this.TopMargin.HeightF = 0F;
            this.TopMargin.Name = "TopMargin";
            // 
            // BottomMargin
            // 
            this.BottomMargin.HeightF = 0F;
            this.BottomMargin.Name = "BottomMargin";
            // 
            // Detail
            // 
            this.Detail.Controls.AddRange(new DevExpress.XtraReports.UI.XRControl[] {
            this.img_ins1,
            this.xrBarCode1,
            this.lblHead,
            this.lblInstructor,
            this.xrLabel12,
            this.xrLabel11,
            this.xrLabel7,
            this.lblFrom,
            this.xrLabel8,
            this.lblTo,
            this.xrLabel9,
            this.lblDuration,
            this.xrLabel10,
            this.xrLabel6,
            this.lblCer,
            this.xrLabel5,
            this.lblName,
            this.xrLabel4,
            this.xrLabel1,
            this.lblCerNo,
            this.lblClassId,
            this.xrLabel2,
            this.xrLabel3,
            this.lblIssue,
            this.lblExpire,
            this.lblExpiryCaption,
            this.xrPictureBox1});
            this.Detail.HeightF = 817.778F;
            this.Detail.Name = "Detail";
            // 
            // xrBarCode1
            // 
            this.xrBarCode1.Alignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            this.xrBarCode1.LocationFloat = new DevExpress.Utils.PointFloat(535.327F, 635.1143F);
            this.xrBarCode1.Name = "xrBarCode1";
            this.xrBarCode1.Padding = new DevExpress.XtraPrinting.PaddingInfo(0, 0, 0, 0, 100F);
            this.xrBarCode1.ShowText = false;
            this.xrBarCode1.SizeF = new System.Drawing.SizeF(107.9107F, 94.00568F);
            this.xrBarCode1.StylePriority.UsePadding = false;
            qrCodeGenerator1.CompactionMode = DevExpress.XtraPrinting.BarCode.QRCodeCompactionMode.Byte;
            this.xrBarCode1.Symbology = qrCodeGenerator1;
            // 
            // lblHead
            // 
            this.lblHead.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 10F, DevExpress.Drawing.DXFontStyle.Bold);
            this.lblHead.LocationFloat = new DevExpress.Utils.PointFloat(745F, 693.8333F);
            this.lblHead.Multiline = true;
            this.lblHead.Name = "lblHead";
            this.lblHead.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.lblHead.SizeF = new System.Drawing.SizeF(209.5649F, 66.15802F);
            this.lblHead.StylePriority.UseFont = false;
            this.lblHead.StylePriority.UseTextAlignment = false;
            this.lblHead.Text = "SOMAYEH MORADI";
            this.lblHead.TextAlignment = DevExpress.XtraPrinting.TextAlignment.TopCenter;
            // 
            // lblInstructor
            // 
            this.lblInstructor.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 10F, DevExpress.Drawing.DXFontStyle.Bold);
            this.lblInstructor.LocationFloat = new DevExpress.Utils.PointFloat(184.4701F, 693.8333F);
            this.lblInstructor.Multiline = true;
            this.lblInstructor.Name = "lblInstructor";
            this.lblInstructor.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.lblInstructor.SizeF = new System.Drawing.SizeF(329.4992F, 66.15802F);
            this.lblInstructor.StylePriority.UseFont = false;
            this.lblInstructor.StylePriority.UseTextAlignment = false;
            this.lblInstructor.Text = "OMRANI SHAHRIAR, ALIREZA KHANJANI";
            this.lblInstructor.TextAlignment = DevExpress.XtraPrinting.TextAlignment.TopCenter;
            // 
            // xrLabel12
            // 
            this.xrLabel12.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel12.LocationFloat = new DevExpress.Utils.PointFloat(758.5419F, 660F);
            this.xrLabel12.Multiline = true;
            this.xrLabel12.Name = "xrLabel12";
            this.xrLabel12.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel12.SizeF = new System.Drawing.SizeF(183.9316F, 33.83325F);
            this.xrLabel12.StylePriority.UseFont = false;
            this.xrLabel12.StylePriority.UseTextAlignment = false;
            this.xrLabel12.Text = "Training Manager";
            this.xrLabel12.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // xrLabel11
            // 
            this.xrLabel11.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel11.LocationFloat = new DevExpress.Utils.PointFloat(262.6567F, 660F);
            this.xrLabel11.Multiline = true;
            this.xrLabel11.Name = "xrLabel11";
            this.xrLabel11.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel11.SizeF = new System.Drawing.SizeF(111.3248F, 33.83325F);
            this.xrLabel11.StylePriority.UseFont = false;
            this.xrLabel11.StylePriority.UseTextAlignment = false;
            this.xrLabel11.Text = "Instructor";
            this.xrLabel11.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // xrLabel7
            // 
            this.xrLabel7.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel7.LocationFloat = new DevExpress.Utils.PointFloat(328.4616F, 601.2808F);
            this.xrLabel7.Multiline = true;
            this.xrLabel7.Name = "xrLabel7";
            this.xrLabel7.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel7.SizeF = new System.Drawing.SizeF(60.53415F, 33.83331F);
            this.xrLabel7.StylePriority.UseFont = false;
            this.xrLabel7.StylePriority.UseTextAlignment = false;
            this.xrLabel7.Text = "From";
            this.xrLabel7.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // lblFrom
            // 
            this.lblFrom.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.lblFrom.LocationFloat = new DevExpress.Utils.PointFloat(388.9692F, 601.2809F);
            this.lblFrom.Multiline = true;
            this.lblFrom.Name = "lblFrom";
            this.lblFrom.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.lblFrom.SizeF = new System.Drawing.SizeF(125F, 33.83325F);
            this.lblFrom.StylePriority.UseFont = false;
            this.lblFrom.StylePriority.UseTextAlignment = false;
            this.lblFrom.Text = "19 FEB 2022";
            this.lblFrom.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // xrLabel8
            // 
            this.xrLabel8.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel8.LocationFloat = new DevExpress.Utils.PointFloat(512.3881F, 601.281F);
            this.xrLabel8.Multiline = true;
            this.xrLabel8.Name = "xrLabel8";
            this.xrLabel8.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel8.SizeF = new System.Drawing.SizeF(35F, 33.83325F);
            this.xrLabel8.StylePriority.UseFont = false;
            this.xrLabel8.StylePriority.UseTextAlignment = false;
            this.xrLabel8.Text = "To";
            this.xrLabel8.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // lblTo
            // 
            this.lblTo.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.lblTo.LocationFloat = new DevExpress.Utils.PointFloat(547.3881F, 601.2809F);
            this.lblTo.Multiline = true;
            this.lblTo.Name = "lblTo";
            this.lblTo.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.lblTo.SizeF = new System.Drawing.SizeF(125F, 33.83328F);
            this.lblTo.StylePriority.UseFont = false;
            this.lblTo.StylePriority.UseTextAlignment = false;
            this.lblTo.Text = "19 FEB 2022";
            this.lblTo.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // xrLabel9
            // 
            this.xrLabel9.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel9.LocationFloat = new DevExpress.Utils.PointFloat(671.6616F, 601.2808F);
            this.xrLabel9.Multiline = true;
            this.xrLabel9.Name = "xrLabel9";
            this.xrLabel9.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel9.SizeF = new System.Drawing.SizeF(37.1582F, 33.83325F);
            this.xrLabel9.StylePriority.UseFont = false;
            this.xrLabel9.StylePriority.UseTextAlignment = false;
            this.xrLabel9.Text = "for";
            this.xrLabel9.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // lblDuration
            // 
            this.lblDuration.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.lblDuration.LocationFloat = new DevExpress.Utils.PointFloat(708.8198F, 601.2808F);
            this.lblDuration.Multiline = true;
            this.lblDuration.Name = "lblDuration";
            this.lblDuration.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.lblDuration.SizeF = new System.Drawing.SizeF(35F, 33.83325F);
            this.lblDuration.StylePriority.UseFont = false;
            this.lblDuration.StylePriority.UseTextAlignment = false;
            this.lblDuration.Text = "12";
            this.lblDuration.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // xrLabel10
            // 
            this.xrLabel10.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel10.LocationFloat = new DevExpress.Utils.PointFloat(743.8198F, 601.2808F);
            this.xrLabel10.Multiline = true;
            this.xrLabel10.Name = "xrLabel10";
            this.xrLabel10.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel10.SizeF = new System.Drawing.SizeF(67.92737F, 33.83325F);
            this.xrLabel10.StylePriority.UseFont = false;
            this.xrLabel10.StylePriority.UseTextAlignment = false;
            this.xrLabel10.Text = "hours";
            this.xrLabel10.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // xrLabel6
            // 
            this.xrLabel6.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 14F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel6.LocationFloat = new DevExpress.Utils.PointFloat(44.98281F, 567.4476F);
            this.xrLabel6.Multiline = true;
            this.xrLabel6.Name = "xrLabel6";
            this.xrLabel6.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel6.SizeF = new System.Drawing.SizeF(1054.188F, 33.83331F);
            this.xrLabel6.StylePriority.UseFont = false;
            this.xrLabel6.StylePriority.UseTextAlignment = false;
            this.xrLabel6.Text = "Given By The AVA Airlines Training Center ";
            this.xrLabel6.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // lblCer
            // 
            this.lblCer.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 20F, DevExpress.Drawing.DXFontStyle.Bold);
            this.lblCer.LocationFloat = new DevExpress.Utils.PointFloat(44.98286F, 490F);
            this.lblCer.Multiline = true;
            this.lblCer.Name = "lblCer";
            this.lblCer.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.lblCer.SizeF = new System.Drawing.SizeF(1054.188F, 45.35294F);
            this.lblCer.StylePriority.UseFont = false;
            this.lblCer.StylePriority.UseTextAlignment = false;
            this.lblCer.Text = "COMMUNICATION RADIO";
            this.lblCer.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // xrLabel5
            // 
            this.xrLabel5.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel5.LocationFloat = new DevExpress.Utils.PointFloat(44.98286F, 448.9004F);
            this.xrLabel5.Multiline = true;
            this.xrLabel5.Name = "xrLabel5";
            this.xrLabel5.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel5.SizeF = new System.Drawing.SizeF(1054.188F, 33.83328F);
            this.xrLabel5.StylePriority.UseFont = false;
            this.xrLabel5.StylePriority.UseTextAlignment = false;
            this.xrLabel5.Text = "Has Passed The Course";
            this.xrLabel5.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // lblName
            // 
            this.lblName.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 26F);
            this.lblName.ForeColor = System.Drawing.Color.FromArgb(((int)(((byte)(238)))), ((int)(((byte)(137)))), ((int)(((byte)(123)))));
            this.lblName.LocationFloat = new DevExpress.Utils.PointFloat(44.98281F, 390.5128F);
            this.lblName.Multiline = true;
            this.lblName.Name = "lblName";
            this.lblName.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.lblName.SizeF = new System.Drawing.SizeF(1054.188F, 45.35297F);
            this.lblName.StylePriority.UseFont = false;
            this.lblName.StylePriority.UseForeColor = false;
            this.lblName.StylePriority.UseTextAlignment = false;
            this.lblName.Text = "PARNIAN NAJI";
            this.lblName.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // xrLabel4
            // 
            this.xrLabel4.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel4.LocationFloat = new DevExpress.Utils.PointFloat(44.98286F, 339.7997F);
            this.xrLabel4.Multiline = true;
            this.xrLabel4.Name = "xrLabel4";
            this.xrLabel4.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel4.SizeF = new System.Drawing.SizeF(1054.188F, 30.41437F);
            this.xrLabel4.StylePriority.UseFont = false;
            this.xrLabel4.StylePriority.UseTextAlignment = false;
            this.xrLabel4.Text = "This is to Certify that";
            this.xrLabel4.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleCenter;
            // 
            // xrLabel1
            // 
            this.xrLabel1.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel1.LocationFloat = new DevExpress.Utils.PointFloat(791.8033F, 174.7265F);
            this.xrLabel1.Multiline = true;
            this.xrLabel1.Name = "xrLabel1";
            this.xrLabel1.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel1.SizeF = new System.Drawing.SizeF(161.5812F, 34F);
            this.xrLabel1.StylePriority.UseFont = false;
            this.xrLabel1.StylePriority.UseTextAlignment = false;
            this.xrLabel1.Text = "Certificate No:";
            this.xrLabel1.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleRight;
            // 
            // lblCerNo
            // 
            this.lblCerNo.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.lblCerNo.LocationFloat = new DevExpress.Utils.PointFloat(953.3846F, 174.7265F);
            this.lblCerNo.Multiline = true;
            this.lblCerNo.Name = "lblCerNo";
            this.lblCerNo.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.lblCerNo.SizeF = new System.Drawing.SizeF(120.3909F, 34F);
            this.lblCerNo.StylePriority.UseFont = false;
            this.lblCerNo.StylePriority.UseTextAlignment = false;
            this.lblCerNo.Text = "FPC-1517";
            this.lblCerNo.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // lblClassId
            // 
            this.lblClassId.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.lblClassId.LocationFloat = new DevExpress.Utils.PointFloat(953.3846F, 208.7265F);
            this.lblClassId.Multiline = true;
            this.lblClassId.Name = "lblClassId";
            this.lblClassId.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.lblClassId.SizeF = new System.Drawing.SizeF(120.3909F, 34.00003F);
            this.lblClassId.StylePriority.UseFont = false;
            this.lblClassId.StylePriority.UseTextAlignment = false;
            this.lblClassId.Text = "FPC-1517";
            this.lblClassId.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // xrLabel2
            // 
            this.xrLabel2.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel2.LocationFloat = new DevExpress.Utils.PointFloat(791.8033F, 208.7265F);
            this.xrLabel2.Multiline = true;
            this.xrLabel2.Name = "xrLabel2";
            this.xrLabel2.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel2.SizeF = new System.Drawing.SizeF(161.5812F, 34F);
            this.xrLabel2.StylePriority.UseFont = false;
            this.xrLabel2.StylePriority.UseTextAlignment = false;
            this.xrLabel2.Text = "Class ID:";
            this.xrLabel2.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleRight;
            // 
            // xrLabel3
            // 
            this.xrLabel3.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.xrLabel3.LocationFloat = new DevExpress.Utils.PointFloat(106.4174F, 174.7265F);
            this.xrLabel3.Multiline = true;
            this.xrLabel3.Name = "xrLabel3";
            this.xrLabel3.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.xrLabel3.SizeF = new System.Drawing.SizeF(140F, 34F);
            this.xrLabel3.StylePriority.UseFont = false;
            this.xrLabel3.StylePriority.UseTextAlignment = false;
            this.xrLabel3.Text = "Date of Issue:";
            this.xrLabel3.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleRight;
            // 
            // lblIssue
            // 
            this.lblIssue.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.lblIssue.LocationFloat = new DevExpress.Utils.PointFloat(246.4174F, 174.7265F);
            this.lblIssue.Multiline = true;
            this.lblIssue.Name = "lblIssue";
            this.lblIssue.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.lblIssue.SizeF = new System.Drawing.SizeF(144.4963F, 34F);
            this.lblIssue.StylePriority.UseFont = false;
            this.lblIssue.StylePriority.UseTextAlignment = false;
            this.lblIssue.Text = "19 FEB 2022";
            this.lblIssue.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // lblExpire
            // 
            this.lblExpire.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.lblExpire.LocationFloat = new DevExpress.Utils.PointFloat(246.4174F, 208.7265F);
            this.lblExpire.Multiline = true;
            this.lblExpire.Name = "lblExpire";
            this.lblExpire.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.lblExpire.SizeF = new System.Drawing.SizeF(144.4963F, 34F);
            this.lblExpire.StylePriority.UseFont = false;
            this.lblExpire.StylePriority.UseTextAlignment = false;
            this.lblExpire.Text = "19 FEB 2022";
            this.lblExpire.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleLeft;
            // 
            // lblExpiryCaption
            // 
            this.lblExpiryCaption.Font = new DevExpress.Drawing.DXFont("Clarendon Blk BT", 12F, DevExpress.Drawing.DXFontStyle.Bold);
            this.lblExpiryCaption.LocationFloat = new DevExpress.Utils.PointFloat(106.4174F, 208.7265F);
            this.lblExpiryCaption.Multiline = true;
            this.lblExpiryCaption.Name = "lblExpiryCaption";
            this.lblExpiryCaption.Padding = new DevExpress.XtraPrinting.PaddingInfo(2, 2, 0, 0, 100F);
            this.lblExpiryCaption.SizeF = new System.Drawing.SizeF(140F, 34F);
            this.lblExpiryCaption.StylePriority.UseFont = false;
            this.lblExpiryCaption.StylePriority.UseTextAlignment = false;
            this.lblExpiryCaption.Text = "Date of Expiry:";
            this.lblExpiryCaption.TextAlignment = DevExpress.XtraPrinting.TextAlignment.MiddleRight;
            // 
            // xrPictureBox1
            // 
            this.xrPictureBox1.ImageSource = new DevExpress.XtraPrinting.Drawing.ImageSource("img", resources.GetString("xrPictureBox1.ImageSource"));
            this.xrPictureBox1.LocationFloat = new DevExpress.Utils.PointFloat(0F, 0F);
            this.xrPictureBox1.Name = "xrPictureBox1";
            this.xrPictureBox1.SizeF = new System.Drawing.SizeF(1169F, 817.778F);
            this.xrPictureBox1.Sizing = DevExpress.XtraPrinting.ImageSizeMode.StretchImage;
            // 
            // img_ins1
            // 
            this.img_ins1.LocationFloat = new DevExpress.Utils.PointFloat(217.6283F, 660F);
            this.img_ins1.Name = "img_ins1";
            this.img_ins1.SizeF = new System.Drawing.SizeF(218.9265F, 116.1617F);
            this.img_ins1.Sizing = DevExpress.XtraPrinting.ImageSizeMode.Squeeze;
            // 
            // rptFPCAVA
            // 
            this.Bands.AddRange(new DevExpress.XtraReports.UI.Band[] {
            this.TopMargin,
            this.BottomMargin,
            this.Detail});
            this.Font = new DevExpress.Drawing.DXFont("Arial", 9.75F);
            this.Landscape = true;
            this.Margins = new DevExpress.Drawing.DXMargins(0F, 0F, 0F, 0F);
            this.PageHeight = 827;
            this.PageWidth = 1169;
            this.PaperKind = DevExpress.Drawing.Printing.DXPaperKind.A4;
            this.Version = "24.2";
            xrWatermark1.Id = "Watermark1";
            this.Watermarks.AddRange(new DevExpress.XtraPrinting.Drawing.Watermark[] {
            xrWatermark1});
            this.BeforePrint += new DevExpress.XtraReports.UI.BeforePrintEventHandler(this.rptFPCAVA_BeforePrint);
            this.AfterPrint += new System.EventHandler(this.rptFPCAVA_AfterPrint);
            ((System.ComponentModel.ISupportInitialize)(this)).EndInit();

        }


        #endregion
        private DevExpress.XtraReports.UI.TopMarginBand TopMargin;
        private DevExpress.XtraReports.UI.BottomMarginBand BottomMargin;
        private DevExpress.XtraReports.UI.DetailBand Detail;
        private DevExpress.XtraReports.UI.XRPictureBox xrPictureBox1;
        private DevExpress.XtraReports.UI.XRLabel xrLabel3;
        private DevExpress.XtraReports.UI.XRLabel lblIssue;
        private DevExpress.XtraReports.UI.XRLabel lblExpire;
        private DevExpress.XtraReports.UI.XRLabel lblExpiryCaption;
        private DevExpress.XtraReports.UI.XRLabel xrLabel1;
        private DevExpress.XtraReports.UI.XRLabel lblCerNo;
        private DevExpress.XtraReports.UI.XRLabel lblClassId;
        private DevExpress.XtraReports.UI.XRLabel xrLabel2;
        private DevExpress.XtraReports.UI.XRLabel xrLabel4;
        private DevExpress.XtraReports.UI.XRLabel xrLabel5;
        private DevExpress.XtraReports.UI.XRLabel lblName;
        private DevExpress.XtraReports.UI.XRLabel xrLabel6;
        private DevExpress.XtraReports.UI.XRLabel lblCer;
        private DevExpress.XtraReports.UI.XRLabel xrLabel7;
        private DevExpress.XtraReports.UI.XRLabel lblFrom;
        private DevExpress.XtraReports.UI.XRLabel xrLabel8;
        private DevExpress.XtraReports.UI.XRLabel lblTo;
        private DevExpress.XtraReports.UI.XRLabel xrLabel9;
        private DevExpress.XtraReports.UI.XRLabel lblDuration;
        private DevExpress.XtraReports.UI.XRLabel xrLabel10;
        private DevExpress.XtraReports.UI.XRLabel xrLabel12;
        private DevExpress.XtraReports.UI.XRLabel xrLabel11;
        private DevExpress.XtraReports.UI.XRLabel lblInstructor;
        private DevExpress.XtraReports.UI.XRLabel lblHead;
        private DevExpress.XtraReports.UI.XRBarCode xrBarCode1;
        private DevExpress.XtraReports.UI.XRPictureBox img_ins1;
    }
}
