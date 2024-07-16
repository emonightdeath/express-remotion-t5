import { spring } from "remotion";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Logo } from "./HelloWorld/Logo";
import { Subtitle } from "./HelloWorld/Subtitle";
import { Title } from "./HelloWorld/Title";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const myCompSchema = z.object({
  titleText: z.string(),
  titleColor: zColor(),
  logoColor1: zColor(),
  logoColor2: zColor(),
});

export const HelloWorld: React.FC<z.infer<typeof myCompSchema>> = ({
  titleText: propOne,
  titleColor: propTwo,
  logoColor1,
  logoColor2,
}) => {

  // A <AbsoluteFill> is just a absolutely positioned <div>!
  return (
    <AbsoluteFill>
      <div style={{height: 100}}>
        <img src="https://img.pokemondb.net/sprites/scarlet-violet/normal/tinkatuff.png" alt="Tinkatuff"/>
      </div>
      <div style={{height: 100, marginTop: 400}}>
        <img src="https://img.pokemondb.net/sprites/black-white/anim/normal/hydreigon.gif" alt="Tinkatuff"/>
      </div>
      {/* <div style={{height: 100}}>
        <img src="https://img.pokemondb.net/sprites/scarlet-violet/normal/tinkatuff.png" alt="Tinkatuff"/>
      </div> */}
          
        {/* <img src="https://img.pokemondb.net/sprites/sword-shield/normal/glastrier.png" alt="Glastrier"/> */}

        
    </AbsoluteFill>
  );
};
