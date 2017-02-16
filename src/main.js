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
      randomAttributes.song();
      randomAttributes.storytellerMessages();
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
    },

    song: function () {
      var randomValue = Math.floor(Math.random() * 12) + 1;
      var snd = new Audio("sounds/piano/"+ randomValue +".wav"); // buffers automatically when created

      return snd.play();
    },

    storytellerMessages: (function () {

      var timeWindow = 500;
      var timeout;

      var storytellerMessages = function (context, args) {
        var MESSAGES = ["You should keep pressing...", "Who knows what can happen if you keep pressing?", "She pressed me once, once..", "Sometimes i can feel her inside my head, am i dreaming?"];

        var randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        $('#storyteller').html(randomMessage);
      };

      return function() {
        var context = this;
        var args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function(){
          storytellerMessages.apply(context, args);
        }, timeWindow);
      };
    }())
  }

  return {
    init: init
  }
}());

Main.init();
