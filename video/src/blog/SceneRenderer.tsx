import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  Video,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { BlogPromoProps, Scene } from "./types";
import { resolveAsset } from "./utils";

const WORDS_PER_CAPTION_LINE = 3;

function splitCaption(text: string, wordsPerLine = WORDS_PER_CAPTION_LINE): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(" "));
  }
  return lines.length ? lines : [text];
}

export const SceneRenderer: React.FC<{
  scene: Scene;
  brand: BlogPromoProps["brand"];
  isPortrait: boolean;
  isSquare: boolean;
  frame: number;
  fps: number;
  url: string;
  defaultImage?: string;
}> = ({ scene, brand, isPortrait, isSquare, frame, fps, url, defaultImage }) => {
  const primary = brand.primaryColor;
  const text = brand.textColor;
  const bg = brand.backgroundColor;
  const { durationInFrames } = useVideoConfig();

  const springConfig = { damping: 14, mass: 0.6, stiffness: 90 };
  const entrance = spring({ fps, frame, config: springConfig });
  const exitProgress = interpolate(
    frame,
    [Math.max(0, durationInFrames - 25), durationInFrames - 5],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const resolvedImage = scene.imageFile || defaultImage || "blog/placeholder.jpg";
  const resolvedVideo = scene.videoFile ? resolveAsset(scene.videoFile) : undefined;

  const videoBackground = resolvedVideo ? (
    <AbsoluteFill style={{ opacity: 1 }}>
      <Video
        src={resolvedVideo}
        loop
        muted
        style={{
          width: "120%",
          height: "120%",
          objectFit: "cover",
          position: "absolute",
          top: "-10%",
          left: "-10%",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,10,20,0.55) 0%, rgba(5,10,20,0.85) 100%)",
        }}
      />
    </AbsoluteFill>
  ) : null;

  const imageBackground = (
    <AbsoluteFill style={{ opacity: 1 }}>
      <Img
        src={resolveAsset(resolvedImage) || ""}
        style={{
          width: "120%",
          height: "120%",
          objectFit: "cover",
          position: "absolute",
          top: "-10%",
          left: "-10%",
          transform: `scale(${interpolate(frame, [0, durationInFrames], [1, 1.12])})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,10,20,0.5) 0%, rgba(5,10,20,0.85) 100%)",
        }}
      />
    </AbsoluteFill>
  );

  const captionLines = useMemo(
    () => splitCaption(scene.text, isPortrait ? 4 : WORDS_PER_CAPTION_LINE),
    [scene.text, isPortrait]
  );

  const CaptionBlock: React.FC<{ lines: string[]; small?: boolean }> = ({ lines, small }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: isPortrait ? 14 : 12,
        zIndex: 20,
      }}
    >
      {lines.map((line, idx) => (
        <div
          key={idx}
          style={{
            alignSelf: "center",
            backgroundColor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${primary}33`,
            borderRadius: isPortrait ? 18 : 14,
            padding: isPortrait ? "16px 28px" : "12px 22px",
            color: text,
            fontSize: small
              ? isPortrait
                ? 42
                : 38
              : isPortrait
                ? 58
                : isSquare
                  ? 52
                  : 64,
            fontWeight: 900,
            lineHeight: 1.15,
            textAlign: "center",
            textWrap: "balance",
            textShadow: "0 4px 24px rgba(0,0,0,0.6)",
            transform: `translateY(${interpolate(
              entrance,
              [0.1 + idx * 0.08, 1],
              [40, 0]
            )}px)`,
            opacity: interpolate(entrance, [0.05 + idx * 0.08, 0.5 + idx * 0.08], [0, 1]),
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );

  const baseLayoutStyle: React.CSSProperties = {
    justifyContent: "center",
    alignItems: "center",
    padding: isPortrait ? "0 40px" : "0 80px",
    opacity: interpolate(exitProgress, [0, 1], [1, 0]),
  };

  return (
    <AbsoluteFill>
      {scene.audioFile ? <Audio src={resolveAsset(scene.audioFile) || ""} /> : null}

      {scene.type === "hook" && (
        <AbsoluteFill style={baseLayoutStyle}>
          {videoBackground || imageBackground}
          <div
            style={{
              position: "absolute",
              top: isPortrait ? 140 : 100,
              zIndex: 20,
              alignSelf: "flex-start",
              padding: "10px 20px",
              backgroundColor: primary,
              borderRadius: 999,
              color: bg,
              fontSize: isPortrait ? 20 : 16,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: 2,
              transform: `scale(${interpolate(entrance, [0, 1], [0.7, 1])})`,
              opacity: interpolate(entrance, [0, 0.8], [0, 1]),
            }}
          >
            Hook
          </div>
          <CaptionBlock lines={captionLines} />
        </AbsoluteFill>
      )}

      {scene.type === "title" && (
        <AbsoluteFill style={baseLayoutStyle}>
          {videoBackground || imageBackground}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: isPortrait ? 28 : 20,
              zIndex: 20,
              maxWidth: isPortrait ? 900 : 1400,
            }}
          >
            <div
              style={{
                padding: "10px 22px",
                backgroundColor: `${primary}22`,
                border: `2px solid ${primary}66`,
                borderRadius: 999,
                color: primary,
                fontSize: isPortrait ? 20 : 16,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 3,
              }}
            >
              New Post
            </div>
            <h1
              style={{
                margin: 0,
                color: text,
                fontSize: isPortrait ? 72 : isSquare ? 62 : 84,
                fontWeight: 950,
                lineHeight: 1.05,
                textWrap: "balance",
                textShadow: "0 12px 40px rgba(0,0,0,0.35)",
                transform: `translateY(${interpolate(entrance, [0.2, 1], [30, 0])}px)`,
              }}
            >
              {scene.text}
            </h1>
          </div>
        </AbsoluteFill>
      )}

      {scene.type === "point" && (
        <AbsoluteFill style={baseLayoutStyle}>
          {videoBackground || imageBackground}
          <div
            style={{
              position: "absolute",
              top: isPortrait ? 140 : 100,
              zIndex: 20,
              alignSelf: "flex-start",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                background: `linear-gradient(135deg, ${primary}, ${brand.secondaryColor})`,
                boxShadow: `0 0 20px ${primary}88`,
              }}
            />
            <span
              style={{
                color: primary,
                fontSize: isPortrait ? 20 : 16,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 2,
              }}
            >
              Key Point
            </span>
          </div>
          <CaptionBlock lines={captionLines} />
        </AbsoluteFill>
      )}

      {scene.type === "proof" && (
        <AbsoluteFill style={baseLayoutStyle}>
          {videoBackground || imageBackground}
          <div
            style={{
              position: "absolute",
              top: isPortrait ? 140 : 100,
              zIndex: 20,
              alignSelf: "flex-start",
              padding: "8px 16px",
              borderRadius: 10,
              backgroundColor: "rgba(0,0,0,0.35)",
              color: primary,
              fontSize: isPortrait ? 18 : 15,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: 1.5,
            }}
          >
              Why it matters
          </div>
          <CaptionBlock lines={captionLines} />
        </AbsoluteFill>
      )}

      {scene.type === "full-image" && (
        <AbsoluteFill style={{ opacity: interpolate(exitProgress, [0, 1], [1, 0]) }}>
          <Img
            src={resolveAsset(resolvedImage) || ""}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: `scale(${interpolate(frame, [0, durationInFrames], [1, 1.08])})`,
            }}
          />
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(180deg, rgba(5,10,20,0.2) 0%, rgba(5,10,20,0.88) 100%)",
              justifyContent: "flex-end",
              padding: isPortrait ? "0 40px 120px" : "0 80px 100px",
            }}
          >
            <CaptionBlock lines={captionLines} small />
          </AbsoluteFill>
        </AbsoluteFill>
      )}

      {scene.type === "call-to-action" && (
        <AbsoluteFill style={baseLayoutStyle}>
          {videoBackground || imageBackground}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: isPortrait ? 36 : 28,
              zIndex: 20,
            }}
          >
            <h2
              style={{
                margin: 0,
                color: text,
                fontSize: isPortrait ? 64 : isSquare ? 54 : 72,
                fontWeight: 950,
                lineHeight: 1.05,
                textWrap: "balance",
                textShadow: "0 12px 40px rgba(0,0,0,0.35)",
              }}
            >
              {scene.text}
            </h2>
            <div
              style={{
                backgroundColor: primary,
                color: bg,
                padding: isPortrait ? "22px 44px" : "18px 36px",
                borderRadius: 999,
                fontSize: isPortrait ? 32 : 28,
                fontWeight: 900,
                boxShadow: `0 20px 60px ${primary}66`,
                transform: `translateY(${Math.sin(frame / 18) * 8}px)`,
              }}
            >
              {url.replace(/^https?:\/\//, "")}
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
