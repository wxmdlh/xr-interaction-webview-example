if(browserInfo.engine==='Trident'){ alert('抱歉，该课件不支持IE浏览器或兼容模式，请选择【极速模式】或者【更换浏览器】')}
AnnieRoot.addEventListener("load",function(){
    annie.debug=false;
    window.stage=new annie.Stage("annieEngine",1920,1080,30,annie.StageScaleMode.SHOW_ALL,0);
    //默认关闭自动旋转和自动resize
    stage.autoResize=true;
    stage.autoSteering=true;
    stage.addEventListener(annie.Event.ON_INIT_STAGE,function (e) {
        //阻止浏览器默认处理行为
        window.kai_flag=false;
        window.addEventListener('touchmove',function (e) {
            if(kai_flag){
                e.preventDefault();//阻止
            }
        },{passive:false});

        window.Num_Ti=1;//默认第1题
        window.Flag_isEnd = false;//是否结束了学习，结束了就停止计时
        window.One_Flag=true;//记录第一次做兼容-ios-声音
        window.my_score = 0;//初始化成绩
        window.my_progress = 0;//初始化学习进度
        /*查找API对象，如果没有找到，构造一个*/
        window.findAPI=function(){
            var win = window;
            try {
                while ((win.API_20140512 == null) && (win.parent != null) && (win.parent != win)) {
                    win = win.parent;
                }
                // 如果找到，直接返回
                if (win.API_20140512) return win.API_20140512;
                // 没有找到，构造一个模拟对象
                console.log("没有找到API");
            } catch(e) {
               //
            }
        };
        window.api=findAPI();

        window.my_user={
            name:'-',//"姓名",
            code:'-',//"123",
            clazz:'-',//"班级",
            major:'-',//"专业"
        }
        if(api){
            api.begin();
            //获取信息
            if(api.getCurrentUserInfo){
                my_user=api.getCurrentUserInfo();//获取个人信息
                trace(my_user);
            }else{
                trace('未获取到学号信息！')
            }
        }

        //可以实时上传进度和分数
        window.SC=function(){
            my_progress = 0;//进度
            my_score = 0;//成绩

            var _lens=Object.keys(Ti_Arry).length;//操作题 总数
            for(var i in Ti_Arry){
                if(Ti_Arry[i].youxuan){
                    my_progress++;//进度++
                }
                if(Ti_Arry[i].youxuan==Ti_Arry[i].Answer){
                    my_score += 100/_lens;//
                }
            }

            my_progress = Math.round(my_progress/_lens*100);//取整
            my_score=Math.round(my_score);//取整
            if(api){
                try {
                    api.setScore(my_score);
                    api.setProgress(my_progress);
                    api.commit();
                    trace("上传成功");
                } catch(e) {
                    trace("上传成绩失败");
                }
            }
            trace(my_progress+'%',my_score+'分');
        };

        //****************************************下面-是跳步骤的数列 ****
        window.Flag_jieguo=Math.random()*4>>0;//本次课件的 结果判读随机
        window.Arry_fuzhu=[0,0,0];//辅助检查
        window.Num_step=1;//记录整体步骤，初始值为 1
        window.Data_Jump=[];//菜单跳转到具体位置 的信息  'page','A',''
        window.Arr_step=[
            'home',
            'p2_1',
            'p2_2',
            'p2_3',
            'p3_1',
            'p3_2',
            'baogao2',
        ]
        window._step_Name={
            1:'实验准备',
            2:'DNA提取（自动法）',
            '2-1':'加样', '2-2':'上机提取', '2-3':'浓度测定',
            3:'DNA纯化（磁珠法）',
            '3-1':'DNA的捕获', '3-2':'磁性分离', '3-3':'洗涤去除杂质','3-4':'DNA的洗脱','3-5':'浓度与纯度检测',
            4:'第一轮扩增',
            '4-1':'试剂准备', '4-2':'PCR1反应体系配制', '4-3':'PCR1扩增',
            5:'产物纯化',
            6:'第二轮扩增',
            '6-1':'产物稀释', '6-2':'PCR2反应体系配制', '6-3':'PCR2扩增',
            7:'文库纯化',
            8:'高通量测序',

            'jianjie':'理论探索',
            'tuozhan':'知识拓展',
            'kehou':'课后测验',
            'page_over':'学习完毕',//
            'zheng':'实验报告',
            'baogao':'实验报告',
            'baogao2':'实验报告',
        }

        window.show_step_name=function(_str){
            /*_str=String(_str);
            //trace('当前步骤名：'+_str+' --字数：'+_str.length);
            if(_str.length<=3){//根据步骤的字数改变bg长度
                f_menu.mc_step.gotoAndStop(1);
            }else if(_str.length<=5){
                f_menu.mc_step.gotoAndStop(2);
            }else if(_str.length<=7){
                f_menu.mc_step.gotoAndStop(3);
            }else if(_str.length<=8){
                f_menu.mc_step.gotoAndStop(4);
            }else if(_str.length<=10){
                f_menu.mc_step.gotoAndStop(5);
            }else{
                f_menu.mc_step.gotoAndStop(6);
            }
            f_menu.mc_step.mc_txt.txt.text=_str;//显示步骤名 *
            //trace(f_menu.mc_step.mc_txt.txt.x)
            */
        }
        //****************************************上面-是跳步骤的数列
        var loadView;//loading页面
        trace(annie.version);
        annie.loadScene("loading",function(per){
            //trace("加载进度:"+per+"%");
        },function(e){
            sound_hover = new annie.Sound("media/hover.mp3");//获取点击声
            sound_click = new annie.Sound("media/click.mp3");//获取点击声
            sound_bg = new annie.Sound("media/bg_music.mp3");//获取背景音乐
            sound_dui=new annie.Sound("media/Correct.mp3");//选择正确
            sound_cuo=new annie.Sound("media/Mistake.mp3");//选择错误
            sound_bg.volume=0.1;
            sound_hover.volume=.5;
            sound_click.volume=.5;
            loadView = new loading.Loading();
            stage.addChild(loadView);
            load_List=['menu','home',/*'video',*/
                ...Arr_step
            ];
            annie.loadScene(load_List,function(per){
                //加载进度
                if(per>0){
                    //trace("加载进度:"+per+"%");
                    //loadView.mc_per.gotoAndStop(per);
                    loadView.txt_per.text=per+'%';
                    //loadView.mc_1.gotoAndStop(per%10+1);
                    //loadView.mc_10.gotoAndStop(((per/10)>>0)+1);
                }
            },function(result){
                trace(result.sceneName+': '+result.sceneId+'/'+result.sceneTotal);
                //if(result.sceneId===result.sceneTotal){}
                //if(result.sceneId>3){
                //    f_menu.mc_menu.mouseEnable = result.sceneId==result.sceneTotal;//加载完了再启用菜单快捷跳转
                //}
                if(result.sceneId===result.sceneTotal){
                    f_menu = new menu.Menu();
                    //f_video = new video.Video();
                    stage.removeAllChildren();
                    //annie.unLoadScene("loading");//不卸载加载页面 后面共用
                    //loadView=null;
                    currentObj = new home.Home();
                    //currentObj = new baogao2.Baogao2();
                    stage.addChild(currentObj);
                    //stage.addChild(f_menu);//
                }
            });
        });
        fun_loadSence =function (str,isMA){
            trace((isMA=='M'?'手动：':'自动：')+str);
            //-------------------------------------------------------------
            if (annie.isLoadedScene(str)) {
                //音频授权播放(没授权过+手动挡+有声音的文件)
                /*if(window['Num_step_flag_'+str] && isMA=='M' && Object.keys(soundArray).indexOf(str)>=0){
                    var len = soundArray[str];
                    for(var i=0;i<len;i++){
                        var sound = annie.getResource(str,"Sound_"+(i+1));
                        sound.play();
                        sound.pause();
                    }
                }*/
                //如果检测到之前已经加载过该场景了，则直接跳过加载直接显示内容
                //SC();//切换场景更新进度

                stage.removeAllChildren();
                if (currentObj && isMA=='M') {
                    currentObj.destroy();// M手动挡才销毁 A自动挡不消除![](C:/Users/Kang/Documents/tongda/ispirit/{B645AEED-6CE6-7FD2-2CDE-83021EBB6349}_83/msg/image/228_p2p/2280731@2507_221791481.20250702093808.png)
                }
                var _scene=str+'.'+str.substr(0,1).toUpperCase()+str.substring(1);
                currentObj = annie.Eval("new " + _scene);
                //再依次添加需要的显示内容
                stage.addChild(currentObj);//添加场景
                if(str.indexOf('home')<0 && str.indexOf('yindao')<0){
                    stage.addChild(f_menu);//非首页都需要菜单
                    if(str.indexOf('baogao')===0){//如果是报告页就不要-上下步-不要菜单
                        f_menu.gotoAndStop(2);
                        //f_menu.btn_prev.alpha=.5;
                        f_menu.btn_next.mouseEnable=0;
                        f_menu.btn_next.alpha=.5;
                    }else{
                        f_menu.gotoAndStop(1);
                        //f_menu.btn_prev.alpha=1;
                        f_menu.btn_next.mouseEnable=1;
                        f_menu.btn_next.alpha=1;
                    }
                }
            } else {
                trace('这个场景还没有加载哦！！！！！！！');
                //如果检测到没有加载过该场景了，则显示loading，等待加载完成再执行相应步骤
                //如果加载完成先删除掉舞台中之前残留的所有显示对象
                stage.removeAllChildren();
                //显示loading
                stage.addChild(loadView);
                annie.loadScene(str, function (per) {
                    //loadView.per_txt.text = progress + "%";
                    trace("正在加载："+str+'的资源 '+per+"%");
                    //loadView.mc_per.gotoAndStop(per);
                    loadView.txt_per.text=per+'%';
                    //loadView.mc_1.gotoAndStop(per%10+1);
                    //loadView.mc_10.gotoAndStop(((per/10)>>0)+1);
                }, function (result) {
                    //全部加载完成后的逻辑
                    trace(result.sceneName+': '+result.sceneId+'/'+result.sceneTotal);
                    if(result.sceneId===result.sceneTotal){
                        stage.removeAllChildren();//如果加载完成先删除掉舞台中之前残留的所有显示对象,这里其实就是移除loading
                        if (currentObj) {
                            currentObj.destroy();
                        }
                        var _scene=str+'.'+str.substr(0,1).toUpperCase()+str.substring(1);
                        currentObj = annie.Eval("new " + _scene);//可以看看这句代码。这个是借助annie.Eval动态去声明一个类。
                        stage.addChild(currentObj);//再依次添加需要的显示内容
                        stage.addChild(f_menu);//非首页都需要菜单

                        //继续悄悄的加载
                        annie.loadScene(load_List,function(per){
                            //trace("加载进度:"+per+"%");
                        },function(result){
                            trace(result.sceneName+': '+result.sceneId+'/'+result.sceneTotal);
                        });
                    }
                })
            }
        }
        window.fun_NumToString=function (xx){
            var str='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if(isNaN(xx)){
                if(str.indexOf(xx)>=0){
                    return str.indexOf(xx)+1;//字母转数字
                }else{
                    return 0;
                }
            }else{
                if(xx>=1 && xx<=26){
                    return str[xx-1];//数字转字母
                }else{
                    return 'null';
                }
            }
        };
        window.my_Random=function(array) {
            if(typeof array !=='object'||array.length===0){
                console.log(array,typeof array,'数组传入错误！');
                return;
            }
            var Array=[],reArray=[];
            for(var o in array){
                Array[''+o]=array[''+o];
            }
            for(var i=0;i<array.length;i++){
                var num = Math.random()*Array.length>>0;
                reArray[i]=Array[num];
                Array.splice(num,1);
            }
            return reArray;
        };

        //屏蔽右键菜单，避免下载视频
        document.oncontextmenu=function(e){return false};
        //添加空的鼠标滚轮事件
        if(annie.osType === "pc"){
            if(document.addEventListener){
                document.addEventListener('DOMMouseScroll',wheel,false);
            }//W3C
            window.onmousewheel=document.onmousewheel=wheel;//IE/Opera/Chrome
            function wheel(event){
                var delta = 0;
                if (!event) event = window.event;
                if (event.wheelDelta) {//IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
                    delta = event.wheelDelta/120;
                    if (window.opera) delta = -delta;//因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
                } else if (event.detail) {//FF浏览器使用的是detail,其值为“正负3”
                    delta = -event.detail/3;
                }
                if (delta) handle(delta);
                if (delta) handle2(delta);
            }
            //上下滚动时的具体处理函数
            //function handle(delta) {
                //trace(delta);
            //}
        }
        window.handle=function(delta){
          //trace(delta);
        };
        window.handle2=function(delta){
            //trace(delta);
        };

        fun_over =function(e){
            if(e.target.currentFrame<3){
                e.target.gotoAndStop(2);
            }
            document.body.style.cursor="pointer";//手型
            sound_hover.play();
        };
        fun_out =function(e){
            if(e.target.currentFrame<3){
                e.target.gotoAndStop(1);
            }
            document.body.style.cursor="";//默认 default
        };
        fun_over2 =function(e){
            sound_hover.play();
            document.body.style.cursor="pointer";//手型
        };
        fun_out2 =function(e){
            document.body.style.cursor="";//默认 default
        };
        fun_over3 =function(e){
            sound_hover.play();
            if(e.target.alpha<1){
                e.target.alpha=0.2;
            }
            document.body.style.cursor="pointer";//手型
        };
        fun_out3 =function(e){
            if(e.target.alpha<1){
                e.target.alpha=0;
            }
            document.body.style.cursor="";//默认 default
        };
        fun_over4 =function(e){
            sound_hover.play();
            e.target.alpha=1;
            document.body.style.cursor="pointer";//手型
        };
        fun_out4 =function(e){
            e.target.alpha=0;
            document.body.style.cursor="";//默认 default
        };
        //碰撞检测
        hitTest=function (obj1,obj2) {
            return annie.Point.distance(obj1.x,obj1.y,obj2.x,obj2.y)<80;
        }
        stage.addEventListener(annie.MouseEvent.CLICK,function (e){
            document.body.style.cursor="default";//默认
            if(e.target.name){
                if(
                    e.target.name.indexOf('a')>=0 ||
                    e.target.name.indexOf('b')>=0 ||
                    e.target.name.indexOf('xuan')>=0 ||
                    e.target.name.indexOf('region')>=0 ||
                    e.target.name.indexOf('gou')>=0 ||
                    e.target.name.indexOf('p')>=0 ||
                    e.target.name.indexOf('L')>=0 ||
                    e.target.name.indexOf('R')>=0
                ){
                    sound_click.play();//全局 按钮点击声
                }
            }
        });
        // 向Unity发送消息
        Fun_end=function() {
            var data=[];
            for(var i=1;i<=5;i++){
                data[i-1]={
                    count:Number(i),//题号
                    T:Ti_Arry[i].T,//标题
                    isRight:Ti_Arry[i].youxuan==Ti_Arry[i].Answer,//对错
                }
            }
            try{
                window.vuplex.postMessage(JSON.stringify({
					'Questions':data,
				}));
            }catch (e) {
                trace(e)
            }
        }
    })
});
