import { ImageResponse } from "next/og";
import { IconGraphic } from "./icon";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<IconGraphic fontSize={92} />, size);
}
