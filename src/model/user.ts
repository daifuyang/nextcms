import prisma from "../utils/prisma";

export interface ICreateUserParams {
  loginName: string;
  createId: number;
  creator: string;
  updateId: number;
  updater: string;
}

export async function createUser(params: ICreateUserParams) {
  const user = await prisma.cmsUser.create({
    data: {
      loginName: params.loginName,
      createId: params.createId,
      creator: params.creator,
      updateId: params.updateId,
      updater: params.updater
    }
  });
  await prisma.$disconnect();
  return user;
}
