export const USER_ROLE = {
  contributor: "contributor",
  maintainer: "maintainer",
} as const;

export type TUserRole = keyof typeof USER_ROLE;

export interface JwtPayload {
  id: number;
  name: string;
  role: TUserRole;
}
