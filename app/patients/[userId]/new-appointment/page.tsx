import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import * as Sentry from "@sentry/nextjs";

// http://localhost:3000/patients/66af2d2b00074f5aa0b5/new-appointment

export default async function NewAppointment({ params: { userId } }: SearchParamProps) {
  const patient = await getPatient(userId);

  Sentry.metrics.set("user_view_new-appointment", patient.name);

  return (
    <div className="flex h-screen max-h-screen overflow-hidden">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image src="/assets/icons/logo-full.svg" alt="patient" width={1000} height={1000} className="mb-12 h-10 w-fit" />

          <AppointmentForm type="create" userId={userId} patientId={patient?.$id} />

          <p className="copyright my-12 mt-10">&copy; 2024 CarePlus</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        alt="appointment"
        width={1000}
        height={1000}
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
