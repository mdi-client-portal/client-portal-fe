import { useForm } from "react-hook-form";
import Image from "next/image";
export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <main className="min-h-screen">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={"/logo-default.png"}
            alt="/"
            width={"100"}
            height={"100"}
          />
          <p className="font-montserrat">Please sign in your account</p>
        </div>
        <div>form section</div>
      </div>
    </main>
  );
}
