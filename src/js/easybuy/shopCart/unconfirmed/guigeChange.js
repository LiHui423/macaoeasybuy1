var Guige;
var kucun;
var jiage;
var price;
var sumKucun;
var guigeRules;
var labellist;
var mop;
var depreciate;
var kc;
var SelectsStandard = [];


/**
 * 渲染规格选择
 * @param {Object} data
 */
function GetRules(data) {
	getData(data);
	GuigebtnClick(guigeRules);
	imageClick(Guige);
}

/**
 * 獲得數據
 * @param {Object} data
 */
function getData(data) {
	guigeRules = data.guigeRules;
	price = data.price;
	sumKucun = 0;
	Guige = data.guige;
	kucun = data.kucun;
	jiage = data.jiage;
	labellist=data.labellist;
	mop=data.mop;
	depreciate=data.depreciate;
}

/**
 * 規格點擊
 * @param {Object} guigeRules
 */
function GuigebtnClick(guigeRules){
	var Rules =JSON.parse(guigeRules);
		
	$(".btn-guige").click(function(){
		//获取规则
		var rule = ',' + (Rules[$(this).attr('title')] || []).join() + ',';
		
		var spguigeId=$(this).closest('ul').attr('id');
		
		if($(this).hasClass("selected"))
		{   
			//取消按鈕后實付金額與省去價格的變動為0
			$(this).removeClass("selected").removeClass("disabled");
			$(this).data('data').isSelected = false;
			if($(".bgall").length==1){
			   $(this).siblings().removeClass("disabled");
			}
			
			$(".yListr ul:not('#"+spguigeId+"') li .goodMessBox_messBox_eachSize").each(function () {
				//判斷生成的規則中有沒有該.goodMessBox_messBox_eachSize的標籤
		        if (rule.indexOf(',' + this.title + ',') != -1) 
		       {
		           $(this).removeClass('disabled');
		       }
		   });
			
			//刪除圖片按鈕樣式
    		$("#pictureClick ul li em").each(function(){
    			$(this).removeClass("iListrclickem");
    		});
			
			//三個規格的再次單擊
			if($(".selected").length==1)
			{
				var spid=$(".selected").closest('ul').attr('id');
				var title=$(".selected")[0].title;
				$(".bgall ul li .goodMessBox_messBox_eachSize").removeClass('disabled');
				var aginrule = ',' + (Rules[$(".selected").attr('title')] || []).join() + ',';
				$(".yListr ul:not('#"+spid+"') li .goodMessBox_messBox_eachSize").each(function () {
					
					//判斷生成的規則中有沒有該.goodMessBox_messBox_eachSize的標籤
					if (aginrule.indexOf(',' + this.title + ',') != -1) 
					{
						$(this).removeClass('selected').addClass('disabled');
						$(this).data('data').isSelected = false;
					}
				});
			}else if($(".selected").length==2)
			{
				var title=Rules[$(".selected")[0].title+$(".selected")[1].title];
				if(title.length==1)
		    	{
					$(".bgall ul li .goodMessBox_messBox_eachSize").each(function () {
						if(title[0]!=this.title)
						{
							if(!$(this).hasClass("selected"))
							{
								$(this).addClass('disabled');
							}
						}
					});
		    	}else if(title.length>1){
		    		$(".bgall ul li .goodMessBox_messBox_eachSize").each(function () {
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
			
		CancelGuige();	
			
		}else if($(this).hasClass("disabled")){
			return false;
		}else{
			
			if($(".bgall").length==1){
				//有且僅有一個規格邏輯判斷
				$(this).addClass("selected").siblings().removeClass("selected");
				$(this).siblings().each(function(k,y){
					$(this).data('data').isSelected = false;
				});
				$(this).data('data').isSelected = true;
				AllCorresevent();
				
			}else if($(".bgall").length==2){
				//兩個規格的邏輯判斷
				$(this).addClass("selected").siblings().removeClass("selected");
				$(this).siblings().each(function(k,y){
					$(this).data('data').isSelected = false;
				});
				$(this).data('data').isSelected = true;
				//是否移除除了自己這一行外的所有元素
				$(".yListr ul:not('#"+spguigeId+"') li .goodMessBox_messBox_eachSize").removeClass("disabled");
				$(".yListr ul:not('#"+spguigeId+"') li .goodMessBox_messBox_eachSize").each(function () {
					//判斷生成的規則中有沒有該.goodMessBox_messBox_eachSize的標籤
					if (rule.indexOf(',' + this.title + ',') != -1) 
					{
						$(this).removeClass('selected').addClass('disabled');
						$(this).data('data').isSelected = false;
					}
				});
                
				//看看在單擊更換按鈕時候會不會覆蓋之前選擇的按鈕,如若有的話去除他之前添加的樣式
				if(!$(".yListr :not('#"+spguigeId+"') li .goodMessBox_messBox_eachSize").hasClass('selected'))
				{
					$(this).siblings().removeClass("disabled");
				}
				
				AllCorresevent();
				
			}else if($(".bgall").length==3){
				$(this).addClass("selected").siblings().removeClass("selected");
				$(this).siblings().each(function(k,y){
					$(this).data('data').isSelected = false;
				});
				$(this).data('data').isSelected = true;
			    if($(".selected").length==1)
			    {
			    	//是否移除除了自己這一行外的所有元素
					$(".yListr ul:not('#"+spguigeId+"') li .goodMessBox_messBox_eachSize").removeClass("disabled");
			    	$(".yListr ul:not('#"+spguigeId+"') li .goodMessBox_messBox_eachSize").each(function () {
						//判斷生成的規則中有沒有該.goodMessBox_messBox_eachSize的標籤
						if (rule.indexOf(',' + this.title + ',') != -1) 
						{
							$(this).removeClass('selected').addClass('disabled');
							$(this).data('data').isSelected = false;
						}
					});
			    }else if($(".selected").length==2)
			    {
			    	var title=Rules[$(".selected")[0].title+$(".selected")[1].title];
			    	
			    	if(title.length==1)
			    	{
			    		$(".bgall ul li .goodMessBox_messBox_eachSize").each(function () {
			    			if(title[0]!=this.title)
			    			{
			    				if(!$(this).hasClass("selected"))
			    				{
			    					$(this).addClass('disabled');
			    				}
			    			}
			    		});
			    	}else if(title.length>1){
			    		$(".bgall ul li .goodMessBox_messBox_eachSize").each(function () {
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
			    }else if($(".selected").length==3){
			    	AllCorresevent();
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
function GuigeForSpecifications(){
	var specifications="";
	var obj=$(".selected");
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
function AllCorresevent(){
	if($(".bgall").length==$(".selected").length){
	   	
	    var specifications = GuigeForSpecifications();
	    var index = getIndex(specifications, Guige);
	    kc = getResult(kucun, specifications, Guige);
	    var jg = getResult(jiage, specifications, Guige);
	  
	    $(".kc").html(kc);
	    window.kucunNum = kc;
	    $(".jg").html(jg);
	    $(".picimg .guigeImg").eq(index).addClass("picSelected").siblings().removeClass("picSelected");
	    
	    SelectsStandard.splice(0,SelectsStandard.length);
	    $('.btn-guige').each(function(){
	    	if($(this).data('data') == undefined) return true;
	    	if($(this).data('data').isSelected) SelectsStandard.push($(this).data('data').className);
	    });
	    sendObj.sTarget = SelectsStandard.length == 2 ? SelectsStandard.join('|')+'|' : SelectsStandard.join('|');
	}
}
/**
 * 取消规格选中事件
 */
function CancelGuige(){
	$(".picimg .guigeImg").removeClass("picSelected");
	$(".jg").html(price);
	kc=0;
	$(".kc").html(sumKucun);
	window.kucunNum = sumKucun;
}

/**
 * 圖片單擊事件
 */
function imageClick(guige) {
	$(".guigeImg").click(function() {
		if($(this).hasClass("picSelected")) {
			$(this).removeClass("picSelected");
			$(".btn-guige").removeClass("disabled selected");
			$(".btn-guige").data('data').isSelected = false;
			CancelGuige();
			$(".jg").html(0);
		}else{
			$(".btn-guige").removeClass("disabled selected");
			$(".btn-guige").data('data').isSelected = false;
			$(this).addClass("picSelected").siblings().removeClass("picSelected");

			var index = $(".guigeImg").index(this);
			var guigelist = guige.split(",");
			var guigeStr = guigelist[index];
			$(".btn-guige").each(function() {
				if(("|" + guigeStr + "|").indexOf("|" + $(this).attr("title") + "|") >= 0) {
					$(this).click();
				}
			});
		}
	});
}

/**
 * 模板渲染
 * @param {Object} data
 * @param {Object} name
 * @param {Object} temp
 */
function ShowDataLoad(data,name,temp){
	var html=template(temp,data);
	$(name).html(html);
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
