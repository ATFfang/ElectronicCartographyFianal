function table (O,D) { 
  // function getAllFlowData(path="https://raw.githubusercontent.com/srdqc/flow/main/chart2.json")
  // {
  //   List=[];
  //   fetch(path)
  //       .then(response => response.json())
  //       .then(jsonData => {
  //           for (let i = 0; i < jsonData.length; i++) {
  //               const item = jsonData[i];
  //               if(item.name==code)
  //               {
  //                   List.push(item);
  //               }             
  //           }
  //       })
  //       .catch(error => {
  //       console.error(error);
  //     });
  //   return List;
  // }

  // List=getAllFlowData();

  // console.log(List);
  var randomInt = Math.floor(Math.random() * 5) + 1;
  if(O>1000)
  {
    var List=[[0.188, 0.192,0.191,0.206,0.223],
    [0.190,0.195,0.199,0.206,0.210],
    [0.194,0.194,0.195,0.201,0.216],
    [0.186,0.189,0.2,0.214,0.211],
    [0.191,0.194,0.191,0.202,0.222]]
  }
  if(O<1000)
  {
    var List=[[0.126,0.138,0.183,0.219,0.334],
    [0.389,0.169,0.156,0.14,0.146],
    [0.183,0.156,0.2,0.217,0.244],
    [0.148,0.17,0.206,0.211,0.265],
    [0.183,0.185,0.197,0.205,0.23]]   
  }
  
  const ListO = List[randomInt-1].map(item => Math.abs(item * O+ (Math.random() * 2 - 1) * 0.2));
  const ListD = List[randomInt-1].map(item => Math.abs(item * D+ (Math.random() * 2 - 1) * 0.2));

  setTimeout(()=>{
    //console.log(List[0].date)
    //console.log(List[0]);
    // 按照一以下方式写，把options放在get方法里，满足异步调用的条件
    var data = {
        labels: ["5-1","5-2","5-3","5-4","5-5"],
        datasets: [
          {
            label: "流入强度",
            data: ListO,
            backgroundColor: "#64B7C0",
          },
          {
            label: "流出强度",
            data: ListD,
            backgroundColor: "#515151",
          },
        ],
      };
      
      var options = {
        responsive: true, // 允许图表自适应大小
        maintainAspectRatio: false, // 不保持纵横比，允许图表宽高比例自由变化
        title: {
          display: true,
          text: "流入/流出总量",
          position: "center",
          padding: 30,
          fontFamily: "Arial",
          fontSize: 14,
          fontStyle: "normal",
          fontWeight: "normal",
          fontColor: "#333",
        },
        scales: {
          x: {
            ticks: {
              fontFamily: "Arial",
              fontSize: 12,
              color: "#333",
            },
          },
          y: {
            ticks: {
              fontFamily: "Arial",
              fontSize: 12,
              color: "#333",
            },
          },
        },
      };

    var ctx = document.getElementById("chart-output");

    var chartElement = Chart.getChart(ctx);

    // 销毁先前的图表对象
    if (chartElement) {
      chartElement.destroy();
    }
    console.log(data);
      var myChart=new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options

    });
  
  },200);
}

