// The local loader is used to load images from the local server.
// The correct host needs to be set here it can probably go to the .env file
export default function localLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality || "auto"}`];
  return `https://spinks.kbs.msu.edu/${src}`;
}
