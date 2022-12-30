import { test, expect } from 'vitest';
import fs from 'fs';
import { Project, ScriptTarget, SyntaxKind, Node } from 'ts-morph';
import { dataConverter } from './dataConverter';

test('convert data', () => {
  const mixin = fs.readFileSync('src/mixins/MixinSample.js').toString('utf-8');

  const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
    compilerOptions: {
      target: ScriptTarget.Latest,
    },
  });

  const sourceFile = project.createSourceFile('s.tsx', mixin);

  const options = sourceFile.getDescendantsOfKind(
    SyntaxKind.ObjectLiteralExpression
  )[0];

  const dataNode = options
    ?.getProperties()
    .find((x) => Node.isMethodDeclaration(x) && x.getName() === 'data');

  const props = dataConverter(dataNode!);
  expect(props).toEqual([
    {
      use: 'ref',
      expression: "const firstName = ref('first')",
      returnNames: ['firstName'],
    },
    {
      use: 'ref',
      expression: "const lastName = ref('last')",
      returnNames: ['lastName'],
    },
  ]);
});
