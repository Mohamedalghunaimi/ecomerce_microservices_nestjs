/* eslint-disable */

export interface UserData {
    authId: string;
    firstName: string;
    lastName: string;
    phone: string;

}

export interface UpdateUserData {
    firstName?: string;
    lastName?: string;
    phone?: string;
}