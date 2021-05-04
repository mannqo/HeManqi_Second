
// 关注用户
// axios.post(url + 'user/subscribeSomeone', {
//     userId: 116,
//     subscribeId: 105,
// })
//     .then(function (response) {
//         console.log(response);
//     })
//     .catch(function (error) {
//         console.log(error);
//     });



// 取消关注用户
// for(let i=50;i<100;i++){
//     axios.post(url + 'user/cancelSubscribe', {
//         userId: 116,
//         subscribeId: i
//     })
//         .then(function (response) {
//             console.log(response);
//         })
//         .catch(function (error) {
//             console.log(error);
//         });
// }




// 获取用户关注的人
let mySubsribe = personalPage.querySelector('.likeIt .mySubscribe');
let nothingHere = personalPage.querySelectorAll('.nothingHere');



let goToMine = function (id) {
    personalBtn.style.display = 'block';
    axios.get(url + 'user/getUserInfo?userId=' + isAuserObj.userId)
        .then(response => {
            let res = response.data.data;
            touXiang[1].innerHTML = `<img src="` + url + res.avatar + `">`;
            myName.innerHTML = res.nickname;
        })
    // 点击文章
    personItems[1].onclick = () => {
        clearPageLi(1);
        paintPage();
        myArticle.style.display = 'block';
    }
    personItems[0].onclick();
    // 点击 赞
    personItems[3].onclick = function () {
        blockOrNot(starMore[0], starMore[1]);
        starMore[0].children[0].addEventListener('click', function () {
            paintNothing();
            wenFei[1].className = '';
            wenFei[0].className = 'black';

        }.bind(personItems[3]), true)
        starMore[0].children[1].addEventListener('click', function () {
            paintNothing();
            wenFei[0].className = '';
            wenFei[1].className = 'black';
        }.bind(personItems[3]), true)
    }
    clickLike(id);    // 更多-关注
    likeClick(id);    // 关注用户
    pageSubMe(id);    // 关注我的
    likeArticle(id);  // 用户点赞的文章
    personalTo.onclick = () => {
        personalBtn.onclick();
    }
}




// 去别人的主页  这个res有subId
let goToOthers = function (res, nickname) {
    for (let i = 0; i < res.length; i++) {
        nickname[i].onclick = () => {
            // console.log(res[i].subId);
            if (res[i].subId === isAuserObj.userId) {
                goToMine(isAuserObj.userId);
                return false;
            }
            // 先查看一下这个subId的信息
            axios.get(url + 'user/getUserInfo?userId=' + res[i].subId)
                .then(function (response) {
                    let resPerson = response.data.data;
                    // 编辑个人资料的按钮应该没了
                    personalBtn.style.display = 'none';


                    touXiang[1].innerHTML = `<img src="` + url + resPerson.avatar + `">`;
                    myName.innerHTML = resPerson.nickname;
                    personItems[0].onclick();

                    personItems[1].onclick = () => {
                        clearPageLi(1);
                        paintPage(res[i].subId);
                        myArticle.style.display = 'block';
                    }
                    likeClick(res[i].subId);    // 关注用户
                    likeArticle(res[i].subId);
                    clickLike(res[i].subId);  // 渲染别人关注用户的页面
                    pageSubMe(res[i].subId);  // 渲染别人的关注者
                    personalTo.onclick = '';
                })
        }
    }

}

// 点击按钮关注用户和取消关注用户
let subscribeOrNot = function (response) {
    let likeBtn = personalPage.getElementsByClassName('btn');
    for (let i = 0; i < likeBtn.length; i++) {
        likeBtn[i].onclick = () => {
            if (likeBtn[i].innerHTML === '关注') {
                // 关注用户
                axios.post(url + 'user/subscribeSomeone', {
                    userId: isAuserObj.userId,
                    subscribeId: response[i].subId,
                })
                    .then(function (response) {
                        likeBtn[i].innerHTML = '已关注'
                        likeBtn[i].className = 'btn';
                    })
            } else {
                // 取消关注用户
                axios.post(url + 'user/cancelSubscribe', {
                    userId: isAuserObj.userId,
                    subscribeId: response[i].subId
                })
                    .then(function (response) {
                        likeBtn[i].className = 'btn notAlready';
                        likeBtn[i].innerHTML = '关注'
                    })
            }
        }
    }
}

let allSubscribe = function (i, res, res1) {
    res2 = res[i];
    axios.get(url + 'user/getUserInfo?userId=' + res2.subId)
        .then(function (response) {
            res1.push(response.data.data);
        })
        .then(() => {
            if (res.length - 1 === i) {
                for (let i = 0; i < res.length; i++) {
                    let mySubscriber = `
                    <li>
                        <div class="user"><img src="`+ url + res1[i].avatar + `" alt=""></div>
                        <h4>`
                        + res1[i].nickname +
                        `</h4>
                        <p>`
                        + res1[i].introduction +
                        `</p>
                        <button class="btn notAlready">关注</button>
                    </li>
                    `;
                    mySubsribe.innerHTML += mySubscriber;
                }

                // 获取我关注的人 
                axios.get(url + 'user/getMySubscribe?userId=' + isAuserObj.userId)
                    .then(response => {
                        setTimeout(() => {
                            let likeBtn = personalPage.getElementsByClassName('btn');
                            let res3 = response.data.data;  // 这是我关注的
                            // console.log(likeBtn);
                            // console.log(res);  // 这是这个用户关注的  如果一样的话就是以关注
                            for (let i = 0; i < res.length; i++) {
                                for (let j = 0; j < res3.length; j++) {
                                    if (res[i].subId === res3[j].subId) {
                                        likeBtn[i].className = 'btn';
                                        likeBtn[i].innerHTML = '已关注';
                                    }

                                }
                            }
                        }, 500);


                    })
                subscribeOrNot(res);
                // 获取昵称
                let nickname = mySubsribe.getElementsByTagName('h4');
                // console.log(nickname);
                goToOthers(res, nickname);
                return false;
            } else {
                i++;
                allSubscribe(i, res, res1);
            }
        })
}


