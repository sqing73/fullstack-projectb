import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import WorkAuthDetail from "./WorkAuthDetail";
import { useSelector, useDispatch } from "react-redux";
import { fetchProfiles, profileActions } from "@/store/reducers/profile";
import PreviewFile from "@/components/PreviewFile";

const AllProfiles = () => {
  const profiles = useSelector((state) => state.profile.profiles);
  const status = useSelector((state) => state.profile.status);
  const dispatch = useDispatch();

  const [fetched, setFetched] = React.useState(false);
  const [searchedProfiles, setSearchedProfiles] = React.useState(profiles);

  const nameToProfileOptions = React.useMemo(() => {
    const res = [];
    profiles.forEach((profile) => {
      let searchName = `${profile.fullname}${
        profile.name?.preferred ? `, ${profile.name.preferred}` : ""
      }`;
      res.push(searchName);
    });
    return res;
  }, [profiles]);

  React.useEffect(() => {
    if (!fetched && profiles.length === 0) {
      dispatch(fetchProfiles()).then((data) =>
        setSearchedProfiles(data.payload)
      );
    }
    return () => setFetched(true);
  }, [fetched, profiles]);

  const handleSearchInputDone = (e) => {
    if (e.key === "Enter") {
      const transformedInput = e.target.value.toLowerCase();
      const searchResult = profiles.filter((profile) => {
        const transformedFullName = profile.fullname.toLowerCase();
        const transformedPrefered = profile.name.preferred
          ? profile.name.preferred.toLowerCase()
          : null;
        return (
          transformedFullName.includes(transformedInput) ||
          transformedInput.includes(transformedFullName) ||
          transformedPrefered.includes(transformedInput) ||
          transformedInput.includes(transformedPrefered)
        );
      });
      setSearchedProfiles(() => searchResult);
    }
  };

  return (
    <>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={nameToProfileOptions}
        sx={{ width: 300, mb: 3 }}
        renderInput={(params) => (
          <TextField
            {...params}
            onKeyDown={handleSearchInputDone}
            label="name"
          />
        )}
      />
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="visa status table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Work Authorization</TableCell>
              <TableCell align="right">Next Step</TableCell>
              <TableCell align="right">OPT Receipt</TableCell>
              <TableCell align="right">OPT EAD</TableCell>
              <TableCell align="right">I-983</TableCell>
              <TableCell align="right">I-20</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchedProfiles.map((profile) => (
              <TableRow
                key={profile._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {profile.fullname}
                </TableCell>
                <TableCell align="right">
                  {profile.residencyStatus?.isPermanentResidentOrCitizen &&
                    profile.residencyStatus.status}
                  {profile.residencyStatus &&
                    !profile.residencyStatus.isPermanentResidentOrCitizen && (
                      <WorkAuthDetail
                        workAuthorizaton={profile.workAuthorization}
                      />
                    )}
                </TableCell>
                <TableCell align="right">{profile.visaCurrStep}</TableCell>
                <TableCell align="right">
                  {profile.visaStatus?.OPTreceipt ? (
                    <PreviewFile
                      file={profile.visaStatus.OPTreceipt.step.file}
                      hrPreview={true}
                    >
                      {profile.visaStatus.OPTreceipt.step.status}
                    </PreviewFile>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell align="right">
                  {profile.visaStatus?.OPTead ? (
                    <PreviewFile
                      file={profile.visaStatus.OPTead.step.file}
                      hrPreview={true}
                    >
                      {profile.visaStatus.OPTead.step.status}
                    </PreviewFile>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell align="right">
                  {profile.visaStatus?.I983 ? (
                    <PreviewFile
                      file={profile.visaStatus.I983.step.file}
                      hrPreview={true}
                    >
                      {profile.visaStatus.I983.step.status}
                    </PreviewFile>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell align="right">
                  {profile.visaStatus?.I20 ? (
                    <PreviewFile
                      file={profile.visaStatus.I20.step.file}
                      hrPreview={true}
                    >
                      {profile.visaStatus.I20.step.status}
                    </PreviewFile>
                  ) : (
                    "N/A"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {status !== "idle" && <Typography>Loading...</Typography>}
      {fetched && status === "idle" && searchedProfiles.length === 0 && (
        <Typography>No profiles found</Typography>
      )}
    </>
  );
};

export default AllProfiles;
