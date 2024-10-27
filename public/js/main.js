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

// 로그인, 로그아웃 버튼
document.addEventListener('DOMContentLoaded', async function(){

    try {
        const response = await fetch('/login/CheckLogInOut', {
            method : 'POST',
            // session cookie 포함하기
            credentials : 'include'
        });
        
        const data = await response.json();

        if (data.exist) {
            // 로그인 성공한 경우 > 로그인 버튼을 로그아웃으로 바꾸기
            document.querySelector('#userIn').style.display = 'none';
            document.querySelector('#userOut').style.display = 'block';
        } else {
            document.querySelector('#userIn').style.display = 'block';
            document.querySelector('#userOut').style.display = 'none';
        }
    } catch (error) {
        console.log('오류 발생 : ', error);
        alert('서버와의 연결 중 오류가 발생했습니다.');
    }
})