import {FakeSnippetOperations} from "../utils/mock/fakeSnippetOperations.ts";
import {SnippetOperations} from "../utils/snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "../utils/snippet.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase} from "../types/TestCase.ts";
import {ExecutionResult, FormatterOutput, TestCaseResult} from "../utils/queries.tsx";
import {FileType} from "../types/FileType.ts";
import {SNIPPET_OPERATIONS_URL, SNIPPET_RUNNER_URL} from "../utils/constants.ts";
import axiosInstance from "./axios.ts";
import {Adapter} from "./adapter.ts";

const fakeOperations = new FakeSnippetOperations();
const adapter = new Adapter();

export class SnippetService implements SnippetOperations {
    listSnippetDescriptors(page: number, pageSize: number): Promise<PaginatedSnippets> {
    return fakeOperations.listSnippetDescriptors(page, pageSize);
  }

  getSnippetById(id: number): Promise<Snippet | undefined> {
    return fakeOperations.getSnippetById(id);
  }

  updateSnippetById(id: number, updateSnippet: UpdateSnippet): Promise<Snippet> {
    return fakeOperations.updateSnippetById(id, updateSnippet);
  }

  shareSnippet(snippetId: number): Promise<Snippet> {
    return fakeOperations.shareSnippet(snippetId);
  }

  async getFormatRules(): Promise<Rule[]> {
    const response = await axiosInstance.get(`${SNIPPET_OPERATIONS_URL}/rules/format`);
    console.log(response)
    return adapter.adaptRules(response.data)
  }

  async getLintingRules(): Promise<Rule[]> {
    const response = await axiosInstance.get(`${SNIPPET_OPERATIONS_URL}/rules/lint`);
    console.log(response)
    return adapter.adaptRules(response.data)
  }

  getTestCases(): Promise<TestCase[]> {
    return fakeOperations.getTestCases();
  }

  postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
    return fakeOperations.postTestCase(testCase);
  }

  removeTestCase(id: number): Promise<number> {
    return fakeOperations.removeTestCase(id);
  }

  deleteSnippet(id: number): Promise<number> {
    return fakeOperations.deleteSnippet(id);
  }

  testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
    console.log(testCase)
    return fakeOperations.testSnippet();
  }

  getFileTypes(): Promise<FileType[]> {
    return fakeOperations.getFileTypes();
  }

  async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
    const payload = adapter.adaptModifyRules(newRules)
    console.log(payload)
    const response = await axiosInstance.post(`${SNIPPET_OPERATIONS_URL}/rules/format`, payload);
    return adapter.adaptRules(response.data)
  }

  async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
    const payload = adapter.adaptModifyRules(newRules)
    console.log(payload)
    const response = await axiosInstance.post(`${SNIPPET_OPERATIONS_URL}/rules/lint`, payload);
    return adapter.adaptRules(response.data)
  }

  async executeSnippet(content: string, version: string, inputs: string[]): Promise<ExecutionResult> {
    const response = await axiosInstance.post(`${SNIPPET_RUNNER_URL}/execute`, {content, version, inputs})
    console.log(response)
    return response.data
  }

  async formatSnippet(content: string, version: string): Promise<FormatterOutput> {
    const rules = await this.getFormatRules()
    const response = await axiosInstance.post(`${SNIPPET_RUNNER_URL}/format`, {content, version, rules})
    console.log(response)
    return response.data
  }

  async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
      const response = await axiosInstance.post(`${SNIPPET_OPERATIONS_URL}/`, createSnippet)
      console.log(response)
      return adapter.adaptSnippetCreateResponse(response.data)
  }
}