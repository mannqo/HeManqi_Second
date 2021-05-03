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
let articleList = personalPage.querySelectorAll('.detailArticle ul');
// 获取文章列表
let articleItems = articleList[0].getElementsByTagName('li');
let mydongTai = personalPage.querySelectorAll('.wrap .dongTai');


// 因为是异步创建li，所以等加载完了在给li添加功能
// 当鼠标经过文章的小li时，显示编辑删除文章的按钮(这个写在request.js里面)

// 清除所有的li的类名
let clearPageLi = function (j) {
    for (let i = 0; i < personItems.length; i++) {
        personItems[i].className = '';
    }
    for (let i = 0; i < 3; i++) {
        mydongTai[i].style.display = 'none';
    }
    // 隐藏其他盒子
    myLike.style.display = 'none';
    myArticle.style.display = 'none';
    myZan.style.display = 'none';
    personItems[j].className = 'active';
}


// 点击li高亮
// 获取 更多【1】 下面的盒子 【0】是赞下面的
let pageNavItems = personalPage.querySelectorAll('.pageNavList li');
let starMore = personalPage.querySelectorAll('.pageNavList .star');
let zanIt = personalPage.querySelector('.zanIt ul');
let wenZhang = personalPage.querySelector('.liZan .wenFei');


// 点击 文章 渲染点赞的文章列表(点赞文章)
let likeArticle = function (id) {
    starMore[0].children[0].onclick = function () {
        zanIt.style.display = 'block';
        nothingHere[4].style.display = 'none';

        // 获取用户点赞的文章列表
        axios.get(url + 'user/getUserLikeArticles', {
            params: {
                userId: id,
            }
        })

            .then(function (response) {
                let res = response.data.data;
                zanIt.innerHTML = '';
                pageNavItems[3].children[0].innerHTML = res.length;
                wenZhang.children[0].children[0].innerHTML = '(' + res.length + ')';
                starMore[0].children[0].children[0].innerHTML = '(' + res.length + ')';
                if (res.message === '暂无点赞文章') {
                    nothingHere[4].style.display = 'block';
                } else {
                    for (let i = 0; i < res.length; i++) {
                        // 获取点赞文章的内容
                        axios.get(url + 'article/getContent', {
                            params: {
                                userId: id,
                                articleId: res[i].articleId,
                            }
                        })
                            .then(function (response) {
                                let res1 = response.data.data;
                                let article = `
                         <li>
                            <p>`
                                    + res1.author +
                                    `</p>
                            <h3>`
                                    + res[i].title +
                                    `</h3>
                             <div class="zan more"><i class="icon iconfont">&#xe60c;<span>`+ res[i].thumbUpNum + `</span></i></div>
                             <div class="cai more"><i class="icon iconfont"">&#xe621;<span> `+ res[i].commentNum + `</span></i></div>
                             <div class="moreChoose">
                                 <div class="share more"><i class="icon iconfont">&#xeb45;</i></div>
                                 <div class="deleteMore more">···</div>
                             </div>
                             <div class="editAndDelete">
                                 <p>编辑</p>
                                 <p>删除</p>
                             </div>
                         </li>    
                             `;
                                zanIt.innerHTML += article;

                            })

                    }

                    setTimeout(() => {
                        // 获取文章详细内容
                        let myZan = zanIt.getElementsByClassName('zan');
                        thumbUpAndDown(res, myZan);
                        let hToDetail = zanIt.getElementsByTagName('h3');
                        for (let i = 0; i < res.length; i++) {
                            hToDetail[i].onclick = function () {
                                personalPage.style.display = 'none';
                                articleDetail.style.display = 'block';

                                getArticleComment(res[i])
                                getArticleDetail(res[i]);
                            }
                        }
                    }, 2000);

                }
                return new Promise((resolve, reject) => {
                    resolve(res);
                })
            })
            .then(res => {
                let zanList = myZan.getElementsByClassName('zan');
                axios.get(url + 'user/getUserLikeArticles?userId=' + isAuserObj.userId)
                    .then(response => {
                        let res2 = response.data.data;
                        for (let i = 0; i < res.length; i++) {
                            for (let j = 0; j < res2.length; j++) {
                                if (res[i].articleId === res2[j].articleId) {
                                    zanList[i].children[0].className = 'icon iconfont already';
                                }
                            }
                        }
                    })
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}


starMore[0].children[1].onclick = function () {
    zanIt.style.display = 'none';
    nothingHere[4].style.display = 'block';
}



// 空的  这段代码写得好丑
personItems[0].onclick = () => {
    clearPageLi(0);
    mydongTai[0].style.display = 'block';
    nothingHere[0].style.display = 'block';
}

personItems[2].onclick = () => {
    clearPageLi(2);
    mydongTai[1].style.display = 'block';
    nothingHere[1].style.display = 'block';
}
personItems[4].onclick = () => {
    clearPageLi(4);
    mydongTai[2].style.display = 'block';
    nothingHere[2].style.display = 'block';
}





// 赞 的功能 
let paintNothing = function () {
    clearPageLi(3);
    this.className = 'active';
    myZan.style.display = 'block';
}
let wenFei = personalPage.querySelectorAll('.person-you-like .wenFei li');





// 点击 更多-关注 进入关注用户
let clickLike = function (id) {
    personItems[5].onclick = function () {
        blockOrNot(starMore[1], starMore[0]);
        starMore[1].children[1].onclick = function () {
            subscribeSomeone(id);
            clearPageLi(5);
            myLike.style.display = 'block';
        }
    }
}

// 获取个人主页
// paintPage();
// clickLike(isAuserObj.userId);





