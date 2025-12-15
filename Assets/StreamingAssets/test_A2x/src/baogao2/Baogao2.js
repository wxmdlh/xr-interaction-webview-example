AnnieRoot.baogao2= AnnieRoot.baogao2||{};
AnnieRoot.baogao2.Baogao2= function(){
	var s=this;
	annie.Sprite.call(s);
	/*_a2x_need_start*/s.bt_download=null;s.bt_home=null;s.mc_hua=null;/*_a2x_need_end*/
	annie.initRes(s,"baogao2","Baogao2");
	s.name='baogao2';
	var Btn_List=[
		s.bt_home,
		s.bt_download,
	]
	for(var i=0;i<Btn_List.length;i++){
		Btn_List[i].visible=false;//关闭
		Btn_List[i].mouseChildren=false;
		Btn_List[i].addEventListener(annie.MouseEvent.MOUSE_OVER,fun_over);
		Btn_List[i].addEventListener(annie.MouseEvent.MOUSE_OUT,fun_out);
	}
	s.addEventListener(annie.MouseEvent.CLICK,function (e) {
		switch (e.target.name){
			case 'bt_home':
				Num_step=0;
				fun_loadSence(Arr_step[Num_step],'M');
				break;
			case 'bt_download':
				Fun_DownLoad();//下载总报告
				break;
		}
	});
	s.addEventListener(annie.Event.ADD_TO_STAGE,function (e) {
		show_step_name('实验报告');//更改步骤名*
		SC();//计算成绩
		//Fun_List();//生成列表

		//第三方报告
		var iframe = document.createElement("iframe");
		iframe.style.width = "1920px";
		iframe.style.height = "1000px";
		iframe.setAttribute('frameborder','0');
		iframe.src="./baogao3/report.html";

		var floatDisplay=new annie.FloatDisplay();
		floatDisplay.init(iframe);
		s.addChild(floatDisplay);
		//floatDisplay.y=100;//偏移
		//floatDisplay.scaleX=floatDisplay.scaleY=0.67;
		floatDisplay.width=1920;
		floatDisplay.height=1000;
		//floatDisplay.alpha=0.4;//
		floatDisplay.y=80;

		//document.getElementById('_a2x_canvas').getContext('2d', { willReadFrequently: true })
		iframe.addEventListener('error', (event) => {
			console.error('iframe-加载失败', event);
		});
		window.Flas_load=true;//预防iframe未加载出来 再加载一次
		iframe.onload = function() {
			console.log('iframe-加载完成 (通过onload属性)');
			if(Flas_load){
				Flas_load=false;
				iframe.src="./baogao3/report.html";
			}
		};

		/*var img = new Image();
		img.src="首页.png";
		var fl=new annie.FloatDisplay();
		fl.init(img);
		//fl.x=s.stage.viewRect.width - 110;
		//fl.y=s.stage.viewRect.y + 50;
		fl.x=1206 - 32;
		fl.y=61 - 32;
		fl.scaleX=fl.scaleY=0.75;
		s.addChild(fl);
		fl.htmlElement.addEventListener('mouseover',function () {
			document.body.style.cursor="pointer";//手型
			fl.scaleX=fl.scaleY=0.76;
		});
		fl.htmlElement.addEventListener('mouseout',function () {
			document.body.style.cursor="default";//默认
			fl.scaleX=fl.scaleY=0.75;
		});
		fl.htmlElement.addEventListener('click',function () {
			fun_goHome();
		});
		function fun_goHome(){
			sound_click.play();//点击声
			s.stage.addChild(new home.Home());
			s.stage.removeChild(s);
			document.body.style.cursor="default";//默认
		}

		var logo = new Image();
		logo.src="logo-zh.png";
		var fl_logo=new annie.FloatDisplay();
		fl_logo.init(logo);
		fl_logo.x=30;
		fl_logo.y=31;
		fl_logo.scaleX=fl_logo.scaleY=0.75;
		s.addChild(fl_logo);
		*/
	});

/*
	var pageList=[baogao2.Item];//组件库
	var now_y=0;//列表高度1
	var view=new annie.Sprite();
	var sp=new annieUI.ScrollPage(view,1830,885,0,now_y);
	s.addChild(sp);//将组件添加到舞台
	s.addChild(s.mc_hua);//滑动条-置顶
	s.mc_hua.mc_kuai.y=0;
	sp.x=55;
	sp.y=105;
	sp.addEventListener(annie.Event.ON_SCROLL_ING,function (e) {
		sp.view.x=0;
		Up_hua();//刷新滑动条
	});

	//生成列表
	function Fun_List() {
		var Num_yi=35;//少个选项 向上偏移
		for(var i in Ti_Arry){
			var obj=Ti_Arry[i];
			var p=new pageList[0];
			p.txt_title.text=i+'、'+obj.T;//考题
			view.addChild(p);
			p.y = now_y;
			for(var j=1;j<=8;j++){
				if(obj[fun_NumToString(j)]){
					p['txt_'+j].text = fun_NumToString(j)+'、'+obj[fun_NumToString(j)];//考题
				}else{
					p['txt_'+j].text='';
					p.txt_youxuan.y -= Num_yi;//向上位移
					p.txt_Answer.y -= Num_yi;
					p.mc_line.y -= Num_yi;
					now_y -= Num_yi;
				}
			}
			p.txt_youxuan.text='您的选择：'+(obj.youxuan||'-');
			p.txt_Answer.text='参考答案：'+obj.Answer;
			now_y += 500+30;//间隔30
		}
		for(var i in Ti_Arry_kehou){
			var obj=Ti_Arry_kehou[i];
			var p=new pageList[0];
			p.txt_title.text='课后-'+i+'、'+obj.T;//考题
			view.addChild(p);
			p.y = now_y;
			for(var j=1;j<=8;j++){
				if(obj[fun_NumToString(j)]){
					p['txt_'+j].text = fun_NumToString(j)+'、'+obj[fun_NumToString(j)];//考题
				}else{
					p['txt_'+j].text='';
					p.txt_youxuan.y -= Num_yi;//向上位移
					p.txt_Answer.y -= Num_yi;
					p.mc_line.y -= Num_yi;
					now_y -= Num_yi;
				}
			}
			p.txt_youxuan.text='您的选择：'+(obj.youxuan||'-');
			p.txt_Answer.text='参考答案：'+obj.Answer;
			now_y += 500+30;//间隔30
		}

		//结果判断*
		var p=new baogao2.Item2()
		view.addChild(p);
		p.txt_input.text = '结果判断：';//随机结果 首尾呼应
		p.txt_input.color='#FFFFFF';
		p.y = now_y;
		now_y+=40;//暂时固定高度

		var p=new baogao2.Item1()
		view.addChild(p);
		p.gotoAndStop(Flag_jieguo);//随机结果 首尾呼应
		p.y = now_y;
		now_y+=400;//
		for(var i=1;i<=4;i++){
			var p=new baogao2.Item2()
			view.addChild(p);
			p.txt_input.text = ['【正常样本1、2】','【待测样本1】','【待测样本2】','【待测样本3】'][i-1]+'\n'+'您的答案：'+(DaTa_All[14][i]||'未输入');//随机结果 首尾呼应
			p.txt_input.color='#FFFFFF';
			p.y = now_y;
			now_y+=(p.txt_input.text.length/75>>0)*40+40;//暂时固定高度
			now_y+=30;

			//var p2=new baogao2.Item3()
			//view.addChild(p2);
			//p2.gotoAndStop(Flag_jieguo*4+i);//随机结果 首尾呼应
			//p2.y = now_y;
			//now_y+=Answer_H[Flag_jieguo+1][i-1];//动态高度
			//now_y+=20;

			var p2=new baogao2.Item2()
			view.addChild(p2);
			p2.txt_input.text = '参考答案：'+Ti_Arry_Pandu[Flag_jieguo+1][i]+'\n'+Ti_Arry_Pandu['cankao'];//随机结果 首尾呼应
			p2.txt_input.color='#FFFF00';
			p2.y = now_y;
			now_y+=(p2.txt_input.text.length/75>>0)*40+40;//动态高度
			now_y+=100;
		}

		//最终设置
		sp.scroller.setScrollWH(0,now_y);//改变高度
		scroll_max=now_y-sp.scroller.viewHeight;//最大滚动距离
	}
	//鼠标滚轮事件 - 兼容 PC
	var scroll_max=now_y-sp.scroller.viewHeight;//最大滚动距离
	//上下滚动时的具体处理函数
	handle=function(delta) {
		//trace(delta);
		if(scroll_max<=0){
			return;
		}
		sp.view.y += delta*20;
		if (delta <0){
			//向下滚动
			if(sp.view.y < -scroll_max){
				sp.view.y = -scroll_max;
			}
			//trace(sl.view.y);
		}else{
			//向上滚动
			if(sp.view.y > 0){
				sp.view.y = 0;
			}
		}
		//===============================以下是鼠标牵制滑动条代码
		Up_hua();//刷新滑动条
	}
	function Up_hua(){
		var youxiao=852-67;
		var bi = sp.view.y/(now_y-sp.scroller.viewHeight);//滚动比例
		s.mc_hua.mc_kuai.y = -youxiao*bi;
		if(s.mc_hua.mc_kuai.y<0){
			s.mc_hua.mc_kuai.y=0;
		}
		if(s.mc_hua.mc_kuai.y>youxiao){
			s.mc_hua.mc_kuai.y=youxiao;
		}
		sp._scroller._curY = sp.view.y;//滚轮与滑动同步
	}

	//滑动条反向绑定
	var isDown=0;//
	var _rect=new annie.Rectangle(0,0,0,785);
	s.mc_hua.mc_kuai.mouseChildren=false;
	s.mc_hua.mc_kuai.addEventListener(annie.MouseEvent.MOUSE_OVER,fun_over2)
	s.mc_hua.mc_kuai.addEventListener(annie.MouseEvent.MOUSE_OUT,fun_out2)
	s.mc_hua.mc_kuai.addEventListener(annie.MouseEvent.MOUSE_DOWN,function (e){
		isDown=1;
		e.target.startDrag(false,_rect);
	})

	s.addEventListener(annie.MouseEvent.MOUSE_MOVE,function (e){
		if(isDown==1){
			var bi=s.mc_hua.mc_kuai.y/_rect.height;
			sp.view.y=(now_y-sp.scroller.viewHeight)*bi*-1;
			Up_hua();
		}
	})
	s.addEventListener(annie.MouseEvent.MOUSE_UP,function (e){
		isDown=0;
		s.mc_hua.mc_kuai.stopDrag();
	})
	*/
};
annie.A2xExtend(AnnieRoot.baogao2.Baogao2,annie.Sprite);