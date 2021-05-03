let articleContent = articleDetail.querySelector('.articleContent');
let editorHead = articleDetail.querySelector('.editor .touXiang');
let editorName = articleDetail.querySelector('.editor h3');
let commentHead = articleDetail.querySelector('.inputComment .touXiang');
let pingLunInput = articleDetail.querySelector('.comment input');
let pingLun = articleDetail.querySelector('.comment .pingLun');
// 获取所有的icon
let iconList = articleDetail.querySelectorAll('.functionIcon .wrap');

let emojis = [{
    name: '微笑',
    src: '../emoji/slightly-smiling-face_1f642.png',
}, {
    name: '亲亲',
    src: '../emoji/face-throwing-a-kiss_1f618.png'
}, {
    name: '爱心',
    src: '../emoji/beating-heart_1f493.png'
}, {
    name: '沮丧',
    src: '../emoji/disappointed-but-relieved-face_1f625.png'
}, {
    name: 'omg',
    src: '../emoji/face-screaming-in-fear_1f631.png'
}, {
    name: '尴尬',
    src: '../emoji/face-with-rolling-eyes_1f644.png'
}, {
    name: '笑哭',
    src: '../emoji/face-with-tears-of-joy_1f602.png'
}, {
    name: '啊这',
    src: '../emoji/fearful-face_1f628.png'
}, {
    name: '薯条',
    src: '../emoji/french-fries_1f35f.png'
}, {
    name: '黄脸',
    src: '../emoji/full-moon-with-face_1f31d.png'
}, {
    name: '黑脸',
    src: '../emoji/new-moon-with-face_1f31a.png'
}, {
    name: '哭哭',
    src: '../emoji/loudly-crying-face_1f62d.png'
}, {
    name: '猴子',
    src: '../emoji/monkey-face_1f435.png'
}, {
    name: '猪猪',
    src: '../emoji/pig_1f416.png'
}, {
    name: '失望',
    src: '../emoji/pensive-face_1f614.png'
}, {
    name: '粑粑',
    src: '../emoji/pile-of-poo_1f4a9.png'
}, {
    name: '脑没了',
    src: '../emoji/shocked-face-with-exploding-head_1f92f.png'
}, {
    name: '笑脸',
    src: '../emoji/slightly-smiling-face_1f642.png'
}, {
    name: '开心',
    src: '../emoji/smiling-face-with-halo_1f607.png'
}, {
    name: '哈哈',
    src: '../emoji/smiling-face-with-open-mouth-and-cold-sweat_1f605.png'
}, {
    name: '太阳',
    src: '../emoji/sun-with-face_1f31e.png'
}, {
    name: '思考',
    src: '../emoji/thinking-face_1f914.png'
}, {
    name: '嘻嘻',
    src: '../emoji/white-smiling-face_263a.png'
}];

function filterEmoji(input, emojis) {
    let emojiReg = new RegExp('\\[' + emojis.name + '\\]|\\/' + emojis.name, 'gm');
    let emojiResult = input.replace(emojiReg, '<img class="emoji" src="' + emojis.src + '"/>');
    return emojiResult;
}



