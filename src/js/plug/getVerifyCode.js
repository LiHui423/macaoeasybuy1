;(function (window,document){
	function getVerifyCode(options) {
		var fn = arguments.callee;
		return function() {
			clearInterval(timer);
			if(!(options && Object.prototype.toString.call(options.callBack) == "[object Function]")) {
				throw new Error("必须传递参数及回调函数");
			}
			var that = $(this);
			
			var timer = null,
				time = options.time || 60,
				count = 0,//记录定时器执行了多少次
				interval = 1000,//每次执行间隔
				start = new Date().getTime(),//开始执行时间
				targetTime = time * 1000,//目标时间
				unabledClass = options.unabledClass || "",
				timeIsUpText = options.timeIsUpText || "重新獲取",
				timeRunnigText = options.timeRunnigText || "s後重新獲取";
			that.off("click");
			that.addClass(unabledClass);
			timer = setTimeout(function() {
				var wucha = 0,//计算误差
					//下一次执行时间,下一次执行时间 = 每次执行间隔 - 误差
					nextRunTime = interval,
					currentFn = arguments.callee;
				count ++;
				wucha = new Date().getTime() - (start + count * interval);
				wucha = (wucha <= 0) ? 0 : wucha;
				nextRunTime = interval - wucha;
				nextRunTime = (nextRunTime <= 0) ? 0 : nextRunTime
				//console.log("误差：" + wucha + "，下一次执行时间：" + nextRunTime);
				if((targetTime -= interval) <= 0){
					clearTimeout(timer);
					/*time = 60;*/
					that.html(timeIsUpText).removeClass(unabledClass);
					that.on("click", fn(options));
				}else{
					time--;
					that.html(time + timeRunnigText);
					//在外部可以获取到倒计时当前时间
					if(options.getCurrentTime && (Object.prototype.toString.call(options.getCurrentTime) == "[object Function]")){
						options.getCurrentTime.call(that,time);
					}
					timer = setTimeout(currentFn,nextRunTime);
				}
			}, interval);
			//执行回调函数
			options.callBack.call(that);
		}
	}
	window.getVerifyCode = getVerifyCode;
})(window,document);
