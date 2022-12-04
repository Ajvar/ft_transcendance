export function getSavedItem(key : string) : any{
    const saved = localStorage.getItem(key);

    console.log('saved', saved)
    return saved ? JSON.parse(saved) : null;
}

export function saveItem(key: string, item: any) : void {
    localStorage.setItem(key, JSON.stringify(item));
}