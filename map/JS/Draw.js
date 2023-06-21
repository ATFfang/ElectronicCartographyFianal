//获取贝塞尔曲线
function getCurvedLine(ps,pe,arci)
{
    if(ps==pe){
      console.log("!");
    }
    const computeControlPoint1 = (ps, pe, arc = arci) => {
        const deltaX = pe[0] - ps[0];
        const deltaY = pe[1] - ps[1];
        const theta = Math.atan(deltaY / deltaX);
        const len = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY)) / 2 * arc;
        const newTheta = theta - Math.PI / 2;
        return [
          (ps[0] + pe[0]) / 2 - len * Math.cos(newTheta),
          (ps[1] + pe[1]) / 2 - len * Math.sin(newTheta),
        ];
    }   

    var controlpoint1=computeControlPoint1(ps,pe)

    var linePoints=[ps,controlpoint1,pe];
      

    var line = turf.lineString(linePoints);

    var curved = turf.bezierSpline(line);
    var curveCoordinates = curved.geometry.coordinates;

    return curveCoordinates;
}

//从点集转为弧线
function getArcFeature(lineList, valueList,arc)
{
  

  var curveCoordinatesList=[];
			lineList.forEach((line) => {
				// 在回调函数中使用 line 进行操作
				curveCoordinatesList.push(getCurvedLine(line[0],line[1],arc))
			}); 

  const featureCollection = {
    type: 'FeatureCollection',
    features: []
  };
    
  for (let i = 0; i < curveCoordinatesList.length; i++) {
      const curveCoordinates = curveCoordinatesList[i];
      const feature = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: curveCoordinates
        },
        properties: {
          'value':valueList[i]
        }
      };
    
    featureCollection.features.push(feature);
  }


  return featureCollection;
}

//-----------------------------------------------------------------------------------------
//绘制弧线图层
//以下所有绘制的流，都必须添加一个统一标识字段“_flow”
function addArctoMap(map1,featureCollection,lineList, valueList,drawnum,colorKind)//输入：map，弧线集合，点集（为了取得终点），强度集
{


  const max = Math.max(...valueList)
  const min = Math.min(...valueList)

  if(colorKind=="cold" || colorKind=="V")
  {
    var colorList=['rgba(62, 16, 75, 0.4)','rgba(62, 16, 75, 0.6)','#4F709C','#40128B']
  }
  else if(colorKind=="warm" || colorKind=="R")
  {
    var colorList=['rgba(233, 188, 40, 0.4)','rgba(233, 188, 40, 0.6)','rgb(196, 52, 16)','rgb(129, 22, 0)']
    
  }
  //添加线图层
  map1.addSource('line_flow'+drawnum, {
    'type': 'geojson',
    lineMetrics: true,
    'data': featureCollection
  });


  map1.addLayer({
    'id': 'line_flow'+drawnum,
    'type': 'line',
    'source': 'line_flow'+drawnum,
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-width': [
        'interpolate',
        ['linear'],
        ['get', 'value'], // 使用 feature 的 value 字段作为插值属性
        min, // 最小值
        0.5, // 最小线宽
        max, // 最大值
        5 // 最大线宽
      ],
      'line-gradient': [
        'interpolate',
        ['linear'],
        ['line-progress'],
        0,
        colorList[0],
        0.4,
        colorList[1],
        1,
        colorList[2]
      ]
      
    }
  });

  //添加终点点
  var i=0;
  var endPointList=[];
  for (const line of lineList) {
    const endPoint = line[1];
    const endPointGeoJSON = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [endPoint[0], endPoint[1]]
      },
      properties: {
        'value':valueList[i]
      }
    };
    endPointList.push(endPointGeoJSON);
    i++;
  }

  const pointCollection = {
    type: 'FeatureCollection',
    features: endPointList
  };

  map1.addSource('end-city-points_flow'+drawnum, {
    'type': 'geojson',
    'data': pointCollection
  });

  // 添加点图层
  map1.addLayer({
    'id': 'city-points-layer_flow'+drawnum,
    'type': 'circle',
    'source': 'end-city-points_flow'+drawnum,
    'paint': {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['get', 'value'], // 使用 feature 的 value 字段作为插值属性
        min, // 最小值
        2, // 最小线宽
        max, // 最大值
        6 // 最大线宽
      ],
      'circle-color': colorList[3]
    }
  });
}

