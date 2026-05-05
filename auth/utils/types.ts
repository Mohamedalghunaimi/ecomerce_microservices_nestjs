/* eslint-disable prettier/prettier */

            
export type Role = "USER" | "ADMIN"

export type UserPayload = {
    id: string,
    role: Role
}