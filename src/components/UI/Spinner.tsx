import { RotatingLines } from "react-loader-spinner";

const Spinner = () => {
  return (
    <RotatingLines
      strokeColor="#409EFF"
      strokeWidth="5"
      animationDuration="0.75"
      width="50"
      visible={true}
    />
  );
};

export default Spinner;
