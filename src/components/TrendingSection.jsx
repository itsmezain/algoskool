import React from "react";
import "./TrendingSection.css";
import TrendingCard from "./TrendingCard";

const cardsData = [
  {
    title: "Arrays\nQuestions",
    description:
      "Solve array\nquestions to enhance\nyour DSA skills and\nincrease your chance...",
    hueRotateLeft: 0,
    hueRotateRight: 0,
  },
  {
    title: "Strings\nQuestions",
    description:
      "Solve strings\nquestions to enhance\nyour DSA skills and\nincrease your chance...",
    hueRotateLeft: -133,
    hueRotateRight: -133,
  },
  {
    title: "Binary Tree\nQuestions",
    description:
      "Solve binary tree\nquestions to enhance\nyour DSA skills and\nincrease your chance...",
    hueRotateLeft: -83,
    hueRotateRight: -83,
  },
];

const TrendingSection = () => {
  return (
    <div className="trending-section">
      <h3>
        Trending <i class="fi fi-tr-rocket-lunch"></i>
      </h3>
      {cardsData.map((card, index) => (
        <TrendingCard
          key={index}
          title={card.title}
          description={card.description}
          hueRotateLeft={card.hueRotateLeft}
          hueRotateRight={card.hueRotateRight}
        />
      ))}
    </div>
  );
};

export default TrendingSection;
