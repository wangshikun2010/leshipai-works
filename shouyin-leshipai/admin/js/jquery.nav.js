var ndPromptMsg = $('#prompt-message'),                         // 页面提示条
    ndAlertProMsg = $('#alert-prompt-message'),                 // 弹出框提示条
    ndSideBody = $('#side-body'),                               // 显示内容
    ndSide = $('#side'),                                        // 导航栏
    ndBanner = $('#banner'),                                    // 页面头部
    ndFooter = $('#footer'),                                    // 页面脚部
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
        setAjax(AdminUrl.logoutUrl, null, ndAlertProMsg, function(respnoseText) {
            layer.close(layerBox);
            displayMsg(ndPromptMsg, '页面加载中...请稍后...', 30000);
            window.location.replace(indexUrl);
        });
    });
});

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
    if (titleName == '套餐') {
        $('#side-name').text(titleName + ' (套餐所属菜品都已计入菜品分类)');
    } else {
        $('#side-name').text(titleName);
    }
    clickSideBody($(this).attr('id'));
});

// $('#side_tools').trigger('click');

// 菜品估清
function sideMenu(id) {
    setAjax(AdminUrl.menuShowUrl, {
        'menu_type': id
    }, ndPromptMsg, function(respnoseText) {
        var content = '';
        for (var i=0; i<respnoseText.data.length; i++) {
            if (respnoseText.data[i].status == 1) {
                content += '<li class="gray"><p>'+ (i+1) + respnoseText.data[i].menu_name + '</p><input type="checkbox" value="' + respnoseText.data[i].menu_no + '" name="menu_no" checked></li>';
            } else {
                content += '<li><p>' + (i+1) + respnoseText.data[i].menu_name +  '<p><input type="checkbox" value="' + respnoseText.data[i].menu_no + '" name="menu_no"></li>';
            }
        }
        if (!content) {
            content += '<li>当前分类没有菜品</li>';
        } else {
            content += '<li><input type="hidden" name="menu_type" id="menu_type" value="' + id + '" /><input type="submit" value="保存数据" id="guqing" class="btn"/></li>';
        }
        ndSideBody.html('<ul id="menu-guqing" class="menu-msg">' + content + '</ul>');
        
        $('#menu-guqing').find('li').hover(function() {
            $(this).addClass('gray');
        }, function() {
            if (!$(this).find('input[type=checkbox]').prop('checked')) {
                $(this).removeClass('gray');
            }
        });

        $('#guqing').click(function() {
            displayMsg(ndPromptMsg, '数据保存中...请稍候...', false, function() {
                $(this).prop('disabled', true);
            });

            var menu_no = [];
            $('[name=menu_no][type=checkbox]:checked').each(function() {
                menu_no.push($(this).val());
            });

            $.ajax({
                type: 'POST',
                url: AdminUrl.menuSetupUrl,
                data: {
                    'menu_no': menu_no,
                    'menu_type': $('#menu_type').val()
                },
                dataType: 'json',
                timeout: 30000,
                error: function() {
                    displayMsg(ndPromptMsg, '请求服务器失败，请重试！', 2000, function() {
                        $('#guqing').prop('disabled', false);
                    });
                },
                success: function(respnoseText) {
                    $('#guqing').prop('disabled', false);

                    if (respnoseText.status != 200) {
                        displayMsg(ndPromptMsg, respnoseText.description, 2000);
                        return;
                    }
                    displayMsg(ndPromptMsg, '数据保存成功', 500);
                }
            });
        });
    }, 1);
}

