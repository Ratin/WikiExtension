<?php
$dir = dirname(__FILE__).'/';

if(! defined('MEDIAWIKI')) {
	#die("This is a MediaWiki extension and can not be used standalone.\n");
}

$wgExtensionCredits['parserhook'][] = array(
	'name' => 'MsUpload',
	'url'  => 'http://www.ratin.de/msupload.html',
	'description' => 'Diese Extension macht Uploads/Multiuploads direkt im Editor möglich',
	'version' => '1.0',
	'author' => '[mailto:info@ratin.de info@ratin.de] | Ratin',
);

$wgHooks['EditPage::showEditForm:initial'][] = 'WEBSetup';

function WEBSetup() {

  global $wgOut, $wgScriptPath, $wgJsMimeType,$wgButtonsAdd,$wgButtonsRemove;
  $path =  $wgScriptPath.'/extensions/Wikieditor_buttons';
  
  $buttons_add = implode ( '","', $wgButtonsAdd );
  $buttons_remove = implode ( '","', $wgButtonsRemove );
  
  $wgOut->addScript( "<script type=\"{$wgJsMimeType}\">
  	var path_buttons='$path'; 
  	var add_buttons = new Array(\"$buttons_add\");
  	var remove_buttons = new Array(\"$buttons_remove\");
  	
  </script>\n" );
		
  $wgOut->addScriptFile($path.'/buttons.js' );

  return true;
}

