$(function () {
    // 定义校验规则
    var form = layui.form;
    form.verify({
        // 1.密码
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 2.验证新旧密码不能重复
        somePwd: function (value) {
            // value是新密码，旧密码需要获取
            if (value == $('[name=oldPwd]').val()) {
                return '新密码不能喝旧密码一致'
            }
        },
        // 3.验证两次新密码是不是一致
        rePwd: function (value) {
            // value是再次输入的密码，新密码需要再次获取
            if (value !== $('[name=newPwd]').val()) {
                return '两次新密码不一致'
            }
        }
    });

    // 表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('抱歉，密码修改失败！')
                }
                layui.layer.msg('恭喜您，密码修改成功！');
                // 原生js重置密码
                $('.layui-form')[0].reset();
            }
        })
    })
})