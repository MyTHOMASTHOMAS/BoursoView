import read from "./referentiel.read"
import create from "./referentiel.create"
import remove from "./referentiel.delete"

export default {
    read,
    create,
    delete: remove
}