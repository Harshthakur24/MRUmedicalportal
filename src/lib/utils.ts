import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export function calculateTimeDifference(startDate: string | Date, endDate: string | Date) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffInMilliseconds = end.getTime() - start.getTime();
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays === 1 ? "" : "s"}${
            diffInHours > 0 ? ` ${diffInHours} hour${diffInHours === 1 ? "" : "s"}` : ""
        }`;
    }

    if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours === 1 ? "" : "s"}`;
    }

    const diffInMinutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"}`;
}

export function getEmailRole(email: string) {
    const domain = email.split('@')[1];
    if (domain !== 'mru.edu.in') return null;

    const prefix = email.split('@')[0];
    const parts = prefix.split('.');

    if (parts.length !== 2) return null;

    const [role, department] = parts;

    if (role === 'dean') {
        return {
            role: 'DEAN_ACADEMICS',
            department: department.toUpperCase(),
        };
    }

    if (role === 'hod') {
        return {
            role: 'HOD',
            department: department.toUpperCase(),
        };
    }

    if (role === 'pc') {
        return {
            role: 'PROGRAM_COORDINATOR',
            department: department.toUpperCase(),
        };
    }

    return null;
} 