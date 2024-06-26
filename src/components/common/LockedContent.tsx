import LockIcon from "@mui/icons-material/Lock";
import {Box, Typography} from "@mui/material";

const LockedContent = ({contentName} : {contentName: string}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '70vh',
                textAlign: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                padding: '40px',
                borderRadius: '8px'
            }}
        >
            <LockIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
            <Typography variant="h4" sx={{ mb: 2 }}>
                Please Log In to View {contentName}
            </Typography>
            <Typography variant="body1">
                You need to be authenticated to access this content.
            </Typography>
        </Box>
    )
}

export default LockedContent;