function handleMapClick2(map1) {
    // 在这里编写处理地图点击事件的逻辑
    // 可以访问和操作地图对象（例如：map1）
    //点击后弹出地区图层
    map1.on('click', (event) => {
        const states = map1.queryRenderedFeatures(event.point, {
            layers: ['jiangsu-244odb']
          });

          fetch('https://raw.githubusercontent.com/ATFfang/MapShow/main/jiangsu.geojson')
             .then(response => response.json())
             .then(data => {
                map2.remove();
                map2 = new mapboxgl.Map({
                    container: 'map2',
                    style: '',
                    center: [120,32.8],
                    zoom: 6
                });
                
                map2.addSource('your-data', {
                    'type': 'geojson',
                    'data': data
                });
                
                
                map2.addLayer({
                    'id': 'your-data2',
                    'type': 'fill',
                    'source': 'your-data',
                    'paint': {
                         'fill-color': '#400861'
                    },
                    'filter': ['==','NAME', states[0].properties.NAME]
                });

                data.features.forEach(feature => {
                      if (feature.properties.NAME === states[0].properties.NAME) {
                        map2.fitBounds(turf.bbox(feature), {padding: 20});
                        document.getElementById('son-right-container3').innerHTML = `<p><span style="font-weight: bold;color:#b12701;">${feature.properties.NAME}</span></p>`;
                      }
                });									
        });
        
        
    });
  }
  
