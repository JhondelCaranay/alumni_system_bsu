import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
/* 
Database seeding happens in two ways with Prisma: manually with prisma db seed and automatically in prisma migrate dev and prisma migrate reset.

To seed the database, run the db seed CLI command:
$ npx prisma db seed

*/
// enum Role {
//   ADMIN // can control everything - can create group chat
//   FACULTY_MEMBER // normal faculty member
//   FACULTY_ADVISER // include in group chat per section
//   FACULTY_COORDINATOR // 7 programs
//   FACULTY_AlUMNI // former student
//   FACULTY_STUDENT // current student
//   PESO // can post job openings , Public Employment Service Office
//   BULSU_PARTNER // can post job openings
// }

const prisma = new PrismaClient();
async function main() {
  /* 
    SEED USERS
  */
  const password = await bcrypt.hash("dev123", 12);

  const users_roles = [
    "FACULTY_MEMBER",
    "FACULTY_ADVISER",
    "FACULTY_COORDINATOR",
    "FACULTY_AlUMNI",
    "FACULTY_STUDENT",
    "PESO",
    "BULSU_PARTNER",
  ];

  await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      hashedPassword: password,
      role: Role.ADMIN,
    },
  });

  //   const alice = await prisma.user.upsert({
  //     where: { email: "alice@prisma.io" },
  //     update: {},
  //     create: {
  //       email: "alice@prisma.io",
  //       name: "Alice",
  //       posts: {
  //         create: {
  //           title: "Check out Prisma with Next.js",
  //           content: "https://www.prisma.io/nextjs",
  //           published: true,
  //         },
  //       },
  //     },
  //   });

  console.log("Seeding completed.");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
