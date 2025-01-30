import { PrismaClient, Role } from '@prisma/client';
import pkg from 'bcryptjs';
const { hash } = pkg;

const prisma = new PrismaClient();

const defaultPassword = 'admin@123';

const defaultAdmins = [
    {
        name: 'Admin',
        email: 'admin@mru.edu.in',
        role: Role.ADMIN,
        department: null,
        emailVerified: new Date()
    },
    {
        name: 'Prof. (Dr.) Dipali Bansal',
        email: 'deanengg@mru.edu.in',
        role: Role.DEAN_ACADEMICS,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Prof. (Dr.) Sachin Lakra',
        email: 'sachin@mru.edu.in',
        role: Role.DEAN_ACADEMICS,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Prof. (Dr.) Manpreet Kaur',
        email: 'hodcst@mru.edu.in',
        role: Role.HOD,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Ms. Chandni Magoo',
        email: 'chandnimagoo@mru.edu.in',
        role: Role.HOD,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Prof. (Dr.) Jyoti Pruthi',
        email: 'jyoti@mru.edu.in',
        role: Role.HOD,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Prof. (Dr.) Parneeta Dhaliwal',
        email: 'parneeta.cst@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Prof. (Dr.) Prinima Gupta',
        email: 'prinima@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Prof. (Dr.) Mrinal Pandey',
        email: 'mrinal@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Dr. Abhishek Saxena',
        email: 'abhisheksaxena@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Mr. Agha Imran Hussain',
        email: 'agha@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Mr. Ankur Kr. Aggarwal',
        email: 'ankur@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Mr. Anup Singh',
        email: 'anup@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Ms. Anu Priya Sharma',
        email: 'anupriya@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Dr. Deepti Thakral',
        email: 'deeptithakral@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Ms. Deepanshi Gupta',
        email: 'deepanshi@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Ms. Esha Khanna',
        email: 'eshakhanna@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Dr. K. Deepa',
        email: 'kdeepa@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Ms. Gunjan Chandwani',
        email: 'gunjan@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Ms. Jyoti Nanwal',
        email: 'jyotinanwal@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Dr. Mamta Arora',
        email: 'mamta@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Dr. Manoj Kumar',
        email: 'manoj@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Dr. Meena Chaudhary',
        email: 'meena@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Dr. Monika Garg',
        email: 'monikagarg@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Mr. Narender Gautam',
        email: 'narender@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Dr. Neelu Chaudhary',
        email: 'neelu@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Dr. Nitika Munjal',
        email: 'nitika@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Mr. Ram Chatterjee',
        email: 'ram@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Dr. Ranjna Jain',
        email: 'ranjnajain@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Dr. Sanjay Singh',
        email: 'sanjaysingh@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Dr. Shalu',
        email: 'shalu@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Ms. Tamanna Sachdeva',
        email: 'tamannasachdeva@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Dr. Urmila Pilania',
        email: 'urmila@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Dr. Arnika',
        email: 'arnika.cst@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Ms. Pooja Ahuja',
        email: 'poojaahuja.cst@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Ms. Ashima Garg',
        email: 'ashimagarg.cst@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Dr. Awwab Mohammad',
        email: 'awwabmohammad@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Dr. Ganga Sharma',
        email: 'gangasharma@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    },
    {
        name: 'Ms. Babita Yadav',
        email: 'babitayadav@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date()
    }
];

async function main() {
    console.log('Seeding admin users...');
    const hashedPassword = await hash(defaultPassword, 12);

    for (const admin of defaultAdmins) {
        await prisma.user.upsert({
            where: { email: admin.email },
            update: {},
            create: {
                name: admin.name,
                email: admin.email,
                role: admin.role,
                department: admin.department,
                emailVerified: admin.emailVerified,
                accounts: {
                    create: {
                        type: 'credentials',
                        provider: 'credentials',
                        providerAccountId: admin.email,
                        access_token: hashedPassword
                    }
                }
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