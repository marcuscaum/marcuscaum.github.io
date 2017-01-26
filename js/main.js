var Main = (function() {

  function init() {
    $(".element").typed({
      strings: ["First sentence.", "Second sentence."],
      typeSpeed: 0
    });
  }


  return {
    init: init
  }
}());

Main.init();
