var layerBox;
var index_url = 'http://yintai.leshipai.com',	//系统首页地址
    login_url = 'http://192.168.251.80/ajaxURL.php?url=http://192.168.249.10:8083/pay.php?r=Login/Index', //登录接口地址
    logout_url = 'http://192.168.251.80/ajaxURL.php?url=http://192.168.249.10:8083/pay.php?r=Index/LogOut', //退出接口地址
    table_url = 'http://192.168.251.80/ajaxURL.php?url=http://192.168.249.10:8083/pay.php?r=Table/Index', //桌台读取接口地址
    openMoney_box_url = 'http://192.168.251.80/ajaxURL.php?url=http://192.168.249.10:8083/pay.php?r=JiaoBan/Index', //打开钱箱接口地址
    table_message_url = 'http://192.168.251.80/ajaxURL.php?url=http://192.168.249.10:8083/pay.php?r=Order/Index', //读取桌台订单信息接口地址
    checkout_url = 'http://192.168.251.80/ajaxURL.php?url=http://192.168.249.10:8083/pay.php?r=Checkout/Index', //结账接口地址
    rePrint_url = 'http://192.168.251.80/ajaxURL.php?url=http://192.168.249.10:8082/pay.php?r=RePrint/Index', //打印账单接口地址
    clear_url = 'http://192.168.251.80/ajaxURL.php?url=http://192.168.249.10:8082/pay.php?r=QingJi/Index', //日结清机接口地址
    handover_url = 'http://192.168.251.80/ajaxURL.php?url=http://192.168.249.10:8083/pay.php?r=JiaoBan/Index'; //交班对账接口地址

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
function displayMsg(dom, description, time, fn) {
    var i = $.layer({
        type: 1,
        shade: [0 , '#000' , true],
        title: ['',false],
        closeBtn: ['',false],
        area: ['0px','0px'],
    });

    $(dom).html(description).show()
            .fadeOut(time, function() {
                $(this).html('');
                layer.close(i);
                if (fn) {
                    fn();
                }
            });
}

