import { ExerciseDefinition } from "@/types/exercise";
import { rsvpDefinition } from './rsvp';
import { chunkingDefinition } from './chunking';
import { pacerDefinition } from './pacer';
import { schulteDefinition } from './schulte';
import { scanningDefinition } from './scanning';
import { peripheralDefinition } from './peripheral';
import { wordRecognitionDefinition } from './word-recognition';
import { memoryDefinition } from './memory';
import { sentenceMemoryDefinition } from './sentence-memory';
import { mainIdeaDefinition } from './main-idea';
import { keywordDefinition } from './keyword';
import { selectiveAttentionDefinition } from './selective-attention';
import { numberScanDefinition } from './number-scan';
import { visualSearchDefinition } from './visual-search';
import { comprehensionSpeedDefinition } from './comprehension-speed';
class ExerciseRegistry {
  private exercises: Map<string, ExerciseDefinition> = new Map();

  public register(definition: ExerciseDefinition) {
    if (this.exercises.has(definition.id)) {
      console.warn(`Exercise ${definition.id} is already registered. Overwriting.`);
    }
    this.exercises.set(definition.id, definition);
  }

  public get(id: string): ExerciseDefinition | undefined {
    return this.exercises.get(id);
  }

  public getByType(type: string): ExerciseDefinition | undefined {
    return this.getAll().find((definition) => definition.type === type);
  }

  public getAll(): ExerciseDefinition[] {
    return Array.from(this.exercises.values());
  }
}

export const exerciseRegistry = new ExerciseRegistry();

// Bütün egzersizleri burada register edelim
exerciseRegistry.register(rsvpDefinition);
exerciseRegistry.register(chunkingDefinition);
exerciseRegistry.register(pacerDefinition);
exerciseRegistry.register(schulteDefinition);
exerciseRegistry.register(scanningDefinition);
exerciseRegistry.register(peripheralDefinition);
exerciseRegistry.register(wordRecognitionDefinition);
exerciseRegistry.register(memoryDefinition);
exerciseRegistry.register(sentenceMemoryDefinition);
exerciseRegistry.register(mainIdeaDefinition);
exerciseRegistry.register(keywordDefinition);
exerciseRegistry.register(selectiveAttentionDefinition);
exerciseRegistry.register(numberScanDefinition);
exerciseRegistry.register(visualSearchDefinition);
exerciseRegistry.register(comprehensionSpeedDefinition);
