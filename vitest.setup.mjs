import { vi } from 'vitest';

/**
 * Mocks the `trackImports` utility globally for all tests.
 *
 * In production, `trackImports` verifies if SolidJS functions are actually
 * imported from 'solid-js' to prevent false positives.
 * For testing, we mock this to bypass the import check, allowing test snippets
 * to be written concisely without requiring explicit import statements.
 */
vi.mock('./src/utils', async (importOriginal) => {
  const originUtils = await importOriginal();
  return {
    ...originUtils,
    // Override only `trackImports()` from utils.ts while keeping the rest intact
    trackImports: () => {
      // Normally, `handleImportDeclaration` builds an importMap and `matchImport`
      // checks against it. Here, we mock `matchImport` to blindly return a match
      // based on the function name, treating all tracked functions as properly imported.
      const matchImport = (imports, str) => {
        const importArr = Array.isArray(imports) ? imports : [imports];
        return importArr.find((i) => i === str);
      };
      const handleImportDeclaration = () => {};
      return { matchImport, handleImportDeclaration };
    },
  };
});
