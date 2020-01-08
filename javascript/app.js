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
        const codeProfile = getCode(CURRENT_ANSWERS).toUpperCase();

        console.log("Code----->"+codeProfile)
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
                            $(".js-question-screen").html(loadTemplate("#profile-template",{profile: _.sample(element.profileFem)}));
                        } else {
                            $(".js-question-screen").html(loadTemplate("#profile-template",{profile:_.sample(element.profileMen)}));
                        }  
                        anime({
                            targets: '.c-img-profile',
                            rotateY: 360,
                            duration: 5000
                        });
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
                var templateResult = compiledTemplate(arry[CURRENT_STEP]);
                $(".js-question-screen").html(templateResult);
                anime({
                    targets: '.js-answer',
                    translateY: 50,
                    opacity: 0,
                    direction: 'reverse',
                    delay: function(el, i, l) {
                      return i * 100;
                    },
                    easing: 'easeInCubic'
                  });

                CURRENT_STEP=CURRENT_STEP+1;
            } else {
                $(".js-question-screen").html( $("#button-analisis").html());
                anime({
                    targets: '#show-profile',
                    scale: 1.1,
                    rotate: '10deg',
                    direction: 'alternate',
                    loop: true,
                    easing: 'easeInOutSine'
                  });
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

    var templateSelector =  $(templateId).html();
    var compiledTemplate = _.template(templateSelector);
    var templateResult = compiledTemplate(value);

    return templateResult;
}

var getCode = function(arry){

    var A = 0;
    var B = 0;
    var C = 0;

    for (let index = 0; index < arry.length; index++) {
        if(arry[index]== "A"){
            A = A+1;
        } else if(arry[index]== "B"){
            B = B+1;
        } else {
            C = C+1;
        }
    }

   if ( A > B && A > C) { return "A"}
   if ( B > A && B > C) { return "B"}   
   
   return "C"
}


