// 获取 更多-关注 下面的内容
let myLike = personalPage.querySelector('.wrap .likeWrap');
// 获取 文章 下面的内容
let myArticle = personalPage.querySelector('.wrap .writeWrap');
// 获取 赞 下面的内容
let myZan = personalPage.querySelector('.wrap .liZan');
// 获取标题小li
let personItems = personalPage.querySelectorAll('.pageNavList ul li');
// 获取编辑和删除文章的按钮
let moreChoose = personalPage.getElementsByClassName('moreChoose');
let editAndDelete = personalPage.getElementsByClassName('editAndDelete');
// 获取文章列表的ul
let articleList = personalPage.querySelector('.detailArticle ul');
// 获取文章列表
let articleItems = articleList.getElementsByTagName('li');




// 因为是异步创建li，所以等加载完了在给li添加功能
// 当鼠标经过文章的小li时，显示编辑删除文章的按钮(这个写在request.js里面)

// 清除所有的li的类名
let clearPageLi = function () {
    for (let i = 0; i < personItems.length; i++) {
        personItems[i].className = '';
    }
}
// 点击li高亮
for (let i = 0; i < personItems.length; i++) {
    personItems[i].onclick = function () {
        clearPageLi();
        this.className = 'active';
        if (i === 1) {
            myArticle.style.display = 'block';
            myLike.style.display = 'none';
            myZan.style.display = 'none'
        } else if (i === 3) {
            console.log(1);
            myZan.style.display = 'block'
            myLike.style.display = 'none';
            myArticle.style.display = 'none';
            this.className = '';
        } else if (i === 5) {
            myLike.style.display = 'block';
            myArticle.style.display = 'none';
            myZan.style.display = 'none'
            this.className = '';
        }
    }
}


