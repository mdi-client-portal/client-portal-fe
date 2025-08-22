import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import LoginForm from "@/components/common/forms/loginForm";

export default function Login() {
  return (
    <main className="h-screen flex items-center justify-center">
      <div className="w-full lg:w-1/4 px-4 lg:px-0">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center justify-center">
            <Image
              src={"/logo-default.png"}
              alt="/"
              width={"50"}
              height={"50"}
            />
            <p className="font-montserrat text-lg font-bold">
              Mobile Data Indonesia
            </p>
            <p className="font-montserrat text-lg ">Client Portal</p>
          </div>
          <Card className="">
            <CardHeader>
              <CardTitle className="text-lg text-center">
                Login to your account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
