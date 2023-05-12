import React from "react";
import { useLocation } from "react-router-dom";

function Google() {
  const location = useLocation();
  const { spot } = location.state;

  return (
    <div>
      <iframe
        title="Google"
        width="600"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_KEY}&q=${spot}`}
      ></iframe>
    </div>
  );
}

export default Google;
