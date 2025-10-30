import { atom } from "jotai";
import type { Session, User } from "@supabase/supabase-js";

export const authSessionAtom = atom<Session | null>(null);
export const authUserAtom = atom<User | null>(null);
export const isAuthenticatedAtom = atom((get) => Boolean(get(authUserAtom)));