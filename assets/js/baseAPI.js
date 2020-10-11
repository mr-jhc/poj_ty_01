// 开发环境服务器地址
var baseURL = "http://ajax.frontend.itheima.net";
// 注意：每次调用$.ajax()、$post()、$get()的时候，会先调用ajaxPrefilter
// 这个函数，在这个函数中，可以拿到我们给Ajax提供的配对
$.ajaxPrefilter(function (params) {
    // 在发起真正的ajax请求之前，统一拼接请求的根目录
    params.url = baseURL + params.url;

    // 2.设置权限  要是以/my/开头的就设置权限
    if (params.url.indexOf('/my/') !== -1) {
        params.headers = {
            // 重新登陆，因为token过期事件12小时
            Authorization: localStorage.getItem('token') || ""
        }
    }
    // 拦截所有响应，判断身份认证
    params.complete = function (res) {
        // console.log(res);
        var obj = res.responseJSON
        if (obj.status === 1 && obj.message === "身份认证失败！") {
            // 1.删除本地的token
            localStorage.removeItem("token");
            // 2.页面跳转
            location.href = '/login.html'
        }
    }
})
