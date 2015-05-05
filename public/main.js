$(document).ready(function(){
// initialization and variable declaration

  var template = $('script[data-id="template"]').text();
  var addTemplate = $('script[data-id="addTemplate"]').text();
  var newTemplate = $('script[data-id="newTemplate"]').text();
  var newContactTemplate = $('script[data-id="newContactTemplate"]').text();
  var catTableTemplate = $('script[data-id="catTableTemplate"]').text();
  var catNameTemplate = $('script[data-id="catNameTemplate"]').text();
  var catRowTemplate = $('script[data-id="catRowTemplate"]').text();
  var cardTemplate = $('script[data-id="cardTemplate').text();
  var aboutTemplate = $('script[data-id="aboutTemplate').text();
  var modalTemplate = $('script[data-id="modalTemplate').text();
  var $right = $('.rightContent');
  var $main = $('.mainContent');
  getContacts();
  populateCategories();

///////////// Functions ///////////
///////////////////////////////////

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

//this is for the dropdown list of categories on the menu
  function populateCategories(){
    $.ajax({
      url: '/categories',
      type: 'GET'
    }).done(function(categories){
      $('.rightDropdown').empty();
      var categoryEls = categories.map(function(indCat){
        return Mustache.render(catNameTemplate, indCat);
      });
      $('.rightDropdown').append(categoryEls);
    });
  }

// This is the function for showing the category content in the right container that you can edit
  function showCategories(){
    $.ajax({
      url: '/categories',
      type: 'GET'
    }).done(function(categories){
      var categoryEls = categories.map(function(indCat){
        return Mustache.render(catRowTemplate, indCat);
      });
      $right.find('tbody').append(categoryEls);
    });
  }

// Welcome message
  function welcomeMessage(){
    $right.empty();
    var welcome = "<div class='ui tertiary sticky segment mainSticky'>Welcome to Contacts! Click on an individual contact for more information or click add to create a new category or contact. Sort contacts by category using sort menu on top right.</div>"
    $right.append(welcome);
  }

// Display contact
  function displayContact(id){
    $.ajax({
      url: '/contacts/' + id,
      type: 'GET'
    }).done(function(contact){
      var contactCard = Mustache.render(cardTemplate, contact);
      $right.empty();
      $right.append(contactCard);
    });
  }
 
///////////// Listeners ///////////
///////////////////////////////////

// UI Dropdown event listeners
  $('.ui.dropdown').dropdown({
    onChange: function(val){
      console.log(val);
    }
  });

  $right.on("click",".ui.dropdown",function(e){
    $(this).dropdown();
  })

  $('body').on("change","select",function(e){
    $(this).addClass('chosen');
  });

// Click contact event listener
  $('tbody').on("click",".indContact",function(e){
    var row = $(this).parents('tr');
    var id = row.attr('data-id');
    displayContact(id);
  })

// Top left menu click event listener
  $('a.item.main').click(function(){
    $('.item').removeClass('active');
    $(this).addClass('active');
  });

// Sort event listener
  $('.rightDropdown').on("click",".item",function(e){
    var id = parseInt($(this).attr('data-id'));
    console.log(id);

    $.ajax({
      url: '/contacts',
      type: 'GET'
    }).done(function(data){
      $('tbody').empty();
      var contactEls = data.map(function(indContact) {
        console.log(indContact.categoryId);
        if(indContact.categoryId === id) {
          return Mustache.render(template, indContact);
        };
      });
      $('tbody').append(contactEls);
    });
  });

// Delete Contact event listener and AJAX call
  $right.on("click","[data-action='deleteContact']",function(e){
    var id = $(this).parents('.ui.card').attr('data-id');

    $.ajax({
      url: '/contacts/' + id,
      type: 'DELETE'
    }).success(function(data){
      $('.mainList').find("[data-id='" + id + "']").remove();
      $right.empty();
      $right.append("Contact deleted!");     
    });
  })

// Edit Contact event listener and AJAX call
  $right.on("click","[data-action='editContact']",function(e){
    var id = $(this).parents('.ui.card').attr('data-id');
    var name = $right.find('[data-attr="name"]').text();
    var email = $right.find('[data-attr="email"]').text();
    var phone = $right.find('[data-attr="phone"]').text();
    var city = $right.find('[data-attr="city"]').text();
    
    $.ajax({
      url: '/contacts/' + id,
      type: 'PATCH',
      data: {
        "name": name,
        "email": email,
        "phone": phone,
        "city": city
      }
    }).success(function(data){
      $('.mainList').find("[data-id='" + id + "']").remove();
      var html = Mustache.render(template, data);
      $('tbody').prepend(html);
    });
  });

// Delete Category event listener and AJAX call
  $right.on("click","[data-action='deleteCategory']",function(e){
    var id = $(this).parents('tr').attr('data-id');

    $.ajax({
      url: '/categories/' + id,
      type: 'DELETE'
    }).success(function(data){
      $right.empty();
      $right.append("Category deleted!");
      var table = Mustache.render(catTableTemplate);
      $right.append(table);
      showCategories();     
    });
  })

// Edit Category event listener and AJAX call
  $right.on("click","[data-action='editCategory']",function(e){
    var id = $(this).parents('tr').attr('data-id');
    var name = $right.find("[data-id='" + id + "']").children()[0].innerText;
    console.log(name);
    
    $.ajax({
      url: '/categories/' + id,
      type: 'PATCH',
      data: {
        "name": name,
      }
    }).success(function(data){
      $right.empty();
      $right.append("Category edited!");
      var table = Mustache.render(catTableTemplate);
      $right.append(table);
      showCategories();   
    });
  });

///////////// Routes ///////////
///////////////////////////////////
// Add Route
  function add(){
    $right.empty();
 
    $.ajax({
      url: '/categories',
      type: 'GET'
    }).done(function(categories){
      console.log(categories)
      var rendered = Mustache.render(addTemplate, {eachCat: categories});
      $right.append(rendered);
      
      $('[data-action="addContact"]').on("click",function(e){
        e.preventDefault();

        var selected = $('select').val();
        // Fields for POST request
        var name = $right.find('[data-attr="name"]').val();
        var email = $right.find('[data-attr="email"]').val();
        var phone = $right.find('[data-attr="phone"]').val();
        var city = $right.find('[data-attr="city"]').val();
        var image_url = $right.find('[data-attr="image_url"]').val();
        var categoryId = $('form').find('option[data-name="' + selected + '"]').attr('data-id');
        console.log(categoryId);

        //AJAX POST call and prepend to main table
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
          var html = Mustache.render(newContactTemplate, data);
          $('tbody').prepend(html);
        })

      })
    });
  };

