$(function(){
	onFirst();//當頁面加載時候
	
	//登入
	selectCard(); //登入註冊選擇
	login(); //登入卡
	findPwdpageOne();//找回密碼
	
	//註冊
	birthday();//生日
	sexSelect(); //性別
	countrySelect(); //國家選擇
	registerSuccess(); //完成註冊
	
});
//當頁面加載時候
function onFirst(){
	var fd = new FrameDomain();
	var pageState = fd.getUrlParam('state');
	if(pageState == 'register'){
		defaultFunc('register');
		$('title').html('easybuy註冊');
	}else if(pageState == 'login' || pageState == null){
		defaultFunc('login');
		$('title').html('easybuy登入');
	}else{
		defaultFunc('login');
		$('title').html('easybuy登入');
	}
	$('.easy-box').css('visibility','visible');
}
function selectCard(){
	//登入註冊選擇
	$('#easy-nav li').each(function(k){
		$(this).on('click',function(){
			$(this).siblings('li').removeClass('select').end().addClass('select');
			$('.easy-box-content').eq(k).siblings('.easy-box-content').removeClass('select').end().addClass('select');
			switch(k){
				case 0:
					$('title').html('easybuy登入');
				break;
				case 1:
					$('title').html('easybuy註冊');
				break;
				case 2:
					
				break;
			}
		});
	});
}
function defaultFunc(page){
	if(page == 'login'){
		$('#easy-nav li').eq(0).siblings('li').removeClass('select').end().addClass('select');
		$('#login-page').siblings('.easy-box-content').removeClass('select').end().addClass('select');
	}else if(page == 'register'){
		$('#easy-nav li').eq(1).siblings('li').removeClass('select').end().addClass('select');
		$('#register-page').siblings('.easy-box-content').removeClass('select').end().addClass('select');
	}
}
function login(){
	//登錄卡
	//找回密碼點擊
	$('#find-password span').on('click',function(){
		$('#login-box').css('display','none');
		$('#find-password-box').fadeIn(350);
	});
	//確定登入點擊
	$('#login-submit').on('click',function(){
		loginSuccess();
	});
}
function findPwdpageOne(){
	//找回密碼卡一
	$('#cancel-one').on('click',function(){
		$('#login-box').fadeIn(350);
		$('#find-password-box').css('display','none');
	});
	$('#next-btn').on('click',function(){
		findPwdPageTwo();
	});
}
function findPwdPageTwo(){
	//找回密碼卡二
	var html = '<div class="page-two"><input type="password" class="easy-input" id="new-password" placeholder="請輸入新密碼(8位字母加數字)"><input type="password" class="easy-input" id="confirm-password" placeholder="確認新登入密碼(8位字母加數字)"><div class="tips-box"><span>X</span><span class="text">密碼不一致，請重新輸入！</span></div><div class="easy-btn" id="save-login">保存並登入</div><div class="easy-btn" id="cancel-two">返回</div></div>';
//	密碼只能用限於8位內的英文或數字
//	確認密碼與登入密碼不一致
	$('#find-password-box .find-password-page').append(html);
	$('#find-password-box .find-password-page .page-one').css('display','none');
	$('#find-password-box .find-password-nav li').eq(0).removeClass('select');
	$('#find-password-box .find-password-nav li').eq(1).addClass('select');
	//辦定事件
	$('#cancel-two').on('click',function(){
		$('#find-password-box .find-password-nav li').eq(0).addClass('select');
		$('#find-password-box .find-password-nav li').eq(1).removeClass('select');
		$('#find-password-box .find-password-page .page-one').css('display','block');
		$('#find-password-box .find-password-page .page-two').remove();
	});
}
function loginSuccess(){
	//登入成功
	var html = '<div id="login-success"><div class="login-success-box"><img src="/src/img/common/loginregister/login-success.png" alt=""><div>歡迎回到宜買站!</div><div><span class="num">3</span><span>秒後自動進入</span><span class="dot">...</span></div></div></div>';
	$('body').append(html);
	var num = 3;
	var timerNum = setInterval(function(){
		if(num == 1){
			clearInterval(timerNum);
		}
		num--;
		$('#login-success span.num').html(num);
	},1000);
	var dotHtml = '';
	var timerDot = setInterval(function(){
		dotHtml+= '.';
		if(dotHtml.length > 3){
			dotHtml = '';
		}
		$('#login-success span.dot').html(dotHtml);
	},500);
}



//生日
function birthday(){
	var arr = [];
	new YMDselect('year','month','day');
	$('#set-user-info .birth-day li').each(function(k){
		$(this).on('change',function(event){
			var a = saveAll();
			for(var i=0;i<a.length;i++){
				if(a[i] == 0){
					a = null;
					break;
				}
			}
			console.log(a);
		});
	});
	function saveAll(){
		var newArr = [];
		$('#set-user-info .birth-day li select').each(function(k){
			newArr[k] = $(this)[0].value;
		});
		return newArr;
	}
}
//性別
function sexSelect(){
	$('#sex div').on('click',function(){
		$(this).siblings('div').removeClass('select').end().addClass('select');
	});
}
//國家選擇
function countrySelect(){
	var slideTime = 200;
	$('#country div').on('click',function(){
		if($('#country .country-select').css('display') == 'block') return false;
		$('#country .country-select').slideDown(slideTime);
	});
	maskClick($('#country .country-select'),function(){
		$('#country .country-select').slideUp(slideTime);
	});
	$('#country .country-select li').on('click',function(){
		$('#country div').html($(this).text());
		$('#country .country-select').slideUp(slideTime);
	});
}
//完成註冊
function registerSuccess(){
	$('#register-complete').on('click',function(){
		$('#register-box').css('display','none');
		$('#set-user-info').fadeIn(350);
	});
}
