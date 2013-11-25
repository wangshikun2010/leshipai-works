$(function() {
    var ndUsername = $('#username'),                    // 用户名
        ndPassword = $('#password'),                    // 密码
        ndPromptMsg = $('#prompt-message'),             // 页面提示条
        ndAlertPromptMsg = $('#alert-prompt-message');  // 页面弹出提示条

    // 重置数据
    $('#reset-data').click(function() {
        ndUsername.val('');
        ndPassword.val('');
    });

    function submitData() {
        if (ndUsername.val() == '' || ndPassword.val() == '') {
            displayMsg(ndPromptMsg, '用户名或者密码不能为空', 2000);
            return;
        }
        setAjax(PayUrl.loginUrl, {
            'user_id': ndUsername.val(),
            'password': ndPassword.val()
        }, ndPromptMsg, function(respnoseText) {
            ndUsername.val('');
            ndPassword.val('');
            displayMsg(ndPromptMsg, '页面加载中...请稍后...', 30000);
            window.location.replace(PayUrl.tableListUrl);
        });
    }

    // 提交登陆数据
    $('#submit-btn').click(function() {
        submitData();
    });

    $(window).keydown(function(event) {
        if (event.keyCode == 13) {
            submitData();
        }
    });

    // 退出系统
    $('#exit-system').click(function() {
        $('#alert-content').html('你确定要退出收银系统吗');
        displayAlertMessage('#alert-message', '#cancel-alert');

        $('#definite-alert').click(function() {
            setAjax(PayUrl.logoutUrl, null, ndAlertPromptMsg, function(respnoseText) {
                layer.close(layerBox);
                displayMsg(ndPromptMsg, '服务器请求中...请稍候...', 30000);
                window.location.replace(indexUrl);
            });
        });
    });
    
});