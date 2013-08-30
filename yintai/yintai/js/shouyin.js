$(function() {
    var ndPromptMsg = $('#prompt-message');

    // resize改变li大小
    $(window).resize(function() {
        setLiSize();
    });

    // 动态加载所有桌台
    $.ajax({
        type: "POST",
        url: table_url,
        ifModified: true,
　　    cache: false,
        dataType: "json",
        // beforeSend: displayMsg(ndPromptMsg, '页面加载中', 100),
        success: function(respnoseText) {
            // console.log(respnoseText);

            // 页面加载失败
            if (respnoseText.status != 200) {
                displayMsg(ndPromptMsg, respnoseText.description, 1000);
                return;
            }

            // 页面加载成功后显示所有桌台
            displayMsg(ndPromptMsg, '页面加载成功', 200, function() {

                for (var i=0; i<respnoseText.data.length; i++) {
                    var li = $('<li id=' + respnoseText.data[i].id + ' data-tab-id=' + respnoseText.data[i].tab_id + '>' + respnoseText.data[i].tab_name + '</li>');

                    switch(respnoseText.data[i].tab_status) {
                        case '1':
                            li.css('background', '#34CB00');
                            break;
                        case '2':
                            li.css('background', '#FFCC00');
                            break;
                        case '3':
                            li.css('background', '#FF0000');
                            break;
                        case '4':
                            li.css('background', '#0099CC');
                            break;
                        case '5':
                            li.css('background', '#B847FF');
                            break;
                    }

                    if (respnoseText.data[i].tab_property == 2) {
                        li.css('background', '#FF5400');
                    }

                    $('#user-list ul').append(li);
                }

                setLiSize();
            });
        }
    });

    // 动态显示点击桌台详细信息
    $('#user-list').delegate('li', 'click', function() {

        // 删除已有数据
        $('#mianunit-data tr').remove();
        $('#replenish-data tr').remove();

        $.ajax({
            type: "POST",
            url: table_message_url,
            data: {
                'tab_id': ($(this).attr('data-tab-id')),
            },
            ifModified: true,
    　　    cache: false,
            dataType: "json",
            timeout: 3000,
            // beforeSend: displayMsg(ndPromptMsg, '页面加载中', 100),
            success: function(respnoseText) {

                // console.log(respnoseText);
                // return;

                // 页面加载失败
                if (respnoseText.status != 200) {
                    displayMsg(ndPromptMsg, respnoseText.description, 1000);
                    return;
                }

                // 页面加载成功
                displayMsg(ndPromptMsg, respnoseText.description, 200, function() {

                    var data = respnoseText.data;
                    // console.log(data);

                    // 填写一个菜信息：名称，单价，实收，折扣，份数，金额
                    for (var i in data.order) {
                        if (i == 0) {

                            // 桌台号
                            $('#table-number').text(data.order[i].tab_id);

                            // 设置主单title信息
                            $('#mianunit-number').text(data.order[i].order_main)
                                                .attr('id', data.order[i].id);
                            $('#mianunit-order-amount').text(data.order[i].sum_price);
                            $('#mianunit-waiter').attr('data-id', data.order[i].waiter_id).text(data.order[i].waiter_name);

                            displayTableData('#mianunit-data');
                        } else if (i == 1) {

                            // 设置补单title信息
                            $('#replenish-number').text(data.order[i].order_main)
                                                .attr('id', data.order[i].id);
                            $('#replenish-order-amount').text(data.order[i].sum_price);
                            $('#replenish-waiter').text(data.order[i].waiter_name).prop('id', data.order[i].waiter_id);

                            displayTableData('#replenish-data');
                        }
                    }

                    function displayTableData(dom) {
                        for (var j in data.order[i].all_menu) {
                            var tr = $('<tr><td class="dishes">' + 
                            data.order[i].all_menu[j].menu_name + 
                            '</td><td>' + data.order[i].all_menu[j].menu_price + 
                            '元</td><td>' + 10 + 
                            '元</td><td>' + data.order[i].all_menu[j].discount + '折</td><td>' + 
                            data.order[i].all_menu[j].menu_count + 
                            '份</td><td>元</td></tr>');

                            // 折扣，金额
                            tr.find('td:eq(3)').text(data.order[i].all_menu[j].menu_price / 10 + '折');
                            tr.find('td:last-child').text(data.order[i].all_menu[j].menu_price * data.order[i].all_menu[j].menu_count + '元');

                            $(dom).append(tr);
                        }
                    }

                    // 默认选中全价，清空输入框和找零值
                    $('#j-discount-amount option:eq(0)').prop('selected','selected');
                    $('#detailed-footer :text').val('');
                    $('#zhaolin').text('');

                    setBillHeight();

                    // 显示账单详情
                    displayAlertMessage('#bill-detailed', '#cancel-checkout');
                    checkoutMoney();

                    // 确定结账
                    $('#checkout').click(function() {
                        // console.log('table-number:' + $('#table-number').text());
                        // console.log('cashier_id:' + $('#mianunit-waiter').attr('data-id'));
                        // console.log('cashier_name:' + $('#mianunit-waiter').text());
                        // console.log('menu_money:' + $('#j-consume-money').text());
                        // console.log('real_money:' + $('#j-integer-money').text());
                        // console.log('discount:' + $('#j-discount-amount option:selected').val());
                        // var zhehouMoney = parseFloat($('#j-integer-money').text()) + parseFloat($('#j-decimal-money').text());
                        // console.log('discount_money:' + zhehouMoney);
                        // console.log('wipe_zero:' + $('#j-decimal-money').text());
                        // console.log('cash:' + $('#cash').val());
                        // console.log('cerd:' + $('#cerd').val());
                        // console.log('member:' + $('#member').val());
                        // console.log('tuan:' + $('#tuan').val());
                        // console.log('vip_ticket:' + $('#vip_ticket').val());
                        // console.log('sign:' + $('#sign').val());
                        // console.log('free:' + $('#free').val());
                        // console.log('vouchers:' + $('#vouchers').val());
                        // console.log('other:' + $('#other').val());
                        // console.log('odd_change:' + $('#odd_change').val());
                        // console.log('order_ids:' + $('#order_ids').val());
                        // console.log('print_id:' + $('#print_id').val());
                        // console.log('create_time:' + $('#create_time').val());

                        $.ajax({
                            type: "POST",
                            url: checkout_url,
                            data: {
                                'tab_number': $('#table-number').text(),
                                'cashier_id': $('#mianunit-waiter').attr('data-id'),
                                'cashier_name': $('#mianunit-waiter').text(),
                                'menu_money': $('#j-consume-money').text(),
                                'real_money': $('#j-integer-money').text(),
                                'discount': $('#j-discount-amount option:selected').val(),
                                'discount_money': zhehouMoney,
                                'wipe_zero': $('#j-decimal-money').text(),
                                'cash': $('#cash').val(),
                                'cerd': $('#cerd').val(),
                                'member': $('#member').val(),
                                'tuan': $('#tuan').val(),
                                'vip_ticket': 0,
                                'sign': 0,
                                'free': 0,
                                'vouchers': $('#vouchers').val(),
                                'other': $('#other').val(),
                                'odd_change': $('#zhaolin').text(),
                                'order_ids': $('#mianunit-number').text(),
                                'print_id': $('#table-number').text(),
                                'create_time': 12
                            },
                            ifModified: true,
                    　　    cache: false,
                            dataType: "json",
                            beforeSend: displayMsg(ndPromptMsg, '页面加载中', 100),
                            success: function(respnoseText) {
                                if (respnoseText.status != 200) {
                                    displayMsg(ndPromptMsg, respnoseText.description, 1000);
                                    return;
                                } else {
                                   displayMsg(ndPromptMsg, respnoseText.description, 200, function() {

                                   });
                                }

                            }
                        });

                    });

                });

            }
        });
    });

    // 计算已送未结金额
    function checkoutMoney() {
        if ($('#mianunit-status').text() == '已送未结') {

            var mianunitData = $('#mianunit-data tr').not('tr:eq(0)');

            var Money = 0,
                rebateMoney = 0;
            for (var i=0; i<mianunitData.length; i++) {

                // 单价，实收，份数
                var univalent = parseInt($(mianunitData[i]).find('td:eq(1)').text());
                var paid = parseFloat($(mianunitData[i]).find('td:eq(2)').text());
                var copies = parseFloat($(mianunitData[i]).find('td:eq(4)').text());
                
                //折后单价
                var paidMoney = univalent * $('#j-discount-amount').find('option:selected').val() / 100;
                if (paidMoney > paid){
                    paidMoney = paid;
                }

                // 消费金额
                Money += univalent * copies;

                // 实收金额+抹零
                rebateMoney += paidMoney * copies;
            }

            $('#j-consume-money').text(Money);
            setTableValue(rebateMoney);
        }
    }

    // 折扣程度变化重新计算消费金额
    $('#j-discount-amount').change(function() {
        checkoutMoney();
        paidMoney();
    });

    // 计算实收价钱
    function paidMoney() {
        var giveMoney = 0;
        for (var i=0; i<$('#detailed-footer :text').length; i++) {
            if ($($('#detailed-footer :text')[i]).val() != '') {
                giveMoney += parseInt($($('#detailed-footer :text')[i]).val());
            }
        }
        
        var returnMoney = (giveMoney - $('#j-integer-money').text()).toFixed(2);
        $('#zhaolin').text(returnMoney);
    }

    // 输入框输入值重新计算实收价钱
    $('#detailed-footer').delegate(':text', 'keyup', function() {
        console.log($(this).val());
        if (!(/[0-9]/.test($(this).val()))) {
            $(this).val('');
        }
        paidMoney();
    });

    // 计算抹零金额，实收金额
    function setTableValue(rebateMoney) {
        var integer = Math.floor(rebateMoney);
        var flt = (rebateMoney - integer).toFixed(2);
        // console.log(rebateMoney,integer);
        $('#j-decimal-money').text(flt);
        $('#j-integer-money').text(integer);
    }

    // 按照不同屏幕同比例计算li大小
    function setLiSize() {
        var liWdith = ($(window).width() - 
            parseInt($('#user-list').css('margin-left')) - 30) / 10 - 
            parseInt($('#table li').css('margin-left')) - 
            parseInt($('#table li').css('margin-right'));
        var liHeight = liWdith * 3/5;

        var userListHeight = ($(window).height() - 
            parseInt($('#banner').height()) - 
            parseInt($('#footer').height()) -
            parseInt($('#user-list').css('margin-top')) - 
            parseInt($('#user-list').css('margin-bottom')));

        $('#table li').width(liWdith + 'px');
        $('#table li').height(liHeight + 'px');
        $('#table li').css('line-height', liHeight + 'px');
        $('#user-list').height(userListHeight + 'px');
    }

    // 设置账单内容高度
    function setBillHeight() {
        $('#bill-detailed').height($(window).height());
        var detailedContentHeight = $(window).height() - $('#detailed-title').height() - $('#detailed-footer').height();
        $('#detailed-content').height(detailedContentHeight - 20 + 'px');        
    }

});