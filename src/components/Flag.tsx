import { flagUrl } from "@/data/teams";

export default function Flag({
  code,
  className = "",
}: {
  code: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flagUrl(code)}
      alt=""
      loading="lazy"
      className={`inline-block object-cover rounded-[3px] ring-1 ring-white/15 shadow ${className}`}
    />
  );
}
