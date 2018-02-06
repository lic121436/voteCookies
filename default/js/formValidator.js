//表单验证
		$(function () {
        $('.form-horizontal').bootstrapValidator({
　　　　　　　　message: 'This value is not valid',
            　feedbackIcons: {
                　　　　　　　　valid: 'glyphicon glyphicon-ok',
                　　　　　　　　invalid: 'glyphicon glyphicon-remove',
                　　　　　　　　validating: 'glyphicon glyphicon-refresh'
            　　　　　　　　   },
            fields: {
                username: {
                    message: '姓名验证失败',
                    validators: {
                        notEmpty: {
                            message: '姓名不能为空'
                        }
                    }
                },
                tel: {
                    validators: {
                        notEmpty: {
                            message: '手机号不能为空'
                        },
						regexp: {
                            regexp: /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/,
                            message: '手机号码格式不正确'
                        }
                    }
                },
				content: {
                    validators: {
                        notEmpty: {
                            message: '留言内容不能为空'
                        }
                    }
                }
            }
        });
			
    });
	$('#message-submit').submit(function() {
		$('.form-horizontal').bootstrapValidator('validate');
		//隐藏留言表单
		$(".message-submit").addClass('hidden-xs hidden-sm');
		//显示留言内容窗口
		$(".vote-message").removeClass('hidden-xs hidden-sm');
	});