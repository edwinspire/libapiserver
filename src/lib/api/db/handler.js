import { Handler } from "./models.js";

export const getAllHandlers = async () => {
  try {
    //const apps = await Application.findAll({ attributes: ["idapp", "app"] });
    const datas = await Handler.findAll();
    return datas;
  } catch (error) {
    console.error("Error retrieving:", error);
    throw error;
  }
};

export const defaultHandlers = () => {
  try {
    console.log(" defaultHandlers >>>>>> ");

    let handlers = [
      { id: "FETCH", text: `FETCH`, description:  'Make fetch requests. It works like a proxy.'},
      { id: "JS", text: `JS`, description:  'Run basic Javascript code.' },
      { id: "SOAP", text: `SOAP`, description:  'Useful for consuming SOAP services.' },
      { id: "SQL", text: `SQL`, description:  'Make SQL queries to different databases.' },
      { id: "FUNCTION", text: `FUNCTION`, description:  'Calls custom functions written on the server.' },
      { id: "NA", text: `NOAPPLY`, description:  'Not apply' }
    ];

    handlers.forEach(async (h) => {
      try {
        await Handler.upsert({
          handler: h.id,
          label: h.text,
          description: h.description,
        });
      } catch (error) {
        console.log(error);
      }
    });
    return;
  } catch (error) {
    console.error("Example error:", error);
    return;
  }
};
