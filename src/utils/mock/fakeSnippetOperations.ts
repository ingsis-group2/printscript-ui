import {SnippetOperations} from '../snippetOperations'
import {FakeSnippetStore} from './fakeSnippetStore'
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from '../snippet'
import autoBind from 'auto-bind'
import {PaginatedUsers} from "../users.ts";
import {TestCase} from "../../types/TestCase.ts";
import {ExecutionResult, FormatterOutput, TestCaseResult} from "../queries.tsx";
import {FileType} from "../../types/FileType.ts";
import axios from 'axios'
import {Rule} from "../../types/Rule.ts";
import {SNIPPET_RUNNER_URL, SNIPPET_OPERATIONS_URL} from "../constants.ts";

const DELAY: number = 1000

// Retrieve the token from localStorage
const token = localStorage.getItem("@@auth0spajs@@::MChgRhyd44fZZMqSWXHMNDtfgT4Vs7KV::https://snippet-security::openid profile email");
let access_token = '';

if (token) {
  const tokenObj = JSON.parse(token);
  access_token = tokenObj.body.access_token;
  console.log(access_token);
}

// Set up Axios interceptor to add Authorization header to all requests
axios.interceptors.request.use(
    config => {
      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
);


export class FakeSnippetOperations implements SnippetOperations {
  private readonly fakeStore = new FakeSnippetStore()

  constructor() {
    autoBind(this)
  }



  getSnippetById(id: number): Promise<Snippet | undefined> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.getSnippetById(id)), DELAY)
    })
  }

  listSnippetDescriptors(page: number,pageSize: number): Promise<PaginatedSnippets> {
    const response: PaginatedSnippets = {
      page: page,
      page_size: pageSize,
      count: 20,
      snippets: page == 0 ? this.fakeStore.listSnippetDescriptors().splice(0,pageSize) : this.fakeStore.listSnippetDescriptors().splice(1,2)
    }

    return new Promise(resolve => {
      setTimeout(() => resolve(response), DELAY)
    })
  }

  updateSnippetById(id: number, updateSnippet: UpdateSnippet): Promise<Snippet> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.updateSnippet(id, updateSnippet)), DELAY)
    })
  }


  shareSnippet(snippetId: number): Promise<Snippet> {
    return new Promise(resolve => {
      // @ts-expect-error, it will always find it in the fake store
      setTimeout(() => resolve(this.fakeStore.getSnippetById(snippetId)), DELAY)
    })
  }

  getFormatRules(): Promise<Rule[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.getFormatRules()), DELAY)
    })
  }

  getLintingRules(): Promise<Rule[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.getLintingRules()), DELAY)
    })
  }

  getTestCases(): Promise<TestCase[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.getTestCases()), DELAY)
    })
  }

  postTestCase(testCase: TestCase): Promise<TestCase> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.postTestCase(testCase)), DELAY)
    })
  }

  removeTestCase(id: number): Promise<number> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.removeTestCase(id)), DELAY)
    })
  }

  testSnippet(): Promise<TestCaseResult> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.testSnippet()), DELAY)
    })
  }

  deleteSnippet(id: number): Promise<number> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.deleteSnippet(id)), DELAY)
    })
  }

  getFileTypes(): Promise<FileType[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.getFileTypes()), DELAY)
    })
  }

  modifyFormatRule(newRules: Rule[]): Promise<Rule[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.modifyFormattingRule(newRules)), DELAY)
    })
  }

  modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.modifyLintingRule(newRules)), DELAY)
    })
  }

  async executeSnippet(content: string, version: string, inputs: string[]): Promise<ExecutionResult> {
    try {
      console.log(content, version, inputs)
      const payload = {
        content,
        version,
        inputs
      };
      const response = await axios.post(`${SNIPPET_RUNNER_URL}/execute`, payload, {
      });
      return response.data;
    } catch (error) {
      console.error("Error executing snippet:", error);
      throw error;
    }
  }

  async formatSnippet(content: string, version: string): Promise<FormatterOutput> {
    try {
      const payload = {
        content,
        version,
        formatRules: {
          "colonBefore": false,
          "colonAfter": false,
          "assignationBefore": false,
          "assignationAfter": false,
          "printJump": 1,
          "ifIndentation": 2
        }
      };
      const response = await axios.post(`${SNIPPET_RUNNER_URL}/format`, payload);
      console.log(response)
      return response.data;
    } catch (error) {
      console.error("Error formatting snippet:", error);
      throw error;
    }
  }

  async createSnippet(createSnippet: CreateSnippet): Promise<Snippet> {
    try {
      const response = await axios.post(`${SNIPPET_OPERATIONS_URL}`, createSnippet)
      console.log(response)
      return {
        id: response.data.id,
        name: response.data.name,
        language: response.data.language,
        extension: response.data.extension,
        content: response.data.content,
        author: response.data.writer,
        compliance: 'compliant'
      }
    } catch (error) {
      console.error("Error creating snippet:", error);
      throw error;
    }
  }


  async getUsers(page: number, pageSize: number): Promise<PaginatedUsers> {
    try {
      console.log(page, pageSize)
      // Fetch users from Auth0
      // const response = await axios.get(`https://dev-77ie0xuayhhodlbg.us.auth0.com/api/v2/users`, {
      // });
      return {
        page: page,
        page_size: pageSize,
        count: 20,
        users: [
          {
            id: '1',
            name: 'User 1',
            }]
      }
    } catch (error) {
      console.error("Error getting users:", error);
      throw error;
    }
  }
}

