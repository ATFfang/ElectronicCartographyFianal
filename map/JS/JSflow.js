class cityFlowData{
    constructor(cityCode,odPoint,flowValue,flowType,flowTime){
        this.cityCode=cityCode;
        this.odPoint=odPoint;
        this.flowValue=flowValue;
        this.flowType=flowType;
        this.flowTime=flowTime;
    }
}

//将OD数据按照city分割成以citycode作为索引的字典，num设置了获取前几个流数据
function getFlowData(path,num)
{
    const dictionary = new Map();
    fetch(path)
        .then(response => response.json())
        .then(jsonData => {
            var j=0;
            var citycode=310000;
            var odPoint=[];
            var flowValue=[];
            var flowtype="";
            for (let i = 0; i < jsonData.length; i++) {
                const item = jsonData[i];
                if(item[2]!=null && item[3]!=null)
                {
                    if((item[0]==citycode || i==0) && j<num){
                        citycode=item[0]
                        flowtime=item[5]
                        odPoint.push([item[2],item[3]])
                        flowValue.push(item[4])
                        flowtype=item[6];
                        j++;
                    }
                    if((item[0]!=citycode  && i!=0))
                    {
                        //console.log(jsonData.length);
                        const cd=new cityFlowData(citycode,odPoint,flowValue,flowtype,flowtime);
                        dictionary.set(cd.cityCode,cd);
                        citycode=item[0];
                        odPoint=[];
                        flowValue=[];
                        j=0;
                    }
                    if(i==jsonData.length-1){
                        odPoint.push([item[2],item[3]])
                        flowValue.push(item[4])
                        const cd=new cityFlowData(citycode,odPoint,flowValue,flowtype,flowtime);
                        dictionary.set(cd.cityCode,cd);
                    }

                }
            }
        })
        .catch(error => {
        console.error(error);
  });
  return dictionary;
}

//获取全局的flowdata，只是放在一个数组里
function getAllFlowData(path,num)
{
    const List=[];
    fetch(path)
        .then(response => response.json())
        .then(jsonData => {
            for (let i = 0; i < num; i++) {
                const item = jsonData[i];
                //console.log(item[2][0]);
                List.push(item); 
                //console.log(item[2],item[3]);
                             
            }
        })
        .catch(error => {
        console.error(error);
  });
  return List;
}



