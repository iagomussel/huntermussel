import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
} from "remotion";
import type {BlogPromoProps, Scene} from "./types";
import {resolveAsset} from "./utils";

export const SceneRenderer: React.FC<{
  scene: Scene;
  brand: BlogPromoProps["brand"];
  isPortrait: boolean;
  frame: number;
  fps: number;
  url: string;
  defaultImage?: string;
}> = ({scene, brand, isPortrait, frame, fps, url, defaultImage}) => {
  const primary = brand.primaryColor;
  const text = brand.textColor;
  const bg = brand.backgroundColor;

  // Common animation values
  const springConfig = {damping: 12, mass: 0.5, stiffness: 100};
  const entrance = spring({fps, frame, config: springConfig});
  
  // Floating animation
  const float = Math.sin(frame / 20) * 10;
  const rotate = Math.cos(frame / 25) * 1.5;

  const resolvedImage = scene.imageFile || defaultImage || "blog/placeholder.jpg";

  const bgImage = (
    <AbsoluteFill style={{opacity: 0.4}}>
      <Img 
        src={resolveAsset(resolvedImage) || ""} 
        style={{
          width: "100%", 
          height: "100%", 
          objectFit: "cover",
          filter: "blur(4px) brightness(0.5)",
          transform: `scale(${interpolate(frame, [0, 300], [1.1, 1.3])})`
        }} 
      />
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill>
      {scene.audioFile ? <Audio src={resolveAsset(scene.audioFile) || ""} /> : null}

      {scene.type === "title" && (
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center", padding: 64, opacity: interpolate(frame, [0, 10], [0, 1], {extrapolateRight: "clamp"})}}>
          {bgImage}
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 32, transform: `scale(${interpolate(entrance, [0, 1], [0.8, 1])})`, zIndex: 10}}>
            <div style={{
              padding: "12px 24px",
              backgroundColor: primary + "33",
              backdropFilter: "blur(10px)",
              border: `2px solid ${primary}66`,
              borderRadius: 999,
              color: primary,
              fontSize: 22,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 4,
              boxShadow: `0 0 40px ${primary}22`
            }}>
              Trending
            </div>
            <h1 style={{
              margin: 0, 
              color: text, 
              fontSize: isPortrait ? 80 : 110, 
              fontWeight: 950, 
              lineHeight: 0.95, 
              textWrap: "balance",
              textShadow: "0 20px 40px rgba(0,0,0,0.5)"
            }}>
              {scene.text}
            </h1>
          </div>
        </AbsoluteFill>
      )}

      {scene.type === "bullet" && (
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center", padding: 80}}>
          {bgImage}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
            backgroundColor: "#00000088",
            backdropFilter: "blur(20px)",
            border: "1px solid #FFFFFF1A",
            padding: "60px 80px",
            borderRadius: 50,
            transform: `translateX(${interpolate(entrance, [0, 1], [100, 0])}px)`,
            boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
            zIndex: 10
          }}>
            <div style={{
              width: 32, 
              height: 32, 
              borderRadius: 10, 
              background: `linear-gradient(45deg, ${primary}, ${brand.secondaryColor})`,
              boxShadow: `0 0 30px ${primary}66`
            }} />
            <div style={{color: text, fontSize: isPortrait ? 52 : 64, fontWeight: 800, lineHeight: 1.1}}>
              {scene.text}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {(scene.type === "image" || scene.type === "full-image") && (
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center", padding: scene.type === "full-image" ? 0 : 80}}>
          <div style={{
            display: "flex",
            flexDirection: isPortrait ? "column" : "row",
            alignItems: "center",
            gap: scene.type === "full-image" ? 0 : 64,
            width: "100%",
            height: "100%"
          }}>
            <div style={{
              flex: 1.2,
              borderRadius: scene.type === "full-image" ? 0 : 40,
              overflow: "hidden",
              boxShadow: scene.type === "full-image" ? "none" : "0 60px 120px rgba(0,0,0,0.6)",
              border: scene.type === "full-image" ? "none" : "1px solid #FFFFFF1A",
              height: "100%",
              position: "relative",
              transform: scene.type === "full-image" ? "none" : `translateY(${float}px) rotate(${rotate}deg)`
            }}>
              <Img src={resolveAsset(resolvedImage) || ""} style={{
                width: "100%", 
                height: "100%", 
                objectFit: "cover",
                transform: `scale(${interpolate(frame, [0, 300], [1, 1.2])})`
              }} />
              {scene.type === "full-image" && (
                <AbsoluteFill style={{
                  background: "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.85))",
                  justifyContent: "flex-end",
                  padding: 100
                }}>
                  <div style={{
                    color: text, 
                    fontSize: isPortrait ? 64 : 86, 
                    fontWeight: 950, 
                    lineHeight: 1, 
                    textWrap: "balance", 
                    maxWidth: 1300,
                    transform: `translateY(${interpolate(entrance, [0.2, 1], [40, 0], {extrapolateLeft: "clamp"})}px)`
                  }}>
                    {scene.text}
                  </div>
                </AbsoluteFill>
              )}
            </div>
            {scene.type !== "full-image" && (
              <div style={{
                flex: 0.8, 
                color: text, 
                fontSize: isPortrait ? 42 : 56, 
                fontWeight: 900, 
                lineHeight: 1, 
                textWrap: "balance",
                transform: `translateX(${interpolate(entrance, [0.2, 1], [40, 0], {extrapolateLeft: "clamp"})}px)`
              }}>
                {scene.text}
              </div>
            )}
          </div>
        </AbsoluteFill>
      )}

      {scene.type === "feature" && (
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center", padding: 80}}>
          {bgImage}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 48,
            textAlign: "center",
            transform: `scale(${interpolate(entrance, [0, 1], [0.5, 1])})`,
            zIndex: 10
          }}>
            <div style={{
              width: 180,
              height: 180,
              borderRadius: 45,
              backgroundColor: primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 30px 60px ${primary}44`,
              transform: `rotate(${rotate * 5}deg)`
            }}>
               <div style={{width: 80, height: 80, border: `12px solid ${bg}`, borderRadius: 20}} />
            </div>
            <h2 style={{
              margin: 0, 
              color: text, 
              fontSize: isPortrait ? 64 : 86, 
              fontWeight: 950, 
              lineHeight: 0.95, 
              textWrap: "balance",
              textShadow: "0 20px 40px rgba(0,0,0,0.4)"
            }}>
              {scene.text}
            </h2>
          </div>
        </AbsoluteFill>
      )}

      {scene.type === "quote" && (
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center", padding: 120}}>
          {bgImage}
          <div style={{textAlign: "center", zIndex: 10}}>
            <div style={{
              fontSize: 180, 
              color: primary, 
              lineHeight: 0.1, 
              marginBottom: 60, 
              opacity: 0.4,
              fontFamily: "serif"
            }}>"</div>
            <p style={{
              margin: 0, 
              color: text, 
              fontSize: isPortrait ? 48 : 72, 
              fontWeight: 800, 
              fontStyle: "italic", 
              lineHeight: 1.1, 
              textWrap: "balance",
              transform: `translateY(${float/2}px)`
            }}>
              {scene.text}
            </p>
          </div>
        </AbsoluteFill>
      )}

      {scene.type === "call-to-action" && (
        <AbsoluteFill style={{justifyContent: "center", alignItems: "center", padding: 64}}>
          {bgImage}
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 60, zIndex: 10}}>
            <h2 style={{
              margin: 0, 
              color: text, 
              fontSize: isPortrait ? 64 : 86, 
              fontWeight: 950,
              textShadow: "0 20px 40px rgba(0,0,0,0.2)"
            }}>{scene.text}</h2>
            <div style={{
              backgroundColor: primary,
              color: bg,
              padding: "32px 64px",
              borderRadius: 30,
              fontSize: 42,
              fontWeight: 900,
              boxShadow: `0 30px 70px ${primary}66`,
              transform: `translateY(${float}px)`
            }}>
              {url.replace(/^https?:\/\//, "")}
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
