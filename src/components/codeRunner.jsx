export async function runCode({ code, testCases, languageId, apiKey, language, functionName  }) {
  const results = [];

  const submissionUrl =
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*";

  for (let idx = 0; idx < testCases.length; idx++) {
    const testCase = testCases[idx];
    const input = testCase.input;
    const expectedOutput = testCase.expected_output;

    // Prepare the full source code to be executed
    const fullSourceCode = prepareFullSourceCode(code, input, language, functionName);

    const encodedCode = btoa(fullSourceCode);

    const options = {
      method: "POST",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language_id: languageId[language],
        source_code: encodedCode,
        stdin: "", // Since we're embedding the input in the code
      }),
    };

    try {
      const response = await fetch(submissionUrl, options);
      const data = await response.json();
      console.log("Submission response data:", data);

      if (data.token) {
        const token = data.token;
        let result;
        while (true) {
          const submissionResultUrl = `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`;
          const resultResponse = await fetch(submissionResultUrl, {
            method: "GET",
            headers: {
              "x-rapidapi-key": apiKey,
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            },
          });
          result = await resultResponse.json();
          console.log("Submission result:", result);

          if (result.status.id <= 2) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
          } else {
            break;
          }
        }

        let decodedOutput = "";
        if (result.stdout) {
          decodedOutput = atob(result.stdout).trim();
        } else if (result.compile_output) {
          decodedOutput = atob(result.compile_output).trim();
        } else if (result.stderr) {
          decodedOutput = atob(result.stderr).trim();
        } else if (result.message) {
          decodedOutput = atob(result.message).trim();
        } else {
          decodedOutput = "No output available.";
        }

        const testCasePassed = compareOutputs(decodedOutput, expectedOutput);

        results.push({
          idx,
          passed: testCasePassed,
          actualOutput: decodedOutput,
          expectedOutput,
          input,
        });
      } else {
        results.push({
          idx,
          passed: false,
          actualOutput: "Failed to get submission token.",
          expectedOutput,
          input,
        });
      }
    } catch (error) {
      console.error("Error in runCode:", error);
      results.push({
        idx,
        passed: false,
        actualOutput: "Error executing code.",
        expectedOutput,
        input,
      });
    }
  }

  return results;
}

function prepareFullSourceCode(userCode, input, language, functionName) {
  // Based on the language, prepare the code that includes:
  // - The user's code
  // - Code to call the user's function with test inputs
  // - Code to print the output

  function formatCppVector(array) {
    // If array is a string, parse it into an array
    if (typeof array === 'string') {
      array = JSON.parse(array);
    }
    if (Array.isArray(array)) {
      return "{" + array.join(", ") + "}";
    } else {
      throw new Error("input.nums is not an array");
    }
  }

  function formatJavaArray(array) {
    if (typeof array === 'string') {
      array = JSON.parse(array);
    }
    if (Array.isArray(array)) {
      return "new int[]{" + array.join(", ") + "}";
    } else {
      throw new Error("input.nums is not an array");
    }
  }


  switch (language) {
    case "javascript":
      return `
${userCode}

console.log(JSON.stringify(twoSum(${JSON.stringify(input.nums)}, ${input.target})));
`;
    case "python":
      return `
${userCode}

print(twoSum(${JSON.stringify(input.nums)}, ${input.target}))
`;
    case "cpp":
      return `
#include <iostream>
#include <vector>
using namespace std;

${userCode}

int main() {
    Solution sol;
    vector<int> nums = ${formatCppVector(input.nums)};
    int target = ${input.target};
    vector<int> result = sol.${functionName}(nums, target);
    cout << "[";
    for(int i = 0; i < result.size(); i++) {
        cout << result[i];
        if(i < result.size() - 1) cout << ",";
    }
    cout << "]";
    return 0;
}
`;
    case "java":
      return `
import java.util.*;

${userCode}

class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] nums = ${formatJavaArray(input.nums)};
        int target = ${input.target};
        int[] result = sol.${functionName}(nums, target);
        System.out.print("[");
        for(int i = 0; i < result.length; i++) {
            System.out.print(result[i]);
            if(i < result.length - 1) System.out.print(",");
        }
        System.out.println("]");
    }
}
`;
    default:
      return userCode;
  }
}

function compareOutputs(actualOutput, expectedOutput) {
  try {
    const actual = JSON.parse(actualOutput);
    const expected = typeof expectedOutput === 'string' ? JSON.parse(expectedOutput) : expectedOutput;
    return JSON.stringify(actual) === JSON.stringify(expected);
  } catch (e) {
    // Fallback to string comparison if parsing fails
    return actualOutput.trim() === expectedOutput.trim();
  }
}