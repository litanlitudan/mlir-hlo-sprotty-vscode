/******************************************************************************
 * Copyright 2021 TypeFox GmbH and others
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

 import { Bar, Foo } from './diagram-model';
import { SEdge, SModelRoot } from './sprotty-node/model';

export async function generateDiagram(context: Generator.Context): Promise<SModelRoot> {
    // TODO read the source model from context.options.sourceUri, transform to a diagram model
    return {
        type: 'graph',
        id: 'root',
        children: [
            <Foo>{
                type: 'node:foo',
                id: 'node01',
                myProp1: 'abcd',
                size: { width: 50, height: 50 }
            },
            <Bar>{
                type: 'node:bar',
                id: 'node02',
                myProp2: 1234,
                size: { width: 50, height: 50 }
            },
            <SEdge>{
                type: 'edge',
                id: 'edge01',
                sourceId: 'node01',
                targetId: 'node02'
            }
        ]
    };
}

export namespace Generator {
    export interface Context {
        options: Options
    }
    export interface Options {
        sourceUri: string
        diagramType: string
    }
}
