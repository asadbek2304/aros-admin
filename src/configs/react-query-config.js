import { QueryClient } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (e) => {
        // eslint-disable-next-line
        // @ts-expect-error
        // toast.error(e.detail);
      },
    },
  },
});

export default queryClient;
