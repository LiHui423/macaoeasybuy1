/*global $ */
/*
 *
 * easyBuy.global.dep <-----以下是這個庫裡面的東西
 *
 	uuid(); //生成UUID
 	arrayGetMax(); //獲取數組最大值
 	deleteArr(); //刪除數組裡面指定的值
 	waterfall(); //瀑布流 參數說明 outer(父級元素)-item(子級元素)-num(列數)-margin(margin-top)-width(magin-left/magin-right)
					//如果最後一個參數為true，則倒數第二個參數為0，自動分配寬度空間
	stopScroll(); //禁止滾動條事件傳遞
	mygoodbanner(); //焦點輪播圖
	slider(); //滑動輪播圖
	upSlider(); //豎直滾動
	mathValueLength(); //計算輸入的長度
	imgOnMiddle(); //圖片水平垂直居中  使用方法 <img src="" middle="true">
	formatNum();  //轉換數值
	deleteArrObj();  //從數組裡面刪除指定內容的對象
	updateArrObj();  //修改數組指定字段對象的值
	insertArr(); //數組指定位置插入數組
	maskClick(); //點擊其他地方，彈框消失，不依賴遮罩層
	justNumInput(); //輸入框只允許輸入數字
	cloneObject(); //克隆對象
	getBeforeDate(); //獲取之前n日的時間 返回 year-month-day 這樣的格式
	createFormSubmit(); //動態創建form並且提交（實現post跨域，異步無刷新，前端agency.html做代理，後台返回iframe讓前台引入agency，在url上傳遞參數）
	easyScrollRequest(); //滾動加載請求
	getRequestURL(); //get請求加密，傳參數

 * */
