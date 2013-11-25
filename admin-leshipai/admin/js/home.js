$(function() {
    var ndUsername = $('#username'),                    // 用户名
        ndPassword = $('#password'),                    // 密码
        ndWaiterName = $('#waiter-name'),               // 员工编号
        ndOldPassword = $('#old-password'),             // 旧密码
        ndNewPassword = $('#new-password'),             // 新密码
        ndAgainPassword = $('#again-password'),         // 重复新密码
        ndPromptMsg = $('#prompt-message'),             // 页面提示条
        ndModifyPwdMsg = $('#midify-password-message'); // 修改密码提示条

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
        setAjax(url.loginUrl, {
            'user_id': ndUsername.val(),
            'password': ndPassword.val()
        }, ndPromptMsg, function(respnoseText) {
            ndUsername.val('');
            ndPassword.val('');
            displayMsg(ndPromptMsg, '页面加载中...请稍后...', 30000);
            window.location.replace(url.adminUrl);
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


    // 修改密码
    $('#modify-password').click(function() {
        $('#midify-content input').val('');

        // 显示修改密码对话框
        displayAlertMessage('#midify-message', '#cancel');

        // 确定修改密码
        $('#definite-modify').click(function() {

            // 验证服务员，密码，新密码
            if ((ndWaiterName.val() == '') || (ndOldPassword.val() == '') || (ndNewPassword.val() == '') || (ndAgainPassword.val() == '')) {
                displayMsg(ndModifyPwdMsg, '用户名或密码不能为空', 2000);
                return;
            }

            if (ndNewPassword.val() !== ndAgainPassword.val()) {
                displayMsg(ndModifyPwdMsg, '两次输入的新密码不一样', 2000);
                return;
            }

            displayMsg(ndModifyPwdMsg, '服务器请求中...请稍候...', false);
            $.ajax({
                type: "POST",
                url: url.modifyPwdUrl,
                data: {
                    'waiter_id': ndWaiterName.val(),
                    'waiter_pwd': ndOldPassword.val(),
                    'pwd_new': ndNewPassword.val(),
                    'pwd_repeat': ndAgainPassword.val()
                },
                ifModified: true,
                dataType: "json",
                timeout: 30000,
                error: function() {
                    displayMsg(ndModifyPwdMsg, '请求服务器失败，请重试！', 2000);
                },
                success: function(respnoseText) {
                    if (respnoseText.status != 200) {
                        displayMsg(ndModifyPwdMsg, '密码修改失败', 2000);
                        return;
                    }

                    displayMsg(ndModifyPwdMsg, '密码修改成功', 500);
                }
            });
        });
    });
    
});