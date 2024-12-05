'use client'
import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import Link from "next/link";

import { Eye, EyeOff, LoaderIcon, ReceiptRussianRuble } from "lucide-react";

const SignInPage = () => {

  const { isLoaded, signIn, setActive } = useSignIn();

  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);


  const handleSubmit = async (e: React.FormEvent) =>{
       e.preventDefault();
       if(!isLoaded) return ;
       if(!email || !password){
        return toast.warning("Please fill in all fieleds")
       }
       setIsLoading(true);

       try {

         const signInAttemp = await signIn.create({
          identifier:email,
          password,
          redirectUrl:"/auth-callback",

         });

         if(signInAttemp.status === "complete"){
          await setActive({session:signInAttemp.createdSessionId});
          router.push("/auth-callback")
         }else{
          console.error(JSON.stringify(signInAttemp, null, 2));
          toast.error("Invalid email or password")
         }
        
       } catch (error: any) {

        console.error(JSON.stringify(error, null, 2));


        switch(error.errors[0]?.code){
          case"form_identifier_no_found":
          toast.error("This email is not registred. Please sign up first.");

          case"form_password_incorrect":
          toast.error("Incorrect password. Please try again.");

          case"too_many_attempts":
          toast.error("Too many attempts.please try again later");
          default:
            toast.error("An error occurred. Please try agian.")
        }
        
       }finally{
        setIsLoading(false);
       }
  }




  return (
    <div className="flex flex-col items-center justify-center hc gap-y-6">
       <h1 className="text-2xl font-bold">
        Sign In
       </h1>

       <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4" >

              <div className="space-y-2">
                <Label htmlFor="email"> Email address </Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>


              <div className="space-y-2">
          <Label htmlFor="password"> Password </Label>
          <div className="relative w-full ">
            <Input
              id="password"
              type={showPassword ? "text": "password"}
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              placeholder="Enter your password"
            />
            <Button
              type="button"
              size="icon"
              disabled={isLoading}
              onClick={() => setShowPassword(!showPassword)}
              variant="ghost"
              className="absolute top-[0.5px] right-1"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
                <Button
                  size="icon"
                  type="submit"
                  disabled={isLoading}
                  className="w-full"
                >

                  {isLoading ? (
                    <LoaderIcon  className="w-5 h-5 animate-spin" />
                  ) : "Sign In"}

                </Button>
                <div className="flex">

                   <p className="text-sm text-muted-foreground text-center  w-full ">Don&apos;t have an accoutn ?
                    
                    <Link href='/sign-up' className="text-foreground">Sign up</Link> </p>

                </div>
       </form>

    </div>
  )
}

export default SignInPage