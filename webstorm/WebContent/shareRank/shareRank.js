function responsiveFunc() {
    // var w = $(window).width();
    var w = window.innerWidth;
    var h = window.innerHeight;
    alert('屏幕宽----' + w);
    alert('屏幕高----' + h);
    var i = w / 1080;
    // alert('换算比例----' + i);
    var fontSize = 10 * i + 'px';
    // alert('字体大小----' + fontSize);
    $('#html').css({'font-size': fontSize});
    // $("#body").height($(window).height());
    // $("#body").width($(window).width())
}

function drawChart(rankList, colorList) {
    // var w = window.innerWidth;
    // alert('w===' + w);
    // var i = w / 1080;

    // var pointWidth = 59 * i;
    var pointWidth = 17.67;
    var chart1 = new Highcharts.Chart({
        credits: {enabled: false},
        chart: {renderTo: 'container', type: 'bar', backgroundColor: 'rgba(0,0,0,0)'},
        title: {style: {'color': 'rgba(0,0,0,0)'}},
        tooltip: {enabled: false},
        xAxis: {
            visible: false
        },
        yAxis: {
            visible: false
        },
        series: [{
            allowPointSelect: false,
            enableMouseTracking: false,
            data: rankList,
            borderRadius: pointWidth / 2,
            colorByPoint: true,
            pointPadding: 0,
            // color: '#e60012',
            colors: colorList,
            dataLabels: {enabled: false},
            showInLegend: false,
            pointWidth: pointWidth
        }]
    });
}

// function drawChart(containerId, percentage, chartColor) {
//     var data = [100];
//     //柱状图宽
//     if (percentage < 17) {
//         percentage = 17
//     }
//
//     var w = percentage * 0.7 + 'rem';
//     //柱状图高
//     var h = 5.9 + 'rem';
//     var svg = d3.select('#' + containerId).append("svg").attr("width", w).attr("height", h).attr('style', 'border-radius: 5.9rem');
//     svg.selectAll("rect").data(data).enter().append("rect").attr("x", 0).attr("y", function (d, i) {
//         return i * 30;
//     }).attr("width", function (d, i) {
//         return d * 10 + 'rem';
//     }).attr("height", h).attr("fill", chartColor);
// }

function appendLi(item, index) {
    // alert('item====' + item);
    var ul = $('.share_income_rank_list').get(0);
    var li = document.createElement('li');

    var html = '';
    var rank = 0;
    var points = 0;
    var headImg = defaultUserHeadImg;
    var name = '***';
    var percentage = 5;
    var mobile = '';
    var containerId = "container";
    var rankNumClassName = 'rank_num num';
    var chartColor = '#868686';

    if (!checkEmptyString(item.name)) {
        name = item.name;
        // alert('name====' + name);
    }
    if (!checkEmptyString(item.headImg)) {
        headImg = item.headImg;
    }
    if (!checkEmptyString(item.mobile)) {
        mobile = '(' + item.mobile + ')';
    }
    if (item.rank != null) {
        rank = item.rank;
        containerId += rank;
        rankNumClassName += rank;
        li.className = 'share_income_rank_item item' + rank;
        if (rank == 1) {
            chartColor = '#e60012';
        }
        if (rank == 2) {
            chartColor = '#ffae11';
        }
        if (rank == 3) {
            chartColor = '#15a6ef';
        }
    }
    if (item.points != null) {
        points = item.points;
    }
    if (item.percentage != null) {
        percentage = item.percentage;
    }

    html += '<span class="' + rankNumClassName + '">' + rank + '</span>';
    html += '<img class="rank_header_icon" src=' + headImg + '>';
    html += '<span class="rank_detail_box">';
    html += '<span class="rank_detail_header">';
    html += '<span class="user_name">' + name + '</span>';
    html += '<span class="user_phoneNum">' + mobile + '</span>';
    html += '</span>';
    // html += '<span class="container" id=' + containerId + '></span>';
    html += '<span class="user_zen_total">';
    html += '<img class="user_zen_total_icon" src="../skins/shareRank/img/icon_zenbi.png">';
    html += '<span class="user_zen_total_count">' + points + '</span>';
    html += '</span>';

    li.innerHTML = html;
    ul.appendChild(li, ul.childNodes[0]);
    // drawChart(containerId, percentage, chartColor)

}

