function Model(data){
  var self = this;



};



function View(model){
  var self = this;

  self.elements = {
    left: $('.payBlock'),
    right: $('.right'),
    addBtn: $('.addBtn'),

    date: $('.demo'),
    sum: $('.editSum'),
    type: $('.editType'),
    image: $('.editImage'),
    save: $('.editSave'),

    edit: $('.edit'),
    openGuest: $('.openGist')

  };


//==========Show-Hide==========

//----------Plus button----------
    self.addBtnShow = function (){
      var button = self.elements.addBtn;
      button.show();
    };

    self.addBtnHide = function (){
      var button = self.elements.addBtn;
      button.hide();
    };

//----------Right----------
    self.rightShow = function (){
      var right = self.elements.right;
      right.show();
    };

    self.rightHide = function (){
      var right = self.elements.right;
      right.hide();
    };


//==========Functions==========

  self.init = function (data) {
    self.elements.left.html(data);
    console.log('view');
  };

  self.initate = function (data) {
    self.elements.right.html(data);
    console.log('view');
  };


  self.open = function (data){
    var right = self.elements.right;
    right.html(data);
  };

  self.del = function (id) {
    $('#' + id).slideUp();
    return self.data;
  };

  self.add = function (data){
    var right = self.elements.right;
    right.html(data);
  };

  self.edit = function(doc) {
    var date = new Date(doc.date);
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    if(d<10) d = '0'+ d;
    if(m<10) m = '0'+ m;
    var result = m + '/' + d + '/' + y;
    
    self.elements.date.val(result);
    self.elements.sum.val(doc.sum);
    self.elements.type.val(doc.type);
    self.elements.save.val(doc._id);
    

    self.elements.openGuest.hide();
    self.elements.edit.show();
  }



};



function Controller(model, view){
  var self = this;
  var files;

  $(document).delegate( ".gistPaymentsHistory", "click", add);
  $(document).delegate( ".add", "submit", save);
  
  $(document).delegate( ".payment", "click", onEdit);
  $(document).delegate( ".edit", "submit", update);

  $(document).delegate( ".userBtn", "click", open);
  $(document).delegate( ".addCancel", "click", cancel);
  $(document).delegate( ".gistShelterHistory", "click", info);

  $(document).delegate('input[type=file]', 'change', function(){
    files = this.files;
    console.log(this.files)

  });

  $(document).delegate( ".navBtn", "click", nav);

  function open (){
    var id = $(this).attr('value');
    window.location.href = "/payments" + id;
    return false;
  };


  function nav(){
    var a = $(this).attr('value');
    console.log('function');
    $.session.remove('houseID');
    $.session.remove('userID');
    $.session.remove('room');
    $.session.remove('bed');
    $.session.remove('price');
    window.location.href = a
  };
//---------------ADD-------------------
  function add() {
    $('.openGist').hide();
    $('.add').show();
  };

//---------------CANCEL-------------------
  function cancel() {
    $('.add').hide();
    view.elements.edit.hide();
    $('.openGist').show();
  };

//---------------SAVE-------------------
  function save () {
    event.stopPropagation(); // Остановка происходящего
    event.preventDefault();  // Полная остановка происходящего
    var id = $('.addSave').val();
    var formEvent = $(this);
    // Создадим данные формы и добавим в них данные файлов из files
    var form = $('.add').serializeArray();

    var data = new FormData();

    for (var key in form){
      data.append(form[key].name, form[key].value)
    }

    console.log(form)
    console.log(data)
    if (files){
      $.each( files, function( key, value ){
        data.append( key, value );
      });
    }

    $.ajax({
        url: '/payments/add' + id,
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false, // Не обрабатываем файлы (Don't process the files)
        contentType: false, // Так jQuery скажет серверу что это строковой запрос
        statusCode: {
          200: function() {
            formEvent.html("Payment is saved").addClass('alert-success');
            window.location.href = '/payments' + id;
          },
          403: function(jqXHR) {
            var error = JSON.parse(jqXHR.responseText);
            $('.error', formEvent).html(error.message);
          }
        },
        error: function( jqXHR, textStatus, errorThrown ){
            console.log('ОШИБКИ AJAX запроса: ' + textStatus );
        }
    });
  };




  function info () {
    var id = $(this).attr('value');
    window.location.href = "/users"+id;
    return false;
  };

  function onEdit() {
    var id = $(this).val();
    $.ajax({
      url: '/payments/payment_' + id,
      type: 'GET'
    }).done(function(data){
      console.log(data)
      view.edit(data)
    })
  }

  function update() {
    var id = $('.editSave').val()
    var item = {};
    if (view.elements.date.val()) {
      item.date = view.elements.date.val()
    }
    if (view.elements.sum.val()) {
      item.sum = view.elements.sum.val()
    }
    if (view.elements.type.val()) {
      item.type = view.elements.type.val()
    }
    if (view.elements.image.val()) {
      item.image = view.elements.image.val()
    }
    $.ajax({
      url: '/payments/edit/payment_' + id,
      type: 'post',
      data: item
    }).done(function(data){
      console.log(data)
      view.edit(data)
    })
  }



};



$(function(){
  var model = new Model();
  var view = new View(model);
  var controller = new Controller(model, view);
});
