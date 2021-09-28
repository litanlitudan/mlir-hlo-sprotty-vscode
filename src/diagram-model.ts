import { SNode } from './sprotty-node/model';

export interface Foo extends SNode {
    myProp1: string
}

export interface Bar extends SNode {
    myProp2: number
}
