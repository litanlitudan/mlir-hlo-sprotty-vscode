import * as vscode from 'vscode';
import { Container } from 'inversify';
import { TYPES } from 'sprotty/lib/base/types';
import { SprottyDiagramIdentifier, SprottyVscodeExtension, SprottyWebview, SprottyWebviewOptions } from 'sprotty-vscode';
import { elkLayoutModule, ElkFactory } from 'sprotty-elk';
import ElkConstructor from 'elkjs/lib/elk.bundled';
import { Action } from './sprotty-node/actions';
import { DiagramServer, DiagramServices } from './sprotty-node/diagram-server';

let extension: SprottyVscodeExtension | undefined;

export function activate(context: vscode.ExtensionContext) {
	const container = createExtensionContainer();
    extension = new MlirVscodeExtension(context, container);
}

export function deactivate(): Thenable<void> {
    if (extension) {
    	extension = undefined;
	}
	return Promise.resolve();
}

export class MlirVscodeExtension extends SprottyVscodeExtension {

	constructor(context: vscode.ExtensionContext, protected container: Container) {
        super('mlir', context);
    }
	
	protected getDiagramType(commandArgs: any[]): string | Promise<string | undefined> | undefined {
		if (commandArgs.length === 0
            || commandArgs[0] instanceof vscode.Uri && commandArgs[0].path.endsWith('.mlir')) {
            return 'mlir-diagram';
        }
	}

	protected createWebView(identifier: SprottyDiagramIdentifier): SprottyWebview {
		const webview = new MlirWebview({
            extension: this,
            identifier,
            localResourceRoots: [
                this.getExtensionFileUri('dist')
            ],
            scriptUri: this.getExtensionFileUri('dist', 'sprotty-webview.js')
        }, this.container);
        return webview;
	}

}

export class MlirWebview extends SprottyWebview {

	readonly server: DiagramServer;

	constructor(options: SprottyWebviewOptions, container: Container) {
		super(options);
		const messageCallback = <A extends Action>(action: A) => Promise.resolve(this.dispatch(action));
		const services: DiagramServices = {
			layoutEngine: container.get(TYPES.IModelLayoutEngine)
		};
		this.server = new DiagramServer(messageCallback, services);
	}

	async accept(action: Action): Promise<boolean> {
		// Action handlers can be used to process custom events without forwarding to the server
		const actionHandler = this.actionHandlers.get(action.kind);
        if (actionHandler) {
            return actionHandler.handleAction(action);
		}
		await this.server.accept(action);
		return true;
	}

}

export function createExtensionContainer(): Container {
	const container = new Container();
	container.load(elkLayoutModule);
	container.bind(ElkFactory).toConstantValue(() => new ElkConstructor({
        algorithms: ['layered']
    }));
	return container;
}
