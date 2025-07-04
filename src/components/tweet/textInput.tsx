import { useEffect } from "react";

export default function TextInput({
  text,
  inputRef,
  answer,
  callback,
  setText,
}: {
  text?: string;
  inputRef: React.RefObject<HTMLDivElement>;
  answer?: boolean;
  callback?: () => void;
  setText: (text: string) => void;
}) {
  useEffect(() => {
    const div = inputRef.current;
    if (div && text && text.length > 200) {
      const normalText = text.slice(0, 200);
      const excessText = text.slice(200);
      div.innerHTML = `${normalText}<span style="background: rgb(255, 0, 0, 0.5);">${excessText}</span>`;
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(div);
      range.collapse(false);
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [text, inputRef]);

  return (
      <div
        ref={inputRef}
        contentEditable="true"
        onInput={(e) => {
          const content = (e.target as HTMLDivElement).textContent || "";
          setText(content);
          if (content === "") {
            (e.target as HTMLDivElement).innerHTML = "";
          }
        }}
        data-placeholder={
          answer ? "Postar resposta" : "O que você está pensando?"
        }
        className={`py-2 flex-1 bg-transparent border-none outline-none text-xl max-md:text-lg placeholder-zinc-500 empty:before:content-[attr(data-placeholder)] empty:before:text-zinc-500 whitespace-pre-wrap break-words overflow-hidden leading-tight ${
          callback && "min-h-[96px]"
        } cursor-text`}
      />
  );
}
