let returnBtn = document.querySelector('.articleContainer .end .return'); // 返回主页按钮
let articleBtn1 = document.querySelector('.main-nav .article');
let articleBtn2 = moreList.querySelector('ul li p');

// 获取文章标题
let textTitle = writeArticle.querySelector('.articleTitle .title');
// 获取文章内容
let textArea = writeArticle.querySelector('textarea');

returnBtn.onclick = () => {
    pageBlockOrNot(view);
}

let goArticle = function () {
    pageBlockOrNot(writeArticle);
}


articleBtn1.onclick = () => {
    loginBtn.onclick();
}
let articleFlag = function () {
    if (flag === 0) {
        articleBtn1.onclick = () => {
            loginBtn.onclick();
        }
        articleBtn2.onclick = () => {
            loginBtn.onclick();
        }
    } else if (flag === 1) {
        articleBtn1.onclick = () => {
            goArticle();
        }
        articleBtn2.onclick = () => {
            goArticle();
        }
    }
}


