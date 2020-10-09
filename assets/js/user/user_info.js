$(function () {
    // 自定义校验数据
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为 1 ~ 6位之间！"
            }
        }
    });

    // 初始化用户信息
    initUserInfo();
    // 初始化用户信息封装，后面还要用
    var layer = layui.layer;
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // console.log(res);
                // 成功之后渲染
                form.val("formUserInfo", res.data)
            }
        })
    }

    // 表单重置
    $("#btnReset").on("click", function (e) {
        e.preventDefault();
        initUserInfo();

    });
    // 4.修改用户信息
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 成功
                layer.msg("恭喜您，修改用户信息成功！");
                // 调用父框架的全局方法
                window.parent.getUserInfo()
            }
        })
    })
})