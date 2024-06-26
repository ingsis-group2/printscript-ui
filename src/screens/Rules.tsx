import {withNavbar} from "../components/navbar/withNavbar.tsx";
import {Box, Typography} from "@mui/material";
import LintingRulesList from "../components/linting-rules/LintingRulesList.tsx";
import FormattingRulesList from "../components/formatting-rules/FormattingRulesList.tsx";
import {useAuth0} from "@auth0/auth0-react";
import LockedContent from "../components/common/LockedContent.tsx";

const RulesScreen = () => {
    const { isAuthenticated } = useAuth0();
    return (
        <>
        { isAuthenticated ? (
                <Box display={"flex"} flexDirection={"column"}>
                    <Typography variant={"h3"}>
                        Rules
                    </Typography>
                    <LintingRulesList />
                    <FormattingRulesList/>

                </Box>
            ) : (
                <LockedContent contentName={"Rules"}/>
            )}
        </>
    )
}

export default withNavbar(RulesScreen);