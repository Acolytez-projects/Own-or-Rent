import React from "react";

export function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition " +
        (active
          ? "bg-white text-black shadow"
          : "text-white/70 hover:bg-white/10 hover:text-white")
      }
      type="button"
    >
      {children}
    </button>
  );
}
