const fs = require('fs');

// 1. settings.tsx
let settings = fs.readFileSync('src/app/(app)/(tabs)/settings.tsx', 'utf8');
settings = settings.replace('titleColor?: string', 'titleColor?: any');
settings = settings.replace(/variant=\{destructive \? "secondary" : "primary"\}/g, 'btnType={destructive ? "secondary" : "primary"}');
settings = settings.replace(/variant="outline"/g, 'btnType="outline"');
fs.writeFileSync('src/app/(app)/(tabs)/settings.tsx', settings, 'utf8');

// 2. login.tsx
let login = fs.readFileSync('src/app/(auth)/login.tsx', 'utf8');
login = login.replace(/<AppButton variant="outline"/g, '<AppButton btnType="outline"');
fs.writeFileSync('src/app/(auth)/login.tsx', login, 'utf8');

// 3. AuthPromptSheet.tsx
let authPrompt = fs.readFileSync('src/components/auth/AuthPromptSheet.tsx', 'utf8');
authPrompt = authPrompt.replace(/<AppButton size="\$5" variant="outline"/g, '<AppButton size="$5" btnType="outline"');
fs.writeFileSync('src/components/auth/AuthPromptSheet.tsx', authPrompt, 'utf8');

// 4. MetronomeControl.tsx
let metro = fs.readFileSync('src/components/exercises/MetronomeControl.tsx', 'utf8');
metro = metro.replace(/<Switch\.Thumb animation="quick" \/>/g, '<Switch.Thumb />');
fs.writeFileSync('src/components/exercises/MetronomeControl.tsx', metro, 'utf8');

// 5. AppButton.tsx
let appBtn = fs.readFileSync('src/components/ui/AppButton.tsx', 'utf8');
appBtn = appBtn.replace(/variant:/g, 'btnType:');
appBtn = appBtn.replace(/\$blue10Light/g, '$blue10');
appBtn = appBtn.replace(/\$blue11Light/g, '$blue11');
appBtn = appBtn.replace(/\$blue9Light/g, '$blue9');
appBtn = appBtn.replace(/\$gray5Light/g, '$gray5');
fs.writeFileSync('src/components/ui/AppButton.tsx', appBtn, 'utf8');

// 6. ErrorState.tsx
let errState = fs.readFileSync('src/components/ui/ErrorState.tsx', 'utf8');
errState = errState.replace(/\$red10Light/g, '$red10');
errState = errState.replace(/variant="outline"/g, 'btnType="outline"');
fs.writeFileSync('src/components/ui/ErrorState.tsx', errState, 'utf8');

// 7. ProgressBar.tsx
let progBar = fs.readFileSync('src/components/ui/ProgressBar.tsx', 'utf8');
progBar = progBar.replace(/\$gray5Light/g, '$gray5');
progBar = progBar.replace(/\$blue10Light/g, '$blue10');
fs.writeFileSync('src/components/ui/ProgressBar.tsx', progBar, 'utf8');

// 8. ComprehensionScreen.tsx
let compScreen = fs.readFileSync('src/features/comprehension/ComprehensionScreen.tsx', 'utf8');
compScreen = compScreen.replace(/\$colorSubtle/g, '$color11');
fs.writeFileSync('src/features/comprehension/ComprehensionScreen.tsx', compScreen, 'utf8');

console.log('All errors fixed!');