// New Category Routes
  function newCat(){
    $right.empty();
    var rendered = Mustache.render(newTemplate);
    $right.append(rendered);
    var table = Mustache.render(catTableTemplate);
    $right.append(table);
    showCategories();

    $('[data-action="addCategory"]').on("click",function(e){
      e.preventDefault();
      var name = $right.find('[data-attr="name"]').val();

      $.ajax({
        url: '/categories',
        type: 'POST',
        data: {"name": name}
      }).done(function(data){
        $right.empty();
        $right.append(table);
        showCategories();
      });
    });
  };

// Home Route
  function home(){
    $main.empty();
    var tableTemp = "<table class='ui celled table mainList'><thead><th>Name</th><th>Email</th><th>Phone</th></thead><tbody></tbody></table>";
    $main.append(tableTemp);
    getContacts();
    welcomeMessage();
  };

// About Route
  function about(){
    // var $main = $('.mainContent')
    // $main.empty();
    // var $right = $('.rightContent')
    // $right.empty();
    // $main.append(aboutTemplate);

    $('div[data-attr="item-modal"]').empty();
    $('main').append(Mustache.render(modalTemplate));
    $('div[data-attr="item-modal"]').modal('show');
  };

// Router
  var routes = {
      "/home": home,
      "/add": add,
      "/new": newCat,
      "/about": about,
      "/contacts": {"/:id": 
        {on: function(id){displayContact(id)}}
      }
  }

  var router = Router(routes);

  router.init();

});