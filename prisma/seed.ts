import { Gender, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
/* 
Database seeding happens in two ways with Prisma: manually with prisma db seed and automatically in prisma migrate dev and prisma migrate reset.

To seed the database, run the db seed CLI command:
$ npx prisma db seed

To reset the database and seed it using db push
$ npx prisma migrate reset --skip-seed
$ npx prisma db push    // push the schema to the database first
$ npx prisma generate  // (optional)
$ npx prisma db seed  // then you can seed the database

OR
$ npx prisma db push --force-reset
$ npx prisma db seed

*/

// enum Role {
//   ADMIN // can control everything - can create group chat
//   ADVISER // include in group chat per section
//   COORDINATOR // 7 programs
//   ALUMNI // former student
//   STUDENT // current student
//   PESO // can post job openings , Public Employment Service Office
//   BULSU_PARTNER // can post job openings
// }

const prisma = new PrismaClient();

const departments = [
  "AUTOMOTIVE",
  "COMPUTER",
  "DRAFTING",
  "EIR",
  "EEC",
  "FOODS",
  "MECHANICAL",
];

const sections = ["A", "B"];

const password = bcrypt.hashSync("dev123", 12);

const createDepartment = async (name: string) => {
  return await prisma.department.create({
    data: {
      name,
    },
  });
};

const createSection = async () => {
  return await prisma.section.create({
    data: {
      name: faker.helpers.arrayElement(sections),
      course_year: faker.helpers.arrayElement([1, 2, 3, 4]),
      school_year: faker.helpers.arrayElement([
        "2023-2026",
        "2024-2027",
        "2025-2028",
      ]),
      department: {
        connect: {
          name: faker.helpers.arrayElement(departments),
        },
      },
    },
  });
};

// create user n times
const createUser = async (role: string) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const full_email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${faker.number.int(
    {
      min: 0,
      max: 10,
    }
  )}@bulsu.edu.ph`;

  const departmentIds = await prisma.department.findMany({
    select: {
      id: true,
    },
  });

  const sectionsIds = await prisma.section.findMany({
    select: {
      id: true,
    },
  });

  const user = await prisma.user.create({
    data: {
      isArchived: false,
      name: faker.person.firstName(),
      email: role === "ADMIN" ? "admin@bulsu.edu.ph" : full_email,
      image: faker.image.avatar(),
      hashedPassword: password,
      role: Role[role as keyof typeof Role], // convert string to enum
      section: {
        connect: {
          // name_school_year_departmentId: {
          //   name: faker.helpers.arrayElement(sections),
          //   school_year: faker.helpers.arrayElement([
          //     "2023-2026",
          //     "2024-2027",
          //     "2025-2028",
          //   ]),
          //   departmentId: faker.helpers.arrayElement(departmentIds).id,
          // },
          id: faker.helpers.arrayElement(sectionsIds).id,
        },
      },
      department: {
        connect: {
          name: faker.helpers.arrayElement(departments),
        },
      },
      profile: {
        create: {
          isEmployed: faker.datatype.boolean(),
          studentNumber: faker.number.int(),
          schoolYear: faker.helpers.arrayElement([1, 2, 3]),
          yearEnrolled: faker.date.between({
            from: "2020-01-01T00:00:00.000Z",
            to: "2021-01-01T00:00:00.000Z",
          }),
          yearGraduated: faker.date.between({
            from: "2024-01-01T00:00:00.000Z",
            to: "2025-01-01T00:00:00.000Z",
          }),
          alternative_email: faker.internet.email(),
          firstname: firstName,
          lastname: lastName,
          middlename: faker.person.lastName(),
          age: faker.number.int({ min: 15, max: 30 }),
          religion: faker.helpers.arrayElement(["Christian", "Muslim"]),
          gender: faker.helpers.enumValue(Gender),
          placeOfBirth: faker.location.city(),
          dateOfBirth: faker.date.between({
            from: "2000-01-01T00:00:00.000Z",
            to: "2005-01-01T00:00:00.000Z",
          }),
          homeNo: faker.location.buildingNumber(),
          street: faker.location.street(),
          barangay: faker.location.state(),
          city: faker.location.city(),
          corUrl: faker.internet.url(),
          province: faker.location.state(),
          contactNo: faker.phone.number(),
          parents: {
            // create: {
            //   firstname: faker.person.firstName(),
            //   lastname: faker.person.lastName(),
            //   occupation: faker.person.jobTitle(),
            //   contactNo: faker.phone.number(),
            //   relationship: faker.helpers.arrayElement([
            //     "Father",
            //     "Mother",
            //     "Guardian",
            //   ]),
            // },
            createMany: {
              data: [
                {
                  firstname: faker.person.firstName(),
                  lastname: faker.person.lastName(),
                  occupation: faker.person.jobTitle(),
                  contactNo: faker.phone.number(),
                  relationship: "Father",
                },
                {
                  firstname: faker.person.firstName(),
                  lastname: faker.person.lastName(),
                  occupation: faker.person.jobTitle(),
                  contactNo: faker.phone.number(),
                  relationship: "Mother",
                },
              ],
            },
          },
        },
      },
    },
  });

  return user;
};

async function main() {
  await Promise.all(
    departments.map((department) => createDepartment(department))
  );

  console.log("departments created.");

  // await Promise.all(sections.map((section) => createSection(section)));
  await Promise.all(
    Array.from({
      length: 10,
    }).map(() => createSection())
  );

  console.log("sections created.");

  // create STUDENT
  await Promise.all(
    Array.from({
      length: 100,
    }).map(() => createUser("STUDENT"))
  );
  // create ALUMNI
  await Promise.all(
    Array.from({
      length: 100,
    }).map(() => createUser("ALUMNI"))
  );

  // create ADVISER
  await Promise.all(
    Array.from({
      length: 10,
    }).map(() => createUser("ADVISER"))
  );

  // create COORDINATOR
  await Promise.all(
    Array.from({
      length: 10,
    }).map(() => createUser("COORDINATOR"))
  );

  // create PESO
  await Promise.all(
    Array.from({
      length: 10,
    }).map(() => createUser("PESO"))
  );

  await Promise.all(
    Array.from({
      length: 10,
    }).map(() => createUser("BULSU_PARTNER"))
  );

  // create ADMIN
  await createUser("ADMIN");

  console.log("users created.");

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
