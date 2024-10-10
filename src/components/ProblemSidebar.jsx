import React, { useState, useEffect } from "react";
import "./ProblemSidebar.css";
import CardShape from "./image/card-shapes.svg";

const ProblemSidebar = () => {
  const [rotation, setRotation] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (event) => {
    const card = event.currentTarget.getBoundingClientRect();
    const cardWidth = card.width;
    const cardHeight = card.height;
    const cardCenterX = card.left + cardWidth / 2;
    const cardCenterY = card.top + cardHeight / 2;

    // Calculate the mouse position relative to the card's center
    const mouseX = event.clientX - cardCenterX;
    const mouseY = event.clientY - cardCenterY;

    // Calculate rotation values based on the mouse position within the card
    const rotateY = (mouseX / cardWidth) * 30; // Rotates on the Y-axis between -15 and 15 degrees
    const rotateX = (mouseY / cardHeight) * -30; // Rotates on the X-axis between -15 and 15 degrees

    setRotation({ rotateX, rotateY });
  };

  const resetRotation = () => {
    setRotation({ rotateX: 0, rotateY: 0 }); // Reset the rotation when the mouse leaves the card
  };

  return (
    <div className="sidebar">
      <div className="topics">
        <h2 className="sidebar-heading">TOPICS</h2>
        <ul className="topic-list">
          <li>
            <i class="fi fi-rr-cubes topic-icons"></i>
            <span>Arrays</span>
          </li>
          <li>
            <i class="fi fi-rr-circle-a topic-icons"></i>
            <span>Strings</span>
          </li>
          <li>
            <i class="fi fi-rs-link-horizontal topic-icons"></i>
            <span>Linked List</span>
          </li>
          <li>
            <i class="fi fi-rs-share topic-icons"></i>
            <span>Binary Tree</span>
          </li>
        </ul>
      </div>
      <div className="horizontal-box"></div>
      <div
        className="premium-box"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetRotation}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.rotateX}deg) rotateY(${rotation.rotateY}deg)`,
        }}
      >
        <div className="premium-boxcontent">
          <img src={CardShape} className="card-bg-shape-down" />
          <img src={CardShape} className="card-bg-shape-top" />
          <h3>
            Get
            <br />
            Premium
          </h3>
          <p>
            Our various<br></br> features are premium.<br></br>Subscribe now to
            avail <br></br>the premium features.
          </p>
        </div>
        <button className="subscribe-button">Subscribe</button>
      </div>
    </div>
  );
};

export default ProblemSidebar;
