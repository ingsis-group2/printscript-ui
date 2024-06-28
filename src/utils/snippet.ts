import {Pagination} from "./pagination.ts";
import {FileType} from "../types/FileType.ts";

export type ComplianceEnum =
    'pending' |
    'failed' |
    'not-compliant' |
    'compliant'


export type CreateSnippet = {
  name: string;
  language: string;
  extension: string;
  content: string;
}

export type CreateSnippetWithLang = CreateSnippet & { language: string }

export type UpdateSnippet = {
  content: string
}

export type Snippet = CreateSnippet & {
  id: number
} & SnippetStatus

type SnippetStatus = {
  compliance: ComplianceEnum;
  author: string;
}
export type PaginatedSnippets = Pagination & {
  snippets: Snippet[]
}

export const getFileLanguage = (fileTypes: FileType[], fileExt?: string) => {
  return fileExt && fileTypes?.find(x => x.extension == fileExt)
}