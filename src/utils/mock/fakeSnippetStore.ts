import {Snippet} from '../snippet'
import {TestCase} from "../../types/TestCase.ts";
const INITIAL_SNIPPETS: Snippet[] = [
  {
    id: 102,
    name: 'Super Snippet',
    content: 'println(   \'Hello World!\');',
    compliance: 'pending',
    author: {
      name: 'John Doe',
      id: '1',
      email: ''
    },    language: 'printscript',
    extension: 'prs',
  },
  {
    id: 2,
    name: 'Extra cool Snippet',
    content: 'let a: number = 1;\nlet b: number = 2;\nlet c: number = a + b;\nprintln(c);',
    compliance: 'not-compliant',
    author: {
      name: 'John Doe',
      id: '1',
      email: ''
    },    language: 'printscript',
    extension: 'prs',
  },
  {
    id: 3,
    name: 'Boaring Snippet',
    content: 'let snake_Case_Variable: string = \'Hello\';\nprintln(snake_Case_Variable + 1);',
    compliance: 'compliant',
    author: {
        name: 'John Doe',
        id: '1',
        email: ''
    },
    language: 'printscript',
    extension: 'prs',
  },
  {
    id: 5,
    name: 'Boaring Snippet',
    content: 'const value = 1; println(  value + 2  );',
    compliance: 'compliant',
    author: {
      name: 'John Doe',
      id: '1',
      email: ''
    },    language: 'printscript',
    extension: 'prs',
  },
  {
    id: 6,
    name: 'ReadInput',
    content: 'let a: number = readInput(\"Enter a number: \");\nprintln(\'Number is: \' + a);',
    compliance: 'compliant',
    author: {
      name: 'John Doe',
      id: '1',
      email: ''
    },    language: 'printscript',
    extension: 'prs',
  }
]
const fakeTestCases: TestCase[] = [
  {
    id: "aa",
    name: "Test Case 1",
    input: ["A", "B"],
    output: ["C", "D"]
  },
  {
    id: "asf",
    name: "Test Case 2",
    input: ["E", "F"],
    output: ["G", "H"]
  },
]
export class FakeSnippetStore {
  private readonly snippetMap: Map<number, Snippet> = new Map()
  private readonly testCaseMap: Map<string, TestCase> = new Map()

  constructor() {
    INITIAL_SNIPPETS.forEach(snippet => {
      this.snippetMap.set(snippet.id, snippet)
    })

    fakeTestCases.forEach(testCase => {
      this.testCaseMap.set(testCase.id, testCase)
    })
  }


  getSnippetById(id: number): Snippet | undefined {
    return this.snippetMap.get(id)
  }


  removeTestCase(id: string): string {
    this.testCaseMap.delete(id)
    return id
  }

}
