// Check that the toolbar is available
if ( typeof $ != 'undefined' && typeof $.fn.wikiEditor != 'undefined' ) {
	// Execute on load
	$( function() {	
	        	
        	
		// To add a group to an existing toolbar section:
        $( '#wpTextbox1' ).wikiEditor( 'addToToolbar', {
                        'section': 'main',
                        'groups': {
                                'msinsert': {
                                        'label': '&nbsp;' 
                                }
                        }
        } );


       var msinsert_group = $('#editform').find('.group-msinsert').show();
       
       var dropdown_list = $(document.createElement("select")).attr("id","msinsert_list").change(function(){
       	
       		var sel = this.options[this.selectedIndex].value;
       		vorlage_sel(sel);
       		//alert(sel);
       	
       }).append('<option value=\'0\'>Vorlage auswählen</option>').appendTo(msinsert_group.find('.label'));
       
       for (var i = 0; i < vorlagen.length; ++i){
			dropdown_list.append('<option value='+(i+1)+'>'+vorlagen[i]+'</option>');           
          }



	});

} else {
	
	// Select erstellen       
     var objSel = document.createElement("select");
     objSel.onchange= function(){
        
        var sel = this.options[this.selectedIndex].value;
        vorlage_sel(sel);
        
        };
          
           objSel.options[objSel.options.length] = new Option('Vorlage auswählen', 0);
           
          for (var i = 0; i < vorlagen.length; ++i){
          
            objSel.options[objSel.options.length] = new Option(vorlagen[i], i+1);
            
          }
          
      
    document.getElementById('toolbar').appendChild(objSel);
}

function vorlage_sel(i){

  if(i!=0){
  sajax_do_call( 'wfAjaxVorlage', [vorlagen[i-1]], 
      function (result) {
        	//obj.processResult(result, file.name)
        	warning = result.responseText;
        				
        	if(warning != "") {
            vorlage_insert(warning,'\n','\n');
            //vorlage_insert(warning,'\n<!--Vorlage Start-->\n','\n<!--Vorlage Ende-->\n');
          }
        			
                  
      } //function
  );
  } //if
}

function vorlage_insert(inhalt,tagOpen,tagClose) {

    this.editor = document.getElementById('wpTextbox1');
    //this.editor.innerHTML = inhalt;
    sampleText = inhalt;
    

    isSample = false;
    
     if (document.selection  && document.selection.createRange) { // IE/Opera
     
                //save window scroll position
                if (document.documentElement && document.documentElement.scrollTop)
                        var winScroll = document.documentElement.scrollTop
                else if (document.body)
                        var winScroll = document.body.scrollTop;
                        
                //get current selection
                this.editor.focus();
                var range = document.selection.createRange();
                selText = range.text;
                
                //insert tags
                checkSelectedText();
                range.text = tagOpen + selText + tagClose;
                //mark sample text as selected
                //range.select();   //nicht markieren des eingefügten textes

                //restore window scroll position
                if (document.documentElement && document.documentElement.scrollTop)
                        document.documentElement.scrollTop = winScroll
                else if (document.body)
                        document.body.scrollTop = winScroll;
                        
                        
        } else if (this.editor.selectionStart || this.editor.selectionStart == '0') { // Mozilla

                //save textarea scroll position
                var textScroll = this.editor.scrollTop;
        
                //get current selection
                this.editor.focus();
                
                var startPos = this.editor.selectionStart;
                var endPos = this.editor.selectionEnd;
                selText = this.editor.value.substring(startPos, endPos);
                
                //insert tags
                checkSelectedText();
                this.editor.value = this.editor.value.substring(0, startPos)
                        + tagOpen + selText + tagClose
                        + this.editor.value.substring(endPos, this.editor.value.length);
                
                //set new selection
                
                if (isSample) {
                        //this.editor.selectionStart = startPos + tagOpen.length;
                        //this.editor.selectionEnd = startPos + tagOpen.length + selText.length;
                        this.editor.selectionStart = startPos + tagOpen.length + selText.length;
                        this.editor.selectionEnd = startPos + tagOpen.length + selText.length;
                } else {
                        //this.editor.selectionStart = startPos + tagOpen.length + selText.length + tagClose.length;
                        //this.editor.selectionEnd = this.editor.selectionStart;
                        this.editor.selectionStart = this.editor.selectionStart;
                        this.editor.selectionEnd = this.editor.selectionStart;
                }
               
                //restore textarea scroll position
                this.editor.scrollTop = textScroll;
        } 
        
        function checkSelectedText(){
                if (!selText) {
                       
                        selText = sampleText;
                        isSample = true;
                } else if (selText.charAt(selText.length - 1) == ' ') { //exclude ending space char
                        selText = selText.substring(0, selText.length - 1);
                        tagClose += ' ';
                        
                }
        }
        
        
}



