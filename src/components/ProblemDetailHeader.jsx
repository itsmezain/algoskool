import React from 'react';
import "./ProblemDetailHeader.css";

const ProblemDetailHeader = () => {
  return (
    <div>
        <header className="problem-detail-header">
            <div className="problem-detail-header-logo">
                <h1>algoskool</h1>
            </div>
            <div className="header-tools">
                <button className="btn-run"> Run </button>
                <button className="btn-submit"> Submit </button>
            </div>
            <div className="problem-detail-header-icons">
            <i class="fi fi-rr-bell icon circle"></i>
            <i class="fi fi-rr-fire-flame-curved icon circle"></i>
            <img src="https://avatars.githubusercontent.com/u/89008579?v=4" alt="Profile" className="profile-picture" />
            </div>
    </header>
    <div className="horizontal-line"></div>
    </div>
  );
};

export default ProblemDetailHeader;
