import React, { useState, useEffect } from "react";

function App() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [chargingStations, setChargingStations] = useState([]);
  const [isGptLoading, setIsGptLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (position.coords.latitude && position.coords.longitude) {
        const question = `
        전기차 충전소 정보: 위도 ${position.coords.latitude}, 경도 ${position.coords.longitude} 근처에 있는 전기차 충전소는 어디야? 최신 정보랑 실시간 정보는 필요없어. 또한 답변의 예시는 [충전소, 충전소, 충전소] 이런 포맷으로 알려줘. 포맷 그대로 응답하지 말고 실제 충전소 이름을 앞에 붙여서 줘야해`;

        gpt(question);
      } else {
        alert("위도 경도가 인식되지 않았습니다. 새로고침을 하셔야 합니다.");
      }
    });
  }, []);

  const gpt = async (qna) => {
    setIsGptLoading(true);

    const SK = "sk";
    const PW = "PmOKONxRK0flC3nf119fT3BlbkFJavcfTJNRW3ZhqcQUkARh";

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SK}-${PW}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: qna }],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        try {
          const newData = data?.choices[0]?.message?.content;
          const start = newData.indexOf("[");
          const end = newData.indexOf("]");
          const stations = newData
            .slice(start + 1, end)
            .split(",")
            .filter(
              (station) => station.includes("충전") && station !== "충전소"
            );

          console.log(stations);
          setChargingStations(stations);
        } catch (e) {
          setChargingStations([]);
        }
      })
      .catch(() => setChargingStations([]))
      .finally(() => setIsGptLoading(false));
  };

  const toMap = (spot) => {
    window.location.href = `https://www.google.co.kr/maps/search/${spot}`;
  };

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

      {/* loading */}
      {isGptLoading ? <p>충전소 정보 가져오는 중</p> : <div></div>}

      {/* 충전소 정보 */}
      {chargingStations.length > 0 ? (
        chargingStations.map((station, index) => (
          <p key={station + `${index}`} onClick={() => toMap(station)}>
            {station.replaceAll(",", "").replaceAll('"', "")}
          </p>
        ))
      ) : (
        <p>chat GPT를 통해 충전소 정보를 검색하고 있습니다.</p>
      )}
    </div>
  );
}

export default App;
