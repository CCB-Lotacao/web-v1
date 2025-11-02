import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Tooltip,
  Typography,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "@service/auth";
import { UserDTO } from "@dtos/user";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import AddIcon from "@mui/icons-material/Add";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import PersonIcon from "@mui/icons-material/Person";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { UserRole } from "axios/types/axios";

const drawerWidthCollapsed = 80;
const drawerWidthExpanded = 260;

interface SubMenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

interface MenuItemType {
  text: string;
  icon: React.ReactNode;
  path: string;
  hasSubmenu: boolean;
  submenuItems?: SubMenuItem[];
}

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user] = useState<UserDTO | null>(() => AuthService.getCurrentUser());
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openUserMenu = Boolean(anchorEl);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const getInitials = (name: string): string => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getUserRole =
    user?.role === UserRole.ASSISTANT || user?.role === UserRole.SYSTEM_ADMIN;

  const menuItems: MenuItemType[] = [
    {
      text: "Lotações",
      icon: <HomeIcon />,
      path: "/home",
      hasSubmenu: false,
    },
    {
      text: "Igrejas",
      icon: <LocationCityIcon />,
      path: "/church",
      hasSubmenu: false,
    },
    ...(getUserRole
      ? [
          {
            text: "Cadastrar",
            icon: <AddIcon />,
            path: "#",
            hasSubmenu: true,
            submenuItems: [
              {
                text: "Veículo",
                icon: <DriveEtaIcon />,
                path: "/cadastrar/veiculo",
              },
              {
                text: "Usuário",
                icon: <PersonIcon />,
                path: "/cadastrar/usuario",
              },
              {
                text: "Comuns",
                icon: <LocationCityIcon />,
                path: "/cadastrar/common",
              },
            ],
          },
        ]
      : []),
  ];

  const handleLogout = () => {
    AuthService.logout();
  };

  const handleMenuClick = (item: MenuItemType) => {
    if (item.hasSubmenu) {
      if (!isExpanded) setIsExpanded(true);
      setOpenMenu(openMenu === item.text ? null : item.text);
    } else {
      navigate(item.path);
      setOpenMenu(null);
    }
  };

  const isSubmenuItemActive = (item: MenuItemType): boolean => {
    if (!item.submenuItems) return false;
    return item.submenuItems.some(
      (subItem) => location.pathname === subItem.path
    );
  };

  return (
    <Drawer
      variant="permanent"
      open={true}
      sx={{
        width: isExpanded ? drawerWidthExpanded : drawerWidthCollapsed,
        flexShrink: 0,
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
          width: isExpanded ? drawerWidthExpanded : drawerWidthCollapsed,
          boxSizing: "border-box",
          backgroundColor: "white",
          borderRight: "1px solid rgba(0, 0, 0, 0.08)",
          transition: "width 0.3s ease",
          overflow: "hidden",
        },
      }}
    >
      {}
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80px !important",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: isExpanded ? 56 : 48,
            height: isExpanded ? 56 : 48,
            borderRadius: "12px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            transition: "width 0.3s ease, height 0.3s ease",
          }}
        >
          <img
            src="/images/favicon.png"
            alt="CCB Logo"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>
        {isExpanded && (
          <IconButton
            onClick={() => setIsExpanded(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64B6F7",
              "&:hover": { backgroundColor: "rgba(100, 182, 247, 0.1)" },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>

      {}
      <Box sx={{ flexGrow: 1, mt: 1 }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isSubmenuActive = isSubmenuItemActive(item);
            const isSubmenuOpen = openMenu === item.text;
            const itemIsActive = isActive || isSubmenuActive;

            return (
              <Box key={item.text}>
                <ListItem
                  disablePadding
                  sx={{ mb: 0.5, justifyContent: "center" }}
                >
                  <Tooltip
                    title={item.text}
                    placement="right"
                    arrow
                    disableHoverListener={isExpanded}
                    componentsProps={{
                      tooltip: {
                        sx: {
                          bgcolor: "#64B6F7",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          "& .MuiTooltip-arrow": { color: "#64B6F7" },
                        },
                      },
                    }}
                  >
                    <ListItemButton
                      onClick={() => handleMenuClick(item)}
                      sx={{
                        mx: isExpanded ? 1.5 : 0,
                        borderRadius: 2,
                        justifyContent: isExpanded ? "flex-start" : "center",
                        minWidth: drawerWidthCollapsed,
                        width: "100%",
                        "&:hover": {
                          backgroundColor: "rgba(100, 182, 247, 0.1)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: itemIsActive
                            ? "#64B6F7"
                            : "rgba(0, 0, 0, 0.6)",
                          minWidth: 0,
                          display: "flex",
                          justifyContent: "center",
                          width: drawerWidthCollapsed - 30,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>

                      {isExpanded && (
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            fontWeight: itemIsActive ? 600 : 500,
                            color: "#212121",
                          }}
                          sx={{ ml: 1 }}
                        />
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>

                {}
                {item.hasSubmenu && (
                  <Collapse
                    in={isSubmenuOpen && isExpanded}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {item.submenuItems?.map((subItem) => {
                        const isSubItemActive =
                          location.pathname === subItem.path;
                        return (
                          <ListItemButton
                            key={subItem.text}
                            onClick={() => navigate(subItem.path)}
                            sx={{
                              pl: 6,
                              pr: 2,
                              py: 1,
                              mx: 1.5,
                              borderRadius: 1.5,
                              "&:hover": {
                                backgroundColor: "rgba(100, 182, 247, 0.08)",
                              },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                color: isSubItemActive
                                  ? "#64B6F7"
                                  : "rgba(0, 0, 0, 0.6)",
                                minWidth: 36,
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={subItem.text}
                              primaryTypographyProps={{
                                fontSize: "0.875rem",
                                color: "#212121",
                                fontWeight: isSubItemActive ? 600 : 500,
                              }}
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </List>
      </Box>

      {}
      <Box
        sx={{
          p: isExpanded ? 2 : 1,
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Tooltip
          title={`${user?.name || "Usuário"} - ${
            user?.email || "email@exemplo.com"
          }`}
          placement="top"
          disableHoverListener={isExpanded}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              borderRadius: 2,
              p: 1.5,
              justifyContent: isExpanded ? "flex-start" : "center",
              width: isExpanded ? "100%" : "auto",
              "&:hover": { backgroundColor: "rgba(100, 182, 247, 0.1)" },
            }}
            onClick={handleOpenUserMenu}
          >
            <Avatar
              sx={{
                bgcolor: "#64B6F7",
                width: 44,
                height: 44,
                mr: isExpanded ? 2 : 0,
                fontWeight: 600,
                transition: "all 0.3s ease",
              }}
            >
              {user ? getInitials(user.name) : "U"}
            </Avatar>

            {isExpanded && (
              <Box sx={{ overflow: "hidden" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "#212121",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.name || "Usuário"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#757575",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                  }}
                >
                  {user?.email || "email@exemplo.com"}
                </Typography>
              </Box>
            )}
          </Box>
        </Tooltip>

        {}
        <Menu
          anchorEl={anchorEl}
          open={openUserMenu}
          onClose={handleCloseUserMenu}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: -1,
              borderRadius: 2,
              minWidth: 180,
              bgcolor: "white",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleCloseUserMenu();
              navigate("/user-profile");
            }}
          >
            Meus Dados
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleCloseUserMenu();
              handleLogout();
            }}
          >
            Sair
          </MenuItem>
        </Menu>
      </Box>
    </Drawer>
  );
}
