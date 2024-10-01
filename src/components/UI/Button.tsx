import { IButtonProps } from "../../types";

const Button = ({ type = "button", label }: IButtonProps) => (
  <button
    type={type}
    className="btn-primary flex justify-center items-center py-4"
  >
    {label}
  </button>
);

export default Button;
