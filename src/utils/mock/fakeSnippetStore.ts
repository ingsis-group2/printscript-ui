import {Snippet, UpdateSnippet} from '../snippet'
import {PaginatedUsers} from "../users.ts";
import {TestCase} from "../../types/TestCase.ts";
import {TestCaseResult} from "../queries.tsx";
import {FileType} from "../../types/FileType.ts";
import {Rule} from "../../types/Rule.ts";

const INITIAL_SNIPPETS: Snippet[] = [
  {
    id: 1,
    name: 'Super Snippet',
    content: 'println(  \'Hello World!\');',
    compliance: 'pending',
    author: 'John Doe',
    language: 'printscript',
    extension: 'prs',
  },
  {
    id: 2,
    name: 'Extra cool Snippet',
    content: 'let a: number = 1;\nlet b: number = 2;\nlet c: number = a + b;\nprintln(c);',
    compliance: 'not-compliant',
    author: 'John Doe',
    language: 'printscript',
    extension: 'prs',
  },
  {
    id: 3,
    name: 'Boaring Snippet',
    content: 'let snake_Case_Variable: string = \'Hello\';\nprintln(snake_Case_Variable + 1);',
    compliance: 'compliant',
    author: 'John Doe',
    language: 'printscript',
    extension: 'prs',
  },
  {
    id: 5,
    name: 'Boaring Snippet',
    content: 'const value = 1; println(  value + 2  );',
    compliance: 'compliant',
    author: 'John Doe',
    language: 'printscript',
    extension: 'prs',
  },
  {
    id: 6,
    name: 'ReadInput',
    content: 'let a: number = readInput(\"Enter a number: \");\nprintln(\'Number is: \' + a);',
    compliance: 'compliant',
    author: 'John Doe',
    language: 'printscript',
    extension: 'prs',
  }
]

const paginatedUsers: PaginatedUsers = {
  count: 5,
  page: 1,
  page_size: 10,
  users: [
    {
      name: "Chona",
      id: "1"
    },
    {
      name: "Fede",
      id: "2"
    },
    {
      name: "Mateo",
      id: "3"
    },
    {
      name: "Tomi",
      id: "4"
    },
    {
      name: "Berrets",
      id: "5"
    }
  ]
}

const INITIAL_FORMATTING_RULES: Rule[] = [
  {
    id: '1',
    name: "indentation",
    isActive: true,
    value: 3
  },
  {
    id: '2',
    name: "open-if-block-on-same-line",
    isActive: false,
  },
  {
    id: '3',
    name: "max-line-length",
    isActive: true,
    value: 100
  },
  {
    id: '4',
    name: "no-trailing-spaces",
    isActive: false,
    value: null
  },
  {
    id: '5',
    name: "no-multiple-empty-lines",
    isActive: false,
    value: null,
  }
]

const INITIAL_LINTING_RULES: Rule[] = [
  {
    id: '1',
    name: "no-expressions-in-print-line",
    isActive: true,
    value: null
  },
  {
    id: '2',
    name: "no-unused-vars",
    isActive: true,
    value: null
  },
  {
    id: '3',
    name: "no-undef-vars",
    isActive: false,
    value: null
  },
  {
    id: '4',
    name: "no-unused-params",
    isActive: false,
    value: null
  },
]

const fakeTestCases: TestCase[] = [
  {
    id: 1,
    name: "Test Case 1",
    input: ["A", "B"],
    output: ["C", "D"]
  },
  {
    id: 2,
    name: "Test Case 2",
    input: ["E", "F"],
    output: ["G", "H"]
  },
]

const fileTypes: FileType[] = [
  {
    language: "printscript",
    extension: "prs",
  },
  {
    language: "python",
    extension: "py",
  },
  {
    language: "java",
    extension: "java",
  },
  {
    language: 'golang',
    extension: 'go'
  }
]

export class FakeSnippetStore {
  private readonly snippetMap: Map<number, Snippet> = new Map()
  private readonly testCaseMap: Map<number, TestCase> = new Map()
  private formattingRules: Rule[] = [];
  private lintingRules: Rule[] = [];

  constructor() {
    INITIAL_SNIPPETS.forEach(snippet => {
      this.snippetMap.set(snippet.id, snippet)
    })

    fakeTestCases.forEach(testCase => {
      this.testCaseMap.set(testCase.id, testCase)
    })
    this.formattingRules = INITIAL_FORMATTING_RULES
    this.lintingRules = INITIAL_LINTING_RULES
  }

  listSnippetDescriptors(): Snippet[] {
    return Array.from(this.snippetMap, ([, value]) => value)
  }

  getSnippetById(id: number): Snippet | undefined {
    return this.snippetMap.get(id)
  }

  updateSnippet(id: number, updateSnippet: UpdateSnippet): Snippet {
    const existingSnippet = this.snippetMap.get(id)

    if (existingSnippet === undefined)
      throw Error(`Snippet with id ${id} does not exist`)

    const newSnippet = {
      ...existingSnippet,
      ...updateSnippet
    }
    this.snippetMap.set(id, newSnippet)

    return newSnippet
  }

  getUserFriends(name: string, page: number, pageSize: number) {
    return {
      ...paginatedUsers,
      page: page,
      pageSize: pageSize,
      users: paginatedUsers.users.filter(x => x.name.includes(name))
    };
  }

  getFormatRules(): Rule[] {
    return this.formattingRules
  }

  getLintingRules(): Rule[] {
    return this.lintingRules
  }

  formatSnippet(snippetContent: string): string {
    return `//Mocked format of snippet :) \n${snippetContent}`
  }

  getTestCases(): TestCase[] {
    return Array.from(this.testCaseMap, ([, value]) => value)
  }

  postTestCase(testCase: Partial<TestCase>): TestCase {
    const id = testCase.id ?? 1
    const newTestCase = {...testCase, id} as TestCase
    this.testCaseMap.set(id,newTestCase)
    return newTestCase
  }

  removeTestCase(id: number): number {
    this.testCaseMap.delete(id)
    return id
  }

  deleteSnippet(id: number): number {
    this.snippetMap.delete(id)
    return id
  }

  testSnippet(): TestCaseResult {
    return Math.random() > 0.5 ? "success" : "fail"
  }

  getFileTypes(): FileType[] {
    return fileTypes
  }

  modifyFormattingRule(newRules: Rule[]): Rule[] {
    this.formattingRules = newRules;
    return newRules;
  }

  modifyLintingRule(newRules: Rule[]): Rule[] {
    this.lintingRules = newRules
    return newRules
  }
}
