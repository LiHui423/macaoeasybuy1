var slider = easyBuy.global.dep.slider;
var waterfall = easyBuy.global.dep.waterfall;
var domain = "http://social1.macaoeasybuy.com";

$(function () {
    var lifeType = new Ebtemplate({
        targetURL: domain + '/suitableLifeController/querySuitableLifeClass.easy',
        templateID: 'lifeType',
        container: '.livingCircle',
        methods: {
            gotoClick: function() {
                var livingCircle = $('.livingCircle');
                livingCircle.on('click', function(even) {
                    $(even.target).siblings('.yez-active').removeAttr('class').end().addClass('yez-active');
                    var classID = $(even.target).attr('id');
                    console.log(classID);
                    // everybody.requestData.parameters.classId = classID;
                    // hotTopic.requestData.parameters.classId = classID;
                    // random.requestData.parameters.classId = classID;
                    Ebtemplate.processor([everybody, hotTopic, random]);
                });
            }
        },
        afterInsert: function() {
            this.methods.gotoClick();
        }
    });
    var everybody = new Ebtemplate({
        targetURL: domain + '/suitableLifeController/querySuitableLifeNoisy.easy',
        parameters: {
            classId: 4
        },
        templateID: 'everybody',
        container: '.all-say-list',
        afterInsert: function(data) {
            console.log(data);
            slider({
                slider:$('.all-say-list'),
                item:$('.all-say-list-li'),
                len:4,
                next:$('#allsay-goRight'),
                prev:$('#allsay-goLeft'),
            });
            this.afterInsert = null;
        },
    });
    var hotTopic = new Ebtemplate({
        targetURL: domain + '/suitableLifeController/querySuitableLifeHot.easy',
        parameters: {
            classId: 4
        },
        templateID: 'hotTopic',
        container: '.hot-post-list',
        afterInsert: function(data) {
            console.log(data);
            slider({
                slider:$('.hot-post-list'),
                item:$('.hot-post-list-li'),
                len:3,
                next:$('#goRight'),
                prev:$('#goLeft'),
            });
            this.afterInsert = null;
        }
    });
    var random = new Ebtemplate({
        targetURL: domain + '/suitableLifeController/querySuitableLifeList.easy',
        parameters: {
            page: 0,
            classId: 4
        },
        templateID: 'random',
        container:'.lifecircle-having-look',
        afterInsert: function(data) {
            console.log(data);
            waterfall($('.lifecircle-having-look'), $('.pillar-all'), 6, 20, 0,true);
        }
    });
    Ebtemplate.processor([lifeType, hotTopic, everybody, random]);
    clickEvent();
    // 頁面點擊事件
    function clickEvent(){
        $(document).on('click',function(e){
            var target=e.target;
            // 判斷是否點擊到文字描述
            if($(target).attr('class')==="box-main-head-info-article"){
                var postId=$(target).parents('.hot-post-list-li,.all-say-list-li').attr('id');
                window.open('http://social.macaoeasybuy.com/easylive/easylivelifecircle/lifecirclepostdetail/lifecirclepostdetail.html?id='+postId);
            }
            // 判斷是否點擊到模態框
            if($(target).attr('class')==="shadow-box"){
                var postId=$(target).parents('.pillar-all').attr('id');
                window.open('http://social.macaoeasybuy.com/easylive/easylivelifecircle/lifecirclepostdetail/lifecirclepostdetail.html?id='+postId);
            }
        })
    }
});

