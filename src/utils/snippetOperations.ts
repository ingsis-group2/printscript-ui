import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from './snippet'
import {TestCase} from "../types/TestCase.ts";
import {ExecutionResult, FormatterOutput, TestCaseResult} from "./queries.tsx";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";

export interface SnippetOperations {
  listSnippetDescriptors(page: number, snippetName?: string): Promise<PaginatedSnippets>

  listSharedSnippetDescriptors(page: number, snippetName?: string): Promise<PaginatedSnippets>

  listAllSnippetDescriptors(page: number, snippetName?: string): Promise<PaginatedSnippets>

  getSnippetById(id: number): Promise<Snippet | undefined>

  updateSnippetById(id: number, updateSnippet: UpdateSnippet): Promise<Snippet>

  shareSnippet(snippetId: number,userId: string): Promise<Snippet>

  getFormatRules(): Promise<Rule[]>

  getLintingRules(): Promise<Rule[]>

  getTestCases(): Promise<TestCase[]>

    postTestCase(testCase: Partial<TestCase>): Promise<TestCase>

  removeTestCase(id: number): Promise<number>

  deleteSnippet(id: number): Promise<number>

  testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult>

  getFileTypes(): Promise<FileType[]>

  modifyFormatRule(newRules: Rule[]): Promise<Rule[]>

  modifyLintingRule(newRules: Rule[]): Promise<Rule[]>

  //done
  executeSnippet(snippetId: number, version: string, inputs: string[]): Promise<ExecutionResult>

  formatSnippet(snippetId: number, version: string): Promise<FormatterOutput>

  createSnippet(createSnippet: CreateSnippet): Promise<Snippet>

}
