var layerBox;       // 弹出框
var layerStrip;     // 弹出条
var indexUrl = 'http://192.168.249.112/yintai.php?r='; //主链接

var url = {
    logpageUrl: indexUrl + 'Index/Index',           // 登录页面地址
    adminUrl: indexUrl + 'Admin/Index',             // 管理系统地址
    loginUrl: indexUrl + 'Index/Login',             // 登录接口地址
    logoutUrl: indexUrl + 'Index/Logout',           // 退出登录接口地址
    modifyPwdUrl: indexUrl + 'Index/Cpwd'           // 修改密码接口地址
}

// 显示弹出框
function displayAlertMessage(dom, closeAlertBtn) {
    layerBox = $.layer({
        type: 1,
        shade: [0.6 , '#000' , true],
        title: false,
        closeBtn: false,
        area: ['0px','0px'],
        page: {
            dom: dom
        }
    });

    $(closeAlertBtn).click(function() {
        layer.close(layerBox);
    });
}

// 显示提示消息
function displayMsg(dom, description, time, fn) {
    if (layerStrip){
        layer.close(layerStrip);
        layerStrip = false;
    }

    layerStrip = $.layer({
        type: 1,
        shade: [0 , '#000' , true],
        title: false,
        closeBtn: false,
        area: ['0px','0px'],
    });

    $(dom).html(description).show();
    if (time !== false) {
        $(dom).fadeOut(time, function() {
            $(this).html('');
            layer.close(layerStrip);
            layerStrip = false;

            if (fn) {
                fn();
            }
        });
    }
}

//status 0：前后都不显示  1：只在请求前显示  2：只在成功后显示  undefined：前后都显示 
function setAjax(url, data, dialog, successFn, status) {
    if (status == 1 || typeof(status) == 'undefined') {
        displayMsg(dialog, '数据加载中...请稍候...', false);
    }
    
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        ifModified: true,
        cache: true,
        dataType: "json",
        timeout: 30000,
        error: function() {
            displayMsg(dialog, '数据加载失败，请重试！', 2000);
        },
        success: function(respnoseText) {
            if (status != 0) {
                if (respnoseText.status != 200) {
                    displayMsg(dialog, respnoseText.description, 2000);
                    return;
                }
            }

            if (status == 2 || typeof(status) == 'undefined') {
                displayMsg(dialog, respnoseText.description, 500, function() {
                    successFn(respnoseText);
                });
            } else {
                displayMsg(dialog, '', 0, function() {
                    successFn(respnoseText);
                });
            }

        }
    });
}

function arrayToJson(o) {
    var r = [];
    if (typeof o == "string") return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    if (typeof o == "object") {
        if (!o.sort) {
            for (var i in o)
            r.push(i + ":" + arrayToJson(o[i]));
            if ( !! document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString());
            }
            r = "{" + r.join() + "}";
        } else {
            for (var i = 0; i < o.length; i++) {
                r.push(arrayToJson(o[i]));
            }
            r = "[" + r.join() + "]";
        }
        return r;
    }
    return o.toString();
}