// Check that the toolbar is available
if ( typeof $ != 'undefined' && typeof $.fn.wikiEditor != 'undefined' ) {
	// Execute on load
	$( function() {	
	    
	    
	    
	    jQuery.each(remove_buttons, function(i, val) {
	    	
	    	if(val == "reference") {
	    		$( '#wpTextbox1' ).wikiEditor( 'removeFromToolbar', {
            	'section': 'main',
            	'group': 'insert',
            	'tool': 'reference'
        		});
	    	}else {
	    		removeSection(val);
	    	}
			
		});
        	
		// To add a group to an existing toolbar section:
        $( '#wpTextbox1' ).wikiEditor( 'addToToolbar', {
                        'section': 'main',
                        'groups': {
                                'lacon': {
                                        //'label': 'buttons' 
                                }
                        }
        } );

		if(jQuery.inArray("strike", add_buttons) > -1) {
 
 			addButton('Durchstreichen','<strike>','Text','</strike>',''+path_buttons+'/images/Button_strike.png');
		}
		
		if(jQuery.inArray("achtung", add_buttons) > -1) {
 
 			addButton('Achtung','{{Achtung|','Text','}}',''+path_buttons+'/images/Achtung-Link.gif');
		}
		if(jQuery.inArray("Info", add_buttons) > -1) {
 
 			addButton('Info','{{Info|','Text','}}',''+path_buttons+'/images/Information-Link.gif');

		}
		if(jQuery.inArray("benutzer", add_buttons) > -1) {
 
 			addButton('Benutzer','{{Benutzer|','Name','}}',''+path_buttons+'/images/Button_vote_biblio.png');

		}
		if(jQuery.inArray("gallery", add_buttons) > -1) {
 
 			addButton('Bildergallerie','<gallery>\n','File:Example.jpg|Caption1\nFile:Example.jpg|Caption2\n','</gallery>',''+path_buttons+'/images/Btn_toolbar_gallery.png');
 
		}
		if(jQuery.inArray("email", add_buttons) > -1) {
 
 			addButton('E-Mail','{{email|','E-MailAdresse@domain.com','}}',''+path_buttons+'/images/E-Mail.png');

		}
		if(jQuery.inArray("date", add_buttons) > -1) {
 			// start aktuelles Datum
			var date=new Date();
			day = date.getDate();
			month = (date.getMonth()+1);
			year = date.getFullYear();
			if(day<10) day = "0" + day;
			if(month<10) month= "0" + month; 
 			addButton('aktuelles Datum','',"*"+year+"."+month+"."+day+": ",'',''+path_buttons+'/images/Kalender.gif');
		}
		
		function removeSection(nam){
			$( '#wpTextbox1' ).wikiEditor( 'removeFromToolbar', {
            'section': nam
        	});
		}
		function addButton(nam,prex,perix,postx,img){
			
			// To add a button to an existing toolbar group:
		    $('#wpTextbox1' ).wikiEditor( 'addToToolbar', {
		                        'section': 'main',
		                        'group': 'lacon',
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
		     } );
		}

	});

}


