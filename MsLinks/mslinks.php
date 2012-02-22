<?php
############################################################
# Usage:
#{{#l:dlink|Beispieldatei.zip|Beschreibung|right}}
#{{#l:Beispieldatei.zip}}
# LocalSettings.php:
#require_once("$IP/extensions/MsLinks/mslinks.php");
#$wgMSL_FileTypes = array("no" => "no_icon.gif",
#                        "jpg" => "image_icon.png", 
#                        "gif" => "image_icon.png", 
#                        "bmp" => "image_icon.png", 
#                        "png" => "image_icon.png", 
#                        "pps" => "pps_icon.png", 
#                        "ppt" => "pps_icon.png", 
#                        "pptx" => "pps_icon.png", 
#                        "pdf" => "pdf_icon.png", 
#                        "xls" => "xls_icon.png", 
#                        "doc" => "doc_icon.png", 
#                        "exe" => "exe_icon.gif",
#                        "txt" => "txt_icon.png",
#                        "asc" => "txt_icon.png",
#                        "docx" => "doc_icon.png",
#                        "xlsx" => "xls_icon.png",
#                        "dwg" => "dwg_icon.gif",
#                        "zip" => "zip_icon.png",
#                        "dot" => "doc_icon.png",
#                        "dotx" => "doc_icon.png"
#                    );
############################################################

if(! defined('MEDIAWIKI')) {
	die("This is a MediaWiki extension and can not be used standalone.\n");
}

$wgExtensionCredits['parserhook'][] = array(
	'name' => 'MsLinks',
	'url'  => 'http://www.ratin.de/mslinks.html',
	'description' => 'Erzeugt einem Link mit dem passenden Icon sowie einen Direkt- und Versionslink',
	'version' => '2.6',
	'author' => '[mailto:info@ratin.de info@ratin.de] | Ratin'
);
 
$dir = dirname(__FILE__).'/';
require_once('mslinks_body.php');

#$wgExtensionFunctions[] = "wfMsLinksSetup";
$wgHooks['BeforePageDisplay'][]='htAddHTMLHeader';
$wgHooks['LanguageGetMagic'][] = 'wfMsLinksMagic';
$wgHooks['ParserFirstCallInit'][] = 'MsLinksRegisterHook';


// Tell MediaWiki that the parser function exists.
function MsLinksRegisterHook(&$parser) {
   $parser->setFunctionHook('mslink', 'wfMsLinksRender');
   return true; 
}
 
function wfMsLinksMagic( &$magicWords, $langCode ) {
	$magicWords['mslink'] = array(0,'l');
	return true;
}

function htAddHTMLHeader(&$wgOut){
	global $wgScriptPath;
	$path =  $wgScriptPath.'/extensions/MsLinks';
	$wgOut->addScriptFile( $path.'/mslinks.js' );
  	$wgOut->addScript( "<script type=\"{$wgJsMimeType}\">var path_button_msl='$path'; </script>\n" );
	return true;
}