//-----------------------------------------------------------------------------------------
//添加点图层(不是flow里面的)
function addPoints(map1){
  map1.addSource('city-points', {
                'type': 'geojson',
                'data': 'https://raw.githubusercontent.com/ATFfang/ElectronicCartography/main/data/point/CityPointWGS84.geojson'
            });
        
  // 添加点图层
  map1.addLayer({
    'id': 'city-points-layer',
    'type': 'circle',
    'source': 'city-points',
    'paint': {
        'circle-radius': 3,
        'circle-color': '#ff0000'
      }
  });
}

//-----------------------------------------------------------------------------------------
//流动动画
function flowanimation(map1,feature,i,start,value,drawnum,colorKind)
{
  //console.log(value);
  if(colorKind=="cold"|| colorKind=="V")
  {
    var colorList=['rgba(91, 23, 109, 0.6)']
  }
  else if(colorKind=="warm"|| colorKind=="R")
  {
    var colorList=['rgba(255, 106, 0, 0.4)']
  }

  //console.log(start)

  if(value>3)
  {
    value=3;
  }
  if(value<2)
  {
    value=2;
  }


  map1.addLayer({
    id: 'marker_flow'+i+drawnum,
    type: 'circle',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: start // 光点初始位置
          }
        }]
      }
    },
    
    paint: {
      'circle-radius': value, // 圆的半径
      'circle-color':  colorList[0]// 圆的颜色
    }
  });
  

  // 设置动画参数和弧线坐标点
  const animationDuration = 5000; // 动画持续时间（毫秒）
  var curveCoordinates = feature.geometry.coordinates; // 弧线的坐标点
   
  // 开始动画
  function startAnimation() {
    let startTime = null;
  
    function animateMarker(timestamp) {
      if (!startTime) startTime = timestamp;
  
      const progress = timestamp - startTime; // 计算动画进度
  
      // 计算当前光点位置
      var currentCoordinates = turf.along(
        turf.lineString(curveCoordinates),
        (progress / animationDuration) * (turf.length(turf.lineString(curveCoordinates)))
      ).geometry.coordinates;

      // 更新图层的位置
      map1.getSource('marker_flow'+i+drawnum).setData({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: currentCoordinates
          }
        }]
      });
  
      // 检查动画是否结束
      if (progress < animationDuration) {
        // 递归调用进行下一帧动画
        requestAnimationFrame(animateMarker);
      } 
      else {
        // 动画完成后重新开始动画
        startTime = null;
        requestAnimationFrame(animateMarker);
      }
    }
  
    // 启动动画
    requestAnimationFrame(animateMarker);
  }
  
  // 启动循环动画
  startAnimation();
  
}

