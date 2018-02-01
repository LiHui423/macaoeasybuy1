var a = new FrameDomain();
var userId = a.getUrlParam('id');
var seeUserId = a.getUrlParam('oid');
var postId = a.getUrlParam('aid');

window.albumData = {
	listdata: [
	    {
			order: 'uptime',
			page: 0,
			isFirst: true,
			isComplate: false
		},
		{
			order: 'commentNums',
			page: 0,
			isFirst: true,
			isComplate: false
		},
		{
			order: 'loveNums',
			page: 0,
			isFirst: true,
			isComplate: false
		}
	],
	collect : {},//用戶採集
	selectIdx : 0, //目前顯示的排序盒子
	listRequestSize: 12, //一次請求6個數據
	selectId: [], //存儲Id的數組
	selectMaxSize : 6, //最多選擇6個專輯進行操作
	otherAlbum : { //移動專輯那裡是否已經請求過專輯列表了
		isFirst : true,
		isComplate : false,
		page : 0,
		size : 6,
		selectAlbum : null,
		newAlbum : null,
		hasAddAlbum : false
	},
	editorAlbum : {
		isClass : false,//是否已經請求過分類列表了
		isCover : false,//是否已經請求過封面列表了
		cover : {
			page : 0,
			isFirst : true,
			isComplate : false,
			size : 9
		},
		albumInfo : {} //專輯詳細信息
	},
	otherFunc : {},//看他人的方法
	mineFunc : {}, //看自己的方法
	albumPhotoNum : 0, //專輯的總數目
	isCanSubmit : true //是否可以發送修改專輯請求
};
