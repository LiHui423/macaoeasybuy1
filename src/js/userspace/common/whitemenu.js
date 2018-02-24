void function () {
  let userID = null;
  const SID = easyBuy.global.pageParameter.spaceId;
  function userSpaceWhiteMenu(){
    $('#white-menu').load('/public/whitemenu.html', function () {
      const $this = $(this);
      const whiteNavName = easyBuy.userSpaceGlobal.whiteNavName;
      whiteNavName !== null && $(`#white-menu li[data-name="${whiteNavName}"]`).addClass('select');
      const url = `http://userspace1.macaoeasybuy.com/userSpaceIndexController/userSpaceInfoCount.easy?userId=${userID}&seeUserId=${SID}&easybuyCallback=?`;
      $.getJSON(url, function (data) {
        $.each(data.userSpaceCount, function (key, value) {
          $this.find(`li[data-name=${key.split('user').join('')}]`).find('span:last-of-type').html(`共${value}篇`);
        })
      });
    });
  }
	const clock = setInterval(function(){
    if (easyBuy.easyUser.id !== undefined) {
      userID = easyBuy.easyUser.id;
      clearInterval(clock);
			userSpaceWhiteMenu();
    }
  }, 100);
}()
