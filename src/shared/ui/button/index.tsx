import { ComponentPropsWithoutRef } from "react";

export function Button({
  children,
  onClick,
}: ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className="text-lg py-4 px-8 rounded-full border-2 border-gray-700 hover:bg-gray-700"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
