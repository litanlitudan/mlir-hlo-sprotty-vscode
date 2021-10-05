/******************************************************************************
 * Copyright 2021 TypeFox GmbH and others
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

 import { SNode } from './sprotty-node/model';

export interface Foo extends SNode {
    myProp1: string
}

export interface Bar extends SNode {
    myProp2: number
}
