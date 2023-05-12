import React, { useState, useEffect } from "react";

function App() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [chargingStations, setChargingStations] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      // 위치 정보를 토대로 질문을 생성합니다.
      const question = `
      전기차 충전소 정보: 위도 ${location.latitude}, 경도 ${location.longitude} 근처에 있는 전기차 충전소는 어디인가요? 최신 정보는 필요없습니다. 또한 답변의 예시는 [A 충전소, B 충전소, C 충전소]로 알려줘.`;

      gpt(question);
    }
  }, [location]);

  async function gpt(qna) {
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "야!" }],
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(JSON.stringify(data, null, 2)));
  }

  return (
    <div className="App">
      <h1>위치 정보</h1>
      {location.latitude && location.longitude ? (
        <p>
          위도: {location.latitude}, 경도: {location.longitude}
        </p>
      ) : (
        <p>위치 정보를 가져오는 중...</p>
      )}

      <h1>전기차 충전소 정보</h1>
      {chargingStations ? (
        <p>{chargingStations}</p>
      ) : (
        <p>전기차 충전소 정보를 가져오는 중...</p>
      )}
    </div>
  );
}

export default App;
