var dep = easyBuy.global.dep;
var domain = "http://social1.macaoeasybuy.com";

function YEZTemplateObj(params) {
    this.targetURL = params.targetURL || '';
    this.requestData = params.requestData || {};
    this.encryptData = params.encryptData || false;
    this.templateID = params.templateID || '';
    this.container = params.container || '';
    this.data = params.data || {};
    this.methods = params.methods || {};
};

// 标签排行
var labelRank = new YEZTemplateObj({
    targetURL: domain + '/socialLabelRankController/queryLabelRankDetail.easy',
    requestData: {
        type: -1,
        time: 0,
        page: 0,
        size: 15,
    },
    data: {},
    templateID: 'labelRank',
    container: '.ranklist-list',
});
// 新鲜标签
var freshLabel = new YEZTemplateObj({
    targetURL: domain + '/socialLabelRankController/queryNewestLabel.easy',
    templateID: 'freshLabel',
    container: '.news-list'
});
// 标签侠
var labelMan = new YEZTemplateObj({
    targetURL: domain + '/socialLabelRankController/queryLabelUser.easy',
    requestData: {
        page: 0,
        size: 3
    },
    templateID: 'labelMan',
    container: '.hero-list',
    lazyload: true
});

easyBuy.global.beforeDataJs = function () {
    otherProcesser(labelRank);
    getTemplateData(labelRank);
    getTemplateData(freshLabel);
    getTemplateData(labelMan);
};

function lazyload(templateObj, state) {
    if (state) {
        var context = templateObj.templateID === 'labelRank' ? $('.ranklist-left') : $('.ranklist-right');
        dep.easyScrollRequest("on", templateObj.templateID + "-lazyload", $(window), context, function(){
            getTemplateData(templateObj);
        })
    } else {
        dep.easyScrollRequest("off", templateObj.templateID + "-lazyload", $(window));
    }
}

/**
 * 
 * @param {Object} templateObj 模板对象 
 */
function getTemplateData(templateObj) {
    $.ajax({
        method: 'GET',
        url: dep.getRequestURL({
             targetURL: templateObj.targetURL,
             requestData: templateObj.requestData
        }),
        dataType: 'JSON',
        beforeSend: function () {
            if(templateObj.requestData.page !== undefined) {
                lazyload(templateObj, false);
            };
        },
        success: function (res) {
            var resData = {},
                data = res['list'] || res['result'] || res['replyList'];
            // 用模板对象里的请求参数是否有page属性来判断是否分页，如果不分页则直接把数据赋值，否则需要封装
            if (templateObj.requestData.page === undefined) {
                resData.data = data;
                templateObj.data.data = data;
            } else {
                var dataPackage = {
                    page: templateObj.requestData.page,
                    data: data
                };
                resData.data === undefined && (resData.data = []);
                resData.data.push(dataPackage);
                // 判断模块
                if(templateObj.templateID === 'labelRank'){
                // 获取当前请求参数里的type和time，合并成字符串，作为当前页面在数据(data)里面的key
                    var dataKey = templateObj.requestData.type.toString() + templateObj.requestData.time.toString();
                    templateObj.data[dataKey] === undefined && (templateObj.data[dataKey] = {}) && (templateObj.data[dataKey].data = []);
                    templateObj.data[dataKey].data.push(dataPackage);
                    resData.data[0].data.length < templateObj.requestData.size && (templateObj.data[dataKey].isComplete = true);
                } else {
                    templateObj.data.data === undefined && (templateObj.data.data = []);
                    templateObj.data.data.push(dataPackage);
                    resData.data[0].data.length < templateObj.requestData.size && (templateObj.data.isComplete = true);
                }
                templateObj.requestData.page++;
            }
            console.log("当前请求模块为：" + templateObj.templateID + ", 当前请求页面为：" + resData.data[0].page);
            console.log("缓存：");
            console.log(resData);
            console.log("对象数据：");
            console.log(templateObj.data);

            insertTemplate(templateObj, resData, false);
            var cache = null;
            var resCache = null;
        },
        error: function (res) {
            console.log('failed');
        },
    });
};


/**
 * 
 * @param {Object} templateObj 
 * @param {Object} data 
 */
