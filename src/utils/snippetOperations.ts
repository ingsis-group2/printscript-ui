import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from './snippet'
import {PaginatedUsers} from "./users.ts";
import {Rule} from "./mock/fakeSnippetStore.ts";
import {TestCase} from "../types/TestCase.ts";
import {ExecutionResult, TestCaseResult} from "./queries.tsx";
import {FileType} from "../types/FileType.ts";

export interface SnippetOperations {
  listSnippetDescriptors(page: number,pageSize: number,sippetName?: string): Promise<PaginatedSnippets>

  createSnippet(createSnippet: CreateSnippet): Promise<Snippet>

  getSnippetById(id: string): Promise<Snippet | undefined>

  updateSnippetById(id: string, updateSnippet: UpdateSnippet): Promise<Snippet>

  getUserFriends(name?: string,page?: number,pageSize?: number): Promise<PaginatedUsers>

  shareSnippet(snippetId: string,userId: string): Promise<Snippet>

  getFormatRules(): Promise<Rule[]>

  getLintingRules(): Promise<Rule[]>

  getTestCases(): Promise<TestCase[]>

  formatSnippet(snippet: string): Promise<string>

  postTestCase(testCase: Partial<TestCase>): Promise<TestCase>

  removeTestCase(id: string): Promise<string>

  deleteSnippet(id: string): Promise<string>

  testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult>

  getFileTypes(): Promise<FileType[]>

  executeSnippet(snippetId: string, language: string, version: string, input: string): Promise<ExecutionResult>
}
