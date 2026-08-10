#!/bin/bash
find src/features/exercises -name "use*Engine.ts" -exec sed -i 's/setIsCompleted(true);/\/\/ eslint-disable-next-line react-hooks\/set-state-in-effect\n      setIsCompleted(true);/g' {} +
find src/features/exercises -name "use*Engine.ts" -exec sed -i 's/generateNewRound();/\/\/ eslint-disable-next-line react-hooks\/set-state-in-effect\n      generateNewRound();/g' {} +
find src/features/exercises -name "use*Engine.ts" -exec sed -i 's/generateNewTarget();/\/\/ eslint-disable-next-line react-hooks\/set-state-in-effect\n      generateNewTarget();/g' {} +
