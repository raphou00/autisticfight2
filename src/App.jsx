import * as THREE from "three";
import { useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Gltf, Sky, KeyboardControls, Stars, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom, SSAO } from "@react-three/postprocessing";
import { Physics, RigidBody } from "@react-three/rapier";
import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from "ecctrl";
import Shoot from "./components/Shoot";

const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] }
];

const animationSet = {
    idle: "Draw",
    walk: "Draw",
    run: "Draw",
    jump: "Draw",
    jumpIdle: "Draw",
    jumpLand: "Draw",
    fall: "Draw",
    action1: "Draw",
};

const Scene = () => {
    const player = useRef();

    const spotLight = new THREE.SpotLight(0xffffff, 3000);
    spotLight.position.set(-80, 60, -40);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.5;
    spotLight.decay = 1.9;
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.radius = 8;

    useFrame((state) => {
        player.current.rotation.x = state.camera.getWorldDirection(new THREE.Vector3()).y * -1;
    });

    useEffect(() => {
        const audio = new Audio("/audios/music.mp3");
        audio.volume = 0.5;
        audio.loop = true;
        audio.play();
    }, []);

    return (
        <Physics timeStep="vary">

            <fog attach="fog" args={["#555577", 150, 200]} />
            <primitive object={spotLight} />
            <ambientLight color={0x6666aa} />
            
            <Sky distance={45000} sunPosition={[-200, 0, 0]} rayleigh={100} />
            <Stars />

            <EffectComposer enableNormalPass>
                <Bloom threshold={0.001} opacity={0.2} />
                <SSAO radius={0.005} samples={10} rings={5} />
            </EffectComposer>

            <RigidBody
                colliders="trimesh"
                type="fixed"
            >
                <Gltf
                    src="/models/map/scene.gltf"
                    position={[0, 0, 0]}
                    receiveShadow
                    castShadow
                />
            </RigidBody>


            <KeyboardControls map={keyboardMap}>
                <Ecctrl
                    mode="CameraBasedMovement"
                    camInitDis={-0.01}
                    camMinDis={-0.01}
                    camFollowMult={100}
                    turnVelMultiplier={1}
                    turnSpeed={100}
                    maxVelLimit={5}
                    sprintMult={1.5}
                    rotationSpeed={15}
                    position={[0, 100, 0]}
                    animated
                >
                    <EcctrlAnimation characterURL="/models/player/scene.gltf" animationSet={animationSet}>
                        <Gltf
                            ref={player}
                            src="/models/player/scene.gltf"
                            position={[-0.2, 0.5, 0]}
                            receiveShadow
                            castShadow
                        />
                    </EcctrlAnimation>
                </Ecctrl>
            </KeyboardControls>

            <Shoot player={player} />

        </Physics>
    );
}

const App = () => {
    return (
        <div className="h-screen">

            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-px h-px border bg-white z-50" />

            <EcctrlJoystick buttonNumber={2} />

            <Canvas
                gl={{ powerPreference: "high-performance" }}
                onPointerDown={(e) => {
                    if (e.pointerType === "mouse") {
                        e.target.requestPointerLock()
                    }
                }}
                shadows
            >
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>

        </div>
    );
}

export default App;
<<<<<<< HEAD
=======

useGLTF.preload("/models/map/scene.gltf");
useGLTF.preload("/models/player/scene.gltf");
>>>>>>> 44ccd0d8795bc210bc97cb8f9c6cbf59ac0ee010
