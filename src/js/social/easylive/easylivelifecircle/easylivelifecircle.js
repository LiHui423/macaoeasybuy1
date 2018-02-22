var slider = easyBuy.global.dep.slider;
var waterfall = easyBuy.global.dep.waterfall;
var domain = "http://social1.macaoeasybuy.com";
$(function(){
    // 請求生活圈分類數據
    var classId = 4;
    $.ajax({
        url:domain + '/suitableLifeController/querySuitableLifeClass.easy',
        type:"GET",
        async:true,
        datatype:JSON,
        success:function(data){
            hotTopic(classId);
            everybody(classId);
            random(classId);
            clickEvent()//頁面點擊事件
            var newData=JSON.parse(data);
            var html=template('lifeType',newData);
            $('.livingCircle').html(html);
            $('.livingCircle li:first-of-type').attr('class','yez-active');
            // 生活圈分類點擊事件
            $('.livingCircle').on('click',function(e){
                var target=e.target;
                $(target).addClass('yez-active').siblings().removeClass('yez-active');
                // 獲取點擊目標的id
                classId=$(target).attr('id');
                hotTopic(classId);//請求熱帖推薦數據并渲染
                everybody(classId);//請求大家都說數據并渲染
                random(classId);//請求隨便看看數據并渲染
            })
        },
        error:function(){
            console.log('發生未知錯誤')
        }
    });
    // 熱帖推薦
    function hotTopic(classId){
        $.ajax({
            url:domain + '/suitableLifeController/querySuitableLifeHot.easy',
            data:{
                classId:classId
            },
            type:"GET",
            async:true,
            success:function(data){
                var newData=JSON.parse(data);
                var html=template('hotTopic',newData);
                $('.hot-post-list').html(html);
                slider({
                    slider:$('.hot-post-list'),
                    item:$('.hot-post-list-li'),
                    len:3,
                    next:$('#goRight'),
                    prev:$('#goLeft'),
                });
            },
            error:function(){
                console.log('發生未知錯誤')
            }
        });
    }
    //大家都說
    function everybody(classId){
        $.ajax({
            url:domain + '/suitableLifeController/querySuitableLifeNoisy.easy',
            data:{
                classId:classId
            },
            type:"GET",
            async:true,
            success:function(data){
                if(data === ''){
                    $('.all-say').css('display','none');
                }else{
                    var newData=JSON.parse(data);
                    var html=template('everybody',newData);
                    $('.all-say-list').html(html);
                    slider({
                        slider:$('.all-say-list'),
                        item:$('.all-say-list-li'),
                        len:4,
                        next:$('#allsay-goRight'),
                        prev:$('#allsay-goLeft'),
                    });
                }
            }
        });
    }
    //隨便看看
    function random(classId){
        $.ajax({
            url:domain + '/suitableLifeController/querySuitableLifeList.easy',
            data:{
                page:0,
                classId:classId
            },
            type:"GET",
            async:true,
            success:function(data){
                var newData=JSON.parse(data);
                var html=template('random',newData);
                $('.lifecircle-having-look').html(html);
                waterfall($('.lifecircle-having-look'), $('.pillar-all'), 6, 20, 0,true);
            },
            error:function(){
                console.log('發生未知錯誤');
            }
        });
    }
    // 頁面點擊事件
    function clickEvent(){
        $(document).on('click',function(e){
            var target=e.target;
            // 判斷是否點擊到文字描述
            if($(target).attr('id')==="underline"){
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
})
