<?php

function wfMsLinksRender($parser, $typ = '', $url = '', $beschreibung = '', $align = '') {
	
  global $wgOut,$wgScriptPath,$wgMSL_FileTypes;
	
	
  if (empty($typ)) {
	return 'kein typ angegeben';
  } 
  
  if($typ != "dlink" && $typ != "vlink") {
  
	$align = $beschreibung;
    $beschreibung = $url;
    $url = $typ;

  } //if
 
	try {
       $title = Title::newFromText($url,NS_IMAGE);
       $file = function_exists( 'wfFindFile' ) ? wfFindFile( $title ) : new Image( $title );
       $base = (is_object( $file ) && $file->exists()) ? ":Image" : "Media";
       #return $base;
    } catch(Exception $e) {
       #return $e->getMessage();
       $base = "Media";
    } 
				
    $extension = strtolower(substr(strrchr ($url, "."), 1));
  
    if($beschreibung == "") {
    #$beschreibung = $file_info['filename'];
    $beschreibung = substr($url,0,(strlen($url)-(strlen($extension)+1))); // damit umlaute auch angezeigt werden
    }

	$html = "[[$base:$url|$beschreibung]]";
    $bild = "<img src='$wgScriptPath/extensions/MsLinks/images/".$wgMSL_FileTypes['no']."'>";
    
    
    if (isset($wgMSL_FileTypes)){
    foreach($wgMSL_FileTypes as $key => $value) 
    { 
      if($key==$extension){
        $bild = "<img title='$extension' src='$wgScriptPath/extensions/MsLinks/images/$value'>"; 
      }
   
    } //foreach
    } //if
    
    $bild = $parser->insertStripItem($bild, $parser->mStripState);
    
    if($typ != "vlink" && $typ != "dlink") {
      $base = "Media";
     }
     
    $bild = "[[$base:$url|".$bild."]]";

	
  if ($align == "right") { 
    $html = $html." ".$bild;
  } else { #standardausrichtung
    $html = $bild." ".$html;
  }

  return $html;
}