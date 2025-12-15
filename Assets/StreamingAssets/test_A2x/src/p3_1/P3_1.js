AnnieRoot.p3_1= AnnieRoot.p3_1||{};
AnnieRoot.p3_1.P3_1= function(){
	var s=this;
	annie.MovieClip.call(s);
	/*_a2x_need_start*/s.b_1=null;s.b_2=null;s.bt_1=null;s.bt_2=null;s.bt_3=null;s.bt_4=null;s.bt_5=null;s.bt_6=null;s.bt_back=null;s.bt_end=null;s.fb_1=null;s.fb_2=null;s.fb_3=null;s.fb_4=null;s.fb_5=null;s.mc=null;s.mc_1=null;s.mc_2=null;s.mc_Q=null;s.mc_hua=null;/*_a2x_need_end*/
	annie.initRes(s,"p3_1","P3_1");
	var bt_list=[
		s.bt_1,
		s.bt_2,
		s.bt_3,
		s.bt_4,
		s.bt_5,
		s.bt_6,
		s.b_1,
		s.b_2,
		s.fb_1,//发病机制
		s.fb_2,
		s.fb_3,
		s.fb_4,
		s.fb_5,
		s.bt_back,
		s.bt_end,
		s.mc_1.bt_qie,
		s.mc_1.bt_prev,
		s.mc_1.bt_next,
		s.mc_2.bt_qie,
		s.mc_2.bt_prev,
		s.mc_2.bt_next,
	]
	for(var btn of bt_list){
		btn.alpha=0;
		btn.mouseChildren=false;
		btn.addEventListener(annie.MouseEvent.MOUSE_OVER,fun_over4)
		btn.addEventListener(annie.MouseEvent.MOUSE_OUT,fun_out4)
	}
	s.addEventListener(annie.MouseEvent.MOUSE_UP,function (e) {
		isDown=0;//
		s.mc_hua.mc_kuai.stopDrag();//
		switch (e.target.name) {
			case 'bt_1':
			case 'bt_2':
			case 'bt_3':
			case 'bt_4':
			case 'bt_5':
				e.target.alpha=0;
				var num=Number(e.target.name.split('bt_')[1]);
				s.gotoAndStop([1,2,3,9,11][num-1]);
				break
			case 'bt_6'://答题
				e.target.alpha=0;
				Num_Ti=4;//第N题
				fun_Q();
				fun_sound_Q(s.mc_Q.visible);//播放配音
				break
			case 'b_1':
			case 'b_2':
				e.target.alpha=0;
				var num=Number(e.target.name.split('b_')[1]);
				s.gotoAndStop([9,10][num-1]);
				break
			case 'fb_1':
			case 'fb_2':
			case 'fb_3':
			case 'fb_4':
			case 'fb_5':
				e.target.alpha=0;
				var num=Number(e.target.name.split('fb_')[1]);
				s.gotoAndStop([4,5,6,7,8][num-1]);
				s.mc.gotoAndStop(num);
				show_hua();//显示滑动条
				break
			case 'bt_back':
				s.parent.removeChild(s);
				break
			case 'bt_end':
				Fun_end();
				break
			case 'bt_qie'://治疗/预防
				e.target.alpha=0;
				s.gotoAndStop(s.currentFrame==11?12:11);
				s.mc_1.gotoAndStop(1);
				s.mc_2.gotoAndStop(1);
				break
			case 'bt_prev':e.target.alpha=0;s.mc_1.prevFrame();s.mc_2.prevFrame();break
			case 'bt_next':e.target.alpha=0;s.mc_1.nextFrame();s.mc_2.nextFrame();break
		}
		//监测 视频播放
		if(e.target.name && e.target.name!='bt_back'){
			setTimeout(function (){
				Check_video();//检测视频
			},0)
		}
	})
	//考题*
	s.mc_Q.visible=false;//初始关闭
	for(var i=1;i<=6;i++){
		s.mc_Q['xuan_'+i].alpha=0;//全透明按钮
		s.mc_Q['xuan_'+i].mouseChildren=false;
		s.mc_Q['xuan_'+i].addEventListener(annie.MouseEvent.MOUSE_OVER,fun_over4)
		s.mc_Q['xuan_'+i].addEventListener(annie.MouseEvent.MOUSE_OUT,function(e){
			if(e.target.currentFrame==1){
				e.target.alpha=0;
			}
			document.body.style.cursor="";
		})
	}
	s.mc_Q['bt_ok'].mouseChildren=false;
	s.mc_Q['bt_ok'].addEventListener(annie.MouseEvent.MOUSE_OVER,fun_over)
	s.mc_Q['bt_ok'].addEventListener(annie.MouseEvent.MOUSE_OUT,fun_out)
	s.mc_Q['bt_jixu'].mouseChildren=false;
	s.mc_Q['bt_jixu'].addEventListener(annie.MouseEvent.MOUSE_OVER,fun_over)
	s.mc_Q['bt_jixu'].addEventListener(annie.MouseEvent.MOUSE_OUT,fun_out)
	function fun_Q(){
		s.mc_Q.visible=true;
		//s.mc_Q.gotoAndStop(1);//
		s.mc_Q.mc_duicuo.visible=false;
		s.mc_Q['bt_ok'].visible=true;//显示确定键
		for(var i=1;i<=6;i++){
			s.mc_Q['xuan_'+i].alpha=0;
			s.mc_Q['xuan_'+i].gotoAndStop(1);//长短不一样
			s.mc_Q['xuan_'+i].mouseEnable=true;
		}
	}
	s.mc_Q.addEventListener(annie.MouseEvent.CLICK,function (e) {
		switch (e.target.name) {
			case 'xuan_1':
			case 'xuan_2':
			case 'xuan_3':
			case 'xuan_4':
			case 'xuan_5':
			case 'xuan_6':
				var answer=Ti_Arry[Num_Ti].Answer;
				if(answer.length>1){
					e.target.gotoAndStop(e.target.currentFrame==1?2:1);
				}else{
					for(var i=1;i<=6;i++){
						s.mc_Q['xuan_'+i].gotoAndStop(1);
					}
					e.target.gotoAndStop(2);
				}
				break
			case 'bt_ok':
				e.target.visible=false;
				var youxuan='';
				var answer=Ti_Arry[Num_Ti].Answer;
				for(var i=1;i<=6;i++){
					s.mc_Q['xuan_'+i].mouseEnable=false;
					if(s.mc_Q['xuan_'+i].currentFrame==2){
						youxuan+=fun_NumToString(i);
					}
				}
				Ti_Arry[Num_Ti].youxuan=youxuan;//存答案
				s.mc_Q.mc_duicuo.visible=true;
				if(youxuan==answer){
					sound_dui.play();
					s.mc_Q.mc_duicuo.gotoAndStop(1);
				}else{
					sound_cuo.play();
					s.mc_Q.mc_duicuo.gotoAndStop(answer);//跳标签
				}
				break
			case 'bt_jixu':
				s.mc_Q.visible=false;//关闭考题
				fun_sound_Q(s.mc_Q.visible);//播放配音
				break
		}
	});
	//滑动条
	s.mc_hua.mc_kuai.mouseChildren=false;//滑动条
	s.mc_hua.mc_kuai.addEventListener(annie.MouseEvent.MOUSE_OVER,fun_over2);
	s.mc_hua.mc_kuai.addEventListener(annie.MouseEvent.MOUSE_OUT,fun_out2);
	var isDown=0;
	var _rect=new annie.Rectangle(0,0,0,310);
	var last_Y=0;
	var scroll_max=0;//最大滚动距离
	//判断是否启用滑动条
	function show_hua(){//是否启用滑动条
		s.mc_hua.mc_kuai.y=0;//滑动条
		s.mc.y=0;//表格内容
		setTimeout(function (e){
			trace('520','h: '+s.mc.getWH().h);
			scroll_max=500-s.mc.getWH().h;//获取图片超出遮罩长度
			if(scroll_max<0){
				s.mc_hua.visible=true;//显示滑动条
				handle=function(delta){
					s.mc.y += delta*20;
					if(s.mc.y>0){s.mc.y=0;}
					if(s.mc.y<scroll_max){s.mc.y=scroll_max}
					UP_hua();//
				};
			}else{
				s.mc_hua.visible=false;//隐藏滑动条
				handle=function(delta){
					//trace(delta);
				};
			}
		},35)
	}
	//匹配滑块
	function UP_hua(){
		var youxiao=483-173;
		var bi = s.mc.y/scroll_max;//滚动比例
		s.mc_hua.mc_kuai.y = youxiao*bi;
		if(s.mc_hua.mc_kuai.y<0){
			s.mc_hua.mc_kuai.y=0;
		}
		if(s.mc_hua.mc_kuai.y>youxiao){
			s.mc_hua.mc_kuai.y=youxiao;
		}
	}
	s.mc.mouseChildren=false;//滑动内容*
	s.addEventListener(annie.MouseEvent.MOUSE_DOWN,function (e){
		if(e.target.name=='mc'){
			isDown=1;
			last_Y=e.stageY;
		}
		if(e.target.name=='mc_kuai'){
			isDown=2;
			e.target.startDrag(false,_rect);
		}
	})
	s.addEventListener(annie.MouseEvent.MOUSE_MOVE,function (e){
		if(isDown==1){
			if(scroll_max>=0){return}//小于一屏不滑动
			s.mc.y += e.stageY-last_Y;
			last_Y=e.stageY;
			if(s.mc.y>=0){s.mc.y=0;}
			if(s.mc.y<scroll_max){s.mc.y=scroll_max}
			UP_hua();//
		}
		if(isDown==2){
			var bi=s.mc_hua.mc_kuai.y/_rect.height;
			s.mc.y=scroll_max*bi;
		}
	})
	//视频
	var videoPlayer;//视频容器
	var floatDisplay=new annie.FloatDisplay();
	var videoPlay_1=function (str){
		trace('当前视频：'+str);
		const src='media/video/'+str+'.webm';
		if(!videoPlayer){
			videoPlayer = document.createElement('video');
			videoPlayer.aotuplay=true;
			videoPlayer.src=src;
			videoPlayer.width=1280;
			videoPlayer.height=720;
			floatDisplay.init(videoPlayer);
		}else{
			videoPlayer.src=src;//
		}
		videoPlayer.play();//播放视频
		//videoPlayer.pause();//暂停视频
		//videoPlayer.stop();//停止播放

		//trace(videoPlayer.media);
		videoPlayer.setAttribute("x-webkit-airplay", true);
		videoPlayer.setAttribute("x5-playsinline", true);
		videoPlayer.setAttribute("playsinline",true);
		videoPlayer.setAttribute("webkit-playsinline",true);
		//videoPlayer.setAttribute('controls','true');//针对id
		videoPlayer.setAttribute('controls','true');//针对2x
		//videoPlayer.controls = true;

		const radius = 30; // 圆角半径
		videoPlayer.style.borderRadius = `${radius}px`;
		videoPlayer.style.overflow = 'hidden';

		stage.addChild(floatDisplay);
		var rect={x:954, y:310, w:862, h:482,}//视频位置宽高
		floatDisplay.scaleX = rect.w/videoPlayer.width;//旧版尺寸
		floatDisplay.scaleY = rect.h/videoPlayer.height;//旧版尺寸
		floatDisplay.x = rect.x;
		floatDisplay.y = rect.y;
	}
	var videStop_1=function (){
		if(videoPlayer){
			videoPlayer.pause();
			stage.removeChild(floatDisplay);
		}
	}
	function Check_video(){
		if([3].includes(s.currentFrame) && s.mc_Q.visible==false){
			videoPlay_1('p3_1');//默认播放视频
			//补丁，改变位置大小
			if(s.currentFrame==3){
				var rect={x:868, y:350, w:862, h:482,}//视频位置宽高
				floatDisplay.scaleX = rect.w/videoPlayer.width;//旧版尺寸
				floatDisplay.scaleY = rect.h/videoPlayer.height;//旧版尺寸
				floatDisplay.x = rect.x;
				floatDisplay.y = rect.y;
			}
		}else{
			videStop_1();//关闭视频
		}
	}
	s.addEventListener(annie.Event.ADD_TO_STAGE,function (e){
		Check_video();//检测播放视频
	})
	s.addEventListener(annie.Event.REMOVE_TO_STAGE,function (e){
		videStop_1();//关闭视频
	})
};
annie.A2xExtend(AnnieRoot.p3_1.P3_1,annie.MovieClip);