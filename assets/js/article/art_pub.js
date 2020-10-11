$(function () {

    // 初始化分类
    var form = layui.form
    var layer = layui.layer
    initCate()
    // 封装分类函数

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }

    // 2.初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面绑定事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 监听coverFile ，绑定change事件，获取到图片列表
    $('#coverFile').on('change', function (e) {
        // 获取获得图片的列表
        var files = e.target.files
        // 判断用户是否选择了图片
        if (files.length === 0) {
            return '请选择照片~'
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布';
    // 为设置草稿绑定事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    // 添加文章
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 创建FormData对象，收集数据
        var fd = new FormData(this)
        // 放入状态
        fd.append('state', art_state)
        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // fd.forEach(function (value, key) {
                //     console.log(key, value);
                // })
                // 文章发布
                publishArticale(fd);
            })
    });

    function publishArticale(fd) { 
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) { 
                if (res.status !== 0) { 
                    return layer.msg('添加失败！')
                }
                // 跳转页面
                layer.msg("恭喜您，添加文章成功，跳转中...")
                setTimeout(function () {
                    window.parent.document.querySelector('#art_list').click();
                }, 1500);

            }
        })
    }
})