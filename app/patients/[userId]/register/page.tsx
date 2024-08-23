import RegisterForm from "@/components/forms/RegisterForm";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";
import React from "react";
import * as Sentry from "@sentry/nextjs";

// http://localhost:3000/patients/66af2d2b00074f5aa0b5/register

export default async function Register({ params: { userId } }: SearchParamProps) {
  const user = await getUser(userId);

  Sentry.metrics.set("user_view_register", user.name);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image src="/assets/icons/logo-full.svg" alt="patient" width={1000} height={1000} className="mb-12 h-10 w-fit" />

          <RegisterForm user={user} />

          <p className="copyright py-12">&copy; 2024 CarePlus</p>
        </div>
      </section>

      <Image src="/assets/images/register-img.png" alt="patient" width={1000} height={1000} className="side-img max-w-[390px]" />
    </div>
  );
}
