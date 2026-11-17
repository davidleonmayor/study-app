import { AuthStatus } from "@/presentation";
import { isAxiosError } from "axios";
import { moneyUpApi } from "../../api";
import { secureStorageService } from "../../storage/secure-store.storage";

// interface any {
//     id: string;
//     email: string;
//     name: string;
//     isActive: boolean;
//     roles: ["ADMIN", "USER"],
//     token: string;
// }
interface VerifySessionResult {
  user?: { email: string; [key: string]: any };
  status: AuthStatus;
}

const returnUserToken = (data: any) => {
  const { token, ...user } = data;

  return {
    user,
    token,
  };
};

export const authLogin = async (email: string, password: string) => {
  email = email.toLowerCase();

  try {
    const { data: token } = await moneyUpApi.post<string>("/auth/login", {
      email,
      password,
    });

    console.log({ token });

    secureStorageService.setItem("token", token);
    secureStorageService.setItem("email", email);

    console.log("Token guardado en SecureStore:", token);
    return token;
  } catch (error) {
    console.error({ error });
    throw new Error("Data is not valid.");
  } finally {
  }
};

export const authCheckStatus = async () => {
  try {
    const { data } = await moneyUpApi.get<any>("/user");
    return returnUserToken(data);
  } catch (error) {
    throw new Error("User not authenticated.");
  }
};

//TODO:Hacer registro
export const createAccount = async (
  email: string,
  name: string,
  password: string,
) => {
  try {
    const request = await moneyUpApi.post<any>("/auth/create-account", {
      name,
      password,
      email,
    });

    console.log(request.data);

    return request;
  } catch (error: any) {
    if (error.response && isAxiosError(error)) {
      console.log("gay:", error.response.data);
    }
  }
};

export const verifySession = async (
  token: string,
): Promise<VerifySessionResult> => {
  try {
    const request = await moneyUpApi.get("/auth/user", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      user: request.data,
      status: "authenticated", // ✅ ahora TypeScript sabe que es AuthStatus
    };
  } catch (error) {
    console.error("Error al autenticar usuario.");
    return {
      user: undefined,
      status: "unauthenticated", // ✅ también AuthStatus
    };
  }
};
