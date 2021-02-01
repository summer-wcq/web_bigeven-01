$(function() {

    var layer = layui.layer;
    var form = layui.form;
    // 1.获取文章分类的列表
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                console.log(res);
                var htmlStr = template('tpl-table', res) //传的是对象，用的是属性
                $('tbody').html(htmlStr)
            }
        });
    }

    // 2.显示添加区域
    var layer = layui.layer;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '260px'],
            title: '添加文章分类',
            content: $('#tpl-add').html()
        });
    })

    // 3.提交添加文章分类
    // 弹出层是后添加的，父盒子就是body
    // 弹框创建和删除不在同一函数中，所以设置为全局函数
    var indexAdd = null;
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                // 判断状态码
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                // 弹出提示，刷新列表 关闭弹窗
                initArtCateList()
                layer.msg('恭喜您，添加成功！')
                layer.close(indexAdd)
            }
        });
    })

    // 4.显示修改form表单
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
            // 4.1利用框架代码，显示提示添加文章类别区域
            indexEdit = layer.open({
                type: 1,
                area: ['500px', '260px'],
                title: '修改文章分类',
                content: $('#tpl-edit').html()
            });
            // 4.2获取自定义属性和发送Ajax都要写到click事件里
            var Id = $(this).attr('data-id');
            $.ajax({
                method: "GET",
                url: "/my/article/cates/" + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    // 赋值
                    form.val('form-edit', res.data)
                }
            });
        })
        // 5.修改
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                // 判断状态码
                if (res.status !== 0) {
                    return layer.msg('res.message')
                }
                // 弹出提示，刷新列表 关闭弹窗
                initArtCateList()
                layer.msg('恭喜您，文章类别更新成功！')
                layer.close(indexEdit)
            }
        });
    })

    // 6.删除
    $('tbody').on('click', '.btn-delete', function() {
        var Id = $(this).attr('data-id');
        // 先是对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // layer.close(index);
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList()
                    layer.msg('恭喜您，文章类别删除成功！')
                    layer.close(index)
                }
            });
        });

    })
})