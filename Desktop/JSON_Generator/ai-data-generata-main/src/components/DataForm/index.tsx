import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Settings from "../Settings";
import InterfaceChips from "../InterfaceChips";
import useStore from "../../hooks/useStore";

export default function DataForm() {
  const fetcher = useStore((state) => state.fetcher);
  const loading = useStore((state) => state.loading);
  return (
    <Stack sx={{ p: 2 }}>
      <Paper
        elevation={3}
        sx={{ p: 4, mt: 4, maxWidth: { sm: "600px" }, borderRadius: "25px" }}
      >
        <Typography variant="overline" component="h1" textAlign="right">
          Hierarchy JSON generator
        </Typography>
        <Stack
          component="form"
          direction="row"
          spacing={2}
          alignItems="center"
          onSubmit={(event) => {
            event.preventDefault();
            if (!loading) {
              const formData = new FormData(event.target as HTMLFormElement);
              const data = Object.fromEntries(formData);
              fetcher(data as { dataOf: string });
            }
          }}
        >
          <FormControl sx={{ minWidth: 350}}>
            <TextField
              id="dataOf"
              label="Use case names:"
              name="dataOf"
              variant="outlined"
              defaultValue="show debit card fund transfer limit"
      
              multiline // Enable multiline for a taller TextField
              rows={6} // Set the number of rows (adjust as needed)
            />
          </FormControl>
          <Button variant="contained" type="submit" disabled={loading}>
            Create JSON {"{..}"}
          </Button>
        </Stack>

        <InterfaceChips />
        <Settings />
      </Paper>
    </Stack>
  );
}
