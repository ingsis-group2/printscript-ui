import {Snippet} from "../utils/snippet.ts";
import {Rule} from "../types/Rule.ts";

export class Adapter{
    adaptSnippetCreateResponse(data: any): Snippet{
        return {
            id: data.id,
            name: data.name,
            language: data.language,
            extension: data.extension,
            content: data.content,
            author: data.writer,
            compliance: 'pending'
        }
    }

    adaptRules(data: any): Rule[]{
        const rules: Rule[] = []
        console.log(data)
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

}