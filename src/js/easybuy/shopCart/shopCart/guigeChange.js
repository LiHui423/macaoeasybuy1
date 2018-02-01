var Guige;
var kucun;
var jiage;
var price;
var sumKucun;
var guigeRules;
var labellist;
var mop;
var depreciate;


/**
 * 渲染规格选择
 * @param {Object} data
 */
function GetRules(data,obj) {
	getData(data);
	GuigebtnClick(guigeRules,obj);
	imageClick(Guige,obj);
}

/**
 * 獲得數據
 * @param {Object} data
 */
function getData(data) {
	guigeRules = data.guigejson;
	price = data.price;
	Guige = data.guige;
	kucun = data.kucun;
	jiage = data.jiage;
	mop=data.mop;
	depreciate=data.depreciate;
	labellist=data.labellist;
}

/**
 * 規格選擇
 */
function ChooseSizeClick(){
	$(".changeSize img").off('click').on("click",function(){
		var spinfo=$(this).closest(".shopCart_eachGood_size").find(".spinfo");
		var guigejson=spinfo.attr("data-guigeJson");
		var guige=spinfo.attr("data-guige");
		var kucun=spinfo.attr("data-kucun");
		var jiage=spinfo.attr("data-jiage");
		var mop=spinfo.attr("data-mop");
		var depreciate=spinfo.attr("data-depreciate");
		var price=spinfo.attr("data-price");
		var labellist=spinfo.attr("data-labellist");
		var obj=$(this).closest(".shopCart_tabMain_eachGood").find(".shopCart_eachGood_changeSize");
		
		var data={
			guigejson:guigejson,
			guige:guige,
			kucun:kucun,
			jiage:jiage,
			mop:mop,
			depreciate:depreciate,
			price:price,
			labellist:labellist
		}
		
		GetRules(data,obj);
		
		var sStandard=$(this).closest(".shopCart_tabMain_eachGood").find(".shopCart_eachGood_size").attr("data");
		var sStandardArr=sStandard.split("|");
		for(var i=0;i<sStandardArr.length;i++){
			obj.find(".btn-guige").each(function(){
				var title=$(this).attr("title");
				if(sStandardArr[i]==title){
					if(!$(this).hasClass("selected")){
						$(this).click();
					}
				}
			});
		}
		
	});
	
	
	
}

/**
 * 規格點擊
 * @param {Object} guigeRules
 */
