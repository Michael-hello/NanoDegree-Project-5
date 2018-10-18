$(document).ready(function() {

    var model = {
         currentId : "cat0",
         folder : "imgs/",
         startNumber : 0,
         cat_counter : {},
         cat_names : {},
         src : {},
         cat_names_array : ["Cutey", "Beauty", "Beasty", "Meany", "DON'T MESS WITH ME", "George"],

         init : function(){
            octopus.currentCat("cat0");
         }
         
    };


    var octopus = {            
            saveCatInfo : function(i, src){
                var id_name = "cat" + i;                  
                model.cat_counter[id_name] = 0; 
                model.cat_names[id_name] = model.cat_names_array[i];
                model.src[id_name] = model.folder + src;
                return id_name;
            },
            updateCatCount : function(cat){
                model.cat_counter[cat] += 1;
                console.log("number of clicks is "+ model.cat_counter[cat]);
                return model.cat_counter[cat];
            },
            saveButtonDetails : function(name, file, clicks, id_name){
                model.cat_names[model.currentId] = name;
                model.src[model.currentId] = file;
                model.cat_counter[model.currentId] = Number(clicks) - 1; //to account for view.rtrnText adding +1
                console.log(model.currentId);
                view.renderBigCat(model.currentId);
                view.rtrnText(model.currentId);
            },
            currentCat : function(id_name) {
                model.currentId = id_name;
                console.log("Current cat is " + model.currentId);
            },
            init : function(){
                model.init();
                view.init(model.folder);
                view.renderAdmin();
            }      
    };


    var view = {
            init : function(folder){
                $.ajax({
                    url : folder,
                    success: function (data) {
                        $(data).find("a").attr("href", function (i, val) {
                                if(val.indexOf(".jpg") !== -1){
                                    var id_name = octopus.saveCatInfo(i, val);
                                    view.render(id_name, folder, val);                                            
                                }
                        });                        
                    }
            })},
            
            render : function(id_name, folder, val){
                $(".cat-photos").append( "<img id='"+ id_name +
                "'class='img-fluid' src='"+ folder + val +"'>" ); 
                             
                $( "#" + id_name ).click((function(id_name) { 
                    return function() {
                        view.renderBigCat(id_name);
                        view.rtrnText(id_name);
                }})(id_name))
            },
          
            renderBigCat : function(id_name){
                
                $(".rmve").remove();
                $(".big-cat").prepend("<h1 class='rmve'>My name is: " + model.cat_names[id_name] + "</h1>");                
                $(".big-cat").prepend("<h1 class='click-count rmve'>Hello</h1>");
                $(".big-cat").prepend("<img class='img-fluid bigImage rmve' src='"+ model.src[id_name] +"'>");
                $("#input-cat-name").val(model.cat_names[id_name]);
                $("#input-file-name").val(model.src[id_name]);
                $("#input-clicks").val(model.cat_counter[id_name]);
                octopus.currentCat(id_name);
                view.addClickEvent(id_name);                                
            },
            
            addClickEvent : function(id_name){
                $(".bigImage").click((function(id_name) { 
                    return function() {
                        view.rtrnText(id_name);                         
                }})(id_name))
            },

            rtrnText : function(id_name){
                var numb = octopus.updateCatCount(id_name);
                $(".click-count").text(function() {
                    $("#input-clicks").val(numb); 
                    return "Number of clicks: " + numb;
                });
            },

            renderAdmin : function(){
                $("#admin").click(function() {
                    $("#admin-details").toggleClass("hidden") });
                
                $("#save").click(function() {
                    var name = $("#input-cat-name").val();
                    var file = $("#input-file-name").val();
                    var clicks = $("#input-clicks").val();
                    console.log(name, file, clicks);
                    octopus.saveButtonDetails(name, file, clicks);
                    $("#admin-details").toggleClass("hidden") });
                    
                $("#cancel").click(function() {
                    $("#admin-details").toggleClass("hidden") });
            }


        };
    
    var initialCats = [
        {
            clickCount : 0,
            name : 'Henry',
            level : 'Baby',
            imgSrc : 'imgs/5363623234_3576e29a18_o.jpg'            
        },
        {
            clickCount : 0,
            name : 'Geoff',
            level : 'Baby',
            imgSrc : 'imgs/cat2.jpg' 
        },
        {
            clickCount : 0,
            name : 'Bob',
            level : 'Baby',
            imgSrc : 'imgs/cat1.jpg' 
        }
    ]    

    var Cat = function(data) {
        this.level = ko.observable(data.level);
        this.clickCount = ko.observable(data.clickCount);
        this.name = ko.observable(data.name);
        this.imgSrc = ko.observable(data.imgSrc);
    };

    var ViewModel = function() {
        var self = this;
        this.catList = ko.observableArray([]);

        initialCats.forEach(function(catItem){
            self.catList.push( new Cat(catItem) );
        });

        this.currentCat = ko.observable(this.catList()[0]);

        this.clickCounter = function() {
            this.clickCount(this.clickCount() + 1);
            if (this.clickCount() >= 11)
                this.level("Teen");
            if (this.clickCount() >= 25)
                this.level("Adult");
        };
        
        this.changeCat = function() {
            self.currentCat(this);
        };

    };
        

    



    //octopus.init();
    ko.applyBindings(new ViewModel());
});
