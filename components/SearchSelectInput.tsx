"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchSelectProps {
  options: string[];
  queryParamName: string;
}

const SearchSelect: React.FC<SearchSelectProps> = ({
  options,
  queryParamName,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialValue = searchParams.get(queryParamName) ?? "no-filter";

  const [selected, setSelected] = useState(initialValue);
  const debouncedValue = useDebounce(selected, 500);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (debouncedValue && debouncedValue !== "no-filter") {
      params.set(queryParamName, debouncedValue);
    } else {
      params.delete(queryParamName);
    }

    // Turn the params into a string and replace + with -
    const queryString = params.toString().replace(/\+/g, "-");

    router.replace(`${window.location.pathname}?${queryString}`);
  }, [debouncedValue, queryParamName, router]);

  return (
    <Select value={selected} onValueChange={setSelected}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="No Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="no-filter">No Filter</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SearchSelect;
