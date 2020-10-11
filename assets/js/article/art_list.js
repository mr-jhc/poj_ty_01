$(function () {
    //导入form
    var form = layui.form
    var laypage = layui.laypage;

    // 美化事件过滤器
    template.defaults.imports.dataFormat = function (date) {
        var dt = new Date(date);
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }
    // 定义提交参数
    // 定义了一个查询的参数对象，将来请求参数的时候，
    // 需要将请求参数对象传入到服务器
    var q = {
        pagenum: 1,    //页码值    默认是1
        pagesize: 2,    //每页几条数据     默认是2
        cate_id: '',      //文章分类的id
        state: '',       //文章的发布状态
    }

    // 初始化文章列表
    initTable();

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                var str = template('tpl-table', res);
                $('tbody').html(str);
                // 渲染文章分页
                renderPage(res.total)
            }
        })
    }

    // 初始化分类
    var form = layui.form; // 导入form
    initCate();

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 赋值,渲染form
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通知layui 重新渲染表单UI的区域
                form.render();
            }
        })
    }

    // 为表单绑定 submit 事件
    $("#form-search").on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    // 分页
    function renderPage(total) {
        // 调用layage.render（）方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',    //分页容器的id
            count: total,       //总数据条数
            limit: q.pagesize,    //显示每页有几条数据
            curr: q.pagenum,   //设置默认被选中的分页

            // 分页模块设置，显示那些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 7],   //每页显示多少条数据的选择器
            // jump  触发的方法：
            // 1.点击页码的时候，会触发 jump 方法
            // 2.只要调用了 laypage.render() 方法，就会触发jump 方法

            jump: function (obj, first) {
                // obj包含了当前分页的所有参数
                console.log(first, obj.curr, obj.limit); //得到当前页
                //把最新的页码值赋值给 q 查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值给q 这个查询参数的对象
                q.pagesize = obj.limit
                // 根据新的 q 获取对应的数据列比表，并渲染
                if (!first) {
                    initTable()
                }


            }
        })


    }
    // 给删除按钮绑定事件
    var layer = layui.layer
    $('tbody').on('click', '.btn-delete', function () {
        // 先获取id，再进入函数中，this代指就改变了
        var Id = $(this).attr('data-id')
        // 显示对话框
        layer.confirm('确定要删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: "/my/article/delete/" + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }

                    layer.msg(res.message)
                    // 文章删除成功，判断当前页面的条数
                    // 页面汇总删除按钮个数等于1，页码大于1；
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }
                    // 删除成功，更新页面
                    initTable()
                }
            })
            layer.close(index);
        });

    })
})
