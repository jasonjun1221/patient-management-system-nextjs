"use server";

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
  try {
    const newAppointment = await databases.createDocument(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, ID.unique(), appointment);
    return parseStringify(newAppointment);
  } catch (error) {
    console.log(error);
  }
};

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, appointmentId);
    return parseStringify(appointment);
  } catch (error) {
    console.log(error);
  }
};

export const getRecentAppointmentList = async () => {
  try {
    const appointments = await databases.listDocuments(DATABASE_ID!, APPOINTMENT_COLLECTION_ID!, [Query.orderAsc("$createdAt")]);

    const initalCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
      if (appointment.status === "scheduled") {
        acc.scheduledCount++;
      } else if (appointment.status === "pending") {
        acc.pendingCount++;
      } else if (appointment.status === "cancelled") {
        acc.cancelledCount++;
      }
      return acc;
    }, initalCounts);

    const data = {
      totalCount: appointments.total,
      ...counts,
      documents: appointments.documents,
    };

    //  data = {
    //   totalCount: 5,
    //   scheduledCount: 3,
    //   pendingCount: 2,
    //   cancelledCount: 0,
    //   documents: [
    //     {
    //       schedule: "2024-08-11T18:39:26.522+00:00",
    //       reason: "dsadsda",
    //       note: "sdadsadsa",
    //       primaryPhysician: "Leila Cameron",
    //       status: "pending",
    //       userId: "66af2d2b00074f5aa0b5",
    //       cancellationReason: null,
    //       $id: "66b905680007f4e3aab2",
    //       $tenant: "178907",
    //       $createdAt: "2024-08-11T18:39:36.759+00:00",
    //       $updatedAt: "2024-08-11T18:39:36.759+00:00",
    //       $permissions: [],
    //       patient: [Object],
    //       $databaseId: "66adfc2b002b2f9127b6",
    //       $collectionId: "66adfcd200221a66f000",
    //     },
    //   ],
    // };

    return parseStringify(data);
  } catch (error) {
    console.log(error);
  }
};

export const updateAppointment = async (appointment: UpdateAppointmentParams) => {
  try {
    const updatedAppointment = await databases.updateDocument(
      DATABASE_ID!,
      APPOINTMENT_COLLECTION_ID!,
      appointment.appointmentId,
      appointment.appointment,
    );

    if (!updatedAppointment) {
      throw new Error("Appointment not found");
    }

    revalidatePath("/admin"); // Revalidate the admin page after updating the appointment
    return parseStringify(updatedAppointment);
  } catch (error) {
    console.log(error);
  }
};
