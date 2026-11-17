export interface User {
    id: string;
    email: string;
    isActive: boolean;
    roles: ["ADMIN", "USER"];
}