function insertTemplate(templateObj, data, useData) {
    var container = $(templateObj.container);
    var templateString = easyBuy.global.template[templateObj.templateID];
    // 是否是第一页，是否不需要分页，是否使用缓存
    var noPage = data.data[0].page === undefined;
    var isFirst = data.data.length === 1 && data.data[0].page === 0;
    if (noPage || isFirst || useData) {
        container.html(template.render(templateString, data));
    } else {
        container.children().last().after(template.render(templateString, data));
    };
    
    container.children('div[id^=page]').fadeIn('slow');
    if(!noPage) {
        // 如果不是缓存，判断进来的数据是否少于请求数量，如果是缓存，判断是否存在已完成数据
        if(useData && data.data.isComplete === true || !useData && data.data[0].data.length < templateObj.requestData.size) {
            lazyload(templateObj, false);
            container.children().last().after("<p class='no-more'>~沒有更多內容了~</p>");
        } else {
            lazyload(templateObj, true);
        }
    }
};


function otherProcesser(templateObj) {
    var conditionSelector = $('.conditionSelector');
    var typeRequestArgs = [-1, 0, 1, 2];
    conditionSelector.on('click', function (even) {
        $(even.target).siblings('.yez-active').removeClass('yez-active').end().addClass('yez-active');
        paramsProcess();
    });

    function paramsProcess() {
        // 获取当前活动的索引
        var timeIndex = conditionSelector.filter('.ranklist-time-select').children('.yez-active').index();
        var typeIndex = conditionSelector.filter('.ranklist-class-nav').children('.yez-active').index();
        // 获取当前请求参数里的type和time，合并成字符串，作为当前页面在请求状态(requestStatus)里面的key
        var requestStatusKey = getRequestDataKey(templateObj);
        // 是否已经初始化请求状态(requestStatus)
        templateObj.requestStatus === undefined && (templateObj.requestStatus = {});
        // 储存当前页面的请求状态
        templateObj.requestStatus[requestStatusKey] = saveRequestStatus(templateObj.requestData);
        //  获取即将要跳转的页面在请求状态(requestStatus)里的key
        var wantToKey = getRequestStatusKey(typeRequestArgs[typeIndex], timeIndex);
        // 判断即将切换的页面是否初始化
        if (templateObj.requestStatus[wantToKey] !== undefined) {
            templateObj.requestData = templateObj.requestStatus[wantToKey];
            insertTemplate(labelRank, templateObj.data[getRequestDataKey(templateObj)], true);
        } else {
            templateObj.requestData = {
                type: typeRequestArgs[typeIndex],
                time: timeIndex,
                page: 0,
                size: 15,
            };
            getTemplateData(labelRank);
        };
    }
    /**
     * 
     * @param {obejct} data 需要储存的数据 
     */
    function saveRequestStatus(data) {
        return {
            page: data.page,
            type: data.type,
            time: data.time,
            size: data.size
        };
    };
    /**
     * 
     * @param {number} type
     * @param {number} time 
     */
    function getRequestStatusKey(type, time) {
        return type.toString() + time.toString();
    };
    function getRequestDataKey(templateObj) {
        var str = templateObj.requestData.type.toString() + templateObj.requestData.time.toString();
        return str;
    }
}


template.helper('ranking', function(num) {
    return num = num < 4 ? "TOP"+num : num;
})
template.helper('labelType', function (type) {
    var a;
    switch (type) {
        case 0:
            a = '地點';
            break;
        case 1:
            a = '品牌';
            break;
        case 2:
            a = '熱點';
            break;
    }
    return a;
});
/**
 * 
 * @param {string} evenSelector 为需要lazyload的模块标识一个用于开启或者关闭的字符串 
 * @param {boolean} openState lazyload的打开状态
 * @param {string|object} viewport 模块的可视窗口
 * @param {string|object} context 模块的上下文 
 * @param {function} callBack 回调函数
 */
function lazyLoad(evenSelector, openState, viewport, context, callBack){
    viewport = typeof viewport === string ? $(viewport) : viewport;
    context = typeof context === string ? $(context) : context;
    if(openState){
        var windowHeight = viewport.height();
        viewport.on('scroll.' + evenSelector, function(){
            var scrollTop = $(this).scrollTop();
            var scrollHeight = context.height();
            if(scrollTop + windowHeight >= scrollHeight * 0.7){
                fn&&fn();
            } else if(scrollTop + windowHeight ) {

            }
        });
    }else{
        showBox.off('scroll.'+selecter);
    }
}
