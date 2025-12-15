AnnieRoot.baogao=AnnieRoot.baogao||{};
AnnieRoot.baogao.Baogao=function(){
    var s = this;
    annie.Sprite.call(s);
    /*_a2x_need_start*/s.bt_baogao=null;s.bt_end=null;s.mc_mask=null;s.mc_score=null;s.mc_txt=null;s.txt_1=null;s.txt_2=null;s.txt_time=null;/*_a2x_need_end*/
    annie.initRes(s,"baogao","Baogao");
    s.name='baogao';
    var Btn_List=[
        s.bt_baogao,
        s.bt_end,
    ]
    for(var i=0;i<Btn_List.length;i++){
        Btn_List[i].mouseChildren=false;
        Btn_List[i].addEventListener(annie.MouseEvent.MOUSE_OVER,fun_over);
        Btn_List[i].addEventListener(annie.MouseEvent.MOUSE_OUT,fun_out);
    }

    var Num_Arry_name=['沟通能力','思维判断','理论基础'];//3大能力评估-值
    var Num_Arry=[0,0,0];//3大能力评估-值
    s.addEventListener(annie.Event.ADD_TO_STAGE,function (e) {
        //Flag_isEnd=true;//课程结束了，停止计时了
        s.jishi();
        var xingqi = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
        s.txt_time.text = s.year + "年"+s.month + "月"+s.date + "日"+' '+xingqi[s.day] +' '+ s.hour + ":" + s.minute + ":" + s.second;

        SC();
        //my_score = 97;//本地测试分数显示用 /////
        var Str=String(my_score);
        s.mc_score.gotoAndStop(Str.length);
        if(Str.length==1){
            s.mc_score.mc_1.gotoAndStop(Number(Str[0])+1);
        }else if(Str.length==2){
            s.mc_score.mc_1.gotoAndStop(Number(Str[0])+1);
            s.mc_score.mc_2.gotoAndStop(Number(Str[1])+1);
        }

        //计算各能力值
        var fen=[
            [2,3],//1-沟通能力
            [1,9,10,11,12,13],//2-思维判断
            [4,5,6,7,8,14],//3-理论基础
        ]
        for(var i=1;i<=14;i++){
            if(fen[0].includes(i)){
                Num_Arry[0] += DaTa_All.score[i];//1-沟通能力
            }else if(fen[1].includes(i)){
                Num_Arry[1] += DaTa_All.score[i];//2-思维判断
            }else if(fen[2].includes(i)){
                Num_Arry[2] += DaTa_All.score[i];//3-理论基础
            }
        }

        //绘制蜘蛛网
        //Num_Arry=[3.3,42,32];//3大能力值-临时测试用*************** /////
        fun_Shape();
        Fun_List();//列表----
    });
    s.addEventListener(annie.MouseEvent.CLICK,function (e) {
        switch (e.target.name){
            case 'bt_baogao'://查看总报告
                if(annie.isLoadedScene('baogao2')){
                    fun_loadSence('baogao2','M');
                }
                break;
            case 'bt_end'://结束实验
                Num_step=0;
                fun_loadSence(Arr_step[Num_step],'M');
                break;
        }
    });

    function fun_Shape(){
        var p1=[];//记录第一次的点（连线用）
        var shape_line=new annie.Shape();//线条
        var shape=new annie.Shape();//填充
        //shape.clear();
        shape_line.beginStroke('#ffffff',4,2);
        shape.beginFill('#ffffff');
        for(var i=1;i<=3;i++){
            //弧度=角度*Math.PI/180
            //角度=弧度*180/Math.PI
            //s['juli_'+i]=annie.Point.distance(0,0,s.mc_mask['point_'+i].x,s.mc_mask['point_'+i].y);
            //var jiaodu=Math.atan2(s.mc_mask['point_'+i].y,s.mc_mask['point_'+i].x)*180/Math.PI;
            //jiaodu=Math.round(jiaodu);
            //var _y=Math.round(Math.sin(jiaodu)*s['juli_'+i]);
            //var _x=Math.round(Math.cos(jiaodu)*s['juli_'+i]);

            if(i==1){
                var _x=Num_Arry[i-1]/38*s.mc_mask['point_'+i].x;//沟通
                var _y=Num_Arry[i-1]/38*s.mc_mask['point_'+i].y;
            }else if(i==2){
                var _x=Num_Arry[i-1]/40*s.mc_mask['point_'+i].x;//思维
                var _y=Num_Arry[i-1]/40*s.mc_mask['point_'+i].y;
            }else if(i==3){
                var _x=Num_Arry[i-1]/22*s.mc_mask['point_'+i].x;//理论
                var _y=Num_Arry[i-1]/22*s.mc_mask['point_'+i].y;
            }

            if(i===1){
                shape_line.moveTo(_x,_y);
                shape.moveTo(_x,_y);
                p1=[_x,_y];//记录第一点坐标
            }else{
                shape_line.lineTo(_x,_y);
                shape.lineTo(_x,_y);
            }

            //统计数据--能力值--
            var num=Math.round(Num_Arry[i-1]);
            trace((i+'-')+Num_Arry_name[i-1]+':'+num);
            s.mc_txt['mc_'+i].gotoAndStop(String(num).length);
            if(String(num).length==1){
                s.mc_txt['mc_'+i].mc_1.gotoAndStop(num+1);
            }else if(String(num).length==2){
                s.mc_txt['mc_'+i].mc_2.gotoAndStop(Number(String(num)[0])+1);
                s.mc_txt['mc_'+i].mc_1.gotoAndStop(Number(String(num)[1])+1);
            }
        }
        shape_line.lineTo(p1[0],p1[1]);//封口闭合
        shape_line.endStroke();
        shape.endFill();
        s.mc_mask.removeAllChildren();
        s.mc_mask.addChild(shape_line);
        s.mc_mask.addChild(shape);
        shape.alpha=.5;
    }
    function Fun_List(){
        var data={
             1:['案例引入摘要','思维判断','4',0],
             2:['病史采集-中医问诊','沟通能力','18',0],
             3:['病史采集-西医问诊','沟通能力','20',0],
             4:['中医查体-望','理论基础','3',0],
             5:['中医查体-闻','理论基础','3',0],
             6:['中医查体-切','理论基础','3',0],
             7:['西医查体-头','理论基础','4',0],
             8:['西医查体-神经系统','理论基础','4',0],
             9:['辅助检查','思维判断','4',0],
            10:['中医诊断','思维判断','8',0],
            11:['西医诊断','思维判断','8',0],
            12:['中医方案','思维判断','8',0],
            13:['西医方案','思维判断','8',0],
            14:['急救处置','理论基础','5',0],
        };
        s.txt_1.text = my_score;//综合得分 (Num_Arry[0]+Num_Arry[1]+Num_Arry[2])/3
        s.txt_2.text = my_score;//正确率
        for(var i in data){
            trace(i,typeof i)
            data[i][3]=DaTa_All.score[i];//各个模块得分
            for(var j=1;j<=4;j++){
                s.mc_txt['txt_'+i]['txt_'+j].text = data[i][j-1];//
            }
        }
    }
};
A2xExtend(AnnieRoot.baogao.Baogao,annie.Sprite);
baogao.Baogao.prototype.jishi=function (e) {
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


