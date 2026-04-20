import read from "./transaction.read";
import create from "./transaction.create";
import remove from "./transaction.delete";

export default {
    read,
    create,
    delete: remove
};
