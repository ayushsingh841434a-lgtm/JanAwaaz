const consonants: Record<string, string> = {
  क: "k", ख: "kh", ग: "g", घ: "gh", ङ: "ng",
  च: "ch", छ: "chh", ज: "j", झ: "jh", ञ: "ny",
  ट: "t", ठ: "th", ड: "d", ढ: "dh", ण: "n",
  त: "t", थ: "th", द: "d", ध: "dh", न: "n",
  प: "p", फ: "ph", ब: "b", भ: "bh", म: "m",
  य: "y", र: "r", ल: "l", व: "v", श: "sh",
  ष: "sh", स: "s", ह: "h", ळ: "l",
  क़: "q", ख़: "kh", ग़: "gh", ज़: "z", ड़: "r",
  ढ़: "ṛh", फ़: "f",
};

const vowels: Record<string, string> = {
  अ: "a", आ: "aa", इ: "i", ई: "ee", उ: "u", ऊ: "oo",
  ऋ: "ri", ए: "e", ऐ: "ai", ओ: "o", औ: "au",
};

const matras: Record<string, string> = {
  "ा": "aa", "ि": "i", "ी": "ee", "ु": "u", "ू": "oo", "ृ": "ri",
  "े": "e", "ै": "ai", "ो": "o", "ौ": "au",
};

const marks: Record<string, string> = {
  "ं": "n", "ँ": "n", "ः": "h", "ऽ": "'", "।": ".", "॥": ".",
  "०": "0", "१": "1", "२": "2", "३": "3", "४": "4",
  "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
};

export function transliterateHindi(text: string): string {
  const chars = Array.from(text.normalize("NFC"));
  let result = "";

  for (let index = 0; index < chars.length; index += 1) {
    const char = chars[index];
    const next = chars[index + 1];
    if (consonants[char]) {
      result += consonants[char];
      if (next === "़") {
        const nuktaForm = consonants[`${char}़`];
        if (nuktaForm) {
          result = result.slice(0, -consonants[char].length) + nuktaForm;
          index += 1;
        }
      }
      if (next && matras[next]) {
        result += matras[next];
        index += 1;
      } else if (next === "्") {
        index += 1;
      } else {
        result += "a";
      }
    } else {
      result += vowels[char] ?? matras[char] ?? marks[char] ?? char;
    }
  }

  return result;
}

export function transliterateDictionary<T>(value: T): T {
  if (typeof value === "string") return transliterateHindi(value) as T;
  if (Array.isArray(value)) return value.map(transliterateDictionary) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, transliterateDictionary(entry)]),
    ) as T;
  }
  return value;
}
