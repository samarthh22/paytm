interface inputProps {
  label: string;
  placeholder?: string;
  type?: string;
  reference?: React.Ref<HTMLInputElement>;
}
const InputBox = ({ label, placeholder, type, reference }: inputProps) => {
  return (
    <div>
      <div className='text-sm font-medium text-left py-2'>{label}</div>
      <input
        ref={reference}
        type={type}
        placeholder={placeholder}
        className='w-full px-2 py-1 border rounded border-slate-200'
      />
    </div>
  );
};

export default InputBox;
