export default class Node {
    constructor(value: any);
    get value(): any;
    get next(): any;
    get [Symbol.toStringTag](): string;
    #private;
}
