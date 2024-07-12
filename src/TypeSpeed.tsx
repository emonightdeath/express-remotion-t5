import { spring } from "remotion";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";

const alphabetQwertyOrder = [
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
  'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
  'z', 'x', 'c', 'v', 'b', 'n', 'm'
];
const capXPos = [
  10, 70, 130, 190, 250, 310, 370, 430, 490, 550, // Positions for letters Q to P
  30, 90, 150, 210, 270, 330, 390, 450, 510, // Positions for letters A to L
  60, 120, 180, 240, 300, 360, 420 // Positions for letters Z to M
];
const capYPos = [
  10, 10, 10, 10, 10, 10, 10, 10, 10, 10, // Y positions for letters Q to P
  70, 70, 70, 70, 70, 70, 70, 70, 70, // Y positions for letters A to L
  130, 130, 130, 130, 130, 130, 130 // Y positions for letters Z to M
];

const unusedCap = {
  fill: "none",
  stroke: "blue",
  strokeWidth: 5,
}

//const sentence = "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG";

export const myCompSchema3 = z.object({
  fullString: z.string(),
});

export const TypeSpeed: React.FC<z.infer<typeof myCompSchema3>> = ({
  fullString: sentence, 
}) => {

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const keyboardTranslationProgress = spring({
    frame: frame - 150,
    fps,
    config: {
      damping: 100,
    },
  });
  
  // Move the logo up by 150 pixels once the transition starts
  const height = interpolate(
    keyboardTranslationProgress,
    [0, 1],
    [-1000, -250],
  );

  const letters= new Array
  for(let i=0; i<sentence.length; i++) {
    letters[i] = sentence[i]
  }

  // Fade out the animation at the end
  const outOpacity = interpolate(
    frame,
    [240 + (letters.length * 7) + 60, 240 + (letters.length * 7) + 90],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const curTime = new Date().toString()


  return (
    <AbsoluteFill style={{backgroundColor: "white"}}>
    <div style={{fontSize: 50}}>
      {curTime}
    </div>

      {/* <Sequence durationInFrames={30}>
        <Audio src={staticFile("q.wav")} endAt={30}/>
        <div 
          style={{
            fontSize: 100,
            textAlign: "center",
            fontFamily: "monospace",
            fontWeight: "bold",
            margin: "auto",
          }}
        >
          Can you type?
        </div>
      </Sequence> */}
      {/* <Sequence from={30} durationInFrames={75}>
        <Audio src={staticFile("sentence.wav")} startFrom={15} endAt={90}/>
        <div 
          style={{
            fontSize: 75,
            textAlign: "center",
            fontFamily: "monospace",
            fontWeight: "bold",
            margin: "auto",
          }}
        >
          {sentence}
        </div>
      </Sequence> */}
      {/* <Sequence from={105} durationInFrames={45}>
        <Audio src={staticFile("wpm.wav")} endAt={45}/>
        <div 
          style={{
            fontSize: 75,
            textAlign: "center",
            fontFamily: "monospace",
            fontWeight: "bold",
            margin: "auto",
          }}
        >
          At 60 WPM
        </div>
      </Sequence> */}
      
      {/* <Sequence from={150} durationInFrames={30}><div style={{fontSize: 300, fontFamily:"monospace", position: "absolute", left: 450, top: 300}}>3</div>
        <Audio src={staticFile("ready.wav")}/>
      </Sequence>
      <Sequence from={180} durationInFrames={30}><div style={{fontSize: 300, fontFamily:"monospace", position: "absolute", left: 450, top: 300}}>2</div></Sequence>
      <Sequence from={210} durationInFrames={30}><div style={{fontSize: 300, fontFamily:"monospace", position: "absolute", left: 450, top: 300}}>1</div>
        <Audio src={staticFile("go.wav")}/>
      </Sequence> */}

      <Sequence from={150} durationInFrames={90}>
        {letters.map((t, i) => {
          return (
              <div
                style={{
                  fontSize: 100,
                  fontWeight: "bold",
                  color: "grey",
                  position: "absolute",
                  top: 960,
                  left: 535 + (55 * i),
                  fontFamily: "monospace",
                  opacity: keyboardTranslationProgress,
                }}
              >
                {t}
              </div>
          )
        })}
      </Sequence>

      <div>
        {letters.map((t, i) => {

          let remLetters = new Array
          let posLetters = new Array
          remLetters = letters.slice(i+1, letters.length)
          posLetters = letters.slice(0, i).reverse()

          return (
            <>
              <Sequence key={i} from={240 + (i*7)} durationInFrames={7}>
              {/* <Audio src={staticFile("click2.mp3")}/> */}
                <div 
                  style={{
                    fontSize: 100,
                    fontWeight: "bold",
                    position: "relative",
                    top: 960,
                    left: 535,
                    fontFamily: "monospace",
                    textDecoration: "underline",
                  }}
                >
                  {t}
                  {remLetters.map((u, j) => (
                    <div 
                      key={j} 
                      style={{ 
                        fontSize: 100,
                        fontWeight: "bold",
                        color: "grey",
                        position: "absolute",
                        top: 0,
                        left: (j + 1) * 55,
                        fontFamily: "monospace",
                      }}
                    >
                      {u}
                    </div>
                  ))}
                  {posLetters.map((v, k) => (
                    <div 
                      key={k} 
                      style={{ 
                        fontSize: 100,
                        fontWeight: "bold",
                        color: "blue",
                        position: "absolute",
                        top: 0,
                        left: -(k + 1) * 55,
                        fontFamily: "monospace",
                      }}
                    >
                      {v}
                    </div>
                  ))}
                </div>

                <svg viewBox={`-100 0 810 1000`} style={{ position: "absolute", top: height + 1540 }}>
                  {alphabetQwertyOrder.map((cap, i) => (
                    <rect
                      key={i}
                      id={`cap${cap}`}
                      x={capXPos[i]}
                      y={capYPos[i]}
                      width={50}
                      height={50}
                      rx={10}
                      style={{
                        ...unusedCap,
                        fill: cap === t ? "blue" : "white"
                      }} // Apply style based on current letter
                    ></rect>
                  ))}
                  <rect
                    id={"capSpace"}
                    x={160}
                    y={190}
                    width={330}
                    height={50}
                    rx={10}
                    style={{
                      ...unusedCap,
                      fill: " " === t ? "blue" : "white"
                    }}
                  ></rect>
                </svg>
              </Sequence>
            </>
          )
        })}
        
      </div>

      <Sequence from={240 + letters.length * 7} durationInFrames={90}>
        {letters.reverse().map((t, i) => {
          return (
              <div
                style={{
                  fontSize: 100,
                  fontWeight: "bold",
                  color: "blue",
                  position: "absolute",
                  top: 960,
                  left: 535 - (55 * (i + 1)),
                  fontFamily: "monospace",
                  opacity: outOpacity,
                }}
              >
                {t}
              </div>
          )
        })}
      </Sequence>

      <Sequence from={150} durationInFrames={90}>
        <svg viewBox={`-100 ${height} 810 10`}>
          {alphabetQwertyOrder.map((cap, i) => (
            <rect
              key={i}
              id={`cap${cap}`}
              x={capXPos[i]}
              y={capYPos[i]}
              width={50}
              height={50}
              rx={10}
              style={unusedCap} // Apply style based on current letter
            ></rect>
          ))}
          <rect
            id={"capSpace"}
            x={160}
            y={190}
            width={330}
            height={50}
            rx={10}
            style={unusedCap}
          ></rect>
        </svg>
      </Sequence>

      <Sequence from={240 + (letters.length * 7)} durationInFrames={90}>
        <svg viewBox={`-100 ${height} 810 10`} style={{opacity: outOpacity}}>
          {alphabetQwertyOrder.map((cap, i) => (
            <rect
              key={i}
              id={`cap${cap}`}
              x={capXPos[i]}
              y={capYPos[i]}
              width={50}
              height={50}
              rx={10}
              style={unusedCap} // Apply style based on current letter
            ></rect>
          ))}
          <rect
            id={"capSpace"}
            x={160}
            y={190}
            width={330}
            height={50}
            rx={10}
            style={unusedCap}
          ></rect>
        </svg>
      </Sequence>

    
    </AbsoluteFill>
  );
};






