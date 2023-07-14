import { bar } from "@websaam/bar";

export const foo = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(bar);
    }, 1000);
  });
};

console.log("foo");
