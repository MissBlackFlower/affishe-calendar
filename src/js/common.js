$(document).ready(function() {

$('.js-nav a').each(function () {
  var location = window.location.href;
  var link = this.href;
  var item = $(this).parent('.js-item');
  var drop = $(this).parent('.js-drop');
  var itemDrop = drop.parents('.js-item');
    if(location == link) {
      item.addClass('is-active');
      drop.addClass('is-active');
      itemDrop.addClass('is-active');
    }
 }); //можно удалить, нужен для того чтоб просто показать работу класса для активной ссылки меню
$('.js-news').slick({
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: false,
  dots: false,
  autoplay: true,
  variableWidth: true
 	});


$('.js-banner').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
	autoplay: true,
  arrows: false,
  fade: true,
  asNavFor: '.js-banner-nav'
});
$('.js-banner-nav').slick({
  slidesToShow: 0,
  slidesToScroll: 1,
  asNavFor: '.js-banner',
  dots: false,
	arrows: false,
  focusOnSelect: true
});

$('.btn-nav').on('click', function(){
  var menu = $('.header__nav');
		menu.toggleClass('open-nav');
	});

var calendar = $("#calendar").calendarPicker({
    monthNames:["Січ.", "Лют.", "Бер.", "Квіт.", "Трав.", "Чер.", "Лип.", "Сер.", "Вер.", "Жов.", "Лис.", "Груд."],
    dayNames: ["ПН","ВТ","СР","ЧТ","ПТ","СБ","НД"],
    //useWheel:true,
    //callbackDelay:500,
    //years:1,
    months:1,
    days:11.5,
    //showDayArrows:false,
});

});
