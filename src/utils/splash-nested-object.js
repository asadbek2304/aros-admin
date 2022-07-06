export default function renderObject(object) {
  // eslint-disable-next-line
  let flattenData = [];
  // eslint-disable-next-line
  for (let i = 0; i < object?.length; i++) {
    flattenData.push(object[i]);
    flattenData.push(...renderObject(object[i].children));
  }
  return flattenData;
}