//-----------------------------------------------------------------------------------------
//起始点扩散动画
function changeStartPoint(map1,startpoint,drawnum,colorKind){

  if(colorKind=="cold"|| colorKind=="V")
  {
    var colorList=['rgba(91, 23, 109, 0.6)','rgba(91, 23, 109, ']
  }
  else if(colorKind=="warm"|| colorKind=="R")
  {
    var colorList=['rgba(254, 141, 2, 0.6)','rgba(254, 141, 2, ']
  }

  // 定义动画持续时间和帧率
  const animationDuration = 5000; // 动画持续时间，单位为毫秒

  // 定义点的初始大小和最终大小
  const initialSize = 5; // 初始大小
  const finalSize = 20; // 最终大小


  // 创建点的初始样式
  map1.addLayer({
      id: 'point_bigger_flow'+drawnum,
     type: 'circle',
      source: {
         type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                  type: 'Point',
                  coordinates: startpoint // 点的坐标
              },
            }],
        },
      },
      paint: {
      'circle-radius': initialSize, // 圆的半径
      'circle-color': colorList[0] // 圆的颜色
    }
  });

  function startAnimation() {
    let startTime = null;
  
    function animateMarker(timestamp) {
      if (!startTime) startTime = timestamp;
  
      const progress = timestamp - startTime; // 计算动画进度
  
       // 计算当前帧的大小
       const currentSize = initialSize + (finalSize - initialSize) * progress/animationDuration;
       // 更新点的大小
       if(map1.getLayer('point_bigger_flow'+drawnum))
       {
          map1.setPaintProperty('point_bigger_flow'+drawnum, 'circle-radius', currentSize);
          if(progress>animationDuration*0.9||progress<animationDuration*0.01)
          {
            map1.setPaintProperty('point_bigger_flow'+drawnum, 'circle-color', 'rgba(0, 0, 0, 0)');
          }
          else {
            var color0=0.6-progress/animationDuration*0.7
            if(color0<0)
            {
              color0;
            }
            map1.setPaintProperty('point_bigger_flow'+drawnum, 'circle-color', colorList[1]+color0+')');
          }
          
       }
       
  
      // 检查动画是否结束
      if (progress < animationDuration) {
        // 递归调用进行下一帧动画
        requestAnimationFrame(animateMarker);
      } 
      else {
        // 动画完成后重新开始动画
        startTime = null;
        if(map1.getLayer('point_bigger_flow'+drawnum))
        {

            requestAnimationFrame(animateMarker);
        }

        else{
          return 0;
        }
        
      }
    }
  
    // 启动动画
    requestAnimationFrame(animateMarker);
  }
  
  // 启动循环动画
  startAnimation();
  
}

function changeStartPoint2(map1,startpoint,drawnum,colorKind){

  if(colorKind=="cold"|| colorKind=="V")
  {
    var colorList=['rgba(91, 23, 109, 0.3)','rgba(91, 23, 109, ']
  }
  else if(colorKind=="warm"|| colorKind=="R")
  {
    var colorList=['rgba(255, 170, 0, 0.3)','rgba(255, 170, 0, ']
  }

  // 定义动画持续时间和帧率
  const animationDuration = 5000; // 动画持续时间，单位为毫秒

  // 定义点的初始大小和最终大小
  const initialSize = 5; // 初始大小
  const finalSize = 30; // 最终大小


  // 创建点的初始样式
  map1.addLayer({
      id: 'point_bigger_flow2'+drawnum,
     type: 'circle',
      source: {
         type: 'geojson',
        data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                  type: 'Point',
                  coordinates: startpoint // 点的坐标
              },
            }],
        },
      },
      paint: {
      'circle-radius': initialSize, // 圆的半径
      'circle-color': colorList[0] // 圆的颜色
    }
  });

  function startAnimation() {
    let startTime = null;
  
    function animateMarker(timestamp) {
      if (!startTime) startTime = timestamp;
  
      const progress = timestamp - startTime; // 计算动画进度
  
       // 计算当前帧的大小
       const currentSize = initialSize + (finalSize - initialSize) * progress/animationDuration;
       // 更新点的大小
       if(map1.getLayer('point_bigger_flow2'+drawnum))
       {
          map1.setPaintProperty('point_bigger_flow2'+drawnum, 'circle-radius', currentSize);
          if(progress<animationDuration*0.2||progress>animationDuration*0.9)
          {
            map1.setPaintProperty('point_bigger_flow2'+drawnum, 'circle-color', 'rgba(0, 0, 0, 0)');
          }
          else {
            var color0=0.3-progress/animationDuration*0.3
            if(color0<0)
            {
              color0;
            }
            map1.setPaintProperty('point_bigger_flow2'+drawnum, 'circle-color', colorList[1]+color0+')');
          }
          
       }
       
  
      // 检查动画是否结束
      if (progress < animationDuration) {
        // 递归调用进行下一帧动画
        requestAnimationFrame(animateMarker);
      } 
      else {
        // 动画完成后重新开始动画
        startTime = null;
        if(map1.getLayer('point_bigger_flow2'+drawnum))
        {

            requestAnimationFrame(animateMarker);
        }

        else{
          return 0;
        }
        
      }
    }
  
    // 启动动画
    requestAnimationFrame(animateMarker);
  }
  
  // 启动循环动画
  startAnimation();
  
}

