import { Phrase, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPhrase = (opts: Prisma.PhraseCreateArgs) => {
  return prisma.phrase.create(opts);
};

export const getRandomPhrase = async (chatId: number) => {
  const phrases = await prisma.$queryRaw<
    Prisma.Prisma__PhraseClient<Phrase[]>
  >`SELECT * FROM "${Prisma.ModelName.Phrase}" where chat = ${chatId} ORDER BY random() LIMIT 1`;

  return phrases.length > 0
    ? phrases[0]
    : null
};
