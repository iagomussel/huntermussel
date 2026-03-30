import type {CalculateMetadataFunction} from "remotion";
import {staticFile} from "remotion";
import {getAudioDurationInSeconds} from "@remotion/media-utils";
import type {BlogPromoProps, Scene} from "./types";
import {resolveAsset} from "./utils";

const DEFAULT_SCENE_DURATION_IN_FRAMES = 120;
const FPS = 30;

export const calculateBlogPromoMetadata: CalculateMetadataFunction<BlogPromoProps> =
  async ({props}) => {
    const transitionDuration = 15;
    
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
      
      const audioPath = resolveAsset(scene.audioFile);
      if (audioPath) {
        try {
          const seconds = await getAudioDurationInSeconds(audioPath);
          durationFrames = Math.ceil(seconds * FPS) + 10; // 10 frames padding
        } catch (e) {
          console.warn(`Failed to get duration for ${scene.audioFile}`);
        }
      }
      
      scenesWithDuration.push({...scene, durationFrames});
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