//-----------------------------------------------------------------------------------------
function clearMap(map) {

  // 清除非基础图层
  map.getStyle().layers.forEach(function(layer) {
    if (layer.id.includes("_flow")) {
      //console.log(layer.id);
      map.removeLayer(layer.id);
    }
  });

  // 清除所有源
  map.getStyle().layers.forEach(function(source) {
    if (source.id!=null) 
    {
      //console.log(source.id);
      
      if(source.id.includes("_flow"))
      {
        console.log(source.id);
        map.removeSource(source);
        
      }
      
    } 
  });
}

//-----------------------------------------------------------------------------------------
//将所有绘制逻辑全部封装进一个函数，输入：OD流坐标以及强度
function odFlowSence(map1,lineList,flowValue,drawnum,colorKind){

  //获取弧线
  featureCollection=getArcFeature(lineList,flowValue,0.2);

  //绘制弧线
  addArctoMap(map1,featureCollection,lineList,flowValue,drawnum,colorKind);

  //绘制城市点
  //addPoints(map1);

  //绘制流动点
  for (var i = 0; i < featureCollection.features.length; i++)
  {
    flowanimation(map1,featureCollection.features[i],i,featureCollection.features[0],flowValue[i],drawnum,colorKind);
  }

  //点动画变大
  changeStartPoint2(map1,featureCollection.features[0].geometry.coordinates[0],drawnum,colorKind);
  changeStartPoint(map1,featureCollection.features[0].geometry.coordinates[0],drawnum,colorKind);
}

//-----------------------------------------------------------------------------------------
//对于绘制进行二次封装，只需输入一个预计好的类即可,这个类表示一个城市，还需要输入一个绘制线条的数量，因此，需要要求数据表中的数据从大到小排列
function odFlowSenceSimple(map1,cityFlowData,upperLimit){
  odFlowSence(map1,cityFlowData.odPoint.slice(0, upperLimit),cityFlowData.flowValue.slice(0, upperLimit),cityFlowData.cityCode+"in"+cityFlowData.flowTime+Date.parse(new Date()),cityFlowData.flowType)
}


//——————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
//以下为全局绘制的函数

//----------------------------------------------------------------------------------------
//绘制线
function addArctoMapAll(map1,featureCollection,colorKind)//输入：map，弧线集合，点集（为了取得终点），强度集
{
  drawnum=Date.parse(new Date())+"";
  valueList=[];

  OList=[];
  OValueList=[];
  DList=[];
  DValueList=[];

  //点的流入流出强度和
  ODValueList=[];
  featureCollection.features.forEach(function(feature) {
    xy=feature.geometry.coordinates[0];
    valueList.push(feature.properties.value);
    if (!OList.includes(xy)) {
      OList.push(xy)
      DList.push(feature.geometry.coordinates[feature.geometry.coordinates.length-1])
      OValueList.push(feature.properties.value);
    }
    else{
      OValueList[OList.indexOf(xy)]=OValueList[OList.indexOf(xy)]+feature.properties.value;
    }
  });
  
  const max = Math.max(...valueList)
  const min = Math.min(...valueList)

  if(colorKind=="cold" || colorKind=="V")
  {
    //最小线宽、最大线宽、指数系数、终点大小，起点大小（最小、最大），起点颜色插值
    var lineList=[0.01,1.6,0.999,2,1,3,0.98];
    var colorList=['rgba(42, 86, 230, 0.3)','rgba(62, 16, 75, 0.3)','rgba(58, 29, 223, 0.4)','rgba(84, 12, 115, 1)','rgba(200, 110, 238, 0.1)','rgba(200, 110, 238, 0.8)']
  }
  else if(colorKind=="warm" || colorKind=="R")
  {
    var lineList=[0.01,2,0.8,1.5,1.5,4,0.5];
    var colorList=['rgba(229, 196, 10, 0.8)','rgba(182, 122, 0, 0.8)','rgba(229, 196, 10, 0.811)','rgba(228, 157, 0, 0.3)','rgba(228, 157, 0, 0.1)','rgba(228, 157, 0, 0.8)']
    
  }
  //添加线图层
  map1.addSource('line_flow', {
    'type': 'geojson',
    lineMetrics: true,
    'data': featureCollection
  });


  map1.addLayer({
    'id': 'line_flow',
    'type': 'line',
    'source': 'line_flow',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-width': [
        'interpolate',
        ['exponential',lineList[2]],
        ['get', 'value'], // 使用 feature 的 value 字段作为插值属性
        min, // 最小值
        lineList[0], // 最小线宽
        max, // 最大值
        lineList[1],// 最大线宽
      ],
      'line-color': [
        'interpolate',
        ['exponential',lineList[6]],
        ['get', 'value'],
        min, // 最小值
        colorList[0], // 最小颜色
        max, // 最大值
        colorList[1] // 最大颜色
      ]
      
    }
  });

  // 创建一个空的 FeatureCollection 对象
  let PointfeatureCollection = {
    "type": "FeatureCollection",
    "id":'o-city-points_flow',
    "features": []
  };