// 传的数据是关于文章作者的信息
// 获取文章详细内容(包括侧边和评论的那个头像)  到时设置点击了才调用
let getArticleDetail = (res) => {
    // console.log(res);   // 这个有authorId噢
    iconList[0].onclick = () => {
        thumbUp(res, iconList[0])
    }
    // 因为有些文章没有返回thumbUp所以搞了try...catch
    try {
        if (res.isThumbUp) {
            iconList[0].children[0].className = 'icon iconfont already';
        } else {
            iconList[0].children[0].className = 'icon iconfont';
        }
        if (res.isDislike) {
            iconList[1].children[0].className = 'icon iconfont alreadyCai';
        } else {
            iconList[1].children[0].className = 'icon iconfont';
        }
    } catch (error) {
        console.log(error);
    }

    // 点踩按钮
    iconList[1].onclick = () => {
        axios.post(url + 'article/dislikeArticle', {
            userId: isAuserObj.userId,
            articleId: res.articleId,
            flag: 'true',
        })
            .then(function (response) {
                let resCai = response.data.data;
                if (resCai.message === '点踩成功') {
                    iconList[1].children[0].className = 'icon iconfont alreadyCai';
                } else if (resCai.message === '点踩失败') {
                    axios.post(url + 'article/dislikeArticle', {
                        userId: isAuserObj.userId,
                        articleId: res.articleId,
                        flag: 'false',
                    })
                        .then(response => {
                            if (response.data.data.message === '取消点踩成功') {
                                iconList[1].children[0].className = 'icon iconfont';
                            }

                        })
                }
            })
    }
    axios.get(url + 'article/getContent', {
        params: {
            userId: res.authorId || isAuserObj.userId,
            articleId: res.articleId,
        }
    })
        .then(function (response) {
            // 点击评论框显示 评论按钮
            pingLunInput.onfocus = () => {
                pingLun.style.display = 'block';
                let submitComment = pingLun.children[2].children[0];
                pingLunInput.addEventListener('keyup', () => {
                    submitComment.onclick = () => {
                        // post发布文章评论
                        axios.post(url + 'comment/postComment', {
                            userId: isAuserObj.userId,
                            articleId: res.articleId,
                            comment: pingLunInput.value,
                        })
                            .then(function (response) {
                                if (response.data.data.message === '提交成功') {
                                    pingLunInput.value = ''
                                    pingLun.style.display = 'none';
                                    getArticleComment(res);
                                    // 要清空原来渲染的东西orz
                                }
                            })


                    }
                })

            }

            let res2 = response.data.data;
            res2.content = res2.content.replace(reg, '');
            res2.title = res2.title.replace(reg, '');
            let content = `
            <div class="head">
                <div class="touXiang">
                <img src="`+ url + res2.authorAvatar + `">
                </div>
                    <h3>
                    `+ res2.author + `
                    <p>2021年04月19日</p>
                    </h3>
                    <button class='notAlready'>关注</button>
            </div>     
                <div class="content">
                    <h3 class="title">`+ res2.title + `</h3>
                    <p>
                        `+ res2.content + `
                    </p>  
                </div>    
            `
            editorHead.innerHTML = `<img src="` + url + res2.authorAvatar + `">`;

            editorName.innerHTML = res2.author
            articleContent.innerHTML = content;
            axios.get(url + 'user/getUserInfo', {
                params: {
                    userId: isAuserObj.userId,
                }
            })
                .then(response => {
                    // commentHead的头像应该是user的头像
                    commentHead.innerHTML = `<img src="` + url + response.data.data.avatar + `">`;
                })

            let likeBtn = articleDetail.querySelector('.articleContent .head button');
            let nickname = articleDetail.querySelector('.articleContent .head h3')
            axios.get(url + 'user/getMySubscribe?userId=' + isAuserObj.userId)
                .then(function (response) {
                    let res3 = response.data.data;
                    for (let i = 0; i < res3.length; i++) {
                        if (res2.author === res3[i].subName) {
                            likeBtn.className = '';   // 说明已关注
                            likeBtn.innerHTML = '已关注';
                        }
                    }
                })

            // 关注按钮的功能
            likeBtn.onclick = () => {
                if (likeBtn.innerHTML === '关注') {
                    // 关注用户
                    axios.post(url + 'user/subscribeSomeone', {
                        userId: isAuserObj.userId,
                        subscribeId: res.authorId,
                    })
                        .then(function (response) {
                            likeBtn.innerHTML = '已关注'
                            likeBtn.className = 'btn';
                        })
                } else {
                    // 取消关注用户
                    axios.post(url + 'user/cancelSubscribe', {
                        userId: isAuserObj.userId,
                        subscribeId: res.authorId
                    })
                        .then(function (response) {
                            likeBtn.className = 'btn notAlready';
                            likeBtn.innerHTML = '关注'
                        })
                }
            }

            nickname.onclick = () => {
                // 先查看一下这个subId的信息
                axios.get(url + 'user/getUserInfo?userId=' + res.authorId)
                    .then(function (response) {
                        let resPerson = response.data.data;

                        personalPage.style.display = 'block';
                        articleDetail.style.display = 'none';
                        // 编辑个人资料的按钮应该没了
                        personalBtn.style.display = 'none';

                        touXiang[1].innerHTML = `<img src="` + url + resPerson.avatar + `">`;
                        myName.innerHTML = resPerson.nickname;
                        personItems[0].onclick();

                        personItems[1].onclick = () => {
                            clearPageLi(1);
                            paintPage(res.authorId);
                            myArticle.style.display = 'block';
                        }
                        likeClick(res.authorId);    // 关注用户
                        likeArticle(res.authorId);
                        clickLike(res.authorId);  // 渲染别人关注用户的页面
                        pageSubMe(res.authorId);  // 渲染别人的关注者
                        personalTo.onclick = '';
                    })
            }

        })
        .catch(function (error) {
            console.log(error);
        });
}