// 菜品销售
function sideSale(id) {
    var myDate = new Date();
    var Month = myDate.getMonth() + 1;
    if (Month < 10){
        Month = '0' + Month;
    }
    var userDate = myDate.getFullYear() + '-' + Month + '-' + myDate.getDate();

    setAjax(AdminUrl.menuSaleShowUrl, {
        'menu_type': id,
        'create_time': userDate
    }, ndPromptMsg, function(respnoseText) {
        var content = '<li id="select-date">选择日期：<input id="dateTime" type="text" size="10" value="' + userDate + '"> <img onclick="WdatePicker({el:$dp.$(\'dateTime\')})" src="./static/DatePicker/skin/datePicker.gif" width="16" height="22" align="absmiddle">  <input type="button" value="查询" id="chaxun" class="btn"></li><ul id="find-content">';
        for (var i=0; i<respnoseText.data.length; i++) {
            content += '<li><p>' + (i+1) + respnoseText.data[i].menu_name + '</p>' + respnoseText.data[i].menu_count + '</li>';
        }

        if (!content) {
            content += '<li>当前分类没有菜品</li>';
        } else {
            content += '</ul>';
        }
        ndSideBody.html('<ul id="menu-sale" class="menu-msg">' + content + '</ul>');
        $('#menu-sale').find('li').hover(function() {
            $(this).addClass('gray');
        }, function() {
            $(this).removeClass('gray');
        });

        $("#chaxun").click(function(){
            var create_time = $("#dateTime").val();
            setAjax(AdminUrl.menuSaleShowUrl, {
                'menu_type': id,
                'create_time': create_time
            }, ndPromptMsg, function(respnoseText) {
                var main = '';
                for (var j=0; j<respnoseText.data.length; j++) {
                    main += '<li>' + (j+1) + '<p>' + respnoseText.data[j].menu_name + '</p>' +respnoseText.data[j].menu_count + '</li>';
                }
                if (!main) {
                    main += '<li>当前分类没有菜品</li>';
                }
                $('#find-content').html(main);
            }, 1);
        });
    }, 1);
}

// 打印设置
function sideToolsPrint() {
    setAjax(AdminUrl.printShowUrl, null, ndPromptMsg, function(respnoseText) {
        var content = '';
        var printer = respnoseText.data.printer;

        for (var i=0; i<printer.length; i++) {
            var ip = '', com = '', lpt = '';
            if (printer[i].type == 'ip') {
                ip = ' selected="selected"';
            } else if (printer[i].type == 'com') {
                com = ' selected="selected"';
            } else if (printer[i].type == 'lpt') {
                lpt = ' selected="selected"';
            }
            content += '<li>菜品打印机' + printer[i].name + '：'+
                            '<select name="printer_' + printer[i].name + '" id="printer_' + printer[i].name + '">'+
                                '<option value="ip"' + ip + '>网络</option><option value="com"' + com + '>串口</option>'+
                                '<option value="lpt"' + lpt + '>并口</option>'+
                            '</select>'+
                            '<input type="text" value="' + printer[i].add + '" name="printer_'+ printer[i].name + '_add" id="printer_' + printer[i].name + '_add"/></li>';
        }
        content += '<li>打印机端口 ：<input type="text" id="port" value="' + respnoseText.data.port + '"></li>';
        content += '<li><input type="submit" id="print_sub" class="btn" value="保存数据"/></li>';
        ndSideBody.html('<ul id="print-msg" class="menu-msg">' + content + '</ul>');

        $('#print_sub').click(function() {
            displayMsg(ndPromptMsg, '数据保存中...请稍候...', false, function() {
                $(this).prop('disabled', true);
            });
            var printer_new = [];
            $('select').each(function() {
                var selected_name = $(this).prop('name').split('_');
                if (selected_name[0] == 'printer') {
                    selected_name = selected_name.pop();
                    var sele = $(this).children('option:selected').val();
                    printer_new.push('{"name":"' + selected_name + '","type":"' + sele + '","add_' + sele + '":"' + $('#printer_' + selected_name + '_add').val() + '"}');
                }
            });
    
            $.ajax({
                type: "POST",
                url: AdminUrl.printSetupUrl,
                data: {
                    'printer': printer_new,
                    'printer_port': $('#port').val()
                },
                ifModified: true,
                dataType: "json",
                timeout: 30000,
                error: function() {
                    displayMsg(ndPromptMsg, '请求服务器失败，请重试！', 2000, function() {
                        $('#print_sub').prop('disabled', false);
                    });
                },
                success: function(respnoseText) {
                    $('#print_sub').prop('disabled', false);
                    if (respnoseText.status != 200) {
                        displayMsg(ndPromptMsg, respnoseText.description, 2000);
                        return;
                    }
                    displayMsg(ndPromptMsg, '数据保存成功', 500);
                }
            });
        });
    }, 1);
}

// 系统信息
function sideToolsSystem() {
    setAjax(AdminUrl.indexInfoUrl, null, ndPromptMsg, function(respnoseText) {
        ndSideBody.html(
                '<ul id="system-msg" class="menu-msg"><li>欢迎登陆管理系统：' + loginname + '</li>' +
                '<li>安卓点菜软件版本：' + respnoseText.data.soft + '</li>' +
                '<li>在售菜品数据版本：' + respnoseText.data.menu + '</li>' +
                '<li>在售菜品更新时间：' + respnoseText.data.menu_time + '</li></ul>');
    }, 1);
}

// 联系管理
function sideToolsAdmin() {
    ndSideBody.html($('#contact-msg').html());
}