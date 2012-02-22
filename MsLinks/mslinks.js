$(document).ready(function () { //jquery
	// Check that the toolbar is available
	var img_msl = "extensions/MsLinks/images/L-Link-S.gif";
	var img_msl2 = path_button_msl +"/images/L-Link-S.gif";
	var nam_msl = "Direktlink";
	var pre_msl = "{{#l:";
	var peri_msl = "Dateiname.ext";
	var post_msl = "\}\}";
	
	if ( typeof $ != 'undefined' && typeof $.fn.wikiEditor != 'undefined' ) {
		
			addGroup_msl();
			addButton_msl(nam_msl,pre_msl,peri_msl,post_msl,img_msl2);
		
	} else {
		
		var button = {
	        "imageFile": img_msl,  //image to be shown on the button, 22x22 pixels
	        "speedTip": nam_msl,
	        "tagOpen": pre_msl, 
	        "tagClose": post_msl,     
	        "sampleText": peri_msl  
		};
		mwCustomEditButtons.push(button);
	}
});

function addGroup_msl(){
	// To add a group to an existing toolbar section:
	$( '#wpTextbox1' ).wikiEditor( 'addToToolbar', {
    	'section': 'main',
        'groups': {
        	'MsLinks': {}
    	}
    });
}

function addButton_msl(nam,prex,perix,postx,img){
// To add a button to an existing toolbar group:
	$('#wpTextbox1' ).wikiEditor( 'addToToolbar', {
	'section': 'main',
	'group': 'MsLinks',
	'tools': {
		 nam: {
		    label: nam, // or use labelMsg for a localized label, see above
		    type: 'button',
		    icon: img,
		    action: {
		    	type: 'encapsulate',
		        options: {
		           pre: prex, 
		           peri: perix,
		           post: postx,
		        }
		    }
		 }
	}
	});
}
