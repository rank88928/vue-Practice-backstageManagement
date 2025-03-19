import axios from 'axios';

const key = 'CWA-13AD444F-CE5F-49FE-A560-ADEFD9115622';

let weather_api = axios.create({
  baseURL: 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001',
  timeout: 5000,

  params: { Authorization: key },

  transformResponse: [simplify_data, weather_element_format, rename_key],
});

function simplify_data(data) {
  if (typeof data === 'string') {
    data = JSON.parse(data); // 手動解析
  }
  return data.records.location;
}
//合併同時間天氣狀態
function weather_element_format(data) {
  data.forEach((item) => {
    let time_arr = [];
    let map = new Map();

    //根據資料來源建立相同儲存格式
    item.weatherElement[0].time.forEach((item) => {
      let obj = { startTime: item.startTime, endTime: item.endTime, weather: {} };
      time_arr.push(obj);
      map.set(obj.startTime, obj); //建立Map索引
    });
    //把各項狀態合併到同一對象內
    item.weatherElement.forEach((k) => {
      k.time.forEach((j) => {
        let t = map.get(j.startTime);
        if (t) {
          t.weather[k.elementName] = j.parameter;
        }
      });
    });
    item.weatherElement = time_arr;
  });

  return data;
}

function rename_key(data) {
  return data.map((item) => {
    let weather = [];
    item.weatherElement.forEach((item) => {
      weather.push({
        wx: {
          name: item.weather.Wx.parameterName,
        },
        ci: {
          name: item.weather.CI.parameterName,
        },
        max: {
          name: item.weather.MaxT.parameterName,
          value: item.weather.MaxT.parameterUnit,
        },
        mix: {
          name: item.weather.MinT.parameterName,
          value: item.weather.MinT.parameterUnit,
        },
        pop: {
          name: item.weather.PoP.parameterName,
          value: item.weather.PoP.parameterUnit,
        },
        endTime: item.endTime,
        startTime: item.startTime,
      });
    });

    return { city: item.locationName, weather: weather };
  });
}
export default weather_api;
