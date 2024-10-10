import React from "react";
import "./TrendingCard.css";
import CardShape from "./image/card-shapes.svg";

const TrendingCard = ({ title, description, hueRotateLeft, hueRotateRight }) => {
  return (
    <div className="trending-card">
      <img
        src={CardShape}
        className="trending-card-bg-shape-left"
        style={{
          filter: `blur(4rem) opacity(0.5) hue-rotate(${hueRotateLeft}deg)`,
        }}
        alt="Card Shape Left"
      />
      <img
        src={CardShape}
        className="trending-card-bg-shape-right"
        style={{
          filter: `blur(4rem) opacity(0.5) hue-rotate(${hueRotateRight}deg)`,
        }}
        alt="Card Shape Right"
      />
      
      <div className="trending-card-content">
        <span className="trending-card-title">
          {title.split("\n").map((word, index) => (
            <React.Fragment key={index}>
              {word}
              <br />
            </React.Fragment>
          ))}
        </span>
        <p className="trending-card-description">
          {description.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      </div>
      <div className="trending-card-design">
        <i className="fi fi-sc-sparkles sparkles"></i>
        <button className="practice-button">Practice</button>
      </div>
    </div>
  );
};

export default TrendingCard;
