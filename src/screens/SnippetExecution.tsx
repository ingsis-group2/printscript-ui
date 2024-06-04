import React, { useState, useEffect } from "react";
import {OutlinedInput, Box} from "@mui/material";
import { highlight, languages } from "prismjs";
import Editor from "react-simple-code-editor";
import { Snippet } from "../utils/snippet.ts";
import { useExecuteSnippet } from "../utils/queries.tsx";

export const SnippetExecution = ({ snippet, run }: { snippet?: Snippet; run: boolean }) => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState<string[]>([]);
    const { mutate: executeSnippet, isLoading: loading, data: executionResult} = useExecuteSnippet();

    useEffect(() => {
        if (executionResult) {
            setOutput(prevOutput => [...prevOutput, ...executionResult.outputs]);
            if (executionResult.errors.length) {
                console.error("Errors:", executionResult.errors);
            }
        }
    }, [executionResult]);

    useEffect(() => {
        if (run && snippet) {
            executeSnippet({ snippetId: snippet.id, language: snippet.language, version: "1.0", input: "" });
        }
    }, [run, snippet, executeSnippet]);

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
