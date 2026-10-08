import { readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { dictionaries, LANGUAGES, type Lang } from "../lib/i18n/dictionaries";

type FlatMessages = Map<string, string>;

function flatten(value: unknown, prefix = "", target: FlatMessages = new Map()): FlatMessages {
  if (typeof value === "string") {
    target.set(prefix, value);
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => flatten(item, `${prefix}[${index}]`, target));
  } else if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, prefix ? `${prefix}.${key}` : key, target);
    }
  }
  return target;
}

function findDuplicateProperties(node: ts.Node, scope: string, errors: string[]): void {
  if (ts.isObjectLiteralExpression(node)) {
    const seen = new Set<string>();
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property) && !ts.isMethodDeclaration(property)) continue;
      const name = property.name;
      const key = ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)
        ? name.text
        : null;
      if (key && seen.has(key)) errors.push(`${scope}: duplicate key "${key}"`);
      if (key) seen.add(key);
      ts.forEachChild(property, (child) => findDuplicateProperties(child, scope, errors));
    }
    return;
  }
  ts.forEachChild(node, (child) => findDuplicateProperties(child, scope, errors));
}

function sourceDuplicateErrors(filePath: string): string[] {
  const source = ts.createSourceFile(
    filePath,
    readFileSync(filePath, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  const localeNames = new Set<string>(LANGUAGES.map(({ code }) => code).filter((code) => code !== "hi-Latn"));
  const errors: string[] = [];
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !localeNames.has(declaration.name.text as Lang) || !declaration.initializer) continue;
      findDuplicateProperties(declaration.initializer, declaration.name.text, errors);
    }
  }
  return errors;
}

const baseMessages = flatten(dictionaries.en);
let failureCount = 0;
const errors = sourceDuplicateErrors(path.resolve("lib/i18n/dictionaries.ts"));

for (const { code } of LANGUAGES) {
  const messages = flatten(dictionaries[code]);
  const missing = [...baseMessages.keys()].filter((key) => !messages.has(key));
  const extra = [...messages.keys()].filter((key) => !baseMessages.has(key));
  const empty = [...messages].filter(([, value]) => !value.trim()).map(([key]) => key);
  const invalid = [...messages.keys()].filter((key) => !/^[A-Za-z0-9_.\-[\]]+$/.test(key));

  if (missing.length || extra.length || empty.length || invalid.length) {
    failureCount += 1;
    console.error(`✗ ${code}`);
    if (missing.length) console.error(`  Missing: ${missing.join(", ")}`);
    if (extra.length) console.error(`  Extra: ${extra.join(", ")}`);
    if (empty.length) console.error(`  Empty: ${empty.join(", ")}`);
    if (invalid.length) console.error(`  Invalid keys: ${invalid.join(", ")}`);
  } else {
    console.log(`✓ ${code} complete (${messages.size} messages)`);
  }
}

if (errors.length) {
  failureCount += 1;
  for (const error of errors) console.error(`✗ ${error}`);
}

if (failureCount) {
  console.error(`i18n check failed: ${failureCount} locale/source issue(s).`);
  process.exitCode = 1;
} else {
  console.log(`All ${LANGUAGES.length} locales have ${baseMessages.size} complete dictionary messages.`);
}
