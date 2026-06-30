import { ThemeProvider } from "./context/ThemeContext";
import { PageProvider } from "./context/PageContext";
import SuggestIQWidget from "./SuggestIQWidget";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  return (
    <ThemeProvider>
      <PageProvider>
        <SuggestIQWidget />
      </PageProvider>
    </ThemeProvider>
  );
}

export default App;
