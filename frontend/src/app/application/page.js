import SideMenu from "@/shared/nav";
import { Button } from "@mui/material";
const Applications = () => {
    // @ Init User, Save info to redux, redirect to Start New Application / View Submitted Application automatically
    return (
        <div style={{display: "flex"}}>
            <SideMenu username="Kyrios"/>
            <div><Button>Start New Application</Button>
                <Button>View Submitted Application</Button></div>
        </div>
    )
}
export default Applications;