$(function() {

    var ndAlertProMsg = $('#alert-prompt-message');
    var ndPromptMsg = $('#prompt-message');
    var ndLoginProMsg = $('#logoin-prompt-message');
    var ndClearProMsg = $('#clear-prompt-message');

    $('#refersh').click(function() {
        window.location.replace('http://yintai.leshipai.com');
    });

    // 退出系统
    $('#exit-system').click(function() {
        $('#alert-content').html('你确定要退出系统吗');

        displayAlertMessage('#alert-message', '#cancel-alert');

        $('#definite-alert').click(function() {

            $.ajax({
                type: "POST",
                url: logout_url,
                ifModified: true,
    　　        cache: false,
                dataType: "json",
                beforeSend: displayMsg(ndAlertProMsg, '正在请求服务器', 100),
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    displayMsg(ndAlertProMsg, '请求服务器失败，请重试', 100);
                },
                success: function(respnoseText) {
                    // console.log(respnoseText);
                    if (respnoseText.status == 200) {
                        displayMsg(ndAlertProMsg, respnoseText.description, 200);
                        return;
                    } else {
                        displayMsg(ndAlertProMsg, '操作成功', 200, function() {
                            layer.close(layerBox);
                            window.location.replace(index_url);
                        });
                    }
                }
            });
        });
    });

    // 打开钱箱
    $('#open-money-box').click(function() {

      $.ajax({
            type: "POST",
            url: logout_url,
            ifModified: true,
　　        cache: false,
            dataType: "json",
            beforeSend: displayMsg(ndPromptMsg, '正在请求服务器', 100),
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                displayMsg(ndPromptMsg, '请求服务器失败，请重试', 100);
            },
            success: function(respnoseText) {
                // console.log(respnoseText);
                if (respnoseText.status == 200) {
                    displayMsg(ndPromptMsg, respnoseText.description, 2000);
                    return;
                } else {
                    displayMsg(ndPromptMsg, '钱箱打开成功', 2000, function() {
                    });
                }
            }
        });
    });

    // 交班对账
    $('#handover').click(function() {
        // displayAlertMessage('#logoin-message', '#cancel-logoin');

         // 点击登陆
        // $('#definite-logoin').click(function() {
        //     layer.close(layerBox);
            displayAlertMessage('#bill-message', '#cancel-bill');
        // });
    });

    // 日结清机
    $('#cleaner').click(function() {

        // 显示登陆框
        displayAlertMessage('#logoin-message', '#cancel-logoin');

        // 点击登陆
        $('#definite-logoin').click(function() {

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
                // beforeSend: displayMsg(ndLoginProMsg, '正在请求服务器', 100),
                success: function(respnoseText) {
                    // console.log(respnoseText);
                    if (respnoseText.status == 200) {
                        displayMsg(ndLoginProMsg, respnoseText.description, 1000);
                        return;
                    } else {
                        displayMsg(ndLoginProMsg, '操作成功', 200, function() {
                            layer.close(layerBox);

                            $.ajax({
                                type: "POST",
                                url: clear_url,
                                ifModified: true,
                    　　        cache: false,
                                dataType: "json",
                                // beforeSend: displayMsg(ndPromptMsg, '页面加载中', 100),
                                success: function(respnoseText) {
                                    // var data = respnoseText.data;

                                    console.log(respnoseText);
                                    // console.log(respnoseText.data);

                                    if (respnoseText.status == 200) {
                                        displayMsg(ndPromptMsg, respnoseText.description, 1000);
                                        return;
                                    } else {
                                        var data = {"check_date":"2003-06-23","create_time":"22:23:59","cashier_id":"5","manager_id":"1","cashier_name":"Tracy","manager_name":"T-Mac","sum_order_main":"2","sum_order_add":"1","pay_id_start":"123","pay_id_end":"456","sum_person":"5","sum_dishes":"5","sum_menu_money":"1234","sum_real_money":"1222","sum_true_money":"1221","sum_wipe_zero":"122","sum_cash":"123123","sum_cerd":"1231213","sum_member":"12","sum_tuan":"11","sum_vip_ticket":"15","sum_sign":"2","sum_free":"3","sum_vouchers":"4","sum_other":"dfsdfsd"};

                                        displayMsg(ndPromptMsg, '页面加载成功', 200, function() {
                                         
                                            // 经理姓名，员工姓名，开始时间， 结束时间
                                            $('#qj-person-id').prop('data-id', data.manager_id).text(data.manager_name);
                                            $('#qj-person-name').prop('data-id', data.cashier_id).text(data.cashier_name);
                                            $('#qj-start-time').text(data.create_time);
                                            $('#qj-end-time').text(data.check_date);

                                            // 总单数，主单数，补单数
                                            $('#qj-total-singular').text(data.sum_order_main + data.sum_order_add);
                                            $('#qj-mian-singular').text(data.sum_order_main);
                                            $('#qj-add-singular').text(data.sum_order_add);

                                            // 平均每桌人数，消费菜品总量，消费金额
                                            $('#qj-people-count').text(data.sum_person);
                                            $('#qj-dish-count').text(data.sum_dishes);
                                            $('#qj-table-money').text(data.sum_menu_money);

                                            // 总人数，总金额，人均消费，折扣金额，应收金额
                                            $('#qj-total-person').text(data.sum_person);
                                            $('#qj-total-amount').text(data.sum_menu_money);
                                            $('#qj-people-money').text();
                                            $('#qj-discount-amount').text(data.sum_true_money);
                                            $('#qj-receive-amount').text(data.sum_real_money);

                                            // 现金，银行卡，会员储值卡，团购券，其他卡
                                            $('#qj-cash').text(data.sum_cash);
                                            $('#qj-cerd').text(data.sum_cerd);
                                            $('#qj-vip').text(data.sum_member);
                                            $('#qj-tuan').text(data.sum_tuan);
                                            $('#qj-other').text(data.sum_other);

                                            // 电子贵宾券，电子抵用券，免单，签单
                                            $('#qj-vip-ticket').text(data.sum_vip_ticket);
                                            $('#qj-arrived').text(data.sum_vouchers);
                                            $('#qj-free-single').text(data.sum_free);
                                            $('#qj-single').text(data.sum_sign);

                                            displayAlertMessage('#clear-message', '#cancel-clear');

                                            $('#cancel-clear').click(function() {
                                                window.location.replace(index_url);
                                            });

                                            // 重打账单
                                            $('#print-clear').click(function() {
                                                console.log(ndClearProMsg[0]);
                                                console.log(rePrint_url);
                                                $.ajax({
                                                    type: "POST",
                                                    url: rePrint_url,
                                                    ifModified: true,
                                            　　    cache: false,
                                                    data: {
                                                        'print_id': 1
                                                    },
                                                    dataType: "json",
                                                    beforeSend: displayMsg(ndClearProMsg, '正在请求服务器', 2000),
                                                    success: function(respnoseText) {
                                                        console.log(respnoseText);
                                                        if (respnoseText.status == 200) {
                                                            displayMsg(ndClearProMsg, respnoseText.description, 1000);
                                                            return;
                                                        } else {
                                                            displayMsg(ndClearProMsg, '操作成功', 3000, function() {
                                                                layer.close(layerBox);
                                                            });
                                                        }
                                                    }
                                                });
                                            });
                                        });
                                    }
                                }
                            });
                        });
                    }
                }
            });
        });
    });

});