// 渲染关注用户的页面
let subscribeSomeone = function (id) {
    axios.get(url + 'user/getMySubscribe?userId=' + id)
        .then(function (response) {
            mySubsribe.innerHTML = '';
            subscribeMe.innerHTML = '';
            let res = response.data.data;
            if (res.message === '暂无关注用户') {
                nothingHere[1].style.display = 'block';
            } else {
                nothingHere[1].style.display = 'none';
                let res1 = [];
                allSubscribe(0, res, res1);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

let allSubscribeMe = function (i, res, res1) {
    res2 = res[i];
    axios.get(url + 'user/getUserInfo?userId=' + res2.subId)
        .then(response => {
            res1.push(response.data.data);
        })
        .then(() => {
            if (res.length - 1 === i) {
                for (let i = 0; i < res.length; i++) {
                    let SubscribeMe = `
                    <li>
                        <div class="user"><img src="`+ url + res1[i].avatar + `" alt=""></div>
                        <h4>`
                        + res[i].subName +
                        `</h4>
                        <p>`
                        + res1[i].introduction +
                        `</p>
                        <button class="btn notAlready">关注</button>
                    </li>
                `;
                    subscribeMe.innerHTML += SubscribeMe;
                }
                subscribeOrNot(res);
                let nickname = subscribeMe.getElementsByTagName('h4');
                // console.log(nickname);
                goToOthers(res, nickname);
                return false;
            } else {
                i++;
                allSubscribeMe(i, res, res1);
            }
        })
}
let subscribeMe = personalPage.querySelector('.likeIt .subscribeMe');
// 获取用户的关注者
let someoneSubscribeme = function (id) {
    axios.get(url + 'user/getSubscribeMe?userId=' + id)
        .then(function (response) {
            // 返回subId和subName
            let res = response.data.data;
            mySubsribe.innerHTML = '';
            subscribeMe.innerHTML = '';
            if (res === '暂无人关注') {
                nothingHere[1].style.display = 'block';
            } else {
                nothingHere[1].style.display = 'none';
                let res1 = [];
                allSubscribeMe(0, res, res1);
            }
            return new Promise((resolve, reject) => {
                resolve(res);
            })
        })
        .then(res => {
            // console.log(res);  // 这个关注者是所有关注者的id和name


            // 获取我关注的人
            axios.get(url + 'user/getMySubscribe?userId=' + isAuserObj.userId)
                .then(response => {

                    setTimeout(() => {
                        let likeBtn = personalPage.getElementsByClassName('btn');
                        // console.log(res);  // 关注ta的人
                        // console.log(response.data.data);  // 我关注的人
                        for (let i = 0; i < response.data.data.length; i++) {
                            for (let j = 0; j < res.length; j++) {
                                if (res[j].subId === response.data.data[i].subId) {
                                    likeBtn[j].innerHTML = '已关注';
                                    likeBtn[j].className = 'btn';
                                }
                            }
                        }
                    }, 1000);


                })
        })

        .catch(function (error) {
            console.log(error);
        });
}




// 点击li变色 这里应该可以优化
let allpersonYouLikeUl = personalPage.querySelectorAll('.person-you-like ul');
let clearColor_second = function (items) {
    for (let i = 0; i < items.length; i++) {
        items[i].className = '';
    }
}
function changeColor_second(items) {
    for (let i = 0; i < items.length; i++) {
        items[i].onclick = function () {
            nothingHere[1].style.display = 'block';
            clearColor_second(items);
            mySubsribe.innerHTML = '';
            subscribeMe.innerHTML = '';
            this.className = 'black';
        }
    }
}
changeColor_second(allpersonYouLikeUl[1].children)
changeColor_second(allpersonYouLikeUl[2].children)
changeColor_second(allpersonYouLikeUl[0].children)

let likeClick = function (id) {
    allpersonYouLikeUl[0].children[0].onclick = function () {
        subscribeSomeone(id);
        clearColor_second(allpersonYouLikeUl[0].children);
        allpersonYouLikeUl[0].children[0].className = 'black';
    }
}


let pageSubMe = function (id) {
    allpersonYouLikeUl[0].children[2].onclick = function () {
        someoneSubscribeme(id);
        clearColor_second(allpersonYouLikeUl[0].children);
        allpersonYouLikeUl[0].children[2].className = 'black';
    }
}



