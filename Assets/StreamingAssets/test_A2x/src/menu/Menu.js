AnnieRoot.menu=AnnieRoot.menu||{};
AnnieRoot.menu.Menu= function(){
	var s=this;
	annie.MovieClip.call(s);
	/*_a2x_need_start*/s.btn_home=null;s.btn_next=null;s.btn_prev=null;s.btn_sound_0=null;s.btn_sound_1=null;s.mc_bg=null;s.txt_ZM=null;/*_a2x_need_end*/
	annie.initRes(s,"menu","Menu");
    var Btn_List=[
        s.btn_home,
        s.btn_sound_0,
        s.btn_sound_1,
        s.btn_prev,
        s.btn_next,
    ];
    s.btn_sound_0.visible=false;//默认开启背景音乐
    for(var i=0;i<Btn_List.length;i++){
        Btn_List[i].mouseChildren=false;
        Btn_List[i].addEventListener(annie.MouseEvent.MOUSE_OVER,fun_over)
        Btn_List[i].addEventListener(annie.MouseEvent.MOUSE_OUT,fun_out)
    }
    //字幕
    s.txt_ZM.mouseEnable=false;//
    window.show_ZM=function(str){
        s.txt_ZM.visible=str?1:0;
        s.txt_ZM.text = str;
        s.txt_ZM.y = 1025;//默认1010
    }
    //进入舞台
    window.count_time=0;//总时间
    var Timer=new annie.Timer(1000);
    /*Timer.addEventListener(annie.Event.TIMER,function (e) {
        if(Flag_isEnd){
            return;
        }
        count_time++;
        var HH=count_time/3600>>0;
        var MM=(count_time%3600)/60>>0;
        var SS=count_time%60;
        HH = HH<10?'0'+HH:''+HH;
        MM = MM<10?'0'+MM:''+MM;
        SS = SS<10?'0'+SS:''+SS;
        //s.mc_time.H_1.gotoAndStop(Number(HH[0])+1);//时
        //s.mc_time.H_2.gotoAndStop(Number(HH[1])+1);
        s.mc_time.M_1.gotoAndStop(Number(MM[0])+1);//分
        s.mc_time.M_2.gotoAndStop(Number(MM[1])+1);
        s.mc_time.S_1.gotoAndStop(Number(SS[0])+1);//秒
        s.mc_time.S_2.gotoAndStop(Number(SS[1])+1);
        //trace(HH+':'+MM+':'+SS)
    })*/

    s.addEventListener(annie.Event.ADD_TO_STAGE,function (e) {
        show_ZM();//初始关闭字幕
        if(!Flag_isEnd){
            //Timer.start();//停止计时
        }

        //顶部bg
        s.mc_bg.mouseEnable=false;
    })
    s.addEventListener(annie.Event.REMOVE_TO_STAGE,function (e) {
        if(Flag_isEnd){
            //Timer.stop();//停止计时
        }
    })

    s.addEventListener(annie.MouseEvent.CLICK,function (e) {
        switch (e.target.name) {
            case 'btn_home':
                Num_step=0;
                fun_loadSence(Arr_step[Num_step],'M');
                break;
            case 'btn_prev':
                e.target.gotoAndStop(1);
                if(Num_step>0){
                    Num_step--;
                }
                fun_loadSence(Arr_step[Num_step],'M');
                break;
            case 'btn_next':
                e.target.gotoAndStop(1);
                var num=Num_step;//判断已加载再快进
                num++;
                if(annie.isLoadedScene(Arr_step[num])){
                    Num_step++;
                    fun_loadSence(Arr_step[Num_step],'M');
                }
                break;
            case 'btn_sound_1':
                sound_bg.pause();
                s.btn_sound_0.visible=true;
                s.btn_sound_1.visible=false;
                break;
            case 'btn_sound_0':
                sound_bg.pause(false);
                s.btn_sound_0.visible=false;
                s.btn_sound_1.visible=true;
                break;
        }
    })
};
A2xExtend(AnnieRoot.menu.Menu,annie.MovieClip);