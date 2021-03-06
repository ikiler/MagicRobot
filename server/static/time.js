/*

* 获取农历日期

 */
var CalendarData = new Array(100);
var madd = new Array(12);
var numString = "一二三四五六七八九十";
var monString = "正二三四五六七八九十冬腊";
var cYear, cMonth, cDay, TheDate;

// 农历每月仅仅能是29或30天，一年用12(或13)个二进制位表示，从高到低，相应位为1表示30天，否则29天
CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);

madd[0] = 0;
madd[1] = 31;
madd[2] = 59;
madd[3] = 90;
madd[4] = 120;
madd[5] = 151;
madd[6] = 181;
madd[7] = 212;
madd[8] = 243;
madd[9] = 273;
madd[10] = 304;
madd[11] = 334;

var weekday = new Array(7)
weekday[0] = "星期日"
weekday[1] = "星期一"
weekday[2] = "星期二"
weekday[3] = "星期三"
weekday[4] = "星期四"
weekday[5] = "星期五"
weekday[6] = "星期六"

function GetBit(m, n) {
    return (m >> n) & 1;
}


function e2c() {
    TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
    var total, m, n, k;
    var isEnd = false;

    var tmp = TheDate.getYear();

    if (tmp < 1900) {
        tmp += 1900;
    }

    total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;
    if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
        total++;
    }


    for (m = 0; ; m++) {
        k = (CalendarData[m] < 0xfff) ? 11 : 12;
        for (n = k; n >= 0; n--) {
            if (total <= 29 + GetBit(CalendarData[m], n)) {
                isEnd = true;
                break;
            }

            total = total - 29 - GetBit(CalendarData[m], n);

        }
        if (isEnd) break;
    }


    cYear = 1921 + m;

    cMonth = k - n + 1;

    cDay = total;

    if (k == 12) {
        if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
            cMonth = 1 - cMonth;
        }

        if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
            cMonth--;
        }

    }
}


function GetcDateString() {
    var tmp = "";

    if (cMonth < 1) {
        tmp += "(闰)";
        tmp += monString.charAt(-cMonth - 1);
    } else {
        tmp += monString.charAt(cMonth - 1);
    }

    tmp += "月";
    tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十"));
    if (cDay % 10 != 0 || cDay == 10) {
        tmp += numString.charAt((cDay - 1) % 10);
    }

    return tmp;
}


function GetLunarDay(solarYear, solarMonth, solarDay) {
    if (solarYear < 1921 || solarYear > 2020) {
        return "";
    } else {
        solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
        e2c(solarYear, solarMonth, solarDay);
        return GetcDateString();
    }
}
function showClock()
{
    var d = new Date;
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var ampm = "";
    if (h>12)
    {
        h = h-12;
        ampm = " PM";
    }
    else
    {
        ampm = " AM";
    }

    var templateStr = '{HH}<span id="ch1">:</span>{MM}<span id="ch2">:</span>{SS}'+ampm;
    templateStr = templateStr.replace("{HH}", getDD(h));
    templateStr = templateStr.replace("{MM}", getDD(m));
    templateStr = templateStr.replace("{SS}", getDD(s));
            
    var nongli = GetLunarDay(year, month, day);
    var mWeek = weekday[d.getDay()];
    var mData =nongli+"</br>" + mWeek + "  "+ year + "年" + month + "月" + day + "日 "+"</br>";
    // var obj = $("#"+id);
    var time =  $("#time");
    var data = $("#data");

    time.css("fontSize", "50px");
    time.css("fontFamily","Microsoft JhengHei, Century gothic, Arial");
    time.css("fontWeight","bold");
            
    //change reading
    data.html(mData);
    time.html(templateStr);
    //toggle hands
    time.find("#ch1").fadeTo(800, 0.1);
    time.find("#ch2").fadeTo(800, 0.1);
    setTimeout(function(){showClock()}, 1000);
}

function getDD(num)
{
    return (num>=10)?num:"0"+num;
}
showClock();
// var myDate = new Date();
// var yy = myDate.getFullYear();
// var mm = myDate.getMonth() + 1;
// var dd = myDate.getDate();
// var nongli = GetLunarDay(yy, mm, dd);
// var time = document.getElementById("time");
// var mWeek = weekday[myDate.getDay()];

// var currentTime =mWeek+"  "+ yy + "年" + mm + "月" + dd + "日";
// time.innerText = currentTime+"\n农历："+ nongli;