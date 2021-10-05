/******************************************************************************
 * Copyright 2021 TypeFox GmbH and others
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

/** @jsx svg */
import { svg } from 'snabbdom-jsx';

import { VNode } from 'snabbdom/vnode';
import { injectable } from 'inversify';
import { Point, PolylineEdgeView, RenderingContext, SEdge, ShapeView, SNode, toDegrees } from 'sprotty';

export interface Foo {
    myProp1: string
}

@injectable()
export class FooView extends ShapeView {
    render(node: Readonly<SNode & Foo>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }
        return <g>
            <rect class-sprotty-node={true}
                  class-mouseover={node.hoverFeedback}
                  class-selected={node.selected}
                  x='0' y='0'
                  width={Math.max(node.size.width, 0)}
                  height={Math.max(node.size.height, 0)} />
            {context.renderChildren(node)}
        </g>;
    }
}

export interface Bar {
    myProp2: number
}

@injectable()
export class BarView extends ShapeView {
    render(node: Readonly<SNode & Bar>, context: RenderingContext): VNode | undefined {
        if (!this.isVisible(node, context)) {
            return undefined;
        }
        const radius = this.getRadius(node);
        return <g>
            <circle class-sprotty-node={true}
                    class-mouseover={node.hoverFeedback}
                    class-selected={node.selected}
                    r={radius} cx={radius} cy={radius} />
            {context.renderChildren(node)}
        </g>;
    }

    protected getRadius(node: SNode): number {
        const d = Math.min(node.size.width, node.size.height);
        return d > 0 ? d / 2 : 0;
    }
}

@injectable()
export class PolylineArrowEdgeView extends PolylineEdgeView {

    protected renderAdditionals(edge: SEdge, segments: Point[], context: RenderingContext): VNode[] {
        const p1 = segments[segments.length - 2];
        const p2 = segments[segments.length - 1];
        return [
            <path class-sprotty-edge-arrow={true} d='M 6,-3 L 0,0 L 6,3 Z'
                  transform={`rotate(${this.angle(p2, p1)} ${p2.x} ${p2.y}) translate(${p2.x} ${p2.y})`}/>
        ];
    }

    private angle(x0: Point, x1: Point): number {
        return toDegrees(Math.atan2(x1.y - x0.y, x1.x - x0.x));
    }
}