(function(easyGlobal){
    //生成UUID
    easyGlobal.uuid = function(){
        var s = [];
        var hexDigits = '0123456789abcdef';
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = '4';
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = '-';
        return s.join('');
    };
    //獲取數組最大值
    easyGlobal.arrayGetMax = function(a){
        var max = a[0];
        for(var i = 1; i < a.length; i++) {
            if(max < a[i]) {
                max = a[i];
            }
        }
        return max;
    };
    easyGlobal.getTarget = (element, selector) => {
      const $e = element instanceof jQuery ? element : $(element);
      const $es = $(selector);
      const isSelf = $es.indexOf($e) !== -1;
      if (isSelf) {
        return $e;
      }
      const $t = $e.parents(selector);
      return $t;
    };
    //刪除數組裡面指定的值！！！
    easyGlobal.deleteArr = function(arr, val){
        var a = 0;
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] == val) {
                a = i;
                break;
            }
        }
        arr.splice(a, 1);
    };
    //瀑布流 參數說明 outer(父級元素)-item(子級元素)-num(列數)-margin(margin-top)-width(magin-left/magin-right)
    //如果最後一個參數為true，則倒數第二個參數為0，自動分配寬度空間
    easyGlobal.waterfall = function(outer, item, num, margin, width,flag){
        outer.css('position','relative');
        var totalWidth = outer.width();
        flag = flag == undefined ? false : flag;
        width = flag ? (totalWidth - num * item.width()) / (num - 1) : width;
        var eachWidth = item.width() + width;
        var columNum = num;
        var heightArr = [];
        for(var i = 0; i < columNum; i++) {
            heightArr[i] = 0;
        }
        outer.find('img').imagesLoaded(function(){
            item.each(function(idx, ele) {
                var minIndex = 0;
                var minValue = heightArr[minIndex];
                for(var i = 0; i < heightArr.length; i++) {
                    if(heightArr[i] < minValue) {
                        minIndex = i;
                        minValue = heightArr[i];
                    }
                }
                $(ele).css({
                    'position': 'absolute',
                    left: eachWidth * minIndex,
                    top: minValue,
                    'visibility' : 'visible'
                });
                var oldHeight = heightArr[minIndex];
                oldHeight += $(ele).outerHeight(true) + margin;
                heightArr[minIndex] = oldHeight;
            });
            outer.css('height',easyGlobal.arrayGetMax(heightArr)+'px');
            return heightArr;
        });
    };
    //禁止滾動條事件傳遞
    easyGlobal.stopScroll = function(obj) {
        obj.on('mouseenter', function() {
            $('body').css('overflow-y', 'scroll');
            $('html').css('overflow-y', 'hidden');
        });
        obj.on('mouseleave', function() {
            $('body').css('overflow-y', 'visible');
            $('html').css('overflow-y', 'scroll');
        });
    };
    //焦點輪播圖
    easyGlobal.mygoodbanner = function(obj, grass,postdetailFunc) {
        var box = obj.box; // 外层容器
        var banner = obj.banner; // 轮播图
        banner.children().each(function() {
            $(this).css('width', box.width());
        });
        clone();
        postdetailFunc&&postdetailFunc();
        var childMargin = undefined;
        if(obj.childMargin) {
            childMargin = obj.childMargin;
        } else {
            childMargin = 0;
        }
        var oWidth = Math.ceil(banner.children().eq(0).width()) + childMargin; //一张图片的长度
        banner.css('width', oWidth * banner.children().length);
        banner.css('left', -1 * oWidth);
        var goLeft = obj.goLeft;
        var goRight = obj.goRight;
        var index = 1;
        var len = banner.children().length - 2; //图片的数量
        $('.BannerCountBox .count').html(len);
        var interval = 2500; //多久跳一次
        var gogogo = 300; // 一张图片切换需要的时间
        var timer;
        box.css('visibility','visible');
        if(obj.timer == undefined) {
            obj.timer = true;
        }
        if(len > 1) {
            if(goLeft != undefined){
                goLeft.css('display', 'block');
                goRight.css('display', 'block');
            }
        } else {
            goLeft.remove();
            goRight.remove();
            $('.BannerCountBox').remove();
            if(grass) {
                grassFunc();
            }
            return false;
        }
        function animate(offset) {
            var left = parseInt(banner.css('left')) + offset;
            offset = offset > 0 ? '+=' + offset : '-=' + Math.abs(offset);
            banner.animate({
                'left': offset
            },gogogo,function() {
                if(left > (-1 * oWidth) / 3) {
                    banner.css('left', -1 * oWidth * len);
                }
                if(left < (-1 * oWidth * len)) {
                    banner.css('left', -1 * oWidth);
                }
            });
        }
        //如果有焦點，就加焦點
        if(obj.dotted) dottedClick();
        function bannerGo(idx){
            obj.dotted.eq(idx-1).siblings(obj.dotted.eq(0).localName).removeClass('select').end().addClass('select');
        }
        function dottedClick(){
            obj.dotted.each(function(k){
                $(this).on('click',function(){
                    if($(this).hasClass('select')) return false;
                    $(this).siblings($(this).localName).removeClass('select').end().addClass('select');
                    stop();
                    index = k + 1;
                    banner.animate({
                        'left' : -1 * (k+1) *oWidth + 'px'
                    });
                    if(obj.afterFunc) obj.afterFunc(k+1);
                });
            });
        }
        function play() {
            stop();
            timer = setTimeout(function() {
                if(goLeft != undefined){
                    goRight.trigger('click');
                }else{
                    if(banner.is(':animated')) {
                        return;
                    }
                    index == len ? index = 1 : index += 1;
                    animate(-1 * oWidth);
                    if(obj.now) showNow(index);
                    function showNow(index){
                        now.html(index);
                    }
                }
                if(obj.dotted) bannerGo(index);
                if(obj.afterFunc) obj.afterFunc(index);
                play();
            }, interval);
        }
        function stop() {
            clearTimeout(timer);
        }
        function clone(){
            var first = banner.children().eq(0);
            var last = banner.children().last();
            first.clone(true, true).appendTo(banner);
            last.clone(true, true).insertBefore(first);
        }
        if(obj.now) {
            var now = obj.now;
            function showNow(index) {
                now.html(index);
            }
        }
        if(goLeft != undefined){
            goRight.on('click', function() {
                if(banner.is(':animated')) {
                    return;
                }
                index == len ? index = 1 : index += 1;
                animate(-1 * oWidth);
                if(obj.now) showNow(index);
                function showNow(index) {
                    now.html(index);
                }
            });
            goLeft.on('click', function() {
                if(banner.is(':animated')) {
                    return;
                }
                index == 1 ? index = len : index -= 1;
                animate(oWidth);
                if(obj.now) showNow(index);
                function showNow(index) {
                    now.html(index);
                }
            });
        }
        if(obj.timer) {
            box.on('mouseenter', function() {
                stop();
            });
            box.on('mouseleave', function() {
                play();
            });
            play();
        }
        //以下為放大鏡功能
        if(grass) grassFunc();
        function grassFunc() {
            if(len == 1) {
                $('.prev').remove();
                $('.next').remove();
            }
            banner.children().find('img').each(function() {
                var img = new Image();
                img.src = $(this)[0].src;
                var html = '<li><img middle="true" src="' + img.src + '"></li>';
                grass.grassUl.append(html);
                img = null;
            });
            grass.grassUl.children().last().remove();
            grass.grassUl.children().first().remove();
            banner.children().each(function(k) {
                $(this).on('click', function() {
                    box.off('mouseleave');
                    stop();
                    //這裡打開模態框
                    $('html').css({
                        'overflow': 'hidden'
                    });
                    grass.grassBox.css('display', 'block');
                    showImg(k - 1);
                });
            });
            grass.grassclose.on('click', function() {
                play();
                box.on('mouseleave', function() {
                    play();
                });
                //這裡關閉模態框
                grass.grassBox.css('display', 'none');
                $('html').css({
                    'overflow': 'visible'
                });
            });
            function showImg(index) {
                showImgAnimate(index);
                grass.grassL.off('click');
                grass.grassL.on('click', function() {
                    index == 0 ? index = len - 1 : index -= 1;
                    showImgAnimate(index);
                });
                grass.grassR.off('click');
                grass.grassR.on('click', function() {
                    index == len - 1 ? index = 0 : index += 1;
                    showImgAnimate(index);
                });
                function showImgAnimate(index) {
                    grass.grassNow.html(index + 1);
                    grass.grassUl.find('li').css('display', 'none').stop().fadeOut(100, 'linear');
                    grass.grassUl.find('li').eq(index).stop().fadeIn(200, 'linear');
                    var img = grass.grassUl.find('li').eq(index).find('img')[0];
                    if(!img.width) {
                        var img = new Image();
                        img.src = img.src + '?t=' + Math.random();
                        img.onreadystatechange = function() {
                            if(this.readyState == 'loaded' || this.readyState == 'complete') {
                                myFunc(img);
                            }
                        };
                    } else {
                        myFunc(img);
                    }
                    function myFunc(img) {
                        if(img.width < window.screen.width && img.height > window.screen.height) {
                            $(img).css({
                                'top': '0px',
                                '-webkit-transform': 'translate(-50%,0)',
                                '-moz-transform': 'translate(-50%,0)',
                                '-ms-transform': 'translate(-50%,0)',
                                '-o-transform': 'translate(-50%,0)',
                                'transform': 'translate(-50%,0)'
                            });
                        } else if(img.width > window.screen.width && img.height < window.screen.height) {
                            $(img).css({
                                'left': '0px',
                                '-webkit-transform': 'translate(0,-50%)',
                                '-moz-transform': 'translate(0,-50%)',
                                '-ms-transform': 'translate(0,-50%)',
                                '-o-transform': 'translate(0,-50%)',
                                'transform': 'translate(0,-50%)'
                            });
                        } else if(img.width > window.screen.width && img.height > window.screen.height) {
                            $(img).css({
                                'left': '0px',
                                'top': '0px',
                                '-webkit-transform': 'none',
                                '-moz-transform': 'none',
                                '-ms-transform': 'none',
                                '-o-transform': 'none',
                                'transform': 'none'
                            });
                        }
                    }
                }
            }
        }
    };
    //滑動輪播圖
    easyGlobal.slider = function(opts) {
        var slider = opts.slider;
        var item = opts.item;
        var len = opts.len;
        var itemWidth = item.eq(0).width() + parseInt(item.eq(0).css('margin-right'));
        var pageWidth = itemWidth * len - parseInt(item.eq(0).css('margin-right'));
        var next = opts.next;
        var prev = opts.prev;
        var sim = opts.margin;
        var page = 1;
        var maxPage = Math.ceil(item.length / len);
        getWidth();
        btnClick();
        function getWidth() {
            slider.css('width', pageWidth * maxPage);
        }
        function btnClick() {
            next.on('click', function() {
                if(page == maxPage) {
                    return false;
                } else {
                    page++;
                    animate(page - 1);
                }
            });
            prev.on('click', function() {
                if(page == 1) {
                    return false;
                } else {
                    page--;
                    animate(page - 1);
                }
            });
        }
        function animate(page) {
            slider.animate({
                'left': -1 * pageWidth * page,
            });
        }
    };
    /**
	 *
     * @param {object} opts
	 * @param {string} opts.slider 滾動內容
	 * @param {string} opts.item 內容的單位
	 * @param {number} opts.len 一頁多少個單位
	 * @param {string} opts.next 下一頁的按鈕
	 * @param {string} opts.prev 上一頁的按鈕
     * @param {boolean} opts.autoPlay 自動播放
     * @param {boolean} opts.loop 循環
     */
    easyGlobal.ebSlide = function(opts) {
        var mode = opts.mode || 1;
        var sw = opts.wrapper;
        var si = opts.item;     // slideItem
        var ssic = opts.len;    // showSlideItemCount
        var navBtn = {
            next: opts.next || undefined,
            prev: opts.prev || undefined,
        };
        var slideTime = opts.slideTime || 2000;
        var autoPlay = opts.autoPlay || false;
        var loop = opts.loop || false;
        var sic = si.length;    // slideItemCount
        var nowPage = 1;
        var topa = [];
        setPosition();
        // var pageCount = Math.ceil(item.length / siCount);
        // !!navBtn.next && !!navBtn.prev && navBtnEvent();
        switch (mode) {
        case 1:
            var sih = getSlideItemHeight(si, sic);
            var sh = getShowHeight(sih, ssic);
            var pc = getPageCount(sih, sic, sh);
            navBtnEvent(sh, pc);
            break;
        case 2:
            copyFirstAndLast();
            setFirstItem(si.eq(1));
            setActiveItem(si.eq(1));
            setAutoPlay(slideTime);

            break;
        }
        function getSlideItemHeight(slideItem, slideItemCount) {
            var result = [],
                isMono = 0;
            for(var i=0; i < slideItemCount; i++) {
                result.push(slideItem.eq(i).outerHeight());
                isMono += slideItem.eq(i).outerHeight();
            }
            result = isMono % slideItemCount === 0 ? isMono/slideItemCount : result;
            return result;
        }
        function getPageCount(slideItemHeight, slideItemCount, showHeight) {
            return Math.ceil(slideItemHeight * slideItemCount / showHeight);
        }
        function setActiveItem(item) {
            var index = item.index();
            var sih = getSlideItemHeight(si, sic);
            item.attr('data-ebslide-active', '').siblings('[data-ebslide-active]').removeAttr('data-ebslide-active');
            sw.animate({'top': -topa[index]});
            loop && setLoop(item);
        }
        function setLoop(item) {
            if (item.index() === sic - 2) {
                setTimeout(function () {
                    sw.css('top', -topa[0]);
                    setActiveItem(si.eq(0));
                }, 500);
            }
            if (item.index() === 0) {
                sw.css('top', topa[-2]);
            }
        }
        function setFirstItem(item) {
            sw.css('top', -item.prev().outerHeight());
        }
        function getActiveItem() {
            return si.filter('[data-ebslide-active]');
        }
        function getShowHeight(itemHeight, showItemCount) {
            if(typeof itemHeight === 'number') {
                return itemHeight * showItemCount;
            }
        }
        function setAutoPlay(time) {
            var t = setInterval(function () {
                var h = getActiveItem();
                setActiveItem(h.next());
            }, time);
        }
        // function getActiveItemTop(activeItem, ) {
        //
        // }
        function copyFirstAndLast() {
            var first = sw.children().eq(0).clone(),
                last = sw.children().eq(-1).clone();
            sw.prepend(last);
            sw.append(first);
            si = sw.children();
            sic = si.length;
            for (var i=0; i < sic; i++) {
                var top = 0;
                for (var j=0; j < i; j++) {
                    top += si.eq(j).outerHeight() + 20;
                }
                topa.push(top);
            }
        }
        function setPosition() {
            sw.parent().css('position', 'relative');
            sw.css('position', 'absolute');
        }
        function navBtnEvent(showHeight, pageCount) {
            navBtn.next.on('click', function() {
                if (nowPage !== pageCount) {
                    nowPage++;
                    animate(nowPage - 1, showHeight);
                }
            });
            navBtn.prev.on('click', function() {
                if (nowPage !== 1) {
                    nowPage--;
                    animate(nowPage - 1, showHeight);
                }
            });
        }
        function animate(page, pageHeight) {
            sw.animate({
                'top': -1 * pageHeight * page,
            });
        }
    };
    //計算輸入的長度
    easyGlobal.mathValueLength =  function(inO, OutO, max) {
        OutO.html(inO.val().length);
        inO.attr('maxlength',max);
        inO.off('mouseup.num keyup.num keypress.num keydown.num');
        inO.on('mouseup.num keyup.num keypress.num keydown.num', function(event) {
            var len = $(this).val().length;
            if(len <= max) {
                OutO.html(len);
            } else {
                event.preventDefault();
                var newValue = $(this).val().substring(0, max);
                $(this).val(newValue);
                return;
            }
        });
    };
    //滾動加載
    // state 辦定事件獲取解綁事件，selecter事件選擇器，showBox顯示的盒子，fn回調函數，innerBox裡面容器高度
    /**
     *
     * @param {string} openState 开启为"on", 关闭为"off"
     * @param {string} evenSelector 事件选择器, 用于取消事件
     * @param {string|Object} viewport 窗口
     * @param {string|Object} context 内容
     * @param {Function} callback 回调函数
     */
    easyGlobal.easyScrollRequest = function(openState, evenSelector, viewport, context, callback){
        viewport = typeof viewport === 'string' ? $(viewport) : viewport;
        context = typeof context === 'string' ? $(context) : context;
        if(openState === 'on' || openState === true){
            var windowHeight = viewport.height();
            viewport.on('scroll.'+evenSelector, function(){
                var scrollTop = $(this).scrollTop();
                var scrollHeight = context.height();
                if(scrollTop + windowHeight >= scrollHeight * 0.7){
                    callback && callback();
                }
            });
        }else{
            viewport.off('scroll.' + evenSelector);
        }
    };
    //圖片水平垂直居中
    //使用方法 <img src="" middle="true">
    easyGlobal.imgOnMiddle = function(box){
        box.css('position','relative');
        var boxW = box.width();
        var boxH = box.height();
        var img = box.find('img[middle=true]');
        var imgObj = img[0];
        $(img).imagesLoaded(function(){
            setMiddle(img);
        });
        function setMiddle(img){
            $(img).css({
                'visibility':'visible',
                'position':'absolute',
                'top':'50%',
                'left':'50%',
                'transform': 'translate(-50%,-50%)',
                '-webkit-transform' : 'translate(-50%,-50%)',
                '-moz-transform': 'translate(-50%,-50%)',
                '-ms-transform': 'translate(-50%,-50%)',
                '-o-transform': 'translate(-50%,-50%)'
            });
            var imgW = img[0].width;
            var imgH = img[0].height;
            if(imgW == 0){
                imgW = img.attr('width');
                imgH = img.attr('height');
            }
            if(imgW > imgH){
                //圖片是橫著的
                imgW > boxW ? img.css({'width':'100%','height':'auto'}) : img.css({'width':'auto','height':'auto'});
            }else if(imgW < imgH){
                //圖片是豎著的
                imgH > boxH ? img.css({'height':'100%','width':'auto'}) : img.css({'width':'auto','height':'auto'});
            }else if(imgW == imgH){
                if(boxW > boxH){
                    //盒子是橫的
                    imgH >= boxH ? img.css({'height':'100%','width':'auto'}) : img.css({'width':'auto','height':'auto'});
                }else if(boxW < boxH){
                    //盒子是豎的
                    imgW > boxW ? img.css({'width':'100%','height':'auto'}) : img.css({'width':'auto','height':'auto'});
                }else{
                    //盒子也是正方形的
                    img.css({'width':'100%','height':'auto'});
                }
            }
            box.css('visibility','visible');
        }
    };
    //轉換數值
    easyGlobal.formatNum = function(num){
        var str = num + '';//转换成字符串
        var str_num = str.split('.')[0];
        var str_last = str.split('.')[1] == undefined ? '' : '.'+str.split('.')[1];
        var ret_num = '';
        var counter = 0;
        for(var i=str_num.length-1;i>=0;i--){
            ret_num = str_num.charAt(i) + ret_num;
            counter++;
            if(counter==3){
                counter = 0;
                if(i!=0){
                    ret_num = ',' + ret_num;
                }
            }}
        return ret_num + str_last;
    };
    //從數組裡面刪除指定內容的對象
    easyGlobal.deleteArrObj = function(arr,key,val){
        console.log(arr);
        console.log(key);
        console.log(val);
        var delInx = null;
        for(var i=0;i<arr.length;i++){
            if(arr[i][key] == val){
                delInx = i;
            }
        }
        arr.splice(delInx,1);
        return arr;
    };
    //修改數組指定字段對象的值
    easyGlobal.updateArrObj = function(arr,key,val,newKey,newVal){
        var updateIdx = null;
        for(var i=0;i<arr.length;i++){
            if(arr[i][key] == val){
                updateIdx = i;
            }
        }
        arr[updateIdx][newKey] = newVal;
        return arr;
    };
    //數組指定位置插入數組
    easyGlobal.insertArr = function(arra,idx,arrb){
        for(var i=0;i<arrb.length;i++){
            arra.splice(idx+i,0,arrb[i]);
        }
    };
    //點擊其他地方，彈框消失，不依賴遮罩層
    easyGlobal.maskClick = function(el,func,str){
        str = str == undefined ? 'maskClick' : str;
        $(document).off('mouseup.'+str);
        $(document).on('mouseup.'+str,function(e){
            if(!$(el).is(e.target) && $(el).has(e.target).length === 0){
                if(func) func();
            }
        });
    };
    //輸入框只允許輸入數字
    easyGlobal.justNumInput = function(id,func){
        $('#'+id).off('keyup');
        $('#'+id).on('keyup',function(){
            $(this).val($(this).val().replace(/[^\d^\.]+/g,''));
            if(func){
                func.call($(this),$(this).val());
            }
        });
    };
    //克隆對象
    easyGlobal.cloneObject = function(myObj){
        if(typeof(myObj) != 'object') return myObj;
        if(myObj == null) return myObj;
        var myNewObj = new Object();
        for(var i in myObj)
            myNewObj[i] = cloneObject(myObj[i]);
        return myNewObj;
    };
    //獲取之前n日的時間 返回 year-month-day 這樣的格式
    easyGlobal.getBeforeDate = function(n){
        var n = n;
        var d = new Date();
        var year = d.getFullYear();
        var mon = d.getMonth() + 1;
        var day = d.getDate();
        if(day <= n){
            if(mon>1){
                mon=mon-1;
            }else{
                year = year - 1;
                mon = 12;
            }
        }
        d.setDate(d.getDate() - n);
        year = d.getFullYear();
        mon = d.getMonth() + 1;
        day = d.getDate();
        var s = year+'-'+(mon<10?('0'+mon):mon)+'-'+(day<10?('0'+day):day);
        return s;
    };
    //計算相差時間
    easyGlobal.diffTime = function(startDate,endDate){
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        var a = 60 *1000;
        var b = 3600 *1000;
        var c = 24 * 3600 *1000;
        var diff=endDate.getTime() - startDate.getTime();//时间差的毫秒数
        //计算出相差天数
        var days=Math.floor(diff/c) < 0 ? 0 : Math.floor(diff/c);
        //计算出小时数
        var leave1=diff%c;    //计算天数后剩余的毫秒数
        var hours=Math.floor(leave1/b) < 0 ? 0 : Math.floor(leave1/b);
        //计算相差分钟数
        var leave2=leave1%b;        //计算小时数后剩余的毫秒数
        var minutes=Math.floor(leave2/a) < 0 ? 0 : Math.floor(leave2/a);
        //计算相差秒数
        var leave3=leave2%a;      //计算分钟数后剩余的毫秒数
        var seconds=Math.round(leave3/1000) < 0 ? 0 : Math.round(leave3/1000);
        var arr = [];
        arr.push(days);
        arr.push(hours);
        arr.push(minutes);
        arr.push(seconds);
        return arr;
    };
    //動態創建form並且提交
    easyGlobal.createFormSubmit = function(sendData,dataUrl){
        var ifr;
        try {
            ifr = document.createElement('<iframe name="myIframeName">');
        } catch (ex) {
            ifr = document.createElement('iframe');
            ifr.name = 'myIframeName';
        }
        ifr.id = 'myIframeId';
        ifr.width = 0;
        ifr.height = 0;
        ifr.style.display = 'none';
        var fr = document.createElement('form');
        fr.method = 'post';
        fr.action = dataUrl;
        fr.enctype = 'application/x-www-form-urlencoded';
        fr.id = 'myFormId';
        fr.target = 'myIframeName';
        fr.style.display = 'none';
        document.body.appendChild(fr);
        document.body.appendChild(ifr);
        for(var i in sendData){
            var hid = document.createElement('input');
            hid.type = 'hidden';
            hid.name = i;
            hid.value = sendData[i];
            fr.appendChild(hid);
        }
        if(dataUrl) fr.submit();
    };
    // IE9 不支持placeholder 這個方法能讓它有這個效果
    easyGlobal.supportPlaceholder = function(){
        if(!isSupportPlaceholder()){
            $('[placeholder]').focus(function() {
                var input = $(this);
                if(input.val() == input.attr('placeholder')) {
                    input.val('');
                    input.removeClass('placeholder').css('color','#FF527C');
                }
            }).blur(function() {
                var input = $(this);
                if(input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.addClass('placeholder').css('color','#A8A8A8');
                    input.val(input.attr('placeholder'));
                }
            }).blur().parents('form').submit(function() {
                $(this).find('[placeholder]').each(function() {
                    var input = $(this);
                    if(input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });
            });
        }
        // 判断浏览器是否支持placeholder属性
        function isSupportPlaceholder() {
            var input = document.createElement('input');
            return 'placeholder' in input;
        }
    };
    easyGlobal.supportPlaceholder();

    /**
	 * author: Junhang
	 * version: 2017.11.21 18:01
	 *
	 * @param {string} targetURL 请求的目标链接
	 * @param {object} requestData 请求的参数
	 * @param {boolean} encryptData 是否加密请求的参数
	 */
    easyGlobal.getRequestURL = function(params) {
        var targetURL = params.targetURL || '',
            requestData = params.requestData || '',
            encryptData = params.encryptData || false;
        var url = targetURL + '?';
        var dataKeys = Object.keys(requestData);
        url = dataKeys.reduce(function (pre, key) {
            return pre + key + '=' + requestData[key] + '&';
        }, url);
        url += 'easybuyCallback=?';
        return url;
    };
})(easyBuy.global.dep);
