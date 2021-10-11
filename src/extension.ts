/******************************************************************************
 * Copyright 2021 TypeFox GmbH and others
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

 import 'reflect-metadata';
import * as vscode from 'vscode';
import { Container } from 'inversify';
import { TYPES } from 'sprotty/lib/base/types';
import { SprottyDiagramIdentifier, SprottyVscodeExtension, SprottyWebview, SprottyWebviewOptions } from 'sprotty-vscode';
import { elkLayoutModule, ElkFactory, ILayoutConfigurator } from 'sprotty-elk';
import ElkConstructor from 'elkjs/lib/elk.bundled';
import { Action } from './sprotty-node/actions';
import { DiagramServer, DiagramServices } from './sprotty-node/diagram-server';
import { MlirLayoutConfig } from './layout-config';

let extension: SprottyVscodeExtension | undefined;

/** Function called by vscode when the extension is activated */
export function activate(context: vscode.ExtensionContext) {
	const container = createExtensionContainer();
    extension = new MlirVscodeExtension(context, container);
}

/** Function called by vscode when the extension is deactivated */
export function deactivate(): Thenable<void> {
    if (extension) {
    	extension = undefined;
	}
	return Promise.resolve();
}

/** Sprotty integration that manages webviews to display diagrams */
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

/** MLIR diagram webview connecting the actions stream with the DiagramServer */
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
	container.rebind(ILayoutConfigurator).to(MlirLayoutConfig);
	container.bind(ElkFactory).toConstantValue(() => new ElkConstructor({
        algorithms: ['layered']
    }));
	return container;
}
