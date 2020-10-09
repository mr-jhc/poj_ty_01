$(function () {
    var layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 选择文件
    $('#btnChooseImage').on('click', function () {
        $('#file').click();
    })

    // 2.选择图片
    $('#file').on('change', function (e) {
        var files = e.target.files;
        if (files.length === 0) {
            return layer.msg('请选择图片！')
        }
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 3.更改图片
    $('#btnUpload').on('click', function () {
        // 获取base64的图片  优点：减少不必要的请求
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        console.log(dataURL);
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL,
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('头像更换失败！')
                }
                layer.msg('头像更换成功！')
                window.parent.getUserInfo()
            }
        })
    })


    // 渲染默认头像
    getUserInfo();
    function getUserInfo() {
        // 发送ajax
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                console.log(res);
                // 判断状态码
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                //   渲染用户头像
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', res.data.user_pic)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            },

        })
    }
})