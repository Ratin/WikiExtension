// Check that the toolbar is available
if ( typeof $ != 'undefined' && typeof $.fn.wikiEditor != 'undefined' ) {
	// Execute on load
	$( function() {	
	        	

			
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
 
 			addButton('Strike','<strike>','Text','</strike>',''+path_buttons+'/images/Button_strike.png');
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
 
 			addButton('Gallery','<gallery>\n','File:Example.jpg|Caption1\nFile:Example.jpg|Caption2\n','</gallery>',''+path_buttons+'/images/Btn_toolbar_gallery.png');
 
		}
		if(jQuery.inArray("email", add_buttons) > -1) {
 
 			addButton('E-Mail','{{email|','E-MailAdresse@domain.com','}}',''+path_buttons+'/images/E-Mail.png');

		}

	});

}

function addButton(nam,prex,perix,postx,img){
	
	// To add a button to an existing toolbar group:
    $( '#wpTextbox1' ).wikiEditor( 'addToToolbar', {
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
