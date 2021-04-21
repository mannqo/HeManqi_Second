let url = 'http://47.100.42.144:3389/';
/* 获取各个页面 */
let body = document.querySelector('body');
let shouye = document.querySelector('.shouye');  // 获取首页
let view = shouye.querySelector('.view');  // 获取主页标题以下的部分 
let writeArticle = document.querySelector('.writeArticle');  // 获取写文章页面
let personalPage = document.querySelector('.personalPage');  // 获取个人主页
let personalInformation = document.querySelector('.personalInformation'); // 编辑资料

let touXiang = document.querySelectorAll('.tou-xiang');  // 获取登录头像
let moreList = shouye.querySelector('.shouye .main-nav .moreList');  // 点击头像出现的框框
let loginBtn = shouye.querySelector('header .sign-up');    // 登录按钮
let rightSign = shouye.querySelector('.rightNav .login');  // 获取登录框
let touBell = shouye.querySelector('.main-nav ul li .wrap');  // 获取 头像和铃铛部分
let goOutBtn = moreList.querySelector('.moreList .navGroup .goOut');  //登出按钮
let personalBtn = personalPage.querySelector('.personal button');
/* 跳转页面内容- 开始 - */
// 登录成功 从登录页面 -> 主页
let successToSignIn = () => {
    loginBtn.style.display = 'none';
    loginPage.style.display = 'none';
    rightSign.style.display = 'none';
    touBell.style.display = 'block';
    body.style.overflowY = 'auto';
}
// 退出登录成功(个人主页) -> 返回主页
let personToMain = function () {
    if (personalPage.style.display === 'block' || personalInformation.style.display === 'block') {
        personalPage.style.display = 'none';
        personalInformation.style.display = 'none';
        main.style.display = 'block';
        view.style.display = 'block';
        body.style.overflowY = 'auto';
    }
}
let successToSignOut = () => {
    personToMain();
    loginBtn.style.display = 'inline-block';
    rightSign.style.display = 'block';
    touBell.style.display = 'none';
    moreList.style.display = 'none';
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
axios.get(url + 'user/isLogin', {
    params: {
        userId: isAuserObj.userId,
    }
})
    .then(function (response) {
        if (response.data.data.message === '已登录') {
            successToSignIn();
            flag = 1;
        };
    })
    .catch(function (error) {
        console.log(error);
    });

// 获取文章内容
// axios.post(url+'user/getUserWriteArticles', {
//     userId: '116',
// })
//     .then(function (response) {
//         console.log(response);
//     })
//     .catch(function (error) {
//         console.log(error);
//     });

// 显示发送成功结果
let finalResult = function (i) {
    successBox[i].style.display = 'block';
    successToSend.style.opacity = '1';
    setTimeout(function () {
        successToSend.style.opacity = '0';
    }, 2000);
}

/* 写文章 -开始- */
// 发布文章按钮
let sendBtn = document.querySelector('.articleContainer .end .send');
// 获取发布成功的div
let successToSend = document.querySelector('.successToSend');
let successBox = successToSend.querySelectorAll('.successToSend p');
sendBtn.onclick = () => {
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
                finalResult(0);
                writeArticle.style.display = 'none';
                moreList.style.display = 'none';
                shouye.style.display = 'block';
                body.style.overflowY = 'auto';
                personToMain();
                paintPage();
            }
        })
        .catch(function (error) {
            console.log(error);
        });
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

// 获取个人主页页面标题的ul
let personList = personalPage.querySelector('.detailArticle ul');
// 渲染用户写的文章列表
let paintPage = function () {
    let isAuserStr = localStorage.getItem('isAuser');
    isAuserObj = JSON.parse(isAuserStr);
    axios.get(url + 'user/getUserWriteArticles', {
        params: {
            userId: isAuserObj.userId,
            page: 1
        }
    })
        .then(function (response) {
            // 获取个人主页的id
            let userIdName = personalPage.querySelector('.userIdName');
            userIdName.innerHTML = isAuserObj.username;
            let fragment = document.createDocumentFragment();
            for (let i = 0; i < response.data.data.length; i++) {
                let newli = document.createElement('li');
                let newP = document.createElement('p');
                let newH3 = document.createElement('h3');
                let article = `
                <div class="zan more"><i class="icon iconfont">&#xe60c;</i></div>
                <div class="cai more"><i class="icon iconfont">&#xe621;</i></div>
                <div class="moreChoose">
                    <div class="share more"><i class="icon iconfont">&#xeb45;</i></div>
                    <div class="deleteMore more">···</div>
                </div>
                <div class="editAndDelete">
                    <p>编辑</p>
                    <p>删除</p>
                </div>
                `;
                newH3.innerHTML = response.data.data[i].title;
                newP.innerHTML = isAuserObj.username;
                newli.appendChild(newP);
                newli.appendChild(newH3);
                newli.innerHTML += article;
                fragment.appendChild(newli);
            }
            personList.innerHTML = '';
            personList.appendChild(fragment);
            // 因为是异步创建li，所以等加载完了在给li添加功能
            // 当鼠标经过文章的小li时，显示编辑删除文章的按钮
            newFunction();

            return new Promise((resolve, reject) => {
                resolve(response);
            })
        })
        .then(response => {
            // let writeWrap = personalPage.querySelector('.wrap .writeWrap');
            // console.log(writeWrap);
            // let dianZan = writeWrap.getElementsByClassName('zan');
            // console.log(dianZan);
            // console.log(dianZan[0]);
            // // 在点击的时候要判断这篇文章的id是什么
            // for (let i = 0; i < dianZan.length; i++) {
            //     dianZan[i].onclick = function () {
            //         axios.post(url + 'article/thumbUpArticle', {
            //             userId: '116',
            //             articleId: '86',
            //             flag: true,
            //         })
            //             .then(function (response) {
            //                 console.log(response);
            //             })
            //             .catch(function (error) {
            //                 console.log(error);
            //             });
            //     }
            // }  这里这样写应该是对的，但是不知道为什么返回失败
            return new Promise((resolve, reject) => {
                resolve(response);
            })
        })
        .then(response => {
            newFunction();
            for (let i = 0; i < articleItems.length; i++) {
                editAndDelete[i].children[1].onclick = function () {
                    let that = this;
                    // 删除文章
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
                                alert('删除失败')
                            }
                            // 删除之后要重新渲染页面
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }.bind(articleItems[i], editAndDelete[i])
                // 把this指向改成当前的li
                // 这里用bind！，用apply就立即执行了，异步变同步了，点击事件也没用了555
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

// 渲染 个人资料 页面   ！！！！！！！！这里还没写







// 修改用户头像
let sendFileBtn = personalInformation.querySelector('.actionBox button');
let sendFile = personalInformation.querySelector('form');
let formData = new FormData();
formData.append('userId', 116);
sendFile.onclick = function () {
    sendFile.addEventListener('change', function () {
        formData.append('avatar', sendFile.file.files[0]);
        console.log(sendFile.file.files[0]);
        axios({
            method: 'post',
            url: url + 'user/changeUserAvatar',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    })
}
