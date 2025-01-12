interface EmailInfo {
    role: string;
    name: string;
    department?: string;
}

// Arrays of Program Coordinator emails for each department
const PROGRAM_COORDINATOR_EMAILS = {
    CSE: [
        'pc1.cse@mru.edu.in',
        'pc2.cse@mru.edu.in',
        'thakur2004harsh@gmail.com',
        // Add more as needed
    ],
    ECE: [
        'pc1.ece@mru.edu.in',
        'pc2.ece@mru.edu.in',
        'pc3.ece@mru.edu.in',
        // Add more as needed
    ]
};

// Fixed role emails
const FIXED_ROLE_EMAILS: Record<string, EmailInfo> = {
    'dean@mru.edu.in': {
        role: 'DEAN_ACADEMICS',
        name: 'Dean Academics',
    },
    'hod.cse@mru.edu.in': {
        role: 'HOD',
        name: 'HOD CSE',
        department: 'CSE'
    },
    
    'thakur2004harsh@gmail.com' : {
        role: 'HOD',
        name: 'HOD ECE',
        department: 'ECE'
    }
};

export function getEmailRole(email: string): EmailInfo | null {
    const lowerEmail = email.toLowerCase();
    
    // Check fixed role emails first
    if (lowerEmail in FIXED_ROLE_EMAILS) {
        return FIXED_ROLE_EMAILS[lowerEmail];
    }
    
    // Check program coordinator emails
    for (const [dept, emails] of Object.entries(PROGRAM_COORDINATOR_EMAILS)) {
        if (emails.includes(lowerEmail)) {
            return {
                role: 'PROGRAM_COORDINATOR',
                name: `Program Coordinator ${dept}`,
                department: dept
            };
        }
    }
    
    return null;
} 