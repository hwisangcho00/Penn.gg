import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material'
import { indigo, amber } from '@mui/material/colors'
import { createTheme } from "@mui/material/styles";

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import AlbumsPage from './pages/AlbumsPage';
import SongsPage from './pages/SongsPage';
import AlbumInfoPage from './pages/AlbumInfoPage'
import CompsPage from './pages/CompsPage'
import StatsPage from "./pages/StatsPage";
import ItemsPage from "./pages/ItemsPage";
import ChampItemRecsPage from "./pages/ChampItemRecsPage";
import ItemWinRatesPage from "./pages/ItemWinRatesPage";
import RangedChampPage from "./pages/RangedChampPage";

// createTheme enables you to customize the look and feel of your app past the default
// in this case, we only change the color scheme
export const theme = createTheme({
  palette: {
    primary: indigo,
    secondary: amber,
  },
});

// App is the root component of our application and as children contain all our pages
// We use React Router's BrowserRouter and Routes components to define the pages for
// our application, with each Route component representing a page and the common
// NavBar component allowing us to navigate between pages (with hyperlinks)
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comps" element={<CompsPage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/albums/:album_id" element={<AlbumInfoPage />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/champItemRecs" element={<ChampItemRecsPage />} />
          <Route path="/itemWinRates" element={<ItemWinRatesPage/>} />
          <Route path="/rangedChamp" element={<RangedChampPage/>} />
          
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}