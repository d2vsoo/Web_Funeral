// 메뉴 슬라이드 다운/업
// $(document).ready() : DOM이 완전히 로드된 후 실행되도록 하기
$(document).ready(function () {
    $('.mainmenu>a').mouseover(function () {
        // siblings : 형제요소
        // stop : 동작 매끄럽게 하기
        $(this).siblings('.submenu').stop().slideDown(400);
    }).mouseout(function () {
        $(this).siblings('.submenu').stop().slideUp(400);
    });

    // hover 시 서브메뉴 닫히지 않도록 하기
    $('.submenu').hover(function () {
        $(this).stop().slideDown(300);
    }, function () {
        $(this).stop().slideUp(300);
    });
});