import {SnippetOperations} from "../utils/snippetOperations.ts";
import {ComplianceEnum, CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from "../utils/snippet.ts";
import {Rule} from "../types/Rule.ts";
import {TestCase} from "../types/TestCase.ts";
import {ExecutionResult, FormatterOutput, TestCaseResult} from "../utils/queries.tsx";
import {FileType} from "../types/FileType.ts";
import axiosInstance from "./axios.ts";
import {Adapter} from "./adapter.ts";
import {PaginatedUsers} from "../utils/users.ts";

const adapter = new Adapter();

const BACKEND_URL = "https://tista-dev.duckdns.org/api/operations";

export class SnippetService implements SnippetOperations {
  async listSnippetDescriptors(page: number, snippetName?: string): Promise<PaginatedSnippets> {
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

  async getSnippetStatus(snippetId: number): Promise<ComplianceEnum> {
    const response = await axiosInstance.get(`${BACKEND_URL}/snippet/status/${snippetId}`);
    return response.data.status;
  }

  async getSnippetById(id: number): Promise<Snippet | undefined> {
    const response = await axiosInstance.get(`${BACKEND_URL}/snippet/${id}`);
    const status = await this.getSnippetStatus(id);
    return adapter.adaptSnippet(response.data, status);
  }

  async updateSnippetById(id: number, updateSnippet: UpdateSnippet): Promise<Snippet | undefined> {
    await axiosInstance.put(`${BACKEND_URL}/snippet/${id}`, updateSnippet);
    return this.getSnippetById(id);
  }

  async shareSnippet(snippetId: number, userEmail: string): Promise<Snippet> {
    await axiosInstance.post(
        `${BACKEND_URL}/snippet/addReader`,
        null,
        {
          params: {
            readerMail: userEmail,
            snippetId: snippetId
          }
        }
    );
    // @ts-ignore
    return await this.getSnippetById(snippetId)!;
  }

  async getUsers(name: string, page: number, pageSize: number): Promise<PaginatedUsers> {
    const response = await axiosInstance.get(`${BACKEND_URL}/user`, {
      params: {
        page,
        pageSize
      }
    });
    return adapter.adaptPaginatedUsers(response.data, page, pageSize, name);
  }

  async getFormatRules(): Promise<Rule[]> {
    const response = await axiosInstance.get(`${BACKEND_URL}/rules/format`);
    return adapter.adaptRules(response.data)
  }

  async getLintingRules(): Promise<Rule[]> {
    const response = await axiosInstance.get(`${BACKEND_URL}/rules/lint`);
    return adapter.adaptRules(response.data);
  }

  async getTestCases(snippetId: number): Promise<TestCase[]> {
    const response = await axiosInstance.get(`${BACKEND_URL}/testCase`);
    return adapter.adaptTestCases(response.data, snippetId);
  }

  async postTestCase(testCase: Partial<TestCase>, snippetId: number, version: string): Promise<TestCase> {
    // Convert string to map for request
    const adaptedEnvVars = adapter.adaptUiEnvVars(testCase.envVars);

    const response = await axiosInstance.post(`${BACKEND_URL}/testCase`, {
      name: testCase.name,
      snippetId,
      version,
      inputs: testCase.input,
      envs: adaptedEnvVars, // Send map
      output: testCase.output,
    });

    // Convert map to string for response
    const adaptedResponseEnvVars = adapter.adaptOperationsEnvVars(response.data.envs);

    return {
      id: response.data.id,
      name: response.data.name,
      input: response.data.inputs,
      output: response.data.output,
      envVars: adaptedResponseEnvVars,
    };
  }

  async removeTestCase(id: string): Promise<string> {
    await axiosInstance.delete(`${BACKEND_URL}/testCase/${id}`);
    return id
  }

  async deleteSnippet(id: number): Promise<number> {
    await axiosInstance.delete(`${BACKEND_URL}/snippet/${id}`);
    return id;
  }

  async testSnippet(testCase: Partial<TestCase>): Promise<TestCaseResult> {
    const response = await axiosInstance.post(`${BACKEND_URL}/runner/test/${testCase.id}`, {version:"1.1"})
    return response.data ? "success" : "fail";
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
    return response.data;
  }

  async formatSnippet(snippetId: number, version: string): Promise<FormatterOutput> {
    const response = await axiosInstance.post(`${BACKEND_URL}/runner/format/${snippetId}`, {version});
    return response.data;
  }

  async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    const response = await axiosInstance.post(`${BACKEND_URL}/snippet`, createSnippet);
    return adapter.adaptSnippet(response.data, 'pending');
  }
}