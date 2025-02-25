export function NameFormatter(name: string) {
  return name.split(" ", 2).join(" ");
}

export function UserNameFormatter(name: string) {
  return (
    "@" +
    name
      .split(" ", 1)
      .join("")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  );
}

export function DateFormatter(date: string) {
  return (() => {
      const now = new Date();
      const createdAt = new Date(date);
      const diffInSeconds = Math.floor(
        (now.getTime() - createdAt.getTime()) / 1000
      );
  
      if (diffInSeconds < 60) {
        return `${diffInSeconds} s`;
      } else if (diffInSeconds < 3600) {
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        return `${diffInMinutes} m`;
      } else if (diffInSeconds < 86400) {
        const diffInHours = Math.floor(diffInSeconds / 3600);
        return `${diffInHours} h`;
      } else {
        return createdAt.toLocaleDateString("pt-br", {
          month: "short",
          day: "numeric",
        }).replace(/\.$/, "");
      }
    })();
}

export function FullDateFormatter(date: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  return new Date(date).toLocaleString('pt-BR', options);
}