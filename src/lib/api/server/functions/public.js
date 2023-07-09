export function fnPublicDemo(
  /** @type {any} */ req,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: import("sequelize").Model<any, any>[]): void; new (): any; }; }; }} */ res
) {
  try {
    // @ts-ignore
    res.status(200).json({ function: "Demo function" });
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ error: error.message });
  }
}
