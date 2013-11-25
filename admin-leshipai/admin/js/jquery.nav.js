$(function() {
    var AdminUrl = {
        adminInfoUrl: indexUrl + 'Admin/Info',                      // 系统信息接口
        menuUpdateShowUrl: indexUrl + 'Menu/UpdateShow',            // 菜品详情显示接口
        menuUpdateSetupUrl: indexUrl + 'Menu/UpdateSetup',          // 菜品详情保存接口
        menuMakeShowUrl: indexUrl + 'Menu/MakeShow',                // 菜品设置显示接口
        menuMakeSetupUrl: indexUrl + 'Menu/MakeSetup',              // 菜品设置保存接口
        countDateShowUrl: indexUrl + 'Count/Index',                 // 按时间显示接口
        countDateFindUrl: indexUrl + 'Count/Find',                  // 按时间统计查询接口
        countMenuShowUrl: indexUrl + 'Count/Menu',                  // 按菜品显示接口
        countMenuFindUrl: indexUrl + 'Count/MenuFind',              // 按菜品统计查询接口
        countPayShowUrl: indexUrl + 'Count/Pay',                    // 按收银显示接口
        countPayFindUrl: indexUrl + 'Count/PayFind',                // 按收银统计查询接口
        macAddUrl: indexUrl + 'Mac/Add',                            // mac添加接口
        macShowUrl: indexUrl + 'Mac/Show',                          // mac显示接口
        macDelUrl: indexUrl + 'Mac/Del',                            // mac删除接口
        specalAddUrl: indexUrl + 'Specal/Add',                      // 特殊要求添加接口
        specalShowUrl: indexUrl + 'Specal/Show',                    // 特殊要求显示接口
        specalDelUrl: indexUrl + 'Specal/Del',                      // 特殊要求删除接口
        packageAddUrl: indexUrl + 'Package/Add',                    // 套餐添加接口
        packageShowUrl: indexUrl + 'Package/Show',                  // 套餐显示接口
        packageDelUrl: indexUrl + 'Package/Del',                    // 套餐删除接口
        packageMenuShowUrl: indexUrl + 'Package/MenuShow',          // 套餐删除接口
        discountAddUrl: indexUrl + 'Discount/Add',                  // 打折添加接口
        discountShowUrl: indexUrl + 'Discount/Show',                // 打折显示接口
        discountDelUrl: indexUrl + 'Discount/Del',                  // 打折删除接口
        purviewAddUrl: indexUrl + 'Check/Add',                      // 权限添加接口
        purviewShowUrl: indexUrl + 'Check/Show',                    // 权限显示接口
        purviewDelUrl: indexUrl + 'Check/Del',                      // 权限删除接口
        purviewSaveUrl: indexUrl + 'Check/Save',                    // 权限保存接口
        favorableShowUrl: indexUrl + 'Sale/Show',                   // 折扣方案显示接口
        favorableAddShowUrl: indexUrl + 'Sale/AddShow',             // 折扣方案添加显示接口
        favorableAddUrl: indexUrl + 'Sale/Add',                     // 折扣方案添加接口
        favorableSaveShowUrl: indexUrl + 'Sale/SaveShow',           // 折扣方案编辑
        favorableSaveUrl: indexUrl + 'Sale/Save',                   // 折扣方案保存
        favorableDelUrl: indexUrl + 'Sale/Del'                      // 折扣方案删除
    }

    var ndPromptMsg = $('#prompt-message'),                         // 页面提示条
        ndAlertProMsg = $('#alert-prompt-message'),                 // 弹出框提示条
        ndSideBody = $('#side-body'),                               // 显示内容
        ndSide = $('#side'),                                        // 导航栏
        ndBanner = $('#banner'),                                    // 页面头部
        ndFooter = $('#footer'),                                    // 页面脚部
        dateArray = [],
        payArray = [],
        discoutArray = [],
        countArray = [],
        jiantou = '<img src="./static/images/left_jian.png">';      // 箭头图标

    // 设置内容高度
    function setHeight() {
        $('#side, #main').height(
            $(window).height() - 
            ndBanner.height() - 
            ndFooter.height()
        );
        ndSideBody.height(
            $(window).height() - 
            ndBanner.height() - 
            ndFooter.height() - 
            $('#side-title').height() - 30 + 'px'
        );
    }
    setHeight();

    $(window).resize(function() {
        setHeight();
    });

    // 退出系统
    $('#exit-system').click(function() {
        $('#alert-content').html('你确定要退出门店管理系统吗？');

        displayAlertMessage('#alert-message', '#cancel-alert');

        $('#definite-alert').click(function() {
            setAjax(url.logoutUrl, null, ndAlertProMsg, function(respnoseText) {
                layer.close(layerBox);
                displayMsg(ndPromptMsg, '服务器请求中...请稍候...', 30000);
                window.location.replace(url.logpageUrl);
            });
        });
    });

    // 系统工具
    var SystemTools = {
        // 联系管理
        sideToolsAdmin: function() {
            ndSideBody.html($('#contact-msg').html());
        },

        // 系统信息
        sideToolsSystem: function() {
            setAjax(AdminUrl.adminInfoUrl, null, ndPromptMsg, function(respnoseText) {
                var data = respnoseText.data;
                var content = '';
                for (var i in data) {
                    content += '<p>'+data[i].name + '：' + data[i].update_time + '</p>';
                }
                ndSideBody.html('<div id="system-msg">' + content +'</div>');
            }, 1);
        }
    }

    // MAC地址
    var Mac = {
        // Mac地址显示
        displayMac: function() {
            setAjax(AdminUrl.macShowUrl, null, ndPromptMsg, function(respnoseText) {
                var mac = respnoseText.data.mac;
                var shop = respnoseText.data.shop;
                var shopContent = '';

                for (var i in shop) {
                    shopContent += '<option value="'+shop[i].value+'">'+shop[i].value+'</option>';
                }

                var titleContent ='<div class="table-three clearfix">'+
                                    '<p><label class="input_box">店铺名称：<select id="shop">'+shopContent+'</select></label></p>'+
                                    '<p><label class="input_box">MAC地址：<input type="text" class="mac_add" id="mac-address"></label></p>'+
                                    '<p><input type="button" value="添 加" class="btn" id="j-mac-add"></p></div>';

                var mainContent = '<li class="table-container clearfix"><p>店铺名称</p><p>MAC地址</p><p>操作</p></li>';
                for (var i=0; i<mac.length; i++) {
                    mainContent += '<li id="'+mac[i].id+'" class="clearfix">'+
                    '<p>'+mac[i].shop_name+'</p>'+
                    '<p>'+mac[i].pad_mac+'</p>' +
                    '<p><input type="button" value="删 除" class="btn"></p></li>';
                }
                var main = '<ul id="mac-content" class="table-three">' + mainContent + '</ul>';
                ndSideBody.html(titleContent + main);

                $('#j-mac-add').click(function() {
                    Mac.macAdd();
                });

                $('#mac-content').delegate('li', 'click', function(event) {
                    var liId = this.id;
                    if (event.target.tagName.toLowerCase() == 'input') {
                        setAjax(AdminUrl.macDelUrl, {
                            'id': liId
                        }, ndPromptMsg, function(respnoseText) {
                            $('#mac-content').find('li[id='+liId+']').remove();
                        });
                    }
                });
            }, 1);
        },

        // Mac地址增加
        macAdd: function() {
            if ($('#mac-address').val() == '') {
                displayMsg(ndPromptMsg, 'MAC地址不能为空', 2000);
                return;
            }

            setAjax(AdminUrl.macAddUrl, {
                'mac': $('#mac-address').val(),
                'shop': $("#shop").val()
            }, ndPromptMsg, function(respnoseText) {
                var data = respnoseText.data;
                var newRecord = '<li id="'+data+'" class="clearfix">' +
                '<p>' + $("#shop").val() + '</p>' +
                '<p>' + $('#mac-address').val() + '</p>' +
                '<p><input type="button" value="删 除" class="btn"></p></li>';
                $('#mac-address').val('');
                $('#mac-content li:eq(0)').after(newRecord);
            }, 1);
        }
    }

    // 权限管理
    var Purview = {
        // 权限管理显示
        displayPurview: function() {
            setAjax(AdminUrl.purviewShowUrl, null, ndPromptMsg, function(respnoseText) {
                // console.log(respnoseText);
                var data = respnoseText.data;
                var titleContent ='<div class="table-new-four clearfix">'+
                                    '<p><label class="input_box">系统名称：<input type="text" class="mac_add" id="system-name" placeholder="例：ABCDEFBG"></label></p>'+
                                    '<p><label class="input_box">模块名称：<input type="text" class="mac_add" id="modal-name" placeholder="例：ABCDEFBG"></label></p>'+
                                    '<p><label class="input_box">读写权限：<select id="rw-purview" class="width100">'+
                                        '<option value="R">读</option>'+
                                        '<option value="W">写</option>'+
                                    '</select></label></p>'+
                                    '<p><input type="button" value="添 加" class="btn" id="j-purview-add"></p></div>';

                var mainContent = '<li class="table-container clearfix"><p>系统名称</p><p>模块名称</p><p>读写权限</p><p>权限设置</p><p>操作</p></li>';
             
                for (var i=0; i<data.length; i++) {
                    // 判断读写
                    var r_w = (data[i].r_w == 1) ? '读' : '写',
                        ip = (data[i].check_code.USER_IP).split(','),
                        mac = (data[i].check_code.USER_MAC).split(','),
                        position = (data[i].check_code.postion).split(','),
                        shop = (data[i].check_code.shop_id).split(','),
                        user = (data[i].check_code.waiter_id).split(','),
                        ipContent = '', macContent = '', shopContent = '', workContent = '', userContent = '';

                    for (var j=0; j<ip.length; j++) {
                        ipContent += '<input type="text" value="'+ip[j]+'">';
                    }
                    for (var j=0; j<mac.length; j++) {
                        macContent += '<input type="text" value="'+mac[j]+'">';
                    }
                    for (var j=0; j<position.length; j++) {
                        workContent += '<input type="text" value="'+position[j]+'">';
                    }
                    for (var j=0; j<shop.length; j++) {
                        shopContent += '<input type="text" value="'+shop[j]+'">';
                    }
                    for (var j=0; j<user.length; j++) {
                        userContent += '<input type="text" value="'+user[j]+'">';
                    }

                    mainContent += '<li id="' + data[i].id+'" class="clearfix">'+
                    '<div>'+data[i].sys_name+'</div>' +
                    '<div>'+data[i].mod_name+'</div>' +
                    '<div>'+r_w+'</div>' +
                    '<div class="purview-set">'+
                        '<span class="clearfix"><section class="left-content">IP：</section><section class="right-content">'+ipContent+'</section></span>'+
                        '<span class="clearfix"><section class="left-content">MAC：</section><section class="right-content">'+macContent+'</section></span>'+
                        '<span class="clearfix"><section class="left-content">店铺：</section><section class="right-content">'+shopContent+'</section></span>'+
                        '<span class="clearfix"><section class="left-content">职位：</section><section class="right-content">'+workContent+'</section></span>'+
                        '<span class="clearfix"><section class="left-content">员工：</section><section class="right-content">'+userContent+'</section></span>'+
                    '</div>' +
                    '<div>'+
                        '<input type="button" value="保 存" class="btn" style="margin: 10px 0" data-type="save">'+
                        '<input type="button" value="删 除" class="btn" data-type="delete">'+
                    '</div></li>';
                }
                var mian = '<ul id="purview-content" class="table-purview">' + mainContent + '</ul>';
                ndSideBody.html(titleContent + mian);

                $('#purview-content').delegate('input', 'keyup', function(event) {
                    if (event.which == 13) {
                        if (this.value != '') {
                            $(this).after('<input type="text">');
                            $(this).next('input').focus();
                        }
                    } else {
                        if (this.value == '' && $(this).siblings().length != 0) {
                            $(this).prev('input').focus();
                            $(this).remove();
                        }
                    }               
                });

                $('#j-purview-add').click(function() {
                    Purview.purviewAdd();
                });

                $('#purview-content').delegate('li', 'click', function(event) {
                    var liId = this.id;
                    if ($(event.target).attr('data-type') == 'delete') {
                        setAjax(AdminUrl.purviewDelUrl, {
                            'id': liId
                        }, ndPromptMsg, function(respnoseText) {
                            $('#purview-content').find('li[id='+liId+']').remove();
                        });
                    }

                    if ($(event.target).attr('data-type') == 'save') {
                        var li = $('#purview-content').find('li[id='+liId+']');

                        for (var i=0; i<li.find('input[type=text]').length; i++) {
                            $(li.find('input[type=text]')[i]).val($(li.find('input[type=text]')[i]).val().replace(/[ ]/g, ''));
                        }
            
                        for (var i=li.find('span').length; i>=0; i--) {
                            if ($(li.find('span')[i]).find('input[type=text]').length > 1) {
                                for (var j=$(li.find('span')[i]).find('input[type=text]').length; j>=0; j--) {
                                    if ($($(li.find('span')[i]).find('input[type=text]')[j]).val() == '') {
                                        $($(li.find('span')[i]).find('input[type=text]')[j]).remove();
                                    }
                                    if ($($(li.find('span')[i]).find('input[type=text]')[j]).val() == 'all') {
                                        $(li.find('span')[i]).find('input[type=text]:not(:first-child)').remove();
                                        $(li.find('span')[i]).find('input[type=text]:eq(0)').val('all');
                                    }
                                }
                            }
                        }

                        if (li.find('span:eq(0) input[type=text]').length == 1 && li.find('span:eq(0) input:eq(0)').val() == '') {
                            displayMsg(ndPromptMsg, 'IP不能为空', 2000);
                            return;
                        }
                        if (li.find('span:eq(1) input[type=text]').length == 1 && li.find('span:eq(1) input:eq(0)').val() == '') {
                            displayMsg(ndPromptMsg, 'MAC不能为空', 2000);
                            return;
                        }
                        if (li.find('span:eq(3) input[type=text]').length == 1 && li.find('span:eq(3) input:eq(0)').val() == '') {
                            displayMsg(ndPromptMsg, '职位不能为空', 2000);
                            return;
                        }
                        if (li.find('span:eq(4) input[type=text]').length == 1 && li.find('span:eq(4) input:eq(0)').val() == '') {
                            displayMsg(ndPromptMsg, '员工不能为空', 2000);
                            return;
                        }

                        var textarea1 = [], textarea2 = [], textarea3 = [], textarea4 = [], textarea5 = [];
                        for (var i=0; i<li.find('span:eq(0) input[type=text]').length; i++) {
                            textarea1.push($(li.find('span:eq(0) input[type=text]')[i]).val());
                        }
                        for (var i=0; i<li.find('span:eq(1) input[type=text]').length; i++) {
                            textarea2.push($(li.find('span:eq(1) input[type=text]')[i]).val());
                        }
                        for (var i=0; i<li.find('span:eq(2) input[type=text]').length; i++) {
                            textarea3.push($(li.find('span:eq(2) input[type=text]')[i]).val());
                        }
                        for (var i=0; i<li.find('span:eq(3) input[type=text]').length; i++) {
                            textarea4.push($(li.find('span:eq(3) input[type=text]')[i]).val());
                        }
                        for (var i=0; i<li.find('span:eq(4) input[type=text]').length; i++) {
                            textarea5.push($(li.find('span:eq(4) input[type=text]')[i]).val());
                        }
                        setAjax(AdminUrl.purviewSaveUrl, {
                            'id': liId,
                            'ip': textarea1,
                            'mac': textarea2,
                            'shop_id': textarea3,
                            'position': textarea4,
                            'user_id': textarea5
                        }, ndPromptMsg, function(respnoseText) {
                        });
                    }
                });
            }, 1);
        },

        // 权限管理增加
        purviewAdd: function() {
            if ($('#modal-name').val() == '' || $('#system-name').val() == '') {
                displayMsg(ndPromptMsg, '输入框不能为空', 2000);
                return;
            }

            setAjax(AdminUrl.purviewAddUrl, {
                'sys_name': $('#system-name').val(),
                'mod_name': $("#modal-name").val(),
                'r_w': $("#rw-purview").val()
            }, ndPromptMsg, function(respnoseText) {
                var data = respnoseText.data;
                var newRecord = '<li id="'+data+'" class="clearfix">' +
                '<div>' + $("#system-name").val() + '</div>' +
                '<div>' + $('#modal-name').val() + '</div>' +
                '<div>' + $('#rw-purview option:selected').text() + '</div>' +
                '<div class="purview-set">'+
                    '<span class="clearfix"><section class="left-content">IP：</section><section class="right-content"><input type="text" value="all"></section></span>'+
                    '<span class="clearfix"><section class="left-content">MAC：</section><section class="right-content"><input type="text" value="all"></section></span>'+
                    '<span class="clearfix"><section class="left-content">店铺：</section><section class="right-content"><input type="text" value="all"></section></span>'+
                    '<span class="clearfix"><section class="left-content">职位：</section><section class="right-content"><input type="text" value="all"></section></span>'+
                    '<span class="clearfix"><section class="left-content">员工：</section><section class="right-content"><input type="text" value="all"></section></span>'+
                '</div>' +
                '<div>'+
                    '<input type="button" value="保 存" class="btn" style="margin: 10px 0" data-type="save">'+
                    '<input type="button" value="删 除" class="btn" data-type="delete">'+
                '</div></li>';
                $('#system-name, #modal-name').val('');
                $('#purview-content li:eq(0)').after(newRecord);
            }, 1);
        }
    }

    // 菜品维护
    var MenuDefend = {
        sideMenuDefend: function() {
            ndSideBody.html($('#menu-defend-msg').html());

            $('#defend-message').delegate('li', 'click', function() {
                $(this).css({
                    'color': 'white',
                    'background': '#890D15'
                }).siblings('li').css({
                    'color': '#890D15',
                    'background': '#E29C00'
                });
                MenuDefend.sideMenuDefendOne($(this).text());
            });

            $('#defend-message li:first').trigger('click');
        },

        sideMenuDefendOne: function(id) {
            setAjax(AdminUrl.menuUpdateShowUrl, {
                'menu_type': id
            }, ndPromptMsg, function(respnoseText) {
                var data = respnoseText.data;
                var content = '';
                var main = '';

                for (var i=0; i<data.length; i++) {
                    var menu_is_half = '';
                    var menu_print = '';

                    // 半价
                    if (data[i].menu_is_half == 1) {
                        menu_is_half = 'checked';
                    }

                    // 打印
                    var print = ['A','B','C'];
                    for (var j=0; j<print.length; j++) {
                        if ( data[i].menu_print == print[j]) {
                            menu_print += '<option value="'+print[j]+'" selected="selected">'+print[j]+'</option>';
                        } else {
                            menu_print += '<option value="'+print[j]+'">'+print[j]+'</option>';
                        }
                    }
                    
                    content += '<li class="clearfix">' +
                    '<p>' + data[i].menu_name + '</p>' +
                    '<p><input disabled="true" type="text" id="menu_price'+data[i].menu_no+'" value="'+data[i].menu_price+'" class="inputWidth140"></p>' +
                    '<p><input type="checkbox" name="menu_is_half'+data[i].menu_no+'"'+menu_is_half+'></p>' +
                    '<p><select id="menu_print'+data[i].menu_no+'">' +menu_print+'</select></p>' +
                    '<p><input type="submit" value="保存" menu_no="'+data[i].menu_no+'" class="button">' +
                    '</p></li>';
                }

                if (content == '') {
                    main = '<li class="clearfix"><p>当前分类没有菜品</p></li>';
                } else {
                    content += '<li class="clearfix" style="display:none"><p><span id="menu_id"><input type="hidden" name="menu_type" id="menu_type" value="' + id + '" /></span></p></li>';

                    var main = '<ul class="menu-defend">' + 
                        '<li class="table-title clearfix">' + 
                            '<p id="menu_name">菜品名称</p>' + 
                            '<p id="menu_price">单价</p>' + 
                            '<p id="menu_is_half">半份</p>' + 
                            '<p id="menu_print">打印</p>' + 
                            '<p id="caozuo">操作</p>' + 
                        '</li>' + content + '</ul>';
                }
                $('#defend-panel').html(main);
                
                $('#side-body input').click(function() {
                    if ($(this).attr('type') == 'submit') {
                        var menu_no = $(this).attr('menu_no');
                        var menu_is_half = 2;
                        $('[name=menu_is_half'+menu_no+'][type=checkbox]:checked').each(function() {
                            menu_is_half = 1;
                        });
                 
                        displayMsg(ndPromptMsg, '数据保存中...请稍候...', false);
                        $.ajax({
                            type: 'POST',
                            url: AdminUrl.menuUpdateSetupUrl,
                            data: {
                                'menu_no': menu_no,
                                'menu_type': $('#menu_type').val(),
                                'menu_discount': $("#menu_discount"+menu_no).val(),
                                'menu_is_half': menu_is_half,
                                'menu_print': $("#menu_print"+menu_no).val(),
                                'start_time': $('#start_time'+menu_no).val(),
                                'end_time': $("#end_time"+menu_no).val()
                            },
                            ifModified: true,
                            dataType: "json",
                            timeout: 30000,
                            error: function() {
                                displayMsg(ndPromptMsg, '数据保存失败', 2000);
                            },
                            success: function(respnoseText) {
                                if (respnoseText.status != 200) {
                                    displayMsg(ndPromptMsg, respnoseText.description, 2000);
                                    return;
                                }

                                displayMsg(ndPromptMsg, '数据保存成功！', 500);
                            }
                        });
                    }
                });
            }, 1);
        }
    }

    // 菜品制作
    var MenuMake = {
        sideMenuMake: function() {
            ndSideBody.html($('#menu-defend-msg').html());

            $('#defend-message').delegate('li', 'click', function() {
                $(this).css({
                    'color': 'white',
                    'background': '#890D15'
                }).siblings('li').css({
                    'color': '#890D15',
                    'background': '#E29C00'
                });
                MenuMake.sideMenuMakeOne($(this).text());
            });

            $('#defend-message li:first').trigger('click');
        },

        sideMenuMakeOne: function(id) {
            setAjax(AdminUrl.menuMakeShowUrl, {
                'menu_type': id
            }, ndPromptMsg, function(respnoseText) {
                var data = respnoseText.data;
                var content = '';
                var main = '';

                for (var i=0; i<data.length; i++) {
                    var menu_oil = '';
                    var oil = ['', '水长', '水中', '水短', '油长', '油中', '油短', '直炒', '直煸'];
                    for (var k=0; k<oil.length; k++) {
                        if (oil[k] == data[i].menu_oil) {
                            menu_oil += '<option value="'+oil[k]+'" selected="selected">'+oil[k]+'</option>';
                        } else {
                            menu_oil += '<option value="'+oil[k]+'">'+oil[k]+'</option>';
                        }
                    }
                    
                    content += '<li class="clearfix">' +
                    '<p>' + data[i].menu_name + '</p>' +
                    '<p><select id="menu_oil'+data[i].menu_no+'">'+menu_oil+'</select></p>' + 
                    '<p>' + 
                        '<input type="text" id="menu_jd_oil'+data[i].menu_no+'" value="'+data[i].menu_jd_oil+'" class="inputWidth50"> ' + 
                        '<input type="text" id="menu_jd_sauce'+data[i].menu_no+'" value="'+data[i].menu_jd_sauce+'" class="inputWidth50">' +
                    '</p>' + 
                    '<p>' + 
                        '<input type="text" id="menu_zr_oil'+data[i].menu_no+'" value="'+data[i].menu_zr_oil+'" class="inputWidth50"> ' +
                        '<input type="text" id="menu_zr_sauce'+data[i].menu_no+'" value="'+data[i].menu_zr_sauce+'" class="inputWidth50">' +
                    '</p>' +
                    '<p>' +
                        '<input type="text" id="menu_xx_oil'+data[i].menu_no+'" value="'+data[i].menu_xx_oil+'" class="inputWidth50"> ' +
                        '<input type="text" id="menu_xx_sauce'+data[i].menu_no+'" value="'+data[i].menu_xx_sauce+'" class="inputWidth50">' +
                    '</p>' +
                    '<p>' +
                        '<input type="text" id="menu_xj_oil'+data[i].menu_no+'" value="'+data[i].menu_xj_oil+'" class="inputWidth50"> ' +
                        '<input type="text" id="menu_xj_sauce'+data[i].menu_no+'" value="'+data[i].menu_xj_sauce+'" class="inputWidth50">' +
                    '</p>' +
                    '<p>' +
                        '<input type="text" id="menu_a_oil'+data[i].menu_no+'" value="'+data[i].menu_a_oil+'" class="inputWidth50"> ' +
                        '<input type="text" id="menu_a_sauce'+data[i].menu_no+'" value="'+data[i].menu_a_sauce+'" class="inputWidth50">' +
                    '</p>' +
                    '<p>' +
                        '<input type="submit" value="保存" menu_no="'+data[i].menu_no+'" class="button">' +
                    '</p></li>';
                }

                if (content == '') {
                    main = '<li class="clearfix"><p>当前分类没有菜品</p></li>';
                } else {
                    content += '<li class="clearfix" style="display:none"><p><span id="menu_id"><input type="hidden" name="menu_type" id="menu_type" value="' + id + '" /></span></p></li>';

                    main = '<ul class="table-menu">' + 
                        '<li class="table-title clearfix">' + 
                            '<p id="menu_name">菜品名称</p>' + 
                            '<p id="menu_oil">油水</p>' + 
                            '<p id="menu_jd">经典油酱</p>' + 
                            '<p id="menu_zr">孜然油酱</p>' + 
                            '<p id="menu_xx">鲜香油酱</p>' + 
                            '<p id="menu_xj">鲜椒油酱</p>' + 
                            '<p id="menu_ao">奥尔良油酱</p>' + 
                            '<p id="caozuo">操作</p>' + 
                        '</li>' + content + 
                    '</ul>';
                }
                $('#defend-panel').html(main);
                
                $('#side-body li:not(:first-child)').hover(function() {
                    $(this).addClass('gray');
                }, function(){
                    if (!$(this).find('input').prop('checked')) {
                        $(this).removeClass('gray');
                    }
                });

                $('#side-body input').keyup(function() {
                    $(this).val($(this).val().replace(/\D/g, ''));
                });

                $('#side-body input').click(function() {
                    if ($(this).attr('type') == 'submit') {
                        var menu_no = $(this).attr('menu_no');

                        displayMsg(ndPromptMsg, '数据保存中...请稍候...', false);
                        $.ajax({
                            type: 'POST',
                            url: AdminUrl.menuMakeSetupUrl,
                            data: {
                                'menu_no': menu_no,
                                'menu_type': $('#menu_type').val(),
                                'menu_oil': $("#menu_oil"+menu_no).val(),
                                'menu_jd_oil': $("#menu_jd_oil"+menu_no).val(),
                                'menu_jd_sauce': $("#menu_jd_sauce"+menu_no).val(),
                                'menu_zr_oil': $("#menu_zr_oil"+menu_no).val(),
                                'menu_zr_sauce': $("#menu_zr_sauce"+menu_no).val(),
                                'menu_xx_oil': $("#menu_xx_oil"+menu_no).val(),
                                'menu_xx_sauce': $("#menu_xx_sauce"+menu_no).val(),
                                'menu_xj_oil': $("#menu_xj_oil"+menu_no).val(),
                                'menu_xj_sauce': $("#menu_xj_sauce"+menu_no).val(),
                                'menu_a_oil': $("#menu_a_oil"+menu_no).val(),
                                'menu_a_sauce': $("#menu_a_sauce"+menu_no).val()
                            },
                            ifModified: true,
                            dataType: "json",
                            timeout: 30000,
                            error: function() {
                                displayMsg(ndPromptMsg, '数据保存失败', 2000);
                            },
                            success: function(respnoseText) {
                                if (respnoseText.status != 200) {
                                    displayMsg(ndPromptMsg, respnoseText.description, 2000);
                                    return;
                                }

                                displayMsg(ndPromptMsg, '数据保存成功！', 500);
                            }
                        });
                    }
                });
            }, 1);
        }
    }

    // 特殊要求
    var Special = {
        // 特殊要求显示
        displaySpecial: function() {
            setAjax(AdminUrl.specalShowUrl, null, ndPromptMsg, function(respnoseText) {
                var data = respnoseText.data;
                var titleContent ='<div class="table-three clearfix">'+
                                    '<p><label class="input_box">要求名称：<input type="text" id="claim-name" class="mac_add"></label></p>' +
                                    '<p><label class="input_box">要求内容：<input type="text" id="claim-content" class="mac_add"></label></p>' + 
                                    '<p><input type="button" value="添 加" class="btn" id="j-specal-add"></div></p>';
                
                var mainContent = '<li class="table-container clearfix"><p>要求名称</p><p>要求内容</p><p>操作</p></li>';
                for (var i=0; i<data.length; i++) {
                    mainContent += '<li id="'+data[i].id+'" class="clearfix">' +
                    '<p>' + data[i].name + '</p>' +
                    '<p>' + data[i].value + '</p>' +
                    '<p><input type="button" value="删 除" class="btn"></p></li>';
                }
                var main = '<ul id="special-content" class="table-three">' + mainContent + '</ul>';
                ndSideBody.html(titleContent + main);

                $('#j-specal-add').click(function() {
                    Special.specialAdd();
                });

                $('#special-content').delegate('li', 'click', function(event) {
                    var liId = this.id;
                    if (event.target.tagName.toLowerCase() == 'input') {
                        setAjax(AdminUrl.specalDelUrl, {
                            'id': liId
                        }, ndPromptMsg, function(respnoseText) {
                            $('#special-content').find('li[id='+liId+']').remove();
                        });
                    }
                });
            }, 1);
        },

        // 特殊要求增加
        specialAdd: function() {
            if ($('#claim-name').val() == '' || $('#claim-content').val() == '') {
                displayMsg(ndPromptMsg, '要求名称或要求内容不能为空', 2000);
                return;
            }

            setAjax(AdminUrl.specalAddUrl, {
                'cate': $('#claim-name').val(),
                'content': $('#claim-content').val()
            }, ndPromptMsg, function(respnoseText) {
                var data = respnoseText.data;
                var newRecord = '<li id="'+data+'" class="clearfix">' +
                '<p>' + $('#claim-name').val() + '</p>' +
                '<p>' + $('#claim-content').val() + '</p>' +
                '<p><input type="button" value="删 除" class="btn"></p></li>';
                $('#claim-name, #claim-content').val('');
                $('#special-content li:eq(0)').after(newRecord);
            });
        }
    }

    // 套餐
    var Package = {
        // 套餐显示
        displayPackage: function() {
            setAjax(AdminUrl.packageShowUrl, null, ndPromptMsg, function(respnoseText) {
                // console.log(respnoseText);
                // console.log(JSON.stringify(respnoseText));
                var data = respnoseText.data;
                var mainContent = '<li class="table-content clearfix"><p>套餐名称</p><p>单价</p><p>所属菜品</p><p>操作</p></li>';

                var cateContent = '';
                for (var i=0; i<data.cate.length; i++) {
                    cateContent += '<option>' + data.cate[i].value + '</option>';
                }
                cateContent = '分类：<select data-type="cate">' + cateContent + '</select>';

                var menuContent = '';
                for (var i=0; i<data.menu.length; i++) {
                    menuContent += '<option data-price="' + data.menu[i].menu_price + '" data-no="'+data.menu[i].menu_no+'">' + data.menu[i].menu_name + '</option>';
                }
                menuContent = ' 名称：<select data-type="menu">' + menuContent + '</select>';
                                
                for (var i=0; i<data.result.length; i++) {
                    var tableTitle = '<tr><th>分类</th><th>名称</th><th>数量</th><th>单价</th></tr>';
                    var tableContent = '';
                    for (j=0; j<data.result[i].menu.length; j++) {
                        tableContent += '<tr data-no="'+ data.result[i].menu[j].menu_no +'">'+
                                    '<td>'+data.result[i].menu[j].menu_type+'</td>'+
                                    '<td>'+data.result[i].menu[j].menu_name+'</td>'+
                                    '<td>'+data.result[i].menu[j].menu_count+'</td>'+
                                    '<td>'+data.result[i].menu[j].menu_price+'</td>'+
                                '</tr>';
                    }
                    tableContent = '<table class="package-table" cellspacing="0">' + tableTitle + tableContent + '</table>';

                    mainContent += '<li id="'+data.result[i].menu_no+'" class="clearfix">'+
                    '<div data-type="package-name">' + data.result[i].menu_name + '</div>' + 
                    '<div data-type="package-price">' + data.result[i].menu_price + '</div>' + 
                    '<div>' + tableContent + cateContent + menuContent +
                            ' <label>数量：<input type="text" data-type="count"></label> ' +
                            '<label>单价：<input type="text" data-type="price"></label> ' +
                            '<input type="button" value="添加" data-type="add" class="btn-small">' +
                    '</div>' + 
                    '<div><input type="button" value="保　存" data-type="save" class="btn">'+
                    '<input type="button" value="删　除" data-type="delete" class="btn" style="margin: 10px 0"></div></li>';
                }
                var main = '<ul id="package-content" class="table-four">' + mainContent + '</ul>';
                ndSideBody.html(main);

                $('#package-content li').each(function() {
                    var self = this;
                    var countEle = $(self).find('input[data-type="count"]');
                    var priceEle = $(self).find('input[data-type="price"]');

                    $(self).find('select[data-type="cate"]').change(function() {
                        setAjax(AdminUrl.packageMenuShowUrl, {
                            'menu_type': $(this).find('option:selected').text()
                        }, ndPromptMsg, function(respnoseText) {
                            // console.log(respnoseText);
                            var data = respnoseText.data;
                            var menu = '';

                            for (var i=0; i<data.length; i++) {
                               menu += '<option value="'+ data[i].menu_name +
                               '" data-no="'+data[i].menu_no+'" data-price="'+data[i].menu_price+'">' + data[i].menu_name + '</option>';
                            }

                            $(self).find('select[data-type="menu"]').html(menu);
                            if ($(self).find('select[data-type="menu"] option:first-child').val() == '锅底') {
                                countEle.val(1);
                                priceEle.val('18.00');
                            }
                        }, 0);
                    });

                    $(self).find('select[data-type="menu"]').change(function() {
                        countEle.val(1);
                        priceEle.val($(this).find('option:selected').attr('data-price'));
                    });

                    // 添加一条
                    $(self).find('input[data-type="add"]').click(function() {
                        var cateValue = $(self).find('select[data-type="cate"] option:selected');
                        var menuValue = $(self).find('select[data-type="menu"] option:selected');

                        if (countEle.val() == '' || priceEle.val() == '') {
                            displayMsg(ndPromptMsg, '数量和单价不能为空', 2000);
                            return;
                        }

                        $(self).find('table tr:not(:first-child)').each(function() {
                            // console.log(this);
                            // console.log($(this).find('td:eq(1)').text());
                            // console.log(menuValue.text());
                            if ($(this).find('td:eq(1)').text() == menuValue.text()) {
                                $(this).remove();
                            }
                        });
                      
                        var tr = '<tr data-no="' + menuValue.attr('data-no') + '">'+ 
                                    '<td>' + cateValue.text() +'</td>'+
                                    '<td>' + menuValue.text() +'</td>'+
                                    '<td>' + countEle.val() +'</td>'+
                                    '<td>' + priceEle.val() +'</td>'+
                                '</tr>';
                        $(self).find('table').append(tr);
                        countEle.val('');
                        priceEle.val('');
                    });

                    // 保存一条
                    $(self).find('input[data-type="save"]').click(function() {
                        var allTr = $(self).find('table tr:not(:first-child)');
                        var trAry = [];
                        for (var i=0; i<allTr.length; i++) {
                            trAry[i] = {};

                            for (var j=0; j<$(allTr[i]).find('td').length; j++) {
                                switch(j) {
                                    case 0:
                                        trAry[i].menu_no = $(allTr[i]).attr('data-no');
                                        break;
                                    case 1:
                                        trAry[i].menu_name = $($(allTr[i]).find('td')[j]).text();
                                        break;
                                    case 2:
                                        trAry[i].menu_count = $($(allTr[i]).find('td')[j]).text();
                                        break;
                                    case 3:
                                        trAry[i].menu_price = $($(allTr[i]).find('td')[j]).text();
                                        break;
                                }
                            }
                            // console.log(trAry);
                        }
            
                        // console.log(trAry);
                        // console.log(JSON.stringify(trAry));
                        trAry = JSON.stringify(trAry);
                        setAjax(AdminUrl.packageAddUrl, {
                            'package': $(self).attr('id'),
                            'menu_price': $(self).find('div[data-type="package-price"]').text(),
                            'menu': trAry
                        }, ndPromptMsg, function(respnoseText) {
                            // console.log(respnoseText);
                        });
                    });

                    // 删除一条 
                    $(self).find('input[data-type="delete"]').click(function() {
                        setAjax(AdminUrl.packageDelUrl, {
                            'package': $(self).attr('id')
                        }, ndPromptMsg, function(respnoseText) {
                            $(self).find('table tr:not(:first-child)').remove();
                        });
                    });
                });

            }, 1);
        }
    }

    // 日期统计
    var DateCount = {
        // 日期统计显示
        displayDateCount: function() {
            setAjax(AdminUrl.countDateShowUrl, null, ndPromptMsg, function(respnoseText) {
                ndSideBody.html(respnoseText.data);
                var date = new Date();
                var month, day;
                month = parseInt(date.getMonth() + 1);
                if (month < 10) {
                    month = '0' + month;
                }
                day = parseInt(date.getDate() - 1);
                if (day < 10) {
                    day = '0' + day;
                }

                $('#beginTime, #endTime').val(date.getFullYear() + '-' + month + '-' + day);
                $('#select-list li:first-child').css('background-color', '#3399FF').attr('data-selected', 2);
                dateArray[0] = 'all';
                $('#dan').val('全部');

                $('#j-date-find').click(function() {
                    if (dateArray.length == 0) {
                        displayMsg(ndPromptMsg, '请选择店铺', 2000);
                        return;
                    }
                    DateCount.dateCountFind();
                }).click();

                $('#dan').focus(function() {
                    dateArray = [];
                    $('#select-list').show();
                    $('#shop-select > li').each(function() {
                        $(this).unbind('click').bind('click', function() {
                            if ($(this).attr('data-value') == 'all') {
                                if ($(this).attr('data-selected') == 1) {
                                    $('#shop-select li').css('background-color', '#FFFFFF').attr('data-selected', 1);
                                    $(this).css('background-color', '#3399FF').attr('data-selected', 2);
                                } else {
                                    $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
                                }
                            } else {
                                if ($(this).attr('data-selected') == 1) {
                                    $('#shop-select li:first-child').css('background-color', '#FFFFFF').attr('data-selected', 1);
                                    $(this).css('background-color', '#3399FF').attr('data-selected', 2);
                                } else {
                                    $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
                                }
                            }

                            for (var i=0; i<$('#shop-select li').length; i++) {
                                if ($($('#shop-select li')[i]).attr('data-selected') == 2) {
                                    $('#dan').val($($('#shop-select li')[i]).text());
                                    break;
                                }
                            }

                        });
                    });
                });

                $('#define').click(function() {
                    for (var i=0; i<$('#shop-select li').length; i++) {
                        if ($($('#shop-select li')[i]).attr('data-selected') == 2) {
                            dateArray.push($($('#shop-select li')[i]).attr('data-value'));
                        }
                    }

                    $('#select-list').hide();
                });
              
                $('#j-date-find').unbind('click').bind('click', function() {
                    if (dateArray.length == 0) {
                        displayMsg(ndPromptMsg, '请选择店铺', 2000);
                        return;
                    }
                    DateCount.dateCountFind();
                });
            }, 1);
        },

        // 日期统计查询
        dateCountFind: function() {
            $('#time-table li:not(:first-child)').remove();

            if ($('#beginTime').val() == '' || $('#endTime').val() == '') {
                displayMsg(ndPromptMsg, '输入框的值不能为空', 2000);
                return;
            }

            var startTime = Date.parse($('#beginTime').val());
            var endTime = Date.parse($('#endTime').val());

            if ((parseInt(startTime) - parseInt(endTime)) > 0) {
                displayMsg(ndPromptMsg, '开始时间不能大于结束时间', 1000);
                return;
            }

            if (dateArray.length == 1 && dateArray[0] == 'all') {
                dateArray = dateArray[0];
            }

            setAjax(AdminUrl.countDateFindUrl, {
                'beginTime': $("#beginTime").val(),
                'endTime': $("#endTime").val(),
                'dan': dateArray,
                'sel': $("#sel").val()
            }, ndPromptMsg, function(respnoseText) {
                // console.log(respnoseText);
                var data = respnoseText.data;
                var side_main = '';
                var side_sum = '';

                var menu_money = zhekou = wipe_zero = discount_money = cash = cerd = member = other = tuan = vip_ticket = vouchers = odd_vouchers = 0;
                for (var i in data) {
                    side_main += '<li class="clearfix">' +
                    '<p>' + data[i].create_time + '</p>' +
                    '<p>' + parseFloat(data[i].menu_money).toFixed(2) + '</p>' +
                    '<p>' + parseFloat(data[i].zhekou).toFixed(2) + '</p>' +
                    '<p>' + parseFloat(data[i].wipe_zero).toFixed(2) + '</p>' +
                    '<p>' + parseFloat(data[i].discount_money).toFixed(2) + '</p>' +
                    '<p>' + parseFloat(data[i].cash).toFixed(2) + '</p>' +
                    '<p>' + parseFloat(data[i].cerd).toFixed(2) + '</p>' +
                    '<p>' + parseFloat(data[i].member).toFixed(2) + '</p>' +
                    '<p>' + parseFloat(data[i].other).toFixed(2) + '</p>' + 
                    '<p>' + parseFloat(data[i].vip_ticket).toFixed(2) + '</p>' +
                    '<p>' + parseFloat(data[i].vouchers).toFixed(2) + '</p>' +
                    '<p>' + parseFloat(data[i].tuan).toFixed(2) + '</p>' +
                    '<p>' + parseFloat(data[i].odd_vouchers).toFixed(2) + '</p></li>';
                    menu_money += parseFloat(data[i].menu_money);
                    zhekou += parseFloat(data[i].zhekou);
                    wipe_zero += parseFloat(data[i].wipe_zero);
                    discount_money += parseFloat(data[i].discount_money);
                    cash += parseFloat(data[i].cash);
                    cerd += parseFloat(data[i].cerd);
                    member += parseFloat(data[i].member);
                    other += parseFloat(data[i].other);
                    tuan += parseFloat(data[i].tuan);
                    vip_ticket += parseFloat(data[i].vip_ticket);
                    vouchers += parseFloat(data[i].vouchers);
                    odd_vouchers += parseFloat(data[i].odd_vouchers);
                }

                side_main += '<li class="clearfix category">' +
                        '<p>合计</p>' +
                        '<p>' + parseFloat(menu_money).toFixed(2) + '</p>' +
                        '<p>' + parseFloat(zhekou).toFixed(2) + '</p>' +
                        '<p>' + parseFloat(wipe_zero).toFixed(2) + '</p>' +
                        '<p>' + parseFloat(discount_money).toFixed(2) + '</p>' +
                        '<p>' + parseFloat(cash).toFixed(2) + '</p>' +
                        '<p>' + parseFloat(cerd).toFixed(2) + '</p>' +
                        '<p>' + parseFloat(member).toFixed(2) + '</p>' +
                        '<p>' + parseFloat(other).toFixed(2) + '</p>' + 
                        '<p>' + parseFloat(vip_ticket).toFixed(2) + '</p>' +
                        '<p>' + parseFloat(vouchers).toFixed(2) + '</p>' +
                        '<p>' + parseFloat(tuan).toFixed(2) + '</p>' +
                        '<p>' + parseFloat(odd_vouchers).toFixed(2) + '</p></li>';
                $('#time-table li:eq(0)').after(side_main);
            }, 1);
        }
    }

    // 菜品统计
    var MenuCount = {
        // 菜品统计显示
        displayMenuCount: function() {
            setAjax(AdminUrl.countMenuShowUrl, null, ndPromptMsg, function(respnoseText) {
                ndSideBody.html(respnoseText.data);
                var date = new Date();
                var month, day;
                month = parseInt(date.getMonth() + 1);
                if (month < 10) {
                    month = '0' + month;
                }
                day = parseInt(date.getDate() - 1);
                if (day < 10) {
                    day = '0' + day;
                }

                $('#beginTime, #endTime').val(date.getFullYear() + '-' + month + '-' + day);
                $('#select-list li:first-child').css('background-color', '#3399FF').attr('data-selected', 2);
                countArray[0] = 'all';
                $('#dan').val('全部');

                $('#j-menu-find').click(function() {
                    if (countArray.length == 0) {
                        displayMsg(ndPromptMsg, '请选择店铺', 2000);
                        return;
                    }
                    MenuCount.menuCountFind();
                }).click();

                $('#dan').focus(function() {
                    countArray = [];
                    $('#select-list').show();
                    $('#shop-select > li').each(function() {
                        $(this).unbind('click').bind('click', function() {
                            if ($(this).attr('data-value') == 'all') {
                                if ($(this).attr('data-selected') == 1) {
                                    $('#shop-select li').css('background-color', '#FFFFFF').attr('data-selected', 1);
                                    $(this).css('background-color', '#3399FF').attr('data-selected', 2);
                                } else {
                                    $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
                                }
                            } else {
                                if ($(this).attr('data-selected') == 1) {
                                    $('#shop-select li:first-child').css('background-color', '#FFFFFF').attr('data-selected', 1);
                                    $(this).css('background-color', '#3399FF').attr('data-selected', 2);
                                } else {
                                    $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
                                }
                            }

                            for (var i=0; i<$('#shop-select li').length; i++) {
                                if ($($('#shop-select li')[i]).attr('data-selected') == 2) {
                                    $('#dan').val($($('#shop-select li')[i]).text());
                                    break;
                                }
                            }

                        });
                    });
                });

                $('#define').click(function() {
                    for (var i=0; i<$('#shop-select li').length; i++) {
                        if ($($('#shop-select li')[i]).attr('data-selected') == 2) {
                            countArray.push($($('#shop-select li')[i]).attr('data-value'));
                        }
                    }
                    $('#select-list').hide();
                });
              
                $('#j-menu-find').unbind('click').bind('click', function() {
                    if (countArray.length == 0) {
                        displayMsg(ndPromptMsg, '请选择店铺', 2000);
                        return;
                    }
                    MenuCount.menuCountFind();
                });
            }, 1);
        },

        // 按菜品统计查询
        menuCountFind: function() {
            $('#menu-table li:not(:first-child)').remove();

            if ($('#beginTime').val() == '' || $('#endTime').val() == '') {
                displayMsg(ndPromptMsg, '输入框的值不能为空', 2000);
                return;
            }

            var startTime = Date.parse($('#beginTime').val());
            var endTime = Date.parse($('#endTime').val());

            if ((parseInt(startTime) - parseInt(endTime)) > 0) {
                displayMsg(ndPromptMsg, '开始时间不能大于结束时间', 1000);
                return;
            }

            if (countArray.length == 1 && countArray[0] == 'all') {
                countArray = countArray[0];
            }

            var category = $("#sel").val();
            setAjax(AdminUrl.countMenuFindUrl, {
                'beginTime': $("#beginTime").val(),
                'endTime': $("#endTime").val(),
                'dan': countArray,
                'sel': $("#sel").val()
            }, ndPromptMsg, function(respnoseText) {
                console.log(respnoseText);
                var data = respnoseText.data;
                var side_main = '';
                var menu_count = 0, menu_money = 0, discount = 0, true_money = 0;
                if (category == 'menu') {
                    for (var i in data) {
                        side_main += '<li class="clearfix">' +
                        '<p>' + data[i].menu_name + '</p>' +
                        '<p class="num-right">' + parseFloat(data[i].menu_count).toFixed(1) + '</p>' +
                        '<p class="num-right">' + parseFloat(data[i].menu_money).toFixed(2) + '</p>' +
                        '<p class="num-right">' + parseFloat(data[i].discount).toFixed(2) + '</p>' +
                        '<p class="num-right">' + parseFloat(data[i].true_money).toFixed(2) + '</p></li>';
                        menu_count += parseFloat(data[i].menu_count);
                        menu_money += parseFloat(data[i].menu_money);
                        discount += parseFloat(data[i].discount);
                        true_money += parseFloat(data[i].true_money);
                    }
                } else {
                    for (var i in data) {
                        side_main += '<li class="clearfix category">' +
                        '<p>' + data[i].menu_name + '</p>' +
                        '<p class="num-right">' + parseFloat(data[i].menu_count).toFixed(1) + '</p>' +
                        '<p class="num-right">' + parseFloat(data[i].menu_money).toFixed(2) + '</p>' +
                        '<p class="num-right">' + parseFloat(data[i].discount).toFixed(2) + '</p>' +
                        '<p class="num-right">' + parseFloat(data[i].true_money).toFixed(2) + '</p></li>';

                        for (var j in data[i].cate_array) {
                            side_main += '<li class="clearfix">' +
                            '<p>' + data[i].cate_array[j].menu_name + '</p>' +
                            '<p class="num-right">' + parseFloat(data[i].cate_array[j].menu_count).toFixed(1) + '</p>' +
                            '<p class="num-right">' + parseFloat(data[i].cate_array[j].menu_money).toFixed(2) + '</p>' +
                            '<p class="num-right">' + parseFloat(data[i].cate_array[j].discount).toFixed(2) + '</p>' +
                            '<p class="num-right">' + parseFloat(data[i].cate_array[j].true_money).toFixed(2) + '</p></li>';
                            menu_count += parseFloat(data[i].cate_array[j].menu_count);
                            menu_money += parseFloat(data[i].cate_array[j].menu_money);
                            discount += parseFloat(data[i].cate_array[j].discount);
                            true_money += parseFloat(data[i].cate_array[j].true_money);
                        }
                    }
                }

                side_main += '<li class="clearfix">' +
                            '<p>合计</p>' +
                            '<p class="num-right">' + parseFloat(menu_count).toFixed(1) + '</p>' +
                            '<p class="num-right">' + parseFloat(menu_money).toFixed(2) + '</p>' +
                            '<p class="num-right">' + parseFloat(discount).toFixed(2) + '</p>' +
                            '<p class="num-right">' + parseFloat(true_money).toFixed(2) + '</p></li>';
          
                $('#menu-table li:eq(0)').after(side_main);
                $('#menu-table li:last-child').addClass('category');
            }, 1);
        }
    }

    // 收银统计
    var Pay = {
        // 收银统计显示
        displayPay: function() {
            setAjax(AdminUrl.countPayShowUrl, null, ndPromptMsg, function(respnoseText) {
                // console.log(respnoseText);
                ndSideBody.html(respnoseText.data);

                // 获取当前日期的前一天
                var date = new Date();
                var month, day;
                month = parseInt(date.getMonth() + 1);
                if (month < 10) {
                    month = '0' + month;
                }
                day = parseInt(date.getDate() - 1);
                if (day < 10) {
                    day = '0' + day;
                }

                $('#beginTime, #endTime').val(date.getFullYear() + '-' + month + '-' + day);
                $('#select-list li:first-child, #discount-list li:first-child').css('background-color', '#3399FF').attr('data-selected', 2);
                payArray[0] = 'all';
                $('#dan').val('全部');
                discoutArray[0] = 'all';
                $('#discount').val('全部');

                $('#j-pay-find').click(function() {
                    if (payArray.length == 0) {
                        displayMsg(ndPromptMsg, '请选择店铺', 2000);
                        return;
                    }

                    if (discoutArray.length == 0) {
                        displayMsg(ndPromptMsg, '请选择折扣方案', 2000);
                        return;
                    }
                    Pay.payFind();
                }).click();

                $('#dan').focus(function() {
                    payArray = [];
                    $('#select-list').show();
                    $('#shop-select > li').each(function() {
                        $(this).unbind('click').bind('click', function() {
                            if ($(this).attr('data-value') == 'all') {
                                if ($(this).attr('data-selected') == 1) {
                                    $('#shop-select li').css('background-color', '#FFFFFF').attr('data-selected', 1);
                                    $(this).css('background-color', '#3399FF').attr('data-selected', 2);
                                } else {
                                    $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
                                }
                            } else {
                                if ($(this).attr('data-selected') == 1) {
                                    $('#shop-select li:first-child').css('background-color', '#FFFFFF').attr('data-selected', 1);
                                    $(this).css('background-color', '#3399FF').attr('data-selected', 2);
                                } else {
                                    $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
                                }
                            }

                            for (var i=0; i<$('#shop-select li').length; i++) {
                                if ($($('#shop-select li')[i]).attr('data-selected') == 2) {
                                    $('#dan').val($($('#shop-select li')[i]).text());
                                    break;
                                }
                            }

                        });
                    });
                });

                $('#define').click(function() {
                    for (var i=0; i<$('#shop-select li').length; i++) {
                        if ($($('#shop-select li')[i]).attr('data-selected') == 2) {
                            payArray.push($($('#shop-select li')[i]).attr('data-value'));
                        }
                    }
                    $('#select-list').hide();
                });

                $('#discount').focus(function() {
                    discoutArray = [];
                    $('#discount-list').show();
                    $('#discount-select > li').each(function() {
                        $(this).unbind('click').bind('click', function() {
                            if ($(this).attr('data-value') == 'all') {
                                if ($(this).attr('data-selected') == 1) {
                                    $('#discount-select li').css('background-color', '#FFFFFF').attr('data-selected', 1);
                                    $(this).css('background-color', '#3399FF').attr('data-selected', 2);
                                } else {
                                    $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
                                }
                            } else {
                                if ($(this).attr('data-selected') == 1) {
                                    $('#discount-select li:first-child').css('background-color', '#FFFFFF').attr('data-selected', 1);
                                    $(this).css('background-color', '#3399FF').attr('data-selected', 2);
                                } else {
                                    $(this).css('background-color', '#FFFFFF').attr('data-selected', 1);
                                }
                            }

                            for (var i=0; i<$('#discount-select li').length; i++) {
                                if ($($('#discount-select li')[i]).attr('data-selected') == 2) {
                                    $('#discount').val($($('#discount-select li')[i]).text());
                                    break;
                                }
                            }

                        });
                    });
                });

                $('#define-discount').click(function() {
                    for (var i=0; i<$('#discount-select li').length; i++) {
                        if ($($('#discount-select li')[i]).attr('data-selected') == 2) {
                            discoutArray.push($($('#discount-select li')[i]).attr('data-value'));
                        }
                    }
                    $('#discount-list').hide();
                });
              
                $('#j-pay-find').unbind('click').bind('click', function() {
                    if (payArray.length == 0) {
                        displayMsg(ndPromptMsg, '请选择店铺', 2000);
                        return;
                    }

                    if (discoutArray.length == 0) {
                        displayMsg(ndPromptMsg, '请选择折扣方案', 2000);
                        return;
                    }
                    Pay.payFind();
                });
            }, 1);
        },

        // 收银统计查询
        payFind: function() {
            $('#pay-table li:not(:first-child)').remove();

            if ($('#beginTime').val() == '' || $('#endTime').val() == '') {
                displayMsg(ndPromptMsg, '输入框的值不能为空', 2000);
                return;
            }

            var startTime = Date.parse($('#beginTime').val());
            var endTime = Date.parse($('#endTime').val());

            if ((parseInt(startTime) - parseInt(endTime)) > 0) {
                displayMsg(ndPromptMsg, '开始时间不能大于结束时间', 1000);
                return;
            }

            if (payArray.length == 1 && payArray[0] == 'all') {
                payArray = payArray[0];
            }

            if (discoutArray.length == 1 && discoutArray[0] == 'all') {
                discoutArray = discoutArray[0];
            }

            setAjax(AdminUrl.countPayFindUrl, {
                'beginTime': $("#beginTime").val(),
                'endTime': $("#endTime").val(),
                'dan': payArray,
                'saleids': discoutArray
            }, ndPromptMsg, function(respnoseText) {
                // console.log(respnoseText);
                if (respnoseText.data == '') {
                    displayMsg(ndPromptMsg, '你查询的信息没有数据', 1000);
                    return;
                }
                var data = respnoseText.data.list;
                var dataTotal = respnoseText.data.total;
                var side_main = '';
                var menu_money = 0, discount_price = 0, wipe_zero = 0, discount_money = 0, pay_id = 0;

                for (var i=0; i<data.length; i++) {
                    side_main += '<li class="clearfix">' +
                    '<p>' + data[i].create_time + '</p>' +
                    '<p>' + data[i].shop_name.value + '</p>' +
                    '<p class="num-right">' + data[i].pay_id + '</p>' +
                    '<p class="num-right">' + parseFloat(data[i].menu_money).toFixed(2) + '</p>' +
                    '<p class="num-right">' + parseFloat(data[i].discount_price).toFixed(2) + '</p>' +
                    '<p class="num-right">' + parseFloat(data[i].wipe_zero).toFixed(2) + '</p>' +
                    '<p class="num-right">' + parseFloat(data[i].discount_money).toFixed(2) + '</p>' +
                    '<p>' + data[i].cashier_name + '</p></li>';
                    menu_money += parseFloat(data[i].menu_money);
                    discount_price += parseFloat(data[i].discount_price);
                    wipe_zero += parseFloat(data[i].wipe_zero);
                    discount_money += parseFloat(data[i].discount_money);
                    pay_id++;
                }

                side_main += '<li class="clearfix category">' +
                    '<p>合计</p><p></p>'+
                    '<p class="num-right">' + pay_id + '</p>' +
                    '<p class="num-right">' + parseFloat(menu_money).toFixed(2) + '</p>' +
                    '<p class="num-right">' + parseFloat(discount_price).toFixed(2) + '</p>' +
                    '<p class="num-right">' + parseFloat(wipe_zero).toFixed(2) + '</p>' +
                    '<p class="num-right">' + parseFloat(discount_money).toFixed(2) + '</p><p></p></li>';

                $('#pay-table li:eq(0)').after(side_main);
            }, 1);
        }
    }

    // 优惠方案
    var Favorable = {
        displayFavorable: function() {
            ndSideBody.html($('#favorable').html());
            $('#favorable-side').find('p').each(function() {
                $(this).unbind('click').bind('click', function() {
                    $(this).css({
                        'color': 'white',
                        'background': '#890D15'
                    }).siblings('p').css({
                        'color': '#890D15',
                        'background': '#E29C00'
                    });

                    if ($(this).attr('id') == 'favorable-discount') {
                        Favorable.displayDiscount();
                    } else {
                        Favorable.displayBack();
                    }
                });
            });
            $('#favorable-discount').trigger('click');
        },

        // 折扣方案显示
        displayDiscount: function() {
            setAjax(AdminUrl.favorableShowUrl, {'type': 1}, ndPromptMsg, function(respnoseText) {
                $('#favorable-container').html('');
                $('#discount-table tr:not(:first-child').remove();
                var tr = '';
                for (var i in respnoseText.data) {
                    tr += '<tr id="'+ respnoseText.data[i].id +'">'+
                            '<td>'+ respnoseText.data[i].sale_name +'</td>'+
                            '<td>'+ respnoseText.data[i].start_date +'</td>'+
                            '<td>'+ respnoseText.data[i].end_date +'</td>'+
                            '<td>'+ respnoseText.data[i].start_time +'</td>'+
                            '<td>'+ respnoseText.data[i].end_time +'</td>'+
                            '<td>'+
                                '<input type="button" data-type="edit" value="编辑"/>' +
                                '<input type="button" data-type="delete" value="删除"/>' +
                            '</td>'+
                        '</tr>';
                }
                $('#discount-table tr:eq(0)').after(tr);
                $('#favorable-title').html($('#discount-main').html());

                $('#j-discount-add').click(function() {
                    setAjax(AdminUrl.favorableAddShowUrl, {'type': 1}, ndPromptMsg, function(respnoseText) {
                        $('#favorable-container').html($('#discount-content').html());
                        $('#save-discount').hide();

                        // 可选内容
                        var data = respnoseText.data,
                            shopContent = '', cateContent = '', menuContent = '', discountContent = '', backContent = '';

                        for (var i in data.shop) {
                            shopContent += '<li data-select="0" data-key="'+ data.shop[i].mykey +'">'+ data.shop[i].value +'</li>';
                        }

                        for (var i in data.cate) {
                            cateContent += '<li data-select="0" data-key="'+ data.cate[i].mykey +'">'+ data.cate[i].value +'</li>';
                        }

                        for (var i in data.menu) {
                            menuContent += '<li data-select="0" data-key="'+ data.menu[i].menu_no +'">'+ data.menu[i].menu_name +'</li>';
                        }

                        for (var i in data.sale) {
                            if (data.sale[i].sale_type == 1) {
                                discountContent += '<li data-select="0" data-key="'+ data.sale[i].id +'">'+ data.sale[i].sale_name +'</li>';
                            } else {
                                backContent += '<li data-select="0" data-key="'+ data.sale[i].id +'">'+ data.sale[i].sale_name +'</li>';
                            }
                        }

                        $('#set-discount-shop').append(shopContent);
                        $('#set-discount-class').append(cateContent);
                        $('#set-discount-menu').append(menuContent);
                        $('#set-discount-zhekou').append(discountContent);
                        $('#set-discount-back').append(backContent);

                        Favorable.selectList('#set-discount-shop', '#show-discount-shop');
                        Favorable.selectList('#set-discount-class', '#show-discount-class');
                        Favorable.selectList('#set-discount-menu', '#show-discount-menu');
                        Favorable.selectList('#set-discount-zhekou', '#show-discount-zhekou');
                        Favorable.selectList('#set-discount-back', '#show-discount-back');

                        $('#add-discount').click(function() {
                            var shopAry = [], cataeAry = [], menuAry = [], zhekouAry = [], backAry = [];

                            // 折扣方案名称判断
                            if ($('#discount-name').val() == '') {
                                displayMsg(ndPromptMsg, '方案名称不能为空', 2000);
                                return;
                            }

                            // 选择店铺
                            var selectShop = $('#show-discount-shop li');
                            if (selectShop.length == 0) {
                                displayMsg(ndPromptMsg, '参与店铺不能为空', 2000);
                                return;
                            }
                            for (var i=0; i<selectShop.length; i++) {
                                shopAry.push($(selectShop[i]).attr('data-key'));
                            }

                            // 运行方式
                            var runMode = $('#discount-run option:selected').val();

                            // 并存的折扣方案
                            var selectZhekou = $('#show-discount-zhekou li');
                            if (runMode == 1) {
                                zhekouAry.push('all');
                                if ($('#discount-authorize').val() == 1) {
                                    displayMsg(ndPromptMsg, '自动方案不需要特殊授权', 2000);
                                    return;
                                }
                            } else {
                                if (selectZhekou.length == 0) {
                                    zhekouAry = [];
                                } else {
                                    for (var i=0; i<selectZhekou.length; i++) {
                                        zhekouAry.push($(selectZhekou[i]).attr('data-key'));
                                    }
                                }
                            }

                            // 并存的返赠方案
                            var backZhekou = $('#show-discount-back li');
                            if (runMode == 1) {
                                backAry.push('all');
                            } else {
                                if (backZhekou.length == 0) {
                                    backAry = [];
                                } else {
                                    for (var i=0; i<backZhekou.length; i++) {
                                        backAry.push($(backZhekou[i]).attr('data-key'));
                                    }
                                }
                            }

                            if (runMode == 1 && $('#discount-authorize').val() == 1) {
                                displayMsg(ndPromptMsg, '自动方案不需要特殊授权', 2000);
                                return;
                            }

                            // 折扣的分类
                            var selectCate = $('#show-discount-class li');
                            if (selectCate.length == 0) {
                                cataeAry = [];
                            } else {
                                for (var i=0; i<selectCate.length; i++) {
                                    cataeAry.push($(selectCate[i]).attr('data-key'));
                                }
                            }

                            // 折扣的菜品
                            var selectMenu = $('#show-discount-menu li');
                            if (selectMenu.length == 0) {
                                menuAry = [];
                            } else {
                                for (var i=0; i<selectMenu.length; i++) {
                                    menuAry.push($(selectMenu[i]).attr('data-key'));
                                }
                            }

                            var discountName = $('#discount-name').val();
                            var startDate = ($('#discount-start-date').val() == '') ? 'all' : $('#discount-start-date').val();
                            var endDate = ($('#discount-end-date').val() == '') ? 'all' : $('#discount-end-date').val();
                            var startTime = ($('#discount-start-time').val() == '') ? 'all' : $('#discount-start-time').val();
                            var endTime = ($('#discount-end-time').val() == '') ? 'all' : $('#discount-end-time').val();

                            setAjax(AdminUrl.favorableAddUrl, {
                                'type': 1,
                                'sale_name': discountName,                                      // 方案名称
                                'shop_id': JSON.stringify(shopAry),                             // 参与店铺
                                'beginTime': startDate,                                         // 开始日期
                                'endTime': endDate,                                             // 结束日期
                                'begin_time': startTime,                                        // 开始时间
                                'end_time': endTime,                                            // 结束时间
                                'sale_allow': JSON.stringify(zhekouAry),                        // 并存折扣方案
                                'give_allow': JSON.stringify(backAry),                          // 并存返赠方案
                                'menu_type_id': JSON.stringify(cataeAry),                       // 折扣分类
                                'menu_no': JSON.stringify(menuAry),                             // 折扣菜品
                                'sale_discount': $('#discount-value').val(),                    // 折扣额度
                                'sale_count': $('#discount-checkout option:selected').val(),    // 折扣商品结算方式
                                'sale_power': $('#discount-authorize option:selected').val(),   // 是否需要特殊授权
                                'sale_exec': runMode,                                           // 执行方式
                                'sale_status': $('#discount-status option:selected').val()      // 执行状态
                            }, ndPromptMsg, function(respnoseText) {
                                var newRecord = '<tr id="'+ respnoseText.data +'">'+
                                                    '<td>'+ discountName +'</td>' +
                                                    '<td>'+ startDate +'</td>' +
                                                    '<td>'+ endDate +'</td>' +
                                                    '<td>'+ startTime +'</td>' +
                                                    '<td>'+ endTime +'</td>' +
                                                    '<td>'+
                                                        '<input type="button" data-type="edit" value="编辑"/>' +
                                                        '<input type="button" data-type="delete" value="删除"/>' +
                                                    '</td>' +
                                                '</tr>';
                                $('#discount-table tr:eq(0)').after(newRecord);
                                $('#favorable-container').html('');

                                // 编辑折扣方案，删除折扣方案
                                editDiscount();
                            }, 1);
                        });
                    }, 1);
                });

                // 编辑折扣方案，删除折扣方案
                function editDiscount() {
                    $('#discount-table').find('tr').each(function() {
                        var self = this;
                        $(self).find('input[data-type="edit"]').unbind('click').bind('click', function() {
                            $('#favorable-container').html('');
                            setAjax(AdminUrl.favorableSaveShowUrl, {
                                'id': $(self).attr('id')
                            }, ndPromptMsg, function(respnoseText) {
                                // console.log(respnoseText);
                                $('#favorable-container').html($('#discount-content').html());
                                $('#add-discount').hide();

                                // 可选择内容
                                var data = respnoseText.data,
                                shopContent = '', cateContent = '', menuContent = '', discountContent = '', backContent = '';

                                for (var i in data.shop) {
                                    shopContent += '<li data-select="0" data-key="'+ data.shop[i].mykey +'">'+ data.shop[i].value +'</li>';
                                }

                                for (var i in data.cate) {
                                    cateContent += '<li data-select="0">'+ data.cate[i].value +'</li>'; 
                                }

                                for (var i in data.menu) {
                                    menuContent += '<li data-select="0" data-key="'+ data.menu[i].menu_no +'">'+ data.menu[i].menu_name +'</li>';
                                }

                                for (var i in data.saleArr) {
                                    if (data.saleArr[i].sale_type == 1) {
                                        discountContent += '<li data-select="0" data-key="'+ data.saleArr[i].id +'">'+ data.saleArr[i].sale_name +'</li>';
                                    } else {
                                        backContent += '<li data-select="0" data-key="'+ data.saleArr[i].id +'">'+ data.saleArr[i].sale_name +'</li>';
                                    }
                                }

                                // 已选择内容
                                var shopShowContent = '', discountShowContent = '', backShowContent = '', classShowContent = '', menuShowContent = '';
                                for (var i in data.sale) {
                                    $('#discount-name').val(data.sale[i].sale_name);

                                    // 已选参与店铺
                                    if (data.sale[i].shop_id == 'all') {
                                        shopShowContent += '<li data-select="0" data-key="all">全部</li>';
                                    } else {
                                        for (var j in data.sale[i].shop_id ) {
                                            shopShowContent += '<li data-select="0" data-key="'+ data.sale[i].shop_id[j].mykey +'">'+ data.sale[i].shop_id[j].name +'</li>';
                                        }
                                    }
                                    $('#discount-start-date').val(data.sale[i].start_date);
                                    $('#discount-end-date').val(data.sale[i].end_date);
                                    $('#discount-start-time').val(data.sale[i].start_time);
                                    $('#discount-end-time').val(data.sale[i].end_time);

                                    // 已选并存折扣方案
                                    if (data.sale[i].sale_allow == 'all') {                                           
                                        discountShowContent += '<li data-select="0" data-key="all">全部</li>';
                                    } else {
                                        for (var j in data.sale[i].sale_allow ) {
                                            if (data.sale[i].sale_allow[j].id != '') {
                                                discountShowContent += '<li data-select="0" data-key="'+ data.sale[i].sale_allow[j].id +'">'+ data.sale[i].sale_allow[j].sale_name +'</li>';
                                            }
                                        }
                                    }

                                    // 已选并存返赠方案
                                    if (data.sale[i].give_allow == 'all') {
                                        backShowContent += '<li data-select="0" data-key="all">全部</li>';
                                    } else {
                                        for (var j in data.sale[i].give_allow ) {
                                            if (data.sale[i].give_allow[j].id != '') {
                                                backShowContent += '<li data-select="0" data-key="'+ data.sale[i].give_allow[j].id +'">'+ data.sale[i].give_allow[j].sale_name +'</li>';
                                            }
                                        }
                                    }

                                    // 已选折扣分类，已选折扣菜品
                                    for (var j=0; j<data.sale[i].sale_menu_type.length; j++) {
                                        classShowContent += '<li data-select="0">'+ data.sale[i].sale_menu_type[j].name +'</li>';
                                    }
                                    for (var j=0; j<data.sale[i].sale_menu_no.length; j++) {
                                        menuShowContent += '<li data-select="0">'+ data.sale[i].sale_menu_no[j].name +'</li>';
                                    }
                                    $('#discount-value').val(data.sale[i].sale_discount).attr('disabled', true);
                                    $('#discount-checkout').val(data.sale[i].sale_count).attr('disabled', true);
                                    $('#discount-authorize').val(data.sale[i].sale_power).attr('disabled', true);
                                    $('#discount-run').val(data.sale[i].sale_exec);
                                    $('#discount-status').val(data.sale[i].sale_status);
                                }

                                $('#set-discount-shop').append(shopContent);
                                $('#set-discount-class').append(cateContent);
                                $('#set-discount-menu').append(menuContent);
                                $('#set-discount-zhekou').append(discountContent);
                                $('#set-discount-back').append(backContent);

                                $('#show-discount-shop').append(shopShowContent);
                                $('#show-discount-class').append(classShowContent);
                                $('#show-discount-menu').append(menuShowContent);
                                $('#show-discount-zhekou').append(discountShowContent);
                                $('#show-discount-back').append(backShowContent);

                                Favorable.isHaveEle('#set-discount-shop', '#show-discount-shop');
                                Favorable.isHaveEle('#set-discount-zhekou', '#show-discount-zhekou');
                                Favorable.isHaveEle('#set-discount-back', '#show-discount-back');
                                Favorable.isHaveEle('#set-discount-class', '#show-discount-class');
                                Favorable.isHaveEle('#set-discount-menu', '#show-discount-menu');

                                Favorable.selectList('#set-discount-shop', '#show-discount-shop');
                                Favorable.selectList('#set-discount-zhekou', '#show-discount-zhekou');
                                Favorable.selectList('#set-discount-back', '#show-discount-back');

                                $('#save-discount').click(function() {
                                    var shopAry = [], zhekouAry = [], backAry = [];

                                    // 折扣方案名称判断
                                    if ($('#discount-name').val() == '') {
                                        displayMsg(ndPromptMsg, '方案名称不能为空', 2000);
                                        return;
                                    }

                                    // 选择店铺
                                    var selectShop = $('#show-discount-shop li');
                                    if (selectShop.length == 0) {
                                        displayMsg(ndPromptMsg, '参与店铺不能为空', 2000);
                                        return;
                                    }
                                    for (var i=0; i<selectShop.length; i++) {
                                        shopAry.push($(selectShop[i]).attr('data-key'));
                                    }

                                    var runMode = $('#discount-run option:selected').val();
                                    // 并存的折扣方案
                                    var selectZhekou = $('#show-discount-zhekou li');
                                    if (runMode == 1) {
                                        zhekouAry.push('all');
                                    } else {
                                        if (selectZhekou.length == 0) {
                                            zhekouAry = [];
                                        } else {
                                            for (var i=0; i<selectZhekou.length; i++) {
                                                zhekouAry.push($(selectZhekou[i]).attr('data-key'));
                                            }
                                        }
                                    }

                                    // 并存的返赠方案
                                    var backZhekou = $('#show-discount-back li');
                                    if (runMode == 1) {
                                        backAry.push('all');
                                    } else {
                                        if (backZhekou.length == 0) {
                                            backAry = [];
                                        } else {
                                            for (var i=0; i<backZhekou.length; i++) {
                                                backAry.push($(backZhekou[i]).attr('data-key'));
                                            }
                                        }
                                    }

                                    if (runMode == 1 && $('#discount-authorize').val() == 1) {
                                        displayMsg(ndPromptMsg, '自动方案不需要特殊授权', 2000);
                                        return;
                                    }

                                    var discountName = $('#discount-name').val();
                                    var startDate = ($('#discount-start-date').val() == '') ? 'all' : $('#discount-start-date').val();
                                    var endDate = ($('#discount-end-date').val() == '') ? 'all' : $('#discount-end-date').val();
                                    var startTime = ($('#discount-start-time').val() == '') ? 'all' : $('#discount-start-time').val();
                                    var endTime = ($('#discount-end-time').val() == '') ? 'all' : $('#discount-end-time').val();
                                    var status = $('#discount-status option:selected').val();
                                    setAjax(AdminUrl.favorableSaveUrl, {
                                        'type': 1,
                                        'id': $(self).attr('id'),       
                                        'sale_name': discountName,                      // 方案名称
                                        'shop_id': JSON.stringify(shopAry),             // 参与店铺
                                        'beginTime': startDate,                         // 开始日期
                                        'endTime': endDate,                             // 结束日期
                                        'begin_time': startTime,                        // 开始时间
                                        'end_time': endTime,                            // 结束时间
                                        'sale_allow': JSON.stringify(zhekouAry),        // 并存折扣方案
                                        'give_allow': JSON.stringify(backAry),          // 并存返赠方案
                                        'sale_exec': runMode,                           // 执行方式
                                        'sale_status': status,                          // 执行状态
                                        'sale_power': $('#discount-authorize').val()    // 是否需要特殊授权
                                    }, ndPromptMsg, function(respnoseText) {
                                        $('#favorable-container').html('');
                                        if (status == 1) {
                                            $(self).find('td:eq(0)').text(discountName);
                                            $(self).find('td:eq(1)').text(startDate);
                                            $(self).find('td:eq(2)').text(endDate);
                                            $(self).find('td:eq(3)').text(startTime);
                                            $(self).find('td:eq(4)').text(endTime);
                                        } else {
                                            $(self).remove();
                                        }
                                    });
                                });
                            }, 1);
                        });

                        $(self).find('input[data-type="delete"]').unbind('click').bind('click', function() {
                            setAjax(AdminUrl.favorableDelUrl, {
                                'id': $(self).attr('id')       
                            }, ndPromptMsg, function(respnoseText) {
                                $(self).remove();
                                $('#favorable-container').html('');
                            });
                        });
                    });
                }

                editDiscount();
            }, 1);
        }, 

        // 返赠方案显示
        displayBack: function() {
            setAjax(AdminUrl.favorableShowUrl, {'type': 2}, ndPromptMsg, function(respnoseText) {
                $('#favorable-container').html('');
                $('#back-table tr:not(:first-child').remove();
                var tr = '';
                for (var i in respnoseText.data) {
                    tr += '<tr id="'+ respnoseText.data[i].id +'">'+
                            '<td>'+ respnoseText.data[i].sale_name +'</td>'+
                            '<td>'+ respnoseText.data[i].start_date +'</td>'+
                            '<td>'+ respnoseText.data[i].end_date +'</td>'+
                            '<td>'+ respnoseText.data[i].start_time +'</td>'+
                            '<td>'+ respnoseText.data[i].end_time +'</td>'+
                            '<td>'+
                                '<input type="button" data-type="edit" value="编辑"/>' +
                                '<input type="button" data-type="delete" value="删除"/>' +
                            '</td>'+
                        '</tr>';
                }
                $('#back-table tr:eq(0)').after(tr);
                $('#favorable-title').html($('#back-main').html());

                $('#j-back-add').click(function() {
                    setAjax(AdminUrl.favorableAddShowUrl, {'type': 2}, ndPromptMsg, function(respnoseText) {
                        $('#favorable-container').html($('#back-content').html());
                        $('#save-back').hide();

                        // 可选内容
                        var data = respnoseText.data, shopContent = '', menuContent = '';
                        for (var i in data.shop) {
                            shopContent += '<li data-select="0" data-key="'+ data.shop[i].mykey +'">'+ data.shop[i].value +'</li>';
                        }
                        for (var i in data.menu) {
                            menuContent += '<li data-select="0" data-key="'+ data.menu[i].menu_no +'">'+ data.menu[i].menu_name +'</li>';
                        }

                        $('#set-back-shop').append(shopContent);
                        $('#set-back-menu').append(menuContent);
                        Favorable.selectList('#set-back-shop', '#show-back-shop');
                        Favorable.selectList('#set-back-menu', '#show-back-menu');

                        // 返赠方案添加
                        $('#add-back').click(function() {
                            var shopAry = [], menuAry = [];

                            // 返赠方案名称判断
                            if ($('#back-name').val() == '') {
                                displayMsg(ndPromptMsg, '方案名称不能为空', 2000);
                                return;
                            }

                            // 选择店铺
                            var selectShop = $('#show-back-shop li');
                            if (selectShop.length == 0) {
                                displayMsg(ndPromptMsg, '参与店铺不能为空', 2000);
                                return;
                            }
                            for (var i=0; i<selectShop.length; i++) {
                                shopAry.push($(selectShop[i]).attr('data-key'));
                            }

                            // 返赠的菜品
                            var selectMenu = $('#show-back-menu li');
                            if (selectMenu.length == 0) {
                                displayMsg(ndPromptMsg, '返赠菜品不能为空', 2000);
                                return;
                            } else {
                                for (var i=0; i<selectMenu.length; i++) {
                                    menuAry.push($(selectMenu[i]).attr('data-key'));
                                }
                            }

                            var runMode = $('#back-run option:selected').val();
                            if (runMode == 1 && $('#back-authorize').val() == 1) {
                                displayMsg(ndPromptMsg, '自动方案不需要特殊授权', 2000);
                                return;
                            }

                            if ($('#back-addup').val() == 1 && parseInt($('#back-min-value').val()) == 0) {
                                displayMsg(ndPromptMsg, '返赠方案累计时最低消费额度不能为0', 2000);
                                return;
                            }

                            var discountName = $('#back-name').val();
                            var startDate = ($('#back-start-date').val() == '') ? 'all' : $('#back-start-date').val();
                            var endDate = ($('#back-end-date').val() == '') ? 'all' : $('#back-end-date').val();
                            var startTime = ($('#back-start-time').val() == '') ? 'all' : $('#back-start-time').val();
                            var endTime = ($('#back-end-time').val() == '') ? 'all' : $('#back-end-time').val();

                            setAjax(AdminUrl.favorableAddUrl, {
                                'type': 2,
                                'sale_name': discountName,                                  // 方案名称
                                'shop_id': JSON.stringify(shopAry),                         // 参与店铺
                                'beginTime': startDate,                                     // 开始日期
                                'endTime': endDate,                                         // 结束日期
                                'begin_time': startTime,                                    // 开始时间
                                'end_time': endTime,                                        // 结束时间
                                'menu_no': JSON.stringify(menuAry),                         // 返赠菜品
                                'sale_count': $('#back-value').val(),                       // 返赠数量
                                'sale_discount': $('#back-min-value').val(),                // 返赠最低消费额
                                'give_add': $('#back-addup option:selected').val(),         // 是否累计
                                'sale_power': $('#back-authorize option:selected').val(),   // 是否需要特殊授权
                                'sale_exec': runMode,                                       // 执行方式
                                'sale_status': $('#back-status option:selected').val()      // 执行状态
                            }, ndPromptMsg, function(respnoseText) {
                                var newRecord = '<tr id="'+ respnoseText.data +'">'+
                                                    '<td>'+ discountName +'</td>' +
                                                    '<td>'+ startDate +'</td>' +
                                                    '<td>'+ endDate +'</td>' +
                                                    '<td>'+ startTime +'</td>' +
                                                    '<td>'+ endTime +'</td>' +
                                                    '<td>'+
                                                        '<input type="button" data-type="edit" value="编辑"/>' +
                                                        '<input type="button" data-type="delete" value="删除"/>' +
                                                    '</td>' +
                                                '</tr>';
                                $('#back-table tr:eq(0)').after(newRecord);
                                $('#favorable-container').html('');
                                // 编辑返赠方案，删除返赠方案
                                editBack();
                            }, 1);
                        });
                    }, 1);
                });

                // 编辑返赠方案，删除返赠方案
                function editBack() {
                    $('#back-table').find('tr').each(function() {
                        var self = this;
                        // 返赠方案编辑
                        $(self).find('input[data-type="edit"]').unbind('click').bind('click', function() {
                            $('#favorable-container').html('');
                            setAjax(AdminUrl.favorableSaveShowUrl, {
                                'id': $(self).attr('id')
                            }, ndPromptMsg, function(respnoseText) {
                                // console.log(respnoseText);
                                $('#favorable-container').html($('#back-content').html());
                                $('#add-back').hide();

                                // 可选择内容
                                var data = respnoseText.data, shopContent = '', menuContent = '';
                                for (var i in data.shop) {
                                    shopContent += '<li data-select="0" data-key="'+ data.shop[i].mykey +'">'+ data.shop[i].value +'</li>';
                                }
                                for (var i in data.menu) {
                                    menuContent += '<li data-select="0" data-key="'+ data.menu[i].menu_no +'">'+ data.menu[i].menu_name +'</li>';
                                }

                                // 已选择内容
                                var shopShowContent = '', menuShowContent = '';
                                for (var i in data.sale) {
                                    $('#back-name').val(data.sale[i].sale_name);

                                    // 已选参与店铺
                                    if (data.sale[i].shop_id == 'all') {
                                        shopShowContent += '<li data-select="0" data-key="all">全部</li>';
                                    } else {
                                        for (var j in data.sale[i].shop_id ) {
                                            shopShowContent += '<li data-select="0" data-key="'+ data.sale[i].shop_id[j].mykey +'">'+ data.sale[i].shop_id[j].name +'</li>';
                                        }
                                    }
                                    $('#back-start-date').val(data.sale[i].start_date);
                                    $('#back-end-date').val(data.sale[i].end_date);
                                    $('#back-start-time').val(data.sale[i].start_time);
                                    $('#back-end-time').val(data.sale[i].end_time);

                                    // 已选返赠菜品
                                    for (var j=0; j<data.sale[i].sale_menu_no.length; j++) {
                                        menuShowContent += '<li data-select="0">'+ data.sale[i].sale_menu_no[j].name +'</li>';
                                    }
                                    $('#back-value').val(data.sale[i].sale_count).attr('disabled', true);
                                    $('#back-min-value').val(data.sale[i].sale_discount).attr('disabled', true);
                                    $('#back-addup').val(data.sale[i].give_add).attr('disabled', true);
                                    $('#back-authorize').val(data.sale[i].sale_power).attr('disabled', true);
                                    $('#back-run').val(data.sale[i].sale_exec);
                                    $('#back-status').val(data.sale[i].sale_status);
                                }

                                $('#set-back-shop').append(shopContent);
                                $('#set-back-menu').append(menuContent);
                                $('#show-back-shop').append(shopShowContent);
                                $('#show-back-menu').append(menuShowContent);

                                Favorable.isHaveEle('#set-back-shop', '#show-back-shop');
                                Favorable.isHaveEle('#set-back-menu', '#show-back-menu');
                                Favorable.selectList('#set-back-shop', '#show-back-shop');

                                // 返赠方案保存
                                $('#save-back').click(function() {
                                    var shopAry = [];

                                    // 返赠方案名称判断
                                    if ($('#back-name').val() == '') {
                                        displayMsg(ndPromptMsg, '方案名称不能为空', 2000);
                                        return;
                                    }

                                    // 选择店铺
                                    var selectShop = $('#show-back-shop li');
                                    if (selectShop.length == 0) {
                                        displayMsg(ndPromptMsg, '参与店铺不能为空', 2000);
                                        return;
                                    }
                                    for (var i=0; i<selectShop.length; i++) {
                                        shopAry.push($(selectShop[i]).attr('data-key'));
                                    }

                                    if (runMode == 1 && $('#back-authorize').val() == 1) {
                                        displayMsg(ndPromptMsg, '自动方案不需要特殊授权', 2000);
                                        return;
                                    }

                                    var runMode = $('#back-run option:selected').val();
                                    var discountName = $('#back-name').val();
                                    var startDate = ($('#back-start-date').val() == '') ? 'all' : $('#back-start-date').val();
                                    var endDate = ($('#back-end-date').val() == '') ? 'all' : $('#back-end-date').val();
                                    var startTime = ($('#back-start-time').val() == '') ? 'all' : $('#back-start-time').val();
                                    var endTime = ($('#back-end-time').val() == '') ? 'all' : $('#back-end-time').val();
                                    var status = $('#back-status option:selected').val();
                                    // 返赠方案编辑保存
                                    setAjax(AdminUrl.favorableSaveUrl, {
                                        'type': 2,
                                        'id': $(self).attr('id'),
                                        'sale_name': discountName,                                  // 方案名称
                                        'shop_id': JSON.stringify(shopAry),                         // 参与店铺
                                        'beginTime': startDate,                                     // 开始日期
                                        'endTime': endDate,                                         // 结束日期
                                        'begin_time': startTime,                                    // 开始时间
                                        'end_time': endTime,                                        // 结束时间
                                        'sale_discount': $('#back-min-value').val(),                // 最低消费额度
                                        'sale_exec': runMode,                                       // 执行方式
                                        'sale_status': status,                                      // 执行状态
                                        'sale_power': $('#back-authorize').val()                    // 是否需要特殊授权
                                    }, ndPromptMsg, function(respnoseText) {
                                        $('#favorable-container').html('');
                                        if (status == 1) {
                                            $(self).find('td:eq(0)').text(discountName);
                                            $(self).find('td:eq(1)').text(startDate);
                                            $(self).find('td:eq(2)').text(endDate);
                                            $(self).find('td:eq(3)').text(startTime);
                                            $(self).find('td:eq(4)').text(endTime);
                                        } else {
                                            $(self).remove();
                                        }
                                    });
                                });
                            }, 1);
                        });

                        // 返赠方案删除
                        $(self).find('input[data-type="delete"]').unbind('click').bind('click', function() {
                            setAjax(AdminUrl.favorableDelUrl, {
                                'id': $(self).attr('id')       
                            }, ndPromptMsg, function(respnoseText) {
                                $(self).remove();
                                $('#favorable-container').html('');
                            });
                        });
                    });
                }
                editBack();
            }, 1);
        },

        // 列表多选
        selectList: function(leftDom, rightDom) {
            $(leftDom).find('li').each(function() {
                $(this).unbind('click').bind('click', function() {
                    if ($(this).attr('data-select') == 0) {
                        $(this).addClass('select').attr('data-select', 1);
                        var that = $(this).clone();
                        that = that.removeClass('select').attr('data-select', 0);
                        that.appendTo($(rightDom));
                        if ($(this).text() == '全部') {
                            $(leftDom).find('li').not('[data-key=all]').removeClass('select').attr('data-select', 0);
                            $(rightDom).find('li').not('[data-key=all]').remove();
                        } else {
                            $(leftDom).find('li[data-key=all]').removeClass('select').attr('data-select', 0);
                            $(rightDom).find('li[data-key=all]').remove();
                        }
                    } else {
                        $(this).removeClass('select').attr('data-select', 0);
                        for (var i=$(rightDom).find('li').length - 1; i>=0; i--) {
                            if ($(this).text() == $($(rightDom).find('li')[i]).text()) {
                                $($(rightDom).find('li')[i]).remove();
                            }
                        }
                    }
                });
            });
        },

        // 查看包含元素
        isHaveEle: function(leftDom, rightDom) {
            for (var i=0; i<$(leftDom).find('li').length; i++) {
                for (var j=0; j<$(rightDom).find('li').length; j++) {
                    if ($($(leftDom).find('li')[i]).text() == $($(rightDom).find('li')[j]).text()) {
                        $($(leftDom).find('li')[i]).addClass('select').attr('data-select', 1);
                    }
                }
            }
        }
    }

    // 侧边栏菜单dt点击
    ndSide.delegate('dt', 'click', function() {
        var titleName = $(this).next('dd').text();
        ndSide.find('dd').hide().css('color', '#825543').find('img').remove();
        $(this).nextAll('dd').show();
        $(this).next('dd').prepend(jiantou).css('color', '#7B0F4F');
        $('#side-name').text(titleName);
        clickSideBody($(this).next('dd').attr('id'));
    });

    // 侧边栏菜单dd点击
    ndSide.delegate('dd', 'click', function() {
        var titleName = $(this).text();
        ndSide.find('dd').css('color', '#825543').find('img').remove();
        $(this).prepend(jiantou).css('color', '#7B0F4F');
        $('#side-name').text(titleName);
        clickSideBody($(this).attr('id'));
    });

    $('#side_tools').trigger('click');

    function clickSideBody(id) {
        switch (id) {
            case "side-tools-system": SystemTools.sideToolsSystem(); break;
            case "side-mac-update": Mac.displayMac(); break;
            case "side-discount": Discount.displayDiscount(); break;
            case "side-tools-purview": Purview.displayPurview(); break;
            case "side-tools-favorable": Favorable.displayFavorable(); break;
            case "side-tools-admin": SystemTools.sideToolsAdmin(); break;
            case "side-menu-defend": MenuDefend.sideMenuDefend(); break;
            case "side-menu-make": MenuMake.sideMenuMake(); break;
            case "side-special": Special.displaySpecial(); break;
            case "side-package": Package.displayPackage(); break;
            case "side-date-count": DateCount.displayDateCount(); break;
            case "side-menu-count": MenuCount.displayMenuCount(); break;
            case "side-pay-count": Pay.displayPay(); break;
        }
    }

});