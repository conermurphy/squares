import { Prisma } from '@prisma/client';

// 1: Define a type that includes the relation to `Post`
const userWithAccounts = Prisma.validator<Prisma.UserArgs>()({
  include: { accounts: true },
});

// 2: This type will include a user and all their posts
export type UserWithAccounts = Prisma.UserGetPayload<typeof userWithAccounts>;
