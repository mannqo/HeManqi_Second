// 获取 用户名(0) 和 个人介绍(1) 的输入框
let inputWrap = personalInformation.querySelectorAll('.changeHead .changeHeadWrap');
let inputName = inputWrap[0].getElementsByTagName('input');
let inputIntro = inputWrap[1].getElementsByTagName('input');

let myName = personalPage.querySelector('.personal .detail .userIdName');
let returnPerson = personalInformation.querySelector('.detailMessage ul li');


// 返回个人主页
returnPerson.onclick = () => {
    personalInformation.style.display = 'none';
    personalPage.style.display = 'block';
}



// 查看用户信息（获取头像、昵称、自我介绍）
let personInfor = function (aid) {
    axios.get(url + 'user/getUserInfo', {
        params: {
            userId: aid || isAuserObj.userId || id,
        }
    })
        .then((response) => {
            let avatar = response.data.data.avatar;
            let nickname = response.data.data.nickname;
            let introduction = response.data.data.introduction;

            // 这里把所有头像都改成我的了
            for (let i = 0; i < touXiang.length; i++) {
                touXiang[i].innerHTML = '<img src=' + url + avatar + '>'
            }
            myName.innerHTML = nickname;
            headChange[0].innerHTML = '<input type="text" value="' + nickname + '">'
            headChange[1].innerHTML = '<input type="text" value="' + introduction + '">'

            return new Promise((resolve, reject) => {
                resolve(response);
            })
        })
        .then((response) => {
            // 获取 保护和取消 的div
            let toSave = personalInformation.querySelectorAll('.changeHead .toSave');
            let changeInfor = personalInformation.getElementsByClassName('changeInfor');// 0,3 
            inputName[0].addEventListener('focus', () => {
                console.log(1);
                changeInfor[0].style.display = 'none';
                toSave[0].style.display = 'block';
            })
            // 如果input框的值没有更改就触发，有更改的话不触发失去焦点事件
            inputIntro[0].addEventListener('focus', () => {
                changeInfor[3].style.display = 'none';
                toSave[1].style.display = 'block';
            })


            // 修改用户信息
            let nickname = response.data.data.nickname;
            let introduction = response.data.data.introduction;
            let saveBtn = personalInformation.querySelectorAll('.toSave .save');   // 保存按钮
            let cancelBtn = personalInformation.querySelectorAll('.toSave .cancel');  // 取消按钮
            inputName[0].addEventListener('keyup', function () {
                // 点击保存按钮修改用户信息
                saveBtn[0].onclick = function () {
                    changeInfor[0].style.display = 'block';
                    toSave[0].style.display = 'none';
                    // 修改用户信息  注意这个要传字符串
                    if (inputName[0].value != '' && inputName[0].value !== nickname) {
                        axios.post(url + 'user/changeUserInfo', {
                            userId: isAuserObj.userId,
                            nickname: inputName[0].value,
                            introduction: introduction,
                        })
                            .then(function (response) {
                                // 这里要重新渲染
                                personInfor();
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }

                }
            })
            cancelBtn[0].onclick = function () {
                changeInfor[0].style.display = 'block';
                toSave[0].style.display = 'none';
            }
            cancelBtn[1].onclick = function () {
                changeInfor[3].style.display = 'block';
                toSave[1].style.display = 'none';
            }
            inputIntro[0].addEventListener('keyup', function () {
                // 点击保存按钮修改用户信息
                saveBtn[1].onclick = function () {
                    changeInfor[3].style.display = 'block';
                    toSave[1].style.display = 'none';
                    // 修改用户信息  注意这个要传字符串
                    if (inputIntro[0].value != 0 && inputIntro[0].value != introduction) {
                        axios.post(url + 'user/changeUserInfo', {
                            userId: isAuserObj.userId,
                            nickname: nickname,
                            introduction: inputIntro[0].value,
                        })
                            .then(function (response) {
                                console.log(response.data.data);
                                personInfor();
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }

                }

            })
        })
        .catch(function (error) {
            console.log(error);
        });

}


// 点击 编辑资料 跳转页面
// 获取 个人资料 用户名
let headChange = personalInformation.querySelectorAll('.detailList .changeHead .changeHeadWrap');
let personalTo = personalPage.querySelector('.personal .detail');
// 获取 个人资料 个人介绍
personalBtn.onclick = function () {
    personalPage.style.display = 'none';
    moreList.style.display = 'none';
    personalInformation.style.display = 'block';
    personInfor();
}

personalTo.onclick = () => {
    personalBtn.onclick();
}

document.addEventListener('click', () => {
    moreList.style.display = 'none';
    sendDiv.style.display = 'none';
}, true)
