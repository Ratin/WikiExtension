var gallery_arr = new Array();

$(document).ready(function () { //jquery       
	// Check that the toolbar is available
	if ( typeof $ != 'undefined' && typeof $.fn.wikiEditor != 'undefined' ) {
			//create upload button
			var upload_tab = $(document.createElement("span")).attr('class',"tab tab-msupload")
			.appendTo($('#wikiEditor-ui-toolbar .tabs'));

			var upload_button = $(document.createElement("span")).attr({ 
	        id: "upload_select",
	        title: mw.msg('msu-button_title')
	        }).append('<img src="'+msu_vars.path+'/images/button_upload.gif">').appendTo(upload_tab); 
			 
    		//create upload div  
    		var upload_container = $(document.createElement("div")).attr('id',"upload_container").insertAfter('#wikiEditor-ui-toolbar');
   			var upload_div = $(document.createElement("div")).attr("id","upload_div").appendTo(upload_container); 
	        var container_msu = 'upload_container';
	        $('#wikiEditor-ui-toolbar .tool .options').css('z-index', '2'); //headline dropdown
	      
	        
	} else { //only standard editor
		
	  var upload_button = $(document.createElement("a")).attr({ 
      id: "upload_select",
      title: mw.msg('msu-button_title')
      }).append('<img src="'+msu_vars.path+'/images/button_upload.gif">').appendTo("#toolbar"); 
	  
	  var upload_div = $(document.createElement("div")).attr("id","upload_div").insertAfter("#toolbar"); 
	  var container_msu = 'toolbar';
	  
	}//toolbar
	

    var status_div = $(document.createElement("div")).attr("id","upload_status").html('No runtime found.').appendTo(upload_div); 
    var upload_list = $(document.createElement("ul")).attr("id","upload_list").appendTo(upload_div);
    var start_button = $(document.createElement("a")).attr("id","upload_files").appendTo(upload_div).hide();
    var gallery_insert = $(document.createElement("a")).attr("id","gallery_insert").appendTo(upload_div).hide();
    

       var uploader = new plupload.Uploader({
    		//runtimes : 'html5,flash',
    		runtimes : 'html5,flash,silverlight,html4',
    		browse_button : 'upload_select',
    		container : container_msu,
    		max_file_size : '100mb',
    		drop_element: 'upload_drop',
    		unique_names: false,
    		
    		multipart_params: { "user": wgUserName, "kat": wgPageName} ,     
        
    		url : msu_vars.path+'/msupload.api.php',
    		flash_swf_url : msu_vars.path+'/js/plupload/plupload.flash.swf',
    		silverlight_xap_url : msu_vars.path+'/js/plupload/plupload.silverlight.xap'
    		
	     /*
	     // Specify what files to browse for
        filters : [
	            {title : "Image files", extensions : "jpg,gif,png"},
	            {title : "Zip files", extensions : "zip"}
        ],
        // resize pictures
        //resize : {width : 320, height : 240, quality : 90}
        */	
    	});
    
    	uploader.bind('Init', function(up, params) {
    		status_div.html("<b>Debug</b> runtime: " + params.runtime + " drag/drop: "+ (!!up.features.dragdrop));
    		if(msu_vars.debugMode == 'false') status_div.hide(); //hide status if debug mode is disabled

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
    		$.each(files, function(i, file){
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
        	start_button.text(mw.msg('msu-upload_this')).show();
        }else if(up.files.length>1){
        	start_button.text(mw.msg('msu-upload_all')).show();
        }else{
         	start_button.hide();
         	gallery_insert.hide();
        }
        up.refresh();
      });
      
     uploader.bind('StateChanged', function(up) {
		//status_div.append(' :'+plupload.STARTED);
		if(msu_vars.debugMode == 'true') console.log(up.state);
	});

     uploader.bind('BeforeUpload', function(up, file) {
    	
    	$('#' + file.id + " div.file-progress-bar").progressbar({value: '1'});
    	$('#' + file.id + " span.file-progress-state").html("0%");
     });
      
     uploader.bind('UploadProgress', function(up, file) {
    	
    		$('#' + file.id + " span.file-progress-state").html(file.percent + "%");
        	$('#' + file.id + " div.file-progress-bar").progressbar({value: file.percent});
      		$('#' + file.id + ' div.file-progress-bar .ui-progressbar-value').removeClass('ui-corner-left');
      });
   
     uploader.bind('Error', function(up, err) {
    		
        	$('#' + err.file.id + " span.file-warning")
        	.html("Error: " + err.code +", Message: " + err.message + (err.file ? ", File: " + err.file.name : ""));
        	
    		status_div.append(err.message);
    		up.refresh(); // Reposition Flash/Silverlight
     });
    
     uploader.bind('FileUploaded', function(up, file, success) {

		if(msu_vars.debugMode == 'true') console.log(success);
		
		
		file.li.title.unbind('click');
		file.li.title.unbind('mouseover');
			
        $('#' + file.id + " div.file-progress").fadeOut("slow");
        $('#' + file.id + " div.file-progress-bar").fadeOut("slow");
        $('#' + file.id + " span.file-progress-state").fadeOut("slow");
            
            
		try{
			result = jQuery.parseJSON( success.response );
			//alert(result.upload.result);
			/*{"upload":{"result":"Success",
						"filename":"Msupload_v8.4.jpg",
						"imageinfo":{
							"timestamp":"2012-02-28T14:52:05Z",
							"user":"L\u00fctz",
							"userid":4,
							"size":35491,
							"width":865,
							"height":292,
							"parsedcomment":"MsUpload",
							"comment":"MsUpload",
							"url":"...",
							"descriptionurl":"...",
							"sha1":"...",
							"metadata":...,
							"mime":"image\/jpeg",
							"mediatype":"BITMAP",
							"bitdepth":8
			}}}*/
			
			file.li.type.addClass('ok');
            file.li.addClass('green');
            file.li.warning.fadeOut("slow");

    		if(file.kat == true){ //soll die Kategorie gesetzt werden
		        
		         sajax_do_call( 'wfMsUploadSaveKat', [file.name,wgPageName],function (response) {
		             //alert(response.responseText);
		         });
		        
		     } //if
    		
    		$(document.createElement("a")).text(mw.msg('msu-insert_link')).click(function(e) { //click
  			    if(msu_vars.use_mslinks == 'true'){
  			    	msu_vorlage_insert('{{#l:'+file.name+'}}','',''); // insert link		
  			    } else {
  			    	msu_vorlage_insert('[[:Datei:'+file.name+']]','',''); // insert link
  			    }
  			    
        	}).appendTo(file.li);
    		
            if (file.group == "pic"){
        		  
        		gallery_arr.push(file.name);	

        		  		
        		  if(gallery_arr.length== 2){ //only at first time add click function
	        		  		gallery_insert.click(function(e) { //click
	  			
	  							add_gallery(); //to take always the actual list

	        				}).text(mw.msg('msu-insert_gallery')).show();
        		  } else if(gallery_arr.length< 2) {
        		  		
        		  	gallery_insert.html('');
        		  }

        		$(document.createElement("span")).text(' | ').appendTo(file.li);
        		$(document.createElement("a")).text(mw.msg('msu-insert_picture')).click(function(e) { //click
        			
        			msu_vorlage_insert('[[Image:'+file.name+'|400px]]','','');
        			
        		}).appendTo(file.li);
        		
                
        	} else if (file.group == "mov") { //mov  
        		  
        		
        		$(document.createElement("span")).text(' | ').appendTo(file.li);
        		$(document.createElement("a")).text(mw.msg('msu-insert_movie')).click(function(e) { //click

        			msu_vorlage_insert('[[Media:'+file.name+']]','','');
        			
        		}).appendTo(file.li);

        	} //movie
        	
        	
        	
        }catch(e){//try
			
			file_error(file,"Error: " + success.response.replace(/(<([^>]+)>)/ig,"")); //remove html tags
			file.li.type.addClass('error');

		}			  
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

function add_gallery(){
	gallery_text = "Image:";
	gallery_text += gallery_arr.join("\nImage:");
	gallery_text +='\n';
	msu_vorlage_insert(gallery_text,'<gallery>\n\n','\n</gallery>\n'); 
}

function check_extension(file,uploader){
		if(msu_vars.debugMode == 'true') console.log(file);
		
        file.li.warning.html("<img src='"+msu_vars.path+"/images/loading.png'>");
		file.extension = file.name.split('.').pop().toLowerCase();

		if($.inArray(file.extension, wgFileExtensions) != -1) {
		    
		    switch(file.extension) {

       	 	  case 'jpg': case 'jpeg': case 'png': case 'gif': case 'bmp': case 'tif': case 'tiff': //pictures
       	 		file.group = "pic";
       	 		file.li.type.addClass('picture');
            	break;
			  case 'mov':
       	 		file.group = "mov";
             	break;
        	//case 'pdf':
            /* handle */
            //break;
    		}
    		
            check_file(file.name,file.li);
                   				
	        file.li.cancel = $(document.createElement("span")).attr("title",mw.msg('msu-cancel_upload')).click(function(e) {
	                file.li.fadeOut("slow");

	                if (file.group == "pic"){
					 	var idx = gallery_arr.indexOf(file.name); // Find the index
					 	if(idx!=-1) gallery_arr.splice(idx, 1); // Remove it if really found!
        			}
        			uploader.removeFile(file);
	        }).attr("class","file-cancel").appendTo(file.li);
	            
            build(file); // alles aufbauen
            	

      } else { // falscher Dateityp

            file_error(file,mw.msg('msu-ext_not_allowed')+' '+wgFileExtensions.join(','));
            uploader.removeFile(file); //damit Datei nicht mehr hochgeladen wird
             	
      }//else
}

function check_file(filename,file_li){
		 	
          file_li.warning.html("<img src='"+msu_vars.path+"/images/loading.png'>");
          sajax_do_call( 'SpecialUpload::ajaxGetExistsWarning', [filename], 
        		function (result) {
        				
        		warning = result.responseText;

        		if ( warning == '' || warning == '&nbsp;' ||warning =='&#160;') {
        				file_li.warning.text(mw.msg('msu-upload_possible'));

        		} else {
                // errorhandling
                warning = warning.substring(8);
                warning = warning.substring(0,warning.length-(warning.length-40));
                
                  if (warning == "<p>Eine Datei mit diesem Namen wurde sch" || warning == "Eine Datei mit diesem Namen wurde schon ") {
                    file_li.warning.html("Eine Datei mit diesem Namen wurde schon einmal hochgeladen und zwischenzeitlich wieder gelöscht.");
                  } else if(warning == "Eine Datei mit diesem Namen existiert be" || warning == "e Datei mit diesem Namen existiert berei") {
                    file_li.warning.html("Eine Datei mit diesem Namen existiert bereits. Beim Hochladen wird die alte Datei überschrieben.");
                  } else if(warning == " Dateiname beginnt mit <b>„IMG“</b>. Die") {
                    file_li.warning.html(mw.msg('msu-upload_possible'));
                  } else {
                    file_li.warning.html(warning);
                  }
                // errorhandling
             
                } //else
       				
        	});
}

function file_error(file,error_text){
	
	file.li.warning.text(error_text);
    //file.li.type.addClass('document');
    file.li.addClass('yellow');

    file.li.click(function(e) { //bei klick li löschen
	   file.li.fadeOut("slow");
	})
	
}


function build(file){
   

      //fileindexer
      //if(autoIndex){
        	// new Element('input', {name:'fi['+file.id+']', 'class':'check_index',type: 'checkbox', 'checked': true}).inject(file.ui.title, 'after');
    	  //new Element('span', {'class':'check_span',html: 'Index erstellen'}).inject(file.ui.title, 'after'); 
      //}

      //autokat
      if(msu_vars.autoKat){
      	file.kat = false;
        if(wgNamespaceNumber==14){ //category page
        	
        	if(msu_vars.autoChecked=='true')  file.kat = true; //predefine

        	$(document.createElement("input")).attr({
        		'class':'check_index',	
        		type: 'checkbox',
        		'checked': file.kat
        	}).change(function(e) {
	        
	          file.kat = this.checked; // save
	        
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