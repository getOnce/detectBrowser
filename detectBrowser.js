;(function() {
    /* 工具类 */
    var includes = function(str, sub){
        return str.indexOf(sub) !== -1;
    }
    /* 功能实现 */
    var UA = navigator.userAgent;
    var userEnv;
    var deviceType;
    var deviceVersion;
    // 判断设备类型
    if (includes(UA, 'iPad') || includes(UA, 'iPhone') || includes(UA, 'iPod')) {
        deviceType = 'ios';

        // 匹配ios版本,ios 9以上支持Universal link
        // var matcher = UA.match('Version/([\\d\\.]+)');
        var matcher = UA.match(/(iPhone|iPod|iPad) os (\d)/i);
        if(matcher && matcher.length === 3){
            deviceVersion = matcher[2];
        }

    } else if (includes(UA, 'Android')) {
        deviceType = 'android';

        // 匹配android版本号
        var matcher = UA.match('Android\\s([\\d\\.]+)');
        if(matcher && matcher.length === 2){
            deviceVersion = matcher[1];
        }

    } else {
        deviceType = 'desktop';
    }

    // 判断设备环境(wechat, weibo)
    if(includes(UA, 'MicroMessenger')){
        userEnv = 'wechat'
    }else if(includes(UA, 'Weibo')){
        userEnv = 'weibo'
    }

    var appDownload = function(option) {

        // ios 9以上支持 universal link
        if(deviceType === 'ios' && deviceVersion >= 9){
            window.location.href = option.universalLink;
        }else{

            // 微信、微博等环境，提示浏览器打开
            if(userEnv){
                typeof option.callbackWechat == 'function' && option.callbackWechat();
            }else{

                // 初始化app探测器
                var appDetect = document.createElement('iframe');
                appDetect.id = 'app-detect';
                appDetect.style = 'display: none';
                appDetect.src = option.scheme;

                // 插入文档流，尝试打开APP
                document.body.appendChild(appDetect);

                // 移除探测器
                appDetect.remove();
                window.setTimeout(function(){
                    // 打开不成功，则跳转下载页
                    window.location.href = option.appDownloadPage;

                }, 2300);
            }

        }
    }
    /* 输出 */

    if(define && define.amd){
        define(function(){
            return appDownload;
        });
    }else if(typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
        module.exports = appDownload;
    }else{
        window.appDownload = appDownload;
    }
}())