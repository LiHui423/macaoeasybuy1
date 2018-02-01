function clickScrollFunction(tragetDiv){
	var i = 1;
	var $length =Math.ceil(tragetDiv.children(".secondHand_exampleEach_scroll").find("li").length/4);
	tragetDiv.find(".secondHand_exampleEach_left").click(function(){
		if(i > 1){
			if($(this).siblings(".secondHand_exampleEach_scroll").children("ul").is(":animated")){
				return;
			}else{
				l = parseInt($(this).siblings(".secondHand_exampleEach_scroll").children("ul").css("left")) + 1268;
				$(this).siblings(".secondHand_exampleEach_scroll").children("ul").animate({
					"left":l
				},800)
				i--;
			}
		}else{
			return;
		}
	})
	
	tragetDiv.find(".secondHand_exampleEach_right").click(function(){
		if(i <= $length - 1){
			if($(this).siblings(".secondHand_exampleEach_scroll").children("ul").is(":animated")){
				return;
			}else{
				l = parseInt($(this).siblings(".secondHand_exampleEach_scroll").children("ul").css("left")) - 1268;
				$(this).siblings(".secondHand_exampleEach_scroll").children("ul").animate({
					"left":l
				},800)
				i = i + 1;
			}
		}else{
			return;
		}
	})
	
}
