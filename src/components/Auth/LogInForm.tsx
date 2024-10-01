import { LockSvg, UserSvg } from "../../icons/AllSvgs";
import TextField from "../UI/TextField";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { setAuthDetails } from "../../utils/cookie";
import { useState } from "react";
import Button from "../UI/Button";

type Inputs = {
  username: string;
  password: string;
};

export default function LogInForm() {
  const navigate = useNavigate();
  const { updateToast } = useToast();
  const { setAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/user/login`,
        data
      );
      const resData = response?.data;
      if (resData) {
        setAuth({
          token: resData?.token,
          userInfo: resData?.userInfo,
          permissions: resData?.permissions,
        });
        setAuthDetails({
          token: resData?.token,
          userInfo: resData?.userInfo,
          permissions: resData?.permissions,
        });

        updateToast(resData.message, "success");
        navigate("/");
      } else {
        updateToast("No Server Response!", "error");
      }
    } catch (err) {
      let errorMsg = "";
      if (err?.response?.status === 401) errorMsg = err?.response?.data?.error;
      updateToast(errorMsg, "error");
    }
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center ">
      <h1 className="mb-8 text-xl font-bold text-white text-center">
        Spin & Win
      </h1>
      <form
        className="flex flex-col gap-6 w-full max-w-[520px] justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          type="text"
          placeholder="Username"
          Icon={UserSvg}
          {...register("username", { required: "Username is required" })}
          errorMessage={errors.username?.message}
        />
        <TextField
          type="password"
          placeholder="Password"
          Icon={LockSvg}
          {...register("password", { required: "Password is required" })}
          errorMessage={errors.password?.message}
        />
        <Button label="Login" type="submit" />
      </form>
    </div>
  );
}
