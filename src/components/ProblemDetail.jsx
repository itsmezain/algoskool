import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import SplitPane from "react-split-pane";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./ProblemDetail.css";

function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here");
  const [output, setOutput] = useState("");
  const [testcase, setTestcase] = useState("");

  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleCodeChange = (value) => setCode(value);
  const handleTestcaseChange = (e) => setTestcase(e.target.value);

  useEffect(() => {
    // Fetch the problem data from problem.json
    fetch("/problems.json")
      .then((res) => res.json())
      .then((problemsData) => {
        // Find the problem with the matching ID
        const foundProblem = problemsData.find((p) => p.id === id);
        if (foundProblem) {
          setProblem(foundProblem);
        } else {
          setProblem({
            title: "Problem Not Found",
            description: "The problem description could not be loaded.",
            difficulty: "N/A",
          });
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setProblem({
          title: "Error",
          description: "An error occurred while fetching the problem data.",
          difficulty: "N/A",
        });
      });
  }, [id]);

  const handleRunCode = () => {
    setOutput("Executing code...");
    // Simulate code execution
    setTimeout(() => {
      setOutput("Sample Output:\n" + code);
    }, 1000);
  };

  const handleSubmitCode = () => {
    setOutput("Submitting code...");
    // Simulate code submission
    setTimeout(() => {
      setOutput("Submission Result:\n" + code);
    }, 1000);
  };

  if (!problem) {
    return <div>Loading...</div>;
  }

  function preprocessDescription(description) {
    const lines = description.split("\n");
    let inExample = false;
    let processedLines = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (/^Example \d+:/.test(line.trim())) {
        // Start of an example
        inExample = true;
        processedLines.push("");
        processedLines.push("> **" + line.trim() + "**");
      } else if (inExample && line.trim() === "") {
        // End of an example
        inExample = false;
        processedLines.push("");
      } else if (inExample) {
        // Inside an example, prefix with '>'
        processedLines.push("> " + line);
      } else {
        // Not in an example
        processedLines.push(line);
      }
    }

    return processedLines.join("\n");
  }

  // Apply preprocessing to the problem description
  const processedDescription = preprocessDescription(problem.description);

  // Custom components for ReactMarkdown
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={coy}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className="problem-detail-container">
      <SplitPane split="vertical" defaultSize="50%" minSize={200}>
        <div className="problem-description">
          <h3>
            {problem.id}. {problem.title}
          </h3>
          <p>
            <span className={`problem-difficulty ${problem.difficulty}`}>
              {problem.difficulty}
            </span>
          </p>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {processedDescription}
          </ReactMarkdown>
        </div>

        <div className="code-editor-section">
          <div className="editor-header">
            <select
              className="select-lang"
              value={language}
              onChange={handleLanguageChange}
            >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
             
            </select>
            <div className="editor-buttons">
              <button onClick={handleRunCode}>Run Code</button>
              <button onClick={handleSubmitCode}>Submit</button>
            </div>
          </div>
          <div className="writing-area">
          <Editor
            height="400px"
            language={language}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              automaticLayout: true,
            }}
          />
          </div>
          <div className="testcase-section">
            <label>Testcase Input:</label>
            <textarea value={testcase} onChange={handleTestcaseChange} />
          </div>
          <div className="output-section">
            <label>Output:</label>
            <pre>{output}</pre>
          </div>
        </div>
      </SplitPane>
    </div>
  );
}

export default ProblemDetail;
