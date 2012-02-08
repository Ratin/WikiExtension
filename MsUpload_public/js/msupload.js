//jQuery(document).ready(function() {
$(document).ready(function () {
//$(function() {
  //damit später die progressbar zur verfügung steht 
  //mw.loader.using('jquery.ui.progressbar');
  

    //upload button anlegen
    var upload_button = $(document.createElement("a")).attr({ 
      id: "upload_select",
      title: "Dateien hochladen"
    }).append('<img src="extensions/MsUpload/images/button_upload.gif">').appendTo("#toolbar"); 
    
    
    //upload div anlegen  
    var upload_div = $(document.createElement("div")).attr("id","upload_div").insertAfter("#toolbar"); 
	
    var status_div = $(document.createElement("div")).attr("id","upload_status").html('No runtime found.').appendTo(upload_div); 
    var upload_list = $(document.createElement("ul")).attr("id","upload_list").appendTo(upload_div);
    var start_button = $(document.createElement("a")).attr("id","upload_files").appendTo(upload_div).hide();
    var gallery_insert = $(document.createElement("a")).attr("id","gallery_insert").appendTo(upload_div).hide();
    
    var gallery_arr = new Array();
    
    if(mw.loader){
      //damit später die progressbar zur verfügung steht 
      mw.loader.load('jquery.ui.progressbar');
    }

     
       var uploader = new plupload.Uploader({
    		runtimes : 'html5,flash',
    		browse_button : 'upload_select',
    		container : 'toolbar',
    		max_file_size : '100mb',
    		drop_element: 'upload_drop',
    		unique_names: false,
    		
    		multipart_params: { "user": wgUserName, "kat": wgPageName} ,     
        
    		url : 'extensions/MsUpload/msupload.api.php',
    		flash_swf_url : 'extensions/MsUpload/js/plupload.flash.swf',
    		//silverlight_xap_url : 'extensions/MsUpload_plupload/js/plupload.silverlight.xap',
    		// Specify what files to browse for
	      /*
        filters : [
	            {title : "Image files", extensions : "jpg,gif,png"},
	            {title : "Zip files", extensions : "zip"}
        ],
        */
    		//resize : {width : 320, height : 240, quality : 90}
    	});
    
    	uploader.bind('Init', function(up, params) {
    		status_div.html("Status: " + params.runtime + " drag/drop: "+ (!!up.features.dragdrop)).hide();
    		
    		if(up.features.dragdrop){
	        	
	        	var upload_drop = $(document.createElement("div")).attr("id","upload_drop").attr("class","drop").insertAfter(status_div); 
	        	upload_drop.bind('dragover',function(event){
					   $(this).addClass('drop_over');
				}).bind('dragleave',function(event){
					   $(this).removeClass('drop_over');
				}).bind('drop',function(event){
					   $(this).removeClass('drop_over');
				});

	        }
    		
    	});
    
    
    	uploader.bind('FilesAdded', function(up, files) {
    		$.each(files, function(i, file) {
    			
    			
	    		file.li = $(document.createElement("li")).attr("id",file.id).attr("class","file").appendTo(upload_list);
	            
	            file.li.type = $(document.createElement("span")).attr("class","file-type").appendTo(file.li);
	            file.li.title = $(document.createElement("span")).attr("class","file-title").text(file.name).appendTo(file.li);
	            file.li.size = $(document.createElement("span")).attr("class","file-size").text(plupload.formatSize(file.size)).appendTo(file.li);
	            file.li.warning = $(document.createElement("span")).attr("class","file-warning").appendTo(file.li);
	            
	            check_extension(file,uploader); 
            
    		});
        
        
        
    		up.refresh(); // Reposition Flash/Silverlight
    	});
    
      uploader.bind('QueueChanged', function(up) {
		

        if(up.files.length==1){
        start_button.html('Hier klicken um diese Datei hochzuladen').show();
        }else if(up.files.length>1){
        start_button.html('Hier klicken um alle Dateien hochzuladen').show();
        }else{
         start_button.hide();
         gallery_insert.hide();
        }
        
      });
     uploader.bind('BeforeUpload', function(up, file) {
    	
    	$('#' + file.id + " div.file-progress-bar").progressbar({value: '1'});
    	
     });
      
     uploader.bind('UploadProgress', function(up, file) {
    	
    		$('#' + file.id + " span.file-progress-state").html(file.percent + "%");
    	  	//file.li.progress_state.html(file.percent + "%");
    	  
        	$('#' + file.id + " div.file-progress-bar").progressbar({value: file.percent});
        	//file.li.progress_bar.progressbar({value: file.percent});
      		$('#' + file.id + ' div.file-progress-bar .ui-progressbar-value').removeClass('ui-corner-left');
      });
   
    	uploader.bind('Error', function(up, err) {
    		//$('#upload_list')
        $('#' + err.file.id + " span.file-warning").html("Error: " + err.code +
    			", Message: " + err.message +
    			(err.file ? ", File: " + err.file.name : "") 
    			
    		);
    
    		up.refresh(); // Reposition Flash/Silverlight
    	});
    
    	uploader.bind('FileUploaded', function(up, file) {

    		file.li.title.unbind('click');
			file.li.title.unbind('mouseover');
			file.li.type.addClass('ok');
            file.li.addClass('green');
            file.li.warning.fadeOut("slow");
            //file.li.progress.fadeOut("slow");
            $('#' + file.id + " div.file-progress").fadeOut("slow");
            $('#' + file.id + " div.file-progress-bar").fadeOut("slow");
            $('#' + file.id + " span.file-progress-state").fadeOut("slow");
            	
    		if(file.kat == true){ //soll die Kategorie gesetzt werden
		        
		         sajax_do_call( 'wfMsUploadSaveKat', [file.name,wgPageName],
		         function (response) {
		             //alert(response.responseText);
		         });
		        
		     } //if
    		
    		$(document.createElement("a")).text(unescape('als Link einf\u00Fcgen')).click(function(e) { //click
  			   
  			    if(use_mslinks==true){
  			    	msu_vorlage_insert('{{#l:'+file.name+'}}','',''); // insert link		
  			    } else {
  			    	msu_vorlage_insert('[[:Datei:'+file.name+']]','',''); // insert link
  			    }
  			    
				
				
        	}).appendTo(file.li);
    		


            if (file.extension == "pic"){
        		  
        		gallery_arr.push(file.name);	
        		 if(gallery_arr.length>=2){
        		  		
        		  		gallery_insert.html('Bilder als Gallery einfügen').show().click(function(e) { //click
  			
							gallery_text = "Image:";
							gallery_text += gallery_arr.join("\nImage:");
							gallery_text +='\n';
							
							msu_vorlage_insert(gallery_text,'<gallery>\n\n','\n</gallery>\n'); 
							
        				});
        		  		
        		  } else {
        		  		
        		  	gallery_insert.html('');
        		  }

            		  
        		
        		$(document.createElement("span")).text(' | ').appendTo(file.li);
        		$(document.createElement("a")).text(unescape('als Bild einf\u00Fcgen')).click(function(e) { //click
        			
        			msu_vorlage_insert('[[Image:'+file.name+'|400px]]','','');
        			
        		}).appendTo(file.li);
        		
                
        	} else if (file.extension == "mov") { //pic  
        		  
        		
        		$(document.createElement("span")).text(' | ').appendTo(file.li);
        		$(document.createElement("a")).text(unescape('als Film einf\u00Fcgen')).click(function(e) { //click
        			
        			msu_vorlage_insert('[[Media:'+file.name+']]','','');
        			
        		}).appendTo(file.li);

        	} //movie
        		  
    	});
    	
    	
    	$('#upload_files').click(function(e) {
    		uploader.start();
    		e.preventDefault();
    	});
    	
    /*
    $('uploadfiles').onclick = function() {
          	uploader.start();
          	return false;
          };
        */
                
   uploader.init();
   
  
});//funktion


