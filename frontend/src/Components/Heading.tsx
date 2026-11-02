interface headingProps {
  label: string;
}
const Heading = ({ label }: headingProps) => {
  return <div className='font-bold text-4xl pt-6'>{label}</div>;
};

export default Heading;
