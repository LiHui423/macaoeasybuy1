$(function() {
	login();
	pageOne();
	// ifLogin();
});


// function ifLogin() {
// 	// var data = getUserInfo();
// 	var data = easyBuy.easyUser;
// 	if (data.userInfo != "" || data.userInfo != null
// 			|| data.userInfo != undefined) {
// 		window.history.back();
// 	}
// }

function login() {
	// 登錄卡
	$('#find-password span').on('click', function() {
		$('#login-box').css('display', 'none');
		$('#find-password-box').fadeIn(350);
	});
	$('#login-submit')
			.on(
					'click',
					function() {
						var action = "http://userManager.macaoeasybuy.com/userInfoManagerController/loginTime.easy?easybuyCallback=?";
						 //var action =
						 //"http://192.168.3.29:8083/yez_easyBuyMall_userManager/userInfoManagerController/loginTime.easy?easybuyCallback=?";
						var AccountNo = $("#AccountNo").val();
						var AccountPsw = $("#AccountPsw").val();
						var Parame = new FrameDomain();
						AccountNo = Parame.parameIcy5c(AccountNo);
						AccountPsw = Parame.parameIcy5c(AccountPsw);

						var href = Parame.addHref(action + "&AccountNo=" + AccountNo
								+ "&AccountPsw=" + AccountPsw);
						
						//var href=action + "&AccountNo=" + AccountNo + "&AccountPsw=" + AccountPsw;
						
						$.getJSON(href, "", function(data) {
							var userInfo = data.userInfo;
							if (data.userInfo == "" || data.userInfo == null
									|| data.userInfo == undefined) {
								alert("登錄失敗");
							} else {
								location.href = userInfo;
							}
						});
						// from.submit();
						// loginSuccess();
					});
}

function pageOne() {
	// 找回密碼卡一
	$('#cancel-one').on('click', function() {
		$('#login-box').fadeIn(350);
		$('#find-password-box').css('display', 'none');
	});
	$('#next-btn').on('click', function() {
		addPageTwo();
	});
}

function addPageTwo() {
	// 找回密碼卡二
	var html = '<div class="page-two"><input type="password" class="easy-input" id="new-password" placeholder="請輸入新密碼(8位字母加數字)"/><input type="password" class="easy-input" id="confirm-password" placeholder="確認新登入密碼(8位字母加數字)"/><div class="tips-box"><span>X</span><span class="text">密碼不一致，請重新輸入！</span></div><div class="easy-btn" id="save-login">保存並登入</div><div class="easy-btn" id="cancel-two">返回</div></div>';
	// 密碼只能用限於8位內的英文或數字
	// 確認密碼與登入密碼不一致
	$('#find-password-box .find-password-page').append(html);
	$('#find-password-box .find-password-page .page-one')
			.css('display', 'none');
	$('#find-password-box .find-password-nav li').eq(0).removeClass('select');
	$('#find-password-box .find-password-nav li').eq(1).addClass('select');
	// 辦定事件
	$('#cancel-two').on(
			'click',
			function() {
				$('#find-password-box .find-password-nav li').eq(0).addClass(
						'select');
				$('#find-password-box .find-password-nav li').eq(1)
						.removeClass('select');
				$('#find-password-box .find-password-page .page-one').css(
						'display', 'block');
				$('#find-password-box .find-password-page .page-two').remove();
			});
}

function loginSuccess() {

	// 登入成功
	var html = '<div id="login-success"><div class="login-success-box"><img src="img/common/loginregister/login-success.png" alt="" /><div>歡迎回到宜買站!</div><div><span class="num">3</span><span>秒後自動進入</span><span class="dot">...</span></div></div></div>';
	$('body').append(html);
	var num = 3;
	var timerNum = setInterval(function() {
		if (num == 1) {
			clearInterval(timerNum);
		}
		num--;
		$('#login-success span.num').html(num);
	}, 1000);
	var dotHtml = '';
	var timerDot = setInterval(function() {
		dotHtml += '.';
		if (dotHtml.length > 3) {
			dotHtml = '';
		}
		$('#login-success span.dot').html(dotHtml);
	}, 500);
}
