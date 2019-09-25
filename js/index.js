var $ = layui.$
layui.use('element', function() {
	var element = layui.element;

});
layui.use('layim', function(layim) {
	//基础配置
	layim.config({

		init: {
			mine: {
				username: "客服姐姐",
				id: "100000",
				status: "online",
				sign: "一叶一世界，一界三千叶。",
				avatar: "http://tva2.sinaimg.cn/crop.0.0.512.512.180/005LMAegjw8f2bp9qg4mrj30e80e8dg5.jpg"
			}
		},
		title: '客服姐姐',
		isfriend: false,
		isgroup: false,
		copyright: true,
		skin: [

		],
		members: {
			url: '' //接口地址（返回的数据格式见下文）
				,
			type: 'get' //默认get，一般可不填
				,
			data: {} //额外参数
		}

		//上传图片接口（返回的数据格式见下文），若不开启图片上传，剔除该项即可
		,
		uploadImage: {
			url: '' //接口地址
				,
			type: 'post' //默认post
		}

		//上传文件接口（返回的数据格式见下文），若不开启文件上传，剔除该项即可
		,
		uploadFile: {
			url: '' //接口地址
				,
			type: 'post' //默认post
		}
		//扩展工具栏，下文会做进一步介绍（如果无需扩展，剔除该项即可）

		,
		tool: [{
				alias: 'code' //工具别名
					,
				title: '代码' //工具名称
					,
				icon: '&#xe64e;' //工具图标，参考图标文档
			}]

			,

		//msgbox: layui.cache.dir + 'css/modules/layim/html/msgbox.html' //消息盒子页面地址，若不开启，剔除该项即可
		//find: layui.cache.dir + 'css/modules/layim/html/find.html' //发现页面地址，若不开启，剔除该项即可
		chatLog: layui.cache.dir + 'css/modules/layim/html/chatlog.html' //聊天记录页面地址，若不开启，剔除该项即可
	});
	//监听自定义工具栏点击，以添加代码为例
	layim.on('tool(code)', function(insert, send, obj) { //事件中的tool为固定字符，而code则为过滤器，对应的是工具别名（alias）
		layer.prompt({
			title: '插入代码',
			formType: 2,
			shade: 0
		}, function(text, index) {
			layer.close(index);
			insert('[pre class=layui-code]' + text + '[/pre]'); //将内容插入到编辑器，主要由insert完成
			//send(); //自动发送
		});
		//console.log(this); //获取当前工具的DOM对象
		//console.log(obj); //获得当前会话窗口的DOM对象、基础信息

	});
	//layim.msgbox(0);
	var socket = io.connect('http://127.0.0.1:5000/socket');
	socket.on('socket_connect', function(response) {

	});
	socket.on('message_admin', function(response) {
		layim.getMessage(response);
	});
	layim.on('sendMessage', function(info) {
		var data = {
			username: encodeURI(info.mine.username) //消息来源用户名
				,
			avatar: info.mine.avatar //消息来源用户头像
				,
			id: info.mine.id //消息的来源ID（如果是私聊，则是用户id，如果是群聊，则是群组id）
				,
			type: info.to.type //聊天窗口来源类型，从发送消息传递的to里面获取
				,
			content: encodeURI(info.mine.content) //消息内容
				,
			cid: 0 //消息id，可不传。除非你要对消息进行一些操作（如撤回）
				,
			mine: false //是否我发送的消息，如果为true，则会显示在右方
				,
			fromid: info.mine.id //消息的发送者id（比如群组中的某个消息发送者），可用于自动解决浏览器多窗口时的一些问题
				,
			timestamp: new Date().getTime() //服务端时间戳毫秒数。注意：如果你返回的是标准的 unix 时间戳，记得要 *1000
				,
			toid: info.to.id
		}
		socket.emit('message_user', data)
	})
});