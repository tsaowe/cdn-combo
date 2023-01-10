import path from "path";
import fs from "fs";

export const getProjectFolder = () => {
  let current = path.resolve( ".");
  const stopSignalFileName = 'package.json';
  for(let i=0;i<10;i++){
    const children = fs.readdirSync(current);
    if(children.includes(stopSignalFileName)){
      return current;
    }
    current = path.resolve(current, '..');
  }
}


export const projectFolder = getProjectFolder();

export const comboFolder = path.resolve(getProjectFolder(), "combo");

export const projectServerFolder = path.resolve(projectFolder, "server");

if (!fs.existsSync(comboFolder)) {
  fs.mkdirSync(comboFolder, { recursive: true });
}

export const config = {
  comboFolder,
  projectFolder,
  projectServerFolder,
};
