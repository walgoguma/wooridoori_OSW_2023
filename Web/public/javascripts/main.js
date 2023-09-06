//import { altitude} from './geo.js';

function altitude(geo) {
    var Altitude;
    switch (geo){
        case "CD11110": 
            Altitude = 86;
            break; 
        case "CD11140": 
            Altitude = 267;
            break; 
        case "CD11170": 
            Altitude = 32;
            break; 
        case "CD11200": 
            Altitude = 35;
            break; 
        case "CD11215": 
            Altitude = 29;
            break; 
        case "CD11230": 
            Altitude = 54;
            break; 
        case "CD11260": 
            Altitude = 39;
        break; 
          	
        case "CD11290":
            Altitude = 129;
            break;
        case "CD11305":
            Altitude = 70;
            break;    
        case "CD11320":
            Altitude = 57;  
            break;          
        case "CD11350":
            Altitude = 25;
            break;   
        case "CD11380":
            Altitude = 55;
            break;          
        case "CD11410":
            Altitude = 103;
            break;
        case "CD11440":
            Altitude = 101;
            break;
        case "CD11470":
            Altitude = 23;
            break;   
        case "CD11500":
            Altitude = 80;
            break;          
        case "CD11530":
            Altitude = 56;
            break;          
        case "CD11545":
            Altitude = 45;
            break;          
        case "CD11560":
            Altitude = 25;
            break;          
        case "CD11590":
            Altitude = 29;
            break;          
        case "CD11620":
            Altitude = 142;
            break;
          case "CD11650":
            Altitude = 33;
            break;          
        case "CD11680":
            Altitude = 10;
            break;          
        case "CD11710":
            Altitude = 58;
            break;          
        case "CD11740":
            Altitude = 55;
            break;          
    }
    return Altitude;
}

function sendGeoToServer(geo) {
    $.ajax({
        type: 'POST',  // POST 요청으로 데이터 전송
        url: '/sendGeo', // 서버의 해당 경로로 요청을 보냄
        data: { geo: geo }, // 전송할 데이터를 객체로 지정
        success: function(response) {
            console.log('Geo sent successfully');
        },
        error: function(error) {
            console.error('Error sending geo: ' + error);
        }
    });
}

$(document).ready(function(){
    $('.OUTLINE').click(function() {
        console.log(this.id);                
        $('.OUTLINE.active').removeClass("active");
        $(this).addClass("active");
        console.log(altitude(this.id));
        var geo = altitude(this.id);
        sendGeoToServer(geo);
    });
    
/*
    $('#predict_Btn').click(function() {
        console.log("침수 예측 중 입니다.");                
        getWeather();
    });
*/
});