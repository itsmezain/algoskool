import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Editor } from "@monaco-editor/react";
import SplitPane from "react-split-pane";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import "./ProblemDetail.css";
import { runCode } from "./codeRunner";

function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Write your code here");
  const [output, setOutput] = useState("");
  const [testcase, setTestcase] = useState("");
  const [codeTemplate, setCodeTemplate] = useState("");

  const [selectedTab, setSelectedTab] = useState("Test Cases");
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");

  const handleLanguageChange = (e) => setLanguage(e.target.value);
  const handleCodeChange = (value) => setCode(value);
  const handleInputChange = (e) => setInputValue(e.target.value);

  useEffect(() => {
    // Fetch the problem data from problems.json
    fetch("/problems.json")
      .then((res) => res.json())
      .then((problemsData) => {
        // Find the problem with the matching ID
        const foundProblem = problemsData.find((p) => p.id === id);
        if (foundProblem) {
          setProblem(foundProblem);
          const template =
            foundProblem.code_templates[language]?.template ||
            "// Write your code here";
          setCode(template);

          // Display the first 3 test cases in the 'testcase' input area
          if (foundProblem.test_cases && foundProblem.test_cases.length > 0) {
            const firstThreeTestcases = foundProblem.test_cases.slice(0, 3);
            // Format the test cases into a string
            const testcaseInputString = firstThreeTestcases
              .map(
                (tc, idx) =>
                  `Test case ${idx + 1}:\nInput: ${JSON.stringify(
                    tc.input
                  )}\nExpected Output: ${JSON.stringify(tc.expected_output)}\n`
              )
              .join("\n");
            setTestcase(testcaseInputString);
          }
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

  useEffect(() => {
    if (problem) {
      if (problem.code_templates && problem.code_templates[language]) {
        setCode(problem.code_templates[language].template);
      } else {
        setCode("// Template is not defined for this question");
      }
    }
  }, [language, problem]);

  useEffect(() => {
    if (problem && problem.test_cases && problem.test_cases.length > 0) {
      setInputValue(
        formatInput(problem.test_cases[selectedTestCaseIndex].input)
      );
    }
  }, [selectedTestCaseIndex, problem]);

  const languageToId = {
    javascript: 63, // Node.js
    python: 71, // Python 3
    cpp: 54, // C++ (GCC 9.2.0)
    java: 62, // Java
  };

  const language_id = languageToId[language];


  const handleRunCode = async () => {
    try {
      setOutput("Executing code...");
  
      const language_id = languageToId[language];
      if (!language_id) {
        setOutput("Language not supported.");
        return;
      }


      const apiKey = "e85bd6487emsh29c212f750f9122p1009a6jsn9f9bbb93d690";


      const results = await runCode({
        code,
        testCases: problem.test_cases.slice(0, 3),
        languageId: languageToId,
        apiKey: apiKey,
        language: language,
        functionName: problem.function_name,
      });

      // Build the output message
      let outputMessage = "";

    results.forEach((result) => {
      outputMessage += `Test Case ${result.idx + 1}: ${
        result.passed ? "Passed" : "Failed"
      }\n`;
      if (!result.passed) {
        outputMessage += `Input:\n${JSON.stringify(result.input, null, 2)}\n`;
        outputMessage += `Expected Output:\n${JSON.stringify(
          result.expectedOutput,
          null,
          2
        )}\n`;
        outputMessage += `Your Output:\n${result.actualOutput}\n\n`;
      }
    });

      setOutput(outputMessage);
      setSelectedTab("Output"); // Switch to Output tab
    } catch (error) {
      console.error("Error in handleRunCode:", error);
      setOutput("An error occurred while executing your code.");
    }
  };

  const handleSubmitCode = async () => {
    try {
      setOutput("Executing code...");

      const language_id = languageToId[language];
      if (!language_id) {
        setOutput("Language not supported.");
        return;
      }

      const apiKey = "e85bd6487emsh29c212f750f9122p1009a6jsn9f9bbb93d690";

      
      const results = await runCode({
        code,
        testCases: problem.test_cases,
        languageId: languageToId, // Pass languageId as a number
        apiKey: apiKey,
        language: language,
        functionName: problem.function_name,
      });

      let outputMessage = "";

      results.forEach((result) => {
        outputMessage += `Test Case ${result.idx + 1}: ${
          result.passed ? "Passed" : "Failed"
        }\n`;
        if (!result.passed) {
          outputMessage += `Input:\n${JSON.stringify(result.input, null, 2)}\n`;
          outputMessage += `Expected Output:\n${JSON.stringify(
            result.expectedOutput,
            null,
            2
          )}\n`;
          outputMessage += `Your Output:\n${result.actualOutput}\n\n`;
        }
      });

      setOutput(outputMessage);
      setSelectedTab("Output"); // Switch to Output tab
    } catch (error) {
      console.error("Error in handleSubmitCode:", error);
      setOutput("An error occurred while executing your code.");
    }
  };

  if (!problem) {
    return <div>Loading...</div>;
  }

  function preprocessDescription(description) {
    const lines = description.split("\n");
    let processedLines = [];
    let inExample = false;
    let inConstraints = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      if (/^Example \d*:/.test(line) || /^Example:/.test(line)) {
        inExample = true;
        processedLines.push("");
        processedLines.push("> **" + line + "**");
      } else if (/^Constraints:/.test(line)) {
        inConstraints = true;
        processedLines.push("");
        processedLines.push("**Constraints:**");
        processedLines.push("");
      } else if (inExample && line === "") {
        inExample = false;
        processedLines.push("");
      } else if (inConstraints && line === "") {
        inConstraints = false;
        processedLines.push("");
      } else if (inExample || inConstraints) {
        // For constraints, format as math if enclosed in backticks
        if (line.startsWith("`") && line.endsWith("`")) {
          const content = line.substring(1, line.length - 1);
          processedLines.push("> $$" + content + "$$");
        } else {
          processedLines.push("> " + line);
        }
      } else {
        processedLines.push(line);
      }
    }

    return processedLines.join("\n");
  }

  const processedDescription = preprocessDescription(problem.description);

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

  function formatInput(input) {
    if (typeof input === "object" && !Array.isArray(input)) {
      return Object.entries(input)
        .map(
          ([key, value]) =>
            `${key} = ${
              typeof value === "object" ? JSON.stringify(value) : value
            }`
        )
        .join("\n");
    } else {
      return JSON.stringify(input, null, 2);
    }
  }

  function formatExpectedOutput(output) {
    if (typeof output === "object") {
      return JSON.stringify(output, null, 2);
    } else {
      return output.toString();
    }
  }

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
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={components}
          >
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
              height="300px"
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

          <div className="tabs">
            <div className="bottom-header">
              <button
                className={selectedTab === "Test Cases" ? "active" : ""}
                onClick={() => setSelectedTab("Test Cases")}
              >
                Test Cases
              </button>
              <button
                className={selectedTab === "Output" ? "active" : ""}
                onClick={() => setSelectedTab("Output")}
              >
                Output
              </button>
            </div>
          </div>

          {selectedTab === "Test Cases" &&
            problem.test_cases &&
            problem.test_cases.length > 0 && (
              <div className="test-cases-tab">
                <div className="test-case-buttons">
                  {problem.test_cases.map((tc, idx) => (
                    <button
                      key={idx}
                      className={selectedTestCaseIndex === idx ? "active" : ""}
                      onClick={() => setSelectedTestCaseIndex(idx)}
                    >
                      Case {idx + 1}
                    </button>
                  ))}
                </div>

                <div className="test-case-content">
                  <textarea
                    value={inputValue}
                    onChange={handleInputChange}
                    className="input-textarea"
                  />
                </div>
              </div>
            )}

          {selectedTab === "Output" && (
            <div className="output-section">
              <pre>{output}</pre>
            </div>
          )}
        </div>
      </SplitPane>
    </div>
  );
}

export default ProblemDetail;