function getData() {
    var params = JSON.stringify({type: 'total'});
    $.ajax({
        async: true,
        type: "POST",
        url: serverPath + getPersonalZenRankModule,
        contentType: "application/json; charset=utf-8",
        data: params,
        dataType: "JSON",
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("A-Common-Param", commonParamStr);
            request.setRequestHeader("A-Channel", apiKey);
            request.setRequestHeader("A-Timestamp", currentTime);
            request.setRequestHeader("A-Sign", sign);
        },
        success: function (data) {
            var msg = data.msg;
            var points = 0;
            var rank = 0;
            if (msg.points != null) {

                points = msg.points;
                // alert('points---'+points);
            }
            if (msg.rank != null) {

                rank = msg.rank;
                // alert('rank---'+rank);
            }
            // alert(rank);
            $('.personal_zen_total_count').html(points);
            $('.share_income_rank_count').html(rank);
        },
        error: function () {
            alert("获取个人排位失败");
        }
    });


    $.ajax({
        async: true,
        type: "POST",
        url: serverPath + getZenRankModule,
        contentType: "application/json; charset=utf-8",
        data: params,
        // contentType: "application/json; charset=utf-8",
        // data: {start: 0, limit: 12},
        dataType: "JSON",
        crossDomain: true,
        beforeSend: function (request) {
            request.setRequestHeader("A-Common-Param", commonParamStr);
            request.setRequestHeader("A-Channel", apiKey);
            request.setRequestHeader("A-Timestamp", currentTime);
            request.setRequestHeader("A-Sign", sign);
        },
        success: function (data) {
            var list = data.msg;
            var rankList = [];
            var colorList = [];
            var percentage = '';
            var count = 1;
            $.each(list, function (index, item) {
                if (count >= 10) {
                    $('#default_page ').css({display: 'none'})
                    $('#container ').css({display: 'block'});
                    $('.share_income_rank_list ').css({display: 'block'})
                } else {
                    $('#container ').css({display: 'none'});
                    $('.share_income_rank_list ').css({display: 'none'})
                }
                if (count <= 10) {
                    if (item.percentage != null) {
                        // alert('percentage=='+item.percentage);
                        if (item.rank == 1) {
                            percentage = item.percentage;
                        }
                        if (item.percentage / percentage < 0.3) {
                            rankList.push(percentage * 0.3);
                        } else {
                            rankList.push(item.percentage);
                        }
                    }
                    var rank = item.rank;
                    if (rank != null) {
                        if (rank == 1) {
                            colorList.push('#e60012')
                        } else if (rank == 2) {
                            colorList.push('#ffae11')
                        } else if (rank == 3) {
                            colorList.push('#15a6ef')
                        } else {
                            colorList.push('#868686')
                        }
                    }
                }

                if (count <= 10) {
                    appendLi(item, index);
                }
                count++;
            });
            drawChart(rankList, colorList);
            // return data.msg.list;
        },
        error: function () {
            alert("获取排行失败");
        }
    });

}
function initial() {
    getApiCommonDatas();
    getData();


    // var chart1;
    // $(document).ready(function () {
    //     chart1 = new Highcharts.Chart({
    //         credits: {enabled: false},
    //         chart: {renderTo: 'container', type: 'bar'},
    //         title: {style: {'color': '#ffffff'}},
    //         tooltip: {enabled: false},
    //         xAxis: {
    //             visible: false
    //         },
    //         yAxis: {
    //             visible: false
    //         },
    //         series: [{
    //             allowPointSelect: false,
    //             enableMouseTracking: false,
    //             data: [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100],
    //             borderRadius: 59 / 2,
    //             colorByPoint: true,
    //             pointPadding: 0,
    //             // color: '#e60012',
    //             colors: ['#e60012', '#ffae11', '#15a6ef', '#868686', '#868686', '#868686', '#868686', '#868686', '#868686', '#868686'],
    //             dataLabels: {enabled: false},
    //             showInLegend: false,
    //             pointWidth: 59,
    //             // pointStart:100,
    //             // pointRange:500
    //         }]
    //     });
    // });

    // var data = [50];
    // var w = 500;
    // var h = 59;
    // var svg = d3.select('#container').append("svg").attr("width", w).attr("height", h).attr('style', 'border-radius: 50');
    // svg.selectAll("rect").data(data).enter().append("rect").attr("x", 0).attr("y", function (d, i) {
    //     return i * 30;
    // }).attr("width", function (d, i) {
    //     return d * 10;
    // }).attr("height", 59).attr("fill", "#e60012");
}

$(function () {
    initial();
});