import * as THREE from "three";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useRef, useMemo, useState, useEffect } from "react";
import { Trail } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

const Shoot = ({ player }) => {
    const { camera } = useThree();
    const [cubeMesh, setCubeMesh] = useState([]);
    const cubeRef = useRef();

    const position = useMemo(() => new THREE.Vector3(), []);
    const direction = useMemo(() => new THREE.Vector3(), []);

    const clickToCreateBox = () => {        
        if (document.pointerLockElement) {
            const camPos = camera.getWorldPosition(position);
            const camQuat = camera.getWorldQuaternion(new THREE.Quaternion());
            
            const d = 2;
            const v = new THREE.Vector3(0, 0, 1);
            v.applyQuaternion(camQuat);
            v.multiplyScalar(d);
            position.copy(camPos).add(v);
    
            const newMesh = (
                <mesh
                    position={[position.x, position.y, position.z]}
                    scale={0.5}
                    castShadow
                    receiveShadow
                >
                    <sphereGeometry args={[0.05]} />
                    <meshStandardMaterial color={0xaaaaff} />
                </mesh>
            );
            setCubeMesh((prevMeshes) => [...prevMeshes, newMesh]);
        }
    };

    useEffect(() => {
        camera.getWorldDirection(direction);
        if (cubeMesh.length > 0) {
            cubeRef.current?.setLinvel(
                new THREE.Vector3(
                    direction.x * 50,
                    direction.y * 50,
                    direction.z * 50
                ),
                false
            );
        }
    }, [cubeMesh]);

    useEffect(() => {
        window.addEventListener("click", () => clickToCreateBox());

        return () => {
            window.removeEventListener("click", () => clickToCreateBox());
        };
    }, []);

    return (
        <>
            {cubeMesh.map((item, i) => (
                <RigidBody key={i} colliders="ball" gravityScale={0} ref={cubeRef}>
                    <Trail width={1.6} color={0xaaaaff} attenuation={w => w - 0.2}>
                        {item}
                    </Trail>
                </RigidBody>
            ))}
        </>
    );
}

export default Shoot;