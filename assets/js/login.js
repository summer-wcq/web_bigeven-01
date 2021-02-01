$(function() {
    // 1.点击按钮 显示隐藏
    $('#link_reg').on('click', function() {
        $('.login').hide()
        $('.reg').show()
    })
    $('#link_login').on('click', function() {
        $('.login').show()
        $('.reg').hide()
    })

    // 2.自定义校验规则
    var form = layui.form;
    var layer = layui.layer
    form.verify({
        // 属性就是定义的规则名称
        pwd: [
            // 数组中第一个元素1，正则
            /^[\S]{6,12}$/,
            // 数组中第二个元素2，报错
            '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码规则
        repwd: function(value) {
            // 选择器必须带空格，选择的是后代中的input,name属性值
            var pwd = $('.reg input[name=password]').val().trim()
                //    比较
            if (value !== pwd) {
                return '；两次密码输入不一致'
            }
        }
    });

    // 3.注册
    $('#form_reg').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/api/reguser",
            data: {
                username: $('.reg [name=username]').val(),
                password: $('.reg [name=password]').val(),
            },
            success: function(res) {
                // 返回判断状态
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 提交成功后处理代码
                layer.msg('注册成功，请前往登录')
                    // 手动切换到登录表单
                $('#link_login').click();
                // 重置form表单
                $('#form_reg')[0].reset()
            }
        });
    })

    // 4.登录功能 （给form标签绑定事件，button按钮触发提交事件）
    $('#form_login').on('submit', function(e) {
        // 阻止默认提交
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 成功
                layer.msg('登录成功')
                    // 跳转
                location.href = '/index.html'; //绝对路径
                // 保存token，未来的接口要使用token
                localStorage.setItem('token', res.token)
            }

        });
    })
})