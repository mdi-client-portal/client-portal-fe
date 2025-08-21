// import { useForm } from "react-hook-form";
import Image from "next/image";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm();
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-1/4">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center justify-center">
            <Image
              src={"/logo-default.png"}
              alt="/"
              width={"50"}
              height={"50"}
            />
            <p className="font-montserrat text-lg ">
              Please sign in your account
            </p>
          </div>
          <Card className="w-">
            <CardHeader>
              <CardTitle className="text-lg text-center">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <form action="">
                <div className="flex flex-col">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="youremail@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="********"
                      required
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
