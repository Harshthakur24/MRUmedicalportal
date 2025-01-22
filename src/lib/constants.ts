interface EmailInfo {
  role: string;
  name: string;
  department?: string;
}

// Arrays of Program Coordinator emails for each department
const PROGRAM_COORDINATOR_EMAILS = {
  CSE: [
    "pc.cse@admin.mru.edu.in",
    // Add more as needed
  ],
  ECE: [
    "pc.ece@admin.mru.edu.in",
    // Add more as needed
  ],
};

// Fixed role emails
const FIXED_ROLE_EMAILS: Record<string, EmailInfo> = {
  "dean@admin.mru.edu.in": {
    role: "DEAN_ACADEMICS",
    name: "Dean Academics",
  },
  "hod.cse@admin.mru.edu.in": {
    role: "HOD",
    name: "HOD CSE",
    department: "CSE",
  },
  "hod.ece@admin.mru.edu.in": {
    role: "HOD",
    name: "HOD ECE",
    department: "ECE",
  },
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
        role: "PROGRAM_COORDINATOR",
        name: `Program Coordinator ${dept}`,
        department: dept,
      };
    }
  }

  return null;
}
