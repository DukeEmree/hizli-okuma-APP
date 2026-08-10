import { ExerciseDefinition } from "@/types/exercise";
import { rsvpDefinition } from './rsvp';
import { chunkingDefinition } from './chunking';
import { pacerDefinition } from './pacer';
import { schulteDefinition } from './schulte';
import { scanningDefinition } from './scanning';

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
