
export default function SearchBar({
  value,
  onChange,
  className = "",
  placeholder = "Search posts...",
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`px-3 py-2 rounded bg-white text-black focus:outline-none min-w-[200px] sm:w-60 lg:w-150  border border-gray-300 ${className}`}
    />
  );
}