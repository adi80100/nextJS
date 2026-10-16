"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { useForm, type ControllerRenderProps } from "react-hook-form";
import * as z from "zod";

import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";



import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/app/schemas/signInSchema";
import { signIn } from "next-auth/react";

const Page = () => {
  console.log("inside sign in page")
  const router = useRouter();

  // zod implemetntain
  //  needs an  resolver and its resolver requires signupSchema
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {

      identifier: "",
      password: "",
    },
  });

  console.log("outside on submit")
  // this onsubmit or submit handler always take those data
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
  console.log("inside sign on submit")
   try {
    const result =  await signIn('credentials',{
       redirect:false,
       identifier:data.identifier,
       password:data.password
     })
     console.log("result :",result)
 
     if(result?.error){
       toast.add({
         title:"Login failed",
         description:"Incorrect username or password"
       })
     }
     if(result?.url){
       router.replace("/dashboard")
     }
   } catch (error) {
    console.log(error)
   }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit,(errors) => {
      console.log("Validation errors:", errors);
    })} className="space-y-6" >
           
            <FormField
              name="identifier"
              control={form.control}

              render={({ field }: { field: ControllerRenderProps<z.infer<typeof signInSchema>, "identifier"> }) => (
                <FormItem>
                  <FormLabel>Email/Usernmae</FormLabel>
                  <FormControl>
                    {/* we dont used onChange becuae that thoes value direclty when the btn is clicked */}
                    <Input type="text" placeholder="Enter email/usernmae" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}

              render={({ field }: { field: ControllerRenderProps<z.infer<typeof signInSchema>, "password"> }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                      
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" >
              Signin
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            New member?{" "}
            <Link
              href="/sign-up"
              className="text-blue-60 hover:text-blue-800"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;




