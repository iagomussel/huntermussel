import React, {useMemo} from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {slide} from "@remotion/transitions/slide";
import type {BlogPromoProps, Scene} from "./types";
import {SceneRenderer} from "./SceneRenderer";
import {resolveAsset} from "./utils";

const SceneWrapper: React.FC<{
  scene: Scene;
  brand: BlogPromoProps["brand"];
  isPortrait: boolean;
  fps: number;
  url: string;
  defaultImage?: string;
}> = ({scene, brand, isPortrait, fps, url, defaultImage}) => {
  const frame = useCurrentFrame();
  return (
    <SceneRenderer
      scene={scene}
      brand={brand}
      isPortrait={isPortrait}
      frame={frame}
      fps={fps}
      url={url}
      defaultImage={defaultImage}
    />
  );
};

export const BlogPromo: React.FC<BlogPromoProps> = (props) => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const isPortrait = height > width;

  const bg = props.brand.backgroundColor;

  const scenes = useMemo(() => {
    const baseScenes = props.scenes && props.scenes.length > 0 
      ? [...props.scenes] 
      : [{text: props.title, type: "title"} as Scene];
    
    // Always append the fixed CTA
    baseScenes.push({
      text: "Find more on HunterMussel",
      type: "call-to-action",
      audioFile: "static/cta.mp3",
      durationFrames: 90 // 3 seconds
    });

    return baseScenes;
  }, [props.scenes, props.title]);

  const transitionDuration = 15;

  return (
    <AbsoluteFill style={{backgroundColor: bg, fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial"}}>
      {/* Global audio if per-scene audio is missing */}
      {props.audioFile && (!scenes[0] || !scenes[0].audioFile) ? <Audio src={resolveAsset(props.audioFile) || ""} /> : null}
      
      {/* Immersive Background */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(1500px 800px at 10% 10%, ${props.brand.secondaryColor}33, transparent 70%),
radial-gradient(1200px 700px at 90% 90%, ${props.brand.primaryColor}33, transparent 70%),
linear-gradient(180deg, ${bg}, ${bg})`,
        }}
      />

      {/* Prominent Logo Background Overlay (Subtle but visible) */}
      <AbsoluteFill style={{justifyContent: "center", alignItems: "center", opacity: 0.05, pointerEvents: "none"}}>
         <Img 
           src={resolveAsset(props.brand.logoFile) || ""} 
           style={{
             width: isPortrait ? "80%" : "40%", 
             filter: "grayscale(1) brightness(2)"
           }} 
         />
      </AbsoluteFill>

      {/* Floating particles background (Subtle) */}
      <AbsoluteFill style={{opacity: 0.15}}>
         <div style={{
           position: "absolute",
           top: "20%",
           left: "15%",
           width: 400,
           height: 400,
           borderRadius: "50%",
           background: props.brand.primaryColor,
           filter: "blur(100px)",
           transform: `translateY(${Math.sin(frame/40) * 50}px)`
         }}/>
         <div style={{
           position: "absolute",
           bottom: "20%",
           right: "15%",
           width: 500,
           height: 500,
           borderRadius: "50%",
           background: props.brand.secondaryColor,
           filter: "blur(120px)",
           transform: `translateY(${Math.cos(frame/50) * 60}px)`
         }}/>
      </AbsoluteFill>

      {/* Branded elements (watermark) - MORE VISIBLE NOW */}
      <div style={{
        position: "absolute",
        top: 80,
        right: 80,
        zIndex: 1000,
        opacity: 0.9,
        display: "flex",
        alignItems: "center",
        gap: 20,
        backgroundColor: "#00000044",
        padding: "12px 24px",
        borderRadius: 20,
        backdropFilter: "blur(10px)",
        border: "1px solid #FFFFFF11"
      }}>
        <Img src={resolveAsset(props.brand.logoFile) || ""} style={{width: 40, height: 40, filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))"}} />
        <span style={{color: props.brand.textColor, fontWeight: 900, fontSize: 24, letterSpacing: 1}}>{props.brand.name}</span>
      </div>

      {/* Transition Series for smooth scene switching */}
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
                  fps={30}
                  url={props.url}
                  defaultImage={props.imageFile}
                />
              </TransitionSeries.Sequence>
              
              {!isLast && (
                <TransitionSeries.Transition
                  presentation={i % 2 === 0 ? slide({direction: "from-right"}) : fade()}
                  timing={linearTiming({durationInFrames: transitionDuration})}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>

      {/* Progress Bar */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        height: 10,
        background: `linear-gradient(90deg, ${props.brand.primaryColor}, ${props.brand.secondaryColor})`,
        width: `${(frame / durationInFrames) * 100}%`,
        zIndex: 1000,
        boxShadow: `0 -5px 20px ${props.brand.primaryColor}66`
      }} />
    </AbsoluteFill>
  );
};
