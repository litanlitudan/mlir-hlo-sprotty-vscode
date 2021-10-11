/******************************************************************************
 * Copyright 2021 TypeFox GmbH and others
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

 export interface Point {
    readonly x: number
    readonly y: number
}

export interface Dimension {
    readonly width: number
    readonly height: number
}

export interface Bounds extends Point, Dimension {
}

export interface BoundsAware {
    position: Point;
    size: Dimension;
}

export interface Alignable {
    alignment: Point;
}
