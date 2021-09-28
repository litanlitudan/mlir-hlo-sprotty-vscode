import 'reflect-metadata';
import 'sprotty/css/sprotty.css';
import 'sprotty-vscode-webview/css/sprotty-vscode.css';
import './diagram.css';

import { Container, ContainerModule } from 'inversify';
import { SprottyDiagramIdentifier, SprottyStarter } from 'sprotty-vscode-webview';
import {
    configureModelElement, ConsoleLogger, editFeature, loadDefaultModules, LogLevel, moveFeature,
    overrideViewerOptions, SEdge, SGraph, SGraphView, SNode, TYPES
} from 'sprotty';
import { BarView, FooView, PolylineArrowEdgeView } from './views';

export class MlirSprottyStarter extends SprottyStarter {

    createContainer(diagramIdentifier: SprottyDiagramIdentifier): Container {
        return createDiagramContainer(diagramIdentifier.clientId);
    }

}

const mlirDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);

    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, 'graph', SGraph, SGraphView);
    configureModelElement(context, 'node:foo', SNode, FooView, {
        disable: [moveFeature]
    });
    configureModelElement(context, 'node:bar', SNode, BarView, {
        disable: [moveFeature]
    });
    configureModelElement(context, 'edge', SEdge, PolylineArrowEdgeView, {
        disable: [editFeature]
    });
});

function createDiagramContainer(clientId: string): Container {
    const container = new Container();
    loadDefaultModules(container);
    container.load(mlirDiagramModule);
    overrideViewerOptions(container, {
        needsClientLayout: true,
        needsServerLayout: true,
        baseDiv: clientId,
        hiddenDiv: clientId + '_hidden'
    });
    return container;
}

// Initiate the diagram by creating an instance of the starter class
new MlirSprottyStarter();
