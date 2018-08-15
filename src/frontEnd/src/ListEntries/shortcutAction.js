
export const  SHORTCUT = 'LISTENTRIES_SHORTCUT';
export const  EDIT_NEXT = 'LISTENTRIES_EDIT_NEXT';
export const  DUPLICATE = "LISTENTRIES_DUPLICATE"
export const  PUSH_ENTRY = "LISTENTRIES_PUSH"

export function editNext() {
    return {
        type:SHORTCUT,
        shortcut:EDIT_NEXT
    }
}
export function duplicateMsgid() {
    return {
        type:SHORTCUT,
        shortcut: DUPLICATE
    }
}
export function pushEntry() {
    return {
        type:SHORTCUT,
        shortcut: PUSH_ENTRY
    }
}
