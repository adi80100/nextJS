import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions)


// we have to export it like this as it does not provide access to any keyword or awords
// we have to use this GET POST 
export {handler as GET,handler as POST}