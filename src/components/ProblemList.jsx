import React, { useState, useEffect } from "react";
import "./ProblemList.css";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 50; // Set the number of problems per page

  // Fetch the problems.json file from the public directory
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("/problems.json"); // Directly reference the file in public directory
        const data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error("Error fetching the problems data:", error);
      }
    };
  
    fetchProblems();
  }, []);
  
  // Calculate the indexes for the current page
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = problems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );

  // Handle page change
  const handleNextPage = () => {
    if (currentPage < Math.ceil(problems.length / problemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="problem-list-container">
      <div className="problem-list-title">
        <h2 className="problem-list-title-heading">Problems</h2>
        {/* Pagination controls */}
        <div className="pagination-controls">
          <button
            className="pagination-previous-page-button"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-detail">
            Page {currentPage} of {Math.ceil(problems.length / problemsPerPage)}
          </span>
          <button
            className="pagination-next-page-button"
            onClick={handleNextPage}
            disabled={
              currentPage === Math.ceil(problems.length / problemsPerPage)
            }
          >
            Next
          </button>
        </div>
      </div>
      <table className="problem-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Topic</th>
            <th>Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {currentProblems.map((problem, index) => (
            <tr key={index}>
              <td>{problem.id}</td>
              <td>
                <a
                  className="problem-title"
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {problem.title}
                </a>
              </td>
              <td id="problem-topics">
                {problem.related_topics.split(",").map((topic, i) => (
                  <span key={i} className="problem-topic">
                    {topic.trim()}
                  </span>
                ))}
              </td>
              <td className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination-controls">
        <button
          className="pagination-previous-page-button"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="pagination-detail">
          Page {currentPage} of {Math.ceil(problems.length / problemsPerPage)}
        </span>
        <button
          className="pagination-next-page-button"
          onClick={handleNextPage}
          disabled={
            currentPage === Math.ceil(problems.length / problemsPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProblemList;