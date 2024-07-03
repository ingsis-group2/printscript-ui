import React, { useEffect, useState } from "react";
import { Box, OutlinedInput } from "@mui/material";
import { highlight, languages } from "prismjs";
import Editor from "react-simple-code-editor";
import { useExecuteSnippet } from "../utils/queries.tsx";
import { Snippet } from "../utils/snippet.ts";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const SnippetExecution = ({ runSnippet, snippet, version } : { runSnippet: boolean, snippet?: Snippet, version: string }) => {
    const [input, setInput] = useState<string>("");
    const [inputs, setInputs] = useState<string[]>([]);
    const [output, setOutput] = useState<string[]>([]);
    const { mutate: executeSnippet, isLoading: loading, data: executionResult } = useExecuteSnippet();

    useEffect(() => {
        if (executionResult) {
            setOutput(executionResult.outputs);
            if (executionResult.errors.length) {
                console.error("Errors:", executionResult.errors);
                toast.error(`Execution failed: ${executionResult.errors.join(", ")}`);
            }
        }
    }, [executionResult]);

    useEffect(() => {
        if (runSnippet && snippet) {
            executeSnippet({ snippetId: snippet.id, version: version, inputs });
        }
    }, [runSnippet, snippet, executeSnippet, inputs]);

    const handleEnter = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !loading) {
            setInputs(prevInputs => [...prevInputs, input]);
            setInput("");
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    useEffect(() => {
        if (!loading && inputs.length > 0 && snippet) {
            executeSnippet({ snippetId: snippet.id, version: version, inputs });
        }
    }, [inputs, executeSnippet, snippet]);

    const code = output.join("\n");

    return (
        <>
            <ToastContainer />
            <Box flex={1} overflow={"none"} minHeight={200} bgcolor={'black'} color={'white'}>
                <Editor
                    value={code}
                    onValueChange={() => {}}
                    padding={10}
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
                onChange={handleInputChange}
                placeholder="Type here"
                fullWidth
            />
        </>
    );
}