
export default (
  /** @type {{ params: any; body: import("sequelize").Optional<any, string>; }} */ req,
  /** @type {{ status: (arg0: number) => { (): any; new (): any; json: { (arg0: { error: any; }): void; new (): any; }; }; }} */ res
) => {
  try {
    // @ts-ignore
    res.status(200).json({now: Date.now()});
  } catch (error) {
    console.trace(error);
    // @ts-ignore
    res.status(500).json({ error: error.message });
  }
}
