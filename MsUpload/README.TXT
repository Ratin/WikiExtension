##Start --------------------------------------- MsUpload
$wgMSU_PictureExt = array ('jpg','gif','png','JPG','jpeg');
$wgMSU_ShowAutoKat = false;    #autokategorisierung
$wgMSU_CheckedAutoKat = false;  #checkbox: checked = true/false
$wgMSU_AutoIndex = false;  #fileindexer
require_once("$IP/extensions/MsUpload/msupload.php");
##End  --------------------------------------- MsUpload

#diese Extension benötigt die Extension MsInsert. Es genügt wenn diese als Ordner im Extensionverzeichnis vorhanden ist.

######last changes#########
#7.9.3
#msupload_api.php - exit(0); an letzter stelle
#add htaccess file
######last changes#########