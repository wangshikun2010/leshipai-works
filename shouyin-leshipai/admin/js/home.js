$(function() {
    var ndAlertProMsg = $('#alert-prompt-message'),  // 页面弹出框提示条
        ndPromptMsg = $('#prompt-message'),          // 页面提示条
        ndUsername = $('#username'),                 // 用户名
        ndPassword = $('#password');                 // 密码

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
        setAjax(AdminUrl.loginUrl, {
            'user_id': ndUsername.val(),
            'password': ndPassword.val()
        }, ndPromptMsg, function(respnoseText) {
            ndUsername.val('');
            ndPassword.val('');
            displayMsg(ndPromptMsg, '页面加载中...请稍后...', 30000);
            window.location.replace(AdminUrl.adminUrl);
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
        $('#alert-content').html('你确定要退出门店管理系统吗？');
        displayAlertMessage('#alert-message', '#cancel-alert');

        $('#definite-alert').click(function() {
            setAjax(AdminUrl.logoutUrl, null, ndAlertProMsg, function(respnoseText) {
                layer.close(layerBox);
                displayMsg(ndPromptMsg, '页面加载中...请稍后...', 30000);
                window.location.replace(indexUrl);
            });
        });
    });
    
});