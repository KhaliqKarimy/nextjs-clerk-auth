"use client";

import React, { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
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

const SignUpPage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (!email || !name || !password) {
      return toast.warning("Please fill in all fields!");
    }
    setIsLoading(true);

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerified(true);

      await signUp.update({
        firstName: name.split("")[0],
        lastName: name.split("")[1],
      });
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      switch (error.errors[0]?.code) {
        case "form_identifier_exists":
          toast.error("This email is already  registered. Please sign in.");

        case "form_password_pwned":
          toast.error(
            "This password is too common. Please choose a strong password."
          );

        case "form_param_format_invalid":
          toast.error(
            "Invalid email address. Please enter a valid email addrss ."
          );

        case "form_password_length_too_short":
          toast.error(
            "Password is too short. Please choose a longer password."
          );

        default:
          toast.error("An error accurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (!code) {
      return toast.warning("Verification code is required");
    }
    setIsVerified(true);

    try {
      const complateSignUp = await signUp?.attemptEmailAddressVerification({
        code,
      });

      if (complateSignUp?.status === "complete") {
        await setActive({ session: complateSignUp.createdSessionId });
        router.push("/auth-callback");
      } else {
        console.error(JSON.stringify(complateSignUp, null, 2));
        toast.error("Invalid verfication code ");
      }
    } catch (error: any) {
      console.error("Error", JSON.stringify(error, null, 2));
      toast.error("An error occurred . Please try again ");
    } finally {
      setIsVerified(false);
    }
  };

  return verified ? (
    <div className="flex flex-col  items-center  justify-center  hc gap-y-6 max-w-sm mx-auto text-center">
      <div className="h-full">
        <h1 className="text-2xl  text-center  font-bold">
          {" "}
          Please check your email{" "}
        </h1>
        <p className="text-sm text-muted-foreground mt-2 ">
          We&apos;ve sent a verfication code to {email}
        </p>
      </div>

      <form onSubmit={handleVerify} className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Verification Code</Label>
          <InputOTP
            id="code"
            maxLength={6}
            value={code}
            disabled={isVerified}
            onChange={(e) => setCode(e)}
            className="pt-2"
          >
            <InputOTPGroup className="justify-center w-full">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          size="lg"
          type="submit"
          disabled={isVerified}
          className="w-full"
        >
          {isVerified ? (
            <LoaderIcon className="w-5 h-5 animate-spin" />
          ) : (
            "Verify"
          )}
        </Button>
        <div className="flex ">
          <p className="text-sm text-muted-foreground text-center w-full ">
            Back to sign up
            <Button
              size="sm"
              variant="link"
              type="button"
              disabled={isVerified}
              onClick={() => setVerified(false)}
            >
              Sign up
            </Button>
          </p>
        </div>
      </form>
    </div>
  ) : (
    <div className="flex flex-col  items-center  justify-center  hc gap-y-6">
      <h1 className="text-2xl  text-center  font-bold"> Sign Up </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            disabled={isLoading}
            value={name}
            onChange={(e) => setName(e.target.value)}
            name="name"
            placeholder="Enter your name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address </Label>
          <Input
            id="email"
            type="email"
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            placeholder="Enter your email"
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

        <Button size="lg" type="submit" disabled={isLoading} className="w-full">
          {
            isLoading ? (
              <LoaderIcon  className="w-5 h-5 animate-spin" />
            ): "Continue"
          }
        </Button>
        
        <div className="flex ">
          <p className="text-sm text-muted-foreground text-center w-full ">
            {" "}
            Already a memeber?
            <Link href="/sign-in" className="text-foreground">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;
