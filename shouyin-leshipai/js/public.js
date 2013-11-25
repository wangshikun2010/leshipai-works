var layerBox;       // 弹出框
var layerStrip;     // 弹出条

var indexUrl       = 'http://yintai.leshipai.com';                             // 系统首页地址
var IndexUrl = {
    yintaiUrl: indexUrl + '/pay.php?r=Index/Login',                            // 银台系统地址
    passwordUrl: indexUrl + '/pay.php?r=Index/Cpwd',                           // 修改密码接口地址
    rebootUrl: indexUrl + '/pay.php?r=Index/ComputerReboot',                   // 重新启动接口地址
    shutdownUrl: indexUrl + '/pay.php?r=Index/ComputerShut'                    // 关机接口地址
}

var PayUrl = {
    tableListUrl: indexUrl + '/pay.php?r=Index/TableList',                     // 银台桌面页地址
    loginUrl: indexUrl + '/pay.php?r=Login/Index',                             // 登录接口地址
    logoutUrl: indexUrl + '/pay.php?r=Index/LogOut',                           // 退出接口地址
    tableUrl: indexUrl + '/pay.php?r=Table/Index',                             // 桌台页面地址
    tableMessageUrl: indexUrl + '/pay.php?r=Table/Order',                      // 读取桌台订单信息接口地址
    checkoutUrl: indexUrl + '/pay.php?r=Checkout/Index',                       // 结账接口地址
    getCheckoutDataUrl: indexUrl + '/pay.php?r=Table/OrderPay',                // 获取结账数据接口地址
    openMoneyBoxUrl: indexUrl + '/pay.php?r=Checkout/Openbox',                 // 打开钱箱接口地址
    clearUrl: indexUrl + '/pay.php?r=QingJi/Index',                            // 日结清机接口地址
    handoverUrl: indexUrl + '/pay.php?r=JiaoBan/Index',                        // 交班对账接口地址
    rePrintUrl: indexUrl + '/pay.php?r=RePrint/Index'                          // 重打账单接口地址    
}

var AdminUrl = {
    adminUrl: indexUrl + '/admin.php?r=Admin/Index',                           // 管理系统地址
    loginUrl: indexUrl + '/admin.php?r=Index/Login',                           // 登录接口地址
    logoutUrl: indexUrl + '/admin.php?r=Index/Logout',                         // 退出登录接口地址

    indexInfoUrl: indexUrl + '/admin.php?r=Admin/Info',                        // 门店管理系统信息显示接口地址 
    printShowUrl: indexUrl + '/admin.php?r=Print/Show',                        // 打印显示接口地址
    printSetupUrl: indexUrl + '/admin.php?r=Print/Setup',                      // 打印保持接口地址
    menuShowUrl: indexUrl + '/admin.php?r=Menu/Show',                          // 菜品估清显示接口地址
    menuSetupUrl: indexUrl + '/admin.php?r=Menu/Setup',                        // 菜品估清保存接口地址
    menuSaleShowUrl: indexUrl + '/admin.php?r=Menu/SaleShow'                   // 菜品销售显示接口地址
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
        displayMsg(dialog, '服务器请求中...请稍候...', false);
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
            displayMsg(dialog, '请求服务器失败，请重试！', 2000);
        },
        success: function(respnoseText) {
            if (respnoseText.status == 508) {
                displayMsg(dialog, respnoseText.description, 2000, function() {
                    window.location.replace(IndexUrl.yintaiUrl);
                });
            }

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