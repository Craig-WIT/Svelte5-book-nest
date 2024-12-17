import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({request}) => {
    const {base64String} = await request.json();

    console.log("Base64:" + base64String)

    return json({success: true})
}