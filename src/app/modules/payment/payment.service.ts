import prisma from "../../utils/prismaClient.js";



const createPayment = async (userId: string, payload: any) => {
  return payload
};

const getAllPayment = async () => {
  const result = await prisma.payment.findMany({});
  return result;
};

const getPaymentById = async (id: string) => {
  const result = await prisma.payment.findUnique({
    where: { id },
  });
  return result;
};

const updatePayment = async (id: string, payload: any) => {
  const result = await prisma.payment.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deletePayment = async (id: string) => {
  await prisma.payment.delete({
    where: { id },
  });
  return { message: "Payment deleted successfully" };
};

export const PaymentServices = {
  createPayment,
  getAllPayment,
  getPaymentById,
  updatePayment,
  deletePayment,
};
