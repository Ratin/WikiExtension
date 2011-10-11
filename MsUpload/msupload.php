<?php
$dir = dirname(__FILE__).'/';

if(! defined('MEDIAWIKI')) {
	#die("This is a MediaWiki extension and can not be used standalone.\n");
}

$wgExtensionCredits['parserhook'][] = array(
	'name' => 'MsUpload',
	'url'  => 'http://www.ratin.de/wiki.html',
	'description' => 'Diese Extension macht Uploads/Multiuploads direkt im Editor möglich',
	'version' => '8.1',
	'author' => '[mailto:info@ratin.de info@ratin.de] | Ratin',
);

$wgAvailableRights[] = 'msupload';

$wgHooks['EditPage::showEditForm:initial'][] = 'MSLSetup';
require_once($dir.'msupload_body.php');
  

function MSLSetup() {

  global $wgOut, $wgScriptPath,$wgFrameworkLoaded,$wgTitle;
  global $wgVersion;
  
  $version = explode(".", $wgVersion); #$version[0] = 1; $version[1] = 17; $version[2] = 0;
  $path =  $wgScriptPath.'/extensions/MsUpload';
  
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
    $wgOut->addScriptFile( $path.'/js/msupload_insert.js' );
    	
    $wgOut->addLink( array(
    			'rel' => 'stylesheet',
    			'type' => 'text/css',
    			'href' => $path.'/css/msupload.css'
    ));
	$wgOut->addLink( array(
    			'rel' => 'stylesheet',
    			'type' => 'text/css',
    			'href' => $path.'/css/jquery.css'
    ));
  #}
  
  return true;
}