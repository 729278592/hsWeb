function loaded() {
    var i = 0;
    var myScroll = new IScroll('#banner_content', {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapSpeed: 400,
        keyBindings: true,
    });

    document.addEventListener('touchmove', function (e) {
    }, false);
    setInterval(move, 3000);

    function move() {

        if (i == 0) {
            myScroll.scrollToElement(document.querySelector('#banner_content li:nth-child(1)'), 2000);
        }
        if (i == 1) {
            myScroll.scrollToElement(document.querySelector('#banner_content li:nth-child(2)'), 2000);
        }
        if (i == 2) {
            myScroll.scrollToElement(document.querySelector('#banner_content li:nth-child(3)'), 2000);
        }
        if (i < 2) {
            i++;
        } else {
            i = 0
        }

    }
}

function addRankItems(data) {
    var ul = document.getElementById('pztrd_list');
    var li = document.createElement('li');
    li.className = 'pztrd_item';
    var html = '';
    var userName = '';
    var totalPoint = '';
    var rank = 0;
    var userHeadImg = '';
    if (data) {
        userName = data.userName;
        totalPoint = data.totalPoint;
        userHeadImg = data.userHeadImg;
        rank = data.rank + 1;
        var rankNumClassName = '';
        if (rank < 4) {
            rankNumClassName = 'num' + rank;
        }

        if (userHeadImg == '' || userHeadImg == null) {
            userHeadImg = "../skins/getZen/img/body_default.png";
        }

        html += ' <div class="pztrdi_icon">';
        html += ' <img class="pztrdii_image" src="' + userHeadImg + '"/>';
        html += ' </div>';
        html += ' <div class="pztrdi_title">';
        html += ' <div class="pztrdit_num ' + rankNumClassName + '">' + rank + '</div>';
        html += ' <div class="pztrdit_text">' + userName + '</div>';
        html += ' </div>';
        html += ' <div class="pztrdi_zen_count">';
        html += ' <div class="pztrdizc_icon">';
        html += ' <img class="pztrdizci_image" src="../skins/getZen/img/icon_zenbi_gry.png"/>';
        html += ' </div>';
        html += ' <div class="pztrdizc_num">' + totalPoint + '</div>';
        html += ' </div>';
    }
    li.innerHTML = html;
    ul.appendChild(li);
}

function initialRankDatas(type) {
    $.ajax({
        async: false,
        url: "../getZen4Weixin/rank.do?type="+type,
        type: "get",
        success: function (data) {
            var rankList = data.msg;
            $.each(rankList, function (index) {
                addRankItems(rankList[index]);
            });
        }
    });
}

function addRecordDiv(data, newGroupFlag) {
    var html = '';
    var group = data.group;
    var title = data.title;
    var date = data.date;
    var points = data.points;
    html += '';

    if (newGroupFlag) {
        html += ' <div class="pzic_title">' + group + '</div>';
        html += ' <div class="pzic_detail">';
        html += ' <div class="pzicd_title">' + title + '</div>';
        html += ' <div class="pzicd_date">' + date + '</div>';
        html += ' <div class="pzicd_point">' + points + '</div>';
        html += ' </div>';
    } else {
        html += ' <div class="pzic_detail">';
        html += ' <div class="pzicd_title">' + title + '</div>';
        html += ' <div class="pzicd_date">' + date + '</div>';
        html += ' <div class="pzicd_point">' + points + '</div>';
        html += ' </div>';
    }
    $('#personal_zen_income_record').append(html);
}

function initialIncomeRecords() {
    var group = "";
    var newGroupFlag = true;
    $.ajax({
        async: false,
        url: "../getZen4Weixin/record.do",
        type: "get",
        success: function (data) {
            var rankList = data.msg.list;
            $.each(rankList, function (index) {
                var item = rankList[index];
                if (group != item.group) {
                    group = item.group;
                    newGroupFlag = true;
                } else {
                    newGroupFlag = false;
                }
                addRecordDiv(item, newGroupFlag);
            });
        }
    });
}

function initialZenConditions() {
    $.ajax({
        async: false,
        url: "../getZen4Weixin/figure.do",
        type: "get",
        success: function (data) {
            var incomeInfo = data.msg;
            var totalIncome = incomeInfo.totalIncome;
            var available = incomeInfo.available;
            var spent = incomeInfo.spent;
            var dailyIncome = incomeInfo.dailyIncome;
            var weeklyIncome = incomeInfo.weeklyIncome;
            var monthlyIncome = incomeInfo.monthlyIncome;
            $("#pziti_num").html(totalIncome);
            $('#zen_total_count_daily').html(dailyIncome);
            $('#zen_total_count_weekly').html(weeklyIncome);
            $('#zen_total_count_monthly').html(monthlyIncome);
            $('#personal_zen_count_available').html(available);
            $('#personal_zen_count_maked').html(spent);
        }
    });
}


/**
 * 获得当前页面查询参数*/
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

function initial() {

    var uid = '';
    var token = '';
    var type = 'total';
    token = GetQueryString("token");
    uid = GetQueryString("uid");

    if (uid == '' || token == '') {
        $.post("../getZen/getLoginInfo.do?", function (obj) {
            if (obj && obj.uid && obj.token) {
                uid = obj.uid;
                token = obj.token;
            }
        }, 'json');
    }

    initialZenConditions(uid, token);

    //打开页面默认加载的总榜
    initialRankDatas(type);

    var ul = document.getElementById('pztrd_list');
    $("#personal_zen_total_rank_weekly").on('click', function () {
        var type = 'weekly';
        //toIndividualPropertyPage();
        $("#personal_zen_total_rank_weekly").css("background-image", "url(../skins/getZen4Weixin/img/btn_date_check.png)");
        $("#personal_zen_total_rank_monthly").css("background-image", "url(../skins/getZen4Weixin/img/btn_date_uncheck.png)");
        $("#personal_zen_total_rank_all").css("background-image", "url(../skins/getZen4Weixin/img/btn_date_uncheck.png)");

        //ul.remove('li');
        //清空前一个排行榜数据
        ul.innerHTML = '';
        initialRankDatas(type);
    });
    $("#personal_zen_total_rank_monthly").on('click', function () {
        var type = 'monthly';
        $("#personal_zen_total_rank_monthly").css("background-image", "url(../skins/getZen4Weixin/img/btn_date_check.png)");
        $("#personal_zen_total_rank_weekly").css("background-image", "url(../skins/getZen4Weixin/img/btn_date_uncheck.png)");
        $("#personal_zen_total_rank_all").css("background-image", "url(../skins/getZen4Weixin/img/btn_date_uncheck.png)");
        //toIndividualPropertyPage();
        //ul.remove('li');
        ul.innerHTML = '';
        initialRankDatas(type)
    });
    $("#personal_zen_total_rank_all").on('click', function () {
        var type = 'total';
        $("#personal_zen_total_rank_all").css("background-image", "url(../skins/getZen4Weixin/img/btn_date_check.png)");
        $("#personal_zen_total_rank_weekly").css("background-image", "url(../skins/getZen4Weixin/img/btn_date_uncheck.png)");
        $("#personal_zen_total_rank_monthly").css("background-image", "url(../skins/getZen4Weixin/img/btn_date_uncheck.png)");
        //toIndividualPropertyPage();
        //ul.remove('li');
        ul.innerHTML = '';
        initialRankDatas(type)
    });
    initialIncomeRecords(uid, token)
}


$(function () {
    loaded();
    initial();
});
