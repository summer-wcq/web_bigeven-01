// 入口函数
$(function() {
    // 定义密码规则（3个）
    var form = layui.form
    form.verify({
        // 所有密码
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 新密码
        newPwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新密码和旧密码不能相同！'
            }
        },
        // 确认新密码
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次新密码输入不一致！'
            }
        }
    })

    // 2.修改密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('修改密码成功！')
                $('.layui-form')[0].reset();
            }
        });
    })
})