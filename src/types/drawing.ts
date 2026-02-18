export type Transform = {
  relativeTo?: string
  x: number
  y: number
  scale: number
  rotation: number
}

export type Polygon = {
  vertices: number[][]
  polygonTransform?: Transform
}

export type Revision = {
  version: string
  image: string
  date: string
  description: string
  changes: string[]
  imageTransform?: Transform
  polygon?: Polygon
}

export type Region = {
  polygon?: Polygon
  revisions: Revision[]
}

export type DisciplineData = {
  imageTransform?: Transform
  image?: string
  polygon?: Polygon
  regions?: Record<string, Region>
  revisions: Revision[]
}

export type Drawing = {
  id: string
  name: string
  image: string
  parent: string | null
  position: {
    vertices: number[][]
    imageTransform: Transform
  } | null
  disciplines?: Record<string, DisciplineData>
}

export type Metadata = {
  project: {
    name: string
    unit: string
  }
  disciplines: { name: string }[]
  drawings: Record<string, Drawing>
}

export type OverlayLayer = {
  disciplineName: string
  imageUrl: string
  transform: string | undefined
  imageTransform?: Transform
  opacity?: number
  blendMode?: 'normal' | 'multiply'
}
