import { useEffect, useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-okaidia.css";
import { Alert, Box, CircularProgress, IconButton, OutlinedInput, Tooltip, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useUpdateSnippetById } from "../utils/queries.tsx";
import { useFormatSnippet, useGetSnippetById, useShareSnippet } from "../utils/queries.tsx";
import { Bòx } from "../components/snippet-table/SnippetBox.tsx";
import { BugReport, Delete, Download, PlayArrow, Save, Share, StopRounded } from "@mui/icons-material";
import { ShareSnippetModal } from "../components/snippet-detail/ShareSnippetModal.tsx";
import { TestSnippetModal } from "../components/snippet-test/TestSnippetModal.tsx";
import { Snippet } from "../utils/snippet.ts";
import { SnippetExecution } from "./SnippetExecution.tsx";
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { queryClient } from "../App.tsx";
import { DeleteConfirmationModal } from "../components/snippet-detail/DeleteConfirmationModal.tsx";
import {jwtDecode} from 'jwt-decode';

type SnippetDetailProps = {
  id: number;
  handleCloseModal: () => void;
}

const DownloadButton = ({ snippet }: { snippet?: Snippet }) => {
  if (!snippet) return null;
  const file = new Blob([snippet.content], { type: 'text/plain' });

  return (
      <Tooltip title={"Download"}>
        <IconButton sx={{ cursor: "pointer" }}>
          <a download={`${snippet.name}.${snippet.extension}`} target="_blank" rel="noreferrer" href={URL.createObjectURL(file)} style={{
            textDecoration: "none",
            color: "inherit",
            display: 'flex',
            alignItems: 'center',
          }}>
            <Download />
          </a>
        </IconButton>
      </Tooltip>
  )
}

export const SnippetDetail = (props: SnippetDetailProps) => {
  const { id, handleCloseModal } = props;
  const [code, setCode] = useState("");
  const [version, setVersion] = useState("1.1");
  const [shareModalOpened, setShareModalOpened] = useState(false);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [testModalOpened, setTestModalOpened] = useState(false);
  const [runSnippet, setRunSnippet] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);

  const { data: snippet, isLoading } = useGetSnippetById(id);
  const { mutate: shareSnippet, isLoading: loadingShare } = useShareSnippet();
  const { mutate: formatSnippet, isLoading: isFormatLoading, data: formatSnippetData } = useFormatSnippet();
  const { mutate: updateSnippet, isLoading: isUpdateSnippetLoading } = useUpdateSnippetById({ onSuccess: () => queryClient.invalidateQueries(['snippet', id]) });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decodedToken: { sub: string } = jwtDecode(token);
      if (decodedToken.sub === snippet?.author.id) {
        setIsAuthor(true);
      }
    }
  }, [snippet]);

  useEffect(() => {
    if (snippet) {
      setCode(snippet.content);
    }
  }, [snippet]);

  useEffect(() => {
    if (formatSnippetData) {
      setCode(formatSnippetData.formattedCode);
    }
  }, [formatSnippetData]);

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVersion(e.target.value);
  };

  async function handleShareSnippet(userEmail: string) {
    shareSnippet({ snippetId: id, userEmail });
    setShareModalOpened(false);
  }

  return (
      <Box p={4} minWidth={'60vw'}>
        <Box width={'100%'} p={2} display={'flex'} justifyContent={'flex-end'}>
          <CloseIcon style={{ cursor: "pointer" }} onClick={handleCloseModal} />
        </Box>
        {isLoading ? (
            <>
              <Typography fontWeight={"bold"} mb={2} variant="h4">Loading...</Typography>
              <CircularProgress />
            </>
        ) : (
            <>
              <Typography variant="h4" fontWeight={"bold"}>{snippet?.name ?? "Snippet"}</Typography>
              <Box display="flex" flexDirection="row" gap="8px" padding="8px" justifyContent={"space-between"} alignItems={"center"}>
                <Box>
                  <Tooltip title={"Share"}>
                    <IconButton onClick={() => setShareModalOpened(true)} disabled={!isAuthor}>
                      <Share />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={"Test"}>
                    <IconButton onClick={() => setTestModalOpened(true)} disabled={!isAuthor}>
                      <BugReport />
                    </IconButton>
                  </Tooltip>
                  <DownloadButton snippet={snippet} />
                  <Tooltip title={runSnippet ? "Stop run" : "Run"}>
                    <IconButton onClick={() => setRunSnippet(!runSnippet)}>
                      {runSnippet ? <StopRounded /> : <PlayArrow />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={"Format"}>
                    <IconButton onClick={() => snippet ? formatSnippet({ snippetId: snippet.id, version }) : undefined} disabled={isFormatLoading || !isAuthor}>
                      <ReadMoreIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={"Save changes"}>
                    <IconButton color={"primary"} onClick={() => updateSnippet({ id, updateSnippet: { content: code } })} disabled={isUpdateSnippetLoading || snippet?.content === code || !isAuthor}>
                      <Save />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={"Delete"}>
                    <IconButton onClick={() => setDeleteConfirmationModalOpen(true)} disabled={!isAuthor}>
                      <Delete color={"error"} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box display="flex" flexDirection="column" gap="4px" padding="4px" width="200px" mb={2}>
                  <Typography variant="body2">Version</Typography>
                  <OutlinedInput
                      value={version}
                      onChange={handleVersionChange}
                      placeholder="Version"
                      fullWidth
                      size="small"
                  />
                </Box>
              </Box>
              <Box display={"flex"} gap={2}>
                <Bòx flex={1} height={"fit-content"} overflow={"none"} minHeight={"300px"} bgcolor={'black'} color={'white'} code={code}>
                  <Editor
                      value={code}
                      padding={10}
                      onValueChange={(code) => setCode(code)}
                      highlight={(code) => highlight(code, languages.js, "javascript")}
                      maxLength={1000}
                      style={{
                        minHeight: "300px",
                        fontFamily: "monospace",
                        fontSize: 17,
                      }}
                  />
                </Bòx>
              </Box>
              <Box pt={1} flex={1} marginTop={2}>
                <Alert severity="info">Output</Alert>
                <SnippetExecution runSnippet={runSnippet} snippet={snippet} version={version} />
              </Box>
            </>
        )}
        <ShareSnippetModal loading={loadingShare || isLoading} open={shareModalOpened}
                           onClose={() => setShareModalOpened(false)}
                           onShare={handleShareSnippet} />
        <TestSnippetModal open={testModalOpened} onClose={() => setTestModalOpened(false)} snippetId={id} version={version} />
        <DeleteConfirmationModal open={deleteConfirmationModalOpen} onClose={() => setDeleteConfirmationModalOpen(false)} id={snippet?.id ?? 0} setCloseDetails={handleCloseModal} />
      </Box>
  );
}
