$(function() {
    var ndPromptMsg = $('#prompt-message');
    var toPage = 'http://192.168.251.50/pay.php?r=Index/TableList';

    // 提交登陆数据
    $('#submit-data').click(function() {
        console.log(login_url);

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
            beforeSend: displayMsg(ndPromptMsg, '正在请求服务器', false),
            success: function(respnoseText) {
                // console.log(respnoseText);
                if (respnoseText.status != 200) {
                    displayMsg(ndPromptMsg, respnoseText.description, 1000);
                    return;
                } else {
                    displayMsg(ndPromptMsg, respnoseText.description, 500, function() {
                        $('#username,#password').val('');
                        window.location.replace(toPage);
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