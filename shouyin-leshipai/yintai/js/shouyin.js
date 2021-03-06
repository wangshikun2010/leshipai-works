$(function() {
    var ndPromptMsg = $('#prompt-message'),             // 页面提示条
        ndBillProMsg = $('#bill-prompt-message'),       // 账单详情弹出框提示条
        ndAlertPromptMsg = $('#alert-prompt-message'),  // 弹出框信息提示条
        ndLoginProMsg = $('#logoin-prompt-message'),    // 登陆框信息提示条
        ndJiaobanProMsg = $('#jiaoban-prompt-message'), // 交班信息提示条
        ndClearProMsg = $('#clear-prompt-messag'),      // 清机信息提示条

        allInput = $('#tuangou, #vip, #vouchers, #cash, #cerd, #member, #other'),       // 账单详情所有输入框
        notTuanInput = $('#vip, #vouchers, #cash, #cerd, #other'),                      // 账单详情非团购输入框

        isSuccess,                  // 页面加载是否成功
        historyBackMoney,           // 历史可返赠金额总和
        historyAlreadyBackMoney,    // 历史已返赠金额总和
        withVouchers,               // 是否允许用抵用券, 默认可以使用抵用券
        withPower,                  // 是否需要授权, 默认不需要特殊授权
        timeID,                     // 超时时间id
        discountPro = [],           // 所有订单的折扣方案，已去重
        discountProgram = [],       // 所有订单的折扣方案，未去重
        unitData,                   // 订单详情数据
        discountSetData,            // 方案数据        
        backSetData,                // 返赠菜品数据
        notProgram,                 // 不能用的折扣方案和返赠方案
        checkedSale,                // 已选方案数据
        checkedBackMenu;            // 已选返赠菜品

    // 默认消费金额，实收金额，团购金额，套餐金额都为0, 没有签单，没有免单
    var Money = 0, rebateMoney = 0, tuangouMoney = 0, taocanMoney = 0, free = 0, qian = 0;

    var orderMain,                  // 主单号
        yijieArray,                 // 已结订单号
        weijieArray,                // 未结订单号
        backPro;                    // 符合条件返赠方案

    var TableStatus = {
        emptyTable: '#31CC00',      // 空台
        beenSent: '#FF0000',        // 已送
        beenCheckout: '#006CB7',    // 已结
        delivery: '#920583'         // 外卖
    }

    // 获取DOM节点
    var ndTableList = $('#user-list'),              // 用户列表
        ndCash = $('#cash'),                        // 现金
        ndCerd = $('#cerd'),                        // 银行卡
        ndConsumeMoney = $('#j-consume-money'),     // 消费金额
        ndDecimalMoney = $('#j-decimal-money'),     // 抹零金额
        ndIntegerMoney = $('#j-integer-money'),     // 实收金额
        ndDiscountMoney = $('#j-discount-money'),   // 折扣金额
        ndZhaolin = $('#zhaolin'),                  // 找零
        ndTablePayId = $('#table-payid');           // 结账单号

    // 窗口大小变化改变li大小
    $(window).resize(function() {
        setLiSize();
    });

    // 动态加载所有桌台，并间隔调用，第一次加载失败显示，非第一次加载成功或失败不显示
    setAllTable(1);
    timeID = setTimeout(function() {
        if (isSuccess) {
            setAllTable(0);
            setTimeout(arguments.callee, 6000);
        }
    }, 6000);

    // 点击桌台显示详细信息
    ndTableList.delegate('li', 'click', function() {
        var liElement = $(this);                            // 当前被点击桌台
        var liId = liElement.attr('data-tab-id');           // 当前被点击桌台id
        $('#menulist ul li').remove();                      // 删除已有菜单数据
      
        // 空桌台不能被点击
        if (liElement.attr('data-tab-status') == 'empty' || liElement.attr('data-tab-status') == 'delivery') {
            return;
        }

        setAjax(PayUrl.tableMessageUrl, {
            'tab_id': liId
        }, ndPromptMsg, function(respnoseText) {
            yijieArray = [], weijieArray = [],              // 已结，未结订单号数组
            isHasYiSongWeiJie = false,                      // 是否有未结订单
            weijieContent = [];                             // 未结订单，用于计算

            // 禁用折扣，返赠选择，并清空内容
            $('#detailed-footer select').prop('disabled', true).html('');
            $('#j-histoty-money').text('享美食 乐生活');

            // 输入框禁用，找零为0
            allInput.prop('disabled', true).val('').addClass('disabled');
            ndZhaolin.text(0);
			
            // 主单，补单状态清空
            $('#menulist ul li .menulist-status').text('');
            // 消费金额，抹零金额，实收金额清空
            $('#j-consume-money, #j-decimal-money, #j-integer-money').text('');

            unitData = respnoseText.data.order.data;                                // 订单详情数据
            discountSetData = respnoseText.data.you.youall;                         // 方案数据
            backSetData = respnoseText.data.you.giveall;                            // 返赠菜品数据
            notProgram = respnoseText.data.you.now.no_sale;                         // 不能用的折扣方案和返赠方案
            checkedSale = respnoseText.data.you.rightNowSale;                       // 已选方案数据
            checkedBackMenu = respnoseText.data.you.rightNowGive;                   // 已选返赠菜品
            historyBackMoney = respnoseText.data.you.now.give_money;                // 历史可返赠金额总和
            historyAlreadyBackMoney = respnoseText.data.you.now.pay_give_money;     // 历史已返赠金额总和
           
            // 写入菜单信息：名称，份数，单价，金额，折扣，实收
            for (var i in unitData) {
                //暂存订单跳过
                if ( unitData[i].order_is_temp == 1) {
                    continue;
                }

                // 桌台号，打印id
                $('#table-number').text(unitData[i].tab_name).attr('data-id', unitData[i].tab_id);
                var dataId = unitData[i].pay_id;

                // 动态创建一个单
                var li = $('<li>' +
                                '<h1 class="menulist-title">' +
                                    '<p class="number"><span class="table-status"></span><span class="menulist-number" data-id=' + unitData[i].id + '>' + unitData[i].order_id + '</span></p>' + 
                                    '<p class="order-amount">金额：<span class="menulist-order-amount">' + unitData[i].sum_price +'</span></p>' +
                                    '<p class="waiter"><span class="menulist-waiter" data-id=' + unitData[i].waiter_id + '>' + unitData[i].waiter_name + '</span></p>' +
                                    '<p class="status"><span class="menulist-payid"></span><span class="menulist-status"></span></p>' +
                                '</h1>' + 
                                '<table class="menulist-head" border="0" cellspacing="0" cellpadding="0">' + 
                                    '<tr><th class="dishes">菜品名称</th><th>数量</th><th>单价</th><th>金额</th><th>折扣</th><th>实收</th></tr>' +
                                '</table>' +
                                '<table class="menulist-data" border="0" cellspacing="0" cellpadding="0">' +
                                '</table>' +
                            '</li>');
                orderMain = unitData[i].order_main;

                // 创建主单
                if (unitData[i].order_ismain == 1) {
                    li.find('.table-status').text('主单：');

                    // 主单为已送未结
                    if (unitData[i].order_status == 2) {
                        isHasYiSongWeiJie = true;
                        li.find('.menulist-status').append('已送未结');
                        li.find('.menulist-payid').text('');
                        li.find('.menulist-title').removeClass('gray').addClass('red');
                        li.find('.menulist-head, .menulist-data').removeClass('gray-font').addClass('red-font');
                        
                        // 已送未结主单号
                        weijieArray.push(li.find('.menulist-number').text());
                        weijieContent.push(li.find('.menulist-payid'));
                    } else {
                        li.find('.menulist-status').append('已送已结');
                        if (unitData[i].pay_id !== '') {
                            li.find('.menulist-payid').text('(结账单:' + unitData[i].pay_id + ')');
                        }
                        li.find('.menulist-title').addClass('gray');
                        li.find('.menulist-head, .menulist-data').addClass('gray-font');

                        // 已送已结主单号
                        yijieArray.push(li.find('.menulist-number').text());
                    }
                } else {
                    li.find('.table-status').text('补单：');

                    // 补单为已送未结
                    if (unitData[i].order_status == 2) {
                        isHasYiSongWeiJie = true;
                        li.find('.menulist-status').append('已送未结');
                        li.find('.menulist-payid').text('');
                        li.find('.menulist-title').addClass('yellow');
                        li.find('.menulist-head, .menulist-data').addClass('red-font');

                        // 已送未结补单号
                        weijieArray.push(li.find('.menulist-number').text());
                        weijieContent.push(li.find('.menulist-payid'));
                    } else {
                        li.find('.menulist-status').append('已送已结');
                        if (unitData[i].pay_id !== '') {
                            li.find('.menulist-payid').text('(结账单:' + unitData[i].pay_id + ')');
                        }
                        li.find('.menulist-title').addClass('gray');
                        li.find('.menulist-head, .menulist-data').addClass('gray-font');

                        // 已送已结补单号
                        yijieArray.push(li.find('.menulist-number').text());
                    }
                }

                for (var j in unitData[i].all_menu) {
                    var menuTrueDiscount = 100;
                    if (unitData[i].order_status != 2) {
                        menuTrueDiscount = unitData[i].all_menu[j].menu_discount;
                    }
                    var tr = $('<tr id="menu_'+ i + '_' + j +'">'+
                                '<td class="dishes">' + unitData[i].all_menu[j].menu_name + '</td>' +
                                '<td>' + parseFloat(unitData[i].all_menu[j].menu_count).toFixed(1) + '份</td>' +
                                '<td>' + parseFloat(unitData[i].all_menu[j].menu_price).toFixed(2) + '元</td>' +
                                '<td>' + parseFloat(unitData[i].all_menu[j].menu_count * unitData[i].all_menu[j].menu_price).toFixed(2) + '元</td>'+
                                '<td>' + menuTrueDiscount + '%</td>' +
                                '<td>' + parseFloat(unitData[i].all_menu[j].menu_count * unitData[i].all_menu[j].menu_price * menuTrueDiscount / 100).toFixed(2) + '元</td>' +
                               '</tr>');
                    li.find('.menulist-data').append(tr);
                }

                $('#menulist ul').append(li);
            }
            
            // 全部已结
            if (isHasYiSongWeiJie == false) {
                nocheckoutOrder(arrayToJson(yijieArray), liId, dataId);
            } else {
                // 添加可返赠菜品
                var backSet = '';
                if (backSetData != '') {
                    for (var i in backSetData) {
                        backSet += '<option id="'+ backSetData[i].menu_no +'">'+ backSetData[i].menu_name +'</option>';
                    }
                }
                $('#set-back').html(backSet);

                // 折扣方案和返赠方案选择
                $('#discount-right').unbind('click').bind('click', function() {
                    selectProgram($('#set-discount option:selected').attr('id'), '+');
                });

                $('#discount-left').unbind('click').bind('click', function() {
                    selectProgram($('#show-discount option:selected').attr('id'), '-');
                });

                $('#back-right').unbind('click').bind('click', function() {
                    var newOption = $('#set-back option:selected').clone();
                    $('#show-back').append(newOption);
                });

                $('#back-left').unbind('click').bind('click', function() {
                    $('#show-back option:selected').remove();
                });

                // 显示结账，隐藏重打
                $('#checkout').show().next('#already-checkout').hide();

                // 清空结账单号，折扣、返赠可用
                ndTablePayId.text('');
                $('#set-discount, #show-discount, #set-back, #show-back').prop('disabled', false).css('color', '#810706');

                // 选择方案计算金额
                selectProgram(null, null);

                // 未结账订单时页面初始化
                checkoutOrder();
            }

            // 设置账单高度
            setBillHeight();
            // 显示账单详情弹出框
            displayAlertMessage('#bill-detailed', '#cancel-checkout');
        }, 1);
    });

    function selectProgram(checkProgram, runMode) {
        discountProgram = [];
        Money = 0, rebateMoney = 0, tuangouMoney = 0, taocanMoney = 0, moling = 0, free = 0, qian = 0;

        // 获取全部自动折扣方案和已选手动折扣方案
        var allDiscount = getProgram(1, checkProgram, runMode);
        // 遍历每个菜品的折扣方案
        for (var i in unitData) {
            if (unitData[i].order_status == 2 && unitData[i].order_is_temp == 2) {
                // 根据每个订单的订单时间过滤折扣方案
                var orderDiscount = checkSaleTime(allDiscount, unitData[i].order_datetime, notProgram);
                // 折扣方案与折扣方案做必存校验
                orderDiscount = checkSaleAllow(orderDiscount, orderDiscount, 'sale_allow');
                if (orderDiscount === false) {
                    return;
                }
                // 免单或签单
                for (var j in orderDiscount) {
                    if (orderDiscount[j].sale_name == '免单') {
                        free = 1;
                    } else if (orderDiscount[j].sale_name == '签单') {
                        qian = 1;
                    }
                }
                discountProgram[i] = orderDiscount;
            }
        }

        // 遍历每个菜品的折扣方案
        for (var i in unitData) {
            if (unitData[i].order_status == 2 && unitData[i].order_is_temp == 2) {

                // 用每个菜遍历所有折扣方案，如果菜的menu_no在折扣方案的折扣菜品中出现过，就使用当前方案的折扣额度，进行下一个菜
                for (var j=0; j<unitData[i].all_menu.length; j++) {
                    unitData[i].all_menu[j].menu_discount = 100;

                    if (unitData[i].all_menu[j].menu_is_discount == 1 || free == 1 || qian == 1) {
                        for (var k=0; k<discountProgram[i].length; k++) {
                            if (
                                contains(discountProgram[i][k].sale_menu_type, unitData[i].all_menu[j].menu_type_id) == true || 
                                contains(discountProgram[i][k].sale_menu_no, unitData[i].all_menu[j].menu_no) == true
                            ) {
                                unitData[i].all_menu[j].menu_discount = discountProgram[i][k].sale_discount;
                                break;
                            }
                        }
                    }

                    $('#menu_' + i + '_' + j).find('td:eq(4)').text(unitData[i].all_menu[j].menu_discount + '%');

                    // 计算消费金额
                    var menuMoney = unitData[i].all_menu[j].menu_price * unitData[i].all_menu[j].menu_count;
                    Money += menuMoney;
                    // 计算折后金额
                    rebateMoney = Number(rebateMoney) + Number(menuMoney * unitData[i].all_menu[j].menu_discount / 100);
                    if(!isNaN(parseFloat(rebateMoney))) {
                        rebateMoney = rebateMoney.toFixed(2);
                    }
                    $('#menu_' + i + '_' + j).find('td:eq(5)').text(parseFloat(menuMoney * unitData[i].all_menu[j].menu_discount / 100).toFixed(2) + '元');

                    // 计算非签单或者非免单时，团购和套餐的价钱
                    if (free == 0 && qian == 0) {
                        if (unitData[i].all_menu[j].menu_type == '团购') {
                            tuangouMoney += menuMoney;
                        } else if (unitData[i].all_menu[j].menu_type == '套餐') {
                            taocanMoney += menuMoney;
                        }
                    }
                }
            }
        }

        // 去除重复的折扣方案
        discountPro = distinctArray(discountProgram);

        // 获取全部自动返赠方案和已选手动返赠方案
        var allTrueback = getProgram(2, checkProgram, runMode);
        // 以当前时间为准过滤返赠方案
        var date = new Date();
        var nowDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        backPro = checkSaleTime(allTrueback, nowDate, notProgram);
        // 折扣方案与返赠方案比
        backPro = checkSaleAllow(discountPro, backPro, 'give_allow');
        if (backPro === false) {
            return;
        }

        var leftDiscount = writeProgarm(discountSetData[1], discountPro);
        var leftBack = writeProgarm(discountSetData[2], backPro);

        $('#set-discount, #show-discount').html('');
        displayProgram(leftDiscount, '#set-discount');
        displayProgram(leftBack, '#set-discount');
        displayProgram(discountPro, '#show-discount');
        displayProgram(backPro, '#show-discount');

        //校验方案增减操作，提示操作结果
        var checkRun = 0;
        for (var i in discountPro) {
            if (discountPro[i].id == checkProgram) {
                checkRun = 1;
            }
        }
        for (var i in backPro) {
            if (backPro[i].id == checkProgram) {
                checkRun = 1;
            }
        }
        if (runMode == '+' && checkRun == 0) {
            displayMsg(ndBillProMsg, '该方案不在有效期、或与已选方案冲突，添加失败！', 2000);
        } else if (runMode == '-' && checkRun == 1) {
            displayMsg(ndBillProMsg, '自动方案，不允许删除！', 2000);
        }

         // 免单签单不允许输入
        if (free == 1 || qian == 1) {
            allInput.attr('disabled', true).val('').addClass('disabled');
        } else {
            allInput.attr('disabled', false).val('').removeClass('disabled');
        }

        // 写入消费金额，应收金额,抹零金额
        moling = rebateMoney - parseInt(rebateMoney);
        ndConsumeMoney.text(parseFloat(Money).toFixed(2));
        ndIntegerMoney.text(parseFloat(parseInt(rebateMoney)).toFixed(2));
        ndDecimalMoney.text(parseFloat(moling).toFixed(2));
        ndDiscountMoney.text(parseFloat(Money - rebateMoney).toFixed(2));

        // 计算找零
        paidMoney();
        $('#member').prop('disabled', true).val('').addClass('disabled');

        // 计算返赠菜品
        $('#show-back').html('');
        showBackMenu(checkoutBackMenu());

        // 判断折扣方案是否可以使用抵用券，是否需要特殊授权
        withVouchers = 1;           // 是否允许用抵用券, 默认可以使用抵用券
        withPower = 2;              // 是否需要授权, 默认不需要特殊授权
        for (var j in discountPro) {
           
            // 2时不能使用抵用券
            if (discountPro[j].sale_count == 2) {
                withVouchers = 2;
                $('#vip, #vouchers').attr('disabled', true).val('').addClass('disabled');
            }
            // 1时需要特殊授权
            if (discountPro[j].sale_power == 1) {
                withPower = 1;
            }
        }
        // 判断返赠方案是否需要特殊授权
        for (var j in backPro) {
            if (backPro[j].sale_power == 1) {
                withPower = 1;
            }
        }

        if (withVouchers == 1) {
            $('#vip, #vouchers').attr('disabled', false).removeClass('disabled');
        }

        // 团购输入框控制，团购为0，输入框禁用，反之启用
        if (tuangouMoney == 0) {
            $('#tuangou').attr('disabled', true).val('').addClass('disabled');
        } else {
            $('#tuangou').attr('disabled', false).removeClass('disabled');
        }
    }

    // 计算返赠菜品
    function checkoutBackMenu() {
        // 本次可返赠金额：实收金额-套餐-抵用券-贵宾券
        var localBackMoney = parseInt(rebateMoney) - tuangouMoney - taocanMoney - $('#vouchers').val() - $('#vip').val();
        // 本次真正可返赠金额：历史可返赠金额总和 - 总已返赠金额 + 本次可返赠金额
        var historyMoney = historyBackMoney - historyAlreadyBackMoney;
        var localTrueBackMoney = historyMoney + localBackMoney;

        if (historyMoney > 0) {
            $('#j-histoty-money').text('历史结账记录剩余可返赠金额：' + parseFloat(localTrueBackMoney).toFixed(2) + '元');
        }

        // 获取已选的返赠方案
        var backMenuAry = [];
        if (backPro.length != 0) {
            var kefan = localTrueBackMoney;
            for (var k=0; k<backPro.length; k++) {
                var backCount = 0;
                if (backPro[k].sale_discount == 0) {
                    backCount = 1;
                } else if (kefan < backPro[k].sale_discount) {
                    continue;
                } else {
                    // 累计
                    backCount = 1;
                    if (backPro[k].give_add == 1) {
                        backCount = Math.floor(localTrueBackMoney / backPro[k].sale_discount);
                    }
                    kefan -= backCount * backPro[k].sale_discount;
                }
                backMenuAry[k] = {};
                backMenuAry[k].menu =  backPro[k].sale_menu_no;
                backMenuAry[k].count =  parseInt(backCount * backPro[k].sale_count);
            }
        }
        return backMenuAry;
    }

    // 显示返赠菜品
    function showBackMenu(backMenuAry) {
        var menuOptions = '';
        var ids = 1;
        for (var i in backMenuAry) {
            if (backMenuAry[i].count != 0) {   
                var backId = backMenuAry[i].menu[0];
                if (!(backSetData[backId])) {
                    continue;
                }
                var backName = backSetData[backId].menu_name;
                for (var j=0; j<backMenuAry[i].count; j++) {
                    menuOptions += '<option id="'+ backId +'">'+ ids + '.' + backName +'</option>';
                    ids++;
                }
            }
        }
        $('#show-back').append(menuOptions);
    }

    // 获取方案
    function getProgram(name, checkProgram, runMode) {
        // name=1, 所有后台给的折扣方案+已选手动折扣方案，name=2, 所有后台给的返赠方案+已选手动返赠方案
        var allAry = [];
        var ndShowDiscount = $('#show-discount option');
        var ndSetDiscunt = $('#set-discount option');

        if (runMode == '-') {
            for (var i=ndShowDiscount.length - 1; i>=0; i--) {
                if (checkProgram == $(ndShowDiscount[i]).attr('id')) {
                    ndShowDiscount.splice(i, 1);
                }
            }
        } else if (runMode == '+') {
            for (var i=0; i<ndSetDiscunt.length; i++) {
                if (checkProgram == $(ndSetDiscunt[i]).attr('id')) {
                    ndShowDiscount.push(ndSetDiscunt[i]);
                }
            }
        }

        for (var k in discountSetData[name]) {
            if (discountSetData[name][k].sale_exec == 1) {
                allAry.push(discountSetData[name][k]);
            } else {
                // 获取显示方案里面所有的手动方案
                for (var i=0; i<ndShowDiscount.length; i++) {
                    if ( ndShowDiscount[i].id == discountSetData[name][k].id && discountSetData[name][k].sale_type == name && discountSetData[name][k].sale_exec == 2) {
                        allAry.push(discountSetData[name][k]);
                    }
                }
            }
        }

        return allAry;
    }

    // 获取未选的方案
    function writeProgarm(all, check) {
        var leftContent = [];
        for (var i in all) {
            var has = 0;
            for (var j in check) {
                if (all[i].id == check[j].id) {
                    has = 1;
                }
            }

            if (has == 0) {
                leftContent.push(all[i]);
            } 
        }
        return leftContent;
    }

    // 写入方案
    function displayProgram(programs, dom) {
        var program = '';
        for (i in programs) {
            program += '<option id="'+ programs[i].id +'">'+ programs[i].sale_name +'</option>';
        }
        $(dom).append(program);
    }

    // 排除非有效期内的折扣/返赠方案
    function checkSaleTime(sale, time, notProgram) {
        var dates = time.split(' ');
        var dateOne = dates[0].replace(/-/g,'/');                    // 日期时间分割
        var date = new Date(dateOne).getTime() / 1000;               // 日期
        var dateTime = new Date(dateOne + ' ' + dates[1]).getTime(); // 日期时间

        for (var i=sale.length-1; i>=0; i--) {
            if ((contains(notProgram, sale[i].id) == true) || // 用过的折扣方案去掉
                (sale[i].start_date != 'all' && sale[i].start_date > date) ||
                (sale[i].end_date != 'all' && sale[i].end_date < date) ||
                (sale[i].start_time != 'all' && (new Date(dateOne + ' ' + sale[i].start_time).getTime()) > dateTime) ||
                (sale[i].end_time != 'all' && (new Date(dateOne + ' ' + sale[i].end_time).getTime()) < dateTime)) {
                sale.splice(i, 1);
            }
        }
        return sale;
    }

    // 检查方案与方案的并存性
    function checkSaleAllow(saleArray, allowArray, salename) {
        for (var i in saleArray) {
            var sale_allow;
            if (salename == 'sale_allow') {
                sale_allow = saleArray[i].sale_allow;
            } else if (salename == 'give_allow') {
                sale_allow = saleArray[i].give_allow;
            }
            if (sale_allow == 'all') {
                continue;
            }
            for (var j=allowArray.length-1; j>=0; j--) {
                if ( (saleArray[i].id == allowArray[j].id) || (contains(sale_allow, allowArray[j].id) == true) ) {
                    continue;
                }

                if (allowArray[j].sale_exec == 1) {
                    allowArray.splice(j, 1);
                } else {
                    displayMsg(ndBillProMsg, saleArray[i].sale_name + ' 与 ' + allowArray[j].sale_name + ' 不能并存，添加失败！', 2000);
                    return false;
                }
            }
        }

        return allowArray;
    }

    // 无未结账订单, 参数：已结订单好号集合，桌台id, 重打id
    function nocheckoutOrder(orderIds, tabId, rePrintId) {
        var setDiscount = '', showDiscount = '', setBackMenu = '', showBackMenu = '';
        $('#set-discount, #show-discount, #set-back, #show-back').html('').css('color', '#999999');
        $('#discount-right, #discount-left, #back-left, #back-right').click(function() {
            return;
        });

        // 待选方案显示
        if (discountSetData != '') {
            for (var i in discountSetData) {
                for (var j in discountSetData[i]) {
                    setDiscount += '<option id="'+ discountSetData[i][j].id +'">'+ discountSetData[i][j].sale_name +'</option>';
                }
            }
            $('#set-discount').append(setDiscount);
        }
        // 已选方案显示
        if (checkedSale.length != 0) {
            for (var i in checkedSale) {
                showDiscount += '<option id="'+ checkedSale[i].id +'">'+ checkedSale[i].sale_name +'</option>';
            }
        }
        $('#show-discount').append(showDiscount);
        // 待选返赠菜品显示
        if (backSetData != '') {
            for (var i in backSetData) {
                setBackMenu += '<option id="'+ backSetData[i].id +'">'+ backSetData[i].menu_name +'</option>';
            }
            $('#set-back').append(setBackMenu);
        }
        // 已选返赠菜品显示
        if (checkedBackMenu.length !=0 ) {
            var ids = 1;
            for (var i in checkedBackMenu) {
                showBackMenu += '<option id="'+ checkedBackMenu[i].id +'">' + ids + '.' + checkedBackMenu[i].menu_name +'</option>';
                ids++;
            }
            $('#show-back').append(showBackMenu);
        }

        // 隐藏打印，显示重打
        $('#checkout').hide().next('#already-checkout').show();

        setAjax(PayUrl.getCheckoutDataUrl, {
            'order_ids': orderIds,
            'tab_name': tabId
        }, ndBillProMsg, function(respnoseText) {
            var data = respnoseText.data;

            ndTablePayId.text('(结账单:' + data.id + ')');                  // 结账单号
            ndConsumeMoney.text(parseFloat(data.menu_money).toFixed(2));    // 消费金额
            ndDecimalMoney.text(parseFloat(data.wipe_zero).toFixed(2));     // 抹零金额
            ndIntegerMoney.text(parseFloat(data.discount_money).toFixed(2));// 应收金额
            ndDiscountMoney.text(parseFloat(data.menu_money - data.discount_money - data.wipe_zero).toFixed(2));            // 应收金额

            ndCash.val(parseInt(data.cash));                                // 现金
            ndCerd.val(parseInt(data.cerd));                                // 银行卡
            $('#member').val(parseInt(data.member));                        // 会员卡
            $('#other').val(parseInt(data.other));                          // 其他卡

            $('#tuangou').val(parseInt(data.tuan));                         // 团购券
            $('#vip').val(parseInt(data.vip_ticket));                       // 贵宾券
            $('#vouchers').val(parseInt(data.vouchers));                    // 抵用券
            ndZhaolin.text(data.odd_change);                                // 找零
        }, 1);

        $('#already-checkout').unbind('click').bind('click', function() {
            setAjax(PayUrl.rePrintUrl, {
                're_print': 'PAY',
                're_id': rePrintId
            }, ndBillProMsg, function(respnoseText) {
            });
        });
    }

    // 有未结订单
    function checkoutOrder() {
        var saleAry = [], giveMenuAry = [];
        // 输入框输入值重新计算找零
        $('#vip, #vouchers, #tuangou, #cash, #cerd, #member, #other').keyup(function() {
            paidMoney();

            // 计算返赠菜品
            $('#show-back').html('');
            showBackMenu(checkoutBackMenu());
        });

        // 结账数据合法检验
        function checkoutData() {
            saleAry = [], giveMenuAry = [];
            // 获取选中的返赠菜品
            var ndBackMenu = $('#show-back option');
            var ndBackMenuAry = [];
            for (var i=0; i<ndBackMenu.length; i++) {
                ndBackMenuAry.push($(ndBackMenu)[i]);
            }
            // 需要返赠的菜品
            var xubackMenu = checkoutBackMenu();

            //遍历方案
            for (var j=0; j<xubackMenu.length; j++) {
                // 遍历所有选择的赠品
                for (var i=ndBackMenuAry.length - 1; i>=0; i--) {
                    if (xubackMenu[j].count <= 0) {
                        break;
                    }
                    //如果赠品在方案中存在
                    if ( contains(xubackMenu[j].menu, $(ndBackMenuAry[i]).attr('id')) == true) {
                        ndBackMenuAry.splice(i, 1);
                        xubackMenu[j].count -= 1;
                    }
                }
                if (xubackMenu[j].count != 0) {
                    displayMsg(ndBillProMsg, '返赠商品选择不够!', 1000);
                    return;
                }
            }
            if (ndBackMenuAry.length > 0) {
                displayMsg(ndBillProMsg, '返赠商品选多了!', 1000);
                return;
            }

            // 输入框值为空，将其值设置为0
            for (var i=0; i<allInput.length; i++) {
                if ($(allInput[i]).val() == '') {
                    $(allInput[i]).val(0);
                }
                if ((free == 1 || qian == 1) && $(allInput[i]).val() != 0) {
                    displayMsg(ndBillProMsg, '免单签单不允许输入', 1000);
                    return;
                }
            }

            // 不允许用抵用券
            if (withVouchers == 2 && ($('#vip').val() != 0 || $('#vouchers').val() != 0)) {
                displayMsg(ndBillProMsg, '所选的折扣方案不能用券支付', 1000);
                return;
            }

            // 团购券与实际套餐不相等
            if ($('#tuangou').val() != tuangouMoney) {
                displayMsg(ndBillProMsg, '团购券要和实际团购券金额相等', 1000);
                return;
            }

            // 非团购钱
            var notTuan = ndIntegerMoney.text() - tuangouMoney;
            var num = 0;
            for (var i=0; i<notTuanInput.length; i++) {
                num += parseInt($(notTuanInput[i]).val());
            }

            if (num < notTuan) {
                displayMsg(ndBillProMsg, '用户付款不足', 1000);
                return;
            }

            if (parseInt(ndZhaolin.text()) > ndCash.val()) {
                displayMsg(ndBillProMsg, '找零不能大于现金', 1000);
                return;
            }

            // 获取已选方案
            var ndShowDiscount = $('#show-discount option');
            for (var i=0; i<ndShowDiscount.length; i++) {
                saleAry.push($(ndShowDiscount[i]).attr('id'));
            }
 
            // 获取已选返赠菜品
            var ndShowback = $('#show-back option');
            for (var i=0; i<ndShowback.length; i++) {
                giveMenuAry.push($(ndShowback[i]).attr('id'));
            }

            return true;
        }

        // 确定结账
        $('#checkout').unbind('click').bind('click', function() {
            checkoutData();

            // 折扣或返赠有特殊授权时弹出框输入用户名和密码
            var username = '', password = '';
            if ( withPower == 1 && checkoutData() == true) {
                $('#logo-name, #logo-password').val('');
                $('#logoin-title').text('店长授权');
                $('#shouquan-title').show();

                var userBox = $.layer({
                    type: 1,
                    shade: [0.1 , '#000' , true],
                    title: false,
                    closeBtn: false,
                    area: ['0px','0px'],
                    page: {
                        dom: '#logoin-message'
                    }
                });

                $('#cancel-logoin').click(function() {
                    layer.close(userBox);
                });

                $('#logo-name').focus();
                $('#definite-logoin').unbind('click').bind('click', function() {
                    checkoutUserMsg();
                });

                function checkoutUserMsg() {
                    if ($('#logo-name').val() == '' || $('#logo-password').val() == '') {
                        displayMsg(ndLoginProMsg, '用户名和密码不能为空', 1000);
                        return;
                    }
                    username = $('#logo-name').val();
                    password = $('#logo-password').val();
                    layer.close(userBox);
                    checkoutData();
                    getCheckout();
                }

                $(window).keydown(function(event) {
                    if (event.keyCode == 13) {
                        checkoutUserMsg();
                    }
                });
            } else {
                if (checkoutData() == true) {
                    getCheckout();
                }
            }

            function getCheckout() {
                setAjax(PayUrl.checkoutUrl, {
                    'user_id': username,                                                // 用户名
                    'password': password,                                               // 密码
                    'order_main': orderMain,                                            // 主单号
                    'sale': arrayToJson(saleAry),                                       // 方案
                    'give_menu': arrayToJson(giveMenuAry),                              // 返赠菜品
                    'table_number': $('#table-number').attr('data-id'),                 // 桌台号
                    'menu_money': ndConsumeMoney.text(),                                // 消费金额
                    'wipe_zero': ndDecimalMoney.text(),                                 // 抹零金额
                    'discount_money': ndIntegerMoney.text(),                            // 应收金额

                    'cash': ndCash.val(),                                               // 现金
                    'cerd': ndCerd.val(),                                               // 银行卡
                    'member': $('#member').val(),                                       // 会员卡
                    'other': $('#other').val(),                                         // 其他卡

                    'tuan': $('#tuangou').val(),                                        // 团购券
                    'vip_ticket': $('#vip').val(),                                      // 贵宾券
                    'vouchers': $('#vouchers').val(),                                   // 抵用券
                    'odd_change': ndZhaolin.text(),                                     // 找零
                    'order_ids': arrayToJson(weijieArray)                               // 已送未结订单号
                }, ndBillProMsg, function(respnoseText) {
                    var payId = respnoseText.data.pay_id;

                    // 禁用可填元素，折扣、返赠选择
                    allInput.prop('disabled', true).addClass('disabled');
                    $('#set-discount, #show-discount, #set-back, #show-back').prop('disabled', true);
                    $('#discount-right, #discount-left, #back-left, #back-right').click(function() {
                        return;
                    });

                    // 切换打印按钮显示
                    $('#checkout').hide().next('#already-checkout').show();

                    // 菜单改变颜色
                    for (var i=0; i<$('#menulist li').length; i++) {
                        $($('#menulist li')[i]).find('.menulist-status').text('已送已结');
                        $($('#menulist li')[i]).find('.menulist-title').addClass('gray');
                        $($('#menulist li')[i]).find('.menulist-head, .menulist-data').addClass('gray-font');
                    }

                    for (var i=0; i<weijieContent.length; i++) {
                        $(weijieContent[i]).text('(结账单:' + respnoseText.data.pay_id + ')');
                    }

                    ndTablePayId.text('(结账单:' + respnoseText.data.pay_id + ')');
                    // liElement.css('background', '#006CB7');
                    $('#already-checkout').unbind('click').bind('click', function() {
                        setAjax(PayUrl.rePrintUrl, {
                            're_print': 'PAY',
                            're_id': payId
                        }, ndBillProMsg, function(respnoseText) {
                        });
                    });
                });
            }
        });
    }

    // 去除重复的折扣方案，以id为准
    function distinctArray(arr) {
        var temp = [];
        for (var i in arr) {
            for (var j in arr[i]) {
                if (!temp['id' + arr[i][j].id]) {
                   temp['id' + arr[i][j].id] = arr[i][j];
                }
            }
        }
        return temp;
    }

    // 数组去重
    function quchongArray(arr){
        var obj = {}, temp = [];
        for (var i=0; i<arr.length; i++) {
            if (!obj[arr[i]]) {
                temp.push(arr[i]);
                obj[arr[i]] = true;
            }
        }
        return temp;
    }

    // 显示所有桌台
    function setAllTable(status) {
        isSuccess = false;
        setAjax(PayUrl.tableUrl, null, ndPromptMsg, function(respnoseText) {
            isSuccess = true;
            for (var i=0; i<respnoseText.data.length; i++) {
                var li = $("#" + respnoseText.data[i].id);
                if (li.length <= 0) {
                    li = $('<li id=' + respnoseText.data[i].id + ' data-tab-id=' + respnoseText.data[i].tab_id + '>' + respnoseText.data[i].tab_name + '</li>');
                    $('#user-list ul').append(li);
                }

                switch(respnoseText.data[i].tab_status) {
                    case '1':
                        li.css('background', TableStatus.emptyTable).attr('data-tab-status', 'empty');
                        break;
                    case '2':
                        li.css('background', TableStatus.beenSent).attr('data-tab-status', 'been');
                        break;
                    case '4':
                        li.css('background', TableStatus.emptyTable).attr('data-tab-status', 'empty');
                        break;
                    case '5':
                        li.css('background', TableStatus.beenCheckout).attr('data-tab-status', 'beenCheckout');
                        break;
                }

                if (respnoseText.data[i].tab_property == 2 && respnoseText.data[i].tab_status == 1) {
                    li.css('background', TableStatus.delivery).attr('data-tab-status', 'delivery');
                }
            }
            setLiSize();
        }, status);
    }

    // 计算找零
    function paidMoney() {
        var giveQuan = 0;
        var giveMoney = 0;
        var quan = $('#tuangou, #vip, #vouchers');
        var notQuan = $('#cash, #cerd, #member, #other');
        var returnMoney;

        // 计算券
        for (var i=0; i<quan.length; i++) {
            if ($(quan[i]).val() != '') {
                giveQuan += parseInt($(quan[i]).val());
            }
        }
      
        // 计算非券
        for (var i=0; i<notQuan.length; i++) {
            if ($(notQuan[i]).val() != '') {
                giveMoney += parseInt($(notQuan[i]).val());
            }
        }

        // 差的钱
        var quanMoney = ndIntegerMoney.text() - giveQuan;

        // 钱未给够
        if (quanMoney > 0) {
            returnMoney = giveMoney - quanMoney;
        } else {
            returnMoney = giveMoney;
        }
        
        ndZhaolin.text(returnMoney);
    }

    // 输入框获得焦点值为0清空
    allInput.focus(function() {
        if ($(this).val() == 0) {
            $(this).val('');
        }
    });

    // 输入框输入验证
    allInput.keyup(function() {
        $(this).val($(this).val().replace(/\D/g, ''));
    });

    // 判断一个数组里面是否包含指定元素
    function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }
        return false;
    }

    // 按照不同屏幕同比例计算li大小
    function setLiSize() {
        var liWdith = ($(window).width() - 
            parseInt(ndTableList.css('margin-left')) - 30) / 10 - 
            parseInt($('#table li').css('margin-left')) - 
            parseInt($('#table li').css('margin-right'));
        var liHeight = liWdith * 3/5;

        var userListHeight = ($(window).height() - 
            parseInt($('#banner').height()) - 
            parseInt($('#footer').height()) -
            parseInt(ndTableList.css('margin-top')) - 
            parseInt(ndTableList.css('margin-bottom')));

        $('#table li').width(liWdith + 'px');
        $('#table li').height(liHeight + 'px');
        $('#table li').css('line-height', liHeight + 'px');
        ndTableList.height(userListHeight + 'px');
    }

    // 设置账单内容高度
    function setBillHeight() {
        $('#bill-detailed').height($(window).height());
        var detailedContentHeight = $(window).height() - $('#detailed-title').height() - $('#detailed-footer').height();
        $('#detailed-content').height(detailedContentHeight - 20 + 'px');        
    }

    // 退出系统
    $('#exit-system').unbind('click').bind('click', function() {
        $('#alert-content').html('你确定要退出收银系统吗');
        displayAlertMessage('#alert-message', '#cancel-alert');

        $('#definite-alert').unbind('click').bind('click', function() {
            setAjax(PayUrl.logoutUrl, null, ndAlertPromptMsg, function(respnoseText) {
                layer.close(layerBox);
                displayMsg(ndPromptMsg, '服务器请求中...请稍候...', 30000);
                window.location.replace(indexUrl);
            });
        });
    });

    // 打开钱箱
    $('#open-money-box').unbind('click').bind('click', function() {
        setAjax(PayUrl.openMoneyBoxUrl, null, ndPromptMsg, function(respnoseText) {
        });
    });

    // 交班对账
    $('#handover').unbind('click').bind('click', function() {        
        $('#logo-name, #logo-password').val('');
        $('#logoin-title').text('交班对账');

        displayAlertMessage('#logoin-message', '#cancel-logoin');
        $('#logo-name').focus();

        // 点击登陆
        $('#definite-logoin').unbind('click').bind('click', function() {
            handover();
        });

        $(window).keydown(function(event) {
            if (event.keyCode == 13) {
                handover();
            }
        });
    });

    // 日结清机
    $('#cleaner').unbind('click').bind('click', function() {

        // 清空输入值
        $('#logo-name, #logo-password').val('');
        $('#logoin-title').text('日结清机');

        // 显示登陆框并获得焦点
        displayAlertMessage('#logoin-message', '#cancel-logoin');
        $('#logo-name').focus();

        // 点击登陆
        $('#definite-logoin').unbind('click').bind('click', function() {
            cleaner();
        });

        $(window).keydown(function(event) {
            if (event.keyCode == 13) {
                cleaner();
            }
        });
    });

    function handover() {
        if ($('#logo-name').val() == '' || $('#logo-password').val() == '') {
            displayMsg(ndLoginProMsg, '用户名和密码不能为空', 1000);
            return;
        }

        $.ajax({
            type: "POST",
            url: PayUrl.handoverUrl,
            ifModified: true,
　　        cache: true,
            data: {
                'user_id': $('#logo-name').val(),
                'password': $('#logo-password').val()
            },
            dataType: "json",
            timeout: 30000,
            beforeSend: displayMsg(ndLoginProMsg, '服务器请求中...请稍候...', false),
            error: function() {
                displayMsg(ndLoginProMsg, '请求服务器失败，请重试', 2000);
            },
            success: function(respnoseText) {
                if (respnoseText.status == 508) {
                    displayMsg(ndLoginProMsg, respnoseText.description, 2000, function() {
                        window.location.replace(IndexUrl.yintaiUrl);
                    });
                }

                var data = respnoseText.data;
                var dataId = data.id;

                var ary = [606, 610, 625, 200];
                var isChengGong = false;
                for (var i=0; i<ary.length; i++) {
                    if (respnoseText.status == ary[i]) {
                        isChengGong = true;
                    }
                }

                if (isChengGong) {
                    displayMsg(ndLoginProMsg, '', 0, function() {
                        layer.close(layerBox);
        
                        // 员工编号，员工姓名，开始时间， 结束时间
                        $('#jb-waiter-id').text(data.cashier_id);
                        $('#jb-waiter-name').text(data.cashier_name);
                        $('#jb-start-time').text(data.start_time);
                        $('#jb-end-time').text(data.end_time);

                        // 总单数，主单数，补单数
                        $('#jb-total-singular').text(parseInt(data.sum_order_main) + parseInt(data.sum_order_add));
                        $('#jb-mian-singular').text(data.sum_order_main);
                        $('#jb-add-singular').text(data.sum_order_add);

                        // 总人数，总金额，人均消费，折扣金额，抹零，实收金额
                        $('#jb-total-person').text(data.sum_person);
                        $('#jb-total-amount').text(parseFloat(data.sum_menu_money).toFixed(2));
                        if (data.sum_person == 0) {
                            $('#jb-person-money').text(parseFloat(data.sum_menu_money).toFixed(2));
                        } else if (data.sum_menu_money == 0) {
                            $('#jb-person-money').text(parseFloat(0).toFixed(2));
                        } else {
                            $('#jb-person-money').text((parseInt(data.sum_menu_money) / parseInt(data.sum_person)).toFixed(2));
                        }
                        $('#jb-discount-amount').text((data.sum_menu_money - data.sum_true_money - data.sum_wipe_zero).toFixed(2));
                        $('#jb-moling').text(parseFloat(data.sum_wipe_zero).toFixed(2));
                        $('#jb-receive-amount').text(parseFloat(data.sum_true_money).toFixed(2));

                        // 现金，银行卡，团购券，其他卡，乐币
                        $('#jb-cash').text(parseFloat(data.sum_cash).toFixed(2));
                        $('#jb-cerd').text(parseFloat(data.sum_cerd).toFixed(2));
                        $('#jb-tuan').text(parseFloat(data.sum_tuan).toFixed(2));
                        $('#jb-other').text(parseFloat(data.sum_other).toFixed(2));
                        $('#jb-member').text(parseFloat(data.sum_member).toFixed(2));

                        // 贵宾券，抵用券，优惠金额，券找零
                        $('#jb-vip-ticket').text(parseFloat(data.sum_vip_ticket).toFixed(2));
                        $('#jb-arrived').text(parseFloat(data.sum_vouchers).toFixed(2));
                        $('#jb-youhui-money').text(parseFloat(data.sum_menu_money - data.sum_true_money).toFixed(2));
                        $('#jb-odd-vouchers').text(parseFloat(data.sum_odd_vouchers).toFixed(2));

                        // 返赠菜品
                        $('#jb-back-menu').nextAll().remove();
                        var backMenu = '', backMenuCount = 0;
                        for (var i in data.sum_give) {
                            backMenuCount += parseInt(data.sum_give[i].give_count);
                            backMenu += '<li class="clearfix"><span>'+ data.sum_give[i].menu_name +'：</span><div>' + data.sum_give[i].give_count + '</div></li>'
                        }
                        $('#jb-back-menu-count').text(backMenuCount);
                        $('#jb-back-menu').after(backMenu);

                        displayAlertMessage('#bill-message', '#cancel-bill');
                        clearInterval(timeID);

                        $('#cancel-bill').unbind('click').bind('click', function() {
                            setAjax(PayUrl.logoutUrl, null, ndJiaobanProMsg, function(respnoseText) {
                                layer.close(layerBox);
                                window.location.replace(indexUrl);
                            });
                        });

                        // 重打账单
                        $('#print-bill').unbind('click').bind('click', function() {
                            setAjax(PayUrl.rePrintUrl, {
                                're_print': 'JIAOBAN',
                                're_id': dataId
                            }, ndJiaobanProMsg, function(respnoseText) {
                            });
                        });
                    });
                } else {
                    displayMsg(ndLoginProMsg, respnoseText.description, 2000, function() {
                        return;
                    });
                }
            }
        });
    }

    function cleaner() {
        if ($('#logo-name').val() == '' || $('#logo-password').val() == '') {
            displayMsg(ndLoginProMsg, '用户名和密码不能为空', 1000);
            return;
        }

        $.ajax({
            type: "POST",
            url: PayUrl.clearUrl,
            ifModified: true,
    　　    cache: true,
            data: {
                'user_id': $('#logo-name').val(),
                'password': $('#logo-password').val()
            },
            dataType: "json",
            timeout: 30000,
            beforeSend: displayMsg(ndLoginProMsg, '服务器请求中...请稍候...', false),
            error: function() {
                displayMsg(ndLoginProMsg, '请求服务器失败，请重试', 2000);
            },
            success: function(respnoseText) {
               if (respnoseText.status == 508) {
                    displayMsg(ndLoginProMsg, respnoseText.description, 2000, function() {
                        window.location.replace(IndexUrl.yintaiUrl);
                    });
                }

                var data = respnoseText.data;
                var dataId = data.id;

                var ary = [606, 610, 623, 625, 200];
                var isChengGong = false;
                for (var i=0; i<ary.length; i++) {
                    if (respnoseText.status == ary[i]) {
                        isChengGong = true;
                    }
                }

                if (isChengGong) {
                    displayMsg(ndLoginProMsg, '', 0, function() {
                        layer.close(layerBox);

                        // 经理姓名，员工姓名，开始时间， 结束时间
                        $('#qj-person-id').prop('data-id', data.manager_id).text(data.manager_name);
                        $('#qj-person-name').prop('data-id', data.cashier_id).text(data.cashier_name);
                        $('#qj-start-time').text(data.start_pay_id);
                        $('#qj-end-time').text(data.end_pay_id);

                        // 总单数，主单数，补单数
                        $('#qj-total-singular').text(parseInt(data.sum_order_main) + parseInt(data.sum_order_add));
                        $('#qj-mian-singular').text(data.sum_order_main);
                        $('#qj-add-singular').text(data.sum_order_add);

                        // 平均每桌人数，消费菜品总量，消费金额
                        if (data.sum_order_main == 0) {
                            $('#qj-person-count').text(parseFloat(0).toFixed(2));
                            $('#qj-dish-count').text(parseFloat(0).toFixed(2));
                            $('#qj-table-money').text(parseFloat(0).toFixed(2));
                        } else {
                            $('#qj-person-count').text((parseInt(data.sum_person) / parseInt(data.sum_order_main)).toFixed(2));
                            $('#qj-dish-count').text((parseInt(data.sum_dishes) / parseInt(data.sum_order_main)).toFixed(2));
                            $('#qj-table-money').text((parseInt(data.sum_menu_money) / parseInt(data.sum_order_main)).toFixed(2));
                        }

                        // 总人数，总金额，人均消费，折扣金额，抹零，实收金额
                        $('#qj-total-person').text(data.sum_person);
                        $('#qj-total-amount').text(parseFloat(data.sum_menu_money).toFixed(2));
                        if (data.sum_person == 0) {
                            $('#qj-person-money').text(parseFloat(data.sum_menu_money).toFixed(2));
                        } else if (data.sum_menu_money == 0) {
                            $('#qj-person-money').text(parseFloat(0).toFixed(2));
                        } else {
                            $('#qj-person-money').text((parseInt(data.sum_menu_money) / parseInt(data.sum_person)).toFixed(2));
                        }

                        $('#qj-discount-amount').text((parseInt(data.sum_menu_money) - parseInt(data.sum_true_money)).toFixed(2));
                        $('#qj-moling').text(parseFloat(data.sum_wipe_zero).toFixed(2));
                        $('#qj-receive-amount').text(parseFloat(data.sum_true_money).toFixed(2));

                        // 现金，银行卡，会员储值卡，团购券，其他卡
                        $('#qj-cash').text(parseFloat(data.sum_cash).toFixed(2));
                        $('#qj-cerd').text(parseFloat(data.sum_cerd).toFixed(2));
                        $('#qj-member').text(parseFloat(data.sum_member).toFixed(2));
                        $('#qj-tuan').text(parseFloat(data.sum_tuan).toFixed(2));
                        $('#qj-other').text(parseFloat(data.sum_other).toFixed(2));

                        // 电子贵宾券，电子抵用券，优惠金额，券找零
                        $('#qj-vip-ticket').text(parseFloat(data.sum_vip_ticket).toFixed(2));
                        $('#qj-arrived').text(parseFloat(data.sum_vouchers).toFixed(2));
                        $('#qj-youhui-money').text(parseFloat(data.sum_menu_money - data.sum_true_money).toFixed(2));
                        $('#qj-odd-vouchers').text(parseFloat(data.sum_odd_vouchers).toFixed(2));

                        // 返赠菜品
                        $('#qj-back-menu').nextAll().remove();
                        var backMenu = '', backMenuCount = 0;
                        for (var i in data.sum_give) {
                            backMenuCount += parseInt(data.sum_give[i].give_count);
                            backMenu += '<li class="clearfix"><span>'+ data.sum_give[i].menu_name +'：</span><div>' + data.sum_give[i].give_count + '</div></li>'
                        }
                        $('#qj-back-menu-count').text(backMenuCount);
                        $('#qj-back-menu').after(backMenu);

                        displayAlertMessage('#clear-message', '#cancel-clear');
                        clearInterval(timeID);
                        $('#cancel-clear').unbind('click').bind('click', function() {
                            setAjax(PayUrl.logoutUrl, null, ndClearProMsg, function(respnoseText) {
                                layer.close(layerBox);
                                window.location.replace(indexUrl);
                            });
                        });

                        // 重打账单
                        $('#print-clear').unbind('click').bind('click', function() {
                            setAjax(PayUrl.rePrintUrl, {
                                're_print': 'QINGJI',
                                're_id': dataId
                            }, ndClearProMsg, function(respnoseText) {
                            });
                        });
                    });
                } else {
                    displayMsg(ndLoginProMsg, respnoseText.description, 1000, function() {
                        return;
                    })
                }
            }
        });
    }
});