// 评论点赞
let thumbUpCom = function (res, myZan) {
    for (let i = 0; i < myZan.length; i++) {
        if (res[i].isThumbUp) {
            myZan[i].children[0].className = 'icon iconfont already';
        }
        myZan[i].onclick = () => {
            let thumbUpNum = res[i].thumbUpNum;
            // 点赞评论
            axios.post(url + 'comment/thumbUpComment', {
                userId: isAuserObj.userId,
                commentId: res[i].commentId,
                flag: 'true'
            })
                .then(function (response) {
                    let res2 = response.data.data;
                    if (res2.message === '点赞成功') {
                        thumbUpNum++;
                        myZan[i].children[0].children[0].innerHTML = thumbUpNum;
                        myZan[i].children[0].className = 'icon iconfont already';
                    } else if (res2.message === '点赞失败') {
                        // 说明可能已经点赞过，此时要取消点赞
                        axios.post(url + 'comment/thumbUpComment', {
                            userId: isAuserObj.userId,
                            commentId: res[i].commentId,
                            flag: 'false'
                        })
                            .then(response => {
                                let res3 = response.data.data;
                                if (res3.message === '取消点赞成功') {
                                    if (thumbUpNum !== 0) {
                                        console.log(1);
                                        thumbUpNum--;
                                    }
                                    myZan[i].children[0].children[0].innerHTML = thumbUpNum;
                                    myZan[i].children[0].className = 'icon iconfont';
                                }
                            })
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
}

// 评论点踩
let dislikeCom = function (res, myCai) {
    for (let i = 0; i < myCai.length; i++) {
        if (res[i].isDislike) {
            myCai[i].children[0].className = 'icon iconfont alreadyCai';
        }
        myCai[i].onclick = function () {

            axios.post(url + 'comment/dislikeComment', {
                userId: isAuserObj.userId,
                commentId: res[i].commentId,
                flag: 'true'
            }).then(response => {
                let res2 = response.data.data;
                if (res2.message === '点踩成功') {
                    myCai[i].children[0].className = 'icon iconfont alreadyCai';
                } else {
                    axios.post(url + 'comment/dislikeComment', {
                        userId: isAuserObj.userId,
                        commentId: res[i].commentId,
                        flag: 'false'
                    })
                        .then(response => {
                            let res3 = response.data.data;
                            if (res3.message === '取消点踩成功') {
                                myCai[i].children[0].className = 'icon iconfont';
                            }
                        })
                }
            })
        }

    }
}


// 获取文章评论还有回复 
let commentList = articleDetail.querySelector('.commentList');



let commentArr = [];
let getAnswer = function (res, j) {
    axios.get(url + 'comment/getComment', {
        params: {
            userId: isAuserObj.userId,
            articleId: res.articleId,
            page: j,
        }
    })
        .then(response => {
            let resAnswer = response.data.data;
            commentArr = commentArr.concat(resAnswer);
            if (resAnswer.length === 5) {
                j++;
                getAnswer(res, j);
                if (j === 5) {
                    return false;
                }
            } else if (resAnswer.length !== 5) {
                // 原本的commentArr是getComment的返回值，是动态的
                commentList.innerHTML = '';
                if (commentArr.length === 0) {
                    return false;
                }
                if (res.articleId === 28) {
                    commentArr[2].comment = commentArr[2].comment.replace(reg, '');
                }
                // 这个commentArr是获取评论的
                for (let i = 0; i < commentArr.length; i++) {
                    for (let j = 0; j < emojis.length; j++) {
                        commentArr[i].comment = filterEmoji(commentArr[i].comment, emojis[j]);
                    }
                    let comment = `
                <li>
                <div class="touXiang"><img src="`+ url + commentArr[i].commentatorAvatar + `"></div>
                <div class="right myComment">
                    <p class="commentName">`+ commentArr[i].commentator + ` @ ` + res.author + `</p>
                    <p class="comments">`+ commentArr[i].comment + `</p>
                    <p class="time">1小时前</p>
                </div>
                <div class="zanCai">
                <div class="zan Zan"><i class="icon iconfont">&#xe60c;<span>`+ commentArr[i].thumbUpNum + `</span></i></div>
                <div class="cai Cai"><i class="icon iconfont">&#xe610;</i></div>
                <div class="reply"><i class="icon iconfont">&#xe61f;<span>回复</span></i></div>
                </div>
                <div class="after"></div>
                <ul class="answerList"></ul>
                </li>
                `;
                    commentList.innerHTML += comment;
                }
                let res1After = [];
                let answer = articleDetail.querySelectorAll('.commentList .myComment');
                let res1Array = Array.prototype.slice.call(commentArr);  // 这个方法很快就想到了，我真聪明哈哈哈
                // 改了这里，不知道怎么样 answer:还行哈哈哈
                axios.get(url + 'user/getUserInfo?userId=' + isAuserObj.userId)
                    .then(response => {
                        if (res1Array !== 0) {
                            for (let i = 0; i < commentArr.length; i++) {
                                let p0delete = `
                        <p class="delete">删除</p>
                         `;
                                if (res1Array[i].commentator === response.data.data.nickname) {
                                    answer[i].innerHTML += p0delete;
                                    res1After.push(res1Array[i]);
                                }
                            }
                        }

                        setTimeout(() => {
                            let deleteComment = articleDetail.querySelectorAll('.commentList .myComment .delete');
                            for (let i = 0; i < deleteComment.length; i++) {
                                deleteComment[i].onclick = () => {
                                    axios.post(url + 'comment/deleteComment', {
                                        userId: isAuserObj.userId,
                                        commentId: res1After[i].commentId,
                                    })
                                        .then(function (response) {
                                            let resComment = response.data.data;
                                            if (resComment.message === '删除成功') {
                                                getArticleComment(res);
                                            }
                                        })
                                }
                            }

                        }, 500);


                    })

                getArticleReply(res, commentArr, 0, 1);

                // 赞踩、回复框
                setTimeout(() => {
                    let myZan = articleDetail.getElementsByClassName('Zan');
                    let myCai = articleDetail.getElementsByClassName('Cai');
                    let myReply = articleDetail.getElementsByClassName('reply');
                    let afterReply = articleDetail.querySelectorAll('.commentList .after');
                    thumbUpCom(commentArr, myZan);
                    dislikeCom(commentArr, myCai);
                    for (let i = 0; i < myReply.length; i++) {
                        myReply[i].onclick = () => {
                            // 我评论的框框
                            let reply = `
                        <div class="before">
                        <input type="text" placeholder="输入评论...">
                        </div>
                        <div class="pingLun">
                            <div class="icon">
                                <i class="icon iconfont">&#xe640; 表情</i>
                                <i class="icon iconfont">&#xe667; 图片</i>
                            </div>
                            <div class="button">
                                Ctrl or ⌘ + Enter
                                <button>评论</button>
                            </div>
                        </div>
                        `;

                            if (afterReply[i].style.display === 'block') {
                                afterReply[i].style.display = 'none';
                                afterReply[i].innerHTML = '';
                            } else {
                                afterReply[i].style.display = 'block';
                                afterReply[i].innerHTML = reply;
                            }

                            // 点击后才有replyInput
                            let replyInput = articleDetail.querySelector('.after .before input');
                            let replyButton = articleDetail.querySelector('.after .button button');
                            if (replyInput !== null) {
                                replyInput.addEventListener('keyup', () => {
                                    replyButton.onclick = () => {

                                        // 提交回复
                                        axios({
                                            method: 'post',
                                            url: url + 'reply/postReply',
                                            data: {
                                                userId: isAuserObj.userId,
                                                commentId: commentArr[i].commentId,
                                                reply: replyInput.value,
                                            }
                                        });
                                        afterReply[i].style.display = 'none';
                                        afterReply[i].innerHTML = '';
                                        getArticleComment(res);

                                    }

                                })
                            }


                        }
                    }

                }, 500);
            }

        })
}
// 这个res主要是要获取文章的articleId
let getArticleComment = function (res) {
    commentArr = [];
    res2All = [];
    res2After = [];
    getAnswer(res, 1);
}


// 获取回复 commentArr    
let res2After = [];
let res2All = [];
let replyArr = [];
let getArticleReply = function (res, commentArr, i, j) {
    if (commentArr[i] != undefined) {
        // 每个回复没有在一起的o
        axios.get(url + 'reply/getReply', {
            params: {
                userId: isAuserObj.userId,
                commentId: commentArr[i].commentId,
                page: j,
            }
        })
            .then(function (response) {
                let answerList = articleDetail.querySelectorAll('.answerList');
                let res2 = response.data.data;
                replyArr = replyArr.concat(res2);   // 把所有回复都搞在一起了肯定不行, 我要的是一条评论里面的所有回复
                if (res2.length === 5) {
                    j++;
                    getArticleReply(res, commentArr, i, j);
                } else if (res2.length !== 5) {
                    for (let j = 0; j < replyArr.length; j++) {
                        for (let k = 0; k < emojis.length; k++) {
                            replyArr[j].replyContent = filterEmoji(replyArr[j].replyContent, emojis[k]);
                        }
                        let answer = `
                        <li>
                            <div class="answer">
                                <div class="touXiang"><img src="`+ url + replyArr[j].replierAvatar + `"></div>
                                <div class="right">
                                    <p class="commentName">`+ replyArr[j].replier + ` @ ` + commentArr[i].commentator + `</p>
                                    <p class="comments">`+ replyArr[j].replyContent + `</p>
                                    <p class="time">1小时前</p>
                                    <p class="delete"></p>
                                </div>
                            </div>
                        </li>
                        `;
                        answerList[i].innerHTML += answer;
                    }

                    let obj = {};
                    obj.commentArr = commentArr;
                    obj.replyArr = replyArr;

                    return new Promise((resolve, reject) => {
                        resolve(obj);
                    })
                        .then((obj) => {

                            commentArr = obj.commentArr;
                            axios.get(url + 'user/getUserInfo?userId=' + isAuserObj.userId)
                                .then(function (response) {
                                    let res3 = response.data.data;

                                    let deleteComment = articleDetail.querySelectorAll('.answerList .answer .delete');

                                    for (let j = 0; j < obj.replyArr.length; j++) {
                                        res2All.push(obj.replyArr[j]);  // 第i条评论之前的所有回复(在没进入这个循环之前)
                                        if (res3.nickname === obj.replyArr[j].replier) {  // 把所有replier拼接在一起再处理 res2是1个评论的回复 
                                            // 能进来说明是第i条评论里面的第j条回复
                                            res2After.push(obj.replyArr[j]);
                                        }
                                    }


                                    for (let j = 0; j < res2After.length; j++) {// 这个是我回复的
                                        for (k = 0; k < res2All.length; k++) {// 这个是全部回复的(遍历完后)
                                            if (res2After[j].replyId === res2All[k].replyId) {
                                                deleteComment[k].innerHTML = '删除';
                                            }
                                        }
                                    }

                                    setTimeout(() => {
                                        let deleteReply = articleDetail.querySelectorAll('.answer .delete');
                                        for (let i = 0; i < deleteReply.length; i++) {

                                            deleteReply[i].onclick = () => {
                                                axios.post(url + 'reply/deleteReply', {
                                                    userId: isAuserObj.userId,
                                                    replyId: res2All[i].replyId,  // 这个才有
                                                })
                                                    .then(function (response) {
                                                        if (response.data.data.message === '删除成功') {
                                                            getArticleComment(res);
                                                        }

                                                    })
                                            }
                                        }
                                    }, 200);

                                    if (commentArr.length !== i) {
                                        i++;
                                        getArticleReply(res, commentArr, i, 1);
                                        replyArr = [];
                                    }

                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        })
                }
            })

    }
}


iconList[2].onclick = function () {
    let scroll = articleContent.clientHeight;
    scrollTo(0, scroll);
}


function thumbUp(res, btn) {
    let thumbUpNum = res.thumbUpNum;
    axios.post(url + 'article/thumbUpArticle', {
        userId: isAuserObj.userId,
        articleId: res.articleId,
        flag: 'true',
    })
        .then(function (response) {
            let res1 = response.data.data;
            if (res1.message === '点赞成功') {
                thumbUpNum++;
                btn.children[0].className = 'icon iconfont already';
            }
            else if (response.data.data.message === '点赞失败') {
                // 此时要取消点赞
                axios.post(url + 'article/thumbUpArticle', {
                    userId: isAuserObj.userId,
                    articleId: res.articleId,
                    flag: 'false',
                })
                    // 这个response是取消点赞的
                    .then(response => {
                        let res2 = response.data.data;
                        if (res2.message === '取消点赞成功') {
                            if (thumbUpNum !== 0) {
                                thumbUpNum--;
                            }
                            btn.children[0].className = 'icon iconfont';

                            if (btn.children[0].children[0] !== undefined) {
                                btn.children[0].children[0].innerHTML = thumbUpNum;
                            }

                        }
                    })

            }
        })
        .catch(function (error) {
            console.log(error);
        });
}


