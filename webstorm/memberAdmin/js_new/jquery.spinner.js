;(function ($) {
  $.fn.spinner = function () {
    return this.each(function () {
      var buycount = $(this).find(".buycount");
      var plus = $(this).find(".plus");
      var minus = $(this).find(".minus");
      buycount.keyup(function() {
        var number = parseInt(buycount.val());
        if (isNaN(number))
          number = 1;
        if (number < 1)
          number = 1;
        buycount.val(number);
      })
      plus.click(function() {
          var buycount = $(this).closest(".num").find(".buycount");
          var number = parseInt(buycount.val());
          number++;
        buycount.val(number);
      })
      minus.click(function() {
        var number = parseInt(buycount.val());
        number--;
        if (number <= 0){
          //weui.confirm("确定删除？");
          $(this).closest("li").remove();
        }
        buycount.val(number);
      })
    })
  }
})(jQuery);