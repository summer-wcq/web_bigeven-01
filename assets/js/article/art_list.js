// 入口函数
$(function() {
    // 定义美化时间过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 1.定义查询参数对象，将来查询文章使用
    var q = {
        pagenum: 1, //int 页码值
        pagesize: 2, //int 每页显示多少条数据
        cate_id: "", //string 文章分类的 Id
        state: "", //文章的状态，可选值有：已发布、草稿
    };

    // 渲染文章列表
    var layer = layui.layer;
    initTable();
    // 2.获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl_table', res)
                $('tbody').html(htmlStr)
                    // 调用分页
                renderPage(res.total)
            }
        });
    }

    // 3.初始化分类
    var form = layui.form; //导入form
    initCate(); //调用函数
    // 封装
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                // 校验
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 赋值
                var str = template('tpl-cate', res);
                $('[name=cate_id]').html(str);
                form.render();
            }
        });
    }

    // 4.为表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val();
        // 赋值
        q.state = state;
        q.cate_id = cate_id;
        // 初始化文章列表
        initTable();
    })

    // 5.分页
    var laypage = layui.laypage;

    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //每页显示多少条数据的选择器
            // 触发jump：分页初始化的时候，页码改变的时候
            jump: function(obj, first) {
                console.log(first, obj.curr, obj.limit); //得到当前页
                // 改变当前页
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                }
            }
        });
    }

    // 6.删除
    $('tbody').on('click', '.btn-delete', function() {
        // 6.1先获取id 进入到函数中this代指就改变了
        var Id = $(this).attr('data-id');
        // 6.1显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('恭喜您，文章删除成功!');
                    // 删除以后页面中还有一天，时候他数据库里面没有这一条数据了
                    // 当前页-1满足两个条件：页面中只有一个元素了。当前页大于1
                    if ($('.btn-delete').length === 1 && q.pagenum >= 2) q.pagenum--
                        // 更新成功，重新渲染页面数据
                        initTable();

                }
            });
            layer.close(index);
        });
    })
})