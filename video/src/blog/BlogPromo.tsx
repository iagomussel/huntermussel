import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import type { BlogPromoProps, Scene } from "./types";
import { SceneRenderer } from "./SceneRenderer";
import { resolveAsset } from "./utils";
import { TRANSITION_DURATION_FRAMES } from "./constants";

const SceneWrapper: React.FC<{
  scene: Scene;
  brand: BlogPromoProps["brand"];
  isPortrait: boolean;
  isSquare: boolean;
  fps: number;
  url: string;
  defaultImage?: string;
  durationFrames: number;
  index: number;
}> = ({ scene, brand, isPortrait, isSquare, fps, url, defaultImage, durationFrames, index }) => {
  const frame = useCurrentFrame();
  return (
    <SceneRenderer
      scene={scene}
      brand={brand}
      isPortrait={isPortrait}
      isSquare={isSquare}
      frame={frame}
      fps={fps}
      url={url}
      defaultImage={defaultImage}
      durationFrames={durationFrames}
      index={index}
    />
  );
};

export const BlogPromo: React.FC<BlogPromoProps> = (props) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const isPortrait = height > width;
  const isSquare = height === width;

  const bg = props.brand.backgroundColor;

  const scenes = useMemo(() => {
    const baseScenes =
      props.scenes && props.scenes.length > 0
        ? [...props.scenes]
        : [{ text: props.title, type: "title" } as Scene];

    const hasCta = baseScenes.some((s) => s.type === "call-to-action");
    if (!hasCta) {
      baseScenes.push({
        text: "Find more on HunterMussel",
        type: "call-to-action",
        audioFile: "static/cta.mp3",
        durationFrames: 75,
      });
    }

    return baseScenes;
  }, [props.scenes, props.title]);

  const transitionDuration = TRANSITION_DURATION_FRAMES;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        fontFamily:
          'Inter, "SF Pro Display", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Global audio fallback */}
      {props.audioFile && (!scenes[0] || !scenes[0].audioFile) ? (
        <Audio src={resolveAsset(props.audioFile) || ""} />
      ) : null}

      {/* Background music bed — fades in/out so it doesn't cut abruptly */}
      {props.musicFile && (
        <Audio
          src={resolveAsset(props.musicFile) || ""}
          volume={(f) =>
            interpolate(f, [0, 30, durationInFrames - 30, durationInFrames], [0, 0.12, 0.12, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
          loop
          startFrom={0}
        />
      )}

      {/* Animated gradient background */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 700px at 0% 0%, ${props.brand.secondaryColor}22, transparent 70%),
radial-gradient(1000px 600px at 100% 100%, ${props.brand.primaryColor}22, transparent 70%),
linear-gradient(180deg, ${bg}, ${bg})`,
        }}
      />

      {/* Floating orbs */}
      <AbsoluteFill style={{ opacity: 0.25, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: isPortrait ? 300 : 500,
            height: isPortrait ? 300 : 500,
            borderRadius: "50%",
            background: props.brand.primaryColor,
            filter: "blur(120px)",
            transform: `translateY(${Math.sin(frame / 45) * 40}px)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "5%",
            width: isPortrait ? 350 : 600,
            height: isPortrait ? 350 : 600,
            borderRadius: "50%",
            background: props.brand.secondaryColor,
            filter: "blur(140px)",
            transform: `translateY(${Math.cos(frame / 55) * 50}px)`,
          }}
        />
      </AbsoluteFill>

      {/* Brand watermark — top left */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          zIndex: 1000,
          opacity: 0.92,
        }}
      >
        <Img
          src={resolveAsset("logo-icon.svg") || ""}
          style={{ width: isPortrait ? 72 : 60, height: isPortrait ? 72 : 60, objectFit: "contain" }}
        />
      </div>

      {/* Handle watermark — top right */}
      <div
        style={{
          position: "absolute",
          top: 28,
          right: 28,
          zIndex: 1000,
          color: props.brand.textColor,
          fontSize: isPortrait ? 20 : 18,
          fontWeight: 700,
          opacity: 0.75,
        }}
      >
        {props.brand.handle || props.brand.website}
      </div>

      {/* Scene transitions */}
      <TransitionSeries>
        {scenes.map((scene, i) => {
          const isLast = i === scenes.length - 1;
          const duration = scene.durationFrames || 90;

          return (
            <React.Fragment key={i}>
              <TransitionSeries.Sequence durationInFrames={duration}>
                <SceneWrapper
                  scene={scene}
                  brand={props.brand}
                  isPortrait={isPortrait}
                  isSquare={isSquare}
                  fps={30}
                  url={props.url}
                  defaultImage={props.imageFile}
                  durationFrames={duration}
                  index={i}
                />
              </TransitionSeries.Sequence>

              {!isLast && (
                <TransitionSeries.Transition
                  presentation={
                    i % 3 === 0
                      ? fade({})
                      : i % 3 === 1
                        ? slide({ direction: "from-bottom" })
                        : slide({ direction: "from-right" })
                  }
                  timing={linearTiming({ durationInFrames: transitionDuration })}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 6,
          background: `linear-gradient(90deg, ${props.brand.primaryColor}, ${props.brand.secondaryColor})`,
          width: `${(frame / durationInFrames) * 100}%`,
          zIndex: 1000,
          boxShadow: `0 -4px 16px ${props.brand.primaryColor}44`,
        }}
      />
    </AbsoluteFill>
  );
};
