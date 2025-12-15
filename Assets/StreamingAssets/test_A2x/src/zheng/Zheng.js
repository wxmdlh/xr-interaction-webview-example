AnnieRoot.zheng= AnnieRoot.zheng||{};
AnnieRoot.zheng.Zheng= function(){
	var s=this;
	annie.Sprite.call(s);
	/*_a2x_need_start*/s.mc=null;/*_a2x_need_end*/
	annie.initRes(s,"zheng","Zheng");
	s.addEventListener(annie.Event.ADD_TO_STAGE,function (e) {
		s.mc.bt_home.mouseChildren=false;
		s.mc.bt_home.addEventListener(annie.MouseEvent.MOUSE_OVER,fun_over);
		s.mc.bt_home.addEventListener(annie.MouseEvent.MOUSE_OUT,fun_out);
		s.mc.bt_baogao.mouseChildren=false;
		s.mc.bt_baogao.addEventListener(annie.MouseEvent.MOUSE_OVER,fun_over);
		s.mc.bt_baogao.addEventListener(annie.MouseEvent.MOUSE_OUT,fun_out);
		s.mc.addEventListener(annie.MouseEvent.CLICK,function (e) {
			switch(e.target.name){
				case 'bt_home'://返回首页
					Num_step=0;
					fun_loadSence(Arr_step[Num_step],'M');
					break;
				case 'bt_baogao':
					Num_step=Arr_step.length-1;
					fun_loadSence(Arr_step[Num_step],'M');
					break;
			}
		});
		s.jishi();
		s.mc.txt_name.text = my_user.name.length>1?my_user.name:'';//名字
		var xingqi = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
		s.mc.txt_time.text = s.year + "年"+s.month + "月"+s.date + "日 "+xingqi[s.day] +" "+ s.hour + ":" + s.minute + ":" + s.second;
		s.mc.txt_time.text = s.year + "/"+s.month + "/"+s.date;//
		if(Data_All.time_end==0){
			Data_All.time_end=Date.now();//开始计时
		}
		function f_time() {
			var _this = (Data_All.time_end-Data_All.time_start)/1000>>0;
			var HH=_this/3600>>0;
			var MM=(_this%3600)/60>>0;
			var SS=_this%60;
			HH = HH<10?'0'+HH:''+HH;
			MM = MM<10?'0'+MM:''+MM;
			SS = SS<10?'0'+SS:''+SS;
			return (HH+':'+MM+':'+SS)
		}
		s.mc.txt_time2.text='本次测试用时:'+f_time();

		SC();//上传一次成绩
		//====================================
		//my_score = Math.round(Math.random() * 100);//随机分值-测试用
		s.mc.txt_score.text = my_score;
		if(my_score>=60){
			s.mc.gotoAndStop(1);
			s.mc.txt_score.color='#A5330F';//成功
		}else{
			s.mc.gotoAndStop(2);
			s.mc.txt_score.color='#333333';//失败
		}
	});
};
annie.A2xExtend(AnnieRoot.zheng.Zheng,annie.Sprite);
AnnieRoot.zheng.Zheng.prototype.jishi=function (e) {
	var s = this;
	var nowdate = new Date();
	s.year = nowdate.getFullYear();
	s.month = nowdate.getMonth() + 1;
	s.date = nowdate.getDate();
	s.day = nowdate.getDay();
	s.hour = nowdate.getHours();
	s.minute = nowdate.getMinutes();
	s.second = nowdate.getSeconds();
	s.haomiao = nowdate.getMilliseconds();

	s.month<10 ? s.month="0"+s.month : s.month;
	s.date<10 ? s.date="0"+s.date : s.date;
	s.hour<10 ? s.hour="0"+s.hour : s.hour;
	s.minute<10 ? s.minute="0"+s.minute : s.minute;
	s.second<10 ? s.second="0"+s.second : s.second;
	if(s.haomiao<10){
		s.haomiao="00"+s.haomiao;
	}else if(s.haomiao<100){
		s.haomiao="0"+s.haomiao;
	}
};