/**
 * Created by v5njj on 16/3/29.
 */


$(function() {
    $.ajaxSetup({
        'timeout': 5000
    });
    // var fromId = getQueryString("fId");

    var showUrl = getQueryString("showUrl");


    /**
 * Created by v5njj on 16/3/29.
 */


$(function() {
    $.ajaxSetup({
        'timeout': 5000
    });
    var fromId = getQueryString("fId");

    var showUrl = getQueryString("showUrl");


    if (is_weixn()){
       //var redir = mpServerPath + '/auth/mpOAuth?redirectUrl=' + encodeURIComponent(staticServicePath + '/second.html?');
    	var redir = mpServerPath + '/auth/mpOAuth?redirectUrl=' + encodeURIComponent(staticServicePath + '/secondbkAll.html?');
        if (fromId != null && fromId != '') {
            // alert('first_iframe fromId = ' + fromId)
            redir = redir + 'fId='+fromId  + '&showUrl=' + showUrl ;
            

        } else {
            redir = redir + 'showUrl=' + showUrl ;
        }
        // alert('first_iframe redir = ' + redir)
        window.location.href = redir
    } else {
        document.getElementById("first_iframe").src = showUrl;
        if (fromId != null && fromId != ""){
            // alert("from user penID :" + fromId );
            var param = JSON.stringify({ 'url': showUrl, 'fromUid': "0034f25521b975d281762a0c389b10da" });
            processClick(param);
        }

    }
    //alert(srcUrl)
});

    //alert(srcUrl)
});
