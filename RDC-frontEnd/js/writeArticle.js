

let returnBtn = document.querySelector('.articleContainer .end .return'); // 返回主页按钮
let articleBtn1 = document.querySelector('.main-nav .article');
let articleBtn2 = moreList.querySelector('ul li p');

// 获取文章标题
let textTitle = writeArticle.querySelector('.articleTitle .title');
// 获取文章内容
let textArea = writeArticle.querySelector('textarea');

returnBtn.onclick = () => {
    shouye.style.display = 'block';
    view.style.display = 'block';
    writeArticle.style.display = 'none';
    personalPage.style.display = 'none';
    moreList.style.display = 'none';
}

let goArticle = function () {
    shouye.style.display = 'none';
    writeArticle.style.display = 'block';
}

articleBtn1.onclick = () => {
    goArticle();
}
articleBtn2.onclick = () => {
    goArticle();
}


