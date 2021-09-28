import { injectable } from 'inversify';
import { LayoutOptions } from 'elkjs';
import { DefaultLayoutConfigurator } from 'sprotty-elk';
import { SModelIndex } from 'sprotty/lib/base/model/smodel';
import { SGraph, SModelElement } from './sprotty-node/model';

/**
 * See https://www.eclipse.org/elk/reference.html
 */
@injectable()
export class MlirLayoutConfig extends DefaultLayoutConfigurator {

    protected graphOptions(sgraph: SGraph, index: SModelIndex<SModelElement>): LayoutOptions | undefined {
        return {
            'org.eclipse.elk.algorithm': 'org.eclipse.elk.layered',
            'org.eclipse.elk.direction': 'DOWN',
            'org.eclipse.elk.layered.spacing.baseValue': '40.0'
        };
    }

}
