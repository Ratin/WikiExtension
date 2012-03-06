<?
error_reporting(E_ALL);
ini_set("display_errors", 1);

#echo getcwd()."\n";
chdir("../../");

require_once ( 'includes/WebStart.php');

if(isset($_POST['user'])){
$wgUser = User::newFromName($_POST['user']); 
}

global $wgVersion;
$version = explode(".", $wgVersion); #$version[0] = 1; $version[1] = 17; $version[2] = 0;
    
#echo $wgUser->getToken();
#echo $wgUser->getName();

global $sCreateIndexFilepath;

$sCreateIndexFilepath = false;
$ignorewarnings = true;   
$text = "";
$comment = "MsUpload";       
$watch = false;
$error = false;

if (isset($_FILES['file']['name'])) {     

  $filename = $_FILES['file']['name'];

	if ($_POST['name'] != $filename) { //name was changed
		$filename = $_POST['name'];
		//echo 'changed!';
	}

		$token = $wgUser->editToken();
        $wgEnableWriteAPI = true;    
		
		if($version[1] == '17'){  #only version 1.17
	        $params = new FauxRequest(array (
	        	'action' => 'upload',
	        	'file' => $_FILES['file'],
	        	'filename' => $filename,
	        	'filesize' => $_FILES['file']['size'],
	        	'comment'=> $comment,
	        	'ignorewarnings'=> true, //sonst wird nix ueberschrieben
	        	'token' => $token,//$token."%2B%5C",
	        ));
		}else{
			$params = new FauxRequest(array (
	        	'action' => 'upload',
	        	'file' => $_FILES['file'],
	        	'filename' => $filename,
	        	'filesize' => $_FILES['file']['size'],
	        	'comment'=> $comment,
	        	'ignorewarnings'=> true, //sonst wird nix ueberschrieben
	        	'token' => $token,//$token."%2B%5C",
	        ), true, $_SESSION );	
		}
        $enableWrite = true; // This is set to false by default, in the ApiMain constructor
        $api = new ApiMain($params,$enableWrite);
        #$api = new ApiMain($params);
        $api->execute();
        $data = & $api->getResultData();
  
  //$ret = Array("filename" => $filename, "data" => $data );
  echo json_encode($data); 
 
  return $data; //.$data;

}
exit(0);
?>