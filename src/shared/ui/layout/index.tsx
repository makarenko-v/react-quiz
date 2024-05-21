import React from "react";

export function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-800 py-20 text-white">
      <div className="max-w-2xl w-full mx-auto">{children}</div>
    </div>
  );
}
