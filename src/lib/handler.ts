import { get, writable } from 'svelte/store'
import { type Camo, type Category, type LocalProgress, type UserConfig, parseCamos, parseCategories, parseWeaponCategoryMaps, parseWeapons, type UnlockedWeaponCamo, type Weapon, type WeaponCategoryMap } from "./structures";
import infoJson from "$lib/weapons.json"

export const weaponsList = writable<Weapon[]>()
export const categoryList = writable<Category[]>()
export const categoryWeaponMap = writable<WeaponCategoryMap[]>();

export const globalZombiesCamos = writable<Camo[]>();
export const globalMultiplayerCamos = writable<Camo[]>();
export const globalWarzoneCamos = writable<Camo[]>();

export const defaultProgress: LocalProgress = {
    weapons: []
};

export const defaultUserConfig: UserConfig = {
    defaultMode: 0
}

export const progress = writable<LocalProgress>(defaultProgress)
export const config = writable<UserConfig>(defaultUserConfig)

export function loadAll() {
    categoryList.set(parseCategories(infoJson.category))
    weaponsList.set(parseWeapons(infoJson.weapons))
    categoryWeaponMap.set(parseWeaponCategoryMaps(infoJson.category_weapon_map))

    globalZombiesCamos.set(parseCamos(infoJson.global_camo.zombies))
    globalMultiplayerCamos.set(parseCamos(infoJson.global_camo.multiplayer))
    globalWarzoneCamos.set(parseCamos(infoJson.global_camo.warzone))
}

export function getDefaultMode(): number {
    return get(config).defaultMode
}

export function getCategory(id: string): Category | undefined {
    if (id.includes("TEST")) {
        return {
            display: "Test Category",
            id: "TEST"
        }
    }
    let category = get(categoryList);
    if (category === undefined) return undefined;
    return category.find(c => c.id == id);
}

export function getCamoProgress(storage: LocalProgress, id: string): UnlockedWeaponCamo {
    var index = storage.weapons.findIndex(x => x.weapon == id);
    if (index > -1) {
        return storage.weapons[index]
    } else {
        return {
            weapon: id,
            camo: []
        }
    }
}

export function getCamoProgressById(id: string): UnlockedWeaponCamo {
    let progressTemp = get(progress)
    return getCamoProgress(progressTemp, id)
}

export function updateCamoProgress(weaponProgress: UnlockedWeaponCamo) {
    var progressTemp = get(progress)

    var index = progressTemp.weapons.findIndex(x => x.weapon == weaponProgress.weapon);
    if (index > -1) {
        progressTemp.weapons[index] = weaponProgress
    } else {
        progressTemp.weapons.push(weaponProgress)
    }

    progress.set(progressTemp)
}


export function JSONtoDataURL(jsonString: string): string {
    const blob = 
    new Blob([jsonString], { type: "application/json" });

    return URL.createObjectURL(blob);
}
