var curl = window.location.href;
var curl = curl.split("/");

setTimeout(function(){ 
    $('.loading').fadeOut();
}, 2000);

function topFunction() {
    $('html, body').animate({scrollTop:0}, 'slow');
}

if(curl[3] == 'support') {
    // CKEDITOR.replace( 'answer' );
}