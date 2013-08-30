$(function() {
    var ndPromptMsg = $('#prompt-message');

    // 提交登陆数据
    $('#submit-data').click(function() {
        // console.log(login_url);

        $.ajax({
            type: "POST",
            url: login_url,
            ifModified: true,
　　        cache: false,
            data: {
                'waiter_id': $('#username').val(),
                'waiter_pwd': $('#password').val()
            },
            dataType: "json",
            beforeSend: displayMsg(ndPromptMsg, '正在请求服务器', 100),
            success: function(respnoseText) {
                // console.log(respnoseText);
                if (respnoseText.status == 200) {
                    displayMsg(ndPromptMsg, respnoseText.description, 200);
                    return;
                } else {
                    displayMsg(ndPromptMsg, '操作成功', 200, function() {
                        $('#username,#password').val('');
                        window.location.replace('/yintai/shouyin.html');
                    });
                }
            }
        });
    });

    // 重置数据
    $('#reset-data').click(function() {
        $('#username,#password').val('');
    });
    
});