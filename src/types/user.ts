export interface User {
    _id: string
    fullName: string,
    email: string,
}

export interface UserTokenData extends Omit<User, "_id"> {
    id: string
}