function check_extension(file,uploader){
        
        //file_li = file.li;
        file.li.warning.html("<img src='extensions/MsUpload/images/loading.png'>");

        sajax_do_call( 'wfMsUploadCheck', [file.name],
        function (response) {

        file.extension = response.responseText;
        
        if (file.extension == 1 || file.extension =='pic'){


            check_file(file.name,file.li);
            
                //Datei ist ein Bild
                if(file.extension == 'pic'){
                  file.li.type.addClass('picture');
                } 
        			
              		
	            file.li.cancel = $(document.createElement("span")).attr("class","file-cancel").attr("title","Upload abbrechen").click(function(e) {
	                file.li.fadeOut("slow");
	                uploader.removeFile(file);
	            }).appendTo(file.li);
	            
            	build(file); // alles aufbauen

            	
        	 } else if (file.extension == "") { //überprüfung hat zu lange gedauert
           
               check_extension(file,firsttime);
           	
        	 } else { // falscher Dateityp

            
             	file.li.warning.html('Es sind nur folgende Dateitypen erlaubt: '+response.responseText);
            
            	file.li.type.addClass('document');
            	file.li.addClass('yellow');
            	uploader.removeFile(file); //damit Datei nicht mehr hochgeladen wird
            	
            	file.li.click(function(e) { //bei klick li löschen
	                file.li.fadeOut("slow");
	            })

           }//else
    });
}

