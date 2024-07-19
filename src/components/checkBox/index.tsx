import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export default function CheckboxField({
  label,
  checked,
  onChange,
}: CheckboxFieldProps) {
  return (
    <div className="flex flex-row gap-3 justify-start">
      <Checkbox onClick={onChange} checked={checked} />
      <p>{label}</p>
    </div>
  );
}
