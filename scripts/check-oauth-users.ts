import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAndDeleteOAuthUsers() {
  try {
    console.log('🔍 Checking for Google OAuth users...\n');

    // Find all users with empty password_hash (OAuth users)
    const oauthUsers = await prisma.user.findMany({
      where: {
        password_hash: '',
      },
      select: {
        user_id: true,
        email: true,
        first_name: true,
        last_name: true,
        created_at: true,
      },
    });

    if (oauthUsers.length === 0) {
      console.log('✅ No Google OAuth users found in the database.');
      return;
    }

    console.log(`📋 Found ${oauthUsers.length} Google OAuth user(s):\n`);
    oauthUsers.forEach((user, index) => {
      console.log(`${index + 1}. User ID: ${user.user_id}`);
      console.log(`   Name: ${user.first_name} ${user.last_name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Created: ${user.created_at}\n`);
    });

    // Delete all OAuth users
    const deleteResult = await prisma.user.deleteMany({
      where: {
        password_hash: '',
      },
    });

    console.log(`🗑️  Deleted ${deleteResult.count} Google OAuth user(s).\n`);
    console.log('✅ All Google OAuth users have been removed from the database.');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndDeleteOAuthUsers();
