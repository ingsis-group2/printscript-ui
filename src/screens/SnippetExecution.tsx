import React, { useState, useEffect } from "react";
import { OutlinedInput, Box, Typography } from "@mui/material";
import { highlight, languages } from "prismjs";
import Editor from "react-simple-code-editor";
import { Snippet } from "../utils/snippet.ts";
import { ExecutionResult } from "../utils/queries.tsx";
import {FakeSnippetOperations} from "../utils/mock/fakeSnippetOperations.ts";

const snippetOperations = new FakeSnippetOperations();

export const SnippetExecution = ({ snippet, run }: { snippet?: Snippet; run: boolean }) => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (run && snippet) {
            executeSnippet(snippet.id);
        }
    }, [run, snippet]);

    const executeSnippet = async (snippetId: string) => {
        setLoading(true);
        try {
            const result: ExecutionResult = await snippetOperations.executeSnippet(snippetId, "PrintScript", "1.0");
            setOutput(result.outputs);
        } catch (error) {
            console.error("Error executing snippet:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnter = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !loading) {
            setOutput([...output, input]);
            // send input to runner
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
            <OutlinedInput onKeyDown={handleEnter} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type here" fullWidth />
        </>
    );
}
