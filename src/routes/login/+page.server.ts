import type { Actions } from "@sveltejs/kit";

interface ReturnObject {
    success: boolean;
    errors: string [];
}
export const actions = {
    default: async ({request}) => {
        const formData = await request.formData();

        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const passwordConfirmation = formData.get("passwordConfirmation") as string

        const returnObject: ReturnObject = {
            success: true,
            errors: [],
        }

        if(name.length < 3){
            returnObject.errors.push("Name should be longer than 3 characters")
        }

        if(!email.length){
            returnObject.errors.push("You must enter an email")
        }

        if(!password.length){
            returnObject.errors.push("You must enter a password")
        }

        if(password !== passwordConfirmation ){
            returnObject.errors.push("Passwords do not match")
        }

        if(returnObject.errors.length){
            returnObject.success = false;
            return returnObject
        }

        return returnObject
    }
}