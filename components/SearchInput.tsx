"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  queryParamName: string;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  queryParamName,
  placeholder = "Search...",
  debounceMs = 500,
  className,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialValue = searchParams.get(queryParamName) ?? "";

  const [inputValue, setInputValue] = useState(initialValue);
  const debouncedValue = useDebounce(inputValue, debounceMs);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debouncedValue) {
      params.set(queryParamName, debouncedValue);
    } else {
      params.delete(queryParamName);
    }
    router.replace(`${window.location.pathname}?${params.toString()}`);
  }, [debouncedValue, queryParamName, router]);

  return (
    <Input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
};

export default SearchInput;
