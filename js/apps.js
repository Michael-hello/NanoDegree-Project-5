$(document).ready(function() {

    var model = {
         folder : "imgs/",
         startNumber : 0,
         cat_counter : {},
         cat_names : {},
         cat_names_array : ["Cutey", "Beauty", "Beasty", "Meany", "DON'T MESS WITH ME", "George"]
    };


    var octopus = {            
            saveCatInfo : function(i){
                var id_name = "cat" + i;                  
                model.cat_counter[id_name] = 0; 
                model.cat_names[id_name] = model.cat_names_array[i];
                return id_name;
            },
            updateCatCount : function(cat){
                model.cat_counter[cat] += 1;
                return model.cat_counter[cat];
            },
            init : function(){
                view.init(model.folder);
            }      
    };


    var view = {
            init : function(folder){
                $.ajax({
                    url : folder,
                    success: function (data) {
                        $(data).find("a").attr("href", function (i, val) {
                            if( val.match(/\.(jpe?g|png|gif)$/) ) {
                                var id_name = octopus.saveCatInfo(i);
              
                                $(".cat-photos").append( "<img id='"+ id_name +
                                    "'class='img-responsive' src='"+ folder + val +"'>" ); 
                                view.addEventClick(id_name);
                            } 
                        });
                    }
                })           
            },          
            addEventClick : function(id_name){
                $( "#" + id_name ).click(function(e,id_name) { 
                    view.addEventClick(e, id_name);
                    view.renderClickedCat(e);
                })
                


                $(".click-count").text((function(cat) {                                              
                    return function() {
                        var num = octopus.updateCatCount(cat);
                        $(".big-cat").append("<h1>My name is: " + model.cat_names[cat] + "</h1>") 
                        
                                                   
                        return "Number of clicks: " + num;
                    };
                 })(id_name));
            },
            renderClickedCat : function(event){
                console.log(event.target.currentSrc);
                $(".big-cat").children().remove();                
                $(".big-cat").append("<h1 class='click-count'>Hello</h1>");
                $(".big-cat").append("<img class='img-responsive' src='"+ event.target.currentSrc +"'>");
            }
        };
  
    octopus.init();
});