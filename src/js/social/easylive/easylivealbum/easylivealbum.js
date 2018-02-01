// 专辑分类
var dep = easyBuy.global.dep;
/**
 *
 * @type {{
 *      requestURL: string,     请求数据链接
 *      parameter: {},          请求参数
 *      templateID: string,     模板ID
 *      container: string,      渲染容器
 *      data: {},               数据
 *      methods: {}             方法
 * }}
 */
var classifcation = {
	targetURL: "http://social1.macaoeasybuy.com/thealbumSocialConntroller/custTheAlbumClassSumSocial.easy",
    requestData: {},
	templateID: "classifcation",
	container: ".album-classifcation > .content-container",
	data: {}
};
// 推荐
var recommend = {
 targetURL: "http://social1.macaoeasybuy.com/thealbumSocialConntroller/queryThealBumRecommendedSocial.easy",
 requestData: {
		page: 0,
		size: 20
	},
 templateID: "recommend",
 container: ".album-recommend > .content-container",
 data: {}
 };
 easyBuy.global.beforeDataJs = function(){
	insertTemplate(classifcation);
	insertTemplate(recommend);
};

 /**
 * 获取数据
 * 
 * @param {object} templateObj //模板对象
 */
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
    success: function (response) {
        console.log(response);
        var cache;	// 定义一个临时变量，用于储存当前获取的数据
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
    function insert(templateObj, data) {
        var container = $(templateObj.container);
        var templateString = easyBuy.global.template[templateObj.templateID];
        if (data.page === 0 || data.page === undefined) {
            container.html(template.render(templateString, data));
        } else {
            container.children().last().after(template.render(templateString, data));
        }
        recommendAnimate(data);
        gotoClick(data);
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

/**
 * 绑定动画
 * 
 * @param {int} page //页数
 */
function recommendAnimate(data){
	var item = $('#page'+data.page+' > .recommend-list');
	var animateTime = 250;
	item.hover(function(){
		$(this).find('.recommend-mask').stop().fadeIn(animateTime);
		$(this).find('.mask-title').stop().animate({
			'margin':'50px 0px 20px 0px'
		},animateTime);
		$(this).find('.mask-data div').stop().animate({
			'margin-bottom':'10px'
		},animateTime);
		$(this).find('.mask-head').stop().animate({
			'margin':'25px auto 0px auto'
		},animateTime);
	},function(){
		$(this).find('.recommend-mask').stop().css('display','none');
		$(this).find('.mask-title').stop().css('margin','90px 0px 30px 0px');
		$(this).find('.mask-data div').stop().css('margin-bottom','10px');
		$(this).find('.mask-head').stop().css('margin','30px auto 0px auto');
	});
};

function gotoClick(data) {
    var item;
    var url;
    if(data.page !== undefined) {
        item = $('#page'+data.page+' > .recommend-list');
        url = 'albumclassification/albumlistdetail/albumlistdetail.html?id='
    } else {
        item = $('.classification-list');
        url = 'albumclassification/albumclassification.html?type=';
    };
    item.on('click', function() {
        var link = url + $(this).attr('id');
        window.open(link, '_self');
    })
}
