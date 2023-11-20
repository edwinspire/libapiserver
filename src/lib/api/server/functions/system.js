import { login } from "../../db/user.js";
import { getAPIToken } from '../../db/api_user.js';

export function fnDemo(
  /** @type {any} */ req,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} */ res
) {
  try {
    // @ts-ignore
    res.status(200).json({ demo: "demo" });
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ error: error.message });
  }
}


/**
 * @param {{ body: { username: string; password: string; }; }} req
 * @param {{ set: (arg0: string, arg1: any) => void; status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} res
 */
export async function fnLogin(req, res) {
  try {
    let user = await login(req.body.username, req.body.password);

    res.set('user-token', user.token);

    if (user.login) {
      res.status(200).json(user);
    } else {
      res.status(401).json(user);
    }
  } catch (error) {
    console.log(error);
    // @ts-ignore
    res.status(500).json({ error: error.message });
  }
};


/**
 * @param {{ body: { appname: string; username: string; password: string; }; }} req
 * @param {{ set: (arg0: string, arg1: string) => void; status: (arg0: number) => { (): any; new (): any; json: { (arg0: { token?: string; error?: any; }): void; new (): any; }; }; }} res
 */
export async function fnToken(req, res) {
  try {

    if (req.body.appname && req.body.username && req.body.password) {
      let token = await getAPIToken(req.body.appname, req.body.username, req.body.password);

      if (token) {
        res.set('api-token', token);
        res.status(200).json({ token });
      } else {
        res.status(401).json({});
      }
    } else {
      res.status(401).json({ error: 'Parameters are missing' });
    }

  } catch (error) {
    console.log(error);
    // @ts-ignore
    res.status(500).json({ error: error.message });
  }
};
