// ==UserScript==
// @name         吾爱破解论坛快捷举报
// @namespace    https://www.sanshuifeibing.com/
// @version      0.2
// @description  吾爱破解论坛快捷举报
// @author       三水非冰
// @match        https://www.52pojie.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// ==/UserScript==

(function () {
    let userName = $(".vwmy").children("a").text();
    let isHasPosts = getPostsStatus(userName);
    let btnLogin = getNodeByXpath("//*[@id=\"lsform\"]/div/div[1]/table/tbody/tr[2]/td[3]/button/em");
    let btnLogout = getNodeByXpath("//*[@id=\"um\"]/p[1]/a[6]");
    let reportUrl = "https://www.52pojie.cn/forum.php?mod=post&action=newthread&fid=15";
    if (isHasPosts) {
        reportUrl = getPostsUrl(userName);
    }
    if (window.location.href != reportUrl) {
        if (btnLogin == null && btnLogout != null) {
            let pid = $("#postlist div").eq(2).attr("id").replace("post_", "");
            let x = $("#pid" + pid).find("p:contains('举报')");
            let btnReportHtml = "<a href=\"javascript:;\" style=\"color:red;\" id=\"btnReport\">高级举报</a>";
            x.append(btnReportHtml);
            if (/收起/.test($("#ratelog_" + pid).find("th").text())) {
                $("#ratelog_" + pid).find("th:contains('收起')").children("a").click();
            }
            let author = getNodeByXpath("//*[@id=\"favatar" + pid + "\"]/div[1]/div/a");
            let createTime = getNodeByXpath("//*[@id=\"authorposton" + pid + "\"]");
            let postsInfo = { Author: author.innerHTML, CreateTime: createTime.innerText.replace("发表于", "").trim() };
            GM_setValue('info', postsInfo);
        }
    }
    else {
        if (isHasPosts == false) {
            getNodeByXpath("//*[@id=\"typeid_ctrl_menu\"]/ul/li[3]").click();
            getNodeByXpath("//*[@id=\"typeoption_Complaints_Evidence\"]").value = document.referrer;
            getNodeByXpath("//*[@id=\"typeoption_Complaints_ID\"]").value = GM_getValue('info').Author;
            getNodeByXpath("//*[@id=\"typeoption_Complaints_Time\"]").value = GM_getValue('info').CreateTime;
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
    function getNodeByXpath(xpath) {
        let result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
        return result.iterateNext()
    }
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
                //url= "https://www.52pojie.cn/forum.php?mod=post&action=reply&fid=15&tid="+reg.exec(txt);
            }
        });
        return url;
    }
})();