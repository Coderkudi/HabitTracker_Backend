import { userTable } from "./src/utils/prisma";

async function getData() {
  try {
    const data = await userTable.create({
      data: {
        name: "Rimmi",
        email: "goa@gmail.com",
        password: "123",
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}
getData()
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });
// precommit test Sun Oct 19 01:55:13 PM IST 2025
