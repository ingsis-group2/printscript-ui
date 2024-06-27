import {withNavbar} from "../components/navbar/withNavbar.tsx";
import {SnippetTable} from "../components/snippet-table/SnippetTable.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {SnippetDetail} from "./SnippetDetail.tsx";
import {Box, Drawer, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {useGetAllSnippets, useGetSharedSnippets, useGetSnippets} from "../utils/queries.tsx";
import {usePaginationContext} from "../contexts/paginationContext.tsx";
import useDebounce from "../hooks/useDebounce.ts";

const HomeScreen = () => {
  const {id: paramsId} = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [snippetName, setSnippetName] = useState('');
  const [snippetId, setSnippetId] = useState<number | null>(null)
  const {page, count, handleChangeCount} = usePaginationContext()
  const [filter, setFilter] = useState<'mySnippets' | 'sharedSnippets' | 'allSnippets'>('mySnippets');

    let queryFunction;
    switch (filter) {
        case 'sharedSnippets':
            queryFunction = useGetSharedSnippets;
            break;
        case 'allSnippets':
            queryFunction = useGetAllSnippets;
            break;
        case 'mySnippets':
        default:
            queryFunction = useGetSnippets;
    }

    const { data, isLoading } = queryFunction(page, snippetName);


    useEffect(() => {
    if (data?.count && data.count != count) {
      handleChangeCount(data.count)
    }
    console.log(data)
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

    const handleFilterChange = (event: SelectChangeEvent) => {
        setFilter(event.target.value as 'mySnippets' | 'sharedSnippets' | 'allSnippets');
    };


    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Select value={filter} onChange={handleFilterChange} sx={{
                    height:'30px',
                    width: '200px',
                    background: 'white',
                    borderRadius: '5px',
                    padding: '5px',
                }}>
                    <MenuItem value="mySnippets">My Snippets</MenuItem>
                    <MenuItem value="sharedSnippets">Shared Snippets</MenuItem>
                    <MenuItem value="allSnippets">All Snippets</MenuItem>
                </Select>
            </Box>
            <SnippetTable loading={isLoading} handleClickSnippet={setSnippetId} snippets={data?.snippets} handleSearchSnippet={handleSearchSnippet} />
            <Drawer open={!!snippetId} anchor={"right"} onClose={handleCloseModal}>
                {snippetId && <SnippetDetail handleCloseModal={handleCloseModal} id={snippetId} />}
            </Drawer>
        </>
    );
}

export default withNavbar(HomeScreen);

