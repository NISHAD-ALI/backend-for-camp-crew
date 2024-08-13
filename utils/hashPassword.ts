import bcryptjs from 'bcryptjs'

export const hashPassword = async (password: string)=> {
    try {
        const hashedPassword = await bcryptjs.hash(password, 10)
        return hashedPassword
    } catch (error) {
        console.error('Error while hashing Password', error)
        throw error
    }
}
export const comparePassword = async (password: string, hashed: string)=> {
    try {
        console.log(password,hashed)
        const compared = await bcryptjs.compare(password, hashed)
        return compared
    } catch (error) {
        console.error('Error while comparing:', error)
        throw error
    }
}