import {SnippetOperations} from '../snippetOperations'
import {FakeSnippetStore} from './fakeSnippetStore'
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from '../snippet'
import autoBind from 'auto-bind'
import {TestCase} from "../../types/TestCase.ts";
import {ExecutionResult, FormatterOutput, TestCaseResult} from "../queries.tsx";
import {FileType} from "../../types/FileType.ts";
import axios from 'axios'
import {Rule} from "../../types/Rule.ts";
import {SNIPPET_RUNNER_URL, SNIPPET_OPERATIONS_URL} from "../constants.ts";

const DELAY: number = 1000


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

  getTestCases(): Promise<TestCase[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.fakeStore.getTestCases()), DELAY)
    })
  }

  postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
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
    return new Promise(async (resolve, reject) => {
      try {
        const payload = newRules.reduce((acc: Record<string, any>, rule: Rule) => {
          acc[rule.name] = rule.value;
          return acc;
        }, {});
        console.log("new rules: ", payload)
        const response = await axios.post(`${SNIPPET_OPERATIONS_URL}/rules/format`, payload);
        console.log(response)
        resolve(newRules);
      } catch (error) {
        console.error("Error modifying formatting rules:", error);
        reject(error);
      }
    });
  }

  modifyLintingRule(newRules: Rule[]): Promise<Rule[]> {
    return new Promise(async (resolve, reject) => {
      try {

        const payload = newRules.reduce((acc: Record<string, any>, rule: Rule) => {
          acc[rule.name] = rule.value;
          return acc;
        }, {});
        console.log("new rules: ", payload)
        const response = await axios.post(`${SNIPPET_OPERATIONS_URL}/rules/lint`, payload);
        console.log(response)
        resolve(newRules);
      } catch (error) {
        console.error("Error modifying linting rules:", error);
        reject(error);
      }
    });
  }

  async executeSnippet(snippetId: number, version: string, inputs: string[]): Promise<ExecutionResult> {
    try {
      console.log(snippetId, version, inputs)
      const payload = {
        snippetId,
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

  async formatSnippet(snippetId: number, version: string): Promise<FormatterOutput> {
    try {
      const formatRules = await this.getFormatRules();
      const payload = {
        snippetId,
        version,
        formatRules: formatRules.reduce((acc: Record<string, any>, rule: Rule) => {
          if (rule.value !== null) {
            acc[rule.name] = rule.value;
          }
          return acc;
        }, {})
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
      const response = await axios.post(`${SNIPPET_OPERATIONS_URL}/`, createSnippet)
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

  async getFormatRules(): Promise<Rule[]> {
    try {
      const response = await axios.get(`${SNIPPET_OPERATIONS_URL}/rules/format`);
      console.log(response)
      const data = response.data
      const rules: Rule[] = []
      for (const [key, value] of Object.entries(data)) {
        rules.push({
          id: key,
          name: key,
          isActive: value != null,
          value: value
        })
      }
      console.log(rules)
      return rules
    } catch (error) {
      console.error("Error getting formatting rules:", error);
      throw error;
    }
  }

  async getLintingRules(): Promise<Rule[]> {
    try {
      const response = await axios.get(`${SNIPPET_OPERATIONS_URL}/rules/lint`);
      //const response = await axios.get(`/api/rules/lint`);
      console.log(response)
      const data = response.data
      const rules: Rule[] = []
      for (const [key, value] of Object.entries(data)) {
        rules.push({
          id: key,
          name: key,
          isActive: value != null,
          value: value
        })
      }
      console.log(rules)
      return rules
    } catch (error) {
      console.error("Error getting formatting rules:", error);
      throw error;
    }
  }
}
