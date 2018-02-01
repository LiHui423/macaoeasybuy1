function mygoodbanner(obj){
    var box = obj.box // 外层容器
    var banner = obj.banner; // 轮播图
    clone();
    if(obj.childMargin){
    	var childMargin = obj.childMargin;
    }else{
    	var childMargin = 0;
    }
    var oWidth = Math.ceil(banner.children().eq(0).width()) + childMargin;//一张图片的长度
    
    banner.css('width',oWidth * banner.children().length);
    banner.css('left',-1 * oWidth);
    var goLeft = obj.goLeft;
    var goRight = obj.goRight;
    var index = 1;
    var len = banner.children().length-2; //图片的数量
    var interval = 2500; //多久跳一次
    var gogogo = 600; // 一张图片切换需要的时间
    var timer;
    
    function animate(offset){
        var left = parseInt(banner.css('left')) + offset;
        if(offset>0){
            offset = '+=' + offset;
        }else{
            offset = '-=' + Math.abs(offset);
        }
        banner.animate({'left':offset},gogogo,function(){
            if(left > (-1 * oWidth)/3){
                banner.css('left', -1 * oWidth * len);
            }
            if(left < (-1 * oWidth * len)){
                banner.css('left',-1 * oWidth);
            }
        });
    }
    function play(){
    		stop();
        timer = setTimeout(function(){
            goRight.trigger('click');
            play();
        },interval);
    }
    function stop(){
        clearTimeout(timer);
    }
    function clone(){
    	var first = banner.children().eq(0);
    	var last = banner.children().last();
    	first.clone(true,true).appendTo(banner);
    	last.clone(true,true).insertBefore(first);
    }
    
    if(obj.now){
    	var now = obj.now;
	     function showNow(index){
	    	now.html(index);
	    }
    }
    
    goRight.on('click',function(){
        if(banner.is(':animated')){
            return;
        }
        if(index == len){
            index = 1;
        }
        else{
            index += 1;
        }
        animate(-1 * oWidth);
        if(obj.now){
        	showNow(index);
        }

    });
    goLeft.on('click',function(){
        if(banner.is(':animated')){
            return;
        }
        if(index == 1){
            index = len;
        }
        else{
            index -= 1;
        }
        animate(oWidth);
        if(obj.now){
        	showNow(index);
        }
    });
    box.hover(stop,play); //鼠标移入 停止跳播
    play();
}