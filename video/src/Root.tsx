import {Composition} from "remotion";
import {BlogPromo} from "./blog/BlogPromo";
import {calculateBlogPromoMetadata} from "./blog/calculate-metadata";
import {defaultBlogPromoProps} from "./blog/default-props";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="BlogPromo"
        component={BlogPromo}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultBlogPromoProps}
        calculateMetadata={calculateBlogPromoMetadata}
      />
      <Composition
        id="BlogPromoIG"
        component={BlogPromo}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultBlogPromoProps}
        calculateMetadata={calculateBlogPromoMetadata}
      />
    </>
  );
};