function check_file(filename,file_li){

          file_li.warning.html("<img src='extensions/MsUpload/images/loading.png'>");
          sajax_do_call( 'SpecialUpload::ajaxGetExistsWarning', [filename], 
        			function (result) {
        				warning = result.responseText;

        				if ( warning == '' || warning == '&nbsp;' ||warning =='&#160;') {
        				file_li.warning.html("Datei kann hochgeladen werden");

        				} else {
                // errorhandling
                warning = warning.substring(8);
                warning = warning.substring(0,warning.length-(warning.length-40));
                
                  if (warning == "<p>Eine Datei mit diesem Namen wurde sch" || warning == "Eine Datei mit diesem Namen wurde schon ") {
                    file_li.warning.html("Eine Datei mit diesem Namen wurde schon einmal hochgeladen und zwischenzeitlich wieder gelöscht.");
                  } else if(warning == "Eine Datei mit diesem Namen existiert be" || warning == "e Datei mit diesem Namen existiert berei") {
                    file_li.warning.html("Eine Datei mit diesem Namen existiert bereits. Beim Hochladen wird die alte Datei überschrieben.");
                  } else if(warning == " Dateiname beginnt mit <b>„IMG“</b>. Die") {
                    file_li.warning.html("Datei kann hochgeladen werden");
                  } else {
                    file_li.warning.html(warning);
                  }
                // errorhandling
             
                } //else
       				
        	});
}


function build(file){
   

      //fileindexer
      if(autoIndex){
        	// new Element('input', {name:'fi['+file.id+']', 'class':'check_index',type: 'checkbox', 'checked': true}).inject(file.ui.title, 'after');
    	  //new Element('span', {'class':'check_span',html: 'Index erstellen'}).inject(file.ui.title, 'after');
    	  //$(document.createElement("span")).attr("class","check_span").text('Index erstellen').appendTo(file_li);
    	  //$(document.createElement("span")).attr("class","check_span").text('Index erstellen').appendTo(file_li); 
    	  
      }

      //autokat
      if(autoKat){
      	file.kat = autoChecked; //vordefinieren
        if(wgNamespaceNumber==14){
        	
        	$(document.createElement("input")).attr({
        		'class':'check_index',	
        		type: 'checkbox',
        		'checked': autoChecked,
        		//name:'kat['+file.id+']',
        	}).change(function(e) {
	        
	          file.kat = this.checked; // speichern
	        
	        }).appendTo(file.li);
    	  	
    	  	$(document.createElement("span")).attr("class","check_span").text(wgPageName.replace(/_/g, " ")).appendTo(file.li); 
    	  
   
        }
      } 
      

    	file.li.title.mouseover(function() { //mouseover
			$(this).addClass('title_over');
    	 }).mouseleave(function() {		//mouseout	
    		$(this).removeClass('title_over');
  		}).click(function(e) { //click
  			
  			$(this).hide();
  			var input_change = $(document.createElement("input")).attr({
	          'class':'input_change',
	          size:file.name.length,
	          //id: 'input_change-'+file.id
	          name:'input_change',
	          value:file.name
        	}).insertAfter($(this));  
        
	        input_change.change(function(e) {
	        
	          file.name = this.value; //neuen namen speichern
	          check_file(this.value,file.li);
	        
	        });
  			
  		});

    file.li.append('<div class="file-progress"><div class="file-progress-bar"></div><span class="file-progress-state"></span></div>'); 
    
} 		  