// ==UserScript==
// @name         吾爱破解论坛快捷举报
// @namespace    https://www.sanshuifeibing.com/
// @version      0.1
// @description  吾爱破解论坛快捷举报
// @author       三水非冰
// @match        https://www.52pojie.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    var btnLogin = getNodeByXpath("//*[@id=\"lsform\"]/div/div[1]/table/tbody/tr[2]/td[3]/button/em");
    var btnLogout = getNodeByXpath("//*[@id=\"um\"]/p[1]/a[6]");
    var reportUrl = "https://www.52pojie.cn/forum.php?mod=post&action=newthread&fid=15";
    if (window.location.href != reportUrl) {
        if (btnLogin == null && btnLogout != null) {
            var webHtmls = document.getElementById("postlist").getElementsByTagName("div")[2].getElementsByClassName("plhin res-postfirst")[0];
            if (webHtmls != null) {
                var pid = webHtmls.getAttribute("id");
                var x = getNodeByXpath("//*[@id=\"" + pid + "\"]/tbody/tr[4]/td[2]/div/div/p");
                var btnReportHtml = "<a href=\"" + reportUrl + "\" style=\"color:red;\">高级举报</a>";
                x.innerHTML += btnReportHtml;
                var author = getNodeByXpath("//*[@id=\"favatar" + pid.replace("pid", "") + "\"]/div[1]/div/a");
                var createTime = getNodeByXpath("//*[@id=\"authorposton" + pid.replace("pid", "") + "\"]");
                var patt = new RegExp("(?<=发表于</span> ).*");
                var postsInfo = { Author: author.innerHTML, CreateTime: patt.exec(createTime.innerHTML)[0] };
                GM_setValue('info', postsInfo);
            }
        }
    }
    else {
        getNodeByXpath("//*[@id=\"typeid_ctrl_menu\"]/ul/li[3]").click();
        getNodeByXpath("//*[@id=\"typeoption_Complaints_Evidence\"]").value = document.referrer;
        getNodeByXpath("//*[@id=\"typeoption_Complaints_ID\"]").value = GM_getValue('info').Author;
        getNodeByXpath("//*[@id=\"typeoption_Complaints_Time\"]").value = GM_getValue('info').CreateTime;

        console.log("举报材料：");
        console.log("帖子地址：" + document.referrer);
        console.log("论坛账号：" + GM_getValue('info').Author);
        console.log("事件发生时间：" + GM_getValue('info').CreateTime);
    }
    function getNodeByXpath(xpath) {
        var result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
        return result.iterateNext()
    }
})();



