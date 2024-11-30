export interface Weapon {
    id: string,
    name: string,
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
    category: string,
    require?: string,
    display: string,
    image: string,
    amount: bigint,
    description: string
}

export interface Notice {
    zombies?: string,
    multiplayer?: string,
    warzone?: string
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
    progress: number,
    done: boolean
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
        notice: value.notice ? parseNotice(value.notice) : undefined,
        image: value.image,
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
        category: value.category,
        require: value.require,
        display: value.display,
        image: value.image,
        amount: value.amount ? BigInt(value.amount) : BigInt(0),
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
        zombies: value.zombies ? value.zombies : undefined,
        multiplayer: value.multiplayer ? value.multiplayer : undefined,
        warzone: value.warzone ? value.warzone : undefined
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
        done: value.done,
        progress: value.progress
    };
}
