import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import ProblemList from "./components/ProblemList";
import ProblemSidebar from "./components/ProblemSidebar";
import RoomSidebar from "./components/RoomSidebar";
import TrendingSection from "./components/TrendingSection";
import TodayTask from "./components/TodayTask";
import Header from './components/header';
import ProblemDetailHeader from './components/ProblemDetailHeader';
import ChatSection from './components/ChatSection';
import ProblemDetail from './components/ProblemDetail';
import "./App.css";

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}


function MainContent() {
  const location = useLocation(); 

  const isProblemDetailPage = location.pathname.includes('/problems/');

  const renderHeader = () => {
    if (isProblemDetailPage) {
      return <ProblemDetailHeader />; 
    } else {
      return <Header />; 
    }
  };

  const renderSidebar = () => {
    if (location.pathname === '/rooms') {
      return <RoomSidebar />;
    } else if (!isProblemDetailPage) {
      return <ProblemSidebar />;
    }
    return null;
  };


  const renderRightComponent = () => {
    if (location.pathname === '/rooms') {
      return <TodayTask />;  
    } else if (!isProblemDetailPage) {
      return <TrendingSection />;
    }
    return null; 
  };

  return (
    <div className="app-container">
      {renderHeader()} 
      <div className="main-content">
        {renderSidebar()}
        <Routes>
          <Route path="/rooms" element={<><ChatSection /></>} />
          
          <Route path="/problems/:id" element={<ProblemDetail />} />
          <Route path="/problems" element={<><ProblemList /></>} />
          <Route path="/" element={<TrendingSection />} />
        </Routes>
        {renderRightComponent()} 
      </div>
    </div>
  );
}

export default App;
