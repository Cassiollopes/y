import { cn } from "@/utils";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { ReactNode } from "react";

export const buttonStyles = cva(
  "flex items-center justify-center gap-1 group transition-all duration-300 fill-zinc-400/80 text-zinc-400/80 relative",
  {
    variants: {
      color: {
        default: "text-default/95",
        pink: "hover:text-pink-600 hover:fill-pink-600",
        sky: "hover:text-sky-600 hover:fill-sky-600",
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

export const submitButtonStyles = cva(
  "flex justify-center items-center rounded-full text-black font-bold disabled:opacity-50 hover:opacity-85 transition-all duration-200 px-0 py-0",
  {
    variants: {
      variant: {
        default: "px-4 py-2 bg-white/95 text-[14px]",
        mobileIcon:
          "text-white/95 bg-blue_twitter w-[52px] h-[52px] shadow-md shadow-white/20 fixed bottom-16 mb-2 right-5 md:hidden text-xl",
        icon: "w-[50px] h-[50px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export default function ActionButton({
  fill,
  icon,
  iconFill,
  text,
  color,
  disabled,
  label,
  fillLabel,
  contrast,
  ...props
}: VariantProps<typeof buttonStyles> & {
  onClick?: () => void;
  fill?: boolean;
  icon: ReactNode;
  iconFill?: ReactNode;
  text?: number;
  label: string;
  fillLabel?: string;
  contrast?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={cn(buttonStyles({ color, disabled }), props.className)}
    >
      <div className="absolute -bottom-8 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-none group-hover:delay-700 transition-opacity bg-slate-600/80 text-white/95 text-xs p-1 rounded-sm py-0.5 shadow-lg truncate">
        {fill ? fillLabel : label}
      </div>
      <div className="flex justify-center items-center relative">
        <div className="z-10">{fill ? iconFill : icon}</div>
        <div
          className={clsx(
            `p-4 rounded-full absolute transition-all duration-200 ${
              contrast ? "bg-zinc-900" : ""
            }`,
            {
              "group-hover:bg-pink-600/20": color === "pink",
              "group-hover:bg-sky-600/20": color === "sky",
              "group-hover:bg-neutral-800": color !== "sky" && color !== "pink",
            }
          )}
        ></div>
      </div>
      <p className="text-xs">{text}</p>
      {props.children}
    </button>
  );
}

export function SubmitButton({
  variant,
  text,
  photoFile,
  posting,
  answer,
  callback,
  ...props
}: {
  variant?: "default" | "mobileIcon" | "icon";
  text?: string;
  photoFile?: File | null;
  posting?: boolean;
  answer?: boolean;
  callback?: () => void;
} & VariantProps<typeof submitButtonStyles> &
  React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        submitButtonStyles({ variant }),
        props.className,
        `${
          callback && variant !== "mobileIcon"
            ? "text-sm font-semibold bg-blue_twitter leading-tight rounded-full px-3.5 py-1.5 fixed top-3 right-4 disabled:opacity-50 text-white/95"
            : ""
        }`
      )}
      disabled={
        (variant !== "mobileIcon" && !text && !photoFile) ||
        posting ||
        (text != undefined && text.length > 200)
      }
    >
      {variant !== "mobileIcon" && (
        <div>
          {posting && !answer ? (
            <LoadingSpinner callback={callback} />
          ) : answer && posting ? (
            <LoadingSpinner callback={callback} />
          ) : answer ? (
            "Responder"
          ) : (
            "Postar"
          )}
        </div>
      )}
      {props.children}
    </button>
  );
}

export function LoadingSpinner({ callback }: { callback?: () => void }) {
  return (
    <>
      <div
        className={`w-5 h-5 border-2 ${
          callback ? "border-white/95" : "border-blue_twitter"
        } border-t-transparent rounded-full animate-spin`}
      ></div>
      <div className="fixed inset-0 z-50"></div>
    </>
  );
}
