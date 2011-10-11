<?php

# Setup and Hooks for the MsCatSelect extension


if( !defined( 'MEDIAWIKI' ) ) {
        echo( "This file is an extension to the MediaWiki software and cannot be used standalone.\n" );
        die();
}

## Register extension setup hook and credits:
$wgExtensionCredits['parserhook'][] = array(
        'name'           => 'MsCatSelect',
        'url'  => 'http://www.mediawiki.org/wiki/Extension:MsCatSelect',
        'version'        => '4.4',
        'author' => '[mailto:info@ratin.de info@ratin.de] | Ratin',
        'description' => 'Mit dieser Extension kann eine Seite einer bestehenden oder neuen Kategorie per DropDown zugewiesen werden oder auch neue Unterkategorien erstellt werden.',
        'descriptionmsg' => 'selectcategory-desc',
);

## Load the file containing the hook functions:
require_once( 'mscatselect.functions.php' );

$dir = dirname(__FILE__) . '/';
$wgExtensionMessagesFiles['mscatselect'] = $dir . 'mscatselect.i18n.php';

## Set Hook:
global $wgHooks, $wgScriptPath;

$wgHooks['EditPage::showEditForm:initial'][] = 'MsCatSelectSetup';

function MsCatSelectSetup() {
  global $wgOut,$wgScriptPath;
  global $wgFrameworkLoaded, $wgVersion;
  
  $version = explode(".", $wgVersion); #$version[0] = 1; $version[1] = 17; $version[2] = 0;
  $path =  $wgScriptPath.'/extensions/MsCatSelect';
    
  if(isset($wgTitle) AND $wgTitle->getArticleID()!=0){

   if($version[1] < '17'){  #framework bei versionen < 17 laden
   
      if (!$wgFrameworkLoaded){
        $wgOut->addScriptFile($path.'/jquery.min.js' );  #ist noch nicht beigefuegt
        $wgFrameworkLoaded = true;  
      } //if no framework
      
    } //if  version
  } //if title  
  $wgOut->addScriptFile( $path.'/mscatselect.js' );

  return true;
}
## Showing the boxes
# Hook when starting editing:
$wgHooks['EditPage::showEditForm:initial'][] = array( 'fnSelectCategoryShowHook', false );

## Saving the data
# Hook when saving page:
$wgHooks['EditPage::attemptSave'][] = array( 'fnSelectCategorySaveHook', false );
