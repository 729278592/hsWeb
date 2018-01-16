$(function() {
    $.post("../publish/reportInfo.do?", function (data) {
        if (data && data.img) {
            $("#userimg").attr('src',"http://" + hs_url + "/zenlife_origin/data/publishImg/"+data.img);
            $("#comment").val(data.comment);
        }
    }, 'json');
});