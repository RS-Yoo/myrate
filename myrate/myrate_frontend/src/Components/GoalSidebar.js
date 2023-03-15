import { ProSidebarProvider } from 'react-pro-sidebar';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import GoalPopUp from './GoalPopUp';

const GoalSideBar = () => {
    return (
        <>
            <ProSidebarProvider rtl={true}>
                <Sidebar>
                    <Menu>
                        <SubMenu label="Yearly Goals">
                            <MenuItem>Goal 1</MenuItem>
                            <MenuItem>Goal 2</MenuItem>
                            <MenuItem>Goal 3</MenuItem>
                        </SubMenu>
                        <SubMenu label="Monthly Goals">
                            <MenuItem>Goal 1</MenuItem>
                            <MenuItem>Goal 2</MenuItem>
                            <MenuItem>Goal 3</MenuItem>
                        </SubMenu>
                        <SubMenu label="Daily Goals">
                            <MenuItem>Goal 1</MenuItem>
                            <MenuItem>Goal 2</MenuItem>
                            <MenuItem>Goal 3</MenuItem>
                        </SubMenu>
                        <MenuItem>
                                <GoalPopUp/>
                            </MenuItem>
                    </Menu>
                </Sidebar>
            </ProSidebarProvider>
        </>
    )
}

export default GoalSideBar;