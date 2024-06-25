import {withNavbar} from "../components/navbar/withNavbar.tsx";
import {SnippetTable} from "../components/snippet-table/SnippetTable.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {SnippetDetail} from "./SnippetDetail.tsx";
import {Box, CircularProgress, Drawer} from "@mui/material";
import {useGetSnippets} from "../utils/queries.tsx";
import {usePaginationContext} from "../contexts/paginationContext.tsx";
import useDebounce from "../hooks/useDebounce.ts";
import {useAuth0} from "@auth0/auth0-react";
import LockedContent from "../components/common/LockedContent.tsx";

const HomeScreen = () => {
  const {id: paramsId} = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [snippetName, setSnippetName] = useState('');
  const [snippetId, setSnippetId] = useState<number | null>(null)
  const {page, page_size, count, handleChangeCount} = usePaginationContext()
  const {data, isLoading} = useGetSnippets(page, page_size, snippetName)
  const { isAuthenticated, isLoading: isLoadingAuth} = useAuth0();


  useEffect(() => {
    if (data?.count && data.count != count) {
      handleChangeCount(data.count)
    }
  }, [count, data?.count, handleChangeCount]);


  useEffect(() => {
    if (paramsId) {
      setSnippetId(parseInt(paramsId))
    }
  }, [paramsId]);

  const handleCloseModal = () => setSnippetId(null)


  // DeBounce Function
  useDebounce(() => {
        setSnippetName(
            searchTerm
        );
      }, [searchTerm], 800
  );

  const handleSearchSnippet = (snippetName: string) => {
    setSearchTerm(snippetName);
  };

  if (isLoadingAuth){
    return(
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
          <CircularProgress/>
        </Box>
    )
  }

  return (
      <>
          { isAuthenticated ? (
              <>
                <SnippetTable loading={isLoading} handleClickSnippet={setSnippetId} snippets={data?.snippets}
                                  handleSearchSnippet={handleSearchSnippet}/>
                <Drawer open={!!snippetId} anchor={"right"} onClose={handleCloseModal}>
                    {snippetId && <SnippetDetail handleCloseModal={handleCloseModal} id={snippetId}/>}
                </Drawer>
              </>
          ) : (
              <LockedContent contentName={"Snippets"}/>
              )
          }
      </>
  )
}

export default withNavbar(HomeScreen);

