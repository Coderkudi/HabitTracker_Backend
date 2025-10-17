import { userTable } from "../utils/prisma";

export class authManager {
  public async registerUser(userInformation: {
    email: string;
    name: string;
    userName: string;
    password: string;
  }) {
    try {
      const uniqueUser = await userTable.findFirst({
        where: {
          email: `${userInformation.email}`,
        },
      });
      console.log(uniqueUser);

      if (uniqueUser) {
        return "Invalid email";
      }

      const newUser = await userTable.create({
        data: {
          email: userInformation.email,
          name: userInformation.name,
          userName: userInformation.userName,
          password: userInformation.password,
        },
      });

      if (newUser) {
        return newUser;
      } else {
        return null;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        return null;
      }
    }
  }
}
