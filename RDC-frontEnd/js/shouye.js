let hVisited = shouye.querySelectorAll('.mainList h3');  // 点击小li变色

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
    view.style.display = 'none';
    moreList.style.display = 'none';
    personalInformation.style.display = 'none';
    personalPage.style.display = 'block';
    paintPage();
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

// 点击标题标题变色
for (let i = 0; i < hVisited.length; i++) {
    hVisited[i].onclick = function () {
        hVisited[i].className = 'hVisited';
    }
}

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
