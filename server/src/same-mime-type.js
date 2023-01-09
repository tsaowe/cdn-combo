import path from "path";

export const sameMimeType = (list = []) => {
  switch (list.length) {
    case 0:
    case 1:
      return true;
    case 2:
    default:
      return (
        new Set(
          list.map((item) => {
            const { ext } = path.parse(item);
            return ext;
          })
        ).size === 1
      );
  }
};
