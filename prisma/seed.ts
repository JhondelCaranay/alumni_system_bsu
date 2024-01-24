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
      courseYear: 4,
    },
    select: {
      id: true,
    },
  });
};

const createEvent = async () => {
  const admin = await prisma.user.findMany({
    where: {
      role: "ADMIN",
    },
    select: {
      id: true,
    },
  });

  const evantStart = faker.date.soon({ days: 30 });

  const event = await prisma.event.create({
    data: {
      title: faker.lorem.words(),
      description: faker.lorem.paragraph(),
      dateStart: evantStart,
      dateEnd: evantStart,
      allDay: faker.datatype.boolean(),
      userId: faker.helpers.arrayElement(admin).id,
    },
    select: {
      id: true,
    },
  });
};

const createSection = async ({
  name,
  departmentId,
  course_year,
  school_year,
}: {
  name: string;
  departmentId: string;
  course_year: number;
  school_year: string;
}) => {
  return await prisma.section.create({
    data: {
      name: name,
      course_year: course_year,
      school_year: school_year,
      department: {
        connect: {
          id: departmentId,
        },
      },
    },
  });
};

const getFullEmail = (firstName: string, lastName: string) => {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${faker.number.int(
    {
      min: 0,
      max: 99,
    }
  )}@bulsu.edu.ph`;
};

// create user n times
const createUser = async ({
  role,
  schoolYear,
  yearEnrolled,
  yearGraduated,
}: {
  role: string;
  schoolYear?: number;
  yearEnrolled?: string;
  yearGraduated?: string;
}) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const full_email = getFullEmail(firstName, lastName);

  const sectionsIds = await prisma.section.findMany({
    select: {
      id: true,
    },
  });

  const departmentIds = await prisma.department.findMany({
    select: {
      id: true,
    },
  });

  const guardians = ["Father", "Mother"].map((relationship) => ({
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    occupation: faker.person.jobTitle(),
    contactNo: faker.phone.number(),
    relationship,
  }));

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
          id: faker.helpers.arrayElement(sectionsIds).id,
        },
      },
      department: {
        connect: {
          id: faker.helpers.arrayElement(departmentIds).id,
        },
      },
      profile: {
        create: {
          isEmployed: faker.datatype.boolean(),
          studentNumber: faker.number.int({
            min: 2019000000,
            max: 2022999999,
          }),
          schoolYear: schoolYear,
          yearEnrolled: yearEnrolled,
          yearGraduated: yearGraduated,
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
            createMany: {
              data: guardians,
            },
          },
        },
      },
    },
  });

  return user;
};

async function main() {
  const departmentIds = await Promise.all(
    departments.map((department) => createDepartment(department))
  );

  // create section per department
  await Promise.all(
    departmentIds.map((departmentId) =>
      Promise.all(
        sections.map((section) =>
          createSection({
            name: section,
            departmentId: departmentId.id,
            course_year: 1,
            school_year: "2023-2027",
          })
        )
      )
    )
  );

  console.log("sections created.");

  // create STUDENT
  // await Promise.all(
  //   Array.from({
  //     length: 900,
  //   }).map(() =>
  //     createUser({
  //       role: "STUDENT",
  //       schoolYear: 1,
  //       yearEnrolled: new Date("2023-01-01T00:00:00.000Z").toISOString(),
  //     })
  //   )
  // );

  // create ALUMNI
  // await Promise.all(
  //   Array.from({
  //     length: 500,
  //   }).map(() =>
  //     createUser({
  //       role: "ALUMNI",
  //       schoolYear: 4,
  //       //  Expected ISO-8601 DateTime year 2019
  //       yearEnrolled: new Date("2019-01-01T00:00:00.000Z").toISOString(),
  //       yearGraduated: new Date("2023-01-01T00:00:00.000Z").toISOString(),
  //     })
  //   )
  // );

  // const years = [
  //   2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012,
  //   2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000,
  // ];
  // Get the current year
  const currentYear = new Date().getFullYear();

  // Generate an array with a 16-year span starting from the current year
  const years = Array.from({ length: 25 }, (_, index) => currentYear - index);

  // create STUDENT
  await Promise.all(
    years.map(
      async (year) =>
        await Promise.all(
          Array.from({
            length: faker.number.int({ min: 50, max: 100 }),
          }).map(() =>
            createUser({
              role: "STUDENT",
              schoolYear: faker.number.int({ min: 1, max: 4 }),
              yearEnrolled: new Date(year, 0, 1).toISOString(),
            })
          )
        )
    )
  );

  // create ALUMNI
  await Promise.all(
    years.map(
      async (year) =>
        await Promise.all(
          Array.from({
            length: faker.number.int({ min: 50, max: 100 }),
          }).map(() =>
            createUser({
              role: "ALUMNI",
              schoolYear: 4,
              yearEnrolled: new Date(year - 4, 0, 1).toISOString(),
              yearGraduated: new Date(year, 0, 1).toISOString(),
            })
          )
        )
    )
  );

  // create ADVISER
  await Promise.all(
    Array.from({
      length: 10,
    }).map(() => createUser({ role: "ADVISER" }))
  );

  // create COORDINATOR
  await Promise.all(
    Array.from({
      length: 10,
    }).map(() => createUser({ role: "COORDINATOR" }))
  );

  // create PESO
  await Promise.all(
    Array.from({
      length: 10,
    }).map(() => createUser({ role: "PESO" }))
  );

  await Promise.all(
    Array.from({
      length: 10,
    }).map(() => createUser({ role: "BULSU_PARTNER" }))
  );

  // create ADMIN
  await createUser({ role: "ADMIN" });

  console.log("users created.");

  // create event
  await Promise.all(
    Array.from({
      length: 15,
    }).map(() => createEvent())
  );

  console.log("events created.");

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
