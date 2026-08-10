const fs = require('fs');
const path = require('path');

const routes = [
  { name: 'peripheral', cmp: 'PeripheralExerciseScreen', pkg: 'peripheral', props: 'timeLimitMs={timeLimitMs}' },
  { name: 'word-recognition', cmp: 'WordRecognitionExerciseScreen', pkg: 'word-recognition', props: 'timeLimitMs={timeLimitMs}' },
  { name: 'memory', cmp: 'MemoryExerciseScreen', pkg: 'memory', props: 'timeLimitMs={timeLimitMs}' },
  { name: 'sentence-memory', cmp: 'SentenceMemoryExerciseScreen', pkg: 'sentence-memory', props: 'timeLimitMs={timeLimitMs}' },
  { name: 'main-idea', cmp: 'MainIdeaExerciseScreen', pkg: 'main-idea', props: 'timeLimitMs={timeLimitMs}' },
  { name: 'keyword', cmp: 'KeywordExerciseScreen', pkg: 'keyword', props: 'timeLimitMs={timeLimitMs}' },
  { name: 'selective-attention', cmp: 'SelectiveAttentionExerciseScreen', pkg: 'selective-attention', props: 'timeLimitMs={timeLimitMs}' },
  { name: 'number-scan', cmp: 'NumberScanExerciseScreen', pkg: 'number-scan', props: 'timeLimitMs={timeLimitMs}' },
  { name: 'visual-search', cmp: 'VisualSearchExerciseScreen', pkg: 'visual-search', props: 'timeLimitMs={timeLimitMs}' },
  { name: 'comprehension-speed', cmp: 'ComprehensionSpeedExerciseScreen', pkg: 'comprehension-speed', props: 'timeLimitMs={timeLimitMs}' },
];

routes.forEach(r => {
  const content = `import React from 'react';
import { ${r.cmp} } from "@/features/exercises/${r.pkg}/${r.cmp}";
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function Route() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  // Default to 60s if not provided via config
  const timeLimitMs = params.timeLimitMs ? parseInt(params.timeLimitMs as string, 10) : 60000;

  const handleComplete = () => {
    router.back();
  };
  
  return (
    <${r.cmp} 
      ${r.props}
      onComplete={handleComplete}
    />
  );
}
`;
  fs.writeFileSync(`src/app/(app)/exercises/${r.name}.tsx`, content);
});

console.log("Done");
