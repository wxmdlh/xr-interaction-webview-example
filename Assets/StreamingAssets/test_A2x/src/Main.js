window.addEventListener("load",function(){
    annie.debug=false;
    var stage=new annie.Stage("annieEngine",1920,1080,30,annie.StageScaleMode.FIXED_WIDTH,0);
    //默认关闭自动旋转和自动resize
    stage.autoResize=true;
    stage.autoSteering=true;
    stage.addEventListener(annie.Event.ON_INIT_STAGE,function (e) {
    	//想要同时加载多个场景的话，Annie2x.loadScene的第一个参数可以传数组如 ["scene1","scene2",...]
        annie.loadScene("test",function(per){
            console.log("加载进度:"+per+"%");
        },function(result){
            if(result.sceneId==result.sceneTotal){
            	stage.addChild(annie.getDisplay("test","Test"));
            }
        });
    })
    fun_over2 =function(e){
        document.body.style.cursor="pointer";//手型
    };
    fun_out2 =function(e){
        document.body.style.cursor="";//默认 default
    };
});