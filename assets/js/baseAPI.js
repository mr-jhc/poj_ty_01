// 注意：每次调用$.ajax()、$post()、$get()的时候，会先调用ajaxPrefilter
// 这个函数，在这个函数中，可以拿到我们给Ajax提供的配对
$.ajaxPrefilter(function (options) {
    // 在发起真正的ajax请求之前，统一拼接请求的根目录
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})