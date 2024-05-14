import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
  await dropTables();
  await seedTable('Url', createShortUrls);
};

const dropTables = async () => {
  console.log('Dropping tables');
  await prisma.shortUrlEntity.deleteMany();
  console.log('Finish dropping tables');
};

const seedTable = async (name: string, fn: () => void) => {
  console.log(`Seeding ${name}`);
  await fn();
  console.log(`Finish Seeding ${name}`);
};

const createShortUrls = async (): Promise<void> => {
  const urls = [
    {
      originalUrl: 'https://lunii.com',
      nbClicks: 2,
    },
    {
      originalUrl: 'https://github.com',
      nbClicks: 5,
    },
  ];

  for (const url of urls) {
    await prisma.shortUrlEntity.create({
      data: url,
    });
  }
};

main();
