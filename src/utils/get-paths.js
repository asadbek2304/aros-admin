export const getPaths = ({ id, children }) => {
  return children?.length > 0
    ? children.flatMap((it) =>
        getPaths(it).map((path) => (id != null ? `${id}.${path}` : path))
      )
    : [id];
};