function GuigebtnClick(guigeRules,obj){
	var Rules =JSON.parse(guigeRules);
	
	obj.find(".btn-guige").off('click').on('click',function(){
		
		//获取规则
		var rule = ',' + (Rules[$(this).attr('title')] || []).join() + ',';
		
		var spguigeId=$(this).closest('ul').attr('id');
		
		if($(this).hasClass("selected"))
		{   
			//取消按鈕后實付金額與省去價格的變動為0
			$(this).removeClass("selected").removeClass("disabled");
			if(obj.find(".bgall").length==1){
			   $(this).siblings().removeClass("disabled");
			}
			
			obj.find(".yListr ul:not('#"+spguigeId+"') li .goodMessBox_messBox_eachSize").each(function () {
				//判斷生成的規則中有沒有該.goodMessBox_messBox_eachSize的標籤
		        if (rule.indexOf(',' + this.title + ',') != -1) 
		       {
		           $(this).removeClass('disabled');
		       }
		   });
			
			//三個規格的再次單擊
			if(obj.find(".selected").length==1)
			{
				var spid=obj.find(".selected").closest('ul').attr('id');
				var title=obj.find(".selected")[0].title;
				obj.find(".bgall ul li .goodMessBox_messBox_eachSize").removeClass('disabled');
				var aginrule = ',' + (Rules[obj.find(".selected").attr('title')] || []).join() + ',';
				obj.find(".yListr ul:not('#"+spid+"') li .goodMessBox_messBox_eachSize").each(function () {
					
					//判斷生成的規則中有沒有該.goodMessBox_messBox_eachSize的標籤
					if (aginrule.indexOf(',' + this.title + ',') != -1) 
					{
						$(this).removeClass('selected').addClass('disabled');
					}
				});
			}else if(obj.find(".selected").length==2)
			{
				var title=Rules[obj.find(".selected")[0].title+obj.find(".selected")[1].title];
				if(title.length==1)
		    	{
					obj.find(".bgall ul li .goodMessBox_messBox_eachSize").each(function () {
						if(title[0]!=this.title)
						{
							if(!$(this).hasClass("selected"))
							{
								$(this).addClass('disabled');
							}
						}
					});
		    	}else if(title.length>1){
		    		obj.find(".bgall ul li .goodMessBox_messBox_eachSize").each(function () {
		    			//將所有按鈕都設置上遮罩
		    			if(!$(this).hasClass("selected")){
			    				$(this).addClass("disabled");
			    		}
		    			//遍歷出現的規則
		    			for(var i=0;i<title.length;i++)
		    			{
		    				if(title[i]==this.title)
		    				{
		    					if(!$(this).hasClass("selected"))
		    					{
		    						$(this).removeClass("disabled");
		    					}
		    				}
		    			}
					});
		    		
		    	}
			}
			
			
		CancelGuige(obj);		
		
		}else if($(this).hasClass("disabled")){
			return false;
		}else{
			
			if(obj.find(".bgall").length==1){
				//有且僅有一個規格邏輯判斷
				$(this).addClass("selected").siblings().removeClass("selected");
				
				AllCorresevent(obj);
				
			}else if(obj.find(".bgall").length==2){
				//兩個規格的邏輯判斷
				$(this).addClass("selected").siblings().removeClass("selected");
				//是否移除除了自己這一行外的所有元素
				obj.find(".yListr ul:not('#"+spguigeId+"') li .goodMessBox_messBox_eachSize").removeClass("disabled");
				obj.find(".yListr ul:not('#"+spguigeId+"') li .goodMessBox_messBox_eachSize").each(function () {
					//判斷生成的規則中有沒有該.goodMessBox_messBox_eachSize的標籤
					if (rule.indexOf(',' + this.title + ',') != -1) 
					{
						$(this).removeClass('selected').addClass('disabled');
					}
				});
                
				//看看在單擊更換按鈕時候會不會覆蓋之前選擇的按鈕,如若有的話去除他之前添加的樣式
				if(!obj.find(".yListr :not('#"+spguigeId+"') li .goodMessBox_messBox_eachSize").hasClass('selected'))
				{
					$(this).siblings().removeClass("disabled");
				}
				
				AllCorresevent(obj);
				
			}else if(obj.find(".bgall").length==3){
				$(this).addClass("selected").siblings().removeClass("selected");
			    if(obj.find(".selected").length==1)
			    {
			    	//是否移除除了自己這一行外的所有元素
			    	obj.find(".yListr ul:not('#"+spguigeId+"') li .goodMessBox_messBox_eachSize").removeClass("disabled");
			    	obj.find(".yListr ul:not('#"+spguigeId+"') li .goodMessBox_messBox_eachSize").each(function () {
						//判斷生成的規則中有沒有該.goodMessBox_messBox_eachSize的標籤
						if (rule.indexOf(',' + this.title + ',') != -1) 
						{
							$(this).removeClass('selected').addClass('disabled');
						}
					});
			    }else if(obj.find(".selected").length==2)
			    {
			    	var title=Rules[obj.find(".selected")[0].title+obj.find(".selected")[1].title];
			    	
			    	if(title.length==1)
			    	{
			    		obj.find(".bgall ul li .goodMessBox_messBox_eachSize").each(function () {
			    			if(title[0]!=this.title)
			    			{
			    				if(!$(this).hasClass("selected"))
			    				{
			    					$(this).addClass('disabled');
			    				}
			    			}
			    		});
			    	}else if(title.length>1){
			    		obj.find(".bgall ul li .goodMessBox_messBox_eachSize").each(function () {
			    			if(!$(this).hasClass("selected")){
			    				$(this).addClass("disabled");
			    			}
			    			for(var i=0;i<title.length;i++){
			    				if(title[i]==this.title)
			    				{
			    					if(!$(this).hasClass("selected"))
			    					{
			    						$(this).removeClass("disabled");
			    					}
			    				}
			    			}
			    		});
			    	}
			    }else if(obj.find(".selected").length==3){
			    	AllCorresevent(obj);
			    }
			}
		}
	})
}

