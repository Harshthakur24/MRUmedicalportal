import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const defaultPassword = 'admin@123';

const defaultAdmins = [
    {
        name: 'Dean Academics',
        email: 'dean@admin.mru.edu.in',
        role: Role.DEAN_ACADEMICS,
        department: null,
        emailVerified: new Date()
    },
    {
        name: 'HOD CSE',
        email: 'hod.cse@admin.mru.edu.in',
        role: Role.HOD,
        department: 'CSE' as const,
        emailVerified: new Date()
    },
    {
        name: 'Program Coordinator CSE',
        email: 'pc.cse@admin.mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CSE' as const,
        emailVerified: new Date()
    }
];

async function main() {
    console.log('Seeding admin users...');
    const hashedPassword = await hash(defaultPassword, 12);

    for (const admin of defaultAdmins) {
        const existingUser = await prisma.user.findUnique({
            where: { email: admin.email }
        });

        if (!existingUser) {
            // Create user first
            const user = await prisma.user.create({
                data: {
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                    department: admin.department,
                    emailVerified: admin.emailVerified,
                }
            });

            // Then create the account with credentials
            await prisma.account.create({
                data: {
                    userId: user.id,
                    type: 'credentials',
                    provider: 'credentials',
                    providerAccountId: admin.email,
                    access_token: hashedPassword
                }
            });

            console.log(`Created admin user: ${admin.email}`);
        } else {
            // Update existing account's password if needed
            const existingAccount = await prisma.account.findFirst({
                where: {
                    userId: existingUser.id,
                    provider: 'credentials'
                }
            });

            if (!existingAccount) {
                await prisma.account.create({
                    data: {
                        userId: existingUser.id,
                        type: 'credentials',
                        provider: 'credentials',
                        providerAccountId: admin.email,
                        access_token: hashedPassword
                    }
                });
                console.log(`Added credentials for existing admin: ${admin.email}`);
            }

            console.log(`Admin user already exists: ${admin.email}`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 