AnnieRoot.test= AnnieRoot.test||{};
AnnieRoot.test.Test= function(){
	var s=this;
	annie.Sprite.call(s);
	/*_a2x_need_start*/s.mc=null;s.mc_hua=null;/*_a2x_need_end*/
	annie.initRes(s,"test","Test");
	var isDown=0;//
	var last_x,last_y;
	var obj=s.mc;//sp.view
	var _rect=new annie.Rectangle(0,0,0,600);

	s.mc_hua.mc_kuai.mouseChildren=false;
	s.mc_hua.mc_kuai.addEventListener(annie.MouseEvent.MOUSE_OVER,fun_over2)
	s.mc_hua.mc_kuai.addEventListener(annie.MouseEvent.MOUSE_OUT,fun_out2)
	s.mc.mouseChildren=false;//
	s.mc.addEventListener(annie.MouseEvent.MOUSE_DOWN,function (e){
		isDown=1;
		last_y=e.stageY;
	})
	var scroll_max = -1653;
	s.addEventListener(annie.MouseEvent.MOUSE_MOVE,function (e){
		if(isDown){
			obj.y += e.stageY-last_y;
			if(obj.y < scroll_max){obj.y = scroll_max;}
			if(obj.y > 0){obj.y = 0;}
			last_y=e.stageY;
			Up_hua();
		}
	})
	s.addEventListener(annie.MouseEvent.MOUSE_UP,function (e){
		isDown=0;
		s.mc_hua.mc_kuai.stopDrag();
	})
	function Up_hua(){
		var youxiao=850-252;
		var bi = obj.y/scroll_max;//滚动比例
		s.mc_hua.mc_kuai.y = youxiao*bi;
		if(s.mc_hua.mc_kuai.y<0){
			s.mc_hua.mc_kuai.y=0;
		}
		if(s.mc_hua.mc_kuai.y>youxiao){
			s.mc_hua.mc_kuai.y=youxiao;
		}
	}
};
annie.A2xExtend(AnnieRoot.test.Test,annie.Sprite);