import * as actions from "./actions"


// actionMap devient un objet classique contenant { authAction: "auth", ... }
export const map = { ...actions };

// actionList génère automatiquement un tableau avec toutes les valeurs ["auth", ...]
export const list = Object.values(actions)

export type Type = (typeof actions)[keyof typeof actions];