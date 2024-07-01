import {PaginatedSnippets, Snippet} from "../utils/snippet.ts";
import {Rule} from "../types/Rule.ts";
import {PaginatedUsers, User} from "../utils/users.ts";
import {TestCase} from "../types/TestCase.ts";

export class Adapter{
    adaptSnippet(data: any): Snippet{
        return {
            id: data.id,
            name: data.name,
            language: data.language,
            extension: data.extension,
            content: data.content,
            author: {
                name: data.user.username,
                id: data.user.id,
                email: data.user.email
            },
            compliance: 'pending'
        }
    }

    adaptUser(data: any): User{
        return {
            name: data.username,
            id: data.id,
            email: data.email
        }
    }

    adaptRules(data: any): Rule[]{
        const rules: Rule[] = []
        for (const [key, value] of Object.entries(data)) {
            rules.push({
                id: key,
                name: key,
                isActive: value !== null && (typeof value !== 'boolean' || value),
                value: value
            })
        }
        return rules
    }

    adaptModifyRules(newRules: Rule[]): Record<string, any> {
        return newRules.reduce((acc: Record<string, any>, rule: Rule) => {
            if (rule.value !== null) {
                acc[rule.name] = rule.value;
            }
            return acc;
        }, {});
    }

    adaptPaginatedSnippets(data: any, page: number, snippetName?: string) : PaginatedSnippets {
        const snippets: Snippet[] = data.map((snippet: any) => this.adaptSnippet(snippet))
        if (snippetName) {
            return {
                snippets: snippets.filter(snippet => snippet.name.includes(snippetName)),
                count: snippets.length,
                page: page,
                page_size: 10
            }
        } else {
            return {
                snippets: snippets,
                count: snippets.length,
                page: page,
                page_size: 10
            }
        }
    }

    adaptPaginatedUsers(data: any, page: number, pageSize: number, name: string): PaginatedUsers {
        const users: User[] = data.map((user: any) => this.adaptUser(user))
        if (name) {
            return {
                users: users.filter(user => user.name.includes(name)),
                count: users.length,
                page: page,
                page_size: pageSize
            }
        } else {
            return {
                users: users,
                count: users.length,
                page: page,
                page_size: pageSize
            }
        }
    }

    adaptTestCase(data: any, snippetId: number): TestCase | undefined {
        if (snippetId === data.snippetId) {
            return {
                id: data.id,
                name: data.name,
                input: data.inputs,
                output: data.output,
                envVars: this.adaptOperationsEnvVars(data.envs),
            };
        }
        return undefined;
    }

    adaptTestCases(data: any, snippetId: number): TestCase[] {
        return data
            .map((testCase: any) => this.adaptTestCase(testCase, snippetId))
            .filter((testCase: TestCase | undefined): testCase is TestCase => testCase !== undefined);
    }


    // Converts 'ENV1=123;ENV2=456' to { ENV1: '123', ENV2: '456' }
    adaptUiEnvVars(data: string | undefined): { [key: string]: any } {
        if (!data) return {};
        return data.split(';').reduce((acc: { [key: string]: any }, curr: string) => {
            const [key, value] = curr.split('=');
            if (key) {
                acc[key] = value;
            }
            return acc;
        }, {});
    }

    // Converts { ENV1: '123', ENV2: '456' } to 'ENV1=123;ENV2=456'
    adaptOperationsEnvVars(data: { [key: string]: any }): string {
        return Object.entries(data)
            .map(([key, value]) => `${key}=${value}`)
            .join(';');
    }




}