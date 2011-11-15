$(document).ready(function () {
     $('#msc_added .msc_entry').each(function(el){
     
     	  sortkey = $(this).attr("sortkey");
		  category = $(this).attr("category");
		  
          add_sortkey($(this),sortkey,category);
     
     }); //each
});

function add_sortkey(el,sortkey,category){

	if(sortkey == ''){sortkey = wgTitle}
	
	$(document.createElement("span")).attr("class","img_sortkey").attr("title",sortkey).click(function(e) { //click
        			
        	userInput = prompt(unescape('Hier bitte den Sortierschl%FCssel eingeben. Der Sortierschl%FCssel ist f%FCr die Sortierung in der Kategorie%FCbersicht relevant.'),sortkey);
            if (userInput != '' && userInput != null && userInput!= sortkey) {
	             sortkey = userInput;
	             el.attr("sortkey",sortkey);
	             el.children('.msc_checkbox').attr("value",category+'|'+sortkey); 
	             $(this).attr("title",sortkey);
            }			
    }).appendTo(el);

    return sortkey;  
}


function neu() {
catg_kat = '';

  for (l=4;l>0;l--){ // von hinten anfangen

      if (dd = document.getElementById('dd_'+l)) { //wenn element existiert
        if(dd.value!= 0) {
           catg_kat =dd.value;           
           break;
         }
       }
  }

  if (catg_kat != 0){
  catg_kat = '[[Kategorie:'+catg_kat+']]';
  }

  new_name = document.getElementById('new_name').value;
  name_kat = 'Kategorie:'+new_name;
  
  sajax_do_call( 'fnNewCategory', [name_kat,catg_kat],function (result) {
  
  	    warning = result.responseText;
        if (warning.substr(0,2) == 'no') {
        alert('Kategorie schon vorhanden');
        }else {
        getUnterkat(dd.value,l);
        alert('Kategorie erfolgreich angelegt');
        addKat(new_name);
        }
  	});
}

function addKat(new_kat) {

  if (new_kat==1) {
    for (l=4;l>0;l--){

        if (dd = document.getElementById('dd_'+l)) {
        
          if(dd.value!= 0) {
            new_kat = dd.value;
            break; //damit nur der hinterste wert genommen wird
          } 
  
        } //if
     } //for
     
   
  }
  if (new_kat!=1) {

		
        //var msc_added = document.getElementById("msc_added"); 
        var msc_added = $("#msc_added");
        
        var entry = $(document.createElement("div")).attr({
          'class':'msc_entry',
          category:new_kat,
          sortkey:'',
        }).text(new_kat).appendTo(msc_added); 	
        
        $(document.createElement("input")).attr({
          'class':'msc_checkbox',
          type:'checkbox',
          name:'SelectCategoryList[]',
          value:new_kat,
          'checked': true
        }).prependTo(entry);

        add_sortkey(entry,'',new_kat)
  } //newcat !=1        
}



function getUnterkat(kat,ebene){

  sajax_do_call( 'fnCategoryGetChildren', [kat], 
        			function (result) {
        			warning = result.responseText;
              
              //alte dropdowns löschen
              for (i=ebene+1;i<=4;i++){
                  if (child = document.getElementById('dd_'+i)) {
                    child.parentNode.removeChild(child); 
                  }
              }
              
              if (warning!="" && ebene<4) {
                createDD(warning,ebene+1);
              } 
              
              });

}

function createDD (str_werte,ebene)  {


  var werte = str_werte.split("|");
	// Select erstellen       

     var objSel = document.createElement("select");
     objSel.id = 'dd_'+ebene;
     
     objSel.onchange= function(){
        
        var sel = this.options[this.selectedIndex];
          if (sel != 0) {
            getUnterkat(sel.value,ebene);
          }
        
        };
          
          objSel.options[objSel.options.length] = new Option('---', 0);
           
          for (var i = 0; i < werte.length; ++i){
          
            objSel.options[objSel.options.length] = new Option(werte[i], werte[i]);
          }
      
    document.getElementById('sdd').appendChild(objSel);
    
}
