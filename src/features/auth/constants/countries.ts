export interface Country {
  flag: string;
  dialCode: string;
  name: string;
}

export const COUNTRIES: Country[] = [
  { flag: "🇺🇸", dialCode: "+1", name: "United States" },
  { flag: "🇬🇧", dialCode: "+44", name: "United Kingdom" },
  { flag: "🇨🇦", dialCode: "+1", name: "Canada" },
  { flag: "🇦🇺", dialCode: "+61", name: "Australia" },
  { flag: "🇩🇪", dialCode: "+49", name: "Germany" },
  { flag: "🇫🇷", dialCode: "+33", name: "France" },
  { flag: "🇮🇳", dialCode: "+91", name: "India" },
  { flag: "🇯🇵", dialCode: "+81", name: "Japan" },
  { flag: "🇧🇷", dialCode: "+55", name: "Brazil" },
  { flag: "🇦🇪", dialCode: "+971", name: "United Arab Emirates" },
  { flag: "🇪🇸", dialCode: "+34", name: "Spain" },
  { flag: "🇮🇹", dialCode: "+39", name: "Italy" },
  { flag: "🇲🇽", dialCode: "+52", name: "Mexico" },
  { flag: "🇰🇷", dialCode: "+82", name: "South Korea" },
  { flag: "🇳🇱", dialCode: "+31", name: "Netherlands" },
];
