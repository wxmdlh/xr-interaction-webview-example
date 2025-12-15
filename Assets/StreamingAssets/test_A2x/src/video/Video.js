AnnieRoot.video=AnnieRoot.video||{};
video.Video= function(){
	var s=this;
	annie.Sprite.call(s);
	/*_a2x_need_start*/s.bt_close=null;s.mc_video=null;/*_a2x_need_end*/
	annie.initRes(s,"video","Video");

    s.bt_close.mouseChildren=false;
    s.bt_close.addEventListener(annie.MouseEvent.MOUSE_OVER,fun_over);
    s.bt_close.addEventListener(annie.MouseEvent.MOUSE_OUT,fun_out);
    var isPLay=false;
    //直接通hitArea去设置按钮的点击区域
    //s.hitArea = new annie.Rectangle(338, 150, 1244,700);//视频点击区域
    s.addEventListener(annie.MouseEvent.CLICK,function (e) {
        if(e.target.name=='bt_close'){
            videoPlayer.media.src='';
            s.parent.removeChild(s);//移除视频
        }else{
            if (!isPLay){
                //s.mc_play.visible=true;
                videoPlayer.pause();//暂停视频
                isPLay=true;
            }else {
                //s.mc_play.visible=false;
                videoPlayer.pause(false);//播放视频
                isPLay=false;
            }
        }
    });

    var videoPlayer;//视频容器
    s.videoPlay=function (str){
        sound_bg.stop2();//停止-BGM
        trace('当前视频：'+str);
        if(!videoPlayer){
            videoPlayer = new annie.Video('media/video/'+str+'.mp4',1244,700);//1028-576
        }else{
            videoPlayer.media.src='media/video/'+str+'.mp4';//
        }
        videoPlayer.play();//播放视频
        //videoPlayer.pause();//暂停视频
        //videoPlayer.stop();//停止播放
        /*videoPlayer.addEventListener(annie.Event.ON_PLAY_END,function (e) {
            //trace('视频播完了');
            //s.bt_ok.visible=true;//已了解
            if(Num_step<Arry_step.length-1){
                Num_step++;//记录整体步骤
                //annie.globalDispatcher.dispatchEvent("onChangeContent",Arry_step[Num_step]);
                var _name=Arry_step[Num_step];
                var sceneName=_name+'.'+_name.substr(0,1).toUpperCase()+_name.substring(1);
                fun_Auto(sceneName);
                //annie.globalDispatcher.dispatchEvent("onChangeContent",sceneName);
            }
        });*/

        var floatDisplay=new annie.FloatDisplay();
        floatDisplay.init(videoPlayer);
        //trace(videoPlayer.media);
        videoPlayer.media.setAttribute("x-webkit-airplay", true);
        videoPlayer.media.setAttribute("x5-playsinline", true);
        videoPlayer.media.setAttribute("playsinline",true);
        videoPlayer.media.setAttribute("webkit-playsinline",true);
        //videoPlayer.setAttribute('controls','true');//针对id
        videoPlayer.media.setAttribute('controls','true');//针对2x
        //videoPlayer.media.controls = true;
        s.mc_video.addChild(floatDisplay);
        //floatDisplay.scaleX=1.2;//旧版尺寸
        //floatDisplay.scaleY=1.2;//旧版尺寸
        //floatDisplay.x = 338;
        //floatDisplay.y = 150;
        //s.floatDisplay=floatDisplay;
    }
    s.addEventListener(annie.Event.REMOVE_TO_STAGE,function (e) {
        sound_bg.play2();//播放-BGM-(用户已关就继续静音，用户开着就打开)
        videoPlayer.media.src='';
        s.parent.removeChild(s);//移除视频
        //try{
        //    document.querySelector('#annieEngine').removeChild(s.floatDisplay.htmlElement);
        //}catch (e1) {
        //    //
        //}
        //s.removeAllEventListener();
    });
};
A2xExtend(video.Video,annie.Sprite);