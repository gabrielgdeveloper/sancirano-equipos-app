import { useState } from "react";
import clsx from "clsx";

interface TeamBadgeProps {
  imageUrl: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: "w-7 h-7",
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
  xl: "w-28 h-28",
};

const imgSizeMap = {
  xs: "w-5 h-5",
  sm: "w-7 h-7",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
};

export function TeamBadge({ imageUrl, name, size = "md", className }: TeamBadgeProps) {
  const [error, setError] = useState(false);

  return (
    <div
      className={clsx(
        "rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden p-1",
        sizeMap[size],
        className
      )}
      title={name}
    >
      {!error ? (
        <img
          src={imageUrl}
          alt={name}
          className={clsx("object-contain", imgSizeMap[size])}
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-gray-400 text-xs font-bold text-center leading-none px-1">
          {name.slice(0, 3).toUpperCase()}
        </span>
      )}
    </div>
  );
}
