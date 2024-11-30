import { get, writable } from 'svelte/store'
import { type Camo, type Category, parseCamos, parseCategories, parseWeaponCategoryMaps, parseWeapons, type Weapon, type WeaponCategoryMap } from "./structures";
import infoJson from "$lib/weapons.json"

export const weaponsList = writable<Weapon[]>()
export const categoryList = writable<Category[]>()
export const categoryWeaponMap = writable<WeaponCategoryMap[]>();

export const globalZombiesCamos = writable<Camo[]>();
export const globalMultiplayerCamos = writable<Camo[]>();
export const globalWarzoneCamos = writable<Camo[]>();

export function loadAll() {
    categoryList.set(parseCategories(infoJson.category))
    weaponsList.set(parseWeapons(infoJson.weapons))
    categoryWeaponMap.set(parseWeaponCategoryMaps(infoJson.category_weapon_map))
    
    globalZombiesCamos.set(parseCamos(infoJson.global_camo.zombies))
    globalMultiplayerCamos.set(parseCamos(infoJson.global_camo.multiplayer))
    globalWarzoneCamos.set(parseCamos(infoJson.global_camo.warzone))
}

export function getCategory(id: string) : Category | undefined {
    return get(categoryList).find(c => c.id == id);
}