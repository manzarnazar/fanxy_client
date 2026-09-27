"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { COUNTRIES } from "@/features/auth/constants/countries";

interface CountryPickerProps {
  value: string;
  onChange: (dialCode: string) => void;
}

export function CountryPicker({ value, onChange }: CountryPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = COUNTRIES.find((country) => country.dialCode === value) ?? COUNTRIES[0];

  const filtered = useMemo(
    () => COUNTRIES.filter((country) => country.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-[52px] items-center gap-1.5 rounded-md border border-border bg-surface/60 px-3.5 text-text-primary transition hover:border-primary/40"
      >
        <span className="text-lg" aria-hidden="true">
          {selected.flag}
        </span>
        <span className="font-sans text-sm">{selected.dialCode}</span>
        <ChevronDown className="h-3 w-3 text-text-muted" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute top-[58px] left-0 z-20 w-[250px] rounded-lg border border-primary/24 bg-surface-elevated/98 p-2.5 shadow-dropdown backdrop-blur-xl"
        >
          <div className="mb-2 flex items-center gap-2 rounded-md bg-surface/70 px-3 py-2">
            <Search className="h-[15px] w-[15px] text-primary-light" aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search country…"
              className="w-full bg-transparent font-sans text-[13.5px] text-text-primary outline-none placeholder:text-placeholder"
            />
          </div>
          <div className="flex max-h-[198px] flex-col gap-0.5 overflow-y-auto">
            {filtered.map((country) => (
              <button
                key={`${country.name}-${country.dialCode}`}
                type="button"
                role="option"
                aria-selected={country.dialCode === value}
                onClick={() => {
                  onChange(country.dialCode);
                  setOpen(false);
                  setSearch("");
                }}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition hover:bg-primary/10",
                  country.dialCode === value && "bg-primary/10",
                )}
              >
                <span className="text-lg" aria-hidden="true">
                  {country.flag}
                </span>
                <span className="flex-1 font-sans text-[13px] text-text-primary">{country.name}</span>
                <span className="font-sans text-xs text-text-muted">{country.dialCode}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-center font-sans text-xs text-text-muted">No match found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
