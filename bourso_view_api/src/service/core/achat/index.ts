import read from "./achat.read";
import create from "./achat.create";
import remove from "./achat.delete";

export default {
    read,
    create,
    delete: remove
};
