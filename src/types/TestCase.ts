export type TestCase = {
    id: number;
    name: string;
    input?: string[];
    output?: string[];
    envVars?: string;
};