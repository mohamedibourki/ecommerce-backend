import bcrypt from "bcrypt";

export const hashPassword = async (password: any) => {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  } catch (error: any) {
    console.log(error);
    throw new Error("Failed to hash password");
  }
};

export const comparePassword = async (data: any, hash: any) => {
  try {
    return await bcrypt.compare(data, hash);
  } catch (error: any) {
    console.log(error);
    throw new Error("Password not match");
  }
};
