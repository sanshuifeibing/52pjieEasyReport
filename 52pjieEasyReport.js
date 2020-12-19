// ==UserScript==
// @name         吾爱破解论坛快捷举报
// @namespace    https://www.sanshuifeibing.com/
// @version      0.2.5
// @description  对违法乱纪的帖子进行快捷举报，营造良好的技术学习氛围。
// @author       三水非冰
// @match        https://www.52pojie.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==

(function () {
    let userName = $(".vwmy").children("a").text();
    let isHasPosts = getPostsStatus(userName);
    let btnLoginText = $("button.pn.vm").find("em").text().trim();
    let btnLogoutText = $("#um").find("a").eq(7).text().trim();
    let reportUrl = "https://www.52pojie.cn/forum.php?mod=post&action=newthread&fid=15";
    if (isHasPosts) {
        reportUrl = getPostsUrl(userName);
    }
    if (window.location.href != reportUrl) {
        if (btnLoginText != "登录" && btnLogoutText == "退出") {
            let pid = $("#postlist div").eq(2).attr("id").replace("post_", "");
            let x = $("#pid" + pid).find("p:contains('举报')");
            let btnReportHtml = "<a href=\"javascript:;\" style=\"color:red;\" id=\"btnReport\">高级举报</a>";
            if ($("a.xw1").eq(0).text().trim() != userName && $("#postnum" + pid).find("b").text().trim() == "楼主") {
                x.append(btnReportHtml);
            }
            if (/收起/.test($("#ratelog_" + pid).find("th").text())) {
                $("#ratelog_" + pid).find("th:contains('收起')").children("a").click();
            }
            let author = $("#favatar" + pid + ".pls.favatar").find("a.xw1").text().trim();
            let createTime = $("#authorposton" + pid).text().replace("发表于", "").trim();
            let postsInfo = { Author: author, CreateTime: createTime };
            GM_setValue('info', postsInfo);
        }
    }
    else {
        if (isHasPosts == false) {
            $("#typeid_ctrl_menu").find("li").nextAll().eq(1).click();
            $("#typeoption_Complaints_ID").val(GM_getValue('info').Author);
            $("#typeoption_Complaints_Evidence").val(document.referrer);
            $("#typeoption_Complaints_Time").val(GM_getValue('info').CreateTime);
            //this.hideMenu('fwin_dialog', 'dialog');  //取消此行注释即开启屏蔽版规提醒，注意这是给熟悉版规的同学提供的哦，不熟悉的请乖乖看完版规，不然会被黑米拉进小黑屋@#￥！……&#%哦~
        }
        else {
            let h = $(document).height() - $(window).height();
            $(document).scrollTop(h);
            $("#fastpostmessage").css("background", "none");
            $("#fastpostmessage").val("帖子地址：" + document.referrer + "\n论坛账号：" + GM_getValue('info').Author + "\n事件发生时间：" + GM_getValue('info').CreateTime + "\n举报内容及理由：\n");
        }
        console.log("举报材料：");
        console.log("帖子地址：" + document.referrer);
        console.log("论坛账号：" + GM_getValue('info').Author);
        console.log("事件发生时间：" + GM_getValue('info').CreateTime);
    }
    $("#btnReport").click(function () {
        window.location.href = reportUrl;
    });
    function getPostsStatus(userName) {
        let ret = false;
        $.ajax({
            async: false,
            url: 'https://www.52pojie.cn/forum.php?mod=forumdisplay&fid=15&filter=author&orderby=dateline',
            success: function (data) {
                let dateNow = new Date().toLocaleDateString().replace(/\//g, "-");
                let postsListText = $(data).find("#threadlisttableid").children("tbody").nextAll().text().replace(/[\r\n]/g, "").replace(/[ ]/g, "");
                let index = postsListText.search(userName + dateNow);
                ret = (index != -1);
            }
        });
        return ret;
    }
    function getPostsUrl(userName) {
        let url;
        $.ajax({
            async: false,
            url: 'https://www.52pojie.cn/forum.php?mod=forumdisplay&fid=15&filter=author&orderby=dateline',
            success: function (data) {
                let txt = $(data).find("#threadlisttableid").find("th:contains('" + userName + "')").html();
                let reg = /(?<=tid=).*?(?=&)/;
                url = "https://www.52pojie.cn/forum.php?mod=viewthread&tid=" + reg.exec(txt);
            }
        });
        return url;
    }
})();