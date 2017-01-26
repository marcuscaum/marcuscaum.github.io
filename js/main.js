var Main = (function() {

  function init() {
    $(document).on('keypress', function() {
      createDiv();
    })
  }

  function createDiv() {
    $ball = $('<div class="ball"></div>').css({
      'left': randomAttributes.width(),
      'top': randomAttributes.height(),
      'backgroundColor': randomAttributes.color()
    });


    $ball.appendTo('body').delay(500).fadeIn(100, function () {
      $(this).fadeOut(500, function() {
        $(this).remove();
      });
    });
  }

  var randomAttributes = {

    BALL_SIZE: 100,

    width: function () {
      return (Math.random() * ($(window).width() - this.BALL_SIZE)).toFixed() + 'px';
    },

    height: function () {
      return (Math.random() * ($(window).height() - this.BALL_SIZE)).toFixed() + 'px';
    },

    color: function () {
      var rgb = [];

      for(var i = 0; i < 3; i++) {
        rgb.push(Math.floor(Math.random() * 255));
      }

      return 'rgb('+ rgb.join(',') +')';
    }
  }

  return {
    init: init
  }
}());

Main.init();
