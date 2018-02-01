$(function(){
	birthday();
	sexSelect();
	countrySelect();
});
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
function sexSelect(){
	$('#sex div').on('click',function(){
		$(this).siblings('div').removeClass('select').end().addClass('select');
	});
}
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
