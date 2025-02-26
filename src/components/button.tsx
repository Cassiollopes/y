import { cn } from "@/utils";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { ReactNode } from "react";

export const buttonStyles = cva(
  "flex items-center justify-center gap-1 group transition-all duration-300 text-zinc-400/80 relative",
  {
    variants: {
      color: {
        default: "text-white/95",
        pink: "hover:text-pink-600",
        sky: "hover:text-sky-600",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
    defaultVariants: {
      color: "default",
      disabled: false,
    },
  }
);

export default function ActionButton({
  onClick,
  fill,
  icon,
  iconFill,
  text,
  color,
  disabled,
  label,
  fillLabel,
  className,
  children,
  contrast,
}: VariantProps<typeof buttonStyles> & {
  onClick?: () => void;
  fill?: boolean;
  icon: ReactNode;
  iconFill?: ReactNode;
  text?: number;
  label: string;
  fillLabel?: string;
  className?: string;
  children?: ReactNode;
  contrast?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(buttonStyles({ color, disabled }), className)}
    >
      <div className="absolute -bottom-8 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-none group-hover:delay-700 transition-opacity bg-slate-600/80 text-white/95 text-xs p-1 rounded py-0.5 shadow-lg truncate">
        {fill ? fillLabel : label}
      </div>
      <div className="flex justify-center items-center relative">
        {fill ? iconFill : icon}
        <div
          className={clsx(
            `p-4 rounded-full absolute transition-all duration-200 ${
              contrast ? "bg-slate-600/30" : ""
            }`,
            {
              "group-hover:bg-pink-600/20": color === "pink",
              "group-hover:bg-sky-600/20": color === "sky",
              "group-hover:bg-slate-600/20":
                color !== "sky" && color !== "pink",
            }
          )}
        ></div>
      </div>
      <p className="text-xs">{text}</p>
      {children}
    </button>
  );
}

export function SubmitButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={`flex justify-center items-center bg-white/95 rounded-full px-5 p-2 text-black font-bold text disabled:opacity-50 hover:opacity-85 transition-all duration-200 ${props.className}`}
    >
      {props.children}
    </button>
  );
}
