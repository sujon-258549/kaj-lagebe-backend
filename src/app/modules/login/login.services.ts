import prisma from "../../utils/prismaClient.ts";

const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  return user;
};

export const AuthServices = { loginUser };
