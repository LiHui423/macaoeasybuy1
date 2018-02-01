/*例子:
 	new Chart({
		id:'envelopesubsidiary-table-red-month', //盒子id
		dataArr:dataArr, //數組
		timeRange:timeRange //數組
	},{
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
		marginAlign:34,//兩邊距離
		calibration:6,//橫坐標標尺長度
		outline:40,//坐標值的兩邊漏出的距離（小龜頭）
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
	});
*/
function Chart(paras,opts){
	this.id = paras.id; //盒子ID
	this.box = $('#'+ this.id); //盒子對象
	this.dataArr = paras.dataArr; //數據數組
	this.dataMax = this.arrayGetMax(this.dataArr); //數據的最大值
	this.timeRange = paras.timeRange; //時間數組
	this.timeRangeStyle = opts.timeRangeStyle; // 時間的格式
	this.cId = this.id + '-canvas'; //canvas的ID
	this.createCanvas(); // 創建canvas
	this.canv = $('#'+this.cId); //canvas對象
	this.cxt = this.canv[0].getContext('2d'); //context2D對象
	this.scaleStyle = opts.scaleStyle; // 標尺的樣式
	this.lineWidth = opts.lineWidth; //折線寬度(有多粗)
	this.lineColor = opts.lineColor;//折線顏色
	this.bgColor = opts.bgColor;//背景顏色
	this.scaleWidth = opts.scaleWidth; //標尺寬度(有多粗)
	this.scaleColor = opts.scaleColor; //標尺字體顏色
	this.scaleSize = opts.scaleSize; //標尺字體大小
	this.scaleDashedColor = opts.scaleDashedColor;//標尺虛線顏色
	this.scaleSolidColor = opts.scaleSolidColor;//標尺實線顏色
	this.radius = opts.radius; //圓點半徑
	this.bigDotColor = opts.bigDotColor;//大圓點顏色
	this.smallDotColor = opts.smallDotColor;//小圓點顏色
	this.hoverDotColor = opts.hoverDotColor;//鼠標移動上去圓點顏色
	this.dotRadio = opts.dotRadio;//小圓點與大圓點比例
	this.marginVertical = opts.marginVertical; //上下距離
	this.marginAlign = opts.marginAlign; //兩邊距離
	this.calibration = opts.calibration; //橫坐標標尺長度
	this.outline = opts.outline; //坐標值的兩邊漏出的距離（小龜頭）
	this.maxScaleNum = opts.maxScaleNum; //縱坐標分成多少行
	this.cWidth = this.canv[0].width - this.marginAlign - this.outline*2; //內容寬度
	this.cHeight = this.canv[0].height - this.marginVertical; // 內容高度
	this.half = this.dataArr.length == 1 ? 1 : this.cWidth/(2*(this.dataArr.length-1)); //刻度的寬度
	this.maxScale = Math.ceil(Math.ceil(this.dataMax / this.maxScaleNum) / 5) * 5 * this.maxScaleNum; //縱坐標最大值
	if(this.maxScale == 0){
		this.maxScale = 5 * this.maxScaleNum; //縱坐標最大值
	}
	this.heightRatio = this.cHeight / this.maxScale //高度於數據最大值比例
	this.coord = this.getCoord(this.dataArr); //獲取畫布上面要顯示的坐標點數組
	this.rectWidth = opts.rectWidth;//矩形寬
	this.rectHeight = opts.rectHeight;//矩形高
	this.rectMargin = opts.rectMargin;//矩形邊距
	this.rectColor = opts.rectColor; //矩形背景顏色
	this.rectOneTextColor = opts.rectOneTextColor; //矩形字體顏色(第一行)
	this.rectTwoTextColor = opts.rectTwoTextColor; //矩形字體顏色(第二行)
	this.rectOneTextSize = opts.rectOneTextSize; //字體大小(第一行)
	this.rectTwoTextSize = opts.rectTwoTextSize; //字體大小(第二行)
	this.rectOneTextAlign = opts.rectOneTextAlign; //字體位置(第一行)
	this.rectTwoTextAlign = opts.rectTwoTextAlign;//字體位置(第二行)
	this.rectOnePosition = opts.rectOnePosition;//字體的高度的位置(第一行)
	this.rectTwoPosition = opts.rectTwoPosition;//字體的高度的位置(第二行)
	this.lineOneText = opts.lineOneText;//顯示文字形式(第一行)
	this.lineTwoText = opts.lineTwoText;//顯示文字形式(第二行)
	this.tolerantNum = opts.tolerantNum;//圓點周圍的值(鼠標hover上這個區域都可以顯示矩形彈框)
	this.hoverCoord = this.getHoverCoord(this.coord); //轉換之後的坐標值，相對於canvas的左上角，無縮放
	this.draw();
}
Chart.prototype = {
	draw:function(){
		//執行命令
		var self = this;
		var cxt = self.cxt;
		cxt.translate(this.marginAlign + this.outline, this.cHeight + this.radius*1.5);
		drawDefault();
		this.addHoverEle();//創建空div
		//鼠標hover事件
		this.box.find('div').hover(function(){
			var index = $(this).index() - 1;
			self.drawHoverDot(index);
			var res = getShowText(index);
			self.drawRect(index,res.one,res.two);
		},function(){
			cxt.save();
			cxt.translate(0-self.marginAlign-self.outline, 0-self.cHeight-self.radius*1.5);
			cxt.clearRect(0,0,self.canv[0].width,self.canv[0].height);
			cxt.restore();
			drawDefault();
		});
		//畫布的默認底圖
		function drawDefault(){
			self.drawScale();
			self.drawBg();
			self.drawDateLine();
			self.drawDot();
		}
		function getShowText(index){
			//數據變成字符串
			var obj = {
				one:'',
				two:''
			}
			var a = self.lineOneText.split('^');
			a[1] = self.timeRange[index] + '';
			obj.one = a.join('');
			var b = self.lineTwoText.split('^');
			b[1] = self.formatNum(self.dataArr[index]) + '';
			obj.two = b.join('');
			a = null;
			b = null;
			return obj;
		}
	},
	drawDot:function(){
		var cxt = this.cxt;
		//點
		for(var i = 0; i < this.coord.length; i++) {
			//大圓
			cxt.beginPath();
			cxt.arc(this.coord[i][0], -1 * this.coord[i][1], this.radius, 0, 360, false);
			cxt.fillStyle = this.bigDotColor;
			cxt.fill();
			cxt.closePath();
			//小圓
			cxt.beginPath();
			cxt.arc(this.coord[i][0], -1 * this.coord[i][1], this.radius / this.dotRadio, 0, 360, false);
			cxt.fillStyle = this.smallDotColor;
			cxt.fill();
			cxt.closePath();
		}
	},
	drawBg:function(){
		//數據折線下的背景顏色
		var cxt = this.cxt;
		cxt.beginPath();
		this.coordLine(cxt,this.coord);
		cxt.lineTo(this.coord[this.coord.length - 1][0] + 0.5, -1 * this.coord[this.coord.length - 1][1]);
		cxt.lineTo(this.coord[this.coord.length - 1][0] + 0.5, 0);
		cxt.lineTo(-0.5, 0);
		cxt.lineTo(-0.5, -1 * this.coord[0][1]);
		cxt.fillStyle = this.bgColor;
		cxt.fill();
		cxt.closePath();
	},
	drawDateLine:function(){
		//數據折線
		var cxt = this.cxt;
		cxt.beginPath();
		cxt.strokeStyle = this.lineColor;
		cxt.lineJoin = 'round';
		cxt.lineCap = 'round';
		cxt.lineWidth = this.lineWidth;
		this.coordLine(cxt,this.coord);
		cxt.stroke();
		cxt.closePath();
	},
	drawScale:function(){
		//畫標尺
		var cxt = this.cxt;
		//縱坐標標尺
		cxt.font = this.scaleSize + ' 微軟雅黑';
		cxt.fillStyle = this.scaleColor;
		cxt.textAlign = 'center';
		for(var i = 0; i < this.maxScaleNum+1; i++) {
			cxt.beginPath();
			var scaleY = this.maxScale / this.maxScaleNum * i * -1;
			cxt.strokeStyle = this.scaleDashedColor;
			cxt.lineWidth = this.scaleWidth/2;
			if(i == 0) {
				cxt.strokeStyle = this.scaleSolidColor;
				cxt.lineWidth = this.scaleWidth;
				cxt.moveTo(-1 * this.outline,this.heightRatio * scaleY);
				cxt.lineTo(this.cWidth + this.outline, this.heightRatio * scaleY);
				cxt.stroke();
			} else {
				if(this.scaleStyle == 'solid'){
					cxt.moveTo(-1 * this.outline,this.heightRatio * scaleY);
					cxt.lineTo(this.cWidth + this.outline, this.heightRatio * scaleY);
					cxt.stroke();
				}else if(this.scaleStyle == 'dashed'){
					this.drawDashLine(
						cxt,
						-1 * this.outline,this.heightRatio * scaleY,
						this.cWidth + this.outline, this.heightRatio * scaleY,
						3
					)
				}
			}
			cxt.fillText(scaleY * -1, (-1*this.marginAlign/2) - this.outline, this.heightRatio * scaleY + (Math.ceil(parseInt(this.scaleSize)/3)));
			cxt.closePath();
		}
		//橫坐標
		cxt.beginPath();
		cxt.strokeStyle = this.scaleSolidColor;
		for(var j = 0; j < this.timeRange.length; j++) {
			cxt.moveTo(this.half * j * 2, 0);
			cxt.lineTo(this.half * j * 2, this.calibration);
		}
		cxt.stroke();
		cxt.closePath();
		//橫坐標標尺文字
		cxt.beginPath();
		if(this.timeRangeStyle == 'year' || this.timeRangeStyle == 'month'){
			for(var k=0; k<this.timeRange.length; k++){
				cxt.fillText(this.timeRange[k], this.half * k * 2, 22);
			}
		}
		if(this.timeRangeStyle == 'auto'){
			if(this.timeRange.length < 9) {
				for(var i = 0; i < this.timeRange.length; i++) {
					cxt.fillText(this.timeRange[i], this.half * i * 2, 22);
				}
			} else if(this.timeRange.length >= 9 && this.timeRange.length < 12) {
				if(this.timeRange.length % 2 == 0) {
					for(var i = 0; i < this.timeRange.length; i += 3) {
						cxt.fillText(this.timeRange[i], this.half * i * 2, 22);
					}
				} else {
					for(var i = 0; i < this.timeRange.length; i += 2) {
						cxt.fillText(this.timeRange[i], this.half * i * 2, 22);
					}
				}
			} else {
				if(this.timeRange.length >= 12) {
					var num = Math.ceil(
						(8 / 30) * this.timeRange.length
					)
					var len = this.timeRange.length - 1;
					var newNum = num - 1;
					for(var i = 0; i < num; i++) {
						var b = Math.floor(len / newNum * i);
						cxt.fillText(this.timeRange[b], this.half * b * 2, 22);
					}
				}
			}
		}
		cxt.closePath();
	},
	drawHoverDot:function(index){
		var cxt = this.cxt;
		cxt.beginPath();
		cxt.arc(this.coord[index][0], -1 * this.coord[index][1],this.radius, 0, 360, false);
		cxt.fillStyle = this.hoverDotColor;
		cxt.fill();
		cxt.closePath();
	},
	drawRect:function(index,lineOne,lineTwo){
		var self = this;
		var cxt = this.cxt;
		var middleNum = Math.ceil(self.coord.length/2);
		if(self.coord[index][1] + self.rectHeight > self.cHeight + self.marginVertical) {
			if(index< middleNum){
				drawRoundedRect({
					x: self.coord[index][0] + self.rectMargin,
					y: -1 * (self.coord[index][1] - self.rectMargin),
					width: self.rectWidth,
					height: self.rectHeight
				}, 6, cxt, lineOne, lineTwo);
			}else{
				drawRoundedRect({
					x: self.coord[index][0] - (self.rectWidth + self.rectMargin),
					y: -1 * (self.coord[index][1] - self.rectMargin),
					width: self.rectWidth,
					height: self.rectHeight
				}, 6, cxt, lineOne, lineTwo);
			}
		} else {
			if(index < middleNum) {
				drawRoundedRect({
					x: self.coord[index][0] + self.rectMargin*1.5,
					y: -1 * (self.coord[index][1] + self.rectHeight / 2),
					width: self.rectWidth,
					height: self.rectHeight
				}, 6, cxt, lineOne, lineTwo);
			} else {
				drawRoundedRect({
					x: self.coord[index][0] - (self.rectWidth + self.rectMargin*1.5),
					y: -1 * (self.coord[index][1] + self.rectHeight / 2),
					width: self.rectWidth,
					height: self.rectHeight
				}, 6, cxt, lineOne, lineTwo);
			}
		}
		function Point(x, y) {
			return {
				x: x,
				y: y
			};
		};
		function drawRoundedRect(rect, r, cxt, timeText, readNumText) {
			var ptA = Point(rect.x + r, rect.y);
			var ptB = Point(rect.x + rect.width, rect.y);
			var ptC = Point(rect.x + rect.width, rect.y + rect.height);
			var ptD = Point(rect.x, rect.y + rect.height);
			var ptE = Point(rect.x, rect.y);
			cxt.beginPath();
			cxt.moveTo(ptA.x, ptA.y);
			cxt.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r);
			cxt.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r);
			cxt.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r);
			cxt.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r);
			cxt.fillStyle = self.rectColor;
			cxt.fill();
			cxt.font = self.rectOneTextSize + ' 微软雅黑';
			cxt.fillStyle = self.rectOneTextColor;
			cxt.textAlign = 'left';
			cxt.fillText(timeText, self.rectMargin + rect.x + self.rectOneTextAlign,rect.y + rect.height/2 + self.rectOnePosition);
			cxt.font = self.rectTwoTextSize + ' 微软雅黑';
			cxt.fillStyle = self.rectTwoTextColor;
			cxt.textAlign = 'left';
			cxt.fillText(readNumText, self.rectMargin + rect.x + self.rectOneTextAlign,rect.y + rect.height/2 + self.rectTwoPosition);
			cxt.closePath();
		}
	},
	addHoverEle:function(){
		this.box.css('position','relative');
		for(var i=0; i<this.hoverCoord.length;i++){
			var div = '<div index="'+i+'" style="background-color:rgba(0,0,0,0);position:absolute;left:'+(this.hoverCoord[i][0]-this.tolerantNum/2)+'px;top:'+(this.hoverCoord[i][1]-this.tolerantNum/2)+'px;width:'+this.tolerantNum+'px;height:'+this.tolerantNum+'px;z-index:2;"></div>';
			this.box.append(div);
			div = null;
		}
	},
	coordLine:function(cxt,arr){
		//點連成線
		for(var i = 0; i < arr.length; i++) {
			if(i != 0) {
				cxt.lineTo(arr[i][0], -1 * arr[i][1]);
			} else {
				cxt.moveTo(arr[i][0], -1 * arr[i][1]);
			}
		}
	},
	getCoord:function(arr){
		//獲取translate之後相對於 （0,0）的距離
		var newArr = [];
		for(var i = 0; i < arr.length; i++) {
			newArr[i] = [
				this.half * i * 2,
				this.heightRatio * arr[i]
			];
		}
		return newArr;
	},
	getHoverCoord:function(arr){
		//獲取相對於盒子左上角的距離
		var newArr = [];
		for(var i=0; i<arr.length; i++){
			newArr[i] = [
				arr[i][0] + this.outline + this.marginAlign,
				this.canv[0].height - (arr[i][1] + (this.marginVertical - this.radius*1.5))
			];
		}
		return newArr;
	},
	createCanvas:function(){
		//創建canvas
		var canvas = '<canvas id="' + this.cId + '" width="' + this.box.width() + '" height="' + this.box.height() + '">您的瀏覽器不支持該功能，請更新您的瀏覽器</canvas>';
		$('#'+this.id).html(canvas);
	},
	drawDashLine:function(context,x1,y1,x2,y2,dashLen){
		//畫虛線
	    dashLen = dashLen === undefined ? 5 : dashLen;
	    var beveling = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
	    var num = Math.floor(beveling/dashLen);
	    for(var i = 0 ; i < num; i++){
	        context[i%2 == 0 ? 'moveTo' : 'lineTo'](x1+(x2-x1)/num*i,y1+(y2-y1)/num*i);
	    }
	    context.stroke();
	},
	arrayGetMax:function(a){
		//獲取數組最大值
		var max = a[0];
		for(var i = 1; i < a.length; i++) {
			if(max < a[i]) {
				max = a[i];
			}
		}
		return max;
	},
	formatNum:function(num){
		var str_num = num + "";//转换成字符串
	    var ret_num = "";
	    var counter = 0;
	    for(var i=str_num.length-1;i>=0;i--){
	        ret_num = str_num.charAt(i) + ret_num;
	        counter++;
	        if(counter==3){
	            counter = 0;
	            if(i!=0){
	            ret_num = "," + ret_num;
	            }
	        }}
	    return ret_num;
	}
}