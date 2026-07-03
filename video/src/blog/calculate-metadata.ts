import type {CalculateMetadataFunction} from "remotion";
import {staticFile} from "remotion";
import {getAudioDurationInSeconds, getVideoMetadata} from "@remotion/media-utils";
import type {BlogPromoProps, Scene} from "./types";
import {resolveAsset} from "./utils";
import {TRANSITION_DURATION_FRAMES} from "./constants";

const DEFAULT_SCENE_DURATION_IN_FRAMES = 120;
const FPS = 30;

export const calculateBlogPromoMetadata: CalculateMetadataFunction<BlogPromoProps> =
  async ({props}) => {
    const transitionDuration = TRANSITION_DURATION_FRAMES;
    
    // Create the final scene list including the CTA
    const allScenes = props.scenes ? [...props.scenes] : [];
    allScenes.push({
      text: "Find more on HunterMussel",
      type: "call-to-action",
      audioFile: "static/cta.mp3"
    });

    let totalFrames = 0;
    const scenesWithDuration: Scene[] = [];

    for (let i = 0; i < allScenes.length; i++) {
      const scene = allScenes[i];
      let durationFrames = DEFAULT_SCENE_DURATION_IN_FRAMES;

      // Fall back to the global audio track for scenes that don't have their own.
      const sceneAudioFile = scene.audioFile || (i === 0 ? props.audioFile : undefined);
      const audioPath = resolveAsset(sceneAudioFile);
      if (audioPath) {
        try {
          const seconds = await getAudioDurationInSeconds(audioPath);
          durationFrames = Math.ceil(seconds * FPS) + 10; // 10 frames padding
        } catch (e) {
          console.warn(`Failed to get duration for ${scene.audioFile}`);
        }
      }
      
      let videoDurationFrames: number | undefined;
      const videoPath = resolveAsset(scene.videoFile);
      if (videoPath) {
        try {
          const meta = await getVideoMetadata(videoPath);
          videoDurationFrames = Math.floor(meta.durationInSeconds * FPS);
        } catch (e) {
          console.warn(`Failed to get video metadata for ${scene.videoFile}`);
        }
      }

      scenesWithDuration.push({...scene, durationFrames, videoDurationFrames});
      totalFrames += durationFrames;
      
      // Subtract transition overlap for all but the last scene
      if (i < allScenes.length - 1) {
        totalFrames -= transitionDuration;
      }
    }

    return {
      durationInFrames: Math.min(3600, Math.max(150, totalFrames)),
      props: {
        ...props,
        scenes: scenesWithDuration
      }
    };
  };
