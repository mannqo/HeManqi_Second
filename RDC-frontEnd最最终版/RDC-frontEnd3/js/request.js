let url = 'http://47.100.42.144:3389/';
/* 获取各个页面 */
let body = document.querySelector('body');
let shouye = document.querySelector('.shouye');  // 获取首页
let view = shouye.querySelector('.view');  // 获取主页标题以下的部分 
let writeArticle = document.querySelector('.writeArticle');  // 获取写文章页面
let personalPage = document.querySelector('.personalPage');  // 获取个人主页
let personalInformation = document.querySelector('.personalInformation'); // 编辑资料
let articleDetail = document.querySelector('.articleDetail');

let touXiang = document.querySelectorAll('.tou-xiang');  // 获取登录头像
let moreList = shouye.querySelector('.shouye .main-nav .moreList');  // 点击头像出现的框框
let loginBtn = shouye.querySelector('header .sign-up');    // 登录按钮
let rightSign = shouye.querySelector('.rightNav .login');  // 获取登录框
let touBell = shouye.querySelector('.main-nav ul li .wrap');  // 获取 头像和铃铛部分
let goOutBtn = moreList.querySelector('.moreList .navGroup .goOut');  //登出按钮
let personalBtn = personalPage.querySelector('.personal button');

let reg = /style\s*?=\s*?(['"])[\s\S]*?\1/g;

let id = 0;

// 登录
let jumpTosign = document.querySelector('.first-login .sign-up');  // 获取登录框登录按钮
// 获取提示框
let tishi = document.querySelector('.first-login .tishi');
jumpTosign.onclick = function () {
    // 登录
    if (username.value === '') {
        tishiFrame();
        shadowP();
        tishi.children[0].style.display = 'block';
    } else if (password.value === '') {
        tishiFrame();
        shadowP();
        tishi.children[1].style.display = 'block';
    } else {
        axios.post(url + 'user/login', {
            username: username.value,
            password: password.value
        })
            .then(function (response) {
                // console.log(response.data.data);
                if (response.data.data.message === "登录成功") {
                    flag = 1;
                    articleFlag();
                    // 切换页面
                    successToSignIn();
                    // 本地存储账号和密码
                    let isAuserObj = {};
                    isAuserObj.username = username.value;
                    isAuserObj.password = password.value;
                    isAuserObj.userId = response.data.data.userId;
                    let isAuserStr = JSON.stringify(isAuserObj);
                    localStorage.setItem('isAuser', isAuserStr);

                    username.value = '';
                    password.value = '';
                    isAuserStr = localStorage.getItem('isAuser');
                    isAuserObj = JSON.parse(isAuserStr);
                    // console.log(isAuserObj);
                    mainList.innerHTML = '';
                    personInfor(isAuserObj.userId);
                    paintArticle(1);
                    id = isAuserObj.userId;

                } else if (response.data.data.message === '该用户已登录') {
                    alert('该账号可能在别处登录了, 请重新登录');
                    axios.post(url + 'user/logout', {
                        userId: response.data.data.userId,
                    })
                } else {
                    tishiFrame();
                    shadowP();
                    tishi.children[2].style.display = 'block';
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

/* 跳转页面内容- 开始 - */
// 登录成功 从登录页面 -> 主页
let successToSignIn = () => {
    loginBtn.style.display = 'none';
    loginPage.style.display = 'none';
    rightSign.style.display = 'none';
    touBell.style.display = 'block';
    body.style.overflowY = 'auto';
    articleDetail.style.display = 'none';
}

// 返回主页
let returnMain = () => {
    pageBlockOrNot(view);
    body.style.overflowY = 'auto';
}

// 退出登录成功(个人主页) -> 返回主页
let personToMain = function () {
    returnMain();
}
let successToSignOut = () => {
    flag = 0;
    articleFlag();
    personToMain();
    loginBtn.style.display = 'inline-block';
    rightSign.style.display = 'block';
    touBell.style.display = 'none';
    moreList.style.display = 'none';
    mainList.innerHTML = `
    <li>
        <div class="tiShi">
            <p>请先进行登录</p>
        </div>
    </li>
    `;
}



/* 跳转页面内容- 结束 - */
/* 下面是发送请求的内容 */

// 获取本地存储内容
let isAuserStr = localStorage.getItem('isAuser');
isAuserObj = JSON.parse(isAuserStr);

// 登出
goOutBtn.onclick = () => {
    if (confirm('确认登出吗？每一片贫瘠的土地都需要坚定的挖掘者！')) {
        axios.post(url + 'user/logout', {
            userId: isAuserObj.userId,
        })
            .then(function (response) {
                if (response.data.data.message == '退出登录成功') {
                    successToSignOut();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    } else {
        moreList.style.display = 'none';
    }
}


// 判断登录状态  一打开页面就要判断 已登录时flag=1
let flag = 0;

let offer = shouye.querySelector('.header .offer');
if (isAuserObj !== null) {
    axios.get(url + 'user/isLogin', {
        params: {
            userId: isAuserObj.userId,
        }
    })
        .then(function (response) {
            if (response.data.data.message === '已登录') {
                successToSignIn();
                flag = 1;
                personInfor();
                mainList.innerHTML = '';
                paintArticle(1);
            } else if (response.data.data.message === '未登录') {
                flag = 0;
                mainList.innerHTML = `
                <li>
                    <div class="tiShi">
                        <p>请先进行登录</p>
                    </div>
                </li>
                `;
            }
            articleFlag();
        })
        .catch(function (error) {
            console.log(error);
        });


}






/* 写文章 -开始- */
// 发布文章按钮
let sendBtn = document.querySelector('.articleContainer .end .send');
sendBtn.onclick = () => {
    let mention = writeArticle.querySelector('.mention');
    // console.log(mention);
    if (textTitle.value === '') {
        mention.style.opacity = '1';
        mention.children[0].style.display = 'block';
        setTimeout(() => {
            mention.style.opacity = '0';
            mention.children[0].style.display = 'none';
        }, 1000);

    } else if (textArea.value === '') {
        mention.style.opacity = '1';
        mention.children[1].style.display = 'block';
        setTimeout(() => {
            mention.style.opacity = '0';
            mention.children[1].style.display = 'none';
        }, 1000);
    } else {
        axios.post(url + 'article/writeArticle', {
            userId: isAuserObj.userId,
            title: textTitle.value,
            content: textArea.value
        })
            .then(function (response) {
                if (response.data.data.message === '提交成功') {
                    /* 清空输入框 */
                    textTitle.value = '';
                    textArea.value = '';
                    writeArticle.style.display = 'none';
                    moreList.style.display = 'none';
                    shouye.style.display = 'block';
                    body.style.overflowY = 'auto';
                    articleDetail.style.display = 'none';
                    personToMain();
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

}

/* 写文章 -结束- */


// 添加功能，显示编辑和更多
let newFunction = function () {
    for (let i = 0; i < articleItems.length; i++) {
        articleItems[i].addEventListener('mouseenter', () => {
            moreChoose[i].style.display = 'block';
        })
        articleItems[i].addEventListener('mouseleave', () => {
            moreChoose[i].style.display = 'none';
            editAndDelete[i].style.display = 'none';
        })
        moreChoose[i].children[1].onclick = function () {
            editAndDelete[i].style.display = 'block';
        }
    }
}

// 点赞和取消点赞
// 传 数组 和 获取文章的返回值(thumbUpNum,)
let thumbUpAndDown = function (res, dianZan, cai) {
    for (let i = 0; i < dianZan.length; i++) {
        dianZan[i].onclick = function () {
            setTimeout(() => {
                axios.post(url + 'article/thumbUpArticle', {
                    userId: isAuserObj.userId || id,
                    articleId: res[i].articleId,
                    flag: 'true',
                    // 要判断一下这个id有没有点赞过
                })
                    .then(function (response) {

                        if (response.data.data.message === '点赞成功') {
                            setTimeout(() => {
                                axios.get(url + 'article/getContent', {
                                    params: {
                                        userId: res[i].authorId || isAuserObj.userId,
                                        articleId: res[i].articleId,
                                    }
                                })
                                    .then(response => {
                                        let res2 = response.data.data;
                                        if (cai) {
                                            cai[i].children[0].className = 'icon iconfont';
                                        }
                                        dianZan[i].children[0].className = 'icon iconfont already';
                                        dianZan[i].children[0].children[0].innerHTML = res2.thumbUpNum;
                                    })
                            }, 100);



                        }
                        else if (response.data.data.message === '点赞失败') {
                            // 此时要取消点赞
                            axios.post(url + 'article/thumbUpArticle', {
                                userId: isAuserObj.userId,
                                articleId: res[i].articleId,
                                flag: 'false',
                            })
                                // 这个response是取消点赞的
                                .then(response => {
                                    if (response.data.data.message === '取消点赞成功') {
                                        // 这个好像是因为服务器修改信息慢了
                                        setTimeout(() => {
                                            axios.get(url + 'article/getContent', {
                                                params: {
                                                    userId: res[i].authorId || id,
                                                    articleId: res[i].articleId,
                                                }
                                            })
                                                .then(response => {
                                                    let res2 = response.data.data;
                                                    dianZan[i].children[0].className = 'icon iconfont';
                                                    dianZan[i].children[0].children[0].innerHTML = res2.thumbUpNum;
                                                })
                                        }, 100);


                                    }
                                })

                        }
                    })
            }, 100);

        }
    }
}

// 获取个人主页页面的ul
let personList = personalPage.querySelector('.detailArticle ul');

// 渲染用户写的文章列表
// 这里有id噢，我想写个进入文章详情可以点关注的
let nothing = personalPage.querySelector('.nothing');
let paintPage = function (subId) {
    axios.get(url + 'user/getUserWriteArticles', {
        params: {
            userId: subId || isAuserObj.userId || id,
        }
    })
        // 渲染文章列表
        .then(function (response) {
            if (response.data.data.message === '该用户暂无文章') {
                nothing.style.display = 'block';
                return false;
            }
            nothing.style.display = 'none';
            // 获取个人主页的id
            personList.innerHTML = '';
            for (let i = 0; i < response.data.data.length; i++) {
                let article = `
                <li>
                <p>`+ response.data.data[i].author + `</p>
                <h3>`+ response.data.data[i].title + `</h3>
                <div class="zan more"><i class="icon iconfont">&#xe60c;<span></span></i></div>
                <div class="cai more"><i class="icon iconfont">&#xe621;<span> `+ response.data.data[i].commentNum + `</span></i></div>
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
                personList.innerHTML += article;
            }

            // 因为是异步创建li，所以等加载完了在给li添加功能
            // 当鼠标经过文章的小li时，显示编辑删除文章的按钮
            newFunction();
            let res = response.data.data;

            // 点击标题进入文章详情
            let hToDetail = personalPage.querySelectorAll('.detailArticle ul li h3');
            for (let i = 0; i < hToDetail.length; i++) {
                hToDetail[i].onclick = () => {
                    personalPage.style.display = 'none';
                    articleDetail.style.display = 'block';
                    getArticleDetail(res[i]);
                    getArticleComment(res[i]);
                }
            }

            // 点赞和取消点赞
            let writeWrap = personalPage.querySelector('.wrap .writeWrap');
            let dianZan = writeWrap.getElementsByClassName('zan');

            for (let i = 0; i < dianZan.length; i++) {
                let thumbUpNum = res[i].thumbUpNum;
                if (thumbUpNum !== 0) {
                    dianZan[i].children[0].children[0].innerHTML = thumbUpNum;
                }
            }


            // 在点击的时候要判断这篇文章的id是什么

            thumbUpAndDown(res, dianZan);


            // 获取文章详细内容
            for (let i = 0; i < res.length; i++) {
                axios.get(url + 'article/getContent', {
                    params: {
                        userId: subId || isAuserObj.userId,
                        articleId: res[i].articleId,
                    }
                })
                    .then(function (response) {
                        let res1 = response.data.data;
                        // console.log(res1);    // 报错是因为这里有些没有返回avatar的数据
                        touXiang[1].innerHTML = `<img src="` + url + res1.authorAvatar + `">`
                        if (res1.isThumbUp) {
                            dianZan[i].children[0].className = 'icon iconfont already';
                        }
                    })

            }
            return new Promise((resolve, reject) => {
                resolve(response);
            })
        })

        // 删除文章
        .then(response => {
            newFunction();
            for (let i = 0; i < articleItems.length; i++) {
                editAndDelete[i].children[1].onclick = function () {
                    let that = this;
                    // 删除文章
                    if (response) {
                        axios.post(url + 'article/deleteArticle', {
                            userId: isAuserObj.userId,
                            articleId: response.data.data[i].articleId
                        })
                            .then(function (response) {
                                if (response.data.data.message === '删除成功') {
                                    personList.removeChild(that);
                                    paintPage();
                                    newFunction();
                                } else {
                                    alert('阿噢 这是别人的文章，删不了噢');
                                }
                                // 删除之后要重新渲染页面
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    } else {
                        alert('阿噢 这是别人的文章，删不了噢');
                    }

                }.bind(articleItems[i], editAndDelete[i])
                // 把this指向改成当前的li
                // 这里用bind！，用apply就立即执行了，异步变同步了，点击事件也没用了555
            }
        })
        .catch(function (error) {
            console.log(error);
        });

}

let dislikeOrNot = function (res, cai, zan) {
    // 点踩按钮
    for (let i = 0; i < cai.length; i++) {
        cai[i].onclick = () => {
            axios.post(url + 'article/dislikeArticle', {
                userId: isAuserObj.userId,
                articleId: res[i].articleId,
                flag: 'true',
            })
                .then(function (response) {
                    let resCai = response.data.data;
                    if (resCai.message === '点踩成功') {
                        setTimeout(() => {
                            axios.get(url + 'article/getContent', {
                                params: {
                                    userId: res[i].authorId,
                                    articleId: res[i].articleId,
                                }
                            })
                                .then(response => {
                                    let res2 = response.data.data;
                                    if (zan) {
                                        zan[i].children[0].children[0].innerHTML = res2.thumbUpNum;
                                        zan[i].children[0].className = 'icon iconfont';
                                    }

                                    cai[i].children[0].className = 'icon iconfont alreadyCai';
                                })
                        }, 100);


                    } else if (resCai.message === '点踩失败') {
                        axios.post(url + 'article/dislikeArticle', {
                            userId: isAuserObj.userId,
                            articleId: res[i].articleId,
                            flag: 'false',
                        })
                            .then(response => {
                                if (response.data.data.message === '取消点踩成功') {
                                    cai[i].children[0].className = 'icon iconfont';
                                }

                            })
                    }
                })
        }
    }

}




// 修改用户头像
let sendFileBtn = personalInformation.querySelector('.actionBox button');
let sendFile = personalInformation.querySelector('form');
let formData = new FormData();
try {
    formData.append('userId', isAuserObj.userId);
} catch (error) {
    console.log(error);
}

sendFile.onclick = function () {
    sendFile.addEventListener('change', function () {
        formData.append('avatar', sendFile.file.files[0]);
        axios({
            method: 'post',
            url: url + 'user/changeUserAvatar',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                if (response.data.data.message === '修改头像成功') {
                    personInfor();
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    })
}

let mainList = shouye.querySelector('.mainList');
// 获取主页的全部文章(渲染主页)
let result = [];
let mainFlag = 1;
let paintArticle = (j) => {
    var isAuserStr = localStorage.getItem('isAuser');
    isAuserObj = JSON.parse(isAuserStr);
    if (mainFlag === 1 && isAuserObj != null && flag === 1) {
        axios.get(url + 'article/getArticle', {
            params: {
                userId: isAuserObj.userId || id,
                page: j,
            }
        })
            .then(function (response) {
                let res = response.data.data;
                if (res.length === 0) {
                    return false;
                }
                let resArray = Array.prototype.slice.call(response.data.data);
                result = result.concat(resArray);

                res[0].title = res[0].title.replace(reg, '');
                // console.log(result);
                for (let i = 0; i < res.length; i++) {
                    let article = `
                 <li>
                 <p>`+ res[i].author + `</p>
                 <h3>` + res[i].title + `</h3>
                 <div class="zan more"><i class="icon iconfont">&#xe60c;<span>`+ res[i].thumbUpNum + `</span></i></div>
                 <div class="error more"><i class="icon iconfont">&#xe697;</i></div>
                 <div class="cai more"><i class="icon iconfont">&#xe621;<span>`+ res[i].commentNum + `</span></i></div>
                 </li>
                 `
                    mainList.innerHTML += article;
                }


                return new Promise((resolve, reject) => {
                    resolve(res);
                })

            })
            .then((res) => {
                let hVisited = mainList.getElementsByTagName('h3');  // 点击小li变色
                // 点击标题标题变色
                for (let i = 0; i < hVisited.length; i++) {
                    hVisited[i].onclick = function () {
                        // console.log(i);
                        view.style.display = 'none';
                        articleDetail.style.display = 'block';
                        getArticleDetail(result[i]);
                        getArticleComment(result[i]);

                        hVisited[i].className = 'hVisited';
                    }
                }
                let myZan = mainList.getElementsByClassName('zan');
                for (let i = 0; i < myZan.length; i++) {
                    if (result[i].isThumbUp) {
                        myZan[i].children[0].className = 'icon iconfont already';
                    }
                }
                let myCai = mainList.getElementsByClassName('error');
                for (let i = 0; i < myCai.length; i++) {
                    if (result[i].isDislike) {
                        myCai[i].children[0].className = 'icon iconfont alreadyCai';
                    }
                }
                dislikeOrNot(result, myCai, myZan);
                // 我不够聪明以至于这个方法1我想了一天5555----数组合并(就能保存下来前面几页的数据啦！！)
                thumbUpAndDown(result, myZan, myCai);



                /*    ----------------这是一条分割线------------------  */
                window.onscroll = () => {
                    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                    // console.log(scrollTop);
                    // console.log(windowHeight);
                    // console.log(scrollHeight);
                    if (Math.ceil(scrollTop) + windowHeight === scrollHeight) {
                        if (j === 10) {
                            window.onscroll = '';
                        } else if (res.length !== 10) {
                            mainFlag = 0;
                        } else {
                            if (mainFlag === 1) {
                                j++;
                                paintArticle(j);
                            }
                        }

                    }
                }


            })
            .catch(function (error) {
                console.log(error);
            });
    }
}


// 点击显示/隐藏
let blockOrNot = function (sth, that) {
    if (that !== undefined) {
        if (that.style.display === 'block') {
            that.style.display = 'none';
        }
    }
    if (sth.style.display === 'block') {
        sth.style.display = 'none';

    } else {
        sth.style.display = 'block';
    }
}

// 页面的隐藏
let pageBlockOrNot = function (page) {
    // console.log(page);
    if (page === view) {
        mainFlag = 1;
    } else {
        mainFlag = 0;
    }
    view.style.display = 'none';
    articleDetail.style.display = 'none';
    personalPage.style.display = 'none';
    personalInformation.style.display = 'none'
    writeArticle.style.display = 'none';
    page.style.display = 'block';
}

