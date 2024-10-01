import { FC, HTMLProps, forwardRef, useState } from "react";
import { EyeOpenSvg, EyeClosedSvg, LockSvg } from "../../icons/AllSvgs";

interface Props extends HTMLProps<HTMLInputElement> {
  Icon?: ({ className }: { className: string }) => JSX.Element;
  errorMessage?: string;
  placeholder: string;
}

const TextField: FC<Props> = forwardRef<HTMLInputElement, Props>(
  function TextFieldComponent(
    { placeholder, errorMessage, Icon = LockSvg, ...rest },
    ref
  ) {
    const [hidePassword, setHidePassword] = useState(true);

    const eyeClickHandler = () => {
      setHidePassword((prev) => !prev);
    };

    return (
      <div className="flex flex-col relative">
        <div className="flex items-center ">
          <input
            {...rest}
            ref={ref}
            className={`flex-grow w-[50%] !bg-darkGray rounded-md border border-gray-600 shadow-inner py-6 pl-14 pr-4 text-[15px] text-whiteText placeholder:text-grayText  focus:outline-none ${
              rest.name === "password" ? "pr-14" : ""
            }`}
            placeholder={placeholder}
            type={
              rest.type === "password" && !hidePassword ? "text" : rest.type
            }
          />
          {Icon && <Icon className="absolute left-3 h-7 w-7 text-iconGray" />}
          {rest.type === "password" ? (
            <div
              className="absolute right-4 h-7 w-7 cursor-pointer text-grayText peer-hover:text-blackText peer-focus:text-primary"
              onClick={eyeClickHandler}
              title={hidePassword ? "Hide Password" : "Show Password"}
            >
              {hidePassword ? <EyeClosedSvg /> : <EyeOpenSvg />}
            </div>
          ) : null}
        </div>
        {errorMessage && (
          <span className="text-red-500 text-sm mt-1">{errorMessage}</span>
        )}
      </div>
    );
  }
);

export default TextField;
