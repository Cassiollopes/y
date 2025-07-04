export default function MaxCharsRadius({ text }: { text: string | undefined }) {
  const maxChars = 200; 

  const percentage = text ? (text.length / maxChars) * 100 : 0;

  const radius = 12;
  const circumference = 2 * Math.PI * radius;

  const strokeDash = (percentage / 100) * circumference;
  const finalStrokeDash =
    (text?.length ?? 0) > 200 ? circumference : strokeDash;

  return (
    <div className="flex items-center gap-2 relative justify-center w-fit">
      <div
        className={`relative w-7 h-7 ${(text?.length ?? 0) > 180 && "w-9 h-9"}`}
      >
        <svg className="w-full h-full" viewBox="0 0 32 32">
          <circle
            cx="16"
            cy="16"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="2"
          />
          <circle
            cx="16"
            cy="16"
            r={radius}
            fill="none"
            stroke={`${
              (text?.length ?? 0) > 200
                ? "rgba(255, 0, 0, 0.5)"
                : (text?.length ?? 0) > 180
                ? "rgba(255, 255, 0, 0.5)"
                : "rgb(29, 155, 240)"
            }`}
            strokeWidth="2"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference - finalStrokeDash}
            className="transform -rotate-90 origin-center transition-all duration-300"
          />
        </svg>
      </div>
      {text && text.length > 180 && (
        <p
          className={`text-xs text-zinc-500 absolute ${
            text.length > 200 ? "text-red-500" : ""
          }`}
        >
          {maxChars - (text?.length ?? 0)}
        </p>
      )}
    </div>
  );
}