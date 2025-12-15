AnnieRoot.page_over= AnnieRoot.page_over||{};
AnnieRoot.page_over.Page_over= function(){
	var s=this;
	annie.Sprite.call(s);
	/*_a2x_need_start*/s.mc=null;/*_a2x_need_end*/
	annie.initRes(s,"page_over","Page_over");
	s.mc.addEventListener(annie.Event.CALL_FRAME,function (e){
		//s.mc.stop();
		s.mc.bt_jixu.mouseChildren=false;
		s.mc.bt_jixu.addEventListener(annie.MouseEvent.MOUSE_OVER,fun_over);
		s.mc.bt_jixu.addEventListener(annie.MouseEvent.MOUSE_OUT,fun_out);
	});
	s.addEventListener(annie.MouseEvent.CLICK,function (e) {
		trace(e.target)
		if(e.target.name=='bt_jixu'){
			Num_step++;
			fun_loadSence(Arr_step[Num_step],'M');
		}
	});
};
annie.A2xExtend(AnnieRoot.page_over.Page_over,annie.Sprite);