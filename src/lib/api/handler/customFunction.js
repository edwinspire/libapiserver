// @ts-ignore

export const customFunction = (
	/** @type {{ method?: any; headers: any; body: any; query: any; }} */ $_REQUEST_,
	/** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ response,
	/** @type {{ handler?: string; code: any; jsFn?: any }} */ method,
	/** @type {{ [x: string]: ((arg0: { method?: any; headers: any; body: any; query: any; }, arg1: { status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }) => void) | ((arg0: { method?: any; headers: any; body: any; query: any; }, arg1: { status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }, arg2: {}) => void); }} */ appFunctions
) => {
	try {
		if (appFunctions && appFunctions[method.code]) {
			let $_DATA = $_REQUEST_.body;

			if (JSON.stringify($_REQUEST_.body) == JSON.stringify({})) {
				$_DATA = $_REQUEST_.query;
			}

			appFunctions[method.code]($_REQUEST_, response, $_DATA);
		} else {
			response.status(404).json({ error: `Function ${method.code} not found.` });
		}
	} catch (error) {
		console.trace(error, appFunctions, method);
		// @ts-ignore
		response.status(500).json(error);
	}
};
