/**
 * Generates search query variations for Turkish character matching.
 * E.g. "eglence" -> ["eglence", "eglençe", "eğlence", "eğlençe"]
 */
export function getTurkishSearchVariations(query: string): string[] {
  const charMap: Record<string, string[]> = {
    c: ["c", "ç"],
    ç: ["c", "ç"],
    g: ["g", "ğ"],
    ğ: ["g", "ğ"],
    i: ["i", "ı"],
    ı: ["i", "ı"],
    o: ["o", "ö"],
    ö: ["o", "ö"],
    s: ["s", "ş"],
    ş: ["s", "ş"],
    u: ["u", "ü"],
    ü: ["u", "ü"],
  };

  const results: string[] = [];
  const lowerQuery = query.toLowerCase();

  function generate(index: number, current: string) {
    // Avoid recursion explosion on very long inputs with many matched characters
    if (results.length >= 16) return;
    if (index === lowerQuery.length) {
      results.push(current);
      return;
    }

    const char = lowerQuery[index];
    const replacements = charMap[char];

    if (replacements) {
      for (const r of replacements) {
        generate(index + 1, current + r);
      }
    } else {
      generate(index + 1, current + char);
    }
  }

  generate(0, "");

  // Return unique variations including original query and uppercase versions
  const unique = Array.from(
    new Set([
      query,
      ...results,
      ...results.map((r) => r.toUpperCase()),
    ])
  );

  return unique;
}
