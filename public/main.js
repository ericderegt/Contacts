$(document).ready(function(){

  $('.ui.dropdown').click(function(){
    $(this).dropdown('show');
  });

  $('a.item').click(function(){
    $('.item').removeClass('active');
    $(this).addClass('active');
  });

});