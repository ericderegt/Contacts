$(document).ready(function(){
  
  var template = $('script[data-id="template"]').text();
  var addtemplate = $('script[data-id="addtemplate"]').text();
  getContacts();

// AJAX call to populate main table
  function getContacts(){ 
    $.ajax({
      url: '/contacts',
      type: 'GET'
    }).done(function(contacts){
      var contactEls = contacts.map(function(indContact) {
        return Mustache.render(template, indContact);
      });
      $('tbody').append(contactEls);
    });
  };

// Add Contact Event Listener and Function
  // $('body')
 
// Semantic JS
  // $('.ui.dropdown').click(function(){
  //   $(this).dropdown();
  // });

  $('.ui.dropdown').dropdown({
    onChange: function(val){
      console.log(val);
    }
  });

  $('a.item').click(function(){
    $('.item').removeClass('active');
    $(this).addClass('active');
  });

  $('.ui.sticky').sticky({context: '.mainList'});

// Add Route
  function add(){
    var $right = $('.rightContent')
    $right.empty();
 
    $.ajax({
      url: '/categories',
      type: 'GET'
    }).done(function(categories){
      console.log(categories)
      var rendered = Mustache.render(addtemplate, {eachCat: categories});
      $right.append(rendered);
      
      $('[data-action="addContact"]').on("click",function(event){
          // Jeff's code from other example
          // var row = $(e.target).parents('tr');
          // var id = row.attr('data-id');

          // var client_name = row.find('[data-attr="client_name"]').text();
          // var amount = row.find('[data-attr="amount"]').text();

        $.ajax({
          url: '/contacts',
          type: 'POST',
          data: {
            "name": name,
            "email": email,
            "phone": phone,
            "city": city,
            "image_url": image_url,
            "categoryId": categoryId
          }
        }).done(function(data){
          var html = Mustache.render(template, data);
          $('tbody').prepend(html);
        })
      })
    });
  };

// Home Route
  function home(){
    var $main = $('.mainContent')
    $main.empty();
    var tableTemp = "<table class='ui celled table mainList'><thead><th>Name</th><th>Email</th><th>Phone</th></thead><tbody></tbody></table>";
    $main.append(tableTemp);
    getContacts();
  };

// About Route
  function about(){
    var $main = $('.mainContent')
    $main.empty();
    var $right = $('.rightContent')
    $right.empty();
    var aboutTemp = "Eric made this project";
    $main.append(aboutTemp);
  };

// Router
  var routes = {
      "/home": home,
      "/add": add,
      "/about": about
  }

  var router = Router(routes);

  router.init();

});