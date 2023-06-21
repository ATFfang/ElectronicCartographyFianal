        //添加主map
        mapboxgl.accessToken = 'pk.eyJ1IjoieHV5dXNodSIsImEiOiJjbGVoMWtvaTYwY2dpM3lqdzlnbDAzYzJnIn0.R5VkVKO7bSPtCJQrTrsvhg';
        var map1 = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/xuyushu/clj3vhf0n01io01pg0t3ke89m',
            center: [112,36],
            zoom: 3
        });

        var ODATA=[];
        var DDATA=[]; 

        //Slider();

        //加载时，顺便加载矢量底图
        map1.on('load', function () {
            
            
			fetch('https://raw.githubusercontent.com/ATFfang/ElectronicCartography/main/data/flow/O.json')
            .then(response => response.json())
            .then(jsonData => {
                for (let i = 0; i < jsonData.length; i++) {
                    ODATA.push(jsonData[i])
                }
            })
            .catch(error => {
                console.error(error);
            });	

            fetch('https://raw.githubusercontent.com/ATFfang/ElectronicCartography/main/data/flow/D.json')
            .then(response => response.json())
            .then(jsonData => {
                for (let i = 0; i < jsonData.length; i++) {
                    DDATA.push(jsonData[i])
                }
            })
            .catch(error => {
                console.error(error);
            });

            
        });


        var Citydatapath='https://raw.githubusercontent.com/ATFfang/ElectronicCartography/main/data/flow/filtered_data.json';
        var Alldatapath='https://raw.githubusercontent.com/Wishingtreee/Flow/overall_flow/af_2019_overall.json'
        var Timeyear=2019;
        var Flowtype='mf';
        var cdDic=null;
        var O=0;
        var D=0;
        var imgname;

        var img=document.createElement("img");
        var imgPath;

         // 获取滑块元素
         var slider = document.getElementById('slider');
         var rate=1;

         // 监听滑块值的变化
         slider.addEventListener('input', function(e) {
            if(Flowtype=='mf')
            {
                rate=1;
            }
            if(Flowtype=='af')
            {
                rate=300;
            }
             // 获取滑块的当前值
             var value = parseInt(e.target.value)*rate;        
 
             // 根据滑块的值设置过滤器条件
             var filter = ['>=', 'value', value];
 
             // 设置 'line_flow' 图层的过滤器
             map1.setFilter('line_flow', filter);
             map1.setFilter('o-points-layer_flow', filter);
             map1.setFilter('d-points-layer_flow', filter);
         });

        $(document).ready(function(){
            $('.time-selection').click(function(e){
                e.preventDefault(); // 阻止<a>标签的默认行为
                var selectedTime = $(this).text(); // 获取<a>标签的文本，即选中的时间
                //console.log(selectedTime)
                if(selectedTime=='2019-5')
                {
                    Timeyear=2019;
                }
                if(selectedTime=='2020-5')
                {
                    Timeyear=2020;
                }
                if(selectedTime=='2023-5')
                {
                    Timeyear=2023;
                }
                Citydatapath='https://raw.githubusercontent.com/Wishingtreee/Flow/grouped_flow/'+Flowtype+'_'+Timeyear+'_group.json';
                Alldatapath='https://raw.githubusercontent.com/Wishingtreee/Flow/overall_flow/'+Flowtype+'_'+Timeyear+'_overall.json';
                
            });
        });


        

        $(document).ready(function(){
            $('.type-selection').click(function(e){
                e.preventDefault(); // 阻止<a>标签的默认行为
                var selectedType = $(this).text(); // 获取<a>标签的文本，即选中的时间
                if(selectedType=="迁徙流")
                {
                    Flowtype="mf";
                }
                if(selectedType=="关注流")
                {
                    Flowtype="af";
                }
                Citydatapath='https://raw.githubusercontent.com/Wishingtreee/Flow/grouped_flow/'+Flowtype+'_'+Timeyear+'_group.json';
                Alldatapath='https://raw.githubusercontent.com/Wishingtreee/Flow/overall_flow/'+Flowtype+'_'+Timeyear+'_overall.json';
            });
        });


        function getImagein(imgname){           
            if(Flowtype=="mf"&&Timeyear==2019)
                {
                    imgname="2019_mf_in.png";
                }
                if(Flowtype=="mf"&&Timeyear==2020)
                {
                    imgname="2020_mf_in.png";
                }
                if(Flowtype=="mf"&&Timeyear==2023)
                {
                    imgname="2023_mf_in.png";
                }
                if(Flowtype=="af"&&Timeyear==2019)
                {
                    imgname="2019_af_in.png";
                }
                if(Flowtype=="af"&&Timeyear==2020)
                {
                    imgname="2020_af_in.png";
                }
                if(Flowtype=="af"&&Timeyear==2023)
                {
                    imgname="2023_af_in.png";
                }               
            var imgPath="./image/in/" + imgname;            
            return imgPath;
            
        }

        function getImageout(imgname){
            if(Flowtype=="mf"&&Timeyear==2019)
                {
                    imgname="2019_mf_out.png";
                }
                if(Flowtype=="mf"&&Timeyear==2020)
                {
                    imgname="2020_mf_out.png";
                }
                if(Flowtype=="mf"&&Timeyear==2023)
                {
                    imgname="2023_mf_out.png";
                }
                if(Flowtype=="af"&&Timeyear==2019)
                {
                    imgname="2019_af_out.png";
                }
                if(Flowtype=="af"&&Timeyear==2020)
                {
                    imgname="2020_af_out.png";
                }
                if(Flowtype=="af"&&Timeyear==2023)
                {
                    imgname="2023_af_out.png";
                }                          
            var imgPath2="./image/out/" + imgname;
            return imgPath2;
            
        }

        $(document).ready(function(){
            $('.getorclean').click(function(e){
                e.preventDefault(); // 阻止<a>标签的默认行为
                var getorclean = $(this).text(); // 获取<a>标签的文本，即选中的时间 
                if(getorclean=="获取")
                {
                    var div = document.getElementById("list1"); 
                    while(div.firstChild){
                         div.removeChild(div.firstChild);
                        }
                    var div2 = document.getElementById("list2"); 
                    while(div2.firstChild){
                            div2.removeChild(div2.firstChild);
                        }
                    clearMap(map1);
                    console.log(Citydatapath)
                    //读取每个城市排名前40的数据，
                    cdDic=getFlowData(Citydatapath,40);
                    //console.log(cdDic);
                    var div1 = document.getElementById("list1");
                    var img1 = document.createElement("img");
                    img1.src = getImagein(imgname)
                    div1.appendChild(img1);
                    var div2 = document.getElementById("list2");
                    var img2 = document.createElement("img");
                    img2.src = getImageout(imgname)
                    div2.appendChild(img2);

                }

                if(getorclean=="全局")
                {
                    console.log(Alldatapath);
                    var allList= getAllFlowData(Alldatapath,3000);
                    setTimeout(()=>{
                        //如果是实体流，arc设为0.3，如果是虚拟流，arc设置0.25
                        drawAll(map1,allList,2000,0.25);
                        allList=[];
                    },100);
                }

                if(getorclean=="清除")
                {
                    map1.remove();

                    map1 = new mapboxgl.Map({
                        container: 'map',
                        style: 'mapbox://styles/xuyushu/clj3vhf0n01io01pg0t3ke89m',
                        center: [112,36],
                        zoom: 3
                    });

                    var div = document.getElementById("list1"); 
                    while(div.firstChild){
                         div.removeChild(div.firstChild);
                        }
                    var div2 = document.getElementById("list2"); 
                    while(div2.firstChild){
                            div2.removeChild(div2.firstChild);
                        }

                    table(0,0); 

                    map1.on('click', (event) => {

                        //清理其他图层
                        clearMap(map1);
    
                        //获取属地json
                        const states = map1.queryRenderedFeatures(event.point, {
                            layers: ['china-polygon-simple']
                        });
                
                        //缩放到点击地
                        map1.setCenter([states[0].properties.PointX,states[0].properties.PointY])
                        map1.setZoom(5);
                
                
                
                        if(cdDic.get(states[0].properties.市代码))
                        {
                            Citycode=states[0].properties.市代码;
                            //console.log(Citycode);
                            //函数包括：地图图层，城市流动Dic,显示数量
                            odFlowSenceSimple(map1,cdDic.get(states[0].properties.市代码),cdDic.get(states[0].properties.市代码).flowValue.length);
                        }
                        else{
                            console.log("没有");
                        }

                        for(let i = 0; i < ODATA.length; i++)
                        {
                            if(ODATA[i][1]==Timeyear&&ODATA[i][2]==Citycode&&ODATA[i][3]==Flowtype+'\r')
                            {
                                O=ODATA[i][0];
                            }               
                        }   
                        for(let i = 0; i < DDATA.length; i++)
                        {
                            if(DDATA[i][1]==Timeyear&&DDATA[i][2]==Citycode&&DDATA[i][3]==Flowtype+'\r')
                                {
                                     D=DDATA[i][0];
                                }               
                        }

                        setTimeout(()=>{
                            document.getElementById("td1").innerHTML = O
                            document.getElementById("td2").innerHTML =D
                            table(O,D);               
                        },200);
                
                    })

                }
            });
        });


        var Citycode=0;

        map1.on('click', (event) => {
            
            //清理其他图层
			clearMap(map1);

            //获取属地json
            const states = map1.queryRenderedFeatures(event.point, {
                layers: ['china-polygon-simple']
              });
            
            //缩放到点击地
            map1.setCenter([states[0].properties.PointX,states[0].properties.PointY])
            map1.setZoom(5);
            
            
            if(cdDic.get(states[0].properties.市代码))
            {
                Citycode=states[0].properties.市代码;
                //console.log(Citycode);
                //函数包括：地图图层，城市流动Dic,显示数量
			    odFlowSenceSimple(map1,cdDic.get(states[0].properties.市代码),cdDic.get(states[0].properties.市代码).flowValue.length);
            }
            else{
                console.log("没有");
            }

            for(let i = 0; i < ODATA.length; i++)
            {
                if(ODATA[i][1]==Timeyear&&ODATA[i][2]==Citycode&&ODATA[i][3]==Flowtype+'\r')
                {
                    O=ODATA[i][0];
                }               
            }
            for(let i = 0; i < DDATA.length; i++)
            {
                if(DDATA[i][1]==Timeyear&&DDATA[i][2]==Citycode&&DDATA[i][3]==Flowtype+'\r')
                {
                    D=DDATA[i][0];
                }               
            }

            setTimeout(()=>{
                
                document.getElementById("td1").innerHTML = O
                document.getElementById("td2").innerHTML = D
                table(O,D);          
            },200);
		})





        


        


        
        
            



        


        


        


        
        
        
        
        
        
        
        
            
      

