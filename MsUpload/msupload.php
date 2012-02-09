<?php
$dir = dirname(__FILE__).'/';

if(! defined('MEDIAWIKI')) {
	#die("This is a MediaWiki extension and can not be used standalone.\n");
}

$wgExtensionCredits['parserhook'][] = array(
	'name' => 'MsUpload',
	'url'  => 'http://www.ratin.de/msupload.html',
	'description' => 'Diese Extension macht Uploads/Multiuploads direkt im Editor möglich',
	'version' => '8.6',
	'author' => '[mailto:info@ratin.de info@ratin.de] | Ratin',
);

$wgAvailableRights[] = 'msupload';

$wgHooks['EditPage::showEditForm:initial'][] = 'MSLSetup';
require_once($dir.'msupload.body.php');
  

function MSLSetup() {

  global $wgOut, $wgScriptPath,$wgFrameworkLoaded,$wgTitle;
  global $wgVersion;

  $version = explode(".", $wgVersion); #$version[0] = 1; $version[1] = 17; $version[2] = 0;
  $path =  $wgScriptPath.'/extensions/MsUpload';
  
  global $wgMSU_ShowAutoKat, $wgMSU_AutoIndex, $wgMSU_CheckedAutoKat, $wgMSL_FileTypes, $wgJsMimeType, $wgMSU_debug;
  
  $use_MsLinks = 'false';
  $autoKat = BoolToText($wgMSU_ShowAutoKat);
  $autoIndex = 'false'; #BoolToText($wgMSU_AutoIndex);
  $autoChecked = BoolToText($wgMSU_CheckedAutoKat);
  $debugMode = BoolToText($wgMSU_debug);
  
  if(isset($wgMSL_FileTypes)){$use_MsLinks = 'true';} //check whether the extension MsLinks is installed
  
  $wgOut->addScript( "<script type=\"{$wgJsMimeType}\">
  			var path_msu = '$path';
			var debugMode = $debugMode;
  			var use_mslinks = $use_MsLinks;
  			var autoKat = $autoKat;
  			var autoIndex = $autoIndex;
  			var autoChecked = $autoChecked;
  		</script>\n" );
			
  #if(isset($wgTitle) AND $wgTitle->getArticleID()!=0){
  #if($wgIsArticle)  
   if($version[1] < '17'){  #framework bei versionen < 17 laden
   
      if (!$wgFrameworkLoaded){
        $wgOut->addScriptFile($path.'/js/jquery.min.js' );
        $wgFrameworkLoaded = true;  
      }
      $wgOut->addScriptFile($path.'/js/jquery.ui.progressbar.js' ); //progressbar
      
    } //if
    
    $wgOut->addScriptFile($path.'/js/plupload.full.js' );
  	$wgOut->addScriptFile( $path.'/js/msupload.js' );
    $wgOut->addScriptFile( $path.'/js/msupload.insert.js' );
    	
    $wgOut->addLink( array(
    			'rel' => 'stylesheet',
    			'type' => 'text/css',
    			'href' => $path.'/css/jquery.css'
    ));
	$wgOut->addLink( array(
    			'rel' => 'stylesheet',
    			'type' => 'text/css',
    			'href' => $path.'/css/msupload.css'
    ));
  #}
  
  return true;
}

function BoolToText($a) {
return $a ? "true" : "false";
}  