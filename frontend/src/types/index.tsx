// src/types/index.ts

export interface Text {
    id: number;
    file: string;
  }

export interface Lemma {
    id: number;
    lemma: string;
}
  
export interface WordForm {
    id: number;
    word: string;
    lemma: Lemma;
    description: string;
}
  
export type TreeNode = {
    id: number;
    name: string;
    type: 'lemma' | 'word_form';
    count?: number;
    description?: string;
    lemma?: Lemma;
    wordForm?: any;
    children?: TreeNode[];
};