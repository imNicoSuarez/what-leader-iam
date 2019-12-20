var CURRENT_STEP=0;
var CURRENT_ANSWERS=[];
var CURRENT_GENDER="";

$(document).ready(function(){

    $(".js-question-screen").html(loadTemplate("#start-template")); 
    
    $('.js-question-screen').on("click", 'a#start', function(e){ 
        e.preventDefault();
        console.log('Hola tete')
        $(".js-question-screen").html(loadTemplate("#gender-selector")); 
    }); 

    $('.js-question-screen').on("click", 'a#finish', function(e){
        e.preventDefault();
        CURRENT_STEP=0;
        CURRENT_ANSWERS=[];
        CURRENT_GENDER="";
        $(".js-question-screen").html(loadTemplate("#start-template")); 

    }); 

    $('.js-question-screen').on("click", 'a.js-answer', function(e){
        e.preventDefault();
        console.log('Hola')
        CURRENT_ANSWERS.push($(this).data().optionAnswer);
        getdata();
        console.log('CURRENT ANSW: '+CURRENT_ANSWERS);
    }); 

    $('.js-question-screen').on("click", 'a.js-gender-selector', function(e){
        e.preventDefault();
        CURRENT_GENDER = $(this).data().gender
        console.log("Gender =>>>"+CURRENT_GENDER)
        getdata();
    });

    $('.js-question-screen').on("click", 'a#show-profile', function(e){
        e.preventDefault();
        const codeProfile = CURRENT_ANSWERS.join("").toUpperCase();
        $.ajax({
            url: 'data/data.json',
            dataType: 'json',
            type: "Get",
            success: function(respuesta) {
                var profiles = respuesta.profiles;
                for (let index = 0; index < profiles.length; index++) {
                    const element = profiles[index];
                    if(element.code==codeProfile){
                        console.log(CURRENT_GENDER)
                        if (CURRENT_GENDER == "F"){
                            $(".js-question-screen").html(loadTemplate("#profile-template",{profile: element.profileFem}));
                        } else {
                            $(".js-question-screen").html(loadTemplate("#profile-template",{profile:element.profileMen}));
                        }  
                    }
                }
            },
            error: function() {
                console.log("No se ha podido obtener la información");
            }
        });
    }); 

});



var getdata = function(){
    $.ajax({
        url: 'data/data.json',
        dataType: 'json',
        type: "Get",
        success: function(respuesta) {
            
            var arry = respuesta.qa;
        
            if (arry.length > CURRENT_STEP){
                var templateSelector =  $("#q-and-a").html();
                var compiledTemplate = _.template(templateSelector);
                console.log(arry[CURRENT_STEP]);
                console.log(arry.length)
                var templateResult = compiledTemplate(arry[CURRENT_STEP]);
                $(".js-question-screen").html(templateResult);
                CURRENT_STEP=CURRENT_STEP+1;
                console.log('CURRENT STEP: '+CURRENT_STEP);
            } else {
                $(".js-question-screen").html( $("#button-analisis").html());
            }
       
        },
        error: function() {
            console.log("No se ha podido obtener la información");
        }
    });
}


var loadTemplate = function(templateId,  data ) {
    if (typeof data == "undefined" ){
        var value =  {};
    } else {
        var value = data;
    }

    console.log('PASA 1')
    var templateSelector =  $(templateId).html();
    console.log('PASA 2')
    var compiledTemplate = _.template(templateSelector);
    console.log('PASA 3')
    var templateResult = compiledTemplate(value);
    console.log('PASA 4'+templateResult)

    return templateResult;
}