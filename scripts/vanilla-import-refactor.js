const { Project } = require('ts-morph');
const path = require('path');
const fs = require('fs');

// 1. 모든 style.css.ts 파일 경로 수집
function getAllStyleCssTsFiles(dir, arr = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllStyleCssTsFiles(fullPath, arr);
    } else if (file.endsWith('.css.ts')) {
      arr.push(fullPath);
    }
  }
  return arr;
}

// 2. style.css.ts에서 export 이름 추출
function getExportedNames(styleFilePath) {
  const content = fs.readFileSync(styleFilePath, 'utf8');
  const exportRegex = /export\s+const\s+([A-Za-z0-9_]+)/g;
  const names = [];
  let match;
  while ((match = exportRegex.exec(content))) {
    names.push(match[1]);
  }
  return names;
}

// 3. 실제 리팩토링
async function refactorVanillaImports(rootDir) {
  const project = new Project({ tsConfigFilePath: path.join(rootDir, 'tsconfig.json') });
  const styleFiles = getAllStyleCssTsFiles(rootDir);

  // style.css.ts 경로 → export 이름 매핑
  const styleExportsMap = {};
  for (const styleFile of styleFiles) {
    styleExportsMap[styleFile] = getExportedNames(styleFile);
  }

  console.log('>>>', Object.keys(styleExportsMap).length);

  // 모든 소스 파일 순회
  const sourceFiles = project.getSourceFiles();

  let successCount = 0;
  let errorCount = 0;

  for (const sourceFile of sourceFiles) {
    try {
      let changed = false;
      const importDecls = sourceFile.getImportDeclarations();

      for (const importDecl of importDecls) {
        const moduleSpecifier = importDecl.getModuleSpecifierValue();
        if (moduleSpecifier.endsWith('.css')) {
          const styleFilePath = path.resolve(
            path.dirname(sourceFile.getFilePath()),
            moduleSpecifier + '.ts'
          );

          const exportNames = styleExportsMap[styleFilePath];

          if (!exportNames || exportNames.length === 0) {
            continue;
          }

          // import * as s from './style.css' → import { ... } from './style.css'
          if (
            importDecl.getNamespaceImport() &&
            importDecl.getNamespaceImport().getText() === 's'
          ) {
            importDecl.removeNamedImports();
            importDecl.setDefaultImport(undefined);
            importDecl.setNamespaceImport(undefined);
            importDecl.addNamedImports(exportNames);
            changed = true;

            // 파일 내 s.스타일명 → 스타일명으로 치환
            const regex = /\bs\.([A-Za-z0-9_]+)\b/g;
            const fullText = sourceFile.getFullText();
            const replaced = fullText.replace(regex, (_, name) =>
              exportNames.includes(name) ? name : `s.${name}`
            );
            if (replaced !== fullText) {
              sourceFile.replaceWithText(replaced);
              changed = true;
            }
          }
        }
      }
      if (changed) {
        await sourceFile.save();
        successCount++;
        console.log('Updated:', sourceFile.getFilePath());
      }
    } catch (e) {
      console.error(e, sourceFile.getFilePath());
      errorCount++;
    }
  }

  console.log('successCount', successCount);
  console.log('errorCount', errorCount);
}

const directories = [
  path.resolve(__dirname, '../services/my-service'),
];

for (const dir of directories) {
  refactorVanillaImports(dir).then(() => {
    console.log('VanillaExtract import 리팩토링 완료!');
  });
}

