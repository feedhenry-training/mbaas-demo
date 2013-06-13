(function($) {
  $(function() {
    // Custom Select
    $("select[name='herolist']").selectpicker({style: 'btn-primary', menuStyle: 'dropdown-inverse'});
    app.events();
  });
  
})(jQuery);

var app = {
   events : function(){
      $('#emailShow').on('click', this.showPopup);
      $('#smsShow').on('click', this.showPopup);
      $('#dbShow').on('click', this.showPopup);
      $('#dataShow').on('click', this.showPopup);
     $('#dbShow').on('click', this.showPopup);
      $('#modalScreen').on('click', this.hidePopup)
      $('.actionLink').on('click', this.doAction);
      $('#showDataLink').on('click', this.showData);
      $('#showDbLink').on('click', this.showDb);
   },
   hidePopup : function(){
     $('#modalScreen').hide();
     $('.popup').hide();
   },
   showPopup : function(){
      window.scrollTo(0,0);
      $('input, select, textarea').val(""); // replace any previous content

      var id = this.id,
      popupId = id.replace("Show", "Popup");

      $('.popup').hide();
      $('#' + popupId).show();
      $('#modalScreen').show();
   },
   doAction : function(){
     var id = this.id;
     app[id].call(app, []);
     app.hidePopup();
   },
   emailLink : function(){
     app.doAct({
      act : 'email',
      to : $('input[type=email]').val(),
      body : $('#emailBody').val()
     }, function(err, res){
        if (err){
          alert(err.msg);
        }
     });
   },
   smsLink : function(){
     app.doAct({
       act : 'sms',
       to : $('select').val() + $('input[type=number]').val(),
       body : $('#smsBody').val()
     }, function(err, res){
       if (err){
         alert(err.msg);
       }
       if (res.ok){
         alert("Message sent!");
       }
     });
   },
  showData : function(){
    var self = this;
    app.doAct({
      act : 'data'
    }, function(err, res){
      if (err){
        alert(err.err);
        return;
      }
      var data = res.contents;
      self.s3 = data;
      $('#dataLink').show();
      $('#showDataLink').hide();

      $('#s3List').empty();
      for (var i=0; i<data.length; i++){
        var d = data[i];
        $('#s3List').append('<li data-index="' + i + '">' + d.Key + '</li>');
      }

      $('#s3List li').on('click', function(){
        var index = $(this).attr('data-index');
        var bucket = self.s3[parseInt(index)];
        $fh.webview({
          'act': 'open',
          'url': 'https://s3.amazonaws.com/cianstestbucket/' + bucket.Key,
          'title': 'S3 File'
        }, function(res) {
          if (res === "opened") {
            //webview window is now open
          }
          if (res === "closed") {
            //webview window is now closed
          }
        }, function(msg, err) {

        });


      });

    });
  },
   dataLink : function(){
     $('#dataLink').hide();
     $('#showDataLink').show();
   },
   dbLink : function(){
     $('#dbLink').hide();
     $('#showDbLink').show();
   },
   showDb : function(){
     app.doAct({
       act : 'db'
     }, function(err, data){
       if (err){
         alert(err.err);
         return;
       }
       $('#dbLink').show();
       $('#showDbLink').hide();

       $('#oracleList').empty();
       for (var i=0; i<data.length; i++){
         var d = data[i];
         $('#oracleList').append('<li>' + d.key + '</li>');
       }

     });
   },
   doAct : function(req, cb){
      $fh.act({
        act : req.act,
        req : req
      }, function(res){
        return cb(null, res);
      }, function(err){
        return cb(err);
      })
   }
};