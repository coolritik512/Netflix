export type Position = {
  top: number;
  left: number;
};

export interface MovieVideoResult<T> {
  id: number;
  results: T;
  [k: string]: unknown;
}
export type MovieVideoInfo = {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
  [k: string]: unknown;
};

export type UserProfile = {
  id: string;
  imageUrl: string;
  name: string;
};

export type ActionType =
  | {
      type: "add" | "delete" | "edit" | "current";
      payload: Partial<UserProfile>;
    }
  | { type: "load"; payload: any };

export type ProfileContextType = {
  profiles: UserProfile[];
  selectedProfileId: string;
};
