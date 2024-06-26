import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { ModalWrapper } from "../common/ModalWrapper.tsx";
import { useState } from "react";

type ShareSnippetModalProps = {
  open: boolean
  onClose: () => void
  onShare: (userEmail: string) => void
  loading: boolean
}

export const ShareSnippetModal = (props: ShareSnippetModalProps) => {
  const { open, onClose, onShare, loading } = props
  const [email, setEmail] = useState("")

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value)
  }

  return (
      <ModalWrapper open={open} onClose={onClose}>
        <Typography variant={"h5"}>Share your snippet</Typography>
        <Divider />
        <Box mt={2}>
          <TextField
              label="User's Email"
              value={email}
              onChange={handleEmailChange}
              fullWidth
          />
          <Box mt={4} display={"flex"} width={"100%"} justifyContent={"flex-end"}>
            <Button onClick={onClose} variant={"outlined"}>Cancel</Button>
            <Button
                disabled={!email || loading}
                onClick={() => onShare(email)}
                sx={{ marginLeft: 2 }}
                variant={"contained"}
            >
              Share
            </Button>
          </Box>
        </Box>
      </ModalWrapper>
  )
}
