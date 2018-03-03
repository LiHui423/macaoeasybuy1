var dep = easyBuy.global.dep;
var domain = "http://social1.macaoeasybuy.com";

var topicHot = {
    targetURL: domain + '/sentVolunteersSocialConntroller/queryMostCommentSentVolunteers.easy',
    requestData: {
        userId : easyBuy.easyUser.id
    },
    templateID: 'topicHot',
    container: '.container-swapper > .top-one',
    data: {}
};
var topicHotComment = {
    targetURL: 'http://userspace1.macaoeasybuy.com/topicReplyController/getReplyList.easy',
    requestData: {
        type: 2,
        size: 10,
        page: 0,
        order: 'uptime',
        descOrAsc: 'desc'
    },
    templateID: 'topicHotComment',
    container: '.commentList',
    data: {}
};
var topicList = {
    targetURL: domain + '/sentVolunteersSocialConntroller/querySentVoulunteersTopic.easy',
    requestData: {
        page: 0,
        size: 9
    },
    templateID: 'topicList',
    container: '.container-swapper > .list',
    data: {}
};
/**
 * Author: Junhang
 * Version:
 * @param {object} templateObj - 需要获取数据的模板对象
 */

// $(function(){
//     if(easyBuy.isLogin === false) {
//         topicHot.requestData.userId = -1
//     } else {
//         topicHot.requestData.userId = easyBuy.easyUser.id;
//     }
//     insertTemplate(topicHot);
//     insertTemplate(topicList);
// })




easyBuy.global.beforeDataJs = function () {
    if(easyBuy.isLogin === false) {
        topicHot.requestData.userId = -1
    } else {
        topicHot.requestData.userId = easyBuy.easyUser.id;
    }
    insertTemplate(topicHot);
    insertTemplate(topicList);
};


function insertTemplate(templateObj) {
    $.ajax({
        type: "GET",
        url: dep.getRequestURL({
            targetURL: templateObj.targetURL,
            requestData: templateObj.requestData
       }),
        dataType: "JSON",
        beforeSend: function() {
            if(templateObj.requestData.page !== undefined) {
                lazyload(templateObj, false);
            };
        },
        success: function (res) {
            console.log(res);
            var cache;
            //根据目标对象是否存在page参数来确定是否需要分页
            if(templateObj.templateID === 'topicHotComment') {
                console.log(res);
                res.replyList.replyList.forEach(function (t) {
                    t.replycontent = changeAtAndLabel(t.replycontent);
                });
            }
            if(templateObj.requestData.page === undefined) {
                cache = res;
                templateObj.data = cache;
            } else {
                if(templateObj.data.page === undefined) {
                    templateObj.data.page = [];
                }
                if(res.result !== undefined) {
                    cache = {page: templateObj.requestData.page, list: res.result};
                } else {
                    cache = {page: templateObj.requestData.page, list:res.replyList.replyList};
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
                templateObj.templateID !== 'topicHotComment' && container.children().last().after("<p class='no-more'>~沒有更多內容了~</p>")
            } else {
                lazyload(templateObj, true);
            }
        }
        if(topicHotComment.requestData.id === undefined) {
            // topicHotComment.requestData.id = data.result.topicId;
            topicHotComment.requestData.id = data.list.loveCount;
            console.log(topicHotComment.requestData.id);
            insertTemplate(topicHotComment);
        };
    };
    function lazyload(templateObj, state) {
        if (state) {
            if(templateObj.templateID === 'topicHotComment'){
                dep.easyScrollRequest("on", templateObj.templateID + "-lazyload", $('.commentList-box'), $('.commentList'), function(){
                    insertTemplate(templateObj);
                })
            } else {
                dep.easyScrollRequest("on", templateObj.templateID + "-lazyload", $(window), $(document), function(){
                    insertTemplate(templateObj);
                })
            }
        } else {
            if(templateObj.templateID === 'topicHotComment'){
                dep.easyScrollRequest("off", templateObj.templateID + "-lazyload", $('.commentList-box'));
            } else {
                dep.easyScrollRequest("off", templateObj.templateID + "-lazyload", $(window));
            }
        }
    }
}
function changeAtAndLabel(str) {
    str = str.split('&nbsp;');
    return str.reduce(function(a, b){
        switch(b!=='') {
            case b.indexOf('>@') !== -1:
                return a + '&nbsp;' + b.replace('>@', ' class=\"isAt\">@');
            case b.indexOf('>#') !== -1:
                return a + b.replace('>#', ' class=\"isLabel\">#') + '&nbsp;';
            default:
                return a + b;
        };
        return a;
    });
}
