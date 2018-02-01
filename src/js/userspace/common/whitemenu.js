(function(){
	var whiteMenuTime = null;
	whiteMenuTime = setInterval(function(){
		if(userId && seeUserId){
			clearInterval(whiteMenuTime);
			whiteMenuTime = null;
			userSpaceWhiteMenu();
		}
	},1);
})();
/*
 	給個全局變量 whiteNavName 然後是dataName就行了
 * */
function userSpaceWhiteMenu(){
	$('#white-menu').load('/page/userspace/common/whitemenu.html',function(){
		var $this = $(this);
		var whiteNavName = easyBuy.userSpaceGlobal.whiteNavName;
		if(whiteNavName != null) $('#white-menu li[data-name='+whiteNavName+']').addClass('select');
		$.getJSON('http://userspace1.macaoeasybuy.com/userSpaceIndexController/userSpaceInfoCount.easy?userId='+userId+'&seeUserId='+seeUserId+'&easybuyCallback=?',function(data){
			$.each(data.userSpaceCount,function(k,v){
				$this.find('li[data-name='+k.split('user').join('')+']').find('span:last-of-type').html('共'+v+'篇');
			})
		});
	});
}
