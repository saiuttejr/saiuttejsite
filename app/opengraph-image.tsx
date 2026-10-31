import { OG_SIZE, renderOpenGraphCard } from "@/lib/og";

export const runtime = "nodejs";
export const alt = "Sai Uttej Rajoju · Applied AI & Systems Engineer";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return renderOpenGraphCard();
}
