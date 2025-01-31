export interface Weapon {
    id: string,
    name: string,
    release: number,
    notice?: Notice
    image: string,
    category: string,
    camos: Camo[]
}

export interface Category {
    id: string,
    display: string
}

export interface Camo {
    id: string,
    position: number,
    category: string,
    require?: string,
    display: string,
    image: string,
    amount: number,
    description: string
}

export interface Notice {
    zombies?: string,
    multiplayer?: string,
    warzone?: string
    global?: string
}

export interface WeaponCategoryMap {
    category: string,
    weapons: string[]
}

export interface LocalProgress {
    weapons: UnlockedWeaponCamo[]
}

export interface UnlockedWeaponCamo {
    weapon: string,
    camo: CamoProgress[]
}

export interface CamoProgress {
    id: string,
    position: number,
    category: string,
    progress: number,
    done: boolean
}

export interface UserConfig {
    defaultMode: number
}

export interface CategoryOverwrite {
    category: string
    masteryRequiredAmount: number,
    overwriteCamos: Camo[]
}

export function parseCategoryOverwrite(value: any) : CategoryOverwrite {
    return {
        category: value.category,
        masteryRequiredAmount: value.masteryRequiredAmount,
        overwriteCamos: parseCamos(value.overwriteCamos)
    }
}

export function parseCategoryOverwrites(values: any): CategoryOverwrite[] {
    let array: CategoryOverwrite[] = [];

    for (const value of values) {
        array.push(parseCategoryOverwrite(value));
    }

    return array;
}

export function parseUserConfig(value: any): UserConfig {
    return {
        defaultMode: value.defaultMode
    };
}

export function parseCategories(values: any): Category[] {
    let array: Category[] = [];

    for (const value of values) {
        array.push(parseCategory(value));
    }

    return array;
}

export function parseCategory(value: any): Category {
    return {
        id: value.id,
        display: value.display,
    };
}

// Parsing methods for Weapon, Camo, Notice, and WeaponCategoryMap

export function parseWeapons(values: any): Weapon[] {
    let array: Weapon[] = [];

    for (const value of values) {
        array.push(parseWeapon(value));
    }

    return array;
}

export function parseWeapon(value: any): Weapon {
    return {
        id: value.id,
        name: value.name,
        release: value.release,
        notice: value.notice ? parseNotice(value.notice) : undefined,
        image: (value.image as string)/*.replace("https://camo.presti.me", "http://localhost:5173")*/,
        category: value.category,
        camos: value.camos ? parseCamos(value.camos) : []
    };
}

export function parseCamos(values: any): Camo[] {
    let array: Camo[] = [];

    for (const value of values) {
        array.push(parseCamo(value));
    }

    return array;
}

export function parseCamo(value: any): Camo {
    return {
        id: value.id,
        position: value.position,
        category: value.category,
        require: value.require,
        display: value.display,
        image: (value.image as string)/*.replace("https://camo.presti.me", "http://localhost:5173")*/,
        amount: value.amount ? Number(value.amount) : Number(0),
        description: value.description
    };
}

export function parseNotices(values: any): Notice[] {
    let array: Notice[] = [];

    for (const value of values) {
        array.push(parseNotice(value));
    }

    return array;
}

export function parseNotice(value: any): Notice {
    return {
        zombies: value.zombies || undefined,
        multiplayer: value.multiplayer || undefined,
        warzone: value.warzone || undefined,
        global: value.global || undefined,
    };
}

export function parseWeaponCategoryMaps(values: any): WeaponCategoryMap[] {
    let array: WeaponCategoryMap[] = [];

    for (const value of values) {
        array.push(parseWeaponCategoryMap(value));
    }

    return array;
}

export function parseWeaponCategoryMap(value: any): WeaponCategoryMap {
    return {
        category: value.category,
        weapons: value.weapons
    };
}

export function parseLocalProgress(value: any): LocalProgress {
    let weaponsFromValue = value.weapons
    return {
        weapons: weaponsFromValue ? parseWeaponCamoUnlocks(weaponsFromValue) : [],
    };
}

export function parseWeaponCamoUnlocks(values: any): UnlockedWeaponCamo[] {
    let array: UnlockedWeaponCamo[] = [];

    for (const value of values) {
        let temp = parseWeaponCamoUnlock(value)
        array.push(temp);
    }

    return array;
}

export function parseWeaponCamoUnlock(value: any): UnlockedWeaponCamo {
    return {
        camo: parseCamoProgresses(value.camo),
        weapon: value.weapon,
    };
}

export function parseCamoProgresses(values: any): CamoProgress[] {
    let array: CamoProgress[] = [];

    for (const value of values) {
        let temp = parseCamoProgress(value)
        array.push(temp);
    }

    return array;
}

export function parseCamoProgress(value: any): CamoProgress {
    return {
        id: value.id,
        position: value.position,
        category: value.category,
        done: value.done,
        progress: value.progress
    };
}
