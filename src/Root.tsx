import { Composition } from "remotion";
import { TypeSpeed, myCompSchema3 } from "./TypeSpeed";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="TypeSpeedTest"
        component={TypeSpeed}
        durationInFrames={3000}
        fps={30}
        width={1080}
        height={1920}
        schema={myCompSchema3}
        defaultProps={{
          fullString: "text to enter",
        }}
      />
    </>
  );
};