/**
 * 
 * @param {Object} Condition 篩選條件
 * @param {Object} specifications 選中子規格
 * @param {Object} guige 規格
 */
function getResult(Condition,specifications,Guige){
	var result="";
	var GuigeArr=Guige.split(",");
	var ConditionArr=Condition.split(",");
	for(var i=0;i<GuigeArr.length;i++){
	    if(specifications===GuigeArr[i]){
	    	result=ConditionArr[i];
	    }
	}
	return result;
}
/**
 * @param {Object} specifications 選中子規格
 * @param {Object} Guige 規格
 */
function getIndex(specifications,Guige){
	var result=0;
	var GuigeArr=Guige.split(",");
	for(var i=0;i<GuigeArr.length;i++){
	    if(specifications===GuigeArr[i]){
	    	result=i;
	    }
	}
	return result;
}

/**
 * 獲得用戶已經選中的規格
 */
function GuigeForSpecifications(ob){
	var specifications="";
	var obj=ob.find(".selected");
	for(var i=0;i<3;i++){
		if(i<obj.length){
			specifications+=obj[i].title;
		}
		if(i<2){
			specifications+="|";
		}
	}
	return specifications;
}
/**
 * 所有规格选中事件
 */
function AllCorresevent(obj){
	if(obj.find(".bgall").length==obj.find(".selected").length){
	  var specifications = GuigeForSpecifications(obj);
	  var index = getIndex(specifications, Guige);
	  var kc = getResult(kucun, specifications, Guige);
	  var jg = getResult(jiage, specifications, Guige);
	  
	  obj.find(".picimg .guigeImg").eq(index).addClass("picSelected").siblings().removeClass("picSelected");
	  var bgall=obj.find(".bgall");
	  var selected=obj.find(".selected");
	  
	  if(bgall.length==selected.length){
		  if(kc<=0){
			  obj.find(".shopCart_eachGood_changeSize_sure").removeClass("shopCart_eachGood_changeSize_sure_curr");
			  obj.find(".shopCart_eachGood_changeSize_null").fadeIn("fast");
		  }else{
			  obj.find(".shopCart_eachGood_changeSize_sure").addClass("shopCart_eachGood_changeSize_sure_curr");
			  obj.find(".shopCart_eachGood_changeSize_null").fadeOut("fast");
		  }
	  }else{
		  obj.find(".shopCart_eachGood_changeSize_sure").removeClass("shopCart_eachGood_changeSize_sure_curr");
		  obj.find(".shopCart_eachGood_changeSize_null").fadeOut("fast");
	  }
	  
	}
}

/**
 * 圖片單擊事件
 */
function imageClick(guige,obj) {
	obj.find(".guigeImg").click(function() {
		if($(this).hasClass("picSelected")) {
			$(this).removeClass("picSelected");
			obj.find(".btn-guige").removeClass("disabled selected");
			CancelGuige(obj);
		}else{
			CancelGuige(obj);
			obj.find(".btn-guige").removeClass("disabled selected");
			$(this).addClass("picSelected").siblings().removeClass("picSelected");

			var index = obj.find(".guigeImg").index(this);
			var guigelist = guige.split(",");
			
			var guigeStr = guigelist[index];
			
			obj.find(".btn-guige").each(function() {
				if(("|" + guigeStr + "|").indexOf("|" + $(this).attr("title") + "|") >= 0) {
					$(this).click();
				}
			});
		}

	});
}

function CancelGuige(obj){
	$(".picimg .guigeImg").removeClass("picSelected");
	
	var bgall=obj.find(".bgall");
	var selected=obj.find(".selected");
	if(bgall.length==selected.length){
		obj.find(".shopCart_eachGood_changeSize_sure").addClass("shopCart_eachGood_changeSize_sure_curr");
	}else{
		obj.find(".shopCart_eachGood_changeSize_sure").removeClass("shopCart_eachGood_changeSize_sure_curr");
		obj.find(".shopCart_eachGood_changeSize_null").fadeOut("fast");
	}
}

/**
 * 更改价格
 * @param {Object} price
 */
function ChangeMop(price){
	var Changeprice=price;
	for(var i=0;i<labellist.length;i++){
		var label=labellist[i];
		Changeprice+=parseInt(label.price);
	}
	Changeprice-=mop;
	Changeprice-=depreciate;
	return Changeprice;
}

