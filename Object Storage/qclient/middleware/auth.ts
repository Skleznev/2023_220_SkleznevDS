import {Context} from "@nuxt/vue-app";
import axios, {AxiosError} from "axios";

export default async function auth({store}: Context): Promise<void> {
  if (!(localStorage.getItem("token") && !store.state.user)) {
    return;
  }
  try {
    const res = await axios.get("/user", {
      baseURL: process.env.API_ENDPOINT,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    store.commit("SET_USER", {user: res.data.data.user});
  } catch (error) {
    const axiosError: AxiosError = error;
    if (axiosError.response) {
      if (
        axiosError.response.status === 401 &&
        axiosError.response.data.code === "JWT_VERIFY_USER"
      ) {
        localStorage.removeItem("token");
        return;
      }
    }
    throw error;
  }
}
