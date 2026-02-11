export type BaseInfoJson = {
  id: string;
  name: string;
  model: string;
  preview: string;
  thumbnail: string;
  colors: [
    {
      id: string;
      name: string;
      baseColor: string;
      metalness: string;
      normal: string;
      roughness: string;
      preview: string;
      thumbnail: string;
    },
  ];
};

export type BaseColorInfoJson = { 
       id: string;
      name: string;
      baseColor: string;
      metalness: string;
      normal: string;
      roughness: string;
      preview: string;
      thumbnail: string;
}

export type TableTopInfoJson = { 
  id: string,
  label : string,
  preview : string ,
  modelUrl : string,
  modelMdfUrl : string,
  dimensionConstraints :{
    minlength : number,
    maxlength : number,
    minWidth : number,
    maxWidth : number,
  }
}

export interface TableTopColorJson {
  id: string;
  name: string;
  className: string;
  description: string;
  baseUrl: string;
  mdfUrl: string;
  metalnessUrl: string;
  normalUrl: string;
  previewUrl: string;
  roughnessUrl: string;
  sample_previewUrl: string;
}

export type ChairsInfoJson = {
  id:string ,
  name : string ,
  glbUrl : string ,
  colors : [
    {
      id: string ,
      name : string,
      chairLegColor : string,
      chairLegMetalness : string ,
      chaieLegNormal : string ,
      chairLegRoughness : string , 
      chairTopColor : string ,
      chairTopMetalness : string ,
      chairTopNormal : string ,
      chairTopRoughness : string , 
      previewUrl : string ,
      thumbnailUrl : string
    }
  ]
}

export type ChairColorInfoJson = { 
  id: string ,
      name : string,
      chairLegColor : string,
      chairLegMetalness : string ,
      chaieLegNormal : string ,
      chairLegRoughness : string , 
      chairTopColor : string ,
      chairTopMetalness : string ,
      chairTopNormal : string ,
      chairTopRoughness : string , 
      previewUrl : string ,
      thumbnailUrl : string
}

export type ChairTransform = {
  position: [number, number, number];
  rotation: [number, number, number];
};