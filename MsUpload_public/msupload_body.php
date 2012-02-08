<?php
$wgAjaxExportList[] = 'wfMsUploadRender';
function wfMsUploadRender() {

  global $output,$wgUser;
  global $wgMSU_ShowAutoKat, $wgMSU_AutoIndex, $wgMSU_CheckedAutoKat;


  if( !$wgUser->isAllowed( 'upload' ) ) {
    	if( !$wgUser->isLoggedIn() ) {
    	   $output .= "<a id='ImageUploadLoginMsg'>einloggen</a>";
    	   return 0;
    	} else {
    		 $output .= "keine Berechtigung"; 
    		 return 1;
    	}
    } else if( wfReadOnly() ) { 
    		 $output .= "Nur lesen";
    		 return 2;
    } else { 
    
      return $wgUser->getName()."|".$wgMSU_ShowAutoKat."|".$wgMSU_AutoIndex."|".$wgMSU_CheckedAutoKat; 
    }   
  return 3; 
}

$wgAjaxExportList[] = 'wfMsUploadCheck';
function wfMsUploadCheck($filename){
  global $wgFileExtensions,$wgMSU_PictureExt;
  
  $extension = strtolower(substr(strrchr ($filename, "."), 1));
  
  if (!in_array($extension, $wgFileExtensions)){
      return implode(',', $wgFileExtensions);  
  }

  if (in_array($extension, $wgMSU_PictureExt)){
  return "pic";
  } 	

  return '1';
}

$wgAjaxExportList[] = 'wfMsUploadDoAjax';
function wfMsUploadDoAjax($file) {
     
    global $wgUser;

    return  substr($wgUser->editToken(),2);
}

$wgAjaxExportList[] = 'wfMsUploadSaveKat';
function wfMsUploadSaveKat($name,$kat) {

        global $wgContLang,$wgUser;
        
        $mediaString = strtolower( $wgContLang->getNsText( NS_FILE ) );
        
        $title = $mediaString.':'.$name;
        $text = "\n[[".$kat."]]";

        $wgEnableWriteAPI = true;    
        $params = new FauxRequest(array (
        	'action' => 'edit',
        	'section'=>  'new',
        	'title' =>  $title,
        	'text' => $text,
        	'token' => $wgUser->editToken(),//$token."%2B%5C",
        ));

        $enableWrite = true; // This is set to false by default, in the ApiMain constructor
        $api = new ApiMain($params,$enableWrite);
        #$api = new ApiMain($params);
        $api->execute();
        $data = & $api->getResultData();
        
  return $mediaString;
}