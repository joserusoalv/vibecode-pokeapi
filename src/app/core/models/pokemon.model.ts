export interface PokemonBase {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonBase[];
}

export interface PokemonExtendedBase extends PokemonBase {
  id: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  weight: number;
  height: number;
  base_experience: number;
  types: {
    slot: number;
    type: PokemonBase;
  }[];
  sprites: {
    front_default: string | null;
    back_default: string | null;
    front_shiny: string | null;
    back_shiny: string | null;
    other: any;
    versions: any;
  };
  stats: {
    base_stat: number;
    effort: number;
    stat: PokemonBase;
  }[];
  cries: {
    latest: string;
    legacy: string;
  };
  moves: {
    move: PokemonBase;
  }[];
}

export interface MoveDetail {
  id: number;
  name: string;
  accuracy: number | null;
  power: number | null;
  pp: number;
  priority: number;
  names: {
    name: string;
    language: PokemonBase;
  }[];
  type: PokemonBase;
  effect_entries: {
    effect: string;
    short_effect: string;
    language: PokemonBase;
  }[];
}

export interface TypeDetail {
  id: number;
  name: string;
  sprites: {
    'generation-iii': {
      'diamond-pearl': {
        name_icon: string;
      };
    };
  };
}
