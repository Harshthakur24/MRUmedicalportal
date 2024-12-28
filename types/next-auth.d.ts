import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string
    role: string
    rollNumber?: string
  }
  
  interface Session {
    user: User
  }
} 