$(function() {
    // 昵称校验规则
    var form = layui.form;
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称长度为1~6位之间！"
            }
        }
    })

    //2. 初始化用户的基本信息
    initUserInfo();

    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 成功后渲染
                form.val('formUserInfo', res.data)
            }
        });
    }

    // 3.重置：给form表单绑定reset事件，给重置按钮绑click事件
    // 注意：不要给form绑成click，不要给button绑成reset
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        // 从新用户渲染
        initUserInfo()
    })

    // 4.提交用户信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        // 发送Ajax
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                // 判断
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 更新成功
                layer.msg('恭喜您，用户信息修改成功！')
                    // 调用父页面中的更新用户信息和头像方法
                window.parent.getUserInfo();
            }
        });
    })
})