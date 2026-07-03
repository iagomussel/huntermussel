import {Config} from "@remotion/cli/config";

Config.setOverwriteOutput(true);
Config.setCodec("h264");
Config.setVideoImageFormat("jpeg");
// Force standard limited-range yuv420p + bt709. Without this, Remotion's
// JPEG frame capture produces full-range yuvj420p with unset color
// primaries, which ffmpeg/VLC decode fine but Windows' hardware H.264
// decoder (and many mobile/strict decoders) reject with NAL/slice errors.
Config.setPixelFormat("yuv420p");
Config.setColorSpace("bt709");
