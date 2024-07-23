import "../styles/globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../lib/fontawesome";
import Head from "next/head";
import { Provider } from "react-redux";
import store from "../store/store"; // Importez le store configuré

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Next.js App</title>
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
