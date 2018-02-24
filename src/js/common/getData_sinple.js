var easyFrame = new FrameDomain();
var userId;
var seeUserId;
easyFrame.getUserInfo.go(function(){
	userId = easyBuy.easyUser.id || -1;
	seeUserId = easyBuy.global.pageParameter.id || userId;
	easyBuy.global.isSelf = userId === seeUserId;
	easyBuy.userSpaceGlobal.afterSetIsSelf&&easyBuy.userSpaceGlobal.afterSetIsSelf(easyBuy.global.isSelf);
});
