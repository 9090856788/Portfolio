import React, { useState } from "react";
import { AppBar, Toolbar, Box, Avatar, IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';

const Navbar = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [avatar, setAvatar] = useState(""); // Default placeholder image

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setAvatar(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position="static" sx={{ bgcolor: '#e0e0e0', boxShadow: '7px 7px 15px #bebebe, -7px -7px 15px #ffffff', padding: '0.5rem 1rem' }}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                alt="User Avatar"
                                src={avatar}
                                sx={{
                                    width: 60,
                                    height: 60,
                                    bgcolor: '#e0e0e0',
                                    boxShadow: '7px 7px 15px #bebebe, -7px -7px 15px #ffffff',
                                    cursor: 'pointer',
                                }}
                                onClick={() => document.getElementById('avatarInput').click()}
                            />
                            <input
                                type="file"
                                id="avatarInput"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAvatarChange}
                            />
                        </Box>
                        <IconButton
                            onClick={toggleDarkMode}
                            sx={{
                                width: 60,
                                height: 60,
                                bgcolor: '#e0e0e0',
                                boxShadow: '7px 7px 15px #bebebe, -7px -7px 15px #ffffff',
                                borderRadius: '50%',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    boxShadow: 'inset 7px 7px 15px #bebebe, inset -7px -7px 15px #ffffff',
                                },
                            }}
                        >
                            {darkMode ? <Brightness7 sx={{ color: '#333' }} /> : <Brightness4 sx={{ color: '#333' }} />}
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        </>
    )
}

export default Navbar;