$(function(){
	marketFunc()
})

/*加載敗家點讚*/
function marketFunc(){
	$.getJSON("http://social1.macaoeasybuy.com/fairQuerySocialController/queryFairs.easy?easybuyCallback=?",function(data){
		var markethtml = template('market',data);
		$('.market_main').html(markethtml)

		marketGoodsHover()
		marketThemeHover()
	});
};
