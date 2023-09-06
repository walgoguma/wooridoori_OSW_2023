var express = require('express');
var router = express.Router();
const request = require('request');
const net = require('net');

var geo=null;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
});

router.post('/sendGeo', function(req, res) {
  geo = req.body.geo; // 클라이언트에서 보낸 geo 값을 가져옴
  console.log('Received geo: ' + geo);
  
  // 이제 geo 값을 사용하여 필요한 작업을 수행할 수 있음
  
  res.send('Geo received successfully');
});

router.get('/getWeather', function(req, res) {
  const tm = "";
  const stnSeoul = 108;
  const help = 0;
  const key = 'IwP4aEcyQr2D-GhHMqK98Q'
  const url = `https://apihub.kma.go.kr/api/typ01/url/kma_sfcdd.php?tm=${tm}&stn=${stnSeoul}&help=${help}&authKey=${key}`;

  var TM, RN_DAY, RN_DUR, RN_60M_MAX, WS_MAX, TA_AVG;

  request(url, (error, response) => {
      if (!error && response.statusCode == 200) {
          var data = response.body.split('\n')[5];
          var dataSplied = data.split(',');

          //1. 날짜, 39. 일강수량, 41. 강수계속시간, 42. 1시간 최다강수량 6. 최대풍속, 11. 일평균기온
          TM = dataSplied[0] >= 0 ? dataSplied[0] : 0;
          RN_DAY = dataSplied[38] >= 0 ? dataSplied[38] : 0;
          RN_DUR = dataSplied[40] >= 0 ? dataSplied[40] : 0;
          RN_60M_MAX = dataSplied[41] >= 0 ? dataSplied[41] : 0;
          WS_MAX = dataSplied[5] >= 0 ? dataSplied[5] : 0;
          TA_AVG = dataSplied[10] >= 0 ? dataSplied[10] : 0;

          if(geo != null){
            const host = '127.0.0.1';
            const port = 12345;
            var predResult;
            // 소켓 생성 및 서버에 연결
            const client = new net.Socket();
            
            client.connect(port, host, () => {
                console.log(`Connected to server at ${host}:${port}`);
                
                // 메시지 전송
                const message = JSON.stringify({
                  geo: geo,
                  TM: TM,
                  RN_DAY: RN_DAY,
                  RN_DUR: RN_DUR,
                  RN_60M_MAX: RN_60M_MAX,
                  WS_MAX: WS_MAX,
                  TA_AVG: TA_AVG,
                });
                client.write(message);
            });
            // 서버로부터 데이터 수신
            client.on('data', (data) => {
              console.log(`Received message from server: ${data}`);
              predResult=data
              // 클라이언트 종료
              res.send(predResult);
              client.end();
            });

            // 연결 종료 시
            client.on('close', () => {
              console.log('Connection closed');
            });

            client.on('error', function(err){
              console.log(err);
            });
            
              
          }
          else{
            res.send('지역을 선택해주세요.');
          }
      } else {
          res.status(500).json({ error: 'Failed to fetch weather data' });
      }
  });
});



module.exports = router;
