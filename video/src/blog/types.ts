export type BrandConfig = {
  name: string;
  website: string;
  handle?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  logoFile: string;
};

export type Scene = {
  text: string;
  type: "title" | "bullet" | "image" | "video" | "quote" | "call-to-action" | "full-image" | "feature";
  imageFile?: string;
  videoFile?: string;
  narration?: string; // Scene-specific narration
  durationFrames?: number; // Calculated or provided duration
  audioFile?: string; // Path to scene audio
};

export type BlogPromoProps = {
  title: string;
  subtitle?: string;
  bullets: string[];
  url: string;
  imageFile?: string;
  audioFile?: string;
  brand: BrandConfig;
  scenes?: Scene[];
};
