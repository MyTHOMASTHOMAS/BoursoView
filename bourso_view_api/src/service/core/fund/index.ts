import read from "./fund.read";
import create from "./fund.create";
import remove from "./fund.delete";

export default {
    read,
    create,
    delete: remove
};
