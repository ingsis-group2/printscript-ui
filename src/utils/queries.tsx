import {useMutation, UseMutationResult, useQuery} from 'react-query';
import {CreateSnippet, PaginatedSnippets, Snippet, UpdateSnippet} from './snippet.ts';
import {SnippetOperations} from "./snippetOperations.ts";
import {TestCase} from "../types/TestCase.ts";
import {FileType} from "../types/FileType.ts";
import {Rule} from "../types/Rule.ts";
import {SnippetService} from "../service/snippetService.ts";

const snippetOperations: SnippetOperations = new SnippetService()

export const useGetSnippets = (page: number = 0, snippetName?: string) => {
  return useQuery<PaginatedSnippets, Error>(['listSnippets', page,snippetName], () => snippetOperations.listSnippetDescriptors(page,snippetName));
};

export const useGetSnippetById = (id: number) => {
  return useQuery<Snippet | undefined, Error>(['snippet', id], () => snippetOperations.getSnippetById(id), {
    enabled: !!id, // This query will not execute until the id is provided
  });
};

export const useCreateSnippet = ({onSuccess}: {onSuccess: () => void}): UseMutationResult<Snippet, Error, CreateSnippet> => {
  return useMutation<Snippet, Error, CreateSnippet>(createSnippet => snippetOperations.createSnippet(createSnippet), {onSuccess});
};

export const useUpdateSnippetById = ({onSuccess}: {onSuccess: () => void}): UseMutationResult<Snippet, Error, {
  id: number;
  updateSnippet: UpdateSnippet
}> => {
  return useMutation<Snippet, Error, { id: number; updateSnippet: UpdateSnippet }>(
      ({id, updateSnippet}) => snippetOperations.updateSnippetById(id, updateSnippet),{
        onSuccess,
    }
  );
};


export const useShareSnippet = () => {
  return useMutation<Snippet, Error, { snippetId: number; userId: string }>(
      ({snippetId, userId}) => snippetOperations.shareSnippet(snippetId, userId)
  );
};


export const useGetTestCases = () => {
  return useQuery<TestCase[] | undefined, Error>(['testCases'], () => snippetOperations.getTestCases(), {});
};


export const usePostTestCase = () => {
  return useMutation<TestCase, Error, Partial<TestCase>>(
      (tc) => snippetOperations.postTestCase(tc)
  );
};


export const useRemoveTestCase = ({onSuccess}: {onSuccess: () => void}) => {
  return useMutation<number, Error, number>(
      ['removeTestCase'],
      (id) => snippetOperations.removeTestCase(id),
      {
        onSuccess,
      }
  );
};

export type TestCaseResult = "success" | "fail"

export const useTestSnippet = () => {
  return useMutation<TestCaseResult, Error, Partial<TestCase>>(
      (tc) => snippetOperations.testSnippet(tc)
  )
}

export const useGetFormatRules = () => {
  return useQuery<Rule[], Error>('formatRules', () => snippetOperations.getFormatRules());
}

export const useModifyFormatRules = ({onSuccess}: {onSuccess: () => void}) => {
  return useMutation<Rule[], Error, Rule[]>(
      rule => snippetOperations.modifyFormatRule(rule),
      {onSuccess}
  );
}

export const useGetLintingRules = () => {
  return useQuery<Rule[], Error>('lintingRules', () => snippetOperations.getLintingRules());
}


export const useModifyLintingRules = ({onSuccess}: {onSuccess: () => void}) => {
  return useMutation<Rule[], Error, Rule[]>(
      rule => snippetOperations.modifyLintingRule(rule),
      {onSuccess}
  );
}


export const useDeleteSnippet = ({onSuccess}: {onSuccess: () => void}) => {
  return useMutation<number, Error, number>(
      id => snippetOperations.deleteSnippet(id),
      {
        onSuccess,
      }
  );
}


export const useGetFileTypes = () => {
  return useQuery<FileType[], Error>('fileTypes', () => snippetOperations.getFileTypes());
}


export type ExecutionResult = {
  outputs: string[],
  errors: string[]
}

export const useExecuteSnippet = () => {
  return useMutation<ExecutionResult, Error, { snippetId: number; version: string; inputs: string[] }>(
      ({ snippetId, version, inputs }) => snippetOperations.executeSnippet(snippetId, version, inputs)
  );
}

export type FormatterOutput = {
  formattedCode: string
  errors: string[]
}

export const useFormatSnippet = () => {
  return useMutation<FormatterOutput, Error, { snippetId: number, version: string }>(
      ({ snippetId, version }) => snippetOperations.formatSnippet(snippetId, version)
  );
}


