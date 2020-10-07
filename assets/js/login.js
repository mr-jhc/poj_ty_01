$(function () {
    // 点击去注册的界面
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    // 点击去登录的界面

    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 自定义验证规则
    var form = layui.form;
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码规则
        repwd: function (value) {
            // 选择器必须带空格，选择的是后代中的input，name属性值，为password的那个标签
            var pwd = $(".reg-box input[name=password]").val()
            // 比较
            if (value !== pwd) {
                return "两次密码输入不一致"
            }
        }
    });
    // 3.注册功能
    var layer = layui.layer
    $('#form_reg').on("submit", function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            method: "POST",
            url: '/api/reguser',
            data: {
                username: $(".reg-box [name=username]").val(),
                password: $(".reg-box [name=password]").val()
            },
            success: function (res) {
                // 返回状态判断
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 提交成功后处理代码
                layer.msg(res.message)
                // 提示完成以后自己手动点击
                $("#link_login").click()
            }
        })
    })
    $('#form_login').on("submit", function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            method: "POST",
            url: '/api/login',
            // 获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                // 返回状态判断
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 提交成功后处理代码
                layer.msg("登陆成功")
                //    存储token字符串保存到localStorage中
                localStorage.setItem('token', res.token)
                // 页面跳转
                location.href = "/index.html"
            }
        })
    })
})