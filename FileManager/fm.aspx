<%@ Register TagPrefix="GleamTech" Namespace="GleamTech.FileUltimate.AspNet.UI" Assembly="GleamTech.FileUltimate" %>
<%@ Register TagPrefix="GleamTech" Namespace="GleamTech.FileUltimate.AspNet.WebForms" Assembly="GleamTech.FileUltimate" %>

<!DOCTYPE html>
<html>
    <head runat="server">
        <title>File Manager</title>
    </head>
    <body>

        <GleamTech:FileManagerControl ID="fileManager" runat="server" 
                                Width="800"
                                Height="600" 
                                Resizable="True">

            <GleamTech:FileManagerRootFolder Name="A Root Folder" Location="~/App_Data/RootFolder1" > 
                <GleamTech:FileManagerAccessControl Path="\" AllowedPermissions="Full"/> 
            </GleamTech:FileManagerRootFolder>

        </GleamTech:FileManagerControl> 

    </body>
</html>
