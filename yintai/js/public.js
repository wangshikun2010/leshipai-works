var yintai_url = 'http://192.168.251.80/yintai/', //银台系统地址
    admin_url = 'http://192.168.249.75/admin.php?r=Index/Index',	//管理系统地址
    password_url = 'http://192.168.251.80/ajaxURL.php?url=http://192.168.249.10:8083/pay.php?r=Index/Cpwd', //修改密码接口地址
    reboot_url = 'http://192.168.251.80/ajaxURL.php?url=http://192.168.249.10:8083/pay.php?r=Index/ComputerReboot', //重新启动接口地址
    shutdown_url = 'http://192.168.251.80/ajaxURL.php?url=http://192.168.249.10:8083/pay.php?r=Index/ComputerShut'; //关机接口地址

$(function() {
    var layerBox;
    var ndWaiterName = $('#waiter-name'),
        ndOldPassword = $('#old-password'),
        ndNewPassword = $('#new-password'),
        ndAgainPassword = $('#again-password'),
        ndModifyPwdMsg = $('#midify-password-message'),
        ndPromptMsg = $('#prompt-message');

    // 进入收银系统
    $('#system-yintai').click(function() {
        window.location.replace(yintai_url);
    });
    // 进入管理系统
    $('#system-admin').click(function() {
        window.location.replace(admin_url);
    });

    // 显示弹出框
    function displayAlertMessage(dom, closeAlertBtn) {
        layerBox = $.layer({
            type: 1,
            shade: [0.6 , '#000' , true],
            title: ['',false],
            closeBtn: ['',false],
            area: ['0px','0px'],
            page: {
                dom: dom
            }
        });

        $(closeAlertBtn).click(function() {
            layer.close(layerBox);
        });
    }

    // 隐藏加载信息
    function hideLoadingMessage(dom, description, fn) {
        var i = $.layer({
            type: 1,
            shade: [0 , '#000' , true],
            title: ['',false],
            closeBtn: ['',false],
            area: ['0px','0px'],
        });

        $(dom).html(description).show()
                .fadeOut(500, function() {
                    $(this).html('');
                    layer.close(i);
                    if (fn) {
                        fn();
                    }
                });
    }

    // 修改密码
    $('#modify-password').click(function() {
        $('#midify-content input').val('');

        // 显示修改密码对话框
        displayAlertMessage('#midify-message', '#cancel');

        // 确定修改密码
        $('#definite-modify').click(function() {

            // 验证服务员，密码，新密码
            if ((ndNewPassword.val() !== ndAgainPassword.val()) || (ndNewPassword.val() == '') || (ndAgainPassword.val() == '')) {
                hideLoadingMessage(ndModifyPwdMsg, '两次输入的密码不一样');
                return;
            } else if ((ndWaiterName.val() == '') || (ndOldPassword.val() == '')) {
                hideLoadingMessage(ndModifyPwdMsg, '用户名或密码不能为空');
                return;
            }

            $.ajax({
                type: "POST",
                url: password_url,
                ifModified: true,
    　　        cache: false,
                data: {
                    'waiter_id': $('#waiter-name').val(),
                    'waiter_pwd': $('#old-password').val(),
                    'waiter_pwd_new': $('#new-password').val()
                },
                dataType: "json",
                beforeSend: hideLoadingMessage(ndModifyPwdMsg, '页面加载中'),
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    hideLoadingMessage(ndModifyPwdMsg, '请求服务器失败，请重试');
                },
                success: function(respnoseText) {
                    if (respnoseText.status == 200) {
                        hideLoadingMessage(ndModifyPwdMsg, respnoseText.description);
                        return;
                    } else {
                        hideLoadingMessage(ndModifyPwdMsg, '操作成功', function() {
                            layer.close(layerBox);
                        });
                    }
                }
            });

        });
    });

    // 重新启动
    $('#restart').click(function() {
        $('#alert-content').html('你确定要重新启动吗');

        displayAlertMessage('#alert-message', '#cancel-alert');

        $('#definite-alert').click(function() {
            $.ajax({
                type: "POST",
                url: reboot_url,
                ifModified: true,
    　　        cache: false,
                dataType: "json",
                beforeSend: hideLoadingMessage(ndPromptMsg, '正在请求服务器'),
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    hideLoadingMessage(ndPromptMsg, '请求服务器失败，请重试');
                },
                success: function(respnoseText) {
                    if (respnoseText.status == 200) {
                        hideLoadingMessage(ndPromptMsg, respnoseText.description);
                        return;
                    } else {
                        hideLoadingMessage(ndPromptMsg, '操作成功', function() {
                            layer.close(layerBox);
                        });
                    }
                }
            });
        });

    });

    // 关机
    $('#close-system').click(function() {
        $('#alert-content').html('你确定要关机吗');

        displayAlertMessage('#alert-message', '#cancel-alert');

        $('#definite-alert').click(function() {

            $.ajax({
                type: "POST",
                url: shutdown_url,
                ifModified: true,
    　　        cache: false,
                dataType: "json",
                beforeSend: hideLoadingMessage(ndPromptMsg, '正在请求服务器'),
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    hideLoadingMessage(ndPromptMsg, '请求服务器失败，请重试');
                },
                success: function(respnoseText) {
                    if (respnoseText.status == 200) {
                        hideLoadingMessage(ndPromptMsg, respnoseText.description);
                        return;
                    } else {
                        hideLoadingMessage(ndPromptMsg, '操作成功', function() {
                            layer.close(layerBox);
                        });
                    }
                }
            });
        });
    });

});