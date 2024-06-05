import React, {useEffect, useState} from "react";
import {Box, OutlinedInput} from "@mui/material";
import {highlight, languages} from "prismjs";
import Editor from "react-simple-code-editor";
import { useExecuteSnippet } from "../utils/queries.tsx";
import {Snippet} from "../utils/snippet.ts";

export const SnippetExecution = ({runSnippet, snippet} : { runSnippet: boolean, snippet?: Snippet }) => {
  // Here you should provide all the logic to connect to your sockets.
  const [input, setInput] = useState<string>("")
  const [output, setOutput] = useState<string[]>([]);
  const { mutate: executeSnippet, isLoading: loading, data: executionResult} = useExecuteSnippet();


  // This is the logic to append the output to the screen
  useEffect(() => {
      if (executionResult) {
          setOutput(prevOutput => [...prevOutput, ...executionResult.outputs]);
          if (executionResult.errors.length) {
              console.error("Errors:", executionResult.errors);
          }
      }
  }, [executionResult]);

  // This is the logic to run the snippet
  useEffect(() => {
      if (runSnippet && snippet) {
          executeSnippet({ snippetId: snippet.id, language: snippet.language, version: "1.0", input: "" });
      }
  }, [runSnippet, snippet, executeSnippet]);


  // Function to read the input and execute the snippet
  const handleEnter = (event: React.KeyboardEvent) => {
      if (event.key === "Enter" && !loading) {
          setOutput([...output, input]);
          executeSnippet({ snippetId: snippet?.id ?? "1", language: "PrintScript", version: "1.0", input });
          setInput("");
      }
  };

    const code = output.join("\n");

    return (
        <>
            <Box flex={1} overflow={"none"} minHeight={200} bgcolor={'black'} color={'white'}>
                <Editor
                    value={code}
                    padding={10}
                    onValueChange={(code) => setInput(code)}
                    highlight={(code) => highlight(code, languages.js, 'javascript')}
                    maxLength={1000}
                    style={{
                        fontFamily: "monospace",
                        fontSize: 17,
                    }}
                />
            </Box>
            <OutlinedInput
                onKeyDown={handleEnter}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type here"
                fullWidth
            />
        </>
    );
}
