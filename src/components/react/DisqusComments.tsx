import { DiscussionEmbed } from "disqus-react";

type Props = {
  title: string;
  identifier: string;
  url: string;
};

const DisqusComments = ({ title, identifier, url }: Props) => {
  return (
    <div className="mt-10">
      <DiscussionEmbed
        shortname="huntermussel"
        config={{
          url,
          identifier,
          title,
          language: "en_US",
        }}
      />
    </div>
  );
};

export default DisqusComments;
