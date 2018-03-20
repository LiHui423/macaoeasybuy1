var easyFrame = new FrameDomain();
easyFrame.getUserInfo.noInfoStartJs = function(){
	console.log('您沒有登錄，頁面準備跳轉');
	window.location.href = "http://usermanager.macaoeasybuy.com/login.html";
};
var userId;
var seeUserId;
easyFrame.getUserInfo.go(function(){
	userId = easyBuy.easyUser.id || -1;
	seeUserId = easyBuy.global.pageParameter.spaceid || userId;
	easyBuy.global.isSelf = userId === seeUserId;
    easyBuy.userSpaceGlobal.afterSetIsSelf&&easyBuy.userSpaceGlobal.afterSetIsSelf(easyBuy.global.isSelf);
});
