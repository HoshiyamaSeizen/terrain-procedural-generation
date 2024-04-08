import { ThreeElements, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import React from 'react';

import grassTextureURL from '../textures/grass.jpg';
import rockTextureURL from '../textures/rock.jpg';

const MountainMaterial = (props: ThreeElements['shaderMaterial']) => {
	const [grassTexture, rockTexture] = useLoader(TextureLoader, [grassTextureURL, rockTextureURL]);

	const uniforms = {
		grassTexture: { value: grassTexture },
		rockTexture: { value: rockTexture },
		slopeThreshold: { value: 0.85 },
	};

	const vertexShader = `    
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `;

	const fragmentShader = `
  uniform sampler2D grassTexture;
  uniform sampler2D rockTexture;
  uniform float slopeThreshold;

  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    float slope = abs(vNormal.y);
    vec4 grassColor = texture2D(grassTexture, vUv);
    vec4 rockColor = texture2D(rockTexture, vUv);
    vec4 finalColor = mix(rockColor, grassColor, smoothstep(slopeThreshold, slopeThreshold + 0.1, slope));
    gl_FragColor = finalColor;
  }
  `;

	return (
		<shaderMaterial
			{...props}
			uniforms={uniforms}
			vertexShader={vertexShader}
			fragmentShader={fragmentShader}
		/>
	);
};

export default MountainMaterial;
