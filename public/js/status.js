const btn1 = document.querySelector('#pageButton01');
const btn2 = document.querySelector('#pageButton02');
const btn3 = document.querySelector('#pageButton03');
const btn4 = document.querySelector('#pageButton04');

// 버튼 1~4를 누르면 각 페이지로 이동하도록 하기
btn1.addEventListener('click', function(){
    document.querySelector('#pageWrap').style.transform = 'translateX(0)';
})

btn2.addEventListener('click', function(){
    document.querySelector('#pageWrap').style.transform = 'translateX(-100vw)';
})

btn3.addEventListener('click', function(){
    document.querySelector('#pageWrap').style.transform = 'translateX(-200vw)';
})

btn4.addEventListener('click', function(){
    document.querySelector('#pageWrap').style.transform = 'translateX(-300vw)';
})

// 버튼 before, next를 누르면 옆으로 움직이도록 하기
var statusPage = 1;

$('#before').on('click', ()=>{
    if(statusPage === 1){
        $('#pageWrap').css('transform', 'translateX(-300vw)');
        statusPage += 3;
    }
    else if (statusPage === 4){
        $('#pageWrap').css('transform', 'translateX(-200vw)');
        statusPage -= 1;
    }
    else if (statusPage === 3) {
        $('#pageWrap').css('transform', 'translateX(-100vw)');
        statusPage -= 1;
    }
    else if (statusPage === 2) {
        $('#pageWrap').css('transform', 'translateX(0vw)');
        statusPage -= 1
    }
});

$('#next').on('click', ()=>{
    if(statusPage === 1){
        $('#pageWrap').css('transform', 'translateX(-100vw)');
        statusPage += 1;
    }
    else if (statusPage === 2){
        $('#pageWrap').css('transform', 'translateX(-200vw)');
        statusPage += 1
    }
    else if (statusPage === 3){
        $('#pageWrap').css('transform', 'translateX(-300vw)');
        statusPage += 1
    }
    else if (statusPage === 4){
        $('#pageWrap').css('transform', 'translateX(0vw)');
        statusPage = 1;
    }
})