console.log('testing')


const testJquery = () => {
    if (typeof jQuery == 'undefined') {  
       console.log('not loaded')
    } else {
        console.log('we found it')
    }
}

testJquery();

$(".h3").click(function(){
    $(".h3").css("color", "red");
  });

  
