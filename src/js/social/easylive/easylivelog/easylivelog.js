var domain = "http://social1.macaoeasybuy.com";
var waterfall = easyBuy.global.dep.waterfall;
var easyScrollRequest = easyBuy.global.dep.easyScrollRequest;

// 日志分类
var queryReleaseClassInfo = new YEZTemplateObj({
	targetURL: domain + '/socialReleasePrevController/queryReleaseClassInfo.easy',
	templateID: 'queryReleaseClassInfo',
	container: '.log-nav-ul',
    afterGetData: function(res) {
        console.log(res);
	    $.each(res.data, function () {
            if(this.biggestOrder === 1) {
                queryReleaseClassCountInfo.requestData.parameters.classId = this.id;
                queryReleaseClassList.requestData.parameters.classId = this.id;
                templateProcessor([queryReleaseClassCountInfo]);
            }
        })
    },
	afterInsert: function() {
        var ul = $('.log-nav-ul');
        var li = ul.find('li');
        li.css('width',(100/ul.find('li').length)+'%');
        li.each(function(){
            $(this).on('click',function(){
                $(this).siblings('li').removeClass('yez-active').end().addClass('yez-active');
                queryReleaseClassCountInfo.requestData.parameters.classId = Number($(this).attr('id'));
                queryReleaseClassList.requestData.parameters.classId = Number($(this).attr('id'));
                queryReleaseClassList.requestData.parameters.page = 0;
                templateProcessor([queryReleaseClassCountInfo]);
            });
        });
	}
});

// 某分类的信息
var queryReleaseClassCountInfo = new YEZTemplateObj({
    targetURL: domain + '/socialReleasePrevController/queryReleaseClassCountInfo.easy',
    templateID: 'queryReleaseClassCountInfo',
    container: '.container-swapper',
    afterInsert: function () {
        templateProcessor([queryReleaseClassList]);
        var item = $('.shop-main .main-nav .nav-page-select li');
        item.each(function(){
            $(this).on('click',function(){
                $(this).siblings('li').removeClass('select').end().addClass('select');
            });
        });
    }
});

// 某分类的内容
var queryReleaseClassList = new YEZTemplateObj({
	targetURL: domain + '/socialReleasePrevController/queryReleaseClassList.easy',
	parameters: {
		classId: 2,
		page: 0,
		size: 15,
		order: 'uptime'
	},
	templateID: 'queryReleaseClassList',
    container: '.shop-list',
    methods: {
	    lazyload: function (state) {
            if(state) {
                easyScrollRequest("on", 'lazyload', $(window), $(document), function () {
                    templateProcessor([queryReleaseClassList]);
                })
            } else {
                easyScrollRequest("off", 'lazyload', $(window));
            }
        }
    },
    beforeGetData: function () {
        this.methods.lazyload&&this.methods.lazyload(false);
    },
    afterInsert: function (res) {
        console.log(res.data);
        waterfall($('.shop-list'), $('.pillar-all'), 4, 20, 41, false);
        console.log(res.data.length < this.requestData.parameters.size);
        if(res.data.length < this.requestData.parameters.size) {
            $('.noMore').css('display','block');
            this.methods.lazyload(false);
        } else {
            this.requestData.parameters.page++;
            console.log(this.requestData.parameters.page);
            this.methods.lazyload(true);
        }
        //日誌帖子點擊事件
        $('.shop-list').on('click',function(e){
            var target=e.target;
            console.log(target);
            if($(target).attr('class')=='pillar'){
                var postId=$(target).parent().attr('id');
                console.log(postId);
                window.open('http://social.macaoeasybuy.com/easylive/easylivelog/logpostdetail/logpostdetail.html?id='+postId);
            }
        })
    }
});
easyBuy.global.beforeDataJs = function () {
    templateProcessor([queryReleaseClassInfo]);
};
