import { axiosInstance } from "./axiosInstance";

// Register User

export const RegisterUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/register", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// Login User

export const LoginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/users/login", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// get current users

export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/users/get-current-user");
    return response.data;
  } catch (error) {
    return error.message;
  }
};


// Get All Users

export const GetAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/users/get-users");
    return response.data;
  } catch (error) {
    return error.message;
  }
};

//Update User

export const UpdateUserStatus = async (id, status) => {
  try {
    const response = await axiosInstance.put(`/api/users/update-user-status/${id}`, {status});
    return response.data;
  } catch (error) {
    return error.message;
  }
};