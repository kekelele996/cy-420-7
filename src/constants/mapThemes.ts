export enum MapThemeId {
  OCEAN = 'ocean',
  FOREST = 'forest',
  DESERT = 'desert',
  VOLCANO = 'volcano',
}

export interface MapThemeColors {
  background: string;
  grid: string;
  trail: string;
  territory: string;
  obstacle: string;
}

export interface MapTheme {
  id: MapThemeId;
  name: string;
  colors: MapThemeColors;
  obstaclePattern: (x: number, y: number, width: number, height: number) => boolean;
}

const OCEAN_THEME: MapTheme = {
  id: MapThemeId.OCEAN,
  name: '海洋',
  colors: {
    background: '#e6f4ff',
    grid: '#b8dfff',
    trail: '#1890ff',
    territory: '#69c0ff',
    obstacle: '#096dd9',
  },
  obstaclePattern: (x, y, width, height) => {
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1) return true;
    if (x === Math.floor(width / 2) && y > 2 && y < height - 3) return true;
    if (y === Math.floor(height / 2) && x > 2 && x < width - 3) return true;
    return false;
  },
};

const FOREST_THEME: MapTheme = {
  id: MapThemeId.FOREST,
  name: '森林',
  colors: {
    background: '#f0fff0',
    grid: '#b7eb8f',
    trail: '#52c41a',
    territory: '#95de64',
    obstacle: '#237804',
  },
  obstaclePattern: (x, y, width, height) => {
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1) return true;
    const cx = Math.floor(width / 2);
    const cy = Math.floor(height / 2);
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        if (x === cx + i && y === cy + j && (i + j) % 2 === 0) return true;
      }
    }
    if (x === 4 && y > 3 && y < height - 4) return true;
    if (x === width - 5 && y > 3 && y < height - 4) return true;
    return false;
  },
};

const DESERT_THEME: MapTheme = {
  id: MapThemeId.DESERT,
  name: '沙漠',
  colors: {
    background: '#fffbe6',
    grid: '#ffe58f',
    trail: '#faad14',
    territory: '#ffd666',
    obstacle: '#d46b08',
  },
  obstaclePattern: (x, y, width, height) => {
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1) return true;
    if ((x + y) % 7 === 0 && x > 3 && y > 3 && x < width - 4 && y < height - 4) return true;
    return false;
  },
};

const VOLCANO_THEME: MapTheme = {
  id: MapThemeId.VOLCANO,
  name: '火山',
  colors: {
    background: '#fff1f0',
    grid: '#ffccc7',
    trail: '#f5222d',
    territory: '#ff7875',
    obstacle: '#8b0000',
  },
  obstaclePattern: (x, y, width, height) => {
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1) return true;
    const cx = Math.floor(width / 2);
    const cy = Math.floor(height / 2);
    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    if (dist < 3 && dist > 1.2) return true;
    if (x === 3 && (y < 5 || y > height - 6)) return true;
    if (x === width - 4 && (y < 5 || y > height - 6)) return true;
    return false;
  },
};

export const MAP_THEMES: Record<MapThemeId, MapTheme> = {
  [MapThemeId.OCEAN]: OCEAN_THEME,
  [MapThemeId.FOREST]: FOREST_THEME,
  [MapThemeId.DESERT]: DESERT_THEME,
  [MapThemeId.VOLCANO]: VOLCANO_THEME,
};

export const DEFAULT_MAP_THEME = MapThemeId.OCEAN;

export const getMapTheme = (id: MapThemeId): MapTheme => MAP_THEMES[id] || OCEAN_THEME;
