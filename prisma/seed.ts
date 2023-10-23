import { Gender, PrismaClient, Role } from "@prisma/client";
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

  // course / department / program
  const departments = [
    "AUTOMOTIVE",
    "COMPUTER",
    "DRAFTING",
    "EIR",
    "EEC",
    "FOODS",
    "MECHANICAL",
  ];

  const departmentsIds = await Promise.all(
    departments.map(async (department) => {
      return await prisma.department.create({
        data: {
          name: department,
        },
      });
    })
  );

  const password = await bcrypt.hash("dev123", 12);

  const users_roles = [
    "ADMIN",
    "ADVISER",
    "COORDINATOR",
    "ALUMNI",
    "STUDENT",
    "PESO",
    "BULSU_PARTNER",
  ];

  users_roles.forEach(async (role) => {
    // random number 0 - 6
    const randomNumber = Math.floor(Math.random() * 7);

    const user = await prisma.user.create({
      data: {
        email: `${role.toLowerCase()}@bulsu.edu.ph`,
        hashedPassword: password,
        role: Role[role as keyof typeof Role],
        name: faker.person.firstName(),
        image: faker.image.avatar(),
        department: {
          connect: {
            id: departmentsIds[randomNumber].id,
          },
        },
      },
    });

    const isAlumniOrStudent =
      user.role === Role.ALUMNI || user.role === Role.STUDENT;

    // profile
    await prisma.profile.create({
      data: {
        isEmployed: faker.datatype.boolean(),
        schoolYear: faker.number.int({ min: 1, max: 4 }),
        studentNumber: isAlumniOrStudent
          ? faker.number.int().toString()
          : undefined,
        yearEnrolled: isAlumniOrStudent
          ? faker.date.between({
              from: "2020-01-01T00:00:00.000Z",
              to: "2030-01-01T00:00:00.000Z",
            })
          : undefined,
        alternative_email: faker.internet.email(),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        middlename: faker.person.lastName(),
        age: faker.number.int({ min: 18, max: 60 }),
        city: faker.location.city(),
        homeNo: faker.location.buildingNumber(),
        street: faker.location.street(),
        barangay: faker.location.state(),
        gender: faker.person.sexType().toUpperCase() as Gender,
        contactNo: faker.phone.number(),
        province: faker.location.state(),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  });

  // create 10 alumni and 10 students
  for (let i = 0; i < 20; i++) {
    const isAlumniOrStudent = i % 2 === 0;
    // alumni is even, student is odd

    // random number 0 - 6
    const randomNumber = Math.floor(Math.random() * 7);

    const user = await prisma.user.create({
      data: {
        email: `
        ${faker.person.firstName()}@bulsu.edu.ph
        `,
        hashedPassword: password,
        role: isAlumniOrStudent ? Role.ALUMNI : Role.STUDENT,
        name: faker.person.firstName(),
        image: faker.image.avatar(),
        department: {
          connect: {
            id: departmentsIds[randomNumber].id,
          },
        },
      },
    });

    // profile
    await prisma.profile.create({
      data: {
        schoolYear: faker.number.int({ min: 1, max: 4 }),
        studentNumber: faker.number.int().toString(),
        yearEnrolled: faker.date.between({
          from: "2020-01-01T00:00:00.000Z",
          to: "2030-01-01T00:00:00.000Z",
        }),
        alternative_email: faker.internet.email(),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        middlename: faker.person.lastName(),
        age: faker.number.int({ min: 18, max: 60 }),
        city: faker.location.city(),
        homeNo: faker.location.buildingNumber(),
        street: faker.location.street(),
        barangay: faker.location.state(),
        gender: faker.person.sexType().toUpperCase() as Gender,
        contactNo: faker.phone.number(),
        province: faker.location.state(),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

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
