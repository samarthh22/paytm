import { Link } from "react-router-dom";
interface BottomWarnignProps {
  label: string;
  buttonText: string;
  to: string;
}
const BottomWarning = ({ label, buttonText, to }: BottomWarnignProps) => {
  return (
    <div className='py-2 text-sm flex justify-center'>
      <div>{label}</div>
      <Link className='pointer underline pl-1 cursor-pointer' to={to}>
        {buttonText}
      </Link>
    </div>
  );
};

export default BottomWarning;
