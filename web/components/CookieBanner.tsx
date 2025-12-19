"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent) {
      return;
    }

    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChoice = (value: "accepted" | "rejected") => {
    localStorage.setItem("cookieConsent", value);
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`cookie-banner ${isVisible ? "show" : ""}`}>
      <div className="container">
        <div className="cookie-content">
          <div className="cookie-text">
            <strong>Vi bruker informasjonskapsler (cookies)</strong>
            <p>Vi bruker cookies for å forbedre brukeropplevelsen og analysere trafikk på siden.</p>
          </div>
          <div className="cookie-buttons">
            <button
              type="button"
              className="cookie-btn cookie-accept"
              onClick={() => handleChoice("accepted")}
            >
              Godta
            </button>
            <button
              type="button"
              className="cookie-btn cookie-reject"
              onClick={() => handleChoice("rejected")}
            >
              Avslå
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
