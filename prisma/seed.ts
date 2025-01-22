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
        await prisma.user.upsert({
            where: { email: admin.email },
            update: {
                password: hashedPassword
            },
            create: {
                name: admin.name,
                email: admin.email,
                role: admin.role,
                department: admin.department,
                emailVerified: admin.emailVerified,
                password: hashedPassword
            }
        });
        console.log(`Upserted admin user: ${admin.email}`);
    }
    
    console.log('Database has been seeded');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 