import {InitParameterObject, completeInitParameterObject} from "./InitParameterObject";
import {updateConfigurationFile} from "./BasicParameters";
import * as downloadTemplate from "./downloadTemplate";
import * as copyTemplate from "./copyTemplate";
import { showTemplateMessage } from "./showTemplateMessage";

export function promiseInit(param: InitParameterObject): Promise<void> {
	return Promise.resolve<void>(undefined)
		.then(() => completeInitParameterObject(param))
		.then(() => downloadTemplate.downloadTemplateIfNeeded(param))
		.then(() => copyTemplate.copyTemplate(param))
		.then(confPath => updateConfigurationFile(confPath, param.logger))
		.then(() => showTemplateMessage(param))
		.then(() => param.logger.info("Done!"));
}

export function init(param: InitParameterObject, cb: (err?: any) => void): void {
	promiseInit(param).then<void>(cb, cb);
}
