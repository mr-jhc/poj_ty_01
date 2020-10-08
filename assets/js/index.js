// 入口函数
$(function () {
    // 获取用户信息
    getUserInfo();
    // 退出登录
    $("#btnLogout").on('click', function () {
        layer.confirm('是否确定退出登录', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1.删除本地存储的token
            localStorage.removeItem("token")
            // 2.切换到login页面
            location.href = "/login.html"
            // 退出自己询问框
            layer.close(index);
        });
    })
});

// 获取用户信息（封装到入口函数的外面）
// 原因：后面其他的页面都要调用
function getUserInfo() {
    // 发送ajax
    $.ajax({
        url: '/my/userinfo',
        headers: {
            // 重新登陆，因为token过期事件12小时
            Authorization: localStorage.getItem('token') || ""
        },
        success: function (res) {
            console.log(res);
            // 判断状态码
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            // 请求成功，渲染头部信息
            renderAvatar(res.data);
        },
        // 无论是成功还是失败，都会触发complete方法
        // complete: function (res) {
        //     console.log(res);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === "获取用户基本信息成功！") {
        //         // 1.删除本地的token
        //         localStorage.removeItem("token");
        //         // 2.页面跳转
        //         location.href = '/login.html'
        //     }
        // }
    })
}
// 封装用户头像渲染函数
function renderAvatar(user) {
    // 1.用户名（昵称优先，没有用username）
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name)
    // 2.用户头像
    if (user.user_pic !== null) {
        // 有头像
        $(".layui-nav-img").show().attr("src", user.user_pic)
        $('.user-avatar').hide();
    } else {
        // 没有头像
        $(".layui-nav-img").hide();
        var text = name[0].toUpperCase();
        $('.user-avatar').show().html(text);
    }
}