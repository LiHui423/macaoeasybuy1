$(function(){
	headTop(); //頂部跟底部的兌換器
	redMonthDetail();//紅包明細
	integralsMonthDetail();//積分明細
	myCanvasData(); //圖表
	integralStrategy();//積分攻略
	scrollTopNav('slider-nav'); //左邊導航的吸頂滾動與滾動條監聽，點擊滾動
});
function myCanvas(){
	//參數配置
	var res = {};
	res.objRed = {
		timeRangeStyle:'year',//標尺時間是按年顯示 'year','month','auto'
		lineWidth:2,//折線寬度
		lineColor:'rgba(255,91,119,1)',//折線顏色
		bgColor:'rgba(255,91,119,.1)',//背景顏色
		scaleWidth:2,//標尺寬度
		scaleColor:'#888',//標尺字體顏色
		scaleSize:'14px',//標尺字體大小
		scaleDashedColor:'#aaa',//標尺虛線顏色
		scaleSolidColor:'#888',//標尺實線顏色
		radius:6,//圓點半徑
		bigDotColor:'rgba(255,91,119,1)',//大圓點顏色
		smallDotColor:'rgba(255,255,255,1)',//小圓點顏色
		hoverDotColor:'rgba(255,91,119,1)',//鼠標移動上去圓點顏色
		dotRadio:2,//小圓點與大圓點比例 (數值越小,小圓點越大)
		marginVertical:35,//上下距離
		marginAlign:60,//兩邊距離
		calibration:6,//橫坐標標尺長度
		outline:25,//坐標值的兩邊漏出的距離（小龜頭）
		maxScaleNum:7,//縱坐標分成多少行
		scaleStyle:'dashed', // 標尺的樣式  'solid' 實線  'dashed' 虛線
		tolerantNum:12,//圓點周圍的值(鼠標hover上這個區域都可以顯示矩形彈框)
		rectWidth:124,//矩形寬
		rectHeight:50,//矩形高
		rectMargin:6,//矩形邊距
		rectColor:'rgba(255,91,119,.98)',//矩形背景顏色
		lineOneText:'2017-^time^ 紅包餘額',//顯示文字形式(第一行) time是個變量(變量兩邊用^分割)
		lineTwoText:'$^data^ 紅包',//顯示文字形式(第二行) data是個變量(變量兩邊用^分割)
		rectOneTextColor:'#fff',//矩形字體顏色(第一行)
		rectTwoTextColor:'#fff',//矩形字體顏色(第二行)
		rectOneTextSize:'14px',//矩形字體大小(第一行)
		rectTwoTextSize:'18px',//矩形字體大小(第二行)
		rectOnePosition:-7,//字體垂直位置(第一行)
		rectTwoPosition:16,//字體垂直位置(第二行)
		rectOneTextAlign:-2,//字體水平位置(第一行)
		rectTwoTextAlign:1,//字體水平位置(第二行)
	};
	res.objBlue = cloneObject(res.objRed);
	res.objBlue.lineColor = 'rgba(0,183,238,1)';
	res.objBlue.bgColor = 'rgba(0,183,238,.1)';
	res.objBlue.bigDotColor = 'rgba(0,183,238,1)';
	res.objBlue.hoverDotColor = 'rgba(0,183,238,1)';
	res.objBlue.rectColor = 'rgba(0,183,238,1)';
	res.objBlue.lineTwoText = '^data^ 分';
	return res;
}
function scrollTopNav(id){
	var obj = $('#'+id); //吸頂對象
	obj.css('width',obj.outerWidth(true)); //設置對象默認寬度
	var minTop = obj.offset().top; //對象到頂部的距離
	var maxTop = $('.content-box-right').outerHeight(true) + minTop - obj.outerHeight(true); //對象最高滾動的距離
	var arr = []; //獲取右邊對象到頂部距離，與對象的高度
	arr[0] = [$('.envelopesubsidiary-box.red').offset().top,$('.envelopesubsidiary-box.red').outerHeight()];
	arr[1] = [$('.envelopesubsidiary-box.integrals').offset().top,$('.envelopesubsidiary-box.integrals').outerHeight()];
	arr[2] = [$('.instructions.post').offset().top,$('.instructions.post').outerHeight()];
	arr[3] = [$('.instructions.exchange').offset().top,$('.instructions.exchange').outerHeight()];
	scrollToBox();//綁定點擊事件，點擊變化頁面的位置
	//事件的調用
	var wTop = $(window).scrollTop();
	var windowHeight = $(window).height();
	change(wTop);
	changeSelect(wTop,arr,windowHeight);
	$(window).on('scroll',function(){
		wTop = $(window).scrollTop();
		windowHeight = $(window).height();
		change(wTop);
		changeSelect(wTop,arr,windowHeight);
	});
	$(window).on('resize',function(){
		var wTop = $(window).scrollTop();
		windowHeight = $(window).height();
		change(wTop);
		changeSelect(wTop,arr,windowHeight);
	});
	//吸頂變化
	function change(wTop){
		if(wTop <= minTop){
			obj.css({
				'position':'static'
			})
		}else if(wTop > minTop && wTop<maxTop){
			obj.css({
				'position':'fixed',
				'top':'0px',
				'left':$('.content-box-right').offset().left - obj.outerWidth(true) - $(window).scrollLeft()
			});
		}else{
			obj.css({
				'position':'relative',
				'top':maxTop - minTop,
				'left':'0px'
			});
		}
	}
	//導航樣式的變動
	function changeSelect(wTop,arr,wH){
		if(wTop <= arr[0][0] + arr[0][1] - wH/8){
			$('.nav-box li').eq(0).siblings('li').removeClass('select').end().addClass('select');
		}else if(wTop > arr[0][0] + arr[0][1] - wH/4 && wTop <= arr[1][0] + arr[1][1] - wH/8){
			$('.nav-box li').eq(1).siblings('li').removeClass('select').end().addClass('select');
		}else if(wTop > arr[1][0] + arr[1][1] - wH/4 && wTop <= arr[2][0] + arr[2][1] - wH/8){
			$('.nav-box li').eq(2).siblings('li').removeClass('select').end().addClass('select');
		}else{
			$('.nav-box li').eq(3).siblings('li').removeClass('select').end().addClass('select');
		}
	}
	//點擊滾動條位置變化
	function scrollToBox(){
		var timer = null;
		$('.nav-box li.anchor').on('click',function(){
			if(timer == null){
				wTop = $(window).scrollTop();
				var bTop = $('.content-box-right>div').eq($(this).index()).offset().top;
				if(wTop - bTop >0){
					timer = setInterval(function(){
						wTop = $(window).scrollTop();
						window.scrollBy(0,-100);
						if(wTop <= bTop){
							clearInterval(timer);
							window.scrollTo(0,bTop);
							timer = null;
						}
					},20);
				}else if(wTop - bTop < 0){
					timer = setInterval(function(){
						wTop = $(window).scrollTop();
						window.scrollBy(0,100);
						if(wTop >= bTop){
							clearInterval(timer);
							window.scrollTo(0,bTop);
							timer = null;
						}
					},20);
				}
			}
		});
	}
}
