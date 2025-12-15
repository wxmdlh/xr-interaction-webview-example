AnnieRoot.home= AnnieRoot.home||{};
AnnieRoot.home.Home= function(){
	var s=this;
	annie.MovieClip.call(s);
	/*_a2x_need_start*/s.bt_1=null;s.bt_2=null;s.bt_2_1=null;s.bt_2_2=null;s.bt_2_3=null;s.bt_3_1=null;s.bt_3_2=null;s.bt_back=null;s.bt_end=null;/*_a2x_need_end*/
	annie.initRes(s,"home","Home");
	sound_bg.stop();
	var bt_list=[
		s.bt_1,
		s.bt_2,
		s.bt_2_1,
		s.bt_2_2,
		s.bt_2_3,
		s.bt_3_1,
		s.bt_3_2,
		s.bt_back,
		s.bt_end,
	]
	for(var btn of bt_list){
		btn.alpha=0;
		btn.mouseChildren=false;
		btn.addEventListener(annie.MouseEvent.MOUSE_OVER,fun_over4)
		btn.addEventListener(annie.MouseEvent.MOUSE_OUT,fun_out4)
	}
	s.addEventListener(annie.MouseEvent.CLICK,function (e) {
		switch (e.target.name) {
			case 'bt_1':
			case 'bt_2':
				var num=Number(e.target.name.split('bt_')[1]);
				s.gotoAndStop(num+1);
				break
			case 'bt_2_1'://p9
			case 'bt_2_2'://p15
			case 'bt_2_3'://p18
				var num=Number(e.target.name.split('bt_2_')[1]);
				var str='p2_'+num;
				var _scene=str+'.'+str.substr(0,1).toUpperCase()+str.substring(1);
				s.stage.addChild(annie.Eval("new " + _scene));
				break
			case 'bt_3_1'://p42
			case 'bt_3_2'://p53
				var num=Number(e.target.name.split('bt_3_')[1]);
				var str='p3_'+num;
				var _scene=str+'.'+str.substr(0,1).toUpperCase()+str.substring(1);
				s.stage.addChild(annie.Eval("new " + _scene));
				break
			case 'bt_back':
				s.gotoAndStop(1);
				break
			case 'bt_end':
				Fun_end();
				break
		}
		if(e.target.name.includes('bt')){
			e.target.alpha=0;
		}
	})
	//考题音频
	var sound_Q={
		1:new annie.Sound("media/mp3/Q1.mp3"),
		2:new annie.Sound("media/mp3/Q2.mp3"),
		3:new annie.Sound("media/mp3/Q3.mp3"),
		4:new annie.Sound("media/mp3/Q4.mp3"),
		5:new annie.Sound("media/mp3/Q5.mp3"),
	}
	window.fun_sound_Q=function(isOpen){
		for(var i in sound_Q){
			sound_Q[i].stop();
		}
		if(isOpen){
			sound_Q[Num_Ti].play();
		}
	}
};
annie.A2xExtend(AnnieRoot.home.Home,annie.MovieClip);