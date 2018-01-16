/**
 * Created by WHB on 2016/8/12.
 */
$(function(){
   /*顶部菜单控制*/
    $(".dot_block").on("touchend",function(e){
        e.stopPropagation();
        var nav_link = $(this).closest(".nav_block").find(".nav_link");
        if(nav_link.css("display")=="none"){
            nav_link.show();
        }else{
            nav_link.hide();
        }
    });

    $("body").on("touchend",function(){
        if($(".nav_link").css("display")=="block"){
            $(".nav_link").hide();
        }
    });

    $(".nav_link li a").on("touchend",function(e){
        e.stopPropagation();
    });

    /*返回上一页面*/
    $(".hd>a").on("touchend",function(){
        window.history.go(-1);
    });
});