import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const defaultPassword = 'admin@123';

const defaultAdmins = [
    {
        name: 'Admin',
        email: 'admin@mru.edu.in',
        role: Role.ADMIN,
        department: null,
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Prof. (Dr.) Dipali Bansal',
        email: 'deanengg@mru.edu.in',
        role: Role.DEAN_ACADEMICS,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Prof. (Dr.) Sachin Lakra',
        email: 'sachin@mru.edu.in',
        role: Role.DEAN_ACADEMICS,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Prof. (Dr.) Manpreet Kaur',
        email: 'hodcst@mru.edu.in',
        role: Role.HOD,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Ms. Chandni Magoo',
        email: 'chandnimagoo@mru.edu.in',
        role: Role.HOD,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Prof. (Dr.) Jyoti Pruthi',
        email: 'jyoti@mru.edu.in',
        role: Role.HOD,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Prof. (Dr.) Parneeta Dhaliwal',
        email: 'parneeta.cst@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Prof. (Dr.) Prinima Gupta',
        email: 'prinima@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Prof. (Dr.) Mrinal Pandey',
        email: 'mrinal@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Dr. Abhishek Saxena',
        email: 'abhisheksaxena@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Mr. Agha Imran Hussain',
        email: 'agha@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Mr. Ankur Kr. Aggarwal',
        email: 'ankur@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Mr. Anup Singh',
        email: 'anup@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Ms. Anu Priya Sharma',
        email: 'anupriya@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Dr. Deepti Thakral',
        email: 'deeptithakral@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Ms. Deepanshi Gupta',
        email: 'deepanshi@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Ms. Esha Khanna',
        email: 'eshakhanna@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Dr. K. Deepa',
        email: 'kdeepa@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Ms. Gunjan Chandwani',
        email: 'gunjan@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Ms. Jyoti Nanwal',
        email: 'jyotinanwal@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Dr. Mamta Arora',
        email: 'mamta@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Dr. Manoj Kumar',
        email: 'manoj@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Dr. Meena Chaudhary',
        email: 'meena@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Dr. Monika Garg',
        email: 'monikagarg@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Mr. Narender Gautam',
        email: 'narender@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Dr. Neelu Chaudhary',
        email: 'neelu@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Dr. Nitika Munjal',
        email: 'nitika@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Mr. Ram Chatterjee',
        email: 'ram@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Dr. Ranjna Jain',
        email: 'ranjnajain@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Dr. Sanjay Singh',
        email: 'sanjaysingh@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Dr. Shalu',
        email: 'shalu@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Ms. Tamanna Sachdeva',
        email: 'tamannasachdeva@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Dr. Urmila Pilania',
        email: 'urmila@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Dr. Arnika',
        email: 'arnika.cst@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Ms. Pooja Ahuja',
        email: 'poojaahuja.cst@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Ms. Ashima Garg',
        email: 'ashimagarg.cst@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Dr. Awwab Mohammad',
        email: 'awwabmohammad@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Dr. Ganga Sharma',
        email: 'gangasharma@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    },
    {
        name: 'Ms. Babita Yadav',
        email: 'babitayadav@mru.edu.in',
        role: Role.PROGRAM_COORDINATOR,
        department: 'CST',
        emailVerified: new Date(),
        school: 'CST',
        year: '',
        rollNumber: '',
        className: ''
    }
];

async function main() {
    console.log('Starting seeding...');
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    for (const admin of defaultAdmins) {
        const user = await prisma.user.upsert({
            where: { email: admin.email },
            update: {},
            create: {
                ...admin,
                password: hashedPassword,
                year: '',
                rollNumber: '',
                className: ''
            },
        });
        console.log(`Created user with email: ${user.email}`);
    }
    console.log('Seeding finished.');
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