var dep = easyBuy.global.dep;
var domain = "http://social1.macaoeasybuy.com";
var classID = window.location.search.substr(1).match(/type.[0-9]{1}/)[0].substr(5);

// 分类信息
var info = {
    targetURL: domain + "/thealbumSocialConntroller/custTheAlbumClassSum.easy",
    requestData: {
        type: classID,     //专辑ID
    },
    templateID: "info",
    container: ".info-content",
    data: {}
};
// 分类里的专辑列表
var list = {
    targetURL: domain + "/thealbumSocialConntroller/queryThealBumClassData.easy",
    requestData: {
        type: classID,    //专辑ID
        page: 0,    //页数
        size: 12    //一次请求多少数据
    },
    templateID: "list",
    container: ".list-content",
    data: {}
};
// 人气专辑
var hot = {
    targetURL: domain + "/thealbumSocialConntroller/queryThealBumBrief.easy",
    requestData: {
        classId: classID,
        page: 0,    //页数
        size: 3,   //一次请求多少数据2
        order: "uptime",    //排序条件
        descOrAsc: "desc"   //正序或倒序
    },
    templateID: "hot",
    container: ".hot-content",
    data: {}
};

easyBuy.global.beforeDataJs = function () {
    insertTemplate(info);
    insertTemplate(list);
    insertTemplate(hot);
};

/**
 * Author: Junhang
 * Version:
 * @param {object} templateObj - 需要获取数据的模板对象
 */
function insertTemplate(templateObj) {
    $.ajax({
        type: "GET",
        url: dep.getRequestURL({targetURL:templateObj.targetURL, requestData:templateObj.requestData}),
        dataType: "JSON",
        beforeSend: function() {
            if(templateObj.requestData.page !== undefined) {
                lazyload(templateObj, false);
            };
        },
        success: function (response) {
            console.log(response);
            var cache;
            //根据目标对象是否存在page参数来确定是否需要分页
            if(templateObj.requestData.page === undefined) {
                cache = response;
                templateObj.data = cache;
            } else {
                cache = {page: templateObj.requestData.page, list: response.list};
                if(templateObj.data.page === undefined) {
                    templateObj.data.page = [];
                }
                templateObj.data.page.push(cache);
                templateObj.requestData.page++;
            };

            console.log("当前请求模块为：" + templateObj.templateID + ", 当前请求页面为：" + cache.page);
            console.log("缓存：");
            console.log(cache);
            console.log("对象数据：");
            console.log(templateObj.data);

            insert(templateObj, cache);
        },
        error: function (response) {
            console.log("failed");
        }
    });

    /**
     *
     * @param templateObj
     * @param data
     */
    function insert(templateObj, data) {
        var container = $(templateObj.container);
        var templateString = easyBuy.global.template[templateObj.templateID];
        if (data.page === 0 || data.page === undefined) {
            container.html(template.render(templateString, data));
        } else {
            container.children().last().after(template.render(templateString, data));
        }
        if (data.page !== undefined) {
            if (data.list.length < templateObj.requestData.size) {
                lazyload(templateObj, false);
                container.children().last().after("<p class='no-more'>~沒有更多內容了~</p>");
            } else {
                lazyload(templateObj, true);
            }
        }
    };
    function lazyload(templateObj, state) {
        if (state) {
            dep.easyScrollRequest("on", templateObj.templateID + "-lazyload", $(window), $(document), function(){
                insertTemplate(templateObj);
            })
        } else {
            dep.easyScrollRequest("off", templateObj.templateID + "-lazyload", $(window));
        }
    }
}