// 遍历 OList 数组并将每个坐标点转化为一个 Feature，然后添加到 FeatureCollection
  for (let i = 0; i < OList.length; i++) {
    let feature = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": OList[i]
    },
    "properties": {'value':OValueList[i]} 
  };
  
    PointfeatureCollection.features.push(feature);
  }

  //console.log(PointfeatureCollection);

  map1.addSource('o-city-points_flow', {
    'type': 'geojson',
    'data': PointfeatureCollection
  });


  const max2 = Math.max(...OValueList);
  const min2 = Math.min(...OValueList);

  //console.log(min2,max2);
  // 添加点图层
  map1.addLayer({
    'id': 'o-points-layer_flow',
    'type': 'circle',
    'source': 'o-city-points_flow',
    'paint': {
      'circle-radius': [
        'interpolate',
        ['exponential',0.5],
        ['get', 'value'], // 使用 feature 的 value 字段作为插值属性
        min2, // 最小值
        lineList[4], // 最小线宽
        max2, // 最大值
        lineList[5] // 最大线宽
      ],
      'circle-color': [
    'interpolate',
    ['exponential',1],
    ['get', 'value'],
    min2, // 最小值
    colorList[4], // 最小颜色
    max2, // 最大值
    colorList[3] // 最大颜色
  ]
    }
  });


  // 创建一个空的 FeatureCollection 对象
  let PointfeatureCollection2 = {
    "type": "FeatureCollection",
    "id":'d-city-points_flow',
    "features": []
  };

// 遍历 DList 数组并将每个坐标点转化为一个 Feature，然后添加到 FeatureCollection
  for (let i = 0; i < DList.length; i++) {
    let feature = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": DList[i]
    },
    "properties": {'value':OValueList[i]} 
  };
    PointfeatureCollection2.features.push(feature);
  }

  map1.addSource('d-city-points_flow', {
    'type': 'geojson',
    'data': PointfeatureCollection2
  });

  // 添加点图层
  map1.addLayer({
    'id': 'd-points-layer_flow',
    'type': 'circle',
    'source': 'd-city-points_flow',
    'paint': {
      'circle-radius': lineList[3],
      'circle-color': colorList[5]
    }
  });
}


//全局的绘制，不展示动画，并且直接输入list绘制
function drawAll(map1,cityFlowList,upperLimit,arc)
{

  odPoint=[];
  flowValue=[];
  Type="";

  for (var i = 0; i < upperLimit-1; i++) {
    if(cityFlowList[i][2][0]!=cityFlowList[i][3][0])
    {
      odPoint.push([cityFlowList[i][2],cityFlowList[i][3]]);
      flowValue.push(cityFlowList[i][4])
      Type=cityFlowList[i][6];
    } 
  }

  featureCollection=getArcFeature(odPoint, flowValue,arc);

  //console.log(featureCollection);

  addArctoMapAll(map1,featureCollection,Type);
   
}