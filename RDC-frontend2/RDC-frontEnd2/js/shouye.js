let headerItems = shouye.querySelectorAll('.shouye .main-nav ul li .header li');
let topNavItems = shouye.querySelectorAll('.view .topNavcon .topNav li')
let navItems = shouye.querySelectorAll('.main .leftNav .header li');

/* 这里是滚动事件需要的dom元素 */
let detail = shouye.querySelector('detail-Information');
let yinliImg = shouye.querySelector('.yinLi-plan a img'); // 蓝色图片
let juejin = shouye.querySelector('.rightNav .juejin');  // 黄色+二维码

let topStickList_1 = shouye.querySelector('header .wrap');
let topStickList_2 = shouye.querySelector('.view .topNavcon');

// 获取 我的主页 按钮
let tomyPersonal = shouye.querySelector('.navGroup .tomyPersonal');


// 点击我的主页跳转
tomyPersonal.onclick = function () {
    pageBlockOrNot(personalPage)
    goToMine(isAuserObj.userId);
}

// 点击文章右边的icon显示 发布沸点
let sendDiv = shouye.querySelector('.wrap-li .sendFei');
let sendFei = shouye.querySelector('.wrap-li .more');
sendFei.onclick = () => {
    blockOrNot(sendDiv);
}


/* 这里有3个li，点击哪个就哪个高亮 */
// 先弄一个清除所有索引颜色的函数
let clearColor = function (items) {
    for (let i = 0; i < items.length; i++) {
        items[i].style.color = '#71777C';
    }
}
function changeColor(items) {
    for (let i = 0; i < items.length; i++) {
        items[i].onclick = function () {
            clearColor(items);
            this.style.color = '#077FFF';
        }
    }
}
changeColor(headerItems);
changeColor(topNavItems);
changeColor(navItems);
/* 结束 */


// 监听滚动事件 
window.addEventListener('scroll', function () {
    if (window.pageYOffset >= 1800 && flag === 0) {
        yinliImg.className = 'stick';
        juejin.className = 'juejin stick';
    } else if (window.pageYOffset >= 1800 && flag === 1) {
        juejin.className = 'juejin stick2';
    } else {
        yinliImg.className = '';
        juejin.className = 'juejin';
    }
    if (window.pageYOffset >= 400) {
        topStickList_1.style.top = '-60px';
        topStickList_2.style.top = '0';
    } else {
        topStickList_1.style.top = '0';
        topStickList_2.style.top = '60px';
    }
})

// 点击 掘金 也可以跳转到首页
let juejinImg = shouye.querySelector("header .wrap .navlogo img");
juejinImg.onclick = () => {
    returnMain();
}
headerItems[0].onclick = () => {
    returnMain();
    clearColor(headerItems);
    headerItems[0].style.color = '#077FFF';
}


