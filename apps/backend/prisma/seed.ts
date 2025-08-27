// prisma/seed.ts
import { EmployeeStatus, Gender, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Generate 100 fake employees
  const employees = Array.from({ length: 100 }).map((_, i) => ({
    gender: faker.person.sex() === 'male' ? Gender.MALE : Gender.FEMALE,
    status: EmployeeStatus.ACTIVE,
    employeeNumber: `HR-MD-${String(i + 1).padStart(3, '0')}`, // HR-MD-001, HR-MD-002, ...
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    birthDate: faker.date.birthdate({ min: 20, max: 50, mode: 'age' }),
    phoneNumber: faker.phone.number(),
    companyEmail: faker.internet.email(),
    address: faker.location.streetAddress(),
    dateOfJoining: faker.date.past({ years: 5 }),
    branch: faker.company.name(),
    department: faker.commerce.department(),
  }));

  await prisma.employeeInformation.createMany({
    data: employees,
    skipDuplicates: true,
  });

  console.log(`🌱 Seeded ${employees.length} employees`);
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
