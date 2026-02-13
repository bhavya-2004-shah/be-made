import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type TextureConfig = {
  id: string;
  baseUrl: string;
  normalUrl: string;
  roughnessUrl: string;
  metalnessUrl: string;
};

export type TextureSet = {
  map: THREE.Texture;
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
  metalnessMap: THREE.Texture;
};

const textureCache = new Map<string, TextureSet>();
const MAX_CACHED_TEXTURES = 12;

function loadTexture(url: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(url, resolve, undefined, reject);
  });
}

function disposeTextureSet(set: TextureSet | null) {
  if (!set) return;
  Object.values(set).forEach((tex) => tex.dispose());
}

function getCachedTextureSet(id: string): TextureSet | null {
  const cached = textureCache.get(id);
  if (!cached) return null;
  // refresh LRU
  textureCache.delete(id);
  textureCache.set(id, cached);
  return cached;
}

function cacheTextureSet(id: string, set: TextureSet) {
  textureCache.set(id, set);
  if (textureCache.size <= MAX_CACHED_TEXTURES) return;

  const oldest = textureCache.entries().next().value as
    | [string, TextureSet]
    | undefined;
  if (!oldest) return;

  const [oldestId, oldestSet] = oldest;
  textureCache.delete(oldestId);
  disposeTextureSet(oldestSet);
}

export function useManualTextureTransition(texture: TextureConfig | null) {
  const [currentTextures, setCurrentTextures] = useState<TextureSet | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fadeRef = useRef(1);
  const isAnimatingRef = useRef(false);
  const currentIdRef = useRef<string | null>(null);
  const currentTexturesRef = useRef<TextureSet | null>(null);

  useEffect(() => {
    currentTexturesRef.current = currentTextures;
  }, [currentTextures]);

  useEffect(() => {
    if (!texture) return;
    if (currentIdRef.current === texture.id) return;

    let cancelled = false;

    const cached = getCachedTextureSet(texture.id);
    if (cached) {
      setCurrentTextures(cached);
      currentIdRef.current = texture.id;
      fadeRef.current = 0;
      isAnimatingRef.current = true;
      return;
    }

    async function load(nextTexture: TextureConfig) {
      setIsLoading(true);

      try {
        const [map, normalMap, roughnessMap, metalnessMap] =
          await Promise.all([
            loadTexture(nextTexture.baseUrl),
            loadTexture(nextTexture.normalUrl),
            loadTexture(nextTexture.roughnessUrl),
            loadTexture(nextTexture.metalnessUrl),
          ]);

        const set: TextureSet = {
          map,
          normalMap,
          roughnessMap,
          metalnessMap,
        };

        if (cancelled) {
          disposeTextureSet(set);
          return;
        }

        // texture setup
        map.colorSpace = THREE.SRGBColorSpace;
        map.anisotropy = 16;

        normalMap.colorSpace = THREE.LinearSRGBColorSpace;
        roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
        metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;

        Object.values(set).forEach((tex) => {
          tex.flipY = false;
          tex.wrapS = THREE.ClampToEdgeWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
        });

        cacheTextureSet(nextTexture.id, set);
        setCurrentTextures(set);
        currentIdRef.current = nextTexture.id;

        fadeRef.current = 0;
        isAnimatingRef.current = true;
      } catch (e) {
        console.error("Texture load failed", e);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load(texture);

    return () => {
      cancelled = true;
    };
  }, [texture]);

  useEffect(() => {
    return () => {
      currentTexturesRef.current = null;
    };
  }, []);

  return {
    textures: currentTextures,
    fadeRef,
    isAnimatingRef,
    isLoading,
  };
}
