// @ts-ignore

export const customFunction = async (
	/** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
	/** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
	/** @type {{ handler?: string; code: any; jsFn?: any }} */ method,
	/** @type {{ [x: string]: ((arg0: { method?: any; headers: any; body: any; query: any; }, arg1: { status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }) => void) | ((arg0: { method?: any; headers: any; body: any; query: any; }, arg1: { status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }, arg2: any) => any); }} */ appFunctions
) => {
	try {
		if (appFunctions && appFunctions[method.code]) {
			let $_DATA = $_REQUEST_.body;

			if (JSON.stringify($_REQUEST_.body) == JSON.stringify({})) {
				$_DATA = $_REQUEST_.query;
			}

			let fnresult = await appFunctions[method.code]($_REQUEST_, response, $_DATA);

			if (fnresult) {
				// @ts-ignore
				if (response.locals.lastResponse && response.locals.lastResponse.hash_request) {
					// @ts-ignore
					response.locals.lastResponse.data = fnresult.data;
				}
				// @ts-ignore
				response.status(fnresult.status).json(fnresult.data);
			} else {
				response.status(500).json({ error: `Function ${method.code} not return data.` });
			}
		} else {
			response.status(404).json({ error: `Function ${method.code} not found.` });
		}
	} catch (error) {
		console.trace(error);
		// @ts-ignore
		response.status(500).json(error);
	}
};
