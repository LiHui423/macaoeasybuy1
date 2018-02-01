/*
 	作廢
 * */
$(function(){
	listData();
});
function listData(){
    Mock.mock(
        'http://mockjs111', {
			"list|2":[
				{
					'id|+1':0,
					'adminName':'@name',
					'uptime|1-60':1,
					'adminPic':'@image',
					'pric':'@image',
					'seeNums':1,
					'backNums':1,
					'loveNums':1,
					'title': '@cparagraph(1)',
					'content': '@cparagraph(10)',
					'extra_userImgs|0-7':['@image']
				},
			]
        }
    );
	welfareData(0,6,"id","desc",'html');
	var page = 0;
	var flag = false;
	var numflag = false;
	function welfareData(page,size,order,descOrasc,load){
		$.getJSON(
			"http://mockjs111",
//			"http://social1.macaoeasybuy.com/shouldBuySocialConntroller/queryShouldBuyParty.easy",
//			"page="+page+"&size="+size+"&order="+order+"&descOrasc="+descOrasc+"&classid=2&sqlString=&shouldId=0",
			function(data){
				if(data.list.length < size){
					$('#list').append(html);
					numflag = true;
		    		flag = false;
					$('.no-more').css('display','block');
				}
		    	var html = template('other',data);
		    	if(load == 'html'){
		    		$('#list').html(html);
		    		flag = false;
		    	}else if(load == 'add'){
		    		$('#list').append(html);
		    		flag = false;
		    	}
			}
		);
	}
	$(window).on('scroll',function(){
		if(flag){
			return false;
		}
		if(numflag){
			$(window).off('scroll');
		}
	　　var scrollTop = $(this).scrollTop();
	　　var scrollHeight = $(document).height();
	　　var windowHeight = $(this).height();
	　　if(scrollTop + windowHeight >= scrollHeight){
			flag = true;
			page++;
			welfareData(page,6,"id","desc",'add');
	　　}
	});
}
