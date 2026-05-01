import type { IContact } from "./contact.interface.ts";
import prisma from "../../utils/prismaClient.ts";

const createContact = async (payload: IContact) => {
  const result = await prisma.contact.create({
    data: payload,
  });
  return result;
};

const getAllContacts = async () => {
  const result = await prisma.contact.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          profile: true,
        },
      },
    },
  });
  return result;
};

const getContactById = async (id: string) => {
  const result = await prisma.contact.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
  return result;
};

export const ContactService = {
  createContact,
  getAllContacts,
  getContactById,
};
