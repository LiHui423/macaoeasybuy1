var easyFrame = new FrameDomain();
var userId;
var seeUserId;
easyFrame.getUserInfo.go(function(){
	userId = easyBuy.easyUser.id || -1;
	seeUserId = easyBuy.pageUser.id || userId;
	easyBuy.global.isSelf = userId != seeUserId ? false : true;
	easyBuy.userSpaceGlobal.afterSetIsSelf&&easyBuy.userSpaceGlobal.afterSetIsSelf(easyBuy.global.isSelf);
});
