import { uuidv7 } from "uuidv7";
import { makePrismaClient } from "@/main/factories/prisma";

const TMDB_LANGUAGES: { code: string; name: string }[] = [
  { code: "en", name: "English" },
  { code: "pt", name: "Portuguese" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "sv", name: "Swedish" },
  { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" },
  { code: "nl", name: "Dutch" },
  { code: "no", name: "Norwegian" },
  { code: "pl", name: "Polish" },
  { code: "tr", name: "Turkish" },
  { code: "th", name: "Thai" },
  { code: "cs", name: "Czech" },
  { code: "el", name: "Greek" },
  { code: "he", name: "Hebrew" },
  { code: "hu", name: "Hungarian" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
  { code: "ro", name: "Romanian" },
  { code: "uk", name: "Ukrainian" },
  { code: "vi", name: "Vietnamese" },
  { code: "tl", name: "Tagalog" }
];

export async function seedLanguages() {
  const prisma = makePrismaClient();

  const result = await prisma.language.createMany({
    skipDuplicates: true,
    data: TMDB_LANGUAGES.map(({ code, name }) => ({ id: uuidv7(), code, name }))
  });

  console.log(`Seeded ${result.count} languages`);

  await prisma.$disconnect();
}
