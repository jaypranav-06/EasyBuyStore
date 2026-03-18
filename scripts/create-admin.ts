import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log(' Creating admin account...');

  const adminEmail = 'admin@easybuystore.com';
  const adminPassword = 'Admin@123'; // You should change this after first login
  const adminName = 'Admin User';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('  Admin account already exists!');
    console.log(' Email:', adminEmail);
    console.log(' Name:', `${existingAdmin.first_name} ${existingAdmin.last_name}`);
    return;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create admin user
  const [firstName, ...lastNameParts] = adminName.split(' ');
  const admin = await prisma.user.create({
    data: {
      first_name: firstName,
      last_name: lastNameParts.join(' ') || 'User',
      email: adminEmail,
      password_hash: hashedPassword,
      phone: '+1-555-ADMIN',
      address: '123 Admin Street',
      city: 'Admin City',
      state: 'AC',
      zip_code: '12345',
      country: 'USA',
    },
  });

  console.log('\n Admin account created successfully!');
  console.log('\n Admin Credentials:');
  console.log('');
  console.log(' Email:    ', adminEmail);
  console.log(' Password: ', adminPassword);
  console.log(' Name:     ', `${admin.first_name} ${admin.last_name}`);
  console.log('');
  console.log('\n  IMPORTANT: Please change the password after first login!');
  console.log('\n Login at: http://localhost:3000/signin');
}

main()
  .catch((e) => {
    console.error(' Error creating admin account:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
