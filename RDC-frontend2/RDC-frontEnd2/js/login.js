let loginPage = document.querySelector('.first-login');  // 登录页面
let otherWay = document.querySelector('.first-login .otherWay');
let todoOtherWay = document.querySelector('.first-login .iconList');
let username = document.querySelector('.first-login .username');  // 获取输入账号框
let password = document.querySelector('.first-login .password');  // 获取密码框
let pandaLogo = document.querySelectorAll('.pandaLogo img');  // 获取小熊猫


let tuichu = document.querySelector('.first-login .login .tuichu');

// 点击登录按钮弹出窗口
loginBtn.onclick = function () {
    loginPage.style.display = 'block';
    body.style.overflowY = 'hidden';
}
// 点击退出按钮退出登录框 
tuichu.onclick = function () {
    loginPage.style.display = 'none';
    body.style.overflowY = '';
}

// 点击其他方式切换
otherWay.onclick = function () {
    otherWay.style.display = 'none';
    todoOtherWay.style.display = 'block';
    loginPage.childNodes[1].style.height = '330px';
}
// 点击手机登录切换
todoOtherWay.childNodes[1].childNodes[1].onclick = function () {
    otherWay.style.display = 'block';
    todoOtherWay.style.display = 'none';
    loginPage.childNodes[1].style.height = '288px';
}


/* 这里开始是对小熊猫的操作 */
// 让所有小熊猫都隐藏
let hidePanda = function () {
    for (let i = 0; i < 3; i++) {
        pandaLogo[i].style.display = 'none';
    }
}
// 获取焦点时小熊猫active
username.onfocus = function () {
    hidePanda();
    pandaLogo[1].style.display = 'block';
}
// 失去焦点恢复
username.onblur = function () {
    hidePanda();
    pandaLogo[0].style.display = 'block';
}
// 密码框获取焦点小熊猫sleep
password.onfocus = function () {
    hidePanda();
    pandaLogo[2].style.display = 'block';
}
password.onblur = function () {
    hidePanda();
    pandaLogo[0].style.display = 'block';
}
/* 小熊猫到这里结束 */

// password.addEventListener('keydown', function () {
//     console.log(password.value);
// })
// username.addEventListener('keydown', function () {
//     console.log(username.value);
// })





// 提示框
let tishiFrame = () => {
    tishi.style.opacity = '1';
    setTimeout(() => {
        tishi.style.opacity = '0';
    }, 1000);
}
// 让所有p都不见了
let shadowP = () => {
    for (let i = 0; i < tishi.children.length - 1; i++) {
        tishi.children[i].style.display = 'none';
    }
}




// 点击头像显示更多
touXiang[0].addEventListener('click', () => {
    if (moreList.style.display === 'none' || moreList.style.display === '') {
        moreList.style.display = 'block';
    } else {
        moreList.style.display = 'none';
    }
})
// 导航栏以下的内容
let main = document.querySelector('.shouye .main');
main.addEventListener('click', () => {
    if (moreList.style.display === 'block') {
        moreList.style.display = 'none';
    }
})
if (moreList.style.display === 'none' || moreList.style.display === '') {
    main.removeEventListener('click', () => {
        if (moreList.style.display === 'block') {
            moreList.style.display = 'none';
        }
    })
}


