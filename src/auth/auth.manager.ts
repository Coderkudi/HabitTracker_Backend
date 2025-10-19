import { userTable } from "../utils/prisma";

export class authManager {
  public async registerUser(userInformation: {
    name: string;
    email: string;
    userName: string;
    password: string;
  }) {
    try {

      const uniqueUser = await userTable.findFirst({
        where: {
          email: `${userInformation.email}`,
        },
      });
      console.log(uniqueUser)
      if (uniqueUser) {
        throw new Error("Email allready exists");
      }

      const newUser = await userTable.create({
        data: {
          email: userInformation.email,
          name: userInformation.name,
          userName: userInformation.userName,
          password: userInformation.password,
        },
      });
      console.log(newUser)
      return newUser;
    }
    catch(error){
      if(error instanceof Error) {

        throw new Error( error.message);
      }
      else{
        throw new Error("Unknown error occured");
      }


    }
  }
}
