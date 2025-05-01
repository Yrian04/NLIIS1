// src/utils/groupWordForms.ts
import { TreeNode } from '../types';

export const groupWordFormsByLemma = (
  wordForms: Array<[any, number]>
): TreeNode[] => {
  const lemmaMap = new Map<number, TreeNode>();
  const result: TreeNode[] = [];

  for (const [wf, count] of wordForms) {
    // Добавьте защиту от undefined
    if (!wf || !wf.lemma) {
      console.warn('Словоформа без леммы:', wf);
      continue;
    }

    const lemma = wf.lemma;
    
    if (!lemmaMap.has(lemma.id)) {
      lemmaMap.set(lemma.id, {
        id: lemma.id,
        name: lemma.lemma,
        type: 'lemma',
        children: []
      });
      result.push(lemmaMap.get(lemma.id)!);
    }

    lemmaMap.get(lemma.id)?.children?.push({
      id: wf.id,
      name: wf.word,
      type: 'word_form',
      count,
      description: wf.description
    });
  }

  return result;
};