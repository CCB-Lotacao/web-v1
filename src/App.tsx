import AppRoutes from "./routes";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <>
      {}
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <AppRoutes />
      </SnackbarProvider>
      {} {}
    </>
  );
}

export default App;
