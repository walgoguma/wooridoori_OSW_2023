import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier

# 데이터 로딩
df = pd.read_csv('./data.csv')
df = df.set_index(keys = '지역명(쿼리용)')

# 트레이닝과 테스트 데이터 분리
X_train, X_test, y_train, y_test = train_test_split(
    df.drop('침수발생여부(지도학습용)', axis=1), df['침수발생여부(지도학습용)'], test_size=0.3, random_state=1004)

# 모델 학습
model = XGBClassifier()
model.fit(X_train, y_train)

# 예측을 위한 함수
def predict_flood(input_data):
    # 리스트 형태의 입력 데이터를 DataFrame으로 변환
    df_input = pd.DataFrame([input_data], columns=X_train.columns)

    # 모델로 예측
    prediction = model.predict(df_input)

    return prediction

# 예측 실행
import socket

server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_host = '127.0.0.1'  # 서버 호스트 주소
server_port = 12345  # 서버 포트 번호
server_socket.bind((server_host, server_port))
server_socket.listen(1)

import json
while True:
    
    client_socket, client_address = server_socket.accept()
    data = client_socket.recv(1024).decode('utf-8')
    print(f"데이터 요청이 발생하였습니다. : {data}")
    
    json_object = json.loads(data)
    input_data = [float(json_object["geo"]),float(json_object["RN_DAY"]),float(json_object["RN_DUR"]),float(json_object["RN_60M_MAX"]),float(json_object["WS_MAX"]),float(json_object["TA_AVG"]),0]
    
    result = predict_flood(input_data)
    message=str(result[0])
    print(f"예측 결과 {message}")
    client_socket.send(message.encode())
    print("예측 결과를 내보냅니다.")
    
                    
client_socket.close()
server_socket.close()