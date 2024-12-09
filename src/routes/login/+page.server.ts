import type { Actions } from "@sveltejs/kit";

interface ReturnObject {
    success: boolean;
    errors: string [];
}
export const actions = {
    default: async ({request}) => {
        const formData = await request.formData();

        const email = formData.get("email") as string
        const password = formData.get("password") as string

        const returnObject: ReturnObject = {
            success: true,
            errors: [],
        }

        if(!email.length){
            returnObject.errors.push("You must enter an email")
        }

        if(!password.length){
            returnObject.errors.push("You must enter a password")
        }

        if(returnObject.errors.length){
            returnObject.success = false;
            return returnObject
        }

        

        return returnObject
    }
}