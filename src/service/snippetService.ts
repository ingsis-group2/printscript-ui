import {FakeSnippetOperations} from "../utils/mock/fakeSnippetOperations.ts";
import {SnippetOperations} from "../utils/snippetOperations.ts";
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "../utils/snippet.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase} from "../types/TestCase.ts";
import {ExecutionResult, FormatterOutput, TestCaseResult} from "../utils/queries.tsx";
import {FileType} from "../types/FileType.ts";
import axiosInstance from "./axios.ts";
import {Adapter} from "./adapter.ts";
import {BACKEND_URL} from "../utils/constants.ts";

const fakeOperations = new FakeSnippetOperations();
const adapter = new Adapter();

export class SnippetService implements SnippetOperations {
  async listSnippetDescriptors(page: number, snippetName?: string): Promise<PaginatedSnippets> {
    console.log(BACKEND_URL)
    const response = await axiosInstance.get(`${BACKEND_URL}/snippet/byWriter?page=${page}`);
    return adapter.adaptPaginatedSnippets(response.data, page, snippetName);
  }

  async listSharedSnippetDescriptors(page: number, snippetName?: string): Promise<PaginatedSnippets> {
    const response = await axiosInstance.get(`${BACKEND_URL}/snippet/byReader?page=${page}`);
    return adapter.adaptPaginatedSnippets(response.data, page, snippetName);
  }

    async listAllSnippetDescriptors(page: number, snippetName?: string): Promise<PaginatedSnippets> {
        const response = await axiosInstance.get(`${BACKEND_URL}/snippet/byReaderAndWriter?page=${page}`);
        return adapter.adaptPaginatedSnippets(response.data, page, snippetName);
    }

  async getSnippetById(id: number): Promise<Snippet | undefined> {
    const response = await axiosInstance.get(`${BACKEND_URL}/snippet/${id}`);
    return adapter.adaptSnippet(response.data);
  }

  async updateSnippetById(id: number, updateSnippet: UpdateSnippet): Promise<Snippet> {
    await axiosInstance.put(`${BACKEND_URL}/snippet/${id}`, updateSnippet);
    return adapter.adaptSnippet(this.getSnippetById(id));
  }

  shareSnippet(snippetId: number): Promise<Snippet> {
    return fakeOperations.shareSnippet(snippetId);
  }

  async getFormatRules(): Promise<Rule[]> {
    const response = await axiosInstance.get(`${BACKEND_URL}/rules/format`);
    console.log(response)// Log headers from response
    return adapter.adaptRules(response.data)
  }

  async getLintingRules(): Promise<Rule[]> {
    const response = await axiosInstance.get(`${BACKEND_URL}/rules/lint`);
    console.log(response);
    return adapter.adaptRules(response.data);
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

  async deleteSnippet(id: number): Promise<number> {
    await axiosInstance.delete(`${BACKEND_URL}/snippet/${id}`);
    return id;
  }

  testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
    console.log(testCase);
    return fakeOperations.testSnippet();
  }

  async getFileTypes(): Promise<FileType[]> {
    return [
      {
        language: 'Python',
        extension: 'py',
      },
      {
        language: 'PrintScript',
        extension: 'ps',
      },
      {
        language: 'JavaScript',
        extension: 'js',
      }
    ]
  }

  async modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
    const payload = adapter.adaptModifyRules(newRules);
    console.log(payload);
    const response = await axiosInstance.post(`${BACKEND_URL}/rules/format`, payload);
    return adapter.adaptRules(response.data);
  }

  async modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
    const payload = adapter.adaptModifyRules(newRules);
    console.log(payload);
    const response = await axiosInstance.post(`${BACKEND_URL}/rules/lint`, payload);
    return adapter.adaptRules(response.data);
  }

  async executeSnippet(snippetId: number, version: string, inputs: string[]): Promise<ExecutionResult> {
    const response = await axiosInstance.post(`${BACKEND_URL}/runner/execute/${snippetId}`, {version, inputs})
    console.log(response);
    return response.data;
  }

  async formatSnippet(snippetId: number, version: string): Promise<FormatterOutput> {
    const response = await axiosInstance.post(`${BACKEND_URL}/runner/format/${snippetId}`, {version});
    console.log(response);
    return response.data;
  }

  async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    const response = await axiosInstance.post(`${BACKEND_URL}/snippet`, createSnippet);
    console.log(response);
    return adapter.adaptSnippet(response.data);
  }
}