function sendAJAX(url,data) {
    return new Promise((resolve, reject) => {
        // 1. 创建对象
        const x = new XMLHttpRequest();
        // 2. 初始化
        x.open('GET', url)
        // 3. 发送
        x.send(data);
        // 4. 事件绑定
        x.onreadystatechange = function () {
            if (x.readyState === 4) {
                if (x.status >= 200 && x.status < 300) {
                    resolve(x.response);
                } else {
                    reject(x.status);
                }
            }
        }
    })
}

